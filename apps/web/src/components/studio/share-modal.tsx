'use client';

import React, { useState } from 'react';
import {
  Share2,
  Download,
  Copy,
  Check,
  Film,
  Code,
  FileText,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import type { Locale } from '@quran-media/i18n';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoUrl?: string | null;
  webmUrl?: string | null;
  thumbnailUrl?: string | null;
  locale: Locale;
}

export function ShareModal({
  isOpen,
  onClose,
  title,
  videoUrl,
  webmUrl,
  thumbnailUrl,
  locale,
}: ShareModalProps) {
  const isAr = locale === 'ar';
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const embedCode = `<iframe src="${currentUrl}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;

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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {isAr ? 'تحميل ومشاركة الإنتاج' : 'Export & Share Media'}
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-[280px]">{title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-sm p-1"
          >
            ✕
          </button>
        </div>

        {/* Deliverables Download Buttons */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isAr ? 'الملفات المتاحة للتحميل الفوري' : 'Download Master Deliverables'}</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* MP4 HD Master */}
            <a
              href={videoUrl || '#'}
              download
              target="_blank"
              rel="noreferrer"
              className={`p-3 rounded-2xl border flex items-center justify-between gap-2 transition-all ${
                videoUrl
                  ? 'bg-slate-950 border-slate-800 hover:border-emerald-500/60 text-slate-100'
                  : 'bg-slate-950/40 border-slate-800/40 text-slate-500 pointer-events-none'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Film className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <div className="text-xs font-bold">MP4 Video (HD)</div>
                  <div className="text-[10px] text-slate-400">H.264 / AAC 1080p</div>
                </div>
              </div>
              <Download className="w-3.5 h-3.5 text-slate-400" />
            </a>

            {/* WebM Master */}
            <a
              href={webmUrl || videoUrl || '#'}
              download
              target="_blank"
              rel="noreferrer"
              className={`p-3 rounded-2xl border flex items-center justify-between gap-2 transition-all ${
                videoUrl
                  ? 'bg-slate-950 border-slate-800 hover:border-emerald-500/60 text-slate-100'
                  : 'bg-slate-950/40 border-slate-800/40 text-slate-500 pointer-events-none'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Film className="w-4 h-4 text-cyan-400" />
                <div className="text-left">
                  <div className="text-xs font-bold">WebM Video</div>
                  <div className="text-[10px] text-slate-400">VP9 / Opus</div>
                </div>
              </div>
              <Download className="w-3.5 h-3.5 text-slate-400" />
            </a>

            {/* Thumbnail Poster */}
            <a
              href={thumbnailUrl || '#'}
              download
              target="_blank"
              rel="noreferrer"
              className={`p-3 rounded-2xl border flex items-center justify-between gap-2 transition-all ${
                thumbnailUrl
                  ? 'bg-slate-950 border-slate-800 hover:border-emerald-500/60 text-slate-100'
                  : 'bg-slate-950/40 border-slate-800/40 text-slate-500 pointer-events-none'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <div className="text-left">
                  <div className="text-xs font-bold">Poster Thumbnail</div>
                  <div className="text-[10px] text-slate-400">JPEG High-DPI</div>
                </div>
              </div>
              <Download className="w-3.5 h-3.5 text-slate-400" />
            </a>

            {/* Subtitles ASS / VTT */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 text-slate-100">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-purple-400" />
                <div className="text-left">
                  <div className="text-xs font-bold">Subtitles Script</div>
                  <div className="text-[10px] text-slate-400">ASS / WebVTT</div>
                </div>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                Burned in MP4
              </span>
            </div>
          </div>
        </div>

        {/* Copy Direct Link */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">
            {isAr ? 'رابط المشروع المباشر' : 'Direct Project Link'}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none"
            />
            <button
              onClick={() => copyToClipboard(currentUrl, false)}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 shadow"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
            </button>
          </div>
        </div>

        {/* Embed Code */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-slate-400" />
            <span>{isAr ? 'كود التضمين (Embed Code)' : 'IFrame Embed Code'}</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={embedCode}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 font-mono focus:outline-none"
            />
            <button
              onClick={() => copyToClipboard(embedCode, true)}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 shadow"
            >
              {copiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEmbed ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
