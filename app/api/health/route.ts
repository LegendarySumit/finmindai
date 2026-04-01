import { adminDb } from '@/lib/firebaseAdmin';
import { log } from '@/lib/logger';
import { errorResponse, successResponse } from '@/lib/apiResponse';

/**
 * Health check endpoint for monitoring and Docker healthchecks
 * GET /api/health
 */
export async function GET() {
  try {
    const startTime = Date.now();
    
    // Check Firestore connectivity through Admin SDK (server-side, rules bypassed)
    await adminDb().collection('_health').limit(1).get();
    const firestoreDuration = Date.now() - startTime;
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        firestore: {
          status: 'healthy',
          responseTime: firestoreDuration,
        },
      },
    };

    log.info('Health check passed', {
      firestoreDuration,
    });

    return successResponse(health, {
      message: 'Service health is healthy',
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      }
    });
  } catch (error) {
    log.error('Health check failed', error);

    return errorResponse('HEALTH_CHECK_FAILED', error instanceof Error ? error.message : 'Unknown error', {
      status: 503,
      details: { status: 'unhealthy' },
    });
  }
}
