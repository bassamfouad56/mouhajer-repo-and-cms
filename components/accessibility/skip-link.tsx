"use client";

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-[#8f7852] focus:px-6 focus:py-3 focus:text-sm focus:font-medium focus:text-neutral-950 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#8f7852] focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}
