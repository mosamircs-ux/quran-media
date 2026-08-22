import type { Chapter, Verse, Reciter, TranslationResource, TafsirResource } from '../types/index.js';
import { CANONICAL_SURAHS } from '../validation/canonical-bounds.js';

export const FALLBACK_CHAPTERS: Chapter[] = CANONICAL_SURAHS.map((s) => ({
  id: s.id,
  revelationPlace: s.revelationPlace,
  revelationOrder: s.id,
  bismillahPre: s.id !== 1 && s.id !== 9,
  nameSimple: s.nameEn,
  nameComplex: s.nameEn,
  nameArabic: s.nameAr,
  versesCount: s.versesCount,
  pages: [1, 604],
  translatedName: {
    languageName: 'english',
    name: s.nameEn,
  },
}));

export const FALLBACK_RECITERS: Reciter[] = [
  { id: 7, name: 'Mishari Rashid al-`Afasy', arabicName: 'مشاري راشد العفاسي', style: 'Murattal' },
  { id: 1, name: 'Mahmoud Khalil Al-Husary', arabicName: 'محمود خليل الحصري', style: 'Murattal' },
  { id: 2, name: 'AbdulBaset AbdulSamad', arabicName: 'عبد الباسط عبد الصمد', style: 'Mujawwad' },
  { id: 3, name: 'Abdur-Rahman as-Sudais', arabicName: 'عبد الرحمن السديس', style: 'Murattal' },
  { id: 4, name: 'Abu Bakr al-Shatri', arabicName: 'أبو بكر الشاطري', style: 'Murattal' },
  { id: 5, name: 'Hani ar-Rifai', arabicName: 'هاني الرفاعي', style: 'Murattal' },
  { id: 6, name: 'Saad al-Ghamdi', arabicName: 'سعد الغامدي', style: 'Murattal' },
];

export const FALLBACK_TRANSLATIONS: TranslationResource[] = [
  { id: 131, name: 'Dr. Mustafa Khattab (The Clear Quran)', authorName: 'Mustafa Khattab', languageName: 'english', direction: 'ltr' },
  { id: 20, name: 'Saheeh International', authorName: 'Saheeh International', languageName: 'english', direction: 'ltr' },
  { id: 84, name: 'Mufti Taqi Usmani', authorName: 'Taqi Usmani', languageName: 'english', direction: 'ltr' },
  { id: 19, name: 'Pickthall', authorName: 'Mohammed Marmaduke William Pickthall', languageName: 'english', direction: 'ltr' },
];

export const FALLBACK_TAFSIRS: TafsirResource[] = [
  { id: 16, name: 'Tafsir Ibn Kathir', authorName: 'Ibn Kathir', languageName: 'english', slug: 'en-tafisr-ibn-kathir' },
  { id: 169, name: 'Tafsir Al-Saadi', authorName: 'Abdur-Rahman as-Sa\'di', languageName: 'arabic', slug: 'ar-tafsir-as-saadi' },
  { id: 14, name: 'Tafsir Al-Muyassar', authorName: 'King Fahd Complex', languageName: 'arabic', slug: 'ar-tafsir-muyassar' },
  { id: 171, name: 'Tafsir Al-Tabari', authorName: 'Ibn Jarir al-Tabari', languageName: 'arabic', slug: 'ar-tafsir-al-tabari' },
];

export const FALLBACK_KEY_VERSES: Record<string, Verse> = {
  '1:1': {
    id: 1,
    chapterId: 1,
    verseNumber: 1,
    verseKey: '1:1',
    hizbNumber: 1,
    rubElHizbNumber: 1,
    rukuNumber: 1,
    manzilNumber: 1,
    sajdahNumber: null,
    textUthmani: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    textSimple: 'بسم الله الرحمن الرحيم',
    transliteration: 'Bismillāhir-raḥmānir-raḥīm',
    translations: [
      { id: 101, resourceId: 131, text: 'In the Name of Allah—the Most Compassionate, Most Merciful.' },
    ],
    audio: {
      url: 'https://audio.qurancdn.com/Alafasy/mp3/001001.mp3',
      duration: 5,
    },
  },
  '2:255': {
    id: 262,
    chapterId: 2,
    verseNumber: 255,
    verseKey: '2:255',
    hizbNumber: 5,
    rubElHizbNumber: 17,
    rukuNumber: 35,
    manzilNumber: 1,
    sajdahNumber: null,
    textUthmani: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ ۚ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍۢ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ',
    textSimple: 'الله لا إله إلا هو الحي القيوم لا تأخذه سنة ولا نوم له ما في السماوات وما في الأرض من ذا الذي يشفع عنده إلا بإذنه يعلم ما بين أيديهم وما خلفهم ولا يحيطون بشيء من علمه إلا بما شاء وسع كرسيه السماوات والأرض ولا يئوده حفظهما وهو العلي العظيم',
    transliteration: 'Allāhu lā ilāha illā huwal-ḥayyul-qayyūm, lā ta\'khudhuhū sinatuw-wa lā nawm, lahū mā fis-samāwāti wa mā fil-arḍ, man dhal-ladhī yashfa\'u \'indahū illā bi\'idhnih, ya\'lamu mā bayna aydīhim wa mā khalfahum, wa lā yuḥīṭūna bishay\'im-min \'ilmihī illā bimā shā\', wasi\'a kursiyyuhus-samāwāti wal-arḍ, wa lā ya\'ūduhū ḥifẓuhumā, wa huwal-\'aliyyul-\'aẓīm',
    translations: [
      { id: 102, resourceId: 131, text: 'Allah! There is no god ˹worthy of worship˺ except Him, the Ever-Living, All-Sustaining. Neither drowsiness nor sleep overtakes Him. To Him belongs whatever is in the heavens and whatever is on the earth. Who could possibly intercede with Him without His permission? He ˹fully˺ knows what is ahead of them and what is behind them, but no one can encompass any of His knowledge except what He wills. His Seat encompasses the heavens and the earth, and the preservation of both does not tire Him. For He is the Most High, the Greatest.' },
    ],
    audio: {
      url: 'https://audio.qurancdn.com/Alafasy/mp3/002255.mp3',
      duration: 45,
    },
  },
  '36:1': {
    id: 3706,
    chapterId: 36,
    verseNumber: 1,
    verseKey: '36:1',
    hizbNumber: 45,
    rubElHizbNumber: 177,
    rukuNumber: 382,
    manzilNumber: 5,
    sajdahNumber: null,
    textUthmani: 'يسٓ',
    textSimple: 'يس',
    transliteration: 'Yā-Sīn',
    translations: [
      { id: 103, resourceId: 131, text: 'Yâ-Sĩn.' },
    ],
    audio: {
      url: 'https://audio.qurancdn.com/Alafasy/mp3/036001.mp3',
      duration: 3,
    },
  },
};
