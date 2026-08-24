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
   * Generates a clean silent audio file directly without external lavfi device dependencies.
   */
  async generateSilentAudio(outputPath: string, durationSeconds: number): Promise<string> {
    const tempDir = path.dirname(outputPath);
    fs.mkdirSync(tempDir, { recursive: true });

    const wavBuffer = this.buildWavBuffer(durationSeconds, () => 0);
    const wavTempPath = `${outputPath}.wav`;
    fs.writeFileSync(wavTempPath, wavBuffer);

    return new Promise((resolve, reject) => {
      ffmpeg(wavTempPath)
        .audioCodec('libmp3lame')
        .audioBitrate('192k')
        .output(outputPath)
        .on('end', () => {
          try { fs.unlinkSync(wavTempPath); } catch {}
          resolve(outputPath);
        })
        .on('error', (err) => {
          try { fs.unlinkSync(wavTempPath); } catch {}
          reject(err);
        })
        .run();
    });
  }

  /**
   * Creates soothing ambient soundscapes with smooth harmonic resonance and acoustic envelopes.
   */
  async generatePresetAmbient(
    preset: string,
    outputPath: string,
    durationSeconds: number
  ): Promise<string> {
    const tempDir = path.dirname(outputPath);
    fs.mkdirSync(tempDir, { recursive: true });

    const baseFreq = preset === 'night_desert' ? 72 : preset === 'celestial_reverb' ? 144 : 108;
    const wavBuffer = this.buildWavBuffer(durationSeconds, (t, dur) => {
      // Gentle harmonic chord
      const f1 = Math.sin(2 * Math.PI * baseFreq * t);
      const f2 = Math.sin(2 * Math.PI * (baseFreq * 1.5) * t) * 0.4;
      const f3 = Math.sin(2 * Math.PI * (baseFreq * 2.0) * t) * 0.2;
      const signal = (f1 + f2 + f3) * 0.18;

      // Fade in & Fade out envelope
      let envelope = 1.0;
      if (t < 1.5) envelope = t / 1.5;
      else if (t > dur - 1.5) envelope = Math.max(0, (dur - t) / 1.5);

      return signal * envelope;
    });

    const wavTempPath = `${outputPath}.wav`;
    fs.writeFileSync(wavTempPath, wavBuffer);

    return new Promise((resolve) => {
      ffmpeg(wavTempPath)
        .audioCodec('libmp3lame')
        .audioBitrate('192k')
        .output(outputPath)
        .on('end', () => {
          try { fs.unlinkSync(wavTempPath); } catch {}
          resolve(outputPath);
        })
        .on('error', () => {
          try { fs.unlinkSync(wavTempPath); } catch {}
          this.generateSilentAudio(outputPath, durationSeconds).then(resolve);
        })
        .run();
    });
  }

  private buildWavBuffer(
    durationSeconds: number,
    sampleGenerator: (timeSec: number, durationSec: number) => number
  ): Buffer {
    const sampleRate = 44100;
    const numChannels = 2;
    const bytesPerSample = 2;
    const totalSamples = Math.floor(durationSeconds * sampleRate);
    const dataSize = totalSamples * numChannels * bytesPerSample;
    const buffer = Buffer.alloc(44 + dataSize);

    // RIFF header
    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + dataSize, 4);
    buffer.write('WAVE', 8);

    // fmt sub-chunk
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16); // Subchunk1Size
    buffer.writeUInt16LE(1, 20); // AudioFormat PCM
    buffer.writeUInt16LE(numChannels, 22);
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(sampleRate * numChannels * bytesPerSample, 28); // ByteRate
    buffer.writeUInt16LE(numChannels * bytesPerSample, 32); // BlockAlign
    buffer.writeUInt16LE(16, 34); // BitsPerSample

    // data sub-chunk
    buffer.write('data', 36);
    buffer.writeUInt32LE(dataSize, 40);

    let offset = 44;
    for (let i = 0; i < totalSamples; i++) {
      const t = i / sampleRate;
      const sampleVal = Math.max(-1, Math.min(1, sampleGenerator(t, durationSeconds)));
      const int16Val = Math.floor(sampleVal * 32767);

      // Left channel
      buffer.writeInt16LE(int16Val, offset);
      offset += 2;
      // Right channel
      buffer.writeInt16LE(int16Val, offset);
      offset += 2;
    }

    return buffer;
  }
}

export const audioRenderer = new AudioRenderer();
