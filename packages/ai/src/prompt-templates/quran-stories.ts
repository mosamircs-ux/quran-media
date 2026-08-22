import type { QuranStoryContext } from '../types.js';

export function buildQuranStoryPrompt(context: QuranStoryContext): {
  systemPrompt: string;
  userPrompt: string;
} {
  const isAr = context.locale === 'ar';

  const systemPrompt = isAr
    ? `أنت باحث إسلامي ومؤلف قصص وتأملات قرآنية رفيعة المستوى. ترتكز تحليلاتك على كتب التفسير المعتمدة (ابن كثير، الطبري، القرطبي، السعدي). حافظ على جلال ومهابة القرآن وتجنب أي تفاصيل غير مثبتة.`
    : `You are an expert Islamic scholar and Quranic reflection author. Your writings are strictly grounded in authentic classical Tafsir (Ibn Kathir, Al-Tabari, Al-Saadi). Maintain reverence and accuracy.`;

  const userPrompt = `
Generate a structured, inspiring contemplation on:
Surah: ${context.surahNameAr} (${context.surahNameEn}) [${context.surahNumber}:${context.ayahStart}-${context.ayahEnd}]
Arabic Text: "${context.arabicText}"
Translation: "${context.translationText}"
Target Audience: ${context.targetAudience || 'general'}
Tone: ${context.tone || 'contemplative'}

Output Format: JSON
{
  "title": "Clear spiritual title",
  "theme": "Core spiritual lesson",
  "summary": "Concise summary",
  "storyBody": "Comprehensive narrative reflection (300-500 words)",
  "reflectionPoints": ["Key action point 1", "Key action point 2", "Key action point 3"],
  "suggestedVisualPrompts": [
    "Vivid landscape or cosmic visual prompt suitable for AI art generation without depicting humans or angels"
  ]
}
`;

  return { systemPrompt, userPrompt };
}
