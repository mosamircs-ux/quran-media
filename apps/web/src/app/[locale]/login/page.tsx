import type { Metadata } from 'next';
import { type Locale } from '@quran-media/i18n';
import { LoginPageClient } from '@/components/auth/login-page-client';
import { generateLocalizedMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === 'ar';
  return generateLocalizedMetadata({
    locale,
    path: '/login',
    title: isAr ? 'تسجيل الدخول' : 'Sign In',
    description: isAr ? 'تسجيل الدخول إلى استوديو ميديا القرآن' : 'Sign in to Quran Media Studio',
  });
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <LoginPageClient locale={locale} initialMode="signin" />
    </div>
  );
}
