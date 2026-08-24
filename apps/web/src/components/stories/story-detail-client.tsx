'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import type { Locale } from '@quran-media/i18n';
import type { QuranStory } from '@/lib/stories-catalog';
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Share2,
  Bookmark,
  Sparkles,
  BookOpen,
  Check,
  Copy,
  Clock,
  Eye,
  Calendar,
  Layers,
  ChevronRight,
  ChevronLeft,
  Wand2,
  CheckCircle2,
  Flame,
  Globe,
  Code,
  Send,
} from 'lucide-react';

interface StoryDetailClientProps {
  story: QuranStory;
  relatedStories: QuranStory[];
  locale: Locale;
}

export function StoryDetailClient({
  story,
  relatedStories,
  locale,
}: StoryDetailClientProps) {
  const isAr = locale === 'ar';

  // Playback State
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // User Actions State
  const [isSaved, setIsSaved] = useState(false);
  const [savesCount, setSavesCount] = useState(story.savesCount);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const toggleSave = () => {
    setIsSaved((prev) => {
      const next = !prev;
      setSavesCount((c) => (next ? c + 1 : c - 1));
      return next;
    });
  };

  const togglePlayVideo = () => {
    if (!videoRef.current) return;
    if (isPlayingVideo) {
      videoRef.current.pause();
      setIsPlayingVideo(false);
    } else {
      videoRef.current.play();
      setIsPlayingVideo(true);
      if (isPlayingAudio && audioRef.current) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      }
    }
  };

  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play();
      setIsPlayingAudio(true);
      if (isPlayingVideo && videoRef.current) {
        videoRef.current.pause();
        setIsPlayingVideo(false);
      }
    }
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const embedCode = `<iframe src="${currentUrl}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;

  const copyToClipboard = (text: string, isEmbed: boolean) => {
    navigator.clipboard.writeText(text);
    if (isEmbed) {
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const formatDate = (isoDate: string) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Breadcrumb Navigation & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/80 border border-slate-800/80 p-4 sm:p-5 rounded-3xl backdrop-blur-md shadow-xl">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 flex-wrap">
          <Link
            href={`/${locale}/stories`}
            className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{isAr ? 'كافة القصص' : 'Stories'}</span>
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-amber-400">{isAr ? story.categoryNameAr : story.categoryNameEn}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200 font-bold truncate max-w-[200px] sm:max-w-xs">
            {isAr ? story.titleAr : story.titleEn}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Save Button */}
          <button
            onClick={toggleSave}
            className={`py-2 px-3.5 rounded-2xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow ${
              isSaved
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? (isAr ? 'تم الحفظ' : 'Saved') : (isAr ? 'حفظ القصة' : 'Save')}</span>
            <span className="opacity-80 font-mono text-[11px]">({savesCount})</span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="py-2 px-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isAr ? 'مشاركة' : 'Share'}</span>
          </button>

          {/* Create Your Own Version CTA */}
          <Link
            href={`/${locale}/create/story?surah=${story.surahNumber}&fromAyah=${story.ayahStart}&toAyah=${story.ayahEnd}`}
            className="py-2 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>{isAr ? 'أنشئ نسختك الخاصة' : 'Create Your Version'}</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Video Player + Story Meta (7 cols) & Quran Verse + Tafsir (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Video Player & Narrative Explanation (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Cinematic Video Player Container */}
          <div className="relative rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl group">
            <div className="relative aspect-video w-full flex items-center justify-center bg-slate-900">
              <video
                ref={videoRef}
                src={story.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                poster={story.thumbnailUrl}
                muted={isMuted}
                playsInline
                onEnded={() => setIsPlayingVideo(false)}
                className="w-full h-full object-cover"
              />

              {/* Play / Pause Big Center Button Overlay */}
              {!isPlayingVideo && (
                <div
                  onClick={togglePlayVideo}
                  className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-opacity group-hover:bg-slate-950/30"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-500/90 text-slate-950 flex items-center justify-center shadow-2xl shadow-emerald-500/40 transform hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                </div>
              )}
            </div>

            {/* Video Controls Footer */}
            <div className="p-4 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlayVideo}
                  className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors shadow"
                >
                  {isPlayingVideo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={() => setIsMuted((prev) => !prev)}
                  className="p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <div className="text-xs font-mono text-slate-400">
                  <span>{story.durationFormatted}</span>
                  <span className="mx-2">•</span>
                  <span className="text-emerald-400">1080p HD Master</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-300">
                  {isAr ? story.categoryNameAr : story.categoryNameEn}
                </span>
              </div>
            </div>
          </div>

          {/* Title & Metadata Stats */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>
                  {isAr
                    ? `سورة ${story.surahNameAr} (${story.ayahRange})`
                    : `Surah ${story.surahNameEn} (${story.ayahRange})`}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">{formatDate(story.createdAt)}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-100 leading-tight">
                {isAr ? story.titleAr : story.titleEn}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {isAr ? story.shortSummaryAr : story.shortSummaryEn}
              </p>
            </div>

            {/* Views and Stats Bar */}
            <div className="flex items-center gap-4 py-3 border-y border-slate-800/80 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>{story.viewsCount.toLocaleString()} {isAr ? 'مشاهدة' : 'Views'}</span>
              </span>

              <span className="flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-amber-400" />
                <span>{savesCount.toLocaleString()} {isAr ? 'حفظ وتفضيل' : 'Saves'}</span>
              </span>

              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>{story.language === 'dual' ? (isAr ? 'مزدوج (عربي + إنجليزي)' : 'Dual (Arabic + English)') : story.language}</span>
              </span>
            </div>
          </div>

          {/* Comprehensive Narrative Story Explanation */}
          <div className="rounded-3xl bg-slate-950/80 border border-slate-800/80 p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-4">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-100">
                  {isAr ? 'التدبر والبيان القصصي' : 'Story Narrative & Thematic Insight'}
                </h2>
                <p className="text-xs text-slate-400">
                  {isAr ? 'تحليل عميق للأبعاد التربوية والإيمانية في القصة' : 'Profound spiritual takeaways and theological insights'}
                </p>
              </div>
            </div>

            {/* Full Explanation Content */}
            <div className="text-sm sm:text-base text-slate-200 leading-relaxed space-y-4">
              <p>{isAr ? story.fullExplanationAr : story.fullExplanationEn}</p>
            </div>

            {/* Spiritual & Ethical Takeaways */}
            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {isAr ? 'أهم الدروس والعبر المستفادة:' : 'Key Spiritual Lessons & Takeaways:'}
              </h3>
              <div className="space-y-2.5">
                {(isAr ? story.takeawaysAr : story.takeawaysEn).map((takeaway, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/70 border border-slate-800"
                  >
                    <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs sm:text-sm text-slate-200 leading-normal">{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quranic Verse, Audio Reciter & Classical Tafsir (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quranic Verse Box in Uthmani Script */}
          <div className="rounded-3xl bg-slate-950/90 border border-slate-800 p-6 sm:p-7 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-200">
                  {isAr ? 'الآيات الكريمة بالرسم العثماني' : 'Quranic Verses (Uthmani)'}
                </span>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-emerald-400">
                {story.ayahRange}
              </span>
            </div>

            {/* Arabic Verse Text */}
            <div
              className="text-xl sm:text-2xl font-bold text-amber-200 leading-loose text-right font-amiri p-4 rounded-2xl bg-slate-900/60 border border-slate-800"
              dir="rtl"
            >
              {story.arabicVerseText}
            </div>

            {/* Authentic Translation */}
            <div className="space-y-1 text-xs sm:text-sm text-slate-300 italic leading-relaxed p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-[10px] uppercase font-bold text-slate-500 not-italic mb-1">
                {isAr ? 'الترجمة الإنجليزية المعتمدة (Clear Quran / Saheeh)' : 'Verified Translation'}
              </div>
              <p>&ldquo;{story.translationText}&rdquo;</p>
            </div>

            {/* Soulful Recitation Audio Player */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlayAudio}
                  className="p-2.5 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors shadow"
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-100">
                    {isAr ? story.reciterNameAr : story.reciterNameEn}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {isAr ? 'تلاوة مرتلة برواية حفص عن عاصم' : 'Murattal Quran Recitation'}
                  </div>
                </div>
              </div>

              <audio ref={audioRef} src={story.reciterAudioUrl} onEnded={() => setIsPlayingAudio(false)} />
            </div>
          </div>

          {/* Classical Tafsir & Approved Source Box */}
          <div className="rounded-3xl bg-slate-950/90 border border-slate-800 p-6 sm:p-7 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100">
                  {isAr ? 'التفسير المعتمد والسند' : 'Approved Classical Tafsir'}
                </h3>
                <span className="text-[11px] text-amber-400 font-semibold">{story.tafsirSource}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isAr ? story.tafsirSummaryAr : story.tafsirSummaryEn}
            </p>
          </div>

          {/* Related Verses Section */}
          {story.relatedVerses && story.relatedVerses.length > 0 && (
            <div className="rounded-3xl bg-slate-950/90 border border-slate-800 p-6 space-y-4 shadow-xl">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'آيات قرآنية ذات صلة بالقصة:' : 'Connected Quranic Verses:'}</span>
              </div>

              <div className="space-y-3">
                {story.relatedVerses.map((v, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-right"
                    dir="rtl"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400">
                      <span>{isAr ? `سورة ${v.surahNameAr} [${v.ayahNumber}]` : `Surah ${v.surahNameEn} [${v.ayahNumber}]`}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{v.verseKey}</span>
                    </div>
                    <div className="text-sm font-amiri text-amber-200 font-bold leading-relaxed">
                      {v.textUthmani}
                    </div>
                    <div className="text-[11px] text-slate-400 text-left italic pt-1" dir="ltr">
                      {v.translation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Create Custom Story Version CTA Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow">
              <Wand2 className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-100">
                {isAr ? 'هل تود إنشاء نسختك الخاصة من هذه القصة؟' : 'Remix & Create Your Own Version'}
              </h4>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'قم بتوليد قصة بصرية كاملة مع ضبط المشاهد والخلفيات وتصديرها كفيديو بدقة عالية.'
                  : 'Customize scenes, motion, calligraphy, and render custom HD Quran videos in the Studio.'}
              </p>
            </div>
            <Link
              href={`/${locale}/create/story?surah=${story.surahNumber}&fromAyah=${story.ayahStart}&toAyah=${story.ayahEnd}`}
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAr ? 'فتح في مولد القصص القرآني' : 'Open in Story Generator'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Related Stories Grid / Carousel */}
      {relatedStories.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-100">
                {isAr ? 'قصص قرآنية مقترحة ذات صلة' : 'Related Quran Stories'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'اكتشف المزيد من التأملات والقصص في نفس التصنيف والموضوع'
                  : 'Explore more spiritual contemplations and narratives in this category'}
              </p>
            </div>

            <Link
              href={`/${locale}/stories`}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>{isAr ? 'عرض كافة القصص' : 'View All Stories'}</span>
              {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedStories.map((rel) => (
              <Link
                key={rel.id}
                href={`/${locale}/stories/${rel.slug}`}
                className="group rounded-3xl border border-slate-800 bg-slate-950/80 hover:border-emerald-500/50 transition-all duration-300 p-5 space-y-3 shadow-lg hover:shadow-2xl"
              >
                <div className="relative h-40 rounded-2xl overflow-hidden bg-slate-900">
                  <img
                    src={rel.thumbnailUrl}
                    alt={isAr ? rel.titleAr : rel.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <span className="absolute bottom-2.5 left-2.5 rtl:left-auto rtl:right-2.5 px-2.5 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-sm text-[10px] font-mono text-emerald-300">
                    {rel.durationFormatted}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-emerald-400">
                    {isAr ? `سورة ${rel.surahNameAr} (${rel.ayahRange})` : `Surah ${rel.surahNameEn} (${rel.ayahRange})`}
                  </span>
                  <h4 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {isAr ? rel.titleAr : rel.titleEn}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{isAr ? rel.shortSummaryAr : rel.shortSummaryEn}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Share Modal Dialog */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    {isAr ? 'مشاركة القصة القرآنية' : 'Share Quran Story'}
                  </h3>
                  <p className="text-xs text-slate-400 truncate max-w-[280px]">
                    {isAr ? story.titleAr : story.titleEn}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-sm p-1"
              >
                ✕
              </button>
            </div>

            {/* Social Sharing Shortcuts */}
            <div className="grid grid-cols-3 gap-2.5">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(isAr ? story.titleAr : story.titleEn)}&url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-center text-xs font-bold text-slate-200 hover:text-white transition-colors"
              >
                Twitter / X
              </a>

              <a
                href={`https://wa.me/?text=${encodeURIComponent((isAr ? story.titleAr : story.titleEn) + ' ' + currentUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-center text-xs font-bold text-emerald-400 transition-colors"
              >
                WhatsApp
              </a>

              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(isAr ? story.titleAr : story.titleEn)}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-center text-xs font-bold text-cyan-400 transition-colors"
              >
                Telegram
              </a>
            </div>

            {/* Copy Direct Link */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                {isAr ? 'رابط القصة المباشر' : 'Direct Story URL'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(currentUrl, false)}
                  className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 shadow"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
                </button>
              </div>
            </div>

            {/* Copy Embed Code */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-slate-400" />
                <span>{isAr ? 'تضمين في موقعك (IFrame)' : 'Embed Code (IFrame)'}</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={embedCode}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 font-mono focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(embedCode, true)}
                  className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 shadow"
                >
                  {copiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmbed ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
