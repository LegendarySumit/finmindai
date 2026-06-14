"use server";

import pino from "pino";

type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

const isDevelopment = process.env.NODE_ENV === "development";
const logLevel = (process.env.LOG_LEVEL || "info") as LogLevel;
type LogMeta = Record<string, unknown>;

// Pino logger configuration
const pinoConfig: pino.LoggerOptions = {
  level: logLevel,
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label: string) => {
      return { level: label.toUpperCase() };
    },
    bindings: (bindings) => {
      return {
        pid: bindings.pid,
        hostname: bindings.hostname,
      };
    },
  },
};

// Create logger instance with fallback
let logger: pino.Logger;

try {
  if (isDevelopment) {
    try {
      const devTransport = pino.transport({
        target: "pino-pretty",
        options: {
          colorize: true,
          singleLine: false,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      });
      logger = pino(pinoConfig, devTransport);
    } catch {
      // Fallback if transport creation fails
      logger = pino(pinoConfig);
    }
  } else {
    try {
      const prodTransport: pino.DestinationStream = pino.destination({
        sync: false,
        append: true,
        mkdir: true,
      });
      logger = pino(pinoConfig, prodTransport);
    } catch {
      // Fallback if transport creation fails
      logger = pino(pinoConfig);
    }
  }
} catch {
  // Final fallback
  logger = pino(pinoConfig);
}

// Logger wrapper with utility methods
export const log = {
  trace: (message: string, meta?: LogMeta) => logger.trace(meta, message),
  debug: (message: string, meta?: LogMeta) => logger.debug(meta, message),
  info: (message: string, meta?: LogMeta) => logger.info(meta, message),
  warn: (message: string, meta?: unknown) =>
    logger.warn((meta as LogMeta) || {}, message),
  error: (message: string, error?: unknown) => {
    if (error instanceof Error) {
      logger.error(
        {
          error: error.message,
          stack: error.stack,
          name: error.name,
        },
        message,
      );
    } else {
      logger.error((error as LogMeta) || {}, message);
    }
  },
  fatal: (message: string, error?: unknown) => {
    if (error instanceof Error) {
      logger.fatal(
        {
          error: error.message,
          stack: error.stack,
          name: error.name,
        },
        message,
      );
    } else {
      logger.fatal((error as LogMeta) || {}, message);
    }
  },
};

// Request logger middleware for API routes
export function createRequestLogger() {
  return (message: string, data: LogMeta) => {
    log.info(message, {
      method: data.method,
      path: data.path,
      status: data.status,
      duration: data.duration,
      ip: data.ip,
      userId: data.userId,
    });
  };
}

// Performance logger for slow operations
export function createPerformanceLogger(name: string) {
  const start = Date.now();

  return {
    end: (success: boolean = true, meta?: LogMeta) => {
      const duration = Date.now() - start;
      const threshold = 1000; // Log if > 1s

      if (duration > threshold) {
        log.warn(`Slow operation: ${name}`, {
          duration,
          ...meta,
        });
      } else if (!success) {
        log.error(`Operation failed: ${name}`, {
          duration,
          ...meta,
        });
      }
    },
  };
}

export default logger;
