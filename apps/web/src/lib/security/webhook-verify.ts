import crypto from 'crypto';

/**
 * Verifies an incoming webhook payload using timing-safe HMAC-SHA256 comparison.
 * Protects against forgery, replay attacks, and timing attacks.
 */
export function verifyWebhookSignature({
  rawBody,
  signatureHeader,
  secret,
  toleranceSeconds = 300, // 5 minutes max clock drift
  timestampHeader,
}: {
  rawBody: string | Buffer;
  signatureHeader: string;
  secret: string;
  toleranceSeconds?: number;
  timestampHeader?: string;
}): boolean {
  if (!rawBody || !signatureHeader || !secret) {
    return false;
  }

  // 1. Timestamp validation (Replay attack protection)
  if (timestampHeader) {
    const timestamp = parseInt(timestampHeader, 10);
    const now = Math.floor(Date.now() / 1000);
    if (isNaN(timestamp) || Math.abs(now - timestamp) > toleranceSeconds) {
      return false;
    }
  }

  const payload = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf-8');
  const hmac = crypto.createHmac('sha256', secret);

  const signedContent = timestampHeader ? `${timestampHeader}.${payload}` : payload;
  hmac.update(signedContent);
  const expectedSignature = hmac.digest('hex');

  // Strip prefix like "sha256=" if present
  const cleanSignature = signatureHeader.replace(/^sha256=/, '');

  const sigBuffer = Buffer.from(cleanSignature, 'utf-8');
  const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');

  if (sigBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
}
