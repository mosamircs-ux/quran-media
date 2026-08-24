import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser, getUserStore } from '@/lib/auth/session';

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, preferredReciter, locale } = body;

    const store = getUserStore();
    const stored = Array.from(store.values()).find((u) => u.id === user.id);

    if (stored) {
      if (name) stored.name = name;
      if (preferredReciter) stored.preferredReciter = Number(preferredReciter);
      if (locale) stored.locale = locale;
      store.set(stored.email.toLowerCase(), stored);
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: name || user.name,
          role: user.role,
          locale: locale || user.locale,
          preferredReciter: preferredReciter ? Number(preferredReciter) : user.preferredReciter,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update profile' },
      { status: 500 }
    );
  }
}
