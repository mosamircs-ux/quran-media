'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Locale } from '@quran-media/i18n';
import { CANONICAL_SURAHS } from '@quran-media/quran';
import {
  Sparkles,
  BookOpen,
  Film,
  GraduationCap,
  Clock,
  Smile,
  Share2,
  Copy,
  Check,
  Download,
  ShieldCheck,
  Eye,
  RefreshCw,
  Search,
  Camera,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Layers,
  CheckCircle2,
  Video,
  Feather,
} from 'lucide-react';
import { STORY_PRESETS, type StoryPreset } from '@/lib/story-presets';
import { TemplatePickerModal } from '@/components/templates/template-picker-modal';
import { QURAN_MEDIA_TEMPLATES, type QuranMediaTemplate } from '@quran-media/media/templates';

interface StoryScene {
  sceneNumber: number;
  duration: string;
  narration: string;
  visualDescription: string;
  cameraMovement: string;
  transition: string;
}

interface QuranStorySourceReferences {
  surahNumber: number;
  surahNameAr: string;
  surahNameEn: string;
  ayahStart: number;
  ayahEnd: number;
  uthmaniText: string;
  translationAuthor: string;
  translationText: string;
  tafsirAuthor: string;
  tafsirOverview: string;
  revelationPlace?: string;
  guardrailsApplied: string[];
  generatedAt?: string;
}

interface QuranStoryVisualScript {
  title: string;
  hook: string;
  theme: string;
  emotionalTone: string;
  scenes: StoryScene[];
  ending: string;
  verseReference: string;
  sourceReferences?: QuranStorySourceReferences;
  mode?: string;
  provider?: string;
  model?: string;
}

type StoryMode = 'reflection' | 'educational' | 'cinematic' | 'short_reminder' | 'children_friendly' | 'social_media';
type VisualPolicy = 'symbolic' | 'environmental' | 'celestial' | 'architectural' | 'calligraphic';

interface Props {
  locale: Locale;
  initialSurahId?: number;
  initialAyah?: number;
}

export function QuranStoryGeneratorClient({ locale, initialSurahId = 2, initialAyah = 255 }: Props) {
  const isAr = locale === 'ar';

  // Selection states
  const [surahNumber, setSurahNumber] = useState<number>(initialSurahId);
  const [ayahStart, setAyahStart] = useState<number>(initialAyah);
  const [ayahEnd, setAyahEnd] = useState<number>(initialAyah);
  const [isRangeMode, setIsRangeMode] = useState<boolean>(false);
  const [selectedMode, setSelectedMode] = useState<StoryMode>('cinematic');
  const [tafsirId, setTafsirId] = useState<number>(isAr ? 169 : 16);
  const [translationId, setTranslationId] = useState<number>(131);
  const [visualPolicy, setVisualPolicy] = useState<VisualPolicy>('environmental');
  const [aiProvider, setAiProvider] = useState<string>('gemini');
  const [customPromptFocus, setCustomPromptFocus] = useState<string>('');

  const [surahSearchQuery, setSurahSearchQuery] = useState<string>('');
  const [showSurahDropdown, setShowSurahDropdown] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<QuranMediaTemplate>(QURAN_MEDIA_TEMPLATES[1] || QURAN_MEDIA_TEMPLATES[0]!);
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState<boolean>(false);
  const [showLiveScripturePeek, setShowLiveScripturePeek] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'storyboard' | 'json' | 'sources'>('storyboard');
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [copiedSceneIndex, setCopiedSceneIndex] = useState<number | null>(null);

  // Live scripture preview state
  const [liveVerseText, setLiveVerseText] = useState<string>('');
  const [liveTranslationText, setLiveTranslationText] = useState<string>('');
  const [liveTafsirText, setLiveTafsirText] = useState<string>('');
  const [isLoadingScripture, setIsLoadingScripture] = useState<boolean>(false);

  // Generation status
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generatedStory, setGeneratedStory] = useState<QuranStoryVisualScript | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentSurah = CANONICAL_SURAHS.find((s) => s.id === surahNumber) || CANONICAL_SURAHS[0]!;

  const modesConfig: Record<
    StoryMode,
    {
      labelAr: string;
      labelEn: string;
      descAr: string;
      descEn: string;
      icon: React.ElementType;
      badge: string;
      color: string;
      duration: string;
    }
  > = {
    reflection: {
      labelAr: 'تدبر وتأمل',
      labelEn: 'Spiritual Reflection',
      descAr: 'تأمل إيماني عميق يركز على رقة القلب واستشعار عظمة الله والسكينة',
      descEn: 'Deep spiritual contemplation focusing on heart softening & divine peace',
      icon: Feather,
      badge: isAr ? 'قلبي وسكينة' : 'Contemplative',
      color: 'from-emerald-500 to-teal-600',
      duration: '45-60s',
    },
    educational: {
      labelAr: 'تعليمي وتفسيري',
      labelEn: 'Educational & Tafsir',
      descAr: 'شرح تحليلي للمفردات اللغوية، وسياق الآيات، والفوائد الفقهية والتربوية',
      descEn: 'Scholarly linguistic analysis, context of revelation, and theological gems',
      icon: GraduationCap,
      badge: isAr ? 'علمي موثق' : 'Scholarly',
      color: 'from-blue-500 to-indigo-600',
      duration: '60-90s',
    },
    cinematic: {
      labelAr: 'سينمائي ملحمي',
      labelEn: 'Epic Cinematic',
      descAr: 'سرد بصري مهيب بحركات كاميرا درامية ومشاهد كونية وبيئية واسعة',
      descEn: 'Immersive visual storytelling with dynamic camera work and awe-inspiring vistas',
      icon: Film,
      badge: isAr ? 'مشاهد مهيبة' : 'Cinematic',
      color: 'from-amber-500 to-yellow-600',
      duration: '60-90s',
    },
    short_reminder: {
      labelAr: 'تذكرة سريعة',
      labelEn: 'Short Reminder',
      descAr: 'محتوى مكثف وسريع (30-45 ثانية) يبدأ بخاطفة بصرية ويختم برسالة قاطعة',
      descEn: 'High-impact 30-45s reminder with immediate hook and memorable takeaway',
      icon: Clock,
      badge: isAr ? 'ريلز وشورتس' : 'Shorts / Reels',
      color: 'from-rose-500 to-red-600',
      duration: '30-45s',
    },
    children_friendly: {
      labelAr: 'للأطفال ومبسط',
      labelEn: 'Children & Youth',
      descAr: 'أسلوب لطيف ومبسط يضرب الأمثال بعجائب الطبيعة لترسيخ محبة الخالق',
      descEn: 'Gentle, wholesome tone using relatable nature analogies to build love for Allah',
      icon: Smile,
      badge: isAr ? 'بسيط وممتع' : 'Youth Friendly',
      color: 'from-purple-500 to-pink-600',
      duration: '45-60s',
    },
    social_media: {
      labelAr: 'منصات التواصل',
      labelEn: 'Social Media Viral',
      descAr: 'صياغة جذابة لشبكات التواصل بخطاف افتتاحي قوي ودعوة واضحة للتأمل والمشاركة',
      descEn: 'Engineered for viral engagement, dynamic pacing, and interactive call-to-action',
      icon: Share2,
      badge: isAr ? 'تفاعلي سريع' : 'High Engagement',
      color: 'from-cyan-500 to-blue-600',
      duration: '40-60s',
    },
  };

  // Fetch live verse and tafsir preview on change
  useEffect(() => {
    let isCancelled = false;
    const fetchScripture = async () => {
      setIsLoadingScripture(true);
      try {
        const verseKey = `${surahNumber}:${ayahStart}`;
        const verseRes = await fetch(`/api/quran/verses?surahId=${surahNumber}&fromVerse=${ayahStart}&toVerse=${isRangeMode ? ayahEnd : ayahStart}&translationIds=${translationId}&locale=${locale}`);
        const verseData = await verseRes.json();
        
        if (!isCancelled && verseData?.data?.verses?.length) {
          const vList = verseData.data.verses;
          setLiveVerseText(vList.map((v: { textUthmani: string }) => v.textUthmani).join(' ۝ '));
          setLiveTranslationText(vList.map((v: { translations?: Array<{ text: string }> }) => v.translations?.[0]?.text || '').filter(Boolean).join(' '));
        }

        const tafsirRes = await fetch(`/api/quran/tafsirs?verseKey=${verseKey}&tafsirId=${tafsirId}`);
        const tafsirData = await tafsirRes.json();
        if (!isCancelled && tafsirData?.data?.text) {
          // Remove HTML tags for clean preview
          const cleanTafsir = tafsirData.data.text.replace(/<[^>]*>?/gm, '');
          setLiveTafsirText(cleanTafsir);
        }
      } catch (err) {
        console.warn('Could not load scripture preview', err);
      } finally {
        if (!isCancelled) setIsLoadingScripture(false);
      }
    };

    fetchScripture();
    return () => {
      isCancelled = true;
    };
  }, [surahNumber, ayahStart, ayahEnd, isRangeMode, tafsirId, translationId, locale]);

  // Load default preset on initial load (Ayat al-Kursi 2:255)
  useEffect(() => {
    handleApplyPreset(STORY_PRESETS[0]!);
  }, []);

  const handleApplyPreset = (preset: StoryPreset) => {
    setSurahNumber(preset.surahNumber);
    setAyahStart(preset.ayahStart);
    setAyahEnd(preset.ayahEnd);
    setIsRangeMode(preset.ayahStart !== preset.ayahEnd);
    setSelectedMode(preset.mode);
    setCustomPromptFocus(preset.conceptKeywords.join('، '));
  };

  const handleGenerateStory = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setGenerationStep(isAr ? '١/٤ جلب النص القرآني العثماني والتحقق منه...' : '1/4 Verifying authentic Uthmani scripture...');

    try {
      setTimeout(() => {
        setGenerationStep(isAr ? '٢/٤ استخراج التفسير المعتمد والسياق القرآني...' : '2/4 Analyzing classical Tafsir & context...');
      }, 700);

      setTimeout(() => {
        setGenerationStep(isAr ? '٣/٤ صياغة المشاهد البصرية وتطبيق الضوابط الشرعية...' : '3/4 Generating visual scenes with Islamic guardrails...');
      }, 1400);

      setTimeout(() => {
        setGenerationStep(isAr ? '٤/٤ توثيق المراجع واستخراج المخطط الزمني...' : '4/4 Finalizing story schema & source citations...');
      }, 2100);

      const res = await fetch('/api/story/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surahNumber,
          ayahStart,
          ayahEnd: isRangeMode ? ayahEnd : ayahStart,
          mode: selectedMode,
          tafsirId,
          translationId,
          aiProvider,
          visualPolicy,
          locale,
          customPromptFocus,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message || 'Story generation failed');
      }

      setGeneratedStory(data.data);
      // Auto-scroll to results
      setTimeout(() => {
        const resultsEl = document.getElementById('storyboard-output');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error during story generation';
      setErrorMsg(msg);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleCopyJson = () => {
    if (!generatedStory) return;
    navigator.clipboard.writeText(JSON.stringify(generatedStory, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    if (!generatedStory) return;
    const blob = new Blob([JSON.stringify(generatedStory, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quran-story-${generatedStory.verseReference.replace(':', '_')}-${selectedMode}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyScenePrompt = (promptText: string, index: number) => {
    navigator.clipboard.writeText(promptText);
    setCopiedSceneIndex(index);
    setTimeout(() => setCopiedSceneIndex(null), 2000);
  };

  const filteredSurahs = CANONICAL_SURAHS.filter(
    (s) =>
      s.id.toString().includes(surahSearchQuery) ||
      s.nameAr.includes(surahSearchQuery) ||
      s.nameEn.toLowerCase().includes(surahSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-amber-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white shadow-2xl">
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{isAr ? 'استوديو توليد القصص والمشاهد القرآنية بالذكاء الاصطناعي' : 'AI Quran Story & Visual Scene Studio'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            {isAr ? (
              <>
                حوّل أي آية كريمة إلى{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-200">
                  قصة مرئية ومشاهد سينمائية
                </span>
              </>
            ) : (
              <>
                Transform Any Ayah into an{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-200">
                  Inspiring Visual Story
                </span>
              </>
            )}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {isAr
              ? 'توليد سيناريوهات مرئية مبنية بدقة على النص العثماني والترجمة المعتمدة والتفسير الموثق، مع الالتزام التام بالضوابط الشرعية الإسلامية وحجب التجسيد التام.'
              : 'Generate structured multi-scene visual narratives grounded in authentic scripture, verified translations, and approved Tafsir with strict Islamic non-figurative reverence.'}
          </p>

          {/* Quick Preset Chips */}
          <div className="pt-3 space-y-2">
            <span className="text-xs font-semibold text-amber-300/80 uppercase tracking-wider block">
              {isAr ? 'نماذج وقصص جاهزة للبدء السريع:' : 'Quick Story Presets:'}
            </span>
            <div className="flex flex-wrap gap-2">
              {STORY_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    surahNumber === preset.surahNumber && ayahStart === preset.ayahStart
                      ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-md shadow-amber-500/10'
                      : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-white'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${preset.badgeColor}`} />
                  <span>{isAr ? preset.titleAr : preset.titleEn}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {preset.surahNumber}:{preset.ayahStart}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Story Modes Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-500" />
              <span>{isAr ? '١. اختر نمط القصة والهدف (Story Mode)' : '1. Select Story Mode'}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isAr
                ? 'يحدد النمط وتيرة السرد، وحركات الكاميرا، ونبرة الصوت، والمفردات المستخدمة'
                : 'Sets narrative pacing, cinematic camera cues, vocabulary complexity, and target audience'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {(Object.keys(modesConfig) as StoryMode[]).map((modeKey) => {
            const config = modesConfig[modeKey];
            const Icon = config.icon;
            const isSelected = selectedMode === modeKey;

            return (
              <button
                key={modeKey}
                onClick={() => setSelectedMode(modeKey)}
                className={`relative p-5 rounded-2xl text-start border transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-950/20 shadow-lg shadow-amber-500/5 ring-2 ring-amber-500/20'
                    : 'border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900/90'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-2.5 rounded-xl text-white bg-gradient-to-r ${config.color} shadow-md`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {config.duration}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                      <span>{isAr ? config.labelAr : config.labelEn}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {isAr ? config.descAr : config.descEn}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">{isAr ? 'السمة:' : 'Trait:'}</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">{config.badge}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scriptural Input Configurator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-2 space-y-6 bg-white dark:bg-slate-900/70 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-amber-500" />
            <span>{isAr ? '٢. تحديد الآيات والمصادر الشرعية' : '2. Select Scripture & Verified Sources'}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Surah Selector */}
            <div className="relative space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'السورة الكريمة' : 'Surah / Chapter'}
              </label>

              <button
                type="button"
                onClick={() => setShowSurahDropdown(!showSurahDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-semibold hover:border-amber-500 transition-colors text-start"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold">
                    {currentSurah.id}
                  </span>
                  <span>
                    {currentSurah.nameAr} ({currentSurah.nameEn})
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {showSurahDropdown && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl p-2 space-y-1">
                  <div className="sticky top-0 bg-white dark:bg-slate-950 p-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder={isAr ? 'ابحث باسم السورة أو رقمها...' : 'Search surah by name or number...'}
                      value={surahSearchQuery}
                      onChange={(e) => setSurahSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-0.5 pt-1">
                    {filteredSurahs.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setSurahNumber(s.id);
                          setAyahStart(1);
                          setAyahEnd(1);
                          setShowSurahDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-start transition-colors ${
                          surahNumber === s.id
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 text-center text-slate-400">{s.id}.</span>
                          <span>{s.nameAr}</span>
                          <span className="text-[10px] text-slate-400">({s.nameEn})</span>
                        </div>
                        <span className="text-[10px] opacity-75">{s.versesCount} آية</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Ayah Start / End Picker */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'رقم الآية / النطاق' : 'Ayah / Range'}
                </label>
                <button
                  type="button"
                  onClick={() => setIsRangeMode(!isRangeMode)}
                  className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  {isRangeMode ? (isAr ? 'آية واحدة' : 'Single Ayah') : isAr ? 'تحديد نطاق آيات' : 'Select Range'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">
                    {isRangeMode ? (isAr ? 'من آية' : 'From') : isAr ? 'رقم الآية' : 'Ayah Number'}
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={currentSurah.versesCount}
                    value={ayahStart}
                    onChange={(e) => {
                      const val = Math.max(1, Math.min(currentSurah.versesCount, Number(e.target.value) || 1));
                      setAyahStart(val);
                      if (!isRangeMode || val > ayahEnd) {
                        setAyahEnd(val);
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-semibold focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {isRangeMode && (
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">{isAr ? 'إلى آية' : 'To Ayah'}</span>
                    <input
                      type="number"
                      min={ayahStart}
                      max={currentSurah.versesCount}
                      value={ayahEnd}
                      onChange={(e) => {
                        const val = Math.max(ayahStart, Math.min(currentSurah.versesCount, Number(e.target.value) || ayahStart));
                        setAyahEnd(val);
                      }}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-semibold focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tafsir & Translation Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            {/* Tafsir Source */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAr ? 'كتاب التفسير المعتمد' : 'Classical Tafsir Source'}</span>
              </label>
              <select
                value={tafsirId}
                onChange={(e) => setTafsirId(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-semibold focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                <option value={169}>تفسير السعدي (تيسير الكريم الرحمن)</option>
                <option value={16}>تفسير ابن كثير (Tafsir Ibn Kathir)</option>
                <option value={14}>التفسير الميسر (مجمع الملك فهد)</option>
                <option value={171}>تفسير الطبري (جامع البيان)</option>
              </select>
            </div>

            {/* Translation Source */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Feather className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAr ? 'الترجمة المعتمدة' : 'Verified Translation'}</span>
              </label>
              <select
                value={translationId}
                onChange={(e) => setTranslationId(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-semibold focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                <option value={131}>Dr. Mustafa Khattab (The Clear Quran)</option>
                <option value={20}>Saheeh International</option>
                <option value={84}>Mufti Taqi Usmani</option>
                <option value={19}>Pickthall Translation</option>
              </select>
            </div>
          </div>

          {/* Visual Guardrail Policy & AI Engine */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            {/* Visual Policy */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAr ? 'سياسة التمثيل البصري المهيب' : 'Visual Representation Policy'}</span>
              </label>
              <select
                value={visualPolicy}
                onChange={(e) => setVisualPolicy(e.target.value as VisualPolicy)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-semibold focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                <option value="environmental">مشاهد بيئية وطبيعية (جبال، بحار، فجر، سحب)</option>
                <option value="celestial">مشاهد فلكية وكونية (مجرات، مدارات، نجوم)</option>
                <option value="symbolic">رمزية الضوء والظل والمعاني التجريدية</option>
                <option value="architectural">معمارية وزخارف إسلامية هندسية</option>
                <option value="calligraphic">خط عربي مضيء ومتحرك مع الجزيئات</option>
              </select>
            </div>

            {/* AI Engine */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAr ? 'محرك الذكاء الاصطناعي' : 'AI Generation Model'}</span>
              </label>
              <select
                value={aiProvider}
                onChange={(e) => setAiProvider(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-semibold focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                <option value="gemini">Google Gemini 2.5 Flash (موصى به)</option>
                <option value="openai">OpenAI GPT-4o</option>
                <option value="anthropic">Anthropic Claude 3.5 Sonnet</option>
                <option value="mock">المحرك العلمي المحلي (Offline Scholarly Engine)</option>
              </select>
            </div>
          </div>

          {/* Quran Media Template Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAr ? 'قالب الهوية والإنتاج المرئي' : 'Quran Media Visual Template'}</span>
              </label>
              <button
                type="button"
                onClick={() => setIsTemplatePickerOpen(true)}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                {isAr ? 'استعراض 18 قالباً ←' : 'Browse 18 Templates →'}
              </button>
            </div>

            <div
              onClick={() => setIsTemplatePickerOpen(true)}
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500/60 bg-slate-50 dark:bg-slate-950 flex items-center justify-between cursor-pointer transition-all shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl border border-slate-700/50 flex items-center justify-center shrink-0 shadow-inner"
                  style={{ background: selectedTemplate.preview.backdropCss }}
                >
                  <Sparkles className="w-4 h-4 text-amber-300 drop-shadow" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-500 transition-colors flex items-center gap-2">
                    <span>{isAr ? selectedTemplate.nameAr : selectedTemplate.nameEn}</span>
                    <span className="text-[10px] text-amber-500 font-mono">[{selectedTemplate.fonts.arabicFont}]</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {isAr ? selectedTemplate.descriptionAr : selectedTemplate.descriptionEn}
                  </div>
                </div>
              </div>

              <span className="py-1 px-2.5 rounded-lg bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                {isAr ? 'تغيير' : 'Change'}
              </span>
            </div>
          </div>

          {/* Custom Focus Request */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isAr ? 'تركيز موضوعي إضافي (اختياري)' : 'Custom Thematic Focus (Optional)'}
            </label>
            <input
              type="text"
              placeholder={
                isAr
                  ? 'مثال: التركيز على عظمة الله، أو الصبر الجميل، أو بديع خلق السماوات...'
                  : 'e.g. Focus on Divine Magnificence, or steadfast patience, or cosmic balance...'
              }
              value={customPromptFocus}
              onChange={(e) => setCustomPromptFocus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Generate Button */}
          <div className="pt-3">
            <button
              onClick={handleGenerateStory}
              disabled={isGenerating}
              className="w-full py-4 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>{generationStep || (isAr ? 'جارٍ التحليل والتوليد...' : 'Generating Structured Story...')}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-slate-950" />
                  <span>
                    {isAr
                      ? `توليد القصة المرئية لـ ${currentSurah.nameAr} [${surahNumber}:${ayahStart}${
                          isRangeMode && ayahStart !== ayahEnd ? `-${ayahEnd}` : ''
                        }]`
                      : `Generate Visual Story for ${currentSurah.nameEn} [${surahNumber}:${ayahStart}${
                          isRangeMode && ayahStart !== ayahEnd ? `-${ayahEnd}` : ''
                        }]`}
                  </span>
                </>
              )}
            </button>
            {errorMsg && (
              <p className="text-xs font-semibold text-rose-500 dark:text-rose-400 mt-2 text-center">{errorMsg}</p>
            )}
          </div>
        </div>

        {/* Live Scripture & Islamic Guardrails Peek Box */}
        <div className="space-y-5">
          {/* Islamic Guardrails Certified Box */}
          <div className="p-5 rounded-3xl border border-emerald-500/30 bg-emerald-950/20 dark:bg-emerald-950/40 text-slate-900 dark:text-emerald-200 space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{isAr ? 'ميثاق الضوابط الشرعية الإسلامية' : 'Islamic Reverence Standard'}</span>
            </div>
            <ul className="text-[11px] text-slate-600 dark:text-emerald-300/80 space-y-1.5 list-disc list-inside leading-relaxed">
              <li>{isAr ? 'استخدام النص العثماني الصارم بلا زيادة أو نقصان' : 'Strict verbatim Uthmani script adherence'}</li>
              <li>{isAr ? 'حظر وتجنب أي تجسيد للذات الإلهية سبحانه وتعالى' : 'Strict prohibition of depicting Allah (SWT)'}</li>
              <li>{isAr ? 'اعتماد المنظور البيئي والرمزي بدلاً من تجسيد الأنبياء' : 'Non-figurative symbolic prophetic storytelling'}</li>
              <li>{isAr ? 'التمييز القاطع بين النص والترجمة والتفسير' : 'Four-pillar distinction of scripture & commentary'}</li>
            </ul>
          </div>

          {/* Live Scripture Inspector Drawer */}
          <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAr ? 'معاينة الآية والتفسير' : 'Scripture Context Peek'}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowLiveScripturePeek(!showLiveScripturePeek)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showLiveScripturePeek ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {showLiveScripturePeek && (
              <div className="space-y-4 text-xs">
                {isLoadingScripture ? (
                  <div className="py-8 text-center text-slate-400 text-xs animate-pulse">
                    {isAr ? 'جارٍ تحميل النص القرآني الموثق...' : 'Loading scripture preview...'}
                  </div>
                ) : (
                  <>
                    {/* Arabic Text */}
                    <div className="p-3.5 rounded-2xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                        {isAr ? 'النص القرآني بالرسم العثماني' : 'Uthmani Scripture'}
                      </span>
                      <p className="font-arabic text-sm text-slate-900 dark:text-amber-100 leading-loose text-right">
                        {liveVerseText || '...'}
                      </p>
                    </div>

                    {/* Translation */}
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block">
                        {isAr ? 'الترجمة المعتمدة' : 'Verified Translation'}
                      </span>
                      <p className="text-slate-600 dark:text-slate-300 italic text-[11px] leading-relaxed">
                        {liveTranslationText || '...'}
                      </p>
                    </div>

                    {/* Tafsir Overview */}
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block">
                        {isAr ? 'نبذة من التفسير المعتمد' : 'Tafsir Context'}
                      </span>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] line-clamp-3 leading-relaxed">
                        {liveTafsirText || '...'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Generated Storyboard Studio Output */}
      {generatedStory && (
        <div id="storyboard-output" className="space-y-6 pt-6">
          <div className="p-6 sm:p-10 rounded-3xl border border-amber-500/30 bg-white dark:bg-slate-900/90 shadow-2xl space-y-8">
            {/* Result Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    {generatedStory.verseReference}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {modesConfig[selectedMode]?.labelAr || selectedMode}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    {generatedStory.emotionalTone}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {generatedStory.title}
                </h2>

                <p className="text-sm sm:text-base font-semibold text-amber-600 dark:text-amber-300 italic">
                  &ldquo;{generatedStory.hook}&rdquo;
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'نسخ JSON' : 'Copy JSON'}</span>
                </button>

                <button
                  onClick={handleDownloadJson}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تحميل ملف' : 'Download'}</span>
                </button>

                <Link
                  href={`/${locale}/create?surah=${surahNumber}&ayah=${ayahStart}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إنتاج فيديو سينمائي' : 'Send to Video Studio'}</span>
                </Link>
              </div>
            </div>

            {/* Four-Pillar Source Distinction Banner */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                {isAr ? 'أركان التوثيق والتمييز المعرفي:' : 'Four-Pillar Source Verification Ledger:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200">
                  <span className="font-bold block text-[10px] uppercase text-emerald-600 dark:text-emerald-400">
                    🟢 {isAr ? 'القرآن الكريم' : 'Quran (Sacred Scripture)'}
                  </span>
                  <span className="font-medium text-[11px]">
                    سورة {currentSurah.nameAr} [{generatedStory.verseReference}]
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-900 dark:text-blue-200">
                  <span className="font-bold block text-[10px] uppercase text-blue-600 dark:text-blue-400">
                    🔵 {isAr ? 'الترجمة المعتمدة' : 'Translation (Human Effort)'}
                  </span>
                  <span className="font-medium text-[11px] truncate block">
                    {generatedStory.sourceReferences?.translationAuthor || 'Dr. Mustafa Khattab'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-900 dark:text-purple-200">
                  <span className="font-bold block text-[10px] uppercase text-purple-600 dark:text-purple-400">
                    🟣 {isAr ? 'التفسير المعتمد' : 'Tafsir (Scholarly Context)'}
                  </span>
                  <span className="font-medium text-[11px] truncate block">
                    {generatedStory.sourceReferences?.tafsirAuthor || 'تفسير السعدي'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200">
                  <span className="font-bold block text-[10px] uppercase text-amber-600 dark:text-amber-400">
                    🟡 {isAr ? 'التصور البصري' : 'AI Visualization (Concept)'}
                  </span>
                  <span className="font-medium text-[11px] block">
                    {generatedStory.scenes.length} {isAr ? 'مشاهد متسلسلة' : 'Sequential Scenes'}
                  </span>
                </div>
              </div>
            </div>

            {/* View Tabs Switcher */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab('storyboard')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'storyboard'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isAr ? 'المشاهد البصرية (Storyboard)' : 'Visual Storyboard'}
              </button>

              <button
                onClick={() => setActiveTab('json')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'json'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isAr ? 'مخطط JSON المباشر' : 'Raw JSON Schema'}
              </button>

              <button
                onClick={() => setActiveTab('sources')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'sources'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isAr ? 'سجل المصادر والتوثيق' : 'Source References'}
              </button>
            </div>

            {/* Tab 1: Visual Storyboard Cards */}
            {activeTab === 'storyboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {generatedStory.scenes.map((scene, idx) => (
                    <div
                      key={scene.sceneNumber || idx}
                      className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs">
                              {scene.sceneNumber}
                            </span>
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {isAr ? `المشهد #${scene.sceneNumber}` : `Scene #${scene.sceneNumber}`}
                            </span>
                          </div>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            ⏱️ {scene.duration}
                          </span>
                        </div>

                        {/* Narration Script */}
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            🎙️ {isAr ? 'نص التعليق الصوتي (Narration):' : 'Narration Script:'}
                          </span>
                          <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                            {scene.narration}
                          </p>
                        </div>

                        {/* Visual Description Prompt */}
                        <div className="p-3 rounded-xl bg-emerald-950/10 dark:bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                              🎨 {isAr ? 'الوصف والتوجيه البصري (AI Visual Prompt):' : 'Visual Scene Prompt:'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyScenePrompt(scene.visualDescription, idx)}
                              className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              {copiedSceneIndex === idx ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-500" />
                                  <span>{isAr ? 'تم!' : 'Copied'}</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>{isAr ? 'نسخ البرومبت' : 'Copy Prompt'}</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-emerald-100/90 leading-relaxed font-mono text-[11px]">
                            {scene.visualDescription}
                          </p>
                        </div>
                      </div>

                      {/* Camera & Transition Footer */}
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        <span>📹 {scene.cameraMovement}</span>
                        <span>✨ {scene.transition}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ending Reflection Callout */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-transparent border border-amber-500/30 space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                    💫 {isAr ? 'الخاتمة والتأمل الإيماني (Ending & Takeaway):' : 'Ending Reflection & Moral Takeaway:'}
                  </span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                    {generatedStory.ending}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Raw JSON Viewer */}
            {activeTab === 'json' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    {isAr ? 'مخطط JSON المتوافق مع معايير الإنتاج' : 'Standard Visual Story JSON Schema'}
                  </span>
                  <button
                    onClick={handleCopyJson}
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedJson ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'نسخ الكود' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-slate-950 text-amber-200 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
                  {JSON.stringify(generatedStory, null, 2)}
                </pre>
              </div>
            )}

            {/* Tab 3: Source References & Ledger */}
            {activeTab === 'sources' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {isAr ? 'تفاصيل السند والمراجع العلمية' : 'Scientific Provenance & Citations'}
                  </h4>

                  <div className="space-y-2 text-slate-600 dark:text-slate-300">
                    <p>
                      <strong>{isAr ? 'النص القرآني:' : 'Quranic Scripture:'}</strong> سورة{' '}
                      {generatedStory.sourceReferences?.surahNameAr} (
                      {generatedStory.sourceReferences?.surahNameEn}) — الآيات{' '}
                      {generatedStory.sourceReferences?.ayahStart} إلى {generatedStory.sourceReferences?.ayahEnd}
                    </p>
                    <p>
                      <strong>{isAr ? 'مصدر الترجمة:' : 'Translation Source:'}</strong>{' '}
                      {generatedStory.sourceReferences?.translationAuthor}
                    </p>
                    <p>
                      <strong>{isAr ? 'مصدر التفسير:' : 'Tafsir Source:'}</strong>{' '}
                      {generatedStory.sourceReferences?.tafsirAuthor}
                    </p>
                    <p>
                      <strong>{isAr ? 'ملخص التفسير المعتمد:' : 'Tafsir Context Summary:'}</strong>{' '}
                      {generatedStory.sourceReferences?.tafsirOverview}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                    {isAr ? 'الضوابط الشرعية المطبقة في هذا التوليد:' : 'Guardrails Applied in this Generation:'}
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-emerald-200/80">
                    {generatedStory.sourceReferences?.guardrailsApplied.map((rule, rIdx) => (
                      <li key={rIdx}>{rule}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Template Picker Modal Dialog */}
      <TemplatePickerModal
        isOpen={isTemplatePickerOpen}
        onClose={() => setIsTemplatePickerOpen(false)}
        selectedTemplateId={selectedTemplate.template_id}
        onSelectTemplate={(tpl) => setSelectedTemplate(tpl)}
        locale={locale}
      />
    </div>
  );
}
