'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@quran-media/i18n';
import { Play, Pause, Sparkles, BookOpen, Clock, Heart, ArrowUpRight } from 'lucide-react';

interface FeaturedStoriesProps {
  locale: Locale;
}

interface StoryItem {
  id: string;
  titleAr: string;
  titleEn: string;
  surahAr: string;
  surahEn: string;
  surahId: number;
  ayahRange: string;
  summaryAr: string;
  summaryEn: string;
  themeAr: string;
  themeEn: string;
  gradient: string;
  duration: string;
  reciter: string;
  audioUrl: string;
  reflectionQuoteAr: string;
  reflectionQuoteEn: string;
}

const STORIES: StoryItem[] = [
  {
    id: 'story-1',
    titleAr: 'سفينة النجاة في طوفان البلاء',
    titleEn: 'The Ark of Deliverance',
    surahAr: 'هود',
    surahEn: 'Hud',
    surahId: 11,
    ayahRange: '41-43',
    summaryAr: 'تأمل مهيب في أمر نوح عليه السلام لقومه وركوب السفينة باسم الله مجراها ومرساها وسط أمواج كالجبال.',
    summaryEn: 'A profound reflection on Prophet Noah boarding the Ark under the Divine Name amidst waves like towering mountains.',
    themeAr: 'التوكل والنجاة',
    themeEn: 'Trust & Salvation',
    gradient: 'from-blue-950 via-slate-900 to-cyan-950',
    duration: '0:54',
    reciter: 'Mishari Rashid Al-Afasy',
    audioUrl: 'https://audio.qurancdn.com/Alafasy/mp3/011041.mp3',
    reflectionQuoteAr: '«وَقَالَ ٱرْكَبُوا۟ فِيهَا بِسْمِ ٱللَّهِ مَجْر۪ىٰهَا وَمُرْسَىٰهَآ»',
    reflectionQuoteEn: '"And he said, ‘Embark in it; in the Name of Allah is its sailing and its anchorage.’"',
  },
  {
    id: 'story-2',
    titleAr: 'نور على نور وسكينة القلب',
    titleEn: 'Light Upon Light',
    surahAr: 'النور',
    surahEn: 'An-Nur',
    surahId: 24,
    ayahRange: '35',
    summaryAr: 'المثل القرآني الأعظم لنور الله في السماوات والأرض والمشكاة التي فيها مصباح يوقد من شجرة مباركة زيتونة.',
    summaryEn: 'The supreme Quranic parable of Allah’s Light in the heavens and earth, radiant as a star from a blessed olive tree.',
    themeAr: 'الهداية الإلهية',
    themeEn: 'Divine Guidance',
    gradient: 'from-amber-950 via-slate-900 to-yellow-950',
    duration: '1:12',
    reciter: 'Mahmoud Khalil Al-Husary',
    audioUrl: 'https://audio.qurancdn.com/Husary/128/024035.mp3',
    reflectionQuoteAr: '«ٱللَّهُ نُورُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ»',
    reflectionQuoteEn: '"Allah is the Light of the heavens and the earth."',
  },
  {
    id: 'story-3',
    titleAr: 'نداء الفجر وبشرى الرضا',
    titleEn: 'The Morning Glow of Solace',
    surahAr: 'الضحى',
    surahEn: 'Ad-Duha',
    surahId: 93,
    ayahRange: '1-8',
    summaryAr: 'رسالة الرحمة الإلهية لنبي الهدى ولكل قلب مكلوم بأن ما ودعك ربك وما قلى، وللآخرة خير لك من الأولى.',
    summaryEn: 'A divine message of solace assuring that your Lord has not forsaken you, and the hereafter is far better than the first.',
    themeAr: 'الرحمة والأمل',
    themeEn: 'Mercy & Hope',
    gradient: 'from-emerald-950 via-slate-900 to-teal-950',
    duration: '0:48',
    reciter: 'AbdulBaset AbdulSamad',
    audioUrl: 'https://audio.qurancdn.com/AbdulBaset/Murattal/mp3/093001.mp3',
    reflectionQuoteAr: '«مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ»',
    reflectionQuoteEn: '"Your Lord has not forsaken you, nor has He become displeased."',
  },
];

export function FeaturedStories({ locale }: FeaturedStoriesProps) {
  const isAr = locale === 'ar';
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);

  const toggleStoryAudio = (story: StoryItem) => {
    if (playingId === story.id) {
      audioInstance?.pause();
      setPlayingId(null);
    } else {
      audioInstance?.pause();
      const newAudio = new Audio(story.audioUrl);
      newAudio.onended = () => setPlayingId(null);
      newAudio.play().catch(() => {});
      setAudioInstance(newAudio);
      setPlayingId(story.id);
    }
  };

  return (
    <section id="stories" className="py-20 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="container mx-auto px-4 sm:px-8 max-w-7xl space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isAr ? 'قصص وتأملات قرآنية' : 'Featured Visual Stories'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isAr ? 'قصص مميزة مستوحاة من الوحي' : 'Featured Quranic Stories'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
              {isAr
                ? 'استكشف قصصاً مرئية صممت بعناية تجمع بين التلاوة الخاشعة والتفسير المعتمد والتصاميم البصرية البديعة.'
                : 'Explore curated visual reflections fusing scholarly tafsir, soul-stirring recitations, and atmospheric cinematography.'}
            </p>
          </div>

          <Link
            href={`/${locale}#create`}
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors"
          >
            <span>{isAr ? 'توليد قصة مخصصة' : 'Generate Custom Story'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stories Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {STORIES.map((story) => {
            const isCurrentPlaying = playingId === story.id;

            return (
              <div
                key={story.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 hover:border-amber-500/50 transition-all duration-300 shadow-xl shadow-slate-950/5 dark:shadow-slate-950/40 p-6 sm:p-7"
              >
                {/* Background Ambient Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${story.gradient} opacity-10 dark:opacity-30 group-hover:opacity-20 dark:group-hover:opacity-40 transition-opacity pointer-events-none`}
                />

                <div className="relative z-10 space-y-5">
                  {/* Top Metadata */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                      {isAr ? story.themeAr : story.themeEn}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{story.duration}</span>
                    </span>
                  </div>

                  {/* Title & Surah Reference */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {isAr ? `سورة ${story.surahAr} [${story.ayahRange}]` : `Surah ${story.surahEn} [${story.ayahRange}]`}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                      {isAr ? story.titleAr : story.titleEn}
                    </h3>
                  </div>

                  {/* Quran Verse Calligraphy Highlight */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800/60 text-center">
                    <p dir="rtl" className="font-quran text-lg leading-loose text-slate-900 dark:text-amber-100">
                      {story.reflectionQuoteAr}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 italic">
                      {story.reflectionQuoteEn}
                    </p>
                  </div>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {isAr ? story.summaryAr : story.summaryEn}
                  </p>
                </div>

                {/* Bottom Action Footer */}
                <div className="relative z-10 pt-6 mt-6 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => toggleStoryAudio(story)}
                      aria-label={isCurrentPlaying ? 'Pause audio' : 'Play audio'}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-all cursor-pointer"
                    >
                      {isCurrentPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </button>
                    <div className="text-[11px]">
                      <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{story.reciter}</p>
                      <p className="text-slate-400">{isAr ? 'تلاوة صوتية' : 'Recitation'}</p>
                    </div>
                  </div>

                  <Link
                    href={`/${locale}#create`}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors"
                  >
                    <span>{isAr ? 'اصنع مثله' : 'Remix'}</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
