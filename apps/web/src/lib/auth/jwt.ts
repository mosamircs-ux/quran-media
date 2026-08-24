export interface UserTokenPayload {
  userId: string;
  email: string;
  name: string;
  role: 'USER' | 'CREATOR' | 'ADMIN';
  locale: string;
  preferredReciter?: number;
  iat?: number;
  exp?: number;
}

const JWT_SECRET = process.env.AUTH_SECRET || process.env.JWT_SECRET || 'quran-media-secret-key-production-grade-2026';

// Base64URL encoding/decoding helpers
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf-8');
}

async function createHmacSignature(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(data));
  return Buffer.from(signature)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Signs a JWT token with HMAC-SHA256
 */
export async function signJWT(payload: UserTokenPayload, expiresInSeconds: number = 7 * 24 * 60 * 60): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: UserTokenPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const signature = await createHmacSignature(dataToSign, JWT_SECRET);
  return `${dataToSign}.${signature}`;
}

/**
 * Verifies a JWT token signature and expiration
 */
export async function verifyJWT(token: string): Promise<UserTokenPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) return null;

    const encodedHeader = parts[0];
    const encodedPayload = parts[1];
    const signature = parts[2];
    const dataToSign = `${encodedHeader}.${encodedPayload}`;

    const expectedSignature = await createHmacSignature(dataToSign, JWT_SECRET);
    if (signature !== expectedSignature) {
      return null;
    }

    const payload: UserTokenPayload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}
