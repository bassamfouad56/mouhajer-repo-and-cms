'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';

// Helper to extract localized string from i18n object or return plain string
function getLocalizedString(value: string | { ar?: string; en?: string } | undefined, locale: string = 'en'): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    return value[locale as keyof typeof value] || value.en || value.ar || '';
  }
  return '';
}

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

interface SanityService {
  _id: string;
  title: string | { ar?: string; en?: string };
  slug: { current: string };
  excerpt?: string | { ar?: string; en?: string };
  mainImage?: any;
}

interface SanityProject {
  _id: string;
  title: string | { ar?: string; en?: string };
  slug: { current: string };
  excerpt?: string | { ar?: string; en?: string };
  mainImage?: any;
  category?: string | { ar?: string; en?: string };
  location?: string | { ar?: string; en?: string };
  year?: string;
}

interface IndustriesPageContentProps {
  industries: SanityIndustry[];
  services: SanityService[];
  projects: SanityProject[];
}

export default function EnhancedIndustriesPageContent({
  industries,
  services,
  projects,
}: IndustriesPageContentProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <main className="relative bg-white">
      {/* Professional Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen min-h-[800px] overflow-hidden bg-neutral-950"
      >
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />

        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/50 via-neutral-950/80 to-black" />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 flex h-full flex-col items-start justify-center px-6 lg:px-24"
        >
          <div className="max-w-[1400px]">
            {/* Minimal Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-8 font-Satoshi text-[10px] uppercase tracking-[0.3em] text-white/40"
            >
              Who We Serve
            </motion.div>

            {/* Hero Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8 font-SchnyderS text-6xl font-light tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl"
            >
              Every Industry.
              <br />
              <span className="text-[#d4af37]">One Standard.</span>
            </motion.h1>

            {/* Hero Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-16 max-w-2xl font-Satoshi text-xl font-light leading-relaxed text-white/60 sm:text-2xl"
            >
              From five-star hotels to private villas. From hospitals to retail flagships.
              <br />24 years of specialized expertise.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-12 sm:grid-cols-3"
            >
              <div>
                <div className="mb-2 font-SchnyderS text-6xl font-light text-white">8+</div>
                <div className="font-Satoshi text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                  Industries Served
                </div>
              </div>
              <div>
                <div className="mb-2 font-SchnyderS text-6xl font-light text-white">400+</div>
                <div className="font-Satoshi text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                  Projects Delivered
                </div>
              </div>
              <div>
                <div className="mb-2 font-SchnyderS text-6xl font-light text-white">100%</div>
                <div className="font-Satoshi text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                  Handover Success
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Industries Grid - Image First */}
      <section className="relative bg-white px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-16 text-center">
            <h2 className="mb-6 font-SchnyderS text-5xl font-light tracking-tight text-neutral-950 lg:text-6xl">
              Specialized Sectors
            </h2>
            <p className="mx-auto max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-neutral-600">
              Deep industry knowledge. Proven track record. Zero compromises.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {industries.map((industry, index) => (
              <IndustryCard key={industry._id} industry={industry} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {projects.length > 0 && (
        <section className="relative bg-neutral-50 px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-16 text-center">
              <h2 className="mb-6 font-SchnyderS text-5xl font-light tracking-tight text-neutral-950 lg:text-6xl">
                Cross-Industry Excellence
              </h2>
              <p className="mx-auto max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-neutral-600">
                Selected projects that showcase our versatility
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.slice(0, 6).map((project, index) => (
                <FeaturedProjectCard key={project._id} project={project} index={index} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/projects"
                className="inline-block border-b-2 border-neutral-950 pb-1 font-Satoshi text-xs uppercase tracking-[0.3em] text-neutral-950 transition-all duration-500 hover:border-neutral-400 hover:text-neutral-400"
              >
                View All Projects
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Related Services */}
      {services.length > 0 && (
        <section className="relative bg-white px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-16 text-center">
              <h2 className="mb-6 font-SchnyderS text-5xl font-light tracking-tight text-neutral-950 lg:text-6xl">
                Our Services
              </h2>
              <p className="mx-auto max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-neutral-600">
                Five integrated pillars. One seamless experience.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
              {services.slice(0, 5).map((service, index) => (
                <ServiceCard key={service._id} service={service} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Professional CTA Section */}
      <section className="relative bg-neutral-950 px-6 py-32 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 font-SchnyderS text-4xl font-light tracking-tight text-white lg:text-5xl">
            Your Industry. Our Expertise.
          </h2>
          <p className="mb-10 font-Satoshi text-lg font-light text-neutral-400">
            Let&apos;s discuss how we can bring 24 years of experience to your project.
          </p>
          <Link
            href="/#contact"
            className="inline-block border border-white px-12 py-4 font-Satoshi text-xs uppercase tracking-[0.3em] text-white transition-all duration-500 hover:bg-white hover:text-neutral-950"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </main>
  );
}

// Industry Card - Image First, Minimal
function IndustryCard({ industry, index }: { industry: SanityIndustry; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });

  const title = getLocalizedString(industry.title);
  const excerpt = getLocalizedString(industry.excerpt);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={`/industries/${industry.slug.current}`}>
        {/* Large Image */}
        <div className="relative mb-6 aspect-[4/5] overflow-hidden bg-neutral-100">
          {industry.mainImage ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={urlForImage(industry.mainImage).width(800).height(1000).url()}
                alt={title}
                fill
                className="object-cover"
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-neutral-200" />
          )}

          {/* Minimal Number Badge */}
          <div className="absolute left-6 top-6 bg-white/90 px-4 py-2 backdrop-blur-sm">
            <div className="font-Satoshi text-[10px] uppercase tracking-[0.3em] text-neutral-950">
              {String(index + 1).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Content - Minimal */}
        <div>
          <h3 className="mb-3 font-SchnyderS text-3xl font-light tracking-tight text-neutral-950 transition-colors duration-500 group-hover:text-neutral-600">
            {title}
          </h3>

          {excerpt && (
            <p className="line-clamp-2 font-Satoshi text-sm font-light leading-relaxed text-neutral-600">
              {excerpt}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

// Featured Project Card - Minimal
function FeaturedProjectCard({ project, index }: { project: SanityProject; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  const title = getLocalizedString(project.title);
  const category = getLocalizedString(project.category);
  const location = getLocalizedString(project.location);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={`/projects/${project.slug.current}`}>
        <div className="relative mb-6 aspect-[4/3] overflow-hidden bg-neutral-100">
          {project.mainImage ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={urlForImage(project.mainImage).width(800).height(600).url()}
                alt={title}
                fill
                className="object-cover"
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-neutral-200" />
          )}

          {category && (
            <div className="absolute left-4 top-4 bg-white/90 px-3 py-1.5 backdrop-blur-sm">
              <div className="font-Satoshi text-[10px] uppercase tracking-[0.3em] text-neutral-950">
                {category}
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-2 font-SchnyderS text-2xl font-light tracking-tight text-neutral-950 transition-colors duration-500 group-hover:text-neutral-600">
            {title}
          </h3>

          <div className="flex flex-wrap items-center gap-3 font-Satoshi text-xs font-light text-neutral-500">
            {location && <span>{location}</span>}
            {project.year && (
              <>
                <span className="h-1 w-1 rounded-full bg-neutral-300" />
                <span>{project.year}</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Service Card - Minimal
function ServiceCard({ service, index }: { service: SanityService; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  const title = getLocalizedString(service.title);
  const excerpt = getLocalizedString(service.excerpt);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/services#${service.slug.current}`}
        className="group block border border-neutral-200 p-8 transition-all duration-500 hover:border-neutral-950 hover:bg-neutral-950"
      >
        <div className="mb-4 font-Satoshi text-[10px] uppercase tracking-[0.3em] text-neutral-400 transition-colors duration-500 group-hover:text-neutral-500">
          {String(index + 1).padStart(2, '0')}
        </div>
        <h3 className="mb-2 font-SchnyderS text-xl font-light tracking-tight text-neutral-950 transition-colors duration-500 group-hover:text-white">
          {title}
        </h3>
        {excerpt && (
          <p className="line-clamp-2 font-Satoshi text-sm font-light text-neutral-600 transition-colors duration-500 group-hover:text-neutral-300">
            {excerpt}
          </p>
        )}
      </Link>
    </motion.div>
  );
}
