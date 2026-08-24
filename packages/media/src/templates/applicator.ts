import type { MediaProject, MediaScene, AspectRatio } from '../types/project.types';
import { MediaProjectSchema } from '../types/project.types';
import { QURAN_MEDIA_TEMPLATES } from './catalog';
import type { QuranMediaTemplate } from './types';

export interface ApplyTemplateOptions {
  overrideAspectRatio?: AspectRatio;
  preserveCustomReciter?: boolean;
}

export function getTemplateById(templateId: string): QuranMediaTemplate {
  const found = QURAN_MEDIA_TEMPLATES.find((t) => t.template_id === templateId);
  return found || QURAN_MEDIA_TEMPLATES[0]!;
}

export function applyTemplateToProject(
  project: Partial<MediaProject>,
  templateId: string,
  options: ApplyTemplateOptions = {}
): MediaProject {
  const template = getTemplateById(templateId);

  const aspectRatio =
    options.overrideAspectRatio ||
    project.aspectRatio ||
    template.recommendedAspectRatio;

  // Transform existing or default scenes with template visual & camera properties
  const existingScenes = project.scenes || [];
  const transformedScenes: MediaScene[] = existingScenes.map((scene, index) => {
    return {
      id: scene.id || `scene-${index + 1}`,
      duration: scene.duration || template.scene_structure.defaultSceneDuration,
      background: {
        type: 'animated_gradient',
        color: template.colors.secondary,
        gradientColors: template.colors.backgroundGradient,
        gradientAngle: 135,
        blurRadius: 0,
        opacity: 1,
        overlayColor: template.colors.overlayColor,
        overlayOpacity: 0.45,
        ...scene.background,
      },
      camera: {
        effect: template.animation.cameraMotion,
        intensity: template.animation.cameraIntensity,
        startScale: 1.0,
        endScale: 1.0 + template.animation.cameraIntensity,
        ...scene.camera,
      },
      transition: {
        type: template.transitions.sceneTransition,
        duration: template.transitions.transitionDuration,
        ...scene.transition,
      },
      verse: scene.verse,
    };
  });

  // Apply template subtitles configuration
  const subtitlesConfig = {
    enabled: true,
    style: {
      fontArabic: template.fonts.arabicFont,
      fontTranslation: template.fonts.translationFont,
      fontSizeScale: template.fonts.fontSizeScale,
      colorArabic: template.colors.textArabic,
      colorTranslation: template.colors.textTranslation,
      highlightColorHex: template.colors.highlightKaraoke,
      verticalPosition: template.text_positions.arabicVerticalPosition,
      dualLanguage: template.text_positions.dualLanguageStacked,
      wordHighlight: template.text_positions.wordHighlightActive,
      safeZoneMarginPx: template.text_positions.safeZoneMarginPx,
      ...(project.subtitles?.style || {}),
    },
    cues: project.subtitles?.cues || [],
  };

  // Apply template audio configuration
  const audioConfig = {
    recitation: {
      reciterId: options.preserveCustomReciter ? (project.audio?.recitation?.reciterId ?? 7) : 7,
      volume: template.audio_behavior.recitationVolume,
      normalize: template.audio_behavior.audioNormalize,
      fadeInSeconds: 0.5,
      fadeOutSeconds: 1.0,
      ...(project.audio?.recitation || {}),
    },
    ambient: {
      preset: template.audio_behavior.ambientPreset,
      volume: template.audio_behavior.ambientVolume,
      loop: true,
      fadeInSeconds: 1.5,
      fadeOutSeconds: 2.0,
      ...(project.audio?.ambient || {}),
    },
    audioWaveform: {
      enabled: template.animation.waveformVisualizer,
      style: template.animation.waveformStyle,
      color: template.colors.accent,
      height: 80,
      opacity: 0.85,
      ...(project.audio?.audioWaveform || {}),
    },
    sidechainDucking: {
      enabled: template.audio_behavior.sidechainDucking,
      duckAmountDb: template.audio_behavior.duckAmountDb,
      ...(project.audio?.sidechainDucking || {}),
    },
  };

  // Apply template intro & outro
  const introConfig = {
    enabled: template.scene_structure.includeIntro,
    duration: template.scene_structure.introDuration,
    animation: template.scene_structure.introAnimation,
    titleAr: project.title || 'تلاوة مباركة',
    titleEn: project.title || 'Blessed Recitation',
    badge: template.nameAr,
    ...(project.intro || {}),
  };

  const outroConfig = {
    enabled: template.scene_structure.includeOutro,
    duration: template.scene_structure.outroDuration,
    animation: template.scene_structure.outroAnimation,
    reflectionAr: 'سبحان الله وبحمده • سبحان الله العظيم',
    reflectionEn: 'Glory be to Allah and all Praise',
    callToAction: 'تابعنا للمزيد من التلاوات والقصص القرآنية',
    socialHandle: '@QuranMedia',
    ...(project.outro || {}),
  };

  const payload: MediaProject = {
    id: project.id || `proj-${Date.now()}`,
    title: project.title || template.nameEn,
    aspectRatio,
    resolution: project.resolution || '1080p',
    fps: project.fps || 30,
    scenes: transformedScenes.length > 0 ? transformedScenes : [
      {
        id: 'scene-1',
        duration: template.scene_structure.defaultSceneDuration,
        background: {
          type: 'animated_gradient',
          color: template.colors.secondary,
          gradientColors: template.colors.backgroundGradient,
          gradientAngle: 135,
          blurRadius: 0,
          opacity: 1,
          overlayColor: template.colors.overlayColor,
          overlayOpacity: 0.45,
        },
        camera: {
          effect: template.animation.cameraMotion,
          intensity: template.animation.cameraIntensity,
          startScale: 1.0,
          endScale: 1.0 + template.animation.cameraIntensity,
        },
        transition: {
          type: template.transitions.sceneTransition,
          duration: template.transitions.transitionDuration,
        },
        verse: {
          surahNumber: 1,
          ayahNumber: 1,
          textUthmani: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
          translationText: 'In the Name of Allah, Most Compassionate, Most Merciful',
        },
      },
    ],
    audio: audioConfig,
    subtitles: subtitlesConfig,
    intro: introConfig,
    outro: outroConfig,
    outputFormats: project.outputFormats || ['mp4', 'webm', 'thumbnail', 'preview'],
  };

  return MediaProjectSchema.parse(payload);
}
