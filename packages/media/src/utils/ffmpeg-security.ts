/**
 * Security Guard: Sanitizes file paths used in FFmpeg filter complex arguments.
 * FFmpeg filter graphs interpret colons ':', single quotes '\'', backslashes '\\', and semicolons ';'
 * as special delimiters. An unsanitized path can trigger arbitrary filter injection or file reads.
 */
export function sanitizeFfmpegFilterPath(rawPath: string): string {
  if (!rawPath || typeof rawPath !== 'string') {
    throw new Error('Invalid file path provided to FFmpeg filter');
  }

  // 1. Prevent null byte injection, command control characters and path traversal
  if (/[\0\r\n`$|&;<>]/.test(rawPath)) {
    throw new Error('Potentially dangerous characters detected in FFmpeg path');
  }

  if (rawPath.includes('..')) {
    throw new Error('Path traversal sequence detected in FFmpeg path');
  }

  // 2. Format for FFmpeg filter syntax:
  // - Convert backslashes to forward slashes
  // - Escape drive letter colons (e.g. C: -> C\:)
  // - Escape single quotes (e.g. ' -> \')
  let formatted = rawPath.replace(/\\/g, '/');

  if (/^[A-Za-z]:/.test(formatted)) {
    formatted = formatted.replace(/^([A-Za-z]):/, '$1\\:');
  }

  formatted = formatted.replace(/'/g, "\\'");

  return formatted;
}

/**
 * Security Guard: Validates and sanitizes text overlay strings (e.g. for drawtext filter).
 * Prevents command injection and parameter breakouts.
 */
export function sanitizeDrawtextString(text: string): string {
  if (!text || typeof text !== 'string') return '';

  return text
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/%/g, '\\%')
    .replace(/:/g, '\\:')
    .replace(/[\0\r\n`$|&;<>]/g, '');
}
