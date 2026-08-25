import { NextResponse, type NextRequest } from 'next/server';
import { LOCALES, DEFAULT_LOCALE, type Locale } from '@quran-media/i18n';
import { checkRateLimit } from './lib/security/rate-limiter';

const CSP_HEADER = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://images.unsplash.com https://*.googleusercontent.com https://*.amazonaws.com https://commondatastorage.googleapis.com",
  "media-src 'self' blob: https://commondatastorage.googleapis.com https://everyayah.com",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://* ws: wss:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';

  // 1. API Security: Apply Rate Limiting on API routes
  if (pathname.startsWith('/api')) {
    const tier = pathname.startsWith('/api/auth')
      ? 'auth'
      : pathname.startsWith('/api/generations')
      ? 'generations'
      : pathname.startsWith('/api/media')
      ? 'upload'
      : 'api';

    const limitResult = checkRateLimit(ip, tier);
    if (!limitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too Many Requests — Rate limit exceeded. Please retry shortly.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((limitResult.resetTime - Date.now()) / 1000)),
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
          },
        }
      );
    }
  }

  // 2. Ignore static assets and system files
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    const response = NextResponse.next();
    applySecurityHeaders(response);
    return response;
  }

  // 3. Check if pathname already has a supported locale
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    const response = NextResponse.next();
    applySecurityHeaders(response);
    return response;
  }

  // 4. Determine preferred locale from cookie, headers, or default
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value as Locale | undefined;
  let locale: Locale = DEFAULT_LOCALE;

  if (cookieLocale && LOCALES.includes(cookieLocale)) {
    locale = cookieLocale;
  } else {
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage && acceptLanguage.includes('en') && !acceptLanguage.includes('ar')) {
      locale = 'en';
    }
  }

  request.nextUrl.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(request.nextUrl);
  response.cookies.set('NEXT_LOCALE', locale, { path: '/', maxAge: 31536000, sameSite: 'lax' });
  applySecurityHeaders(response);
  return response;
}

function applySecurityHeaders(response: NextResponse): void {
  response.headers.set('Content-Security-Policy', CSP_HEADER);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
