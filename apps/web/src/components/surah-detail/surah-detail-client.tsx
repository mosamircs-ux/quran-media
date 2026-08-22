'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Locale } from '@quran-media/i18n';
import type { SurahExtendedMeta } from '@/lib/surahs-catalog';
import { AyahCard, type AyahCardData } from '@/components/ayah-explorer/ayah-card';
import { StickyAudioPlayer } from './sticky-audio-player';
import {
  Search,
  BookOpen,
  Sparkles,
  Film,
  Image as ImageIcon,
  Compass,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Volume2,
  Info,
  Layers,
  ArrowLeft,
  ArrowRight,
  Share2,
} from 'lucide-react';

interface SurahDetailClientProps {
  surah: SurahExtendedMeta;
  verses: AyahCardData[];
  locale: Locale;
}

export function SurahDetailClient({ surah, verses, locale }: SurahDetailClientProps) {
  const isAr = locale === 'ar';

  const [inSurahQuery, setInSurahQuery] = useState('');
  const [selectedVerseNumber, setSelectedVerseNumber] = useState<number | null>(null);
  const [showSurahInfo, setShowSurahInfo] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState<'all' | 'stories' | 'videos' | 'images'>('all');

  // Jump to verse handler
  const handleJumpToVerse = (vNum: number) => {
    setSelectedVerseNumber(vNum);
    const element = document.getElementById(`verse-${vNum}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Filtered verses based on in-surah search
  const filteredVerses = useMemo(() => {
    if (!inSurahQuery.trim()) return verses;
    const q = inSurahQuery.trim().toLowerCase();

    return verses.filter(
      (v) =>
        String(v.ayahNumber).includes(q) ||
        v.verseKey.includes(q) ||
        v.arabicText.includes(q) ||
        v.translation.toLowerCase().includes(q)
    );
  }, [verses, inSurahQuery]);

  // Surah 9 (At-Tawbah) does not have Bismillah at the beginning
  const showBismillah = surah.id !== 9;

  return (
    <div className="space-y-10 pb-32">
      
      {/* 1. Surah Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-2xl p-6 sm:p-10 space-y-6">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-500/20">
                {isAr ? `السورة رقم ${surah.id}` : `Surah #${surah.id}`}
              </span>
              <span className="text-xs text-slate-500 font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                {isAr ? (surah.revelationPlace === 'makkah' ? 'مكية' : 'مدنية') : surah.revelationPlace} • {surah.versesCount} {isAr ? 'آية' : 'verses'}
              </span>
              <span className="text-xs text-slate-400">
                {isAr ? `ترتيب النزول: ${surah.revelationOrder}` : `Revelation Order: ${surah.revelationOrder}`}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {isAr ? `سورة ${surah.nameAr}` : `Surah ${surah.nameEn}`}
              <span className="text-lg sm:text-xl font-normal text-slate-400 ml-3 rtl:mr-3">
                ({surah.meaningEn})
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {isAr ? surah.shortDescAr : surah.shortDescEn}
            </p>
          </div>

          {/* Quick Stats & Toggle Info */}
          <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-3">
            <button
              onClick={() => setShowSurahInfo(!showSurahInfo)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-amber-500 transition-all cursor-pointer"
            >
              <Info className="w-4 h-4 text-amber-500" />
              <span>{isAr ? 'معلومات وخلفية تاريخية' : 'Surah Overview'}</span>
              {showSurahInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expandable Surah Information & Historical Context */}
        {showSurahInfo && (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm space-y-4 animate-in slide-in-from-top-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {isAr ? `نظرة شاملة ومقاصد سورة ${surah.nameAr}` : `Historical Context & Themes of Surah ${surah.nameEn}`}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr
                ? `تعتبر سورة ${surah.nameAr} من السور العظيمة في القرآن الكريم، وتشتمل على ${surah.versesCount} آية مباركة نزلت في ${surah.revelationPlace === 'makkah' ? 'مكة المكرمة' : 'المدينة المنورة'}. تركز السورة على ترسيخ التوحيد وتأصيل مبادئ الإيمان والاستسلام لله وتقديم العبر والدروس الخالدة.`
                : `Surah ${surah.nameEn} consists of ${surah.versesCount} verses revealed in ${surah.revelationPlace}. It illuminates essential spiritual teachings, pure monotheism, moral excellence, and timeless prophetic narratives.`}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block">{isAr ? 'عدد الآيات' : 'Total Verses'}</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{surah.versesCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block">{isAr ? 'مكان النزول' : 'Revelation'}</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm uppercase">{surah.revelationPlace}</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block">{isAr ? 'ترتيب النزول' : 'Chronological Order'}</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">#{surah.revelationOrder}</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block">{isAr ? 'المقاطع المتوفرة' : 'Media Assets'}</span>
                <span className="font-bold text-amber-500 text-sm">{surah.featuredMedia.videos + surah.featuredMedia.stories}</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 2. Bismillah Header (Except Surah 9) */}
      {showBismillah && (
        <div className="py-6 text-center">
          <div className="inline-block p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 shadow-inner">
            <p dir="rtl" className="font-quran text-3xl sm:text-4xl text-amber-600 dark:text-amber-300 drop-shadow">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
            <p className="text-xs text-slate-400 mt-1 italic font-light">
              In the Name of Allah—the Most Compassionate, Most Merciful
            </p>
          </div>
        </div>
      )}

      {/* 3. In-Surah Search & Verse Navigation Bar */}
      <div className="p-4 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Real-time search inside Surah */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 w-4 h-4 text-amber-500 pointer-events-none" />
          <input
            type="text"
            placeholder={
              isAr
                ? 'ابحث داخل السورة (كلمة أو رقم الآية)...'
                : 'Search inside Surah (word or verse #)...'
            }
            value={inSurahQuery}
            onChange={(e) => setInSurahQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-9 rtl:pr-9 rtl:pl-9 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Verse Jumper Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs font-bold text-slate-500">
            {isAr ? 'الانتقال إلى الآية:' : 'Jump to Verse:'}
          </span>
          <select
            value={selectedVerseNumber || ''}
            onChange={(e) => handleJumpToVerse(Number(e.target.value))}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
          >
            <option value="">{isAr ? 'اختر الآية...' : 'Select Ayah...'}</option>
            {Array.from({ length: surah.versesCount }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {isAr ? `الآية ${num}` : `Ayah ${num}`}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* 4. All Verses List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2 text-xs text-slate-500">
          <span>
            {isAr
              ? `عرض ${filteredVerses.length} من إجمالي ${surah.versesCount} آية`
              : `Displaying ${filteredVerses.length} of ${surah.versesCount} verses`}
          </span>
        </div>

        <div className="space-y-6">
          {filteredVerses.map((ayah) => (
            <div key={ayah.verseKey} id={`verse-${ayah.ayahNumber}`}>
              <AyahCard
                ayah={ayah}
                locale={locale}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 5. Related Media Section (Stories, Videos, Images) */}
      <div className="pt-10 border-t border-slate-200 dark:border-slate-800 space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'الوسائط المرئية المرتبطة بالسورة' : 'Related Media & Stories'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {isAr ? `قصص وتصاميم سورة ${surah.nameAr}` : `Media Created from Surah ${surah.nameEn}`}
          </h2>
        </div>

        {/* Media Type Filter Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 self-start w-fit">
          {[
            { id: 'all', label: isAr ? 'كافة الوسائط' : 'All Media' },
            { id: 'stories', label: isAr ? 'قصص مرئية' : 'Stories' },
            { id: 'videos', label: isAr ? 'مقاطع فيديو' : 'Videos' },
            { id: 'images', label: isAr ? 'صور وبوسترات' : 'Posters' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveMediaTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMediaTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Related Media Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <Film className="w-4 h-4" />
              <span>9:16 Reels Video</span>
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {isAr ? `تلاوة خاشعة من سورة ${surah.nameAr}` : `Reverent Recitation from ${surah.nameEn}`}
            </h3>
            <p className="text-xs text-slate-500">
              {isAr ? 'فيديو سينمائي عمودي بدقة 4K مع ترجمة كاريوكي متزامنة.' : 'Vertical 9:16 clip with synchronized word-by-word subtitles.'}
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
              <BookOpen className="w-4 h-4" />
              <span>Narrative Story</span>
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {isAr ? `تأملات في مقاصد سورة ${surah.nameAr}` : `Deep Reflections on ${surah.nameEn}`}
            </h3>
            <p className="text-xs text-slate-500">
              {isAr ? 'سرد قصصي وتأملي مستند إلى تفسير ابن كثير والسعدي.' : 'Scholarly storytelling based on classical tafsir commentaries.'}
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400">
              <ImageIcon className="w-4 h-4" />
              <span>Artistic Poster</span>
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {isAr ? `بوستر بخط الثلث من سورة ${surah.nameAr}` : `Thuluth Calligraphy Art Poster`}
            </h3>
            <p className="text-xs text-slate-500">
              {isAr ? 'تصميم بصري مذهب بدقة عالية جاهز للطباعة والنشر.' : 'Illuminated Islamic geometric design ready for export.'}
            </p>
          </div>
        </div>
      </div>

      {/* 6. Sticky Floating Audio Player */}
      <StickyAudioPlayer
        surahNumber={surah.id}
        surahNameAr={surah.nameAr}
        surahNameEn={surah.nameEn}
        activeVerseNumber={selectedVerseNumber}
        totalVerses={surah.versesCount}
        onVerseChange={(v) => handleJumpToVerse(v)}
        locale={locale}
      />

    </div>
  );
}
