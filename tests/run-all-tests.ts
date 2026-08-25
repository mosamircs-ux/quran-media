import { runQuranServicesUnitTests } from './unit/quran-services.test.js';
import { runMediaServicesUnitTests } from './unit/media-services.test.js';
import { runStoryGeneratorUnitTests } from './unit/story-generator.test.js';
import { runSecurityValidatorsUnitTests } from './unit/security-validators.test.js';
import { runQuranApiIntegrationTests } from './integration/quran-api.test.js';
import { runDatabaseModelsIntegrationTests } from './integration/database-models.test.js';
import { runRedisCachingIntegrationTests } from './integration/redis-caching.test.js';
import { runMediaJobsQueueIntegrationTests } from './integration/media-jobs-queue.test.js';
import { runE2ETests } from './e2e/quran-media-e2e.test.js';

async function main() {
  console.log('===========================================================');
  console.log('🧪 QURAN MEDIA PLATFORM — COMPLETE AUTOMATED TEST RUNNER');
  console.log('===========================================================\n');

  let totalPassed = 0;
  let totalFailed = 0;

  const results: Array<{ suite: string; type: string; passed: number; failed: number }> = [];

  async function run(name: string, type: string, fn: () => Promise<{ passed: number; failed: number }>) {
    const res = await fn();
    totalPassed += res.passed;
    totalFailed += res.failed;
    results.push({ suite: name, type, passed: res.passed, failed: res.failed });
    console.log('');
  }

  // 1. Unit Tests
  await run('Quran Services', 'Unit', runQuranServicesUnitTests);
  await run('Media Services & FFmpeg', 'Unit', runMediaServicesUnitTests);
  await run('Story Generator & Guardrails', 'Unit', runStoryGeneratorUnitTests);
  await run('Security Validators & Crypto', 'Unit', runSecurityValidatorsUnitTests);

  // 2. Integration Tests
  await run('Quran API & Tafsir Layer', 'Integration', runQuranApiIntegrationTests);
  await run('Database Models & RBAC', 'Integration', runDatabaseModelsIntegrationTests);
  await run('Redis & Multi-Tier Caching', 'Integration', runRedisCachingIntegrationTests);
  await run('Media Jobs & Queue Resilience', 'Integration', runMediaJobsQueueIntegrationTests);

  // 3. E2E Tests
  await run('E2E User Flows & Security Scenarios', 'E2E', () => runE2ETests('http://localhost:3006'));

  console.log('===========================================================');
  console.log('📊 AUTOMATED TEST EXECUTION SUMMARY');
  console.log('===========================================================');
  console.table(results);

  console.log(`\nTOTAL PASSED: ${totalPassed}`);
  console.log(`TOTAL FAILED: ${totalFailed}`);

  if (totalFailed > 0) {
    console.error('\n❌ TEST SUITE FAILED — Fix all issues before production release.');
    process.exit(1);
  } else {
    console.log('\n✅ ALL AUTOMATED TESTS PASSED SUCCESSFULLY! Ready for Production.');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal error in test runner:', err);
  process.exit(1);
});
