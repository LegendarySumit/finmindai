import { NextRequest, NextResponse } from 'next/server';
import { isAddress, verifyMessage } from 'ethers';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs';

const NONCE_TTL_MS = 5 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const { address, signature } = await req.json();

    if (!address || !signature || !isAddress(address)) {
      return NextResponse.json({ message: 'Valid address and signature are required' }, { status: 400 });
    }

    const normalizedAddress = address.toLowerCase();
    const nonceRef = adminDb().collection('wallet_nonces').doc(normalizedAddress);
    const nonceSnap = await nonceRef.get();

    if (!nonceSnap.exists) {
      return NextResponse.json({ message: 'Nonce not found. Request a new challenge.' }, { status: 400 });
    }

    const nonceData = nonceSnap.data() as { nonce: string; createdAt: number };

    if (Date.now() - nonceData.createdAt > NONCE_TTL_MS) {
      await nonceRef.delete();
      return NextResponse.json({ message: 'Challenge expired. Please try again.' }, { status: 400 });
    }

    const message = [
      'Sign this message to authenticate with FinMindAI.',
      '',
      `Address: ${normalizedAddress}`,
      `Nonce: ${nonceData.nonce}`,
    ].join('\n');

    const recoveredAddress = verifyMessage(message, signature).toLowerCase();

    if (recoveredAddress !== normalizedAddress) {
      return NextResponse.json({ message: 'Signature verification failed' }, { status: 401 });
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

    return NextResponse.json({
      success: true,
      uid,
      customToken,
    });
  } catch (error) {
    console.error('Wallet verification error:', error);
    const detail = error instanceof Error ? error.message : 'Wallet verification failed';
    return NextResponse.json(
      {
        message: process.env.NODE_ENV === 'production' ? 'Wallet verification failed' : detail,
      },
      { status: 500 }
    );
  }
}
