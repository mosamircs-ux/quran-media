import OpenAI from 'openai';
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
} from '../types.js';
import { buildQuranStoryGeneratorPrompt } from '../prompt-templates/quran-story-generator.js';
import { env, logger, AiProviderError } from '@quran-media/config';

export class OpenAIProvider extends BaseAIProvider {
  readonly id = 'openai';
  readonly name = 'OpenAI';
  readonly capabilities: AICapability[] = ['text', 'story', 'image'];
  private client: OpenAI | null = null;

  constructor() {
    super();
    if (env.OPENAI_API_KEY) {
      this.client = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
        organization: env.OPENAI_ORG_ID || undefined,
      });
    }
  }

  isAvailable(): boolean {
    return Boolean(env.OPENAI_API_KEY && this.client);
  }

  async healthCheck(): Promise<boolean> {
    if (!this.isAvailable() || !this.client) return false;
    try {
      await this.client.models.list();
      return true;
    } catch (err) {
      logger.warn({ err }, 'OpenAI health check failed');
      return false;
    }
  }

  async generateText(prompt: string, options?: TextGenerationOptions): Promise<TextResult> {
    this.ensureCapability('text');
    if (!this.client) throw new AiProviderError('OpenAI client is not configured');

    const model = options?.model || 'gpt-4o';
    try {
      const response = await this.client.chat.completions.create({
        model,
        messages: [
          ...(options?.systemPrompt ? [{ role: 'system' as const, content: options.systemPrompt }] : []),
          { role: 'user' as const, content: prompt },
        ],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 1500,
      });

      const text = response.choices[0]?.message?.content || '';
      return {
        text,
        provider: this.id,
        model,
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        },
      };
    } catch (err) {
      throw new AiProviderError('OpenAI text generation failed', err);
    }
  }

  async *streamText(prompt: string, options?: TextGenerationOptions): AsyncIterable<string> {
    this.ensureCapability('text');
    if (!this.client) throw new AiProviderError('OpenAI client is not configured');

    const model = options?.model || 'gpt-4o';
    const stream = await this.client.chat.completions.create({
      model,
      messages: [
        ...(options?.systemPrompt ? [{ role: 'system' as const, content: options.systemPrompt }] : []),
        { role: 'user' as const, content: prompt },
      ],
      temperature: options?.temperature ?? 0.7,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  }

  async generateQuranStory(context: QuranStoryContext): Promise<QuranStoryResult> {
    this.ensureCapability('story');
    const isAr = context.locale === 'ar';

    const systemPrompt = isAr
      ? `أنت باحث إسلامي وكاتب محتوى قرآني متخصص. مهمتك صياغة تأملات وقصص قرآنية موثوقة مستندة إلى الآيات الكريمة وتفسيرها المعتمد. يجب احترام قدسية النص القرآني وعدم اختلاق تفاصيل غير موجودة بالتفاسير المعتمدة.`
      : `You are an Islamic scholar and specialized Quranic storyteller. Your mission is to craft authentic, inspiring Quranic reflections and context grounded in authentic Tafsir. Respect the sanctity of the Quranic text at all times.`;

    const userPrompt = `
Analyze and craft a reflective story for:
Surah: ${context.surahNameAr} (${context.surahNameEn}) [${context.surahNumber}:${context.ayahStart}-${context.ayahEnd}]
Arabic Verse: "${context.arabicText}"
Translation: "${context.translationText}"
Target Tone: ${context.tone || 'contemplative'}
Language: ${isAr ? 'Arabic' : 'English'}

Return ONLY a valid JSON object matching this schema:
{
  "title": "Inspiring Title",
  "theme": "Core Theme (e.g. Mercy, Patience, Creation)",
  "summary": "2-sentence summary",
  "storyBody": "Detailed structured reflection body formatted with paragraphs",
  "reflectionPoints": ["Point 1", "Point 2", "Point 3"],
  "suggestedVisualPrompts": [
    "Vivid non-anthropomorphic nature or cosmic scene prompt suitable for AI image generation (e.g. serene ocean waves, galaxy stars, majestic mountain sunrise, ancient olive trees)"
  ]
}
`;

    const result = await this.generateText(userPrompt, {
      systemPrompt,
      temperature: 0.5,
      model: 'gpt-4o',
    });

    try {
      const cleanJson = result.text.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return {
        ...parsed,
        provider: this.id,
        model: result.model,
      };
    } catch {
      return {
        title: `${context.surahNameEn} Reflections`,
        theme: 'Divine Guidance',
        summary: result.text.slice(0, 200),
        storyBody: result.text,
        reflectionPoints: ['Pondering the divine verses', 'Applying guidance to daily life'],
        suggestedVisualPrompts: ['Majestic mountain range at dawn under radiant golden morning light'],
        provider: this.id,
        model: result.model,
      };
    }
  }

  async generateStructuredQuranStory(params: QuranStoryGenerateParams): Promise<QuranStoryVisualScript> {
    this.ensureCapability('story');
    if (!this.client) throw new AiProviderError('OpenAI client is not configured');

    const { systemPrompt, userPrompt } = buildQuranStoryGeneratorPrompt(params);
    const model = params.model || 'gpt-4o';

    try {
      const response = await this.client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.4,
        response_format: { type: 'json_object' },
      });

      const raw = response.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(raw);

      return {
        title: parsed.title || `${params.surahNameEn} Reflection`,
        hook: parsed.hook || '',
        theme: parsed.theme || 'Divine Wisdom',
        emotionalTone: parsed.emotionalTone || 'Reverence',
        scenes: Array.isArray(parsed.scenes) ? parsed.scenes : [],
        ending: parsed.ending || '',
        verseReference: parsed.verseReference || `${params.surahNumber}:${params.ayahStart}`,
        mode: params.mode,
        provider: this.id,
        model,
      };
    } catch (err) {
      throw new AiProviderError('OpenAI structured story generation failed', err);
    }
  }

  async generateImage(prompt: string, options: ImageGenerationOptions): Promise<ImageResult> {
    this.ensureCapability('image');
    if (!this.client) throw new AiProviderError('OpenAI client is not configured');

    const size =
      options.aspectRatio === '9:16' || options.aspectRatio === '4:5'
        ? '1024x1792'
        : options.aspectRatio === '16:9'
          ? '1792x1024'
          : '1024x1024';

    // Enhance prompt with reverence guidelines
    const enhancedPrompt = `${prompt}. Cinematic photorealistic composition, peaceful transcendent atmosphere, Islamic artistic aesthetics, natural landscapes, glowing warm ambient light, 8k resolution, ultra detailed, award winning photography. NO HUMAN FACES OR FIGURES.`;

    try {
      const response = await this.client.images.generate({
        model: options.model || 'dall-e-3',
        prompt: enhancedPrompt,
        size: size as '1024x1024' | '1024x1792' | '1792x1024',
        quality: 'hd',
        n: 1,
      });

      const firstImage = response.data?.[0];
      const url = firstImage?.url;
      if (!url) throw new Error('No image URL returned from OpenAI');

      return {
        url,
        provider: this.id,
        model: options.model || 'dall-e-3',
        revisedPrompt: firstImage?.revised_prompt,
      };
    } catch (err) {
      throw new AiProviderError('OpenAI image generation failed', err);
    }
  }
}

