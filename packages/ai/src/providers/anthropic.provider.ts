import Anthropic from '@anthropic-ai/sdk';
import { BaseAIProvider } from './base.js';
import type {
  AICapability,
  TextGenerationOptions,
  TextResult,
  QuranStoryContext,
  QuranStoryResult,
  QuranStoryGenerateParams,
  QuranStoryVisualScript,
} from '../types.js';
import { buildQuranStoryGeneratorPrompt } from '../prompt-templates/quran-story-generator.js';
import { env, logger, AiProviderError } from '@quran-media/config';

export class AnthropicProvider extends BaseAIProvider {
  readonly id = 'anthropic';
  readonly name = 'Anthropic Claude';
  readonly capabilities: AICapability[] = ['text', 'story'];
  private client: Anthropic | null = null;

  constructor() {
    super();
    if (env.ANTHROPIC_API_KEY) {
      this.client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, timeout: 30000 });
    }
  }

  isAvailable(): boolean {
    return Boolean(env.ANTHROPIC_API_KEY && this.client);
  }

  async healthCheck(): Promise<boolean> {
    if (!this.isAvailable() || !this.client) return false;
    try {
      const res = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'hi' }],
      });
      return Boolean(res.content);
    } catch (err) {
      logger.warn({ err }, 'Anthropic health check failed');
      return false;
    }
  }

  async generateText(prompt: string, options?: TextGenerationOptions): Promise<TextResult> {
    this.ensureCapability('text');
    if (!this.client) throw new AiProviderError('Anthropic client is not configured');

    const model = options?.model || 'claude-3-5-sonnet-20241022';
    try {
      const response = await this.client.messages.create({
        model,
        max_tokens: options?.maxTokens ?? 1500,
        temperature: options?.temperature ?? 0.7,
        system: options?.systemPrompt,
        messages: [{ role: 'user', content: prompt }],
      });

      const firstBlock = response.content[0];
      const text = firstBlock?.type === 'text' ? firstBlock.text : '';

      return {
        text,
        provider: this.id,
        model,
        usage: {
          promptTokens: response.usage.input_tokens,
          completionTokens: response.usage.output_tokens,
          totalTokens: response.usage.input_tokens + response.usage.output_tokens,
        },
      };
    } catch (err) {
      throw new AiProviderError('Anthropic text generation failed', err);
    }
  }

  async generateQuranStory(context: QuranStoryContext): Promise<QuranStoryResult> {
    this.ensureCapability('story');
    const isAr = context.locale === 'ar';

    const systemPrompt = isAr
      ? `أنت باحث إسلامي وكاتب متخصص في صياغة قصص وتأملات قرآنية عميقة مبنية على تفاسير معتمدة بدقة ووقار.`
      : `You are an expert Islamic writer crafting inspiring and authentic Quranic reflections and stories.`;

    const prompt = `
Analyze and craft a reflective story for:
Surah: ${context.surahNameAr} (${context.surahNameEn}) [${context.surahNumber}:${context.ayahStart}-${context.ayahEnd}]
Arabic Verse: "${context.arabicText}"
Translation: "${context.translationText}"

Return strictly valid JSON:
{
  "title": "Title",
  "theme": "Theme",
  "summary": "Summary",
  "storyBody": "Reflective narrative",
  "reflectionPoints": ["Point 1", "Point 2"],
  "suggestedVisualPrompts": ["Nature visual prompt"]
}
`;

    const result = await this.generateText(prompt, {
      systemPrompt,
      temperature: 0.5,
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
        theme: 'Divine Wisdom',
        summary: result.text.slice(0, 200),
        storyBody: result.text,
        reflectionPoints: ['Pondering the verses'],
        suggestedVisualPrompts: ['Breathtaking ocean sunset under tranquil skies'],
        provider: this.id,
        model: result.model,
      };
    }
  }

  async generateStructuredQuranStory(params: QuranStoryGenerateParams): Promise<QuranStoryVisualScript> {
    this.ensureCapability('story');
    const { systemPrompt, userPrompt } = buildQuranStoryGeneratorPrompt(params);

    const model = params.model || 'claude-3-5-sonnet-20241022';
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
      throw new AiProviderError('Claude structured story generation failed', err);
    }
  }
}

