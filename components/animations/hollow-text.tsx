'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HollowTextProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p';
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  startOffset?: number;
  endOffset?: number;
  fillOnHover?: boolean;
}

/**
 * HollowText - Text that fills in as you scroll
 * 
 * Features:
 * - Starts as outlined/hollow text
 * - Fills in with color as element scrolls into view
 * - Smooth, cinematic animation
 */
export function HollowText({
  children,
  className,
  as: Component = 'span',
  fillColor = '#ffffff',
  strokeColor = 'rgba(255,255,255,0.2)',
  strokeWidth = 1,
  startOffset = 0.2,
  endOffset = 0.6,
  fillOnHover = false,
}: HollowTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-20%' });
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Map scroll progress to fill opacity
  const fillOpacity = useTransform(
    scrollYProgress,
    [startOffset, endOffset],
    [0, 1]
  );

  const strokeOpacity = useTransform(
    scrollYProgress,
    [startOffset, endOffset],
    [1, 0.3]
  );

  // If user prefers reduced motion, show filled text immediately
  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={cn('relative inline-block', className)}>
        <span style={{ color: fillColor }}>{children}</span>
      </div>
    );
  }

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      {/* Stroke/Outline Layer */}
      <motion.span
        style={{
          WebkitTextStroke: `${strokeWidth}px ${strokeColor}`,
          WebkitTextFillColor: 'transparent',
          opacity: strokeOpacity,
        }}
        className="absolute inset-0"
        aria-hidden="true"
      >
        {children}
      </motion.span>

      {/* Fill Layer */}
      <motion.span
        style={{
          color: fillColor,
          opacity: fillOpacity,
        }}
        className={fillOnHover ? 'transition-opacity duration-500 group-hover:opacity-100' : ''}
      >
        {children}
      </motion.span>
    </div>
  );
}

/**
 * HollowHeading - A heading variant with hollow text effect
 */
interface HollowHeadingProps extends Omit<HollowTextProps, 'as'> {
  level?: 1 | 2 | 3;
}

export function HollowHeading({
  level = 1,
  children,
  className,
  ...props
}: HollowHeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3';
  
  const sizeClasses = {
    1: 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl',
    2: 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl',
    3: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
  };

  return (
    <Tag className={cn(
      'font-SchnyderS font-light leading-[1.05] tracking-tight',
      sizeClasses[level],
      className
    )}>
      <HollowText {...props}>{children}</HollowText>
    </Tag>
  );
}

/**
 * SplitHollowText - Text that reveals character by character
 */
interface SplitHollowTextProps {
  children: string;
  className?: string;
  fillColor?: string;
  staggerDelay?: number;
}

export function SplitHollowText({
  children,
  className,
  fillColor = '#ffffff',
  staggerDelay = 0.02,
}: SplitHollowTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const prefersReducedMotion = useReducedMotion();

  const characters = children.split('');

  // If user prefers reduced motion, show text immediately without animation
  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={cn('inline-block', className)}>
        <span style={{ color: fillColor }}>{children}</span>
      </div>
    );
  }

  return (
    <div ref={ref} className={cn('inline-block', className)}>
      {characters.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          initial={{
            WebkitTextStroke: '1px rgba(255,255,255,0.2)',
            WebkitTextFillColor: 'transparent',
          }}
          animate={isInView ? {
            WebkitTextStroke: '0px rgba(255,255,255,0)',
            WebkitTextFillColor: fillColor,
          } : {}}
          transition={{
            duration: 0.6,
            delay: index * staggerDelay,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
}

export default HollowText;
