import { NextRequest } from 'next/server';
import { isAddress, verifyMessage } from 'ethers';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
import { checkRateLimit, getClientIP, RATE_LIMITS } from '@/lib/rateLimit';
import { walletVerifySchema, validateRequest } from '@/lib/validation';
import { z } from 'zod';
import { errorResponse, successResponse } from '@/lib/apiResponse';

export const runtime = 'nodejs';

const NONCE_TTL_MS = 5 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    // Rate limit auth endpoint (prevent brute force)
    const limitKey = `verify:${getClientIP(req)}`;
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
    
    const address = body.address || body.walletAddress;
    const signature = body.signature;
    
    if (!address || !isAddress(address)) {
      return errorResponse('INVALID_ADDRESS', 'Valid wallet address is required', { status: 400 });
    }
    
    if (!signature || typeof signature !== 'string') {
      return errorResponse('INVALID_SIGNATURE', 'Valid signature is required', { status: 400 });
    }

    const normalizedAddress = address.toLowerCase();
    const nonceRef = adminDb().collection('wallet_nonces').doc(normalizedAddress);
    const nonceSnap = await nonceRef.get();

    if (!nonceSnap.exists) {
      return errorResponse('NONCE_NOT_FOUND', 'Nonce not found. Request a new challenge.', { status: 400 });
    }

    const nonceData = nonceSnap.data() as { nonce: string; createdAt: number };

    if (Date.now() - nonceData.createdAt > NONCE_TTL_MS) {
      await nonceRef.delete();
      return errorResponse('NONCE_EXPIRED', 'Challenge expired. Please try again.', { status: 400 });
    }

    const message = [
      'Sign this message to authenticate with FinMindAI.',
      '',
      `Address: ${normalizedAddress}`,
      `Nonce: ${nonceData.nonce}`,
    ].join('\n');

    const recoveredAddress = verifyMessage(message, signature).toLowerCase();

    if (recoveredAddress !== normalizedAddress) {
      return errorResponse('SIGNATURE_INVALID', 'Signature verification failed', { status: 401 });
    }

    const uid = `wallet_${normalizedAddress.slice(2)}`;

    try {
      await adminAuth().getUser(uid);
    } catch {
      await adminAuth().createUser({
        uid,
        displayName: `Wallet ${normalizedAddress.slice(2, 8)}`,
      });
    }

    await adminDb().collection('users').doc(uid).set(
      {
        uid,
        walletAddress: normalizedAddress,
        authType: 'wallet',
        updatedAt: Date.now(),
        createdAt: Date.now(),
      },
      { merge: true }
    );

    await nonceRef.delete();

    const customToken = await adminAuth().createCustomToken(uid, {
      authType: 'wallet',
      walletAddress: normalizedAddress,
    });

    return successResponse({ uid, customToken }, { message: 'Wallet verified successfully' });
  } catch (error) {
    console.error('Wallet verification error:', error);
    const detail = error instanceof Error ? error.message : 'Wallet verification failed';
    return errorResponse(
      'WALLET_VERIFY_FAILED',
      process.env.NODE_ENV === 'production' ? 'Wallet verification failed' : detail,
      { status: 500 }
    );
  }
}
