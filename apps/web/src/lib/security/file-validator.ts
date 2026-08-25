import crypto from 'crypto';
import path from 'path';

export const ALLOWED_MIME_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/ogg': ['.ogg'],
};

export const MAX_FILE_SIZES = {
  image: 5 * 1024 * 1024, // 5MB
  audio: 15 * 1024 * 1024, // 15MB
  video: 100 * 1024 * 1024, // 100MB
};

/**
 * Validates file buffer against known Magic Bytes
 */
export function validateMagicBytes(buffer: Buffer): { isValid: boolean; detectedMime?: string } {
  if (!buffer || buffer.length < 12) {
    return { isValid: false };
  }

  // 1. JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { isValid: true, detectedMime: 'image/jpeg' };
  }

  // 2. PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { isValid: true, detectedMime: 'image/png' };
  }

  // 3. WebP: 52 49 46 46 .... 57 45 42 50 (RIFF....WEBP)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { isValid: true, detectedMime: 'image/webp' };
  }

  // 4. MP4: .... 66 74 79 70 (ftyp)
  if (
    buffer[4] === 0x66 &&
    buffer[5] === 0x74 &&
    buffer[6] === 0x79 &&
    buffer[7] === 0x70
  ) {
    return { isValid: true, detectedMime: 'video/mp4' };
  }

  // 5. MP3: 49 44 33 (ID3) or FF FB
  if (
    (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) ||
    (buffer[0] === 0xff && buffer[1] !== undefined && (buffer[1] & 0xe0) === 0xe0)
  ) {
    return { isValid: true, detectedMime: 'audio/mpeg' };
  }

  // 6. WAV: 52 49 46 46 .... 57 41 56 45 (RIFF....WAVE)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x41 &&
    buffer[10] === 0x56 &&
    buffer[11] === 0x45
  ) {
    return { isValid: true, detectedMime: 'audio/wav' };
  }

  return { isValid: false };
}

/**
 * Generates a secure, unguessable storage filename
 */
export function generateSecureFilename(originalName: string, mimeType: string): string {
  const allowedExtensions = ALLOWED_MIME_TYPES[mimeType as keyof typeof ALLOWED_MIME_TYPES];
  const defaultExt = allowedExtensions ? allowedExtensions[0] : '.bin';

  // Extract clean ext
  const ext = path.extname(originalName).toLowerCase();
  const safeExt = allowedExtensions?.includes(ext) ? ext : defaultExt;

  const randomUUID = crypto.randomUUID();
  const timestamp = Date.now();

  return `${timestamp}-${randomUUID}${safeExt}`;
}
