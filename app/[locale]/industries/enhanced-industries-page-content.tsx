'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';
import { ArrowRight, Building2, Hotel, Home, Briefcase, ShoppingBag, Utensils } from 'lucide-react';

// Helper to extract localized string
function getLocalizedString(value: string | { ar?: string; en?: string } | undefined, locale: string = 'en'): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    return value[locale as keyof typeof value] || value.en || value.ar || '';
  }
  return '';
}

// Helper to get safe image URL from Sanity
function getSafeImageUrl(image: any, width: number, height: number): string {
  if (!image) return '';
  try {
    const url = urlForImage(image)?.width(width).height(height).quality(85).url();
    return url || '';
  } catch {
    return '';
  }
}

// Fallback images for industries (mapped by slug)
const INDUSTRY_FALLBACK_IMAGES: Record<string, string> = {
  'hospitality': '/projects/grand-hyatt-prince-suite/prince02.jpg',
  'residential': '/projects/jumeirah-island-villa/JumIsl01.jpg',
  'commercial': '/projects/district-one-villa-79x/01.jpg',
  'corporate': '/projects/park-hyatt-villa/hotelparkhyattvilla03.jpg',
  'retail': '/projects/ritz-carlton-villas/ritzcarl01.jpg',
  'food-beverage': '/projects/grand-hyatt-prince-suite/prince01.jpg',
};

// Default fallback if no specific match
const DEFAULT_INDUSTRY_IMAGE = '/projects/grand-hyatt-prince-suite/prince02.jpg';

// Icon mapping for industries
const industryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  residential: Home,
  commercial: Building2,
  hospitality: Hotel,
  retail: ShoppingBag,
  corporate: Briefcase,
  'food-beverage': Utensils,
};

interface SanityIndustry {
  _id: string;
  title: string | { ar?: string; en?: string };
  slug: { current: string };
  excerpt?: string | { ar?: string; en?: string };
  mainImage?: any;
  icon?: string;
  featured?: boolean;
  order?: number;
}

interface SanityProject {
  _id: string;
  title: string | { ar?: string; en?: string };
  slug: { current: string };
  mainImage?: any;
  category?: string | { ar?: string; en?: string };
  location?: string | { ar?: string; en?: string };
}

interface IndustriesPageContentProps {
  industries: SanityIndustry[];
  services: any[];
  projects: SanityProject[];
}

export default function EnhancedIndustriesPageContent({
  industries,
  projects,
}: IndustriesPageContentProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const [hoveredIndustry, setHoveredIndustry] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  // Get featured industry image for hero background with fallback
  const featuredIndustry = industries.find(i => i.featured) || industries[0];
  const heroSanityUrl = getSafeImageUrl(featuredIndustry?.mainImage, 1920, 1080);
  const heroFallback = featuredIndustry?.slug?.current
    ? INDUSTRY_FALLBACK_IMAGES[featuredIndustry.slug.current] || DEFAULT_INDUSTRY_IMAGE
    : DEFAULT_INDUSTRY_IMAGE;
  const heroImageUrl = heroSanityUrl || heroFallback;

  return (
    <main className="relative bg-white">
      {/* Cinematic Hero with Industry Image */}
      <section
        ref={heroRef}
        className="relative h-[70vh] min-h-[600px] overflow-hidden"
      >
        {/* Background Image */}
        <motion.div
          style={{ scale: heroScale }}
          className="absolute inset-0"
        >
          <Image
            src={heroImageUrl}
            alt="Industries we serve"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/50 to-neutral-950/90" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 lg:px-24 lg:pb-24"
        >
          <div className="mx-auto w-full max-w-[1600px]">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6 flex items-center gap-2 font-Satoshi text-[11px] uppercase tracking-[0.2em] text-white/50"
            >
              <Link href="/" className="transition-colors hover:text-white/80">Home</Link>
              <span>/</span>
              <span className="text-white/80">Industries</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 font-SchnyderS text-5xl font-light tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Industries We Serve
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-white/70"
            >
              Specialized expertise across sectors. From luxury hospitality to high-end residential,
              we bring 24 years of precision to every industry.
            </motion.p>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 flex gap-12"
            >
              <div>
                <div className="font-SchnyderS text-4xl font-light text-[#d4af37]">{industries.length}+</div>
                <div className="font-Satoshi text-[10px] uppercase tracking-[0.2em] text-white/50">Industries</div>
              </div>
              <div>
                <div className="font-SchnyderS text-4xl font-light text-[#d4af37]">400+</div>
                <div className="font-Satoshi text-[10px] uppercase tracking-[0.2em] text-white/50">Projects</div>
              </div>
              <div>
                <div className="font-SchnyderS text-4xl font-light text-[#d4af37]">24</div>
                <div className="font-Satoshi text-[10px] uppercase tracking-[0.2em] text-white/50">Years</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Industries Grid - Large Visual Cards */}
      <section className="bg-white px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1600px]">
          {/* Section Header */}
          <div className="mb-16 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h2 className="mb-4 font-SchnyderS text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                Specialized Sectors
              </h2>
              <p className="max-w-lg font-Satoshi text-base font-light text-neutral-600">
                Deep industry knowledge combined with design excellence
              </p>
            </div>
            <div className="font-Satoshi text-sm text-neutral-400">
              {industries.length} Industries
            </div>
          </div>

          {/* Industries Bento Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {industries.map((industry, index) => (
              <IndustryCard
                key={industry._id}
                industry={industry}
                index={index}
                isHovered={hoveredIndustry === industry._id}
                onHover={() => setHoveredIndustry(industry._id)}
                onLeave={() => setHoveredIndustry(null)}
                isLarge={index === 0 || index === 3}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects from Industries */}
      {projects.length > 0 && (
        <section className="bg-neutral-50 px-6 py-20 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h2 className="mb-4 font-SchnyderS text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                  Recent Work
                </h2>
                <p className="font-Satoshi text-base font-light text-neutral-600">
                  Selected projects across all industries
                </p>
              </div>
              <Link
                href="/projects"
                className="group hidden items-center gap-2 font-Satoshi text-sm font-medium text-neutral-950 transition-colors hover:text-[#d4af37] lg:flex"
              >
                View All Projects
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Projects Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {projects.slice(0, 8).map((project, index) => (
                <ProjectCard key={project._id} project={project} index={index} />
              ))}
            </div>

            {/* Mobile View All */}
            <div className="mt-10 text-center lg:hidden">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 font-Satoshi text-sm font-medium text-neutral-950"
              >
                View All Projects
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-neutral-950 px-6 py-24 lg:px-12 lg:py-32">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-SchnyderS text-4xl font-light tracking-tight text-white lg:text-5xl">
            Your Industry, Our Expertise
          </h2>
          <p className="mb-10 font-Satoshi text-lg font-light text-neutral-400">
            Discuss your project with our team
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 border border-[#d4af37] bg-[#d4af37] px-10 py-4 font-Satoshi text-xs uppercase tracking-[0.2em] text-neutral-950 transition-all duration-300 hover:bg-transparent hover:text-[#d4af37]"
          >
            Start a Conversation
            <ArrowRight className="h-4 w-4" />
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
  isHovered,
  onHover,
  onLeave,
  isLarge
}: {
  industry: SanityIndustry;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  isLarge?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  const title = getLocalizedString(industry.title);
  const excerpt = getLocalizedString(industry.excerpt);
  const IconComponent = industryIcons[industry.slug?.current] || Building2;

  // Get image URL with fallback
  const sanityImageUrl = getSafeImageUrl(industry.mainImage, 800, isLarge ? 900 : 600);
  const fallbackImage = INDUSTRY_FALLBACK_IMAGES[industry.slug?.current] || DEFAULT_INDUSTRY_IMAGE;
  const imageUrl = sanityImageUrl || fallbackImage;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`group ${isLarge ? 'md:col-span-2 lg:col-span-1 lg:row-span-2' : ''}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <Link href={`/industries/${industry.slug.current}`} className="block">
        <div className={`relative overflow-hidden bg-neutral-100 ${isLarge ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
          <motion.div
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
            {/* Icon Badge */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
              <IconComponent className="h-5 w-5 text-white" />
            </div>

            {/* Title */}
            <h3 className="mb-2 font-SchnyderS text-2xl font-light tracking-tight text-white lg:text-3xl">
              {title}
            </h3>

            {/* Excerpt */}
            {excerpt && (
              <p className="line-clamp-2 font-Satoshi text-sm font-light text-white/70">
                {excerpt}
              </p>
            )}

            {/* Arrow */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <div className="flex items-center gap-2 font-Satoshi text-xs uppercase tracking-[0.2em] text-[#d4af37]">
                Explore
                <ArrowRight className="h-3 w-3" />
              </div>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Project fallback images
const PROJECT_FALLBACK_IMAGES = [
  '/projects/jumeirah-island-villa/JumIsl01.jpg',
  '/projects/park-hyatt-villa/hotelparkhyattvilla03.jpg',
  '/projects/district-one-villa-79x/01.jpg',
  '/projects/ritz-carlton-villas/ritzcarl01.jpg',
];

// Project Card Component
function ProjectCard({ project, index }: { project: SanityProject; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  const title = getLocalizedString(project.title);
  const category = getLocalizedString(project.category);
  const location = getLocalizedString(project.location);

  // Get image URL with fallback
  const sanityImageUrl = getSafeImageUrl(project.mainImage, 600, 450);
  const imageUrl = sanityImageUrl || PROJECT_FALLBACK_IMAGES[index % PROJECT_FALLBACK_IMAGES.length];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={`/projects/${project.slug.current}`}>
        <div className="relative mb-4 aspect-[4/3] overflow-hidden bg-neutral-100">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
            />
          </motion.div>

          {category && (
            <div className="absolute left-3 top-3 bg-white/90 px-2.5 py-1 backdrop-blur-sm">
              <span className="font-Satoshi text-[10px] uppercase tracking-[0.15em] text-neutral-950">
                {category}
              </span>
            </div>
          )}
        </div>

        <h3 className="mb-1 font-Satoshi text-sm font-medium text-neutral-950 transition-colors group-hover:text-[#d4af37]">
          {title}
        </h3>

        {location && (
          <p className="font-Satoshi text-xs text-neutral-500">{location}</p>
        )}
      </Link>
    </motion.div>
  );
}
