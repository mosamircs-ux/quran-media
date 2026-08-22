export interface QuranTopic {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  verseKeys: string[];
}

export const QURAN_TOPICS: QuranTopic[] = [
  {
    id: 'mercy',
    nameAr: 'الرحمة والمغفرة',
    nameEn: 'Mercy & Forgiveness',
    descriptionAr: 'آيات تتحدث عن سعة رحمة الله ومغفرته للذنوب',
    descriptionEn: 'Verses on Allah’s boundless mercy and forgiveness',
    icon: '✨',
    verseKeys: ['1:1', '1:3', '39:53', '7:156', '55:1', '93:5'],
  },
  {
    id: 'patience',
    nameAr: 'الصبر واليقين',
    nameEn: 'Patience & Conviction',
    descriptionAr: 'آيات في فضل الصبر عند البلاء وحسن التوكل',
    descriptionEn: 'Verses on steadfastness, resilience, and divine reward',
    icon: '🛡️',
    verseKeys: ['2:153', '2:155', '3:200', '94:5', '94:6', '39:10'],
  },
  {
    id: 'hope',
    nameAr: 'الأمل والسكينة',
    nameEn: 'Hope & Solace',
    descriptionAr: 'آيات تطمئن القلوب وتبشر بالفرج وتفريج الكروب',
    descriptionEn: 'Verses of reassurance, peace, and impending relief',
    icon: '🕊️',
    verseKeys: ['93:3', '93:5', '94:5', '65:7', '21:87', '12:87'],
  },
  {
    id: 'gratitude',
    nameAr: 'الشكر والذكر',
    nameEn: 'Gratitude & Remembrance',
    descriptionAr: 'آيات تدعو لشكر النعم وذكر الله في كل حال',
    descriptionEn: 'Verses on praising divine favors and remembrance',
    icon: '🌱',
    verseKeys: ['2:152', '14:7', '55:13', '16:18', '31:12'],
  },
  {
    id: 'creation',
    nameAr: 'عظمة الخلق والكون',
    nameEn: 'Creation & Cosmos',
    descriptionAr: 'آيات تحث على التفكر في خلق السماوات والأرض',
    descriptionEn: 'Verses on the signs in the celestial heavens and nature',
    icon: '🌌',
    verseKeys: ['3:190', '3:191', '67:3', '67:4', '21:30', '51:47'],
  },
  {
    id: 'justice',
    nameAr: 'العدل والأخلاق',
    nameEn: 'Justice & Ethics',
    descriptionAr: 'آيات ترسي قواعد العدل والقسط ومكارم الأخلاق',
    descriptionEn: 'Verses on upright character, equity, and moral beauty',
    icon: '⚖️',
    verseKeys: ['4:135', '5:8', '16:90', '49:13', '17:37'],
  },
  {
    id: 'paradise',
    nameAr: 'الجنة والنعيم',
    nameEn: 'Paradise & Eternity',
    descriptionAr: 'آيات تصف جنات النعيم وما أعده الله للمتقين',
    descriptionEn: 'Verses describing the eternal gardens and bliss of the righteous',
    icon: '🌿',
    verseKeys: ['55:46', '76:12', '76:13', '3:133', '18:107'],
  },
  {
    id: 'supplication',
    nameAr: 'الدعاء والمناجاة',
    nameEn: 'Dua & Supplication',
    descriptionAr: 'أدعية مباركة من القرآن الكريم ونداءات الأنبياء',
    descriptionEn: 'Iconic Quranic prayers and prophetic invocations',
    icon: '🤲',
    verseKeys: ['2:186', '2:201', '2:286', '21:87', '3:8', '20:114'],
  },
];
