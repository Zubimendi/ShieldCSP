/**
 * Audit Logging System
 * Logs all user actions, API calls, and security events for compliance
 */

import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export type AuditAction =
  // Team actions
  | 'team:create'
  | 'team:update'
  | 'team:delete'
  | 'team:member:add'
  | 'team:member:update'
  | 'team:member:remove'
  // Domain actions
  | 'domain:create'
  | 'domain:update'
  | 'domain:delete'
  // Scan actions
  | 'scan:create'
  | 'scan:complete'
  | 'scan:fail'
  // Violation actions
  | 'violation:create'
  | 'violation:resolve'
  | 'violation:mark-false-positive'
  // API Key actions
  | 'api-key:create'
  | 'api-key:update'
  | 'api-key:delete'
  | 'api-key:use'
  // Config actions
  | 'config:generate'
  | 'config:save'
  | 'config:delete'
  // XSS Test actions
  | 'xss-test:create'
  | 'xss-test:execute'
  // Notification actions
  | 'notification:settings:update'
  // Authentication actions
  | 'auth:login'
  | 'auth:logout'
  | 'auth:signup'
  | 'auth:password-reset'
  // Security events
  | 'security:violation-detected'
  | 'security:scan-failed'
  | 'security:score-change'
  | 'security:unauthorized-access';

export type ResourceType =
  | 'team'
  | 'domain'
  | 'scan'
  | 'violation'
  | 'api-key'
  | 'config'
  | 'xss-test'
  | 'user'
  | 'notification-setting';

export interface AuditLogData {
  teamId: string;
  userId?: string;
  action: AuditAction;
  resourceType?: ResourceType;
  resourceId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(data: AuditLogData): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        teamId: data.teamId,
        userId: data.userId,
        action: data.action,
        resourceType: data.resourceType,
        resourceId: data.resourceId,
        metadata: data.metadata || {},
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  } catch (error) {
    // Don't throw - audit logging should never break the main flow
    console.error('[Audit Log] Failed to create audit log:', error);
  }
}

/**
 * Create audit log from request context
 * Extracts IP and user agent from Next.js request
 */
export async function createAuditLogFromRequest(
  req: Request,
  data: Omit<AuditLogData, 'ipAddress' | 'userAgent'>
): Promise<void> {
  const headersList = headers();
  const ipAddress =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    null;
  const userAgent = headersList.get('user-agent') || null;

  await createAuditLog({
    ...data,
    ipAddress: ipAddress || undefined,
    userAgent: userAgent || undefined,
  });
}

/**
 * Create audit log from NextRequest (for API routes)
 */
export async function createAuditLogFromNextRequest(
  req: { headers: Headers; ip?: string | null },
  data: Omit<AuditLogData, 'ipAddress' | 'userAgent'>
): Promise<void> {
  const ipAddress =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    req.ip ||
    null;
  const userAgent = req.headers.get('user-agent') || null;

  await createAuditLog({
    ...data,
    ipAddress: ipAddress || undefined,
    userAgent: userAgent || undefined,
  });
}

/**
 * Helper to log API key usage
 */
export async function logApiKeyUsage(
  apiKeyId: string,
  teamId: string,
  action: string,
  metadata?: Record<string, any>
): Promise<void> {
  await createAuditLog({
    teamId,
    action: 'api-key:use',
    resourceType: 'api-key',
    resourceId: apiKeyId,
    metadata: {
      ...metadata,
      action,
    },
  });
}

/**
 * Helper to log security events
 */
export async function logSecurityEvent(
  teamId: string,
  event: 'violation-detected' | 'scan-failed' | 'score-change' | 'unauthorized-access',
  metadata?: Record<string, any>
): Promise<void> {
  await createAuditLog({
    teamId,
    action: `security:${event}` as AuditAction,
    metadata,
  });
}
