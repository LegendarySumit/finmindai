import type { NextRequest } from "next/server";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Simple in-memory rate limiter
 * For production, upgrade to Redis-based solution (Upstash, etc.)
 *
 * @param identifier - Unique key (IP, user ID, etc.)
 * @param maxRequests - Max requests allowed in time window
 * @param windowMs - Time window in milliseconds
 * @returns { allowed: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60 * 1000, // 1 minute default
): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now >= entry.resetTime) {
    // First request or window expired
    const resetTime = now + windowMs;
    rateLimitStore.set(identifier, { count: 1, resetTime });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime,
    };
  }

  if (entry.count < maxRequests) {
    entry.count++;
    return {
      allowed: true,
      remaining: maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  // Rate limit exceeded
  return {
    allowed: false,
    remaining: 0,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client IP from request
 */
type RequestLike =
  | NextRequest
  | {
      ip?: string | null;
      socket?: { remoteAddress?: string | null };
      headers?: Headers | Record<string, string | string[] | undefined>;
    };

export function getClientIP(req: RequestLike): string {
  const xffFromGetter =
    req.headers instanceof Headers ? req.headers.get("x-forwarded-for") : null;

  let xffFromIndex: string | undefined;
  if (req.headers && !(req.headers instanceof Headers)) {
    const raw = req.headers["x-forwarded-for"];
    if (typeof raw === "string") {
      xffFromIndex = raw;
    } else if (Array.isArray(raw) && typeof raw[0] === "string") {
      xffFromIndex = raw[0];
    }
  }

  const xff = xffFromIndex ?? xffFromGetter ?? undefined;

  if (xff) {
    return xff.split(",")[0]?.trim() || "unknown";
  }

  const directIp = "ip" in req ? req.ip : undefined;
  const socketIp = "socket" in req ? req.socket?.remoteAddress : undefined;
  return directIp || socketIp || "unknown";
}

/**
 * Standard rate limit config presets
 */
export const RATE_LIMITS = {
  // Strict: auth endpoints (5 per minute)
  auth: { maxRequests: 5, windowMs: 60 * 1000 },
  // Standard: API endpoints (100 per minute)
  api: { maxRequests: 100, windowMs: 60 * 1000 },
  // Generous: read-only endpoints (500 per minute)
  read: { maxRequests: 500, windowMs: 60 * 1000 },
  // Expensive: AI analysis endpoints (10 per minute per user)
  expensive: { maxRequests: 10, windowMs: 60 * 1000 },
};

/**
 * Cleanup old entries periodically (every hour)
 * Runs automatically on module load
 */
setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now >= entry.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  },
  60 * 60 * 1000,
); // 1 hour
