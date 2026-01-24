"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Accelerate towards the end
        const increment = prev < 70 ? 3 : prev < 90 ? 2 : 1;
        return Math.min(prev + increment, 100);
      });
    }, 30);

    // Handle actual page load
    const handleLoad = () => {
      setProgress(100);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  // Prevent scroll during loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-neutral-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Background pattern */}

          {/* Ambient glow */}
          <motion.div
            className="absolute h-[400px] w-[400px] rounded-full bg-[#8f7852]/[0.05] blur-[150px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 mb-12"
          >
            {/* MIDC Logo Text */}
            <motion.div
              className="font-SchnyderS text-5xl font-light tracking-wider text-white sm:text-6xl lg:text-7xl"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              MIDC
            </motion.div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-2 h-px w-full origin-left bg-gradient-to-r from-[#8f7852] via-[#8f7852]/50 to-transparent"
            />
          </motion.div>

          {/* Loading text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative z-10 mb-8"
          >
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-white/40">
              Crafting Excellence
            </span>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 200 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="relative z-10 h-px w-[200px] overflow-hidden bg-white/10 sm:w-[300px]"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-[#8f7852] to-[#8f7852]/70"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </motion.div>

          {/* Progress percentage */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="relative z-10 mt-4"
          >
            <span className="font-Satoshi text-sm font-light tabular-nums text-white/50">
              {progress}%
            </span>
          </motion.div>

          {/* Corner decorations */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="absolute left-8 top-8 h-16 w-16 border-l border-t border-white/10" />
            <div className="absolute bottom-8 right-8 h-16 w-16 border-b border-r border-white/10" />
          </motion.div>

          {/* Animated lines */}
          <motion.div
            className="absolute left-[20%] top-1/2 h-px w-20 bg-gradient-to-r from-transparent via-[#8f7852]/20 to-transparent"
            animate={{ x: [0, 100, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[20%] top-1/3 h-20 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"
            animate={{ y: [0, 50, 0], opacity: [0, 1, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
