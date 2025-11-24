'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, MapPin, Calendar } from 'lucide-react';
import { SafeImage } from '@/components/safe-image';

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

interface FeaturedProjectsProps {
  projects: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Take first 3 projects
  const featuredProjects = projects.slice(0, 3);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white px-6 py-32 lg:px-12 lg:py-48"
    >
      <div className="mx-auto max-w-[1800px]">
        {/* Section Header */}
        <div className="mb-24 lg:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-6 flex items-center gap-4"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-neutral-400" />
            <span className="text-sm font-light tracking-[0.3em] text-neutral-500">
              FEATURED WORK
            </span>
          </motion.div>

          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="max-w-3xl text-5xl font-light tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl"
            >
              Transforming Spaces into
              <br />
              Timeless Masterpieces
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link
                href="/projects"
                className="group inline-flex items-center gap-3 border-b border-neutral-950 pb-1 text-sm font-light tracking-widest text-neutral-950 transition-all hover:gap-4"
              >
                VIEW ALL PROJECTS
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Featured Projects Grid */}
        <div className="space-y-24 lg:space-y-32">
          {featuredProjects.map((project, index) => (
            <FeaturedProjectCard
              key={project.id}
              project={project}
              index={index}
              isReversed={index % 2 !== 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FeaturedProjectCardProps {
  project: Project;
  index: number;
  isReversed: boolean;
}

function FeaturedProjectCard({ project, index, isReversed }: FeaturedProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const contentY = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <div
      ref={cardRef}
      className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-16 ${
        isReversed ? 'lg:grid-flow-col-dense' : ''
      }`}
    >
      {/* Image */}
      <motion.div
        style={{ y: imageY }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1, delay: index * 0.1 }}
        className={`group relative aspect-[4/3] overflow-hidden ${isReversed ? 'lg:col-start-2' : ''}`}
      >
        <Link href={`/projects/${project.slug}`} className="block h-full w-full">
          <div className="relative h-full w-full">
            <SafeImage
              src={project.featuredImage.node.sourceUrl}
              alt={project.featuredImage.node.altText || project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* View Project Button */}
            <div className="absolute bottom-8 left-8 right-8 flex translate-y-4 items-center justify-between opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="text-sm font-light tracking-widest text-white">
                VIEW PROJECT
              </span>
              <ArrowRight className="h-5 w-5 text-white" strokeWidth={1.5} />
            </div>
          </div>
        </Link>

        {/* Project Number */}
        <div className="absolute right-8 top-8 text-8xl font-extralight text-white/20">
          {String(index + 1).padStart(2, '0')}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: contentY }}
        initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
        className={isReversed ? 'lg:col-start-1' : ''}
      >
        {/* Meta Info */}
        <div className="mb-6 flex flex-wrap gap-6 text-sm font-light text-neutral-500">
          {project.acfFields?.projectType && (
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-neutral-400" />
              <span className="tracking-wider">{project.acfFields.projectType}</span>
            </div>
          )}
          {project.acfFields?.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" strokeWidth={1.5} />
              <span>{project.acfFields.location}</span>
            </div>
          )}
          {project.acfFields?.yearCompleted && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" strokeWidth={1.5} />
              <span>{project.acfFields.yearCompleted}</span>
            </div>
          )}
        </div>

        <h3 className="mb-6 text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
          {project.title}
        </h3>

        <p className="mb-8 max-w-xl text-lg font-light leading-relaxed text-neutral-600">
          {project.excerpt}
        </p>

        <Link
          href={`/projects/${project.slug}`}
          className="group inline-flex items-center gap-3 border border-neutral-950 px-8 py-4 text-sm font-light tracking-widest text-neutral-950 transition-all hover:bg-neutral-950 hover:text-white"
        >
          EXPLORE PROJECT
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
        </Link>
      </motion.div>
    </div>
  );
}
