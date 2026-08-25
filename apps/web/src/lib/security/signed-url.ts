import crypto from 'crypto';

const SIGNING_SECRET = process.env.JWT_SECRET || 'quran-media-secure-signed-url-secret-2026';

/**
 * Generates an HMAC-SHA256 Signed URL for private media delivery
 */
export function generateSignedMediaUrl(
  pathOrKey: string,
  expiresInSeconds = 3600 // 1 hour default
): string {
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const payload = `${pathOrKey}:${expiresAt}`;

  const hmac = crypto.createHmac('sha256', SIGNING_SECRET);
  hmac.update(payload);
  const signature = hmac.digest('hex');

  const separator = pathOrKey.includes('?') ? '&' : '?';
  return `${pathOrKey}${separator}exp=${expiresAt}&sig=${signature}`;
}

/**
 * Verifies a Signed URL using timing-safe comparison
 */
export function verifySignedMediaUrl(
  pathOrKey: string,
  expiresAt: string | number,
  signature: string
): boolean {
  const now = Math.floor(Date.now() / 1000);
  const expNum = typeof expiresAt === 'string' ? parseInt(expiresAt, 10) : expiresAt;

  // Check expiration
  if (isNaN(expNum) || now > expNum) {
    return false;
  }

  const cleanPath = pathOrKey.split('?')[0] || pathOrKey;
  const payload = `${cleanPath}:${expNum}`;

  const hmac = crypto.createHmac('sha256', SIGNING_SECRET);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');

  const sigBuffer = Buffer.from(signature, 'utf-8');
  const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');

  if (sigBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
}
