import { z } from 'zod';

// ==============================================================================
// Aspect Ratio & Resolutions
// ==============================================================================

export const AspectRatioSchema = z.enum(['9:16', '16:9', '1:1', '4:5']);
export type AspectRatio = z.infer<typeof AspectRatioSchema>;

export const ResolutionSchema = z.enum(['720p', '1080p', '4k']).default('1080p');
export type Resolution = z.infer<typeof ResolutionSchema>;

export interface DimensionPair {
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

export const ASPECT_RATIO_DIMENSIONS: Record<AspectRatio, Record<Resolution, DimensionPair>> = {
  '9:16': {
    '720p': {
      width: 720,
      height: 1280,
      label: '720x1280 (Story/TikTok 720p)',
      defaultFontSize: 32,
      safeZone: { top: 120, bottom: 200, left: 60, right: 60 },
    },
    '1080p': {
      width: 1080,
      height: 1920,
      label: '1080x1920 (Reels/TikTok/Shorts HD)',
      defaultFontSize: 44,
      safeZone: { top: 180, bottom: 280, left: 90, right: 90 },
    },
    '4k': {
      width: 2160,
      height: 3840,
      label: '2160x3840 (Vertical 4K)',
      defaultFontSize: 88,
      safeZone: { top: 360, bottom: 560, left: 180, right: 180 },
    },
  },
  '16:9': {
    '720p': {
      width: 1280,
      height: 720,
      label: '1280x720 (Landscape 720p)',
      defaultFontSize: 28,
      safeZone: { top: 60, bottom: 80, left: 100, right: 100 },
    },
    '1080p': {
      width: 1920,
      height: 1080,
      label: '1920x1080 (YouTube/Cinema HD)',
      defaultFontSize: 42,
      safeZone: { top: 90, bottom: 120, left: 150, right: 150 },
    },
    '4k': {
      width: 3840,
      height: 2160,
      label: '3840x2160 (Cinema 4K Ultra HD)',
      defaultFontSize: 84,
      safeZone: { top: 180, bottom: 240, left: 300, right: 300 },
    },
  },
  '1:1': {
    '720p': {
      width: 720,
      height: 720,
      label: '720x720 (Square Feed 720p)',
      defaultFontSize: 30,
      safeZone: { top: 70, bottom: 90, left: 70, right: 70 },
    },
    '1080p': {
      width: 1080,
      height: 1080,
      label: '1080x1080 (Instagram Feed HD)',
      defaultFontSize: 42,
      safeZone: { top: 100, bottom: 130, left: 100, right: 100 },
    },
    '4k': {
      width: 2160,
      height: 2160,
      label: '2160x2160 (Square 4K)',
      defaultFontSize: 84,
      safeZone: { top: 200, bottom: 260, left: 200, right: 200 },
    },
  },
  '4:5': {
    '720p': {
      width: 720,
      height: 900,
      label: '720x900 (Portrait 720p)',
      defaultFontSize: 32,
      safeZone: { top: 80, bottom: 110, left: 70, right: 70 },
    },
    '1080p': {
      width: 1080,
      height: 1350,
      label: '1080x1350 (Instagram Portrait HD)',
      defaultFontSize: 44,
      safeZone: { top: 120, bottom: 160, left: 100, right: 100 },
    },
    '4k': {
      width: 2160,
      height: 2700,
      label: '2160x2700 (Portrait 4K)',
      defaultFontSize: 88,
      safeZone: { top: 240, bottom: 320, left: 200, right: 200 },
    },
  },
};

export function getResolutionDimensions(
  aspectRatio: AspectRatio = '9:16',
  resolution: Resolution = '1080p'
): DimensionPair {
  const arConfig = ASPECT_RATIO_DIMENSIONS[aspectRatio] || ASPECT_RATIO_DIMENSIONS['9:16'];
  return arConfig[resolution] || arConfig['1080p'];
}

// ==============================================================================
// Scene Definitions
// ==============================================================================

export const BackgroundTypeSchema = z.enum([
  'color',
  'gradient',
  'animated_gradient',
  'particles',
  'image',
  'video',
]);
export type BackgroundType = z.infer<typeof BackgroundTypeSchema>;

export const SceneBackgroundSchema = z.object({
  type: BackgroundTypeSchema.default('animated_gradient'),
  src: z.string().optional(), // image URL / local filepath / base64
  color: z.string().optional().default('#020617'),
  gradientColors: z.array(z.string()).optional().default(['#064e3b', '#0f172a', '#020617']),
  gradientAngle: z.number().optional().default(135),
  blurRadius: z.number().optional().default(0),
  opacity: z.number().min(0).max(1).optional().default(1),
  overlayColor: z.string().optional(),
  overlayOpacity: z.number().min(0).max(1).optional().default(0.4),
});
export type SceneBackground = z.infer<typeof SceneBackgroundSchema>;

export const CameraEffectSchema = z.enum([
  'none',
  'ken_burns',
  'zoom_in',
  'zoom_out',
  'pan_left',
  'pan_right',
  'pan_up',
  'pan_down',
]);
export type CameraEffect = z.infer<typeof CameraEffectSchema>;

export const SceneCameraSchema = z.object({
  effect: CameraEffectSchema.default('ken_burns'),
  intensity: z.number().min(0.01).max(2).optional().default(0.15),
  startScale: z.number().min(1).max(3).optional().default(1.0),
  endScale: z.number().min(1).max(3).optional().default(1.15),
});
export type SceneCamera = z.infer<typeof SceneCameraSchema>;

export const TransitionTypeSchema = z.enum([
  'none',
  'fade',
  'crossfade',
  'wipeleft',
  'wiperight',
  'dissolve',
  'circleopen',
]);
export type TransitionType = z.infer<typeof TransitionTypeSchema>;

export const SceneTransitionSchema = z.object({
  type: TransitionTypeSchema.default('crossfade'),
  duration: z.number().min(0).max(5).default(1.0), // in seconds
});
export type SceneTransition = z.infer<typeof SceneTransitionSchema>;

export const SceneVerseSchema = z.object({
  verseKey: z.string().optional(), // e.g. "2:255"
  surahNumber: z.number().int().min(1).max(114).optional(),
  ayahNumber: z.number().int().min(1).optional(),
  textUthmani: z.string().optional(),
  textSimple: z.string().optional(),
  translationText: z.string().optional(),
  transliteration: z.string().optional(),
});
export type SceneVerse = z.infer<typeof SceneVerseSchema>;

export const SceneOverlaySchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  badge: z.string().optional(),
  calligraphySurah: z.string().optional(),
  showBorderFrame: z.boolean().optional().default(true),
  themeColor: z.string().optional().default('#f59e0b'),
});
export type SceneOverlay = z.infer<typeof SceneOverlaySchema>;

export const MediaSceneSchema = z.object({
  id: z.string().default(() => `scene-${Math.random().toString(36).substring(2, 9)}`),
  duration: z.number().min(1).max(300).default(5), // in seconds
  background: SceneBackgroundSchema.default({}),
  camera: SceneCameraSchema.default({}),
  transition: SceneTransitionSchema.default({}),
  verse: SceneVerseSchema.optional(),
  narration: z
    .object({
      text: z.string().optional(),
      audioSrc: z.string().optional(),
      volume: z.number().min(0).max(2).optional().default(1),
    })
    .optional(),
  overlay: SceneOverlaySchema.optional(),
});
export type MediaScene = z.infer<typeof MediaSceneSchema>;

// ==============================================================================
// Audio Configurations
// ==============================================================================

export const WaveformStyleSchema = z.enum(['line', 'bars', 'wave', 'circular']).default('bars');
export type WaveformStyle = z.infer<typeof WaveformStyleSchema>;

export const AudioWaveformConfigSchema = z.object({
  enabled: z.boolean().default(true),
  style: WaveformStyleSchema,
  color: z.string().default('#f59e0b'), // Gold
  backgroundColor: z.string().default('#00000000'), // Transparent
  height: z.number().min(20).max(400).default(90),
  position: z.enum(['bottom', 'middle', 'top']).default('bottom'),
  opacity: z.number().min(0).max(1).default(0.85),
  scale: z.enum(['lin', 'log', 'sqrt']).default('sqrt'),
});
export type AudioWaveformConfig = z.infer<typeof AudioWaveformConfigSchema>;

export const AmbientPresetSchema = z.enum([
  'none',
  'deep_serenity',
  'night_desert',
  'celestial_reverb',
  'rain_gentle',
  'custom',
]);
export type AmbientPreset = z.infer<typeof AmbientPresetSchema>;

export const AudioConfigSchema = z.object({
  recitation: z
    .object({
      src: z.string().optional(), // audio URL or local filepath
      reciterId: z.number().int().optional().default(7),
      volume: z.number().min(0).max(2).default(1.0),
      normalize: z.boolean().default(true), // EBU R128 loudnorm
      fadeInSeconds: z.number().min(0).max(5).default(0.5),
      fadeOutSeconds: z.number().min(0).max(5).default(1.0),
    })
    .optional(),
  ambient: z
    .object({
      src: z.string().optional(),
      preset: AmbientPresetSchema.default('none'),
      volume: z.number().min(0).max(1).default(0.18),
      loop: z.boolean().default(true),
      fadeInSeconds: z.number().min(0).max(5).default(1.5),
      fadeOutSeconds: z.number().min(0).max(5).default(2.0),
    })
    .optional(),
  audioWaveform: AudioWaveformConfigSchema.default({}),
  sidechainDucking: z
    .object({
      enabled: z.boolean().default(true),
      duckAmountDb: z.number().min(6).max(36).default(18), // how much to lower ambient when recitation speaks
    })
    .default({}),
});
export type AudioConfig = z.infer<typeof AudioConfigSchema>;

// ==============================================================================
// Subtitle & Typography Configurations
// ==============================================================================

export const WordTimingSchema = z.object({
  text: z.string(),
  startMs: z.number(),
  endMs: z.number(),
});
export type WordTiming = z.infer<typeof WordTimingSchema>;

export const SubtitleCueSchema = z.object({
  index: z.number(),
  startMs: z.number(),
  endMs: z.number(),
  arabicText: z.string(),
  translationText: z.string().optional(),
  transliteration: z.string().optional(),
  verseKey: z.string().optional(),
  words: z.array(WordTimingSchema).optional(),
});
export type SubtitleCue = z.infer<typeof SubtitleCueSchema>;

export const SubtitleStyleSchema = z.object({
  fontArabic: z.string().default('Amiri Quran, Traditional Arabic, Arial'),
  fontTranslation: z.string().default('Inter, Roboto, Arial'),
  fontSizeArabic: z.number().min(12).max(120).optional(),
  fontSizeTranslation: z.number().min(10).max(80).optional(),
  primaryColorHex: z.string().default('&H00FFFFFF'), // BGR format in ASS or hex
  highlightColorHex: z.string().default('&H0000D7FF'), // Gold in BGR (&H00BBGGRR)
  outlineColorHex: z.string().default('&H00000000'), // Black
  outlineWidth: z.number().min(0).max(10).default(3),
  shadowWidth: z.number().min(0).max(10).default(2),
  alignment: z.number().int().min(1).max(9).default(2), // 2 = Bottom Center, 5 = Middle Center
  marginV: z.number().int().min(0).max(500).default(120),
  dualLanguage: z.boolean().default(true),
  wordHighlight: z.boolean().default(true),
  rtl: z.boolean().default(true),
});
export type SubtitleStyle = z.infer<typeof SubtitleStyleSchema>;

export const SubtitlesConfigSchema = z.object({
  enabled: z.boolean().default(true),
  cues: z.array(SubtitleCueSchema).default([]),
  style: SubtitleStyleSchema.default({}),
});
export type SubtitlesConfig = z.infer<typeof SubtitlesConfigSchema>;

// ==============================================================================
// Intro & Outro Cards
// ==============================================================================

export const IntroConfigSchema = z.object({
  enabled: z.boolean().default(false),
  duration: z.number().min(1).max(10).default(3),
  titleAr: z.string().optional(),
  titleEn: z.string().optional(),
  badge: z.string().optional(),
  animation: z.enum(['fade', 'zoom_reveal', 'slide_up']).default('fade'),
});
export type IntroConfig = z.infer<typeof IntroConfigSchema>;

export const OutroConfigSchema = z.object({
  enabled: z.boolean().default(false),
  duration: z.number().min(1).max(15).default(4),
  reflectionAr: z.string().optional(),
  reflectionEn: z.string().optional(),
  callToAction: z.string().optional().default('اشترك للمزيد من روائع التلاوات والقصص القرآنية'),
  socialHandle: z.string().optional().default('@QuranMedia'),
  animation: z.enum(['fade', 'slow_drift']).default('fade'),
});
export type OutroConfig = z.infer<typeof OutroConfigSchema>;

// ==============================================================================
// Master MediaProject Schema
// ==============================================================================

export const OutputFormatSchema = z.enum(['mp4', 'webm', 'thumbnail', 'preview']);
export type OutputFormat = z.infer<typeof OutputFormatSchema>;

export const MediaProjectSchema = z.object({
  id: z.string().default(() => `proj-${Date.now()}`),
  title: z.string().optional().default('Quran Visual Production'),
  aspectRatio: AspectRatioSchema.default('9:16'),
  resolution: ResolutionSchema.default('1080p'),
  fps: z.number().int().min(15).max(60).default(30),
  scenes: z.array(MediaSceneSchema).min(1),
  audio: AudioConfigSchema.default({}),
  subtitles: SubtitlesConfigSchema.default({}),
  intro: IntroConfigSchema.optional(),
  outro: OutroConfigSchema.optional(),
  outputFormats: z.array(OutputFormatSchema).default(['mp4', 'thumbnail', 'preview']),
});
export type MediaProject = z.infer<typeof MediaProjectSchema>;

// ==============================================================================
// Render Engine Outputs & Callbacks
// ==============================================================================

export interface RenderProgress {
  stage: 'QUEUED' | 'PROCESSING' | 'GENERATING_ASSETS' | 'RENDERING' | 'UPLOADING' | 'COMPLETED' | 'FAILED';
  percent: number; // 0 to 100
  currentStepDescription: string;
  frame?: number;
  fps?: number;
  currentTimeSeconds?: number;
  totalTimeSeconds?: number;
}

export interface RenderOutput {
  projectId: string;
  aspectRatio: AspectRatio;
  resolution: Resolution;
  width: number;
  height: number;
  fps: number;
  durationSeconds: number;
  mp4Path?: string;
  webmPath?: string;
  thumbnailPath?: string;
  previewPath?: string;
  subtitlesPathAss?: string;
  subtitlesPathVtt?: string;
  fileSizeMp4Bytes?: number;
  fileSizeWebmBytes?: number;
  renderedAt: string;
}

export interface CompositionOptions {
  tempDir?: string;
  keepTempFiles?: boolean;
  onProgress?: (progress: RenderProgress) => Promise<void> | void;
}
