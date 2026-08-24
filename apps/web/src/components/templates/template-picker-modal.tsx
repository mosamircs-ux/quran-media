'use client';

import React, { useState, useMemo } from 'react';
import type { QuranMediaTemplate } from '@quran-media/media/templates';
import { QURAN_MEDIA_TEMPLATES } from '@quran-media/media/templates';
import type { AspectRatio } from '@quran-media/media/types';
import type { Locale } from '@quran-media/i18n';
import { TemplateCard } from './template-card';
import {
  Sparkles,
  Search,
  X,
  Filter,
  Layers,
  Check,
  Film,
  Maximize2,
  Tv,
  Smartphone,
  Square,
} from 'lucide-react';

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplateId?: string;
  onSelectTemplate: (template: QuranMediaTemplate) => void;
  targetAspectRatio?: AspectRatio;
  locale: Locale;
}

export function TemplatePickerModal({
  isOpen,
  onClose,
  selectedTemplateId = 'cinematic_nature',
  onSelectTemplate,
  targetAspectRatio,
  locale,
}: TemplatePickerModalProps) {
  const isAr = locale === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [aspectRatioFilter, setAspectRatioFilter] = useState<string>(targetAspectRatio || 'all');
  const [activeTemplate, setActiveTemplate] = useState<QuranMediaTemplate>(
    QURAN_MEDIA_TEMPLATES.find((t) => t.template_id === selectedTemplateId) || QURAN_MEDIA_TEMPLATES[0]!
  );

  const categories = [
    { id: 'all', labelAr: 'كافة القوالب (18)', labelEn: 'All Templates (18)' },
    { id: 'social_media', labelAr: 'ريلز وشورتس (9:16)', labelEn: 'Shorts & Reels' },
    { id: 'nature', labelAr: 'طبيعة ومناظر', labelEn: 'Nature & Scenery' },
    { id: 'islamic_art', labelAr: 'فن وزخارف إسلامية', labelEn: 'Islamic Art & Calligraphy' },
    { id: 'celestial', labelAr: 'سماء وفلك', labelEn: 'Celestial & Cosmic' },
    { id: 'broadcast', labelAr: 'شاشات عريضة (16:9)', labelEn: 'Broadcast & TV' },
    { id: 'minimal', labelAr: 'مصحف بسيط', labelEn: 'Minimalist' },
  ];

  const filteredTemplates = useMemo(() => {
    let list = [...QURAN_MEDIA_TEMPLATES];

    if (selectedCategory !== 'all') {
      list = list.filter((t) => t.category === selectedCategory);
    }

    if (aspectRatioFilter !== 'all') {
      list = list.filter((t) => t.supported_aspect_ratios.includes(aspectRatioFilter as AspectRatio));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.nameAr.toLowerCase().includes(q) ||
          t.nameEn.toLowerCase().includes(q) ||
          t.descriptionAr.toLowerCase().includes(q) ||
          t.descriptionEn.toLowerCase().includes(q) ||
          t.preview.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return list;
  }, [selectedCategory, aspectRatioFilter, searchQuery]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSelectTemplate(activeTemplate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl max-h-[92vh] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-100">
                {isAr ? 'اختر قالب الإنتاج المرئي' : 'Select Quran Media Template'}
              </h2>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'اختر من بين 18 قالباً احترافياً يحدد الخطوط، الألوان، حركة الكاميرا، والانتقالات'
                  : 'Choose from 18 verified presets defining calligraphy, color grading, motion, and audio'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/40 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute top-1/2 -translate-y-1/2 left-3.5 rtl:left-auto rtl:right-3.5 w-4 h-4 text-amber-400 pointer-events-none" />
              <input
                type="text"
                placeholder={isAr ? 'ابحث باسم القالب أو النمط (Nature, Reels, Gold)...' : 'Search templates by name or style (e.g. Desert, Reels, Minimal)...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 rtl:pr-10 rtl:pl-10 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute top-1/2 -translate-y-1/2 right-3 rtl:right-auto rtl:left-3 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Aspect Ratio Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl shrink-0">
              {[
                { id: 'all', label: isAr ? 'كافة الأبعاد' : 'All Ratios' },
                { id: '9:16', label: '9:16' },
                { id: '16:9', label: '16:9' },
                { id: '1:1', label: '1:1' },
                { id: '4:5', label: '4:5' },
              ].map((ratio) => (
                <button
                  key={ratio.id}
                  onClick={() => setAspectRatioFilter(ratio.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    aspectRatioFilter === ratio.id
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === c.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {isAr ? c.labelAr : c.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Templates Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-950/20">
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredTemplates.map((tpl) => (
                <TemplateCard
                  key={tpl.template_id}
                  template={tpl}
                  isSelected={activeTemplate.template_id === tpl.template_id}
                  onSelect={(selected) => setActiveTemplate(selected)}
                  locale={locale}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center space-y-3">
              <div className="text-3xl">🎨</div>
              <h4 className="text-base font-bold text-slate-200">
                {isAr ? 'لم يتم العثور على قوالب مطابقة' : 'No matching templates found'}
              </h4>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setAspectRatioFilter('all');
                }}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
              >
                {isAr ? 'إعادة ضبط البحث' : 'Reset filters'}
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer with Active Template Summary and CTA */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl border border-slate-700 shadow-sm flex items-center justify-center shrink-0"
              style={{ background: activeTemplate.preview.backdropCss }}
            >
              <Sparkles className="w-5 h-5 text-amber-300 drop-shadow" />
            </div>

            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                <span>{isAr ? activeTemplate.nameAr : activeTemplate.nameEn}</span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  [{activeTemplate.recommendedAspectRatio}]
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <span>{activeTemplate.fonts.arabicFont}</span>
                <span>•</span>
                <span className="capitalize">{activeTemplate.animation.cameraMotion.replace('_', ' ')}</span>
                <span>•</span>
                <span className="capitalize">{activeTemplate.audio_behavior.ambientPreset.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              onClick={handleConfirm}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{isAr ? 'تطبيق هذا القالب' : 'Apply Template'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
