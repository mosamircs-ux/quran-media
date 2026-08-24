import type { Metadata } from 'next';
import { type Locale } from '@quran-media/i18n';
import { DashboardClient } from '@/components/dashboard/dashboard-client';
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
    path: '/dashboard',
    title: isAr ? 'لوحة التحكم ومكتبة الوسائط' : 'User Dashboard & Media Library',
    description: isAr
      ? 'إدارة مشاريع الفيديو القرآني، الفيديوهات المصيرة، الصور، والآيات المحفوظة'
      : 'Manage private Quran video projects, rendered media, saved ayahs, and story bookmarks',
  });
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-7xl py-10">
      <DashboardClient locale={locale} />
    </div>
  );
}
