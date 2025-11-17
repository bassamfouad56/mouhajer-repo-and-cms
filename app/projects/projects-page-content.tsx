'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Project, Industry } from '@/lib/wordpress';
import { ArrowUpRight, Filter, Grid3x3, LayoutGrid, MapPin, Calendar } from 'lucide-react';

interface ProjectsPageContentProps {
  projects: Project[];
  industries: Industry[];
}

export default function ProjectsPageContent({ projects, industries }: ProjectsPageContentProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [gridLayout, setGridLayout] = useState<'masonry' | 'grid'>('masonry');

  const displayProjects = projects.length > 0 ? projects : placeholderProjects;

  // Filter projects by category
  const filteredProjects =
    selectedCategory === 'all'
      ? displayProjects
      : displayProjects.filter(
          (project) => project.acfFields?.category === selectedCategory
        );

  // Get unique categories
  const categories = [
    'all',
    ...Array.from(
      new Set(displayProjects.map((p) => p.acfFields?.category).filter(Boolean))
    ),
  ];

  return (
    <main className="relative bg-white">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 px-6 py-32 lg:px-12 lg:py-48"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-[1400px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-8 flex items-center gap-4"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-neutral-600" />
            <span className="text-sm font-light tracking-[0.3em] text-neutral-400">
              OUR PORTFOLIO
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8 max-w-4xl text-6xl font-light tracking-tight text-white lg:text-8xl"
          >
            Featured Projects
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12 max-w-2xl text-xl font-light leading-relaxed text-neutral-400"
          >
            Discover our portfolio of exceptional design projects spanning
            residential, commercial, and hospitality sectors across the region.
            Each project tells a unique story of vision, creativity, and
            meticulous execution.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid gap-8 sm:grid-cols-3"
          >
            <div className="border-l-2 border-white pl-6">
              <div className="mb-2 text-4xl font-light text-white">150+</div>
              <div className="text-sm font-light tracking-wider text-neutral-400">
                COMPLETED PROJECTS
              </div>
            </div>
            <div className="border-l-2 border-neutral-700 pl-6">
              <div className="mb-2 text-4xl font-light text-white">8</div>
              <div className="text-sm font-light tracking-wider text-neutral-400">
                INDUSTRIES SERVED
              </div>
            </div>
            <div className="border-l-2 border-neutral-700 pl-6">
              <div className="mb-2 text-4xl font-light text-white">12+</div>
              <div className="text-sm font-light tracking-wider text-neutral-400">
                YEARS EXPERIENCE
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-[1800px] px-6 py-6 lg:px-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-5 w-5 text-neutral-400" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-sm font-light tracking-wider transition-all ${
                    selectedCategory === category
                      ? 'border-b-2 border-neutral-950 text-neutral-950'
                      : 'text-neutral-500 hover:text-neutral-950'
                  }`}
                >
                  {category.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Layout Toggle */}
            <div className="flex items-center gap-2 rounded-full border border-neutral-200 p-1">
              <button
                onClick={() => setGridLayout('masonry')}
                className={`rounded-full p-2 transition-all ${
                  gridLayout === 'masonry'
                    ? 'bg-neutral-950 text-white'
                    : 'text-neutral-400 hover:text-neutral-950'
                }`}
                aria-label="Masonry layout"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setGridLayout('grid')}
                className={`rounded-full p-2 transition-all ${
                  gridLayout === 'grid'
                    ? 'bg-neutral-950 text-white'
                    : 'text-neutral-400 hover:text-neutral-950'
                }`}
                aria-label="Grid layout"
              >
                <Grid3x3 size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="relative bg-white px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1800px]">
          {gridLayout === 'masonry' ? (
            <MasonryGrid projects={filteredProjects} />
          ) : (
            <StandardGrid projects={filteredProjects} />
          )}
        </div>
      </section>

      {/* Related Industries */}
      <section className="relative bg-neutral-50 px-6 py-32 lg:px-12 lg:py-48">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-5xl font-light tracking-tight text-neutral-950 lg:text-6xl">
              Industries We Serve
            </h2>
            <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-neutral-600">
              Our expertise spans multiple sectors, bringing specialized knowledge
              to every project
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {industries.slice(0, 8).map((industry, index) => (
              <IndustryCard key={industry.id} industry={industry} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-neutral-950 px-6 py-32 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-light tracking-tight text-white lg:text-5xl">
            Let's Create Something Extraordinary
          </h2>
          <p className="mb-10 text-lg font-light text-neutral-400">
            Ready to start your next project? Get in touch with our team today.
          </p>
          <Link
            href="#contact"
            className="group inline-flex items-center gap-3 border border-white px-10 py-5 text-sm font-light tracking-widest text-white transition-all hover:bg-white hover:text-neutral-950"
          >
            <span>START YOUR PROJECT</span>
            <ArrowUpRight size={18} className="transition-transform group-hover:rotate-45" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function MasonryGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="columns-1 gap-8 md:columns-2 lg:columns-3 lg:gap-10">
      {projects.map((project, index) => (
        <ProjectCardMasonry key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}

function StandardGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-16">
      {projects.map((project, index) => (
        <ProjectCardGrid key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}

function ProjectCardMasonry({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="group mb-8 break-inside-avoid"
    >
      <Link
        href={`/projects/${project.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950"
      >
        {/* Image */}
        <div className="relative mb-6 overflow-hidden bg-neutral-100">
          <div className="relative aspect-[4/5]">
            <Image
              src={project.featuredImage?.node?.sourceUrl || '/placeholder-project.jpg'}
              alt={project.title}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-105"
            />
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-neutral-950/0 transition-all duration-500 group-hover:bg-neutral-950/40" />

          {/* Hover Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white">
              <ArrowUpRight className="text-white" size={28} />
            </div>
          </div>

          {/* Category Badge */}
          {project.acfFields?.category && (
            <div className="absolute left-6 top-6 bg-white/90 px-4 py-2 text-xs font-light tracking-wider text-neutral-950 backdrop-blur-sm">
              {project.acfFields.category}
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <div className="mb-3 flex items-start justify-between gap-4">
            <h3 className="text-2xl font-light tracking-tight text-neutral-950 transition-colors group-hover:text-neutral-600 lg:text-3xl">
              {project.title}
            </h3>
            {project.acfFields?.year && (
              <span className="shrink-0 text-sm font-light text-neutral-400">
                {project.acfFields.year}
              </span>
            )}
          </div>

          {project.acfFields?.location && (
            <div className="mb-3 flex items-center gap-2 text-sm font-light text-neutral-500">
              <MapPin size={14} />
              <span>{project.acfFields.location}</span>
            </div>
          )}

          {project.acfFields?.description && (
            <p className="line-clamp-3 text-sm font-light leading-relaxed text-neutral-600">
              {project.acfFields.description}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

function ProjectCardGrid({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="group"
    >
      <Link
        href={`/projects/${project.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950"
      >
        {/* Image */}
        <div className="relative mb-6 aspect-[3/4] overflow-hidden bg-neutral-100">
          <Image
            src={project.featuredImage?.node?.sourceUrl || '/placeholder-project.jpg'}
            alt={project.title}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-neutral-950/0 transition-all duration-500 group-hover:bg-neutral-950/30" />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white">
              <ArrowUpRight className="text-white" size={24} />
            </div>
          </div>

          {project.acfFields?.category && (
            <div className="absolute left-4 top-4 bg-white/90 px-3 py-1.5 text-xs font-light tracking-wider text-neutral-950">
              {project.acfFields.category}
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <div className="mb-2 flex items-start justify-between gap-4">
            <h3 className="text-2xl font-light tracking-tight text-neutral-950 transition-colors group-hover:text-neutral-600 lg:text-3xl">
              {project.title}
            </h3>
            {project.acfFields?.year && (
              <span className="shrink-0 text-sm font-light text-neutral-400">
                {project.acfFields.year}
              </span>
            )}
          </div>

          <div className="mb-3 flex items-center gap-3 text-xs font-light tracking-wider text-neutral-500">
            {project.acfFields?.location && (
              <>
                <MapPin size={12} />
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

function IndustryCard({ industry, index }: { industry: Industry; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link
        href="/#industries"
        className="group block border border-neutral-200 p-8 transition-all hover:border-neutral-950 hover:bg-neutral-950"
      >
        <h3 className="mb-2 text-xl font-light tracking-tight text-neutral-950 transition-colors group-hover:text-white">
          {industry.title}
        </h3>
        <p className="text-sm font-light text-neutral-600 transition-colors group-hover:text-neutral-300">
          {industry.excerpt}
        </p>
      </Link>
    </motion.div>
  );
}

// Placeholder projects
const placeholderProjects: Project[] = [
  {
    id: '1',
    title: 'Modern Villa Dubai',
    slug: 'modern-villa-dubai',
    excerpt: 'Contemporary luxury living',
    featuredImage: {
      node: {
        sourceUrl: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80',
        altText: 'Modern Villa Dubai',
      },
    },
    acfFields: {
      category: 'Residential',
      location: 'Dubai Hills',
      year: '2024',
      description: 'A stunning contemporary villa featuring minimalist design, natural materials, and seamless indoor-outdoor living spaces.',
      gallery: [],
    },
  },
  {
    id: '2',
    title: 'Executive Office',
    slug: 'executive-office',
    excerpt: 'Sophisticated workspace design',
    featuredImage: {
      node: {
        sourceUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
        altText: 'Executive Office',
      },
    },
    acfFields: {
      category: 'Commercial',
      location: 'DIFC',
      year: '2024',
      description: 'Elegant executive office space combining functionality with luxury finishes.',
      gallery: [],
    },
  },
  {
    id: '3',
    title: 'Coastal Penthouse',
    slug: 'coastal-penthouse',
    excerpt: 'Oceanfront luxury',
    featuredImage: {
      node: {
        sourceUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
        altText: 'Coastal Penthouse',
      },
    },
    acfFields: {
      category: 'Residential',
      location: 'Palm Jumeirah',
      year: '2023',
      description: 'Breathtaking penthouse with panoramic ocean views.',
      gallery: [],
    },
  },
];
