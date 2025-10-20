import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

/**
 * Draft Mode API Route
 * Enables preview of draft content from the CMS
 *
 * Usage: /api/draft?secret=YOUR_SECRET&slug=page-slug&locale=en
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Check the secret and next parameters
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');
  const locale = searchParams.get('locale') || 'en';

  // Check the secret token
  const DRAFT_SECRET = process.env.DRAFT_SECRET_TOKEN || 'mouhajer-cms-draft-secret-2024';

  if (secret !== DRAFT_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  // Fetch the page to verify it exists (optional but recommended)
  // You can add validation logic here to check if the slug exists
  // in your database before enabling draft mode

  if (!slug) {
    return new Response('Slug is required', { status: 400 });
  }

  // Enable Draft Mode by setting the cookie
  const draft = await draftMode();
  draft.enable();

  // Redirect to the path from the fetched post
  // We redirect to the locale-specific URL
  redirect(`/${locale}/${slug}`);
}

/**
 * Disable Draft Mode
 */
export async function DELETE() {
  const draft = await draftMode();
  draft.disable();

  return new Response('Draft mode disabled', { status: 200 });
}
