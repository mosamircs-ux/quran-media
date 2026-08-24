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

export type QuranStoryMode =
  | 'reflection'
  | 'educational'
  | 'cinematic'
  | 'short_reminder'
  | 'children_friendly'
  | 'social_media';

export type VisualRepresentationPolicy =
  | 'symbolic'
  | 'environmental'
  | 'celestial'
  | 'architectural'
  | 'calligraphic';

export interface StoryScene {
  sceneNumber: number;
  duration: string;
  narration: string;
  visualDescription: string;
  cameraMovement: string;
  transition: string;
}

export interface QuranStorySourceReferences {
  surahNumber: number;
  surahNameAr: string;
  surahNameEn: string;
  ayahStart: number;
  ayahEnd: number;
  uthmaniText: string;
  translationAuthor: string;
  translationText: string;
  tafsirAuthor: string;
  tafsirOverview: string;
  revelationPlace?: string;
  guardrailsApplied: string[];
  generatedAt?: string;
}

export interface QuranStoryVisualScript {
  title: string;
  hook: string;
  theme: string;
  emotionalTone: string;
  scenes: StoryScene[];
  ending: string;
  verseReference: string;
  sourceReferences?: QuranStorySourceReferences;
  mode?: QuranStoryMode;
  provider?: string;
  model?: string;
}

export interface QuranStoryGenerateParams {
  surahNumber: number;
  surahNameAr: string;
  surahNameEn: string;
  ayahStart: number;
  ayahEnd: number;
  arabicText: string;
  translationText: string;
  translationAuthor?: string;
  tafsirText?: string;
  tafsirAuthor?: string;
  quranicContext?: string;
  revelationPlace?: string;
  mode: QuranStoryMode;
  visualPolicy?: VisualRepresentationPolicy;
  locale?: 'ar' | 'en';
  model?: string;
  customPromptFocus?: string;
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
  generateStructuredQuranStory?(params: QuranStoryGenerateParams): Promise<QuranStoryVisualScript>;
  generateImage?(prompt: string, options: ImageGenerationOptions): Promise<ImageResult>;
  generateVideo?(prompt: string, options: VideoGenerationOptions): Promise<VideoResult>;
}

