import { NextRequest } from "next/server";
import { checkRateLimit, getClientIP, RATE_LIMITS } from "@/lib/rateLimit";
import { stockQuerySchema, validateRequest } from "@/lib/validation";
import { errorResponse, successResponse } from "@/lib/apiResponse";

// GET /api/stock?symbol=TSLA
export async function GET(req: NextRequest) {
  // Rate limiting (public endpoint - generous limits)
  const ip = getClientIP(req);
  const limit = checkRateLimit(
    ip,
    RATE_LIMITS.read.maxRequests,
    RATE_LIMITS.read.windowMs,
  );
  if (!limit.allowed) {
    const retryAfter = Math.ceil((limit.resetTime - Date.now()) / 1000);
    return errorResponse(
      "RATE_LIMITED",
      `Rate limit exceeded. Retry after ${retryAfter}s`,
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      },
    );
  }

  // Validate request
  const symbol = req.nextUrl.searchParams.get("symbol");
  try {
    await validateRequest(stockQuerySchema, { symbol });
  } catch (error) {
    return errorResponse(
      "VALIDATION_ERROR",
      error instanceof Error ? error.message : "validation error",
      { status: 400 },
    );
  }

  if (!symbol) {
    return errorResponse("VALIDATION_ERROR", "symbol is required", {
      status: 400,
    });
  }

  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    return errorResponse("CONFIG_ERROR", "FINNHUB_API_KEY not configured", {
      status: 500,
    });
  }

  const [quoteRes, profileRes] = await Promise.all([
    fetch(
      `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`,
      { next: { revalidate: 15 } },
    ),
    fetch(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`,
      { next: { revalidate: 3600 } },
    ),
  ]);

  if (!quoteRes.ok) {
    return errorResponse("UPSTREAM_ERROR", "Failed to fetch quote", {
      status: 502,
    });
  }

  const quote = await quoteRes.json();
  const profile = profileRes.ok ? await profileRes.json() : {};

  if (!profileRes.ok) {
    console.warn(
      `Profile fetch failed for symbol ${symbol}: ${profileRes.status}`,
    );
  }

  // Finnhub quote fields: c=current, d=change, dp=change%, h=high, l=low, o=open, pc=prev close
  return successResponse(
    {
      symbol,
      name: profile.name ?? symbol,
      price: quote.c,
      change: quote.d,
      changePercent: quote.dp,
      high: quote.h,
      low: quote.l,
      open: quote.o,
      prevClose: quote.pc,
      timestamp: quote.t,
    },
    { message: "Stock quote fetched successfully" },
  );
}
