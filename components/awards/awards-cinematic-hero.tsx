'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

interface AwardsCinematicHeroProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
}

export function AwardsCinematicHero({
  title = 'Awards & Recognition',
  subtitle = 'Celebrating Excellence in Design & Construction',
  backgroundImage = '/placeholder.jpg',
}: AwardsCinematicHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div
        style={{ scale }}
        className="absolute inset-0"
      >
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full items-center justify-center"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <h1 className="text-5xl font-light tracking-wide text-white md:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="mt-6 text-xl text-white/90 md:text-2xl">
              {subtitle}
            </p>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: 'easeInOut' }}
            className="mx-auto mt-12 h-px w-64 bg-gradient-to-r from-transparent via-white to-transparent"
          />
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1, ease: 'easeOut' }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm uppercase tracking-widest text-white/70">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="h-12 w-px bg-gradient-to-b from-white/70 to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}
