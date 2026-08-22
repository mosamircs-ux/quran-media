'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Locale } from '@quran-media/i18n';
import type { QuranStory } from '@/lib/stories-catalog';
import {
  BookOpen,
  Sparkles,
  Film,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
  Quote,
  CheckCircle2,
  Volume2,
  Compass,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface StoryReaderClientProps {
  story: QuranStory;
  locale: Locale;
}

export function StoryReaderClient({ story, locale }: StoryReaderClientProps) {
  const isAr = locale === 'ar';
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  const currentSlide = story.slides[currentSlideIndex] ?? story.slides[0]!;

  useEffect(() => {
    return () => {
      audioInstance?.pause();
    };
  }, [audioInstance]);

  const toggleAudio = () => {
    if (isPlayingAudio) {
      audioInstance?.pause();
      setIsPlayingAudio(false);
    } else {
      audioInstance?.pause();
      const newAudio = new Audio(story.reciterAudioUrl);
      newAudio.onended = () => setIsPlayingAudio(false);
      newAudio.play().catch(() => {});
      setAudioInstance(newAudio);
      setIsPlayingAudio(true);
    }
  };

  const nextSlide = () => {
    if (currentSlideIndex < story.slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="space-y-10 pb-20">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href={`/${locale}`} className="hover:text-amber-500 transition-colors">
          {isAr ? 'الرئيسية' : 'Home'}
        </Link>
        <span>/</span>
        <Link href={`/${locale}/stories`} className="hover:text-amber-500 transition-colors">
          {isAr ? 'القصص' : 'Stories'}
        </Link>
        <span>/</span>
        <span className="font-bold text-slate-800 dark:text-slate-200">
          {isAr ? story.titleAr : story.titleEn}
        </span>
      </nav>

      {/* Story Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-500/20">
              {isAr ? story.categoryNameAr : story.categoryNameEn}
            </span>
            <span className="text-xs text-slate-500 font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
              {isAr ? `سورة ${story.surahNameAr} [${story.ayahRange}]` : `Surah ${story.surahNameEn} [${story.ayahRange}]`}
            </span>
          </div>

          {/* Audio Player & Share */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAudio}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition-transform cursor-pointer"
            >
              {isPlayingAudio ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
              <span>{isPlayingAudio ? (isAr ? 'إيقاف التلاوة' : 'Pause') : (isAr ? 'استماع للتلاوة' : 'Listen')}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {isAr ? story.titleAr : story.titleEn}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {isAr ? story.shortSummaryAr : story.shortSummaryEn}
        </p>
      </div>

      {/* Main Interactive Slide-by-Slide Contemplation Stage */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-2xl p-6 sm:p-10 space-y-8">
        
        {/* Slide Progress Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-500 pb-4 border-b border-slate-100 dark:border-slate-800">
          <span className="font-bold text-amber-600 dark:text-amber-400">
            {isAr ? `الشريحة ${currentSlideIndex + 1} من ${story.slides.length}` : `Slide ${currentSlideIndex + 1} of ${story.slides.length}`}
          </span>

          <div className="flex items-center gap-1.5">
            {story.slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlideIndex(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlideIndex === i ? 'w-8 bg-amber-500' : 'w-2 bg-slate-300 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Slide Content */}
        <div className="space-y-6">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {isAr ? currentSlide.titleAr : currentSlide.titleEn}
          </h3>

          {/* Verse Display */}
          <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 text-center space-y-3">
            <p dir="rtl" className="font-quran text-2xl sm:text-3xl text-slate-900 dark:text-amber-100 leading-loose">
              {currentSlide.arabicText}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic max-w-xl mx-auto">
              "{currentSlide.translation}"
            </p>
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block">
              [Surah {story.surahNameEn} - {currentSlide.verseKey}]
            </span>
          </div>

          {/* Reflection Body */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
              {isAr ? 'التأمل والنظرة الإيمانية:' : 'Spiritual Contemplation:'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {isAr ? currentSlide.reflectionAr : currentSlide.reflectionEn}
            </p>
          </div>

          {/* Visual Scene Atmosphere Idea */}
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                {isAr ? 'الأجواء البصرية المقترحة للإنتاج:' : 'Suggested Visual Atmosphere for Media:'}
              </span>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5 font-mono">
                "{currentSlide.visualAtmosphere}"
              </p>
            </div>
          </div>
        </div>

        {/* Slide Navigation Buttons & Studio Remix Trigger */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
              className="flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              <span>{isAr ? 'السابق' : 'Previous'}</span>
            </button>

            <button
              onClick={nextSlide}
              disabled={currentSlideIndex === story.slides.length - 1}
              className="flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
            >
              <span>{isAr ? 'التالي' : 'Next'}</span>
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>

          <Link
            href={`/${locale}/create?surah=${story.surahNumber}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-102"
          >
            <Film className="w-3.5 h-3.5" />
            <span>{isAr ? 'تحويل القصة إلى فيديو في الاستوديو' : 'Remix as Video in Studio'}</span>
          </Link>
        </div>

      </div>

      {/* Tafsir Commentary & Takeaways Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tafsir Overview */}
        <div className="p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 space-y-3 shadow-md">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
            <Quote className="w-4 h-4" />
            <span>{story.tafsirSource}</span>
          </div>
          <h4 className="font-bold text-base text-slate-900 dark:text-white">
            {isAr ? 'الخلاصة التفسيرية والسياق القرآني' : 'Scholarly Context & Tafsir'}
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {isAr ? story.tafsirOverviewAr : story.tafsirOverviewEn}
          </p>
        </div>

        {/* Key Lessons */}
        <div className="p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 space-y-3 shadow-md">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>{isAr ? 'الدروس والعبر المستفادة' : 'Key Contemplation Takeaways'}</span>
          </div>
          <div className="space-y-2 pt-1">
            {(isAr ? story.takeawaysAr : story.takeawaysEn).map((point, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                <span className="text-amber-500 font-bold">•</span>
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
