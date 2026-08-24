import { PrismaClient } from '../src/generated/client/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed...');

  // 1. Seed Key Surahs
  console.log('📖 Seeding Surahs...');
  const surahsData = [
    { number: 1, nameAr: 'الفاتحة', nameEn: 'Al-Fatihah', nameTranslation: 'The Opening', revelationType: 'Meccan', versesCount: 7, orderNumber: 5, bismillahPre: false },
    { number: 2, nameAr: 'البقرة', nameEn: 'Al-Baqarah', nameTranslation: 'The Cow', revelationType: 'Medinan', versesCount: 286, orderNumber: 87, bismillahPre: true },
    { number: 3, nameAr: 'آل عمران', nameEn: 'Ali \'Imran', nameTranslation: 'Family of Imran', revelationType: 'Medinan', versesCount: 200, orderNumber: 89, bismillahPre: true },
    { number: 12, nameAr: 'يوسف', nameEn: 'Yusuf', nameTranslation: 'Joseph', revelationType: 'Meccan', versesCount: 111, orderNumber: 53, bismillahPre: true },
    { number: 18, nameAr: 'الكهف', nameEn: 'Al-Kahf', nameTranslation: 'The Cave', revelationType: 'Meccan', versesCount: 110, orderNumber: 69, bismillahPre: true },
    { number: 19, nameAr: 'مريم', nameEn: 'Maryam', nameTranslation: 'Mary', revelationType: 'Meccan', versesCount: 98, orderNumber: 44, bismillahPre: true },
    { number: 20, nameAr: 'طه', nameEn: 'Taha', nameTranslation: 'Ta-Ha', revelationType: 'Meccan', versesCount: 135, orderNumber: 45, bismillahPre: true },
    { number: 36, nameAr: 'يس', nameEn: 'Ya-Sin', nameTranslation: 'Ya-Sin', revelationType: 'Meccan', versesCount: 83, orderNumber: 41, bismillahPre: true },
    { number: 55, nameAr: 'الرحمن', nameEn: 'Ar-Rahman', nameTranslation: 'The Beneficent', revelationType: 'Medinan', versesCount: 78, orderNumber: 97, bismillahPre: true },
    { number: 67, nameAr: 'الملك', nameEn: 'Al-Mulk', nameTranslation: 'The Sovereignty', revelationType: 'Meccan', versesCount: 30, orderNumber: 77, bismillahPre: true },
    { number: 93, nameAr: 'الضحى', nameEn: 'Ad-Duha', nameTranslation: 'The Morning Hours', revelationType: 'Meccan', versesCount: 11, orderNumber: 11, bismillahPre: true },
    { number: 94, nameAr: 'الشرح', nameEn: 'Ash-Sharh', nameTranslation: 'The Relief', revelationType: 'Meccan', versesCount: 8, orderNumber: 12, bismillahPre: true },
    { number: 97, nameAr: 'القدر', nameEn: 'Al-Qadr', nameTranslation: 'The Power', revelationType: 'Meccan', versesCount: 5, orderNumber: 25, bismillahPre: true },
    { number: 112, nameAr: 'الإخلاص', nameEn: 'Al-Ikhlas', nameTranslation: 'The Sincerity', revelationType: 'Meccan', versesCount: 4, orderNumber: 22, bismillahPre: true },
    { number: 113, nameAr: 'الفلق', nameEn: 'Al-Falaq', nameTranslation: 'The Daybreak', revelationType: 'Meccan', versesCount: 5, orderNumber: 20, bismillahPre: true },
    { number: 114, nameAr: 'الناس', nameEn: 'An-Nas', nameTranslation: 'Mankind', revelationType: 'Meccan', versesCount: 6, orderNumber: 21, bismillahPre: true },
  ];

  for (const s of surahsData) {
    await prisma.surah.upsert({
      where: { number: s.number },
      update: s,
      create: s,
    });
  }

  // 2. Seed Canonical Verified Verses
  console.log('📜 Seeding Verse Cache & Translations...');
  const sampleVerses = [
    {
      verseKey: '2:255',
      surahNumber: 2,
      verseNumber: 255,
      juzNumber: 3,
      hizbNumber: 5,
      rubElHizbNumber: 10,
      pageNumber: 42,
      textUthmani: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ ۚ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍۢ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ',
      textImlaei: 'الله لا إله إلا هو الحي القيوم لا تأخذه سنة ولا نوم له ما في السماوات وما في الأرض من ذا الذي يشفع عنده إلا بإذنه يعلم ما بين أيديهم وما خلفهم ولا يحيطون بشيء من علمه إلا بما شاء وسع كرسيه السماوات والأرض ولا يئوده حفظهما وهو العلي العظيم',
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002255.mp3',
      translationEn: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
      tafsirAr: 'هذه آية الكرسي ولها شأن عظيم، قد صح الحديث عن رسول الله صلى الله عليه وسلم بأنها أفضل آية في كتاب الله... {الله لا إله إلا هو} إخبار بأنه المنفرد بالإلهية لجميع الخلائق {الحي القيوم} الحي في نفسه الذي لا يموت أبداً، القيم لغيره، فجميع الموجودات مفتقرة إليه وهو غني عنها.',
    },
    {
      verseKey: '93:5',
      surahNumber: 93,
      verseNumber: 5,
      juzNumber: 30,
      hizbNumber: 60,
      rubElHizbNumber: 120,
      pageNumber: 596,
      textUthmani: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰٓ',
      textImlaei: 'ولسوف يعطيك ربك فترضى',
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/093005.mp3',
      translationEn: 'And your Lord is going to give you, and you will be satisfied.',
      tafsirAr: 'أي: في الدار الآخرة يعطيه حتى يرضيه في أمته، وفيما أعده له من الكرامة، ومن جملته نهر الكوثر الذي حافتاه قباب اللؤلؤ المجوف وطينه المسك الأذفر.',
    },
  ];

  for (const v of sampleVerses) {
    const verse = await prisma.verseCache.upsert({
      where: { verseKey: v.verseKey },
      update: {
        surahNumber: v.surahNumber,
        verseNumber: v.verseNumber,
        juzNumber: v.juzNumber,
        hizbNumber: v.hizbNumber,
        rubElHizbNumber: v.rubElHizbNumber,
        pageNumber: v.pageNumber,
        textUthmani: v.textUthmani,
        textImlaei: v.textImlaei,
        audioUrl: v.audioUrl,
      },
      create: {
        verseKey: v.verseKey,
        surahNumber: v.surahNumber,
        verseNumber: v.verseNumber,
        juzNumber: v.juzNumber,
        hizbNumber: v.hizbNumber,
        rubElHizbNumber: v.rubElHizbNumber,
        pageNumber: v.pageNumber,
        textUthmani: v.textUthmani,
        textImlaei: v.textImlaei,
        audioUrl: v.audioUrl,
      },
    });

    // Translation
    await prisma.translation.upsert({
      where: {
        verseKey_language_authorName: {
          verseKey: v.verseKey,
          language: 'en',
          authorName: 'Saheeh International',
        },
      },
      update: { text: v.translationEn },
      create: {
        verseKey: v.verseKey,
        language: 'en',
        authorName: 'Saheeh International',
        source: 'Verified Quran Complex',
        text: v.translationEn,
      },
    });

    // Tafsir
    await prisma.tafsir.upsert({
      where: {
        verseKey_slug: {
          verseKey: v.verseKey,
          slug: 'ibn-kathir',
        },
      },
      update: { text: v.tafsirAr },
      create: {
        verseKey: v.verseKey,
        slug: 'ibn-kathir',
        authorName: 'ابن كثير (Ibn Kathir)',
        language: 'ar',
        text: v.tafsirAr,
      },
    });
  }

  // 3. Seed Recitations
  console.log('🎙️ Seeding Murattal Recitations...');
  const recitersData = [
    { reciterId: 7, reciterNameAr: 'مشاري راشد العفاسي', reciterNameEn: 'Mishari Rashid Alafasy', style: 'Murattal', surahNumber: 1, audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001001.mp3', durationSeconds: 45.0 },
    { reciterId: 7, reciterNameAr: 'مشاري راشد العفاسي', reciterNameEn: 'Mishari Rashid Alafasy', style: 'Murattal', surahNumber: 2, audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002001.mp3', durationSeconds: 7200.0 },
    { reciterId: 2, reciterNameAr: 'عبد الباسط عبد الصمد', reciterNameEn: 'AbdulBaset AbdulSamad', style: 'Murattal', surahNumber: 1, audioUrl: 'https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/001001.mp3', durationSeconds: 52.0 },
  ];

  for (const r of recitersData) {
    await prisma.recitation.upsert({
      where: {
        reciterId_surahNumber_style: {
          reciterId: r.reciterId,
          surahNumber: r.surahNumber,
          style: r.style,
        },
      },
      update: r,
      create: r,
    });
  }

  // 4. Seed Official Media Templates
  console.log('🎨 Seeding 18 Official Media Templates...');
  const officialTemplates = [
    { templateId: 'minimal_quran', nameAr: 'المصحف البسيط', nameEn: 'Minimal Quran', category: 'minimal', supportedAspectRatios: ['9:16', '16:9', '1:1', '4:5'], config: { primaryColor: '#10b981', fontArabic: 'Amiri Quran' } },
    { templateId: 'cinematic_nature', nameAr: 'الطبيعة السينمائية', nameEn: 'Cinematic Nature', category: 'nature', supportedAspectRatios: ['9:16', '16:9', '1:1', '4:5'], config: { primaryColor: '#059669', fontArabic: 'Amiri Quran' } },
    { templateId: 'islamic_geometry', nameAr: 'الزخارف الإسلامية', nameEn: 'Islamic Geometry', category: 'islamic_art', supportedAspectRatios: ['9:16', '16:9', '1:1', '4:5'], config: { primaryColor: '#f59e0b', fontArabic: 'Traditional Arabic' } },
    { templateId: 'arabic_calligraphy', nameAr: 'الخط العربي الأصيل', nameEn: 'Arabic Calligraphy', category: 'islamic_art', supportedAspectRatios: ['9:16', '16:9', '1:1', '4:5'], config: { primaryColor: '#d97706', fontArabic: 'Scheherazade New' } },
    { templateId: 'night_reflection', nameAr: 'سكينة الليل', nameEn: 'Night Reflection', category: 'celestial', supportedAspectRatios: ['9:16', '16:9', '1:1', '4:5'], config: { primaryColor: '#38bdf8', fontArabic: 'Amiri Quran' } },
    { templateId: 'sunrise', nameAr: 'شروق الأمل', nameEn: 'Sunrise Glow', category: 'nature', supportedAspectRatios: ['9:16', '16:9', '1:1', '4:5'], config: { primaryColor: '#fbbf24', fontArabic: 'Amiri Quran' } },
    { templateId: 'ocean', nameAr: 'أعماق البحار', nameEn: 'Ocean Depths', category: 'nature', supportedAspectRatios: ['9:16', '16:9', '1:1', '4:5'], config: { primaryColor: '#06b6d4', fontArabic: 'Amiri Quran' } },
    { templateId: 'mountains', nameAr: 'شموخ الجبال', nameEn: 'Majestic Mountains', category: 'nature', supportedAspectRatios: ['9:16', '16:9', '1:1', '4:5'], config: { primaryColor: '#94a3b8', fontArabic: 'Amiri Quran' } },
    { templateId: 'desert', nameAr: 'رمال الصحراء', nameEn: 'Desert Dunes', category: 'nature', supportedAspectRatios: ['9:16', '16:9', '1:1', '4:5'], config: { primaryColor: '#f59e0b', fontArabic: 'Amiri Quran' } },
    { templateId: 'rain', nameAr: 'غيث الرحمة', nameEn: 'Gentle Rain', category: 'nature', supportedAspectRatios: ['9:16', '16:9', '1:1', '4:5'], config: { primaryColor: '#38bdf8', fontArabic: 'Amiri Quran' } },
    { templateId: 'stars', nameAr: 'مواقع النجوم', nameEn: 'Cosmic Stars', category: 'celestial', supportedAspectRatios: ['9:16', '16:9', '1:1', '4:5'], config: { primaryColor: '#c084fc', fontArabic: 'Amiri Quran' } },
    { templateId: 'mosque_architecture', nameAr: 'العمارة والمحاريب', nameEn: 'Mosque Architecture', category: 'islamic_art', supportedAspectRatios: ['9:16', '16:9', '1:1', '4:5'], config: { primaryColor: '#14b8a6', fontArabic: 'Traditional Arabic' } },
    { templateId: 'abstract_light', nameAr: 'النور التجريدي', nameEn: 'Abstract Light', category: 'celestial', supportedAspectRatios: ['9:16', '16:9', '1:1', '4:5'], config: { primaryColor: '#818cf8', fontArabic: 'Amiri Quran' } },
    { templateId: 'short_reminder', nameAr: 'تذكرة سريعة', nameEn: 'Short Reminder', category: 'social_media', supportedAspectRatios: ['9:16', '1:1', '4:5'], config: { primaryColor: '#f59e0b', fontArabic: 'Amiri Quran' } },
    { templateId: 'instagram_reel', nameAr: 'إنستغرام ريلز', nameEn: 'Instagram Reel', category: 'social_media', supportedAspectRatios: ['9:16', '4:5'], config: { primaryColor: '#fb7185', fontArabic: 'Amiri Quran' } },
    { templateId: 'tiktok', nameAr: 'تيك توك فائق الحركية', nameEn: 'TikTok Dynamic', category: 'social_media', supportedAspectRatios: ['9:16'], config: { primaryColor: '#22d3ee', fontArabic: 'Amiri Quran' } },
    { templateId: 'youtube_shorts', nameAr: 'يوتيوب شورتس', nameEn: 'YouTube Shorts', category: 'social_media', supportedAspectRatios: ['9:16'], config: { primaryColor: '#ef4444', fontArabic: 'Amiri Quran' } },
    { templateId: 'youtube_landscape', nameAr: 'يوتيوب الأفقي العريض', nameEn: 'YouTube Landscape 16:9', category: 'broadcast', supportedAspectRatios: ['16:9'], config: { primaryColor: '#10b981', fontArabic: 'Amiri Quran' } },
  ];

  for (const t of officialTemplates) {
    await prisma.mediaTemplate.upsert({
      where: { templateId: t.templateId },
      update: t,
      create: {
        templateId: t.templateId,
        nameAr: t.nameAr,
        nameEn: t.nameEn,
        category: t.category,
        supportedAspectRatios: t.supportedAspectRatios,
        config: t.config,
        isOfficial: true,
        isCustom: false,
      },
    });
  }

  // 5. Seed Demo User & Projects
  console.log('👤 Seeding Demo Pro Creator & Workspace...');
  const demoUser = await prisma.user.upsert({
    where: { email: 'creator@quranmedia.studio' },
    update: {
      name: 'محمد القاسمي',
      role: 'CREATOR',
      locale: 'ar',
      preferredReciter: 7,
    },
    create: {
      email: 'creator@quranmedia.studio',
      name: 'محمد القاسمي',
      role: 'CREATOR',
      locale: 'ar',
      preferredReciter: 7,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });

  // Seed User Subscription
  await prisma.subscription.upsert({
    where: { userId: demoUser.id },
    update: { plan: 'CREATOR_PRO', status: 'ACTIVE' },
    create: {
      userId: demoUser.id,
      plan: 'CREATOR_PRO',
      status: 'ACTIVE',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // Seed Project
  const demoProject = await prisma.mediaProject.create({
    data: {
      userId: demoUser.id,
      title: 'آية الكرسي — تلاوة مرئية خاشعة',
      description: 'إنتاج مرئي سينمائي لآية الكرسي مع تمييز الكلمات بالذهب والترجمة الإنجليزية',
      status: 'COMPLETED',
      aspectRatio: 'RATIO_9_16',
      resolution: '1080p',
      fps: 30,
      isPublic: true,
      config: {
        id: 'proj-ayat-alkursi',
        title: 'آية الكرسي — تلاوة مرئية خاشعة',
        aspectRatio: '9:16',
        resolution: '1080p',
        fps: 30,
      },
    },
  });

  // Seed Project Scene
  await prisma.mediaScene.create({
    data: {
      projectId: demoProject.id,
      sceneNumber: 1,
      duration: 24.0,
      verseKey: '2:255',
      backgroundConfig: { type: 'animated_gradient', gradientColors: ['#064e3b', '#0f172a', '#020617'] },
      cameraMotion: { effect: 'zoom_in', intensity: 0.12 },
      transitionConfig: { type: 'crossfade', duration: 1.0 },
      orderNumber: 1,
    },
  });

  // Seed User Bookmark
  await prisma.bookmark.upsert({
    where: {
      userId_verseKey: {
        userId: demoUser.id,
        verseKey: '2:255',
      },
    },
    update: {},
    create: {
      userId: demoUser.id,
      verseKey: '2:255',
      notes: 'آية الكرسي — أعظم آية في كتاب الله تعالى',
    },
  });

  console.log('✅ PostgreSQL Schema & Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
