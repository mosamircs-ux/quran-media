import ffmpeg from 'fluent-ffmpeg';
import { env } from '@quran-media/config';

if (env.FFMPEG_PATH) {
  ffmpeg.setFfmpegPath(env.FFMPEG_PATH);
}

if (env.FFPROBE_PATH) {
  ffmpeg.setFfprobePath(env.FFPROBE_PATH);
}

export { ffmpeg };
