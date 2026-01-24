"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  FileText,
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Lock,
  Eye,
} from "lucide-react";
import Image from "next/image";

interface GatedDownloadProps {
  title: string;
  description: string;
  downloadUrl: string;
  thumbnailUrl?: string;
  fileType?: string;
  fileSize?: string;
  variant?: "card" | "inline" | "modal";
  className?: string;
}

export function GatedDownload({
  title,
  description,
  downloadUrl,
  thumbnailUrl,
  fileType = "PDF",
  fileSize,
  variant = "card",
  className = "",
}: GatedDownloadProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to newsletter/leads
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "gated_download",
          downloadedFile: title,
        }),
      });

      setIsUnlocked(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Inline variant - simple horizontal form
  if (variant === "inline") {
    return (
      <div
        className={`rounded-xl border border-neutral-200 bg-white p-4 ${className}`}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#8f7852]/10">
            <FileText className="h-6 w-6 text-[#8f7852]" />
          </div>

          <div className="flex-1">
            <h4 className="font-medium text-neutral-900">{title}</h4>
            <p className="text-sm text-neutral-500">
              {fileType} {fileSize && `• ${fileSize}`}
            </p>
          </div>

          {isUnlocked ? (
            <a
              href={downloadUrl}
              download
              className="flex items-center gap-2 border border-neutral-950 bg-neutral-950 px-4 py-2 font-Satoshi text-xs font-medium uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-neutral-950"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email to unlock"
                className="w-48 rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#8f7852]"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1 rounded-lg bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Lock className="h-3 w-3" />
                    Unlock
                  </>
                )}
              </button>
            </form>
          )}
        </div>
        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  // Card variant (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`overflow-hidden rounded-2xl bg-white shadow-lg ${className}`}
    >
      {/* Thumbnail */}
      {thumbnailUrl && (
        <div className="relative aspect-[16/9] bg-neutral-100">
          <Image src={thumbnailUrl} alt={title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* File badge */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-neutral-900">
              {fileType}
            </span>
            {fileSize && (
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs text-neutral-600">
                {fileSize}
              </span>
            )}
          </div>

          {/* Lock overlay */}
          {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90">
                <Lock className="h-8 w-8 text-neutral-900" />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        {/* Content */}
        <h3 className="mb-2 text-xl font-medium text-neutral-900">{title}</h3>
        <p className="mb-6 text-neutral-600">{description}</p>

        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-3"
            >
              <div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email to download"
                    className="w-full rounded-lg border border-neutral-200 py-3 pl-12 pr-4 outline-none transition-colors focus:border-[#8f7852] focus:ring-2 focus:ring-[#8f7852]/20"
                    disabled={isSubmitting}
                  />
                </div>
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 py-3 font-medium text-white transition-all hover:bg-neutral-800 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Unlocking...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Unlock Free Download
                  </>
                )}
              </button>

              <p className="text-center text-xs text-neutral-400">
                We&apos;ll also send you design tips. Unsubscribe anytime.
              </p>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 rounded-lg bg-green-50 p-4">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Unlocked!</p>
                  <p className="text-sm text-green-700">
                    Your download is ready.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href={downloadUrl}
                  download
                  className="flex flex-1 items-center justify-center gap-2 border border-neutral-950 bg-neutral-950 py-3 font-Satoshi text-xs font-medium uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-neutral-950"
                >
                  <Download className="h-5 w-5" />
                  Download Now
                </a>
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-neutral-950 bg-transparent px-4 py-3 font-Satoshi text-xs font-medium uppercase tracking-wider text-neutral-950 transition-all hover:bg-neutral-950 hover:text-white"
                >
                  <Eye className="h-5 w-5" />
                  Preview
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/**
 * Lookbook Download Section
 *
 * Pre-configured for MIDC design lookbooks
 */
export function LookbookDownload({ className = "" }: { className?: string }) {
  return (
    <GatedDownload
      title="2025 Luxury Interior Trends Guide"
      description="Discover the latest trends in luxury interior design for Dubai villas, penthouses, and hospitality projects. 48 pages of inspiration from our award-winning portfolio."
      downloadUrl="/downloads/midc-2025-design-trends.pdf"
      thumbnailUrl="/founder/CID_2106_00_COVER.jpg"
      fileType="PDF"
      fileSize="12 MB"
      className={className}
    />
  );
}

export default GatedDownload;
