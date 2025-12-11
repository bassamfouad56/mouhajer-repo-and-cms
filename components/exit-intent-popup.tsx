"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

interface ExitIntentPopupProps {
  delay?: number; // Delay before popup can show (ms)
  cooldownDays?: number; // Days before showing again after dismissal
}

const STORAGE_KEY = "midc_exit_popup_dismissed";
const LEAD_STORAGE_KEY = "midc_exit_popup_converted";

export function ExitIntentPopup({
  delay = 5000,
  cooldownDays = 7,
}: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [canShow, setCanShow] = useState(false);

  // Check if popup should be shown
  useEffect(() => {
    const checkCanShow = () => {
      // Don't show if already converted
      if (localStorage.getItem(LEAD_STORAGE_KEY)) {
        return false;
      }

      // Check dismissal cooldown
      const dismissedAt = localStorage.getItem(STORAGE_KEY);
      if (dismissedAt) {
        const dismissedDate = new Date(parseInt(dismissedAt));
        const cooldownEnd = new Date(dismissedDate);
        cooldownEnd.setDate(cooldownEnd.getDate() + cooldownDays);

        if (new Date() < cooldownEnd) {
          return false;
        }
      }

      return true;
    };

    // Delay before enabling exit intent detection
    const timer = setTimeout(() => {
      if (checkCanShow()) {
        setCanShow(true);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, cooldownDays]);

  // Exit intent detection
  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      // Only trigger when mouse leaves through top of viewport
      if (e.clientY <= 0 && canShow && !isVisible) {
        setIsVisible(true);
      }
    },
    [canShow, isVisible]
  );

  useEffect(() => {
    if (canShow) {
      document.addEventListener("mouseleave", handleMouseLeave);
      return () => document.removeEventListener("mouseleave", handleMouseLeave);
    }
  }, [canShow, handleMouseLeave]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

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
        body: JSON.stringify({
          email,
          source: "exit_intent_popup",
          interest: "design_consultation",
        }),
      });

      if (!response.ok) {
        throw new Error("Subscription failed");
      }

      setIsSuccess(true);
      localStorage.setItem(LEAD_STORAGE_KEY, "true");

      // Auto-close after success
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed left-1/2 top-1/2 z-[101] w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 z-10 rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                aria-label="Close popup"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Gold accent */}
              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37]" />

              <div className="p-6 sm:p-8">
                {!isSuccess ? (
                  <>
                    {/* Icon */}
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#d4af37]/10">
                      <Gift className="h-8 w-8 text-[#d4af37]" />
                    </div>

                    {/* Heading */}
                    <h2 className="mb-2 text-center text-2xl font-light text-neutral-900 sm:text-3xl">
                      Wait! Before You Go...
                    </h2>

                    <p className="mb-6 text-center text-neutral-600">
                      Get a <span className="font-medium text-[#d4af37]">FREE Design Consultation</span> with
                      our award-winning team. Plus, receive exclusive access to our 2025 Luxury Interior Trends Guide.
                    </p>

                    {/* Benefits */}
                    <ul className="mb-6 space-y-2">
                      {[
                        "Personalized design recommendations",
                        "Budget planning assistance",
                        "Exclusive project portfolio access",
                      ].map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-neutral-600">
                          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#d4af37]" />
                          {benefit}
                        </li>
                      ))}
                    </ul>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
                          disabled={isSubmitting}
                        />
                        {error && (
                          <p className="mt-1 text-xs text-red-500">{error}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-neutral-800 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Claim My Free Consultation
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </form>

                    <p className="mt-4 text-center text-xs text-neutral-400">
                      No spam, ever. Unsubscribe anytime.
                    </p>
                  </>
                ) : (
                  /* Success State */
                  <div className="py-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="mb-2 text-xl font-light text-neutral-900">
                      You&apos;re In!
                    </h3>
                    <p className="text-neutral-600">
                      Check your inbox for your free consultation details and design guide.
                    </p>
                  </div>
                )}
              </div>

              {/* Trust indicators */}
              <div className="border-t border-neutral-100 bg-neutral-50 px-6 py-4">
                <div className="flex items-center justify-center gap-6 text-xs text-neutral-500">
                  <span>🏆 5-Star Award Winner</span>
                  <span>✓ 150+ Projects</span>
                  <span>✓ 20+ Years</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ExitIntentPopup;
