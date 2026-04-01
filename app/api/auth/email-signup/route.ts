import { NextRequest } from 'next/server';
import { z } from 'zod';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
import { validatePassword, evaluatePasswordStrength } from '@/lib/passwordValidation';
import { generateVerificationToken, sendVerificationEmail, storeVerificationToken } from '@/lib/emailVerification';
import { checkRateLimit, getClientIP, RATE_LIMITS } from '@/lib/rateLimit';
import { errorResponse, successResponse } from '@/lib/apiResponse';

const emailSignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(12, 'Password must be at least 12 characters long'),
  displayName: z.string().trim().min(2).max(80).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req);
    const limit = checkRateLimit(`email-signup:${ip}`, RATE_LIMITS.auth.maxRequests, RATE_LIMITS.auth.windowMs);
    if (!limit.allowed) {
      const retryAfter = Math.ceil((limit.resetTime - Date.now()) / 1000);
      return errorResponse('RATE_LIMITED', `Rate limit exceeded. Retry after ${retryAfter}s`, {
        status: 429,
        headers: { 'Retry-After': String(retryAfter) },
      });
    }

    const body = await req.json();
    const input = emailSignupSchema.parse(body);

    const passwordCheck = validatePassword(input.password);
    if (!passwordCheck.valid) {
      return errorResponse('WEAK_PASSWORD', passwordCheck.error || 'Password does not meet requirements', {
        status: 400,
      });
    }

    const strength = evaluatePasswordStrength(input.password);
    if (strength.score < 3) {
      return errorResponse('WEAK_PASSWORD', 'Password must be Good or Strong strength', {
        status: 400,
        details: { feedback: strength.feedback },
      });
    }

    try {
      await adminAuth().getUserByEmail(input.email);
      return errorResponse('EMAIL_EXISTS', 'An account with this email already exists', {
        status: 409,
      });
    } catch {
      // User does not exist yet.
    }

    const userRecord = await adminAuth().createUser({
      email: input.email,
      password: input.password,
      displayName: input.displayName,
      emailVerified: false,
    });

    await adminDb().collection('users').doc(userRecord.uid).set(
      {
        uid: userRecord.uid,
        email: input.email,
        displayName: input.displayName || null,
        authType: 'email',
        emailVerified: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      { merge: true }
    );

    const token = generateVerificationToken();
    await storeVerificationToken(input.email, token);
    await sendVerificationEmail(input.email, token, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');

    return successResponse(
      {
        uid: userRecord.uid,
        email: input.email,
        verificationRequired: true,
      },
      {
        status: 201,
        message: 'Account created. Verify your email before login.',
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse('VALIDATION_ERROR', 'Invalid signup payload', {
        status: 400,
        details: error.errors,
      });
    }

    const msg = error instanceof Error ? error.message : 'Signup failed';
    return errorResponse('SIGNUP_FAILED', process.env.NODE_ENV === 'production' ? 'Signup failed' : msg, {
      status: 500,
    });
  }
}
