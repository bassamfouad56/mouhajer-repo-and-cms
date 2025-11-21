import Link from 'next/link';
import { ArrowLeft, Building2 } from 'lucide-react';

export default function IndustryNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-6">
      <div className="text-center">
        <div className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full border-2 border-neutral-700 bg-neutral-900">
          <Building2 className="h-12 w-12 text-neutral-500" />
        </div>

        <h1 className="mb-4 text-5xl font-light tracking-tight text-white">
          Industry Not Found
        </h1>

        <p className="mb-12 text-lg font-light text-neutral-400">
          The industry you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/industries"
          className="group inline-flex items-center gap-3 border border-white px-8 py-4 text-sm font-light tracking-widest text-white transition-all hover:bg-white hover:text-neutral-950"
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          <span>BACK TO INDUSTRIES</span>
        </Link>
      </div>
    </div>
  );
}
