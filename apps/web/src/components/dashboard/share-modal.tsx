'use client';

import React, { useState } from 'react';
import type { Locale } from '@quran-media/i18n';
import { X, Copy, Check, Share2, Globe, Lock, ExternalLink, Code } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  projectId?: string;
  videoUrl?: string;
  locale: Locale;
}

export function ShareModal({ isOpen, onClose, title, projectId, videoUrl, locale }: ShareModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  if (!isOpen) return null;

  const isAr = locale === 'ar';
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/${locale}/studio/${projectId || 'demo'}` : '';
  const embedCode = `<iframe src="${shareUrl}?embed=true" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;

  const copyToClipboard = (text: string, isEmbed: boolean) => {
    navigator.clipboard.writeText(text);
    if (isEmbed) {
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {isAr ? 'مشاركة ونشر العمل القرآني' : 'Share & Publish Production'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-sm">{title}</p>
          </div>
        </div>

        {/* Privacy Toggle */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isPublic ? (
              <Globe className="w-5 h-5 text-emerald-500" />
            ) : (
              <Lock className="w-5 h-5 text-amber-500" />
            )}
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {isPublic
                  ? isAr
                    ? 'رابط عام (يمكن لأي شخص المشاهدة والتلاوة)'
                    : 'Public Link (Anyone with link can watch)'
                  : isAr
                  ? 'خاص (أنت فقط)'
                  : 'Private (Only you can access)'}
              </p>
              <p className="text-[11px] text-slate-400">
                {isPublic
                  ? isAr
                    ? 'يمكن مشاركة الرابط عبر وسائل التواصل الاجتماعي'
                    : 'Ready for sharing across social channels'
                  : isAr
                  ? 'لا يمكن لأحد رؤية هذا المشروع'
                  : 'Project is strictly restricted to your account'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPublic(!isPublic)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isPublic
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {isPublic ? (isAr ? 'عام' : 'Public') : (isAr ? 'خاص' : 'Private')}
          </button>
        </div>

        {/* Share Link Box */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {isAr ? 'رابط المشاركة المباشر' : 'Direct Share URL'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white select-all font-mono"
              />
              <button
                onClick={() => copyToClipboard(shareUrl, false)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ' : 'Copy')}</span>
              </button>
            </div>
          </div>

          {/* Embed Code */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-slate-400" />
              <span>{isAr ? 'كود التضمين للمواقع والمدونات (iFrame)' : 'Embed Code (HTML iFrame)'}</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={embedCode}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 select-all font-mono truncate"
              />
              <button
                onClick={() => copyToClipboard(embedCode, true)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 border border-slate-200 dark:border-slate-700"
              >
                {copiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedEmbed ? (isAr ? 'تم!' : 'Copied!') : (isAr ? 'نسخ الكود' : 'Copy')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Social Quick Actions */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">{isAr ? 'نشر فوري عبر:' : 'Quick Share:'}</span>
          <div className="flex items-center gap-2">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <span>X (Twitter)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${title}: ${shareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5"
            >
              <span>WhatsApp</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
