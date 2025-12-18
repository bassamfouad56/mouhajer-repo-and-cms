'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SVGLineDrawProps {
  width?: number;
  height?: number;
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
  duration?: number;
  delay?: number;
}

export function SVGLineDraw({
  width = 200,
  height = 2,
  className = '',
  strokeColor = '#c9a962',
  strokeWidth = 2,
  duration = 1.5,
  delay = 0,
}: SVGLineDrawProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={className}
    >
      <motion.line
        x1="0"
        y1={height / 2}
        x2={width}
        y2={height / 2}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{
          pathLength: { duration, delay, ease: 'easeInOut' },
          opacity: { duration: 0.3, delay },
        }}
      />
    </svg>
  );
}

export function SVGCircleDraw({
  size = 100,
  className = '',
  strokeColor = '#c9a962',
  strokeWidth = 2,
  duration = 2,
  delay = 0,
}: {
  size?: number;
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={className}
    >
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0, rotate: -90 }}
        animate={isInView ? { pathLength: 1, opacity: 1, rotate: 0 } : {}}
        transition={{
          pathLength: { duration, delay, ease: 'easeInOut' },
          opacity: { duration: 0.3, delay },
          rotate: { duration, delay, ease: 'easeOut' },
        }}
        style={{ transformOrigin: 'center' }}
      />
    </svg>
  );
}

export function SVGPathDraw({
  path,
  width = 200,
  height = 200,
  className = '',
  strokeColor = '#c9a962',
  strokeWidth = 2,
  fill = 'none',
  duration = 2,
  delay = 0,
}: {
  path: string;
  width?: number;
  height?: number;
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
  fill?: string;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={className}
    >
      <motion.path
        d={path}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fill}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{
          pathLength: { duration, delay, ease: 'easeInOut' },
          opacity: { duration: 0.3, delay },
        }}
      />
    </svg>
  );
}
