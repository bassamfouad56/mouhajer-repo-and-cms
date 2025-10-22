'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedStatCardProps {
  children: ReactNode;
  index: number;
}

export function AnimatedStatCard({ children, index }: AnimatedStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  );
}
