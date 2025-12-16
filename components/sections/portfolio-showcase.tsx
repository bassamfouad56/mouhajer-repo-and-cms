'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { SafeImage } from '@/components/safe-image';
import { getProjectPlaceholder } from '@/lib/image-utils';
import Link from 'next/link';

interface Project {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
  acfFields?: {
    location?: string;
    projectType?: string;
    yearCompleted?: string;
  };
}

interface PortfolioShowcaseProps {
  projects: Project[];
}

// Fallback projects if no data
const fallbackProjects = [
  {
    id: '1',
    slug: 'district-one-palace',
    title: 'District One Palace',
    excerpt: 'A magnificent new build construction featuring contemporary Arabian architecture with state-of-the-art amenities.',
    featuredImage: {
      node: {
        sourceUrl: '/projects/bedroom-interior/Villa Ajman-Master Bedroom Light-06112022- HR-(1).jpg',
        altText: 'District One Palace',
      },
    },
    acfFields: {
      location: 'District One, Dubai',
      projectType: 'New Build Construction',
      yearCompleted: '2024',
    },
  },
  {
    id: '2',
    slug: 'sheraton-abu-dhabi',
    title: 'Sheraton Abu Dhabi',
    excerpt: 'Complete renovation and fit-out of a 5-star hotel maintaining operations throughout the transformation.',
    featuredImage: {
      node: {
        sourceUrl: '/projects/commercial-interior/_MID7000-HDR.jpg',
        altText: 'Sheraton Abu Dhabi',
      },
    },
    acfFields: {
      location: 'Corniche, Abu Dhabi',
      projectType: 'Renovation & Fit-Out',
      yearCompleted: '2023',
    },
  },
  {
    id: '3',
    slug: 'palm-jumeirah-villa',
    title: 'Palm Jumeirah Frond N',
    excerpt: 'Turnkey design and build of a modern beachfront villa with panoramic views of the Arabian Gulf.',
    featuredImage: {
      node: {
        sourceUrl: '/projects/turnkey-design-fitout/c5c5c5.jpg',
        altText: 'Palm Jumeirah Villa',
      },
    },
    acfFields: {
      location: 'Palm Jumeirah, Dubai',
      projectType: 'Turnkey Design & Build',
      yearCompleted: '2024',
    },
  },
  {
    id: '4',
    slug: 'burj-vista-office',
    title: 'Burj Vista Office',
    excerpt: 'Premium commercial fit-out featuring executive offices and collaborative spaces with stunning Burj views.',
    featuredImage: {
      node: {
        sourceUrl: '/projects/office-fitout/MID0173-HDR.jpg',
        altText: 'Burj Vista Office',
      },
    },
    acfFields: {
      location: 'Downtown Dubai',
      projectType: 'Commercial Fit-Out',
      yearCompleted: '2023',
    },
  },
  {
    id: '5',
    slug: 'emirates-hills-mansion',
    title: 'Emirates Hills Mansion',
    excerpt: 'Ultra-luxury mansion with bespoke interiors, private cinema, and championship golf course views.',
    featuredImage: {
      node: {
        sourceUrl: '/projects/bedroom-interior/01 Villa Hatem Master Bedroom OP4.jpg',
        altText: 'Emirates Hills Mansion',
      },
    },
    acfFields: {
      location: 'Emirates Hills, Dubai',
      projectType: 'Luxury Residential',
      yearCompleted: '2024',
    },
  },
];

export function PortfolioShowcase({ projects }: PortfolioShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Check if projects have valid images - if not, merge with fallback images
  const projectsWithImages = projects.map((project, index) => {
    const hasValidImage = project.featuredImage?.node?.sourceUrl && project.featuredImage.node.sourceUrl.length > 0;
    if (hasValidImage) return project;

    // Use fallback image for this project
    const fallbackProject = fallbackProjects[index % fallbackProjects.length];
    return {
      ...project,
      featuredImage: fallbackProject.featuredImage,
    };
  });

  // Use fallback projects if no projects at all, otherwise use projects with merged images
  const displayProjects = projects.length > 0 ? projectsWithImages.slice(0, 5) : fallbackProjects;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Cinematic parallax effects
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.3]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const headerY = useTransform(scrollYProgress, [0, 0.5], ['0%', '-30%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5]);

  // Mouse tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 50, damping: 30 };
  const parallaxX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), springConfig);
  const parallaxY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20, 20]), springConfig);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % displayProjects.length);
  }, [displayProjects.length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + displayProjects.length) % displayProjects.length);
  }, [displayProjects.length]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        setIsAutoPlaying(false);
      }
      if (e.key === 'ArrowRight') {
        nextSlide();
        setIsAutoPlaying(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const activeProject = displayProjects[activeIndex];
  const backgroundProject = displayProjects[(activeIndex + 1) % displayProjects.length];

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-hidden bg-neutral-950 scroll-mt-24"
    >
      {/* Cinematic Background - Second Project Image */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: backgroundScale, y: backgroundY }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ x: parallaxX, y: parallaxY }}
        >
          <SafeImage
            src={backgroundProject.featuredImage.node.sourceUrl}
            alt={backgroundProject.featuredImage.node.altText || backgroundProject.title}
            fallbackSrc={getProjectPlaceholder(backgroundProject.title, backgroundProject.acfFields?.projectType)}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </motion.div>

        {/* Multiple overlay layers for cinematic depth */}
        <div className="absolute inset-0 bg-gradient-to-l from-neutral-950 via-neutral-950/90 to-neutral-950/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/80" />
        <div className="absolute inset-0 bg-neutral-950/40" />

        {/* Animated grain/noise effect */}
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          }}
        />

        {/* Cinematic light rays */}
        <motion.div
          className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-[#d4af37]/5 to-transparent"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Main Content Container */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 flex min-h-screen"
      >
        {/* Left Side - Content */}
        <div className="flex w-full flex-col justify-center px-6 py-24 lg:w-1/2 lg:px-16 lg:py-32 order-2 lg:order-1">
          {/* Header */}
          <motion.div style={{ y: headerY }} className="mb-12 lg:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-6 flex items-center gap-4"
            >
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#d4af37]/50" />
              <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-white/40">
                Portfolio of Excellence
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-SchnyderS text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              A Legacy of
              <br />
              <span className="text-white/30">Built Projects</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 font-Satoshi text-base font-light text-white/50 lg:text-lg"
            >
              400+ Delivered. Zero Failed Handovers.
            </motion.p>

            {/* Navigation Arrows - Moved Up for Visibility */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex items-center gap-4"
            >
              <button
                onClick={() => {
                  prevSlide();
                  setIsAutoPlaying(false);
                }}
                className="group flex h-14 w-14 items-center justify-center border border-[#d4af37]/40 bg-[#d4af37]/10 transition-all duration-300 hover:border-[#d4af37] hover:bg-[#d4af37]/20"
                aria-label="Previous project"
              >
                <ArrowLeft className="h-6 w-6 text-[#d4af37] transition-transform group-hover:-translate-x-1" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => {
                  nextSlide();
                  setIsAutoPlaying(false);
                }}
                className="group flex h-14 w-14 items-center justify-center border border-[#d4af37]/40 bg-[#d4af37]/10 transition-all duration-300 hover:border-[#d4af37] hover:bg-[#d4af37]/20"
                aria-label="Next project"
              >
                <ArrowRight className="h-6 w-6 text-[#d4af37] transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
              </button>
              <span className="ml-2 font-Satoshi text-sm font-light text-white/40">
                {activeIndex + 1} / {displayProjects.length}
              </span>
            </motion.div>
          </motion.div>

          {/* Active Project Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-12"
            >
              {/* Mobile Image */}
              <div className="relative mb-6 aspect-[4/3] overflow-hidden lg:hidden">
                <SafeImage
                  src={activeProject.featuredImage.node.sourceUrl}
                  alt={activeProject.featuredImage.node.altText || activeProject.title}
                  fallbackSrc={getProjectPlaceholder(activeProject.title, activeProject.acfFields?.projectType)}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
              </div>

              {/* Project Type Badge */}
              {activeProject.acfFields?.projectType && (
                <div className="mb-4 inline-block border border-[#d4af37]/30 bg-[#d4af37]/5 px-4 py-2 font-Satoshi text-xs font-light uppercase tracking-wider text-[#d4af37]">
                  {activeProject.acfFields.projectType}
                </div>
              )}

              {/* Title */}
              <h3 className="mb-3 font-SchnyderS text-3xl font-light text-white lg:text-4xl xl:text-5xl">
                {activeProject.title}
              </h3>

              {/* Location & Year */}
              <div className="mb-4 flex items-center gap-4 font-Satoshi text-sm font-light text-white/50">
                {activeProject.acfFields?.location && (
                  <span>{activeProject.acfFields.location}</span>
                )}
                {activeProject.acfFields?.yearCompleted && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-[#d4af37]/50" />
                    <span>{activeProject.acfFields.yearCompleted}</span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="mb-6 font-Satoshi text-base font-light leading-relaxed text-white/60 lg:text-lg">
                {activeProject.excerpt}
              </p>

              {/* CTA */}
              <Link
                href={`/projects/${activeProject.slug}`}
                className="group inline-flex items-center gap-3 border border-[#d4af37]/30 bg-[#d4af37]/5 px-6 py-4 font-Satoshi text-xs font-light uppercase tracking-wider text-[#d4af37] transition-all hover:bg-[#d4af37]/10 hover:gap-4"
              >
                Explore Project
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Progress Dots */}
          <div className="flex items-center gap-3 border-t border-white/10 pt-8">
            {displayProjects.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveIndex(index);
                  setIsAutoPlaying(false);
                }}
                className="group relative h-2 overflow-hidden"
                aria-label={`Go to project ${index + 1}`}
              >
                <div className={`h-full transition-all duration-500 ${
                  index === activeIndex ? 'w-10 bg-[#d4af37]' : 'w-2 bg-white/20 hover:bg-white/40'
                }`} />

                {/* Auto-play progress */}
                {index === activeIndex && isAutoPlaying && (
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-white/30"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 6, ease: 'linear' }}
                    key={`progress-${activeIndex}`}
                  />
                )}
              </button>
            ))}
          </div>

          {/* View All Projects Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12"
          >
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 font-Satoshi text-sm font-light tracking-wide text-white/60 transition-colors hover:text-[#d4af37]"
            >
              View All Projects
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
            </Link>
          </motion.div>
        </div>

        {/* Right Side - Featured Project Full Height Image */}
        <div className="hidden w-1/2 lg:block order-2">
          <div className="relative h-screen sticky top-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.id}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <SafeImage
                  src={activeProject.featuredImage.node.sourceUrl}
                  alt={activeProject.featuredImage.node.altText || activeProject.title}
                  fallbackSrc={getProjectPlaceholder(activeProject.title, activeProject.acfFields?.projectType)}
                  fill
                  className="object-cover"
                  sizes="50vw"
                  priority
                />

                {/* Gradient overlay on image */}
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-neutral-950" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent" />

                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
                  style={{ transform: 'skewX(-20deg)' }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Corner Frame Accents */}
            <div className="absolute right-8 top-8 h-24 w-24 border-r-2 border-t-2 border-[#d4af37]/30" />
            <div className="absolute bottom-8 right-8 h-24 w-24 border-b-2 border-r-2 border-[#d4af37]/30" />
          </div>
        </div>
      </motion.div>

    </section>
  );
}
