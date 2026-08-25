import { NextResponse, type NextRequest } from 'next/server';
import { requireAdminAuth } from '@/lib/auth/admin-auth';

declare global {
  // eslint-disable-next-line no-var
  var __ADMIN_MODERATION_QUEUE: any[] | undefined;
}

if (!global.__ADMIN_MODERATION_QUEUE) {
  global.__ADMIN_MODERATION_QUEUE = [
    {
      id: 'mod-flag-01',
      resourceType: 'STORY',
      resourceTitle: 'قصة النبي موسى عليه السلام والخضر',
      authorEmail: 'creator.user@studio.org',
      flagType: 'NON_FIGURATIVE_VERIFICATION',
      flagReason: 'AI visual prompt mentions human silhouette near the river; verified symbolic nature representation required.',
      status: 'PENDING_REVIEW',
      severity: 'HIGH',
      createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    },
    {
      id: 'mod-flag-02',
      resourceType: 'PROJECT',
      resourceTitle: 'تلاوة سورة النبأ — 4K Reel',
      authorEmail: 'content.maker@gmail.com',
      flagType: 'TEXT_AUTHENTICITY_CHECK',
      flagReason: 'Custom translation submitted; matching with King Fahd verified complex dictionary required.',
      status: 'PENDING_REVIEW',
      severity: 'MEDIUM',
      createdAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    },
  ];
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'MODERATE_CONTENT');
  if ('response' in auth) return auth.response;

  return NextResponse.json({
    success: true,
    data: {
      queue: global.__ADMIN_MODERATION_QUEUE,
      total: global.__ADMIN_MODERATION_QUEUE?.length || 0,
    },
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'MODERATE_CONTENT');
  if ('response' in auth) return auth.response;

  const { flagId, action, moderationNotes } = await request.json();
  const queue = global.__ADMIN_MODERATION_QUEUE || [];
  const item = queue.find((q) => q.id === flagId);

  if (item) {
    item.status = action; // 'APPROVED' | 'QUARANTINED' | 'REJECTED'
    item.moderationNotes = moderationNotes;
    item.moderatedBy = auth.user.email;
    item.moderatedAt = new Date().toISOString();
  }

  return NextResponse.json({ success: true, data: { item } });
}
