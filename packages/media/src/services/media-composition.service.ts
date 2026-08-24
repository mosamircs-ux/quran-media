import fs from 'fs';
import path from 'path';
import type {
  MediaScene,
  RenderOutput,
  CompositionOptions,
  RenderProgress,
} from '../types/project.types.js';
import {
  MediaProjectSchema,
  MediaSceneSchema,
  getResolutionDimensions,
} from '../types/project.types.js';
import { imageRenderer } from './image-renderer.service.js';
import { audioRenderer } from './audio-renderer.service.js';
import { subtitleRenderer } from './subtitle-renderer.service.js';
import { videoRenderer } from './video-renderer.service.js';
import { thumbnailGenerator } from './thumbnail-generator.service.js';
import { env, logger, MediaProcessingError } from '@quran-media/config';

export class MediaCompositionService {
  /**
   * Master orchestrator: Renders a production-grade video from a MediaProject JSON.
   */
  async compose(
    rawProject: unknown,
    options: CompositionOptions = {}
  ): Promise<RenderOutput> {
    const project = MediaProjectSchema.parse(rawProject);
    const projectId = project.id || `proj-${Date.now()}`;
    const workDir = options.tempDir || path.resolve(env.MEDIA_TEMP_DIR, projectId);
    fs.mkdirSync(workDir, { recursive: true });

    const { width, height } = getResolutionDimensions(project.aspectRatio, project.resolution);
    const fps = project.fps || 30;

    const report = async (
      stage: RenderProgress['stage'],
      percent: number,
      currentStepDescription: string
    ) => {
      logger.info({ projectId, stage, percent, currentStepDescription }, 'Render progress');
      if (options.onProgress) {
        await options.onProgress({ stage, percent, currentStepDescription });
      }
    };

    try {
      await report('PROCESSING', 5, 'Initializing render workspace and validating project');

      // ------------------------------------------------------------------------
      // 1. Expand Scenes with Intro & Outro (if enabled)
      // ------------------------------------------------------------------------
      const allScenes: MediaScene[] = [];

      // Optional Intro Scene
      if (project.intro?.enabled) {
        allScenes.push(
          MediaSceneSchema.parse({
            id: 'scene-intro',
            duration: project.intro.duration || 3,
            background: { type: 'animated_gradient', color: '#020617' },
            camera: { effect: 'zoom_in', startScale: 1.0, endScale: 1.08 },
            transition: { type: 'crossfade', duration: 1.0 },
          })
        );
      }

      // Main Production Scenes
      allScenes.push(...project.scenes);

      // Optional Outro Scene
      if (project.outro?.enabled) {
        allScenes.push(
          MediaSceneSchema.parse({
            id: 'scene-outro',
            duration: project.outro.duration || 4,
            background: { type: 'animated_gradient', color: '#020617' },
            camera: { effect: 'zoom_out', startScale: 1.08, endScale: 1.0 },
            transition: { type: 'crossfade', duration: 1.0 },
          })
        );
      }

      const totalDurationSeconds = allScenes.reduce((acc, s) => acc + s.duration, 0);

      // ------------------------------------------------------------------------
      // 2. Render Scene Images & Typography Plates (GENERATING_ASSETS: 10% - 30%)
      // ------------------------------------------------------------------------
      await report('GENERATING_ASSETS', 15, 'Rendering visual background frames and Quranic typography plates');

      const sceneBgPaths: string[] = [];

      for (let i = 0; i < allScenes.length; i++) {
        const scene = allScenes[i]!;
        const bgImagePath = path.join(workDir, `bg-scene-${i}.png`);

        if (scene.id === 'scene-intro' && project.intro) {
          const introBuffer = await imageRenderer.renderIntroCard(project.intro, width, height);
          fs.writeFileSync(bgImagePath, introBuffer);
        } else if (scene.id === 'scene-outro' && project.outro) {
          const outroBuffer = await imageRenderer.renderOutroCard(project.outro, width, height);
          fs.writeFileSync(bgImagePath, outroBuffer);
        } else if (scene.verse && (scene.verse.textUthmani || scene.verse.textSimple)) {
          // If scene has Quran verse text plate
          const plateBuffer = await imageRenderer.renderQuranTextPlate(
            scene.verse,
            scene.overlay,
            width,
            height,
            project.aspectRatio
          );
          fs.writeFileSync(bgImagePath, plateBuffer);
        } else {
          // General scene background
          const bgBuffer = await imageRenderer.renderBackground(scene.background, width, height);
          fs.writeFileSync(bgImagePath, bgBuffer);
        }

        sceneBgPaths.push(bgImagePath);
      }

      // ------------------------------------------------------------------------
      // 3. Compile Subtitles (.ass & .vtt)
      // ------------------------------------------------------------------------
      let subtitlePathAss: string | undefined;
      let subtitlePathVtt: string | undefined;

      if (project.subtitles?.enabled && project.subtitles.cues.length > 0) {
        await report('GENERATING_ASSETS', 28, 'Compiling Arabic RTL and dual-language subtitles');
        const assContent = subtitleRenderer.generateAssSubtitles(project.subtitles, width, height);
        subtitlePathAss = path.join(workDir, 'subtitles.ass');
        fs.writeFileSync(subtitlePathAss, assContent, 'utf8');

        const vttContent = subtitleRenderer.generateVttSubtitles(project.subtitles.cues);
        subtitlePathVtt = path.join(workDir, 'subtitles.vtt');
        fs.writeFileSync(subtitlePathVtt, vttContent, 'utf8');
      }

      // ------------------------------------------------------------------------
      // 4. Mix Master Audio & Waveform (30% - 45%)
      // ------------------------------------------------------------------------
      await report('PROCESSING', 35, 'Mixing recitation audio, ambient soundscapes, and sidechain ducking');

      let recitationAudioPath: string | undefined;
      if (project.audio?.recitation?.src) {
        recitationAudioPath = await this.resolveAudioSource(project.audio.recitation.src, workDir, 'recitation');
      }

      let ambientAudioPath: string | undefined;
      if (project.audio?.ambient?.src) {
        ambientAudioPath = await this.resolveAudioSource(project.audio.ambient.src, workDir, 'ambient');
      } else if (project.audio?.ambient?.preset && project.audio.ambient.preset !== 'none') {
        const presetPath = path.join(workDir, 'ambient-preset.mp3');
        ambientAudioPath = await audioRenderer.generatePresetAmbient(
          project.audio.ambient.preset,
          presetPath,
          totalDurationSeconds
        );
      }

      const masterAudioPath = path.join(workDir, 'master-audio.mp3');
      await audioRenderer.mixMasterAudio(
        recitationAudioPath,
        ambientAudioPath,
        masterAudioPath,
        totalDurationSeconds,
        project.audio
      );

      // Render Waveform Overlay (if enabled)
      let waveformOverlayPath: string | undefined;
      if (project.audio?.audioWaveform?.enabled && recitationAudioPath) {
        await report('PROCESSING', 42, 'Rendering dynamic audio waveform visualizer');
        const wavePath = path.join(workDir, 'waveform-overlay.mov');
        waveformOverlayPath = await audioRenderer.generateWaveformOverlay(
          masterAudioPath,
          wavePath,
          width,
          height,
          project.audio.audioWaveform,
          totalDurationSeconds
        );
      }

      // ------------------------------------------------------------------------
      // 5. Render Scene Video Segments (RENDERING: 45% - 70%)
      // ------------------------------------------------------------------------
      await report('RENDERING', 48, 'Rendering Ken Burns camera animations across scenes');

      const renderedSceneClips: string[] = [];
      const sceneDurations = allScenes.map((s) => s.duration);
      const sceneTransitions = allScenes.map((s) => s.transition);

      for (let i = 0; i < allScenes.length; i++) {
        const scene = allScenes[i]!;
        const bgPath = sceneBgPaths[i]!;
        const clipPath = path.join(workDir, `scene-clip-${i}.mp4`);

        await videoRenderer.renderSceneSegment(scene, bgPath, width, height, fps, clipPath);
        renderedSceneClips.push(clipPath);

        const progressScaled = Math.round(48 + ((i + 1) / allScenes.length) * 18);
        await report('RENDERING', progressScaled, `Rendered scene ${i + 1} of ${allScenes.length}`);
      }

      // Concatenate scene clips with xfade transitions
      await report('RENDERING', 68, 'Chaining scene transitions and dissolves');
      const rawConcatVideoPath = path.join(workDir, 'concatenated-scenes.mp4');
      await videoRenderer.concatScenesWithTransitions(
        renderedSceneClips,
        sceneDurations,
        sceneTransitions,
        width,
        height,
        fps,
        rawConcatVideoPath
      );

      // ------------------------------------------------------------------------
      // 6. Composite Master MP4 (Muxing, Subtitle burning, Waveform) (70% - 90%)
      // ------------------------------------------------------------------------
      await report('RENDERING', 75, 'Burning subtitles and muxing master audio streams');

      const masterMp4Path = path.join(workDir, 'master-output.mp4');
      await videoRenderer.compositeMasterVideo(
        rawConcatVideoPath,
        masterAudioPath,
        subtitlePathAss,
        waveformOverlayPath,
        masterMp4Path,
        {
          durationSeconds: totalDurationSeconds,
          fps,
          onProgress: (p) => {
            const scaled = Math.round(75 + (p.percent * 15) / 100);
            report('RENDERING', scaled, `Encoding master MP4 (${p.percent}%)`);
          },
        }
      );

      // ------------------------------------------------------------------------
      // 7. Multi-Format Export (WebM, Thumbnail, Preview) (90% - 98%)
      // ------------------------------------------------------------------------
      await report('RENDERING', 92, 'Generating multi-format deliverables (WebM, Thumbnail, Preview)');

      const formats = project.outputFormats || ['mp4', 'thumbnail', 'preview'];
      const exported = await videoRenderer.exportFormats(masterMp4Path, workDir, formats, totalDurationSeconds);

      let thumbnailPath: string | undefined;
      if (formats.includes('thumbnail')) {
        const thumbPath = path.join(workDir, 'thumbnail.jpg');
        thumbnailPath = await thumbnailGenerator.generateThumbnailFromVideo(masterMp4Path, project, thumbPath);
      }

      const mp4Stats = fs.existsSync(masterMp4Path) ? fs.statSync(masterMp4Path) : null;
      const webmStats = exported.webm && fs.existsSync(exported.webm) ? fs.statSync(exported.webm) : null;

      await report('COMPLETED', 100, 'Video production finished successfully');

      const result: RenderOutput = {
        projectId,
        aspectRatio: project.aspectRatio,
        resolution: project.resolution,
        width,
        height,
        fps,
        durationSeconds: totalDurationSeconds,
        mp4Path: exported.mp4,
        webmPath: exported.webm,
        thumbnailPath,
        previewPath: exported.preview,
        subtitlesPathAss: subtitlePathAss,
        subtitlesPathVtt: subtitlePathVtt,
        fileSizeMp4Bytes: mp4Stats ? mp4Stats.size : undefined,
        fileSizeWebmBytes: webmStats ? webmStats.size : undefined,
        renderedAt: new Date().toISOString(),
      };

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await report('FAILED', 0, `Rendering failed: ${message}`);
      throw new MediaProcessingError(`Video composition failed: ${message}`, err);
    } finally {
      // Clean up temporary intermediate files unless keepTempFiles is requested
      if (!options.keepTempFiles) {
        this.cleanupIntermediates(workDir);
      }
    }
  }

  private async resolveAudioSource(src: string, workDir: string, prefix: string): Promise<string> {
    if (fs.existsSync(src)) {
      return src;
    }

    if (src.startsWith('http://') || src.startsWith('https://')) {
      const resp = await fetch(src);
      if (!resp.ok) {
        throw new Error(`Failed to download audio from ${src} (HTTP ${resp.status})`);
      }
      const buffer = Buffer.from(await resp.arrayBuffer());
      const localAudioPath = path.join(workDir, `${prefix}-${Date.now()}.mp3`);
      fs.writeFileSync(localAudioPath, buffer);
      return localAudioPath;
    }

    throw new Error(`Invalid audio source: ${src}`);
  }

  private cleanupIntermediates(workDir: string): void {
    try {
      const files = fs.readdirSync(workDir);
      for (const file of files) {
        if (file.startsWith('bg-scene-') || file.startsWith('scene-clip-') || file.startsWith('concatenated-scenes')) {
          try {
            fs.unlinkSync(path.join(workDir, file));
          } catch {}
        }
      }
    } catch {}
  }
}

export const mediaCompositionService = new MediaCompositionService();
