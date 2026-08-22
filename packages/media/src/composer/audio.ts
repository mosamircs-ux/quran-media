import ffmpeg from 'fluent-ffmpeg';
import { MediaProcessingError } from '@quran-media/config';

export async function sliceAudio(params: {
  inputPath: string;
  outputPath: string;
  startSeconds: number;
  durationSeconds: number;
}): Promise<void> {
  const { inputPath, outputPath, startSeconds, durationSeconds } = params;

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime(startSeconds)
      .setDuration(durationSeconds)
      .audioCodec('libmp3lame')
      .audioBitrate(192)
      .output(outputPath)
      .on('end', () => resolve())
      .on('error', (err) => reject(new MediaProcessingError('Audio slicing failed', err)))
      .run();
  });
}
