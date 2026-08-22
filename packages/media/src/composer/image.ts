import sharp from 'sharp';
import type { ImageCompositionOptions } from '../types.js';
import { MediaProcessingError } from '@quran-media/config';

export async function composeQuranImage(options: ImageCompositionOptions): Promise<Buffer> {
  const { width, height, backgroundBuffer, backgroundImagePath, arabicText, surahTitle } = options;

  try {
    let base = backgroundBuffer
      ? sharp(backgroundBuffer)
      : backgroundImagePath
        ? sharp(backgroundImagePath)
        : sharp({
            create: {
              width,
              height,
              channels: 4,
              background: { r: 15, g: 23, b: 42, alpha: 1 }, // Slate 900
            },
          });

    // Resize background to target aspect ratio (cover mode)
    base = base.resize(width, height, { fit: 'cover', position: 'center' });

    const overlays: sharp.OverlayOptions[] = [];

    // Create dark gradient overlay for text readability
    const gradientSvg = Buffer.from(`
      <svg width="${width}" height="${height}">
        <defs>
          <linearGradient id="overlay" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#000000" stop-opacity="0.3"/>
            <stop offset="50%" stop-color="#000000" stop-opacity="0.5"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0.8"/>
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#overlay)" />
      </svg>
    `);

    overlays.push({ input: gradientSvg, top: 0, left: 0 });

    // Overlay typography if provided
    if (arabicText || surahTitle) {
      const textSvg = Buffer.from(`
        <svg width="${width}" height="${height}">
          <style>
            .surah-title { font-family: 'Amiri', 'Noto Naskh Arabic', serif; font-size: ${Math.round(width * 0.045)}px; fill: #eab308; font-weight: bold; text-anchor: middle; }
            .arabic-ayah { font-family: 'Amiri', 'Noto Naskh Arabic', serif; font-size: ${Math.round(width * 0.055)}px; fill: #ffffff; text-anchor: middle; direction: rtl; }
          </style>
          ${surahTitle ? `<text x="${width / 2}" y="${Math.round(height * 0.25)}" class="surah-title">${surahTitle}</text>` : ''}
          ${arabicText ? `<text x="${width / 2}" y="${Math.round(height * 0.5)}" class="arabic-ayah">${arabicText.slice(0, 120)}</text>` : ''}
        </svg>
      `);
      overlays.push({ input: textSvg, top: 0, left: 0 });
    }

    return await base.composite(overlays).png({ quality: 90 }).toBuffer();
  } catch (err) {
    throw new MediaProcessingError('Image composition failed', err);
  }
}
