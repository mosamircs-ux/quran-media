'use client';

import React, { useState } from 'react';
import type { Locale } from '@quran-media/i18n';
import {
  X,
  Sparkles,
  Film,
  Image as ImageIcon,
  BookOpen,
  Smartphone,
  Monitor,
  Square,
  CheckCircle2,
  RefreshCw,
  Download,
} from 'lucide-react';

interface MediaLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
  verseKey: string;
  surahNumber: number;
  ayahNumber: number;
  surahNameAr: string;
  surahNameEn: string;
  arabicText: string;
  translation: string;
  locale: Locale;
  defaultMode?: 'video' | 'image' | 'story';
}

export function MediaLauncherModal({
  isOpen,
  onClose,
  verseKey,
  surahNumber,
  ayahNumber,
  surahNameAr,
  surahNameEn,
  arabicText,
  translation,
  locale,
  defaultMode = 'video',
}: MediaLauncherModalProps) {
  const isAr = locale === 'ar';
  const [mediaType, setMediaType] = useState<'video' | 'image' | 'story'>(defaultMode);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1' | '4:5'>('9:16');
  const [stylePreset, setStylePreset] = useState<string>('cinematic_nature');
  const [reciterId, setReciterId] = useState<number>(7);
  const [customPrompt, setCustomPrompt] = useState<string>('');

  // Generation progress state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [completed, setCompleted] = useState(false);

  if (!isOpen) return null;

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setProgress(10);
    setStatusMessage(isAr ? 'جاري تجهيز مقاطع التلاوة والآية...' : 'Preparing recitation audio & verse data...');
    setCompleted(false);

    try {
      // Simulate real background synthesis stages
      setTimeout(() => {
        setProgress(35);
        setStatusMessage(isAr ? 'توليد المشهد البصري والأجواء الفنية...' : 'Synthesizing visual atmospheric background...');
      }, 700);

      setTimeout(() => {
        setProgress(65);
        setStatusMessage(isAr ? 'مزامنة الكاريوكي وضبط خطوط المصحف...' : 'Compiling bilingual subtitle karaoke stream...');
      }, 1400);

      setTimeout(() => {
        setProgress(90);
        setStatusMessage(isAr ? 'تشفير وضغط الفيديو بمحرك FFmpeg...' : 'Finalizing FFmpeg encoding & S3 upload...');
      }, 2100);

      setTimeout(() => {
        setProgress(100);
        setStatusMessage(isAr ? 'تم الإنتاج بنجاح!' : 'Media synthesis completed successfully!');
        setIsGenerating(false);
        setCompleted(true);
      }, 2800);
    } catch {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 text-slate-950 font-bold shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isAr ? `صناعة وسائط للآية [${verseKey}]` : `Create Media for [${verseKey}]`}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? `سورة ${surahNameAr}` : `Surah ${surahNameEn}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Verse Display Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-1">
            <p dir="rtl" className="font-quran text-xl text-slate-900 dark:text-amber-100 line-clamp-2">
              {arabicText}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 italic line-clamp-1">
              "{translation}"
            </p>
          </div>

          {/* Mode Selector (Video / Image / Story) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isAr ? 'نوع المحتوى المطلوب' : 'Content Format'}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'video', label: isAr ? 'فيديو سينمائي' : 'Video Clip', icon: Film },
                { id: 'image', label: isAr ? 'تصميم بصري' : 'Image Poster', icon: ImageIcon },
                { id: 'story', label: isAr ? 'قصة وتأمل' : 'Story Narrative', icon: BookOpen },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMediaType(item.id as 'video' | 'image' | 'story')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      mediaType === item.id
                        ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Aspect Ratio Selection (for video & image) */}
          {mediaType !== 'story' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'أبعاد الفيديو' : 'Aspect Ratio'}
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {[
                  { id: '9:16', label: '9:16 Reels', icon: Smartphone },
                  { id: '16:9', label: '16:9 YouTube', icon: Monitor },
                  { id: '1:1', label: '1:1 Square', icon: Square },
                  { id: '4:5', label: '4:5 Feed', icon: Smartphone },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setAspectRatio(r.id as '9:16' | '16:9' | '1:1' | '4:5')}
                    className={`p-2.5 rounded-xl border text-[11px] font-bold text-center transition-all ${
                      aspectRatio === r.id
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Visual Style Preset */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isAr ? 'النمط البصري' : 'Visual Atmosphere'}
            </label>
            <select
              value={stylePreset}
              onChange={(e) => setStylePreset(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold"
            >
              <option value="cinematic_nature">{isAr ? 'طبيعة سينمائية هادئة' : 'Cinematic Nature & Dawn'}</option>
              <option value="islamic_geometry">{isAr ? 'زخرفة إسلامية مذهبة' : 'Sacred Arabesque Geometry'}</option>
              <option value="cosmic">{isAr ? 'آيات كونية ومجرات' : 'Celestial Deep Cosmos'}</option>
              <option value="minimalist_desert">{isAr ? 'رمال الصحراء الهادئة' : 'Minimalist Desert Dusk'}</option>
            </select>
          </div>

          {/* Reciter (for video) */}
          {mediaType === 'video' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'القارئ' : 'Reciter Audio'}
              </label>
              <select
                value={reciterId}
                onChange={(e) => setReciterId(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold"
              >
                <option value={7}>مشاري راشد العفاسي (Mishari Al-Afasy)</option>
                <option value={1}>محمود خليل الحصري (Al-Husary)</option>
                <option value={2}>عبد الباسط عبد الصمد (AbdulBaset)</option>
                <option value={3}>عبد الرحمن السديس (As-Sudais)</option>
              </select>
            </div>
          )}

          {/* Custom Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isAr ? 'إرشادات مخصصة للمشهد (اختياري)' : 'Custom Scene Details (Optional)'}
            </label>
            <input
              type="text"
              placeholder={isAr ? 'مثال: شروق شمس ذهبي فوق جبال مكسوة بالضباب' : 'e.g. Majestic golden sunrise over misty mountain peaks'}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Progress Box when running */}
          {isGenerating && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">{statusMessage}</span>
                <span className="font-mono text-amber-500 font-bold">{progress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Completion message */}
          {completed && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isAr ? 'تم إنتاج الوسائط بنجاح بجودة عالية!' : 'Media synthesized successfully!'}</span>
              </div>
              <button
                onClick={() => alert(isAr ? 'جاري التحميل...' : 'Downloading file...')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow hover:bg-emerald-500 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isAr ? 'تحميل' : 'Download'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>

          <button
            onClick={handleStartGeneration}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{isAr ? 'جاري المعالجة...' : 'Synthesizing...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAr ? 'بدء التوليد الفوري' : 'Start Synthesis'}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
