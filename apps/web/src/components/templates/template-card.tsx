'use client';

import React from 'react';
import type { QuranMediaTemplate } from '@quran-media/media/templates';
import type { Locale } from '@quran-media/i18n';
import {
  Sparkles,
  Camera,
  Type,
  Check,
  Music,
  Layers,
  Palette,
  Eye,
} from 'lucide-react';

interface TemplateCardProps {
  template: QuranMediaTemplate;
  isSelected?: boolean;
  onSelect: (template: QuranMediaTemplate) => void;
  onPreview?: (template: QuranMediaTemplate) => void;
  locale: Locale;
}

export function TemplateCard({
  template,
  isSelected,
  onSelect,
  onPreview,
  locale,
}: TemplateCardProps) {
  const isAr = locale === 'ar';

  return (
    <div
      onClick={() => onSelect(template)}
      className={`group relative rounded-3xl border p-5 flex flex-col justify-between gap-4 cursor-pointer transition-all duration-300 select-none shadow-lg overflow-hidden ${
        isSelected
          ? 'bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/50 shadow-emerald-950/40 -translate-y-1'
          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:-translate-y-1 hover:shadow-2xl'
      }`}
    >
      {/* Visual Backdrop Preview Header */}
      <div
        className="relative w-full h-36 rounded-2xl overflow-hidden p-3.5 flex flex-col justify-between border border-slate-800/80 shadow-inner"
        style={{ background: template.preview.backdropCss }}
      >
        {/* Top Badges */}
        <div className="flex items-center justify-between z-10">
          <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-500/30">
            {isAr ? template.categoryNameAr : template.categoryNameEn}
          </span>

          {template.preview.badge && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold shadow">
              {template.preview.badge}
            </span>
          )}
        </div>

        {/* Calligraphy Sample Simulation */}
        <div
          className="text-center font-bold text-base sm:text-lg drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] z-10 truncate px-2"
          style={{
            fontFamily: template.fonts.arabicFont,
            color: template.colors.textArabic,
          }}
          dir="rtl"
        >
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </div>

        {/* Aspect Ratios Supported */}
        <div className="flex items-center justify-between z-10 text-[10px] font-mono text-slate-300">
          <div className="flex items-center gap-1">
            {template.supported_aspect_ratios.map((ratio) => (
              <span
                key={ratio}
                className={`px-1.5 py-0.5 rounded bg-slate-950/80 backdrop-blur-sm border ${
                  ratio === template.recommendedAspectRatio
                    ? 'border-emerald-400 text-emerald-300 font-bold'
                    : 'border-slate-800 text-slate-400'
                }`}
              >
                {ratio}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <Camera className="w-3 h-3 text-emerald-400" />
            <span className="capitalize text-[9px]">{template.animation.cameraMotion.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Selected Checkmark Overlay */}
        {isSelected && (
          <div className="absolute top-2.5 right-2.5 rtl:right-auto rtl:left-2.5 z-20 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg font-bold">
            <Check className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
            {isAr ? template.nameAr : template.nameEn}
          </h3>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
          {isAr ? template.descriptionAr : template.descriptionEn}
        </p>
      </div>

      {/* Footer Specs: Palette + Font + Ambient */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        {/* Color Palette Swatches */}
        <div className="flex items-center gap-1">
          <div
            className="w-3.5 h-3.5 rounded-full border border-slate-700 shadow-sm"
            style={{ backgroundColor: template.colors.primary }}
            title="Primary"
          />
          <div
            className="w-3.5 h-3.5 rounded-full border border-slate-700 shadow-sm"
            style={{ backgroundColor: template.colors.accent }}
            title="Accent"
          />
          <div
            className="w-3.5 h-3.5 rounded-full border border-slate-700 shadow-sm"
            style={{ backgroundColor: template.colors.secondary }}
            title="Secondary"
          />
        </div>

        {/* Font Badge */}
        <div className="flex items-center gap-1 font-semibold text-[10px] text-amber-300/90">
          <Type className="w-3 h-3" />
          <span>{template.fonts.arabicFont}</span>
        </div>

        {/* Ambient Soundscape */}
        <div className="flex items-center gap-1 text-[10px] text-slate-400">
          <Music className="w-3 h-3 text-cyan-400" />
          <span className="capitalize">{template.audio_behavior.ambientPreset.replace('_', ' ')}</span>
        </div>
      </div>
    </div>
  );
}
