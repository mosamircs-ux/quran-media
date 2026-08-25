export type StoryCategory =
  | 'reflection'
  | 'faith'
  | 'patience'
  | 'mercy'
  | 'forgiveness'
  | 'paradise'
  | 'hereafter'
  | 'creation'
  | 'prophets'
  | 'wisdom'
  | 'family'
  | 'character'
  | 'prayer'
  | 'hope';

export interface CategoryInfo {
  id: StoryCategory;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
}

export const STORY_CATEGORIES: CategoryInfo[] = [
  { id: 'reflection', nameAr: 'تدبر وتأمل', nameEn: 'Reflection', descriptionAr: 'آيات كونية وتأملات في أسرار الوجود', descriptionEn: 'Cosmic signs and contemplation of divine design', icon: 'Sparkles' },
  { id: 'faith', nameAr: 'إيمان ويقين', nameEn: 'Faith', descriptionAr: 'ترسيخ عقيدة التوحيد والسكينة في القلب', descriptionEn: 'Steadfast monotheism and unwavering spiritual conviction', icon: 'ShieldCheck' },
  { id: 'patience', nameAr: 'صبر وثبات', nameEn: 'Patience', descriptionAr: 'قصص الصابرين والمبشرين بالفوز', descriptionEn: 'Trials of the steadfast and promises of triumph', icon: 'Anchor' },
  { id: 'mercy', nameAr: 'رحمة ورأفة', nameEn: 'Mercy', descriptionAr: 'سعة رحمة الله تعالى بعباده المخلوقين', descriptionEn: 'The infinite compass of Divine compassion and grace', icon: 'Heart' },
  { id: 'forgiveness', nameAr: 'مغفرة وتوبة', nameEn: 'Forgiveness', descriptionAr: 'أبواب التوبة المفتوحة ومغفرة الذنوب', descriptionEn: 'The open gates of repentance and redemption', icon: 'RotateCcw' },
  { id: 'paradise', nameAr: 'الجنة ونعيمها', nameEn: 'Paradise', descriptionAr: 'وصف الجنات وأنهارها ومقام الأبرار', descriptionEn: 'Descriptions of eternal gardens and supreme bliss', icon: 'Trees' },
  { id: 'hereafter', nameAr: 'اليوم الآخر', nameEn: 'Hereafter', descriptionAr: 'أهوال الساعة والميزان والحساب الحق', descriptionEn: 'The Day of Judgement, the Scales, and eternal reality', icon: 'Scale' },
  { id: 'creation', nameAr: 'خلق الكون والأنفس', nameEn: 'Creation', descriptionAr: 'بديع خلق السماوات والأرض والإنسان', descriptionEn: 'The wonders of celestial heavens, earth, and human creation', icon: 'Globe' },
  { id: 'prophets', nameAr: 'قصص الأنبياء', nameEn: 'Prophets', descriptionAr: 'سير الرسل وجهادهم في تبليغ الرسالة', descriptionEn: 'Narratives of the Messengers and their divine missions', icon: 'BookOpen' },
  { id: 'wisdom', nameAr: 'حكمة وموعظة', nameEn: 'Wisdom', descriptionAr: 'أمثال القرآن وقصص الحكماء كلقمان', descriptionEn: 'Parables, divine intellect, and sage wisdom', icon: 'Compass' },
  { id: 'family', nameAr: 'الأسرة والوالدين', nameEn: 'Family', descriptionAr: 'بر الوالدين وحفظ المودة والذرية', descriptionEn: 'Filial piety, marital harmony, and righteous lineage', icon: 'Users' },
  { id: 'character', nameAr: 'الأخلاق والتعامل', nameEn: 'Character', descriptionAr: 'مكارم الأخلاق والصدق وحسن المعاملة', descriptionEn: 'Noble ethics, honesty, and righteous conduct', icon: 'Smile' },
  { id: 'prayer', nameAr: 'الصلاة والدعاء', nameEn: 'Prayer', descriptionAr: 'مناجاة الخالق وأدعية الأنبياء المستجابة', descriptionEn: 'Intimate supplication and answered prayers of the righteous', icon: 'Sun' },
  { id: 'hope', nameAr: 'الرجاء والأمل', nameEn: 'Hope', descriptionAr: 'بشائر الفرج وجلاء الحزن بعد الشدة', descriptionEn: 'Divine solace and the dawn of relief after distress', icon: 'Sunrise' },
];

export interface RelatedVerse {
  surahNumber: number;
  surahNameAr: string;
  surahNameEn: string;
  ayahNumber: number;
  verseKey: string;
  textUthmani: string;
  translation: string;
}

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
  slug: string;
  titleAr: string;
  titleEn: string;
  surahNumber: number;
  surahNameAr: string;
  surahNameEn: string;
  ayahStart: number;
  ayahEnd: number;
  ayahRange: string;
  category: StoryCategory;
  categoryNameAr: string;
  categoryNameEn: string;
  shortSummaryAr: string;
  shortSummaryEn: string;
  fullExplanationAr: string;
  fullExplanationEn: string;
  arabicVerseText: string;
  translationText: string;
  tafsirSource: string;
  tafsirSummaryAr: string;
  tafsirSummaryEn: string;
  tafsirOverviewAr?: string;
  tafsirOverviewEn?: string;
  thumbnailUrl: string;
  videoUrl?: string;
  durationSeconds: number;
  durationFormatted: string;
  language: 'ar' | 'en' | 'dual';
  viewsCount: number;
  savesCount: number;
  reciterNameAr: string;
  reciterNameEn: string;
  reciterAudioUrl: string;
  createdAt: string;
  relatedVerses: RelatedVerse[];
  relatedStorySlugs: string[];
  takeawaysAr: string[];
  takeawaysEn: string[];
  slides?: StorySlide[];
}

export const QURAN_STORIES: QuranStory[] = [
  {
    id: 'yusuf-elevation',
    slug: 'yusuf-from-well-to-elevation',
    titleAr: 'أحسن القصص: من غيابات الجب إلى عرش التمكين',
    titleEn: 'The Best of Stories: From the Deep Well to Elevation',
    surahNumber: 12,
    surahNameAr: 'يوسف',
    surahNameEn: 'Yusuf',
    ayahStart: 4,
    ayahEnd: 21,
    ayahRange: '12:4-21',
    category: 'prophets',
    categoryNameAr: 'قصص الأنبياء',
    categoryNameEn: 'Prophets',
    shortSummaryAr: 'تأمل في لطف الله الخفي بيوسف عليه السلام، وكيف تحولت محنته في قعر البئر وغربة السجن إلى تمكين ونجاة لأمة كاملة.',
    shortSummaryEn: 'A profound contemplation of Prophet Joseph’s journey, showing how hidden Divine decrees turned trials in the well into ultimate elevation.',
    fullExplanationAr: 'تبدأ قصة يوسف عليه السلام برؤيا صادقة وبشرى عظيمة بعلو شأنه، لكن طريق تحقيق هذه الرؤيا مر بمحن عظيمة: حسد الإخوة وإلقاؤه في قعر الجب، ثم بيعه بثمن بخس في مصر، وفتنة امرأة العزيز، ثم السجن لسنوات طوال. في كل محطة، كان لطف الله الخفي يصنع يوسف ويهيئه لمقام النبوة وإدارة خزائن الأرض. وحين قال الله تعالى: {وَٱللَّهُ غَالِبٌ عَلَىٰٓ أَمْرِهِۦ}، كانت هذه هي الحقيقة الكبرى التي تعلمنا أن مشيئة الله تنفذ دائماً، وأن البلاء للمؤمن هو جسر الارتقاء.',
    fullExplanationEn: 'The story of Prophet Joseph begins with a truthful prophetic vision of eleven stars, the sun, and the moon prostrating to him. Yet the path to this sovereign appointment was forged through immense crucible: brotherly jealousy, abandonment in a dark well, servitude in Egypt, unjust imprisonment, and separation from his loving father. Throughout every trial, divine grace was sculpting Joseph\'s character. As the Quran declares: "And Allah is predominant over His affair," teaching believers that adversity is but the divine vehicle for spiritual and worldly triumph.',
    arabicVerseText: 'إِذْ قَالَ يُوسُفُ لِأَبِيهِ يَٰٓأَبَتِ إِنِّى رَأَيْتُ أَحَدَ عَشَرَ كَوْكَبًۭا وَٱلشَّمْسَ وَٱلْقَمَرَ رَأَيْتُهُمْ لِى سَٰجِدِينَ • قَالَ يَٰبُنَىَّ لَا تَقْصُصْ رُءْيَاكَ عَلَىٰٓ إِخْوَتِكَ فَيَكِيدُوا۟ لَكَ كَيْدًا ۖ إِنَّ ٱلشَّيْطَٰنَ لِلْإِنسَٰنِ عَدُوٌّۭ مُّبِينٌۭ',
    translationText: '[Remember] when Joseph said to his father, "O my father, indeed I saw [in a dream] eleven stars and the sun and the moon; I saw them prostrating to me." He said, "O my son, do not relate your vision to your brothers or they will contrive against you a plan. Indeed Satan, to man, is an open enemy."',
    tafsirSource: 'تفسير ابن كثير / Tafsir Ibn Kathir',
    tafsirSummaryAr: 'بين الحافظ ابن كثير أن رؤيا الأنبياء وحي حق، وأن يعقوب عليه السلام فطن لرفعة شأن يوسف، فأمره بكتمانها حذراً من كيد الشيطان وحسد النفوس. وأكد أن العاقبة المحمودة كانت جزاء الصبر الجميل.',
    tafsirSummaryEn: 'Ibn Kathir notes that the dreams of prophets are true divine revelations. Jacob recognized the majestic destiny of Joseph and instructed him to conceal it to prevent satanic jealousy, culminating in a triumph born of steadfast patience.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1080&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    durationSeconds: 135,
    durationFormatted: '02:15',
    language: 'dual',
    viewsCount: 14820,
    savesCount: 3240,
    reciterNameAr: 'مشاري راشد العفاسي',
    reciterNameEn: 'Mishary Rashid Alafasy',
    reciterAudioUrl: 'https://audio.qurancdn.com/Alafasy/mp3/012004.mp3',
    createdAt: '2026-08-20T10:00:00Z',
    relatedVerses: [
      {
        surahNumber: 12,
        surahNameAr: 'يوسف',
        surahNameEn: 'Yusuf',
        ayahNumber: 21,
        verseKey: '12:21',
        textUthmani: 'وَٱللَّهُ غَالِبٌ عَلَىٰٓ أَمْرِهِۦ وَلَٰكِنَّ أَكْثَرَ ٱلنَّاسِ لَا يَعْلَمُونَ',
        translation: 'And Allah is predominant over His affair, but most of the people do not know.',
      },
      {
        surahNumber: 12,
        surahNameAr: 'يوسف',
        surahNameEn: 'Yusuf',
        ayahNumber: 90,
        verseKey: '12:90',
        textUthmani: 'إِنَّهُۥ مَن يَتَّقِ وَيَصْبِرْ فَإِنَّ ٱللَّهَ لَا يُضِيعُ أَجْرَ ٱلْمُحْسِنِينَ',
        translation: 'Indeed, he who fears Allah and is patient, then indeed, Allah does not allow to be lost the reward of those who do good.',
      },
    ],
    relatedStorySlugs: ['kahf-companions', 'musa-parting-sea', 'duha-morning-solace'],
    takeawaysAr: [
      'اليقين التام بأن تدبير الله للمؤمن خير من تدبيره لنفسه',
      'الصبر الجميل مفتاح الفرج والتمكين الحقيقي',
      'العفو عند المقدرة سمة القلوب الربانية النقية',
    ],
    takeawaysEn: [
      'Unwavering conviction that Divine planning surpasses human foresight',
      'Steadfast beautiful patience is the true key to relief and elevation',
      'Magnanimous forgiveness is the hallmark of spiritually pure hearts',
    ],
  },
  {
    id: 'kahf-companions',
    slug: 'kahf-youth-in-the-cave',
    titleAr: 'فتية الكهف: ثبات الإيمان في زمن الفتن',
    titleEn: 'The Companions of the Cave: Steadfast Faith',
    surahNumber: 18,
    surahNameAr: 'الكهف',
    surahNameEn: 'Al-Kahf',
    ayahStart: 9,
    ayahEnd: 14,
    ayahRange: '18:9-14',
    category: 'faith',
    categoryNameAr: 'إيمان ويقين',
    categoryNameEn: 'Faith',
    shortSummaryAr: 'قصة شباب تركوا زينة القصور هرباً بدينهم وتوحيدهم إلى غار مظلم، فنشر الله لهم من رحمته وهيأ لهم من أمرهم مرفقا.',
    shortSummaryEn: 'Youths who renounced royal luxury to safeguard their pure monotheism, discovering infinite divine mercy in a humble mountain cave.',
    fullExplanationAr: 'كان فتية الكهف أبناء أمراء وأشراف في قوم يعبدون الأوثان ويضطهدون المؤمنين. فلما أشرق نور التوحيد في قلوبهم، أعلنوا إيمانهم بالله وحده، ثم أووا إلى كهف مهجور فراراً بدينهم. ضرب الله على آذانهم فناموا ثلاثمائة وتسع سنين، ليكونوا آية خالدة في قدرة الله على حفظ أوليائه وتثبيت المؤمنين.',
    fullExplanationEn: 'The youths of the cave were noble individuals in an idolatrous empire. When the light of monotheism touched their hearts, they fearlessly declared their devotion to the One Creator. Seeking divine shelter, they took refuge in an isolated cave where Allah preserved them in deep slumber for 309 years, serving as an eternal testament to divine protection.',
    arabicVerseText: 'إِذْ أَوَى ٱلْفِتْيَةُ إِلَى ٱلْكَهْفِ فَقَالُوا۟ رَبَّنَآ ءَاتِنَا مِن لَّدُنكَ رَحْمَةًۭ وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًۭا • فَضَرَبْنَا عَلَىٰٓ ءَاذَانِهِمْ فِى ٱلْكَهْفِ سِنِينَ عَدَدًۭا',
    translationText: '[Mention] when the youths retreated to the cave and said, "Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance." So We cast [a cover of sleep] over their ears within the cave for a number of years.',
    tafsirSource: 'تفسير السعدي / Tafsir As-Sa\'di',
    tafsirSummaryAr: 'أوضح الإمام السعدي أن اللجوء إلى الله بالدعاء وقت الأزمات يفتح أبواب اللطف والتوفيق، وأن حفظ الدين مقدم على كل متاع دنيوي.',
    tafsirSummaryEn: 'Imam As-Sa\'di highlights that seeking refuge in Allah through heartfelt prayer opens gates of unfathomable grace, establishing that spiritual integrity precedes all worldly treasures.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1080&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    durationSeconds: 160,
    durationFormatted: '02:40',
    language: 'dual',
    viewsCount: 19400,
    savesCount: 4120,
    reciterNameAr: 'محمود خليل الحصري',
    reciterNameEn: 'Mahmoud Khalil Al-Husary',
    reciterAudioUrl: 'https://audio.qurancdn.com/Husary/128/018009.mp3',
    createdAt: '2026-08-18T14:00:00Z',
    relatedVerses: [
      {
        surahNumber: 18,
        surahNameAr: 'الكهف',
        surahNameEn: 'Al-Kahf',
        ayahNumber: 13,
        verseKey: '18:13',
        textUthmani: 'إِنَّهُمْ فِتْيَةٌ ءَامَنُوا۟ بِرَبِّهِمْ وَزِدْنَٰهُمْ هُدًۭى',
        translation: 'Indeed, they were youths who believed in their Lord, and We increased them in guidance.',
      },
    ],
    relatedStorySlugs: ['yusuf-from-well-to-elevation', 'duha-morning-solace', 'maryam-miraculous-birth'],
    takeawaysAr: [
      'اللجوء إلى الله بالدعاء في أوقات الفتن والأزمات',
      'أهمية الصحبة الصالحة التي تعين على الثبات',
      'قدرة الله التامة على حفظ ورعاية من توكل عليه',
    ],
    takeawaysEn: [
      'Seeking sincere Divine refuge during moral and cultural challenges',
      'The profound blessing of righteous companionship in holding fast to truth',
      'The absolute sovereign ability of Allah to preserve those who trust Him',
    ],
  },
  {
    id: 'duha-morning-solace',
    slug: 'duha-morning-solace',
    titleAr: 'ضحى الأمل: ما ودعك ربك وما قلى',
    titleEn: 'The Morning Glow of Divine Solace',
    surahNumber: 93,
    surahNameAr: 'الضحى',
    surahNameEn: 'Ad-Duha',
    ayahStart: 1,
    ayahEnd: 8,
    ayahRange: '93:1-8',
    category: 'hope',
    categoryNameAr: 'الرجاء والأمل',
    categoryNameEn: 'Hope',
    shortSummaryAr: 'بلسم رباني لنبي الهدى ولكل قلب مكروب، قسم كوني بضوء الضحى وسكينة الليل بأن الله لم يترك عبده ولن يتخلى عنه.',
    shortSummaryEn: 'A divine balm for the weary soul, swearing by the bright morning and tranquil night that your Lord has never forsaken you.',
    fullExplanationAr: 'حين انقطع الوحي فترة عن النبي صلى الله عليه وسلم، حزن حزناً شديداً وظن المشركون أن ربه قلاه، فأنزل الله سورة الضحى قسماً بالضياء بعد الظلام، وبشرى بأن الآخرة خير من الأولى، ومذكراً بنعم الإيواء والهداية والكفاية منذ الصغر.',
    fullExplanationEn: 'When divine revelation paused temporarily, causing sorrow to the Prophet, Surah Ad-Duha descended as a tender reassurance. Swearing by the radiant morning light and the serene stillness of night, Allah affirmed His continuous loving care, assuring that what lies ahead is far greater than what has passed.',
    arabicVerseText: 'وَٱلضُّحَىٰ • وَٱلَّيْلِ إِذَا سَجَىٰ • مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ • وَلَلْءَاخِرَةُ خَيْرٌۭ لَّكَ مِنَ ٱلْأُولَىٰ • وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰٓ',
    translationText: 'By the morning brightness, and by the night when it covers with darkness: Your Lord has not forsaken you, [O Muhammad], nor has He detested [you]. And the Hereafter is better for you than the first [life]. And your Lord is going to give you, and you will be satisfied.',
    tafsirSource: 'تفسير الطبري / Tafsir Al-Tabari',
    tafsirSummaryAr: 'أكد الإمام الطبري أن القسم بالضحى والليل يشير إلى تقلب الأحوال بين الشدة والرخاء، وأن معية الله باقية لا تنقطع.',
    tafsirSummaryEn: 'Imam Al-Tabari emphasizes that the oaths of morning and night symbolize the alternating rhythm of hardship and relief, proving that Divine guardianship remains perpetual.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=1080&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    durationSeconds: 95,
    durationFormatted: '01:35',
    language: 'dual',
    viewsCount: 28300,
    savesCount: 6890,
    reciterNameAr: 'مشاري راشد العفاسي',
    reciterNameEn: 'Mishary Rashid Alafasy',
    reciterAudioUrl: 'https://audio.qurancdn.com/Alafasy/mp3/093001.mp3',
    createdAt: '2026-08-15T09:00:00Z',
    relatedVerses: [
      {
        surahNumber: 94,
        surahNameAr: 'الشرح',
        surahNameEn: 'Ash-Sharh',
        ayahNumber: 5,
        verseKey: '94:5',
        textUthmani: 'فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا • إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا',
        translation: 'For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.',
      },
    ],
    relatedStorySlugs: ['yusuf-from-well-to-elevation', 'yunus-whale-prayer', 'rahmah-vast-mercy'],
    takeawaysAr: [
      'انقطاع المدد الظاهري مؤقتاً لا يعني أبداً انقطاع العناية الإلهية',
      'للمؤمن في الآخرة خير عظيم يعوضه عن كل كبد وألم',
      'تذكر نعم الله السابقة يملأ القلب باليقين في المستقبل',
    ],
    takeawaysEn: [
      'A temporary pause in ease never implies abandonment by the Divine',
      'The eternal beauty of the Hereafter far eclipses all fleeting earthly tribulations',
      'Recalling past blessings invigorates the heart with certainty for the future',
    ],
  },
  {
    id: 'yunus-whale-prayer',
    slug: 'yunus-in-the-whale',
    titleAr: 'نداء الظلمات: لا إله إلا أنت سبحانك',
    titleEn: 'Cry in the Darkness: The Prayer of Jonah',
    surahNumber: 21,
    surahNameAr: 'الأنبياء',
    surahNameEn: 'Al-Anbya',
    ayahStart: 87,
    ayahEnd: 88,
    ayahRange: '21:87-88',
    category: 'prayer',
    categoryNameAr: 'الصلاة والدعاء',
    categoryNameEn: 'Prayer',
    shortSummaryAr: 'دعاء ذي النون في ظلمات ثلاث: ظلمة الليل، وظلمة البحر، وظلمة بطن الحوت، واستجابة الله الفورية لكل مؤمن ومكروب.',
    shortSummaryEn: 'The supplication of Prophet Jonah amidst triple darkness: the depth of night, the ocean depths, and the belly of the whale.',
    fullExplanationAr: 'خرج يونس عليه السلام مغاضباً لقومه قبل أن يأذن الله له، فركب السفينة فثقلت، فألقي في البحر والتقمه الحوت وهو مليم. وفي تلك الظلمات المتراكمة، نادى بالتوحيد والتسبيح والاعتراف بالذنب، فاستجاب الله له ونجاه من الغم، وجعل هذا الدعاء مفتاح نجاة لكل مؤمن إلى يوم القيامة.',
    fullExplanationEn: 'Prophet Jonah departed from his recalcitrant people in distress. Boarding a vessel amidst turbulent seas, lots were cast and he was swallowed by a gigantic whale. In the suffocating depths of the ocean and night, he cried out: "None has the right to be worshipped but You; Glorified be You! Indeed, I have been of the wrongdoers." Instantly, divine mercy answered, delivering him upon the shore.',
    arabicVerseText: 'وَذَا ٱلنُّونِ إِذ ذَّهَبَ مُغَٰضِبًۭا فَظَنَّ أَن لَّن نَّقْدِرَ عَلَيْهِ فَنَادَىٰ فِى ٱلظُّلُمَٰتِ أَن لَّآ إِلَٰهَ إِلَّآ أَنتَ سُبْحَٰنَكَ إِنِّى كُنتُ مِنَ ٱلظَّٰلِمِينَ • فَٱسْتَجَبْنَا لَهُۥ وَنَجَّيْنَٰهُ مِنَ ٱلْغَمِّ ۚ وَكَذَٰلِكَ نُۨجِى ٱلْمُؤْمِنِينَ',
    translationText: 'And [mention] the man of the fish, when he went off in anger and thought that We would not reach him. But he called out within the darknesses, "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers." So We responded to him and saved him from the distress. And thus do We save the believers.',
    tafsirSource: 'تفسير القرطبي / Tafsir Al-Qurtubi',
    tafsirSummaryAr: 'بين الإمام القرطبي أن الجمع بين التوحيد والتنزيه والاعتراف بالتقصير هو أعظم أسباب استجابة الدعاء وتفريج الكروب.',
    tafsirSummaryEn: 'Imam Al-Qurtubi explains that unifying monotheism, divine glorification, and sincere humility is the supreme catalyst for having prayers answered and trials removed.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1080&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    durationSeconds: 110,
    durationFormatted: '01:50',
    language: 'dual',
    viewsCount: 22100,
    savesCount: 5310,
    reciterNameAr: 'عبد الباسط عبد الصمد',
    reciterNameEn: 'AbdulBaset AbdulSamad',
    reciterAudioUrl: 'https://audio.qurancdn.com/AbdulBaset/Murattal/mp3/021087.mp3',
    createdAt: '2026-08-12T11:30:00Z',
    relatedVerses: [
      {
        surahNumber: 68,
        surahNameAr: 'القلم',
        surahNameEn: 'Al-Qalam',
        ayahNumber: 48,
        verseKey: '68:48',
        textUthmani: 'فَٱصْبِرْ لِحُكْمِ رَبِّكَ وَلَا تَكُن كَصَاحِبِ ٱلْحُوتِ إِذْ نَادَىٰ وَهُوَ مَكْظُومٌۭ',
        translation: 'Then be patient for the decision of your Lord, [O Muhammad], and be not like the companion of the fish when he called out while he was distressed.',
      },
    ],
    relatedStorySlugs: ['duha-morning-solace', 'hud-ark-salvation', 'tawbah-forgiveness-doors'],
    takeawaysAr: [
      'دعاء ذي النون بلسم لكل مكروب ومفتاح إجابة لكل ضائقة',
      'الاعتراف بالتقصير بين يدي الله يرفع البلاء',
      'وعد الله قائم بنجاة المؤمنين في كل زمان ومكان',
    ],
    takeawaysEn: [
      'The supplication of Jonah is a universal antidote for grief and anguish',
      'Humble acknowledgment of our human limitations invites Divine intervention',
      'The divine promise to rescue sincere believers is perpetual across all generations',
    ],
  },
  {
    id: 'musa-parting-sea',
    slug: 'musa-parting-of-the-sea',
    titleAr: 'فلق البحر: كلا إن معي ربي سيهدين',
    titleEn: 'Parting of the Sea: My Lord is With Me',
    surahNumber: 26,
    surahNameAr: 'الشعراء',
    surahNameEn: 'Ash-Shu\'ara',
    ayahStart: 61,
    ayahEnd: 68,
    ayahRange: '26:61-68',
    category: 'patience',
    categoryNameAr: 'صبر وثبات',
    categoryNameEn: 'Patience',
    shortSummaryAr: 'موقف اليقين الحاسم لموسى عليه السلام حين حوصر بين البحر وجيش فرعون، فانفلق البحر فكان كل فرق كالطود العظيم.',
    shortSummaryEn: 'The monumental moment of unwavering certainty when Prophet Moses was caught between the surging Red Sea and Pharaoh’s cavalry.',
    fullExplanationAr: 'لما تراءى الجمعان وأيقن بنو إسرائيل بالهلاك قائلين: {إِنَّا لَمُدْرَكُونَ}، نطق موسى عليه السلام بكلمة التوحيد الخالدة: {كَلَّآ ۖ إِنَّ مَعِىَ رَبِّى سَيَهْدِينِ}. فأمره الله بضرب البحر بعصاه، فانفلق اثني عشر طريقاً يابساً، ونجى الله المؤمنين وأغرق فرعون وجنوده.',
    fullExplanationEn: 'When the armies came within sight of one another, the followers of Moses cried in despair: "Indeed, we are overtaken!" Yet Moses proclaimed with transcendent certainty: "No! Indeed, with me is my Lord; He will guide me." Striking the water with his staff, the sea cleaved into twelve towering walls, granting miraculous safe passage.',
    arabicVerseText: 'فَلَمَّا تَرَٰٓءَا ٱلْجَمْعَانِ قَالَ أَصْحَٰبُ مُوسَىٰٓ إِنَّا لَمُدْرَكُونَ • قَالَ كَلَّآ ۖ إِنَّ مَعِىَ رَبِّى سَيَهْدِينِ • فَأَوْحَيْنَآ إِلَىٰ مُوسَىٰٓ أَنِ ٱضْرِب بِّعَصَاكَ ٱلْبَحْرَ ۖ فَٱنفَلَقَ فَكَانَ كُلُّ فِرْقٍۢ كَٱلطَّوْدِ ٱلْعَظِيمِ',
    translationText: 'And when the two companies saw one another, the companions of Moses said, "Indeed, we are to be overtaken!" [Moses] said, "No! Indeed, with me is my Lord; He will guide me." Then We inspired to Moses, "Strike with your staff the sea," and it parted, and each part was like a great towering mountain.',
    tafsirSource: 'تفسير ابن كثير / Tafsir Ibn Kathir',
    tafsirSummaryAr: 'بين ابن كثير أن كلمة موسى عبرت عن كمال التوكل واليقين بمعية الله الخاصة لأوليائه الصادقين في أحرج اللحظات.',
    tafsirSummaryEn: 'Ibn Kathir comments that Moses’ response exemplified the absolute zenith of trust in Allah’s special divine presence with His sincere prophets.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    durationSeconds: 145,
    durationFormatted: '02:25',
    language: 'dual',
    viewsCount: 31200,
    savesCount: 7890,
    reciterNameAr: 'سعد الغامدي',
    reciterNameEn: 'Saad Al-Ghamdi',
    reciterAudioUrl: 'https://audio.qurancdn.com/Ghamadi/mp3/026061.mp3',
    createdAt: '2026-08-10T16:00:00Z',
    relatedVerses: [
      {
        surahNumber: 20,
        surahNameAr: 'طه',
        surahNameEn: 'Taha',
        ayahNumber: 77,
        verseKey: '20:77',
        textUthmani: 'فَٱضْرِبْ لَهُمْ طَرِيقًۭا فِى ٱلْبَحْرِ يَبَسًۭا لَّا تَخَٰفُ دَرَكًۭا وَلَا تَخْشَىٰ',
        translation: 'And strike for them a dry path through the sea; you will not fear being overtaken, nor be afraid [of drowning].',
      },
    ],
    relatedStorySlugs: ['yusuf-from-well-to-elevation', 'hud-ark-salvation', 'kahf-youth-in-the-cave'],
    takeawaysAr: [
      'اليقين بمعية الله يبدد كل مخاوف الدنيا',
      'حين تنقطع الأسباب المادية ينزل اللطف الإلهي الخارق للعادة',
      'الظلم مهما تجبر وطغى فإن عاقبته الغرق والزوال',
    ],
    takeawaysEn: [
      'Certainty in Divine companionship dispels all worldly dread',
      'When material avenues vanish, supernatural Divine mercy manifests',
      'Tyranny, regardless of its earthly might, is destined for ultimate collapse',
    ],
  },
  {
    id: 'rahmah-vast-mercy',
    slug: 'rahmah-encompassing-mercy',
    titleAr: 'سعة الرحمة: ورحمتي وسعت كل شيء',
    titleEn: 'Encompassing Mercy: My Mercy Embraces All Things',
    surahNumber: 7,
    surahNameAr: 'الأعراف',
    surahNameEn: 'Al-A\'raf',
    ayahStart: 156,
    ayahEnd: 157,
    ayahRange: '7:156-157',
    category: 'mercy',
    categoryNameAr: 'رحمة ورأفة',
    categoryNameEn: 'Mercy',
    shortSummaryAr: 'تأمل في كمال رحمة الله الشاملة لكل ذرة في الوجود، وسبق رحمته لغضبه وبشارتها للمتقين.',
    shortSummaryEn: 'Contemplation of Allah\'s all-encompassing mercy that embraces every particle in existence, assuring solace to believers.',
    fullExplanationAr: 'كتب الله على نفسه الرحمة، فسبقت رحمته غضبه. وفي هذه الآية الكريمة يخبرنا الخالق جل وعلا أن رحمته وسعت كل شيء في السماوات والأرض، وأنه كتبها وأوجبها للمتقين الذين يؤتون الزكاة ويتبعون الرسول النبي الأمي.',
    fullExplanationEn: 'Allah decreed mercy upon Himself, making His mercy precede His wrath. In this magnificent revelation, the Creator proclaims that His encompassing compassion embraces every facet of creation, promising special eternal manifestation for the righteous.',
    arabicVerseText: 'وَرَحْمَتِى وَسِعَتْ كُلَّ شَىْءٍۢ ۚ فَسَأَكْتُبُهَا لِلَّذِينَ يَتَّقُونَ وَيُؤْتُونَ ٱلزَّكَوٰةَ وَٱلَّذِينَ هُم بِـَٔايَٰتِنَا يُؤْمِنُونَ',
    translationText: 'And My mercy encompasses all things. So I will decree it [especially] for those who fear Me and give zakah and those who believe in Our verses.',
    tafsirSource: 'تفسير ابن كثير / Tafsir Ibn Kathir',
    tafsirSummaryAr: 'أورد ابن كثير أن رحمة الله عامة لكل مخلوق في الدنيا، وخاصة بالمؤمنين المتقين في الآخرة.',
    tafsirSummaryEn: 'Ibn Kathir notes that Allah’s mercy is general for all creatures in this world, and reserved with special eternal perfection for the faithful in the Hereafter.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1080&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    durationSeconds: 105,
    durationFormatted: '01:45',
    language: 'dual',
    viewsCount: 16700,
    savesCount: 3890,
    reciterNameAr: 'مشاري راشد العفاسي',
    reciterNameEn: 'Mishary Rashid Alafasy',
    reciterAudioUrl: 'https://audio.qurancdn.com/Alafasy/mp3/007156.mp3',
    createdAt: '2026-08-08T12:00:00Z',
    relatedVerses: [
      {
        surahNumber: 39,
        surahNameAr: 'الزمر',
        surahNameEn: 'Az-Zumar',
        ayahNumber: 53,
        verseKey: '39:53',
        textUthmani: '۞ قُلْ يَٰعِبَادِىَ ٱلَّذِينَ أَسْرَفُوا۟ عَلَىٰٓ أَنفُسِهِمْ لَا تَقْنَطُوا۟ مِن رَّحْمَةِ ٱللَّهِ ۚ إِنَّ ٱللَّهَ يَغْفِرُ ٱلذُّنُوبَ جَمِيعًا',
        translation: 'Say, "O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins."',
      },
    ],
    relatedStorySlugs: ['duha-morning-solace', 'tawbah-forgiveness-doors', 'jannah-gardens-bliss'],
    takeawaysAr: [
      'عدم القنوط من رحمة الله مهما عظمت الخطايا',
      'التقوى والعمل الصالح مفتاح الفوز بالرحمة الخاصة',
      'التخلق بخلق الرحمة مع سائر خلق الله',
    ],
    takeawaysEn: [
      'Never despair of Divine mercy regardless of past shortcomings',
      'Righteousness and charity unlock the highest stations of divine grace',
      'Embodying compassion and mercy towards all of Allah’s creation',
    ],
  },
  {
    id: 'jannah-gardens-bliss',
    slug: 'jannah-eternal-gardens-of-bliss',
    titleAr: 'نعيم الجنة: فيها ما لا عين رأت',
    titleEn: 'Gardens of Paradise: Eternal Bliss Unseen',
    surahNumber: 55,
    surahNameAr: 'الرحمن',
    surahNameEn: 'Ar-Rahman',
    ayahStart: 46,
    ayahEnd: 60,
    ayahRange: '55:46-60',
    category: 'paradise',
    categoryNameAr: 'الجنة ونعيمها',
    categoryNameEn: 'Paradise',
    shortSummaryAr: 'مشاهد قرآنية ساحرة من سورة الرحمن لجنات النعيم وأنهارها وظلالها والجزاء الأوفى لأهل الإحسان.',
    shortSummaryEn: 'Enchanting Quranic vistas from Surah Ar-Rahman depicting twin gardens, flowing springs, and supreme rewards.',
    fullExplanationAr: 'يصف القرآن الكريم في سورة الرحمن مقام الخائفين من جلال ربهم، حيث أعد لهم جنتين من فضة وجنتين من ذهب، فيهما عينان تجريان ومن كل فاكهة زوجان، متكئين على فرش بطائنها من إستبرق، متوجين بنعيم النظر إلى وجه الله الكريم.',
    fullExplanationEn: 'Surah Ar-Rahman portrays the celestial reward for those who reverently awe their Lord: dual gardens of supreme splendor, flowing springs, lush hanging boughs, and pristine companions in pavilions of light.',
    arabicVerseText: 'وَلِمَنْ خَافَ مَقَامَ رَبِّهِۦ جَنَّتَانِ • فَبِأَىِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ • ذَوَاتَآ أَفْنَانٍۢ • هَلْ جَزَآءُ ٱلْإِحْسَٰنِ إِلَّا ٱلْإِحْسَٰنُ',
    translationText: 'But for he who has feared the position of his Lord are two gardens. So which of the favors of your Lord would you deny? Having spreading branches. Is the reward for good [anything] but good?',
    tafsirSource: 'تفسير ابن كثير / Tafsir Ibn Kathir',
    tafsirSummaryAr: 'ذكر ابن كثير أن الجنتين ثواب لمن هم بالمعصية فذكر مقام ربه فتركها خوفاً ورجاءً.',
    tafsirSummaryEn: 'Ibn Kathir notes that the twin gardens are the divine reward for whoever contemplated a sin, then remembered the Majesty of Allah and abstained out of awe and love.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    durationSeconds: 150,
    durationFormatted: '02:30',
    language: 'dual',
    viewsCount: 34100,
    savesCount: 8910,
    reciterNameAr: 'عبد الرحمن السديس',
    reciterNameEn: 'Abdur-Rahman As-Sudais',
    reciterAudioUrl: 'https://audio.qurancdn.com/Sudais/mp3/055046.mp3',
    createdAt: '2026-08-05T18:00:00Z',
    relatedVerses: [
      {
        surahNumber: 56,
        surahNameAr: 'الواقعة',
        surahNameEn: 'Al-Waqi\'ah',
        ayahNumber: 10,
        verseKey: '56:10',
        textUthmani: 'وَٱلسَّٰبِقُونَ ٱلسَّٰبِقُونَ • أُو۟لَٰٓئِكَ ٱلْمُقَرَّبُونَ • فِى جَنَّٰتِ ٱلنَّعِيمِ',
        translation: 'And the forerunners, the forerunners - Those are the ones brought near [to Allah] in the Gardens of Pleasure.',
      },
    ],
    relatedStorySlugs: ['rahmah-encompassing-mercy', 'duha-morning-solace', 'creation-cosmic-wonders'],
    takeawaysAr: [
      'استشعار مراقبة الله في السر والعلانية يورث جنات النعيم',
      'جزاء الإحسان في الدنيا هو الإحسان المطلق في الآخرة',
      'الجنة هي الموطن الحقيقي للمؤمن وغاية سعيه',
    ],
    takeawaysEn: [
      'Reverent mindfulness of Allah in solitude yields eternal Paradise',
      'The supreme reward for excellence in this life is boundless Divine excellence',
      'Paradise is the ultimate homeland and destination of the faithful soul',
    ],
  },
  {
    id: 'luqman-sage-wisdom',
    slug: 'luqman-wisdom-for-living',
    titleAr: 'وصايا لقمان: حكمة ترسيخ الأخلاق والتوحيد',
    titleEn: 'The Wisdom of Luqman: Moral Foundations',
    surahNumber: 31,
    surahNameAr: 'لقمان',
    surahNameEn: 'Luqman',
    ayahStart: 12,
    ayahEnd: 19,
    ayahRange: '31:12-19',
    category: 'wisdom',
    categoryNameAr: 'حكمة وموعظة',
    categoryNameEn: 'Wisdom',
    shortSummaryAr: 'منظومة أخلاقية وتربوية خالدة من وصايا لقمان الحكيم لابنه في التوحيد ومراقبة الله وخفض الصوت وبر الوالدين.',
    shortSummaryEn: 'A timeless pedagogical masterclass of sage counsel given by Luqman to his son on monotheism, humility, and character.',
    fullExplanationAr: 'آتى الله لقمان الحكمة، فصاغ لابنه وصايا جامعة تبدأ بالتحذير من الشرك بالله، ثم بيان سعة علم الله المحيط بمثقال حبة من خردل في صخرة أو في السماوات أو في الأرض، ثم الأمر بإقامة الصلاة والأمر بالمعروف والنهي عن المنكر والصبر، وختمها بآداب التواضع وخفض الصوت.',
    fullExplanationEn: 'Endowed with profound wisdom, Luqman presented his son with an exquisite ethical roadmap: guarding pure monotheism, recognizing Allah’s omniscience down to the weight of a mustard seed, upholding prayer, enjoining good with patience, and walking upon the earth with humility.',
    arabicVerseText: 'وَإِذْ قَالَ لُقْمَٰنُ لِٱبْنِهِۦ وَهُوَ يَعِظُهُۥ يَٰبُنَىَّ لَا تُشْرِكْ بِٱللَّهِ ۖ إِنَّ ٱلشِّرْكَ لَظُلْمٌ عَظِيمٌۭ • يَٰبُنَىَّ إِنَّهَآ إِن تَكُ مِثْقَالَ حَبَّةٍۢ مِّنْ خَرْدَلٍۢ فَتَكُن فِى صَخْرَةٍ أَوْ فِى ٱلسَّمَٰوَٰتِ أَوْ فِى ٱلْأَرْضِ يَأْتِ بِهَا ٱللَّهُ',
    translationText: 'And [mention] when Luqman said to his son while he was advising him, "O my son, do not associate [anything] with Allah. Indeed, association [with Him] is great injustice." [And he said], "O my son, indeed if wrong should be the weight of a mustard seed and should be within a rock or [anywhere] in the heavens or in the earth, Allah will bring it forth."',
    tafsirSource: 'تفسير ابن كثير / Tafsir Ibn Kathir',
    tafsirSummaryAr: 'بين ابن كثير أن الحكمة هي الفهم والعقل والنطق بالصواب، وأن وصايا لقمان جمعت أصول الدين وفروع الأخلاق.',
    tafsirSummaryEn: 'Ibn Kathir states that wisdom comprises deep discernment and truthfulness in speech, and Luqman’s counsel combined the foundational tenets of faith with sublime ethical conduct.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1080&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    durationSeconds: 140,
    durationFormatted: '02:20',
    language: 'dual',
    viewsCount: 18900,
    savesCount: 4720,
    reciterNameAr: 'مشاري راشد العفاسي',
    reciterNameEn: 'Mishary Rashid Alafasy',
    reciterAudioUrl: 'https://audio.qurancdn.com/Alafasy/mp3/031012.mp3',
    createdAt: '2026-08-03T15:00:00Z',
    relatedVerses: [
      {
        surahNumber: 31,
        surahNameAr: 'لقمان',
        surahNameEn: 'Luqman',
        ayahNumber: 17,
        verseKey: '31:17',
        textUthmani: 'يَٰبُنَىَّ أَقِمِ ٱلصَّلَوٰةَ وَأْمُرْ بِٱلْمَعْرُوفِ وَٱنْهَ عَنِ ٱلْمُنكَرِ وَٱصْبِرْ عَلَىٰ مَآ أَصَابَكَ',
        translation: 'O my son, establish prayer, enjoin what is right, forbid what is wrong, and be patient over what befalls you.',
      },
    ],
    relatedStorySlugs: ['yusuf-from-well-to-elevation', 'kahf-youth-in-the-cave', 'rahmah-encompassing-mercy'],
    takeawaysAr: [
      'التوحيد هو أساس كل فضيلة وبداية كل حكمة',
      'مراقبة علم الله في أدق تفاصيل الحياة يولد الورع',
      'التواضع ولين الجانب هما زينة المؤمن',
    ],
    takeawaysEn: [
      'Monotheism is the bedrock of all virtue and the crown of wisdom',
      'Mindfulness of Allah’s infinite knowledge fosters deep moral consciousness',
      'Humility, gentle speech, and forbearance adorn the character of the believer',
    ],
  },
  {
    id: 'creation-cosmic-wonders',
    slug: 'creation-cosmic-wonders-and-signs',
    titleAr: 'آيات الخلق: في خلق السماوات والأرض واختلاف الليل والنهار',
    titleEn: 'Cosmic Wonders: Signs in Heavens and Earth',
    surahNumber: 3,
    surahNameAr: 'آل عمران',
    surahNameEn: 'Ali \'Imran',
    ayahStart: 190,
    ayahEnd: 194,
    ayahRange: '3:190-194',
    category: 'creation',
    categoryNameAr: 'خلق الكون والأنفس',
    categoryNameEn: 'Creation',
    shortSummaryAr: 'دعوة قرآنية للتفكر في عظمة الكون وانتظام الأفلاك، ودعاء أولي الألباب: ربنا ما خلقت هذا باطلا سبحانك.',
    shortSummaryEn: 'A divine invitation to contemplate the cosmos, the celestial orbits, and the profound declaration: Our Lord, You did not create this in vain.',
    fullExplanationAr: 'كان النبي صلى الله عليه وسلم يقف في جوف الليل ينظر إلى السماء ويتلو هذه الآيات المباركة ويبكي قائلاً: "ويل لمن قرأها ولم يتفكر فيها". يصف الله تعالى أولي الألباب بأنهم يذكرون الله قياماً وقعوداً وعلى جنوبهم ويتفكرون في عظمة خلق السماوات والأرض، فيصلون إلى اليقين بأن هذا النظام البديع وراءه خالق حكيم.',
    fullExplanationEn: 'The Prophet Muhammad would gaze at the night sky and recite these verses with profound tears, remarking: "Woe to the one who recites them without contemplation." True intellects remember Allah in all states and contemplate the majesty of the cosmos, reaching certainty that the universe is governed by purposeful Divine wisdom.',
    arabicVerseText: 'إِنَّ فِى خَلْقِ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ وَٱخْتِلَٰفِ ٱلَّيْلِ وَٱلنَّهَارِ لَءَايَٰتٍۢ لِّأُو۟لِى ٱلْأَلْبَٰبِ • ٱلَّذِينَ يَذْكُرُونَ ٱللَّهَ قِيَٰمًۭا وَقُعُودًۭا وَعَلَىٰ جُنُوبِهِمْ وَيَتَفَكَّرُونَ فِى خَلْقِ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ رَبَّنَا مَا خَلَقْتَ هَٰذَا بَٰطِلًۭا سُبْحَٰنَكَ فَقِنَا عَذَابَ ٱلنَّارِ',
    translationText: 'Indeed, in the creation of the heavens and the earth and the alternation of the night and the day are signs for those of understanding - Who remember Allah while standing or sitting or [lying] on their sides and give thought to the creation of the heavens and the earth, [saying], "Our Lord, You did not create this aimlessly; exalted are You; then protect us from the punishment of the Fire."',
    tafsirSource: 'تفسير ابن كثير / Tafsir Ibn Kathir',
    tafsirSummaryAr: 'أكد ابن كثير أن التفكر في آيات الآفاق والأنفس يورث الخشية وتعظيم الرب جل جلاله.',
    tafsirSummaryEn: 'Ibn Kathir notes that contemplating the cosmic horizons and living souls inspires awe, reverence, and profound adoration of the Almighty.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1080&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    durationSeconds: 125,
    durationFormatted: '02:05',
    language: 'dual',
    viewsCount: 25400,
    savesCount: 6120,
    reciterNameAr: 'مشاري راشد العفاسي',
    reciterNameEn: 'Mishary Rashid Alafasy',
    reciterAudioUrl: 'https://audio.qurancdn.com/Alafasy/mp3/003190.mp3',
    createdAt: '2026-08-01T20:00:00Z',
    relatedVerses: [
      {
        surahNumber: 41,
        surahNameAr: 'فصلت',
        surahNameEn: 'Fussilat',
        ayahNumber: 53,
        verseKey: '41:53',
        textUthmani: 'سَنُرِيهِمْ ءَايَٰتِنَا فِى ٱلْءَافَاقِ وَفِىٓ أَنفُسِهِمْ حَتَّىٰ يَتَبَيَّنَ لَهُمْ أَنَّهُ ٱلْحَقُّ',
        translation: 'We will show them Our signs in the horizons and within themselves until it becomes clear to them that it is the truth.',
      },
    ],
    relatedStorySlugs: ['jannah-eternal-gardens-of-bliss', 'rahmah-encompassing-mercy', 'luqman-wisdom-for-living'],
    takeawaysAr: [
      'التفكر عبادة قلبية جليلة تقرب العبد من ربه',
      'الجمع بين الذكر باللسان والتفكر بالعقل هو شأن أولي الألباب',
      'الكون كله شاهد على عظمة الخالق وحكمته ووحدانيته',
    ],
    takeawaysEn: [
      'Cosmic contemplation is a profound spiritual worship bridging soul and Creator',
      'Uniting verbal remembrance with intellectual contemplation defines true understanding',
      'The entire universe bears witness to the Majesty and absolute Oneness of Allah',
    ],
  },
];

export function getStoryBySlug(slug: string): QuranStory | undefined {
  return QURAN_STORIES.find((s) => s.slug === slug || s.id === slug);
}

export function getStoriesByCategory(category: StoryCategory): QuranStory[] {
  return QURAN_STORIES.filter((s) => s.category === category);
}
