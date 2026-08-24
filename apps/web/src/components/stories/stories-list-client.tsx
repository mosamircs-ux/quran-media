'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Locale } from '@quran-media/i18n';
import {
  type QuranStory,
  type StoryCategory,
  STORY_CATEGORIES,
} from '@/lib/stories-catalog';
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
  Eye,
  Bookmark,
  Calendar,
  Globe,
  Share2,
  Flame,
  Check,
  Video,
} from 'lucide-react';

interface StoriesListClientProps {
  stories: QuranStory[];
  locale: Locale;
}

export function StoriesListClient({ stories, locale }: StoriesListClientProps) {
  const isAr = locale === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'views' | 'newest' | 'saves'>('views');
  const [savedStoryIds, setSavedStoryIds] = useState<Set<string>>(new Set());

  const toggleSave = (e: React.MouseEvent, storyId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedStoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(storyId)) {
        next.delete(storyId);
      } else {
        next.add(storyId);
      }
      return next;
    });
  };

  const filteredStories = useMemo(() => {
    let list = [...stories];

    if (selectedCategory !== 'all') {
      list = list.filter((s) => s.category === selectedCategory);
    }

    if (selectedLanguage !== 'all') {
      list = list.filter((s) => s.language === selectedLanguage || s.language === 'dual');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.titleAr.toLowerCase().includes(q) ||
          s.titleEn.toLowerCase().includes(q) ||
          s.surahNameEn.toLowerCase().includes(q) ||
          s.surahNameAr.includes(q) ||
          s.shortSummaryAr.toLowerCase().includes(q) ||
          s.shortSummaryEn.toLowerCase().includes(q) ||
          s.categoryNameAr.includes(q) ||
          s.categoryNameEn.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'views') {
      list.sort((a, b) => b.viewsCount - a.viewsCount);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'saves') {
      list.sort((a, b) => b.savesCount - a.savesCount);
    }

    return list;
  }, [stories, selectedCategory, selectedLanguage, searchQuery, sortBy]);

  const formatDate = (isoDate: string) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Explore Banner */}
      <div className="relative overflow-hidden p-6 sm:p-10 rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'مكتبة القصص والتأملات القرآنية' : 'Quranic Stories & Thematic Contemplation'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight">
            {isAr ? 'استكشف روائع القصص القرآنية' : 'Explore Authentic Quranic Stories'}
          </h1>

          <p className="text-xs sm:text-base text-slate-400 max-w-3xl leading-relaxed">
            {isAr
              ? 'رحلة إيمانية مرئية في آيات الكتاب الحكيم، مدعومة بتفاسير أهل السنة المعتمدة (ابن كثير، السعدي، الطبري، القرطبي)، مع تلاوات خاشعة وتوليد مرئي بالذكاء الاصطناعي.'
              : 'A cinematic journey through the Holy Quran, grounded in classical verified Tafsir (Ibn Kathir, As-Sa\'di, Al-Tabari), featuring soulful recitations and AI visual remakes.'}
          </p>
        </div>

        {/* Search Input and Quick Filters Bar */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-3 pt-2">
          {/* Search Box (8 cols) */}
          <div className="lg:col-span-7 relative">
            <Search className="absolute top-1/2 -translate-y-1/2 left-4 rtl:left-auto rtl:right-4 w-5 h-5 text-amber-400 pointer-events-none" />
            <input
              type="text"
              placeholder={
                isAr
                  ? 'ابحث باسم القصة، السورة، أو الموضوع (يوسف، الكهف، الصبر، الجنة)...'
                  : 'Search by story title, Surah, or theme (Joseph, Cave, Patience, Paradise)...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-12 pr-12 rtl:pr-12 rtl:pl-12 py-3.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute top-1/2 -translate-y-1/2 right-4 rtl:right-auto rtl:left-4 p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector (3 cols) */}
          <div className="lg:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full h-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              <option value="views">{isAr ? 'الأكثر مشاهدة' : 'Most Viewed'}</option>
              <option value="newest">{isAr ? 'الأحدث إطلاقاً' : 'Newest'}</option>
              <option value="saves">{isAr ? 'الأكثر حفظاً' : 'Most Saved'}</option>
            </select>
          </div>

          {/* Language Selector (2 cols) */}
          <div className="lg:col-span-2">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full h-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              <option value="all">{isAr ? 'كافة اللغات' : 'All Languages'}</option>
              <option value="ar">{isAr ? 'العربية' : 'Arabic'}</option>
              <option value="en">{isAr ? 'English' : 'English'}</option>
            </select>
          </div>
        </div>

        {/* 14 Categories Filter Pills */}
        <div className="relative z-10 space-y-2 pt-3 border-t border-slate-800/80">
          <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'التصنيفات والموضوعات القرآنية:' : 'Categories & Quranic Themes:'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {/* All Filter */}
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {isAr ? 'كافة التصنيفات' : 'All Categories'} ({stories.length})
            </button>

            {/* 14 Categories */}
            {STORY_CATEGORIES.map((cat) => {
              const count = stories.filter((s) => s.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span>{isAr ? cat.nameAr : cat.nameEn}</span>
                  {count > 0 && (
                    <span className="text-[10px] opacity-75 font-mono">({count})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      {filteredStories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => {
            const isSaved = savedStoryIds.has(story.id);

            return (
              <Link
                key={story.id}
                href={`/${locale}/stories/${story.slug}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/80 hover:border-emerald-500/50 hover:-translate-y-1.5 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                {/* Poster Thumbnail Header with Play Glow */}
                <div className="relative w-full h-52 overflow-hidden bg-slate-900">
                  <img
                    src={story.thumbnailUrl}
                    alt={isAr ? story.titleAr : story.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  {/* Category Pill on Image */}
                  <div className="absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5">
                    <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-[11px] font-bold text-amber-300 shadow">
                      {isAr ? story.categoryNameAr : story.categoryNameEn}
                    </span>
                  </div>

                  {/* Bookmark Save Button */}
                  <button
                    onClick={(e) => toggleSave(e, story.id)}
                    className={`absolute top-3.5 right-3.5 rtl:right-auto rtl:left-3.5 p-2 rounded-xl backdrop-blur-md border transition-all ${
                      isSaved
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/30'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>

                  {/* Play Overlay Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-500/40 transform group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Duration and Language Badges */}
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[11px] font-semibold text-slate-200">
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-sm border border-slate-800 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <span>{story.durationFormatted}</span>
                    </span>

                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-sm border border-slate-800 uppercase tracking-wider text-[10px] text-amber-300">
                      {story.language === 'dual' ? 'AR / EN' : story.language}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Surah & Ayah Reference */}
                    <div className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>
                        {isAr
                          ? `سورة ${story.surahNameAr} (${story.ayahRange})`
                          : `Surah ${story.surahNameEn} (${story.ayahRange})`}
                      </span>
                    </div>

                    {/* Story Title */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
                      {isAr ? story.titleAr : story.titleEn}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {isAr ? story.shortSummaryAr : story.shortSummaryEn}
                    </p>
                  </div>

                  {/* Footer Meta & Stats */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    {/* Views & Date */}
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>{story.viewsCount.toLocaleString()}</span>
                      </span>

                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{formatDate(story.createdAt)}</span>
                      </span>
                    </div>

                    {/* Watch CTA Arrow */}
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                      <span>{isAr ? 'مشاهدة وتدبر' : 'Watch Story'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center rounded-3xl border border-slate-800 bg-slate-950/80 space-y-4 p-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-2xl">
            📜
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-200">
              {isAr ? 'لم يتم العثور على قصص مطابقة' : 'No Matching Stories Found'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr
                ? 'جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً'
                : 'Try searching for different keywords or resetting your category filters.'}
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedLanguage('all');
            }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            {isAr ? 'إعادة ضبط كافة الفلاتر' : 'Reset All Filters'}
          </button>
        </div>
      )}
    </div>
  );
}
