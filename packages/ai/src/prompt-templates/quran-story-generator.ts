import type { QuranStoryGenerateParams, QuranStoryMode, VisualRepresentationPolicy } from '../types.js';

export function buildQuranStoryGeneratorPrompt(params: QuranStoryGenerateParams): {
  systemPrompt: string;
  userPrompt: string;
} {
  const isAr = params.locale === 'ar' || !params.locale;

  const modeInstructions: Record<QuranStoryMode, { ar: string; en: string; sceneCount: string; targetDuration: string }> = {
    reflection: {
      ar: 'أسلوب تدبري تأملي عميق يركز على رقة القلب، واستشعار معاني أسماء الله وصفاته وعظمته، والتفكر في النفس والكون.',
      en: 'Deep contemplative style focusing on spiritual introspection, softening the heart, Divine names & attributes, and cosmic wonder.',
      sceneCount: '3-4 scenes',
      targetDuration: '45-60 seconds total',
    },
    educational: {
      ar: 'أسلوب تعليمي تحليلي يشرح المفردات اللغوية، وسياق الآيات وأسباب النزول المعتمدة، مع استنباط الفوائد العقدية والتربوية بدقة.',
      en: 'Educational explanatory style breaking down linguistic nuances, context of revelation, and core theological & practical lessons.',
      sceneCount: '4-5 scenes',
      targetDuration: '60-90 seconds total',
    },
    cinematic: {
      ar: 'أسلوب سينمائي مهيب يركز على المشاهد البصرية الغامرة، والتدرج الدرامي الوقور، وحركة الكاميرا السينمائية مع نبرة صوتية ملحمية ومؤثرة.',
      en: 'Epic cinematic style with immersive visual world-building, majestic pacing, sweeping camera cinematography, and evocative narration.',
      sceneCount: '4-6 scenes',
      targetDuration: '60-90 seconds total',
    },
    short_reminder: {
      ar: 'أسلوب تذكرة سريعة مكثفة ومركزة (Shorts/Reels)، تبدأ بجملة خاطفة (Hook) في أول ثانيتين، وتوصل رسالة إيمانية قاطعة وموجزة.',
      en: 'Short-form high-impact reminder (Shorts/Reels) with a 2-second hook, fast-paced scenes, and a memorable core takeaway.',
      sceneCount: '2-3 scenes',
      targetDuration: '30-45 seconds total',
    },
    children_friendly: {
      ar: 'أسلوب مبسط ومحبب للأطفال، يستخدم مفردات سهلة، وأمثلة محسوسة من الطبيعة (الطيور، النجوم، البحار)، مع ترسيخ محبة الله ورجائه.',
      en: 'Gentle, inspiring tone tailored for youth and children, using clear analogies from nature (stars, rain, trees) to build love for Allah.',
      sceneCount: '3-4 scenes',
      targetDuration: '45-60 seconds total',
    },
    social_media: {
      ar: 'أسلوب تفاعلي جذاب لشبكات التواصل الاجتماعي، مصمم لجذب الانتباه في الثواني الأولى، مع دعوة واضحة للتأمل والمشاركة (Call-to-Action).',
      en: 'Engaging social media format optimized for viral watch-time, dynamic transitions, curiosity hook, and engaging call-to-action.',
      sceneCount: '3-4 scenes',
      targetDuration: '40-60 seconds total',
    },
  };

  const policyDescription: Record<VisualRepresentationPolicy, string> = {
    symbolic: 'Symbolic imagery focusing on metaphors of light, shadow, nature, ancient architecture, and cosmic balance.',
    environmental: 'Environmental vistas: mountains, tranquil seas, flowing rivers, vast deserts, lush gardens, and golden dawn horizons.',
    celestial: 'Cosmic phenomena: rotating starfields, glowing nebulae, solar transitions, orbital spheres, and celestial balance.',
    architectural: 'Sacred architectural heritage: traditional arches, Islamic geometric patterns, antique lanterns, and carved wood textures.',
    calligraphic: 'Luminous dynamic Arabic calligraphy interwoven with atmospheric ambient light, particles, and organic motifs.',
  };

  const selectedMode = modeInstructions[params.mode] || modeInstructions.reflection;
  const selectedPolicy = policyDescription[params.visualPolicy || 'environmental'];

  const systemPrompt = isAr
    ? `أنت باحث ومؤلف قرآني خبير، تجمع بين التحقيق العلمي الدقيق للأدلة الشرعية والفنون البصرية السينمائية الراقية.
التزم التزاماً صارماً بالقواعد الإسلامية العشر التالية:
1. عدم اختلاق أي آية قرآنية، واستخدام النص العثماني الموثق فقط.
2. عدم تحريف النص القرآني أو إعادة صياغته على أنه قرآن.
3. التمييز القاطع بين النص القرآني، والترجمة، وتفسير العلماء المعتمد، والتصور البصري المقترح.
4. عدم اختلاق أي أحداث أو قصص تاريخية لا أصل لها في كتب التفسير والحديث المعتمدة.
5. تحريم وتجنب أي تمثيل أو تجسيد بصري للذات الإلهية (سبحانه وتعالى) قطعاً، والاعتماد فقط على آيات الله في الآفاق والكون.
6. تجنب التجسيد المباشر للأنبياء والرسل؛ والاعتماد على المنظور غير المباشر (First-person POV)، أو حركة الضوء والظل، أو العناصر البيئية والطبيعية (مثل عصا في الرمال، أو أمواج البحر، أو قمم الجبال).
7. تفضيل السرد البيئي والرمزي والكوني المهيب.
8. عزو كل فائدة عقدية أو تفسيرية إلى مصدرها المعتمد (ابن كثير، السعدي، الطبري، الميسر).
9. توثيق المرجع القرآني والبيانات بدقة.
10. إخراج النتيجة بصيغة JSON القياسية المطلوبة بدقة متناهية.`
    : `You are a premier Islamic scholar and master visual storyteller combining strict theological rigor with high-end cinematic narrative craft.
You MUST strictly obey the following 10 Sacred Islamic Guardrails:
1. Never invent or hallucinate Quranic verses.
2. Never alter or distort the sacred Quranic text.
3. Never present human commentary or interpretation as divine scripture.
4. Never fabricate historical events or claims absent from verified classical Tafsir.
5. Clearly distinguish between: Quran, Translation, Tafsir commentary, and AI visual storyboarding.
6. Strictly PROHIBIT any visual depiction of Allah (Subhanahu wa Ta'ala) — use majestic environmental and cosmic metaphors only.
7. Avoid direct figurative depiction of Prophets — use first-person POV, light, shadow, symbolic artifacts, or natural environments.
8. Prioritize symbolic, celestial, and environmental storytelling.
9. Ground every theological claim in authentic classical scholarly sources.
10. Output strictly valid JSON matching the required schema.`;

  const userPrompt = `
Generate a structured visual story for the following verified Quranic passage:

=== SCRIPTURAL DATA & CONTEXT ===
- Surah: ${params.surahNameAr} (${params.surahNameEn}) — Chapter #${params.surahNumber}
- Ayah Reference: ${params.surahNumber}:${params.ayahStart}${params.ayahStart !== params.ayahEnd ? `-${params.ayahEnd}` : ''}
- Revelation Place: ${params.revelationPlace || 'Makki/Madani'}
- Verbatim Arabic Text: "${params.arabicText}"
- Verified Translation (${params.translationAuthor || 'Scholarly Translation'}): "${params.translationText}"
- Approved Tafsir Context (${params.tafsirAuthor || 'Classical Tafsir'}):
"${params.tafsirText || 'Reflections and core meanings derived from authentic classical commentaries.'}"
${params.customPromptFocus ? `- Custom Focus Request: "${params.customPromptFocus}"` : ''}

=== STORY PARAMETERS ===
- Selected Mode: ${params.mode.toUpperCase()}
- Mode Guidelines: ${isAr ? selectedMode.ar : selectedMode.en}
- Recommended Scene Count: ${selectedMode.sceneCount}
- Target Duration: ${selectedMode.targetDuration}
- Visual Representation Policy: ${selectedPolicy}
- Language of Output: ${isAr ? 'Arabic (العربية الفصحى البليغة)' : 'English (Articulate, Reverent English)'}

=== REQUIRED JSON OUTPUT STRUCTURE ===
You must respond ONLY with a valid, parseable JSON object matching this exact structure:
{
  "title": "Inspiring and reverent story title",
  "hook": "Engaging opening hook that grabs attention within 3 seconds",
  "theme": "Core spiritual and contextual theme (e.g. عظمة الله، الملك، العلم، الحفظ، القيومية)",
  "emotionalTone": "Awe, Serenity, Reverence, Hope, or Contemplation",
  "scenes": [
    {
      "sceneNumber": 1,
      "duration": "10s",
      "narration": "Exact narration script to be spoken in voiceover for this scene",
      "visualDescription": "Detailed visual scene prompt suitable for AI image/video generation (emphasizing nature, light, celestial grandeur, without depicting divine or prophetic figures)",
      "cameraMovement": "Specific cinematic camera movement (e.g. Slow aerial tracking shot descending over golden dunes / Wide static panoramic shot / Slow push-in on illuminated manuscripts)",
      "transition": "Transition to next scene (e.g. Dissolve through golden morning mist / Seamless whip pan / Gentle fade to starlit sky)"
    }
  ],
  "ending": "Profound concluding reflection and call to spiritual action",
  "verseReference": "${params.surahNumber}:${params.ayahStart}${params.ayahStart !== params.ayahEnd ? `-${params.ayahEnd}` : ''}"
}
`;

  return { systemPrompt, userPrompt };
}
