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

  // Determine preferred locale from cookie, headers, or default
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
  // Ensure cookie is set
  response.cookies.set('NEXT_LOCALE', locale, { path: '/', maxAge: 31536000, sameSite: 'lax' });
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
