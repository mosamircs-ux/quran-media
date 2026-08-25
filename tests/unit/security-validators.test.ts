import { validateMagicBytes, generateSecureFilename } from '../../apps/web/src/lib/security/file-validator.js';
import { generateSignedMediaUrl, verifySignedMediaUrl } from '../../apps/web/src/lib/security/signed-url.js';
import { verifyWebhookSignature } from '../../apps/web/src/lib/security/webhook-verify.js';
import { checkRateLimit } from '../../apps/web/src/lib/security/rate-limiter.js';
import crypto from 'crypto';

export async function runSecurityValidatorsUnitTests(): Promise<{ passed: number; failed: number }> {
  console.log('🔒 [UNIT TEST] Security Validators & Cryptographic Guards...');
  let passed = 0;
  let failed = 0;

  function assert(cond: boolean, name: string) {
    if (cond) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name}`);
      failed++;
    }
  }

  // 1. Magic Bytes Validation
  const fakePng = Buffer.from('NOT_A_PNG_FILE');
  assert(!validateMagicBytes(fakePng).isValid, 'Rejects forged binary file');

  const realJpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
  assert(validateMagicBytes(realJpeg).isValid && validateMagicBytes(realJpeg).detectedMime === 'image/jpeg', 'Authenticates valid JPEG magic bytes');

  const realMp4 = Buffer.from([0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x6d, 0x70, 0x34, 0x32]);
  assert(validateMagicBytes(realMp4).isValid && validateMagicBytes(realMp4).detectedMime === 'video/mp4', 'Authenticates valid MP4 ftyp signature');

  // 2. Secure Filename Generator
  const secureName = generateSecureFilename('../../evil.php', 'video/mp4');
  assert(!secureName.includes('..') && secureName.endsWith('.mp4'), 'Generates random UUID filename and sanitizes extension');

  // 3. Signed URL HMAC
  const signed = generateSignedMediaUrl('/media/v1/private.mp4', 120);
  const params = new URLSearchParams(signed.split('?')[1]);
  assert(
    verifySignedMediaUrl('/media/v1/private.mp4', params.get('exp')!, params.get('sig')!),
    'Validates authentic HMAC signed URL'
  );
  assert(
    !verifySignedMediaUrl('/media/v1/private.mp4', params.get('exp')!, 'forged_sig'),
    'Rejects forged signature with timingSafeEqual'
  );

  // 4. Webhook HMAC
  const secret = 'ci-webhook-secret-99';
  const body = JSON.stringify({ type: 'payment.success', amount: 1000 });
  const sig = crypto.createHmac('sha256', secret).update(body).digest('hex');
  assert(
    verifyWebhookSignature({ rawBody: body, signatureHeader: sig, secret }),
    'Verifies authentic webhook HMAC-SHA256 signature'
  );

  // 5. Rate Limiter
  const ip = '10.0.0.99';
  for (let i = 0; i < 10; i++) {
    checkRateLimit(ip, 'auth');
  }
  const exceeded = checkRateLimit(ip, 'auth');
  assert(!exceeded.allowed, 'Enforces rate limit exhaustion after 10 requests');

  return { passed, failed };
}
