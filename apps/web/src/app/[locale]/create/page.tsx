import type { Metadata } from 'next';
import { type Locale } from '@quran-media/i18n';
import { MediaGeneratorClient } from '@/components/studio/media-generator-client';

export const metadata: Metadata = {
  title: 'Quran Media Generator — Create Cinematic Stories & Videos from Any Ayah',
  description:
    'Generate beautiful Quran-inspired visual stories and social media videos (9:16, 16:9, 1:1, 4:5) with verified Uthmani calligraphy, synchronized recitations, and bilingual subtitles.',
  openGraph: {
    title: 'Quran Media Generator — Create Cinematic Stories & Videos from Any Ayah',
    description:
      'Generate Quran videos, posters, and stories with verified text, reciter master audio, and FFmpeg rendering.',
    type: 'website',
  },
};

export default async function CreateMediaPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ surah?: string; ayah?: string }>;
}) {
  const { locale } = await params;
  const { surah, ayah } = await searchParams;

  const initialSurahId = surah ? Number(surah) : 1;
  const initialAyah = ayah ? Number(ayah) : 1;

  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-7xl py-10 space-y-10">
      <MediaGeneratorClient
        locale={locale}
        initialSurahId={initialSurahId}
        initialAyah={initialAyah}
      />
    </div>
  );
}
