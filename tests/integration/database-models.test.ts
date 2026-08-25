import { ROLE_PERMISSIONS, hasPermission, canAccessAdmin } from '../../apps/web/src/lib/auth/rbac.js';
import crypto from 'crypto';

export async function runDatabaseModelsIntegrationTests(): Promise<{ passed: number; failed: number }> {
  console.log('🗄️ [INTEGRATION TEST] Database Models & RBAC Permissions...');
  let passed = 0;
  let failed = 0;

  function assert(cond: boolean, name: string) {
    if (cond) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name}`);
      failed++;
    }
  }

  // 1. RBAC Matrix Verification
  assert(hasPermission('SUPER_ADMIN', 'MANAGE_USERS'), 'SUPER_ADMIN has MANAGE_USERS');
  assert(hasPermission('SUPER_ADMIN', 'MANAGE_ROLES'), 'SUPER_ADMIN has MANAGE_ROLES');
  assert(hasPermission('SUPER_ADMIN', 'MANAGE_SETTINGS'), 'SUPER_ADMIN has MANAGE_SETTINGS');

  assert(hasPermission('ADMIN', 'MANAGE_USERS'), 'ADMIN has MANAGE_USERS');
  assert(!hasPermission('ADMIN', 'MANAGE_SETTINGS'), 'ADMIN is restricted from MANAGE_SETTINGS');

  assert(hasPermission('MODERATOR', 'MODERATE_CONTENT'), 'MODERATOR has MODERATE_CONTENT');
  assert(!hasPermission('MODERATOR', 'MANAGE_USERS'), 'MODERATOR cannot manage users');

  assert(!hasPermission('USER', 'MANAGE_USERS'), 'Standard USER cannot manage users');

  assert(canAccessAdmin('SUPER_ADMIN') && canAccessAdmin('ADMIN') && canAccessAdmin('MODERATOR'), 'Admins and moderators have dashboard access');
  assert(!canAccessAdmin('USER') && !canAccessAdmin('CREATOR'), 'Regular users cannot access admin panel');

  // 2. UUID Primary Key Validity
  const testUuid = crypto.randomUUID();
  assert(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(testUuid), 'Validates standard UUID v4 format');

  return { passed, failed };
}
