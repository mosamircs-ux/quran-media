export interface SurahMeta {
  number: number;
  nameAr: string;
  nameEn: string;
  nameTranslation: string;
  revelationType: 'Meccan' | 'Medinan';
  versesCount: number;
}

export const ALL_SURAHS: SurahMeta[] = [
  { number: 1, nameAr: 'الفاتحة', nameEn: 'Al-Fatihah', nameTranslation: 'The Opening', revelationType: 'Meccan', versesCount: 7 },
  { number: 2, nameAr: 'البقرة', nameEn: 'Al-Baqarah', nameTranslation: 'The Cow', revelationType: 'Medinan', versesCount: 286 },
  { number: 3, nameAr: 'آل عمران', nameEn: 'Ali \'Imran', nameTranslation: 'Family of Imran', revelationType: 'Medinan', versesCount: 200 },
  { number: 4, nameAr: 'النساء', nameEn: 'An-Nisa', nameTranslation: 'The Women', revelationType: 'Medinan', versesCount: 176 },
  { number: 5, nameAr: 'المائدة', nameEn: 'Al-Ma\'idah', nameTranslation: 'The Table Spread', revelationType: 'Medinan', versesCount: 120 },
  { number: 6, nameAr: 'الأنعام', nameEn: 'Al-An\'am', nameTranslation: 'The Cattle', revelationType: 'Meccan', versesCount: 165 },
  { number: 7, nameAr: 'الأعراف', nameEn: 'Al-A\'raf', nameTranslation: 'The Heights', revelationType: 'Meccan', versesCount: 206 },
  { number: 8, nameAr: 'الأنفال', nameEn: 'Al-Anfal', nameTranslation: 'The Spoils of War', revelationType: 'Medinan', versesCount: 75 },
  { number: 9, nameAr: 'التوبة', nameEn: 'At-Tawbah', nameTranslation: 'The Repentance', revelationType: 'Medinan', versesCount: 129 },
  { number: 10, nameAr: 'يونس', nameEn: 'Yunus', nameTranslation: 'Jonah', revelationType: 'Meccan', versesCount: 109 },
  { number: 11, nameAr: 'هود', nameEn: 'Hud', nameTranslation: 'Hud', revelationType: 'Meccan', versesCount: 123 },
  { number: 12, nameAr: 'يوسف', nameEn: 'Yusuf', nameTranslation: 'Joseph', revelationType: 'Meccan', versesCount: 111 },
  { number: 13, nameAr: 'الرعد', nameEn: 'Ar-Ra\'d', nameTranslation: 'The Thunder', revelationType: 'Medinan', versesCount: 43 },
  { number: 14, nameAr: 'إبراهيم', nameEn: 'Ibrahim', nameTranslation: 'Abraham', revelationType: 'Meccan', versesCount: 52 },
  { number: 15, nameAr: 'الحجر', nameEn: 'Al-Hijr', nameTranslation: 'The Rocky Tract', revelationType: 'Meccan', versesCount: 99 },
  { number: 16, nameAr: 'النحل', nameEn: 'An-Nahl', nameTranslation: 'The Bee', revelationType: 'Meccan', versesCount: 128 },
  { number: 17, nameAr: 'الإسراء', nameEn: 'Al-Isra', nameTranslation: 'The Night Journey', revelationType: 'Meccan', versesCount: 111 },
  { number: 18, nameAr: 'الكهف', nameEn: 'Al-Kahf', nameTranslation: 'The Cave', revelationType: 'Meccan', versesCount: 110 },
  { number: 19, nameAr: 'مريم', nameEn: 'Maryam', nameTranslation: 'Mary', revelationType: 'Meccan', versesCount: 98 },
  { number: 20, nameAr: 'طه', nameEn: 'Taha', nameTranslation: 'Ta-Ha', revelationType: 'Meccan', versesCount: 135 },
  { number: 21, nameAr: 'الأنبياء', nameEn: 'Al-Anbiya', nameTranslation: 'The Prophets', revelationType: 'Meccan', versesCount: 112 },
  { number: 22, nameAr: 'الحج', nameEn: 'Al-Hajj', nameTranslation: 'The Pilgrimage', revelationType: 'Medinan', versesCount: 78 },
  { number: 23, nameAr: 'المؤمنون', nameEn: 'Al-Mu\'minun', nameTranslation: 'The Believers', revelationType: 'Meccan', versesCount: 118 },
  { number: 24, nameAr: 'النور', nameEn: 'An-Nur', nameTranslation: 'The Light', revelationType: 'Medinan', versesCount: 64 },
  { number: 25, nameAr: 'الفرقان', nameEn: 'Al-Furqan', nameTranslation: 'The Criterion', revelationType: 'Meccan', versesCount: 77 },
  { number: 26, nameAr: 'الشعراء', nameEn: 'Ash-Shu\'ara', nameTranslation: 'The Poets', revelationType: 'Meccan', versesCount: 227 },
  { number: 27, nameAr: 'النمل', nameEn: 'An-Naml', nameTranslation: 'The Ant', revelationType: 'Meccan', versesCount: 93 },
  { number: 28, nameAr: 'القصص', nameEn: 'Al-Qasas', nameTranslation: 'The Stories', revelationType: 'Meccan', versesCount: 88 },
  { number: 29, nameAr: 'العنكبوت', nameEn: 'Al-\'Ankabut', nameTranslation: 'The Spider', revelationType: 'Meccan', versesCount: 69 },
  { number: 30, nameAr: 'الروم', nameEn: 'Ar-Rum', nameTranslation: 'The Romans', revelationType: 'Meccan', versesCount: 60 },
  { number: 31, nameAr: 'لقمان', nameEn: 'Luqman', nameTranslation: 'Luqman', revelationType: 'Meccan', versesCount: 34 },
  { number: 32, nameAr: 'السجدة', nameEn: 'As-Sajdah', nameTranslation: 'The Prostration', revelationType: 'Meccan', versesCount: 30 },
  { number: 33, nameAr: 'الأحزاب', nameEn: 'Al-Ahzab', nameTranslation: 'The Combined Forces', revelationType: 'Medinan', versesCount: 73 },
  { number: 34, nameAr: 'سبأ', nameEn: 'Saba', nameTranslation: 'Sheba', revelationType: 'Meccan', versesCount: 54 },
  { number: 35, nameAr: 'فاطر', nameEn: 'Fatir', nameTranslation: 'Originator', revelationType: 'Meccan', versesCount: 45 },
  { number: 36, nameAr: 'يس', nameEn: 'Ya-Sin', nameTranslation: 'Ya-Sin', revelationType: 'Meccan', versesCount: 83 },
  { number: 37, nameAr: 'الصافات', nameEn: 'As-Saffat', nameTranslation: 'Those who set the Ranks', revelationType: 'Meccan', versesCount: 182 },
  { number: 38, nameAr: 'ص', nameEn: 'Sad', nameTranslation: 'The Letter "Saad"', revelationType: 'Meccan', versesCount: 88 },
  { number: 39, nameAr: 'الزمر', nameEn: 'Az-Zumar', nameTranslation: 'The Troops', revelationType: 'Meccan', versesCount: 75 },
  { number: 40, nameAr: 'غافر', nameEn: 'Ghafir', nameTranslation: 'The Forgiver', revelationType: 'Meccan', versesCount: 85 },
  { number: 55, nameAr: 'الرحمن', nameEn: 'Ar-Rahman', nameTranslation: 'The Beneficent', revelationType: 'Medinan', versesCount: 78 },
  { number: 56, nameAr: 'الواقعة', nameEn: 'Al-Waqi\'ah', nameTranslation: 'The Inevitable', revelationType: 'Meccan', versesCount: 96 },
  { number: 67, nameAr: 'الملك', nameEn: 'Al-Mulk', nameTranslation: 'The Sovereignty', revelationType: 'Meccan', versesCount: 30 },
  { number: 93, nameAr: 'الضحى', nameEn: 'Ad-Duha', nameTranslation: 'The Morning Hours', revelationType: 'Meccan', versesCount: 11 },
  { number: 94, nameAr: 'الشرح', nameEn: 'Ash-Sharh', nameTranslation: 'The Relief', revelationType: 'Meccan', versesCount: 8 },
  { number: 97, nameAr: 'القدر', nameEn: 'Al-Qadr', nameTranslation: 'The Power', revelationType: 'Meccan', versesCount: 5 },
  { number: 112, nameAr: 'الإخلاص', nameEn: 'Al-Ikhlas', nameTranslation: 'The Sincerity', revelationType: 'Meccan', versesCount: 4 },
  { number: 113, nameAr: 'الفلق', nameEn: 'Al-Falaq', nameTranslation: 'The Daybreak', revelationType: 'Meccan', versesCount: 5 },
  { number: 114, nameAr: 'الناس', nameEn: 'An-Nas', nameTranslation: 'Mankind', revelationType: 'Meccan', versesCount: 6 },
];

export function getSurahMeta(num: number): SurahMeta {
  const found = ALL_SURAHS.find((s) => s.number === num);
  if (found) return found;
  return {
    number: num,
    nameAr: `سورة ${num}`,
    nameEn: `Surah ${num}`,
    nameTranslation: `Surah ${num}`,
    revelationType: 'Meccan',
    versesCount: 50,
  };
}
