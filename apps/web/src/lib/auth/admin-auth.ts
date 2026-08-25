import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser, type AuthUser } from './session';
import { canAccessAdmin, hasPermission, type AppPermission } from './rbac';

export async function requireAdminAuth(
  request: NextRequest,
  requiredPermission?: AppPermission
): Promise<{ user: AuthUser } | { response: NextResponse }> {
  const user = await getCurrentUser(request);

  if (!user) {
    return {
      response: NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      ),
    };
  }

  if (!canAccessAdmin(user.role)) {
    return {
      response: NextResponse.json(
        { success: false, error: 'Forbidden: Admin access required' },
        { status: 403 }
      ),
    };
  }

  if (requiredPermission && !hasPermission(user.role, requiredPermission)) {
    return {
      response: NextResponse.json(
        { success: false, error: `Forbidden: Missing required permission: ${requiredPermission}` },
        { status: 403 }
      ),
    };
  }

  return { user };
}
