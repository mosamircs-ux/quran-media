import { GoogleGenAI } from '@google/genai';
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

export class GeminiProvider extends BaseAIProvider {
  readonly id = 'gemini';
  readonly name = 'Google Gemini';
  readonly capabilities: AICapability[] = ['text', 'story', 'image'];
  private ai: GoogleGenAI | null = null;

  constructor() {
    super();
    if (env.GOOGLE_AI_KEY) {
      this.ai = new GoogleGenAI({ apiKey: env.GOOGLE_AI_KEY });
    }
  }

  isAvailable(): boolean {
    return Boolean(env.GOOGLE_AI_KEY && this.ai);
  }

  async healthCheck(): Promise<boolean> {
    if (!this.isAvailable() || !this.ai) return false;
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'ping',
      });
      return Boolean(response.text);
    } catch (err) {
      logger.warn({ err }, 'Gemini health check failed');
      return false;
    }
  }

  async generateText(prompt: string, options?: TextGenerationOptions): Promise<TextResult> {
    this.ensureCapability('text');
    if (!this.ai) throw new AiProviderError('Gemini client is not configured');

    const model = options?.model || 'gemini-2.5-flash';
    try {
      const response = await this.ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: options?.systemPrompt,
          temperature: options?.temperature ?? 0.7,
          maxOutputTokens: options?.maxTokens ?? 1500,
        },
      });

      return {
        text: response.text || '',
        provider: this.id,
        model,
      };
    } catch (err) {
      throw new AiProviderError('Gemini text generation failed', err);
    }
  }

  async generateQuranStory(context: QuranStoryContext): Promise<QuranStoryResult> {
    this.ensureCapability('story');
    const isAr = context.locale === 'ar';

    const systemPrompt = isAr
      ? `أنت باحث إسلامي متخصص في استنباط الحكم والتأملات من القرآن الكريم.`
      : `You are an expert Islamic scholar crafting authentic Quranic reflections and stories.`;

    const prompt = `
Analyze and craft a reflective Quranic story in JSON format:
Surah: ${context.surahNameAr} (${context.surahNameEn}) [${context.surahNumber}:${context.ayahStart}-${context.ayahEnd}]
Arabic Verse: "${context.arabicText}"
Translation: "${context.translationText}"

Return JSON:
{
  "title": "Title",
  "theme": "Theme",
  "summary": "Summary",
  "storyBody": "Story reflection body",
  "reflectionPoints": ["Point 1", "Point 2"],
  "suggestedVisualPrompts": ["Nature visual prompt without human figures"]
}
`;

    const result = await this.generateText(prompt, {
      systemPrompt,
      temperature: 0.5,
      model: 'gemini-2.5-flash',
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
        title: `${context.surahNameEn} Reflection`,
        theme: 'Guidance',
        summary: result.text.slice(0, 200),
        storyBody: result.text,
        reflectionPoints: ['Reflection on divine words'],
        suggestedVisualPrompts: ['Majestic mountains in peaceful dawn light'],
        provider: this.id,
        model: result.model,
      };
    }
  }

  async generateStructuredQuranStory(params: QuranStoryGenerateParams): Promise<QuranStoryVisualScript> {
    this.ensureCapability('story');
    const { systemPrompt, userPrompt } = buildQuranStoryGeneratorPrompt(params);

    const model = params.model || 'gemini-2.5-flash';
    const result = await this.generateText(userPrompt, {
      systemPrompt,
      temperature: 0.4,
      model,
      maxTokens: 2500,
    });

    try {
      const cleanJson = result.text.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return {
        title: parsed.title || `${params.surahNameEn} Reflection`,
        hook: parsed.hook || '',
        theme: parsed.theme || 'Divine Guidance',
        emotionalTone: parsed.emotionalTone || 'Reverence',
        scenes: Array.isArray(parsed.scenes) ? parsed.scenes : [],
        ending: parsed.ending || '',
        verseReference: parsed.verseReference || `${params.surahNumber}:${params.ayahStart}`,
        mode: params.mode,
        provider: this.id,
        model,
      };
    } catch (err) {
      logger.warn({ err, rawText: result.text }, 'Failed to parse Gemini structured story JSON; attempting fallback recovery');
      throw new AiProviderError('Failed to parse structured JSON from Gemini response', err);
    }
  }

  async generateImage(prompt: string, options: ImageGenerationOptions): Promise<ImageResult> {
    this.ensureCapability('image');
    if (!this.ai) throw new AiProviderError('Gemini client is not configured');

    const enhancedPrompt = `${prompt}. Majestic transcendent nature, serene lighting, Islamic art style, 8k resolution. NO PEOPLE OR FACES.`;

    try {
      const response = await this.ai.models.generateImages({
        model: options.model || 'imagen-3.0-generate-002',
        prompt: enhancedPrompt,
        config: {
          numberOfImages: 1,
          aspectRatio: options.aspectRatio === '9:16' ? '9:16' : options.aspectRatio === '16:9' ? '16:9' : '1:1',
          outputMimeType: 'image/jpeg',
        },
      });

      const image = response.generatedImages?.[0]?.image;
      if (!image?.imageBytes) throw new Error('No image bytes returned from Imagen');

      const base64Url = `data:image/jpeg;base64,${image.imageBytes}`;
      return {
        url: base64Url,
        provider: this.id,
        model: options.model || 'imagen-3.0-generate-002',
      };
    } catch (err) {
      throw new AiProviderError('Gemini Imagen generation failed', err);
    }
  }
}

