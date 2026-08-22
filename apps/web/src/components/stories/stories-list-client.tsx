'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Locale } from '@quran-media/i18n';
import type { QuranStory } from '@/lib/stories-catalog';
import {
  Search,
  BookOpen,
  Sparkles,
  Clock,
  Volume2,
  ArrowUpRight,
  Filter,
  Play,
  Layers,
  X,
} from 'lucide-react';

interface StoriesListClientProps {
  stories: QuranStory[];
  locale: Locale;
}

export function StoriesListClient({ stories, locale }: StoriesListClientProps) {
  const isAr = locale === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', labelAr: 'كافة القصص', labelEn: 'All Stories' },
    { id: 'prophets', labelAr: 'قصص الأنبياء', labelEn: 'Prophets' },
    { id: 'faith', labelAr: 'عصمة الإيمان والابتلاء', labelEn: 'Faith & Trials' },
    { id: 'hope', labelAr: 'الأمل والسكينة', labelEn: 'Hope & Solace' },
    { id: 'parables', labelAr: 'أمثال القرآن', labelEn: 'Divine Parables' },
  ];

  const filteredStories = useMemo(() => {
    let list = [...stories];

    if (selectedCategory !== 'all') {
      list = list.filter((s) => s.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.titleAr.includes(q) ||
          s.titleEn.toLowerCase().includes(q) ||
          s.surahNameEn.toLowerCase().includes(q) ||
          s.surahNameAr.includes(q) ||
          s.shortSummaryAr.includes(q) ||
          s.shortSummaryEn.toLowerCase().includes(q)
      );
    }

    return list;
  }, [stories, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-xl space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <Layers className="w-3.5 h-3.5" />
            <span>{isAr ? 'قصص القرآن والتأملات الإيمانية' : 'Quranic Narrative Reflections'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isAr ? 'عبر وآيات من أحسن القصص' : 'Stories of Faith, Wisdom & Revelation'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            {isAr
              ? 'استكشف قصصاً قرآنية مصممة للقراءة والتأمل، مستندة إلى أمهات كتب التفسير، وجاهزة للتحويل الفوري إلى مقاطع مرئية.'
              : 'Immerse in authentic Quranic narratives with slide-by-slide contemplation, verified tafsir context, and one-click media remixing.'}
          </p>
        </div>

        {/* Search Input Box */}
        <div className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2 left-4 rtl:left-auto rtl:right-4 w-5 h-5 text-amber-500 pointer-events-none" />
          <input
            type="text"
            placeholder={
              isAr
                ? 'ابحث باسم القصة (يوسف، نوح، الكهف، الضحى)...'
                : 'Search stories by keyword (e.g. Joseph, Noah, Cave, Solace)...'
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

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              {isAr ? c.labelAr : c.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Stories Grid */}
      {filteredStories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <Link
              key={story.id}
              href={`/${locale}/story/${story.id}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 hover:border-amber-500/50 hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-2xl p-6 sm:p-7"
            >
              {/* Subtle background gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${story.gradient} opacity-10 dark:opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none`}
              />

              <div className="relative z-10 space-y-4">
                {/* Top Badges */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-600 dark:text-amber-400">
                    {isAr ? story.categoryNameAr : story.categoryNameEn}
                  </span>

                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" />
                    <span>{story.duration}</span>
                  </span>
                </div>

                {/* Surah Reference & Title */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {isAr ? `سورة ${story.surahNameAr} [${story.ayahRange}]` : `Surah ${story.surahNameEn} [${story.ayahRange}]`}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug group-hover:text-amber-500 transition-colors">
                    {isAr ? story.titleAr : story.titleEn}
                  </h3>
                </div>

                {/* Short Summary */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {isAr ? story.shortSummaryAr : story.shortSummaryEn}
                </p>

                {/* Tafsir Citation Badge */}
                <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-amber-500" />
                  <span>{story.tafsirSource}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="relative z-10 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {story.slides.length} {isAr ? 'شرائح تأملية' : 'contemplation slides'}
                </span>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                  <span>{isAr ? 'اقرأ وتأمل' : 'Read Story'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 p-8">
          <div className="text-4xl">📜</div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {isAr ? 'لم يتم العثور على قصص مطابقة' : 'No Matching Stories Found'}
          </h3>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow"
          >
            {isAr ? 'إعادة ضبط البحث' : 'Clear Filter'}
          </button>
        </div>
      )}

    </div>
  );
}
