import type { NextApiResponse } from "next";
import type { NextResponse } from "next/server";

/**
 * Security headers to add to all API responses
 */
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
};

type HeaderCompatibleResponse =
  | NextApiResponse
  | NextResponse
  | {
      headers?: Headers;
      setHeader?: (key: string, value: string) => void;
    };

function setHeaderCompat(res: HeaderCompatibleResponse, key: string, value: string): void {
  if ("setHeader" in res && typeof res.setHeader === "function") {
    res.setHeader(key, value);
    return;
  }

  if ("headers" in res && res.headers && typeof res.headers.set === "function") {
    res.headers.set(key, value);
  }
}

/**
 * Apply security headers to API response
 */
export function applySecurityHeaders<T extends HeaderCompatibleResponse>(res: T): T {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    setHeaderCompat(res, key, value);
  });
  return res;
}

/**
 * Send secure error response
 */
export function sendSecureError(
  res: NextApiResponse,
  statusCode: number,
  message: string,
  details?: Record<string, unknown>
): void {
  applySecurityHeaders(res);
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { details }),
  });
}

/**
 * Send secure success response
 */
export function sendSecureSuccess<T>(res: NextApiResponse, data: T, statusCode: number = 200): void {
  applySecurityHeaders(res);
  res.status(statusCode).json(data);
}

/**
 * CORS middleware for API routes
 * Combines with middleware.ts for complete protection
 */
export function applyCORSHeaders(
  res: NextApiResponse,
  origin: string = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
): NextApiResponse {
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "86400"); // 24 hours

  return res;
}
