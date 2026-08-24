import type { Metadata } from 'next';
import { type Locale } from '@quran-media/i18n';
import { StudioDashboardClient } from '@/components/studio/studio-dashboard-client';

import { generateLocalizedMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generateLocalizedMetadata({
    locale,
    path: '/studio',
    pageKey: 'studio',
  });
}

export default async function StudioPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-7xl py-10">
      <StudioDashboardClient locale={locale} />
    </div>
  );
}
