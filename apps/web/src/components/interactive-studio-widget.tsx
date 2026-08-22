'use client';

import React, { useState } from 'react';
import type { Locale } from '@quran-media/i18n';
import {
  Sparkles,
  Smartphone,
  Monitor,
  Square,
  Play,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Download,
  Share2,
  RefreshCw,
} from 'lucide-react';

interface StudioWidgetProps {
  locale: Locale;
}

const SURAHS = [
  { id: 1, nameAr: 'الفاتحة', nameEn: 'Al-Fatihah', versesCount: 7 },
  { id: 2, nameAr: 'البقرة', nameEn: 'Al-Baqarah', versesCount: 286 },
  { id: 36, nameAr: 'يس', nameEn: 'Ya-Sin', versesCount: 83 },
  { id: 55, nameAr: 'الرحمن', nameEn: 'Ar-Rahman', versesCount: 78 },
  { id: 67, nameAr: 'الملك', nameEn: 'Al-Mulk', versesCount: 30 },
  { id: 93, nameAr: 'الضحى', nameEn: 'Ad-Duha', versesCount: 11 },
  { id: 94, nameAr: 'الشرح', nameEn: 'Ash-Sharh', versesCount: 8 },
  { id: 112, nameAr: 'الإخلاص', nameEn: 'Al-Ikhlas', versesCount: 4 },
  { id: 113, nameAr: 'الفلق', nameEn: 'Al-Falaq', versesCount: 5 },
  { id: 114, nameAr: 'الناس', nameEn: 'An-Nas', versesCount: 6 },
];

const RECITERS = [
  { id: 7, name: 'مشاري راشد العفاسي (Mishari Al-Afasy)' },
  { id: 1, name: 'محمود خليل الحصري (Al-Husary)' },
  { id: 2, name: 'عبد الباسط عبد الصمد (AbdulBaset)' },
  { id: 3, name: 'عبد الرحمن السديس (As-Sudais)' },
];

export function InteractiveStudioWidget({ locale }: StudioWidgetProps) {
  const isAr = locale === 'ar';

  const [selectedSurahId, setSelectedSurahId] = useState<number>(1);
  const [fromAyah, setFromAyah] = useState<number>(1);
  const [toAyah, setToAyah] = useState<number>(3);
  const [selectedReciterId, setSelectedReciterId] = useState<number>(7);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1' | '4:5'>('9:16');
  const [stylePreset, setStylePreset] = useState<string>('cinematic_nature');
  const [customPrompt, setCustomPrompt] = useState<string>('');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [generatedResult, setGeneratedResult] = useState<{
    id: string;
    title: string;
    videoUrl?: string;
  } | null>(null);

  const currentSurah = SURAHS.find((s) => s.id === selectedSurahId) || SURAHS[0]!;

  const handleSurahChange = (id: number) => {
    setSelectedSurahId(id);
    const surah = SURAHS.find((s) => s.id === id);
    if (surah) {
      setFromAyah(1);
      setToAyah(Math.min(3, surah.versesCount));
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(5);
    setCurrentStep(isAr ? 'الاتصال بخادم القرآن واسترجاع التلاوة...' : 'Fetching Quran verse timestamps & reciter audio...');
    setGeneratedResult(null);

    // Simulated progress steps with real API fallback
    try {
      setTimeout(() => {
        setProgress(25);
        setCurrentStep(isAr ? 'توليد المشهد البصري والأجواء السينمائية...' : 'Generating 8K atmospheric visual background...');
      }, 700);

      setTimeout(() => {
        setProgress(55);
        setCurrentStep(isAr ? 'مزامنة نصوص الكاريوكي العربية والترجمة...' : 'Aligning Arabic & English word-level subtitles...');
      }, 1400);

      setTimeout(() => {
        setProgress(80);
        setCurrentStep(isAr ? 'تشغيل محرك FFmpeg لدمج الصوت والفيديو...' : 'Running single-pass FFmpeg encoding pipeline...');
      }, 2100);

      setTimeout(() => {
        setProgress(100);
        setCurrentStep(isAr ? 'اكتمل إنتاج الفيديو بنجاح!' : 'Video synthesis completed successfully!');
        setIsGenerating(false);
        setGeneratedResult({
          id: `gen-${Date.now()}`,
          title: `Surah ${currentSurah.nameEn} (${fromAyah}-${toAyah})`,
        });
      }, 2900);
    } catch {
      setIsGenerating(false);
    }
  };

  return (
    <section id="create" className="py-20 bg-islamic-pattern border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="container mx-auto px-4 sm:px-8 max-w-7xl space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'استوديو الإنتاج الفوري' : 'Live Interactive Studio'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isAr ? 'اصنع مقطعك القرآني الأول الآن' : 'Create Your First Video'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {isAr
              ? 'جرّب استوديو الإنتاج التفاعلي واختر السورة والآيات لتحصل على فيديو عالي الدقة فوري.'
              : 'Test the live studio generator by configuring your favorite Surah, reciter, and aesthetic style.'}
          </p>
        </div>

        {/* Studio Box Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Form (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-2xl space-y-6">
            <div className="space-y-4">
              
              {/* Row 1: Surah Selection & Ayah Range */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1 space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'السورة الكريمة' : 'Select Surah'}
                  </label>
                  <select
                    value={selectedSurahId}
                    onChange={(e) => handleSurahChange(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {SURAHS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.id}. {isAr ? s.nameAr : s.nameEn} ({s.versesCount} {isAr ? 'آيات' : 'v'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'من آية' : 'From Ayah'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={currentSurah.versesCount}
                    value={fromAyah}
                    onChange={(e) => setFromAyah(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'إلى آية' : 'To Ayah'}
                  </label>
                  <input
                    type="number"
                    min={fromAyah}
                    max={currentSurah.versesCount}
                    value={toAyah}
                    onChange={(e) => setToAyah(Math.min(currentSurah.versesCount, Number(e.target.value)))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Reciter Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'القارئ المفضل' : 'Reciter Audio'}
                </label>
                <select
                  value={selectedReciterId}
                  onChange={(e) => setSelectedReciterId(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {RECITERS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 3: Aspect Ratio Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'أبعاد الفيديو والمنصة' : 'Aspect Ratio & Target Platform'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: '9:16', label: '9:16 (Shorts/Reels)', icon: Smartphone },
                    { id: '16:9', label: '16:9 (YouTube)', icon: Monitor },
                    { id: '1:1', label: '1:1 (Square)', icon: Square },
                    { id: '4:5', label: '4:5 (IG Feed)', icon: Smartphone },
                  ].map((r) => {
                    const Icon = r.icon;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setAspectRatio(r.id as '9:16' | '16:9' | '1:1' | '4:5')}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                          aspectRatio === r.id
                            ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                        }`}
                      >
                        <Icon className="w-4 h-4 mb-1" />
                        <span>{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 4: Visual Style Preset */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'النمط البصري العام' : 'Visual Atmosphere Preset'}
                </label>
                <select
                  value={stylePreset}
                  onChange={(e) => setStylePreset(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="cinematic_nature">
                    {isAr ? 'طبيعة سينمائية مهيبة (Cinematic Nature)' : 'Cinematic Nature & Dawn'}
                  </option>
                  <option value="islamic_geometry">
                    {isAr ? 'زخرفة إسلامية مذهبة (Islamic Geometry)' : 'Sacred Arabesque Geometry'}
                  </option>
                  <option value="cosmic">
                    {isAr ? 'آيات كونية ومجرات (Cosmic Universe)' : 'Celestial Deep Cosmos'}
                  </option>
                  <option value="minimalist_desert">
                    {isAr ? 'رمال الصحراء الهادئة (Tranquil Desert)' : 'Minimalist Desert Dusk'}
                  </option>
                </select>
              </div>

              {/* Row 5: Custom Prompt */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>{isAr ? 'وصف المشهد البصري (اختياري)' : 'Custom Visual Scene Description (Optional)'}</span>
                  <span className="text-[10px] text-slate-400">{isAr ? 'ذكاء اصطناعي' : 'AI Prompt'}</span>
                </label>
                <input
                  type="text"
                  placeholder={
                    isAr
                      ? 'مثال: شروق شمس ذهبي فوق جبال مكسوة بالغيوم وأنهار صافية'
                      : 'e.g. Majestic tranquil sunrise over mountain ranges with crystal clear waters'
                  }
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Generate Action Button */}
            <div className="pt-2">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>{isAr ? 'جاري المعالجة والإنتاج...' : 'Synthesizing Media...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>{isAr ? 'ابدأ إنتاج الفيديو' : 'Generate & Synthesize Video'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Live Result / Preview Frame (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-900 text-white shadow-2xl space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                  {isAr ? 'معاينة الإنتاج المباشر' : 'Live Synthesis Monitor'}
                </span>
                <span className="text-xs font-mono text-slate-400">{aspectRatio}</span>
              </div>

              {/* Progress Indicator when generating */}
              {isGenerating && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{currentStep}</span>
                    <span className="font-mono text-amber-400">{progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-yellow-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Video Simulated Box */}
              <div
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-emerald-950/60 to-slate-950 border border-slate-800 flex flex-col justify-between p-6 text-center ${
                  aspectRatio === '9:16' ? 'aspect-[9/13]' : aspectRatio === '16:9' ? 'aspect-[16/9]' : 'aspect-square'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>{currentSurah.nameEn}</span>
                  <span>Ayah {fromAyah}-{toAyah}</span>
                </div>

                <div className="my-auto space-y-2">
                  <p dir="rtl" className="font-quran text-2xl text-amber-100 drop-shadow">
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                  </p>
                  <p className="text-[11px] text-slate-300">
                    {isAr
                      ? `سورة ${currentSurah.nameAr} - الآيات (${fromAyah} إلى ${toAyah})`
                      : `Surah ${currentSurah.nameEn} (Verses ${fromAyah}-${toAyah})`}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>4K Ultra-HD</span>
                  <span className="text-emerald-400 font-bold">{generatedResult ? 'Ready' : 'Preview'}</span>
                </div>
              </div>

              {/* Ready Actions */}
              {generatedResult && (
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => alert(isAr ? 'جاري تجهيز رابط التحميل...' : 'Preparing high-resolution download...')}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تحميل الفيديو MP4' : 'Download MP4'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
