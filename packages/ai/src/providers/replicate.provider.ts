import Replicate from 'replicate';
import { BaseAIProvider } from './base.js';
import type {
  AICapability,
  ImageGenerationOptions,
  ImageResult,
} from '../types.js';
import { env, logger, AiProviderError } from '@quran-media/config';

export class ReplicateProvider extends BaseAIProvider {
  readonly id = 'replicate';
  readonly name = 'Replicate (Flux / SDXL)';
  readonly capabilities: AICapability[] = ['image'];
  private client: Replicate | null = null;

  constructor() {
    super();
    if (env.REPLICATE_API_TOKEN) {
      this.client = new Replicate({ auth: env.REPLICATE_API_TOKEN });
    }
  }

  isAvailable(): boolean {
    return Boolean(env.REPLICATE_API_TOKEN && this.client);
  }

  async healthCheck(): Promise<boolean> {
    if (!this.isAvailable() || !this.client) return false;
    try {
      await this.client.models.get('black-forest-labs', 'flux-schnell');
      return true;
    } catch (err) {
      logger.warn({ err }, 'Replicate health check failed');
      return false;
    }
  }

  async generateImage(prompt: string, options: ImageGenerationOptions): Promise<ImageResult> {
    this.ensureCapability('image');
    if (!this.client) throw new AiProviderError('Replicate client is not configured');

    const model = options.model || 'black-forest-labs/flux-schnell';
    const enhancedPrompt = `${prompt}, majestic landscape, serene transcendent atmosphere, islamic geometric aesthetic, volumetric lighting, 8k, photorealistic. NO FACES OR HUMANS.`;

    try {
      const output = (await this.client.run(model as `${string}/${string}`, {
        input: {
          prompt: enhancedPrompt,
          aspect_ratio: options.aspectRatio,
          output_format: 'webp',
          output_quality: 90,
        },
      })) as string[] | string;

      const url = Array.isArray(output) ? output[0] : output;
      if (!url) throw new Error('No output image URL from Replicate');

      return {
        url,
        provider: this.id,
        model,
      };
    } catch (err) {
      throw new AiProviderError('Replicate image generation failed', err);
    }
  }
}
