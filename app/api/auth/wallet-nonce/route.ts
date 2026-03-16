import { NextRequest, NextResponse } from 'next/server';
import { isAddress } from 'ethers';
import { randomUUID } from 'crypto';
import { adminDb } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();

    if (!address || !isAddress(address)) {
      return NextResponse.json({ message: 'Valid wallet address is required' }, { status: 400 });
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

    return NextResponse.json({
      success: true,
      message,
      nonce,
    });
  } catch (error) {
    console.error('Wallet nonce generation error:', error);
    const detail = error instanceof Error ? error.message : 'Failed to generate wallet nonce';
    return NextResponse.json(
      {
        message: process.env.NODE_ENV === 'production' ? 'Failed to generate wallet nonce' : detail,
      },
      { status: 500 }
    );
  }
}
