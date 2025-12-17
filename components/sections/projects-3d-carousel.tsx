'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { SafeImage as Image } from '@/components/safe-image';
import Link from 'next/link';
import { Project } from '@/lib/wordpress';
import { ChevronLeft, ChevronRight, ArrowUpRight, Eye } from 'lucide-react';

interface Projects3DCarouselProps {
  projects: Project[];
}

export function Projects3DCarousel({ projects }: Projects3DCarouselProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const displayProjects = projects.length > 0 ? projects : placeholderProjects;

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection;
      if (newIndex < 0) newIndex = displayProjects.length - 1;
      if (newIndex >= displayProjects.length) newIndex = 0;
      return newIndex;
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') paginate(-1);
      if (e.key === 'ArrowRight') paginate(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentProject = displayProjects[currentIndex];
  const prevIndex = (currentIndex - 1 + displayProjects.length) % displayProjects.length;
  const nextIndex = (currentIndex + 1) % displayProjects.length;

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative overflow-hidden bg-neutral-950 px-6 py-32 lg:px-12 lg:py-48"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute left-0 top-0 h-[800px] w-[800px] rounded-full bg-purple-500/10 blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
          className="absolute bottom-0 right-0 h-[800px] w-[800px] rounded-full bg-blue-500/10 blur-[150px]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[2000px]">
        {/* Section Header */}
        <div className="mb-20 text-center lg:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-6 flex items-center justify-center gap-4"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/40" />
            <span className="text-sm font-light tracking-[0.3em] text-white/60">
              FEATURED WORK
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/40" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8 text-center text-6xl font-light tracking-tight text-white sm:text-7xl lg:text-8xl"
          >
            Selected Projects
          </motion.h2>
        </div>

        {/* 3D Carousel */}
        <div className="relative mx-auto" style={{ perspective: '2500px', perspectiveOrigin: 'center' }}>
          <div className="relative mx-auto h-[500px] w-full max-w-6xl lg:h-[700px]">
            {/* Background Cards (Stacked Effect) */}
            <div className="absolute left-1/2 top-1/2 w-[90%] max-w-4xl -translate-x-1/2 -translate-y-1/2">
              {/* Left Preview */}
              <motion.div
                className="absolute left-0 top-1/2 w-[45%] -translate-y-1/2"
                initial={false}
                animate={{
                  x: '-60%',
                  rotateY: 45,
                  z: -400,
                  opacity: 0.4,
                  scale: 0.7,
                }}
                transition={{ type: 'spring', stiffness: 100, damping: 30 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="overflow-hidden border border-white/10 bg-neutral-900/50 shadow-2xl backdrop-blur-sm">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={displayProjects[prevIndex].featuredImage?.node?.sourceUrl || '/placeholder.jpg'}
                      alt={displayProjects[prevIndex].title}
                      fill
                      className="object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
                  </div>
                </div>
              </motion.div>

              {/* Right Preview */}
              <motion.div
                className="absolute right-0 top-1/2 w-[45%] -translate-y-1/2"
                initial={false}
                animate={{
                  x: '60%',
                  rotateY: -45,
                  z: -400,
                  opacity: 0.4,
                  scale: 0.7,
                }}
                transition={{ type: 'spring', stiffness: 100, damping: 30 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="overflow-hidden border border-white/10 bg-neutral-900/50 shadow-2xl backdrop-blur-sm">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={displayProjects[nextIndex].featuredImage?.node?.sourceUrl || '/placeholder.jpg'}
                      alt={displayProjects[nextIndex].title}
                      fill
                      className="object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
                  </div>
                </div>
              </motion.div>

              {/* Center Card (Active) */}
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  initial={{
                    rotateY: direction > 0 ? 120 : -120,
                    rotateX: 15,
                    opacity: 0,
                    z: -500,
                    scale: 0.6,
                    filter: 'blur(20px)',
                  }}
                  animate={{
                    rotateY: 0,
                    rotateX: 0,
                    opacity: 1,
                    z: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                  }}
                  exit={{
                    rotateY: direction > 0 ? -120 : 120,
                    rotateX: -15,
                    opacity: 0,
                    z: -500,
                    scale: 0.6,
                    filter: 'blur(20px)',
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 80,
                    damping: 20,
                    mass: 1.2,
                  }}
                  className="relative z-30 mx-auto w-full max-w-4xl"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <Link
                    href={`/projects/${currentProject.slug}`}
                    className="group block focus-visible:outline-none"
                  >
                    <motion.div
                      className="relative overflow-hidden border border-white/20 bg-neutral-900/80 shadow-2xl shadow-black/50 backdrop-blur-sm transition-all duration-500 group-hover:border-white/40 group-hover:shadow-purple-500/20"
                      initial={{ boxShadow: '0 0 0 0 rgba(168, 85, 247, 0)' }}
                      animate={{
                        boxShadow: [
                          '0 0 0 0 rgba(168, 85, 247, 0)',
                          '0 0 60px 10px rgba(168, 85, 247, 0.3)',
                          '0 0 0 0 rgba(168, 85, 247, 0)',
                        ]
                      }}
                      transition={{ delay: 0.2, duration: 1.2, ease: 'easeInOut' }}
                    >
                      {/* Main Image */}
                      <motion.div
                        className="relative aspect-[16/10] overflow-hidden"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Image
                          src={currentProject.featuredImage?.node?.sourceUrl || '/placeholder.jpg'}
                          alt={currentProject.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          priority
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/0 opacity-0 transition-all duration-500 group-hover:bg-neutral-950/60 group-hover:opacity-100">
                          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white bg-white/10 backdrop-blur-sm">
                            <Eye size={32} className="text-white" strokeWidth={1.5} />
                          </div>
                        </div>

                        {/* Top Badge */}
                        <motion.div
                          className="absolute left-8 top-8 flex items-center gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {currentProject.acfFields?.projectType && (
                            <span className="border border-white/30 bg-neutral-950/50 px-4 py-2 text-xs font-light tracking-widest text-white backdrop-blur-sm">
                              {currentProject.acfFields.projectType}
                            </span>
                          )}
                        </motion.div>
                      </motion.div>

                      {/* Content */}
                      <div className="p-8 lg:p-12">
                        <motion.div
                          className="mb-6 flex items-start justify-between gap-4"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <h3 className="text-3xl font-light tracking-tight text-white transition-all duration-300 group-hover:translate-x-2 lg:text-5xl">
                            {currentProject.title}
                          </h3>
                          <ArrowUpRight
                            size={32}
                            className="shrink-0 text-white/60 transition-all duration-300 group-hover:translate-x-2 group-hover:translate-y-[-8px] group-hover:text-white"
                            strokeWidth={1.5}
                          />
                        </motion.div>

                        <motion.div
                          className="mb-6 flex flex-wrap items-center gap-4 text-sm font-light text-white/60"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {currentProject.acfFields?.location && (
                            <>
                              <span>{currentProject.acfFields.location}</span>
                              <span className="h-1 w-1 rounded-full bg-white/40" />
                            </>
                          )}
                          {currentProject.acfFields?.yearCompleted && (
                            <span>{currentProject.acfFields.yearCompleted}</span>
                          )}
                        </motion.div>

                        {currentProject.acfFields?.description && (
                          <motion.p
                            className="max-w-2xl text-base font-light leading-relaxed text-white/70 lg:text-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          >
                            {currentProject.acfFields.description}
                          </motion.p>
                        )}
                      </div>

                      {/* Bottom Accent Line */}
                      <motion.div
                        className="h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </motion.div>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-16 flex items-center justify-center gap-12 lg:mt-24">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => paginate(-1)}
            className="group flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            aria-label="Previous project"
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
          </motion.button>

          {/* Dots */}
          <div className="flex gap-3">
            {displayProjects.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 ${
                  index === currentIndex
                    ? 'h-3 w-12 bg-white'
                    : 'h-3 w-3 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => paginate(1)}
            className="group flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            aria-label="Next project"
          >
            <ChevronRight size={24} strokeWidth={1.5} />
          </motion.button>
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <a
            href="/projects"
            className="group inline-flex items-center gap-3 border-b border-white/40 pb-2 text-sm font-light tracking-widest text-white transition-all hover:gap-5 hover:border-white focus-visible:gap-5 focus-visible:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            EXPLORE ALL PROJECTS
            <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45 group-focus-visible:rotate-45" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// Placeholder projects - Using real project images
const placeholderProjects: Project[] = [
  {
    id: '1',
    databaseId: 1,
    title: 'Villa Hatem Master Bedroom',
    slug: 'villa-hatem-master-bedroom',
    excerpt: 'Contemporary luxury living',
    date: new Date('2024-01-15').toISOString(),
    modified: new Date('2024-01-15').toISOString(),
    featuredImage: {
      node: {
        sourceUrl: '/projects/bedroom-interior/01 Villa Hatem Master Bedroom OP4.jpg',
        altText: 'Villa Hatem Master Bedroom',
      },
    },
    acfFields: {
      projectType: 'Residential',
      location: 'Dubai Hills',
      yearCompleted: '2024',
      description: 'A stunning contemporary villa featuring minimalist design, natural materials, and seamless indoor-outdoor living spaces that redefine luxury living.',
      gallery: [],
    },
  },
  {
    id: '2',
    databaseId: 2,
    title: 'Modern Office Fit-out',
    slug: 'modern-office-fitout-dubai',
    excerpt: 'Sophisticated workspace design',
    date: new Date('2024-02-20').toISOString(),
    modified: new Date('2024-02-20').toISOString(),
    featuredImage: {
      node: {
        sourceUrl: '/projects/office-fitout/_MID0939-HDR.jpg',
        altText: 'Modern Office Fit-out',
      },
    },
    acfFields: {
      projectType: 'Commercial',
      location: 'DIFC',
      yearCompleted: '2024',
      description: 'Elegant executive office space combining functionality with luxury finishes, bespoke furniture, and cutting-edge technology integration.',
      gallery: [],
    },
  },
  {
    id: '3',
    databaseId: 3,
    title: 'Luxury Bathroom Design',
    slug: 'luxury-bathroom-design-dubai',
    excerpt: 'Premium bathroom interiors',
    date: new Date('2024-03-05').toISOString(),
    modified: new Date('2024-03-05').toISOString(),
    featuredImage: {
      node: {
        sourceUrl: '/projects/bathroom/_MID2588-HDR.jpg',
        altText: 'Luxury Bathroom Design',
      },
    },
    acfFields: {
      projectType: 'Residential',
      location: 'Palm Jumeirah',
      yearCompleted: '2023',
      description: 'Elegant bathroom design featuring premium marble finishes, custom vanities, and sophisticated lighting solutions.',
      gallery: [],
    },
  },
  {
    id: '4',
    databaseId: 4,
    title: 'Turnkey Residential Fit-out',
    slug: 'turnkey-residential-fitout',
    excerpt: 'Complete interior solutions',
    date: new Date('2023-11-10').toISOString(),
    modified: new Date('2023-11-10').toISOString(),
    featuredImage: {
      node: {
        sourceUrl: '/projects/turnkey-design-fitout/_MID2543-HDR.jpg',
        altText: 'Turnkey Residential Fit-out',
      },
    },
    acfFields: {
      projectType: 'Residential',
      location: 'Downtown Dubai',
      yearCompleted: '2023',
      description: 'Complete turnkey residential fit-out from design concept to final handover with premium finishes throughout.',
      gallery: [],
    },
  },
  {
    id: '5',
    databaseId: 5,
    title: 'Custom Walk-in Closet',
    slug: 'custom-walk-in-closet-design',
    excerpt: 'Bespoke storage solutions',
    date: new Date('2024-01-05').toISOString(),
    modified: new Date('2024-01-05').toISOString(),
    featuredImage: {
      node: {
        sourceUrl: '/projects/closet/_MID0095-HDR.jpg',
        altText: 'Custom Walk-in Closet',
      },
    },
    acfFields: {
      projectType: 'Residential',
      location: 'Dubai Marina',
      yearCompleted: '2024',
      description: 'Bespoke walk-in closet featuring custom joinery, intelligent storage solutions, and premium finishes.',
      gallery: [],
    },
  },
  {
    id: '6',
    databaseId: 6,
    title: 'Commercial Interior Design',
    slug: 'luxury-commercial-interior-dubai',
    excerpt: 'Premium commercial spaces',
    date: new Date('2024-03-01').toISOString(),
    modified: new Date('2024-03-01').toISOString(),
    featuredImage: {
      node: {
        sourceUrl: '/projects/commercial-interior/11.jpg',
        altText: 'Commercial Interior Design',
      },
    },
    acfFields: {
      projectType: 'Commercial',
      location: 'Business Bay',
      yearCompleted: '2024',
      description: 'High-end commercial space design featuring sophisticated finishes, optimal space planning, and brand-aligned aesthetics.',
      gallery: [],
    },
  },
];
