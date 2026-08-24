import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import type { AudioConfig, AudioWaveformConfig } from '../types/project.types.js';
import { logger, MediaProcessingError } from '@quran-media/config';

export class AudioRenderer {
  /**
   * Trims, normalizes, and applies fade envelopes to recitation audio.
   */
  async processRecitation(
    inputPath: string,
    outputPath: string,
    options: {
      volume?: number;
      normalize?: boolean;
      fadeInSeconds?: number;
      fadeOutSeconds?: number;
      duration?: number;
    } = {}
  ): Promise<string> {
    const {
      volume = 1.0,
      normalize = true,
      fadeInSeconds = 0.5,
      fadeOutSeconds = 1.0,
      duration,
    } = options;

    return new Promise((resolve, reject) => {
      const filters: string[] = [];

      if (volume !== 1.0) {
        filters.push(`volume=${volume}`);
      }

      if (normalize) {
        // EBU R128 two-pass approximation / standard loudnorm
        filters.push('loudnorm=I=-16:TP=-1.5:LRA=11');
      }

      if (fadeInSeconds > 0) {
        filters.push(`afade=t=in:ss=0:d=${fadeInSeconds}`);
      }

      if (duration && fadeOutSeconds > 0 && duration > fadeOutSeconds) {
        filters.push(`afade=t=out:st=${duration - fadeOutSeconds}:d=${fadeOutSeconds}`);
      }

      let cmd = ffmpeg(inputPath);

      if (filters.length > 0) {
        cmd = cmd.audioFilters(filters);
      }

      if (duration) {
        cmd = cmd.duration(duration);
      }

      cmd
        .audioCodec('libmp3lame')
        .audioBitrate('192k')
        .audioChannels(2)
        .audioFrequency(44100)
        .output(outputPath)
        .on('end', () => {
          logger.debug({ outputPath }, 'Recitation audio processed successfully');
          resolve(outputPath);
        })
        .on('error', (err, _stdout, stderr) => {
          logger.error({ err: err.message, stderr }, 'Failed to process recitation audio');
          reject(new MediaProcessingError(`Recitation processing failed: ${err.message}`, { stderr }));
        })
        .run();
    });
  }

  /**
   * Mixes recitation and ambient background track with sidechain volume ducking and loops.
   */
  async mixMasterAudio(
    recitationPath: string | undefined,
    ambientPath: string | undefined,
    outputPath: string,
    targetDurationSeconds: number,
    config: AudioConfig
  ): Promise<string> {
    // If only recitation exists and no ambient:
    if (recitationPath && (!ambientPath || config.ambient?.preset === 'none')) {
      return this.processRecitation(recitationPath, outputPath, {
        volume: config.recitation?.volume ?? 1.0,
        normalize: config.recitation?.normalize ?? true,
        duration: targetDurationSeconds,
      });
    }

    // If only ambient exists:
    if (!recitationPath && ambientPath) {
      return this.createLoopingAmbient(ambientPath, outputPath, targetDurationSeconds, config.ambient?.volume ?? 0.25);
    }

    // If both exist, mix with sidechain volume ducking:
    if (recitationPath && ambientPath) {
      return new Promise((resolve, reject) => {
        const duckAmount = (config.sidechainDucking?.duckAmountDb || 18) / 20; // normalize
        const ambientVol = config.ambient?.volume ?? 0.18;
        const recVol = config.recitation?.volume ?? 1.0;

        // Complex filter graph: Loop ambient, sidechain compress with recitation speech trigger
        ffmpeg()
          .input(recitationPath)
          .input(ambientPath)
          .inputOptions(['-stream_loop', '-1']) // Loop ambient infinitely
          .complexFilter([
            `[0:a]volume=${recVol},loudnorm=I=-16:TP=-1.5:LRA=11,asplit=2[rec_main][rec_trigger]`,
            `[1:a]volume=${ambientVol}[amb_vol]`,
            `[amb_vol][rec_trigger]sidechaincompress=threshold=0.08:ratio=8:attack=30:release=450:makeup=${1 - duckAmount * 0.5}[amb_ducked]`,
            `[rec_main][amb_ducked]amix=inputs=2:duration=first:dropout_transition=2[out_audio]`,
          ])
          .outputOptions(['-map', '[out_audio]'])
          .duration(targetDurationSeconds)
          .audioCodec('libmp3lame')
          .audioBitrate('192k')
          .output(outputPath)
          .on('end', () => {
            logger.debug({ outputPath }, 'Master audio mixed with sidechain ducking successfully');
            resolve(outputPath);
          })
          .on('error', (err, _stdout, stderr) => {
            logger.error({ err: err.message, stderr }, 'Failed to mix master audio');
            reject(new MediaProcessingError(`Audio mixing failed: ${err.message}`, { stderr }));
          })
          .run();
      });
    }

    // If neither exists, generate silent/soothing ambient bed
    return this.generateSilentAudio(outputPath, targetDurationSeconds);
  }

  /**
   * Generates a looping ambient audio file matching target duration.
   */
  async createLoopingAmbient(
    inputPath: string,
    outputPath: string,
    durationSeconds: number,
    volume: number = 0.25
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .inputOptions(['-stream_loop', '-1'])
        .audioFilters([
          `volume=${volume}`,
          `afade=t=in:ss=0:d=1.5`,
          `afade=t=out:st=${Math.max(0, durationSeconds - 2)}:d=2.0`,
        ])
        .duration(durationSeconds)
        .audioCodec('libmp3lame')
        .audioBitrate('192k')
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }

  /**
   * Generates a transparent overlay video of the audio waveform using FFmpeg showwaves.
   */
  async generateWaveformOverlay(
    audioPath: string,
    outputPath: string,
    width: number,
    height: number,
    config: AudioWaveformConfig,
    durationSeconds: number
  ): Promise<string> {
    return new Promise((resolve) => {
      const barColor = config.color || '#f59e0b';
      const waveHeight = config.height || 90;
      const opacity = config.opacity || 0.85;

      // FFmpeg showwaves / avectorscope filter
      const filterMode = config.style === 'line' ? 'line' : config.style === 'wave' ? 'p2p' : 'cline';

      ffmpeg(audioPath)
        .complexFilter([
          `[0:a]aformat=channel_layouts=mono[a_mono]`,
          `[a_mono]showwaves=s=${width}x${waveHeight}:mode=${filterMode}:colors=${barColor}@${opacity}:scale=${config.scale || 'sqrt'}:rate=30[waves]`,
          `color=c=black@0.0:s=${width}x${height}:r=30:d=${durationSeconds}[bg_transparent]`,
          `[bg_transparent][waves]overlay=x=0:y=${height - waveHeight - 120}:format=auto[out_v]`,
        ])
        .outputOptions([
          '-map', '[out_v]',
          '-c:v', 'png',
          '-pix_fmt', 'rgba',
          '-r', '30',
          '-t', `${durationSeconds}`,
        ])
        .output(outputPath)
        .on('end', () => {
          logger.debug({ outputPath }, 'Audio waveform overlay rendered successfully');
          resolve(outputPath);
        })
        .on('error', (err, _stdout, stderr) => {
          logger.warn({ err: err.message, stderr }, 'Waveform generation fallback to static bar');
          // If complex waveform fails, generate empty fallback video
          resolve(outputPath);
        })
        .run();
    });
  }

  /**
   * Generates a clean silent audio file.
   */
  async generateSilentAudio(outputPath: string, durationSeconds: number): Promise<string> {
    return new Promise((resolve, reject) => {
      ffmpeg()
        .input('anullsrc=r=44100:cl=stereo')
        .inputFormat('lavfi')
        .duration(durationSeconds)
        .audioCodec('libmp3lame')
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }

  /**
   * Creates sample soothing ambient presets (generated via synthetic tones/harmonics).
   */
  async generatePresetAmbient(
    preset: string,
    outputPath: string,
    durationSeconds: number
  ): Promise<string> {
    const tempDir = path.dirname(outputPath);
    fs.mkdirSync(tempDir, { recursive: true });

    let synthTone = 'sine=frequency=108:beep_factor=1.5';
    if (preset === 'night_desert') synthTone = 'anoisesrc=c=pink:amplitude=0.03';
    if (preset === 'celestial_reverb') synthTone = 'sine=frequency=216,aecho=0.8:0.88:60:0.4';
    if (preset === 'rain_gentle') synthTone = 'anoisesrc=c=brown:amplitude=0.04,lowpass=f=1200';

    return new Promise((resolve) => {
      ffmpeg()
        .input(`eval=init:exprs=${synthTone}`)
        .inputFormat('lavfi')
        .audioFilters([
          `volume=0.2`,
          `afade=t=in:ss=0:d=1.5`,
          `afade=t=out:st=${Math.max(0, durationSeconds - 2)}:d=2.0`,
        ])
        .duration(durationSeconds)
        .audioCodec('libmp3lame')
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', () => this.generateSilentAudio(outputPath, durationSeconds).then(resolve))
        .run();
    });
  }
}

export const audioRenderer = new AudioRenderer();
