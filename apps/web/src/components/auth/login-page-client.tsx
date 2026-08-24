'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-provider';
import type { Locale } from '@quran-media/i18n';
import { getDictionary } from '@quran-media/i18n';
import { Lock, Mail, User, Sparkles, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface LoginPageClientProps {
  locale: Locale;
  initialMode: 'signin' | 'signup';
}

export function LoginPageClient({ locale, initialMode }: LoginPageClientProps) {
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle, demoLogin } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAr = locale === 'ar';
  const dict = getDictionary(locale);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const res = await signIn(email, password);
        if (!res.success) {
          setError(res.error || 'Failed to sign in');
        } else {
          router.push(`/${locale}/dashboard`);
        }
      } else {
        const res = await signUp(email, password, name, locale);
        if (!res.success) {
          setError(res.error || 'Failed to sign up');
        } else {
          router.push(`/${locale}/dashboard`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await signInWithGoogle();
      if (res.success) {
        router.push(`/${locale}/dashboard`);
      } else {
        setError(res.error || 'Google login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await demoLogin();
      router.push(`/${locale}/dashboard`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/20">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-amber-500 text-white shadow-xl shadow-emerald-900/30 mb-3">
          <span className="text-2xl">📖</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          {mode === 'signin'
            ? isAr
              ? 'تسجيل الدخول إلى حسابك'
              : 'Sign in to your account'
            : isAr
            ? 'إنشاء حساب صانع محتوى قرآني'
            : 'Create creator account'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isAr
            ? 'لوحة تحكم خاصة ومكتبة وسائط سحابية لمشاريعك'
            : 'Private media workspace and cloud library for your productions'}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold text-center">
          {error}
        </div>
      )}

      {/* Quick 1-Click Demo Login */}
      <button
        type="button"
        onClick={handleDemoLogin}
        disabled={loading}
        className="w-full mb-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-500/40 hover:border-amber-500/70 text-amber-600 dark:text-amber-400 font-bold text-xs transition-all shadow-sm cursor-pointer"
      >
        <Sparkles className="w-4 h-4 text-amber-500" />
        <span>{isAr ? 'الدخول السريع بحساب تجريبي (Demo Creator)' : 'One-Click Demo Account Sign In'}</span>
      </button>

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full mb-4 flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-all cursor-pointer"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>{isAr ? 'المتابعة باستخدام Google' : 'Continue with Google'}</span>
      </button>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
        <span className="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 font-semibold uppercase">
          {isAr ? 'أو عبر البريد' : 'or email'}
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {mode === 'signup' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isAr ? 'الاسم الكامل' : 'Full Name'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isAr ? 'محمد القاسمي' : 'Mohamed Al-Qasimi'}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
              />
              <User className="w-4 h-4 text-slate-400 absolute end-3.5 top-3 pointer-events-none" />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {isAr ? 'البريد الإلكتروني' : 'Email Address'}
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="creator@quranmedia.studio"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute end-3.5 top-3 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {isAr ? 'كلمة المرور' : 'Password'}
          </label>
          <div className="relative">
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute end-3.5 top-3 pointer-events-none" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <span>{isAr ? 'جاري المعالجة...' : 'Processing...'}</span>
          ) : mode === 'signin' ? (
            <>
              <span>{isAr ? 'دخول الاستوديو' : 'Enter Studio'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </>
          ) : (
            <>
              <span>{isAr ? 'إنشاء حساب جديد' : 'Create Account'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Mode Switcher */}
      <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
        {mode === 'signin' ? (
          <p>
            {isAr ? 'ليس لديك حساب بعد؟' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setMode('signup')}
              className="font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
            >
              {isAr ? 'أنشئ حساباً مجانياً' : 'Sign up free'}
            </button>
          </p>
        ) : (
          <p>
            {isAr ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => setMode('signin')}
              className="font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
            >
              {isAr ? 'تسجيل الدخول' : 'Sign in'}
            </button>
          </p>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>{isAr ? 'حماية مشددة وخصوصية تامة لبياناتك ومشاريعك' : 'Secured and private media workspace'}</span>
      </div>
    </div>
  );
}
