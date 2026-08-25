import { DEFAULT_RESILIENT_JOB_OPTIONS } from '../../apps/worker/src/queues/queue-factory.js';

export async function runMediaJobsQueueIntegrationTests(): Promise<{ passed: number; failed: number }> {
  console.log('🔄 [INTEGRATION TEST] Media Jobs Queue & DLQ Resilience...');
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

  // 1. Resilient Job Options
  assert(DEFAULT_RESILIENT_JOB_OPTIONS.attempts === 3, 'Configures 3 retry attempts for video rendering jobs');
  assert(
    DEFAULT_RESILIENT_JOB_OPTIONS.backoff !== undefined &&
    typeof DEFAULT_RESILIENT_JOB_OPTIONS.backoff === 'object' &&
    DEFAULT_RESILIENT_JOB_OPTIONS.backoff.type === 'exponential',
    'Configures exponential backoff policy'
  );
  assert(
    DEFAULT_RESILIENT_JOB_OPTIONS.removeOnFail === false,
    'Preserves failed jobs for dead-letter analysis and manual retry'
  );

  return { passed, failed };
}
