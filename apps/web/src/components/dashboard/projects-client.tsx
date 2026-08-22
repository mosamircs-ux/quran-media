'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@quran-media/i18n';
import {
  FolderKanban,
  Plus,
  Film,
  BookOpen,
  Image as ImageIcon,
  Sparkles,
  MoreVertical,
  ArrowUpRight,
  HardDrive,
  Calendar,
  Clock,
} from 'lucide-react';

interface ProjectItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  mediaCount: number;
  updatedAt: string;
  color: string;
}

const DEMO_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    titleAr: 'سلسلة تأملات رمضان اليومية',
    titleEn: 'Daily Ramadan Quran Reflections',
    descAr: 'مقاطع فيديو يومية قصيرة بتنسيق 9:16 للنشر في منصات تيك توك وريلز.',
    descEn: '30 vertical 9:16 video shorts scheduled for daily social media distribution.',
    mediaCount: 30,
    updatedAt: 'Yesterday',
    color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30',
  },
  {
    id: 'proj-2',
    titleAr: 'سلسلة سورة الكهف لنور الجمعة',
    titleEn: 'Surah Al-Kahf Friday Series',
    descAr: 'مجموعة مقاطع وقصص مرئية لآيات سورة الكهف الأربع الكبرى.',
    descEn: 'A cinematic series on the four core parables in Surah Al-Kahf.',
    mediaCount: 8,
    updatedAt: '3 days ago',
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30',
  },
  {
    id: 'proj-3',
    titleAr: 'أدعية الأنبياء في الشدائد',
    titleEn: 'Prophetic Invocations in Trial',
    descAr: 'تصاميم بوسترات ومقاطع لأدعية يونس، أيوب، زكريا، وإبراهيم عليهم السلام.',
    descEn: 'Artistic posters and 1:1 square media featuring iconic Quranic supplications.',
    mediaCount: 14,
    updatedAt: '1 week ago',
    color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30',
  },
];

export function ProjectsClient({ locale }: { locale: Locale }) {
  const isAr = locale === 'ar';
  const [projects, setProjects] = useState<ProjectItem[]>(DEMO_PROJECTS);

  return (
    <div className="space-y-10 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>{isAr ? 'مجلدات المشاريع والمجموعات' : 'Project Folders & Series'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isAr ? 'مشاريع الإنتاج والسلاسل' : 'Media Project Workspace'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isAr
              ? 'تنظيم مقاطع الفيديو والتصاميم في سلاسل ومجلدات مخصصة لجدولة النشر وإدارة المحتوى.'
              : 'Organize your generated media assets into organized project folders and social series.'}
          </p>
        </div>

        <button
          onClick={() => alert(isAr ? 'إنشاء مجلد مشروع جديد...' : 'Creating new project folder...')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'مشروع جديد' : 'New Project'}</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className={`p-6 sm:p-7 rounded-3xl border bg-gradient-to-br ${proj.color} bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-lg space-y-5 flex flex-col justify-between`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 text-amber-500 shadow-sm border border-slate-200 dark:border-slate-700">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-500 bg-white/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                  {proj.mediaCount} {isAr ? 'وسائط' : 'assets'}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {isAr ? proj.titleAr : proj.titleEn}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isAr ? proj.descAr : proj.descEn}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{proj.updatedAt}</span>
              </span>

              <Link
                href={`/${locale}/create`}
                className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 hover:underline"
              >
                <span>{isAr ? 'فتح الاستوديو' : 'Open'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
