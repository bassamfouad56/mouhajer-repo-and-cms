'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

// Elegant geometric line animation - horizontal expansion
const lineRevealAnimation = {
  v: '5.7.4',
  fr: 60,
  ip: 0,
  op: 90,
  w: 400,
  h: 60,
  nm: 'Line Reveal',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Center Line',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [200, 30, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [0, 100, 100], e: [100, 100, 100] },
            { t: 60, s: [100, 100, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'rc',
          d: 1,
          s: { a: 0, k: [200, 1] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 0 },
          nm: 'Rectangle',
        },
        {
          ty: 'st',
          c: { a: 0, k: [0.831, 0.686, 0.216, 1] }, // Gold color
          o: { a: 0, k: 100 },
          w: { a: 0, k: 1 },
          lc: 2,
          lj: 1,
          ml: 4,
          nm: 'Stroke',
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: 'Left Diamond',
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 30, s: [0], e: [100] },
            { t: 50, s: [100] },
          ],
        },
        r: { a: 0, k: 45 },
        p: { a: 0, k: [90, 30, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 30, s: [0, 0, 100], e: [100, 100, 100] },
            { t: 60, s: [100, 100, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'rc',
          d: 1,
          s: { a: 0, k: [6, 6] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 0 },
          nm: 'Rectangle',
        },
        {
          ty: 'st',
          c: { a: 0, k: [0.831, 0.686, 0.216, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 1 },
          lc: 2,
          lj: 1,
          ml: 4,
          nm: 'Stroke',
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
    },
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: 'Right Diamond',
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 30, s: [0], e: [100] },
            { t: 50, s: [100] },
          ],
        },
        r: { a: 0, k: 45 },
        p: { a: 0, k: [310, 30, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 30, s: [0, 0, 100], e: [100, 100, 100] },
            { t: 60, s: [100, 100, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'rc',
          d: 1,
          s: { a: 0, k: [6, 6] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 0 },
          nm: 'Rectangle',
        },
        {
          ty: 'st',
          c: { a: 0, k: [0.831, 0.686, 0.216, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 1 },
          lc: 2,
          lj: 1,
          ml: 4,
          nm: 'Stroke',
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
    },
  ],
};

// Elegant diamond burst animation
const diamondBurstAnimation = {
  v: '5.7.4',
  fr: 60,
  ip: 0,
  op: 120,
  w: 200,
  h: 200,
  nm: 'Diamond Burst',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Center Diamond',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0], e: [45] },
            { t: 60, s: [45] },
          ],
        },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [0, 0, 100], e: [100, 100, 100] },
            { t: 40, s: [100, 100, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'rc',
          d: 1,
          s: { a: 0, k: [12, 12] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 0 },
          nm: 'Rectangle',
        },
        {
          ty: 'st',
          c: { a: 0, k: [0.831, 0.686, 0.216, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 1.5 },
          lc: 2,
          lj: 1,
          ml: 4,
          nm: 'Stroke',
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: 'Line Left',
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 30, s: [0], e: [100] },
            { t: 50, s: [100] },
          ],
        },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [55, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 30, s: [0, 100, 100], e: [100, 100, 100] },
            { t: 70, s: [100, 100, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'rc',
          d: 1,
          s: { a: 0, k: [40, 1] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 0 },
          nm: 'Rectangle',
        },
        {
          ty: 'st',
          c: { a: 0, k: [1, 1, 1, 0.3] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 1 },
          lc: 2,
          lj: 1,
          ml: 4,
          nm: 'Stroke',
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
    },
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: 'Line Right',
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 30, s: [0], e: [100] },
            { t: 50, s: [100] },
          ],
        },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [145, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 30, s: [0, 100, 100], e: [100, 100, 100] },
            { t: 70, s: [100, 100, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'rc',
          d: 1,
          s: { a: 0, k: [40, 1] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 0 },
          nm: 'Rectangle',
        },
        {
          ty: 'st',
          c: { a: 0, k: [1, 1, 1, 0.3] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 1 },
          lc: 2,
          lj: 1,
          ml: 4,
          nm: 'Stroke',
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
    },
  ],
};

// Architectural grid reveal animation
const gridRevealAnimation = {
  v: '5.7.4',
  fr: 60,
  ip: 0,
  op: 90,
  w: 300,
  h: 80,
  nm: 'Grid Reveal',
  ddd: 0,
  assets: [],
  layers: Array.from({ length: 5 }, (_, i) => ({
    ddd: 0,
    ind: i + 1,
    ty: 4,
    nm: `Vertical Line ${i + 1}`,
    sr: 1,
    ks: {
      o: {
        a: 1,
        k: [
          { t: i * 8, s: [0], e: [60] },
          { t: i * 8 + 20, s: [60] },
        ],
      },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [30 + i * 60, 40, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: {
        a: 1,
        k: [
          { t: i * 8, s: [100, 0, 100], e: [100, 100, 100] },
          { t: i * 8 + 30, s: [100, 100, 100] },
        ],
      },
    },
    ao: 0,
    shapes: [
      {
        ty: 'rc',
        d: 1,
        s: { a: 0, k: [1, 40] },
        p: { a: 0, k: [0, 0] },
        r: { a: 0, k: 0 },
        nm: 'Rectangle',
      },
      {
        ty: 'st',
        c: { a: 0, k: [0.831, 0.686, 0.216, i === 2 ? 1 : 0.4] },
        o: { a: 0, k: 100 },
        w: { a: 0, k: 1 },
        lc: 2,
        lj: 1,
        ml: 4,
        nm: 'Stroke',
      },
    ],
    ip: 0,
    op: 90,
    st: 0,
  })),
};

// Elegant wave pulse animation
const wavePulseAnimation = {
  v: '5.7.4',
  fr: 60,
  ip: 0,
  op: 120,
  w: 400,
  h: 100,
  nm: 'Wave Pulse',
  ddd: 0,
  assets: [],
  layers: [
    ...Array.from({ length: 3 }, (_, i) => ({
      ddd: 0,
      ind: i + 1,
      ty: 4,
      nm: `Ring ${i + 1}`,
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: i * 20, s: [80], e: [0] },
            { t: i * 20 + 60, s: [0] },
          ],
        },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [200, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: i * 20, s: [0, 0, 100], e: [300, 300, 100] },
            { t: i * 20 + 60, s: [300, 300, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'el',
          d: 1,
          s: { a: 0, k: [40, 40] },
          p: { a: 0, k: [0, 0] },
          nm: 'Ellipse',
        },
        {
          ty: 'st',
          c: { a: 0, k: [0.831, 0.686, 0.216, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 1 },
          lc: 2,
          lj: 1,
          ml: 4,
          nm: 'Stroke',
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
    })),
    {
      ddd: 0,
      ind: 4,
      ty: 4,
      nm: 'Center Dot',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [200, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [0, 0, 100], e: [100, 100, 100] },
            { t: 30, s: [100, 100, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'el',
          d: 1,
          s: { a: 0, k: [8, 8] },
          p: { a: 0, k: [0, 0] },
          nm: 'Ellipse',
        },
        {
          ty: 'fl',
          c: { a: 0, k: [0.831, 0.686, 0.216, 1] },
          o: { a: 0, k: 100 },
          r: 1,
          nm: 'Fill',
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
    },
  ],
};

// Luxury arrow transition
const arrowTransitionAnimation = {
  v: '5.7.4',
  fr: 60,
  ip: 0,
  op: 90,
  w: 100,
  h: 100,
  nm: 'Arrow Transition',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Arrow',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 90 },
        p: {
          a: 1,
          k: [
            { t: 0, s: [50, 30, 0], e: [50, 70, 0] },
            { t: 45, s: [50, 70, 0], e: [50, 70, 0] },
            { t: 60, s: [50, 70, 0], e: [50, 30, 0] },
            { t: 90, s: [50, 30, 0] },
          ],
        },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: 'sh',
          d: 1,
          ks: {
            a: 0,
            k: {
              i: [[0, 0], [0, 0], [0, 0]],
              o: [[0, 0], [0, 0], [0, 0]],
              v: [[-8, -8], [0, 0], [-8, 8]],
              c: false,
            },
          },
          nm: 'Arrow Path',
        },
        {
          ty: 'st',
          c: { a: 0, k: [0.831, 0.686, 0.216, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 2 },
          lc: 2,
          lj: 2,
          nm: 'Stroke',
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
    },
  ],
};

type DividerVariant = 'line' | 'diamond' | 'grid' | 'wave' | 'arrow' | 'minimal';
type DividerTheme = 'dark' | 'light';

interface SectionDividerProps {
  variant?: DividerVariant;
  theme?: DividerTheme;
  className?: string;
  showOnScroll?: boolean;
}

const animations: Record<DividerVariant, object> = {
  line: lineRevealAnimation,
  diamond: diamondBurstAnimation,
  grid: gridRevealAnimation,
  wave: wavePulseAnimation,
  arrow: arrowTransitionAnimation,
  minimal: lineRevealAnimation,
};

export function SectionDivider({
  variant = 'line',
  theme = 'dark',
  className = '',
  showOnScroll = true,
}: SectionDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  useEffect(() => {
    if (showOnScroll && isInView && lottieRef.current) {
      lottieRef.current.goToAndPlay(0);
    }
  }, [isInView, showOnScroll]);

  const bgColor = theme === 'dark' ? 'bg-neutral-950' : 'bg-white';
  const overlayColor = theme === 'dark'
    ? 'from-neutral-950 via-transparent to-neutral-950'
    : 'from-white via-transparent to-white';

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
      className={`relative flex items-center justify-center overflow-hidden ${bgColor} ${className}`}
    >
      {/* Gradient overlays for smooth blending */}
      <div className={`absolute inset-y-0 left-0 w-20 bg-gradient-to-r ${overlayColor} z-10`} />
      <div className={`absolute inset-y-0 right-0 w-20 bg-gradient-to-l ${overlayColor} z-10`} />

      {/* Lottie Animation */}
      <div className="relative py-8">
        <Lottie
          lottieRef={lottieRef}
          animationData={animations[variant]}
          loop={variant === 'wave' || variant === 'arrow'}
          autoplay={!showOnScroll}
          style={{
            width: variant === 'diamond' ? 120 : variant === 'arrow' ? 60 : 200,
            height: variant === 'diamond' ? 120 : variant === 'arrow' ? 60 : 50,
          }}
        />
      </div>
    </motion.div>
  );
}

// Alternative: Simple animated divider without Lottie (for performance)
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
  const accentColor = 'bg-[#d4af37]';
  const bgColor = theme === 'dark' ? 'bg-neutral-950' : 'bg-white';

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center py-12 ${bgColor} ${className}`}
    >
      {/* Left Line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`h-px w-20 origin-right ${lineColor}`}
      />

      {/* Center Diamond */}
      <motion.div
        initial={{ scale: 0, rotate: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, rotate: 45, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`mx-4 h-3 w-3 border ${theme === 'dark' ? 'border-[#d4af37]' : 'border-[#d4af37]'}`}
      />

      {/* Right Line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`h-px w-20 origin-left ${lineColor}`}
      />
    </div>
  );
}

// Luxurious animated section transition
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
  const textColor = theme === 'dark' ? 'text-white/10' : 'text-neutral-950/10';

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden py-16 ${bgColor} ${className}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.02)_1px,transparent_1px)] bg-[size:40px_40px]`} />
      </div>

      {/* Animated Lines */}
      <div className="relative flex items-center justify-center">
        {/* Outer Lines */}
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: 80 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className={`h-px ${theme === 'dark' ? 'bg-white/10' : 'bg-neutral-950/10'}`}
        />

        {/* Left Diamond */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-3"
        >
          <div className="h-1.5 w-1.5 rotate-45 bg-[#d4af37]/40" />
        </motion.div>

        {/* Center Element */}
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={isInView ? { scale: 1, rotate: 45 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-2 flex items-center justify-center"
        >
          <div className="h-4 w-4 border border-[#d4af37]" />
          <div className="absolute h-2 w-2 bg-[#d4af37]" style={{ transform: 'rotate(-45deg)' }} />
        </motion.div>

        {/* Right Diamond */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-3"
        >
          <div className="h-1.5 w-1.5 rotate-45 bg-[#d4af37]/40" />
        </motion.div>

        {/* Outer Lines */}
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: 80 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className={`h-px ${theme === 'dark' ? 'bg-white/10' : 'bg-neutral-950/10'}`}
        />
      </div>

      {/* Decorative Text (optional watermark effect) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
        className={`absolute inset-0 flex items-center justify-center pointer-events-none ${textColor}`}
      >
        <span className="font-SchnyderS text-6xl font-light tracking-widest">
          ✦
        </span>
      </motion.div>
    </div>
  );
}
