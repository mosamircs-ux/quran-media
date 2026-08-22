'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Locale } from '@quran-media/i18n';
import {
  Sparkles,
  Play,
  Pause,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Share2,
  Layers,
  Check,
} from 'lucide-react';

interface HeroSectionProps {
  locale: Locale;
}

interface HeroAyah {
  surahNameAr: string;
  surahNameEn: string;
  surahNumber: number;
  ayahNumber: number;
  arabicText: string;
  translation: string;
  theme: string;
  audioUrl: string;
  reciter: string;
}

const HERO_AYAHS: HeroAyah[] = [
  {
    surahNameAr: 'البقرة',
    surahNameEn: 'Al-Baqarah',
    surahNumber: 2,
    ayahNumber: 255,
    arabicText: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ ۚ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ',
    translation: 'Allah! There is no god ˹worthy of worship˺ except Him, the Ever-Living, All-Sustaining. Neither drowsiness nor sleep overtakes Him.',
    theme: 'Divine Sovereignty • آية الكرسي',
    audioUrl: 'https://audio.qurancdn.com/Alafasy/mp3/002255.mp3',
    reciter: 'Mishari Rashid Al-Afasy',
  },
  {
    surahNameAr: 'الرحمن',
    surahNameEn: 'Ar-Rahman',
    surahNumber: 55,
    ayahNumber: 13,
    arabicText: 'فَبِأَىِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ',
    translation: 'Then which of your Lord’s wonders will you both deny?',
    theme: 'Infinite Blessings • النعم الإلهية',
    audioUrl: 'https://audio.qurancdn.com/Alafasy/mp3/055013.mp3',
    reciter: 'Mishari Rashid Al-Afasy',
  },
  {
    surahNameAr: 'الضحى',
    surahNameEn: 'Ad-Duha',
    surahNumber: 93,
    ayahNumber: 5,
    arabicText: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰٓ',
    translation: 'And your Lord will soon give you so much that you will be well pleased.',
    theme: 'Hope & Reassurance • البشرى والرضا',
    audioUrl: 'https://audio.qurancdn.com/Alafasy/mp3/093005.mp3',
    reciter: 'Mishari Rashid Al-Afasy',
  },
];

export function HeroSection({ locale }: HeroSectionProps) {
  const isAr = locale === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [activeAyahIndex, setActiveAyahIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [selectedRatio, setSelectedRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16');
  const [copied, setCopied] = useState(false);

  const currentAyah = HERO_AYAHS[activeAyahIndex] ?? HERO_AYAHS[0]!;

  useEffect(() => {
    if (audio) {
      audio.pause();
    }
    const newAudio = new Audio(currentAyah.audioUrl);
    newAudio.onended = () => setIsPlaying(false);
    setAudio(newAudio);
    setIsPlaying(false);

    return () => {
      newAudio.pause();
    };
  }, [activeAyahIndex]);

  const toggleAudio = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `${currentAyah.arabicText}\n${currentAyah.translation} [${currentAyah.surahNameEn} ${currentAyah.surahNumber}:${currentAyah.ayahNumber}]`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-20 sm:py-24 bg-islamic-pattern">
      {/* Decorative Radial Lighting Blurs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-emerald-600/15 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-12 right-0 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-start">
            
            {/* Spiritual Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-semibold backdrop-blur-md shadow-sm">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
              <span>{isAr ? 'منصة استوديو القرآن المرئي والذكي' : 'Next-Generation Quran Visual Storytelling'}</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-6xl font-black tracking-tight leading-[1.15] text-slate-900 dark:text-white">
                {isAr ? (
                  <>
                    حوّل كل آية إلى <br className="hidden sm:inline" />
                    <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 bg-clip-text text-transparent">
                      قصة سينمائية ملهمة
                    </span>
                  </>
                ) : (
                  <>
                    Turn Every Ayah <br className="hidden sm:inline" />
                    <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 bg-clip-text text-transparent">
                      Into a Story
                    </span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {isAr
                  ? 'ابتكر مقاطع فيديو وقصصاً بصرية رفيعة المستوى مستوحاة من الآيات الكريمة مع التلاوة الصوتية المتزامنة، وترجمات الكاريوكي، والأجواء الطبيعية المهيبة لكافة شبكات التواصل.'
                  : 'Create beautiful Quran-inspired visual stories and videos from any Ayah or Surah with synchronized recitations, bilingual subtitles, and cinematic atmospheres.'}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href={`/${locale}#create`}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{isAr ? 'اصنع فيديو الآن' : 'Create Media'}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>

              <Link
                href={`/${locale}#stories`}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-semibold text-sm border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-md backdrop-blur-md transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4 text-amber-500" />
                <span>{isAr ? 'استكشف القصص' : 'Explore Stories'}</span>
              </Link>
            </div>

            {/* Features trust badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-500">✓</span>
                {isAr ? 'بيانات معتمدة من مؤسسة القرآن' : 'Official Quran.com Content API'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-500">✓</span>
                {isAr ? 'دعم كاريوكي عربي وإنجليزي' : 'Bilingual Synced Subtitles'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-500">✓</span>
                {isAr ? 'تنسيقات 9:16 و 16:9 و 1:1' : 'Multi-Aspect Export'}
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Animated Quran Verse Frame */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-md">
              
              {/* Aspect Ratio Switcher Bar */}
              <div className="flex items-center justify-between mb-3 px-1 text-xs">
                <div className="flex items-center gap-1.5 bg-slate-200/80 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-300/80 dark:border-slate-800">
                  {(['9:16', '16:9', '1:1'] as const).map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setSelectedRatio(ratio)}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                        selectedRatio === ratio
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>

                {/* Ayah selector dots */}
                <div className="flex items-center gap-1.5">
                  {HERO_AYAHS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveAyahIndex(i)}
                      aria-label={`Select Ayah ${i + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        activeAyahIndex === i
                          ? 'w-6 bg-amber-500'
                          : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Video/Story Card Container */}
              <div
                className={`relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 text-white shadow-2xl shadow-emerald-950/20 transition-all duration-300 ${
                  selectedRatio === '9:16'
                    ? 'aspect-[9/14] sm:aspect-[9/15]'
                    : selectedRatio === '16:9'
                      ? 'aspect-[16/10]'
                      : 'aspect-square'
                }`}
              >
                {/* Subtle Islamic Vignette Background Graphic */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-emerald-950/40 pointer-events-none z-0" />

                {/* Islamic Star Lattice Silhouette */}
                <svg
                  className="absolute -top-16 -right-16 w-64 h-64 opacity-15 text-amber-400 animate-glow pointer-events-none"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  <path d="M50 0 L60 35 L95 25 L75 55 L100 80 L65 75 L50 100 L35 75 L0 80 L25 55 L5 25 L40 35 Z" />
                </svg>

                {/* Content Inside Player Frame */}
                <div className="relative z-10 flex flex-col justify-between h-full p-6 sm:p-7">
                  
                  {/* Top Bar inside Video Frame */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] font-semibold text-amber-300 backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                      {currentAyah.theme}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleShare}
                        aria-label="Copy verse"
                        className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Center: Calligraphy Verse */}
                  <div className="space-y-4 my-auto text-center px-2 py-4">
                    <div className="space-y-2">
                      <span className="text-xs text-amber-400/90 font-medium tracking-wide uppercase">
                        {currentAyah.surahNameEn} • {currentAyah.surahNumber}:{currentAyah.ayahNumber}
                      </span>
                      <p
                        dir="rtl"
                        className="font-quran text-2xl sm:text-3xl leading-[2.2] text-amber-50 drop-shadow-md selection:bg-amber-500/40"
                      >
                        {currentAyah.arabicText}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed max-w-sm mx-auto line-clamp-3">
                      "{currentAyah.translation}"
                    </p>
                  </div>

                  {/* Bottom Controls Bar */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    
                    {/* Audio Player Button & Animated Waveform */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={toggleAudio}
                        aria-label={isPlaying ? 'Pause recitation' : 'Play recitation'}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 text-slate-950 font-bold shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                      </button>

                      <div className="text-start">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-slate-200">{currentAyah.reciter}</p>
                          {isPlaying && (
                            <div className="flex items-center gap-0.5 h-3">
                              <span className="w-0.5 bg-amber-400 animate-soundwave-1 rounded-full" />
                              <span className="w-0.5 bg-amber-400 animate-soundwave-2 rounded-full" />
                              <span className="w-0.5 bg-amber-400 animate-soundwave-3 rounded-full" />
                              <span className="w-0.5 bg-amber-400 animate-soundwave-4 rounded-full" />
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Volume2 className="w-2.5 h-2.5 text-amber-500" />
                          <span>128 kbps • Hafs</span>
                        </p>
                      </div>
                    </div>

                    {/* Quick Studio Link */}
                    <Link
                      href={`/${locale}#create`}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all hover:scale-102"
                    >
                      {isAr ? 'تعديل بالقالب' : 'Use Template'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
