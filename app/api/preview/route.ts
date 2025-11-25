/**
 * Preview Mode API Route
 *
 * Enables preview mode for viewing draft content from Sanity
 * Usage: /api/preview?secret=YOUR_SECRET&slug=/projects/project-slug
 */

import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  // Check the secret to protect this API route
  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  // Check if slug is provided
  if (!slug) {
    return new Response('Missing slug parameter', { status: 400 });
  }

  // Enable Draft Mode
  const draft = await draftMode();
  draft.enable();

  // Redirect to the path from the slug
  redirect(slug);
}
