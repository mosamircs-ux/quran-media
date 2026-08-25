import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { type Locale } from '@quran-media/i18n';
import { generateLocalizedMetadata, FAMOUS_AYAHS } from '@/lib/seo';
import { Bookmark, Sparkles, BookOpen, ChevronRight, ChevronLeft } from 'lucide-react';

interface AyahsIndexPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: AyahsIndexPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === 'ar';
  return generateLocalizedMetadata({
    locale,
    path: '/ayahs',
    title: isAr ? 'أشهر الآيات القرآنية — تلاوة مرئية وتدبر بالذكاء الاصطناعي' : 'Famous Quranic Verses — Visual Recitations & AI Tafsir',
    description: isAr
      ? 'استكشف أشهر الآيات القرآنية: آية الكرسي، خواتيم سورة البقرة، آية النور، مع تلاوات خاشعة وتفسير وإنتاج فيديوهات'
      : 'Explore famous Quran verses including Ayat al-Kursi, Amanar-Rasul, Verse of Light with cinematic video recitations',
    keywords: ['Ayat al-Kursi', 'Famous Quran verses', 'آية الكرسي', 'آيات القرآن', 'تلاوات خاشعة'],
  });
}

export default async function AyahsIndexPage({ params }: AyahsIndexPageProps) {
  const { locale } = await params;
  const isAr = locale === 'ar';

  const famousList = Object.entries(FAMOUS_AYAHS).map(([key, val]) => {
    const parts = key.split(':');
    const s = parts[0] || '1';
    const a = parts[1] || '1';
    return {
      surahNumber: parseInt(s, 10),
      ayahNumber: parseInt(a, 10),
      verseKey: key,
      titleAr: val.titleAr,
      titleEn: val.titleEn,
    };
  });

  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-6xl py-10 space-y-8">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <Bookmark className="w-3.5 h-3.5" />
          <span>{isAr ? 'درر الآيات الكريمة' : 'Gems of the Quran'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {isAr ? 'أشهر الآيات القرآنية والتلاوات المرئية' : 'Curated Quranic Verses & Reflections'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {isAr
            ? 'تصفح باقة من أعظم آيات كتاب الله مع التفسير المعتمد والتلاوة الصوتية والإنتاج المرئي السينمائي'
            : 'Select any verse to access certified Uthmani script, multi-language translations, classical commentaries, and direct video creation'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {famousList.map((item) => (
          <Link
            key={item.verseKey}
            href={`/${locale}/ayah/${item.surahNumber}/${item.ayahNumber}`}
            className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition-all shadow-sm flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                Quran {item.verseKey}
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                {isAr ? item.titleAr : item.titleEn}
              </h3>
              <p className="text-xs text-slate-400">
                {isAr ? `سورة رقم ${item.surahNumber} • آية ${item.ayahNumber}` : `Surah ${item.surahNumber}, Verse ${item.ayahNumber}`}
              </p>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
