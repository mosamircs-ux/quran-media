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
    path: '/signup',
    title: isAr ? 'إنشاء حساب جديد' : 'Sign Up',
    description: isAr ? 'إنشاء حساب جديد في استوديو ميديا القرآن' : 'Create an account in Quran Media Studio',
  });
}

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <LoginPageClient locale={locale} initialMode="signup" />
    </div>
  );
}
