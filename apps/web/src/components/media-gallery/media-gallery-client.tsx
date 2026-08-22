'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Locale } from '@quran-media/i18n';
import type { MediaShowcaseItem } from '@/lib/media-catalog';
import {
  Film,
  Search,
  Play,
  Download,
  Share2,
  Sparkles,
  Smartphone,
  Monitor,
  Square,
  X,
  Volume2,
  Eye,
  ArrowUpRight,
} from 'lucide-react';

interface MediaGalleryClientProps {
  mediaItems: MediaShowcaseItem[];
  locale: Locale;
}

export function MediaGalleryClient({ mediaItems, locale }: MediaGalleryClientProps) {
  const isAr = locale === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [ratioFilter, setRatioFilter] = useState<string>('all');
  const [reciterFilter, setReciterFilter] = useState<string>('all');

  const filteredItems = useMemo(() => {
    let list = [...mediaItems];

    if (ratioFilter !== 'all') {
      list = list.filter((m) => m.aspectRatio === ratioFilter);
    }

    if (reciterFilter !== 'all') {
      list = list.filter((m) => m.reciterName.includes(reciterFilter));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (m) =>
          m.titleAr.includes(q) ||
          m.titleEn.toLowerCase().includes(q) ||
          m.surahNameEn.toLowerCase().includes(q) ||
          m.surahNameAr.includes(q) ||
          m.arabicText.includes(q) ||
          m.translation.toLowerCase().includes(q)
      );
    }

    return list;
  }, [mediaItems, ratioFilter, reciterFilter, searchQuery]);

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-xl space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
            <Film className="w-3.5 h-3.5" />
            <span>{isAr ? 'مكتبة المقاطع والوسائط المرئية' : 'Public Quran Video Showcase'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isAr ? 'مقاطع قرآنية سينمائية جاهزة للنشر' : 'Cinematic Quran Videos & Shorts'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            {isAr
              ? 'تصفح مقاطع الفيديو المنتجة بمختلف الأبعاد (9:16 ريلز، 16:9 يوتيوب، 1:1 مربع) بجودة 4K وتلاوات بأعلى نقاء صوتي.'
              : 'Browse 4K Quran videos formatted for TikTok, Reels, and YouTube with synchronized subtitles, ready for download and remixing.'}
          </p>
        </div>

        {/* Search Input Box */}
        <div className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2 left-4 rtl:left-auto rtl:right-4 w-5 h-5 text-amber-500 pointer-events-none" />
          <input
            type="text"
            placeholder={
              isAr
                ? 'ابحث باسم السورة أو الآية أو القارئ (الملك، الرحمن، العفاسي)...'
                : 'Search videos by Surah, verse key, or reciter (e.g. Mulk, Rahman, Afasy)...'
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

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          
          {/* Aspect Ratio Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            {[
              { id: 'all', label: isAr ? 'كافة التنسيقات' : 'All Formats' },
              { id: '9:16', label: '9:16 Reels' },
              { id: '16:9', label: '16:9 YouTube' },
              { id: '1:1', label: '1:1 Square' },
              { id: '4:5', label: '4:5 Feed' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setRatioFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  ratioFilter === f.id
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Reciter Filter */}
          <div className="flex items-center gap-2 text-xs">
            <Volume2 className="w-4 h-4 text-amber-500" />
            <select
              value={reciterFilter}
              onChange={(e) => setReciterFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
            >
              <option value="all">{isAr ? 'كافة القراء' : 'All Reciters'}</option>
              <option value="Afasy">مشاري العفاسي (Al-Afasy)</option>
              <option value="Husary">محمود خليل الحصري (Al-Husary)</option>
              <option value="AbdulBaset">عبد الباسط عبد الصمد (AbdulBaset)</option>
              <option value="Sudais">عبد الرحمن السديس (As-Sudais)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Media Grid Cards */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              href={`/${locale}/media/${item.id}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 hover:border-amber-500/50 hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-2xl"
            >
              {/* Media Preview Box */}
              <div
                className={`relative overflow-hidden bg-gradient-to-br ${item.gradient} p-6 flex flex-col justify-between text-white ${
                  item.aspectRatio === '9:16' ? 'h-72' : item.aspectRatio === '16:9' ? 'h-52' : 'h-60'
                }`}
              >
                <div className="flex items-center justify-between z-10">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-[10px] font-bold text-amber-300 backdrop-blur-md">
                    {item.aspectRatio} • {item.resolution}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-[10px] font-semibold text-slate-300 backdrop-blur-md">
                    {item.duration}
                  </span>
                </div>

                <div className="text-center my-auto z-10 space-y-2">
                  <p dir="rtl" className="font-quran text-2xl leading-relaxed text-amber-100 drop-shadow">
                    {item.arabicText.slice(0, 50)}...
                  </p>
                  <p className="text-xs text-slate-300 italic line-clamp-1">
                    {item.translation}
                  </p>
                </div>

                {/* Hover Play Indicator */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 backdrop-blur-xs transition-opacity flex items-center justify-center z-20">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 shadow-xl transform scale-90 group-hover:scale-100 transition-all">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Card Bottom Body */}
              <div className="p-5 space-y-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {isAr ? `سورة ${item.surahNameAr} [${item.ayahRange}]` : `Surah ${item.surahNameEn} [${item.ayahRange}]`}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-amber-500 transition-colors">
                    {isAr ? item.titleAr : item.titleEn}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {item.reciterName}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>{item.viewsCount} {isAr ? 'مشاهدة' : 'views'}</span>
                  <div className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                    <span>{isAr ? 'مشاهدة الفيديو' : 'Watch'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 p-8">
          <div className="text-4xl">🎬</div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {isAr ? 'لم يتم العثور على مقاطع مطابقة' : 'No Matching Videos Found'}
          </h3>
          <button
            onClick={() => { setSearchQuery(''); setRatioFilter('all'); setReciterFilter('all'); }}
            className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow"
          >
            {isAr ? 'إعادة ضبط البحث' : 'Clear Filters'}
          </button>
        </div>
      )}

    </div>
  );
}
