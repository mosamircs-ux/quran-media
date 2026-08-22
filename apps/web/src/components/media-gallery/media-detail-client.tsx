'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@quran-media/i18n';
import type { MediaShowcaseItem } from '@/lib/media-catalog';
import {
  Film,
  Play,
  Pause,
  Download,
  Share2,
  Sparkles,
  Check,
  Volume2,
  Code,
  ArrowUpRight,
  Eye,
  Clock,
  Layers,
} from 'lucide-react';

interface MediaDetailClientProps {
  mediaItem: MediaShowcaseItem;
  locale: Locale;
}

export function MediaDetailClient({ mediaItem, locale }: MediaDetailClientProps) {
  const isAr = locale === 'ar';

  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmbed = () => {
    const embedCode = `<iframe src="${window.location.href}/embed" width="100%" height="500" frameborder="0" allowfullscreen></iframe>`;
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  return (
    <div className="space-y-10 pb-20">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href={`/${locale}`} className="hover:text-amber-500 transition-colors">
          {isAr ? 'الرئيسية' : 'Home'}
        </Link>
        <span>/</span>
        <Link href={`/${locale}/videos`} className="hover:text-amber-500 transition-colors">
          {isAr ? 'المقاطع' : 'Videos'}
        </Link>
        <span>/</span>
        <span className="font-bold text-slate-800 dark:text-slate-200">
          {isAr ? mediaItem.titleAr : mediaItem.titleEn}
        </span>
      </nav>

      {/* Main Grid: Video Player + Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left / Center Video Stage (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div
            className={`relative w-full overflow-hidden rounded-3xl bg-gradient-to-br ${mediaItem.gradient} border border-slate-200/80 dark:border-slate-800/80 text-white shadow-2xl flex flex-col justify-between p-6 sm:p-8 ${
              mediaItem.aspectRatio === '9:16'
                ? 'max-w-sm aspect-[9/15]'
                : mediaItem.aspectRatio === '16:9'
                  ? 'aspect-[16/10]'
                  : 'max-w-md aspect-square'
            }`}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between text-xs text-amber-300 font-bold z-10">
              <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-md">
                {mediaItem.aspectRatio} • {mediaItem.resolution}
              </span>
              <span className="text-slate-300 font-mono">{mediaItem.duration}</span>
            </div>

            {/* Center Arabic Calligraphy & Subtitles */}
            <div className="my-auto text-center space-y-4 px-2 z-10">
              <p dir="rtl" className="font-quran text-2xl sm:text-3xl text-amber-50 leading-loose drop-shadow">
                {mediaItem.arabicText}
              </p>
              <p className="text-xs sm:text-sm text-slate-200 italic font-light line-clamp-3">
                "{mediaItem.translation}"
              </p>
            </div>

            {/* Bottom Audio Status Bar */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 z-10">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                <span>{mediaItem.reciterName}</span>
              </span>
              <span className="text-emerald-400 font-bold">HQ Audio</span>
            </div>
          </div>
        </div>

        {/* Right Details & Action Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xl space-y-6">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
                  {isAr ? `سورة ${mediaItem.surahNameAr} [${mediaItem.ayahRange}]` : `Surah ${mediaItem.surahNameEn} [${mediaItem.ayahRange}]`}
                </span>
                <span className="text-xs text-slate-400">{mediaItem.duration}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {isAr ? mediaItem.titleAr : mediaItem.titleEn}
              </h1>
            </div>

            {/* Metadata Summary Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block">{isAr ? 'القارئ' : 'Reciter'}</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{mediaItem.reciterName}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block">{isAr ? 'النمط البصري' : 'Visual Style'}</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
                  {isAr ? mediaItem.visualStyleNameAr : mediaItem.visualStyleNameEn}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block">{isAr ? 'التنسيق والدقة' : 'Format & Res'}</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{mediaItem.aspectRatio} • {mediaItem.resolution}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block">{isAr ? 'المشاهدات والتحميل' : 'Views / Downloads'}</span>
                <span className="font-bold text-amber-500 mt-0.5 block">{mediaItem.viewsCount} / {mediaItem.downloadCount}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => alert(isAr ? 'جاري تنزيل ملف الفيديو بدقة 1080p MP4...' : 'Downloading 1080p MP4 video...')}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isAr ? 'تحميل الفيديو MP4 مجاناً' : 'Download High-Res MP4'}</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'مشاركة الرابط' : 'Share Link')}</span>
                </button>

                <button
                  onClick={handleCopyEmbed}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  {copiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Code className="w-3.5 h-3.5" />}
                  <span>{copiedEmbed ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'كود التضمين' : 'Embed')}</span>
                </button>
              </div>

              <Link
                href={`/${locale}/create?surah=${mediaItem.surahNumber}`}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAr ? 'تعديل وإنشاء نسخة مخصصة في الاستوديو' : 'Remix & Edit in Studio'}</span>
              </Link>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
