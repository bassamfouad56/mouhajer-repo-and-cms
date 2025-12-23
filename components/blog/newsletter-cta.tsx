'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, Check, X } from 'lucide-react';

interface NewsletterCTAProps {
  category?: string;
  articleTitle?: string;
}

export default function NewsletterCTA({ category, articleTitle }: NewsletterCTAProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if already subscribed
  useEffect(() => {
    const subscribed = localStorage.getItem('newsletter-subscribed');
    const dismissed = sessionStorage.getItem('newsletter-dismissed');
    if (subscribed) setIsSubscribed(true);
    if (dismissed) setIsDismissed(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');

    try {
      // Simulate API call - replace with actual newsletter API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setStatus('success');
      localStorage.setItem('newsletter-subscribed', 'true');
      setIsSubscribed(true);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('newsletter-dismissed', 'true');
  };

  // Don't show if already subscribed or dismissed
  if (isSubscribed || isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative my-16 overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-950 to-neutral-900 p-8 lg:p-12"
      >
        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 rounded-full p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>

        {/* Decorative Elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#c9a962]/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#c9a962]/5 blur-3xl" />

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8 flex items-start gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#c9a962]/20">
              <Mail className="h-6 w-6 text-[#c9a962]" />
            </div>
            <div>
              <h3 className="mb-2 font-SchnyderS text-2xl font-light text-white lg:text-3xl">
                Stay Inspired
              </h3>
              <p className="font-Satoshi text-sm font-light leading-relaxed text-white/60">
                Get the latest insights on design, architecture, and luxury living delivered to your inbox.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={status === 'loading' || status === 'success'}
                className="w-full rounded-full border border-white/20 bg-white/5 px-6 py-4 font-Satoshi text-sm text-white placeholder:text-white/40 focus:border-[#c9a962] focus:outline-none focus:ring-1 focus:ring-[#c9a962] disabled:opacity-50"
              />
            </div>
            <motion.button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              whileHover={{ scale: status === 'idle' ? 1.02 : 1 }}
              whileTap={{ scale: status === 'idle' ? 0.98 : 1 }}
              className={`group flex items-center justify-center gap-2 rounded-full px-8 py-4 font-Satoshi text-sm font-medium uppercase tracking-wider transition-all ${
                status === 'success'
                  ? 'bg-green-500 text-white'
                  : status === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-[#c9a962] text-neutral-950 hover:bg-white'
              }`}
            >
              {status === 'loading' ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="h-4 w-4 rounded-full border-2 border-neutral-950 border-t-transparent"
                />
              ) : status === 'success' ? (
                <>
                  <Check size={16} />
                  <span>Subscribed!</span>
                </>
              ) : status === 'error' ? (
                <span>Try Again</span>
              ) : (
                <>
                  <span>Subscribe</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </motion.button>
          </form>

          {/* Privacy Note */}
          <p className="mt-4 font-Satoshi text-[11px] font-light text-white/30">
            No spam, ever. Unsubscribe at any time. Read our{' '}
            <a href="/privacy" className="underline hover:text-white/50">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
