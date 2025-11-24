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
        <Image
          src={project.featuredImage?.node?.sourceUrl || '/placeholder-project.jpg'}
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

// Placeholder projects for initial development
const placeholderProjects: Project[] = [
  {
    id: '1',
    databaseId: 1,
    title: 'Modern Villa Dubai',
    slug: 'modern-villa-dubai',
    excerpt: 'Contemporary luxury living',
    date: new Date('2024-01-15').toISOString(),
    modified: new Date('2024-01-15').toISOString(),
    featuredImage: {
      node: {
        sourceUrl: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80',
        altText: 'Modern Villa Dubai',
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
    title: 'Executive Office',
    slug: 'executive-office',
    excerpt: 'Sophisticated workspace design',
    date: new Date('2024-02-20').toISOString(),
    modified: new Date('2024-02-20').toISOString(),
    featuredImage: {
      node: {
        sourceUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
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
    title: 'Coastal Penthouse',
    slug: 'coastal-penthouse',
    excerpt: 'Oceanfront luxury',
    date: new Date('2024-03-05').toISOString(),
    modified: new Date('2024-03-05').toISOString(),
    featuredImage: {
      node: {
        sourceUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
        altText: 'Coastal Penthouse',
      },
    },
    acfFields: {
      projectType: 'Residential',
      location: 'Palm Jumeirah',
      yearCompleted: '2023',
      description: 'Breathtaking penthouse with panoramic ocean views, featuring custom lighting and premium finishes.',
      gallery: [],
    },
  },
  {
    id: '4',
    databaseId: 4,
    title: 'Boutique Hotel Lobby',
    slug: 'boutique-hotel-lobby',
    excerpt: 'Hospitality excellence',
    date: new Date('2023-11-10').toISOString(),
    modified: new Date('2023-11-10').toISOString(),
    featuredImage: {
      node: {
        sourceUrl: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80',
        altText: 'Boutique Hotel Lobby',
      },
    },
    acfFields: {
      projectType: 'Hospitality',
      location: 'Downtown Dubai',
      yearCompleted: '2023',
      description: 'Luxurious hotel lobby design with marble finishes, custom chandeliers, and statement furniture pieces.',
      gallery: [],
    },
  },
];
