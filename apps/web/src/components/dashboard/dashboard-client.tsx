'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@quran-media/i18n';
import {
  Film,
  Sparkles,
  Layers,
  FolderKanban,
  HardDrive,
  Activity,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Plus,
  ArrowUpRight,
  Download,
  Share2,
  Play,
  BookOpen,
} from 'lucide-react';

interface GenerationJobItem {
  id: string;
  titleAr: string;
  titleEn: string;
  type: 'VIDEO' | 'IMAGE' | 'STORY';
  surahNumber: number;
  ayahStart: number;
  ayahEnd: number;
  aspectRatio: string;
  status: 'QUEUED' | 'PROCESSING' | 'SYNTHESIZING' | 'COMPLETED' | 'FAILED';
  progress: number;
  createdAt: string;
  renderTime: string;
}

const DEMO_GENERATIONS: GenerationJobItem[] = [
  {
    id: 'gen-883921',
    titleAr: 'سورة البقرة [2:255] - آية الكرسي',
    titleEn: 'Surah Al-Baqarah [2:255] - Ayat Al-Kursi',
    type: 'VIDEO',
    surahNumber: 2,
    ayahStart: 255,
    ayahEnd: 255,
    aspectRatio: '9:16',
    status: 'COMPLETED',
    progress: 100,
    createdAt: '2 mins ago',
    renderTime: '18s',
  },
  {
    id: 'gen-883920',
    titleAr: 'سورة الرحمن [55:1-13] - النعم الإلهية',
    titleEn: 'Surah Ar-Rahman [55:1-13]',
    type: 'VIDEO',
    surahNumber: 55,
    ayahStart: 1,
    ayahEnd: 13,
    aspectRatio: '16:9',
    status: 'SYNTHESIZING',
    progress: 82,
    createdAt: '5 mins ago',
    renderTime: 'Running...',
  },
  {
    id: 'gen-883919',
    titleAr: 'سورة الكهف [18:10-14] - فتية الكهف',
    titleEn: 'Surah Al-Kahf [18:10-14]',
    type: 'STORY',
    surahNumber: 18,
    ayahStart: 10,
    ayahEnd: 14,
    aspectRatio: '1:1',
    status: 'COMPLETED',
    progress: 100,
    createdAt: '1 hour ago',
    renderTime: '6s',
  },
  {
    id: 'gen-883918',
    titleAr: 'سورة الضحى [93:1-8] - سكينة الفجر',
    titleEn: 'Surah Ad-Duha [93:1-8]',
    type: 'IMAGE',
    surahNumber: 93,
    ayahStart: 1,
    ayahEnd: 8,
    aspectRatio: '9:16',
    status: 'COMPLETED',
    progress: 100,
    createdAt: '3 hours ago',
    renderTime: '4s',
  },
];

export function DashboardClient({ locale }: { locale: Locale }) {
  const isAr = locale === 'ar';
  const [generations, setGenerations] = useState<GenerationJobItem[]>(DEMO_GENERATIONS);

  const getStatusBadge = (status: GenerationJobItem['status']) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isAr ? 'اكتمل بنجاح' : 'Completed'}</span>
          </span>
        );
      case 'SYNTHESIZING':
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[11px] border border-amber-500/20">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>{isAr ? 'جاري المعالجة' : 'Rendering'}</span>
          </span>
        );
      case 'QUEUED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-400 font-bold text-[11px] border border-slate-500/20">
            <Clock className="w-3.5 h-3.5" />
            <span>{isAr ? 'في الانتظار' : 'Queued'}</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-500 font-bold text-[11px] border border-rose-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{isAr ? 'تعذر' : 'Failed'}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-10 pb-20">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
            <Activity className="w-3.5 h-3.5" />
            <span>{isAr ? 'لوحة تحكم الإنتاج والاستوديو' : 'Creator Studio Dashboard'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isAr ? 'المشاريع وسجل التوليد' : 'Projects & Generation Queue'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isAr
              ? 'متابعة مهام التوليد المباشرة، إدارة الوسائط المخزنة، وتشغيل محرك الإنتاج.'
              : 'Monitor background video rendering jobs, manage cloud media assets, and trigger batch generations.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/projects`}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
          >
            {isAr ? 'المجلدات والمشاريع' : 'Project Folders'}
          </Link>

          <Link
            href={`/${locale}/create`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'توليد فيديو جديد' : 'New Generation'}</span>
          </Link>
        </div>
      </div>

      {/* Analytics Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-md space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">{isAr ? 'إجمالي المقاطع' : 'Total Videos'}</span>
            <Film className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">128</p>
          <span className="text-[11px] text-emerald-500 font-semibold">+14 this week</span>
        </div>

        <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-md space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">{isAr ? 'القصص والتأملات' : 'Stories Created'}</span>
            <BookOpen className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">46</p>
          <span className="text-[11px] text-emerald-500 font-semibold">+5 this week</span>
        </div>

        <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-md space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">{isAr ? 'مساحة التخزين S3' : 'Cloud Storage'}</span>
            <HardDrive className="w-4 h-4 text-teal-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">4.8 GB</p>
          <span className="text-[11px] text-slate-400">of 50 GB allocated</span>
        </div>

        <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-md space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">{isAr ? 'حالة محرك المعالجة' : 'Worker Cluster'}</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <span>Optimal</span>
          </p>
          <span className="text-[11px] text-slate-400">BullMQ Redis Queue Active</span>
        </div>
      </div>

      {/* Recent Generations Queue & History Table */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {isAr ? 'أحدث مهام المعالجة والتوليد' : 'Recent Generation Jobs'}
          </h2>
          <span className="text-xs text-slate-400">Auto-refreshing live</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                <th className="pb-3 text-start">{isAr ? 'الآية / السورة' : 'Passage & Title'}</th>
                <th className="pb-3 text-start">{isAr ? 'النوع والأبعاد' : 'Format'}</th>
                <th className="pb-3 text-start">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="pb-3 text-start">{isAr ? 'زمن الرندر' : 'Render Time'}</th>
                <th className="pb-3 text-end">{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {generations.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-900 dark:text-white block text-sm">
                        {isAr ? job.titleAr : job.titleEn}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{job.id} • {job.createdAt}</span>
                    </div>
                  </td>

                  <td className="py-4">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
                      {job.type} • {job.aspectRatio}
                    </span>
                  </td>

                  <td className="py-4">
                    {getStatusBadge(job.status)}
                  </td>

                  <td className="py-4 font-mono text-slate-500">
                    {job.renderTime}
                  </td>

                  <td className="py-4 text-end">
                    <div className="flex items-center justify-end gap-2">
                      {job.status === 'COMPLETED' ? (
                        <>
                          <button
                            onClick={() => alert(isAr ? 'جاري التحميل...' : 'Downloading MP4...')}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                            title={isAr ? 'تحميل' : 'Download'}
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <Link
                            href={`/${locale}/create?surah=${job.surahNumber}`}
                            className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
                            title={isAr ? 'تعديل' : 'Remix'}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </Link>
                        </>
                      ) : (
                        <span className="text-[11px] text-amber-500 font-mono">{job.progress}%</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
