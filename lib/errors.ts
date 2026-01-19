/**
 * Error Handling Utilities
 * Provides user-friendly error messages and standardized error responses
 */

import { NextResponse } from 'next/server';
import { logError, getErrorMessage, isDatabaseError, isPrismaError } from './logger';

export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
  details?: any;
}

/**
 * Create a user-friendly error message from an error
 */
export function getUserFriendlyError(error: unknown): ApiError {
  const errorMessage = getErrorMessage(error);

  // Database connection errors
  if (isDatabaseError(error)) {
    return {
      message: 'Database connection error. Please try again in a moment.',
      code: 'DATABASE_ERROR',
      statusCode: 503,
      details: {
        originalError: errorMessage,
        suggestion: 'The database may be temporarily unavailable. Please check your connection or try again later.',
      },
    };
  }

  // Prisma errors
  if (isPrismaError(error)) {
    return {
      message: 'A database error occurred. Please try again.',
      code: 'DATABASE_ERROR',
      statusCode: 500,
      details: {
        originalError: errorMessage,
      },
    };
  }

  // Validation errors (Zod)
  if (error && typeof error === 'object' && 'issues' in error) {
    return {
      message: 'Invalid request data. Please check your input.',
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      details: error,
    };
  }

  // Generic error
  return {
    message: 'An unexpected error occurred. Please try again.',
    code: 'INTERNAL_ERROR',
    statusCode: 500,
    details: {
      originalError: errorMessage,
    },
  };
}

/**
 * Handle API route errors with logging and user-friendly responses
 */
export async function handleApiError(
  error: unknown,
  context: {
    endpoint: string;
    method: string;
    userId?: string;
    teamId?: string;
    req?: { headers: Headers; ip?: string | null };
  }
): Promise<NextResponse> {
  // Log the error with full context
  await logError(
    `API Error in ${context.method} ${context.endpoint}`,
    error,
    {
      endpoint: context.endpoint,
      method: context.method,
      userId: context.userId,
      teamId: context.teamId,
      ipAddress: context.req?.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                 context.req?.headers.get('x-real-ip') ||
                 context.req?.ip ||
                 undefined,
      userAgent: context.req?.headers.get('user-agent') || undefined,
    }
  );

  // Get user-friendly error
  const apiError = getUserFriendlyError(error);

  // Return appropriate response
  return NextResponse.json(
    {
      error: apiError.message,
      code: apiError.code,
      ...(process.env.NODE_ENV === 'development' && apiError.details
        ? { details: apiError.details }
        : {}),
    },
    { status: apiError.statusCode }
  );
}

/**
 * Wrapper for API route handlers with automatic error handling
 */
export function withErrorHandling<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>,
  endpoint: string
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      // Extract request from args if available
      const req = args[0] as { headers?: Headers; ip?: string | null } | undefined;
      
      return handleApiError(error, {
        endpoint,
        method: req ? 'POST' : 'GET', // Could be improved to detect actual method
        req: req as { headers: Headers; ip?: string | null } | undefined,
      });
    }
  };
}
