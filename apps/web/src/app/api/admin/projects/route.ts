import { NextResponse, type NextRequest } from 'next/server';
import { requireAdminAuth } from '@/lib/auth/admin-auth';

declare global {
  // eslint-disable-next-line no-var
  var __STUDIO_MEMORY_PROJECTS: Map<string, any> | undefined;
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'MANAGE_PROJECTS');
  if ('response' in auth) return auth.response;

  const store = global.__STUDIO_MEMORY_PROJECTS || new Map<string, any>();
  const projects = Array.from(store.values());

  return NextResponse.json({
    success: true,
    data: {
      projects,
      total: projects.length,
    },
  });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'MODERATE_CONTENT');
  if ('response' in auth) return auth.response;

  const { projectId, status, isQuarantined, flagReason } = await request.json();
  const store = global.__STUDIO_MEMORY_PROJECTS;

  if (store && store.has(projectId)) {
    const p = store.get(projectId);
    if (status) p.status = status;
    if (typeof isQuarantined === 'boolean') p.isQuarantined = isQuarantined;
    if (flagReason) p.flagReason = flagReason;
    store.set(projectId, p);
  }

  return NextResponse.json({ success: true, message: 'Project moderated' });
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'MANAGE_PROJECTS');
  if ('response' in auth) return auth.response;

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (global.__STUDIO_MEMORY_PROJECTS && projectId) {
    global.__STUDIO_MEMORY_PROJECTS.delete(projectId);
  }

  return NextResponse.json({ success: true, message: 'Project deleted' });
}
