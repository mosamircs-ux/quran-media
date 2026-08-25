import { NextResponse, type NextRequest } from 'next/server';
import { requireAdminAuth } from '@/lib/auth/admin-auth';

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'VIEW_SYSTEM_LOGS');
  if ('response' in auth) return auth.response;

  const logs = [
    { id: 'log-01', action: 'JOB_RETRIED', resource: 'MediaGenerationJob', resourceId: 'job-9803', performedBy: 'admin@quranmedia.studio', ip: '192.168.1.1', severity: 'INFO', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
    { id: 'log-02', action: 'STORY_APPROVED', resource: 'Story', resourceId: 'yusuf-from-well-to-elevation', performedBy: 'sarah.editor@quranmedia.studio', ip: '192.168.1.12', severity: 'INFO', timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString() },
    { id: 'log-03', action: 'GUARDRAIL_TRIGGER', resource: 'MediaScene', resourceId: 'scene-77', performedBy: 'SYSTEM_AI_AUDITOR', ip: '10.0.0.4', severity: 'WARNING', timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString() },
    { id: 'log-04', action: 'USER_ROLE_PROMOTED', resource: 'User', resourceId: 'usr_102', performedBy: 'admin@quranmedia.studio', ip: '192.168.1.1', severity: 'HIGH', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
    { id: 'log-05', action: 'TEMPLATE_UPDATED', resource: 'MediaTemplate', resourceId: 'cinematic_nature', performedBy: 'admin@quranmedia.studio', ip: '192.168.1.1', severity: 'INFO', timestamp: new Date(Date.now() - 1000 * 60 * 200).toISOString() },
  ];

  return NextResponse.json({
    success: true,
    data: { logs, total: logs.length },
  });
}
