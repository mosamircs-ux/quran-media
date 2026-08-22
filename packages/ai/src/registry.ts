import type { AIProvider, AICapability } from './types.js';
import { OpenAIProvider } from './providers/openai.provider.js';
import { GeminiProvider } from './providers/gemini.provider.js';
import { AnthropicProvider } from './providers/anthropic.provider.js';
import { ReplicateProvider } from './providers/replicate.provider.js';
import { MockAIProvider } from './providers/mock.provider.js';
import { env, logger, AiProviderError } from '@quran-media/config';

export class AIProviderRegistry {
  private providers = new Map<string, AIProvider>();

  constructor() {
    this.register(new OpenAIProvider());
    this.register(new GeminiProvider());
    this.register(new AnthropicProvider());
    this.register(new ReplicateProvider());
    this.register(new MockAIProvider());
  }

  register(provider: AIProvider): void {
    this.providers.set(provider.id, provider);
  }

  getProvider(id: string): AIProvider {
    const provider = this.providers.get(id);
    if (!provider) {
      throw new AiProviderError(`AI Provider '${id}' not found in registry`);
    }
    return provider;
  }

  getAvailableProviders(capability?: AICapability): AIProvider[] {
    return Array.from(this.providers.values()).filter((p) => {
      if (!p.isAvailable()) return false;
      if (capability && !p.capabilities.includes(capability)) return false;
      return true;
    });
  }

  getPreferredProvider(capability: AICapability, overrideId?: string): AIProvider {
    if (overrideId) {
      const provider = this.getProvider(overrideId);
      if (provider.isAvailable() && provider.capabilities.includes(capability)) {
        return provider;
      }
      logger.warn(
        { overrideId, capability },
        'Requested AI provider override is unavailable; falling back to default chain'
      );
    }

    const defaultId =
      capability === 'image'
        ? env.DEFAULT_IMAGE_AI_PROVIDER
        : env.DEFAULT_TEXT_AI_PROVIDER;

    const defaultProvider = this.providers.get(defaultId);
    if (defaultProvider?.isAvailable() && defaultProvider.capabilities.includes(capability)) {
      return defaultProvider;
    }

    // Fallback list of providers for this capability
    const available = this.getAvailableProviders(capability);
    if (available.length > 0) {
      const fallback = available[0]!;
      logger.info(
        { capability, selected: fallback.id },
        'Using fallback AI provider for capability'
      );
      return fallback;
    }

    // Return mock provider as final resilient fallback
    return this.getProvider('mock');
  }
}

export const aiRegistry = new AIProviderRegistry();
