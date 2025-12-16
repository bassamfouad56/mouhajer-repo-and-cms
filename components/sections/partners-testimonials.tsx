'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useInView, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowLeft, ArrowRight, Quote, Building2, Hotel, Briefcase } from 'lucide-react';
import { SafeImage } from '@/components/safe-image';

const partners = {
  developers: ['Emaar', 'Nakheel', 'Meydan', 'Sobha', 'Wasl', 'Meraas'],
  hospitality: ['Marriott', 'Ritz-Carlton', 'Sofitel', 'Radisson', 'Hyatt', 'Sheraton'],
  corporate: ['DMCC', 'JLT', 'SBK Holding', 'ADNH'],
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

// Background images for visual richness
const backgroundImages = [
  '/projects/commercial-interior/_MID7000-HDR.jpg',
  '/projects/commercial-interior/_MID7025-HDR.jpg',
  '/projects/turnkey-design-fitout/c5c5c5.jpg',
];

// ============================================
// PARTNERS SECTION
// ============================================
export function PartnersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const backgroundScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.1]);

  // Mouse tracking for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 100, damping: 30 };
  const parallaxX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);
  const parallaxY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-15, 15]), springConfig);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const partnerCategories = [
    {
      key: 'developers',
      label: 'Developers',
      partners: partners.developers,
      icon: Building2,
      description: 'Premier real estate developers shaping the UAE skyline'
    },
    {
      key: 'hospitality',
      label: 'Hospitality',
      partners: partners.hospitality,
      icon: Hotel,
      description: 'World-renowned hotel brands and hospitality groups'
    },
    {
      key: 'corporate',
      label: 'Corporate',
      partners: partners.corporate,
      icon: Briefcase,
      description: 'Leading corporate entities and business groups'
    },
  ];

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

                  {/* Partner Tags */}
                  <div className="flex flex-wrap gap-2">
                    {category.partners.map((partner, index) => (
                      <motion.span
                        key={partner}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.4, delay: 0.5 + categoryIndex * 0.1 + index * 0.05 }}
                        className="border border-white/10 bg-white/[0.02] px-3 py-1.5 font-Satoshi text-xs font-light text-white/60 transition-all duration-300 hover:border-[#d4af37]/30 hover:bg-[#d4af37]/10 hover:text-white"
                      >
                        {partner}
                      </motion.span>
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
            key={src}
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
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
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

      <div className="relative z-10 mx-auto max-w-[1800px] px-6 lg:px-12">
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
                      <div className="flex items-center gap-5 border-t border-white/10 pt-8">
                        <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-[#d4af37]/30">
                          <SafeImage
                            src={testimonials[activeTestimonial].image}
                            alt={testimonials[activeTestimonial].author}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
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
export function PartnersTestimonials() {
  return (
    <>
      <PartnersSection />
      <TestimonialsSection />
    </>
  );
}
