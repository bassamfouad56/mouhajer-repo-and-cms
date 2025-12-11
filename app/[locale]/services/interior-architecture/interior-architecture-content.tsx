'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { FAQSection } from '@/components/sections/faq';
import Link from 'next/link';
import { SafeImage } from '@/components/safe-image';
import { ArrowRight, ChevronDown } from 'lucide-react';

// Professional minimalist SVG icons
const IconConceptDesign = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 40L18 30M18 30L24 36L40 20M18 30L24 24" />
    <circle cx="40" cy="8" r="4" />
    <path d="M4 44h40" />
  </svg>
);

const IconVisualization = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="8" width="40" height="32" rx="2" />
    <path d="M4 16h40" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="20" cy="12" r="2" />
    <path d="M12 28l8-6 6 4 10-8" />
    <path d="M12 34h24" />
  </svg>
);

const IconDocumentation = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M28 4H12a4 4 0 00-4 4v32a4 4 0 004 4h24a4 4 0 004-4V16L28 4z" />
    <path d="M28 4v12h12" />
    <path d="M16 24h16M16 32h16M16 40h8" />
  </svg>
);

const IconAward = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="24" cy="18" r="12" />
    <path d="M16 28l-4 16 12-6 12 6-4-16" />
    <path d="M24 12v12M18 18h12" />
  </svg>
);

export default function InteriorArchitectureContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <main className="relative bg-white">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen min-h-[700px] max-h-[1000px] overflow-hidden bg-neutral-950"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <SafeImage
            src="/projects/bedroom-interior/Master Bedroom_1.jpg"
            alt="Luxury Interior Architecture"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-neutral-950/60" />
          <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-24 lg:px-12"
        >
          <div className="mx-auto max-w-5xl text-center">
            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-8 flex items-center justify-center gap-4"
            >
              <div className="h-px w-16 bg-linear-to-r from-transparent to-white/40" />
              <span className="font-Satoshi text-xs font-light uppercase tracking-[0.4em] text-white/70">
                Pillar 2
              </span>
              <div className="h-px w-16 bg-linear-to-l from-transparent to-white/40" />
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.5 }}
              className="mb-8 font-SchnyderS text-5xl font-light leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
            >
              The
              <br />
              <span className="text-[#d4af37]">"Uncluttered Baroque"</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mx-auto mb-12 max-w-3xl px-4 font-Satoshi text-lg font-light leading-relaxed text-white/70 sm:px-0 sm:text-xl"
            >
              Where Arabic grandeur meets European architectural discipline.
            </motion.p>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isHeroInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2"
          >
            <span className="font-Satoshi text-[10px] font-light tracking-[0.2em] text-white/50">
              DISCOVER OUR APPROACH
            </span>
            <ChevronDown className="h-4 w-4 text-white/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* Section 1: The Science Behind the Style */}
      <ScienceBehindStyleSection />

      {/* Section 2: Our Design Services */}
      <DesignServicesSection />

      {/* Section 3: Award-Winning Excellence */}
      <AwardsSection />

      {/* Section 4: Expert Insights */}
      <ExpertInsightsSection />

      {/* Section 5: CTA - Visualize Your Future */}
      <VisualizeFutureCTA />
    </main>
  );
}

// Section 1: The Science Behind the Style
function ScienceBehindStyleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-32 sm:py-40 lg:py-48"
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 xl:px-16">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center lg:col-span-6"
          >
            <div className="mb-8">
              <div className="mb-2 h-px w-16 bg-neutral-900" />
              <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400">
                Our Philosophy
              </span>
            </div>

            <h2 className="mb-10 font-SchnyderS text-5xl font-light leading-[1.05] tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl">
              The Science Behind
              <br />
              <span className="text-[#d4af37]">the Style</span>
            </h2>

            <div className="space-y-6 font-Satoshi text-lg font-light leading-relaxed text-neutral-600 lg:text-xl">
              <p>
                At MIDC, we believe that interior design is not about choosing curtains. It is about fixing the space. Led by <strong className="font-medium text-neutral-950">Eng. Maher Mouhajer (Bachelor's in Interior Design, London)</strong>, our approach is rooted in architectural science.
              </p>
              <p>
                We do not just decorate rooms; we analyze volumes. We align symmetry. We manipulate light. Our signature style, the <strong className="font-medium text-neutral-950">"Uncluttered Baroque,"</strong> is a direct result of this philosophy.
              </p>
              <p>
                It takes the richness of Arabic heritage (the gold, the texture, the scale) and applies the strict discipline of British architecture. The result is a space that feels grand, yet breathable.
              </p>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:col-span-6"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <SafeImage
                src="/projects/commercial-interior/_MID7362-HDR.jpg"
                alt="Luxury interior design by MIDC"
                fill
                className="object-cover"
              />
              {/* Decorative frame */}
              <div className="absolute inset-4 border border-white/20 pointer-events-none" />
            </div>
            {/* Caption */}
            <div className="absolute -bottom-6 left-8 right-8 bg-neutral-950 p-6 lg:left-auto lg:right-0 lg:w-72">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-[#d4af37]/30" />
                <span className="font-Satoshi text-[10px] uppercase tracking-[0.2em] text-[#d4af37]">Featured</span>
              </div>
              <p className="mt-4 font-Playfair text-lg font-light text-white">Uncluttered Baroque</p>
              <p className="mt-1 font-Satoshi text-sm font-light text-white/50">Our signature style</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Section 2: Our Design Services
function DesignServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const services = [
    {
      id: 1,
      icon: IconConceptDesign,
      title: 'Conceptual Design & Narrative',
      subtitle: 'Every project starts with a story',
      image: '/projects/commercial-interior/11.jpg',
      items: [
        {
          label: 'The Brief',
          description: 'We define the emotion of the space. Is it a powerful corporate HQ for Osoul? Or a serene sanctuary in Jumeirah Bay?',
        },
        {
          label: 'Space Planning',
          description: 'We produce detailed 2D layouts that optimize the flow of people through the building. We ensure that service routes in hotels are hidden and that private zones in villas remain private.',
        },
      ],
    },
    {
      id: 2,
      icon: IconVisualization,
      title: '3D Visualization',
      subtitle: 'The Digital Twin - We remove the risk from design',
      image: '/projects/bedroom-interior/Master bedroom cam1.jpg',
      items: [
        {
          label: 'Photorealistic Rendering',
          description: 'We create cinema-quality 3D visuals that show you exactly how your project will look. You will see the vein of the marble and the reflection in the mirror before we buy a single item.',
        },
        {
          label: 'Virtual Reality',
          description: 'For major projects, we offer walkthroughs that allow you to stand inside your future home or hotel lobby.',
        },
      ],
    },
    {
      id: 3,
      icon: IconDocumentation,
      title: 'Technical Documentation',
      subtitle: 'Shop Drawings - A beautiful picture is useless if you cannot build it',
      image: '/projects/commercial-interior/16.jpg',
      items: [
        {
          label: 'Buildability Checks',
          description: 'Because our designers sit alongside our construction team, every design is validated for feasibility. We never draw a floating staircase that cannot be supported.',
        },
        {
          label: 'Detailed Sections',
          description: 'We produce thousands of technical drawings, Reflected Ceiling Plans (RCP), Flooring Layouts, and Joinery Sections, that tell the site team exactly what to do to the millimeter.',
        },
      ],
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-50 py-32 sm:py-40 lg:py-48"
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 xl:px-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-neutral-300" />
            <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400">
              Section 2
            </span>
            <div className="h-px w-12 bg-neutral-300" />
          </div>

          <h2 className="font-SchnyderS text-5xl font-light leading-tight tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl">
            Our Design
            <br />
            <span className="text-[#d4af37]">Services</span>
          </h2>
        </motion.div>

        {/* Services */}
        <div className="space-y-24 lg:space-y-32">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 60 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="group relative"
              >
                <div className={`grid gap-12 lg:grid-cols-12 lg:gap-16 ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                  {/* Image */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8, delay: index * 0.2 + 0.2 }}
                    className={`relative lg:col-span-5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-neutral-100">
                      <SafeImage
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-neutral-950/10 transition-opacity duration-500 group-hover:opacity-0" />
                    </div>
                    {/* Icon overlay */}
                    <div className="absolute -bottom-6 -right-6 flex h-20 w-20 items-center justify-center border border-neutral-200 bg-white text-[#d4af37] shadow-lg transition-all duration-300 group-hover:bg-[#d4af37] group-hover:text-white lg:h-24 lg:w-24">
                      <IconComponent />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className={`flex flex-col justify-center lg:col-span-7 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <h3 className="mb-4 font-SchnyderS text-4xl font-light leading-tight text-neutral-950 transition-colors duration-300 group-hover:text-[#d4af37] lg:text-5xl">
                      {service.title}
                    </h3>
                    <p className="mb-8 font-Satoshi text-lg font-light italic text-neutral-500">
                      {service.subtitle}
                    </p>

                    <div className="space-y-6">
                      {service.items.map((item, i) => (
                        <div key={i} className="border-l-2 border-[#d4af37] pl-6">
                          <div className="mb-2 font-Satoshi text-sm font-medium uppercase tracking-[0.2em] text-neutral-400">
                            {item.label}
                          </div>
                          <p className="font-Satoshi text-base font-light leading-relaxed text-neutral-700">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                {index < services.length - 1 && (
                  <div className="mt-20 h-px w-full bg-neutral-200 lg:mt-28" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Section 3: Award-Winning Excellence
function AwardsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const awards = [
    {
      title: 'Best Hotel Suite Interior (Arabia)',
      project: 'Address Boulevard VIP Suite',
      image: '/projects/bedroom-interior/Master Bedroom_6_10_2020 copy.jpg',
    },
    {
      title: 'Best Residential Apartment (Dubai)',
      project: 'Boulevard Penthouse 70-71',
      image: '/projects/commercial-interior/17.jpg',
    },
    {
      title: 'Best Luxury Hotel Interior',
      project: 'Sofitel JBR',
      image: '/projects/commercial-interior/18.jpg',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-32 sm:py-40 lg:py-48"
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-neutral-300" />
            <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400">
              Recognition
            </span>
            <div className="h-px w-12 bg-neutral-300" />
          </div>

          <h2 className="mb-6 font-SchnyderS text-5xl font-light leading-tight tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl">
            Spotlight:
            <br />
            <span className="text-[#d4af37]">Award-Winning Excellence</span>
          </h2>

          <p className="mx-auto max-w-3xl font-Satoshi text-lg font-light text-neutral-600">
            Our design studio is the recipient of the region's highest honors:
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {awards.map((award, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative overflow-hidden border border-neutral-200 bg-white transition-all duration-500 hover:border-[#d4af37] hover:shadow-2xl hover:shadow-neutral-900/10"
            >
              {/* Image */}
              <div className="relative aspect-4/3 overflow-hidden">
                <SafeImage
                  src={award.image}
                  alt={award.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
                {/* Award icon */}
                <div className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center bg-[#d4af37] text-white">
                  <IconAward />
                </div>
              </div>
              {/* Content */}
              <div className="p-6">
                <h3 className="mb-2 font-SchnyderS text-2xl font-light leading-tight text-neutral-950">
                  {award.title}
                </h3>
                <p className="font-Satoshi text-sm font-light text-neutral-600">
                  {award.project}
                </p>
              </div>

              <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#d4af37] transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Section 4: Expert Insights
function ExpertInsightsSection() {
  return (
    <FAQSection
      label="Expert Insights"
      title="Questions"
      titleHighlight="& Answers"
      showCTA={false}
      faqs={[
        {
          question: 'Do I need to hire a separate architect?',
          answer: 'No. Our Design Studio is a fully integrated architectural practice. We handle the spatial planning, the interior architecture (walls/ceilings), and the decoration. This single-point responsibility prevents the common conflict where the "Decorator" draws something the "Architect" says is impossible.',
        },
        {
          question: 'Can you work with my existing architect?',
          answer: 'Yes. We often act as the Executive Designer or Main Contractor alongside international "Concept Architects." We take their visual concept and produce the technical shop drawings required to build it in the UAE, ensuring it complies with local regulations while keeping the original aesthetic intact.',
        },
        {
          question: 'How do you visualize the design before construction?',
          answer: 'We use high-fidelity 3D rendering and Virtual Reality (VR). We build the room digitally first. This allows you to stand in your future Majlis or Lobby and approve every detail, from the marble vein to the curtain fabric, before we order a single item.',
        },
      ]}
    />
  );
}

// Section 5: CTA - Visualize Your Future
function VisualizeFutureCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-32 lg:py-40"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <SafeImage
          src="/projects/turnkey-design-fitout/_MID2543-HDR.jpg"
          alt="Luxury Interior"
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-neutral-950/70" />
      </div>
      <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-[#d4af37]/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-[#d4af37]/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 text-center lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-linear-to-r from-transparent to-white/40" />
            <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.3em] text-white/70">
              Section 5
            </span>
            <div className="h-px w-12 bg-linear-to-l from-transparent to-white/40" />
          </div>

          <h2 className="mb-8 font-SchnyderS text-5xl font-light leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            Visualize
            <br />
            <span className="text-[#d4af37]">Your Future</span>
          </h2>

          <p className="mx-auto mb-12 max-w-3xl font-Satoshi text-lg font-light leading-relaxed text-white/70 lg:text-xl">
            Commission a design that has been validated by the industry's toughest judges.
          </p>

          <a
            href="#contact"
            className="group inline-flex items-center gap-3 border border-[#d4af37] bg-[#d4af37] px-10 py-5 font-Satoshi text-sm font-light tracking-widest text-neutral-950 transition-all hover:bg-transparent hover:text-[#d4af37]"
          >
            <span>COMMISSION A DESIGN</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
