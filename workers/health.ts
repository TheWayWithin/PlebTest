/**
 * Worker Health Check Server
 *
 * Minimal HTTP server providing health check endpoint for Railway monitoring.
 * Verifies pg-boss connection status and supports graceful shutdown signaling.
 */

import { createServer, IncomingMessage, ServerResponse } from 'http';
import type { PgBoss } from 'pg-boss';

const HEALTH_PORT = parseInt(process.env.HEALTH_PORT || '8080', 10);

let bossInstance: PgBoss | null = null;
let isShuttingDown = false;

/**
 * Register the pg-boss instance for health checks.
 * Call this after pg-boss is started and connected.
 */
export function registerBoss(boss: PgBoss): void {
  bossInstance = boss;
}

/**
 * Signal that the worker is shutting down.
 * Health checks will return unhealthy during shutdown.
 */
export function setShuttingDown(): void {
  isShuttingDown = true;
}

/**
 * Health check response handler
 */
function handleHealthCheck(req: IncomingMessage, res: ServerResponse): void {
  // Only respond to GET /health
  if (req.method !== 'GET' || req.url !== '/health') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  const timestamp = new Date().toISOString();

  // Check if shutting down
  if (isShuttingDown) {
    res.writeHead(503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'shutting_down',
      boss: 'disconnecting',
      timestamp
    }));
    return;
  }

  // Check if boss is registered and appears connected
  // pg-boss doesn't expose a direct "isConnected" method,
  // but if we have an instance and haven't stopped, we're good
  const bossConnected = bossInstance !== null;

  if (bossConnected) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      boss: 'connected',
      timestamp
    }));
  } else {
    res.writeHead(503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'unhealthy',
      boss: 'not_connected',
      timestamp
    }));
  }
}

/**
 * Start the health check HTTP server.
 * Returns a promise that resolves when the server is listening.
 */
export function startHealthServer(): Promise<ReturnType<typeof createServer>> {
  return new Promise((resolve, reject) => {
    const server = createServer(handleHealthCheck);

    server.on('error', (err) => {
      console.error('[Health] Server error:', err);
      reject(err);
    });

    server.listen(HEALTH_PORT, () => {
      console.log(`✅ Health check server listening on port ${HEALTH_PORT}`);
      console.log(`   Endpoint: http://localhost:${HEALTH_PORT}/health`);
      resolve(server);
    });
  });
}

/**
 * Stop the health check server gracefully
 */
export function stopHealthServer(server: ReturnType<typeof createServer>): Promise<void> {
  return new Promise((resolve) => {
    server.close(() => {
      console.log('[Health] Health check server stopped');
      resolve();
    });
  });
}
