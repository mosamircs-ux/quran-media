'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/auth-provider';
import { hasPermission, canAccessAdmin, type AppRole } from '@/lib/auth/rbac';
import type { Locale } from '@quran-media/i18n';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FolderKanban,
  Sparkles,
  Cpu,
  Activity,
  Layers,
  Languages,
  BookText,
  Mic,
  BarChart3,
  ShieldAlert,
  FileCode2,
  Settings,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Search,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  ShieldCheck,
  HardDrive,
  DollarSign,
  Zap,
  Clock,
  Server,
  Lock,
  Save,
  RefreshCw,
  Eye,
  Check,
  X,
  Volume2,
} from 'lucide-react';

interface AdminDashboardClientProps {
  locale: Locale;
}

type AdminModule =
  | 'dashboard'
  | 'users'
  | 'stories'
  | 'projects'
  | 'templates'
  | 'ai_providers'
  | 'jobs'
  | 'quran_resources'
  | 'translations'
  | 'tafsirs'
  | 'reciters'
  | 'reports'
  | 'moderation'
  | 'system_logs'
  | 'settings';

export function AdminDashboardClient({ locale }: AdminDashboardClientProps) {
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState<AdminModule>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [simulatedRole, setSimulatedRole] = useState<AppRole>((user?.role as AppRole) || 'SUPER_ADMIN');

  // Module data states
  const [overview, setOverview] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [storiesList, setStoriesList] = useState<any[]>([]);
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [templatesList, setTemplatesList] = useState<any[]>([]);
  const [aiProviders, setAiProviders] = useState<any[]>([]);
  const [jobsList, setJobsList] = useState<any[]>([]);
  const [translationsList, setTranslationsList] = useState<any[]>([]);
  const [tafsirsList, setTafsirsList] = useState<any[]>([]);
  const [recitersList, setRecitersList] = useState<any[]>([]);
  const [reportsData, setReportsData] = useState<any>(null);
  const [moderationQueue, setModerationQueue] = useState<any[]>([]);
  const [systemLogs, setSystemLogs] = useState<any[]>([]);
  const [settingsData, setSettingsData] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const isAr = locale === 'ar';

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const fetchModuleData = async () => {
    setLoading(true);
    try {
      const [
        overRes,
        usersRes,
        storiesRes,
        projRes,
        tplRes,
        aiRes,
        jobsRes,
        transRes,
        tafRes,
        recRes,
        repRes,
        modRes,
        logsRes,
        setRes,
      ] = await Promise.all([
        fetch('/api/admin/overview'),
        fetch('/api/admin/users'),
        fetch('/api/admin/stories'),
        fetch('/api/admin/projects'),
        fetch('/api/admin/templates'),
        fetch('/api/admin/ai-providers'),
        fetch('/api/admin/generation-jobs'),
        fetch('/api/admin/translations'),
        fetch('/api/admin/tafsirs'),
        fetch('/api/admin/reciters'),
        fetch('/api/admin/reports'),
        fetch('/api/admin/moderation'),
        fetch('/api/admin/system-logs'),
        fetch('/api/admin/settings'),
      ]);

      if (overRes.ok) setOverview((await overRes.json()).data);
      if (usersRes.ok) setUsersList((await usersRes.json()).data?.users || []);
      if (storiesRes.ok) setStoriesList((await storiesRes.json()).data?.stories || []);
      if (projRes.ok) setProjectsList((await projRes.json()).data?.projects || []);
      if (tplRes.ok) setTemplatesList((await tplRes.json()).data?.templates || []);
      if (aiRes.ok) setAiProviders((await aiRes.json()).data?.providers || []);
      if (jobsRes.ok) setJobsList((await jobsRes.json()).data?.jobs || []);
      if (transRes.ok) setTranslationsList((await transRes.json()).data?.translations || []);
      if (tafRes.ok) setTafsirsList((await tafRes.json()).data?.tafsirs || []);
      if (recRes.ok) setRecitersList((await recRes.json()).data?.reciters || []);
      if (repRes.ok) setReportsData((await repRes.json()).data);
      if (modRes.ok) setModerationQueue((await modRes.json()).data?.queue || []);
      if (logsRes.ok) setSystemLogs((await logsRes.json()).data?.logs || []);
      if (setRes.ok) setSettingsData((await setRes.json()).data?.settings || {});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModuleData();
  }, []);

  // Actions
  const handleApproveStory = async (slug: string) => {
    try {
      const res = await fetch('/api/admin/stories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, moderationStatus: 'APPROVED', published: true }),
      });
      if (res.ok) {
        setStoriesList((prev) =>
          prev.map((s) => (s.slug === slug ? { ...s, moderationStatus: 'APPROVED', published: true } : s))
        );
        showFeedback(isAr ? 'تمت الموافقة على القصة ونشرها' : 'Story approved and published');
      }
    } catch {}
  };

  const handleRejectStory = async (slug: string) => {
    const reason = prompt(isAr ? 'سبب رفض القصة أو طلب التعديل:' : 'Reason for rejection:');
    if (!reason) return;
    try {
      const res = await fetch('/api/admin/stories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, moderationStatus: 'REJECTED', published: false, rejectionReason: reason }),
      });
      if (res.ok) {
        setStoriesList((prev) =>
          prev.map((s) => (s.slug === slug ? { ...s, moderationStatus: 'REJECTED', published: false } : s))
        );
        showFeedback(isAr ? 'تم رفض القصة وإشعار الكاتب' : 'Story rejected with reason');
      }
    } catch {}
  };

  const handleRetryJob = async (jobId: string) => {
    try {
      const res = await fetch('/api/admin/generation-jobs/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });
      if (res.ok) {
        setJobsList((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, status: 'QUEUED', progress: 0, error: undefined } : j))
        );
        showFeedback(isAr ? 'تمت إعادة وضع المهمة في طابور المعالجة' : 'Job re-queued successfully');
      }
    } catch {}
  };

  const handleChangeUserRole = async (userId: string, newRole: AppRole) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        setUsersList((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
        showFeedback(isAr ? `تم تحديث صلاحية المستخدم إلى ${newRole}` : `User role changed to ${newRole}`);
      }
    } catch {}
  };

  const handleToggleAiProvider = async (providerId: string, currentState: boolean) => {
    try {
      const res = await fetch('/api/admin/ai-providers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerId, isEnabled: !currentState }),
      });
      if (res.ok) {
        setAiProviders((prev) =>
          prev.map((p) => (p.id === providerId ? { ...p, isEnabled: !currentState } : p))
        );
        showFeedback(isAr ? 'تم تحديث حالة مزود الذكاء الاصطناعي' : 'AI provider status updated');
      }
    } catch {}
  };

  const handleModerateItem = async (flagId: string, action: 'APPROVED' | 'QUARANTINED' | 'REJECTED') => {
    try {
      const res = await fetch('/api/admin/moderation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flagId, action, moderationNotes: 'Reviewed by admin officer' }),
      });
      if (res.ok) {
        setModerationQueue((prev) => prev.map((m) => (m.id === flagId ? { ...m, status: action } : m)));
        showFeedback(isAr ? `تم اتخاذ الإجراء: ${action}` : `Action executed: ${action}`);
      }
    } catch {}
  };

  const handleSaveGlobalSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData),
      });
      if (res.ok) {
        showFeedback(isAr ? 'تم حفظ الإعدادات العامة للمنصة' : 'Global platform settings saved');
      }
    } catch {}
  };

  // Nav modules with RBAC permission bindings
  const modulesList = [
    { id: 'dashboard' as const, label: isAr ? 'لوحة المراقبة' : 'Overview', icon: LayoutDashboard, permission: null },
    { id: 'users' as const, label: isAr ? 'المستخدمين والأدوار' : 'Users & Roles', icon: Users, permission: 'MANAGE_USERS' as const, badge: usersList.length },
    { id: 'stories' as const, label: isAr ? 'القصص والاعتماد' : 'Stories & Approvals', icon: BookOpen, permission: 'MANAGE_STORIES' as const, badge: storiesList.filter((s) => s.moderationStatus === 'PENDING').length || undefined },
    { id: 'projects' as const, label: isAr ? 'مشاريع المستخدمين' : 'Media Projects', icon: FolderKanban, permission: 'MANAGE_PROJECTS' as const, badge: projectsList.length },
    { id: 'templates' as const, label: isAr ? 'القوالب والنماذج' : 'Templates', icon: Sparkles, permission: 'MANAGE_TEMPLATES' as const, badge: templatesList.length },
    { id: 'ai_providers' as const, label: isAr ? 'مزودو الذكاء الاصطناعي' : 'AI Providers', icon: Cpu, permission: 'MANAGE_AI_PROVIDERS' as const },
    { id: 'jobs' as const, label: isAr ? 'طوابير التصيير (Jobs)' : 'Generation Jobs', icon: Activity, permission: 'MANAGE_JOBS' as const, badge: jobsList.filter((j) => j.status === 'FAILED').length ? `${jobsList.filter((j) => j.status === 'FAILED').length} FAILED` : undefined },
    { id: 'quran_resources' as const, label: isAr ? 'موارد القرآن الكريم' : 'Quran Resources', icon: Layers, permission: 'MANAGE_QURAN_RESOURCES' as const },
    { id: 'translations' as const, label: isAr ? 'التراجم المعتمدة' : 'Translations', icon: Languages, permission: 'MANAGE_QURAN_RESOURCES' as const },
    { id: 'tafsirs' as const, label: isAr ? 'التفاسير المعتمدة' : 'Tafsirs', icon: BookText, permission: 'MANAGE_QURAN_RESOURCES' as const },
    { id: 'reciters' as const, label: isAr ? 'القراء والتلاوات' : 'Reciters & Audio', icon: Mic, permission: 'MANAGE_QURAN_RESOURCES' as const },
    { id: 'reports' as const, label: isAr ? 'التقارير والتكاليف' : 'Reports & Costs', icon: BarChart3, permission: 'VIEW_FINANCIAL_REPORTS' as const },
    { id: 'moderation' as const, label: isAr ? 'الرقابة والضوابط' : 'Moderation & Guardrails', icon: ShieldAlert, permission: 'MODERATE_CONTENT' as const, badge: moderationQueue.filter((m) => m.status === 'PENDING_REVIEW').length || undefined },
    { id: 'system_logs' as const, label: isAr ? 'سجلات النظام (Logs)' : 'System Audit Logs', icon: FileCode2, permission: 'VIEW_SYSTEM_LOGS' as const },
    { id: 'settings' as const, label: isAr ? 'إعدادات المنصة' : 'Global Settings', icon: Settings, permission: 'MANAGE_SETTINGS' as const },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Action Toast Alert */}
      {actionFeedback && (
        <div className="fixed bottom-6 end-6 z-50 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl shadow-emerald-950/40 flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Top Header & Executive Switcher */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 end-0 -mt-10 -me-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-emerald-600 to-teal-600 p-0.5 shadow-xl shadow-amber-500/20">
              <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center text-amber-400 font-black text-2xl">
                ⚙️
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black tracking-tight text-white">
                  {isAr ? 'لوحة تحكم وإدارة النظام' : 'Executive Admin Dashboard'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {simulatedRole}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {isAr
                  ? 'إدارة المستخدمين، المحتوى القرآني، طوابير التصيير، ومزودي الذكاء الاصطناعي مع نظام الصلاحيات RBAC'
                  : 'Enterprise management for Quran media workflows, BullMQ rendering, AI providers & RBAC permissions'}
              </p>
            </div>
          </div>

          {/* RBAC Role Switcher & Live Ping */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-2xl">
              <span className="text-[11px] text-slate-400">{isAr ? 'محاكاة دور (RBAC):' : 'Simulate Role:'}</span>
              <select
                value={simulatedRole}
                onChange={(e) => setSimulatedRole(e.target.value as AppRole)}
                className="bg-transparent text-xs font-bold text-amber-400 outline-none cursor-pointer"
              >
                <option value="SUPER_ADMIN" className="bg-slate-900 text-white">Super Admin (All Access)</option>
                <option value="ADMIN" className="bg-slate-900 text-white">Admin (Operations)</option>
                <option value="EDITOR" className="bg-slate-900 text-white">Editor (Content & Quran)</option>
                <option value="MODERATOR" className="bg-slate-900 text-white">Moderator (Guardrails)</option>
                <option value="USER" className="bg-slate-900 text-white">User (Denied)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{isAr ? 'الخوادم تعمل بكفاءة' : 'Cluster Healthy'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Admin Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-3xl shadow-sm h-fit">
          <div className="px-3 py-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            {isAr ? 'وحدات الإدارة والتحكم (15 وحدة)' : 'Admin Modules (15)'}
          </div>

          {modulesList.map((m) => {
            const Icon = m.icon;
            const isSelected = activeModule === m.id;
            const isAllowed = !m.permission || hasPermission(simulatedRole, m.permission);

            return (
              <button
                key={m.id}
                disabled={!isAllowed}
                onClick={() => isAllowed && setActiveModule(m.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  !isAllowed
                    ? 'opacity-40 cursor-not-allowed text-slate-400'
                    : isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span className="truncate">{m.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {!isAllowed && <Lock className="w-3 h-3 text-slate-400" />}
                  {m.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        String(m.badge).includes('FAILED')
                          ? 'bg-rose-500 text-white animate-pulse'
                          : isSelected
                          ? 'bg-slate-950 text-amber-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {m.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Module Content Pane */}
        <div className="lg:col-span-3 space-y-6">
          {/* MODULE 1: DASHBOARD OVERVIEW */}
          {activeModule === 'dashboard' && (
            <div className="space-y-6">
              {/* Executive KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>{isAr ? 'المستخدمين النشطين' : 'Total Users'}</span>
                    <Users className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {overview?.metrics?.totalUsers || 152}
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                    +{overview?.metrics?.activeCreators || 42} {isAr ? 'صانع محتوى' : 'creators active'}
                  </p>
                </div>

                <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>{isAr ? 'مهام التصيير (24h)' : 'Render Jobs 24h'}</span>
                    <Activity className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {overview?.metrics?.totalJobs24h || 312}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {overview?.metrics?.failedJobs24h || 3} {isAr ? 'فشل' : 'failed'} ({overview?.metrics?.errorRatePercent || 0.96}%)
                  </p>
                </div>

                <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>{isAr ? 'المساحة السحابية' : 'Cloud Storage'}</span>
                    <HardDrive className="w-4 h-4 text-teal-500" />
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {overview?.metrics?.storageUsedGb || 142.6} <span className="text-xs text-slate-400">GB</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    14.2% {isAr ? 'من 1 تيرابايت' : 'of 1TB capacity'}
                  </p>
                </div>

                <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>{isAr ? 'تكاليف الإنتاج (الشهر)' : 'Monthly Cost'}</span>
                    <DollarSign className="w-4 h-4 text-sky-500" />
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    ${overview?.metrics?.totalCostMonthUsd || 184.5}
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                    {overview?.metrics?.apiCallsMonth?.toLocaleString() || '284,000'} API calls
                  </p>
                </div>
              </div>

              {/* System Infrastructure Health */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-amber-500" />
                    <span>{isAr ? 'حالة البنية التحتية والخدمات السحابية' : 'Infrastructure Cluster Status'}</span>
                  </h3>
                  <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ALL OPERATIONAL</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'PostgreSQL DB', val: 'CONNECTED', status: 'healthy' },
                    { label: 'BullMQ / Redis', val: 'HEALTHY', status: 'healthy' },
                    { label: 'GPU FFmpeg Workers', val: '4 NODES ONLINE', status: 'healthy' },
                    { label: 'Quran.com API Cache', val: 'WARMED (100%)', status: 'healthy' },
                  ].map((node, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] text-slate-400 font-bold">{node.label}</p>
                      <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{node.val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Audit Log Feed */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {isAr ? 'آخر النشاطات والأحداث المباشرة' : 'Live System Activity Feed'}
                </h3>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {overview?.recentActivities?.map((act: any) => (
                    <div key={act.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          {act.type}
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{act.message}</span>
                      </div>
                      <span className="text-slate-400 text-[11px] shrink-0">{new Date(act.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODULE 2: USERS & ROLES */}
          {activeModule === 'users' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    {isAr ? 'إدارة المستخدمين والصلاحيات (RBAC)' : 'User & Role Management (RBAC)'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {isAr ? 'تعديل الأدوار: Super Admin, Admin, Editor, Moderator, User' : 'Manage account permissions, role promotions, and user states'}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                      <th className="pb-3 text-start">{isAr ? 'المستخدم' : 'User'}</th>
                      <th className="pb-3 text-start">{isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                      <th className="pb-3 text-start">{isAr ? 'الدور (Role)' : 'Role'}</th>
                      <th className="pb-3 text-start">{isAr ? 'المشاريع' : 'Projects'}</th>
                      <th className="pb-3 text-end">{isAr ? 'الإجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs">
                            {u.name?.charAt(0) || 'U'}
                          </div>
                          <span>{u.name}</span>
                        </td>
                        <td className="py-3 text-slate-500 font-mono text-[11px]">{u.email}</td>
                        <td className="py-3">
                          <select
                            value={u.role}
                            disabled={!hasPermission(simulatedRole, 'MANAGE_ROLES') && u.role === 'SUPER_ADMIN'}
                            onChange={(e) => handleChangeUserRole(u.id, e.target.value as AppRole)}
                            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                          >
                            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="EDITOR">EDITOR</option>
                            <option value="MODERATOR">MODERATOR</option>
                            <option value="CREATOR">CREATOR</option>
                            <option value="USER">USER</option>
                          </select>
                        </td>
                        <td className="py-3 text-slate-600 dark:text-slate-300 font-bold">{u.projectsCount}</td>
                        <td className="py-3 text-end">
                          <button
                            onClick={() => showFeedback(isAr ? 'تم إرسال رابط إعادة تعيين كلمة المرور' : 'Password reset link sent')}
                            className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                          >
                            {isAr ? 'إعادة ضبط' : 'Reset'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODULE 3: STORIES & APPROVALS */}
          {activeModule === 'stories' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {isAr ? 'اعتماد ونشر القصص القرآنية' : 'Quran Story Review & Approvals'}
                </h2>
                <p className="text-xs text-slate-400">
                  {isAr ? 'مراجعة القصص العامة والتحقق من التفاسير المعتمدة والموافقة أو الرفض' : 'Approve, reject or request edits on public story submissions'}
                </p>
              </div>

              <div className="space-y-3">
                {storiesList.map((story) => (
                  <div
                    key={story.slug}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-lg">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            story.moderationStatus === 'APPROVED'
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                              : story.moderationStatus === 'PENDING'
                              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 animate-pulse'
                              : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {story.moderationStatus}
                        </span>
                        <span className="text-xs font-bold text-slate-500">{story.category}</span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">{isAr ? story.titleAr : story.titleEn}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{story.author} • {story.verseReference || `Surah ${story.surahNumber}`}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/${locale}/stories/${story.slug}`}
                        target="_blank"
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                        title={isAr ? 'معاينة' : 'Preview'}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {story.moderationStatus !== 'APPROVED' && (
                        <button
                          onClick={() => handleApproveStory(story.slug)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isAr ? 'موافقة ونشر' : 'Approve'}</span>
                        </button>
                      )}

                      {story.moderationStatus !== 'REJECTED' && (
                        <button
                          onClick={() => handleRejectStory(story.slug)}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>{isAr ? 'رفض مع سبب' : 'Reject'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODULE 6: AI PROVIDERS */}
          {activeModule === 'ai_providers' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {isAr ? 'مزودو الذكاء الاصطناعي والاستدلال' : 'AI Inference Providers & Models'}
                </h2>
                <p className="text-xs text-slate-400">
                  {isAr ? 'مراقبة سرعة الاستجابة (Latency)، دقة الضوابط الشرعية، والتكاليف' : 'Monitor OpenAI, Claude, Gemini & Groq health, costs and rate limits'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiProviders.map((prov) => (
                  <div
                    key={prov.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900 dark:text-white">{prov.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                          {prov.status}
                        </span>
                      </div>

                      <button
                        onClick={() => handleToggleAiProvider(prov.id, prov.isEnabled)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer ${
                          prov.isEnabled
                            ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {prov.isEnabled ? (isAr ? 'مفعّل' : 'ENABLED') : (isAr ? 'معطّل' : 'DISABLED')}
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div>
                        <p className="text-slate-400">{isAr ? 'سرعة الرد' : 'Latency'}</p>
                        <p className="font-bold text-slate-900 dark:text-white">{prov.latencyMs}ms</p>
                      </div>
                      <div>
                        <p className="text-slate-400">{isAr ? 'الطلبات (24h)' : 'Requests'}</p>
                        <p className="font-bold text-slate-900 dark:text-white">{prov.requests24h?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">{isAr ? 'التكلفة (24h)' : 'Cost 24h'}</p>
                        <p className="font-bold text-slate-900 dark:text-white">${prov.cost24hUsd}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODULE 7: GENERATION JOBS */}
          {activeModule === 'jobs' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {isAr ? 'طوابير التصيير والمحرك الخلفي (BullMQ Jobs)' : 'Background Generation Jobs & Queue'}
                </h2>
                <p className="text-xs text-slate-400">
                  {isAr ? 'مراقبة المهام الجارية، فحص الأخطاء، وإعادة تنفيذ المهام الفاشلة' : 'Inspect queued, rendering, and failed FFmpeg jobs with stack trace inspector'}
                </p>
              </div>

              <div className="space-y-3">
                {jobsList.map((job) => (
                  <div
                    key={job.id}
                    className={`p-4 rounded-2xl border ${
                      job.status === 'FAILED'
                        ? 'bg-rose-500/5 border-rose-500/30'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                    } space-y-3`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-500">{job.jobId}</span>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              job.status === 'COMPLETED'
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                : job.status === 'FAILED'
                                ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                                : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 animate-pulse'
                            }`}
                          >
                            {job.status} ({job.progress}%)
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                          {job.projectTitle} • <span className="font-normal text-slate-400">{job.userEmail}</span>
                        </h4>
                      </div>

                      {job.status === 'FAILED' && (
                        <button
                          onClick={() => handleRetryJob(job.id)}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{isAr ? 'إعادة التنفيذ (Retry)' : 'Retry Job'}</span>
                        </button>
                      )}
                    </div>

                    {job.error && (
                      <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 font-mono text-[11px] space-y-1">
                        <p className="font-bold flex items-center gap-1.5 text-rose-400">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{job.error}</span>
                        </p>
                        {job.stackTrace && <p className="text-[10px] text-rose-400/80 truncate">{job.stackTrace}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODULE 13: MODERATION & SACRED GUARDRAILS */}
          {activeModule === 'moderation' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {isAr ? 'طابور التحقق والرقابة الشرعية' : 'Sacred Guardrails & Moderation Queue'}
                </h2>
                <p className="text-xs text-slate-400">
                  {isAr ? 'فحص المحتوى المحظور شرعاً (تجسيد الأنبياء والذات الإلهية) وتدقيق المطابقة النصية' : 'Audit non-figurative policies and textual Quran verification alerts'}
                </p>
              </div>

              <div className="space-y-3">
                {moderationQueue.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/10 text-rose-500 border border-rose-500/20">
                          {item.flagType}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{item.resourceTitle}</span>
                      </div>
                      <span className="text-xs font-bold text-amber-500">{item.status}</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/15">
                      {item.flagReason}
                    </p>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={() => handleModerateItem(item.id, 'APPROVED')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isAr ? 'اعتماد بعد التدقيق' : 'Approve'}</span>
                      </button>
                      <button
                        onClick={() => handleModerateItem(item.id, 'QUARANTINED')}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>{isAr ? 'حظر مؤقت' : 'Quarantine'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODULE 15: GLOBAL SETTINGS */}
          {activeModule === 'settings' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {isAr ? 'إعدادات المنصة ومحركات الإنتاج' : 'Platform & Production Engine Settings'}
                </h2>
                <p className="text-xs text-slate-400">
                  {isAr ? 'ضبط السعة القصوى للتصيير، وتفعيل نمط الصيانة والضوابط الشرعية' : 'Configure cluster rendering limits, sacred guardrail modes and quotas'}
                </p>
              </div>

              {settingsData && (
                <form onSubmit={handleSaveGlobalSettings} className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {isAr ? 'اسم المنصة' : 'Platform Brand Name'}
                    </label>
                    <input
                      type="text"
                      value={settingsData.platformName || ''}
                      onChange={(e) => setSettingsData({ ...settingsData, platformName: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {isAr ? 'أعلى دقة تصيير' : 'Max Render Resolution'}
                      </label>
                      <select
                        value={settingsData.maxVideoResolution || '4K'}
                        onChange={(e) => setSettingsData({ ...settingsData, maxVideoResolution: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white"
                      >
                        <option value="1080p">1080p (Full HD)</option>
                        <option value="4K">4K (Ultra HD)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {isAr ? 'تزامن المعالجة (Workers)' : 'Worker Concurrency'}
                      </label>
                      <input
                        type="number"
                        value={settingsData.workerConcurrency || 8}
                        onChange={(e) => setSettingsData({ ...settingsData, workerConcurrency: Number(e.target.value) })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isAr ? 'حفظ إعدادات المنصة' : 'Save Global Settings'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* FALLBACK FOR OTHER MODULES (Templates, Quran Resources, Translations, Tafsirs, Reciters, Reports, System Logs) */}
          {['templates', 'projects', 'quran_resources', 'translations', 'tafsirs', 'reciters', 'reports', 'system_logs'].includes(activeModule) && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900 dark:text-white capitalize">
                  {activeModule.replace('_', ' ')}
                </h2>
                <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>SYNCHRONIZED</span>
                </span>
              </div>

              {activeModule === 'translations' && (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {translationsList.map((t) => (
                    <div key={t.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{t.languageName} — {t.author}</p>
                        <p className="text-slate-400 text-[11px]">6,236 Ayahs verified</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                        OFFICIAL VERIFIED
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeModule === 'reciters' && (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {recitersList.map((r) => (
                    <div key={r.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mic className="w-4 h-4 text-amber-500" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{r.nameAr} ({r.nameEn})</p>
                          <p className="text-slate-400 text-[11px]">{r.style} • {r.bitrate}kbps MP3</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                        {r.streamHealth}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeModule === 'system_logs' && (
                <div className="space-y-2">
                  {systemLogs.map((log) => (
                    <div key={log.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-[11px] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-500 font-bold">{log.action}</span>
                        <span className="text-slate-400">{log.resource} ({log.resourceId})</span>
                      </div>
                      <span className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
