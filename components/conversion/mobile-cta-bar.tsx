'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, Calendar, X } from 'lucide-react';
import Link from 'next/link';

const STORAGE_KEY = 'midc_mobile_cta_dismissed';

export function MobileCTABar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if on mobile and not dismissed
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      const dismissed = sessionStorage.getItem(STORAGE_KEY);

      if (isMobile && !dismissed) {
        // Show after a short delay
        setTimeout(() => setIsVisible(true), 2000);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem(STORAGE_KEY, 'true');
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-x-0 bottom-0 z-50 md:hidden"
        >
          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute -top-8 right-4 rounded-full bg-white p-1.5 shadow-md"
            aria-label="Dismiss mobile CTA bar"
          >
            <X size={14} className="text-neutral-500" />
          </button>

          <div className="border-t border-neutral-200 bg-white px-4 pb-safe pt-3 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {/* Call button */}
              <a
                href="tel:+971523041482"
                className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl bg-neutral-100 px-3 py-2.5 transition-colors active:bg-neutral-200"
                aria-label="Call us"
              >
                <Phone size={20} className="text-neutral-700" />
                <span className="font-Satoshi text-[10px] font-medium text-neutral-600">Call</span>
              </a>

              {/* WhatsApp button */}
              <a
                href="https://wa.me/971523041482?text=Hello!%20I'm%20interested%20in%20your%20design%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl bg-green-50 px-3 py-2.5 transition-colors active:bg-green-100"
                aria-label="Chat on WhatsApp"
              >
                <MessageCircle size={20} className="text-green-600" />
                <span className="font-Satoshi text-[10px] font-medium text-green-700">WhatsApp</span>
              </a>

              {/* Book consultation - Primary CTA */}
              <Link
                href="/en/contact/book-consultation"
                className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-[#c9a962] px-4 py-3 transition-colors active:bg-[#b8984f]"
              >
                <Calendar size={18} className="text-neutral-950" />
                <span className="font-Satoshi text-xs font-semibold text-neutral-950">Free Consultation</span>
              </Link>
            </div>

            {/* Trust indicator */}
            <p className="mt-2 text-center font-Satoshi text-[9px] text-neutral-400">
              ⭐ Rated 5/5 • 150+ Projects Completed
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
