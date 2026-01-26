/**
 * Worker Entrypoint
 *
 * Main entry point for the background worker process.
 * Starts all job handlers, cron jobs, and health check server.
 *
 * Run with: npm run worker
 */

import { getBoss, stopBoss, JobTypes } from '../src/lib/jobs';
import { startTestRunnerWorker } from './test-runner';
import { startReportGeneratorWorker } from './report-generator';
import { setupCronJobs } from './cron';
import {
  startHealthServer,
  stopHealthServer,
  registerBoss,
  setShuttingDown,
} from './health';
import type { PgBoss } from 'pg-boss';
import type { Server } from 'http';

// References for graceful shutdown
let healthServer: Server | null = null;
let bossInstance: PgBoss | null = null;

async function main() {
  console.log('🚀 Starting PlebTest workers...');
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);

  try {
    // Start health check server FIRST (so Railway can see us quickly)
    healthServer = await startHealthServer();

    // Initialize pg-boss
    bossInstance = await getBoss();
    console.log('✅ pg-boss connected');

    // Register boss instance with health checker
    registerBoss(bossInstance);

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

    // Keep the process alive
    await new Promise(() => {});
  } catch (error) {
    console.error('❌ Worker startup failed:', error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown handler.
 * Railway sends SIGTERM before stopping containers.
 */
async function shutdown(signal: string) {
  console.log(`\n📤 Received ${signal}, shutting down gracefully...`);

  // Signal health check that we're shutting down
  setShuttingDown();

  try {
    // Stop accepting new jobs and wait for current jobs to complete
    await stopBoss();
    console.log('[Shutdown] pg-boss stopped');

    // Stop health server
    if (healthServer) {
      await stopHealthServer(healthServer);
    }

    console.log('[Shutdown] Complete');
    process.exit(0);
  } catch (error) {
    console.error('[Shutdown] Error:', error);
    process.exit(1);
  }
}

// Handle shutdown signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('[Worker] Uncaught exception:', error);
  shutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Worker] Unhandled rejection at:', promise, 'reason:', reason);
  // Don't exit on unhandled rejection, just log it
});

// Start the worker
main();
