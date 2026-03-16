import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  await req.json().catch(() => null);
  return NextResponse.json(
    {
      message:
        'This endpoint is deprecated. Use /api/auth/wallet-nonce and /api/auth/wallet-verify.',
    },
    { status: 410 }
  );
}
