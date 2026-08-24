import { BaseAIProvider } from './base.js';
import type {
  AICapability,
  TextGenerationOptions,
  TextResult,
  QuranStoryContext,
  QuranStoryResult,
  QuranStoryGenerateParams,
  QuranStoryVisualScript,
  ImageGenerationOptions,
  ImageResult,
  VideoGenerationOptions,
  VideoResult,
} from '../types.js';

export class MockAIProvider extends BaseAIProvider {
  readonly id = 'mock';
  readonly name = 'Mock Offline Provider';
  readonly capabilities: AICapability[] = ['text', 'story', 'image', 'video'];

  isAvailable(): boolean {
    return true;
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }

  async generateText(prompt: string, options?: TextGenerationOptions): Promise<TextResult> {
    return {
      text: `[Mock AI Response for: ${prompt.slice(0, 50)}...]`,
      provider: this.id,
      model: options?.model || 'mock-v1',
      usage: {
        promptTokens: 20,
        completionTokens: 30,
        totalTokens: 50,
      },
    };
  }

  async *streamText(prompt: string): AsyncIterable<string> {
    const tokens = ['In ', 'the ', 'name ', 'of ', 'Allah, ', 'the ', 'Most ', 'Gracious, ', 'the ', 'Most ', 'Merciful.'];
    for (const t of tokens) {
      await new Promise((r) => setTimeout(r, 20));
      yield t;
    }
  }

  async generateQuranStory(context: QuranStoryContext): Promise<QuranStoryResult> {
    return {
      title: `Contemplation on Surah ${context.surahNameEn}`,
      theme: 'Divine Mercy and Signs in Creation',
      summary: `A profound reflection on verses ${context.ayahStart} to ${context.ayahEnd} of Surah ${context.surahNameEn}.`,
      storyBody: `These majestic verses remind the heart to contemplate the perfection of the universe and turn with humility towards the Creator. Through patience, remembrance, and good deeds, the believer finds peace in this life and success in the hereafter.`,
      reflectionPoints: [
        'Recognizing the endless blessings of Allah in daily life',
        'Maintaining patience during adversity with firm trust',
        'Reflecting upon the cosmic signs that surround us',
      ],
      suggestedVisualPrompts: [
        'Majestic golden sunrise over tranquil desert sand dunes with soft morning mist and radiant sunbeams',
      ],
      provider: this.id,
      model: 'mock-v1',
    };
  }

  async generateStructuredQuranStory(params: QuranStoryGenerateParams): Promise<QuranStoryVisualScript> {
    const isAr = params.locale === 'ar' || !params.locale;
    const key = `${params.surahNumber}:${params.ayahStart}`;

    // Curated canonical multi-scene storyboards
    if (key === '2:255') {
      return {
        title: isAr ? 'أعظم آية في كتاب الله: تجليات القيومية والملك المطلق' : 'The Greatest Verse: The All-Sustaining Sovereign',
        hook: isAr ? 'في هذا الكون اللانهائي.. من الذي يمسك مجرات السماء أن تزول دون تعب أو غفلة؟' : 'In this vast cosmos, who sustains every celestial orbit without fatigue or slumber?',
        theme: isAr ? 'عظمة الله، الملك، العلم، الحفظ، القيومية' : 'Divine Magnificence, Absolute Sovereignty, Infinite Knowledge, Cosmic Preservation',
        emotionalTone: isAr ? 'خشوع وإجلال وسكينة' : 'Awe, Reverence, Peace',
        scenes: [
          {
            sceneNumber: 1,
            duration: '12s',
            narration: isAr
              ? 'الله لا إله إلا هو الحي الذي لا يموت، القيوم القائم بنفسه والمقيم لكل ذرة في هذا الوجود.'
              : 'Allah: there is no deity worthy of worship except Him, the Ever-Living who never dies, the Self-Sustaining by Whom all existence stands.',
            visualDescription:
              'A vast cinematic cosmic vista showing spiraling luminous galaxies and stars rotating in breathtaking equilibrium and peace.',
            cameraMovement: 'Slow continuous descent tracking through twinkling star clusters and cosmic dust',
            transition: 'Gentle dissolve into golden twilight atmosphere',
          },
          {
            sceneNumber: 2,
            duration: '10s',
            narration: isAr
              ? 'لا تأخذه سِنَةٌ ولا نوم؛ رقابة مطلقة ويقظة تامة تدبر أفلاك الكون وإيقاع الحياة بلا انقطاع.'
              : 'Neither drowsiness nor sleep overtakes Him; an absolute, unceasing vigilance orchestrating the harmony of all creation.',
            visualDescription:
              'Serene night desert landscape with rolling dunes beneath a crystalline starry sky, a gentle calm breeze moving over silver ripples of sand.',
            cameraMovement: 'Smooth low-angle tracking shot gliding across dune ridges under the Milky Way',
            transition: 'Slow wipe with ambient dawn light rays',
          },
          {
            sceneNumber: 3,
            duration: '12s',
            narration: isAr
              ? 'له ملك السماوات والأرض، يعلم ما بين أيديهم وما خلفهم، ولا يحيط مخلوق بشيء من علمه إلا بما شاء.'
              : 'To Him belongs everything in the heavens and earth. He fully encompasses all past, present, and future, while no creature grasps anything of His knowledge except as He wills.',
            visualDescription:
              'Majestic mountain peaks piercing above golden sea of morning clouds, illuminated by radiant morning sun rays.',
            cameraMovement: 'Dramatic aerial crane shot soaring over misty summits towards the sunrise',
            transition: 'Ethereal fade into soft glowing aura',
          },
          {
            sceneNumber: 4,
            duration: '14s',
            narration: isAr
              ? 'وسع كرسيه السماوات والأرض، ولا يئوده ولا يعجزه حفظهما، وهو العلي بذاته وقدره، العظيم بسلطانه.'
              : 'His Seat encompasses the heavens and earth, and preserving both wearies Him not. For He is the Most High in essence and status, the Supreme in majesty.',
            visualDescription:
              'A grand tranquil ocean at golden hour reflecting the boundless celestial sky, wave crests shimmering in amber and turquoise light.',
            cameraMovement: 'Slow forward pull-out over infinite ocean horizon meeting the sky',
            transition: 'Slow fade to warm contemplative silence',
          },
        ],
        ending: isAr
          ? 'إذا كان هذا الإله العظيم يحفظ الكون الفسيح، فكيف يغفل عن قلبك ودعائك؟ ثق بحفظه وتوكل على قيوميته.'
          : 'If this Supreme Creator preserves the vast cosmos effortlessly, how could He ever overlook your heart? Place your complete trust in His loving protection.',
        verseReference: '2:255',
        mode: params.mode,
        provider: this.id,
        model: 'scholarly-mock-engine-v1',
      };
    }

    if (params.surahNumber === 12) {
      return {
        title: isAr ? 'أحسن القصص: لطف الله الخفي في ظلمة البئر' : 'The Best of Stories: Divine Grace in the Solitary Well',
        hook: isAr ? 'حين يتآمر عليك أقرب الناس.. كيف يحول الله كيد البشر إلى تمكين وعزة؟' : 'When adversity surrounds you, how does subtle Divine decree transform trials into triumph?',
        theme: isAr ? 'اليقين، الصبر الجميل، لطف الله الخفي، غلبة أمر الله' : 'Unwavering Certainty, Beautiful Patience, Hidden Grace, Supreme Wisdom',
        emotionalTone: isAr ? 'أمل وسكينة ويقين' : 'Hope, Solace, Certainty',
        scenes: [
          {
            sceneNumber: 1,
            duration: '10s',
            narration: isAr
              ? 'بدأت القصة برؤيا صادقة أحد عشر كوكباً والشمس والقمر، بشرى عظيمة مهدت لامتحان عظيم.'
              : 'The journey unfolded with a truthful dream—eleven celestial stars, the sun, and the moon—a prophecy heralding divine elevation.',
            visualDescription:
              'Eleven brilliant glowing celestial stars aligned with a radiant golden crescent moon across a tranquil deep blue night sky.',
            cameraMovement: 'Slow vertical tilt from horizon upward toward the glowing celestial alignment',
            transition: 'Soft blur dissolve into deep earth tones',
          },
          {
            sceneNumber: 2,
            duration: '12s',
            narration: isAr
              ? 'في قعر البئر المظلم، انقطع حبل البشر واتصل حبل السماء، فنزل الوحي سكينة وطمأنينة.'
              : 'In the deep solitary well, worldly ties severed while celestial guidance descended, filling the darkness with divine reassurance.',
            visualDescription:
              'Ancient stone well from an interior upward view, where a piercing golden beam of morning sunlight cuts through the shadows onto clear water.',
            cameraMovement: 'Slow upward tracking shot looking up from the depths toward the circular daylight opening',
            transition: 'Whip pan to vast sun-drenched landscape',
          },
          {
            sceneNumber: 3,
            duration: '14s',
            narration: isAr
              ? 'والله غالب على أمره؛ دارت الأيام وتقلبت الأحوال حتى جاء التمكين من حيث لا يحتسب أحد.'
              : 'And Allah is predominant over His affair; through every trial, Divine wisdom paved the path toward elevation and mercy.',
            visualDescription:
              'Ancient palatial stone arches looking out over lush green palm groves and the calm flowing waters of a fertile river at sunset.',
            cameraMovement: 'Smooth gliding dolly shot moving through grand carved arches towards the glowing sunset',
            transition: 'Gentle dissolve to calm golden horizon',
          },
        ],
        ending: isAr
          ? 'لا تيأس من فرج الله مهما اشتدت الظلمات؛ فإن قعر البئر كان الخطوة الأولى نحو عرش مصر.'
          : 'Never despair of Divine deliverance; the bottom of the well was merely the first step toward righteous elevation.',
        verseReference: `${params.surahNumber}:${params.ayahStart}-${params.ayahEnd}`,
        mode: params.mode,
        provider: this.id,
        model: 'scholarly-mock-engine-v1',
      };
    }

    // Dynamic schema-compliant story generator for any Surah / Ayah
    return {
      title: isAr
        ? `تأملات في سورة ${params.surahNameAr}: آيات الحكمة والهدى`
        : `Reflections on Surah ${params.surahNameEn}: Verses of Guidance`,
      hook: isAr
        ? `ما الرسالة التي يبعثها الله لقلبك اليوم من خلال سورة ${params.surahNameAr}؟`
        : `What profound reminder does Allah send to your heart through Surah ${params.surahNameEn}?`,
      theme: isAr
        ? `التوحيد، التدبر، العمل الصالح، استشعار عظمة الله في سورة ${params.surahNameAr}`
        : `Faith, Contemplation, Righteous Deeds, Divine Signs in ${params.surahNameEn}`,
      emotionalTone: isAr ? 'سكينة ورجاء وخشوع' : 'Peace, Hope, Reverence',
      scenes: [
        {
          sceneNumber: 1,
          duration: '10s',
          narration: isAr
            ? `تأمل في هذه الآيات الكريمة من سورة ${params.surahNameAr}، حيث يتجلى هدي القرآن ونوره المبين.`
            : `Reflect upon these majestic verses from Surah ${params.surahNameEn}, where the illuminating guidance of the Quran reveals its wisdom.`,
          visualDescription:
            'A sweeping vista of ancient sunlit mountains overlooking a tranquil emerald valley at early dawn with gentle golden mist.',
          cameraMovement: 'Slow forward aerial glide through the mist above the green valley',
          transition: 'Dissolve through ambient morning rays',
        },
        {
          sceneNumber: 2,
          duration: '12s',
          narration: isAr
            ? `يبين الله تعالى في كتابه سنن الكون ودلائل قدرته، ليرشد القلوب التائهة إلى بر الأمان واليقين.`
            : `The Almighty illustrates the universal signs and evidences of His power, guiding searching hearts toward peace and certainty.`,
          visualDescription:
            'Calm ocean waves lapping against smooth shoreline stones beneath a breathtaking sunset painted with orange, purple, and gold.',
          cameraMovement: 'Low angle pan across the glowing shoreline reflections',
          transition: 'Gentle fade to starlit celestial sky',
        },
        {
          sceneNumber: 3,
          duration: '12s',
          narration: isAr
            ? `إن في تلاوة هذه الكلمات وتدبرها حياة للقلوب، وتثبيتاً على طريق الحق والهدى.`
            : `In the recitation and reflection upon these divine words lies true spiritual life, granting firmness upon the righteous path.`,
          visualDescription:
            'An ancient serene courtyard with traditional arabesque geometric arches, soft ambient lantern light illuminating peaceful surroundings.',
          cameraMovement: 'Slow meditative pull-back through the architectural arches',
          transition: 'Slow fade to warm contemplative silence',
        },
      ],
      ending: isAr
        ? `اجعل هذا الذكر نوراً في يومك، واعمل بمقتضى ما علمت؛ فإن القرآن حجة لك أو عليك.`
        : `Carry this divine reminder as illumination in your daily journey, applying its guidance with sincerity and steadfastness.`,
      verseReference: `${params.surahNumber}:${params.ayahStart}${params.ayahStart !== params.ayahEnd ? `-${params.ayahEnd}` : ''}`,
      mode: params.mode,
      provider: this.id,
      model: 'scholarly-mock-engine-v1',
    };
  }

  async generateImage(prompt: string, options: ImageGenerationOptions): Promise<ImageResult> {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
      <defs>
        <radialGradient id="g" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#064e3b"/>
          <stop offset="50%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#020617"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <circle cx="540" cy="700" r="280" fill="#f59e0b" opacity="0.12" filter="blur(50px)"/>
      <circle cx="540" cy="1100" r="350" fill="#10b981" opacity="0.1" filter="blur(60px)"/>
    </svg>`;
    const url = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

    return {
      url,
      provider: this.id,
      model: options.model || 'mock-image-v1',
    };
  }

  async generateVideo(prompt: string, options: VideoGenerationOptions): Promise<VideoResult> {
    return {
      url: 'https://cdn.example.com/mock-video.mp4',
      provider: this.id,
      model: options.model || 'mock-video-v1',
      durationSeconds: options.durationSeconds || 15,
    };
  }
}

