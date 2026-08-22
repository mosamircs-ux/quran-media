export interface Reciter {
  id: number;
  name: string;
  arabicName?: string;
  style?: string; // Murattal, Mujawwad
  qirat?: string; // Hafs, Warsh, etc.
}

export interface AudioRecitationFile {
  id: number;
  chapterId: number;
  reciterId: number;
  audioUrl: string;
  format: string;
  durationSeconds?: number;
  verseTimestamps?: Array<{
    verseKey: string;
    timestampFromMs: number;
    timestampToMs: number;
    durationMs: number;
    segments?: Array<[number, number, number, number]>; // [wordIndex, startMs, endMs, timestamp]
  }>;
}
