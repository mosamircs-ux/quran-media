/**
 * Prompt Guard & AI Input Sanitizer
 * Protects against Prompt Injections, System Role Overrides, and Jailbreaks.
 */

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+(instructions|prompts|rules)/i,
  /disregard\s+(all\s+)?(previous|prior)\s+(instructions|prompts)/i,
  /you\s+are\s+now\s+(an?\s+)?(unrestricted|evil|dan|jailbroken)/i,
  /system\s*:\s*override/i,
  /bypass\s+(safety|content)\s+filters/i,
  /<\|im_start\|>/i,
  /<\|im_end\|>/i,
  /\[INST\]/i,
  /\[\/INST\]/i,
  /<\/?system>/i,
  /<\/?prompt>/i,
  /```(system|admin|root)/i,
];

export interface PromptSanitizationResult {
  sanitized: string;
  isFlagged: boolean;
  flagReason?: string;
}

/**
 * Sanitizes user input before embedding into AI prompts.
 */
export function sanitizeUserPrompt(rawInput: string, maxLen = 1000): PromptSanitizationResult {
  if (!rawInput || typeof rawInput !== 'string') {
    return { sanitized: '', isFlagged: false };
  }

  // 1. Truncate to maximum allowed length to prevent token exhaustion DoS
  let text = rawInput.trim().slice(0, maxLen);

  // 2. Check for known jailbreak / prompt injection markers
  let isFlagged = false;
  let flagReason: string | undefined;

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      isFlagged = true;
      flagReason = `Matched prompt injection pattern: ${pattern.source}`;
      // Neutralize the injection pattern
      text = text.replace(pattern, '[FILTERED_INPUT]');
    }
  }

  // 3. Strip special AI delimiter tokens
  text = text
    .replace(/<\|[a-z0-9_]+\|>/gi, '')
    .replace(/```[a-z0-9_-]*/gi, '```')
    .replace(/<\/?[a-z][a-z0-9]*[^<>]*>/gi, ''); // Strip raw HTML/XML tags

  return {
    sanitized: text,
    isFlagged,
    flagReason,
  };
}

/**
 * Builds a secure prompt with isolated user input tags
 */
export function wrapSecurePrompt(
  systemDirectives: string,
  userVariables: Record<string, string>
): string {
  let prompt = `${systemDirectives}\n\n`;

  for (const [key, value] of Object.entries(userVariables)) {
    const { sanitized } = sanitizeUserPrompt(value);
    prompt += `<user_data name="${key}">\n${sanitized}\n</user_data>\n`;
  }

  return prompt;
}
