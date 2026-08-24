import crypto from 'node:crypto';

/**
 * Hashes a plain-text password using PBKDF2 with SHA-512 and a random salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const iterations = 100000;
  const keylen = 64;
  const digest = 'sha512';

  const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
  return `${salt}:${iterations}:${hash}`;
}

/**
 * Verifies a password against the stored hash format "salt:iterations:hash"
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const parts = storedHash.split(':');
    if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) return false;

    const salt = parts[0];
    const iterations = parseInt(parts[1], 10);
    const originalHash = parts[2];
    const keylen = 64;
    const digest = 'sha512';

    const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'));
  } catch {
    return false;
  }
}
