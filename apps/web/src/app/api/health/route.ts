import { NextResponse } from 'next/server';
import { db } from '@quran-media/database';

export async function GET() {
  let dbStatus = 'disconnected';
  try {
    await db.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch {
    dbStatus = 'unreachable';
  }

  return NextResponse.json({
    status: dbStatus === 'connected' ? 'healthy' : 'degraded',
    version: '1.0.0',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
}
