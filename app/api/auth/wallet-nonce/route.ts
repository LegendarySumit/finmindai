import { NextRequest } from 'next/server';
import { isAddress } from 'ethers';
import { randomUUID } from 'crypto';
import { adminDb } from '@/lib/firebaseAdmin';
import { checkRateLimit, getClientIP, RATE_LIMITS } from '@/lib/rateLimit';
import { walletNonceSchema, validateRequest } from '@/lib/validation';
import { z } from 'zod';
import { errorResponse, successResponse } from '@/lib/apiResponse';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // Rate limit auth endpoint (prevent brute force)
    const limitKey = `nonce:${getClientIP(req)}`;
    const limit = checkRateLimit(limitKey, RATE_LIMITS.auth.maxRequests, RATE_LIMITS.auth.windowMs);
    if (!limit.allowed) {
      const retryAfter = Math.ceil((limit.resetTime - Date.now()) / 1000);
      return errorResponse('RATE_LIMITED', `Rate limit exceeded. Retry after ${retryAfter}s`, {
        status: 429,
        headers: { 'Retry-After': String(retryAfter) },
      }
      );
    }

    // Validate request
    const body = await req.json();
    const validated = await validateRequest<z.infer<typeof walletNonceSchema>>(walletNonceSchema, {
      walletAddress: body.address || body.walletAddress,
    });
    const address = validated.walletAddress;

    if (!address || !isAddress(address)) {
      return errorResponse('INVALID_ADDRESS', 'Valid wallet address is required', { status: 400 });
    }

    const normalizedAddress = address.toLowerCase();
    const nonce = randomUUID();

    const message = [
      'Sign this message to authenticate with FinMindAI.',
      '',
      `Address: ${normalizedAddress}`,
      `Nonce: ${nonce}`,
    ].join('\n');

    await adminDb().collection('wallet_nonces').doc(normalizedAddress).set({
      nonce,
      createdAt: Date.now(),
    });

    return successResponse({ message, nonce }, { message: 'Nonce generated successfully' });
  } catch (error) {
    console.error('Wallet nonce generation error:', error);
    const detail = error instanceof Error ? error.message : 'Failed to generate wallet nonce';
    return errorResponse(
      'NONCE_GENERATION_FAILED',
      process.env.NODE_ENV === 'production' ? 'Failed to generate wallet nonce' : detail,
      { status: 500 }
    );
  }
}
