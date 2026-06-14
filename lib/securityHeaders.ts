import type { NextResponse } from "next/server";

/**
 * Security headers to add to all API responses
 */
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline'",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
};

type HeaderCompatibleResponse =
  | NextResponse
  | {
      headers?: Headers;
      setHeader?: (key: string, value: string) => void;
    };

function setHeaderCompat(
  res: HeaderCompatibleResponse,
  key: string,
  value: string,
): void {
  if ("setHeader" in res && typeof res.setHeader === "function") {
    res.setHeader(key, value);
    return;
  }

  if (
    "headers" in res &&
    res.headers &&
    typeof res.headers.set === "function"
  ) {
    res.headers.set(key, value);
  }
}

/**
 * Apply security headers to API response
 */
export function applySecurityHeaders<T extends HeaderCompatibleResponse>(
  res: T,
): T {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    setHeaderCompat(res, key, value);
  });
  return res;
}
