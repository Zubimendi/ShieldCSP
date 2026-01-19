# Error Logging System

## Overview

ShieldCSP includes a centralized error logging system that:
- **Hides technical errors from users** - Shows friendly, actionable messages
- **Logs detailed errors for admins** - Full error details in console/logs
- **Categorizes errors** - Database, validation, authentication, etc.
- **Includes context** - Endpoint, user, IP, user agent, etc.

## How It Works

### For Users
When an error occurs, users see friendly messages like:
- "Database connection error. Please try again in a moment."
- "Invalid request. Please check your input."
- "An unexpected error occurred. Please try again."

### For Admins
All errors are logged to the console with full details:
```
[2024-01-15T10:30:45.123Z] [ERROR] API Error in POST /api/auth/signup
Error details: PrismaClientKnownRequestError: Can't reach database server...
Stack: ...
Context: {
  "endpoint": "/api/auth/signup",
  "method": "POST",
  "userId": "user-123",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

## Viewing Error Logs

### Development
Errors are logged to the console where you run `npm run dev`. Check your terminal for error logs.

### Production
1. **Console Logs**: Check your hosting platform's logs (Vercel, Railway, etc.)
2. **Database Logs** (Optional): Set `LOG_ERRORS_TO_DB=true` in `.env` to store errors in database
3. **External Services**: Consider integrating Sentry, LogRocket, or similar for production

## Error Types

The system automatically categorizes errors:

- **Database Errors**: Connection issues, query failures
- **Validation Errors**: Invalid input data (Zod)
- **Authentication Errors**: Login/signup failures
- **Permission Errors**: Unauthorized access attempts
- **Generic Errors**: Unexpected errors

## Adding Error Handling to New Routes

```typescript
import { handleApiError } from '@/lib/errors'

export async function POST(req: NextRequest) {
  try {
    // Your route logic
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error, {
      endpoint: '/api/your-endpoint',
      method: 'POST',
      req,
    })
  }
}
```

## Manual Logging

You can also log manually:

```typescript
import { logError, logWarning, logInfo } from '@/lib/logger'

// Log an error
await logError('Something went wrong', error, {
  endpoint: '/api/example',
  method: 'POST',
  userId: 'user-123',
  metadata: { customData: 'value' },
})

// Log a warning
await logWarning('Unusual activity detected', {
  endpoint: '/api/example',
  metadata: { activity: 'suspicious' },
})

// Log info
await logInfo('User action completed', {
  endpoint: '/api/example',
  userId: 'user-123',
})
```

## Sharing Error Logs

When reporting errors:
1. Copy the full error log from console (includes timestamp, error details, stack trace, context)
2. Include the endpoint and method
3. Include any relevant user actions that led to the error
4. Share the full log output - it contains all necessary debugging information

## Configuration

### Environment Variables

- `NODE_ENV=development` - Enables debug logging
- `LOG_ERRORS_TO_DB=true` - Stores errors in database (optional, requires setup)

## Best Practices

1. **Never expose raw errors to users** - Always use `handleApiError()`
2. **Log with context** - Include endpoint, user, IP, etc.
3. **Check logs regularly** - Monitor for patterns or recurring issues
4. **Use appropriate log levels** - `error` for failures, `warn` for issues, `info` for important events
