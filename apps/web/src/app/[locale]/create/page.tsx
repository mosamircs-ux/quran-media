import type { Metadata } from 'next';
import Link from 'next/link';
import { type Locale } from '@quran-media/i18n';
import { MediaGeneratorClient } from '@/components/studio/media-generator-client';
import { Sparkles, Video, Feather } from 'lucide-react';

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
  const isAr = locale === 'ar';

  const initialSurahId = surah ? Number(surah) : 1;
  const initialAyah = ayah ? Number(ayah) : 1;

  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-7xl py-10 space-y-10">
      {/* Studio Mode Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 shadow-sm">
              <Video className="w-3.5 h-3.5" />
              <span>{isAr ? 'استوديو الفيديو والمقاطع' : 'Video Media Studio'}</span>
            </span>

            <Link
              href={`/${locale}/create/story`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Feather className="w-3.5 h-3.5 text-amber-500" />
              <span>{isAr ? 'صانع القصص والمشاهد بالذكاء الاصطناعي' : 'AI Story Generator'}</span>
            </Link>
          </div>
        </div>

        <Link
          href={`/${locale}/create/story`}
          className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isAr ? 'جرب صانع القصص والمشاهد الآن ➔' : 'Try AI Story Generator ➔'}</span>
        </Link>
      </div>

      <MediaGeneratorClient
        locale={locale}
        initialSurahId={initialSurahId}
        initialAyah={initialAyah}
      />
    </div>
  );
}

