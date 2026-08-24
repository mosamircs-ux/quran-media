'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Film,
  Sparkles,
  RotateCw,
  Share2,
  Download,
  CheckCircle2,
  Layers,
  Music,
  Type,
  Settings,
  Sliders,
  AlertCircle,
  Play,
  Save,
} from 'lucide-react';
import { VideoPreviewPlayer } from './video-preview-player';
import { TimelineEditor } from './timeline-editor';
import { SceneInspector } from './scene-inspector';
import { AudioInspector } from './audio-inspector';
import { SubtitlesInspector } from './subtitles-inspector';
import { ShareModal } from './share-modal';
import { TemplatePickerModal } from '@/components/templates/template-picker-modal';
import {
  applyTemplateToProject,
  QURAN_MEDIA_TEMPLATES,
  type QuranMediaTemplate,
} from '@quran-media/media/templates';
import {
  MediaProjectSchema,
  MediaSceneSchema,
  type MediaProject,
  type MediaScene,
  type AspectRatio,
} from '@quran-media/media/types';
import type { Locale } from '@quran-media/i18n';

interface StudioProjectEditorClientProps {
  initialProject: any;
  projectId: string;
  locale: Locale;
}

type InspectorTab = 'scenes' | 'audio' | 'subtitles' | 'settings';

export function StudioProjectEditorClient({
  initialProject,
  projectId,
  locale,
}: StudioProjectEditorClientProps) {
  const isAr = locale === 'ar';

  // Project Configuration State
  const [projectTitle, setProjectTitle] = useState<string>(initialProject?.title || 'Quran Media Production');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(initialProject?.config?.aspectRatio || '9:16');
  const [scenes, setScenes] = useState<MediaScene[]>(
    initialProject?.config?.scenes || [
      {
        id: 'scene-1',
        duration: 4,
        background: {
          type: 'animated_gradient',
          color: '#020617',
          gradientColors: ['#064e3b', '#0f172a', '#020617'],
        },
        camera: { effect: 'zoom_in', intensity: 0.12, startScale: 1.0, endScale: 1.12 },
        transition: { type: 'crossfade', duration: 1.0 },
        verse: {
          surahNumber: 1,
          ayahNumber: 1,
          textUthmani: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
          translationText: 'In the Name of Allah, Most Compassionate, Most Merciful',
        },
      },
    ]
  );

  const [audioConfig, setAudioConfig] = useState(
    initialProject?.config?.audio || {
      recitation: { reciterId: 7, volume: 1.0, normalize: true },
      ambient: { preset: 'deep_serenity', volume: 0.16, loop: true },
      audioWaveform: { enabled: true, style: 'bars', color: '#f59e0b', height: 80, opacity: 0.85 },
      sidechainDucking: { enabled: true, duckAmountDb: 18 },
    }
  );

  const [subtitlesConfig, setSubtitlesConfig] = useState(
    initialProject?.config?.subtitles || {
      enabled: true,
      style: {
        fontArabic: 'Amiri Quran',
        fontTranslation: 'Inter',
        highlightColorHex: '&H0000D7FF',
        dualLanguage: true,
        wordHighlight: true,
      },
    }
  );

  // Playback & Timeline State
  const [currentTime, setCurrentTime] = useState(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<InspectorTab>('scenes');

  // Rendering & Deliverables State
  const [status, setStatus] = useState<string>(initialProject?.status || 'DRAFT');
  const [progress, setProgress] = useState<number>(initialProject?.progress || 0);
  const [currentStep, setCurrentStep] = useState<string>(initialProject?.currentStep || '');
  const [videoUrl, setVideoUrl] = useState<string | null>(initialProject?.assets?.videoUrl || null);
  const [webmUrl, setWebmUrl] = useState<string | null>(initialProject?.assets?.webmUrl || null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(initialProject?.assets?.thumbnailUrl || null);
  const [isRendering, setIsRendering] = useState<boolean>(
    initialProject?.status === 'PROCESSING' || initialProject?.status === 'QUEUED'
  );
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleApplyTemplate = (template: QuranMediaTemplate) => {
    const updated = applyTemplateToProject(
      {
        id: projectId,
        title: projectTitle,
        aspectRatio,
        scenes,
        audio: audioConfig,
        subtitles: subtitlesConfig,
      },
      template.template_id
    );

    setAspectRatio(updated.aspectRatio);
    setScenes(updated.scenes);
    if (updated.audio) setAudioConfig(updated.audio);
    if (updated.subtitles) setSubtitlesConfig(updated.subtitles);
  };

  const totalDuration = scenes.reduce((acc, s) => acc + s.duration, 0);

  // Synchronize active scene with current playback scrubber time
  useEffect(() => {
    let accumulated = 0;
    for (let i = 0; i < scenes.length; i++) {
      const s = scenes[i]!;
      if (currentTime >= accumulated && currentTime < accumulated + s.duration) {
        setActiveSceneIndex(i);
        break;
      }
      accumulated += s.duration;
    }
  }, [currentTime, scenes]);

  // Server-Sent Events (SSE) Stream Listener
  const sseRef = useRef<EventSource | null>(null);

  const startSseListener = () => {
    if (sseRef.current) {
      sseRef.current.close();
    }

    const eventsUrl = `/api/studio/projects/${projectId}/events`;
    const es = new EventSource(eventsUrl);
    sseRef.current = es;

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.status) {
          setStatus(data.status);
          setProgress(data.progress ?? 0);
          if (data.currentStep) setCurrentStep(data.currentStep);

          if (data.status === 'PROCESSING' || data.status === 'QUEUED') {
            setIsRendering(true);
          } else if (data.status === 'COMPLETED') {
            setIsRendering(false);
            if (data.videoUrl) setVideoUrl(data.videoUrl);
            if (data.webmUrl) setWebmUrl(data.webmUrl);
            if (data.thumbnailUrl) setThumbnailUrl(data.thumbnailUrl);
            es.close();
          } else if (data.status === 'FAILED') {
            setIsRendering(false);
            es.close();
          }
        }
      } catch {}
    };

    es.onerror = () => {
      // Reconnection handled automatically by EventSource
    };
  };

  useEffect(() => {
    if (isRendering) {
      startSseListener();
    }
    return () => {
      if (sseRef.current) {
        sseRef.current.close();
      }
    };
  }, [isRendering]);

  // Handle Triggering Re-render
  const handleRenderAgain = async () => {
    setIsRendering(true);
    setStatus('QUEUED');
    setProgress(0);
    setCurrentStep(isAr ? 'جاري تجهيز بيئة الإنتاج...' : 'Initializing render pipeline...');

    const fullProjectPayload: MediaProject = MediaProjectSchema.parse({
      id: projectId,
      title: projectTitle,
      aspectRatio,
      resolution: '1080p',
      fps: 30,
      scenes,
      audio: audioConfig,
      subtitles: {
        ...subtitlesConfig,
        cues: scenes.map((s, i) => ({
          index: i + 1,
          startMs: i * 4000,
          endMs: (i + 1) * 4000,
          arabicText: s.verse?.textUthmani || s.verse?.textSimple || '',
          translationText: s.verse?.translationText,
        })),
      },
      intro: { enabled: true, duration: 2, titleAr: projectTitle, animation: 'fade' },
      outro: {
        enabled: true,
        duration: 3,
        reflectionAr: 'سبحان الله وبحمده',
        callToAction: 'اشترك للمزيد',
        socialHandle: '@QuranMedia',
        animation: 'fade',
      },
      outputFormats: ['mp4', 'webm', 'thumbnail', 'preview'],
    });

    try {
      const res = await fetch(`/api/studio/projects/${projectId}/render`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullProjectPayload),
      });

      if (res.ok) {
        startSseListener();
      }
    } catch {
      setIsRendering(false);
    }
  };

  // Handle Save State
  const handleSaveProject = async () => {
    setIsSaving(true);
    try {
      await fetch(`/api/studio/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: projectTitle,
          config: {
            aspectRatio,
            scenes,
            audio: audioConfig,
            subtitles: subtitlesConfig,
          },
        }),
      });
    } catch {}
    finally {
      setIsSaving(false);
    }
  };

  // Add new scene
  const handleAddScene = () => {
    const nextAyah = (scenes[scenes.length - 1]?.verse?.ayahNumber || 1) + 1;
    const newScene: MediaScene = MediaSceneSchema.parse({
      id: `scene-${Date.now()}`,
      duration: 4,
      background: {
        type: 'animated_gradient',
        color: '#020617',
        gradientColors: ['#064e3b', '#0f172a', '#020617'],
      },
      camera: { effect: 'zoom_in', intensity: 0.12, startScale: 1.0, endScale: 1.12 },
      transition: { type: 'crossfade', duration: 1.0 },
      verse: {
        surahNumber: scenes[0]?.verse?.surahNumber || 1,
        ayahNumber: nextAyah,
        textUthmani: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ',
        translationText: 'All praise is for Allah—Lord of all worlds',
      },
    });
    setScenes((prev) => [...prev, newScene]);
    setActiveSceneIndex(scenes.length);
  };

  // Remove scene
  const handleRemoveScene = (index: number) => {
    if (scenes.length <= 1) return;
    setScenes((prev) => prev.filter((_, idx) => idx !== index));
    setActiveSceneIndex(Math.max(0, index - 1));
  };

  const activeScene = scenes[activeSceneIndex] || scenes[0]!;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Navbar & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/80 border border-slate-800/80 p-4 sm:p-5 rounded-3xl backdrop-blur-md shadow-xl">
        {/* Back Link & Title */}
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/studio`}
            className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors shadow"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="font-extrabold text-base sm:text-lg text-slate-100 bg-transparent border-b border-transparent hover:border-slate-700 focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{scenes.length} {isAr ? 'مشاهد' : 'scenes'}</span>
              <span>•</span>
              <span>{totalDuration} {isAr ? 'ثانية' : 'sec total'}</span>
            </div>
          </div>
        </div>

        {/* Aspect Ratio Switcher & Actions */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Aspect Ratio Pills */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-2xl shadow-inner">
            {(['9:16', '16:9', '1:1', '4:5'] as AspectRatio[]).map((ratio) => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  aspectRatio === ratio
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>

          {/* Template Switcher Button */}
          <button
            onClick={() => setIsTemplatePickerOpen(true)}
            className="py-2 px-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/60 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'تغيير القالب' : 'Change Template'}</span>
          </button>

          {/* Save Button */}
          <button
            onClick={handleSaveProject}
            disabled={isSaving}
            className="py-2 px-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
          >
            <Save className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin' : ''}`} />
            <span>{isSaving ? (isAr ? 'حفظ...' : 'Saving...') : (isAr ? 'حفظ' : 'Save')}</span>
          </button>

          {/* Share & Export */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="py-2 px-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'تصدير ومشاركة' : 'Share & Export'}</span>
          </button>

          {/* Render Master Video Button */}
          <button
            onClick={handleRenderAgain}
            disabled={isRendering}
            className="py-2 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            {isRendering ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>{isAr ? 'جاري الرندر' : 'Rendering'} ({progress}%)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAr ? 'رندر الفيديو مجدداً' : 'Render Again'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Viewport + Inspector Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Video Preview & Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Video Preview Viewport */}
          <VideoPreviewPlayer
            videoUrl={videoUrl}
            thumbnailUrl={thumbnailUrl}
            aspectRatio={aspectRatio}
            durationSeconds={totalDuration}
            currentTime={currentTime}
            onTimeUpdate={setCurrentTime}
            isRendering={isRendering}
            renderProgress={progress}
            renderStep={currentStep}
            activeArabicText={activeScene?.verse?.textUthmani || activeScene?.verse?.textSimple}
            activeTranslationText={activeScene?.verse?.translationText}
            fontArabic={subtitlesConfig?.style?.fontArabic || 'Amiri Quran'}
            dualLanguage={subtitlesConfig?.style?.dualLanguage ?? true}
            showWaveform={audioConfig?.audioWaveform?.enabled ?? true}
          />

          {/* Interactive Timeline Track */}
          <TimelineEditor
            scenes={scenes}
            activeSceneIndex={activeSceneIndex}
            onSelectScene={setActiveSceneIndex}
            onAddScene={handleAddScene}
            onRemoveScene={handleRemoveScene}
            currentTime={currentTime}
            totalDuration={totalDuration}
            onSeek={setCurrentTime}
            locale={locale}
          />
        </div>

        {/* Right Column: Tabbed Inspector Panels (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Inspector Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 p-1.5 rounded-2xl shadow-xl">
            {[
              { id: 'scenes', label: isAr ? 'المشاهد' : 'Scenes', icon: Film },
              { id: 'audio', label: isAr ? 'الصوت' : 'Audio', icon: Music },
              { id: 'subtitles', label: isAr ? 'الترجمة والخطوط' : 'Subtitles', icon: Type },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as InspectorTab)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel */}
          {activeTab === 'scenes' && (
            <SceneInspector
              scene={activeScene}
              sceneIndex={activeSceneIndex}
              onUpdateScene={(updated) => {
                const next = [...scenes];
                next[activeSceneIndex] = updated;
                setScenes(next);
              }}
              locale={locale}
            />
          )}

          {activeTab === 'audio' && (
            <AudioInspector
              audio={audioConfig}
              onUpdateAudio={setAudioConfig}
              locale={locale}
            />
          )}

          {activeTab === 'subtitles' && (
            <SubtitlesInspector
              subtitles={subtitlesConfig}
              onUpdateSubtitles={setSubtitlesConfig}
              locale={locale}
            />
          )}
        </div>
      </div>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={projectTitle}
        videoUrl={videoUrl}
        webmUrl={webmUrl}
        thumbnailUrl={thumbnailUrl}
        locale={locale}
      />

      {/* Template Picker Modal Dialog */}
      <TemplatePickerModal
        isOpen={isTemplatePickerOpen}
        onClose={() => setIsTemplatePickerOpen(false)}
        onSelectTemplate={handleApplyTemplate}
        targetAspectRatio={aspectRatio}
        locale={locale}
      />
    </div>
  );
}
