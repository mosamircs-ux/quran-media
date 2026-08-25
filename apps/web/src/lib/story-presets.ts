export interface StoryPreset {
  id: string;
  surahNumber: number;
  surahNameAr: string;
  surahNameEn: string;
  ayahStart: number;
  ayahEnd: number;
  mode: 'reflection' | 'educational' | 'cinematic' | 'short_reminder' | 'children_friendly' | 'social_media';
  titleAr: string;
  titleEn: string;
  tagAr: string;
  tagEn: string;
  badgeColor: string;
  conceptKeywords: string[];
}

export const STORY_PRESETS: StoryPreset[] = [
  {
    id: 'ayat-al-kursi',
    surahNumber: 2,
    surahNameAr: 'البقرة',
    surahNameEn: 'Al-Baqarah',
    ayahStart: 255,
    ayahEnd: 255,
    mode: 'cinematic',
    titleAr: 'آية الكرسي: عظمة الحي القيوم وتدبير الكون',
    titleEn: 'Ayat al-Kursi: The All-Sustaining Sovereign',
    tagAr: 'أعظم آية',
    tagEn: 'Greatest Ayah',
    badgeColor: 'from-amber-500 to-yellow-600',
    conceptKeywords: ['عظمة الله', 'الملك', 'العلم', 'الحفظ', 'القيومية'],
  },
  {
    id: 'yusuf-elevation',
    surahNumber: 12,
    surahNameAr: 'يوسف',
    surahNameEn: 'Yusuf',
    ayahStart: 4,
    ayahEnd: 6,
    mode: 'cinematic',
    titleAr: 'سورة يوسف: من غيابات الجب إلى التمكين',
    titleEn: 'Prophet Yusuf: From the Well to Elevation',
    tagAr: 'أحسن القصص',
    tagEn: 'Best of Stories',
    badgeColor: 'from-emerald-500 to-teal-600',
    conceptKeywords: ['الرؤيا الصادقة', 'الصبر الجميل', 'لطف الله', 'التمكين'],
  },
  {
    id: 'kahf-youths',
    surahNumber: 18,
    surahNameAr: 'الكهف',
    surahNameEn: 'Al-Kahf',
    ayahStart: 9,
    ayahEnd: 14,
    mode: 'educational',
    titleAr: 'فتية الكهف: ثبات العقيدة في زمن الفتن',
    titleEn: 'Companions of the Cave: Steadfast Faith',
    tagAr: 'عصمة الإيمان',
    tagEn: 'Trials & Faith',
    badgeColor: 'from-blue-500 to-indigo-600',
    conceptKeywords: ['الفرار بالدين', 'ربط القلوب', 'الرحمة', 'الرشد'],
  },
  {
    id: 'duha-solace',
    surahNumber: 93,
    surahNameAr: 'الضحى',
    surahNameEn: 'Ad-Duha',
    ayahStart: 1,
    ayahEnd: 8,
    mode: 'reflection',
    titleAr: 'ضحى السكينة: ما ودعك ربك وما قلى',
    titleEn: 'Ad-Duha: Radiant Dawn & Divine Solace',
    tagAr: 'بلسم القلوب',
    tagEn: 'Hope & Solace',
    badgeColor: 'from-rose-500 to-amber-600',
    conceptKeywords: ['قسم الفجر', 'سكينة الليل', 'رعاية الله', 'الأمل'],
  },
  {
    id: 'hadid-glory',
    surahNumber: 57,
    surahNameAr: 'الحديد',
    surahNameEn: 'Al-Hadid',
    ayahStart: 1,
    ayahEnd: 6,
    mode: 'reflection',
    titleAr: 'تسبيح الأكوان: هو الأول والآخر والظاهر والباطن',
    titleEn: 'Cosmic Glorification: The First and The Last',
    tagAr: 'التسبيح والملك',
    tagEn: 'Cosmic Glory',
    badgeColor: 'from-purple-500 to-violet-600',
    conceptKeywords: ['تسبيح المخلوقات', 'العزة والحكمة', 'العلم المحيط', 'إيلاج الليل والنهار'],
  },
  {
    id: 'mulk-cosmos',
    surahNumber: 67,
    surahNameAr: 'الملك',
    surahNameEn: 'Al-Mulk',
    ayahStart: 1,
    ayahEnd: 5,
    mode: 'short_reminder',
    titleAr: 'سورة الملك: تبارك الذي بيده الملك وإحكام الخلق',
    titleEn: 'Al-Mulk: Sovereign Balance and Cosmic Design',
    tagAr: 'المنجية',
    tagEn: 'Protective Reminder',
    badgeColor: 'from-cyan-500 to-blue-600',
    conceptKeywords: ['بيده الملك', 'خلق الموت والحياة', 'سبع سماوات طباقا', 'زينة النجوم'],
  },
];
