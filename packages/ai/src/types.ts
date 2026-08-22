export type AICapability = 'text' | 'story' | 'image' | 'video';

export interface TextGenerationOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface TextResult {
  text: string;
  provider: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface QuranStoryContext {
  surahNameAr: string;
  surahNameEn: string;
  surahNumber: number;
  ayahStart: number;
  ayahEnd: number;
  arabicText: string;
  translationText: string;
  targetAudience?: 'general' | 'youth' | 'scholarly';
  tone?: 'inspirational' | 'contemplative' | 'historical';
  length?: 'short' | 'medium' | 'detailed';
  locale?: 'ar' | 'en';
}

export interface QuranStoryResult {
  title: string;
  theme: string;
  summary: string;
  storyBody: string;
  reflectionPoints: string[];
  suggestedVisualPrompts: string[];
  provider: string;
  model: string;
}

export interface ImageGenerationOptions {
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:5';
  style?: string; // 'cinematic_nature' | 'islamic_geometry' | 'cosmic' | 'minimalist'
  model?: string;
  negativePrompt?: string;
  n?: number;
}

export interface ImageResult {
  url: string;
  provider: string;
  model: string;
  revisedPrompt?: string;
}

export interface VideoGenerationOptions {
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:5';
  durationSeconds?: number;
  style?: string;
  model?: string;
}

export interface VideoResult {
  url: string;
  provider: string;
  model: string;
  durationSeconds: number;
}

export interface AIProvider {
  readonly id: string;
  readonly name: string;
  readonly capabilities: AICapability[];
  isAvailable(): boolean;
  healthCheck(): Promise<boolean>;

  generateText?(prompt: string, options?: TextGenerationOptions): Promise<TextResult>;
  streamText?(prompt: string, options?: TextGenerationOptions): AsyncIterable<string>;
  generateQuranStory?(context: QuranStoryContext): Promise<QuranStoryResult>;
  generateImage?(prompt: string, options: ImageGenerationOptions): Promise<ImageResult>;
  generateVideo?(prompt: string, options: VideoGenerationOptions): Promise<VideoResult>;
}
