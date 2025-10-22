import { NextResponse } from 'next/server';

export async function GET() {
  // Security: Only allow in development environment
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    blobTokenPrefix: process.env.BLOB_READ_WRITE_TOKEN?.substring(0, 20) || 'not set',
    blobStoreUrl: process.env.NEXT_PUBLIC_BLOB_STORE_URL,
  });
}
