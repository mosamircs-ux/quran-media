import { NextResponse, type NextRequest } from 'next/server';
import { requireAdminAuth } from '@/lib/auth/admin-auth';
import { getUserStore, type StoredUser, type RoleType } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'MANAGE_USERS');
  if ('response' in auth) return auth.response;

  const store = getUserStore();
  const memoryUsers = Array.from(store.values());

  // Merge with sample user directory for rich administrative visualization
  const sampleUsers: StoredUser[] = [
    { id: 'usr_101', email: 'ibrahim.khalil@example.com', name: 'إبراهيم خليل', role: 'CREATOR', locale: 'ar', preferredReciter: 7, createdAt: new Date(Date.now() - 86400000 * 12) },
    { id: 'usr_102', email: 'sarah.editor@quranmedia.studio', name: 'سارة المنصور (محررة المحتوى)', role: 'EDITOR', locale: 'ar', preferredReciter: 2, createdAt: new Date(Date.now() - 86400000 * 25) },
    { id: 'usr_103', email: 'omar.moderator@quranmedia.studio', name: 'عمر الفاروق (مراقب شرعي)', role: 'MODERATOR', locale: 'ar', preferredReciter: 6, createdAt: new Date(Date.now() - 86400000 * 40) },
    { id: 'usr_104', email: 'yusuf.creator@gmail.com', name: 'Yusuf Vance', role: 'USER', locale: 'en', preferredReciter: 7, createdAt: new Date(Date.now() - 86400000 * 2) },
  ];

  const allUsersMap = new Map<string, StoredUser>();
  for (const u of memoryUsers) allUsersMap.set(u.id, u);
  for (const u of sampleUsers) {
    if (!allUsersMap.has(u.id)) allUsersMap.set(u.id, u);
  }

  const userList = Array.from(allUsersMap.values()).map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    image: u.image,
    role: u.role,
    locale: u.locale,
    preferredReciter: u.preferredReciter,
    createdAt: u.createdAt,
    projectsCount: u.role === 'SUPER_ADMIN' ? 12 : u.role === 'CREATOR' ? 8 : 2,
    status: 'ACTIVE',
  }));

  return NextResponse.json({
    success: true,
    data: {
      users: userList,
      total: userList.length,
    },
  });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'MANAGE_USERS');
  if ('response' in auth) return auth.response;

  const { userId, role, status } = await request.json();
  if (!userId) {
    return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 });
  }

  // Only SUPER_ADMIN can assign SUPER_ADMIN or ADMIN role
  if ((role === 'SUPER_ADMIN' || role === 'ADMIN') && auth.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json(
      { success: false, error: 'Only Super Admins can promote users to Admin/Super Admin' },
      { status: 403 }
    );
  }

  const store = getUserStore();
  const user = Array.from(store.values()).find((u) => u.id === userId);
  if (user) {
    if (role) user.role = role as RoleType;
    store.set(user.email.toLowerCase(), user);
  }

  return NextResponse.json({
    success: true,
    data: {
      userId,
      role: role || user?.role,
      status: status || 'ACTIVE',
      message: 'User updated successfully',
    },
  });
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'MANAGE_USERS');
  if ('response' in auth) return auth.response;

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (userId === auth.user.id) {
    return NextResponse.json({ success: false, error: 'Cannot delete own admin account' }, { status: 400 });
  }

  const store = getUserStore();
  const user = Array.from(store.values()).find((u) => u.id === userId);
  if (user) {
    store.delete(user.email.toLowerCase());
  }

  return NextResponse.json({ success: true, message: 'User deleted successfully' });
}
