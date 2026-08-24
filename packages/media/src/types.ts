import type { AspectRatio } from './types/project.types.js';

export * from './types/project.types.js';

export interface AspectRatioConfig {
  width: number;
  height: number;
  label: string;
  defaultFontSize: number;
  safeZone: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface SubtitleWordCue {
  text: string;
  startMs: number;
  endMs: number;
}

export interface ImageCompositionOptions {
  width: number;
  height: number;
  backgroundImagePath?: string;
  backgroundBuffer?: Buffer;
  arabicText?: string;
  surahTitle?: string;
  aspectRatio: AspectRatio;
  gradientOverlay?: boolean;
}

export interface VideoSynthesisOptions {
  audioPath: string;
  backgroundPath: string;
  subtitlePath?: string;
  outputPath: string;
  aspectRatio: AspectRatio;
  durationSeconds?: number;
  enableSlowZoom?: boolean;
  onProgress?: (progress: number) => void;
}
