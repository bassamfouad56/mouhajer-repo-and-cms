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

// Pre-styled magnetic button variants
export function MagneticCTAButton({
  children,
  href,
  onClick,
  variant = 'primary',
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
}) {
  const variants = {
    primary: 'border border-[#c9a962] bg-[#c9a962] px-8 py-4 font-Satoshi text-sm font-light uppercase tracking-[0.2em] text-neutral-950 transition-all duration-500 hover:bg-transparent hover:text-[#c9a962]',
    secondary: 'border border-white bg-white px-8 py-4 font-Satoshi text-sm font-light uppercase tracking-[0.2em] text-neutral-950 transition-all duration-500 hover:bg-transparent hover:text-white',
    outline: 'border border-white/20 bg-transparent px-8 py-4 font-Satoshi text-sm font-light uppercase tracking-[0.2em] text-white/70 transition-all duration-500 hover:border-[#c9a962]/50 hover:text-[#c9a962]',
  };

  return (
    <MagneticButton href={href} onClick={onClick} className={variants[variant]} strength={0.2}>
      {children}
    </MagneticButton>
  );
}
