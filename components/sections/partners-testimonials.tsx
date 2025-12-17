'use client';

import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { motion, useInView, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowLeft, ArrowRight, Quote, Building2, Hotel, Briefcase } from 'lucide-react';
import { SafeImage } from '@/components/safe-image';
import { urlForImage } from '@/sanity/lib/image';

// Types for Sanity data
interface SanityClient {
  _id: string;
  name: string;
  logo?: { asset?: { _ref?: string } };
  category?: string;
  featured?: boolean;
  isConfidential?: boolean;
}

interface SanityTestimonial {
  _id: string;
  name: string;
  role?: string;
  company?: string;
  image?: { asset?: { _ref?: string } };
  quote: string;
  rating?: number;
  featured?: boolean;
}

// Helper to get image URL from Sanity
function getSanityImageUrl(image: any, width = 200, height = 100): string {
  if (!image?.asset) return '';
  try {
    return urlForImage(image).width(width).height(height).url();
  } catch {
    return '';
  }
}

// Transform Sanity testimonial to display format
interface DisplayTestimonial {
  id: string | number;
  quote: string;
  author: string;
  role: string;
  company: string;
  image: string;
}

// Fallback testimonials when Sanity data is not available
const fallbackTestimonials: DisplayTestimonial[] = [
  {
    id: 1,
    quote: 'One of the standout qualities of MIDC is their dedication to meeting project timelines without compromising quality. MIDC has consistently demonstrated a strong commitment to meeting project timelines while maintaining high-quality standards. Their clear communication and attention to detail helped keep projects on track, even when handling complex requirements.',
    author: 'Ghaleb Al Najjar',
    role: 'Consultant - Projects and Infrastructure',
    company: 'Abu Dhabi National Hotels',
    image: '/partners/Layer 806.png',
  },
  {
    id: 2,
    quote: 'Throughout our collaboration, MIDC has consistently demonstrated exceptional skill, professionalism, and a strong commitment to delivering high-quality outcomes. They have been instrumental in the successful execution of our hotel refurbishment, design and built projects. Their work surpassed our expectations, not only in terms of quality but also in their ability to manage the project within tight timelines.',
    author: 'Sayed Mohammed Al Sayed',
    role: 'Director of Area Procurement',
    company: 'Grand Hyatt Hotels Dubai',
    image: '/partners/Layer 810.png',
  },
  {
    id: 3,
    quote: 'I did not want a house that felt like a hotel. I wanted a home that felt like art. Eng. Maher took my vague ideas and translated them into a reality that was sharper and more elegant than I could have imagined. His presence on-site gave me total peace of mind.',
    author: 'Private Client',
    role: 'Villa Owner',
    company: 'Jumeirah Bay Island',
    image: '/partners/The Residences.png',
  },
];

// Transform Sanity testimonials to display format
function transformTestimonials(sanityTestimonials: SanityTestimonial[]): DisplayTestimonial[] {
  return sanityTestimonials.map(t => ({
    id: t._id,
    quote: t.quote,
    author: t.name,
    role: t.role || '',
    company: t.company || '',
    image: getSanityImageUrl(t.image, 200, 200),
  }));
}

// Props interfaces
interface PartnersSectionProps {
  clients?: SanityClient[];
}

interface TestimonialsSectionProps {
  testimonials?: SanityTestimonial[];
}

interface PartnersTestimonialsProps {
  clients?: SanityClient[];
  testimonials?: SanityTestimonial[];
}

// Category mapping for clients
const CATEGORY_CONFIG = {
  developers: {
    label: 'Developers',
    icon: Building2,
    description: 'Premier real estate developers shaping the UAE skyline',
    keywords: ['developer', 'developers', 'real-estate', 'real estate'],
  },
  hospitality: {
    label: 'Hospitality',
    icon: Hotel,
    description: 'World-renowned hotel brands and hospitality groups',
    keywords: ['hospitality', 'hotel', 'hotels', 'resort', 'resorts'],
  },
  corporate: {
    label: 'Corporate',
    icon: Briefcase,
    description: 'Leading corporate entities and business groups',
    keywords: ['corporate', 'business', 'office', 'commercial'],
  },
};

// ============================================
// PARTNERS SECTION
// ============================================
export function PartnersSection({ clients = [] }: PartnersSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Mouse tracking for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  // Group clients by category
  const partnerCategories = useMemo(() => {
    // Filter out confidential clients and those without logos
    const visibleClients = clients.filter(c => !c.isConfidential && c.logo?.asset);

    // Group clients by category
    const groupedClients: Record<string, SanityClient[]> = {
      developers: [],
      hospitality: [],
      corporate: [],
    };

    visibleClients.forEach(client => {
      const category = (client.category || '').toLowerCase();

      // Match category to group based on keywords
      if (CATEGORY_CONFIG.developers.keywords.some(k => category.includes(k))) {
        groupedClients.developers.push(client);
      } else if (CATEGORY_CONFIG.hospitality.keywords.some(k => category.includes(k))) {
        groupedClients.hospitality.push(client);
      } else {
        // Default to corporate for uncategorized
        groupedClients.corporate.push(client);
      }
    });

    // Build category array - only include categories with clients
    return Object.entries(CATEGORY_CONFIG)
      .filter(([key]) => groupedClients[key].length > 0)
      .map(([key, config]) => ({
        key: key as keyof typeof CATEGORY_CONFIG,
        label: config.label,
        icon: config.icon,
        description: config.description,
        partners: groupedClients[key].map(client => ({
          name: client.name,
          logo: getSanityImageUrl(client.logo, 200, 100),
        })),
      }));
  }, [clients]);

  // Don't render if no clients
  if (partnerCategories.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-neutral-950 py-24 sm:py-32 lg:py-40"
    >
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating orbs - subtle gold accents */}
      <motion.div
        className="absolute left-[10%] top-[20%] h-96 w-96 rounded-full bg-[#d4af37]/[0.05] blur-[150px]"
        animate={{ y: [0, -40, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[15%] bottom-[20%] h-80 w-80 rounded-full bg-[#d4af37]/[0.03] blur-[120px]"
        animate={{ y: [0, 50, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      <div className="relative z-10 mx-auto max-w-[1800px] px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 text-center lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center justify-center gap-4"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#d4af37]/50" />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-white/40">
              Strategic Partners
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#d4af37]/50" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6 font-SchnyderS text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            Trusted by The
            <br />
            <span className="text-white/30">Region&apos;s Visionaries</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl font-Satoshi text-base font-light leading-relaxed text-white/60 lg:text-lg"
          >
            Collaborating with the most prestigious developers, hospitality brands,
            and corporate entities to create extraordinary spaces.
          </motion.p>
        </div>

        {/* Partner Categories - 3D Cards */}
        <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
          {partnerCategories.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 + categoryIndex * 0.15 }}
                className="group relative"
              >
                <div
                  className="relative overflow-hidden border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm transition-all duration-500 hover:border-[#d4af37]/30 hover:bg-white/[0.04] lg:p-10"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Icon and Label */}
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center border border-[#d4af37]/30 bg-[#d4af37]/10">
                      <Icon className="h-5 w-5 text-[#d4af37]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-SchnyderS text-2xl font-light text-white lg:text-3xl">
                        {category.label}
                      </h3>
                      <p className="font-Satoshi text-xs font-light text-white/40">
                        {category.partners.length} Partners
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mb-6 font-Satoshi text-sm font-light leading-relaxed text-white/60">
                    {category.description}
                  </p>

                  {/* Partner Logos Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    {category.partners.map((partner, index) => (
                      <motion.div
                        key={partner.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.4, delay: 0.5 + categoryIndex * 0.1 + index * 0.05 }}
                        className="group relative flex h-16 items-center justify-center border border-white/10 bg-white/[0.02] px-3 py-2 transition-all duration-300 hover:border-[#d4af37]/30 hover:bg-[#d4af37]/5"
                      >
                        {partner.logo ? (
                          <SafeImage
                            src={partner.logo}
                            alt={partner.name}
                            width={100}
                            height={40}
                            className="h-auto max-h-10 w-auto max-w-full object-contain opacity-60 brightness-0 invert transition-all duration-300 group-hover:opacity-100"
                          />
                        ) : (
                          <span className="whitespace-nowrap font-Satoshi text-xs font-light text-white/40 transition-colors duration-300 group-hover:text-white/70">
                            {partner.name}
                          </span>
                        )}
                        {/* Tooltip on hover */}
                        <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-neutral-900 px-2 py-1 font-Satoshi text-[10px] text-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          {partner.name}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Decorative corners */}
                  <div className="absolute right-0 top-0 h-12 w-12 border-r border-t border-[#d4af37]/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 h-12 w-12 border-b border-l border-[#d4af37]/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute left-8 top-24 hidden h-32 w-32 border-l border-t border-white/5 lg:block" />
      <div className="absolute bottom-24 right-8 hidden h-32 w-32 border-b border-r border-white/5 lg:block" />
    </section>
  );
}


// ============================================
// TESTIMONIALS SECTION - Redesigned
// ============================================
export function TestimonialsSection({ testimonials: sanityTestimonials = [] }: TestimonialsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [direction, setDirection] = useState(0);

  // Use Sanity testimonials if available, otherwise fallback
  const testimonials = useMemo(() => {
    if (sanityTestimonials.length > 0) {
      return transformTestimonials(sanityTestimonials);
    }
    return fallbackTestimonials;
  }, [sanityTestimonials]);

  const nextTestimonial = useCallback(() => {
    setDirection(1);
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevTestimonial = useCallback(() => {
    setDirection(-1);
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  // Auto-advance testimonials
  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setDirection(1);
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-24 sm:py-32 lg:py-40"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse 100% 100% at 0% 0%, rgba(212,175,55,0.03) 0%, transparent 50%)',
              'radial-gradient(ellipse 100% 100% at 100% 100%, rgba(212,175,55,0.03) 0%, transparent 50%)',
              'radial-gradient(ellipse 100% 100% at 0% 0%, rgba(212,175,55,0.03) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* Large Quote Mark - Background Decoration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.5 }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <Quote className="h-[60vh] w-[60vh] text-[#d4af37]/[0.02]" strokeWidth={0.3} />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header - Minimal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center lg:mb-24"
        >
          <span className="mb-4 inline-block font-Satoshi text-[10px] font-medium uppercase tracking-[0.4em] text-[#d4af37]">
            Testimonials
          </span>
          <h2 className="font-SchnyderS text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl">
            Words That
            <span className="block text-white/30">Inspire Us</span>
          </h2>
        </motion.div>

        {/* Main Testimonial Display */}
        <div className="relative">
          {/* Navigation Arrows - Floating on sides */}
          <button
            onClick={prevTestimonial}
            className="absolute -left-4 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center border border-white/10 bg-neutral-950/80 p-4 backdrop-blur-sm transition-all duration-300 hover:border-[#d4af37]/50 hover:bg-[#d4af37]/10 lg:-left-8 lg:flex xl:-left-16"
            aria-label="Previous testimonial"
          >
            <ArrowLeft className="h-5 w-5 text-white/60" strokeWidth={1.5} />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute -right-4 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center border border-white/10 bg-neutral-950/80 p-4 backdrop-blur-sm transition-all duration-300 hover:border-[#d4af37]/50 hover:bg-[#d4af37]/10 lg:-right-8 lg:flex xl:-right-16"
            aria-label="Next testimonial"
          >
            <ArrowRight className="h-5 w-5 text-white/60" strokeWidth={1.5} />
          </button>

          {/* Testimonial Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Corner accents */}
            <div className="absolute -left-3 -top-3 h-12 w-12 border-l-2 border-t-2 border-[#d4af37]/30" />
            <div className="absolute -bottom-3 -right-3 h-12 w-12 border-b-2 border-r-2 border-[#d4af37]/30" />

            <div className="relative overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-sm">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeTestimonial}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative px-8 py-12 lg:px-16 lg:py-16"
                >
                  {/* Quote Icon */}
                  <div className="mb-8 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5">
                      <Quote className="h-7 w-7 text-[#d4af37]" strokeWidth={1} />
                    </div>
                  </div>

                  {/* Quote Text */}
                  <blockquote className="mx-auto mb-10 max-w-4xl text-center">
                    <p className="font-SchnyderS text-2xl font-light leading-relaxed text-white/80 sm:text-3xl lg:text-4xl">
                      &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
                    </p>
                  </blockquote>

                  {/* Author Info - Centered */}
                  <div className="flex flex-col items-center">
                    {/* Divider */}
                    <div className="mb-8 h-px w-16 bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />

                    {/* Author Image */}
                    <div className="relative mb-5">
                      <div className="relative h-20 w-20 overflow-hidden rounded-full">
                        <SafeImage
                          src={testimonials[activeTestimonial].image}
                          alt={testimonials[activeTestimonial].author}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {/* Ring decoration */}
                      <div className="absolute -inset-1 rounded-full border border-[#d4af37]/20" />
                      <div className="absolute -inset-2 rounded-full border border-[#d4af37]/10" />
                    </div>

                    {/* Author Details */}
                    <div className="text-center">
                      <div className="mb-1 font-SchnyderS text-2xl font-light text-white">
                        {testimonials[activeTestimonial].author}
                      </div>
                      <div className="mb-1 font-Satoshi text-sm font-light text-white/50">
                        {testimonials[activeTestimonial].role}
                      </div>
                      <div className="font-Satoshi text-sm font-medium uppercase tracking-wider text-[#d4af37]/80">
                        {testimonials[activeTestimonial].company}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Progress Indicators - Below Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            {/* Mobile Navigation */}
            <button
              onClick={prevTestimonial}
              className="flex h-10 w-10 items-center justify-center border border-white/10 transition-all duration-300 hover:border-[#d4af37]/50 lg:hidden"
              aria-label="Previous"
            >
              <ArrowLeft className="h-4 w-4 text-white/50" strokeWidth={1.5} />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > activeTestimonial ? 1 : -1);
                    setActiveTestimonial(index);
                  }}
                  className="group relative"
                  aria-label={`Go to testimonial ${index + 1}`}
                >
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      index === activeTestimonial
                        ? 'w-10 bg-[#d4af37]'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                  {/* Active pulse effect */}
                  {index === activeTestimonial && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-[#d4af37]"
                      animate={{ scale: [1, 1.5, 1.5], opacity: [0.5, 0, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Mobile Navigation */}
            <button
              onClick={nextTestimonial}
              className="flex h-10 w-10 items-center justify-center border border-white/10 transition-all duration-300 hover:border-[#d4af37]/50 lg:hidden"
              aria-label="Next"
            >
              <ArrowRight className="h-4 w-4 text-white/50" strokeWidth={1.5} />
            </button>
          </motion.div>

          {/* Testimonial Counter */}
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute left-8 top-24 hidden h-24 w-24 border-l border-t border-white/5 lg:block" />
      <div className="absolute bottom-24 right-8 hidden h-24 w-24 border-b border-r border-white/5 lg:block" />
    </section>
  );
}


// ============================================
// COMBINED EXPORT (for backwards compatibility)
// ============================================
export function PartnersTestimonials({ clients = [], testimonials = [] }: PartnersTestimonialsProps) {
  return (
    <>
      <PartnersSection clients={clients} />
      <TestimonialsSection testimonials={testimonials} />
    </>
  );
}
