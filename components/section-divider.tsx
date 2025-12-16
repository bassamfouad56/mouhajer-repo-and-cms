'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

type DividerVariant = 'line' | 'diamond' | 'gradient' | 'dots' | 'minimal';
type DividerTheme = 'dark' | 'light';

interface SectionDividerProps {
  variant?: DividerVariant;
  theme?: DividerTheme;
  className?: string;
}

// Elegant gradient line divider
function GradientLineDivider({ theme, isInView }: { theme: DividerTheme; isInView: boolean }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="h-px w-24 origin-right bg-gradient-to-l from-[#d4af37]/60 to-transparent sm:w-32"
      />
      <motion.div
        initial={{ scale: 0, rotate: 0 }}
        animate={isInView ? { scale: 1, rotate: 45 } : {}}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="h-2 w-2 border border-[#d4af37]/60"
      />
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="h-px w-24 origin-left bg-gradient-to-r from-[#d4af37]/60 to-transparent sm:w-32"
      />
    </div>
  );
}

// Diamond accent divider
function DiamondDivider({ theme, isInView }: { theme: DividerTheme; isInView: boolean }) {
  const lineColor = theme === 'dark' ? 'bg-white/10' : 'bg-neutral-950/10';

  return (
    <div className="flex items-center justify-center">
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: 60 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`h-px ${lineColor}`}
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mx-3"
      >
        <div className="h-1.5 w-1.5 rotate-45 bg-[#d4af37]/50" />
      </motion.div>
      <motion.div
        initial={{ scale: 0, rotate: 0 }}
        animate={isInView ? { scale: 1, rotate: 45 } : {}}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="h-4 w-4 border border-[#d4af37]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-1.5 w-1.5 bg-[#d4af37]" />
        </div>
      </motion.div>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mx-3"
      >
        <div className="h-1.5 w-1.5 rotate-45 bg-[#d4af37]/50" />
      </motion.div>
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: 60 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`h-px ${lineColor}`}
      />
    </div>
  );
}

// Subtle gradient overlay divider
function GradientOverlayDivider({ theme, isInView }: { theme: DividerTheme; isInView: boolean }) {
  return (
    <div className="relative h-16 w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-[#d4af37]/5 to-transparent"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={isInView ? { width: '100%', opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-px max-w-md bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent"
        />
      </div>
    </div>
  );
}

// Dots divider
function DotsDivider({ theme, isInView }: { theme: DividerTheme; isInView: boolean }) {
  return (
    <div className="flex items-center justify-center gap-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
          className={`h-1.5 w-1.5 rounded-full ${i === 1 ? 'bg-[#d4af37]' : 'bg-[#d4af37]/40'}`}
        />
      ))}
    </div>
  );
}

// Minimal line divider
function MinimalDivider({ theme, isInView }: { theme: DividerTheme; isInView: boolean }) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto h-px w-16 bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent"
    />
  );
}

export function SectionDivider({
  variant = 'line',
  theme = 'dark',
  className = '',
}: SectionDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  const bgColor = theme === 'dark' ? 'bg-neutral-950' : 'bg-white';

  const renderDivider = () => {
    switch (variant) {
      case 'line':
        return <GradientLineDivider theme={theme} isInView={isInView} />;
      case 'diamond':
        return <DiamondDivider theme={theme} isInView={isInView} />;
      case 'gradient':
        return <GradientOverlayDivider theme={theme} isInView={isInView} />;
      case 'dots':
        return <DotsDivider theme={theme} isInView={isInView} />;
      case 'minimal':
        return <MinimalDivider theme={theme} isInView={isInView} />;
      default:
        return <GradientLineDivider theme={theme} isInView={isInView} />;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative py-8 sm:py-10 ${bgColor} ${className}`}
    >
      {renderDivider()}
    </div>
  );
}

// Simple animated divider (lightweight alternative)
interface SimpleAnimatedDividerProps {
  theme?: DividerTheme;
  className?: string;
}

export function SimpleAnimatedDivider({
  theme = 'dark',
  className = '',
}: SimpleAnimatedDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  const lineColor = theme === 'dark' ? 'bg-white/20' : 'bg-neutral-950/20';
  const bgColor = theme === 'dark' ? 'bg-neutral-950' : 'bg-white';

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center py-10 ${bgColor} ${className}`}
    >
      {/* Left Line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`h-px w-16 origin-right ${lineColor}`}
      />

      {/* Center Diamond */}
      <motion.div
        initial={{ scale: 0, rotate: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, rotate: 45, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="mx-4 h-2.5 w-2.5 border border-[#d4af37]"
      />

      {/* Right Line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`h-px w-16 origin-left ${lineColor}`}
      />
    </div>
  );
}

// Luxurious section transition
interface LuxuryTransitionProps {
  theme?: DividerTheme;
  className?: string;
}

export function LuxuryTransition({
  theme = 'dark',
  className = '',
}: LuxuryTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  const bgColor = theme === 'dark' ? 'bg-neutral-950' : 'bg-white';
  const lineColor = theme === 'dark' ? 'bg-white/10' : 'bg-neutral-950/10';

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden py-12 sm:py-14 ${bgColor} ${className}`}
    >
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(to right, #d4af37 1px, transparent 1px), linear-gradient(to bottom, #d4af37 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Animated ornament */}
      <div className="relative flex items-center justify-center">
        {/* Extended left line */}
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: 100 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className={`h-px ${lineColor}`}
        />

        {/* Left accent */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mx-2"
        >
          <div className="h-1 w-1 rotate-45 bg-[#d4af37]/50" />
        </motion.div>

        {/* Center diamond frame */}
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={isInView ? { scale: 1, rotate: 45 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-2"
        >
          <div className="h-5 w-5 border border-[#d4af37]/70" />
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="h-2 w-2 bg-[#d4af37]" />
          </motion.div>
        </motion.div>

        {/* Right accent */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mx-2"
        >
          <div className="h-1 w-1 rotate-45 bg-[#d4af37]/50" />
        </motion.div>

        {/* Extended right line */}
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: 100 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className={`h-px ${lineColor}`}
        />
      </div>
    </div>
  );
}
