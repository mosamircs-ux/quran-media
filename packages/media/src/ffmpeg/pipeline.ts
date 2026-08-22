import { ffmpeg } from './client.js';
import { buildComplexFilterGraph } from './filters.js';
import type { VideoSynthesisOptions } from '../types.js';
import { logger, MediaProcessingError } from '@quran-media/config';

export async function synthesizeQuranVideo(options: VideoSynthesisOptions): Promise<void> {
  const { audioPath, backgroundPath, subtitlePath, outputPath, aspectRatio, enableSlowZoom, onProgress } =
    options;

  const filters = buildComplexFilterGraph({
    aspectRatio,
    subtitlePath,
    enableSlowZoom: enableSlowZoom ?? true,
  });

  return new Promise((resolve, reject) => {
    logger.info({ outputPath, aspectRatio }, 'Starting FFmpeg video synthesis');

    const command = ffmpeg()
      // Input 0: Background image (looped)
      .input(backgroundPath)
      .loop()
      // Input 1: Audio track
      .input(audioPath)
      .complexFilter(filters)
      // Encoding parameters
      .videoCodec('libx264')
      .outputOptions([
        '-preset medium',
        '-crf 22',
        '-pix_fmt yuv420p',
        '-shortest', // Stop video when audio ends
        '-movflags +faststart', // Web streaming optimization
      ])
      .audioCodec('aac')
      .audioBitrate(192)
      .output(outputPath);

    if (onProgress) {
      command.on('progress', (p) => {
        if (p.percent) onProgress(Math.round(p.percent));
      });
    }

    command
      .on('end', () => {
        logger.info({ outputPath }, 'FFmpeg video synthesis finished successfully');
        resolve();
      })
      .on('error', (err, stdout, stderr) => {
        logger.error({ err: err.message, stderr }, 'FFmpeg video synthesis failed');
        reject(new MediaProcessingError(`Video encoding failed: ${err.message}`, { stderr }));
      })
      .run();
  });
}
