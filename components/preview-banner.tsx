/**
 * Preview Banner Component
 *
 * Displays a banner when viewing draft content in preview mode
 */

'use client';

export function PreviewBanner() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-yellow-500 px-4 py-3 text-center text-sm font-medium text-neutral-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <p>
          🔍 Preview Mode Active - Viewing draft content
        </p>
        <a
          href="/api/preview/disable"
          className="rounded bg-neutral-950 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-neutral-800"
        >
          Exit Preview
        </a>
      </div>
    </div>
  );
}
