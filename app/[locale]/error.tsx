'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, ArrowLeft } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to console in development
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-6">
      {/* Background pattern */}

      {/* Gradient orb */}
      <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c9a962]/5 blur-[150px]" />

      <div className="relative z-10 text-center">
        {/* Error badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#c9a962]/30 bg-[#c9a962]/10 px-4 py-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#c9a962]" />
          <span className="font-Satoshi text-xs uppercase tracking-wider text-[#c9a962]">
            Something went wrong
          </span>
        </div>

        {/* Title */}
        <h1 className="mb-4 font-SchnyderS text-4xl font-light text-white lg:text-6xl">
          Unexpected Error
        </h1>

        {/* Description */}
        <p className="mx-auto mb-8 max-w-md font-Satoshi text-lg font-light text-white/60">
          We apologize for the inconvenience. Please try refreshing the page or return to the homepage.
        </p>

        {/* Error details (only in development) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mx-auto mb-8 max-w-2xl rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-left">
            <p className="font-Satoshi text-sm text-red-400">
              <strong>Error:</strong> {error.message}
            </p>
            {error.digest && (
              <p className="mt-2 font-Satoshi text-xs text-red-400/60">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={reset}
            className="group inline-flex items-center gap-3 rounded-full border border-[#c9a962] bg-[#c9a962] px-8 py-4 font-Satoshi text-sm font-medium text-neutral-950 transition-all duration-300 hover:bg-[#e5c349]"
          >
            <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-180" />
            Try Again
          </button>

          <Link
            href="/"
            className="group inline-flex items-center gap-3 rounded-full border border-white/20 px-8 py-4 font-Satoshi text-sm font-light text-white transition-all duration-300 hover:border-white/40 hover:bg-white/5"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>

        {/* Back link */}
        <div className="mt-12">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 font-Satoshi text-sm text-white/40 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
