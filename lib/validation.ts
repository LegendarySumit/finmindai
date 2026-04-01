import { z } from "zod";

/**
 * Request validation schemas for all API routes
 * Install with: npm install zod
 */

// Auth schemas
export const walletNonceSchema = z
  .object({
    walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
  })
  .strict();

export const walletVerifySchema = z
  .object({
    walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
    signature: z.string().min(1, "Signature required"),
    message: z.string().min(1, "Message required"),
  })
  .strict();

// Stock data schema
export const stockQuerySchema = z
  .object({
    symbol: z
      .string()
      .min(1, "Symbol required")
      .max(10, "Invalid symbol length")
      .regex(/^[A-Z0-9]{1,10}$/, "Symbol must be alphanumeric uppercase"),
  })
  .strict();

// News schema
export const newsQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    category: z.enum(["general", "crypto", "stocks", "forex"]).optional(),
  })
  .strict();

// Deep analysis schema
export const deepAnalysisSchema = z
  .object({
    symbol: z
      .string()
      .min(1, "Symbol required")
      .max(10, "Invalid symbol length")
      .regex(/^[A-Z0-9]{1,10}$/, "Symbol must be alphanumeric"),
    analysisType: z
      .enum(["technical", "fundamental", "sentiment", "comprehensive"])
      .default("comprehensive"),
    timeframe: z.enum(["daily", "weekly", "monthly"]).default("daily"),
  })
  .strict();

// Portfolio schema
export const portfolioSchema = z
  .object({
    name: z.string().min(1, "Portfolio name required").max(100),
    description: z.string().max(500).optional(),
    public: z.boolean().default(false),
  })
  .strict();

export const addHoldingSchema = z
  .object({
    portfolioId: z.string().uuid("Invalid portfolio ID"),
    symbol: z
      .string()
      .min(1, "Symbol required")
      .max(10, "Invalid symbol length")
      .regex(/^[A-Z0-9]{1,10}$/, "Symbol must be alphanumeric"),
    quantity: z.number().positive("Quantity must be positive"),
    purchasePrice: z.number().positive("Purchase price must be positive"),
    purchaseDate: z.string().datetime("Invalid date format"),
  })
  .strict();

// Watchlist schema
export const watchlistSchema = z
  .object({
    name: z.string().min(1, "Watchlist name required").max(100),
    private: z.boolean().default(true),
  })
  .strict();

export const addToWatchlistSchema = z
  .object({
    watchlistId: z.string().uuid("Invalid watchlist ID"),
    symbol: z
      .string()
      .min(1, "Symbol required")
      .max(10, "Invalid symbol length")
      .regex(/^[A-Z0-9]{1,10}$/, "Symbol must be alphanumeric"),
  })
  .strict();

// Alert schema
export const createAlertSchema = z
  .object({
    symbol: z
      .string()
      .min(1, "Symbol required")
      .max(10, "Invalid symbol length")
      .regex(/^[A-Z0-9]{1,10}$/, "Symbol must be alphanumeric"),
    condition: z.enum(["above", "below", "crosses"]),
    price: z.number().positive("Price must be positive"),
    enabled: z.boolean().default(true),
  })
  .strict();

/**
 * Validation utility helper
 */
export async function validateRequest<T>(schema: z.ZodSchema, data: unknown): Promise<T> {
  try {
    return schema.parse(data) as T;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Validation error: ${error.errors
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(", ")}`
      );
    }
    throw error;
  }
}
