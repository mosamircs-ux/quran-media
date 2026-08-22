'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@quran-media/i18n';
import { Layers, Sparkles, BookOpen, Quote, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

interface QuranStoriesSectionProps {
  locale: Locale;
}

interface NarrativeStory {
  id: string;
  categoryAr: string;
  categoryEn: string;
  titleAr: string;
  titleEn: string;
  surahAr: string;
  surahEn: string;
  ayah: string;
  storyAr: string;
  storyEn: string;
  tafsirQuoteAr: string;
  tafsirQuoteEn: string;
  tafsirSource: string;
  takeawaysAr: string[];
  takeawaysEn: string[];
  visualPromptIdea: string;
}

const STORIES_DATA: NarrativeStory[] = [
  {
    id: 'story-yusuf',
    categoryAr: 'قصص الأنبياء والابتلاء',
    categoryEn: 'Prophetic Narratives',
    titleAr: 'أحسن القصص: من غيابات الجب إلى عرش التمكين',
    titleEn: 'The Best of Stories: From the Deep Well to Divine Elevation',
    surahAr: 'يوسف',
    surahEn: 'Yusuf',
    ayah: '12:21',
    storyAr: 'تتجلى حكمة الله المطلقة في قصة نبي الله يوسف، حيث بدأ الأمر بحسد ورمي في قعر البئر وغربة وفتنة وسجن طويل، لكن لطف الله الخفي كان يسوق الأسباب لتمكينه وإنقاذ أمة كاملة من المجاعة.',
    storyEn: 'The absolute wisdom of Allah shines in the story of Prophet Yusuf. What began with jealousy, being cast into a deep well, slavery, and years of wrongful imprisonment, was actually Allah’s hidden decree preparing him to save an entire nation.',
    tafsirQuoteAr: '«وَٱللَّهُ غَالِبٌ عَلَىٰٓ أَمْرِهِۦ وَلَٰكِنَّ أَكْثَرَ ٱلنَّاسِ لَا يَعْلَمُونَ»',
    tafsirQuoteEn: '"And Allah is predominant over His affair, but most of the people do not know."',
    tafsirSource: 'تفسير ابن كثير / Tafsir Ibn Kathir',
    takeawaysAr: [
      'اليقين بأن تدبير الله للمؤمن خير من تدبيره لنفسه',
      'الصبر الجميل مفتاح الفرج والتمكين',
      'العفو عند المقدرة هو خلق الصفوة من عباد الله',
    ],
    takeawaysEn: [
      'Firm conviction that Divine planning surpasses human comprehension',
      'Patience during tribulation is the precursor to divine elevation',
      'Forgiveness when in power is the hallmark of noble souls',
    ],
    visualPromptIdea: 'Sunlit ancient desert dunes at golden hour with majestic silhouetted caravans under infinite sky',
  },
  {
    id: 'story-kahf',
    categoryAr: 'عصمة الإيمان',
    categoryEn: 'Unwavering Faith',
    titleAr: 'فتية الكهف: ثبات العقيدة في زمن الفتن',
    titleEn: 'The Companions of the Cave: Firmness of Faith in Times of Trial',
    surahAr: 'الكهف',
    surahEn: 'Al-Kahf',
    ayah: '18:13-14',
    storyAr: 'شباب تركوا زينة الدنيا وقصورها هرباً بدينهم إلى كهف مظلم ضيق، ففتح الله لهم فيه أبواب رحمته ونشر لهم من فضله وحفظهم قروناً ليكونوا آية خالدة للثبات.',
    storyEn: 'Young believers who sacrificed luxury and palaces to preserve their faith in a narrow, dark cave. Allah turned that solitary cave into an expansive sanctuary of mercy, preserving them across centuries.',
    tafsirQuoteAr: '«إِنَّهُمْ فِتْيَةٌ ءَامَنُوا۟ بِرَبِّهِمْ وَزِدْنَٰهُمْ هُدًۭى»',
    tafsirQuoteEn: '"Indeed, they were youths who believed in their Lord, and We increased them in guidance."',
    tafsirSource: 'تفسير السعدي / Tafsir As-Sa\'di',
    takeawaysAr: [
      'من ترك شيئاً لله عوضه الله خيراً منه ونوراً في قلبه',
      'اللجوء إلى الله والدعاء وقت الأزمات',
      'أهمية الصحبة الصالحة التي تعين على الطاعة',
    ],
    takeawaysEn: [
      'Whoever leaves something for the sake of Allah is rewarded with light',
      'Seeking Divine refuge through heartfelt supplication',
      'The supreme value of righteous companionship in holding truth',
    ],
    visualPromptIdea: 'Atmospheric secluded mountain cave bathed in soft celestial sunlight rays through stone opening',
  },
];

export function QuranStoriesSection({ locale }: QuranStoriesSectionProps) {
  const isAr = locale === 'ar';
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const current = STORIES_DATA[activeStoryIndex] ?? STORIES_DATA[0]!;

  return (
    <section className="py-20 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="container mx-auto px-4 sm:px-8 max-w-7xl space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <Layers className="w-3.5 h-3.5" />
            <span>{isAr ? 'قصص القرآن وحكم التنزيل' : 'Quranic Narrative Reflections'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isAr ? 'عبر وآيات من أحسن القصص' : 'Profound Lessons & Reflections'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {isAr
              ? 'توليد سرديات وقصص متكاملة مستندة إلى أمهات كتب التفسير لتحويلها إلى محتوى مرئي مؤثر.'
              : 'Generate authenticated narratives and storytelling scripts grounded in classical tafsir.'}
          </p>
        </div>

        {/* Narrative Showcase Container */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-2xl p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Story Details (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-500/20">
                  {isAr ? current.categoryAr : current.categoryEn}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  {isAr ? `سورة ${current.surahAr} [${current.ayah}]` : `Surah ${current.surahEn} [${current.ayah}]`}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {isAr ? current.titleAr : current.titleEn}
              </h3>

              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                {isAr ? current.storyAr : current.storyEn}
              </p>

              {/* Tafsir Verse Block */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <Quote className="w-3.5 h-3.5" />
                  <span>{current.tafsirSource}</span>
                </div>
                <p dir="rtl" className="font-quran text-xl text-slate-900 dark:text-amber-100">
                  {current.tafsirQuoteAr}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                  {current.tafsirQuoteEn}
                </p>
              </div>

              {/* Key Contemplation Points */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
                  {isAr ? 'الدروس والعبر المستفادة:' : 'Key Contemplation Takeaways:'}
                </h4>
                <div className="space-y-1.5">
                  {(isAr ? current.takeawaysAr : current.takeawaysEn).map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Link
                  href={`/${locale}#create`}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAr ? 'توليد فيديو لهذه القصة' : 'Synthesize Video from Story'}</span>
                </Link>

                <div className="flex items-center gap-1.5">
                  {STORIES_DATA.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveStoryIndex(i)}
                      className={`h-2.5 rounded-full transition-all cursor-pointer ${
                        activeStoryIndex === i ? 'w-8 bg-amber-500' : 'w-2.5 bg-slate-300 dark:bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Visual Atmosphere Insight (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-950 border border-slate-800 text-white space-y-4 shadow-xl">
                <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {isAr ? 'نمط المشهد البصري المقترح' : 'AI Visual Scene Aesthetic'}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    Reverent 8K
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  "{current.visualPromptIdea}"
                </p>

                <div className="space-y-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <p>• {isAr ? 'خالٍ تماماً من تجسيد الشخصيات أو الوجوه' : 'Strictly non-anthropomorphic natural vista'}</p>
                  <p>• {isAr ? 'متوافق مع أبعاد 9:16 و 16:9 و 1:1' : 'Calibrated for 9:16, 16:9, and 1:1 frames'}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
