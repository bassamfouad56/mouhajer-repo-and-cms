'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  href?: string;
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.3,
  onClick,
  href,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    setPosition({
      x: distanceX * strength,
      y: distanceY * strength,
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      ref={buttonRef as React.RefObject<HTMLButtonElement & HTMLAnchorElement>}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
      className={`inline-block ${className}`}
    >
      <motion.span
        animate={{
          x: position.x * 0.5,
          y: position.y * 0.5,
        }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 15,
          mass: 0.1,
        }}
        className="block"
      >
        {children}
      </motion.span>
    </Component>
  );
}

/**
 * MOUHAJER DESIGN STUDIO - MagneticCTAButton
 *
 * Pre-styled magnetic button with 2 variants:
 * - primary: Solid dark button (main CTAs)
 * - secondary: Outlined button (alternative actions)
 */
export function MagneticCTAButton({
  children,
  href,
  onClick,
  variant = 'primary',
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}) {
  const variants = {
    primary: 'border border-neutral-950 bg-neutral-950 px-6 py-3 sm:px-8 sm:py-4 font-Satoshi text-[10px] sm:text-xs font-light uppercase tracking-[0.15em] text-white transition-all duration-300 hover:bg-transparent hover:text-neutral-950',
    secondary: 'border border-neutral-950 bg-transparent px-6 py-3 sm:px-8 sm:py-4 font-Satoshi text-[10px] sm:text-xs font-light uppercase tracking-[0.15em] text-neutral-950 transition-all duration-300 hover:bg-neutral-950 hover:text-white',
  };

  return (
    <MagneticButton href={href} onClick={onClick} className={variants[variant]} strength={0.2}>
      {children}
    </MagneticButton>
  );
}
