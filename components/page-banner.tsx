'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface PageBannerProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  height?: 'small' | 'medium' | 'large';
}

export function PageBanner({
  title,
  subtitle,
  backgroundImage = '/placeholder.jpg',
  height = 'medium',
}: PageBannerProps) {
  const heightClasses = {
    small: 'h-[40vh] min-h-[300px]',
    medium: 'h-[50vh] min-h-[400px]',
    large: 'h-[60vh] min-h-[500px]',
  };

  return (
    <section className={`relative w-full ${heightClasses[height]} overflow-hidden`}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-4xl font-light tracking-wide text-white md:text-5xl lg:text-6xl"
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="mt-4 text-lg text-white/90 md:text-xl"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>

      {/* Decorative Corner Elements */}
      <div className="absolute left-0 top-0 h-24 w-24 border-l-2 border-t-2 border-white/20" />
      <div className="absolute bottom-0 right-0 h-24 w-24 border-b-2 border-r-2 border-white/20" />
    </section>
  );
}
