'use client';

import React from 'react';
import {
  Volume2,
  Mic,
  Music,
  Activity,
  Sliders,
  Sparkles,
} from 'lucide-react';
import type { AudioConfig } from '@quran-media/media/types';
import type { Locale } from '@quran-media/i18n';

interface AudioInspectorProps {
  audio: AudioConfig;
  onUpdateAudio: (updated: AudioConfig) => void;
  locale: Locale;
}

const RECITERS = [
  { id: 7, nameAr: 'مشاري بن راشد العفاسي', nameEn: 'Mishary Rashid Alafasy', style: 'حفص عن عاصم' },
  { id: 1, nameAr: 'عبد الباسط عبد الصمد', nameEn: 'Abdul Basit Murattal', style: 'مرتل' },
  { id: 2, nameAr: 'عبد الرحمن السديس', nameEn: 'Abdur-Rahman As-Sudais', style: 'حرم مكي' },
  { id: 3, nameAr: 'سعد الغامدي', nameEn: 'Saad Al-Ghamdi', style: 'مرتل' },
  { id: 6, nameAr: 'محمود خليل الحصري', nameEn: 'Mahmoud Khalil Al-Husary', style: 'معلم' },
];

export function AudioInspector({
  audio,
  onUpdateAudio,
  locale,
}: AudioInspectorProps) {
  const isAr = locale === 'ar';

  const handleReciterChange = (reciterId: number) => {
    onUpdateAudio({
      ...audio,
      recitation: {
        volume: audio.recitation?.volume ?? 1.0,
        normalize: audio.recitation?.normalize ?? true,
        fadeInSeconds: audio.recitation?.fadeInSeconds ?? 0.5,
        fadeOutSeconds: audio.recitation?.fadeOutSeconds ?? 1.0,
        ...audio.recitation,
        reciterId,
      },
    });
  };

  const handleAmbientPresetChange = (preset: any) => {
    onUpdateAudio({
      ...audio,
      ambient: {
        volume: audio.ambient?.volume ?? 0.16,
        fadeInSeconds: audio.ambient?.fadeInSeconds ?? 1.5,
        fadeOutSeconds: audio.ambient?.fadeOutSeconds ?? 2.0,
        loop: true,
        ...audio.ambient,
        preset,
      },
    });
  };

  const handleRecitationVolume = (volume: number) => {
    onUpdateAudio({
      ...audio,
      recitation: {
        reciterId: audio.recitation?.reciterId ?? 7,
        normalize: audio.recitation?.normalize ?? true,
        fadeInSeconds: audio.recitation?.fadeInSeconds ?? 0.5,
        fadeOutSeconds: audio.recitation?.fadeOutSeconds ?? 1.0,
        ...audio.recitation,
        volume,
      },
    });
  };

  const handleAmbientVolume = (volume: number) => {
    onUpdateAudio({
      ...audio,
      ambient: {
        preset: audio.ambient?.preset ?? 'deep_serenity',
        fadeInSeconds: audio.ambient?.fadeInSeconds ?? 1.5,
        fadeOutSeconds: audio.ambient?.fadeOutSeconds ?? 2.0,
        loop: audio.ambient?.loop ?? true,
        ...audio.ambient,
        volume,
      },
    });
  };

  const handleWaveformToggle = (enabled: boolean) => {
    onUpdateAudio({
      ...audio,
      audioWaveform: {
        ...audio.audioWaveform,
        enabled,
        style: audio.audioWaveform?.style || 'bars',
        color: audio.audioWaveform?.color || '#f59e0b',
        height: 80,
      },
    });
  };

  const handleDuckingToggle = (enabled: boolean) => {
    onUpdateAudio({
      ...audio,
      sidechainDucking: {
        enabled,
        duckAmountDb: 18,
      },
    });
  };

  return (
    <div className="rounded-3xl bg-slate-950/80 border border-slate-800/80 p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-4">
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
          <Volume2 className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-100">
            {isAr ? 'هندسة واستوديو الصوت' : 'Audio Studio & Mastering'}
          </h3>
          <p className="text-[11px] text-slate-400">
            {isAr ? 'اختيار القارئ، المؤثرات البيئية، وخفض الصوت التلقائي' : 'Select reciter, ambient soundscapes, and ducking'}
          </p>
        </div>
      </div>

      {/* Reciter Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Mic className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isAr ? 'القارئ المعتمد' : 'Quran Reciter'}</span>
        </label>
        <select
          value={audio.recitation?.reciterId || 7}
          onChange={(e) => handleReciterChange(Number(e.target.value))}
          className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
        >
          {RECITERS.map((r) => (
            <option key={r.id} value={r.id}>
              {isAr ? `${r.nameAr} (${r.style})` : `${r.nameEn} (${r.style})`}
            </option>
          ))}
        </select>
      </div>

      {/* Ambient Soundscapes */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Music className="w-3.5 h-3.5 text-amber-400" />
          <span>{isAr ? 'المؤثرات الصوتية والبيئية (Ambient Soundscape)' : 'Ambient Soundscape'}</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { id: 'deep_serenity', label: isAr ? 'سكينة عميقة' : 'Deep Serenity' },
            { id: 'night_desert', label: isAr ? 'صحراء ليلية' : 'Night Desert' },
            { id: 'celestial_reverb', label: isAr ? 'تردد فلكي' : 'Celestial Reverb' },
            { id: 'rain_gentle', label: isAr ? 'مطر خفيف' : 'Gentle Rain' },
            { id: 'none', label: isAr ? 'بدون خلفية' : 'None (Solo)' },
          ].map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleAmbientPresetChange(preset.id)}
              className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                audio.ambient?.preset === preset.id
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Volume Controls & Ducking */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Recitation Volume */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300">{isAr ? 'مستوى صوت التلاوة' : 'Recitation Volume'}</span>
            <span className="font-mono text-emerald-400">{Math.round((audio.recitation?.volume ?? 1.0) * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1.5}
            step={0.05}
            value={audio.recitation?.volume ?? 1.0}
            onChange={(e) => handleRecitationVolume(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* Ambient Volume */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300">{isAr ? 'مستوى صوت الخلفية' : 'Ambient Volume'}</span>
            <span className="font-mono text-amber-400">{Math.round((audio.ambient?.volume ?? 0.16) * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={0.5}
            step={0.02}
            value={audio.ambient?.volume ?? 0.16}
            onChange={(e) => handleAmbientVolume(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="pt-3 border-t border-slate-800/80 space-y-3">
        {/* Sidechain Ducking */}
        <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800 cursor-pointer">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-200">
              {isAr ? 'الخفض التلقائي لصوت الخلفية (Sidechain Ducking)' : 'Sidechain Audio Ducking'}
            </div>
            <div className="text-[11px] text-slate-400">
              {isAr ? 'خفض صوت المؤثرات تلقائياً عند نطق القارئ للآية' : 'Automatically lowers ambient audio during recitation speech'}
            </div>
          </div>
          <input
            type="checkbox"
            checked={audio.sidechainDucking?.enabled ?? true}
            onChange={(e) => handleDuckingToggle(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-950 border-slate-700"
          />
        </label>

        {/* Dynamic Waveform Visualizer */}
        <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800 cursor-pointer">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'مخطط التردد الصوتي المرئي (Waveform Visualizer)' : 'Audio Waveform Visualizer'}</span>
            </div>
            <div className="text-[11px] text-slate-400">
              {isAr ? 'تراكب مرئي للأمواج الصوتية المتزامنة مع التلاوة' : 'Dynamic animated audio waveform overlay on video'}
            </div>
          </div>
          <input
            type="checkbox"
            checked={audio.audioWaveform?.enabled ?? true}
            onChange={(e) => handleWaveformToggle(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-950 border-slate-700"
          />
        </label>
      </div>
    </div>
  );
}
