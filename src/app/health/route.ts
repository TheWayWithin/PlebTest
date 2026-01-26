/**
 * Health Check Endpoint
 * Used by Railway to verify the app is running
 */

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
}
