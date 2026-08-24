import ffmpeg from 'fluent-ffmpeg';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import type { MediaProject } from '../types/project.types.js';
import { getResolutionDimensions } from '../types/project.types.js';
import { logger } from '@quran-media/config';

export class ThumbnailGenerator {
  /**
   * Extracts a video frame and overlays high-DPI Quranic typography and glassmorphism badge.
   */
  async generateThumbnailFromVideo(
    videoPath: string,
    project: MediaProject,
    outputPath: string,
    timestampSeconds: number = 2
  ): Promise<string> {
    const tempDir = path.dirname(outputPath);
    fs.mkdirSync(tempDir, { recursive: true });

    const rawFramePath = path.join(tempDir, `raw-frame-${Date.now()}.png`);
    const { width, height } = getResolutionDimensions(project.aspectRatio, project.resolution);

    // 1. Extract clean frame via FFmpeg
    await new Promise<void>((resolve) => {
      ffmpeg(videoPath)
        .screenshots({
          timestamps: [timestampSeconds],
          filename: path.basename(rawFramePath),
          folder: tempDir,
          size: `${width}x${height}`,
        })
        .on('end', () => resolve())
        .on('error', (err) => {
          logger.warn({ err: err.message }, 'Screenshot extraction failed; creating standalone poster');
          resolve();
        });
    });

    let baseImageBuffer: Buffer;
    if (fs.existsSync(rawFramePath)) {
      baseImageBuffer = fs.readFileSync(rawFramePath);
      try { fs.unlinkSync(rawFramePath); } catch {}
    } else {
      // Fallback base gradient
      const svgBg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#064e3b"/>
            <stop offset="50%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#020617"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg)"/>
      </svg>`;
      baseImageBuffer = await sharp(Buffer.from(svgBg)).png().toBuffer();
    }

    // 2. Compose High-DPI Poster Overlay
    const firstScene = project.scenes[0];
    const surahNumber = firstScene?.verse?.surahNumber || 1;
    const ayahNumber = firstScene?.verse?.ayahNumber || 1;
    const title = project.title || `سورة رقم ${surahNumber}`;

    const titleFontSize = Math.round(width * 0.052);
    const badgeFontSize = Math.round(width * 0.026);

    const overlaySvg = Buffer.from(`
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="thumbGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0.8"/>
          </radialGradient>
          <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.8"/>
            <stop offset="50%" stop-color="#ffffff" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#10b981" stop-opacity="0.8"/>
          </linearGradient>
        </defs>

        <!-- Dark Scrim + Radial Glow -->
        <rect width="100%" height="100%" fill="url(#thumbGlow)"/>

        <!-- Center Glassmorphism Badge -->
        <g transform="translate(${width / 2}, ${height / 2})">
          <rect x="-${width * 0.38}" y="-${height * 0.16}" width="${width * 0.76}" height="${height * 0.32}" rx="24" fill="#0f172a" fill-opacity="0.75" stroke="url(#borderGrad)" stroke-width="2"/>
          
          <!-- Play Icon -->
          <circle cx="0" cy="-${height * 0.04}" r="${width * 0.06}" fill="#f59e0b" fill-opacity="0.9"/>
          <polygon points="-${width * 0.015},-${height * 0.055} ${width * 0.025},-${height * 0.04} -${width * 0.015},-${height * 0.025}" fill="#020617"/>

          <!-- Title -->
          <text text-anchor="middle" y="${height * 0.05}" font-family="'Amiri', 'Traditional Arabic', serif" font-size="${titleFontSize}" font-weight="bold" fill="#fef08a">
            ${this.escapeXml(title)}
          </text>

          <!-- Ayah Badge -->
          <text text-anchor="middle" y="${height * 0.10}" font-family="'Inter', sans-serif" font-size="${badgeFontSize}" fill="#94a3b8" letter-spacing="1">
            VERSE ${ayahNumber} • HD PRODUCTION
          </text>
        </g>
      </svg>
    `);

    await sharp(baseImageBuffer)
      .composite([{ input: overlaySvg, blend: 'over' }])
      .jpeg({ quality: 90 })
      .toFile(outputPath);

    logger.debug({ outputPath }, 'Thumbnail generated successfully');
    return outputPath;
  }

  private escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '&':
          return '&amp;';
        case '\'':
          return '&apos;';
        case '"':
          return '&quot;';
        default:
          return c;
      }
    });
  }
}

export const thumbnailGenerator = new ThumbnailGenerator();
