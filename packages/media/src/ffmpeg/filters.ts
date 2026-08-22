import type { AspectRatio } from '../types.js';
import { getDimensionsForAspectRatio } from '../aspect-ratios.js';

export function buildComplexFilterGraph(params: {
  aspectRatio: AspectRatio;
  subtitlePath?: string;
  enableSlowZoom?: boolean;
}): string[] {
  const { width, height } = getDimensionsForAspectRatio(params.aspectRatio);
  const filters: string[] = [];

  // 1. Scale & Crop background image to exact resolution
  let currentStream = '0:v';

  if (params.enableSlowZoom) {
    // Zoompan filter for slow cinematic zoom-in
    filters.push(`[${currentStream}]scale=8000:-1,zoompan=z='min(zoom+0.0015,1.15)':d=750:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${width}x${height}[zoomed]`);
    currentStream = 'zoomed';
  } else {
    filters.push(`[${currentStream}]scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height}[scaled]`);
    currentStream = 'scaled';
  }

  // 2. Subtitle burn-in if subtitle path is specified
  if (params.subtitlePath) {
    const escapedSubPath = params.subtitlePath.replace(/\\/g, '/').replace(/:/g, '\\:');
    filters.push(`[${currentStream}]ass='${escapedSubPath}'[with_subs]`);
    currentStream = 'with_subs';
  }

  return filters;
}
