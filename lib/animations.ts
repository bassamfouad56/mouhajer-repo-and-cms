/**
 * Animation System for MIDC Website
 * Subtle, elegant animations - Awwwards quality
 */

// Easing functions - smooth and refined
export const easings = {
  // Smooth natural motion
  smooth: [0.22, 1, 0.36, 1],
  // Gentle entrance
  easeOut: [0.16, 1, 0.3, 1],
  // Refined bounce (very subtle)
  gentleBounce: [0.34, 1.56, 0.64, 1],
  // Luxurious slow reveal
  luxury: [0.19, 1, 0.22, 1],
  // Sharp and precise
  precise: [0.4, 0, 0.2, 1],
} as const;

// Duration presets
export const durations = {
  fast: 0.3,
  normal: 0.6,
  slow: 0.9,
  verySlow: 1.2,
  cinematic: 1.5,
} as const;

// Stagger delays
export const stagger = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.15,
  cinematic: 0.2,
} as const;

// Fade-up animation (most common)
export const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// Fade-in animation
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// Scale-in animation (subtle)
export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
};

// Slide-in from left
export const slideInLeft = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

// Slide-in from right
export const slideInRight = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

// Reveal animation (for sections)
export const reveal = {
  initial: { opacity: 0, y: 60 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: durations.cinematic,
      ease: easings.luxury,
    },
  },
};

// Container animation for staggered children
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: stagger.normal,
      delayChildren: 0.1,
    },
  },
};

// Page transition variants
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: durations.slow,
      ease: easings.smooth,
    },
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: durations.fast,
      ease: easings.precise,
    },
  },
};

// Text reveal animation
export const textReveal = {
  initial: { 
    opacity: 0, 
    y: 20,
    clipPath: 'inset(100% 0 0 0)',
  },
  animate: { 
    opacity: 1, 
    y: 0,
    clipPath: 'inset(0% 0 0 0)',
    transition: {
      duration: durations.slow,
      ease: easings.luxury,
    },
  },
};

// Line reveal animation (for decorative lines)
export const lineReveal = {
  initial: { scaleX: 0, originX: 0 },
  animate: { 
    scaleX: 1,
    transition: {
      duration: durations.normal,
      ease: easings.smooth,
    },
  },
};

// Image reveal animation
export const imageReveal = {
  initial: { 
    scale: 1.1, 
    opacity: 0,
  },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      duration: durations.cinematic,
      ease: easings.luxury,
    },
  },
};

// Hover scale animation (for cards/images)
export const hoverScale = {
  scale: 1.02,
  transition: {
    duration: durations.fast,
    ease: easings.smooth,
  },
};

// Hover lift animation (for cards)
export const hoverLift = {
  y: -4,
  transition: {
    duration: durations.fast,
    ease: easings.smooth,
  },
};

// Scroll-triggered animation config
export const scrollTriggerConfig = {
  once: true,
  margin: '-100px',
};

// Helper to create staggered children
export const createStaggeredChildren = (count: number, baseDelay = 0) => {
  return Array.from({ length: count }, (_, i) => ({
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: durations.slow,
        ease: easings.smooth,
        delay: baseDelay + i * stagger.normal,
      },
    },
  }));
};

// Helper for transition with custom delay
export const withDelay = (delay: number) => ({
  transition: {
    duration: durations.slow,
    ease: easings.smooth,
    delay,
  },
});

// Viewport animation options
export const viewportOptions = {
  once: true,
  amount: 0.2,
};

// Subtle parallax calculation
export const subtleParallax = (scrollProgress: number, intensity = 50) => {
  return scrollProgress * intensity - intensity / 2;
};

// ============================================
// REDUCED MOTION VARIANTS
// For users who prefer-reduced-motion
// ============================================

// Reduced motion: fade only (no movement)
export const reducedMotion = {
  fadeUp: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  scaleIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideInLeft: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideInRight: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  reveal: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: durations.fast,
      },
    },
  },
};

// Helper to get motion-safe animation variant
export const getMotionSafeVariant = (
  variant: typeof fadeUp | typeof fadeIn | typeof scaleIn | typeof slideInLeft | typeof slideInRight | typeof reveal,
  prefersReducedMotion: boolean
) => {
  if (!prefersReducedMotion) return variant;

  // Return simplified variant for reduced motion
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: durations.fast } },
    exit: { opacity: 0 },
  };
};

// Hook-friendly animation getter (use in components)
export const getAnimationVariants = (prefersReducedMotion: boolean) => ({
  fadeUp: prefersReducedMotion ? reducedMotion.fadeUp : fadeUp,
  fadeIn: prefersReducedMotion ? reducedMotion.fadeIn : fadeIn,
  scaleIn: prefersReducedMotion ? reducedMotion.scaleIn : scaleIn,
  slideInLeft: prefersReducedMotion ? reducedMotion.slideInLeft : slideInLeft,
  slideInRight: prefersReducedMotion ? reducedMotion.slideInRight : slideInRight,
  reveal: prefersReducedMotion ? reducedMotion.reveal : reveal,
});
