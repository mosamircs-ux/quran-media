import { NextResponse, type NextRequest } from 'next/server';
import { LOCALES, DEFAULT_LOCALE, type Locale } from '@quran-media/i18n';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Ignore static assets, api routes, and system files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a supported locale
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Determine preferred locale from headers
  const acceptLanguage = request.headers.get('accept-language');
  let locale: Locale = DEFAULT_LOCALE;

  if (acceptLanguage && acceptLanguage.includes('en') && !acceptLanguage.includes('ar')) {
    locale = 'en';
  }

  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
