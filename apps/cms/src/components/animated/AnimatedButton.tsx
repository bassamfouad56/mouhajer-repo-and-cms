'use client';

import { motion } from 'framer-motion';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function AnimatedButton({
  children,
  variant = 'primary',
  className = '',
  ...props
}: AnimatedButtonProps) {
  const baseClasses = "relative overflow-hidden transition-colors";

  return (
    <motion.button
      className={`${baseClasses} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      {...props}
    >
      <motion.span
        className="absolute inset-0 bg-white dark:bg-gray-700"
        initial={{ scale: 0, opacity: 0.3 }}
        whileHover={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.6 }}
        style={{ borderRadius: '50%' }}
      />
      {children}
    </motion.button>
  );
}
