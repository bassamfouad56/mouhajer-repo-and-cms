import { NextRequest, NextResponse } from 'next/server';
import { getCorsHeaders } from './lib/cors';

// Simple in-memory token bucket per IP (edge runtime memory - resets on cold start)
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
// More lenient rate limit in development for hot reloading and multiple GraphQL queries
const RATE_LIMIT_MAX_REQUESTS = process.env.NODE_ENV === 'production' ? 60 : 500; // 500 requests/min in dev, 60 in prod
const ipRequestLog = new Map<string, { windowStart: number; count: number }>();

export function middleware(request: NextRequest) {
  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    // Basic rate limiting
    const ip =
      request.ip ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown';
    const now = Date.now();
    const entry = ipRequestLog.get(ip);
    if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
      ipRequestLog.set(ip, { windowStart: now, count: 1 });
    } else {
      entry.count += 1;
      if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
        return new NextResponse(JSON.stringify({ error: 'Too Many Requests' }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        });
      }
    }

    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      const origin = request.headers.get('origin');
      return new NextResponse(null, {
        status: 200,
        headers: {
          ...getCorsHeaders(origin),
          Vary: 'Origin',
        },
      });
    }

    // Clone the response and add CORS headers
    const origin = request.headers.get('origin');
    const cors = getCorsHeaders(origin);
    const response = NextResponse.next();
    Object.entries(cors).forEach(([key, value]) => response.headers.set(key, String(value)));
    response.headers.set('Vary', 'Origin');

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
