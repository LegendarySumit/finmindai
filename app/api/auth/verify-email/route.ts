import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  generateVerificationToken,
  storeVerificationToken,
  sendVerificationEmail,
  verifyEmailToken,
  isEmailVerified,
} from '@/lib/emailVerification';
import { checkRateLimit, getClientIP, RATE_LIMITS } from '@/lib/rateLimit';
import { log } from '@/lib/logger';
import { errorResponse, successResponse } from '@/lib/apiResponse';

// Schema for sending verification email
const sendVerificationSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Schema for verifying email token
const verifyEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
  token: z.string().min(32, 'Invalid token'),
});

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const body = await request.json();

    // Rate limit: 5 requests per minute per IP
    const limit = checkRateLimit(
      ip,
      RATE_LIMITS.auth.maxRequests,
      RATE_LIMITS.auth.windowMs
    );

    if (!limit.allowed) {
      log.warn('Email verification rate limit exceeded', { ip });
      return errorResponse('RATE_LIMITED', 'Rate limit exceeded. Please try again later.', { status: 429 });
    }

    const action = request.nextUrl.searchParams.get('action') || 'send';

    if (action === 'send') {
      // Validate input
      const validatedData = sendVerificationSchema.parse(body);

      // Check if already verified
      if (await isEmailVerified(validatedData.email)) {
        log.info('Email already verified', { email: validatedData.email });
        return successResponse({ email: validatedData.email, verified: true }, { message: 'Email is already verified' });
      }

      // Generate and store token
      const token = generateVerificationToken();
      await storeVerificationToken(validatedData.email, token);

      // Send verification email
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      await sendVerificationEmail(validatedData.email, token, appUrl);

      log.info('Verification email sent', { email: validatedData.email });

      return successResponse(
        {
          email: validatedData.email,
          verificationSent: true,
        },
        { message: 'Verification email sent. Please check your inbox.' }
      );
    } else if (action === 'verify') {
      // Validate input
      const validatedData = verifyEmailSchema.parse(body);

      // Verify token
      const isValid = await verifyEmailToken(
        validatedData.email,
        validatedData.token
      );

      if (!isValid) {
        log.warn('Email verification failed', { email: validatedData.email });
        return errorResponse('TOKEN_INVALID', 'Invalid or expired verification token', { status: 400 });
      }

      log.info('Email verified successfully', { email: validatedData.email });

      return successResponse(
        {
          email: validatedData.email,
          verified: true,
        },
        { message: 'Email verified successfully' }
      );
    } else if (action === 'check') {
      // Check verification status
      const validatedData = sendVerificationSchema.parse(body);
      const verified = await isEmailVerified(validatedData.email);

      return successResponse({ email: validatedData.email, verified }, { message: 'Verification status fetched' });
    } else {
      return errorResponse('INVALID_ACTION', 'Invalid action', { status: 400 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      log.warn('Email verification validation error', {
        errors: error.errors,
      });
      return errorResponse('VALIDATION_ERROR', 'Invalid request data', {
        status: 400,
        details: error.errors,
      });
    }

    log.error('Email verification error', error);
    return errorResponse('VERIFY_EMAIL_FAILED', 'Failed to process email verification', { status: 500 });
  }
}
