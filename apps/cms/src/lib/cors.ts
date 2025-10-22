/**
 * CORS Utility
 * Adds CORS headers to API responses to allow cross-origin requests
 */

import { NextResponse } from 'next/server';

// Allowed origins for CORS
const allowedOrigins = [
  'https://mouhajer-dh6ryndkm-bassam-fouads-projects.vercel.app', // Frontend production (old)
  'https://mahermouhajer.com', // Frontend production domain
  'https://www.mahermouhajer.com', // Frontend production domain (www)
  'https://mouhajer.ae', // Alternative production domain
  'https://www.mouhajer.ae', // Alternative production domain (www)
  'https://mouhajer.vercel.app', // Frontend Vercel domain
  'https://mouhajer-21cpftwv4-bassam-fouads-projects.vercel.app', // Current deployment
  'https://mouhajer-9fjr6p7hm-bassam-fouads-projects.vercel.app', // Current CMS deployment
  'http://localhost:3000', // Local development
  'http://localhost:3001', // Alternative local port
  'http://localhost:3007', // Frontend local development
];

// Get CORS headers based on origin
export function getCorsHeaders(origin?: string | null) {
  const isAllowedOrigin = origin && allowedOrigins.includes(origin);

  return {
    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// Default CORS headers (allows all for backward compatibility, but use getCorsHeaders for security)
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

export function withCors(response: NextResponse): NextResponse {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export function corsResponse(data: any, options?: ResponseInit): NextResponse {
  const response = NextResponse.json(data, options);
  return withCors(response);
}
