'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { SafeImage } from '@/components/safe-image';

// Partner data with logo support
interface Partner {
  name: string;
  logo?: string; // Optional - falls back to text if not provided
  url: string; // Official website URL
}

const partners: Record<string, Partner[]> = {
  developers: [
    { name: 'Emaar', logo: '/partners/Layer 792.png', url: 'https://www.emaar.com/' },
    { name: 'Nakheel', logo: '/partners/Layer 793.png', url: 'https://www.nakheel.com/' },
    { name: 'Meydan', logo: '/partners/meydan-logo.png', url: 'https://www.meydan.ae/' },
    { name: 'Sobha', logo: '/partners/Layer 796.png', url: 'https://sobharealty.com/' },
    { name: 'Wasl', logo: '/partners/Layer 798.png', url: 'https://www.wasl.ae/' },
    { name: 'Meraas', logo: '/partners/Layer 799.png', url: 'https://meraas.com/' },
  ],
  hospitality: [
    { name: 'Marriott', logo: '/partners/Marriott_International.png', url: 'https://www.marriott.com/' },
    { name: 'Ritz-Carlton', logo: '/partners/1200px-RitzCarlton.svg.png', url: 'https://www.ritzcarlton.com/' },
    { name: 'Sofitel', logo: '/partners/Sofitel-JBR-Logo-2019-01_white.png', url: 'https://sofitel.accor.com/' },
    { name: 'Radisson', logo: '/partners/2880px-Radisson_Blu_logo.svg.png', url: 'https://www.radissonhotels.com/' },
    { name: 'Hyatt', logo: '/partners/hyatt-logo.png', url: 'https://www.hyatt.com/' },
    { name: 'Sheraton', logo: '/partners/Layer 801.png', url: 'https://sheraton.marriott.com/' },
  ],
  corporate: [
    { name: 'DMCC', logo: '/partners/DMCC-logo.png', url: 'https://dmcc.ae/' },
    { name: 'JLT', logo: '/partners/Layer 816.png', url: 'https://jlt.ae/' },
    { name: 'SBK Holding', logo: '/partners/Layer 817.png', url: 'https://www.sbkholding.com/' },
    { name: 'ADNH', logo: '/partners/adnh-logo.png', url: 'https://www.adnh.com/' },
  ],
};

const testimonials = [
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

// Background images for visual richness - using placeholder until project images are available
const backgroundImages = [
  '/placeholder.jpg',
  '/placeholder.jpg',
  '/placeholder.jpg',
];

// Partner Display Component - Logo with text fallback, wrapped in external link
function PartnerLogo({ partner }: { partner: Partner }) {
  const content = partner.logo ? (
    <div className="group relative flex h-16 w-28 items-center justify-center overflow-hidden p-3 transition-all duration-300 sm:h-20 sm:w-36 sm:p-4">
      <SafeImage
        src={partner.logo}
        alt={partner.name}
        width={120}
        height={60}
        className="max-h-full w-auto object-contain opacity-70 brightness-0 invert transition-all duration-300 group-hover:opacity-100"
      />
    </div>
  ) : (
    <span className="inline-block px-5 py-2.5 font-Satoshi text-sm font-light text-white/70 transition-all duration-300 hover:text-white">
      {partner.name}
    </span>
  );

  return (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block transition-transform duration-300 hover:scale-105"
      aria-label={`Visit ${partner.name} website`}
    >
      {content}
    </a>
  );
}

// ============================================
// PARTNERS SECTION
// ============================================
export function PartnersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const partnerCategories = [
    {
      key: 'developers',
      label: 'Developers',
      partnerList: partners.developers,
      description: 'Premier real estate developers shaping the UAE skyline'
    },
    {
      key: 'hospitality',
      label: 'Hospitality',
      partnerList: partners.hospitality,
      description: 'World-renowned hotel brands and hospitality groups'
    },
    {
      key: 'corporate',
      label: 'Corporate',
      partnerList: partners.corporate,
      description: 'Leading corporate entities and business groups'
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-neutral-950 py-24 sm:py-32 lg:py-40"
    >
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 text-center lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-white/40">
              Strategic Partners
            </span>
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

        {/* Partner Categories */}
        <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
          {partnerCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 + categoryIndex * 0.15 }}
              className="group relative h-full"
            >
              <div className="relative flex h-full flex-col p-8 lg:p-10">
                {/* Label */}
                <div className="mb-6">
                  <h3 className="font-SchnyderS text-2xl font-light text-white lg:text-3xl">
                    {category.label}
                  </h3>
                  <p className="font-Satoshi text-xs font-light text-white/40">
                    {category.partnerList.length} Partners
                  </p>
                </div>

                {/* Description */}
                <p className="mb-6 font-Satoshi text-sm font-light leading-relaxed text-white/60">
                  {category.description}
                </p>

                {/* Partner Logos */}
                <div className="flex flex-wrap items-center gap-3">
                  {category.partnerList.map((partner, index) => (
                    <motion.div
                      key={partner.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.5 + categoryIndex * 0.1 + index * 0.05 }}
                    >
                      <PartnerLogo partner={partner} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}


// ============================================
// TESTIMONIALS SECTION
// ============================================
export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const backgroundScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.1]);

  const nextTestimonial = useCallback(() => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevTestimonial = useCallback(() => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 8000);
    return () => clearInterval(interval);
  }, [nextTestimonial]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-neutral-950 py-24 sm:py-32 lg:py-40"
    >
      {/* Background */}
      <motion.div
        className="absolute inset-0"
        style={{ y: backgroundY, scale: backgroundScale }}
      >
        {backgroundImages.map((src, index) => (
          <motion.div
            key={`testimonial-bg-${index}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: index === activeTestimonial ? 0.2 : 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          >
            <SafeImage
              src={src}
              alt="Luxury interior background"
              fill
              className="object-cover"
            />
          </motion.div>
        ))}

        {/* Overlays */}
        <div className="absolute inset-0 bg-neutral-950/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-transparent to-neutral-950" />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-transparent to-neutral-950" />

        {/* Grid pattern */}
      </motion.div>

      {/* Floating orbs */}
      <motion.div
        className="absolute right-[10%] top-[30%] h-72 w-72 rounded-full bg-[#d4af37]/[0.04] blur-[120px]"
        animate={{ y: [0, -30, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-[20%] bottom-[20%] h-64 w-64 rounded-full bg-white/[0.02] blur-[100px]"
        animate={{ y: [0, 40, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 lg:px-12">
        {/* Header */}
        <div className="mb-12 text-center lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center justify-center gap-4"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#d4af37]/50" />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-white/40">
              Client Voices
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#d4af37]/50" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6 font-SchnyderS text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            What Our
            <br />
            <span className="text-white/30">Partners Say</span>
          </motion.h2>
        </div>

        {/* Testimonial Card - Full Width Cinematic */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative mx-auto max-w-5xl"
        >
          <div className="relative overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-sm">
            {/* Large Quote Icon - Background */}
            <div className="absolute -right-8 -top-8 opacity-[0.03]">
              <Quote className="h-64 w-64 text-[#d4af37]" strokeWidth={0.5} />
            </div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-5">
              {/* Image Side */}
              <div className="relative h-64 overflow-hidden lg:col-span-2 lg:h-auto lg:min-h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTestimonial}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                  >
                    <SafeImage
                      src={backgroundImages[activeTestimonial]}
                      alt="Project showcase"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-950/50 to-neutral-950 lg:via-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent lg:hidden" />
                  </motion.div>
                </AnimatePresence>

                {/* Quote icon overlay */}
                <div className="absolute left-6 top-6 flex h-14 w-14 items-center justify-center border border-[#d4af37]/40 bg-neutral-950/60 backdrop-blur-sm">
                  <Quote className="h-6 w-6 text-[#d4af37]" strokeWidth={1} />
                </div>

                {/* Corner frame */}
                <div className="absolute bottom-0 left-0 h-24 w-24 border-b-2 border-l-2 border-[#d4af37]/30" />
              </div>

              {/* Content Side */}
              <div className="p-8 lg:col-span-3 lg:p-12 xl:p-16">
                <div className="relative min-h-[300px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTestimonial}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Quote */}
                      <p className="mb-10 font-Satoshi text-lg font-light italic leading-relaxed text-white/70 lg:text-xl xl:text-2xl">
                        &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
                      </p>

                      {/* Author */}
                      <div className="border-t border-white/10 pt-8">
                        <div className="font-SchnyderS text-xl font-light text-white lg:text-2xl">
                          {testimonials[activeTestimonial].author}
                        </div>
                        <div className="font-Satoshi text-sm font-light text-white/50">
                          {testimonials[activeTestimonial].role}
                        </div>
                        <div className="font-Satoshi text-sm font-light text-[#d4af37]/70">
                          {testimonials[activeTestimonial].company}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-8">
                  {/* Progress dots */}
                  <div className="flex gap-3">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveTestimonial(index)}
                        className="group relative h-2 overflow-hidden"
                        aria-label={`Go to testimonial ${index + 1}`}
                      >
                        <div className={`h-full transition-all duration-500 ${
                          index === activeTestimonial ? 'w-12 bg-[#d4af37]' : 'w-2 bg-white/20 hover:bg-white/40'
                        }`} />
                      </button>
                    ))}
                  </div>

                  {/* Arrows */}
                  <div className="flex gap-3">
                    <button
                      onClick={prevTestimonial}
                      className="flex h-12 w-12 items-center justify-center border border-white/10 bg-white/[0.02] transition-all duration-300 hover:border-[#d4af37]/40 hover:bg-[#d4af37]/10"
                      aria-label="Previous testimonial"
                    >
                      <ArrowLeft className="h-5 w-5 text-white/50" strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="flex h-12 w-12 items-center justify-center border border-white/10 bg-white/[0.02] transition-all duration-300 hover:border-[#d4af37]/40 hover:bg-[#d4af37]/10"
                      aria-label="Next testimonial"
                    >
                      <ArrowRight className="h-5 w-5 text-white/50" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Corner accents */}
            <div className="absolute right-0 top-0 h-20 w-20 border-r-2 border-t-2 border-[#d4af37]/20" />
          </div>
        </motion.div>
      </div>

      {/* Corner decorations */}
      <div className="absolute left-8 top-24 hidden h-32 w-32 border-l border-t border-white/5 lg:block" />
      <div className="absolute bottom-24 right-8 hidden h-32 w-32 border-b border-r border-white/5 lg:block" />
    </section>
  );
}


// ============================================
// COMBINED EXPORT (for backwards compatibility)
// ============================================
interface PartnersTestimonialsProps {
  clients?: unknown[];
  testimonials?: unknown[];
}

export function PartnersTestimonials({ clients, testimonials }: PartnersTestimonialsProps = {}) {
  // Note: clients and testimonials props are accepted for API compatibility
  // but this version uses hardcoded data for the stable design
  return (
    <>
      <PartnersSection />
      <TestimonialsSection />
    </>
  );
}
