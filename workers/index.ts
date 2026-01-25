/**
 * Worker Entrypoint
 *
 * Main entry point for the background worker process.
 * Starts all job handlers and cron jobs.
 *
 * Run with: npm run worker
 */

import { getBoss, stopBoss, JobTypes } from '../src/lib/jobs';
import { startTestRunnerWorker } from './test-runner';
import { startReportGeneratorWorker } from './report-generator';
import { setupCronJobs } from './cron';

async function main() {
  console.log('🚀 Starting PlebTest workers...');
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);

  try {
    // Initialize pg-boss
    const boss = await getBoss();
    console.log('✅ pg-boss connected');

    // Start all workers in parallel
    await Promise.all([
      startTestRunnerWorker(),
      startReportGeneratorWorker(),
      setupCronJobs(),
    ]);

    console.log('✅ All workers started successfully');
    console.log('');
    console.log('📋 Active job handlers:');
    console.log(`   - ${JobTypes.RUN_TEST}`);
    console.log(`   - ${JobTypes.GENERATE_PERSONAS}`);
    console.log(`   - ${JobTypes.RUN_SESSION}`);
    console.log(`   - ${JobTypes.GENERATE_REPORT}`);
    console.log(`   - ${JobTypes.CHECK_SESSION_TIMEOUT} (cron)`);
    console.log('');
    console.log('👀 Waiting for jobs...');

    // Handle graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n📤 Received ${signal}, shutting down gracefully...`);
      await stopBoss();
      process.exit(0);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Keep the process alive
    await new Promise(() => {});
  } catch (error) {
    console.error('❌ Worker startup failed:', error);
    process.exit(1);
  }
}

main();
