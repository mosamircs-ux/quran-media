import { NextResponse, type NextRequest } from 'next/server';
import { requireAdminAuth } from '@/lib/auth/admin-auth';
import { QURAN_STORIES } from '@/lib/stories-catalog';

declare global {
  // eslint-disable-next-line no-var
  var __ADMIN_STORIES_STORE: any[] | undefined;
}

if (!global.__ADMIN_STORIES_STORE) {
  global.__ADMIN_STORIES_STORE = QURAN_STORIES.map((s, i) => ({
    ...s,
    id: `story-db-${i + 1}`,
    moderationStatus: i === 0 ? 'APPROVED' : i === 1 ? 'PENDING' : 'APPROVED',
    published: true,
    author: i === 0 ? 'Admin Studio' : 'Tariq Al-Mansoor',
    authorEmail: i === 0 ? 'admin@quranmedia.studio' : 'tariq@gmail.com',
    guardrailsPassed: true,
  }));
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'MANAGE_STORIES');
  if ('response' in auth) return auth.response;

  const stories = global.__ADMIN_STORIES_STORE || [];

  return NextResponse.json({
    success: true,
    data: {
      stories,
      total: stories.length,
      pendingCount: stories.filter((s) => s.moderationStatus === 'PENDING').length,
    },
  });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'APPROVE_REJECT_STORIES');
  if ('response' in auth) return auth.response;

  const { slug, moderationStatus, published, rejectionReason } = await request.json();
  if (!slug) {
    return NextResponse.json({ success: false, error: 'slug is required' }, { status: 400 });
  }

  const stories = global.__ADMIN_STORIES_STORE || [];
  const story = stories.find((s) => s.slug === slug);

  if (story) {
    if (moderationStatus) story.moderationStatus = moderationStatus;
    if (typeof published === 'boolean') story.published = published;
    if (rejectionReason) story.rejectionReason = rejectionReason;
  }

  return NextResponse.json({
    success: true,
    data: { story },
  });
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'MANAGE_STORIES');
  if ('response' in auth) return auth.response;

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (global.__ADMIN_STORIES_STORE && slug) {
    global.__ADMIN_STORIES_STORE = global.__ADMIN_STORIES_STORE.filter((s) => s.slug !== slug);
  }

  return NextResponse.json({ success: true, message: 'Story deleted' });
}
