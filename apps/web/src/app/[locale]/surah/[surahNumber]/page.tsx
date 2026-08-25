import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { type Locale } from '@quran-media/i18n';
import { getSurahMeta } from '@/lib/quran-surahs';
import { generateLocalizedMetadata, generateBreadcrumbsJsonLd } from '@/lib/seo';
import { Sparkles, Play, Bookmark, BookOpen, Volume2, ArrowRight, ArrowLeft } from 'lucide-react';

export const revalidate = 86400; // 24 hours ISR

interface SurahPageProps {
  params: Promise<{
    locale: Locale;
    surahNumber: string;
  }>;
}

export async function generateMetadata({ params }: SurahPageProps): Promise<Metadata> {
  const { locale, surahNumber } = await params;
  const sNum = parseInt(surahNumber, 10);
  const surah = getSurahMeta(sNum);
  const isAr = locale === 'ar';

  return generateLocalizedMetadata({
    locale,
    path: `/surah/${sNum}`,
    title: isAr
      ? `سورة ${surah.nameAr} (${surah.nameTranslation}) — تلاوة مرئية وقصص`
      : `Surah ${surah.nameEn} (${surah.nameTranslation}) — Quran Chapter ${sNum}`,
    description: isAr
      ? `اقرأ واستمع لسورة ${surah.nameAr} (${surah.versesCount} آية). تلاوة بالرسم العثماني، ترجمة معتمدة، وتفسير مفصل مع إنتاج فيديو بالذكاء الاصطناعي.`
      : `Read and listen to Surah ${surah.nameEn} (${surah.versesCount} verses, ${surah.revelationType}). Uthmani text, English translation, and AI video generator.`,
    keywords: [`Surah ${surah.nameEn}`, `سورة ${surah.nameAr}`, `Quran chapter ${sNum}`, 'Tafsir', 'Quran Media'],
  });
}

export default async function SurahPage({ params }: SurahPageProps) {
  const { locale, surahNumber } = await params;
  const sNum = parseInt(surahNumber, 10);
  const surah = getSurahMeta(sNum);
  const isAr = locale === 'ar';

  const breadcrumbsJsonLd = generateBreadcrumbsJsonLd([
    { name: isAr ? 'الرئيسية' : 'Home', url: `/${locale}` },
    { name: isAr ? 'سور القرآن' : 'Surahs', url: `/${locale}/surahs` },
    { name: isAr ? `سورة ${surah.nameAr}` : surah.nameEn, url: `/${locale}/surah/${sNum}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      <div className="container mx-auto px-4 sm:px-8 max-w-5xl py-10 space-y-8">
        {/* Navigation Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Link href={`/${locale}`} className="hover:text-amber-500 transition-colors">
            {isAr ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <Link href={`/${locale}/surahs`} className="hover:text-amber-500 transition-colors">
            {isAr ? 'سور القرآن' : 'Surahs'}
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-bold">
            {isAr ? `سورة ${surah.nameAr}` : `Surah ${surah.nameEn}`}
          </span>
        </nav>

        {/* Surah Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 border border-slate-800 p-8 sm:p-10 text-white shadow-2xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {surah.revelationType} • {surah.versesCount} {isAr ? 'آيات' : 'verses'}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white">
            {isAr ? `سورة ${surah.nameAr}` : `Surah ${surah.nameEn}`}
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">{surah.nameTranslation}</p>

          <div className="pt-4 flex items-center justify-center gap-3">
            <Link
              href={`/${locale}/create/story?surah=${sNum}&ayah=1`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAr ? 'إنتاج قصة مرئية بالذكاء الاصطناعي' : 'Generate Visual Story'}</span>
            </Link>
          </div>
        </div>

        {/* Verse Quick Navigation Matrix */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white">
            {isAr ? 'آيات السورة (اضغط لفتح صفحة الآية والتلاوة)' : 'Verses of the Surah (Click to view recitation & media)'}
          </h3>

          <div className="flex flex-wrap gap-2">
            {Array.from({ length: Math.min(surah.versesCount, 50) }, (_, i) => i + 1).map((ayah) => (
              <Link
                key={ayah}
                href={`/${locale}/ayah/${sNum}/${ayah}`}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center transition-colors"
              >
                {ayah}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
