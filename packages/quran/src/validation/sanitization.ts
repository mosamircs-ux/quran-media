/**
 * Robust, lightweight, zero-dependency HTML sanitizer for Tafsir content.
 * Strips script tags, iframes, javascript: links, and event handler attributes
 * while preserving safe semantic formatting tags (b, i, em, strong, p, br, span, sup, sub, ul, li).
 */

const ALLOWED_TAGS = new Set([
  'b',
  'i',
  'em',
  'strong',
  'p',
  'br',
  'span',
  'sup',
  'sub',
  'ul',
  'ol',
  'li',
  'blockquote',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
]);

const ALLOWED_ATTRIBUTES = new Set(['class', 'dir', 'lang', 'title']);

export function sanitizeHtml(rawHtml: string): string {
  if (!rawHtml || typeof rawHtml !== 'string') {
    return '';
  }

  // 1. Remove dangerous blocks completely (scripts, styles, iframes, object, embed)
  let clean = rawHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  clean = clean.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  clean = clean.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');

  // 2. Strip event handlers (e.g. onclick, onload, onerror)
  clean = clean.replace(/\s*on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // 3. Strip javascript: and data: pseudo-protocols
  clean = clean.replace(/(?:href|src)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*'|javascript:[^\s>]+)/gi, '');

  // 4. Sanitize tags: keep allowed tags and strip forbidden ones
  clean = clean.replace(/<\/?([a-zA-Z0-9]+)([^>]*)>/g, (fullMatch, tagName, attributes) => {
    const lowerTag = tagName.toLowerCase();

    if (!ALLOWED_TAGS.has(lowerTag)) {
      return ''; // Strip tag completely
    }

    const isClosing = fullMatch.startsWith('</');
    if (isClosing) {
      return `</${lowerTag}>`;
    }

    // Filter attributes to only safe ones
    const safeAttrs: string[] = [];
    const attrRegex = /([a-zA-Z0-9-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
    let attrMatch: RegExpExecArray | null;

    while ((attrMatch = attrRegex.exec(attributes)) !== null) {
      const attrName = attrMatch[1]?.toLowerCase();
      const attrValue = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';

      if (attrName && ALLOWED_ATTRIBUTES.has(attrName)) {
        // Escape quotes in attribute value
        const escapedVal = attrValue.replace(/"/g, '&quot;');
        safeAttrs.push(`${attrName}="${escapedVal}"`);
      }
    }

    const attrString = safeAttrs.length > 0 ? ` ${safeAttrs.join(' ')}` : '';
    return `<${lowerTag}${attrString}>`;
  });

  return clean.trim();
}

/**
 * Normalizes and sanitizes Arabic Quranic text, stripping non-printable zero-width characters.
 */
export function sanitizeQuranicText(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
