import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { verifyJWT, signJWT, type UserTokenPayload } from './jwt';

export const SESSION_COOKIE_NAME = 'quran_media_session';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: 'USER' | 'CREATOR' | 'ADMIN';
  locale: string;
  preferredReciter: number;
}

// In-memory demo/active users store for fast response and instant fallback
export interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash?: string;
  image?: string;
  role: 'USER' | 'CREATOR' | 'ADMIN';
  locale: string;
  preferredReciter: number;
  createdAt: Date;
}

// Pre-seeded demo account for one-click testing
export const DEMO_USER: StoredUser = {
  id: 'usr_demo_creator_01',
  email: 'creator@quranmedia.studio',
  name: 'محمد القاسمي',
  image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'CREATOR',
  locale: 'ar',
  preferredReciter: 7, // Mishari Rashid Alafasy
  createdAt: new Date('2026-01-01'),
};

declare global {
  // eslint-disable-next-line no-var
  var globalUserStore: Map<string, StoredUser> | undefined;
}

export function getUserStore(): Map<string, StoredUser> {
  if (!globalThis.globalUserStore) {
    globalThis.globalUserStore = new Map<string, StoredUser>();
    globalThis.globalUserStore.set(DEMO_USER.email.toLowerCase(), DEMO_USER);
  }
  return globalThis.globalUserStore;
}

/**
 * Extracts and verifies the session user from cookies or Authorization header
 */
export async function getCurrentUser(request?: NextRequest | Request): Promise<AuthUser | null> {
  try {
    let token: string | undefined;

    if (request) {
      // Check Authorization Bearer header
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }

      // Check cookie in request
      if (!token && 'cookies' in request && typeof request.cookies.get === 'function') {
        token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
      }
    }

    // Fall back to Next.js cookies() API
    if (!token) {
      try {
        const cookieStore = await cookies();
        token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
      } catch {
        // cookies() might not be available in standard handlers
      }
    }

    if (!token) {
      return null;
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return null;
    }

    const store = getUserStore();
    const stored = Array.from(store.values()).find((u) => u.id === payload.userId);

    return {
      id: payload.userId,
      email: payload.email,
      name: stored?.name || payload.name,
      image: stored?.image,
      role: stored?.role || payload.role,
      locale: stored?.locale || payload.locale,
      preferredReciter: stored?.preferredReciter || payload.preferredReciter || 7,
    };
  } catch {
    return null;
  }
}

/**
 * Ensures user is authenticated or throws a 401 response
 */
export async function requireAuth(request?: NextRequest | Request): Promise<AuthUser> {
  const user = await getCurrentUser(request);
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

/**
 * Sets session cookie on an outgoing response
 */
export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
}

/**
 * Clears session cookie on logout
 */
export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
