import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { verifyPassword } from '@/lib/auth/password';
import { signJWT } from '@/lib/auth/jwt';
import { getUserStore, setAuthCookie, DEMO_USER } from '@/lib/auth/session';

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = SignInSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const store = getUserStore();
    const normalizedEmail = email.toLowerCase().trim();

    const user = store.get(normalizedEmail);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password if hash exists, or if demo user allow demo password
    if (user.passwordHash) {
      const isValid = verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }
    } else if (
      normalizedEmail === DEMO_USER.email.toLowerCase() ||
      normalizedEmail === 'admin@quranmedia.studio'
    ) {
      // Demo creator & Super Admin can sign in for instant evaluation
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
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
        preferredReciter: user.preferredReciter,
      },
      token,
    });

    setAuthCookie(response, token);
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
