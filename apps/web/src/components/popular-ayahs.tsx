'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@quran-media/i18n';
import { Bookmark, Play, Pause, Sparkles, Volume2, Share2, Check } from 'lucide-react';

interface PopularAyahsProps {
  locale: Locale;
}

interface AyahCardItem {
  key: string;
  surahNumber: number;
  ayahNumber: number;
  surahNameAr: string;
  surahNameEn: string;
  themeAr: string;
  themeEn: string;
  arabicText: string;
  translation: string;
  transliteration: string;
  audioUrl: string;
}

const POPULAR_AYAHS: AyahCardItem[] = [
  {
    key: '2:255',
    surahNumber: 2,
    ayahNumber: 255,
    surahNameAr: 'البقرة',
    surahNameEn: 'Al-Baqarah',
    themeAr: 'آية الكرسي - أعظم آية',
    themeEn: 'Ayat Al-Kursi - The Throne',
    arabicText: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ',
    translation: 'Allah! There is no god ˹worthy of worship˺ except Him, the Ever-Living, All-Sustaining.',
    transliteration: 'Allāhu lā ilāha illā huwal-ḥayyul-qayyūm, lā ta\'khudhuhū sinatuw-wa lā nawm',
    audioUrl: 'https://audio.qurancdn.com/Alafasy/mp3/002255.mp3',
  },
  {
    key: '94:5-6',
    surahNumber: 94,
    ayahNumber: 5,
    surahNameAr: 'الشرح',
    surahNameEn: 'Ash-Sharh',
    themeAr: 'بشرى الفرج بعد الضيق',
    themeEn: 'Ease After Hardship',
    arabicText: 'فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا • إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا',
    translation: 'So, surely with hardship comes ease. Surely with hardship comes ease.',
    transliteration: 'Fa-inna ma\'al-\'usri yusrā, Inna ma\'al-\'usri yusrā',
    audioUrl: 'https://audio.qurancdn.com/Alafasy/mp3/094005.mp3',
  },
  {
    key: '2:152',
    surahNumber: 2,
    ayahNumber: 152,
    surahNameAr: 'البقرة',
    surahNameEn: 'Al-Baqarah',
    themeAr: 'فضل الذكر والشكر',
    themeEn: 'Remembrance & Gratitude',
    arabicText: 'فَٱذْكُرُونِىٓ أَذْكُرْكُمْ وَٱشْكُرُوا۟ لِى وَلَا تَكْفُرُونِ',
    translation: 'So remember Me; I will remember you. And be grateful to Me and do not deny Me.',
    transliteration: 'Fadhkurūnī adhkurkum washkurū lī wa lā takfurūn',
    audioUrl: 'https://audio.qurancdn.com/Alafasy/mp3/002152.mp3',
  },
  {
    key: '3:139',
    surahNumber: 3,
    ayahNumber: 139,
    surahNameAr: 'آل عمران',
    surahNameEn: 'Ali \'Imran',
    themeAr: 'عزة المؤمنين واليقين',
    themeEn: 'Faith & Resilience',
    arabicText: 'وَلَا تَهِنُوا۟ وَلَا تَحْزَنُوا۟ وَأَنتُمُ ٱلْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ',
    translation: 'Do not falter or grieve, for you will have the upper hand, if you are ˹true˺ believers.',
    transliteration: 'Wa lā tahinū wa lā taḥzanū wa antumul-a\'lawna in kuntum mu\'minīn',
    audioUrl: 'https://audio.qurancdn.com/Alafasy/mp3/003139.mp3',
  },
  {
    key: '21:87',
    surahNumber: 21,
    ayahNumber: 87,
    surahNameAr: 'الأنبياء',
    surahNameEn: 'Al-Anbiya',
    themeAr: 'دعاء ذي النون في الظلمات',
    themeEn: 'Supplication of Yunus',
    arabicText: 'لَّآ إِلَٰهَ إِلَّآ أَنتَ سُبْحَٰنَكَ إِنِّى كُنتُ مِنَ ٱلظَّٰلِمِينَ',
    translation: 'There is no god ˹worthy of worship˺ except You. Glory be to You! I have certainly done wrong.',
    transliteration: 'Lā ilāha illā anta subḥānaka innī kuntu minaẓ-ẓālimīn',
    audioUrl: 'https://audio.qurancdn.com/Alafasy/mp3/021087.mp3',
  },
  {
    key: '55:60',
    surahNumber: 55,
    ayahNumber: 60,
    surahNameAr: 'الرحمن',
    surahNameEn: 'Ar-Rahman',
    themeAr: 'جزاء الإحسان',
    themeEn: 'The Reward of Goodness',
    arabicText: 'هَلْ جَزَآءُ ٱلْإِحْسَٰنِ إِلَّا ٱلْإِحْسَٰنُ',
    translation: 'Is the reward for good ˹anything˺ but good?',
    transliteration: 'Hal jazā\'ul-iḥsāni illal-iḥsān',
    audioUrl: 'https://audio.qurancdn.com/Alafasy/mp3/055060.mp3',
  },
];

export function PopularAyahs({ locale }: PopularAyahsProps) {
  const isAr = locale === 'ar';
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggleAudio = (item: AyahCardItem) => {
    if (playingKey === item.key) {
      audioInstance?.pause();
      setPlayingKey(null);
    } else {
      audioInstance?.pause();
      const newAudio = new Audio(item.audioUrl);
      newAudio.onended = () => setPlayingKey(null);
      newAudio.play().catch(() => {});
      setAudioInstance(newAudio);
      setPlayingKey(item.key);
    }
  };

  const handleShare = (item: AyahCardItem) => {
    navigator.clipboard.writeText(`${item.arabicText}\n${item.translation} [${item.surahNameEn} ${item.key}]`);
    setCopiedKey(item.key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <section id="ayahs" className="py-20 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="container mx-auto px-4 sm:px-8 max-w-7xl space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isAr ? 'الآيات الأكثر طلباً وتأثيراً' : 'Beloved & Popular Ayahs'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isAr ? 'آيات كريمة تلامس القلوب' : 'Profound Quranic Ayahs'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {isAr
              ? 'اختر أي آية للاستماع المباشر إليها أو تحويلها فوراً إلى تصميم وقصة مرئية سينمائية.'
              : 'Listen to iconic verses or convert them directly into tailored social media videos.'}
          </p>
        </div>

        {/* Grid of Ayah Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_AYAHS.map((item) => {
            const isPlaying = playingKey === item.key;

            return (
              <div
                key={item.key}
                className="group relative flex flex-col justify-between p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 hover:border-amber-500/40 transition-all duration-300 shadow-md shadow-slate-950/5 dark:shadow-slate-950/30"
              >
                <div className="space-y-4">
                  {/* Header info */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                      {isAr ? item.themeAr : item.themeEn}
                    </span>

                    <button
                      onClick={() => handleShare(item)}
                      aria-label="Copy ayah"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    >
                      {copiedKey === item.key ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Arabic Text */}
                  <div className="py-2 text-center">
                    <p dir="rtl" className="font-quran text-2xl leading-[2.1] text-slate-900 dark:text-amber-100">
                      {item.arabicText}
                    </p>
                  </div>

                  {/* Translation & Transliteration */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                      "{item.translation}"
                    </p>
                    <p className="text-[11px] text-slate-400 line-clamp-1 font-light">
                      {item.transliteration}
                    </p>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAudio(item)}
                      aria-label={isPlaying ? 'Pause recitation' : 'Play recitation'}
                      className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow transition-transform cursor-pointer"
                    >
                      {isPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </button>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isAr ? `سورة ${item.surahNameAr}` : `Surah ${item.surahNameEn}`} [{item.key}]
                    </span>
                  </div>

                  <Link
                    href={`/${locale}#create`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow transition-all hover:scale-102"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isAr ? 'اصنع فيديو' : 'Create'}</span>
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
