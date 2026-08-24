import type { SubtitlesConfig, SubtitleCue, SubtitleStyle } from '../types/project.types.js';

export class SubtitleRenderer {
  /**
   * Generates production-ready Advanced SubStation Alpha (.ass) subtitles with RTL support,
   * dual-language stacking, and word-by-word active timing tags.
   */
  generateAssSubtitles(
    config: SubtitlesConfig,
    width: number = 1080,
    height: number = 1920
  ): string {
    const style: SubtitleStyle = {
      fontArabic: config.style?.fontArabic || 'Amiri Quran, Amiri, Traditional Arabic, Arial',
      fontTranslation: config.style?.fontTranslation || 'Inter, Roboto, Arial',
      fontSizeArabic: config.style?.fontSizeArabic || Math.round(width * 0.046),
      fontSizeTranslation: config.style?.fontSizeTranslation || Math.round(width * 0.026),
      primaryColorHex: config.style?.primaryColorHex || '&H00FFFFFF', // White
      highlightColorHex: config.style?.highlightColorHex || '&H0000D7FF', // Gold in BGR (&H00BBGGRR)
      outlineColorHex: config.style?.outlineColorHex || '&H00000000', // Black
      outlineWidth: config.style?.outlineWidth ?? 3,
      shadowWidth: config.style?.shadowWidth ?? 2,
      alignment: config.style?.alignment ?? 2, // Bottom Center
      marginV: config.style?.marginV ?? Math.round(height * 0.12),
      dualLanguage: config.style?.dualLanguage ?? true,
      wordHighlight: config.style?.wordHighlight ?? true,
      rtl: config.style?.rtl ?? true,
    };

    const header = `[Script Info]
Title: Quran Media Visual Production Subtitles
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.601
PlayResX: ${width}
PlayResY: ${height}

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: QuranArabic,${style.fontArabic},${style.fontSizeArabic},${style.highlightColorHex},${style.highlightColorHex},${style.outlineColorHex},&H80000000,-1,0,0,0,100,100,0,0,1,${style.outlineWidth},${style.shadowWidth},${style.alignment},40,40,${style.marginV},178
Style: TranslationText,${style.fontTranslation},${style.fontSizeTranslation},${style.primaryColorHex},${style.primaryColorHex},${style.outlineColorHex},&H80000000,0,0,0,0,100,100,0,0,1,${style.outlineWidth},${style.shadowWidth},${style.alignment},50,50,${Math.max(20, style.marginV! - Math.round(style.fontSizeArabic! * 1.6))},0

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

    const events: string[] = [];

    for (const cue of config.cues) {
      const startTime = this.formatAssTimestamp(cue.startMs);
      const endTime = this.formatAssTimestamp(cue.endMs);

      // 1. Process Arabic Line (with word karaoke highlights if present)
      let arabicFormattedText = cue.arabicText;
      if (style.wordHighlight && cue.words && cue.words.length > 0) {
        arabicFormattedText = cue.words
          .map((w) => {
            const durCs = Math.max(1, Math.round((w.endMs - w.startMs) / 10));
            return `{\\k${durCs}}${w.text}`;
          })
          .join(' ');
      }

      // Add Arabic Event
      events.push(
        `Dialogue: 0,${startTime},${endTime},QuranArabic,,0,0,0,,${arabicFormattedText}`
      );

      // 2. Process English / Secondary Translation Line (if present and dualLanguage is true)
      if (style.dualLanguage && cue.translationText) {
        events.push(
          `Dialogue: 0,${startTime},${endTime},TranslationText,,0,0,0,,${cue.translationText}`
        );
      }
    }

    return header + events.join('\n') + '\n';
  }

  /**
   * Generates WebVTT (.vtt) format for web players.
   */
  generateVttSubtitles(cues: SubtitleCue[]): string {
    let vtt = 'WEBVTT\n\n';

    cues.forEach((cue, index) => {
      const start = this.formatVttTimestamp(cue.startMs);
      const end = this.formatVttTimestamp(cue.endMs);

      vtt += `${index + 1}\n`;
      vtt += `${start} --> ${end}\n`;
      vtt += `${cue.arabicText}\n`;
      if (cue.translationText) {
        vtt += `${cue.translationText}\n`;
      }
      vtt += '\n';
    });

    return vtt;
  }

  /**
   * Generates SubRip (.srt) format.
   */
  generateSrtSubtitles(cues: SubtitleCue[]): string {
    let srt = '';

    cues.forEach((cue, index) => {
      const start = this.formatSrtTimestamp(cue.startMs);
      const end = this.formatSrtTimestamp(cue.endMs);

      srt += `${index + 1}\n`;
      srt += `${start} --> ${end}\n`;
      srt += `${cue.arabicText}\n`;
      if (cue.translationText) {
        srt += `${cue.translationText}\n`;
      }
      srt += '\n';
    });

    return srt;
  }

  private formatAssTimestamp(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);

    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
  }

  private formatVttTimestamp(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = ms % 1000;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
  }

  private formatSrtTimestamp(ms: number): string {
    return this.formatVttTimestamp(ms).replace('.', ',');
  }
}

export const subtitleRenderer = new SubtitleRenderer();
