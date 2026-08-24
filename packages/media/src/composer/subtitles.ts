import type { SubtitleCue, SubtitleStyle } from '../types.js';

function formatAssTime(ms: number): string {
  const totalSeconds = ms / 1000;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const centiseconds = Math.floor((ms % 1000) / 10);

  return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
}

export function generateAssSubtitles(
  cues: SubtitleCue[],
  style?: SubtitleStyle,
  playResX: number = 1080,
  playResY: number = 1920
): string {
  const font = (style as any)?.fontName || style?.fontArabic || 'Amiri';
  const size = (style as any)?.fontSize || style?.fontSizeArabic || 36;
  const primaryColor = style?.primaryColorHex || '&H00FFFFFF';
  const highlightColor = style?.highlightColorHex || '&H0000D7FF'; // Gold
  const outlineColor = style?.outlineColorHex || '&H00000000';
  const outline = style?.outlineWidth ?? 2;
  const shadow = style?.shadowWidth ?? 1;
  const alignment = style?.alignment ?? 2; // Bottom Center
  const marginV = style?.marginV ?? 180;

  let header = `[Script Info]
Title: Quran Media Subtitles
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.709
PlayResX: ${playResX}
PlayResY: ${playResY}

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: ArabicQuran,${font},${size},${primaryColor},${highlightColor},${outlineColor},&H80000000,-1,0,0,0,100,100,1,0,1,${outline},${shadow},${alignment},60,60,${marginV},1
Style: Translation,Inter,${Math.round(size * 0.55)},&H00CCCCCC,&H00000000,${outlineColor},&H80000000,0,0,0,0,100,100,0,0,1,1,1,${alignment},60,60,${Math.max(40, marginV - 70)},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  for (const cue of cues) {
    const start = formatAssTime(cue.startMs);
    const end = formatAssTime(cue.endMs);

    let textPayload = cue.arabicText;

    // If word-level karaoke timing segments are provided, format with \k tags
    if (cue.words && cue.words.length > 0) {
      textPayload = cue.words
        .map((w) => {
          const durationCentis = Math.max(1, Math.round((w.endMs - w.startMs) / 10));
          return `{\\k${durationCentis}}${w.text}`;
        })
        .join(' ');
    }

    // Add Arabic Dialogue line
    header += `Dialogue: 0,${start},${end},ArabicQuran,,0,0,0,,{\\an${alignment}}${textPayload}\n`;

    // Add translation line if present
    if (cue.translationText) {
      header += `Dialogue: 0,${start},${end},Translation,,0,0,0,,{\\an${alignment}}${cue.translationText}\n`;
    }
  }

  return header;
}
