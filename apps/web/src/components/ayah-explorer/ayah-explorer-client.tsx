'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { Locale } from '@quran-media/i18n';
import {
  Search,
  SlidersHorizontal,
  Bookmark,
  Shuffle,
  Flame,
  Layers,
  Sparkles,
  BookOpen,
  Filter,
  X,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { AyahCard, type AyahCardData } from './ayah-card';
import { QURAN_TOPICS, type QuranTopic } from '@/lib/quran-topics';
import { CANONICAL_SURAHS } from '@quran-media/quran';

interface AyahExplorerClientProps {
  initialAyahs: AyahCardData[];
  locale: Locale;
}

export function AyahExplorerClient({ initialAyahs, locale }: AyahExplorerClientProps) {
  const isAr = locale === 'ar';

  // Search & Tab states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'random' | 'bookmarks'>('all');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  // Filters state
  const [filterSurahId, setFilterSurahId] = useState<number | 'all'>('all');
  const [filterJuz, setFilterJuz] = useState<number | 'all'>('all');
  const [filterHizb, setFilterHizb] = useState<number | 'all'>('all');
  const [filterPage, setFilterPage] = useState<number | 'all'>('all');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Bookmarks state (persisted in localStorage)
  const [bookmarkedKeys, setBookmarkedKeys] = useState<string[]>([]);
  const [displayedCount, setDisplayedCount] = useState<number>(12);
  const [randomAyah, setRandomAyah] = useState<AyahCardData | null>(null);

  // Load bookmarks on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('qm_bookmarks');
      if (saved) {
        setBookmarkedKeys(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const toggleBookmark = (verseKey: string) => {
    let updated: string[];
    if (bookmarkedKeys.includes(verseKey)) {
      updated = bookmarkedKeys.filter((k) => k !== verseKey);
    } else {
      updated = [...bookmarkedKeys, verseKey];
    }
    setBookmarkedKeys(updated);
    try {
      localStorage.setItem('qm_bookmarks', JSON.stringify(updated));
    } catch {}
  };

  const handlePickRandom = () => {
    const random = initialAyahs[Math.floor(Math.random() * initialAyahs.length)]!;
    setRandomAyah(random);
    setActiveTab('random');
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTopicId(null);
    setFilterSurahId('all');
    setFilterJuz('all');
    setFilterHizb('all');
    setFilterPage('all');
    setActiveTab('all');
    setDisplayedCount(12);
  };

  // Filtered Ayahs Memo
  const filteredAyahs = useMemo(() => {
    let list = [...initialAyahs];

    // 1. Tab filtering
    if (activeTab === 'popular') {
      const popularKeys = new Set(['1:1', '2:255', '36:1', '55:13', '93:5', '94:5', '2:152', '3:139', '21:87', '112:1']);
      list = list.filter((a) => popularKeys.has(a.verseKey));
    } else if (activeTab === 'bookmarks') {
      const bSet = new Set(bookmarkedKeys);
      list = list.filter((a) => bSet.has(a.verseKey));
    } else if (activeTab === 'random' && randomAyah) {
      return [randomAyah];
    }

    // 2. Topic filtering
    if (selectedTopicId) {
      const topic = QURAN_TOPICS.find((t) => t.id === selectedTopicId);
      if (topic) {
        const topicSet = new Set(topic.verseKeys);
        list = list.filter((a) => topicSet.has(a.verseKey));
      }
    }

    // 3. Surah filter
    if (filterSurahId !== 'all') {
      list = list.filter((a) => a.surahNumber === filterSurahId);
    }

    // 4. Juz filter
    if (filterJuz !== 'all') {
      list = list.filter((a) => a.juzNumber === filterJuz);
    }

    // 5. Hizb filter
    if (filterHizb !== 'all') {
      list = list.filter((a) => a.hizbNumber === filterHizb);
    }

    // 6. Page filter
    if (filterPage !== 'all') {
      list = list.filter((a) => a.pageNumber === filterPage);
    }

    // 7. Search query filter (matches Arabic, English, or verse key)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.verseKey.includes(q) ||
          a.arabicText.includes(q) ||
          a.translation.toLowerCase().includes(q) ||
          a.surahNameEn.toLowerCase().includes(q) ||
          a.surahNameAr.includes(q)
      );
    }

    return list;
  }, [
    initialAyahs,
    activeTab,
    bookmarkedKeys,
    randomAyah,
    selectedTopicId,
    filterSurahId,
    filterJuz,
    filterHizb,
    filterPage,
    searchQuery,
  ]);

  const displayedAyahs = filteredAyahs.slice(0, displayedCount);
  const hasMore = displayedCount < filteredAyahs.length;

  const loadMore = () => {
    setDisplayedCount((prev) => prev + 12);
  };

  const activeFiltersCount =
    (filterSurahId !== 'all' ? 1 : 0) +
    (filterJuz !== 'all' ? 1 : 0) +
    (filterHizb !== 'all' ? 1 : 0) +
    (filterPage !== 'all' ? 1 : 0) +
    (selectedTopicId ? 1 : 0);

  return (
    <div className="space-y-8">
      
      {/* Search Header Bar */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isAr ? 'مستكشف آيات القرآن الكريم' : 'Explore Holy Quran Ayahs'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isAr
              ? 'ابحث باللغة العربية أو الإنجليزية أو برقم الآية والسورة أو الموضوع، واستمع للتلاوات والتفاسير.'
              : 'Search by Arabic, English, verse key (e.g. 2:255), Surah, or spiritual topics with instant audio & tafsir.'}
          </p>
        </div>

        {/* Search Input Box */}
        <div className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2 left-4 rtl:left-auto rtl:right-4 w-5 h-5 text-amber-500 pointer-events-none" />
          <input
            type="text"
            placeholder={
              isAr
                ? 'ابحث بالنص العربي (مثال: رحمة، نور) أو الإنجليزي (mercy) أو المفتاح (2:255)...'
                : 'Search by Arabic text, English word (e.g. mercy, patience), or verse key (e.g. 2:255)...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-12 rtl:pr-12 rtl:pl-12 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
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

        {/* Quick Tabs & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          
          {/* Main Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => { setActiveTab('all'); setSelectedTopicId(null); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all' && !selectedTopicId
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isAr ? 'كافة الآيات' : 'All Ayahs'}
            </button>

            <button
              onClick={() => { setActiveTab('popular'); setSelectedTopicId(null); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'popular'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{isAr ? 'الآيات الشائعة' : 'Popular'}</span>
            </button>

            <button
              onClick={handlePickRandom}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'random'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>{isAr ? 'آية عشوائية' : 'Random Ayah'}</span>
            </button>

            <button
              onClick={() => { setActiveTab('bookmarks'); setSelectedTopicId(null); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'bookmarks'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isAr ? `المحفوظات (${bookmarkedKeys.length})` : `Bookmarks (${bookmarkedKeys.length})`}</span>
            </button>
          </div>

          {/* Filter Drawer Toggle & Reset */}
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isAr ? 'إعادة ضبط' : 'Reset'}</span>
              </button>
            )}

            <button
              onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                filterDrawerOpen || activeFiltersCount > 0
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{isAr ? 'تصفية متقدمة' : 'Advanced Filters'}</span>
              {activeFiltersCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Topic Pills Carousel */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
            {isAr ? 'مواضيع وتأملات قرآنية مختارة:' : 'Browse by Spiritual Topic:'}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {QURAN_TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => {
                  setSelectedTopicId(selectedTopicId === topic.id ? null : topic.id);
                  setActiveTab('all');
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedTopicId === topic.id
                    ? 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <span>{topic.icon}</span>
                <span>{isAr ? topic.nameAr : topic.nameEn}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Expandable Filter Drawer (Surah, Juz, Hizb, Page) */}
        {filterDrawerOpen && (
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Surah Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'السورة (1 - 114)' : 'Surah (1 - 114)'}
                </label>
                <select
                  value={filterSurahId}
                  onChange={(e) => setFilterSurahId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="all">{isAr ? 'كافة السور' : 'All Surahs'}</option>
                  {CANONICAL_SURAHS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id}. {isAr ? s.nameAr : s.nameEn} ({s.versesCount} v)
                    </option>
                  ))}
                </select>
              </div>

              {/* Juz Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'الجزء (1 - 30)' : 'Juz (1 - 30)'}
                </label>
                <select
                  value={filterJuz}
                  onChange={(e) => setFilterJuz(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="all">{isAr ? 'كافة الأجزاء' : 'All Ajza'}</option>
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => (
                    <option key={j} value={j}>
                      {isAr ? `الجزء ${j}` : `Juz ${j}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hizb Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'الحزب (1 - 60)' : 'Hizb (1 - 60)'}
                </label>
                <select
                  value={filterHizb}
                  onChange={(e) => setFilterHizb(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="all">{isAr ? 'كافة الأحزاب' : 'All Ahzab'}</option>
                  {Array.from({ length: 60 }, (_, i) => i + 1).map((h) => (
                    <option key={h} value={h}>
                      {isAr ? `الحزب ${h}` : `Hizb ${h}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Page Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'الصفحة (1 - 604)' : 'Page (1 - 604)'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={604}
                  placeholder={isAr ? 'رقم الصفحة' : 'Page number'}
                  value={filterPage === 'all' ? '' : filterPage}
                  onChange={(e) => setFilterPage(e.target.value ? Number(e.target.value) : 'all')}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Results Header Info */}
      <div className="flex items-center justify-between px-2 text-xs text-slate-500 dark:text-slate-400">
        <span>
          {isAr
            ? `عرض ${displayedAyahs.length} من إجمالي ${filteredAyahs.length} آية`
            : `Showing ${displayedAyahs.length} of ${filteredAyahs.length} verses`}
        </span>
      </div>

      {/* Ayahs Cards Grid */}
      {displayedAyahs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedAyahs.map((ayah) => (
            <AyahCard
              key={ayah.verseKey}
              ayah={ayah}
              locale={locale}
              isBookmarked={bookmarkedKeys.includes(ayah.verseKey)}
              onToggleBookmark={toggleBookmark}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 p-8">
          <div className="text-4xl">🔍</div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {isAr ? 'لم يتم العثور على آيات مطابقة' : 'No Matching Ayahs Found'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {isAr
              ? 'جرّب تعديل معايير البحث أو اختيار سورة أخرى أو إعادة ضبط عوامل التصفية.'
              : 'Try adjusting your search query, selecting another Surah, or resetting filters.'}
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow hover:bg-amber-400 transition-colors"
          >
            {isAr ? 'إعادة ضبط كافة الفلاتر' : 'Reset All Filters'}
          </button>
        </div>
      )}

      {/* Infinite Scroll / Load More Button */}
      {hasMore && (
        <div className="text-center pt-6">
          <button
            onClick={loadMore}
            className="px-8 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs shadow-md transition-all hover:scale-102 cursor-pointer"
          >
            {isAr ? 'تحميل المزيد من الآيات الكريمة...' : 'Load More Verses...'}
          </button>
        </div>
      )}

    </div>
  );
}
