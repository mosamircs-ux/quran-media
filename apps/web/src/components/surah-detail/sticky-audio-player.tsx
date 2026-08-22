'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { Locale } from '@quran-media/i18n';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  SkipForward,
  SkipBack,
  X,
  Sparkles,
  Layers,
} from 'lucide-react';

interface StickyAudioPlayerProps {
  surahNumber: number;
  surahNameAr: string;
  surahNameEn: string;
  activeVerseNumber: number | null;
  totalVerses: number;
  onVerseChange?: (verseNumber: number) => void;
  locale: Locale;
}

const RECITERS = [
  { id: 7, name: 'مشاري راشد العفاسي (Mishari Al-Afasy)' },
  { id: 1, name: 'محمود خليل الحصري (Al-Husary)' },
  { id: 2, name: 'عبد الباسط عبد الصمد (AbdulBaset)' },
  { id: 3, name: 'عبد الرحمن السديس (As-Sudais)' },
];

export function StickyAudioPlayer({
  surahNumber,
  surahNameAr,
  surahNameEn,
  activeVerseNumber,
  totalVerses,
  onVerseChange,
  locale,
}: StickyAudioPlayerProps) {
  const isAr = locale === 'ar';
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [selectedReciterId, setSelectedReciterId] = useState(7);
  const [isMinimized, setIsMinimized] = useState(false);

  // Build audio URL for current verse or chapter
  const currentAyahNum = activeVerseNumber || 1;
  const audioUrl = `https://audio.qurancdn.com/Alafasy/mp3/${String(surahNumber).padStart(3, '0')}${String(currentAyahNum).padStart(3, '0')}.mp3`;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = audioUrl;
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleRateChange = () => {
    const rates = [1, 1.25, 1.5, 0.75];
    const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIndex] ?? 1;
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const handleNextVerse = () => {
    if (currentAyahNum < totalVerses && onVerseChange) {
      onVerseChange(currentAyahNum + 1);
    }
  };

  const handlePrevVerse = () => {
    if (currentAyahNum > 1 && onVerseChange) {
      onVerseChange(currentAyahNum - 1);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-4xl mx-auto animate-in slide-in-from-bottom-6">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          if (currentAyahNum < totalVerses && onVerseChange) {
            onVerseChange(currentAyahNum + 1);
          } else {
            setIsPlaying(false);
          }
        }}
      />

      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl shadow-2xl p-4 sm:p-5 text-slate-900 dark:text-white space-y-3">
        
        {/* Top bar inside sticky player */}
        <div className="flex items-center justify-between gap-4">
          
          {/* Surah & Verse Info */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 text-slate-950 font-bold shadow-md">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold">
                  {isAr ? `سورة ${surahNameAr}` : `Surah ${surahNameEn}`}
                </span>
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  {isAr ? `الآية ${currentAyahNum}` : `Ayah ${currentAyahNum}`} / {totalVerses}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                {RECITERS.find((r) => r.id === selectedReciterId)?.name}
              </p>
            </div>
          </div>

          {/* Player Main Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Prev Ayah */}
            <button
              onClick={handlePrevVerse}
              disabled={currentAyahNum <= 1}
              aria-label="Previous Ayah"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-all cursor-pointer"
            >
              <SkipBack className="w-4 h-4 rtl:rotate-180" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold shadow-lg shadow-amber-500/25 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            {/* Next Ayah */}
            <button
              onClick={handleNextVerse}
              disabled={currentAyahNum >= totalVerses}
              aria-label="Next Ayah"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-all cursor-pointer"
            >
              <SkipForward className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>

          {/* Speed & Reciter Select */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={handleRateChange}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {playbackRate}x
            </button>

            <select
              value={selectedReciterId}
              onChange={(e) => setSelectedReciterId(Number(e.target.value))}
              className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1 text-[11px] text-slate-800 dark:text-slate-200 font-semibold focus:outline-none"
            >
              {RECITERS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Audio Progress Scrubber */}
        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-amber-500"
          />
          <span>{formatTime(duration)}</span>
        </div>

      </div>
    </div>
  );
}
