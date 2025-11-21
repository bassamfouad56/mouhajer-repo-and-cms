'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Industry, Service, Project } from '@/lib/wordpress';
import {
  Building2,
  Home,
  Hotel,
  Store,
  Hospital,
  GraduationCap,
  Utensils,
  Briefcase,
  ArrowRight,
  Users,
  Award,
  TrendingUp,
  ChevronRight,
  MapPin,
  Calendar,
  ArrowUpRight,
} from 'lucide-react';

interface IndustriesPageContentProps {
  industries: Industry[];
  services: Service[];
  projects: Project[];
}

export default function EnhancedIndustriesPageContent({
  industries,
  services,
  projects,
}: IndustriesPageContentProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });

  // Use placeholder industries if none from WordPress
  const displayIndustries = industries.length > 0 ? industries : placeholderIndustries;

  return (
    <main className="relative bg-white">
      {/* Enhanced Hero Section */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 px-6 py-32 lg:px-12 lg:py-48"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-[1400px]">
          {/* Breadcrumbs */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-8 flex items-center gap-2 text-sm font-light text-neutral-400"
          >
            <Link
              href="/"
              className="transition-colors hover:text-white"
            >
              Home
            </Link>
            <ChevronRight size={16} />
            <span className="text-white">Industries</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-8 flex items-center gap-4"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-neutral-600" />
            <span className="text-sm font-light tracking-[0.3em] text-neutral-400">
              WHO WE SERVE
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8 max-w-4xl text-6xl font-light tracking-tight text-white lg:text-8xl"
          >
            Industries We Transform
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12 max-w-2xl text-xl font-light leading-relaxed text-neutral-400"
          >
            Bringing expertise and innovation across diverse sectors, creating
            spaces that inspire and elevate every industry we touch.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid gap-8 sm:grid-cols-3"
          >
            <div className="border-l-2 border-white pl-6">
              <div className="mb-2 text-5xl font-light text-white">8+</div>
              <div className="text-sm font-light tracking-wider text-neutral-400">
                INDUSTRIES SERVED
              </div>
            </div>
            <div className="border-l-2 border-neutral-700 pl-6">
              <div className="mb-2 text-5xl font-light text-white">150+</div>
              <div className="text-sm font-light tracking-wider text-neutral-400">
                COMPLETED PROJECTS
              </div>
            </div>
            <div className="border-l-2 border-neutral-700 pl-6">
              <div className="mb-2 text-5xl font-light text-white">98%</div>
              <div className="text-sm font-light tracking-wider text-neutral-400">
                CLIENT SATISFACTION
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="relative bg-white px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
              Sectors We Excel In
            </h2>
            <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-neutral-600">
              From residential luxury to commercial innovation, we bring specialized expertise to every industry
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {displayIndustries.map((industry, index) => (
              <IndustryCard
                key={industry.id}
                industry={industry}
                index={index}
                projectsCount={projects.filter(p =>
                  p.acfFields?.services?.includes(industry.id) ||
                  industry.acfFields?.relatedProjects?.includes(p.id)
                ).length}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects by Industry */}
      <section className="relative bg-neutral-50 px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
              Featured Industry Projects
            </h2>
            <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-neutral-600">
              Explore our portfolio of transformative projects across different sectors
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 6).map((project, index) => (
              <FeaturedProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-3 border-b-2 border-neutral-950 pb-1 text-sm font-light tracking-widest text-neutral-950 transition-all hover:gap-5"
            >
              <span>VIEW ALL PROJECTS</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-neutral-950 px-6 py-32 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-light tracking-tight text-white lg:text-5xl">
            Ready to Transform Your Industry?
          </h2>
          <p className="mb-10 text-lg font-light text-neutral-400">
            Let&apos;s discuss how we can bring our expertise to your sector and create something exceptional.
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

// Industry Card Component
function IndustryCard({
  industry,
  index,
  projectsCount,
}: {
  industry: Industry;
  index: number;
  projectsCount: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });
  const [isHovered, setIsHovered] = useState(false);

  // Get icon component based on industry title
  const getIcon = (title: string) => {
    const iconMap: { [key: string]: typeof Home } = {
      'Residential': Home,
      'Commercial': Building2,
      'Hospitality': Hotel,
      'Retail': Store,
      'Healthcare': Hospital,
      'Education': GraduationCap,
      'Restaurant & F&B': Utensils,
      'Corporate': Briefcase,
    };
    const IconComponent = iconMap[title] || Building2;
    return <IconComponent className="h-6 w-6" />;
  };

  const projectCount = industry.acfFields?.stats?.projectsCompleted || projectsCount || 0;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.05 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/industries/${industry.slug}`} className="block h-full">
        {/* Card */}
        <div className="relative h-full overflow-hidden border border-neutral-200 bg-white transition-all duration-500 hover:border-neutral-400 hover:shadow-lg">
          {/* Top Border */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent transition-all duration-500 group-hover:via-neutral-500" />

          <div className="p-8">
            {/* Icon & Number */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 transition-all duration-500 group-hover:border-neutral-950 group-hover:text-neutral-950">
                {getIcon(industry.title)}
              </div>
              <span className="text-4xl font-light text-neutral-200 transition-colors duration-500 group-hover:text-neutral-300">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            {/* Title */}
            <h3 className="mb-4 text-xl font-light tracking-tight text-neutral-950 transition-all duration-500 lg:text-2xl group-hover:text-neutral-700">
              {industry.title}
            </h3>

            {/* Description */}
            <p className="mb-6 text-sm font-light leading-relaxed text-neutral-600 transition-colors duration-500">
              {(industry.excerpt || industry.acfFields?.description || '').replace(/<[^>]*>/g, '')}
            </p>

            {/* Stats */}
            <div className="mb-6 flex items-center gap-6 text-xs font-light text-neutral-500 transition-colors duration-500">
              {projectCount > 0 && (
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} />
                  <span>{projectCount} Projects</span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="mb-4 h-px w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent transition-all duration-500" />

            {/* Learn More */}
            <div className="flex items-center gap-2 text-xs font-light tracking-wider text-neutral-500 transition-all group-hover:gap-4 group-hover:text-neutral-950">
              <span>LEARN MORE</span>
              <motion.div
                animate={{
                  x: isHovered ? [0, 4, 0] : 0,
                }}
                transition={{
                  duration: 1,
                  repeat: isHovered ? Infinity : 0,
                  ease: "easeInOut",
                }}
              >
                <ArrowRight size={14} />
              </motion.div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-neutral-950/5 blur-3xl transition-all duration-500 group-hover:bg-neutral-950/10" />
        </div>
      </Link>
    </motion.div>
  );
}

// Featured Project Card
function FeaturedProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950"
      >
        <div className="relative mb-6 aspect-[4/3] overflow-hidden bg-neutral-100">
          <Image
            src={project.featuredImage?.node?.sourceUrl || '/placeholder-project.jpg'}
            alt={project.title}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105"
          />
          <motion.div
            className="absolute inset-0"
            animate={{
              background: isHovered
                ? 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)'
                : 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%)',
            }}
            transition={{ duration: 0.5 }}
          />
          {project.acfFields?.projectType && (
            <div className="absolute left-4 top-4 bg-white/90 px-3 py-1.5 text-xs font-light tracking-wider text-neutral-950 backdrop-blur-sm">
              {project.acfFields.projectType}
            </div>
          )}
        </div>

        <div>
          <motion.h3
            className="mb-2 text-xl font-light tracking-tight text-neutral-950 lg:text-2xl"
            animate={{
              color: isHovered ? '#525252' : '#0a0a0a',
            }}
            transition={{ duration: 0.3 }}
          >
            {project.title}
          </motion.h3>
          {project.acfFields?.location && (
            <div className="mb-2 flex items-center gap-2 text-sm font-light text-neutral-500">
              <MapPin size={14} />
              <span>{project.acfFields.location}</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

// Placeholder industries
const placeholderIndustries: Industry[] = [
  {
    id: '1',
    databaseId: 1,
    slug: 'residential',
    date: new Date().toISOString(),
    modified: new Date().toISOString(),
    title: 'Residential',
    excerpt: 'Luxury homes, villas, and apartments designed for modern living',
    content: '',
    featuredImage: { node: { sourceUrl: '', altText: '' } },
    acfFields: {
      stats: { projectsCompleted: 45, yearsExperience: 10, clientsSatisfied: 98 },
      relatedServices: ['1', '2', '3'],
    },
  },
  {
    id: '2',
    databaseId: 2,
    slug: 'commercial',
    date: new Date(Date.now() - 86400000).toISOString(),
    modified: new Date(Date.now() - 86400000).toISOString(),
    title: 'Commercial',
    excerpt: 'Professional office spaces that inspire productivity and innovation',
    content: '',
    featuredImage: { node: { sourceUrl: '', altText: '' } },
    acfFields: {
      stats: { projectsCompleted: 32, yearsExperience: 8, clientsSatisfied: 95 },
      relatedServices: ['5', '6'],
    },
  },
  {
    id: '3',
    databaseId: 3,
    slug: 'hospitality',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    modified: new Date(Date.now() - 86400000 * 2).toISOString(),
    title: 'Hospitality',
    excerpt: 'Hotels, resorts, and boutique stays that create memorable experiences',
    content: '',
    featuredImage: { node: { sourceUrl: '', altText: '' } },
    acfFields: {
      stats: { projectsCompleted: 18, yearsExperience: 7, clientsSatisfied: 100 },
      relatedServices: ['1', '4'],
    },
  },
  {
    id: '4',
    databaseId: 4,
    slug: 'retail',
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    modified: new Date(Date.now() - 86400000 * 3).toISOString(),
    title: 'Retail',
    excerpt: 'Engaging retail environments that enhance customer experience',
    content: '',
    featuredImage: { node: { sourceUrl: '', altText: '' } },
    acfFields: {
      stats: { projectsCompleted: 25, yearsExperience: 6, clientsSatisfied: 97 },
      relatedServices: ['2', '4'],
    },
  },
  {
    id: '5',
    databaseId: 5,
    slug: 'healthcare',
    date: new Date(Date.now() - 86400000 * 4).toISOString(),
    modified: new Date(Date.now() - 86400000 * 4).toISOString(),
    title: 'Healthcare',
    excerpt: 'Healing environments that prioritize comfort and functionality',
    content: '',
    featuredImage: { node: { sourceUrl: '', altText: '' } },
    acfFields: {
      stats: { projectsCompleted: 12, yearsExperience: 5, clientsSatisfied: 100 },
    },
  },
  {
    id: '6',
    databaseId: 6,
    slug: 'education',
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    modified: new Date(Date.now() - 86400000 * 5).toISOString(),
    title: 'Education',
    excerpt: 'Inspiring learning spaces for schools, universities, and training centers',
    content: '',
    featuredImage: { node: { sourceUrl: '', altText: '' } },
    acfFields: {
      stats: { projectsCompleted: 8, yearsExperience: 4, clientsSatisfied: 96 },
    },
  },
  {
    id: '7',
    databaseId: 7,
    slug: 'restaurant-fnb',
    date: new Date(Date.now() - 86400000 * 6).toISOString(),
    modified: new Date(Date.now() - 86400000 * 6).toISOString(),
    title: 'Restaurant & F&B',
    excerpt: 'Dining spaces that blend ambiance with operational excellence',
    content: '',
    featuredImage: { node: { sourceUrl: '', altText: '' } },
    acfFields: {
      stats: { projectsCompleted: 22, yearsExperience: 6, clientsSatisfied: 99 },
      relatedServices: ['1', '3', '4'],
    },
  },
  {
    id: '8',
    databaseId: 8,
    slug: 'corporate',
    date: new Date(Date.now() - 86400000 * 7).toISOString(),
    modified: new Date(Date.now() - 86400000 * 7).toISOString(),
    title: 'Corporate',
    excerpt: 'Executive offices and workspaces that reflect brand excellence',
    content: '',
    featuredImage: { node: { sourceUrl: '', altText: '' } },
    acfFields: {
      stats: { projectsCompleted: 28, yearsExperience: 7, clientsSatisfied: 98 },
      relatedServices: ['5', '6'],
    },
  },
];
