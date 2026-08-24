'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Film,
  Clock,
  Calendar,
  Sparkles,
  Play,
  RotateCw,
  MoreVertical,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import type { Locale } from '@quran-media/i18n';

export interface StudioProjectItem {
  id: string;
  title: string;
  description?: string;
  status: 'DRAFT' | 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;
  currentStep?: string;
  surahNumber: number;
  ayahStart: number;
  ayahEnd: number;
  ayahReferenceAr: string;
  ayahReferenceEn: string;
  aspectRatio: string;
  durationSeconds: number;
  thumbnailUrl?: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
  generationId?: string;
}

interface ProjectCardProps {
  project: StudioProjectItem;
  locale: Locale;
  onDelete?: (id: string) => void;
  onRenderAgain?: (project: StudioProjectItem) => void;
}

export function ProjectCard({
  project,
  locale,
  onDelete,
  onRenderAgain,
}: ProjectCardProps) {
  const isAr = locale === 'ar';
  const isProcessing = project.status === 'PROCESSING' || project.status === 'QUEUED';
  const isCompleted = project.status === 'COMPLETED';
  const isFailed = project.status === 'FAILED';

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="group relative rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/40 transition-all duration-300 shadow-lg hover:shadow-emerald-950/20 overflow-hidden flex flex-col justify-between">
      {/* Top Thumbnail Section */}
      <div className="relative aspect-[16/10] w-full bg-slate-950 overflow-hidden flex items-center justify-center">
        {project.thumbnailUrl ? (
          <Image
            src={project.thumbnailUrl}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 flex flex-col items-center justify-center gap-3 p-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Film className="w-6 h-6" />
            </div>
            <span className="font-amiri text-lg font-bold text-amber-200/90 line-clamp-1">
              {project.ayahReferenceAr}
            </span>
          </div>
        )}

        {/* Aspect Ratio Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-[11px] font-semibold text-slate-300 flex items-center gap-1.5 shadow">
          <Layers className="w-3 h-3 text-emerald-400" />
          {project.aspectRatio}
        </div>

        {/* Duration Badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-[11px] font-semibold text-slate-300 flex items-center gap-1.5 shadow">
          <Clock className="w-3 h-3 text-amber-400" />
          {formatDuration(project.durationSeconds)}
        </div>

        {/* Active Rendering Progress Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 z-10">
            <div className="relative flex items-center justify-center">
              <div className="w-14 h-14 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
              <Sparkles className="w-5 h-5 text-emerald-400 absolute animate-pulse" />
            </div>
            <div className="text-center space-y-1">
              <div className="text-xs font-bold text-emerald-300">
                {isAr ? 'جاري المعالجة والتوليد' : 'Rendering Video'} ({project.progress}%)
              </div>
              {project.currentStep && (
                <div className="text-[11px] text-slate-400 line-clamp-1 max-w-[200px]">
                  {project.currentStep}
                </div>
              )}
            </div>
            {/* Progress Bar */}
            <div className="w-3/4 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-500 rounded-full"
                style={{ width: `${Math.max(5, project.progress)}%` }}
              />
            </div>
          </div>
        )}

        {/* Hover Quick Play Button (if completed video exists) */}
        {isCompleted && project.videoUrl && (
          <Link
            href={`/${locale}/studio/${project.id}`}
            className="absolute inset-0 bg-emerald-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/40 transform group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 ml-0.5 fill-current" />
            </div>
          </Link>
        )}
      </div>

      {/* Body Content */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Status Badge */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {isCompleted ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  {isAr ? 'جاهز للعرض' : 'Completed'}
                </span>
              ) : isProcessing ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                  <RotateCw className="w-3 h-3 animate-spin" />
                  {isAr ? 'قيد التوليد' : 'Processing'} ({project.progress}%)
                </span>
              ) : isFailed ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <AlertCircle className="w-3 h-3" />
                  {isAr ? 'فشل الإنتاج' : 'Failed'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                  {isAr ? 'مسودة' : 'Draft'}
                </span>
              )}
            </div>

            {/* Created Date */}
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(project.createdAt)}
            </div>
          </div>

          {/* Title */}
          <Link
            href={`/${locale}/studio/${project.id}`}
            className="block font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors text-base line-clamp-1"
          >
            {project.title}
          </Link>

          {/* Ayah Reference */}
          <div className="text-xs text-amber-200/80 font-amiri flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
            {isAr ? project.ayahReferenceAr : project.ayahReferenceEn}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <Link
            href={`/${locale}/studio/${project.id}`}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-emerald-600 hover:text-white text-slate-200 text-xs font-semibold transition-all duration-200 text-center flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Film className="w-3.5 h-3.5" />
            {isAr ? 'فتح الاستوديو' : 'Open Studio'}
          </Link>

          {/* Quick Render Again */}
          {onRenderAgain && (
            <button
              onClick={() => onRenderAgain(project)}
              disabled={isProcessing}
              title={isAr ? 'إعادة التوليد' : 'Render Again'}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors disabled:opacity-40"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
            </button>
          )}

          {/* Download (if ready) */}
          {project.videoUrl && (
            <a
              href={project.videoUrl}
              download
              target="_blank"
              rel="noreferrer"
              title={isAr ? 'تحميل الفيديو' : 'Download Video'}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Delete Action */}
          {onDelete && (
            <button
              onClick={() => onDelete(project.id)}
              title={isAr ? 'حذف المشروع' : 'Delete Project'}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
