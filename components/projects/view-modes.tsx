'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { urlForImage, getSafeImageUrl } from '@/sanity/lib/image';
import { SafeImage } from '@/components/safe-image';

// Helper to safely get image URL from Sanity project
const getProjectImageUrl = (mainImage: any, width: number, height: number): string => {
  if (!mainImage) return '/placeholder.jpg';
  try {
    const builder = urlForImage(mainImage);
    if (!builder) return '/placeholder.jpg';
    return builder.width(width).height(height).url() || '/placeholder.jpg';
  } catch {
    return '/placeholder.jpg';
  }
};

// Types - expects pre-processed strings (localized by parent component)
export interface SanityProject {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: any;
  category?: string;
  location?: string;
  year?: string;
  featured?: boolean;
}

export type ViewMode =
  | 'grid'
  | 'masonry'
  | 'horizontal'
  | 'infinite-scroll'
  | 'case-study'
  | 'split-screen'
  | 'stacked-cards'
  | 'timeline'
  | 'immersive-3d'
  | 'cinematic';

export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6;

// ============================================
// VIEW MODE 1: GRID (with configurable columns)
// ============================================
export function GridView({
  projects,
  columns = 3
}: {
  projects: SanityProject[];
  columns?: GridColumns;
}) {
  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  }[columns];

  return (
    <div className={`grid gap-6 lg:gap-8 ${gridColsClass}`}>
      {projects.map((project, index) => (
        <GridCard key={project._id} project={project} index={index} />
      ))}
    </div>
  );
}

function GridCard({ project, index }: { project: SanityProject; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={`/projects/${project.slug.current}`}>
        <div className="relative mb-4 aspect-[4/3] overflow-hidden bg-neutral-100">
          {project.mainImage ? (
            <motion.div
              className="h-full w-full"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src={getProjectImageUrl(project.mainImage, 800, 600)}
                alt={project.title}
                fill
                className="object-cover"
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-neutral-200" />
          )}
          {project.category && (
            <div className="absolute left-3 top-3 bg-white/90 px-2.5 py-1 backdrop-blur-sm">
              <span className="font-Satoshi text-[9px] uppercase tracking-[0.2em] text-neutral-950">
                {project.category}
              </span>
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/0 transition-all duration-500 group-hover:bg-neutral-950/40">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="font-Satoshi text-xs uppercase tracking-[0.3em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
              View Project
            </motion.span>
          </div>
        </div>
        <h3 className="mb-1.5 font-SchnyderS text-xl font-light tracking-tight text-neutral-950 transition-colors duration-300 group-hover:text-neutral-600 lg:text-2xl">
          {project.title}
        </h3>
        <div className="flex items-center gap-2 font-Satoshi text-xs text-neutral-500">
          {project.location && <span>{project.location}</span>}
          {project.year && (
            <>
              <span className="h-0.5 w-0.5 rounded-full bg-neutral-400" />
              <span>{project.year}</span>
            </>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

// ============================================
// VIEW MODE 2: MASONRY / BENTO GRID
// ============================================
export function MasonryView({ projects }: { projects: SanityProject[] }) {
  // Create varied sizes for bento effect
  const getSizeClass = (index: number) => {
    const patterns = [
      'col-span-2 row-span-2', // Large
      'col-span-1 row-span-1', // Small
      'col-span-1 row-span-2', // Tall
      'col-span-1 row-span-1', // Small
      'col-span-2 row-span-1', // Wide
      'col-span-1 row-span-1', // Small
    ];
    return patterns[index % patterns.length];
  };

  return (
    <div className="grid auto-rows-[200px] grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:auto-rows-[250px]">
      {projects.map((project, index) => (
        <MasonryCard
          key={project._id}
          project={project}
          index={index}
          sizeClass={getSizeClass(index)}
        />
      ))}
    </div>
  );
}

function MasonryCard({
  project,
  index,
  sizeClass
}: {
  project: SanityProject;
  index: number;
  sizeClass: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.03 }}
      className={`group relative overflow-hidden ${sizeClass}`}
    >
      <Link href={`/projects/${project.slug.current}`} className="block h-full">
        <div className="relative h-full w-full">
          {project.mainImage ? (
            <Image
              src={getProjectImageUrl(project.mainImage, 1000, 1000)}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-200" />
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />

          {/* Content */}
          <div className="absolute inset-x-0 bottom-0 p-4 lg:p-6">
            {project.category && (
              <span className="mb-2 inline-block font-Satoshi text-[9px] uppercase tracking-[0.3em] text-[#c9a962]">
                {project.category}
              </span>
            )}
            <h3 className="font-SchnyderS text-lg font-light text-white transition-transform duration-500 group-hover:translate-y-[-4px] lg:text-2xl">
              {project.title}
            </h3>
            <div className="mt-2 flex items-center gap-2 font-Satoshi text-[10px] text-white/60">
              {project.location && <span>{project.location}</span>}
              {project.year && (
                <>
                  <span className="h-0.5 w-0.5 rounded-full bg-white/40" />
                  <span>{project.year}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ============================================
// VIEW MODE 3: HORIZONTAL SCROLL GALLERY
// ============================================
export function HorizontalScrollView({ projects }: { projects: SanityProject[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${(projects.length - 1) * 80}%`]);

  return (
    <div ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-8 pl-8">
          {projects.map((project, index) => (
            <HorizontalCard key={project._id} project={project} index={index} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function HorizontalCard({ project, index }: { project: SanityProject; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative h-[70vh] w-[60vw] flex-shrink-0 overflow-hidden lg:w-[40vw]"
    >
      <Link href={`/projects/${project.slug.current}`} className="block h-full">
        <div className="relative h-full w-full">
          {project.mainImage ? (
            <Image
              src={getProjectImageUrl(project.mainImage, 1400, 900)}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 p-8 lg:p-12">
            <span className="mb-3 inline-block font-Satoshi text-[10px] uppercase tracking-[0.3em] text-[#c9a962]">
              {project.category || 'Project'}
            </span>
            <h3 className="mb-3 font-SchnyderS text-3xl font-light text-white lg:text-5xl">
              {project.title}
            </h3>
            <div className="flex items-center gap-3 font-Satoshi text-sm text-white/60">
              {project.location && <span>{project.location}</span>}
              {project.year && (
                <>
                  <span className="h-1 w-1 rounded-full bg-white/40" />
                  <span>{project.year}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ============================================
// VIEW MODE 4: INFINITE SCROLL (Multi-Column)
// ============================================
export function InfiniteScrollView({ projects }: { projects: SanityProject[] }) {
  // Split projects into 3 columns
  const columns = [
    projects.filter((_, i) => i % 3 === 0),
    projects.filter((_, i) => i % 3 === 1),
    projects.filter((_, i) => i % 3 === 2),
  ];

  return (
    <div className="flex gap-4 overflow-hidden py-8 lg:gap-6">
      {columns.map((columnProjects, colIndex) => (
        <motion.div
          key={colIndex}
          className="flex flex-1 flex-col gap-4 lg:gap-6"
          animate={{
            y: colIndex % 2 === 0 ? [0, -20, 0] : [0, 20, 0]
          }}
          transition={{
            duration: 20 + colIndex * 5,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {/* Duplicate for infinite effect */}
          {[...columnProjects, ...columnProjects].map((project, index) => (
            <InfiniteCard
              key={`${project._id}-${index}`}
              project={project}
              index={index}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
}

function InfiniteCard({ project, index }: { project: SanityProject; index: number }) {
  return (
    <div className="group relative aspect-[3/4] overflow-hidden">
      <Link href={`/projects/${project.slug.current}`} className="block h-full">
        {project.mainImage ? (
          <Image
            src={getProjectImageUrl(project.mainImage, 600, 800)}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-200" />
        )}
        <div className="absolute inset-0 bg-neutral-950/0 transition-all duration-500 group-hover:bg-neutral-950/60" />
        <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-500 group-hover:translate-y-0">
          <h3 className="font-SchnyderS text-lg font-light text-white">
            {project.title}
          </h3>
          <span className="font-Satoshi text-xs text-white/60">{project.category}</span>
        </div>
      </Link>
    </div>
  );
}

// ============================================
// VIEW MODE 5: CASE STUDY CARDS
// ============================================
export function CaseStudyView({ projects }: { projects: SanityProject[] }) {
  return (
    <div className="space-y-8 lg:space-y-12">
      {projects.map((project, index) => (
        <CaseStudyCard key={project._id} project={project} index={index} />
      ))}
    </div>
  );
}

function CaseStudyCard({ project, index }: { project: SanityProject; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Link href={`/projects/${project.slug.current}`}>
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition-all duration-500 hover:border-neutral-300 hover:shadow-xl">
          <div className="flex flex-col lg:flex-row">
            {/* Image */}
            <div className="relative aspect-video w-full overflow-hidden lg:aspect-auto lg:h-[400px] lg:w-1/2">
              {project.mainImage ? (
                <motion.div
                  animate={{ scale: isHovered ? 1.05 : 1 }}
                  transition={{ duration: 0.7 }}
                  className="h-full w-full"
                >
                  <Image
                    src={getProjectImageUrl(project.mainImage, 1000, 700)}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              ) : (
                <div className="absolute inset-0 bg-neutral-100" />
              )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-center p-6 lg:p-10">
              <div className="mb-4 flex items-center gap-3">
                {project.category && (
                  <span className="rounded-full bg-neutral-100 px-3 py-1 font-Satoshi text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                    {project.category}
                  </span>
                )}
                {project.year && (
                  <span className="font-Satoshi text-sm text-neutral-400">
                    {project.year}
                  </span>
                )}
              </div>

              <h3 className="mb-3 font-SchnyderS text-3xl font-light tracking-tight text-neutral-950 transition-colors duration-300 group-hover:text-neutral-600 lg:text-4xl">
                {project.title}
              </h3>

              {project.location && (
                <div className="mb-4 flex items-center gap-2 font-Satoshi text-sm text-neutral-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {project.location}
                </div>
              )}

              {project.excerpt && (
                <p className="mb-6 line-clamp-3 font-Satoshi text-base font-light leading-relaxed text-neutral-600">
                  {project.excerpt}
                </p>
              )}

              <div className="flex items-center gap-2 font-Satoshi text-xs uppercase tracking-[0.2em] text-neutral-950 transition-colors duration-300 group-hover:text-[#c9a962]">
                <span>View Case Study</span>
                <motion.svg
                  animate={{ x: isHovered ? 5 : 0 }}
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ============================================
// VIEW MODE 6: SPLIT-SCREEN REVEAL
// ============================================
export function SplitScreenView({ projects }: { projects: SanityProject[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative min-h-screen lg:flex">
      {/* Left: Project List */}
      <div className="bg-neutral-50 p-6 lg:sticky lg:top-0 lg:h-screen lg:w-1/2 lg:overflow-y-auto lg:p-12">
        <div className="space-y-2">
          {projects.map((project, index) => (
            <motion.button
              key={project._id}
              onClick={() => setActiveIndex(index)}
              className={`group w-full text-left transition-all duration-300 ${
                activeIndex === index ? 'pl-4' : 'pl-0'
              }`}
              whileHover={{ x: 8 }}
            >
              <div className={`border-l-2 py-4 pl-6 transition-all duration-300 ${
                activeIndex === index
                  ? 'border-[#c9a962] bg-white'
                  : 'border-transparent hover:border-neutral-300'
              }`}>
                <span className="mb-1 block font-Satoshi text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                  {project.category || 'Project'} {project.year && `· ${project.year}`}
                </span>
                <h3 className={`font-SchnyderS text-2xl font-light transition-colors duration-300 lg:text-3xl ${
                  activeIndex === index ? 'text-neutral-950' : 'text-neutral-400 group-hover:text-neutral-700'
                }`}>
                  {project.title}
                </h3>
                {activeIndex === index && project.location && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 block font-Satoshi text-sm text-neutral-500"
                  >
                    {project.location}
                  </motion.span>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Right: Active Image */}
      <div className="relative min-h-[60vh] lg:sticky lg:top-0 lg:h-screen lg:w-1/2">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Link href={`/projects/${projects[activeIndex]?.slug.current}`}>
              {projects[activeIndex]?.mainImage ? (
                <Image
                  src={getProjectImageUrl(projects[activeIndex].mainImage, 1200, 1000)}
                  alt={projects[activeIndex].title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-neutral-200" />
              )}
              <div className="absolute inset-0 bg-neutral-950/20" />
              <div className="absolute bottom-8 right-8 flex items-center gap-2 bg-white px-6 py-3 font-Satoshi text-xs uppercase tracking-[0.2em] text-neutral-950 transition-colors duration-300 hover:bg-[#c9a962] hover:text-white">
                View Project
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================
// VIEW MODE 7: STACKED/FAN CARDS
// ============================================
export function StackedCardsView({ projects }: { projects: SanityProject[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="relative mx-auto max-w-4xl py-20">
      <div className="relative h-[600px]">
        {projects.slice(0, 8).map((project, index) => {
          const isHovered = hoveredIndex === index;
          const baseRotation = (index - 3.5) * 8;
          const rotation = isHovered ? 0 : baseRotation;
          const translateY = isHovered ? -40 : index * 2;
          const translateX = isHovered ? 0 : (index - 3.5) * 30;
          const scale = isHovered ? 1.1 : 1 - index * 0.02;
          const zIndex = isHovered ? 50 : projects.length - index;

          return (
            <motion.div
              key={project._id}
              className="absolute left-1/2 top-1/2 h-[400px] w-[300px] cursor-pointer lg:h-[500px] lg:w-[380px]"
              style={{ zIndex }}
              initial={false}
              animate={{
                rotate: rotation,
                y: translateY,
                x: translateX,
                scale,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Link href={`/projects/${project.slug.current}`} className="block h-full">
                <div className="relative h-full w-full -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg bg-white shadow-2xl">
                  {project.mainImage ? (
                    <Image
                      src={getProjectImageUrl(project.mainImage, 600, 800)}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-neutral-200" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span className="mb-2 block font-Satoshi text-[9px] uppercase tracking-[0.3em] text-[#c9a962]">
                      {project.category}
                    </span>
                    <h3 className="font-SchnyderS text-xl font-light text-white lg:text-2xl">
                      {project.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation dots */}
      <div className="mt-8 flex justify-center gap-2">
        {projects.slice(0, 8).map((_, index) => (
          <button
            key={index}
            onClick={() => setHoveredIndex(hoveredIndex === index ? null : index)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              hoveredIndex === index ? 'w-6 bg-[#c9a962]' : 'bg-neutral-300 hover:bg-neutral-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================
// VIEW MODE 8: TIMELINE
// ============================================
export function TimelineView({ projects }: { projects: SanityProject[] }) {
  // Sort by year
  const sortedProjects = [...projects].sort((a, b) => {
    const yearA = parseInt(a.year || '0');
    const yearB = parseInt(b.year || '0');
    return yearB - yearA;
  });

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 h-full w-px bg-neutral-200 lg:left-1/2" />

      <div className="space-y-12 lg:space-y-24">
        {sortedProjects.map((project, index) => (
          <TimelineCard
            key={project._id}
            project={project}
            index={index}
            isLeft={index % 2 === 0}
          />
        ))}
      </div>
    </div>
  );
}

function TimelineCard({
  project,
  index,
  isLeft
}: {
  project: SanityProject;
  index: number;
  isLeft: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative flex items-center ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
    >
      {/* Year marker */}
      <div className="absolute left-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#c9a962] bg-white lg:left-1/2 lg:-translate-x-1/2">
        <div className="h-2 w-2 rounded-full bg-[#c9a962]" />
      </div>

      {/* Year label */}
      <div className={`hidden font-SchnyderS text-5xl font-light text-neutral-200 lg:block lg:w-[calc(50%-60px)] ${
        isLeft ? 'pr-8 text-right' : 'pl-8 text-left'
      }`}>
        {project.year || '—'}
      </div>

      {/* Card */}
      <div className={`ml-16 w-full lg:ml-0 lg:w-[calc(50%-60px)] ${isLeft ? 'lg:pl-8' : 'lg:pr-8'}`}>
        <Link href={`/projects/${project.slug.current}`}>
          <div className="group overflow-hidden rounded-lg bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
            <div className="relative aspect-video overflow-hidden">
              {project.mainImage ? (
                <Image
                  src={getProjectImageUrl(project.mainImage, 800, 500)}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-neutral-200" />
              )}
            </div>
            <div className="p-6">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-Satoshi text-[10px] uppercase tracking-[0.2em] text-[#c9a962]">
                  {project.category}
                </span>
                <span className="font-Satoshi text-sm text-neutral-400 lg:hidden">
                  {project.year}
                </span>
              </div>
              <h3 className="mb-2 font-SchnyderS text-2xl font-light text-neutral-950 transition-colors duration-300 group-hover:text-neutral-600">
                {project.title}
              </h3>
              {project.location && (
                <p className="font-Satoshi text-sm text-neutral-500">{project.location}</p>
              )}
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}

// ============================================
// VIEW MODE 9: IMMERSIVE 3D (Existing)
// ============================================
export function Immersive3DView({ projects }: { projects: SanityProject[] }) {
  // This connects to the existing Immersive3DGrid component
  return (
    <div className="relative -mx-6 lg:-mx-12">
      <div className="bg-neutral-950 py-8">
        <p className="mb-4 text-center font-Satoshi text-sm text-neutral-400">
          Drag to explore • Click to view project
        </p>
        <div className="flex flex-wrap justify-center gap-4 px-4">
          {projects.map((project, index) => (
            <Immersive3DCard key={project._id} project={project} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Immersive3DCard({ project, index }: { project: SanityProject; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    setRotateY(mouseX / 10);
    setRotateX(-mouseY / 10);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d',
      }}
      className="group relative h-[300px] w-[250px] cursor-pointer overflow-hidden rounded-lg transition-transform duration-200 lg:h-[350px] lg:w-[300px]"
    >
      <Link href={`/projects/${project.slug.current}`} className="block h-full">
        {project.mainImage ? (
          <Image
            src={getProjectImageUrl(project.mainImage, 600, 700)}
            alt={project.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent" />

        {/* Shine effect */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `linear-gradient(${105 + rotateY}deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)`,
          }}
        />

        <div className="absolute inset-x-0 bottom-0 p-5" style={{ transform: 'translateZ(30px)' }}>
          <span className="mb-1 block font-Satoshi text-[9px] uppercase tracking-[0.3em] text-[#c9a962]">
            {project.category}
          </span>
          <h3 className="font-SchnyderS text-xl font-light text-white">
            {project.title}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}

// ============================================
// VIEW MODE 10: CINEMATIC (Existing, enhanced)
// ============================================
export function CinematicView({ projects }: { projects: SanityProject[] }) {
  return (
    <div className="space-y-16 lg:space-y-24">
      {projects.map((project, index) => (
        <CinematicCard key={project._id} project={project} index={index} />
      ))}
    </div>
  );
}

function CinematicCard({ project, index }: { project: SanityProject; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true });
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.15]);
  const contentY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <Link href={`/projects/${project.slug.current}`}>
        <div className="relative aspect-[21/9] overflow-hidden bg-neutral-950">
          {project.mainImage ? (
            <motion.div style={{ scale: imageScale }} className="h-full w-full">
              <Image
                src={getProjectImageUrl(project.mainImage, 2000, 857)}
                alt={project.title}
                fill
                className="object-cover"
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-neutral-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/60 via-transparent to-transparent" />

          <motion.div style={{ y: contentY }} className="absolute bottom-0 left-0 right-0 p-8 lg:p-16">
            <div className="mb-3 flex items-center gap-4">
              <div className="h-px w-12 bg-[#c9a962]" />
              <span className="font-Satoshi text-[10px] uppercase tracking-[0.3em] text-[#c9a962]">
                {project.category || 'Featured Project'}
              </span>
            </div>
            <h2 className="mb-4 font-SchnyderS text-4xl font-light tracking-tight text-white transition-all duration-500 group-hover:text-[#c9a962] lg:text-6xl xl:text-7xl">
              {project.title}
            </h2>
            <div className="mb-6 flex flex-wrap items-center gap-4 font-Satoshi text-sm text-white/60">
              {project.location && (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {project.location}
                </span>
              )}
              {project.year && (
                <>
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                  <span>{project.year}</span>
                </>
              )}
            </div>
            {project.excerpt && (
              <p className="max-w-2xl font-Satoshi text-base font-light leading-relaxed text-white/70 lg:text-lg">
                {project.excerpt}
              </p>
            )}

            {/* View button */}
            <div className="mt-6 inline-flex items-center gap-2 border-b border-white/30 pb-1 font-Satoshi text-xs uppercase tracking-[0.2em] text-white/80 transition-all duration-300 group-hover:border-[#c9a962] group-hover:text-[#c9a962]">
              Explore Project
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}

// ============================================
// VIEW MODE SELECTOR COMPONENT
// ============================================
export const VIEW_MODE_CONFIG: Record<ViewMode, {
  label: string;
  icon: React.ReactNode;
  description: string;
}> = {
  'grid': {
    label: 'Grid',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    description: 'Classic grid layout with adjustable columns',
  },
  'masonry': {
    label: 'Masonry',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 14a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1v-5zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
      </svg>
    ),
    description: 'Dynamic bento grid with varied sizes',
  },
  'horizontal': {
    label: 'Horizontal',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
    description: 'Cinematic horizontal scroll gallery',
  },
  'infinite-scroll': {
    label: 'Infinite',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
    description: 'Multi-column infinite scrolling effect',
  },
  'case-study': {
    label: 'Case Study',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    description: 'Detailed cards with descriptions',
  },
  'split-screen': {
    label: 'Split',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
    description: 'Interactive list with preview panel',
  },
  'stacked-cards': {
    label: 'Stacked',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    description: 'Fan-out card deck effect',
  },
  'timeline': {
    label: 'Timeline',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    description: 'Chronological journey view',
  },
  'immersive-3d': {
    label: '3D Cards',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
      </svg>
    ),
    description: 'Interactive 3D perspective cards',
  },
  'cinematic': {
    label: 'Cinematic',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    ),
    description: 'Ultra-wide cinematic hero cards',
  },
};

interface ViewModeSelectorProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  gridColumns?: GridColumns;
  onGridColumnsChange?: (columns: GridColumns) => void;
}

export function ViewModeSelector({
  currentView,
  onViewChange,
  gridColumns = 3,
  onGridColumnsChange,
}: ViewModeSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showGridOptions, setShowGridOptions] = useState(false);

  return (
    <div className="relative">
      {/* Compact View (Mobile & Default) */}
      <div className="flex items-center gap-2">
        <span className="mr-2 hidden font-Satoshi text-[10px] uppercase tracking-[0.3em] text-neutral-400 sm:block">
          View:
        </span>

        {/* Quick access buttons */}
        <div className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-1">
          {(['grid', 'masonry', 'cinematic'] as ViewMode[]).map((view) => (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-Satoshi text-xs transition-all duration-200 ${
                currentView === view
                  ? 'bg-neutral-950 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {VIEW_MODE_CONFIG[view].icon}
              <span className="hidden sm:inline">{VIEW_MODE_CONFIG[view].label}</span>
            </button>
          ))}

          {/* More options button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-Satoshi text-xs transition-all duration-200 ${
              isExpanded || !['grid', 'masonry', 'cinematic'].includes(currentView)
                ? 'bg-[#c9a962] text-white'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
            <span className="hidden sm:inline">More</span>
          </button>
        </div>

        {/* Grid column selector (only show when grid is active) */}
        {currentView === 'grid' && onGridColumnsChange && (
          <div
            className="relative"
            onMouseEnter={() => setShowGridOptions(true)}
            onMouseLeave={() => setShowGridOptions(false)}
          >
            <button className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 font-Satoshi text-xs text-neutral-600 transition-colors hover:border-neutral-300">
              <span>{gridColumns} Col</span>
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <AnimatePresence>
              {showGridOptions && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute right-0 top-full z-50 mt-1 w-32 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg"
                >
                  {([1, 2, 3, 4, 5, 6] as GridColumns[]).map((cols) => (
                    <button
                      key={cols}
                      onClick={() => onGridColumnsChange(cols)}
                      className={`w-full px-3 py-2 text-left font-Satoshi text-xs transition-colors ${
                        gridColumns === cols
                          ? 'bg-neutral-950 text-white'
                          : 'text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {cols} {cols === 1 ? 'Column' : 'Columns'}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Expanded View Options Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            className="absolute right-0 top-full z-50 mt-2 w-[320px] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl sm:w-[400px]"
          >
            <div className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-Satoshi text-sm font-medium text-neutral-950">
                  Display Modes
                </h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-neutral-400 transition-colors hover:text-neutral-600"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(VIEW_MODE_CONFIG) as ViewMode[]).map((view) => (
                  <button
                    key={view}
                    onClick={() => {
                      onViewChange(view);
                      setIsExpanded(false);
                    }}
                    className={`group rounded-lg border p-3 text-left transition-all duration-200 ${
                      currentView === view
                        ? 'border-[#c9a962] bg-[#c9a962]/5'
                        : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <div className={`${currentView === view ? 'text-[#c9a962]' : 'text-neutral-400 group-hover:text-neutral-600'}`}>
                        {VIEW_MODE_CONFIG[view].icon}
                      </div>
                      <span className={`font-Satoshi text-sm font-medium ${
                        currentView === view ? 'text-[#c9a962]' : 'text-neutral-950'
                      }`}>
                        {VIEW_MODE_CONFIG[view].label}
                      </span>
                    </div>
                    <p className="font-Satoshi text-[11px] text-neutral-500">
                      {VIEW_MODE_CONFIG[view].description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
