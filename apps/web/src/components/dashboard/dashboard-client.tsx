'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { AuthModal } from '@/components/auth/auth-modal';
import { ShareModal } from './share-modal';
import { TemplateCard } from '@/components/templates/template-card';
import { TemplatePickerModal } from '@/components/templates/template-picker-modal';
import { QURAN_MEDIA_TEMPLATES } from '@quran-media/media/templates';
import type { QuranMediaTemplate } from '@quran-media/media/templates';
import type { Locale } from '@quran-media/i18n';
import { getDictionary, formatNumber, formatDate, formatDuration } from '@quran-media/i18n';
import {
  FolderKanban,
  Film,
  Image as ImageIcon,
  Bookmark,
  BookOpen,
  Sparkles,
  User,
  Settings,
  Plus,
  Play,
  Download,
  Share2,
  Copy,
  Trash2,
  Edit3,
  RefreshCw,
  Search,
  HardDrive,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Save,
  Volume2,
} from 'lucide-react';

interface DashboardClientProps {
  locale: Locale;
}

type DashboardSection =
  | 'projects'
  | 'videos'
  | 'images'
  | 'saved_ayahs'
  | 'saved_stories'
  | 'templates'
  | 'profile'
  | 'settings';

export function DashboardClient({ locale }: DashboardClientProps) {
  const router = useRouter();
  const { user, status, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState<DashboardSection>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [shareModalState, setShareModalState] = useState<{ isOpen: boolean; title: string; projectId?: string }>({
    isOpen: false,
    title: '',
  });

  // Data states
  const [overview, setOverview] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [savedAyahs, setSavedAyahs] = useState<any[]>([]);
  const [savedStories, setSavedStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Form state
  const [profileName, setProfileName] = useState('');
  const [profileReciter, setProfileReciter] = useState(7);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const isAr = locale === 'ar';
  const dict = getDictionary(locale);

  // Fetch dashboard data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Overview stats
      const overRes = await fetch('/api/dashboard/overview');
      if (overRes.ok) {
        const overData = await overRes.json();
        setOverview(overData.stats);
      }

      // Projects
      const projRes = await fetch('/api/studio/projects');
      if (projRes.ok) {
        const projData = await projRes.json();
        setProjects(projData.data?.projects || []);
      }

      // Saved Ayahs
      const ayahRes = await fetch('/api/dashboard/saved-ayahs');
      if (ayahRes.ok) {
        const ayahData = await ayahRes.json();
        setSavedAyahs(ayahData.data?.ayahs || []);
      }

      // Saved Stories
      const storyRes = await fetch('/api/dashboard/saved-stories');
      if (storyRes.ok) {
        const storyData = await storyRes.json();
        setSavedStories(storyData.data?.stories || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileReciter(user.preferredReciter || 7);
    }
  }, [user]);

  // Actions
  const handleDuplicate = async (projectId: string) => {
    try {
      const res = await fetch('/api/dashboard/projects/duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch {}
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذا المشروع نهائياً؟' : 'Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/studio/projects/${projectId}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
      }
    } catch {}
  };

  const handleRegenerate = async (projectId: string) => {
    router.push(`/${locale}/studio/${projectId}?trigger=render`);
  };

  const handleDeleteSavedAyah = async (id: string) => {
    try {
      const res = await fetch(`/api/dashboard/saved-ayahs?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSavedAyahs((prev) => prev.filter((a) => a.id !== id));
      }
    } catch {}
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSaved(false);
    try {
      const res = await fetch('/api/dashboard/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileName,
          preferredReciter: profileReciter,
        }),
      });
      if (res.ok) {
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3000);
      }
    } finally {
      setProfileSaving(false);
    }
  };

  // Nav items configuration
  const navItems = [
    { id: 'projects' as const, label: isAr ? 'مشاريعي (Projects)' : 'My Projects', icon: FolderKanban, count: projects.length },
    { id: 'videos' as const, label: isAr ? 'فيديوهاتي المصيرة' : 'My Videos', icon: Film, count: projects.filter((p) => p.status === 'COMPLETED').length },
    { id: 'images' as const, label: isAr ? 'الصور والمشاهد' : 'My Images', icon: ImageIcon, count: projects.length * 3 },
    { id: 'saved_ayahs' as const, label: isAr ? 'الآيات المحفوظة' : 'Saved Ayahs', icon: Bookmark, count: savedAyahs.length },
    { id: 'saved_stories' as const, label: isAr ? 'القصص المفضلة' : 'Saved Stories', icon: BookOpen, count: savedStories.length },
    { id: 'templates' as const, label: isAr ? 'القوالب والنماذج' : 'Templates', icon: Sparkles, count: 18 },
    { id: 'profile' as const, label: isAr ? 'الملف الشخصي' : 'Profile', icon: User },
    { id: 'settings' as const, label: isAr ? 'الإعدادات والإنتاج' : 'Settings', icon: Settings },
  ];

  // Unauthenticated Banner
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-amber-500 flex items-center justify-center text-white text-3xl shadow-xl shadow-emerald-950/20">
          📖
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {isAr ? 'مرحباً بك في لوحة تحكم ميديا القرآن' : 'Welcome to Quran Media Dashboard'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {isAr
              ? 'يرجى تسجيل الدخول للوصول إلى مشاريعك الخاصة، الفيديوهات المصيرة، والمكتبة السحابية.'
              : 'Please sign in to access your private production workspace, rendered deliverables, and saved library.'}
          </p>
        </div>

        <button
          onClick={() => setAuthModalOpen(true)}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-bold text-sm shadow-xl shadow-emerald-950/30 transition-all transform hover:scale-105 cursor-pointer"
        >
          {isAr ? 'تسجيل الدخول / إنشاء حساب' : 'Sign In / Create Account'}
        </button>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          locale={locale}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Top Welcome & Quick Stats */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 border border-slate-800 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute top-0 end-0 -mt-8 -me-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-500 p-0.5 shadow-lg shadow-emerald-950/30">
              <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center text-white text-xl font-black">
                {user?.name ? user.name.charAt(0) : 'Q'}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight">{user?.name || (isAr ? 'صانع المحتوى' : 'Creator')}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {user?.role || 'PRO CREATOR'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/${locale}/studio`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'مشروع جديد' : 'New Project'}</span>
            </Link>
          </div>
        </div>

        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-8 relative z-10">
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>{isAr ? 'إجمالي المشاريع' : 'Total Projects'}</span>
              <FolderKanban className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl font-black text-white">{projects.length}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>{isAr ? 'الفيديوهات المكتملة' : 'Rendered Videos'}</span>
              <Film className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xl font-black text-white">{projects.filter((p) => p.status === 'COMPLETED').length}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>{isAr ? 'الآيات المحفوظة' : 'Saved Verses'}</span>
              <Bookmark className="w-4 h-4 text-teal-400" />
            </div>
            <p className="text-xl font-black text-white">{savedAyahs.length}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>{isAr ? 'المساحة السحابية' : 'Cloud Storage'}</span>
              <HardDrive className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-xl font-black text-white">
              {overview?.storageUsedMb || 128} <span className="text-xs font-normal text-slate-400">/ 10 GB</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-3xl shadow-sm h-fit">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {isAr ? 'المكتبة والإنتاج' : 'Library & Workspace'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isSelected ? 'bg-slate-950 text-amber-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* SECTION: MY PROJECTS */}
          {activeSection === 'projects' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    {isAr ? 'مشاريع الإنتاج القرآني' : 'Quran Production Projects'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isAr ? 'تحكم كامل بالمشاريع: تعديل، مضاعفة، تصيير ومشاركة' : 'Create, edit, duplicate, render and share your projects'}
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute start-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isAr ? 'بحث في المشاريع...' : 'Search projects...'}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl ps-9 pe-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                  <FolderKanban className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'لا توجد مشاريع حتى الآن' : 'No projects found'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    {isAr ? 'ابدأ بإنتاج أول فيديو قرآني سينمائي بدقة عالية' : 'Create your first cinematic Quran video project'}
                  </p>
                  <Link
                    href={`/${locale}/studio`}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isAr ? 'إنشاء مشروع جديد' : 'New Project'}</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects
                    .filter((p) => !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((project) => (
                      <div
                        key={project.id}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden p-5 space-y-4 hover:border-amber-500/50 transition-all shadow-sm group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                              {project.aspectRatio}
                            </span>
                            <h3 className="font-black text-sm text-slate-900 dark:text-white mt-1.5 line-clamp-1">
                              {project.title}
                            </h3>
                            <p className="text-xs text-slate-500 line-clamp-1">{project.ayahReferenceAr || project.description}</p>
                          </div>

                          <span
                            className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                              project.status === 'COMPLETED'
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                : project.status === 'PROCESSING' || project.status === 'RENDERING'
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 animate-pulse'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {project.status}
                          </span>
                        </div>

                        {/* Action Buttons Toolbar */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1 text-xs">
                          <div className="flex items-center gap-1">
                            <Link
                              href={`/${locale}/studio/${project.id}`}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-1.5 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-amber-500" />
                              <span>{isAr ? 'تعديل' : 'Edit'}</span>
                            </Link>

                            <button
                              onClick={() => handleDuplicate(project.id)}
                              title={isAr ? 'مضاعفة المشروع' : 'Duplicate Project'}
                              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleRegenerate(project.id)}
                              title={isAr ? 'إعادة التصيير' : 'Regenerate Video'}
                              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-emerald-600 dark:text-emerald-400 transition-colors cursor-pointer"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() =>
                                setShareModalState({
                                  isOpen: true,
                                  title: project.title,
                                  projectId: project.id,
                                })
                              }
                              title={isAr ? 'مشاركة' : 'Share'}
                              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            title={isAr ? 'حذف' : 'Delete'}
                            className="p-1.5 rounded-xl hover:bg-rose-500/10 text-rose-500 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* SECTION: MY VIDEOS */}
          {activeSection === 'videos' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {isAr ? 'مكتبة الفيديوهات المصيرة' : 'Rendered Videos Library'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isAr ? 'تحميل ومشاهدة الفيديوهات بجودة MP4 و WebM عالية الدقة' : 'Download and stream your rendered Quran video deliverables'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects
                  .filter((p) => p.status === 'COMPLETED')
                  .map((project) => (
                    <div
                      key={project.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm"
                    >
                      <div className="relative aspect-video bg-slate-950 flex items-center justify-center">
                        {project.videoUrl ? (
                          <video
                            src={project.videoUrl}
                            poster={project.thumbnailUrl}
                            controls
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={project.thumbnailUrl || 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&auto=format&fit=crop&q=80'}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <span className="absolute bottom-2 end-2 px-2 py-0.5 rounded-md bg-black/75 text-white text-[10px] font-bold">
                          {project.durationSeconds}s • {project.aspectRatio}
                        </span>
                      </div>

                      <div className="p-4 space-y-3">
                        <h3 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{project.title}</h3>
                        <div className="flex items-center justify-between gap-2">
                          <a
                            href={project.videoUrl || '#'}
                            download
                            className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{isAr ? 'تحميل MP4' : 'Download MP4'}</span>
                          </a>
                          <button
                            onClick={() =>
                              setShareModalState({
                                isOpen: true,
                                title: project.title,
                                projectId: project.id,
                              })
                            }
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* SECTION: MY IMAGES */}
          {activeSection === 'images' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {isAr ? 'معرض المشاهد والزخارف البصرية' : 'Visual Assets & Calligraphy Gallery'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isAr ? 'خلفيات ومشاهد الذكاء الاصطناعي والإطارات الزخرفية' : 'AI backgrounds, geometric arabesques, and high-res calligraphy frames'}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80',
                ].map((imgUrl, i) => (
                  <div key={i} className="group relative rounded-2xl overflow-hidden aspect-video bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <img src={imgUrl} alt="Asset" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 justify-between">
                      <span className="text-[10px] text-white font-bold">Asset #{i + 1}</span>
                      <a href={imgUrl} target="_blank" rel="noreferrer" className="p-1 rounded-lg bg-white/20 text-white hover:bg-white/40">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: SAVED AYAHS */}
          {activeSection === 'saved_ayahs' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {isAr ? 'الآيات القرآنية المحفوظة' : 'Saved Quranic Verses'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isAr ? 'قائمتك الخاصة من الآيات للتأمل والتدبر أو إنتاج فيديوهات جديدة عنها' : 'Your private collection of bookmarked verses for reflection and quick media production'}
                </p>
              </div>

              <div className="space-y-3">
                {savedAyahs.map((ayah) => (
                  <div
                    key={ayah.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {ayah.surahNameAr} • آية {ayah.ayahNumber}
                      </span>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/${locale}/create/story?surah=${ayah.surahNumber}&ayah=${ayah.ayahNumber}`}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{isAr ? 'إنتاج قصة عن هذه الآية' : 'Create Story'}</span>
                        </Link>
                        <button
                          onClick={() => handleDeleteSavedAyah(ayah.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="font-arabic text-lg sm:text-xl leading-loose text-slate-900 dark:text-white text-end">
                      {ayah.textUthmani}
                    </p>
                    <p className="text-xs text-slate-500 italic">{ayah.translationText}</p>
                    {ayah.notes && <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-500/5 p-2 rounded-xl">{ayah.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: SAVED STORIES */}
          {activeSection === 'saved_stories' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {isAr ? 'القصص القرآنية المفضلة' : 'Bookmarked Quran Stories'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isAr ? 'القصص المحفوظة من مكتبة تدبر قصص القرآن' : 'Stories you saved from the Quran Stories Explore library'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedStories.map((story) => (
                  <div
                    key={story.slug}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden p-4 space-y-3 shadow-sm hover:border-amber-500/50 transition-all"
                  >
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950">
                      <img src={story.thumbnailUrl} alt={story.titleAr} className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 end-2 px-2 py-0.5 rounded-md bg-black/75 text-white text-[10px] font-bold">
                        {story.duration}
                      </span>
                    </div>

                    <h3 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                      {isAr ? story.titleAr : story.titleEn}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {isAr ? story.descriptionAr : story.descriptionEn}
                    </p>

                    <div className="pt-2 flex items-center justify-between">
                      <Link
                        href={`/${locale}/stories/${story.slug}`}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>{isAr ? 'مشاهدة القصة' : 'Watch Story'}</span>
                      </Link>

                      <Link
                        href={`/${locale}/create/story?surah=${story.surahNumber}&ayah=${story.ayahStart}`}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                      >
                        {isAr ? 'اصنع نسختك' : 'Make Version'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: TEMPLATES */}
          {activeSection === 'templates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    {isAr ? 'قوالب الهوية والإنتاج (١٨ قالباً)' : 'Quran Media Templates (18 Presets)'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isAr ? 'قوالب مصممة خصيصاً لمختلف المنصات: ريلز، تيك توك، يوتيوب وبث تلفزيوني' : 'Production-grade templates for Reels, TikTok, YouTube Shorts & 4K widescreen'}
                  </p>
                </div>

                <button
                  onClick={() => setTemplatePickerOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAr ? 'استعراض النماذج' : 'Browse Modal'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {QURAN_MEDIA_TEMPLATES.slice(0, 6).map((tpl) => (
                  <TemplateCard
                    key={tpl.template_id}
                    template={tpl}
                    locale={locale}
                    onSelect={() => router.push(`/${locale}/studio?template=${tpl.template_id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* SECTION: PROFILE */}
          {activeSection === 'profile' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {isAr ? 'إعدادات الحساب والملف الشخصي' : 'Account & Profile Settings'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isAr ? 'تخصيص معلوماتك وتفضيلات القارئ المفضل والأبعاد الافتراضية' : 'Manage your creator details, preferred reciter and default export ratios'}
                </p>
              </div>

              {profileSaved && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isAr ? 'تم حفظ التعديلات بنجاح' : 'Profile updated successfully'}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {isAr ? 'اسم صانع المحتوى' : 'Creator Display Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 select-none cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {isAr ? 'القارئ الافتراضي المفضل' : 'Default Preferred Reciter'}
                  </label>
                  <select
                    value={profileReciter}
                    onChange={(e) => setProfileReciter(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value={7}>مشاري راشد العفاسي (Mishari Rashid Alafasy)</option>
                    <option value={2}>عبد الباسط عبد الصمد (AbdulBaset AbdulSamad - Murattal)</option>
                    <option value={3}>عبد الرحمن السديس (Abdur-Rahman As-Sudais)</option>
                    <option value={4}>أبو بكر الشاطري (Abu Bakr Al-Shatri)</option>
                    <option value={6}>محمود خليل الحصري (Mahmoud Khalil Al-Husary)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{profileSaving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ التغييرات' : 'Save Changes')}</span>
                </button>
              </form>
            </div>
          )}

          {/* SECTION: SETTINGS */}
          {activeSection === 'settings' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {isAr ? 'إعدادات الجودة ومحرك التصيير' : 'Rendering Engine & Quality Settings'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isAr ? 'ضبط محرك FFmpeg وجودة الفيديو والتوافق الشرعي' : 'FFmpeg rendering parameters, video resolution presets & sacred guardrails'}
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {isAr ? 'دقة التصيير الافتراضية' : 'Default Video Resolution'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {isAr ? '1080p (Full HD) مناسب للإنستغرام وتيك توك ويوفر وقت المعالجة' : '1080p Full HD optimized for Reels and TikTok'}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    1080p @ 30fps
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {isAr ? 'التحقق الشرعي التلقائي (Islamic Guardrails)' : 'Automated Islamic Guardrails'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {isAr ? 'منع تجسيد الذات الإلهية أو الأنبياء ومطابقة الرسم العثماني' : 'Strict non-figurative verification and verified Tafsir matching'}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    ACTIVE (مفعّل)
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400">
                      {isAr ? 'تسجيل الخروج من الحساب' : 'Sign Out of Account'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {isAr ? 'إنهاء الجلسة الحالية على هذا المتصفح' : 'End active session on this device'}
                    </p>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isAr ? 'تسجيل الخروج' : 'Sign Out'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ShareModal
        isOpen={shareModalState.isOpen}
        onClose={() => setShareModalState({ isOpen: false, title: '' })}
        title={shareModalState.title}
        projectId={shareModalState.projectId}
        locale={locale}
      />

      <TemplatePickerModal
        isOpen={templatePickerOpen}
        onClose={() => setTemplatePickerOpen(false)}
        onSelectTemplate={(templateId) => {
          setTemplatePickerOpen(false);
          router.push(`/${locale}/studio?template=${templateId}`);
        }}
        locale={locale}
      />
    </div>
  );
}
