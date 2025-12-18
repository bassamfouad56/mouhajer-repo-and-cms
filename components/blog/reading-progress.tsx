'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

interface ReadingProgressProps {
  targetRef?: React.RefObject<HTMLElement>;
}

export default function ReadingProgress({ targetRef }: ReadingProgressProps) {
  const [isComplete, setIsComplete] = useState(false);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (latest >= 0.95 && !isComplete) {
        setIsComplete(true);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, isComplete]);

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-[#c9a962]"
      style={{ scaleX }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {isComplete && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#c9a962] via-[#f5d77a] to-[#c9a962]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: 2 }}
        />
      )}
    </motion.div>
  );
}
