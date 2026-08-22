import type { AspectRatio, AspectRatioConfig } from './types.js';

export const MEDIA_ASPECT_RATIOS: Record<AspectRatio, AspectRatioConfig> = {
  '9:16': {
    width: 1080,
    height: 1920,
    label: 'Portrait / TikTok & Reels',
    defaultFontSize: 36,
    safeZone: { top: 0.15, bottom: 0.2, left: 0.08, right: 0.08 },
  },
  '16:9': {
    width: 1920,
    height: 1080,
    label: 'Landscape / YouTube',
    defaultFontSize: 40,
    safeZone: { top: 0.1, bottom: 0.12, left: 0.1, right: 0.1 },
  },
  '1:1': {
    width: 1080,
    height: 1080,
    label: 'Square / Feed Post',
    defaultFontSize: 32,
    safeZone: { top: 0.1, bottom: 0.1, left: 0.1, right: 0.1 },
  },
  '4:5': {
    width: 1080,
    height: 1350,
    label: 'Portrait / Instagram Feed',
    defaultFontSize: 34,
    safeZone: { top: 0.12, bottom: 0.15, left: 0.08, right: 0.08 },
  },
};

export function getDimensionsForAspectRatio(ratio: AspectRatio): { width: number; height: number } {
  const config = MEDIA_ASPECT_RATIOS[ratio];
  return { width: config.width, height: config.height };
}
