'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MessageCircle, Calendar } from 'lucide-react';
import Link from 'next/link';

const STORAGE_KEY = 'midc_scroll_cta_dismissed';
const COOLDOWN_HOURS = 24;

export function ScrollTriggeredCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [hasScrolledEnough, setHasScrolledEnough] = useState(false);

  // Check dismissal state
  useEffect(() => {
    const dismissedAt = localStorage.getItem(STORAGE_KEY);
    if (dismissedAt) {
      const dismissedDate = new Date(parseInt(dismissedAt));
      const cooldownEnd = new Date(dismissedDate.getTime() + COOLDOWN_HOURS * 60 * 60 * 1000);
      if (new Date() < cooldownEnd) {
        setIsDismissed(true);
      }
    }
  }, []);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      // Show after 50% scroll
      if (scrollPercent >= 50 && !hasScrolledEnough) {
        setHasScrolledEnough(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolledEnough]);

  // Show CTA after scroll threshold and delay
  useEffect(() => {
    if (hasScrolledEnough && !isDismissed) {
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, [hasScrolledEnough, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)]"
        >
          <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl">
            {/* Gold accent */}
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#c9a962] via-[#f4d03f] to-[#c9a962]" />

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute right-3 top-3 rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>

            <div className="p-5">
              <h3 className="mb-2 pr-8 font-SchnyderS text-lg font-light text-neutral-900">
                Ready to Transform Your Space?
              </h3>
              <p className="mb-4 font-Satoshi text-sm font-light text-neutral-600">
                Connect with our design experts for a free consultation.
              </p>

              {/* Action buttons */}
              <div className="flex flex-col gap-2">
                <Link
                  href="/en/contact/book-consultation"
                  onClick={handleDismiss}
                  className="flex items-center justify-center gap-2 rounded-lg bg-neutral-950 px-4 py-2.5 font-Satoshi text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                >
                  <Calendar size={16} />
                  Book Free Consultation
                </Link>

                <div className="flex gap-2">
                  <a
                    href="tel:+971523041482"
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 font-Satoshi text-xs font-medium text-neutral-700 transition-colors hover:border-[#c9a962] hover:text-[#c9a962]"
                  >
                    <Phone size={14} />
                    Call
                  </a>
                  <a
                    href="https://wa.me/971523041482"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 font-Satoshi text-xs font-medium text-neutral-700 transition-colors hover:border-green-500 hover:text-green-600"
                  >
                    <MessageCircle size={14} />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Trust indicator */}
            <div className="border-t border-neutral-100 bg-neutral-50 px-5 py-2.5">
              <p className="text-center font-Satoshi text-[10px] text-neutral-500">
                ⭐ Trusted by 150+ clients across the UAE
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
