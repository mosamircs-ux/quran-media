'use client';

import React from 'react';
import {
  Type,
  Sparkles,
  Globe,
  Sliders,
  AlignLeft,
  Check,
} from 'lucide-react';
import type { SubtitlesConfig } from '@quran-media/media/types';
import type { Locale } from '@quran-media/i18n';

interface SubtitlesInspectorProps {
  subtitles: SubtitlesConfig;
  onUpdateSubtitles: (updated: SubtitlesConfig) => void;
  locale: Locale;
}

export function SubtitlesInspector({
  subtitles,
  onUpdateSubtitles,
  locale,
}: SubtitlesInspectorProps) {
  const isAr = locale === 'ar';
  const style = subtitles.style || {
    fontArabic: 'Amiri Quran',
    fontTranslation: 'Inter',
    highlightColorHex: '&H0000D7FF',
    dualLanguage: true,
    wordHighlight: true,
  };

  const handleFontArabicChange = (fontArabic: string) => {
    onUpdateSubtitles({
      ...subtitles,
      style: {
        ...style,
        fontArabic,
      },
    });
  };

  const handleFontTranslationChange = (fontTranslation: string) => {
    onUpdateSubtitles({
      ...subtitles,
      style: {
        ...style,
        fontTranslation,
      },
    });
  };

  const handleDualLanguageToggle = (dualLanguage: boolean) => {
    onUpdateSubtitles({
      ...subtitles,
      style: {
        ...style,
        dualLanguage,
      },
    });
  };

  const handleWordHighlightToggle = (wordHighlight: boolean) => {
    onUpdateSubtitles({
      ...subtitles,
      style: {
        ...style,
        wordHighlight,
      },
    });
  };

  return (
    <div className="rounded-3xl bg-slate-950/80 border border-slate-800/80 p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-4">
        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
          <Type className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-100">
            {isAr ? 'الخطوط والترجمة التفاعلية' : 'Typography & Subtitles'}
          </h3>
          <p className="text-[11px] text-slate-400">
            {isAr ? 'ضبط خطوط المصحف الشريف، تمييز الكلمات، واللغات المزدوجة' : 'Arabic calligraphy, word karaoke, and dual subtitles'}
          </p>
        </div>
      </div>

      {/* Arabic Quran Font Picker */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300">
          {isAr ? 'نوع الخط القرآني' : 'Arabic Quran Calligraphy Font'}
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { id: 'Amiri Quran', label: 'أميري عثماني (Amiri Quran)', sample: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ' },
            { id: 'Amiri', label: 'أميري كلاسيكي (Amiri)', sample: 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ' },
            { id: 'Traditional Arabic', label: 'خط النسخ التقليدي', sample: 'بسم الله الرحمن الرحيم' },
            { id: 'Scheherazade New', label: 'شهرزاد (Scheherazade)', sample: 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => handleFontArabicChange(f.id)}
              className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between gap-1.5 ${
                style.fontArabic === f.id
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full text-xs font-bold">
                <span>{f.label}</span>
                {style.fontArabic === f.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <div className="text-sm font-bold text-amber-200/90" style={{ fontFamily: f.id }}>
                {f.sample}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Translation Font */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300">
          {isAr ? 'خط الترجمة الإنجليزية' : 'Translation Font'}
        </label>
        <select
          value={style.fontTranslation || 'Inter'}
          onChange={(e) => handleFontTranslationChange(e.target.value)}
          className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
        >
          <option value="Inter">Inter Modern Sans</option>
          <option value="Roboto">Roboto Clean</option>
          <option value="Outfit">Outfit Elegant</option>
        </select>
      </div>

      {/* Toggles */}
      <div className="pt-3 border-t border-slate-800/80 space-y-3">
        {/* Word Karaoke Highlights */}
        <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 cursor-pointer">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'تمييز الكلمة كلمة بكلمة (Word Karaoke Highlight)' : 'Word-by-Word Active Timing'}</span>
            </div>
            <div className="text-[11px] text-slate-400">
              {isAr ? 'إضاءة الكلمة الحالية بالذهب أثناء تلاوتها' : 'Highlights active Arabic words synchronously in gold'}
            </div>
          </div>
          <input
            type="checkbox"
            checked={style.wordHighlight ?? true}
            onChange={(e) => handleWordHighlightToggle(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-950 border-slate-700"
          />
        </label>

        {/* Dual Language Stacking */}
        <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 cursor-pointer">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isAr ? 'عرض ثنائي للغة (عربي + إنجليزي)' : 'Dual-Language Subtitles (Arabic + English)'}</span>
            </div>
            <div className="text-[11px] text-slate-400">
              {isAr ? 'عرض النص القرآني وأسفله الترجمة الإنجليزية مباشرة' : 'Displays Arabic Quranic verses stacked with English translation below'}
            </div>
          </div>
          <input
            type="checkbox"
            checked={style.dualLanguage ?? true}
            onChange={(e) => handleDualLanguageToggle(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-950 border-slate-700"
          />
        </label>
      </div>
    </div>
  );
}
