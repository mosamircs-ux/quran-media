export type AppRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'MODERATOR' | 'CREATOR' | 'USER';

export type AppPermission =
  | 'MANAGE_USERS'
  | 'MANAGE_ROLES'
  | 'MANAGE_STORIES'
  | 'APPROVE_REJECT_STORIES'
  | 'MODERATE_CONTENT'
  | 'MANAGE_PROJECTS'
  | 'MANAGE_TEMPLATES'
  | 'MANAGE_AI_PROVIDERS'
  | 'MANAGE_JOBS'
  | 'RETRY_JOBS'
  | 'MANAGE_QURAN_RESOURCES'
  | 'VIEW_FINANCIAL_REPORTS'
  | 'VIEW_API_USAGE'
  | 'VIEW_STORAGE_USAGE'
  | 'VIEW_SYSTEM_LOGS'
  | 'MANAGE_SETTINGS';

export const ROLE_PERMISSIONS: Record<AppRole, AppPermission[]> = {
  SUPER_ADMIN: [
    'MANAGE_USERS',
    'MANAGE_ROLES',
    'MANAGE_STORIES',
    'APPROVE_REJECT_STORIES',
    'MODERATE_CONTENT',
    'MANAGE_PROJECTS',
    'MANAGE_TEMPLATES',
    'MANAGE_AI_PROVIDERS',
    'MANAGE_JOBS',
    'RETRY_JOBS',
    'MANAGE_QURAN_RESOURCES',
    'VIEW_FINANCIAL_REPORTS',
    'VIEW_API_USAGE',
    'VIEW_STORAGE_USAGE',
    'VIEW_SYSTEM_LOGS',
    'MANAGE_SETTINGS',
  ],
  ADMIN: [
    'MANAGE_USERS',
    'MANAGE_STORIES',
    'APPROVE_REJECT_STORIES',
    'MODERATE_CONTENT',
    'MANAGE_PROJECTS',
    'MANAGE_TEMPLATES',
    'MANAGE_AI_PROVIDERS',
    'MANAGE_JOBS',
    'RETRY_JOBS',
    'MANAGE_QURAN_RESOURCES',
    'VIEW_FINANCIAL_REPORTS',
    'VIEW_API_USAGE',
    'VIEW_STORAGE_USAGE',
    'VIEW_SYSTEM_LOGS',
  ],
  EDITOR: [
    'MANAGE_STORIES',
    'APPROVE_REJECT_STORIES',
    'MANAGE_TEMPLATES',
    'MANAGE_QURAN_RESOURCES',
  ],
  MODERATOR: [
    'APPROVE_REJECT_STORIES',
    'MODERATE_CONTENT',
    'VIEW_SYSTEM_LOGS',
  ],
  CREATOR: [],
  USER: [],
};

export function hasPermission(role: string | undefined, permission: AppPermission): boolean {
  if (!role) return false;
  const appRole = role.toUpperCase() as AppRole;
  const permissions = ROLE_PERMISSIONS[appRole] || [];
  return permissions.includes(permission);
}

export function canAccessAdmin(role: string | undefined): boolean {
  if (!role) return false;
  const appRole = role.toUpperCase();
  return ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MODERATOR'].includes(appRole);
}
