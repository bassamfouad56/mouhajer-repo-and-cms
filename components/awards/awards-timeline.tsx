'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Trophy, Award, Star } from 'lucide-react';

interface Award {
  year: number;
  title: string;
  organization: string;
  category: string;
  level?: string;
}

interface AwardsTimelineProps {
  awards: Award[];
}

export function AwardsTimeline({ awards }: AwardsTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  // Group awards by year
  const awardsByYear = awards.reduce((acc, award) => {
    if (!acc[award.year]) {
      acc[award.year] = [];
    }
    acc[award.year].push(award);
    return acc;
  }, {} as Record<number, Award[]>);

  const years = Object.keys(awardsByYear)
    .map(Number)
    .sort((a, b) => b - a); // Sort descending

  const getIcon = (level?: string) => {
    if (level === '5-star' || level === 'winner') {
      return <Trophy className="h-6 w-6" />;
    }
    if (level === 'certified') {
      return <Award className="h-6 w-6" />;
    }
    return <Star className="h-6 w-6" />;
  };

  return (
    <section ref={containerRef} className="bg-neutral-50 py-24 dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-light tracking-wide text-neutral-900 dark:text-white md:text-5xl">
            Timeline of Excellence
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            A journey of recognition and achievement
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-amber-500 via-amber-600 to-transparent" />

          {/* Timeline Items */}
          <div className="space-y-16">
            {years.map((year, yearIndex) => (
              <motion.div
                key={year}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: yearIndex * 0.2 }}
                className="relative"
              >
                {/* Year Marker */}
                <div className="absolute left-1/2 top-0 z-10 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-amber-500 text-xl font-semibold text-white shadow-lg dark:border-neutral-900">
                  {year}
                </div>

                {/* Awards for this year */}
                <div className="mt-24 grid gap-8 md:grid-cols-2">
                  {awardsByYear[year].map((award, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.6, delay: yearIndex * 0.2 + index * 0.1 }}
                      className={index % 2 === 0 ? 'md:text-right' : ''}
                    >
                      <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-md dark:border-neutral-800 dark:bg-neutral-800">
                        <div className={`mb-4 flex items-center gap-3 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30">
                            {getIcon(award.level)}
                          </div>
                          {award.level && (
                            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                              {award.level}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                          {award.title}
                        </h3>
                        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                          {award.organization}
                        </p>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-500">
                          {award.category}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
