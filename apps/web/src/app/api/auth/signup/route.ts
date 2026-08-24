import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { hashPassword } from '@/lib/auth/password';
import { signJWT } from '@/lib/auth/jwt';
import { getUserStore, setAuthCookie, type StoredUser } from '@/lib/auth/session';

const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  locale: z.enum(['ar', 'en']).default('ar'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = SignUpSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { email, password, name, locale } = result.data;
    const store = getUserStore();
    const normalizedEmail = email.toLowerCase().trim();

    if (store.has(normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newUser: StoredUser = {
      id: userId,
      email: normalizedEmail,
      name,
      passwordHash,
      role: 'USER',
      locale,
      preferredReciter: 7,
      createdAt: new Date(),
    };

    store.set(normalizedEmail, newUser);

    const token = await signJWT({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      locale: newUser.locale,
      preferredReciter: newUser.preferredReciter,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        locale: newUser.locale,
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
