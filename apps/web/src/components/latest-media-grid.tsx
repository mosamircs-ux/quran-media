'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@quran-media/i18n';
import { Film, Play, Download, Sparkles, Filter, Share2, Check } from 'lucide-react';

interface LatestMediaGridProps {
  locale: Locale;
}

interface MediaItem {
  id: string;
  titleAr: string;
  titleEn: string;
  surahAr: string;
  surahEn: string;
  ayah: string;
  ratio: '9:16' | '16:9' | '1:1' | '4:5';
  reciter: string;
  duration: string;
  views: string;
  bgGradient: string;
  arabicSnippet: string;
  englishSnippet: string;
}

const MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'med-1',
    titleAr: 'سكينة الفجر في سورة الفلق',
    titleEn: 'Dawn Tranquility in Al-Falaq',
    surahAr: 'الفلق',
    surahEn: 'Al-Falaq',
    ayah: '1-5',
    ratio: '9:16',
    reciter: 'Mishari Rashid Al-Afasy',
    duration: '0:38',
    views: '24.5K',
    bgGradient: 'from-slate-900 via-teal-950 to-slate-950',
    arabicSnippet: 'قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ',
    englishSnippet: 'Say, "I seek refuge in the Lord of daybreak..."',
  },
  {
    id: 'med-2',
    titleAr: 'سورة الملك - تلاوة سينمائية هادئة',
    titleEn: 'Surah Al-Mulk - Cinematic Night',
    surahAr: 'الملك',
    surahEn: 'Al-Mulk',
    ayah: '1-4',
    ratio: '16:9',
    reciter: 'Mahmoud Khalil Al-Husary',
    duration: '1:45',
    views: '88.2K',
    bgGradient: 'from-amber-950 via-slate-900 to-slate-950',
    arabicSnippet: 'تَبَٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ',
    englishSnippet: 'Blessed is the One in Whose Hand is the Kingdom...',
  },
  {
    id: 'med-3',
    titleAr: 'إن مع العسر يسراً - سورة الشرح',
    titleEn: 'With Hardship Comes Ease',
    surahAr: 'الشرح',
    surahEn: 'Ash-Sharh',
    ayah: '5-6',
    ratio: '1:1',
    reciter: 'AbdulBaset AbdulSamad',
    duration: '0:42',
    views: '53.1K',
    bgGradient: 'from-emerald-950 via-slate-900 to-teal-950',
    arabicSnippet: 'فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا',
    englishSnippet: 'So, surely with hardship comes ease...',
  },
  {
    id: 'med-4',
    titleAr: 'آية الكرسي - أعظم آية في كتاب الله',
    titleEn: 'Ayat Al-Kursi - The Supreme Verse',
    surahAr: 'البقرة',
    surahEn: 'Al-Baqarah',
    ayah: '255',
    ratio: '9:16',
    reciter: 'Mishari Rashid Al-Afasy',
    duration: '1:15',
    views: '142K',
    bgGradient: 'from-cyan-950 via-slate-900 to-blue-950',
    arabicSnippet: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ',
    englishSnippet: 'Allah! There is no god except Him, the Ever-Living...',
  },
  {
    id: 'med-5',
    titleAr: 'تأملات سورة الرحمن - النعم الإلهية',
    titleEn: 'Reflections on Surah Ar-Rahman',
    surahAr: 'الرحمن',
    surahEn: 'Ar-Rahman',
    ayah: '1-13',
    ratio: '16:9',
    reciter: 'Abdur-Rahman As-Sudais',
    duration: '2:10',
    views: '67.4K',
    bgGradient: 'from-slate-900 via-amber-950 to-slate-950',
    arabicSnippet: 'ٱلرَّحْمَٰنُ • عَلَّمَ ٱلْقُرْءَانَ',
    englishSnippet: 'The Most Compassionate, taught the Quran...',
  },
  {
    id: 'med-6',
    titleAr: 'سورة الإخلاص - توحيد الخالق',
    titleEn: 'Surah Al-Ikhlas - Pure Monotheism',
    surahAr: 'الإخلاص',
    surahEn: 'Al-Ikhlas',
    ayah: '1-4',
    ratio: '4:5',
    reciter: 'Hani Ar-Rifai',
    duration: '0:35',
    views: '39.8K',
    bgGradient: 'from-emerald-950 via-slate-900 to-slate-950',
    arabicSnippet: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
    englishSnippet: 'Say, "He is Allah, the One and Only..."',
  },
];

export function LatestMediaGrid({ locale }: LatestMediaGridProps) {
  const isAr = locale === 'ar';
  const [filterRatio, setFilterRatio] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = filterRatio === 'all'
    ? MEDIA_ITEMS
    : MEDIA_ITEMS.filter((item) => item.ratio === filterRatio);

  const handleShare = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="videos" className="py-20 bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="container mx-auto px-4 sm:px-8 max-w-7xl space-y-10">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold">
              <Film className="w-3.5 h-3.5" />
              <span>{isAr ? 'مكتبة الإنتاج الحديثة' : 'Latest Quran Media'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isAr ? 'أحدث المقاطع والتصاميم المرئية' : 'Freshly Synthesized Media'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              {isAr
                ? 'استعرض مقاطع الفيديو الجاهزة للاستخدام في منصات التواصل والمصممة بمختلف الأبعاد.'
                : 'Browse social-ready Quran clips synthesized in portrait (9:16), landscape (16:9), and square (1:1).'}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-200/70 dark:bg-slate-900/70 p-1.5 rounded-2xl border border-slate-300/80 dark:border-slate-800">
            {[
              { id: 'all', label: isAr ? 'الكل' : 'All Formats' },
              { id: '9:16', label: '9:16 Reels' },
              { id: '16:9', label: '16:9 YouTube' },
              { id: '1:1', label: '1:1 Square' },
              { id: '4:5', label: '4:5 Feed' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterRatio(f.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  filterRatio === f.id
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Media Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 hover:border-amber-500/40 transition-all duration-300 shadow-lg shadow-slate-950/5 dark:shadow-slate-950/40"
            >
              {/* Media Preview Box */}
              <div
                className={`relative overflow-hidden bg-gradient-to-br ${item.bgGradient} p-6 flex flex-col justify-between text-white ${
                  item.ratio === '9:16' ? 'h-72' : item.ratio === '16:9' ? 'h-52' : 'h-60'
                }`}
              >
                {/* Top Badges */}
                <div className="flex items-center justify-between z-10">
                  <span className="px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-[11px] font-bold text-amber-300 backdrop-blur-md">
                    {item.ratio}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-[11px] font-semibold text-slate-300 backdrop-blur-md">
                    {item.duration}
                  </span>
                </div>

                {/* Calligraphy Ayah Snippet */}
                <div className="text-center my-auto z-10 space-y-2">
                  <p dir="rtl" className="font-quran text-2xl leading-relaxed text-amber-100 drop-shadow">
                    {item.arabicSnippet}
                  </p>
                  <p className="text-xs text-slate-300 italic line-clamp-1">
                    {item.englishSnippet}
                  </p>
                </div>

                {/* Hover Play Overlay */}
                <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-opacity flex items-center justify-center gap-3 z-20">
                  <Link
                    href={`/${locale}#create`}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xl transform scale-90 group-hover:scale-100 transition-all cursor-pointer"
                  >
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </Link>
                </div>
              </div>

              {/* Card Bottom Content */}
              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {isAr ? `سورة ${item.surahAr} [${item.ayah}]` : `Surah ${item.surahEn} [${item.ayah}]`}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {isAr ? item.titleAr : item.titleEn}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {item.reciter}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {item.views} {isAr ? 'مشاهدة' : 'views'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleShare(item.id, `${item.arabicSnippet} - ${item.surahEn}`)}
                      aria-label="Share media"
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <Link
                      href={`/${locale}#create`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-500/20 transition-all"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{isAr ? 'تعديل' : 'Remix'}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
