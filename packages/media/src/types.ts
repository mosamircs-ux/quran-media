export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5';

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

export interface SubtitleCue {
  index: number;
  startMs: number;
  endMs: number;
  arabicText: string;
  translationText?: string;
  words?: SubtitleWordCue[];
}

export interface SubtitleStyle {
  fontName?: string;
  fontSize?: number;
  primaryColorHex?: string; // e.g. '&H00FFFFFF'
  highlightColorHex?: string; // e.g. '&H0000D7FF' (Gold)
  outlineColorHex?: string; // e.g. '&H00000000'
  outlineWidth?: number;
  shadowWidth?: number;
  alignment?: number; // ASS alignment: 2 = bottom center, 5 = top center, 8 = middle center
  marginV?: number;
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
