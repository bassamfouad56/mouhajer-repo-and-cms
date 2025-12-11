'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SafeImage } from '@/components/safe-image';
import Link from 'next/link';
import { Project } from '@/lib/wordpress';
import { ArrowUpRight } from 'lucide-react';

interface ProjectsProps {
  projects: Project[];
}

export function Projects({ projects }: ProjectsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Use placeholder projects if none from WordPress
  const displayProjects = projects.length > 0 ? projects : placeholderProjects;

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-neutral-100 px-6 py-32 lg:px-12 lg:py-48"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      <div className="absolute right-1/4 top-0 h-96 w-96 rounded-full bg-purple-100/40 blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1800px]">
        {/* Section Header */}
        <div className="mb-24 lg:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-6 flex items-center justify-center gap-4"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-neutral-400" />
            <span className="text-sm font-light tracking-[0.3em] text-neutral-500">
              FEATURED WORK
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-neutral-400" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl font-light tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl"
          >
            Selected Projects
          </motion.h2>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-12 md:grid-cols-2 lg:gap-16">
          {displayProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <a
            href="/projects"
            className="group inline-flex items-center gap-2 border-b border-neutral-950 pb-1 text-sm font-light tracking-widest text-neutral-950 transition-all hover:gap-4 focus-visible:gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
          >
            VIEW ALL PROJECTS
            <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45 group-focus-visible:rotate-45" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="group relative"
    >
      <Link
        href={`/projects/${project.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-200">
        <SafeImage
          src={project.featuredImage?.node?.sourceUrl || '/placeholder.jpg'}
          alt={project.title}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-neutral-950/0 transition-all duration-500 group-hover:bg-neutral-950/30" />

        {/* Hover Info */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white">
            <ArrowUpRight className="text-white" size={24} />
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="mt-6">
        <div className="mb-2 flex items-start justify-between gap-4">
          <h3 className="text-2xl font-light tracking-tight text-neutral-950 transition-colors group-hover:text-neutral-600 lg:text-3xl">
            {project.title}
          </h3>
          <span className="shrink-0 text-sm font-light text-neutral-400">
            {project.acfFields?.yearCompleted || '2024'}
          </span>
        </div>

        <div className="mb-3 flex items-center gap-3 text-xs font-light tracking-wider text-neutral-500">
          {project.acfFields?.projectType && (
            <span>{project.acfFields.projectType}</span>
          )}
          {project.acfFields?.location && (
            <>
              <span>•</span>
              <span>{project.acfFields.location}</span>
            </>
          )}
        </div>

        {project.acfFields?.description && (
          <p className="line-clamp-2 text-sm font-light leading-relaxed text-neutral-600">
            {project.acfFields.description}
          </p>
        )}
      </div>
      </Link>
    </motion.div>
  );
}

// Placeholder projects for initial development - Using real project images
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
      description: 'A stunning contemporary villa featuring minimalist design, natural materials, and seamless indoor-outdoor living spaces.',
      gallery: [],
    },
  },
  {
    id: '2',
    databaseId: 2,
    title: 'Executive Office Fit-out',
    slug: 'modern-office-fitout-dubai',
    excerpt: 'Sophisticated workspace design',
    date: new Date('2024-02-20').toISOString(),
    modified: new Date('2024-02-20').toISOString(),
    featuredImage: {
      node: {
        sourceUrl: '/projects/office-fitout/_MID0939-HDR.jpg',
        altText: 'Executive Office',
      },
    },
    acfFields: {
      projectType: 'Commercial',
      location: 'DIFC',
      yearCompleted: '2024',
      description: 'Elegant executive office space combining functionality with luxury finishes and bespoke furniture.',
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
        altText: 'Luxury Bathroom',
      },
    },
    acfFields: {
      projectType: 'Residential',
      location: 'Palm Jumeirah',
      yearCompleted: '2023',
      description: 'Elegant bathroom design featuring premium marble finishes, custom vanities, and sophisticated lighting.',
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
      description: 'Complete turnkey residential fit-out from design concept to final handover with premium finishes.',
      gallery: [],
    },
  },
];
