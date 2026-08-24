'use client';

import React from 'react';
import {
  Clock,
  Plus,
  Trash2,
  MoveHorizontal,
  ZoomIn,
  Sparkles,
  ArrowRightLeft,
  Eye,
} from 'lucide-react';
import type { MediaScene } from '@quran-media/media/types';
import type { Locale } from '@quran-media/i18n';

interface TimelineEditorProps {
  scenes: MediaScene[];
  activeSceneIndex: number;
  onSelectScene: (index: number) => void;
  onAddScene: () => void;
  onRemoveScene: (index: number) => void;
  currentTime: number;
  totalDuration: number;
  onSeek: (time: number) => void;
  locale: Locale;
}

export function TimelineEditor({
  scenes,
  activeSceneIndex,
  onSelectScene,
  onAddScene,
  onRemoveScene,
  currentTime,
  totalDuration,
  onSeek,
  locale,
}: TimelineEditorProps) {
  const isAr = locale === 'ar';

  // Compute start offset for each scene
  let accumulated = 0;
  const sceneOffsets = scenes.map((s) => {
    const start = accumulated;
    accumulated += s.duration;
    return { start, end: accumulated, duration: s.duration };
  });

  const playheadPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div className="rounded-3xl bg-slate-950/80 border border-slate-800/80 p-5 space-y-4 shadow-xl">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-200">
            {isAr ? 'المخطط الزمني للمشاهد' : 'Scenes Timeline'} ({scenes.length} {isAr ? 'مشاهد' : 'scenes'})
          </span>
        </div>

        <button
          onClick={onAddScene}
          className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAr ? 'إضافة مشهد' : 'Add Scene'}</span>
        </button>
      </div>

      {/* Timeline Visual Track */}
      <div className="relative w-full h-28 bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 overflow-x-auto flex items-center gap-2.5 scrollbar-none">
        {/* Playhead Marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-20 pointer-events-none transition-all duration-100 flex flex-col items-center shadow-[0_0_8px_#f59e0b]"
          style={{ left: `${Math.min(99.5, Math.max(0.5, playheadPercent))}%` }}
        >
          <div className="w-2.5 h-2.5 bg-amber-400 rotate-45 -mt-1 shadow" />
        </div>

        {scenes.map((scene, i) => {
          const isActive = activeSceneIndex === i;
          const motion = scene.camera?.effect || 'ken_burns';
          const transition = scene.transition?.type || 'crossfade';

          return (
            <React.Fragment key={scene.id || i}>
              {/* Scene Block */}
              <div
                onClick={() => onSelectScene(i)}
                className={`relative flex-1 min-w-[140px] h-full rounded-xl border p-2.5 flex flex-col justify-between cursor-pointer transition-all duration-200 select-none ${
                  isActive
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Top Info */}
                <div className="flex items-center justify-between text-[11px]">
                  <span className={`font-bold ${isActive ? 'text-emerald-300' : 'text-slate-300'}`}>
                    {isAr ? `مشهد ${i + 1}` : `Scene ${i + 1}`}
                  </span>
                  <span className="font-mono text-slate-400 text-[10px]">
                    {scene.duration}s
                  </span>
                </div>

                {/* Arabic Text Snippet or Background Tag */}
                <div className="text-[11px] font-amiri text-amber-200/80 truncate">
                  {scene.verse?.textUthmani || scene.verse?.textSimple || (isAr ? 'خلفية متحركة' : 'Background Visual')}
                </div>

                {/* Motion Badge */}
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] font-semibold text-slate-400">
                    <ZoomIn className="w-2.5 h-2.5 text-emerald-400" />
                    <span className="capitalize">{motion.replace('_', ' ')}</span>
                  </div>

                  {scenes.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveScene(i);
                      }}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Inter-Scene Transition Connector */}
              {i < scenes.length - 1 && (
                <div className="flex flex-col items-center justify-center min-w-[28px] text-[10px] text-slate-500">
                  <ArrowRightLeft className="w-3 h-3 text-emerald-500/70" />
                  <span className="text-[8px] font-mono capitalize">{transition.slice(0, 5)}</span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
