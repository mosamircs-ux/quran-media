'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Film,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Layers,
  CheckCircle2,
  Clock,
  RotateCw,
  AlertCircle,
  FileText,
  Video,
} from 'lucide-react';
import { ProjectCard, type StudioProjectItem } from './project-card';
import type { Locale } from '@quran-media/i18n';

interface StudioDashboardClientProps {
  locale: Locale;
}

type TabType = 'all' | 'drafts' | 'processing' | 'completed' | 'failed';

const SURAH_LIST = [
  { id: 1, nameAr: 'الفاتحة', nameEn: 'Al-Fatihah', versesCount: 7 },
  { id: 2, nameAr: 'البقرة', nameEn: 'Al-Baqarah', versesCount: 286 },
  { id: 3, nameAr: 'آل عمران', nameEn: "Ali 'Imran", versesCount: 200 },
  { id: 18, nameAr: 'الكهف', nameEn: 'Al-Kahf', versesCount: 110 },
  { id: 36, nameAr: 'يس', nameEn: 'Ya-Sin', versesCount: 83 },
  { id: 55, nameAr: 'الرحمن', nameEn: 'Ar-Rahman', versesCount: 78 },
  { id: 56, nameAr: 'الواقعة', nameEn: 'Al-Waqi\'ah', versesCount: 96 },
  { id: 67, nameAr: 'الملك', nameEn: 'Al-Mulk', versesCount: 30 },
  { id: 112, nameAr: 'الإخلاص', nameEn: 'Al-Ikhlas', versesCount: 4 },
  { id: 113, nameAr: 'الفلق', nameEn: 'Al-Falaq', versesCount: 5 },
  { id: 114, nameAr: 'الناس', nameEn: 'An-Nas', versesCount: 6 },
];

export function StudioDashboardClient({ locale }: StudioDashboardClientProps) {
  const router = useRouter();
  const isAr = locale === 'ar';
  const [, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [aspectRatioFilter, setAspectRatioFilter] = useState<string>('all');
  const [projects, setProjects] = useState<StudioProjectItem[]>([]);
  const [counts, setCounts] = useState({
    all: 0,
    drafts: 0,
    processing: 0,
    completed: 0,
    failed: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // New Project Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [ayahStart, setAyahStart] = useState(1);
  const [ayahEnd, setAyahEnd] = useState(7);
  const [newAspectRatio, setNewAspectRatio] = useState<'9:16' | '16:9' | '1:1' | '4:5'>('9:16');
  const [presetTheme, setPresetTheme] = useState('cinematic_nature');

  // Fetch Projects from API
  const fetchProjects = async () => {
    try {
      const res = await fetch(`/api/studio/projects?filter=${activeTab}&q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setProjects(json.data.projects || []);
          if (json.data.counts) {
            setCounts(json.data.counts);
          }
        }
      }
    } catch {
      // Fallback empty
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [activeTab, searchQuery]);

  // Real-time SSE polling for any active processing projects
  useEffect(() => {
    const hasProcessing = projects.some((p) => p.status === 'PROCESSING' || p.status === 'QUEUED');
    if (!hasProcessing) return;

    const interval = setInterval(() => {
      fetchProjects();
    }, 2500);

    return () => clearInterval(interval);
  }, [projects]);

  // Handle Project Creation
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    const surahObj = SURAH_LIST.find((s) => s.id === selectedSurah) || SURAH_LIST[0]!;
    const defaultTitle = isAr
      ? `إنتاج سورة ${surahObj.nameAr} (${ayahStart}-${ayahEnd})`
      : `Surah ${surahObj.nameEn} (${ayahStart}-${ayahEnd}) Production`;

    try {
      const res = await fetch('/api/studio/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim() || defaultTitle,
          surahNumber: selectedSurah,
          ayahStart,
          ayahEnd,
          aspectRatio: newAspectRatio,
          templatePreset: presetTheme,
          locale,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.projectId) {
          setIsModalOpen(false);
          startTransition(() => {
            router.push(`/${locale}/studio/${json.data.projectId}`);
          });
          return;
        }
      }
    } catch {
      // Handle error
    } finally {
      setIsCreating(false);
    }
  };

  // Handle Delete
  const handleDeleteProject = async (id: string) => {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذا المشروع؟' : 'Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await fetch(`/api/studio/projects/${id}`, { method: 'DELETE' });
      setProjects((prev) => prev.filter((p) => p.id !== id));
      fetchProjects();
    } catch {}
  };

  // Handle Quick Re-render
  const handleRenderAgain = async (project: StudioProjectItem) => {
    try {
      await fetch(`/api/studio/projects/${project.id}/render`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: project.id,
          title: project.title,
          aspectRatio: project.aspectRatio,
          scenes: [
            {
              duration: 4,
              verse: {
                surahNumber: project.surahNumber,
                ayahNumber: project.ayahStart,
                textUthmani: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
              },
            },
          ],
        }),
      });
      fetchProjects();
    } catch {}
  };

  const filteredProjects = projects.filter((p) => {
    if (aspectRatioFilter !== 'all' && p.aspectRatio !== aspectRatioFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/70 border border-slate-800/80 p-8 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              {isAr ? 'استوديو إنتاج الميديا القرآنية' : 'Quran Media Generation Studio'}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              {isAr ? 'لوحة تحكم الإنتاج المرئي' : 'Media Generation Studio'}
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              {isAr
                ? 'أنشئ وخصص وأدر مشاريع التلاوات والقصص القرآنية المرئية بأعلى دقة ومعالجة متزامنة في الخلفية.'
                : 'Create, customize, and manage cinematic Quranic recitations and stories with high-DPI rendering and real-time live preview.'}
            </p>
          </div>

          {/* New Production Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="self-start md:self-auto py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2.5"
          >
            <Plus className="w-5 h-5" />
            <span>{isAr ? 'إنتاج فيديو جديد' : 'New Production'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs & Search Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isAr ? 'جميع المشاريع' : 'All Projects'}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-950/40">{counts.all}</span>
          </button>

          <button
            onClick={() => setActiveTab('drafts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'drafts'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isAr ? 'المسودات' : 'Drafts'}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-950/40">{counts.drafts}</span>
          </button>

          <button
            onClick={() => setActiveTab('processing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'processing'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${counts.processing > 0 ? 'animate-spin text-amber-400' : ''}`} />
            <span>{isAr ? 'قيد التوليد' : 'Processing'}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-950/40">{counts.processing}</span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'completed'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isAr ? 'مكتمل' : 'Completed'}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-950/40">{counts.completed}</span>
          </button>

          <button
            onClick={() => setActiveTab('failed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'failed'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{isAr ? 'فاشل' : 'Failed'}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-950/40">{counts.failed}</span>
          </button>
        </div>

        {/* Search & Aspect Ratio Filter */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 left-3" />
            <input
              type="text"
              placeholder={isAr ? 'ابحث في المشاريع...' : 'Search projects...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Aspect Ratio Filter */}
          <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 p-1 rounded-xl">
            {['all', '9:16', '16:9', '1:1', '4:5'].map((ratio) => (
              <button
                key={ratio}
                onClick={() => setAspectRatioFilter(ratio)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  aspectRatioFilter === ratio
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {ratio === 'all' ? (isAr ? 'الكل' : 'All') : ratio}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Project Grid / State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-slate-900/50 border border-slate-800 h-80 animate-pulse flex flex-col justify-between p-6"
            >
              <div className="w-full h-40 bg-slate-800/60 rounded-xl" />
              <div className="space-y-2">
                <div className="w-2/3 h-4 bg-slate-800/60 rounded" />
                <div className="w-1/3 h-3 bg-slate-800/40 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              locale={locale}
              onDelete={handleDeleteProject}
              onRenderAgain={handleRenderAgain}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-slate-800 p-12 text-center space-y-4 max-w-lg mx-auto bg-slate-900/30">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
            <Film className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-200">
              {isAr ? 'لا توجد مشاريع في هذا القسم' : 'No projects found'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr
                ? 'ابدأ بإنشاء إنتاج فيديو قرآني مرئي جديد الآن.'
                : 'Get started by creating a new Quran video production.'}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إنشاء مشروع جديد' : 'Create New Project'}</span>
          </button>
        </div>
      )}

      {/* New Project Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Video className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-100">
                  {isAr ? 'بدء إنتاج قرآني جديد' : 'New Quran Media Production'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {isAr ? 'عنوان المشروع' : 'Project Title'}
                </label>
                <input
                  type="text"
                  placeholder={isAr ? 'مثال: سورة الرحمن تلاوة خاشعة' : 'e.g. Surah Ar-Rahman Cinematic Visuals'}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Surah Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {isAr ? 'السورة' : 'Surah'}
                  </label>
                  <select
                    value={selectedSurah}
                    onChange={(e) => setSelectedSurah(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                  >
                    {SURAH_LIST.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.id}. {isAr ? s.nameAr : s.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {isAr ? 'من الآية' : 'From Verse'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={ayahStart}
                    onChange={(e) => setAyahStart(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {isAr ? 'إلى الآية' : 'To Verse'}
                  </label>
                  <input
                    type="number"
                    min={ayahStart}
                    value={ayahEnd}
                    onChange={(e) => setAyahEnd(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {isAr ? 'الأبعاد والأبعاد الموجهة' : 'Aspect Ratio'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: '9:16', label: '9:16', desc: 'Reels / Shorts' },
                    { id: '16:9', label: '16:9', desc: 'YouTube' },
                    { id: '1:1', label: '1:1', desc: 'Square' },
                    { id: '4:5', label: '4:5', desc: 'Portrait' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setNewAspectRatio(item.id as any)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        newAspectRatio === item.id
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs">{item.label}</div>
                      <div className="text-[10px] text-slate-500">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preset Visual Theme */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {isAr ? 'النمط البصري المبدئي' : 'Visual Style Preset'}
                </label>
                <select
                  value={presetTheme}
                  onChange={(e) => setPresetTheme(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="cinematic_nature">{isAr ? 'طبيعة سينمائية مهيبة' : 'Cinematic Nature & Landscapes'}</option>
                  <option value="celestial_cosmos">{isAr ? 'فضاء وكون وأفلاك' : 'Celestial Cosmic & Night Sky'}</option>
                  <option value="islamic_golden">{isAr ? 'زخارف إسلامية ذهبية' : 'Islamic Golden Arches & Geometry'}</option>
                  <option value="desert_reflection">{isAr ? 'صحراء وكثبان هادئة' : 'Calm Desert Dunes'}</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{isAr ? 'جاري الإنشاء...' : 'Creating...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isAr ? 'إنشاء وفتح الاستوديو' : 'Create & Open Studio'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
