import type { AspectRatio, MediaProject } from '@quran-media/media';

export interface VideoGenerationJobData {
  generationId: string;
  projectId: string;
  userId: string;
  surahNumber?: number;
  ayahStart?: number;
  ayahEnd?: number;
  aspectRatio?: AspectRatio;
  reciterId?: number;
  stylePreset?: string;
  customPrompt?: string;
  aiProvider?: string;
  locale?: 'ar' | 'en';
  project?: MediaProject;
}

export interface ImageGenerationJobData {
  generationId: string;
  projectId: string;
  userId: string;
  surahNumber: number;
  ayahStart: number;
  ayahEnd: number;
  aspectRatio: AspectRatio;
  stylePreset?: string;
  customPrompt?: string;
  aiProvider?: string;
}

export interface StoryGenerationJobData {
  generationId: string;
  projectId: string;
  userId: string;
  surahNumber: number;
  ayahStart: number;
  ayahEnd: number;
  locale?: 'ar' | 'en';
  aiProvider?: string;
}
