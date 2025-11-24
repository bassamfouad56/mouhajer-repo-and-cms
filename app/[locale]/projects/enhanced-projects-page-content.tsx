'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Project, Industry } from '@/lib/wordpress';
import { ArrowUpRight, Filter, Grid3x3, LayoutGrid, MapPin, Calendar, Sparkles } from 'lucide-react';
import { getSafeImageUrl, isNonEmptyArray } from '@/lib/error-handling';

interface ProjectsPageContentProps {
  projects: Project[];
  industries: Industry[];
}

export default function EnhancedProjectsPageContent({ projects, industries }: ProjectsPageContentProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [gridLayout, setGridLayout] = useState<'masonry' | 'grid' | 'featured'>('featured');

  // Helper function to safely get project image URL
  const getProjectImageUrl = (project: Project): string => {
    return getSafeImageUrl(
      project.featuredImage?.node,
      'https://placehold.co/1200x800/e5e5e5/737373?text=' + encodeURIComponent(project.title || 'Project')
    );
  };

  const displayProjects = isNonEmptyArray(projects) ? projects : placeholderProjects;

  // Filter projects by category
  const filteredProjects =
    selectedCategory === 'all'
      ? displayProjects
      : displayProjects.filter(
          (project) => project.acfFields?.projectType === selectedCategory
        );

  // Get unique categories
  const categories: string[] = [
    'all',
    ...Array.from(
      new Set(displayProjects.map((p) => p.acfFields?.projectType).filter(Boolean) as string[])
    ),
  ];

  // Featured project (first in list)
  const featuredProject = filteredProjects[0];
  const regularProjects = filteredProjects.slice(1);

  return (
    <main className="relative bg-white">
      {/* Enhanced Hero Section */}
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
            Exceptional Projects
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12 max-w-2xl text-xl font-light leading-relaxed text-neutral-400"
          >
            Discover our curated collection of transformative design projects spanning
            residential luxury, commercial innovation, and hospitality excellence across the region.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid gap-8 sm:grid-cols-3"
          >
            <div className="border-l-2 border-white pl-6">
              <div className="mb-2 text-5xl font-light text-white">150+</div>
              <div className="text-sm font-light tracking-wider text-neutral-400">
                COMPLETED PROJECTS
              </div>
            </div>
            <div className="border-l-2 border-neutral-700 pl-6">
              <div className="mb-2 text-5xl font-light text-white">8</div>
              <div className="text-sm font-light tracking-wider text-neutral-400">
                INDUSTRIES SERVED
              </div>
            </div>
            <div className="border-l-2 border-neutral-700 pl-6">
              <div className="mb-2 text-5xl font-light text-white">100%</div>
              <div className="text-sm font-light tracking-wider text-neutral-400">
                CLIENT SATISFACTION
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Filter Bar */}
      <section className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="mx-auto max-w-[1800px] px-6 py-6 lg:px-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-5 w-5 text-neutral-400" />
              <span className="mr-2 text-xs font-light tracking-wider text-neutral-500">FILTER:</span>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-light tracking-wider transition-all ${
                    selectedCategory === category
                      ? 'bg-neutral-950 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {category.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Layout Toggle */}
            <div className="flex items-center gap-2">
              <span className="mr-2 text-xs font-light tracking-wider text-neutral-500">VIEW:</span>
              <div className="flex items-center gap-1 rounded-full border border-neutral-200 p-1">
                <button
                  onClick={() => setGridLayout('featured')}
                  className={`rounded-full p-2 transition-all ${
                    gridLayout === 'featured'
                      ? 'bg-neutral-950 text-white'
                      : 'text-neutral-400 hover:text-neutral-950'
                  }`}
                  aria-label="Featured layout"
                  title="Featured"
                >
                  <Sparkles size={18} />
                </button>
                <button
                  onClick={() => setGridLayout('masonry')}
                  className={`rounded-full p-2 transition-all ${
                    gridLayout === 'masonry'
                      ? 'bg-neutral-950 text-white'
                      : 'text-neutral-400 hover:text-neutral-950'
                  }`}
                  aria-label="Masonry layout"
                  title="Masonry"
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
                  title="Grid"
                >
                  <Grid3x3 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Display */}
      <section className="relative bg-white px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1800px]">
          {gridLayout === 'featured' && <FeaturedLayout featured={featuredProject} projects={regularProjects} />}
          {gridLayout === 'masonry' && <MasonryGrid projects={filteredProjects} />}
          {gridLayout === 'grid' && <StandardGrid projects={filteredProjects} />}
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
            Ready to Create Your Dream Space?
          </h2>
          <p className="mb-10 text-lg font-light text-neutral-400">
            Let&apos;s transform your vision into reality with our expert design team.
          </p>
          <Link
            href="/#contact"
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

// Featured Layout - Hero project + grid
function FeaturedLayout({ featured, projects }: { featured: Project | undefined; projects: Project[] }) {
  if (!featured) return <StandardGrid projects={projects} />;

  return (
    <div className="space-y-16">
      <FeaturedProjectCard project={featured} />
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-16">
        {projects.map((project, index) => (
          <ProjectCardGrid key={project.id} project={project} index={index} />
        ))}
      </div>
    </div>
  );
}

// Featured Project Card
function FeaturedProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="group grid gap-12 overflow-hidden lg:grid-cols-2"
    >
      <Link href={`/projects/${project.slug}`} className="relative aspect-[4/3] lg:aspect-auto">
        <div className="relative h-full overflow-hidden bg-neutral-100">
          <Image
            src={getProjectImageUrl(project)}
            alt={project.title || 'Project'}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-neutral-950/0 transition-all duration-500 group-hover:bg-neutral-950/20" />
        </div>
      </Link>

      <div className="flex flex-col justify-center py-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-xs font-light tracking-wider text-neutral-600 w-fit">
          <Sparkles size={14} />
          FEATURED PROJECT
        </div>

        <Link href={`/projects/${project.slug}`}>
          <h2 className="mb-4 text-4xl font-light tracking-tight text-neutral-950 transition-colors group-hover:text-neutral-600 lg:text-5xl">
            {project.title}
          </h2>
        </Link>

        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm font-light text-neutral-500">
          {project.acfFields?.projectType && (
            <span className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-neutral-400" />
              {project.acfFields.projectType}
            </span>
          )}
          {project.acfFields?.location && (
            <span className="flex items-center gap-2">
              <MapPin size={14} />
              {project.acfFields.location}
            </span>
          )}
          {project.acfFields?.yearCompleted && (
            <span className="flex items-center gap-2">
              <Calendar size={14} />
              {project.acfFields.yearCompleted}
            </span>
          )}
        </div>

        {project.acfFields?.projectDescription && (
          <p className="mb-8 text-lg font-light leading-relaxed text-neutral-600">
            {project.acfFields.projectDescription.substring(0, 200)}...
          </p>
        )}

        <Link
          href={`/projects/${project.slug}`}
          className="group/link inline-flex items-center gap-3 border-b-2 border-neutral-950 pb-1 text-sm font-light tracking-widest text-neutral-950 transition-all hover:gap-5 w-fit"
        >
          <span>VIEW PROJECT</span>
          <ArrowUpRight size={18} className="transition-transform group-hover/link:rotate-45" />
        </Link>
      </div>
    </motion.div>
  );
}

// Masonry Grid and Standard Grid components remain the same as before...
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
        <div className="relative mb-6 overflow-hidden bg-neutral-100">
          <div className="relative aspect-[4/5]">
            <Image
              src={getProjectImageUrl(project)}
              alt={project.title}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-neutral-950/0 transition-all duration-500 group-hover:bg-neutral-950/40" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white">
              <ArrowUpRight className="text-white" size={28} />
            </div>
          </div>
          {project.acfFields?.projectType && (
            <div className="absolute left-6 top-6 bg-white/90 px-4 py-2 text-xs font-light tracking-wider text-neutral-950 backdrop-blur-sm">
              {project.acfFields.projectType}
            </div>
          )}
        </div>

        <div>
          <div className="mb-3 flex items-start justify-between gap-4">
            <h3 className="text-2xl font-light tracking-tight text-neutral-950 transition-colors group-hover:text-neutral-600 lg:text-3xl">
              {project.title}
            </h3>
            {project.acfFields?.yearCompleted && (
              <span className="shrink-0 text-sm font-light text-neutral-400">
                {project.acfFields.yearCompleted}
              </span>
            )}
          </div>
          {project.acfFields?.location && (
            <div className="mb-3 flex items-center gap-2 text-sm font-light text-neutral-500">
              <MapPin size={14} />
              <span>{project.acfFields.location}</span>
            </div>
          )}
          {project.acfFields?.projectDescription && (
            <p className="line-clamp-3 text-sm font-light leading-relaxed text-neutral-600">
              {project.acfFields.projectDescription}
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
        <div className="relative mb-6 aspect-[3/4] overflow-hidden bg-neutral-100">
          <Image
            src={getProjectImageUrl(project)}
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
          {project.acfFields?.projectType && (
            <div className="absolute left-4 top-4 bg-white/90 px-3 py-1.5 text-xs font-light tracking-wider text-neutral-950">
              {project.acfFields.projectType}
            </div>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-start justify-between gap-4">
            <h3 className="text-2xl font-light tracking-tight text-neutral-950 transition-colors group-hover:text-neutral-600 lg:text-3xl">
              {project.title}
            </h3>
            {project.acfFields?.yearCompleted && (
              <span className="shrink-0 text-sm font-light text-neutral-400">
                {project.acfFields.yearCompleted}
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
          {project.acfFields?.projectDescription && (
            <p className="line-clamp-2 text-sm font-light leading-relaxed text-neutral-600">
              {project.acfFields.projectDescription}
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
    databaseId: 1,
    title: 'Sheraton Abu Dhabi Hotel & Resort',
    slug: 'sheraton-abu-dhabi-hotel-resort',
    excerpt: 'Luxurious beachfront resort',
    date: new Date().toISOString(),
    modified: new Date().toISOString(),
    featuredImage: {
      node: {
        sourceUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80',
        altText: 'Sheraton Abu Dhabi',
      },
    },
    acfFields: {
      projectType: 'Hospitality',
      location: 'Abu Dhabi, UAE',
      yearCompleted: '2023',
      projectDescription: 'A transformative hospitality project spanning 50,000 square meters of luxury resort design.',
      gallery: [],
    },
  },
  {
    id: '2',
    databaseId: 2,
    title: 'Downtown Luxury Penthouse',
    slug: 'downtown-luxury-penthouse',
    excerpt: 'Ultra-modern penthouse',
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    modified: new Date(Date.now() - 86400000 * 3).toISOString(),
    featuredImage: {
      node: {
        sourceUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
        altText: 'Penthouse',
      },
    },
    acfFields: {
      projectType: 'Residential',
      location: 'Dubai, UAE',
      yearCompleted: '2024',
      projectDescription: 'An 800-square-meter penthouse transformation featuring bespoke design elements.',
      gallery: [],
    },
  },
  {
    id: '3',
    databaseId: 3,
    title: 'Corporate Headquarters',
    slug: 'corporate-headquarters-redesign',
    excerpt: 'Modern workspace design',
    date: new Date(Date.now() - 86400000 * 7).toISOString(),
    modified: new Date(Date.now() - 86400000 * 7).toISOString(),
    featuredImage: {
      node: {
        sourceUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
        altText: 'Office',
      },
    },
    acfFields: {
      projectType: 'Commercial',
      location: 'DIFC, Dubai',
      yearCompleted: '2023',
      projectDescription: 'Complete reimagining of 3,000 square meters of corporate office space.',
      gallery: [],
    },
  },
];
