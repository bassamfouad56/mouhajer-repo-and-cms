'use client';

import { ReactNode, useRef, useEffect, useState, CSSProperties } from 'react';
import { motion, useInView, useSpring, useTransform, MotionValue, useScroll, Variants, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================
// EASING & TIMING CONSTANTS
// ============================================

export const EASINGS = {
  smooth: [0.22, 1, 0.36, 1] as const,
  easeOut: [0.16, 1, 0.3, 1] as const,
  luxury: [0.19, 1, 0.22, 1] as const,
  bounce: [0.34, 1.56, 0.64, 1] as const,
  sharp: [0.4, 0, 0.2, 1] as const,
};

export const DURATIONS = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.7,
  slower: 1.0,
  cinematic: 1.2,
};

// ============================================
// FADE IN COMPONENT
// ============================================

interface FadeInProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  once?: boolean;
  threshold?: number;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = DURATIONS.slow,
  direction = 'up',
  distance = 30,
  once = true,
  threshold = 0.2,
  ...props
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
      default: return {};
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...getInitialPosition() }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...getInitialPosition() }}
      transition={{
        duration,
        delay,
        ease: EASINGS.smooth,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// SCALE IN COMPONENT
// ============================================

interface ScaleInProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  initialScale?: number;
  once?: boolean;
}

export function ScaleIn({
  children,
  className,
  delay = 0,
  duration = DURATIONS.slow,
  initialScale = 0.95,
  once = true,
  ...props
}: ScaleInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: initialScale }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: initialScale }}
      transition={{
        duration,
        delay,
        ease: EASINGS.smooth,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// STAGGER CONTAINER
// ============================================

interface StaggerContainerProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
  once?: boolean;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  delayChildren = 0,
  once = true,
  ...props
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.2 });

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// STAGGER ITEM (use inside StaggerContainer)
// ============================================

interface StaggerItemProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
}

export function StaggerItem({
  children,
  className,
  direction = 'up',
  distance = 30,
  ...props
}: StaggerItemProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
      default: return {};
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, ...getInitialPosition() },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: DURATIONS.slow,
        ease: EASINGS.smooth,
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className} {...props}>
      {children}
    </motion.div>
  );
}

// ============================================
// TYPEWRITER TEXT
// ============================================

interface TypewriterProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  cursor?: boolean;
  cursorChar?: string;
  onComplete?: () => void;
}

export function Typewriter({
  text,
  className,
  delay = 0,
  speed = 50,
  cursor = true,
  cursorChar = '|',
  onComplete,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const timer = setTimeout(() => {
      setIsTyping(true);
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
          onComplete?.();
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [isInView, text, delay, speed, onComplete]);

  // Cursor blink effect
  useEffect(() => {
    if (!cursor) return;
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, [cursor]);

  return (
    <span ref={ref} className={className}>
      {displayText}
      {cursor && (
        <span
          className={cn(
            'inline-block transition-opacity duration-100',
            showCursor ? 'opacity-100' : 'opacity-0'
          )}
        >
          {cursorChar}
        </span>
      )}
    </span>
  );
}

// ============================================
// ANIMATED COUNTER
// ============================================

interface CounterProps {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  once?: boolean;
}

export function Counter({
  from = 0,
  to,
  duration = 2,
  delay = 0,
  className,
  prefix = '',
  suffix = '',
  decimals = 0,
  once = true,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, amount: 0.5 });
  const [hasAnimated, setHasAnimated] = useState(false);

  const springValue = useSpring(from, {
    duration: duration * 1000,
    bounce: 0,
  });

  const displayValue = useTransform(springValue, (v) => {
    return `${prefix}${v.toFixed(decimals)}${suffix}`;
  });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timer = setTimeout(() => {
        springValue.set(to);
        setHasAnimated(true);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasAnimated, to, springValue, delay]);

  return (
    <motion.span ref={ref} className={className}>
      {displayValue}
    </motion.span>
  );
}

// ============================================
// ANIMATED UNDERLINE LINK
// ============================================

interface AnimatedLinkProps {
  children: ReactNode;
  href?: string;
  className?: string;
  underlineColor?: string;
  underlineHeight?: number;
  direction?: 'left' | 'right' | 'center';
  onClick?: () => void;
}

export function AnimatedUnderlineLink({
  children,
  href,
  className,
  underlineColor = 'currentColor',
  underlineHeight = 1,
  direction = 'left',
  onClick,
}: AnimatedLinkProps) {
  const Component = href ? 'a' : 'span';

  const getUnderlineStyles = (): CSSProperties => {
    const base: CSSProperties = {
      position: 'absolute',
      bottom: 0,
      height: underlineHeight,
      backgroundColor: underlineColor,
      transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    };

    switch (direction) {
      case 'left':
        return { ...base, left: 0, width: 0 };
      case 'right':
        return { ...base, right: 0, width: 0 };
      case 'center':
        return { ...base, left: '50%', width: 0, transform: 'translateX(-50%)' };
    }
  };

  return (
    <Component
      href={href}
      onClick={onClick}
      className={cn('group relative inline-block cursor-pointer', className)}
    >
      {children}
      <span
        className="pointer-events-none group-hover:!w-full"
        style={getUnderlineStyles()}
      />
    </Component>
  );
}

// ============================================
// ANIMATED LINE / DIVIDER
// ============================================

interface AnimatedLineProps {
  className?: string;
  direction?: 'horizontal' | 'vertical';
  color?: string;
  delay?: number;
  duration?: number;
  fromCenter?: boolean;
}

export function AnimatedLine({
  className,
  direction = 'horizontal',
  color = 'currentColor',
  delay = 0,
  duration = 0.8,
  fromCenter = false,
}: AnimatedLineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const isHorizontal = direction === 'horizontal';

  return (
    <div
      ref={ref}
      className={cn(
        'overflow-hidden',
        isHorizontal ? 'h-px w-full' : 'h-full w-px',
        className
      )}
    >
      <motion.div
        initial={
          fromCenter
            ? { scaleX: 0, transformOrigin: 'center' }
            : isHorizontal
            ? { scaleX: 0, transformOrigin: 'left' }
            : { scaleY: 0, transformOrigin: 'top' }
        }
        animate={
          isInView
            ? { scaleX: 1, scaleY: 1 }
            : fromCenter
            ? { scaleX: 0 }
            : isHorizontal
            ? { scaleX: 0 }
            : { scaleY: 0 }
        }
        transition={{
          duration,
          delay,
          ease: EASINGS.smooth,
        }}
        className="h-full w-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

// ============================================
// PARALLAX CONTAINER
// ============================================

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down';
}

export function Parallax({
  children,
  className,
  speed = 0.5,
  direction = 'up',
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'up' ? [100 * speed, -100 * speed] : [-100 * speed, 100 * speed]
  );

  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

// ============================================
// REVEAL MASK (clip-path animation)
// ============================================

interface RevealMaskProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
}

export function RevealMask({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  ...props
}: RevealMaskProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const getClipPath = () => {
    switch (direction) {
      case 'up': return { hidden: 'inset(100% 0 0 0)', visible: 'inset(0 0 0 0)' };
      case 'down': return { hidden: 'inset(0 0 100% 0)', visible: 'inset(0 0 0 0)' };
      case 'left': return { hidden: 'inset(0 100% 0 0)', visible: 'inset(0 0 0 0)' };
      case 'right': return { hidden: 'inset(0 0 0 100%)', visible: 'inset(0 0 0 0)' };
    }
  };

  const clipPaths = getClipPath();

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: clipPaths.hidden }}
      animate={isInView ? { clipPath: clipPaths.visible } : { clipPath: clipPaths.hidden }}
      transition={{
        duration,
        delay,
        ease: EASINGS.luxury,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// HOVER LIFT WRAPPER
// ============================================

interface HoverLiftProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  lift?: number;
  scale?: number;
  shadow?: boolean;
}

export function HoverLift({
  children,
  className,
  lift = 8,
  scale = 1,
  shadow = true,
  ...props
}: HoverLiftProps) {
  return (
    <motion.div
      whileHover={{
        y: -lift,
        scale,
        boxShadow: shadow ? '0 20px 40px -12px rgba(0,0,0,0.2)' : undefined,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// BLUR IN TEXT
// ============================================

interface BlurInProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export function BlurIn({
  children,
  className,
  delay = 0,
  duration = 0.8,
}: BlurInProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={isInView ? { opacity: 1, filter: 'blur(0px)' } : {}}
      transition={{
        duration,
        delay,
        ease: EASINGS.smooth,
      }}
      className={className}
    >
      {children}
    </motion.span>
  );
}

// ============================================
// LETTER BY LETTER REVEAL
// ============================================

interface LetterRevealProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  once?: boolean;
}

export function LetterReveal({
  text,
  className,
  delay = 0,
  staggerDelay = 0.03,
  once = true,
}: LetterRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, amount: 0.5 });

  const letters = text.split('');

  return (
    <span ref={ref} className={cn('inline-block', className)}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.4,
            delay: delay + index * staggerDelay,
            ease: EASINGS.easeOut,
          }}
          className="inline-block"
          style={{ whiteSpace: letter === ' ' ? 'pre' : 'normal' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </span>
  );
}

// ============================================
// WORD BY WORD REVEAL
// ============================================

interface WordRevealProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  staggerDelay?: number;
  once?: boolean;
}

export function WordReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  staggerDelay = 0.1,
  once = true,
}: WordRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, amount: 0.3 });

  const words = text.split(' ');

  return (
    <span ref={ref} className={cn('inline-block', className)}>
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden">
          <motion.span
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.5,
              delay: delay + index * staggerDelay,
              ease: EASINGS.easeOut,
            }}
            className={cn('inline-block', wordClassName)}
            style={{ marginRight: index < words.length - 1 ? '0.25em' : 0 }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ============================================
// ROTATE IN
// ============================================

interface RotateInProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  angle?: number;
}

export function RotateIn({
  children,
  className,
  delay = 0,
  duration = 0.8,
  angle = -10,
  ...props
}: RotateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, rotate: angle, scale: 0.95 }}
      animate={isInView ? { opacity: 1, rotate: 0, scale: 1 } : {}}
      transition={{
        duration,
        delay,
        ease: EASINGS.smooth,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// FLIP TEXT
// ============================================

interface FlipTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function FlipText({ text, className, delay = 0 }: FlipTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  const letters = text.split('');

  return (
    <span ref={ref} className={cn('inline-block', className)} style={{ perspective: '1000px' }}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={isInView ? { rotateX: 0, opacity: 1 } : {}}
          transition={{
            duration: 0.6,
            delay: delay + index * 0.04,
            ease: EASINGS.bounce,
          }}
          className="inline-block origin-bottom"
          style={{
            transformStyle: 'preserve-3d',
            whiteSpace: letter === ' ' ? 'pre' : 'normal'
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </span>
  );
}

