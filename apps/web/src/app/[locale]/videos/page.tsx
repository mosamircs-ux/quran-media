import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { type Locale } from '@quran-media/i18n';
import { generateLocalizedMetadata, generateBreadcrumbsJsonLd } from '@/lib/seo';
import { Film, Play, Sparkles, Download, Share2 } from 'lucide-react';

export const revalidate = 3600; // 1 hour ISR

interface VideosPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: VideosPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === 'ar';
  return generateLocalizedMetadata({
    locale,
    path: '/videos',
    title: isAr ? 'معرض الفيديوهات القرآنية — إنتاج سينمائي عالي الدقة' : 'Quran Videos Showcase — 4K & Cinematic Productions',
    description: isAr
      ? 'استعرض أحدث الفيديوهات القرآنية المصيرة بجودة 4K ومقاسات Reels و TikTok بالرسم العثماني'
      : 'Watch and stream high-quality Quranic video productions, 4K nature backgrounds, and animated Arabic calligraphy',
    keywords: ['Quran Videos', 'Quran Reels', 'فيديوهات القرآن', 'تلاوات مصورة', 'إنتاج قرآني'],
  });
}

export default async function VideosPage({ params }: VideosPageProps) {
  const { locale } = await params;
  const isAr = locale === 'ar';

  const showcaseVideos = [
    {
      id: 'vid-01',
      title: isAr ? 'آية الكرسي — تلاوة مرئية خاشعة' : 'Ayat al-Kursi — Cinematic Visual Recitation',
      reciter: 'مشاري راشد العفاسي',
      aspectRatio: '9:16',
      duration: '0:24',
      thumbnail: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&auto=format&fit=crop&q=80',
      surah: 2,
      ayah: 255,
    },
    {
      id: 'vid-02',
      title: isAr ? 'سورة الضحى — شروق الأمل والسكينة' : 'Surah Ad-Duha — Sunrise of Hope & Comfort',
      reciter: 'عبد الباسط عبد الصمد',
      aspectRatio: '16:9',
      duration: '0:45',
      thumbnail: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80',
      surah: 93,
      ayah: 1,
    },
    {
      id: 'vid-03',
      title: isAr ? 'سورة الرحمن — فبأي آلاء ربكما تكذبان' : 'Surah Ar-Rahman — Which of Favors Will You Deny',
      reciter: 'مشاري راشد العفاسي',
      aspectRatio: '9:16',
      duration: '1:12',
      thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80',
      surah: 55,
      ayah: 1,
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-7xl py-10 space-y-8">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <Film className="w-3.5 h-3.5" />
          <span>{isAr ? 'معرض الإنتاج المرئي' : 'Cinematic Video Showcase'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {isAr ? 'أحدث الفيديوهات القرآنية المصيرة' : 'High-Definition Quranic Video Deliverables'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {isAr
            ? 'فيديوهات سينمائية جاهزة للمشاركة والنشر على تيك توك، إنستغرام ريلز، ويوتيوب'
            : 'Explore community and studio productions optimized for modern platforms with synchronized RTL subtitles'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {showcaseVideos.map((vid) => (
          <div
            key={vid.id}
            className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:border-amber-500/50 transition-all space-y-4 p-4"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950">
              <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg">
                  <Play className="w-5 h-5 fill-slate-950 ms-0.5" />
                </div>
              </div>
              <span className="absolute bottom-2 end-2 px-2 py-0.5 rounded-md bg-black/75 text-white text-[10px] font-bold">
                {vid.duration} • {vid.aspectRatio}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{vid.title}</h3>
              <p className="text-xs text-slate-400">{vid.reciter}</p>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
              <Link
                href={`/${locale}/create/story?surah=${vid.surah}&ayah=${vid.ayah}`}
                className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAr ? 'اصنع مثله' : 'Make Version'}</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
