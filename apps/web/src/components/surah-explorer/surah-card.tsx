'use client';

import React from 'react';
import Link from 'next/link';
import type { Locale } from '@quran-media/i18n';
import type { SurahExtendedMeta } from '@/lib/surahs-catalog';
import { Film, BookOpen, Image as ImageIcon, Sparkles, Compass, ArrowUpRight } from 'lucide-react';

interface SurahCardProps {
  surah: SurahExtendedMeta;
  locale: Locale;
}

export function SurahCard({ surah, locale }: SurahCardProps) {
  const isAr = locale === 'ar';

  return (
    <Link
      href={`/${locale}/surah/${surah.id}`}
      className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 hover:border-amber-500/50 hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-2xl"
    >
      <div className="space-y-4">
        {/* Top Header: Number & Revelation Badge */}
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
            {surah.id}
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                surah.revelationPlace === 'makkah'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20'
              }`}
            >
              {isAr
                ? surah.revelationPlace === 'makkah' ? 'مكية' : 'مدنية'
                : surah.revelationPlace}
            </span>

            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
              {surah.versesCount} {isAr ? 'آيات' : 'verses'}
            </span>
          </div>
        </div>

        {/* Surah Arabic & English Titles */}
        <div className="space-y-1 pt-1">
          <h3 className="font-quran text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
            سورة {surah.nameAr}
          </h3>
          <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
            {surah.nameEn} <span className="font-normal text-slate-400">({surah.meaningEn})</span>
          </p>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
          {isAr ? surah.shortDescAr : surah.shortDescEn}
        </p>
      </div>

      {/* Footer: Featured Media Stats & Arrow */}
      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Film className="w-3 h-3 text-amber-500" />
            <span>{surah.featuredMedia.videos}</span>
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-emerald-500" />
            <span>{surah.featuredMedia.stories}</span>
          </span>
          <span className="flex items-center gap-1">
            <ImageIcon className="w-3 h-3 text-teal-500" />
            <span>{surah.featuredMedia.images}</span>
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
          <span>{isAr ? 'تصفح' : 'Open'}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
}
