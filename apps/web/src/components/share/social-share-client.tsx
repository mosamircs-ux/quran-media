'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@quran-media/i18n';
import type { SocialShareData } from '@/lib/social-share';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Download,
  Copy,
  Check,
  Sparkles,
  Share2,
  ExternalLink,
  BookOpen,
  Layers,
  MessageCircle,
  Send,
  QrCode,
  Smartphone,
} from 'lucide-react';

interface SocialShareClientProps {
  share: SocialShareData;
  socialCopy: {
    shareUrl: string;
    instagramCaption: string;
    tiktokDescription: string;
    youtubeShortsTitle: string;
    youtubeShortsDescription: string;
    twitterIntent: string;
    whatsappIntent: string;
    telegramIntent: string;
    facebookIntent: string;
    hashtags: string;
  };
  locale: Locale;
}

type PlatformTab = 'instagram' | 'tiktok' | 'youtube' | 'x' | 'whatsapp' | 'telegram' | 'facebook';

export function SocialShareClient({ share, socialCopy, locale }: SocialShareClientProps) {
  const [activeTab, setActiveTab] = useState<PlatformTab>('instagram');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const isAr = locale === 'ar';

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const platforms = [
    { id: 'instagram' as const, name: 'Instagram Reels', badge: '9:16 (1080x1920)', color: 'from-pink-600 to-purple-600' },
    { id: 'tiktok' as const, name: 'TikTok', badge: '9:16 (1080x1920)', color: 'from-cyan-500 to-slate-900' },
    { id: 'youtube' as const, name: 'YouTube Shorts', badge: '9:16 (1080x1920)', color: 'from-red-600 to-rose-700' },
    { id: 'whatsapp' as const, name: 'WhatsApp', badge: isAr ? 'رسالة مباشرة' : 'Direct Chat', color: 'from-emerald-500 to-teal-600' },
    { id: 'telegram' as const, name: 'Telegram', badge: isAr ? 'قنوات ومجموعات' : 'Channel Share', color: 'from-sky-500 to-blue-600' },
    { id: 'x' as const, name: 'X (Twitter)', badge: 'Tweet', color: 'from-slate-700 to-black' },
    { id: 'facebook' as const, name: 'Facebook', badge: 'Feed / Stories', color: 'from-blue-600 to-indigo-700' },
  ];

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Top Banner Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-sm">
          <Share2 className="w-3.5 h-3.5" />
          <span>{isAr ? 'مركز النشر والمشاركة لمنصات التواصل' : 'Social Publishing & Sharing Hub'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {share.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {isAr ? `سورة ${share.surahNameAr} [${share.verseKey}] • ${share.reciterName}` : `Surah ${share.surahNameEn} [${share.verseKey}] • ${share.reciterName}`}
        </p>
      </div>

      {/* Main Two-Column Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 9:16 Vertical Video Player Showcase */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-3xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-2xl group">
            <video
              src={share.videoUrl}
              poster={share.thumbnailUrl}
              loop
              playsInline
              autoPlay
              muted={isMuted}
              className="w-full h-full object-cover"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Quality and Format Badges */}
            <div className="absolute top-4 start-4 z-20 flex items-center gap-1.5">
              <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-black text-amber-400 border border-amber-500/30 shadow">
                9:16 • 1080x1920
              </span>
              <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-white border border-slate-700">
                {share.durationSeconds}s
              </span>
            </div>

            {/* Sound Toggle Button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute top-4 end-4 z-20 p-2 rounded-full bg-black/70 backdrop-blur-md text-white hover:bg-black/90 transition-all cursor-pointer shadow"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Bottom Overlay Info */}
            <div className="absolute inset-x-0 bottom-0 z-20 p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent space-y-2 pointer-events-none">
              <p className="font-arabic text-sm font-bold text-white text-center line-clamp-2">
                {share.textUthmani}
              </p>
              <p className="text-[11px] text-amber-300 text-center truncate">
                {isAr ? `سورة ${share.surahNameAr}` : `Surah ${share.surahNameEn}`} [{share.verseKey}]
              </p>
            </div>
          </div>

          {/* Download & Quick Copy Action */}
          <div className="w-full max-w-[340px] mt-4 flex items-center gap-2">
            <a
              href={share.videoUrl}
              download={`${share.id}-1080x1920.mp4`}
              className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isAr ? 'تحميل الفيديو MP4 (1080x1920)' : 'Download 1080x1920 MP4'}</span>
            </a>
          </div>
        </div>

        {/* Right Column: Verse Details & Social Publishing Hub */}
        <div className="lg:col-span-7 space-y-6">
          {/* Verse Card & Translation */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {isAr ? `سورة ${share.surahNameAr}` : `Surah ${share.surahNameEn}`} • آية {share.verseKey}
              </span>
              <span className="text-xs text-slate-400">{share.reciterName}</span>
            </div>

            <p className="font-arabic text-xl sm:text-2xl leading-loose text-slate-900 dark:text-white text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              {share.textUthmani}
            </p>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic font-serif leading-relaxed">
              "{share.translationEn}"
            </p>

            {/* "Create Your Own" Prominent CTA */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <Link
                href={`/${locale}/create/story?surah=${share.surahNumber}&ayah=${share.ayahStart}`}
                className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-950/20 transition-all transform hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAr ? 'اصنع نسختك الخاصة من هذا الفيديو بالذكاء الاصطناعي' : 'Create Your Own Version With AI'}</span>
              </Link>
            </div>
          </div>

          {/* Social Platforms Sharing Suite */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-amber-500" />
                <span>{isAr ? 'تخصيص النشر حسب المنصة' : 'Optimized Formats for Social Media'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isAr ? 'نسخ تلقائي للكابشن والهاشتاغات المصممة لكل منصة ومشاركة بنقرة واحدة' : 'One-click copy captions, hashtags, and direct share intents'}
              </p>
            </div>

            {/* Platform Selection Tabs */}
            <div className="flex flex-wrap gap-2">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActiveTab(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === p.id
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{p.name}</span>
                </button>
              ))}
            </div>

            {/* Platform Active Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              {/* INSTAGRAM REELS */}
              {activeTab === 'instagram' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-pink-600 dark:text-pink-400">Instagram Reels Caption & Hashtags</span>
                    <button
                      onClick={() => copyToClipboard(socialCopy.instagramCaption, 'ig')}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs cursor-pointer shadow-sm"
                    >
                      {copiedKey === 'ig' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'ig' ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الكابشن' : 'Copy Caption')}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-sans whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                    {socialCopy.instagramCaption}
                  </pre>
                </div>
              )}

              {/* TIKTOK */}
              {activeTab === 'tiktok' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-cyan-600 dark:text-cyan-400">TikTok Description & Viral Tags</span>
                    <button
                      onClick={() => copyToClipboard(socialCopy.tiktokDescription, 'tt')}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer shadow-sm"
                    >
                      {copiedKey === 'tt' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'tt' ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الوصف' : 'Copy Description')}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">
                    {socialCopy.tiktokDescription}
                  </pre>
                </div>
              )}

              {/* YOUTUBE SHORTS */}
              {activeTab === 'youtube' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-rose-600 dark:text-rose-400">YouTube Shorts Title & Description</span>
                    <button
                      onClick={() => copyToClipboard(`${socialCopy.youtubeShortsTitle}\n\n${socialCopy.youtubeShortsDescription}`, 'yt')}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer shadow-sm"
                    >
                      {copiedKey === 'yt' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'yt' ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الكل' : 'Copy All')}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-sans whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                    {socialCopy.youtubeShortsTitle}
                    {'\n\n'}
                    {socialCopy.youtubeShortsDescription}
                  </pre>
                </div>
              )}

              {/* WHATSAPP */}
              {activeTab === 'whatsapp' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">
                    {isAr ? 'إرسال التلاوة مباشرة مع المعاينة والترجمة إلى الأهل والأصدقاء' : 'Send recitation with formatted text directly on WhatsApp'}
                  </p>
                  <a
                    href={socialCopy.whatsappIntent}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{isAr ? 'مشاركة عبر واتساب (WhatsApp)' : 'Share to WhatsApp'}</span>
                  </a>
                </div>
              )}

              {/* TELEGRAM */}
              {activeTab === 'telegram' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">
                    {isAr ? 'نشر التلاوة في قنوات ومجموعات التيليجرام الإسلامية' : 'Publish recitation to Telegram channels & groups'}
                  </p>
                  <a
                    href={socialCopy.telegramIntent}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isAr ? 'نشر عبر تيليجرام (Telegram)' : 'Share to Telegram'}</span>
                  </a>
                </div>
              )}

              {/* X (TWITTER) */}
              {activeTab === 'x' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">
                    {isAr ? 'تغريدة جاهزة مع الآية الكريمة ورابط الفيديو' : 'Post pre-formatted tweet with verse and video preview'}
                  </p>
                  <a
                    href={socialCopy.twitterIntent}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 shadow-sm transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{isAr ? 'نشر تغريدة على منصة X' : 'Post to X (Twitter)'}</span>
                  </a>
                </div>
              )}

              {/* FACEBOOK */}
              {activeTab === 'facebook' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">
                    {isAr ? 'مشاركة الفيديو في المجموعات والصفحات على فيسبوك' : 'Share video on Facebook Feed or Stories'}
                  </p>
                  <a
                    href={socialCopy.facebookIntent}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{isAr ? 'مشاركة على فيسبوك (Facebook)' : 'Share to Facebook'}</span>
                  </a>
                </div>
              )}
            </div>

            {/* Direct Share Link Box */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={socialCopy.shareUrl}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-mono select-all"
              />
              <button
                onClick={() => copyToClipboard(socialCopy.shareUrl, 'url')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
              >
                {copiedKey === 'url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'url' ? (isAr ? 'تم!' : 'Copied!') : (isAr ? 'نسخ الرابط' : 'Copy Link')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
