export interface StorySlide {
  slideNumber: number;
  titleAr: string;
  titleEn: string;
  arabicText: string;
  translation: string;
  verseKey: string;
  reflectionAr: string;
  reflectionEn: string;
  visualAtmosphere: string;
}

export interface QuranStory {
  id: string;
  titleAr: string;
  titleEn: string;
  surahNumber: number;
  surahNameAr: string;
  surahNameEn: string;
  ayahRange: string;
  category: 'prophets' | 'faith' | 'parables' | 'hope';
  categoryNameAr: string;
  categoryNameEn: string;
  duration: string;
  reciterName: string;
  reciterAudioUrl: string;
  gradient: string;
  shortSummaryAr: string;
  shortSummaryEn: string;
  tafsirSource: string;
  tafsirOverviewAr: string;
  tafsirOverviewEn: string;
  takeawaysAr: string[];
  takeawaysEn: string[];
  slides: StorySlide[];
}

export const QURAN_STORIES: QuranStory[] = [
  {
    id: 'yusuf-elevation',
    titleAr: 'أحسن القصص: من غيابات الجب إلى عرش التمكين',
    titleEn: 'The Best of Stories: From the Deep Well to Elevation',
    surahNumber: 12,
    surahNameAr: 'يوسف',
    surahNameEn: 'Yusuf',
    ayahRange: '12:4-21',
    category: 'prophets',
    categoryNameAr: 'قصص الأنبياء',
    categoryNameEn: 'Prophetic Narratives',
    duration: '2:15',
    reciterName: 'Mishari Rashid Al-Afasy',
    reciterAudioUrl: 'https://audio.qurancdn.com/Alafasy/mp3/012004.mp3',
    gradient: 'from-amber-950 via-slate-900 to-yellow-950',
    shortSummaryAr: 'تأمل في لطف الله الخفي بيوسف عليه السلام، وكيف تحولت محنته إلى تمكين ونجاة لأمة كاملة.',
    shortSummaryEn: 'A profound contemplation of Prophet Joseph’s journey, showing how hidden Divine decrees turned trials into triumph.',
    tafsirSource: 'تفسير ابن كثير / Tafsir Ibn Kathir',
    tafsirOverviewAr: 'بين الله تعالى في سورة يوسف أن العاقبة للمتقين، وأن حسد الإخوة وغربة السجن لم تكن إلا مقدمات لرفعة الشأن وإحقاق الحق.',
    tafsirOverviewEn: 'Surah Yusuf illustrates that ultimate victory belongs to the righteous, and apparent adversity is the crucible for divine appointment.',
    takeawaysAr: [
      'اليقين بأن تدبير الله للمؤمن خير من تدبيره لنفسه',
      'الصبر الجميل مفتاح الفرج والتمكين في الأرض',
      'العفو عند المقدرة سمة القلوب النقية',
    ],
    takeawaysEn: [
      'Unwavering certainty that Divine wisdom exceeds human foresight',
      'Steadfast patience paves the road to righteous elevation',
      'Magnanimous forgiveness is the pinnacle of noble character',
    ],
    slides: [
      {
        slideNumber: 1,
        titleAr: 'الرؤيا الصادقة وبداية البلاء',
        titleEn: 'The Prophetic Vision',
        arabicText: 'إِذْ قَالَ يُوسُفُ لِأَبِيهِ يَٰٓأَبَتِ إِنِّى رَأَيْتُ أَحَدَ عَشَرَ كَوْكَبًۭا وَٱلشَّمْسَ وَٱلْقَمَرَ رَأَيْتُهُمْ لِى سَٰجِدِينَ',
        translation: '˹Remember˺ when Joseph said to his father, "O my dear father! Indeed I saw ˹in a dream˺ eleven stars, and the sun, and the moon: I saw them prostrating to me."',
        verseKey: '12:4',
        reflectionAr: 'بدأت القصة برؤيا صادقة وبشرى عظيمة، لكن طريق تحقيقها كان محفوفاً بالابتلاءات الشديدة لتهيئة يوسف لحمل الأمانة.',
        reflectionEn: 'The journey commenced with a divine vision, yet the path toward its realization required profound resilience and spiritual refinement.',
        visualAtmosphere: 'Night desert horizon with eleven radiant celestial stars and soft glowing moonlight',
      },
      {
        slideNumber: 2,
        titleAr: 'قعر البئر ولطف الله الخفي',
        titleEn: 'The Depths of the Well',
        arabicText: 'فَلَمَّا ذَهَبُوا۟ بِهِۦ وَأَجْمَعُوٓا۟ أَن يَجْعَلُوهُ فِى غَيَٰبَتِ ٱلْجُبِّ ۚ وَأَوْحَيْنَآ إِلَيْهِ لَتُنَبِّئَنَّهُم بِأَمْرِهِمْ هَٰذَا وَهُمْ لَا يَشْعُرُونَ',
        translation: 'So when they took him away and all agreed to throw him into the bottom of the well, We inspired him: "You will certainly remind them of this deed of theirs while they are unaware."',
        verseKey: '12:15',
        reflectionAr: 'في أظلم نقطة في البئر وقمة الوحشة، نزل الوحي بالسكينة ليطمئن قلب الغلام بأن الله معه ولن يضيعه.',
        reflectionEn: 'In the solitary darkness of the well, divine inspiration descended upon Joseph, reassuring him of ultimate victory.',
        visualAtmosphere: 'Shaft of golden celestial sunlight piercing the deep tranquil waters of an ancient stone well',
      },
      {
        slideNumber: 3,
        titleAr: 'عرش التمكين وغلبة أمر الله',
        titleEn: 'The Throne of Sovereign Wisdom',
        arabicText: 'وَٱللَّهُ غَالِبٌ عَلَىٰٓ أَمْرِهِۦ وَلَٰكِنَّ أَكْثَرَ ٱلنَّاسِ لَا يَعْلَمُونَ',
        translation: 'And Allah is predominant over His affair, but most of the people do not know.',
        verseKey: '12:21',
        reflectionAr: 'القاعدة الإيمانية الكبرى: مهما خطط البشر أو كادوا، فإن مشيئة الله هي النافذة وتدبيره هو الغالب في الكون.',
        reflectionEn: 'The paramount spiritual principle: regardless of worldly plots, Allah’s sovereign decree prevails across creation.',
        visualAtmosphere: 'Magnificent sunlit royal palace arches overlooking endless tranquil fertile Nile valley',
      },
    ],
  },
  {
    id: 'kahf-companions',
    titleAr: 'فتية الكهف: ثبات الإيمان في زمن الفتن',
    titleEn: 'The Companions of the Cave: Steadfast Faith',
    surahNumber: 18,
    surahNameAr: 'الكهف',
    surahNameEn: 'Al-Kahf',
    ayahRange: '18:9-14',
    category: 'faith',
    categoryNameAr: 'عصمة الإيمان',
    categoryNameEn: 'Trials & Faith',
    duration: '2:40',
    reciterName: 'Mahmoud Khalil Al-Husary',
    reciterAudioUrl: 'https://audio.qurancdn.com/Husary/128/018009.mp3',
    gradient: 'from-emerald-950 via-slate-900 to-teal-950',
    shortSummaryAr: 'قصة شباب تركوا زينة القصور هرباً بدينهم إلى غار مظلم، فنشر الله لهم من رحمته وهيأ لهم من أمرهم مرفقا.',
    shortSummaryEn: 'Youths who renounced palace luxury to safeguard their monotheism, finding infinite expanse in a humble cave.',
    tafsirSource: 'تفسير السعدي / Tafsir As-Sa\'di',
    tafsirOverviewAr: 'توضح سورة الكهف أن من التجأ إلى الله أواه، ومن توكل عليه كفاه، وأن حفظ العقيدة أعظم من كل حطام الدنيا.',
    tafsirOverviewEn: 'Surah Al-Kahf teaches that whoever seeks refuge in Allah is sheltered, and spiritual integrity outweighs all worldly gain.',
    takeawaysAr: [
      'اللجوء إلى الله بالدعاء وقت الأزمات والفتن',
      'أهمية الصحبة الصالحة التي تعين على الطاعة',
      'قدرة الله المطلقة في حفظ عباده المؤمنين',
    ],
    takeawaysEn: [
      'Seeking sincere Divine refuge during cultural and moral trials',
      'The supreme value of righteous companionship',
      'The absolute sovereign capacity of Allah to preserve sincere believers',
    ],
    slides: [
      {
        slideNumber: 1,
        titleAr: 'الفرار بالدين واللجوء إلى الكهف',
        titleEn: 'Seeking the Sanctuary',
        arabicText: 'إِذْ أَوَى ٱلْفِتْيَةُ إِلَى ٱلْكَهْفِ فَقَالُوا۟ رَبَّنَآ ءَاتِنَا مِن لَّدُنكَ رَحْمَةًۭ وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًۭا',
        translation: '˹Remember˺ when those youths took refuge in the cave, saying, "Our Lord! Grant us mercy from Yourself and guide us rightly through our ordeal."',
        verseKey: '18:10',
        reflectionAr: 'دعاء جامع يجمع بين طلب الرحمة الشاملة والتوفيق لأحسن القرارات في أشد الأوقات حرجاً.',
        reflectionEn: 'A comprehensive prayer combining the request for encompassing mercy and righteous discernment.',
        visualAtmosphere: 'Secluded misty pine mountain with a serene natural cave entrance at twilight',
      },
      {
        slideNumber: 2,
        titleAr: 'ربط القلوب والجهر بالتوحيد',
        titleEn: 'Hearts Firm Upon Monotheism',
        arabicText: 'وَرَبَطْنَا عَلَىٰ قُلُوبِهِمْ إِذْ قَامُوا۟ فَقَالُوا۟ رَبُّنَا رَبُّ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ لَن نَّدْعُوَا۟ مِن دُونِهِۦٓ إِلَٰهًۭا',
        translation: 'We strengthened their hearts when they stood up and declared, "Our Lord is the Lord of the heavens and the earth. We will never call upon any god besides Him."',
        verseKey: '18:14',
        reflectionAr: 'التثبيت الرباني حين يخلص العبد نيته، فينطق بالحق بثبات وشجاعة دون خوف من سلطان جائر.',
        reflectionEn: 'Divine reinforcement granted to sincere souls, empowering them to declare truth fearlessly.',
        visualAtmosphere: 'Ancient stone amphitheater with golden dawn rays illuminating steadfast silhouettes',
      },
    ],
  },
  {
    id: 'hud-ark',
    titleAr: 'سفينة نوح: النجاة في طوفان البلاء',
    titleEn: 'Noah’s Ark: Salvation Amidst the Deluge',
    surahNumber: 11,
    surahNameAr: 'هود',
    surahNameEn: 'Hud',
    ayahRange: '11:41-44',
    category: 'prophets',
    categoryNameAr: 'قصص الأنبياء',
    categoryNameEn: 'Prophetic Narratives',
    duration: '1:55',
    reciterName: 'AbdulBaset AbdulSamad',
    reciterAudioUrl: 'https://audio.qurancdn.com/AbdulBaset/Murattal/mp3/011041.mp3',
    gradient: 'from-blue-950 via-slate-900 to-cyan-950',
    shortSummaryAr: 'ركوب السفينة باسم الله مجراها ومرساها وسط أمواج كالجبال، ونداء الأب المشفق على ابنه.',
    shortSummaryEn: 'Embarking on the Ark in the Name of Allah amidst mountain-sized waves, and the emotional paternal plea.',
    tafsirSource: 'تفسير ابن كثير / Tafsir Ibn Kathir',
    tafsirOverviewAr: 'بيان أن النجاة الحقيقية لا تكون إلا بطاعة الله واتباع رسله، وأن النسب والقرابة لا تنفع بغير إيمان.',
    tafsirOverviewEn: 'True salvation is achieved solely through obedience to Allah, and lineage cannot substitute for faith.',
    takeawaysAr: [
      'التوكل على اسم الله في كل حركة وسكون',
      'الإيمان هو الرابطة الحقيقية بين البشر',
      'استقرار السفينة على الجودي برهان على صدق الوعد',
    ],
    takeawaysEn: [
      'Commencing every endeavor in the Divine Name',
      'Faith is the ultimate unbreakable bond between souls',
      'The resting of the Ark on Mount Judi affirms Divine promise',
    ],
    slides: [
      {
        slideNumber: 1,
        titleAr: 'باسم الله مجراها ومرساها',
        titleEn: 'In the Name of Allah is its Course',
        arabicText: 'وَقَالَ ٱرْكَبُوا۟ فِيهَا بِسْمِ ٱللَّهِ مَجْر۪ىٰهَا وَمُرْسَىٰهَآ ۚ إِنَّ رَبِّى لَغَفُورٌۭ رَّحِيمٌۭ',
        translation: 'And he said, "Embark in it; in the Name of Allah is its sailing and its anchorage. Indeed, my Lord is All-Forgiving, Most Merciful."',
        verseKey: '11:41',
        reflectionAr: 'بداية الرحلة بالتوكل المطلق والاعتراف برحمة الله التي وسعت كل شيء وسط الطوفان الهائل.',
        reflectionEn: 'Initiating the perilous voyage with absolute reliance upon Divine guidance and encompassing mercy.',
        visualAtmosphere: 'Majestic wooden ark sailing through towering storm ocean waves under stormy skies',
      },
    ],
  },
  {
    id: 'duha-solace',
    titleAr: 'ضحى الأمل: ما ودعك ربك وما قلى',
    titleEn: 'The Morning Glow of Divine Solace',
    surahNumber: 93,
    surahNameAr: 'الضحى',
    surahNameEn: 'Ad-Duha',
    ayahRange: '93:1-8',
    category: 'hope',
    categoryNameAr: 'الأمل والسكينة',
    categoryNameEn: 'Hope & Solace',
    duration: '1:30',
    reciterName: 'Mishari Rashid Al-Afasy',
    reciterAudioUrl: 'https://audio.qurancdn.com/Alafasy/mp3/093001.mp3',
    gradient: 'from-amber-900/60 via-slate-900 to-slate-950',
    shortSummaryAr: 'بلسم رباني لنبي الهدى ولكل قلب حزين، قسم بالضحى والليل الساجي بأن الله لم يتركك.',
    shortSummaryEn: 'A divine balm for the Prophet and every weary heart, swearing by the bright dawn that Allah has never forsaken you.',
    tafsirSource: 'تفسير ابن كثير / Tafsir Ibn Kathir',
    tafsirOverviewAr: 'نزلت تسلية للنبي صلى الله عليه وسلم حين تأخر عنه الوحي، فأقسم الله بوقتين متضادين على كمال عنايته به.',
    tafsirOverviewEn: 'Revealed to comfort the Prophet after a pause in revelation, assuring continuous divine care.',
    takeawaysAr: [
      'انقطاع المدد الظاهري لا يعني انقطاع العناية الإلهية',
      'للمؤمن في الآخرة خير عظيم يعوضه عن كل كبد الدنيا',
      'شكر نعم الإيواء والهداية والكفاية بالإحسان لليتيم والسائل',
    ],
    takeawaysEn: [
      'Temporary pauses in worldly ease never imply abandonment by Allah',
      'The eternal rewards of the Hereafter eclipse all worldly trials',
      'Expressing gratitude for Divine shelter through benevolence to orphans and the needy',
    ],
    slides: [
      {
        slideNumber: 1,
        titleAr: 'قسم الفجر وسكينة الليل',
        titleEn: 'The Bright Morning and Serene Night',
        arabicText: 'وَٱلضُّحَىٰ • وَٱلَّيْلِ إِذَا سَجَىٰ • مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ',
        translation: 'By the morning brightness, and by the night when it grows still: Your Lord has not forsaken you, nor has He become displeased.',
        verseKey: '93:1-3',
        reflectionAr: 'قسمان كونيان بالضياء والسكينة لطمأنة القلب بأنه محفوظ بعين الله ورعايته الدائمة.',
        reflectionEn: 'Twin cosmic oaths by radiant light and nocturnal stillness, calming the anxious heart.',
        visualAtmosphere: 'Warm golden sunrise illuminating a tranquil desert horizon with gentle pastel clouds',
      },
    ],
  },
];
