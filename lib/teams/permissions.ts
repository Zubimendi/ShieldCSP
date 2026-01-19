/**
 * Team Permissions Utility
 * Checks if a user has permission to perform actions on a team
 */

import { prisma } from '@/lib/prisma';

export type TeamRole = 'owner' | 'admin' | 'member' | 'viewer';

export type Permission = 
  | 'team:read'
  | 'team:update'
  | 'team:delete'
  | 'team:manage-members'
  | 'team:manage-settings'
  | 'domain:create'
  | 'domain:delete'
  | 'scan:create'
  | 'scan:delete'
  | 'config:create'
  | 'config:delete'
  | 'api-key:create'
  | 'api-key:delete';

const rolePermissions: Record<TeamRole, Permission[]> = {
  owner: [
    'team:read',
    'team:update',
    'team:delete',
    'team:manage-members',
    'team:manage-settings',
    'domain:create',
    'domain:delete',
    'scan:create',
    'scan:delete',
    'config:create',
    'config:delete',
    'api-key:create',
    'api-key:delete',
  ],
  admin: [
    'team:read',
    'team:update',
    'team:manage-members',
    'team:manage-settings',
    'domain:create',
    'domain:delete',
    'scan:create',
    'scan:delete',
    'config:create',
    'config:delete',
    'api-key:create',
    'api-key:delete',
  ],
  member: [
    'team:read',
    'domain:create',
    'scan:create',
    'config:create',
  ],
  viewer: [
    'team:read',
  ],
};

/**
 * Get user's role in a team
 */
export async function getUserTeamRole(
  userId: string,
  teamId: string,
): Promise<TeamRole | null> {
  const membership = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId,
        userId,
      },
    },
    select: {
      role: true,
    },
  });

  return (membership?.role as TeamRole) || null;
}

/**
 * Check if user has a specific permission on a team
 */
export async function hasPermission(
  userId: string,
  teamId: string,
  permission: Permission,
): Promise<boolean> {
  const role = await getUserTeamRole(userId, teamId);
  if (!role) return false;

  const permissions = rolePermissions[role];
  return permissions.includes(permission);
}

/**
 * Require permission - throws error if user doesn't have permission
 */
export async function requirePermission(
  userId: string,
  teamId: string,
  permission: Permission,
): Promise<void> {
  const hasAccess = await hasPermission(userId, teamId, permission);
  if (!hasAccess) {
    throw new Error(`Permission denied: ${permission}`);
  }
}

/**
 * Check if user is team owner
 */
export async function isTeamOwner(
  userId: string,
  teamId: string,
): Promise<boolean> {
  const role = await getUserTeamRole(userId, teamId);
  return role === 'owner';
}

/**
 * Check if user is team admin or owner
 */
export async function isTeamAdmin(
  userId: string,
  teamId: string,
): Promise<boolean> {
  const role = await getUserTeamRole(userId, teamId);
  return role === 'owner' || role === 'admin';
}
