"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

/**
 * Back to Top Button
 *
 * A floating button that appears when user scrolls down
 * Smooth scroll back to top with elegant animation
 */

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 400px
      setIsVisible(window.scrollY > 400);

      // Calculate scroll progress
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 left-6 z-40 group"
        >
          {/* Progress ring */}
          <svg
            className="absolute inset-0 -rotate-90 h-12 w-12"
            viewBox="0 0 48 48"
          >
            {/* Background circle */}
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
            {/* Progress circle */}
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="#c9a962"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={125.6}
              strokeDashoffset={125.6 - (scrollProgress / 100) * 125.6}
              className="transition-all duration-150"
            />
          </svg>

          {/* Button */}
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950 shadow-lg transition-all group-hover:bg-neutral-900 group-hover:shadow-xl group-focus-visible:ring-2 group-focus-visible:ring-white group-focus-visible:ring-offset-2">
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowUp className="h-5 w-5 text-white" strokeWidth={1.5} />
            </motion.div>
          </div>

          {/* Tooltip */}
          <span className="absolute left-full ml-3 whitespace-nowrap rounded-lg bg-neutral-950 px-3 py-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
            Back to top
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default BackToTop;
