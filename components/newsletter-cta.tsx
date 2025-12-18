"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";

interface NewsletterCTAProps {
  variant?: "inline" | "card" | "banner";
  title?: string;
  subtitle?: string;
  buttonText?: string;
  className?: string;
}

export function NewsletterCTA({
  variant = "card",
  title = "Stay Inspired",
  subtitle = "Get exclusive design insights, project reveals, and luxury interior trends delivered to your inbox.",
  buttonText = "Subscribe",
  className = "",
}: NewsletterCTAProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: `newsletter_cta_${variant}` }),
      });

      if (!response.ok) {
        throw new Error("Subscription failed");
      }

      setIsSuccess(true);
      setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Inline variant - simple horizontal form
  if (variant === "inline") {
    return (
      <div className={`${className}`}>
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-green-600"
          >
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium">Thanks for subscribing!</span>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-neutral-200 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-[#c9a962] focus:ring-2 focus:ring-[#c9a962]/20"
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-neutral-800 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {buttonText}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  // Banner variant - full-width with background
  if (variant === "banner") {
    return (
      <section className={`bg-neutral-950 py-12 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-light text-white md:text-2xl">{title}</h3>
              <p className="mt-1 text-sm text-neutral-400">{subtitle}</p>
            </div>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-green-400"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">You&apos;re subscribed!</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-[#c9a962] focus:ring-2 focus:ring-[#c9a962]/20"
                    disabled={isSubmitting}
                  />
                  {error && (
                    <p className="absolute -bottom-5 left-0 text-xs text-red-400">{error}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-lg bg-[#c9a962] px-6 py-3 text-sm font-medium text-black transition-all hover:bg-[#c4a030] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {buttonText}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Card variant (default) - standalone card with visuals
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 p-8 ${className}`}
    >
      {/* Decorative elements */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#c9a962]/10 blur-3xl" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-[#c9a962]/5 blur-3xl" />

      <div className="relative z-10">
        {/* Icon */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#c9a962]/10 px-3 py-1.5">
          <Sparkles className="h-4 w-4 text-[#c9a962]" />
          <span className="text-xs font-medium text-[#c9a962]">Exclusive Access</span>
        </div>

        {/* Content */}
        <h3 className="mb-2 text-2xl font-light text-white">{title}</h3>
        <p className="mb-6 text-sm text-neutral-400">{subtitle}</p>

        {/* Form or Success */}
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 rounded-lg bg-green-500/10 p-4"
          >
            <CheckCircle2 className="h-6 w-6 text-green-400" />
            <div>
              <p className="font-medium text-white">Welcome to the club!</p>
              <p className="text-sm text-neutral-400">Check your inbox for a welcome gift.</p>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800/50 py-3.5 pl-12 pr-4 text-white placeholder-neutral-500 outline-none transition-colors focus:border-[#c9a962] focus:ring-2 focus:ring-[#c9a962]/20"
                disabled={isSubmitting}
              />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#c9a962] py-3.5 font-medium text-black transition-all hover:bg-[#c4a030] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Subscribing...
                </>
              ) : (
                <>
                  {buttonText}
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Trust text */}
        <p className="mt-4 text-center text-xs text-neutral-500">
          Join 2,000+ design enthusiasts. Unsubscribe anytime.
        </p>
      </div>
    </motion.div>
  );
}

export default NewsletterCTA;
