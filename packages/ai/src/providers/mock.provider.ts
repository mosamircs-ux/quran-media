import { BaseAIProvider } from './base.js';
import type {
  AICapability,
  TextGenerationOptions,
  TextResult,
  QuranStoryContext,
  QuranStoryResult,
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

  async generateImage(prompt: string, options: ImageGenerationOptions): Promise<ImageResult> {
    // Generate a beautiful placeholder gradient data URI or SVG
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
      <defs>
        <radialGradient id="g" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#020617"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <circle cx="540" cy="800" r="300" fill="#eab308" opacity="0.15" filter="blur(40px)"/>
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
