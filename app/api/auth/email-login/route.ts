import { NextRequest } from 'next/server';
import { z } from 'zod';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
import { checkRateLimit, getClientIP, RATE_LIMITS } from '@/lib/rateLimit';
import { isEmailVerified } from '@/lib/emailVerification';
import { errorResponse, successResponse } from '@/lib/apiResponse';

const emailLoginSchema = z.object({
  idToken: z.string().min(20, 'idToken is required'),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req);
    const limit = checkRateLimit(`email-login:${ip}`, RATE_LIMITS.auth.maxRequests, RATE_LIMITS.auth.windowMs);
    if (!limit.allowed) {
      const retryAfter = Math.ceil((limit.resetTime - Date.now()) / 1000);
      return errorResponse('RATE_LIMITED', `Rate limit exceeded. Retry after ${retryAfter}s`, {
        status: 429,
        headers: { 'Retry-After': String(retryAfter) },
      });
    }

    const body = await req.json();
    const { idToken } = emailLoginSchema.parse(body);
    const decoded = await adminAuth().verifyIdToken(idToken, true);
    const user = await adminAuth().getUser(decoded.uid);

    if (!user.email) {
      return errorResponse('INVALID_ACCOUNT', 'Account is missing an email address', {
        status: 400,
      });
    }

    const appVerification = await isEmailVerified(user.email);
    if (!user.emailVerified || !appVerification) {
      return errorResponse('EMAIL_NOT_VERIFIED', 'Email verification is required before login', {
        status: 403,
      });
    }

    await adminDb().collection('users').doc(decoded.uid).set(
      {
        uid: decoded.uid,
        email: user.email,
        displayName: user.displayName || null,
        authType: 'email',
        emailVerified: true,
        lastLoginAt: Date.now(),
        updatedAt: Date.now(),
      },
      { merge: true }
    );

    return successResponse(
      {
        uid: decoded.uid,
        email: user.email,
        emailVerified: true,
      },
      {
        message: 'Login verified successfully',
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse('VALIDATION_ERROR', 'Invalid login payload', {
        status: 400,
        details: error.errors,
      });
    }

    const msg = error instanceof Error ? error.message : 'Login verification failed';
    return errorResponse(
      'LOGIN_FAILED',
      process.env.NODE_ENV === 'production' ? 'Login verification failed' : msg,
      { status: 401 }
    );
  }
}
