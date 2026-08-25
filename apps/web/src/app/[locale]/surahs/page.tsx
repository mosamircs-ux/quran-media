import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { type Locale } from '@quran-media/i18n';
import { ALL_SURAHS } from '@/lib/quran-surahs';
import { generateLocalizedMetadata, generateBreadcrumbsJsonLd } from '@/lib/seo';
import { BookOpen, Sparkles, Search, Layers, Play } from 'lucide-react';

interface SurahsPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: SurahsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === 'ar';
  return generateLocalizedMetadata({
    locale,
    path: '/surahs',
    title: isAr ? 'سور القرآن الكريم (١١٤ سورة) — تلاوة مرئية وتفسير' : 'All 114 Quran Surahs — Visual Recitations & Tafsir',
    description: isAr
      ? 'فهرس شامل لجميع سور القرآن الكريم مع تلاوات مرئية بالرسم العثماني، ترجمات معتمدة، وقصص وتفاسير بالذكاء الاصطناعي'
      : 'Explore all 114 Surahs of the Holy Quran with cinematic video recitations, Uthmani calligraphy, verified translations, and AI visual stories',
    keywords: ['Quran Surahs', '114 Surahs', 'سور القرآن الكريم', 'فهرس القرآن', 'تلاوة مرئية'],
  });
}

export default async function SurahsPage({ params }: SurahsPageProps) {
  const { locale } = await params;
  const isAr = locale === 'ar';

  const breadcrumbsJsonLd = generateBreadcrumbsJsonLd([
    { name: isAr ? 'الرئيسية' : 'Home', url: `/${locale}` },
    { name: isAr ? 'سور القرآن الكريم' : 'Quran Surahs', url: `/${locale}/surahs` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      <div className="container mx-auto px-4 sm:px-8 max-w-7xl py-10 space-y-8">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isAr ? 'كتاب الله العزيز — ١١٤ سورة' : 'The Holy Quran — 114 Chapters'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {isAr ? 'فهرس سور القرآن الكريم وتلاواتها المرئية' : 'Quran Surahs & Visual Media Library'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {isAr
              ? 'تصفح سور القرآن الكريم، استمع للتلاوات المتقنة، وتدبر الآيات مع إمكانية تحويل أي آية إلى فيديو سينمائي'
              : 'Discover every chapter of the Holy Quran with high-definition audio, verified translations, and instant AI visual media generation'}
          </p>
        </div>

        {/* Surahs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ALL_SURAHS.map((surah) => (
            <Link
              key={surah.number}
              href={`/${locale}/surah/${surah.number}`}
              className="group p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition-all shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                  {surah.number}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                    {isAr ? surah.nameAr : surah.nameEn}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {surah.versesCount} {isAr ? 'آيات' : 'verses'} • {surah.revelationType}
                  </p>
                </div>
              </div>

              <div className="text-end">
                <span className="font-arabic text-sm text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  {surah.nameAr}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
