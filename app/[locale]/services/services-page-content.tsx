"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  MotionValue,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";
import { urlForImage } from "@/sanity/lib/image";
import { FAQSection } from "@/components/sections/faq";

// Type for multilingual fields that can be either a string or an object with locale keys
type MultilingualField = string | { ar?: string; en?: string; [key: string]: string | undefined };

interface SanityService {
  _id: string;
  title: MultilingualField;
  slug: { current: string };
  excerpt?: MultilingualField;
  mainImage?: any;
  icon?: string;
  features?: Array<{ title: MultilingualField; description: MultilingualField }>;
  order?: number;
}

interface SanityProject {
  _id: string;
  title: MultilingualField;
  slug: { current: string };
  excerpt?: MultilingualField;
  mainImage?: any;
  category?: MultilingualField;
  location?: MultilingualField;
  year?: string;
}

interface ServicesPageContentProps {
  services?: SanityService[];
  projects?: SanityProject[];
  locale: string;
  heroImage?: string;
}

// Helper function to safely get localized text
function getLocalizedText(field: MultilingualField | undefined, locale: string = 'en'): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  // Try the requested locale first, then 'en', then any available value
  return field[locale] || field.en || Object.values(field).find(v => v) || '';
}

// Smooth parallax hook
function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

export default function ServicesPageContent({
  services = [],
  projects = [],
  locale = 'en',
  heroImage = '',
}: ServicesPageContentProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // Get first project image as fallback if no heroImage from Sanity
  const bannerImage = heroImage || (projects[0]?.mainImage
    ? urlForImage(projects[0].mainImage).width(2560).height(1440).url()
    : '/projects/turnkey-design-fitout/_MID0058-HDR.jpg');

  return (
    <main className="relative bg-neutral-950">
      {/* Hero Section - Cinematic Full Screen with Background Image */}
      <section
        ref={heroRef}
        className="relative h-screen min-h-[800px] overflow-hidden bg-neutral-950"
      >
        {/* Background Image with Parallax */}
        {bannerImage && (
          <motion.div
            style={{ scale: imageScale, y: imageY }}
            className="absolute inset-0"
          >
            <Image
              src={bannerImage}
              alt="MIDC Services"
              fill
              className="object-cover"
              sizes="100vw"
              priority
              quality={90}
            />
          </motion.div>
        )}

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/60 to-neutral-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/40 via-transparent to-neutral-950/40" />

        {/* Subtle Grid Pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Gold Accent Glow */}
        <div className="pointer-events-none absolute left-1/4 top-1/3 h-[600px] w-[600px] rounded-full bg-[#d4af37]/[0.03] blur-[150px]" />

        {/* Top Border Accent */}
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-20"
        >
          <div className="mx-auto max-w-6xl text-center">
            {/* Minimal Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12 flex items-center justify-center gap-4"
            >
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#d4af37]/50" />
              <span className="font-Satoshi text-[10px] font-light uppercase tracking-[0.4em] text-white/50">
                Services
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#d4af37]/50" />
            </motion.div>

            {/* Main Title */}
            <div className="mb-6 overflow-hidden">
              <motion.h1
                initial={{ opacity: 0, y: 60 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 1.2,
                  delay: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-SchnyderS text-6xl font-light leading-[1.05] tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl"
              >
                The Art of
              </motion.h1>
            </div>

            <div className="mb-12 overflow-hidden">
              <motion.h1
                initial={{ opacity: 0, y: 60 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 1.2,
                  delay: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-SchnyderS text-6xl font-light leading-[1.05] tracking-tight text-[#d4af37] sm:text-7xl md:text-8xl lg:text-9xl"
              >
                Integrated Construction
              </motion.h1>
            </div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mx-auto mb-12 max-w-3xl px-4 font-Satoshi text-xl font-light leading-relaxed text-white/60 sm:px-0 sm:text-2xl"
            >
              Design. Build. Engineering. One Point of Responsibility.
            </motion.p>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex items-center justify-center gap-8 sm:gap-16"
            >
              {[
                { number: '6', label: 'Core Services' },
                { number: '1', label: 'Point of Contact' },
                { number: '0', label: 'Outsourcing' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="font-SchnyderS text-4xl font-light text-white sm:text-5xl">
                    {stat.number}
                  </div>
                  <div className="mt-1 font-Satoshi text-[10px] font-light uppercase tracking-[0.2em] text-white/40">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Minimal Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isHeroInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-12 left-1/2 z-10 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-3"
          >
            <span className="font-Satoshi text-[9px] font-light uppercase tracking-[0.3em] text-white/30">
              Scroll
            </span>
            <ChevronDown className="h-4 w-4 text-white/30" />
          </motion.div>
        </motion.div>

        {/* Bottom Border Accent */}
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent" />
      </section>

      {/* Section 1: Turnkey Solution with Real Project Image */}
      <TurnkeySolutionSection projects={projects} locale={locale} />

      {/* Section 2: Service Pillars - Professional Cards */}
      <ServicePillarsSection
        sanityServices={services}
        sanityProjects={projects}
        locale={locale}
      />

      {/* Section 3: Expert Insights - Minimal Accordion */}
      <FAQSection
        label="Expert Insights"
        title="Questions"
        titleHighlight="& Answers"
        faqs={[
          {
            question: "Do you handle the full construction scope from empty land?",
            answer: "Yes. We are a licensed Building Contractor (G+12). We handle excavation, concrete, structural steel, and all civil works. You do not need a separate builder.",
          },
          {
            question: "Who manages the government approvals?",
            answer: "We do. Our in-house engineering team handles all permits and NOCs from Dubai Municipality, Civil Defence, DEWA, and master developers like Nakheel or Emaar.",
          },
          {
            question: "Do you manufacture your own furniture?",
            answer: "Yes. We own a dedicated joinery and furniture factory. We custom-make doors, wardrobes, kitchens, and loose furniture to fit your space perfectly.",
          },
          {
            question: "Can you renovate my hotel while it stays open?",
            answer: 'Yes. We specialize in "live environment" renovations. We phase the work to ensure your guests are undisturbed and your revenue stream continues.',
          },
          {
            question: "Do you only do design, or can you build it too?",
            answer: "We are a full Turnkey Solution Provider. We can design your project and then build it using our in-house construction and MEP teams. This is the preferred route for 90% of our clients as it guarantees quality and budget control.",
          },
          {
            question: "Do you provide maintenance after handover?",
            answer: "Yes. We offer comprehensive annual maintenance contracts to ensure your AC, lighting, and finishes remain in showroom condition.",
          },
        ]}
        showCTA={false}
      />

      {/* Section 4: CTA - Clean and Professional */}
      <IntegratedPathCTA />
    </main>
  );
}

// Section 1: Turnkey Solution with Real Project Parallax - Dark Theme
function TurnkeySolutionSection({ projects, locale = 'en' }: { projects: SanityProject[]; locale?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-200px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useParallax(scrollYProgress, 200);

  // Use first featured project image
  const featuredProject = projects[0];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-32 sm:py-40 lg:py-56"
    >
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Gold accent glow */}
      <div className="pointer-events-none absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-[#d4af37]/[0.02] blur-[150px]" />

      <div className="mx-auto max-w-[1800px] px-6 lg:px-16 xl:px-24">
        <div className="grid gap-20 lg:grid-cols-2 lg:gap-32 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center"
          >
            <div className="mb-10">
              <motion.div
                className="mb-4 h-px w-12 bg-gradient-to-r from-[#d4af37] to-transparent"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>

            <h2 className="mb-16 font-SchnyderS text-5xl font-light leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
              We Do Not
              <br />
              <span className="text-[#d4af37]">Outsource Your Vision</span>
            </h2>

            <div className="space-y-10 font-Satoshi text-lg font-light leading-relaxed text-white/60 lg:text-xl">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                In the UAE construction market, quality often gets lost in the
                handovers. Architects hand over to contractors. Contractors hand
                over to sub-contractors. By the end, the vision is diluted.
              </motion.p>

              <motion.p
                className="text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                MIDC was built to solve this. We are a true Turnkey Solution
                Provider.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                From the initial 3D visualization created by Eng. Maher's design
                team to the final HVAC testing performed by our in-house MEP
                engineers, we control every single variable.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="border-l-2 border-[#d4af37]/50 pl-8 text-white text-xl lg:text-2xl"
              >
                <p>
                  No Blame Games.
                  <br />
                  No Delays.
                  <br />
                  No Compromise.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Parallax Project Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="relative h-[700px] lg:h-[900px] overflow-hidden"
          >
            <motion.div
              style={{ y: imageY }}
              className="relative h-full w-full"
            >
              {featuredProject?.mainImage ? (
                <Image
                  src={urlForImage(featuredProject.mainImage)
                    .width(1200)
                    .height(1600)
                    .url()}
                  alt={getLocalizedText(featuredProject.title, locale)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <Image
                  src="/projects/turnkey-design-fitout/_MID0058-HDR.jpg"
                  alt="MIDC Turnkey Design Project"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent" />
            </motion.div>

            {/* Floating Project Label - Dark Theme */}
            {featuredProject && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute bottom-8 left-8 right-8 backdrop-blur-md bg-neutral-950/80 border border-white/10 p-8"
              >
                <div className="font-Satoshi text-[10px] font-light uppercase tracking-[0.3em] text-[#d4af37] mb-2">
                  Featured Project
                </div>
                <div className="font-SchnyderS text-3xl font-light text-white mb-2">
                  {getLocalizedText(featuredProject.title, locale)}
                </div>
                {featuredProject.location && (
                  <div className="font-Satoshi text-sm text-white/50">
                    {getLocalizedText(featuredProject.location, locale)}
                  </div>
                )}
              </motion.div>
            )}

            {/* Corner accents */}
            <div className="absolute right-0 top-0 h-24 w-24 border-r border-t border-[#d4af37]/20" />
            <div className="absolute bottom-0 left-0 h-24 w-24 border-b border-l border-[#d4af37]/20" />
          </motion.div>
        </div>
      </div>

      {/* Section divider */}
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}

// Section 2: Service Pillars - All Visible Grid Design
function ServicePillarsSection({
  sanityServices,
  sanityProjects,
  locale = 'en',
}: {
  sanityServices: SanityService[];
  sanityProjects: SanityProject[];
  locale?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Local project images for fallback (from /projects folder)
  const localImages = {
    civil: "/projects/commercial-interior/_DSC5263-HDR.jpg",
    architecture: "/projects/bedroom-interior/_MID0040-HDR.jpg",
    mep: "/projects/office-fitout/_MID0126-HDR.jpg",
    manufacturing: "/projects/closet/_MID0095-HDR.jpg",
    fitout: "/projects/bathroom/_MID2428-HDR.jpg",
    handover: "/projects/turnkey-design-fitout/_MID0003-HDR.jpg",
  };

  const services = [
    {
      id: "civil",
      number: "01",
      title: "Civil Construction",
      subtitle: "THE STRUCTURE",
      description:
        "We Build. We hold the specific trade licenses to execute heavy civil works. Unlike fit-out firms that can only do interiors, we build from the ground up.",
      capabilities: [
        "Excavation & Piling",
        "Concrete Superstructure",
        "Structural Modifications",
        "Foundation Works",
      ],
      ctaLink: "/services/civil-construction",
      mainImage: sanityServices[0]?.mainImage || sanityProjects[0]?.mainImage,
      localImage: localImages.civil,
    },
    {
      id: "architecture",
      number: "02",
      title: "Interior Architecture",
      subtitle: "THE VISION",
      description:
        'We Design. Led by Eng. Maher Mouhajer, our design studio creates the "Uncluttered Baroque" style. Every concept is validated for technical feasibility instantly.',
      capabilities: [
        "Conceptual Design",
        "3D Visualization",
        "Space Planning",
        "FF&E Selection",
      ],
      ctaLink: "/services/interior-architecture",
      mainImage: sanityServices[1]?.mainImage || sanityProjects[1]?.mainImage,
      localImage: localImages.architecture,
    },
    {
      id: "mep",
      number: "03",
      title: "MEP Engineering",
      subtitle: "THE ENGINE",
      description:
        'We Power. The "Invisible Art." Our in-house MEP Division ensures your asset runs silently and efficiently. We don\'t outsource critical systems.',
      capabilities: [
        "HVAC Design & Install",
        "Load Calculation",
        "Firefighting Systems",
        "Smart Home Integration",
      ],
      ctaLink: "/services/mep-engineering",
      mainImage: sanityServices[2]?.mainImage || sanityProjects[2]?.mainImage,
      localImage: localImages.mep,
    },
    {
      id: "manufacturing",
      number: "04",
      title: "Manufacturing & Joinery",
      subtitle: "THE FACTORY",
      description:
        "We Make. Luxury cannot be bought from a catalog. We operate our own facility to create bespoke woodworks and custom furniture.",
      capabilities: [
        "Walk-in Wardrobes",
        "Vanity Units",
        "Wall Paneling",
        "Loose Furniture",
      ],
      ctaLink: "/services/manufacturing-joinery",
      mainImage: sanityServices[3]?.mainImage || sanityProjects[3]?.mainImage,
      localImage: localImages.manufacturing,
    },
    {
      id: "fitout",
      number: "05",
      title: "Fit-Out Execution",
      subtitle: "THE CRAFT",
      description:
        "We Install. Our teams of masons, gypsum artists, and painters execute the delicate finishes that define luxury.",
      capabilities: [
        "Marble & Stone Installation",
        "Gypsum Cladding",
        "Gold Leafing",
        "Premium Painting",
      ],
      ctaLink: "/services/fit-out-execution",
      mainImage: sanityServices[4]?.mainImage || sanityProjects[4]?.mainImage,
      localImage: localImages.fitout,
    },
    {
      id: "handover",
      number: "06",
      title: "Handover & Maintenance",
      subtitle: "THE CARE",
      description:
        "We Protect. Our job isn't done when we hand over the keys. We offer comprehensive maintenance to protect the asset we built.",
      capabilities: [
        "HVAC Maintenance",
        "Deep Cleaning",
        "Electrical Testing",
        "System Upgrades",
      ],
      ctaLink: "/services/handover-maintenance",
      mainImage: sanityServices[5]?.mainImage || sanityProjects[5]?.mainImage,
      localImage: localImages.handover,
    },
  ];

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-32 sm:py-40 lg:py-48"
    >
      {/* Minimal Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />

      <div className="mx-auto max-w-[1800px] px-6 lg:px-16 xl:px-24">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 lg:mb-24"
        >
          <div className="mb-4">
            <span className="font-Satoshi text-[10px] font-light uppercase tracking-[0.4em] text-white/40">
              Complete Lifecycle Control
            </span>
          </div>

          <h2 className="font-SchnyderS text-5xl font-light leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            Our Core
            <br />
            <span className="text-[#d4af37]">Service Pillars</span>
          </h2>
        </motion.div>

        {/* All Services Grid - 2 columns on desktop, 1 on mobile */}
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {services.map((service, index) => {
            const imageSource = service.mainImage
              ? urlForImage(service.mainImage).width(800).height(600).url()
              : service.localImage;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative"
              >
                <Link href={service.ctaLink} className="block">
                  <div className="relative overflow-hidden border border-white/10 bg-white/[0.02] transition-all duration-500 hover:border-[#d4af37]/30 hover:bg-white/[0.04]">
                    {/* Top Section: Image + Number */}
                    <div className="relative">
                      {/* Image */}
                      <div className="relative aspect-[16/9] overflow-hidden">
                        {imageSource && (
                          <Image
                            src={imageSource}
                            alt={service.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                      </div>

                    </div>

                    {/* Content Section */}
                    <div className="p-8 lg:p-10">
                      {/* Subtitle */}
                      <div className="mb-3 font-Satoshi text-[10px] font-light uppercase tracking-[0.3em] text-[#d4af37]">
                        {service.subtitle}
                      </div>

                      {/* Title */}
                      <h3 className="mb-4 font-SchnyderS text-3xl font-light text-white transition-colors duration-500 group-hover:text-white lg:text-4xl">
                        {service.title}
                      </h3>

                      {/* Description - Always visible */}
                      <p className="mb-6 font-Satoshi text-base font-light leading-relaxed text-white/50">
                        {service.description}
                      </p>

                      {/* Capabilities */}
                      <div className="mb-6 flex flex-wrap gap-2">
                        {service.capabilities.map((cap, i) => (
                          <span
                            key={i}
                            className="border border-white/10 bg-white/5 px-3 py-1.5 font-Satoshi text-[10px] font-light uppercase tracking-wider text-white/40"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center gap-2 font-Satoshi text-sm font-light text-white/60 transition-colors duration-300 group-hover:text-[#d4af37]">
                        <span>Explore Service</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute right-0 top-0 h-16 w-16 border-r border-t border-[#d4af37]/0 transition-all duration-500 group-hover:border-[#d4af37]/30" />
                    <div className="absolute bottom-0 left-0 h-16 w-16 border-b border-l border-[#d4af37]/0 transition-all duration-500 group-hover:border-[#d4af37]/30" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Professional Service Card - No Icons, Image-Focused
function ProfessionalServiceCard({ service, index, isInView }: any) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const cardY = useParallax(scrollYProgress, 30);

  // Determine which image source to use
  const imageSource = service.mainImage
    ? urlForImage(service.mainImage).width(900).height(1200).url()
    : service.localImage;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ y: cardY }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <Link href={service.ctaLink} className="block h-full">
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex h-full flex-col overflow-hidden bg-neutral-900 border border-neutral-800/50 transition-all duration-500 hover:border-neutral-700"
        >
          {/* Large Image */}
          {imageSource ? (
            <div className="relative aspect-[3/4] overflow-hidden">
              <motion.div
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="h-full w-full"
              >
                <Image
                  src={imageSource}
                  alt={service.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </motion.div>

              {/* Subtle Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
            </div>
          ) : (
            <div className="aspect-[3/4] bg-neutral-900 flex items-center justify-center">
              <div className="font-SchnyderS text-4xl font-light text-white/10">
                {service.subtitle}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex flex-1 flex-col p-8 lg:p-10">
            {/* Subtitle */}
            <div className="mb-3 font-Satoshi text-[10px] font-light uppercase tracking-[0.3em] text-neutral-500">
              {service.subtitle}
            </div>

            {/* Title */}
            <h3 className="mb-6 font-SchnyderS text-3xl font-light leading-tight text-white xl:text-4xl">
              {service.title}
            </h3>

            {/* Description */}
            <p className="mb-6 font-Satoshi text-base font-light leading-relaxed text-neutral-400">
              {service.description}
            </p>

            {/* Capabilities */}
            <div className="mb-8 pb-8 border-b border-neutral-800">
              <p className="font-Satoshi text-sm font-light text-neutral-500">
                {service.capabilities[0]}
              </p>
            </div>

            {/* CTA */}
            <div className="mt-auto">
              <motion.div
                className="inline-flex items-center gap-2 font-Satoshi text-sm font-light text-neutral-400 transition-colors group-hover:text-white"
                animate={{ gap: isHovered ? 8 : 8 }}
              >
                <span>Explore</span>
                <motion.div
                  animate={{ x: isHovered ? 4 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRight size={16} />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}


// CTA - Clean and Professional
function IntegratedPathCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-40 lg:py-56"
    >
      {/* Minimal Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950" />

      <div className="relative z-10 mx-auto max-w-[1000px] px-6 text-center lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <h2 className="mb-10 font-SchnyderS text-5xl font-light leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
            Choose the
            <br />
            <span className="text-[#d4af37]">Integrated Path</span>
          </h2>

          <p className="mx-auto mb-16 max-w-2xl font-Satoshi text-xl font-light leading-relaxed text-white/60 lg:text-2xl">
            Stop managing multiple vendors. Start building your legacy with one
            partner.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="/contact"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.3 }}
              className="group inline-flex items-center gap-3 bg-white px-10 py-5 font-Satoshi text-sm font-light tracking-widest text-neutral-950 transition-all hover:bg-neutral-100"
            >
              <span>DISCUSS YOUR PROJECT</span>
              <ArrowRight size={16} />
            </motion.a>

            <motion.a
              href="/about/company-profile"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-3 border border-white/20 px-10 py-5 font-Satoshi text-sm font-light tracking-widest text-white transition-all hover:border-white/40"
            >
              <span>DOWNLOAD PROFILE</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
