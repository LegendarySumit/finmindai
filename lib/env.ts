import { z } from 'zod';
import { log } from './logger';

// Define environment schema
const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Firebase config
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, 'Firebase API Key is required'),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'Firebase Auth Domain is required'),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, 'Firebase Project ID is required'),
  FIREBASE_SERVICE_ACCOUNT_BASE64: z.string().optional(),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  
  // API Keys
  FINNHUB_API_KEY: z.string().min(1, 'Finnhub API Key is required'),
  GEMINI_API_KEY: z.string().min(1, 'Gemini API Key is required'),
  
  // App config
  NEXT_PUBLIC_APP_URL: z.string().url('APP_URL must be a valid URL').default('http://localhost:3000'),
  
  // Logging
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  
  // Rate limiting (optional - defaults provided)
  RATE_LIMIT_WINDOW_MS: z.string().default('60000').transform(Number),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100').transform(Number),
  
  // Optional: Redis for distributed rate limiting
  REDIS_URL: z.string().url('REDIS_URL must be a valid URL').optional(),
});

type EnvConfig = z.infer<typeof envSchema>;

let config: EnvConfig | null = null;

/**
 * Validate and load environment variables
 * Call this once at application startup
 */
export function validateEnv(): EnvConfig {
  if (config) {
    return config;
  }

  try {
    // Parse environment variables
    const env = envSchema.parse(process.env);

    if (env.NODE_ENV === 'production') {
      const hasBase64 = !!env.FIREBASE_SERVICE_ACCOUNT_BASE64;
      const hasSplitCreds = !!env.FIREBASE_PROJECT_ID && !!env.FIREBASE_CLIENT_EMAIL && !!env.FIREBASE_PRIVATE_KEY;
      if (!hasBase64 && !hasSplitCreds) {
        throw new Error(
          'Firebase Admin credentials are required in production. Set FIREBASE_SERVICE_ACCOUNT_BASE64 or FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY.'
        );
      }
    }
    
    config = env;
    
    log.info('Environment variables validated successfully', {
      nodeEnv: env.NODE_ENV,
      logLevel: env.LOG_LEVEL,
      hasFirebaseAdmin: !!env.FIREBASE_SERVICE_ACCOUNT_BASE64 || !!(env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY),
      hasRedis: !!env.REDIS_URL,
    });
    
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('\n');
      
      log.error(`Environment validation failed:\n${formattedErrors}`, error);
      throw new Error(`Environment validation failed:\n${formattedErrors}`);
    }
    
    throw error;
  }
}

/**
 * Get a single environment variable with validation
 */
export function getEnv<K extends keyof EnvConfig>(key: K): EnvConfig[K] {
  if (!config) {
    validateEnv();
  }
  
  return config![key];
}

/**
 * Get all environment configuration
 */
export function getAllEnv(): EnvConfig {
  if (!config) {
    validateEnv();
  }
  
  return config!;
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return getEnv('NODE_ENV') === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return getEnv('NODE_ENV') === 'development';
}

/**
 * Check if running in test mode
 */
export function isTest(): boolean {
  return getEnv('NODE_ENV') === 'test';
}

/**
 * Export config for direct access
 */
const envUtils = {
  validateEnv,
  getEnv,
  getAllEnv,
  isProduction,
  isDevelopment,
  isTest,
};

export default envUtils;
