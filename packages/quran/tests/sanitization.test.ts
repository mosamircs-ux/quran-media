import { describe, it, expect } from 'vitest';
import { sanitizeHtml } from '../src/validation/sanitization.js';

describe('Tafsir HTML Sanitization', () => {
  it('should strip script tags and event handler attributes', () => {
    const dirty = `<p>Tafsir text</p><script>alert('xss')</script><button onclick="malicious()">Click</button>`;
    const clean = sanitizeHtml(dirty);

    expect(clean).not.toContain('<script>');
    expect(clean).not.toContain('alert');
    expect(clean).not.toContain('onclick');
    expect(clean).toContain('<p>Tafsir text</p>');
  });

  it('should strip iframes and javascript: URLs', () => {
    const dirty = `<iframe src="https://evil.com"></iframe><a href="javascript:alert(1)">Link</a>`;
    const clean = sanitizeHtml(dirty);

    expect(clean).not.toContain('<iframe');
    expect(clean).not.toContain('javascript:');
  });

  it('should preserve safe semantic typography tags (b, strong, p, span, br, em)', () => {
    const safeHtml = `<p class="tafsir-body"><strong>Verse reflection:</strong> <em>Peace</em> and <span>blessings</span>.<br></p>`;
    const clean = sanitizeHtml(safeHtml);

    expect(clean).toContain('<p class="tafsir-body">');
    expect(clean).toContain('<strong>Verse reflection:</strong>');
    expect(clean).toContain('<em>Peace</em>');
    expect(clean).toContain('<span>blessings</span>');
    expect(clean).toContain('<br>');
  });
});
