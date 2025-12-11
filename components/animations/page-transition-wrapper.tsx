'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { easings, durations } from '@/lib/animations';

interface PageTransitionWrapperProps {
  children: ReactNode;
}

/**
 * PageTransitionWrapper - Subtle page transitions
 * 
 * Features:
 * - Simple fade transition between pages
 * - Smooth and elegant
 * - No flashy effects
 */
export function PageTransitionWrapper({ children }: PageTransitionWrapperProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          transition: {
            duration: durations.slow,
            ease: easings.smooth,
          },
        }}
        exit={{ 
          opacity: 0,
          transition: {
            duration: durations.fast,
            ease: easings.precise,
          },
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * SlidePageTransition - Page transition with subtle slide
 */
export function SlidePageTransition({ children }: PageTransitionWrapperProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1,
          y: 0,
          transition: {
            duration: durations.slow,
            ease: easings.luxury,
          },
        }}
        exit={{ 
          opacity: 0,
          y: -10,
          transition: {
            duration: durations.fast,
            ease: easings.precise,
          },
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * FadeInSection - Fade in section when it enters viewport
 */
interface FadeInSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FadeInSection({ children, className, delay = 0 }: FadeInSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  // If user prefers reduced motion, render without animations
  if (prefersReducedMotion) {
    return <section className={className}>{children}</section>;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: durations.cinematic,
          ease: easings.luxury,
          delay,
        },
      }}
      viewport={{ once: true, margin: '-100px' }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/**
 * RevealOnScroll - Reveal content on scroll with clip-path
 */
interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function RevealOnScroll({
  children,
  className,
  direction = 'up',
}: RevealOnScrollProps) {
  const prefersReducedMotion = useReducedMotion();

  // If user prefers reduced motion, render without animations
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const clipPaths = {
    up: {
      initial: 'inset(100% 0 0 0)',
      animate: 'inset(0% 0 0 0)',
    },
    down: {
      initial: 'inset(0 0 100% 0)',
      animate: 'inset(0 0 0% 0)',
    },
    left: {
      initial: 'inset(0 100% 0 0)',
      animate: 'inset(0 0% 0 0)',
    },
    right: {
      initial: 'inset(0 0 0 100%)',
      animate: 'inset(0 0 0 0%)',
    },
  };

  return (
    <motion.div
      initial={{
        clipPath: clipPaths[direction].initial,
        opacity: 0,
      }}
      whileInView={{
        clipPath: clipPaths[direction].animate,
        opacity: 1,
        transition: {
          duration: durations.slow,
          ease: easings.luxury,
        },
      }}
      viewport={{ once: true, margin: '-50px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerContainer - Container that staggers children animations
 */
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
}: StaggerContainerProps) {
  const prefersReducedMotion = useReducedMotion();

  // If user prefers reduced motion, render without animations
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem - Item to be used inside StaggerContainer
 */
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: durations.slow,
            ease: easings.smooth,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default PageTransitionWrapper;
