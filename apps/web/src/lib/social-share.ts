import { SITE_BASE_URL } from './seo';

export interface SocialShareData {
  id: string;
  title: string;
  surahNumber: number;
  ayahStart: number;
  ayahEnd?: number;
  surahNameAr: string;
  surahNameEn: string;
  verseKey: string;
  textUthmani: string;
  translationEn: string;
  tafsirSummary?: string;
  reciterName: string;
  durationSeconds: number;
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:5';
  resolution: string; // "1080x1920"
  videoUrl: string;
  thumbnailUrl: string;
  hashtags: string[];
}

export const SAMPLE_SHARES: Record<string, SocialShareData> = {
  'proj-ayat-alkursi': {
    id: 'proj-ayat-alkursi',
    title: 'آية الكرسي — تلاوة مرئية خاشعة',
    surahNumber: 2,
    ayahStart: 255,
    surahNameAr: 'البقرة',
    surahNameEn: 'Al-Baqarah',
    verseKey: '2:255',
    textUthmani: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ ۚ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍۢ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ',
    translationEn: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth.',
    tafsirSummary: 'أعظم آية في كتاب الله تعالى، تشتمل على عشر جمل مستقلة في توحيد الله وعظمته وقدرته وسعة كرسيه.',
    reciterName: 'مشاري راشد العفاسي (Mishari Rashid Alafasy)',
    durationSeconds: 24,
    aspectRatio: '9:16',
    resolution: '1080x1920',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1080&h=1920&auto=format&fit=crop&q=80',
    hashtags: ['#Quran', '#AyatAlKursi', '#SurahBaqarah', '#QuranRecitation', '#Islam', '#IslamicReminders', '#تلاوة_خاشعة', '#آية_الكرسي', '#قرآن_كريم'],
  },
  'share-duha-01': {
    id: 'share-duha-01',
    title: 'سورة الضحى — ولسوف يعطيك ربك فترضى',
    surahNumber: 93,
    ayahStart: 1,
    ayahEnd: 5,
    surahNameAr: 'الضحى',
    surahNameEn: 'Ad-Duha',
    verseKey: '93:1-5',
    textUthmani: 'وَٱلضُّحَىٰ ﴿١﴾ وَٱلَّيْلِ إِذَا سَجَىٰ ﴿٢﴾ مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ ﴿٣﴾ وَلَلْـَٔاخِرَةُ خَيْرٌۭ لَّكَ مِنَ ٱلْأُولَىٰ ﴿٤﴾ وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ ﴿٥﴾',
    translationEn: 'By the morning brightness and by the night when it grows still, your Lord has not forsaken you, nor is He displeased. And the Hereafter is better for you than the first [life]. And your Lord is going to give you, and you will be satisfied.',
    tafsirSummary: 'سورة تسلية للقلوب وبشارة النبي صلى الله عليه وسلم برضا ربه وإكرامه في الدنيا والآخرة.',
    reciterName: 'عبد الباسط عبد الصمد (AbdulBaset AbdulSamad)',
    durationSeconds: 32,
    aspectRatio: '9:16',
    resolution: '1080x1920',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1080&h=1920&auto=format&fit=crop&q=80',
    hashtags: ['#SurahDuha', '#Quran', '#Hope', '#Patience', '#IslamicShorts', '#سورة_الضحى', '#طمأنينة', '#قرآن'],
  },
  'share-rahman-01': {
    id: 'share-rahman-01',
    title: 'سورة الرحمن — عروس القرآن',
    surahNumber: 55,
    ayahStart: 1,
    ayahEnd: 13,
    surahNameAr: 'الرحمن',
    surahNameEn: 'Ar-Rahman',
    verseKey: '55:1-13',
    textUthmani: 'ٱلرَّحْمَٰنُ ﴿١﴾ عَلَّمَ ٱلْقُرْءَانَ ﴿٢﴾ خَلَقَ ٱلْإِنسَٰنَ ﴿٣﴾ عَلَّمَهُ ٱلْبَيَانَ ﴿٤﴾',
    translationEn: 'The Most Merciful. Taught the Quran. Created man. Taught him eloquence.',
    tafsirSummary: 'بيان نعم الله العظيمة وآلائه الجليلة على الثقلين الإنس والجن.',
    reciterName: 'مشاري راشد العفاسي (Mishari Rashid Alafasy)',
    durationSeconds: 40,
    aspectRatio: '9:16',
    resolution: '1080x1920',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1080&h=1920&auto=format&fit=crop&q=80',
    hashtags: ['#ArRahman', '#Quran', '#Mercy', '#Nature', '#QuranReels', '#سورة_الرحمن', '#قرآن_كريم'],
  },
};

/**
 * Platform-specific Social Copy & Direct Share Intent Generators
 */
export function generateSocialCopy(share: SocialShareData, locale: string) {
  const shareUrl = `${SITE_BASE_URL}/${locale}/share/${share.id}`;
  const isAr = locale === 'ar';

  const defaultHashtags = share.hashtags.join(' ');

  // 1. Instagram Reels Caption
  const instagramCaption = `✨ ${share.title}
📖 ${isAr ? `سورة ${share.surahNameAr}` : `Surah ${share.surahNameEn}`} [${share.verseKey}]
🎙️ ${share.reciterName}

"${share.translationEn.substring(0, 180)}..."

🎥 Produced with Quran Media Studio
🔗 Watch HD video & create your own version: ${shareUrl}

${defaultHashtags} #Reels #IslamicReels`;

  // 2. TikTok Description
  const tiktokDescription = `✨ ${isAr ? `سورة ${share.surahNameAr}` : `Surah ${share.surahNameEn}`} (${share.verseKey}) | ${share.reciterName} 🌙
"${share.translationEn.substring(0, 100)}..." 
${share.hashtags.slice(0, 5).join(' ')} #FYP #Quran #MuslimTikTok`;

  // 3. YouTube Shorts Title & Description
  const youtubeShortsTitle = `${share.title} | Quran ${share.verseKey} #Shorts`;
  const youtubeShortsDescription = `Listen to this visual recitation of Surah ${share.surahNameEn} (${share.verseKey}) recited by ${share.reciterName}.

Quran Arabic Text:
${share.textUthmani}

English Translation:
${share.translationEn}

Create your own Quran video in 9:16 & 4K:
${shareUrl}

#Shorts #Quran #IslamicShorts ${defaultHashtags}`;

  // 4. X (Twitter) Tweet Intent
  const tweetText = `✨ ${share.title} (Quran ${share.verseKey})
🎙️ ${share.reciterName}

"${share.translationEn.substring(0, 120)}..."

${shareUrl}
${share.hashtags.slice(0, 3).join(' ')}`;

  const twitterIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  // 5. WhatsApp Share Intent
  const whatsappText = `*${share.title}*
📖 _Surah ${share.surahNameEn} [${share.verseKey}]_
🎙️ _${share.reciterName}_

"${share.translationEn}"

▶️ *Watch HD Video & Create Yours:*
${shareUrl}`;

  const whatsappIntent = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`;

  // 6. Telegram Share Intent
  const telegramText = `**${share.title}** (Quran ${share.verseKey})
${share.translationEn}

Recitation by ${share.reciterName}`;

  const telegramIntent = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(telegramText)}`;

  // 7. Facebook Share Intent
  const facebookIntent = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  return {
    shareUrl,
    instagramCaption,
    tiktokDescription,
    youtubeShortsTitle,
    youtubeShortsDescription,
    twitterIntent,
    whatsappIntent,
    telegramIntent,
    facebookIntent,
    hashtags: defaultHashtags,
  };
}
