export interface VerseVisualPromptOptions {
  surahName: string;
  themeDescription: string;
  stylePreset?: string;
}

export function buildReverentVisualPrompt(opts: VerseVisualPromptOptions): string {
  const baseTheme = opts.themeDescription;
  const style = opts.stylePreset || 'cinematic_nature';

  const styleEnhancements: Record<string, string> = {
    cinematic_nature:
      'breathtaking natural vista, dramatic golden hour sunlight, majestic mountains, crystalline rivers, atmospheric mist, cinematic volumetric lighting, hyper-realistic 8k',
    islamic_geometry:
      'intricate Islamic sacred geometric patterns, arabesque mosaic tiles, illuminated calligraphy light textures, deep emerald and gold accents, museum quality architectural photography',
    cosmic:
      'vast cosmic nebula, sparkling constellations in deep space, glowing celestial aura, profound celestial harmony, Hubble telescope aesthetic, 8k resolution',
    minimalist:
      'minimalist architectural scene, soft ambient daylight, clean serene desert sands, tranquil zen composition, fine art photography',
  };

  const chosenStyle = styleEnhancements[style] || styleEnhancements.cinematic_nature;

  return `${baseTheme}, ${chosenStyle}. Sacred transcendent feeling, peaceful harmony. STRICTLY NO HUMAN CHARACTERS, NO PROPHETIC OR DIVINE FIGURES, NO FACES.`;
}
