import type { Metadata } from 'next';
import { type Locale } from '@quran-media/i18n';
import { AdminDashboardClient } from '@/components/admin/admin-dashboard-client';
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
    path: '/admin',
    title: isAr ? 'لوحة تحكم وإدارة النظام' : 'Executive Admin Dashboard',
    description: isAr
      ? 'إدارة محتوى المنصة، المستخدمين، طوابير التصيير ومزودي الذكاء الاصطناعي'
      : 'Enterprise administrative panel for Quran Media Studio operations',
  });
}

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-7xl py-10">
      <AdminDashboardClient locale={locale} />
    </div>
  );
}
