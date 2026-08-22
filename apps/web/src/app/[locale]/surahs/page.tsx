import type { Metadata } from 'next';
import { type Locale } from '@quran-media/i18n';
import { ALL_114_SURAHS } from '@/lib/surahs-catalog';
import { SurahsListClient } from '@/components/surah-explorer/surahs-list-client';

export const metadata: Metadata = {
  title: 'Surah Explorer — All 114 Surahs of the Holy Quran',
  description:
    'Explore all 114 Surahs of the Holy Quran. Listen to full chapter recitations, read scholarly commentary, and transform verses into visual stories and cinematic video media.',
  openGraph: {
    title: 'Surah Explorer — All 114 Surahs of the Holy Quran',
    description:
      'Browse all 114 chapters of the Quran with instant audio streaming, tafsir, and AI media generators.',
    type: 'website',
  },
};

export default async function SurahsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-7xl py-10 space-y-10">
      <SurahsListClient allSurahs={ALL_114_SURAHS} locale={locale} />
    </div>
  );
}
