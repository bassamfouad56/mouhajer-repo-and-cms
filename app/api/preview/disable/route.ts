/**
 * Disable Preview Mode API Route
 *
 * Disables preview mode and returns to published content
 * Usage: /api/preview/disable
 */

import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET() {
  const draft = await draftMode();
  draft.disable();
  redirect('/');
}
