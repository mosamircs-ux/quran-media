import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import type {
  MediaScene,
  SceneTransition,
  OutputFormat,
} from '../types/project.types.js';
import { logger, MediaProcessingError } from '@quran-media/config';

export interface VideoEncodingProgress {
  percent: number;
  frame?: number;
  fps?: number;
  currentTimeSeconds?: number;
  totalTimeSeconds?: number;
}

export class VideoRenderer {
  /**
   * Renders a single scene segment applying Ken Burns camera motion & scaling.
   */
  async renderSceneSegment(
    scene: MediaScene,
    backgroundPath: string,
    width: number,
    height: number,
    fps: number,
    outputPath: string
  ): Promise<string> {
    const duration = scene.duration;
    const totalFrames = Math.max(1, Math.round(duration * fps));
    const camera = scene.camera || { effect: 'ken_burns', intensity: 0.15, startScale: 1.0, endScale: 1.15 };

    return new Promise((resolve, reject) => {
      // Build Ken Burns zoompan filter expression
      let zoomFilter = '';
      const startS = camera.startScale || 1.0;
      const endS = camera.endScale || (startS + (camera.intensity || 0.15));
      const deltaS = (endS - startS) / totalFrames;

      switch (camera.effect) {
        case 'zoom_in':
        case 'ken_burns':
          zoomFilter = `zoompan=z='min(zoom+${deltaS.toFixed(5)},${endS.toFixed(2)})':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${totalFrames}:s=${width}x${height}:fps=${fps}`;
          break;
        case 'zoom_out':
          zoomFilter = `zoompan=z='if(lte(zoom,1.0),${endS.toFixed(2)},max(zoom-${deltaS.toFixed(5)},1.0))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${totalFrames}:s=${width}x${height}:fps=${fps}`;
          break;
        case 'pan_left':
          zoomFilter = `zoompan=z='1.12':x='if(lte(on,1),(iw-iw/zoom),max(x-${(width * 0.001).toFixed(2)},0))':y='ih/2-(ih/zoom/2)':d=${totalFrames}:s=${width}x${height}:fps=${fps}`;
          break;
        case 'pan_right':
          zoomFilter = `zoompan=z='1.12':x='if(lte(on,1),0,min(x+${(width * 0.001).toFixed(2)},(iw-iw/zoom)))':y='ih/2-(ih/zoom/2)':d=${totalFrames}:s=${width}x${height}:fps=${fps}`;
          break;
        case 'pan_up':
          zoomFilter = `zoompan=z='1.12':x='iw/2-(iw/zoom/2)':y='if(lte(on,1),(ih-ih/zoom),max(y-${(height * 0.001).toFixed(2)},0))':d=${totalFrames}:s=${width}x${height}:fps=${fps}`;
          break;
        case 'pan_down':
          zoomFilter = `zoompan=z='1.12':x='iw/2-(iw/zoom/2)':y='if(lte(on,1),0,min(y+${(height * 0.001).toFixed(2)},(ih-ih/zoom)))':d=${totalFrames}:s=${width}x${height}:fps=${fps}`;
          break;
        default:
          zoomFilter = `scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height}`;
          break;
      }

      ffmpeg()
        .input(backgroundPath)
        .loop(duration)
        .videoFilters([
          `scale=${width * 1.3}:${height * 1.3}:force_original_aspect_ratio=increase,crop=${width * 1.3}:${height * 1.3}`,
          zoomFilter,
          `format=yuv420p`,
          `setsar=1`,
        ])
        .outputOptions([
          '-c:v', 'libx264',
          '-preset', 'ultrafast',
          '-crf', '20',
          '-r', `${fps}`,
          '-t', `${duration}`,
        ])
        .output(outputPath)
        .on('end', () => {
          logger.debug({ outputPath, duration }, 'Scene segment rendered');
          resolve(outputPath);
        })
        .on('error', (err, _stdout, stderr) => {
          logger.error({ err: err.message, stderr }, 'Failed to render scene segment');
          reject(new MediaProcessingError(`Scene render failed: ${err.message}`, { stderr }));
        })
        .run();
    });
  }

  /**
   * Chains multiple scene segments with transitions (xfade / crossfade).
   */
  async concatScenesWithTransitions(
    sceneClips: string[],
    durations: number[],
    transitions: SceneTransition[],
    _width: number,
    _height: number,
    fps: number,
    outputPath: string
  ): Promise<string> {
    if (sceneClips.length === 0) {
      throw new Error('No scene clips to concatenate');
    }

    if (sceneClips.length === 1) {
      // Single clip, direct copy
      fs.copyFileSync(sceneClips[0]!, outputPath);
      return outputPath;
    }

    return new Promise((resolve, reject) => {
      let cmd = ffmpeg();
      sceneClips.forEach((clip) => {
        cmd = cmd.input(clip);
      });

      const filterParts: string[] = [];
      let currentOffset = 0;
      let lastVideoNode = '0:v';

      for (let i = 0; i < sceneClips.length - 1; i++) {
        const trans = transitions[i] || { type: 'crossfade', duration: 1.0 };
        const transType = trans.type === 'none' ? 'fade' : trans.type === 'dissolve' ? 'dissolve' : trans.type === 'wipeleft' ? 'wipeleft' : trans.type === 'wiperight' ? 'wiperight' : 'fade';
        const transDuration = Math.min(trans.duration || 1.0, (durations[i] || 3) * 0.4);

        currentOffset += (durations[i] || 3) - transDuration;
        const nextNode = `v_xfade_${i}`;

        filterParts.push(
          `[${lastVideoNode}][${i + 1}:v]xfade=transition=${transType}:duration=${transDuration.toFixed(2)}:offset=${currentOffset.toFixed(2)}[${nextNode}]`
        );
        lastVideoNode = nextNode;
      }

      cmd
        .complexFilter(filterParts)
        .outputOptions([
          '-map', `[${lastVideoNode}]`,
          '-c:v', 'libx264',
          '-preset', 'veryfast',
          '-crf', '19',
          '-pix_fmt', 'yuv420p',
          '-r', `${fps}`,
        ])
        .output(outputPath)
        .on('end', () => {
          logger.debug({ outputPath }, 'Concatenated scenes with xfade transitions');
          resolve(outputPath);
        })
        .on('error', (err, _stdout, stderr) => {
          logger.warn({ err: err.message, stderr }, 'xfade concatenation failed; falling back to concat demuxer');
          // Fallback to simple concat demuxer if xfade fails
          this.fallbackConcat(sceneClips, outputPath, fps)
            .then(resolve)
            .catch(reject);
        })
        .run();
    });
  }

  /**
   * Fallback concat demuxer if complex xfade graph hits a format mismatch.
   */
  private async fallbackConcat(sceneClips: string[], outputPath: string, fps: number): Promise<string> {
    const listPath = `${outputPath}.txt`;
    const content = sceneClips.map((c) => `file '${c.replace(/\\/g, '/')}'`).join('\n');
    fs.writeFileSync(listPath, content, 'utf8');

    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(listPath)
        .inputOptions(['-f', 'concat', '-safe', '0'])
        .outputOptions([
          '-c:v', 'libx264',
          '-preset', 'veryfast',
          '-crf', '20',
          '-pix_fmt', 'yuv420p',
          '-r', `${fps}`,
        ])
        .output(outputPath)
        .on('end', () => {
          try { fs.unlinkSync(listPath); } catch {}
          resolve(outputPath);
        })
        .on('error', (err) => {
          try { fs.unlinkSync(listPath); } catch {}
          reject(err);
        })
        .run();
    });
  }

  /**
   * Muxes Master Video with Master Audio, burns ASS subtitles, overlays audio waveform, and outputs MP4.
   */
  async compositeMasterVideo(
    videoPath: string,
    audioPath: string,
    subtitlePath: string | undefined,
    waveformOverlayPath: string | undefined,
    outputPath: string,
    options: {
      durationSeconds: number;
      fps: number;
      onProgress?: (progress: VideoEncodingProgress) => void;
    }
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let cmd = ffmpeg().input(videoPath).input(audioPath);

      const videoFilters: string[] = [];

      // 1. Burn Subtitles (ASS / SRT)
      if (subtitlePath && fs.existsSync(subtitlePath)) {
        // Format path for FFmpeg filter on Windows: forward slashes, escaped colon
        const sanitizedAssPath = subtitlePath
          .replace(/\\/g, '/')
          .replace(/^([A-Za-z]):/, '$1\\:');
        videoFilters.push(`ass='${sanitizedAssPath}'`);
      }

      // 2. Waveform Overlay (if present)
      if (waveformOverlayPath && fs.existsSync(waveformOverlayPath)) {
        cmd = cmd.input(waveformOverlayPath);
        // Overlay input index 2 over input index 0
        videoFilters.push('overlay=0:0');
      }

      if (videoFilters.length > 0) {
        cmd = cmd.videoFilters(videoFilters);
      }

      cmd
        .outputOptions([
          '-c:v', 'libx264',
          '-preset', 'medium',
          '-crf', '19',
          '-pix_fmt', 'yuv420p',
          '-movflags', '+faststart',
          '-c:a', 'aac',
          '-b:a', '192k',
          '-shortest',
        ])
        .output(outputPath)
        .on('progress', (p) => {
          if (options.onProgress) {
            const percent = p.percent || (p.timemark ? this.timemarkToPercent(p.timemark, options.durationSeconds) : 0);
            options.onProgress({
              percent: Math.min(100, Math.max(0, Math.round(percent))),
              frame: p.frames,
              fps: p.currentFps,
            });
          }
        })
        .on('end', () => {
          logger.info({ outputPath }, 'Master video composed successfully');
          resolve(outputPath);
        })
        .on('error', (err, _stdout, stderr) => {
          logger.error({ err: err.message, stderr }, 'Failed to composite master video');
          reject(new MediaProcessingError(`Master composition failed: ${err.message}`, { stderr }));
        })
        .run();
    });
  }

  /**
   * Multi-format export: Converts master MP4 to WebM (VP9) and creates lightweight Preview.
   */
  async exportFormats(
    masterMp4Path: string,
    outputDir: string,
    formats: OutputFormat[],
    durationSeconds: number
  ): Promise<{ mp4?: string; webm?: string; preview?: string }> {
    const results: { mp4?: string; webm?: string; preview?: string } = {};

    if (formats.includes('mp4')) {
      results.mp4 = masterMp4Path;
    }

    if (formats.includes('webm')) {
      const webmPath = path.join(outputDir, 'output.webm');
      await new Promise<void>((resolve) => {
        ffmpeg(masterMp4Path)
          .outputOptions([
            '-c:v', 'libvpx-vp9',
            '-b:v', '0',
            '-crf', '32',
            '-deadline', 'realtime',
            '-cpu-used', '4',
            '-c:a', 'libopus',
            '-b:a', '128k',
          ])
          .output(webmPath)
          .on('end', () => {
            results.webm = webmPath;
            resolve();
          })
          .on('error', (err) => {
            logger.warn({ err: err.message }, 'WebM export warning');
            resolve();
          })
          .run();
      });
    }

    if (formats.includes('preview')) {
      const previewPath = path.join(outputDir, 'preview.mp4');
      const previewDuration = Math.min(durationSeconds, 6);

      await new Promise<void>((resolve) => {
        ffmpeg(masterMp4Path)
          .duration(previewDuration)
          .videoFilters(['scale=540:-2'])
          .outputOptions([
            '-c:v', 'libx264',
            '-preset', 'ultrafast',
            '-crf', '26',
            '-r', '15',
            '-c:a', 'aac',
            '-b:a', '96k',
            '-movflags', '+faststart',
          ])
          .output(previewPath)
          .on('end', () => {
            results.preview = previewPath;
            resolve();
          })
          .on('error', () => {
            resolve();
          })
          .run();
      });
    }

    return results;
  }

  private timemarkToPercent(timemark: string, totalSeconds: number): number {
    if (!timemark || totalSeconds <= 0) return 0;
    const parts = timemark.split(':');
    if (parts.length < 3) return 0;
    const hours = parseFloat(parts[0] || '0');
    const minutes = parseFloat(parts[1] || '0');
    const seconds = parseFloat(parts[2] || '0');
    const current = hours * 3600 + minutes * 60 + seconds;
    return Math.min(100, (current / totalSeconds) * 100);
  }
}

export const videoRenderer = new VideoRenderer();
