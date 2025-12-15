'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

interface Award {
  title: string;
  organization: string;
  year: number;
  image?: string;
  level?: string;
}

interface RecognitionWallProps {
  awards: Award[];
}

export function RecognitionWall({ awards }: RecognitionWallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  return (
    <section ref={containerRef} className="bg-white py-24 dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-light tracking-wide text-neutral-900 dark:text-white md:text-5xl">
            Wall of Recognition
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            Honored by industry leaders and institutions
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {awards.map((award, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 p-6 transition-all hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-800"
            >
              {award.image && (
                <div className="relative mb-4 h-48 w-full overflow-hidden rounded">
                  <Image
                    src={award.image}
                    alt={award.title}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}

              <div className="space-y-2">
                {award.level && (
                  <span className="inline-block rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                    {award.level}
                  </span>
                )}
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  {award.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {award.organization}
                </p>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  {award.year}
                </p>
              </div>

              {/* Decorative corner */}
              <div className="absolute right-0 top-0 h-16 w-16 border-r-2 border-t-2 border-amber-500/20 transition-opacity group-hover:opacity-100 opacity-0" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
