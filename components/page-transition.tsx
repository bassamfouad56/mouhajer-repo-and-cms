'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export function PageTransition() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950"
        >
          {/* Animated Logo */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <span className="mb-2 text-3xl font-light tracking-[0.3em] text-white lg:text-4xl">
                MOUHAJER
              </span>
              <span className="text-xs font-light tracking-[0.3em] text-neutral-400">
                INTERNATIONAL DESIGN
              </span>
            </motion.div>

            {/* Loading Bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="mt-8 h-px bg-gradient-to-r from-transparent via-white to-transparent"
            />
          </div>

          {/* Background Animation */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2, opacity: 0.1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute h-96 w-96 rounded-full bg-white blur-3xl"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
