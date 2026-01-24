"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      {/* Top progress bar */}
      <motion.div
        className="fixed left-0 right-0 top-0 z-[100] h-[2px] origin-left bg-gradient-to-r from-[#8f7852] via-[#8f7852] to-[#8f7852]/70"
        style={{ scaleX }}
      />

      {/* Glow effect */}
      <motion.div
        className="fixed left-0 right-0 top-0 z-[99] h-[4px] origin-left bg-[#8f7852]/30 blur-sm"
        style={{ scaleX }}
      />
    </>
  );
}
