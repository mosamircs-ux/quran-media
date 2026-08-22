/**
 * Canonical Quran Surah Metadata & Verse Counts (Total: 114 Surahs, 6,236 Verses).
 * Used for zero-latency, strict client-input validation before making any external API calls.
 */

export interface CanonicalSurahMeta {
  id: number;
  nameAr: string;
  nameEn: string;
  versesCount: number;
  revelationPlace: 'makkah' | 'madinah';
}

export const CANONICAL_SURAHS: readonly CanonicalSurahMeta[] = [
  { id: 1, nameAr: 'الفاتحة', nameEn: 'Al-Fatihah', versesCount: 7, revelationPlace: 'makkah' },
  { id: 2, nameAr: 'البقرة', nameEn: 'Al-Baqarah', versesCount: 286, revelationPlace: 'madinah' },
  { id: 3, nameAr: 'آل عمران', nameEn: 'Ali \'Imran', versesCount: 200, revelationPlace: 'madinah' },
  { id: 4, nameAr: 'النساء', nameEn: 'An-Nisa', versesCount: 176, revelationPlace: 'madinah' },
  { id: 5, nameAr: 'المائدة', nameEn: 'Al-Ma\'idah', versesCount: 120, revelationPlace: 'madinah' },
  { id: 6, nameAr: 'الأنعام', nameEn: 'Al-An\'am', versesCount: 165, revelationPlace: 'makkah' },
  { id: 7, nameAr: 'الأعراف', nameEn: 'Al-A\'raf', versesCount: 206, revelationPlace: 'makkah' },
  { id: 8, nameAr: 'الأنفال', nameEn: 'Al-Anfal', versesCount: 75, revelationPlace: 'madinah' },
  { id: 9, nameAr: 'التوبة', nameEn: 'At-Tawbah', versesCount: 129, revelationPlace: 'madinah' },
  { id: 10, nameAr: 'يونس', nameEn: 'Yunus', versesCount: 109, revelationPlace: 'makkah' },
  { id: 11, nameAr: 'هود', nameEn: 'Hud', versesCount: 123, revelationPlace: 'makkah' },
  { id: 12, nameAr: 'يوسف', nameEn: 'Yusuf', versesCount: 111, revelationPlace: 'makkah' },
  { id: 13, nameAr: 'الرعد', nameEn: 'Ar-Ra\'d', versesCount: 43, revelationPlace: 'madinah' },
  { id: 14, nameAr: 'إبراهيم', nameEn: 'Ibrahim', versesCount: 52, revelationPlace: 'makkah' },
  { id: 15, nameAr: 'الحجر', nameEn: 'Al-Hijr', versesCount: 99, revelationPlace: 'makkah' },
  { id: 16, nameAr: 'النحل', nameEn: 'An-Nahl', versesCount: 128, revelationPlace: 'makkah' },
  { id: 17, nameAr: 'الإسراء', nameEn: 'Al-Isra', versesCount: 111, revelationPlace: 'makkah' },
  { id: 18, nameAr: 'الكهف', nameEn: 'Al-Kahf', versesCount: 110, revelationPlace: 'makkah' },
  { id: 19, nameAr: 'مريم', nameEn: 'Maryam', versesCount: 98, revelationPlace: 'makkah' },
  { id: 20, nameAr: 'طه', nameEn: 'Taha', versesCount: 135, revelationPlace: 'makkah' },
  { id: 21, nameAr: 'الأنبياء', nameEn: 'Al-Anbiya', versesCount: 112, revelationPlace: 'makkah' },
  { id: 22, nameAr: 'الحج', nameEn: 'Al-Hajj', versesCount: 78, revelationPlace: 'madinah' },
  { id: 23, nameAr: 'المؤمنون', nameEn: 'Al-Mu\'minun', versesCount: 118, revelationPlace: 'makkah' },
  { id: 24, nameAr: 'النور', nameEn: 'An-Nur', versesCount: 64, revelationPlace: 'madinah' },
  { id: 25, nameAr: 'الفرقان', nameEn: 'Al-Furqan', versesCount: 77, revelationPlace: 'makkah' },
  { id: 26, nameAr: 'الشعراء', nameEn: 'Ash-Shu\'ara', versesCount: 227, revelationPlace: 'makkah' },
  { id: 27, nameAr: 'النمل', nameEn: 'An-Naml', versesCount: 93, revelationPlace: 'makkah' },
  { id: 28, nameAr: 'القصص', nameEn: 'Al-Qasas', versesCount: 88, revelationPlace: 'makkah' },
  { id: 29, nameAr: 'العنكبوت', nameEn: 'Al-\'Ankabut', versesCount: 69, revelationPlace: 'makkah' },
  { id: 30, nameAr: 'الروم', nameEn: 'Ar-Rum', versesCount: 60, revelationPlace: 'makkah' },
  { id: 31, nameAr: 'لقمان', nameEn: 'Luqman', versesCount: 34, revelationPlace: 'makkah' },
  { id: 32, nameAr: 'السجدة', nameEn: 'As-Sajdah', versesCount: 30, revelationPlace: 'makkah' },
  { id: 33, nameAr: 'الأحزاب', nameEn: 'Al-Ahzab', versesCount: 73, revelationPlace: 'madinah' },
  { id: 34, nameAr: 'سبأ', nameEn: 'Saba', versesCount: 54, revelationPlace: 'makkah' },
  { id: 35, nameAr: 'فاطر', nameEn: 'Fatir', versesCount: 45, revelationPlace: 'makkah' },
  { id: 36, nameAr: 'يس', nameEn: 'Ya-Sin', versesCount: 83, revelationPlace: 'makkah' },
  { id: 37, nameAr: 'الصافات', nameEn: 'As-Saffat', versesCount: 182, revelationPlace: 'makkah' },
  { id: 38, nameAr: 'ص', nameEn: 'Sad', versesCount: 88, revelationPlace: 'makkah' },
  { id: 39, nameAr: 'الزمر', nameEn: 'Az-Zumar', versesCount: 75, revelationPlace: 'makkah' },
  { id: 40, nameAr: 'غافر', nameEn: 'Ghafir', versesCount: 85, revelationPlace: 'makkah' },
  { id: 41, nameAr: 'فصلت', nameEn: 'Fussilat', versesCount: 54, revelationPlace: 'makkah' },
  { id: 42, nameAr: 'الشورى', nameEn: 'Ash-Shuraa', versesCount: 53, revelationPlace: 'makkah' },
  { id: 43, nameAr: 'الزخرف', nameEn: 'Az-Zukhruf', versesCount: 89, revelationPlace: 'makkah' },
  { id: 44, nameAr: 'الدخان', nameEn: 'Ad-Dukhan', versesCount: 59, revelationPlace: 'makkah' },
  { id: 45, nameAr: 'الجاثية', nameEn: 'Al-Jathiyah', versesCount: 37, revelationPlace: 'makkah' },
  { id: 46, nameAr: 'الأحقاف', nameEn: 'Al-Ahqaf', versesCount: 35, revelationPlace: 'makkah' },
  { id: 47, nameAr: 'محمد', nameEn: 'Muhammad', versesCount: 38, revelationPlace: 'madinah' },
  { id: 48, nameAr: 'الفتح', nameEn: 'Al-Fath', versesCount: 29, revelationPlace: 'madinah' },
  { id: 49, nameAr: 'الحجرات', nameEn: 'Al-Hujurat', versesCount: 18, revelationPlace: 'madinah' },
  { id: 50, nameAr: 'ق', nameEn: 'Qaf', versesCount: 45, revelationPlace: 'makkah' },
  { id: 51, nameAr: 'الذاريات', nameEn: 'Adh-Dhariyat', versesCount: 60, revelationPlace: 'makkah' },
  { id: 52, nameAr: 'الطور', nameEn: 'At-Tur', versesCount: 49, revelationPlace: 'makkah' },
  { id: 53, nameAr: 'النجم', nameEn: 'An-Najm', versesCount: 62, revelationPlace: 'makkah' },
  { id: 54, nameAr: 'القمر', nameEn: 'Al-Qamar', versesCount: 55, revelationPlace: 'makkah' },
  { id: 55, nameAr: 'الرحمن', nameEn: 'Ar-Rahman', versesCount: 78, revelationPlace: 'madinah' },
  { id: 56, nameAr: 'الواقعة', nameEn: 'Al-Waqi\'ah', versesCount: 96, revelationPlace: 'makkah' },
  { id: 57, nameAr: 'الحديد', nameEn: 'Al-Hadid', versesCount: 29, revelationPlace: 'madinah' },
  { id: 58, nameAr: 'المجادلة', nameEn: 'Al-Mujadila', versesCount: 22, revelationPlace: 'madinah' },
  { id: 59, nameAr: 'الحشر', nameEn: 'Al-Hashr', versesCount: 24, revelationPlace: 'madinah' },
  { id: 60, nameAr: 'الممتحنة', nameEn: 'Al-Mumtahanah', versesCount: 13, revelationPlace: 'madinah' },
  { id: 61, nameAr: 'الصف', nameEn: 'As-Saf', versesCount: 14, revelationPlace: 'madinah' },
  { id: 62, nameAr: 'الجمعة', nameEn: 'Al-Jumu\'ah', versesCount: 11, revelationPlace: 'madinah' },
  { id: 63, nameAr: 'المنافقون', nameEn: 'Al-Munafiqun', versesCount: 11, revelationPlace: 'madinah' },
  { id: 64, nameAr: 'التغابن', nameEn: 'At-Taghabun', versesCount: 18, revelationPlace: 'madinah' },
  { id: 65, nameAr: 'الطلاق', nameEn: 'At-Talaq', versesCount: 12, revelationPlace: 'madinah' },
  { id: 66, nameAr: 'التحريم', nameEn: 'At-Tahrim', versesCount: 12, revelationPlace: 'madinah' },
  { id: 67, nameAr: 'الملك', nameEn: 'Al-Mulk', versesCount: 30, revelationPlace: 'makkah' },
  { id: 68, nameAr: 'القلم', nameEn: 'Al-Qalam', versesCount: 52, revelationPlace: 'makkah' },
  { id: 69, nameAr: 'الحاقة', nameEn: 'Al-Haqqah', versesCount: 52, revelationPlace: 'makkah' },
  { id: 70, nameAr: 'المعارج', nameEn: 'Al-Ma\'arij', versesCount: 44, revelationPlace: 'makkah' },
  { id: 71, nameAr: 'نوح', nameEn: 'Nuh', versesCount: 28, revelationPlace: 'makkah' },
  { id: 72, nameAr: 'الجن', nameEn: 'Al-Jinn', versesCount: 28, revelationPlace: 'makkah' },
  { id: 73, nameAr: 'المزمل', nameEn: 'Al-Muzzammil', versesCount: 20, revelationPlace: 'makkah' },
  { id: 74, nameAr: 'المدثر', nameEn: 'Al-Muddaththir', versesCount: 56, revelationPlace: 'makkah' },
  { id: 75, nameAr: 'القيامة', nameEn: 'Al-Qiyamah', versesCount: 40, revelationPlace: 'makkah' },
  { id: 76, nameAr: 'الإنسان', nameEn: 'Al-Insan', versesCount: 31, revelationPlace: 'madinah' },
  { id: 77, nameAr: 'المرسلات', nameEn: 'Al-Mursalat', versesCount: 50, revelationPlace: 'makkah' },
  { id: 78, nameAr: 'النبأ', nameEn: 'An-Naba', versesCount: 40, revelationPlace: 'makkah' },
  { id: 79, nameAr: 'النازعات', nameEn: 'An-Nazi\'at', versesCount: 46, revelationPlace: 'makkah' },
  { id: 80, nameAr: 'عبس', nameEn: '\'Abasa', versesCount: 42, revelationPlace: 'makkah' },
  { id: 81, nameAr: 'التكوير', nameEn: 'At-Takwir', versesCount: 29, revelationPlace: 'makkah' },
  { id: 82, nameAr: 'الانفطار', nameEn: 'Al-Infitar', versesCount: 19, revelationPlace: 'makkah' },
  { id: 83, nameAr: 'المطففين', nameEn: 'Al-Mutaffifin', versesCount: 36, revelationPlace: 'makkah' },
  { id: 84, nameAr: 'الانشقاق', nameEn: 'Al-Inshiqaq', versesCount: 25, revelationPlace: 'makkah' },
  { id: 85, nameAr: 'البروج', nameEn: 'Al-Buruj', versesCount: 22, revelationPlace: 'makkah' },
  { id: 86, nameAr: 'الطارق', nameEn: 'At-Tariq', versesCount: 17, revelationPlace: 'makkah' },
  { id: 87, nameAr: 'الأعلى', nameEn: 'Al-A\'la', versesCount: 19, revelationPlace: 'makkah' },
  { id: 88, nameAr: 'الغاشية', nameEn: 'Al-Ghashiyah', versesCount: 26, revelationPlace: 'makkah' },
  { id: 89, nameAr: 'الفجر', nameEn: 'Al-Fajr', versesCount: 30, revelationPlace: 'makkah' },
  { id: 90, nameAr: 'البلد', nameEn: 'Al-Balad', versesCount: 20, revelationPlace: 'makkah' },
  { id: 91, nameAr: 'الشمس', nameEn: 'Ash-Shams', versesCount: 15, revelationPlace: 'makkah' },
  { id: 92, nameAr: 'الليل', nameEn: 'Al-Layl', versesCount: 21, revelationPlace: 'makkah' },
  { id: 93, nameAr: 'الضحى', nameEn: 'Ad-Duhaa', versesCount: 11, revelationPlace: 'makkah' },
  { id: 94, nameAr: 'الشرح', nameEn: 'Ash-Sharh', versesCount: 8, revelationPlace: 'makkah' },
  { id: 95, nameAr: 'التين', nameEn: 'At-Tin', versesCount: 8, revelationPlace: 'makkah' },
  { id: 96, nameAr: 'العلق', nameEn: 'Al-\'Alaq', versesCount: 19, revelationPlace: 'makkah' },
  { id: 97, nameAr: 'القدر', nameEn: 'Al-Qadr', versesCount: 5, revelationPlace: 'makkah' },
  { id: 98, nameAr: 'البينة', nameEn: 'Al-Bayyinah', versesCount: 8, revelationPlace: 'madinah' },
  { id: 99, nameAr: 'الزلزلة', nameEn: 'Az-Zalzalah', versesCount: 8, revelationPlace: 'madinah' },
  { id: 100, nameAr: 'العاديات', nameEn: 'Al-\'Adiyat', versesCount: 11, revelationPlace: 'makkah' },
  { id: 101, nameAr: 'القارعة', nameEn: 'Al-Qari\'ah', versesCount: 11, revelationPlace: 'makkah' },
  { id: 102, nameAr: 'التكاثر', nameEn: 'At-Takathur', versesCount: 8, revelationPlace: 'makkah' },
  { id: 103, nameAr: 'العصر', nameEn: 'Al-\'Asr', versesCount: 3, revelationPlace: 'makkah' },
  { id: 104, nameAr: 'الهمزة', nameEn: 'Al-Humazah', versesCount: 9, revelationPlace: 'makkah' },
  { id: 105, nameAr: 'الفيل', nameEn: 'Al-Fil', versesCount: 5, revelationPlace: 'makkah' },
  { id: 106, nameAr: 'قريش', nameEn: 'Quraysh', versesCount: 4, revelationPlace: 'makkah' },
  { id: 107, nameAr: 'الماعون', nameEn: 'Al-Ma\'un', versesCount: 7, revelationPlace: 'makkah' },
  { id: 108, nameAr: 'الكوثر', nameEn: 'Al-Kawthar', versesCount: 3, revelationPlace: 'makkah' },
  { id: 109, nameAr: 'الكافرون', nameEn: 'Al-Kafirun', versesCount: 6, revelationPlace: 'makkah' },
  { id: 110, nameAr: 'النصر', nameEn: 'An-Nasr', versesCount: 3, revelationPlace: 'madinah' },
  { id: 111, nameAr: 'المسد', nameEn: 'Al-Masad', versesCount: 5, revelationPlace: 'makkah' },
  { id: 112, nameAr: 'الإخلاص', nameEn: 'Al-Ikhlas', versesCount: 4, revelationPlace: 'makkah' },
  { id: 113, nameAr: 'الفلق', nameEn: 'Al-Falaq', versesCount: 5, revelationPlace: 'makkah' },
  { id: 114, nameAr: 'الناس', nameEn: 'An-Nas', versesCount: 6, revelationPlace: 'makkah' },
];

export const TOTAL_SURAHS = 114;
export const TOTAL_AYAHS = 6236;

const surahMap = new Map<number, CanonicalSurahMeta>(
  CANONICAL_SURAHS.map((s) => [s.id, s])
);

export function getCanonicalSurah(surahId: number): CanonicalSurahMeta | undefined {
  return surahMap.get(surahId);
}

export function isValidSurahId(surahId: number): boolean {
  return Number.isInteger(surahId) && surahId >= 1 && surahId <= TOTAL_SURAHS;
}
