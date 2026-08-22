'use client';

import React from 'react';
import Link from 'next/link';
import type { Locale } from '@quran-media/i18n';
import { BookOpen, Sparkles, Compass } from 'lucide-react';

interface PopularSurahsProps {
  locale: Locale;
}

interface SurahCardItem {
  id: number;
  nameAr: string;
  nameEn: string;
  meaningEn: string;
  versesCount: number;
  revelationPlace: 'makkah' | 'madinah';
  themeAr: string;
  themeEn: string;
}

const POPULAR_SURAHS: SurahCardItem[] = [
  {
    id: 1,
    nameAr: 'الفاتحة',
    nameEn: 'Al-Fatihah',
    meaningEn: 'The Opener',
    versesCount: 7,
    revelationPlace: 'makkah',
    themeAr: 'أم الكتاب وأعظم سور القرآن',
    themeEn: 'The Essence of the Quran & Opening',
  },
  {
    id: 18,
    nameAr: 'الكهف',
    nameEn: 'Al-Kahf',
    meaningEn: 'The Cave',
    versesCount: 110,
    revelationPlace: 'makkah',
    themeAr: 'نور الجمعة وعصمة من الفتن',
    themeEn: 'Protection from Trials & Divine Light',
  },
  {
    id: 36,
    nameAr: 'يس',
    nameEn: 'Ya-Sin',
    meaningEn: 'Ya-Sin',
    versesCount: 83,
    revelationPlace: 'makkah',
    themeAr: 'قلب القرآن وبراهين البعث',
    themeEn: 'Heart of the Quran & Resurrection',
  },
  {
    id: 55,
    nameAr: 'الرحمن',
    nameEn: 'Ar-Rahman',
    meaningEn: 'The Beneficent',
    versesCount: 78,
    revelationPlace: 'madinah',
    themeAr: 'عروس القرآن والنعم الباهرة',
    themeEn: 'Beauty of Creation & Divine Favors',
  },
  {
    id: 56,
    nameAr: 'الواقعة',
    nameEn: 'Al-Waqi\'ah',
    meaningEn: 'The Inevitable',
    versesCount: 96,
    revelationPlace: 'makkah',
    themeAr: 'أهوال القيامة ومنازل السابقين',
    themeEn: 'The Hereafter & Ranks of Believers',
  },
  {
    id: 67,
    nameAr: 'الملك',
    nameEn: 'Al-Mulk',
    meaningEn: 'The Sovereignty',
    versesCount: 30,
    revelationPlace: 'makkah',
    themeAr: 'المانعة المنجية من عذاب القبر',
    themeEn: 'Protection from the Grave & Dominion',
  },
  {
    id: 112,
    nameAr: 'الإخلاص',
    nameEn: 'Al-Ikhlas',
    meaningEn: 'Purity of Faith',
    versesCount: 4,
    revelationPlace: 'makkah',
    themeAr: 'تعدل ثلث القرآن في التوحيد',
    themeEn: 'One-Third of the Quran in Monotheism',
  },
  {
    id: 114,
    nameAr: 'الناس',
    nameEn: 'An-Nas',
    meaningEn: 'Mankind',
    versesCount: 6,
    revelationPlace: 'makkah',
    themeAr: 'الاستعاذة برب الناس من الوسواس',
    themeEn: 'Seeking Refuge in the Lord of Mankind',
  },
];

export function PopularSurahs({ locale }: PopularSurahsProps) {
  const isAr = locale === 'ar';

  return (
    <section id="surahs" className="py-20 bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="container mx-auto px-4 sm:px-8 max-w-7xl space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold">
              <Compass className="w-3.5 h-3.5" />
              <span>{isAr ? 'فهرس السور المباركة' : 'Iconic Quranic Surahs'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isAr ? 'السور الأكثر تلاوة وإنتاجاً' : 'Popular Surahs for Media'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              {isAr
                ? 'اختر من بين السور العظيمة لتوليد سلاسل مقاطع وتلاوات مرئية كاملة أو مجزأة.'
                : 'Explore iconic chapters with quick pre-configured media templates and scholarly context.'}
            </p>
          </div>

          <Link
            href={`/${locale}#create`}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors"
          >
            {isAr ? 'عرض كافة السور الـ 114 ←' : 'Browse All 114 Surahs →'}
          </Link>
        </div>

        {/* Surahs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {POPULAR_SURAHS.map((surah) => (
            <Link
              key={surah.id}
              href={`/${locale}#create`}
              className="group relative flex flex-col justify-between p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-200 shadow-sm hover:shadow-lg"
            >
              <div className="space-y-3">
                {/* Surah Number Badge & Revelation Place */}
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-amber-600 dark:text-amber-400 border border-slate-200 dark:border-slate-700">
                    {surah.id}
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {isAr
                      ? surah.revelationPlace === 'makkah' ? 'مكية' : 'مدنية'
                      : surah.revelationPlace}
                  </span>
                </div>

                {/* Surah Titles */}
                <div className="space-y-1">
                  <h3 className="font-quran text-2xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                    سورة {surah.nameAr}
                  </h3>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {surah.nameEn} <span className="font-normal text-slate-400">({surah.meaningEn})</span>
                  </p>
                </div>

                {/* Theme Description */}
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {isAr ? surah.themeAr : surah.themeEn}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span>{surah.versesCount} {isAr ? 'آيات' : 'verses'}</span>
                <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 group-hover:underline">
                  <Sparkles className="w-3 h-3" />
                  {isAr ? 'إنتاج' : 'Studio'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
