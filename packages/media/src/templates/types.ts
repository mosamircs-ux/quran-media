import { z } from 'zod';
import { AspectRatioSchema } from '../types/project.types.js';

export const TemplateCategorySchema = z.enum([
  'minimal',
  'nature',
  'islamic_art',
  'celestial',
  'social_media',
  'broadcast',
]);

export type TemplateCategory = z.infer<typeof TemplateCategorySchema>;

export const TemplateFontsSchema = z.object({
  arabicFont: z.string().default('Amiri Quran'),
  translationFont: z.string().default('Inter'),
  fontSizeScale: z.number().min(0.5).max(2.0).default(1.0),
  arabicFontWeight: z.string().default('bold'),
  letterSpacing: z.number().default(0),
});

export type TemplateFonts = z.infer<typeof TemplateFontsSchema>;

export const TemplateColorsSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
  textArabic: z.string().default('#fef3c7'),
  textTranslation: z.string().default('#ffffff'),
  highlightKaraoke: z.string().default('#fbbf24'),
  backgroundGradient: z.array(z.string()).min(2).default(['#064e3b', '#020617']),
  overlayColor: z.string().default('rgba(2, 6, 23, 0.45)'),
  borderGlowColor: z.string().default('rgba(245, 158, 11, 0.3)'),
});

export type TemplateColors = z.infer<typeof TemplateColorsSchema>;

export const TemplateAnimationSchema = z.object({
  cameraMotion: z.enum([
    'ken_burns',
    'zoom_in',
    'zoom_out',
    'pan_left',
    'pan_right',
    'pan_up',
    'pan_down',
    'none',
  ]).default('ken_burns'),
  cameraIntensity: z.number().min(0.02).max(0.3).default(0.12),
  particles: z.boolean().default(true),
  particleType: z.enum(['stars', 'dust', 'geometric', 'rain', 'light_orbs', 'none']).default('stars'),
  waveformVisualizer: z.boolean().default(true),
  waveformStyle: z.enum(['bars', 'line', 'wave']).default('bars'),
  calligraphyGlowPulse: z.boolean().default(true),
});

export type TemplateAnimation = z.infer<typeof TemplateAnimationSchema>;

export const TemplateTransitionsSchema = z.object({
  sceneTransition: z.enum(['crossfade', 'dissolve', 'fade', 'wipeleft', 'wiperight', 'none']).default('crossfade'),
  transitionDuration: z.number().min(0.2).max(3.0).default(1.0),
});

export type TemplateTransitions = z.infer<typeof TemplateTransitionsSchema>;

export const TemplateTextPositionsSchema = z.object({
  arabicVerticalPosition: z.enum(['top', 'middle', 'bottom']).default('middle'),
  translationVerticalPosition: z.enum(['top', 'middle', 'bottom']).default('bottom'),
  safeZoneMarginPx: z.number().min(20).max(200).default(80),
  alignment: z.enum(['center', 'right', 'left']).default('center'),
  dualLanguageStacked: z.boolean().default(true),
  wordHighlightActive: z.boolean().default(true),
});

export type TemplateTextPositions = z.infer<typeof TemplateTextPositionsSchema>;

export const TemplateAudioBehaviorSchema = z.object({
  reciterStyle: z.string().default('murattal'),
  ambientPreset: z.enum(['none', 'deep_serenity', 'night_desert', 'celestial_reverb', 'rain_gentle', 'custom']).default('deep_serenity'),
  recitationVolume: z.number().min(0).max(1.5).default(1.0),
  ambientVolume: z.number().min(0).max(0.5).default(0.16),
  sidechainDucking: z.boolean().default(true),
  duckAmountDb: z.number().default(18),
  audioNormalize: z.boolean().default(true),
});

export type TemplateAudioBehavior = z.infer<typeof TemplateAudioBehaviorSchema>;

export const TemplateSceneStructureSchema = z.object({
  defaultSceneDuration: z.number().min(2).max(30).default(4),
  includeIntro: z.boolean().default(true),
  introDuration: z.number().default(2),
  introAnimation: z.enum(['fade', 'zoom_reveal', 'slide_up']).default('fade'),
  includeOutro: z.boolean().default(true),
  outroDuration: z.number().default(3),
  outroAnimation: z.enum(['fade', 'slow_drift', 'slide_up']).default('fade'),
  stylePreset: z.string().default('cinematic_dark'),
});

export type TemplateSceneStructure = z.infer<typeof TemplateSceneStructureSchema>;

export const QuranMediaTemplateSchema = z.object({
  template_id: z.string(),
  nameAr: z.string(),
  nameEn: z.string(),
  descriptionAr: z.string(),
  descriptionEn: z.string(),
  category: TemplateCategorySchema,
  categoryNameAr: z.string(),
  categoryNameEn: z.string(),
  supported_aspect_ratios: z.array(AspectRatioSchema).min(1),
  recommendedAspectRatio: AspectRatioSchema.default('9:16'),
  fonts: TemplateFontsSchema,
  colors: TemplateColorsSchema,
  animation: TemplateAnimationSchema,
  transitions: TemplateTransitionsSchema,
  text_positions: TemplateTextPositionsSchema,
  audio_behavior: TemplateAudioBehaviorSchema,
  scene_structure: TemplateSceneStructureSchema,
  preview: z.object({
    previewImageUrl: z.string(),
    backdropCss: z.string(),
    tags: z.array(z.string()),
    badge: z.string().optional(),
    badgeColor: z.string().optional(),
  }),
});

export type QuranMediaTemplate = z.infer<typeof QuranMediaTemplateSchema>;
