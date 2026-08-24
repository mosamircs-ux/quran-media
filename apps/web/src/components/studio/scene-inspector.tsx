'use client';

import React, { useState } from 'react';
import {
  Film,
  Sparkles,
  Camera,
  Layers,
  ArrowRightLeft,
  Clock,
  RotateCw,
  Image as ImageIcon,
  Palette,
} from 'lucide-react';
import type { MediaScene } from '@quran-media/media/types';
import type { Locale } from '@quran-media/i18n';

interface SceneInspectorProps {
  scene: MediaScene;
  sceneIndex: number;
  onUpdateScene: (updated: MediaScene) => void;
  locale: Locale;
}

export function SceneInspector({
  scene,
  sceneIndex,
  onUpdateScene,
  locale,
}: SceneInspectorProps) {
  const isAr = locale === 'ar';
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleTextChange = (arabicText: string) => {
    onUpdateScene({
      ...scene,
      verse: {
        ...scene.verse,
        surahNumber: scene.verse?.surahNumber || 1,
        ayahNumber: scene.verse?.ayahNumber || 1,
        textUthmani: arabicText,
      },
    });
  };

  const handleTranslationChange = (translationText: string) => {
    onUpdateScene({
      ...scene,
      verse: {
        ...scene.verse,
        surahNumber: scene.verse?.surahNumber || 1,
        ayahNumber: scene.verse?.ayahNumber || 1,
        translationText,
      },
    });
  };

  const handleDurationChange = (duration: number) => {
    onUpdateScene({
      ...scene,
      duration,
    });
  };

  const handleCameraChange = (effect: any) => {
    onUpdateScene({
      ...scene,
      camera: {
        ...scene.camera,
        effect,
        intensity: scene.camera?.intensity || 0.12,
        startScale: 1.0,
        endScale: 1.12,
      },
    });
  };

  const handleTransitionChange = (type: any) => {
    onUpdateScene({
      ...scene,
      transition: {
        ...scene.transition,
        type,
        duration: scene.transition?.duration || 1.0,
      },
    });
  };

  const handleBackgroundTypeChange = (type: any) => {
    onUpdateScene({
      ...scene,
      background: {
        ...scene.background,
        type,
      },
    });
  };

  // Simulate quick visual regeneration
  const handleRegenerateScene = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      onUpdateScene({
        ...scene,
        background: {
          ...scene.background,
          type: 'animated_gradient',
          gradientColors: ['#064e3b', '#1e1b4b', '#020617'],
        },
      });
      setIsRegenerating(false);
    }, 1200);
  };

  return (
    <div className="rounded-3xl bg-slate-950/80 border border-slate-800/80 p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              {isAr ? `إعدادات المشهد (${sceneIndex + 1})` : `Scene Settings (${sceneIndex + 1})`}
            </h3>
            <p className="text-[11px] text-slate-400">
              {isAr ? 'تخصيص النص القرآني، الترجمة، والخلفيات البصرية' : 'Customize Quran text, translation, and visuals'}
            </p>
          </div>
        </div>

        {/* Regenerate Scene Button */}
        <button
          onClick={handleRegenerateScene}
          disabled={isRegenerating}
          className="py-1.5 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 text-xs font-semibold text-emerald-400 flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
          <span>{isAr ? 'إعادة توليد المشهد' : 'Regenerate Scene'}</span>
        </button>
      </div>

      {/* Quran Arabic Uthmani Text */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-amber-400" />
          <span>{isAr ? 'النص القرآني بالرسم العثماني' : 'Arabic Quran Text (Uthmani)'}</span>
        </label>
        <textarea
          rows={3}
          value={scene.verse?.textUthmani || scene.verse?.textSimple || ''}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={isAr ? 'اكتب الآية الكريمة...' : 'Enter Quran verse text...'}
          className="w-full p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 font-amiri text-lg leading-relaxed focus:outline-none focus:border-amber-400 transition-colors text-right"
          dir="rtl"
        />
      </div>

      {/* Translation Text */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300">
          {isAr ? 'نص الترجمة / المعنى' : 'Translation / Meaning'}
        </label>
        <textarea
          rows={2}
          value={scene.verse?.translationText || ''}
          onChange={(e) => handleTranslationChange(e.target.value)}
          placeholder={isAr ? 'اكتب ترجمة الآية...' : 'Enter English/local translation...'}
          className="w-full p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
        />
      </div>

      {/* Background Visual Preset */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isAr ? 'نوع الخلفية البصرية' : 'Visual Background'}</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'animated_gradient', label: isAr ? 'تدرج كوني متحرك' : 'Cosmic Gradient' },
            { id: 'particles', label: isAr ? 'نجوم وجزيئات ضوئية' : 'Celestial Particles' },
            { id: 'image', label: isAr ? 'صورة AI أو مخصصة' : 'AI / Custom Image' },
            { id: 'color', label: isAr ? 'لون إسلامي داكن' : 'Solid Dark' },
          ].map((bg) => (
            <button
              key={bg.id}
              type="button"
              onClick={() => handleBackgroundTypeChange(bg.id)}
              className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                scene.background?.type === bg.id
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {bg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Camera Motion & Transitions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Camera Movement */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isAr ? 'حركة الكاميرا (Ken Burns)' : 'Camera Motion'}</span>
          </label>
          <select
            value={scene.camera?.effect || 'ken_burns'}
            onChange={(e) => handleCameraChange(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="ken_burns">{isAr ? 'تكبير سينمائي مستمر (Ken Burns)' : 'Cinematic Ken Burns'}</option>
            <option value="zoom_in">{isAr ? 'تكبير تدريجي (Zoom In)' : 'Zoom In'}</option>
            <option value="zoom_out">{isAr ? 'تصغير تدريجي (Zoom Out)' : 'Zoom Out'}</option>
            <option value="pan_left">{isAr ? 'تحريك يسار (Pan Left)' : 'Pan Left'}</option>
            <option value="pan_right">{isAr ? 'تحريك يمين (Pan Right)' : 'Pan Right'}</option>
            <option value="none">{isAr ? 'ثابت بدون حركة (Static)' : 'Static'}</option>
          </select>
        </div>

        {/* Transition */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isAr ? 'التأثير الانتقالي' : 'Scene Transition'}</span>
          </label>
          <select
            value={scene.transition?.type || 'crossfade'}
            onChange={(e) => handleTransitionChange(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="crossfade">{isAr ? 'تداخل سلس (Crossfade)' : 'Crossfade'}</option>
            <option value="dissolve">{isAr ? 'تلاشي تدريجي (Dissolve)' : 'Dissolve'}</option>
            <option value="fade">{isAr ? 'إظلام تدريجي (Fade Black)' : 'Fade to Black'}</option>
            <option value="wipeleft">{isAr ? 'مسح لليسار (Wipe Left)' : 'Wipe Left'}</option>
            <option value="none">{isAr ? 'مباشر (Cut)' : 'None (Cut)'}</option>
          </select>
        </div>
      </div>

      {/* Scene Duration Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'مدة عرض المشهد' : 'Scene Duration'}</span>
          </span>
          <span className="font-mono text-emerald-400 font-bold">{scene.duration} {isAr ? 'ثوانٍ' : 'seconds'}</span>
        </div>
        <input
          type="range"
          min={2}
          max={20}
          step={1}
          value={scene.duration}
          onChange={(e) => handleDurationChange(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
      </div>
    </div>
  );
}
