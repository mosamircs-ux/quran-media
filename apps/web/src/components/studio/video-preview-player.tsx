'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  RotateCw,
  Layers,
  Activity,
} from 'lucide-react';
import type { AspectRatio } from '@quran-media/media/types';

interface VideoPreviewPlayerProps {
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  aspectRatio: AspectRatio;
  durationSeconds: number;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  isRendering: boolean;
  renderProgress: number;
  renderStep?: string;
  activeArabicText?: string;
  activeTranslationText?: string;
  fontArabic?: string;
  dualLanguage?: boolean;
  showWaveform?: boolean;
}

export function VideoPreviewPlayer({
  videoUrl,
  thumbnailUrl,
  aspectRatio,
  durationSeconds,
  currentTime,
  onTimeUpdate,
  isRendering,
  renderProgress,
  renderStep,
  activeArabicText,
  activeTranslationText,
  fontArabic = 'Amiri Quran',
  dualLanguage = true,
  showWaveform = true,
}: VideoPreviewPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Aspect ratio container classes
  const aspectStyles: Record<AspectRatio, string> = {
    '9:16': 'aspect-[9/16] max-h-[580px]',
    '16:9': 'aspect-[16/9] max-h-[460px]',
    '1:1': 'aspect-square max-h-[500px]',
    '4:5': 'aspect-[4/5] max-h-[540px]',
  };

  // Synchronize external currentTime updates
  useEffect(() => {
    if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTime) > 0.4) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  const togglePlay = () => {
    if (!videoRef.current) {
      // If simulated playback (no videoUrl yet)
      setIsPlaying((prev) => !prev);
      return;
    }

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Simulated playback ticker if no master video is rendered yet
  useEffect(() => {
    if (!videoUrl && isPlaying) {
      const interval = setInterval(() => {
        onTimeUpdate((currentTime + 0.1) % Math.max(1, durationSeconds));
      }, 100);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [videoUrl, isPlaying, currentTime, durationSeconds, onTimeUpdate]);

  // Audio Waveform Canvas Animation
  useEffect(() => {
    if (!showWaveform || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let tick = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 32;
      const barWidth = canvas.width / bars - 2;

      for (let i = 0; i < bars; i++) {
        const height = isPlaying
          ? Math.abs(Math.sin((i + tick) * 0.3) * (canvas.height * 0.75)) + 4
          : Math.abs(Math.sin(i * 0.3) * 6) + 4;

        const x = i * (barWidth + 2);
        const y = canvas.height - height;

        ctx.fillStyle = isPlaying ? '#f59e0b' : 'rgba(245, 158, 11, 0.4)';
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, height, 2);
        ctx.fill();
      }

      if (isPlaying) tick += 0.15;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, showWaveform]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="relative rounded-3xl bg-slate-950/90 border border-slate-800/80 p-4 sm:p-6 shadow-2xl flex flex-col items-center justify-between overflow-hidden">
      {/* Aspect Ratio Badge Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800/60 text-xs font-semibold text-slate-400">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-200">{aspectRatio}</span>
          <span className="text-slate-500">•</span>
          <span>1080p HD Studio Master</span>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
          <Activity className="w-3 h-3 animate-pulse" />
          <span>Live Studio Viewport</span>
        </div>
      </div>

      {/* Video Viewport Frame */}
      <div className="relative w-full my-4 flex items-center justify-center">
        <div
          className={`relative ${aspectStyles[aspectRatio]} w-full max-w-full rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center`}
        >
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              poster={thumbnailUrl || undefined}
              muted={isMuted}
              playsInline
              onTimeUpdate={() => {
                if (videoRef.current) {
                  onTimeUpdate(videoRef.current.currentTime);
                }
              }}
              onEnded={() => setIsPlaying(false)}
              className="w-full h-full object-cover"
            />
          ) : (
            /* Canvas Visualizer Placeholder Background */
            <div className="relative w-full h-full bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.15),transparent_60%)]" />
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-xl mb-4">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <div className="text-sm font-bold text-slate-300">
                Studio Viewport Ready
              </div>
              <div className="text-xs text-slate-400 mt-1 max-w-xs">
                Click Render to generate HD video stream with Ken Burns motion & Arabic RTL typography.
              </div>
            </div>
          )}

          {/* Dynamic Quran Subtitles Simulator Overlay */}
          <div className="absolute bottom-16 inset-x-4 flex flex-col items-center justify-center pointer-events-none text-center space-y-2 z-10">
            {activeArabicText && (
              <div
                className="text-xl sm:text-2xl font-bold text-amber-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] px-4 py-1.5 rounded-xl bg-slate-950/40 backdrop-blur-[2px]"
                style={{ fontFamily: fontArabic }}
              >
                {activeArabicText}
              </div>
            )}
            {dualLanguage && activeTranslationText && (
              <div className="text-xs sm:text-sm text-slate-100 font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] px-3 py-1 rounded-lg bg-slate-950/40 backdrop-blur-[2px] max-w-md">
                {activeTranslationText}
              </div>
            )}
          </div>

          {/* Dynamic Audio Waveform Overlay */}
          {showWaveform && (
            <div className="absolute bottom-3 inset-x-8 h-8 pointer-events-none flex items-center justify-center z-10 opacity-80">
              <canvas ref={canvasRef} width={260} height={32} className="w-full h-full" />
            </div>
          )}

          {/* Active Background Rendering Overlay */}
          {isRendering && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center gap-4 p-6 z-20 animate-in fade-in duration-300">
              <div className="relative flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
                <div className="absolute font-mono font-bold text-sm text-emerald-300">
                  {renderProgress}%
                </div>
              </div>
              <div className="text-center space-y-1.5 max-w-xs">
                <div className="text-sm font-bold text-slate-100">
                  Synthesizing Master Video
                </div>
                <div className="text-xs text-slate-400 line-clamp-2">
                  {renderStep || 'Compositing Quran scenes, transitions, and audio streams...'}
                </div>
              </div>
              {/* Progress Bar */}
              <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-400 transition-all duration-300 rounded-full"
                  style={{ width: `${Math.max(5, renderProgress)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Media Controls Bar */}
      <div className="w-full space-y-3 pt-3 border-t border-slate-800/80">
        {/* Scrubber Range Slider */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-slate-400">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={Math.max(1, durationSeconds)}
            step={0.1}
            value={currentTime}
            onChange={(e) => onTimeUpdate(Number(e.target.value))}
            className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <span className="text-[11px] font-mono text-slate-400">
            {formatTime(durationSeconds)}
          </span>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5 fill-current" />}
            </button>

            <button
              onClick={() => onTimeUpdate(0)}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsMuted((prev) => !prev)}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (videoRef.current?.requestFullscreen) {
                  videoRef.current.requestFullscreen();
                }
              }}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
