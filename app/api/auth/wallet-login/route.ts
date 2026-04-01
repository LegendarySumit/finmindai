import { NextRequest } from 'next/server';
import { errorResponse } from '@/lib/apiResponse';

export async function POST(req: NextRequest) {
  await req.json().catch(() => null);
  return errorResponse(
    'DEPRECATED_ENDPOINT',
    'This endpoint is deprecated. Use /api/auth/wallet-nonce and /api/auth/wallet-verify.',
    { status: 410 }
  );
}
