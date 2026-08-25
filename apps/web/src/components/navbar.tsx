'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from './theme-provider';
import { useAuth } from './auth/auth-provider';
import { AuthModal } from './auth/auth-modal';
import { LanguageSwitcher } from './language-switcher';
import { getDictionary, type Locale } from '@quran-media/i18n';
import {
  Sun,
  Moon,
  Sparkles,
  Menu,
  X,
  BookOpen,
  Film,
  Compass,
  Bookmark,
  Feather,
  User,
  LayoutDashboard,
  LogOut,
  FolderKanban,
  SlidersHorizontal,
} from 'lucide-react';

interface NavbarProps {
  locale: Locale;
}

export function Navbar({ locale }: NavbarProps) {
  const { isDark, setTheme } = useTheme();
  const { user, status, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const dict = getDictionary(locale);
  const isAr = locale === 'ar';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: dict.nav.home, icon: Compass },
    { href: `/${locale}/stories`, label: dict.nav.stories, icon: BookOpen },
    { href: `/${locale}/studio`, label: dict.nav.studio, icon: Sparkles },
    { href: `/${locale}/dashboard`, label: isAr ? 'لوحة التحكم' : 'Dashboard', icon: LayoutDashboard },
    { href: `/${locale}/create/story`, label: dict.nav.storyGenerator, icon: Feather },
    { href: `/${locale}/create`, label: dict.nav.videoCreator, icon: Film },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl shadow-lg shadow-slate-950/5 dark:shadow-slate-950/30'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-8 max-w-7xl">
        {/* Brand Logo */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3.5 group focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-xl p-1"
        >
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-amber-500 text-white font-bold shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform duration-300">
            <span className="text-xl">📖</span>
            <div className="absolute inset-0 rounded-2xl border border-amber-300/30 pointer-events-none" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              {isAr ? 'ميديا القرآن' : 'Quran Media'}
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Studio
              </span>
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {isAr ? 'منصة القصص المرئية والتلاوات' : 'Visual Stories & Recitations'}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-900/70 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800 transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions & Controls */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Language Switcher */}
          <LanguageSwitcher currentLocale={locale} variant="dropdown" />

          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* User Profile / Sign In */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pe-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600 to-amber-500 flex items-center justify-center text-white text-xs font-black shadow-sm">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full rounded-lg object-cover" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
                <span className="text-xs font-semibold max-w-[100px] truncate">{user.name}</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute top-full mt-2 end-0 z-50 min-w-[200px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl p-1.5 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  </div>

                  <Link
                    href={`/${locale}/dashboard`}
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-emerald-500" />
                    <span>{isAr ? 'لوحة التحكم والمكتبة' : 'My Dashboard & Library'}</span>
                  </Link>

                  <Link
                    href={`/${locale}/admin`}
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                    <span>{isAr ? 'إدارة النظام (Admin)' : 'Admin Dashboard'}</span>
                  </Link>

                  <Link
                    href={`/${locale}/studio`}
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    <FolderKanban className="w-4 h-4 text-teal-500" />
                    <span>{isAr ? 'مشاريع الاستوديو' : 'Studio Projects'}</span>
                  </Link>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors text-start cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{isAr ? 'تسجيل الخروج' : 'Sign Out'}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
            </button>
          )}

          {/* Create CTA Button */}
          <Link
            href={`/${locale}/create`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{dict.nav.createCta}</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          {user ? (
            <Link
              href={`/${locale}/dashboard`}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-amber-500 flex items-center justify-center text-white text-xs font-black shadow-sm"
            >
              {user.name.charAt(0)}
            </Link>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold"
            >
              <User className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <LanguageSwitcher currentLocale={locale} variant="compact" />

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        locale={locale}
      />

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl px-6 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top-4">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-3 text-xs font-semibold rounded-xl bg-slate-100/70 dark:bg-slate-900/70 text-slate-800 dark:text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-500"
                >
                  <Icon className="w-4 h-4 text-amber-500" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2">
            <Link
              href={`/${locale}#create`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/30"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAr ? 'ابدأ صناعة المحتوى الآن' : 'Create Media Now'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
