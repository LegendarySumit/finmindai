import { NextResponse } from 'next/server';
import { applySecurityHeaders } from '@/lib/securityHeaders';

type SuccessPayload<T> = {
  success: true;
  message?: string;
  data: T;
  meta?: Record<string, unknown>;
  timestamp: string;
};

type ErrorPayload = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
};

export function successResponse<T>(
  data: T,
  options?: {
    status?: number;
    message?: string;
    headers?: HeadersInit;
    meta?: Record<string, unknown>;
  }
) {
  const payload: SuccessPayload<T> = {
    success: true,
    message: options?.message,
    data,
    meta: options?.meta,
    timestamp: new Date().toISOString(),
  };

  const response = NextResponse.json(payload, {
    status: options?.status ?? 200,
    headers: options?.headers,
  });

  return applySecurityHeaders(response);
}

export function errorResponse(
  code: string,
  message: string,
  options?: {
    status?: number;
    details?: unknown;
    headers?: HeadersInit;
  }
) {
  const payload: ErrorPayload = {
    success: false,
    error: {
      code,
      message,
      details: options?.details,
    },
    timestamp: new Date().toISOString(),
  };

  const response = NextResponse.json(payload, {
    status: options?.status ?? 400,
    headers: options?.headers,
  });

  return applySecurityHeaders(response);
}