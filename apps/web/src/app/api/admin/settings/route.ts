import { NextResponse, type NextRequest } from 'next/server';
import { requireAdminAuth } from '@/lib/auth/admin-auth';

declare global {
  // eslint-disable-next-line no-var
  var __ADMIN_GLOBAL_SETTINGS: any | undefined;
}

if (!global.__ADMIN_GLOBAL_SETTINGS) {
  global.__ADMIN_GLOBAL_SETTINGS = {
    platformName: 'Quran Media Studio',
    maintenanceMode: false,
    maxVideoResolution: '4K',
    maxProjectDurationSeconds: 600,
    defaultReciterId: 7,
    workerConcurrency: 8,
    guardrailsEnforcement: 'STRICT_SACRED_VALIDATION',
    allowPublicStorySubmissions: true,
    requireAdminApprovalForStories: true,
    storageQuotaPerUserMb: 10240,
  };
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'MANAGE_SETTINGS');
  if ('response' in auth) return auth.response;

  return NextResponse.json({
    success: true,
    data: { settings: global.__ADMIN_GLOBAL_SETTINGS },
  });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'MANAGE_SETTINGS');
  if ('response' in auth) return auth.response;

  const updates = await request.json();
  global.__ADMIN_GLOBAL_SETTINGS = {
    ...global.__ADMIN_GLOBAL_SETTINGS,
    ...updates,
  };

  return NextResponse.json({
    success: true,
    data: { settings: global.__ADMIN_GLOBAL_SETTINGS },
  });
}
