'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Locale } from '@quran-media/i18n';
import {
  Play,
  Pause,
  BookOpen,
  Sparkles,
  Film,
  Image as ImageIcon,
  Bookmark,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Volume2,
} from 'lucide-react';
import { TafsirModal } from './tafsir-modal';
import { MediaLauncherModal } from './media-launcher-modal';

export interface AyahCardData {
  verseKey: string; // e.g. "2:255"
  surahNumber: number;
  ayahNumber: number;
  surahNameAr: string;
  surahNameEn: string;
  juzNumber?: number;
  hizbNumber?: number;
  pageNumber?: number;
  arabicText: string;
  translation: string;
  transliteration?: string;
  audioUrl?: string;
  reciterName?: string;
  tafsirSnippet?: string;
}

interface AyahCardProps {
  ayah: AyahCardData;
  locale: Locale;
  isBookmarked?: boolean;
  onToggleBookmark?: (verseKey: string) => void;
}

export function AyahCard({
  ayah,
  locale,
  isBookmarked = false,
  onToggleBookmark,
}: AyahCardProps) {
  const isAr = locale === 'ar';

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [tafsirOpen, setTafsirOpen] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaMode, setMediaMode] = useState<'video' | 'image' | 'story'>('video');

  const defaultAudioUrl =
    ayah.audioUrl ||
    `https://audio.qurancdn.com/Alafasy/mp3/${String(ayah.surahNumber).padStart(3, '0')}${String(ayah.ayahNumber).padStart(3, '0')}.mp3`;

  useEffect(() => {
    return () => {
      audioInstance?.pause();
    };
  }, [audioInstance]);

  const toggleAudio = () => {
    if (isPlaying) {
      audioInstance?.pause();
      setIsPlaying(false);
    } else {
      audioInstance?.pause();
      const newAudio = new Audio(defaultAudioUrl);
      newAudio.onended = () => setIsPlaying(false);
      newAudio.play().catch(() => {});
      setAudioInstance(newAudio);
      setIsPlaying(true);
    }
  };

  const handleCopy = () => {
    const text = `${ayah.arabicText}\n"${ayah.translation}"\n[Surah ${ayah.surahNameEn} - ${ayah.verseKey}]`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/${locale}/ayah/${ayah.surahNumber}/${ayah.ayahNumber}`;
    if (navigator.share) {
      navigator.share({
        title: `Surah ${ayah.surahNameEn} [${ayah.verseKey}]`,
        text: `${ayah.arabicText}\n${ayah.translation}`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openMediaLauncher = (mode: 'video' | 'image' | 'story') => {
    setMediaMode(mode);
    setMediaModalOpen(true);
  };

  return (
    <>
      <div className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 hover:border-amber-500/50 transition-all duration-300 shadow-md hover:shadow-2xl space-y-6">
        
        {/* Top Badges & Quick Action Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Surah & Ayah Badge */}
            <Link
              href={`/${locale}/ayah/${ayah.surahNumber}/${ayah.ayahNumber}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-xs font-bold text-amber-700 dark:text-amber-300 transition-colors"
            >
              <span>{isAr ? `سورة ${ayah.surahNameAr}` : `Surah ${ayah.surahNameEn}`}</span>
              <span className="text-slate-400 font-mono">[{ayah.verseKey}]</span>
            </Link>

            {ayah.juzNumber && (
              <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-400 dark:text-slate-500 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                {isAr ? `الجزء ${ayah.juzNumber}` : `Juz ${ayah.juzNumber}`}
              </span>
            )}
          </div>

          {/* Quick Utility Actions (Share, Copy, Bookmark, Details Link) */}
          <div className="flex items-center gap-1 text-slate-400">
            {/* Direct SEO Ayah Link */}
            <Link
              href={`/${locale}/ayah/${ayah.surahNumber}/${ayah.ayahNumber}`}
              aria-label="Open detailed ayah page"
              className="p-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>

            {/* Copy */}
            <button
              onClick={handleCopy}
              aria-label="Copy verse"
              className="p-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              aria-label="Share verse"
              className="p-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Bookmark */}
            {onToggleBookmark && (
              <button
                onClick={() => onToggleBookmark(ayah.verseKey)}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark ayah'}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  isBookmarked
                    ? 'text-amber-500 bg-amber-500/10'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Center: Arabic Calligraphy Verse */}
        <div className="py-2 text-center sm:text-start">
          <p
            dir="rtl"
            className="font-quran text-2xl sm:text-3xl leading-[2.3] text-slate-900 dark:text-amber-100 font-normal selection:bg-amber-500/30"
          >
            {ayah.arabicText}
          </p>
        </div>

        {/* Translation & Transliteration */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            "{ayah.translation}"
          </p>
          {ayah.transliteration && (
            <p className="text-xs text-slate-400 dark:text-slate-500 italic font-light line-clamp-1">
              {ayah.transliteration}
            </p>
          )}
        </div>

        {/* Tafsir Snippet Preview */}
        {ayah.tafsirSnippet && (
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 text-xs space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                {isAr ? 'لمحة تفسيرية' : 'Tafsir Insight'}
              </span>
              <button
                onClick={() => setTafsirOpen(true)}
                className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                {isAr ? 'قراءة التفسير كاملاً ←' : 'Read Full Tafsir →'}
              </button>
            </div>
            <p className="text-slate-600 dark:text-slate-400 line-clamp-2 text-[11px] leading-relaxed">
              {ayah.tafsirSnippet}
            </p>
          </div>
        )}

        {/* Bottom Interactive Action Toolbar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          
          {/* Audio Listen Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAudio}
              aria-label={isPlaying ? 'Pause recitation' : 'Play recitation'}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            <div className="text-[11px]">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                {isAr ? 'استماع للتلاوة' : 'Listen'}
              </span>
              <span className="text-[10px] text-slate-400">
                {ayah.reciterName || 'Mishari Al-Afasy'}
              </span>
            </div>
          </div>

          {/* Creation & Tafsir Actions */}
          <div className="flex items-center gap-2">
            {/* Read Tafsir */}
            <button
              onClick={() => setTafsirOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              {isAr ? 'التفسير' : 'Tafsir'}
            </button>

            {/* Create Image */}
            <button
              onClick={() => openMediaLauncher('image')}
              title={isAr ? 'تصميم صورة' : 'Create Image'}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 hover:text-emerald-500 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>

            {/* Create Story */}
            <button
              onClick={() => openMediaLauncher('story')}
              title={isAr ? 'تأليف قصة' : 'Create Story'}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/10 hover:text-amber-500 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
            </button>

            {/* Create Video (Primary) */}
            <button
              onClick={() => openMediaLauncher('video')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-102 cursor-pointer"
            >
              <Film className="w-3.5 h-3.5" />
              <span>{isAr ? 'فيديو' : 'Video'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Tafsir Modal Dialog */}
      <TafsirModal
        isOpen={tafsirOpen}
        onClose={() => setTafsirOpen(false)}
        verseKey={ayah.verseKey}
        surahNameAr={ayah.surahNameAr}
        surahNameEn={ayah.surahNameEn}
        arabicText={ayah.arabicText}
        translation={ayah.translation}
        locale={locale}
      />

      {/* Media Launcher Modal Dialog */}
      <MediaLauncherModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        verseKey={ayah.verseKey}
        surahNumber={ayah.surahNumber}
        ayahNumber={ayah.ayahNumber}
        surahNameAr={ayah.surahNameAr}
        surahNameEn={ayah.surahNameEn}
        arabicText={ayah.arabicText}
        translation={ayah.translation}
        locale={locale}
        defaultMode={mediaMode}
      />
    </>
  );
}
