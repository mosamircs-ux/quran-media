import type {
  SceneBackground,
  SceneOverlay,
  SceneVerse,
  IntroConfig,
  OutroConfig,
  AspectRatio,
} from '../types/project.types.js';

async function getSharp() {
  const mod = await import('sharp');
  return (mod && (mod as any).default) ? (mod as any).default : mod;
}

export interface ImageRenderResult {
  buffer: Buffer;
  width: number;
  height: number;
  format: 'png' | 'jpeg';
}

export class ImageRenderer {
  /**
   * Generates a procedural or image-backed background buffer.
   */
  async renderBackground(
    background: SceneBackground,
    width: number,
    height: number
  ): Promise<Buffer> {
    const sharp = await getSharp();
    const {
      type,
      color = '#020617',
      gradientColors = ['#064e3b', '#0f172a', '#020617'],
      gradientAngle = 135,
      blurRadius = 0,
      opacity = 1,
      overlayColor = '#000000',
      overlayOpacity = 0.35,
      src,
    } = background;

    if (src && (type === 'image' || type === 'video')) {
      try {
        let baseImage: any;
        if (src.startsWith('data:')) {
          const base64Data = src.split(',')[1] || '';
          baseImage = sharp(Buffer.from(base64Data, 'base64'));
        } else if (src.startsWith('http://') || src.startsWith('https://')) {
          const resp = await fetch(src);
          const arrayBuf = await resp.arrayBuffer();
          baseImage = sharp(Buffer.from(arrayBuf));
        } else {
          baseImage = sharp(src);
        }

        let pipeline = baseImage.resize(width, height, { fit: 'cover', position: 'center' });

        if (blurRadius > 0) {
          pipeline = pipeline.blur(Math.min(blurRadius, 50));
        }

        // Apply dark scrim overlay for text readability
        if (overlayOpacity > 0) {
          const scrimSvg = Buffer.from(`
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="${overlayColor}" opacity="${overlayOpacity}"/>
            </svg>
          `);
          pipeline = pipeline.composite([{ input: scrimSvg, blend: 'over' }]);
        }

        return await pipeline.png().toBuffer();
      } catch {
        // Fallback to procedural gradient if loading source fails
      }
    }

    // Procedural SVG Generation (Gradients, Particles, Glow)
    const c1 = gradientColors[0] || '#064e3b';
    const c2 = gradientColors[1] || '#0f172a';
    const c3 = gradientColors[2] || '#020617';

    let patternElements = '';
    if (type === 'particles' || type === 'animated_gradient') {
      // Add decorative celestial star points and ambient orbs
      const stars: string[] = [];
      for (let i = 0; i < 40; i++) {
        const cx = Math.floor(Math.sin(i * 99) * (width / 2) + width / 2);
        const cy = Math.floor(Math.cos(i * 77) * (height / 2) + height / 2);
        const r = (i % 3) + 1.2;
        const o = ((i % 5) + 2) * 0.12;
        stars.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffffff" opacity="${o}"/>`);
      }
      patternElements = stars.join('\n');
    }

    const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${gradientAngle})">
            <stop offset="0%" stop-color="${c1}"/>
            <stop offset="55%" stop-color="${c2}"/>
            <stop offset="100%" stop-color="${c3}"/>
          </linearGradient>
          <radialGradient id="glowTop" cx="50%" cy="20%" r="50%">
            <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.16"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="glowBottom" cx="50%" cy="80%" r="60%">
            <stop offset="0%" stop-color="#10b981" stop-opacity="0.14"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="${color}"/>
        <rect width="100%" height="100%" fill="url(#bgGrad)" opacity="${opacity}"/>
        <rect width="100%" height="100%" fill="url(#glowTop)"/>
        <rect width="100%" height="100%" fill="url(#glowBottom)"/>
        ${patternElements}
        <!-- Subtle Vignette -->
        <rect width="100%" height="100%" fill="none" stroke="#000000" stroke-width="40" opacity="0.4"/>
      </svg>
    `;

    return await sharp(Buffer.from(svg)).png().toBuffer();
  }

  /**
   * Renders a Quran calligraphic card plate with Uthmani typography, ornate border arches, and translations.
   */
  async renderQuranTextPlate(
    verse: SceneVerse,
    overlay: SceneOverlay | undefined,
    width: number,
    height: number,
    _aspectRatio: AspectRatio = '9:16'
  ): Promise<Buffer> {
    const sharp = await getSharp();
    const textUthmani = verse.textUthmani || verse.textSimple || '';
    const translationText = verse.translationText || '';
    const surahNumber = verse.surahNumber || 1;
    const ayahNumber = verse.ayahNumber || 1;
    const surahTitle = overlay?.calligraphySurah || overlay?.title || `سورة رقم ${surahNumber}`;
    const themeColor = overlay?.themeColor || '#f59e0b';

    // Break long Arabic text into balanced lines for high-DPI display
    const arabicLines = this.splitIntoLines(textUthmani, 42);
    const translationLines = this.splitIntoLines(translationText, 58);

    const arabicFontSize = Math.round(width * 0.045);
    const translationFontSize = Math.round(width * 0.026);
    const badgeFontSize = Math.round(width * 0.024);

    const arabicSvgTspans = arabicLines
      .map(
        (line, i) =>
          `<tspan x="${width / 2}" dy="${i === 0 ? 0 : arabicFontSize * 1.5}">${this.escapeXml(line)}</tspan>`
      )
      .join('\n');

    const translationSvgTspans = translationLines
      .map(
        (line, i) =>
          `<tspan x="${width / 2}" dy="${i === 0 ? 0 : translationFontSize * 1.45}">${this.escapeXml(line)}</tspan>`
      )
      .join('\n');

    const boxWidth = Math.round(width * 0.88);
    const boxX = Math.round((width - boxWidth) / 2);
    const boxY = Math.round(height * 0.22);
    const boxHeight = Math.round(height * 0.58);

    const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${themeColor}" stop-opacity="0.9"/>
            <stop offset="50%" stop-color="#ffffff" stop-opacity="0.7"/>
            <stop offset="100%" stop-color="${themeColor}" stop-opacity="0.9"/>
          </linearGradient>
          <radialGradient id="cardGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#0f172a" stop-opacity="0.88"/>
            <stop offset="100%" stop-color="#020617" stop-opacity="0.95"/>
          </radialGradient>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="12" stdDeviation="20" flood-color="#000000" flood-opacity="0.75"/>
          </filter>
        </defs>

        <!-- Glassmorphism Card Frame -->
        <rect x="${boxX}" y="${boxY}" width="${boxWidth}" height="${boxHeight}" rx="28" fill="url(#cardGlow)" stroke="url(#goldBorder)" stroke-width="2.5" filter="url(#shadow)"/>
        
        <!-- Ornate Corner Motifs -->
        <path d="M ${boxX + 16} ${boxY + 40} L ${boxX + 16} ${boxY + 16} L ${boxX + 40} ${boxY + 16}" stroke="${themeColor}" stroke-width="3" fill="none" opacity="0.8"/>
        <path d="M ${boxX + boxWidth - 16} ${boxY + 40} L ${boxX + boxWidth - 16} ${boxY + 16} L ${boxX + boxWidth - 40} ${boxY + 16}" stroke="${themeColor}" stroke-width="3" fill="none" opacity="0.8"/>
        <path d="M ${boxX + 16} ${boxY + boxHeight - 40} L ${boxX + 16} ${boxY + boxHeight - 16} L ${boxX + 40} ${boxY + boxHeight - 16}" stroke="${themeColor}" stroke-width="3" fill="none" opacity="0.8"/>
        <path d="M ${boxX + boxWidth - 16} ${boxY + boxHeight - 40} L ${boxX + boxWidth - 16} ${boxY + boxHeight - 16} L ${boxX + boxWidth - 40} ${boxY + boxHeight - 16}" stroke="${themeColor}" stroke-width="3" fill="none" opacity="0.8"/>

        <!-- Surah Badge Header -->
        <g transform="translate(${width / 2}, ${boxY + 54})">
          <rect x="-140" y="-22" width="280" height="44" rx="22" fill="#1e293b" stroke="${themeColor}" stroke-width="1.5" opacity="0.9"/>
          <text text-anchor="middle" y="6" font-family="'Amiri', 'Traditional Arabic', serif" font-size="${badgeFontSize}" font-weight="bold" fill="#f8fafc">
            ${this.escapeXml(surahTitle)} • الآية ${ayahNumber}
          </text>
        </g>

        <!-- Quran Arabic Uthmani Text -->
        <text text-anchor="middle" x="${width / 2}" y="${boxY + 140}" font-family="'Amiri Quran', 'Amiri', 'Traditional Arabic', serif" font-size="${arabicFontSize}" font-weight="bold" fill="#fef08a" letter-spacing="0.5">
          ${arabicSvgTspans}
        </text>

        <!-- Divider -->
        <line x1="${boxX + 80}" y1="${boxY + boxHeight - (translationLines.length > 0 ? 160 : 40)}" x2="${boxX + boxWidth - 80}" y2="${boxY + boxHeight - (translationLines.length > 0 ? 160 : 40)}" stroke="${themeColor}" stroke-width="1" stroke-dasharray="8,8" opacity="0.5"/>

        <!-- Translation Text (if present) -->
        ${
          translationText
            ? `
        <text text-anchor="middle" x="${width / 2}" y="${boxY + boxHeight - 120}" font-family="'Inter', 'Roboto', 'Arial', sans-serif" font-size="${translationFontSize}" fill="#e2e8f0" font-weight="400">
          ${translationSvgTspans}
        </text>`
            : ''
        }
      </svg>
    `;

    return await sharp(Buffer.from(svg)).png().toBuffer();
  }

  /**
   * Renders an Intro Slate Card.
   */
  async renderIntroCard(intro: IntroConfig, width: number, height: number): Promise<Buffer> {
    const sharp = await getSharp();
    const titleAr = intro.titleAr || 'القرآن الكريم';
    const titleEn = intro.titleEn || 'The Noble Quran';
    const badge = intro.badge || 'تلاوة خاشعة مرئية';

    const titleArFontSize = Math.round(width * 0.065);
    const titleEnFontSize = Math.round(width * 0.032);
    const badgeFontSize = Math.round(width * 0.024);

    const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="introGrad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stop-color="#064e3b"/>
            <stop offset="60%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#020617"/>
          </radialGradient>
          <linearGradient id="goldText" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#f59e0b"/>
            <stop offset="50%" stop-color="#fef08a"/>
            <stop offset="100%" stop-color="#f59e0b"/>
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#introGrad)"/>

        <!-- Decorative Center Islamic Rosette -->
        <circle cx="${width / 2}" cy="${height / 2}" r="${width * 0.28}" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="6,8" opacity="0.3"/>
        <circle cx="${width / 2}" cy="${height / 2}" r="${width * 0.22}" fill="none" stroke="#10b981" stroke-width="1" opacity="0.25"/>

        <!-- Badge -->
        <g transform="translate(${width / 2}, ${height / 2 - 110})">
          <rect x="-130" y="-20" width="260" height="40" rx="20" fill="#065f46" stroke="#34d399" stroke-width="1.5" opacity="0.85"/>
          <text text-anchor="middle" y="6" font-family="'Amiri', sans-serif" font-size="${badgeFontSize}" fill="#ecfdf5" font-weight="bold">
            ${this.escapeXml(badge)}
          </text>
        </g>

        <!-- Main Title Arabic -->
        <text text-anchor="middle" x="${width / 2}" y="${height / 2}" font-family="'Amiri', 'Traditional Arabic', serif" font-size="${titleArFontSize}" font-weight="bold" fill="url(#goldText)">
          ${this.escapeXml(titleAr)}
        </text>

        <!-- English Subtitle -->
        <text text-anchor="middle" x="${width / 2}" y="${height / 2 + 55}" font-family="'Inter', sans-serif" font-size="${titleEnFontSize}" font-weight="300" fill="#94a3b8" letter-spacing="2">
          ${this.escapeXml(titleEn)}
        </text>
      </svg>
    `;

    return await sharp(Buffer.from(svg)).png().toBuffer();
  }

  /**
   * Renders an Outro Reflection / Call-to-Action Card.
   */
  async renderOutroCard(outro: OutroConfig, width: number, height: number): Promise<Buffer> {
    const sharp = await getSharp();
    const reflectionAr = outro.reflectionAr || 'سبحان الله وبحمده، سبحان الله العظيم';
    const cta = outro.callToAction || 'اشترك للمزيد من روائع التلاوات والقصص القرآنية';
    const handle = outro.socialHandle || '@QuranMedia';

    const reflectionFontSize = Math.round(width * 0.048);
    const ctaFontSize = Math.round(width * 0.028);
    const handleFontSize = Math.round(width * 0.026);

    const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="outroGrad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stop-color="#1e1b4b"/>
            <stop offset="60%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#020617"/>
          </radialGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#outroGrad)"/>

        <!-- Reflection Text -->
        <text text-anchor="middle" x="${width / 2}" y="${height / 2 - 40}" font-family="'Amiri', 'Traditional Arabic', serif" font-size="${reflectionFontSize}" font-weight="bold" fill="#fef08a">
          ${this.escapeXml(reflectionAr)}
        </text>

        <!-- CTA Box -->
        <g transform="translate(${width / 2}, ${height / 2 + 50})">
          <rect x="-240" y="-24" width="480" height="48" rx="24" fill="#047857" stroke="#6ee7b7" stroke-width="1.5" opacity="0.9"/>
          <text text-anchor="middle" y="7" font-family="'Amiri', sans-serif" font-size="${ctaFontSize}" fill="#ffffff" font-weight="bold">
            ${this.escapeXml(cta)}
          </text>
        </g>

        <!-- Social Handle -->
        <text text-anchor="middle" x="${width / 2}" y="${height / 2 + 130}" font-family="'Inter', sans-serif" font-size="${handleFontSize}" fill="#94a3b8" letter-spacing="1">
          ${this.escapeXml(handle)}
        </text>
      </svg>
    `;

    return await sharp(Buffer.from(svg)).png().toBuffer();
  }

  private splitIntoLines(text: string, maxCharsPerLine: number): string[] {
    if (!text) return [];
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
        currentLine = (currentLine + ' ' + word).trim();
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
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

export const imageRenderer = new ImageRenderer();
