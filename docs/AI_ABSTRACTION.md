# Quran Media Platform — AI Abstraction Layer

## 1. Provider-Agnostic Design

The platform never couples directly to a single AI vendor. All AI operations are mediated through the `AIProviderRegistry` and capability interfaces in `@quran-media/ai`.

```
                  +--------------------------+
                  |    AIProviderRegistry    |
                  +--------------------------+
                    |           |          |
      +-------------+           |          +-------------+
      v                         v                        v
+------------------+  +-------------------+  +--------------------+
|  OpenAI Provider |  |  Gemini Provider  |  | Anthropic Provider |
|  - GPT-4o        |  |  - Gemini 2.5 Flash|  | - Claude 3.5 Sonnet|
|  - DALL-E 3      |  |  - Imagen 3       |  +--------------------+
+------------------+  +-------------------+
      |                         |
      +-------------+           +-------------+
                    v                         v
              +-------------------------------------+
              |         Replicate / Stability       |
              |         - Flux / SDXL / SD3         |
              +-------------------------------------+
```

## 2. Capabilities Matrix

```typescript
export type AICapability = 'text' | 'story' | 'image' | 'video';

export interface TextGenerator {
  generateText(prompt: string, options?: TextGenerationOptions): Promise<TextResult>;
  streamText(prompt: string, options?: TextGenerationOptions): AsyncIterable<string>;
}

export interface StoryGenerator {
  generateQuranStory(context: QuranStoryContext): Promise<QuranStoryResult>;
}

export interface ImageGenerator {
  generateImage(prompt: string, options: ImageGenerationOptions): Promise<ImageResult>;
}

export interface VideoGenerator {
  generateVideo(prompt: string, options: VideoGenerationOptions): Promise<VideoResult>;
}
```

## 3. Fallback Chains & Reverence Guardrails
- **Automated Fallback**: If the primary image provider encounters a quota limit or failure, the registry automatically attempts generation with the secondary configured provider.
- **Quran Reverence Guardrails**: All prompt templates for AI image generation emphasize non-anthropomorphic, breathtaking natural sceneries (galaxies, mountain ranges, oceans, Islamic architectural geometry, calligraphy ambient lighting) and strictly prohibit depicting prophetic or divine figures.
