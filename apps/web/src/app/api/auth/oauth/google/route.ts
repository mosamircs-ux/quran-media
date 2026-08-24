import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { signJWT } from '@/lib/auth/jwt';
import { getUserStore, setAuthCookie, type StoredUser } from '@/lib/auth/session';

const GoogleOAuthSchema = z.object({
  idToken: z.string().optional(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  picture: z.string().url().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = GoogleOAuthSchema.parse(body);

    const email = (parsed.email || 'google.user@quranmedia.studio').toLowerCase();
    const name = parsed.name || 'Google Creator';
    const picture = parsed.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

    const store = getUserStore();
    let user = store.get(email);

    if (!user) {
      user = {
        id: `usr_g_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        email,
        name,
        image: picture,
        role: 'USER',
        locale: 'ar',
        preferredReciter: 7,
        createdAt: new Date(),
      };
      store.set(email, user);
    }

    const token = await signJWT({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      locale: user.locale,
      preferredReciter: user.preferredReciter,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
        locale: user.locale,
      },
      token,
    });

    setAuthCookie(response, token);
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Google authentication failed' },
      { status: 400 }
    );
  }
}
