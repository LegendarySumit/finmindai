import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  await req.json().catch(() => null);
  return NextResponse.json(
    {
      message:
        'This endpoint is deprecated. Use Firebase Auth client SDK for email login.',
    },
    { status: 410 }
  );
}
