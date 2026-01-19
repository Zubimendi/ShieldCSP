/**
 * Centralized Logging Service
 * Logs errors and important events for admin review
 */

import { prisma } from '@/lib/prisma';

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  level: LogLevel;
  message: string;
  error?: Error | unknown;
  context?: {
    endpoint?: string;
    method?: string;
    userId?: string;
    teamId?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
  };
  timestamp: Date;
}

/**
 * Log an entry to console and optionally to database
 */
export async function log(entry: Omit<LogEntry, 'timestamp'>): Promise<void> {
  const logEntry: LogEntry = {
    ...entry,
    timestamp: new Date(),
  };

  // Always log to console with structured format
  const logMessage = `[${logEntry.timestamp.toISOString()}] [${logEntry.level.toUpperCase()}] ${logEntry.message}`;
  
  if (logEntry.level === 'error') {
    console.error(logMessage);
    if (logEntry.error) {
      console.error('Error details:', logEntry.error);
      if (logEntry.error instanceof Error) {
        console.error('Stack:', logEntry.error.stack);
      }
    }
    if (logEntry.context) {
      console.error('Context:', JSON.stringify(logEntry.context, null, 2));
    }
  } else if (logEntry.level === 'warn') {
    console.warn(logMessage);
    if (logEntry.context) {
      console.warn('Context:', JSON.stringify(logEntry.context, null, 2));
    }
  } else {
    console.log(logMessage);
    if (logEntry.context && logEntry.level === 'debug') {
      console.log('Context:', JSON.stringify(logEntry.context, null, 2));
    }
  }

  // Optionally store critical errors in database (if Prisma is available)
  if (logEntry.level === 'error' && process.env.LOG_ERRORS_TO_DB === 'true') {
    try {
      // Store in a simple error log table (you can create this if needed)
      // For now, we'll just ensure console logging works
      // In production, you might want to use a service like Sentry, LogRocket, etc.
    } catch (dbError) {
      // Don't fail if logging to DB fails
      console.error('[Logger] Failed to write to database:', dbError);
    }
  }
}

/**
 * Log an error with context
 */
export async function logError(
  message: string,
  error: Error | unknown,
  context?: LogEntry['context']
): Promise<void> {
  await log({
    level: 'error',
    message,
    error,
    context,
  });
}

/**
 * Log a warning
 */
export async function logWarning(
  message: string,
  context?: LogEntry['context']
): Promise<void> {
  await log({
    level: 'warn',
    message,
    context,
  });
}

/**
 * Log info
 */
export async function logInfo(
  message: string,
  context?: LogEntry['context']
): Promise<void> {
  await log({
    level: 'info',
    message,
    context,
  });
}

/**
 * Log debug info (only in development)
 */
export async function logDebug(
  message: string,
  context?: LogEntry['context']
): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    await log({
      level: 'debug',
      message,
      context,
    });
  }
}

/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

/**
 * Check if error is a database connection error
 */
export function isDatabaseError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('can\'t reach database') ||
      message.includes('connection') ||
      message.includes('timeout') ||
      message.includes('econnrefused') ||
      message.includes('prisma') ||
      message.includes('neon')
    );
  }
  return false;
}

/**
 * Check if error is a Prisma error
 */
export function isPrismaError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.constructor.name.includes('Prisma') ||
      error.message.includes('prisma') ||
      error.message.includes('Invalid `prisma')
    );
  }
  return false;
}
