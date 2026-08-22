'use client';

import React, { useState, useMemo } from 'react';
import type { Locale } from '@quran-media/i18n';
import type { SurahExtendedMeta } from '@/lib/surahs-catalog';
import { SurahCard } from './surah-card';
import {
  Search,
  SlidersHorizontal,
  Compass,
  LayoutGrid,
  List,
  X,
  ArrowUpDown,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';

interface SurahsListClientProps {
  allSurahs: SurahExtendedMeta[];
  locale: Locale;
}

export function SurahsListClient({ allSurahs, locale }: SurahsListClientProps) {
  const isAr = locale === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [placeFilter, setPlaceFilter] = useState<'all' | 'makkah' | 'madinah'>('all');
  const [sortBy, setSortBy] = useState<'number' | 'revelation' | 'verses_desc' | 'name'>('number');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredSurahs = useMemo(() => {
    let list = [...allSurahs];

    // 1. Revelation Place Filter
    if (placeFilter !== 'all') {
      list = list.filter((s) => s.revelationPlace === placeFilter);
    }

    // 2. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (s) =>
          String(s.id).includes(q) ||
          s.nameAr.includes(q) ||
          s.nameEn.toLowerCase().includes(q) ||
          s.meaningEn.toLowerCase().includes(q)
      );
    }

    // 3. Sorting
    list.sort((a, b) => {
      if (sortBy === 'number') return a.id - b.id;
      if (sortBy === 'revelation') return a.revelationOrder - b.revelationOrder;
      if (sortBy === 'verses_desc') return b.versesCount - a.versesCount;
      if (sortBy === 'name') return a.nameEn.localeCompare(b.nameEn);
      return 0;
    });

    return list;
  }, [allSurahs, placeFilter, searchQuery, sortBy]);

  return (
    <div className="space-y-8">
      
      {/* Top Search & Filter Bar */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-xl space-y-6">
        
        {/* Headline */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isAr ? 'فهرس سور القرآن الكريم (114 سورة)' : 'Surahs of the Holy Quran (114 Surahs)'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {isAr
                ? 'استعرض كافة السور الكريمة، واستمع للتلاوات الكاملة، وولد مقاطع وقصصاً سينمائية لكل آية.'
                : 'Browse all 114 Surahs with complete recitation streaming, scholarly tafsir, and AI media generators.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              {filteredSurahs.length} {isAr ? 'سورة معروضة' : 'Surahs'}
            </span>
          </div>
        </div>

        {/* Search Input Box */}
        <div className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2 left-4 rtl:left-auto rtl:right-4 w-5 h-5 text-amber-500 pointer-events-none" />
          <input
            type="text"
            placeholder={
              isAr
                ? 'ابحث باسم السورة (مثال: الكهف، البقرة) أو بالإنجليزية (Al-Kahf) أو بالرقم (18)...'
                : 'Search by Surah name, translation, or chapter number (e.g. 18, Al-Kahf, The Cave)...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-12 rtl:pr-12 rtl:pl-12 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute top-1/2 -translate-y-1/2 right-4 rtl:right-auto rtl:left-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Toolbar: Filters, Sorting & View Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          
          {/* Revelation Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            {[
              { id: 'all', label: isAr ? 'كافة السور' : 'All' },
              { id: 'makkah', label: isAr ? 'مكية (86)' : 'Meccan (86)' },
              { id: 'madinah', label: isAr ? 'مدنية (28)' : 'Medinan (28)' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setPlaceFilter(item.id as 'all' | 'makkah' | 'madinah')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  placeFilter === item.id
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Sort & View Controls */}
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold"
              >
                <option value="number">{isAr ? 'الترتيب المصحفي (1 ← 114)' : 'Quran Order (1 to 114)'}</option>
                <option value="revelation">{isAr ? 'ترتيب النزول' : 'Revelation Order'}</option>
                <option value="verses_desc">{isAr ? 'عدد الآيات (الأطول أولاً)' : 'Verses Count (High to Low)'}</option>
                <option value="name">{isAr ? 'أبجدياً بالإنجليزية' : 'Alphabetical'}</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  viewMode === 'grid' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  viewMode === 'list' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Surahs Grid or List View */}
      {filteredSurahs.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSurahs.map((surah) => (
              <SurahCard key={surah.id} surah={surah} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSurahs.map((surah) => (
              <Link
                key={surah.id}
                href={`/${locale}/surah/${surah.id}`}
                className="group flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 hover:border-amber-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-500/20">
                    {surah.id}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                      {surah.nameEn} <span className="font-normal text-slate-400">({surah.meaningEn})</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      {surah.versesCount} {isAr ? 'آية' : 'verses'} • {surah.revelationPlace}
                    </p>
                  </div>
                </div>

                <div className="text-end">
                  <span className="font-quran text-2xl font-bold text-slate-900 dark:text-amber-100 group-hover:text-amber-500 transition-colors">
                    سورة {surah.nameAr}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )
      ) : (
        <div className="py-20 text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 p-8">
          <div className="text-4xl">📖</div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {isAr ? 'لم يتم العثور على سور مطابقة' : 'No Matching Surahs Found'}
          </h3>
          <button
            onClick={() => { setSearchQuery(''); setPlaceFilter('all'); }}
            className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow"
          >
            {isAr ? 'إعادة ضبط البحث' : 'Clear Search'}
          </button>
        </div>
      )}

    </div>
  );
}
