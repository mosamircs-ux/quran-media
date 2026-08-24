import type { Metadata } from 'next';
import { type Locale } from '@quran-media/i18n';
import { StudioDashboardClient } from '@/components/studio/studio-dashboard-client';

export const metadata: Metadata = {
  title: 'Media Generation Studio — Quran Media',
  description: 'Manage, customize, and render high-DPI Quranic video productions, recitations, and stories.',
  openGraph: {
    title: 'Media Generation Studio — Quran Media',
    description: 'Real-time studio dashboard for generating cinematic Quran media with FFmpeg and AI.',
    type: 'website',
  },
};

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
