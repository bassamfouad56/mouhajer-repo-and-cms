"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { SafeImage } from "@/components/safe-image";
import {
  ArrowRight,
  ArrowLeft,
  Quote,
  Building2,
  Hotel,
  Briefcase,
  Gem,
  ChevronDown,
} from "lucide-react";
import {
  getAllPartners,
  getPartnersByCategory,
  getFeaturedPartners,
  type PartnerLogo,
} from "@/lib/partner-logos";
import { urlForImage } from "@/sanity/lib/image";

// Types
interface SanityTestimonial {
  _id: string;
  name?: string;
  author?: string;
  role?: string;
  position?: string;
  company?: string;
  quote: string;
  image?: unknown;
  avatar?: unknown;
  rating?: number;
  isConfidential?: boolean;
  client?: {
    name: string;
    logo?: unknown;
  };
}

interface ClientsPageContentProps {
  testimonials?: SanityTestimonial[];
  heroImage?: string;
}

// Default testimonials
const defaultTestimonials = [
  {
    id: 1,
    quote:
      "One of the standout qualities of MIDC is their dedication to meeting project timelines without compromising quality. Their clear communication and attention to detail helped keep projects on track, even when handling complex requirements.",
    author: "Ghaleb Al Najjar",
    position: "Consultant – Projects and Infrastructure",
    company: "Abu Dhabi National Hotels",
    rating: 5,
  },
  {
    id: 2,
    quote:
      "MIDC has consistently demonstrated exceptional skill, professionalism, and a strong commitment to delivering high-quality outcomes. Their work on Hyatt Hotels Dubai surpassed our expectations.",
    author: "Sayed Mohammed Al Sayed",
    position: "Director of Area Procurement",
    company: "Grand Hyatt Hotels Dubai",
    rating: 5,
  },
  {
    id: 3,
    quote:
      "I did not want a house that felt like a hotel. I wanted a home that felt like art. Eng. Maher took my vague ideas and translated them into a reality that was sharper and more elegant than I could have imagined.",
    author: "Private Client",
    position: "Villa Owner",
    company: "Confidential",
    rating: 5,
  },
];

// Partner category data
const partnerCategories = [
  {
    key: "hospitality",
    title: "Hospitality Giants",
    subtitle: "World-Class Hotel Groups",
    description:
      "Partnering with the most prestigious hospitality brands to deliver award-winning hotel renovations and fit-outs.",
    icon: Hotel,
    accent: "#c9a962",
    image:
      "/website%202.0%20content/services/industries/luxury%20hospitality/_MID3940-HDR.jpg",
  },
  {
    key: "developer",
    title: "Master Developers",
    subtitle: "Shaping The UAE Skyline",
    description:
      "Collaborating with visionary developers who are redefining luxury living across the Emirates.",
    icon: Building2,
    accent: "#d4c4a8",
    image:
      "/website%202.0%20content/services/industries/highend%20residential/_MID0001-HDR-2.jpg",
  },
  {
    key: "luxury",
    title: "Luxury Brands",
    subtitle: "Premium Partnerships",
    description:
      "Working with world-renowned furniture and lifestyle brands to bring exceptional quality to every space.",
    icon: Gem,
    accent: "#9ca3af",
    image:
      "/website%202.0%20content/services/industries/commercial%20and%20corporate/_MID1004-HDR.jpg",
  },
  {
    key: "corporate",
    title: "Corporate Leaders",
    subtitle: "Industry Innovators",
    description:
      "Serving leading enterprises with spaces that reflect their brand excellence and corporate vision.",
    icon: Briefcase,
    accent: "#a78bfa",
    image:
      "/website%202.0%20content/homepage/The%20Main%20Contractor/_MID9168.jpg",
  },
];

export default function ClientsPageContent({
  testimonials: sanityTestimonials,
  heroImage,
}: ClientsPageContentProps) {
  return (
    <main className="relative bg-neutral-950">
      {/* Section 1: Immersive Hero */}
      <ImmersiveHero heroImage={heroImage} />

      {/* Section 2: Partner Categories with Interactive Cards */}
      <PartnerCategoriesSection />

      {/* Section 3: Featured Partners Showcase */}
      <FeaturedPartnersShowcase />

      {/* Section 4: Cinematic Testimonials */}
      <CinematicTestimonials testimonials={sanityTestimonials} />

      {/* Section 5: CTA */}
      <PartnershipCTA />
    </main>
  );
}

// ============================================
// SECTION 1: Immersive Hero with Scroll Animations
// ============================================
function ImmersiveHero({ heroImage }: { heroImage?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true });
  const partners = getAllPartners();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.5, 0.9]);

  // Create logo rows for background
  const row1 = partners.slice(0, 10);
  const row2 = partners.slice(10, 20);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[800px] overflow-hidden bg-neutral-950"
    >
      {/* Background Image with Parallax */}
      <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
        {heroImage ? (
          <SafeImage
            src={heroImage}
            alt="MIDC Partners"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black" />
        )}
      </motion.div>

      {/* Animated Logo Wall Background */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.04]">
        {/* Row 1 - Moving Right */}
        <div className="absolute top-[25%] left-0 flex animate-marquee-slow whitespace-nowrap">
          {[...row1, ...row1, ...row1].map((partner, idx) => (
            <div key={`r1-${idx}`} className="mx-16 flex-shrink-0">
              <Image
                src={partner.logo}
                alt={partner.name}
                width={140}
                height={70}
                className="h-20 w-auto object-contain brightness-0 invert"
                unoptimized
              />
            </div>
          ))}
        </div>

        {/* Row 2 - Moving Left */}
        <div className="absolute top-[60%] left-0 flex animate-marquee-reverse-slow whitespace-nowrap">
          {[...row2, ...row2, ...row2].map((partner, idx) => (
            <div key={`r2-${idx}`} className="mx-16 flex-shrink-0">
              <Image
                src={partner.logo}
                alt={partner.name}
                width={140}
                height={70}
                className="h-20 w-auto object-contain brightness-0 invert"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Overlay */}
      <motion.div
        className="absolute inset-0 bg-neutral-950"
        style={{ opacity: overlayOpacity }}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/50 h-full" />
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/60 via-transparent to-neutral-950/60" />

      {/* Film Grain */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02]">
        <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')] bg-repeat" />
      </div>

      {/* Corner Decorations */}
      <div className="pointer-events-none absolute left-6 top-32 z-30 hidden h-20 w-20 sm:block lg:left-12">
        <motion.div
          className="absolute left-0 top-0 w-px bg-[#c9a962]/50"
          initial={{ height: 0 }}
          animate={isInView ? { height: 48 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
        />
        <motion.div
          className="absolute left-0 top-0 h-px bg-[#c9a962]/50"
          initial={{ width: 0 }}
          animate={isInView ? { width: 48 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
      <div className="pointer-events-none absolute bottom-32 right-6 z-30 hidden h-20 w-20 sm:block lg:right-12">
        <motion.div
          className="absolute bottom-0 right-0 w-px bg-[#c9a962]/50"
          initial={{ height: 0 }}
          animate={isInView ? { height: 48 } : {}}
          transition={{ duration: 1, delay: 0.7 }}
        />
        <motion.div
          className="absolute bottom-0 right-0 h-px bg-[#c9a962]/50"
          initial={{ width: 0 }}
          animate={isInView ? { width: 48 } : {}}
          transition={{ duration: 1, delay: 0.7 }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-24 lg:px-12"
        style={{ opacity: heroOpacity, y: heroY }}
      >
        <div className="mx-auto max-w-5xl text-center">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8 flex items-center justify-center gap-4"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a962]" />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.4em] text-[#c9a962]">
              Our Clients & Partners
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a962]" />
          </motion.div>

          {/* Main Title - Animated word by word */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: 100 }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              className="mb-4 font-SchnyderS text-5xl font-light leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
            >
              Trusted by the
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: 100 }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
              className="mb-8 font-SchnyderS text-5xl font-light leading-[0.95] tracking-tight text-[#c9a962] sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
            >
              Visionaries.
            </motion.h1>
          </div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mx-auto max-w-3xl font-Satoshi text-lg font-light leading-relaxed text-white/60 sm:text-xl lg:text-2xl"
          >
            We do not just have customers. We have{" "}
            <span className="text-white">enduring partnerships</span> with the
            leaders shaping the UAE skyline.
          </motion.p>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-12 lg:gap-20"
          >
            {[
              { value: "25+", label: "Years Partnership" },
              { value: "150+", label: "Joint Projects" },
              { value: "50+", label: "Trusted Partners" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  className="font-SchnyderS text-4xl text-[#c9a962] lg:text-5xl xl:text-6xl"
                >
                  {stat.value}
                </motion.div>
                <div className="mt-2 font-Satoshi text-[10px] uppercase tracking-[0.2em] text-white/40">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3"
        >
          <span className="font-Satoshi text-[10px] font-light uppercase tracking-[0.3em] text-white/40">
            Explore Our Network
          </span>
          <ChevronDown className="h-5 w-5 text-[#c9a962]/60" strokeWidth={1} />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============================================
// SECTION 2: Partner Categories with Interactive Cards
// ============================================
function PartnerCategoriesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState<string>("hospitality");

  const activeCategoryData = partnerCategories.find(
    (c) => c.key === activeCategory
  );
  const categoryPartners = getPartnersByCategory(
    activeCategory as PartnerLogo["category"]
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-32 lg:py-40"
    >
      {/* Background Image that changes with category */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.15, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <SafeImage
              src={activeCategoryData?.image || ""}
              alt={activeCategoryData?.title || ""}
              fill
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950/80 to-neutral-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-transparent to-neutral-950/90" />
      </div>

      {/* Film Grain */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02]">
        <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')] bg-repeat" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center lg:mb-20"
        >
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a962]/50" />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-[#c9a962]">
              Partner Network
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a962]/50" />
          </div>
          <h2 className="mb-6 font-SchnyderS text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            The Company <span className="text-white/30">We Keep</span>
          </h2>
        </motion.div>

        {/* Category Grid */}
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Left: Category Selector */}
          <div className="lg:col-span-4">
            <div className="space-y-4">
              {partnerCategories.map((category, index) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.key;

                return (
                  <motion.button
                    key={category.key}
                    onClick={() => setActiveCategory(category.key)}
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    className={`group relative w-full overflow-hidden border p-6 text-left transition-all duration-500 ${
                      isActive
                        ? "border-[#c9a962]/50 bg-white/10"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/5"
                    }`}
                  >
                    {/* Progress bar for active */}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-[#c9a962]"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5 }}
                      />
                    )}

                    {/* Corner accent */}
                    <div
                      className={`absolute left-0 top-0 h-8 w-px transition-colors duration-300 ${
                        isActive ? "bg-[#c9a962]" : "bg-[#c9a962]/30"
                      }`}
                    />
                    <div
                      className={`absolute left-0 top-0 h-px w-8 transition-colors duration-300 ${
                        isActive ? "bg-[#c9a962]" : "bg-[#c9a962]/30"
                      }`}
                    />

                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center border transition-all duration-300 ${
                          isActive
                            ? "border-[#c9a962]/50 bg-[#c9a962]/20"
                            : "border-white/10 bg-white/5"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 transition-colors duration-300 ${
                            isActive ? "text-[#c9a962]" : "text-white/50"
                          }`}
                          strokeWidth={1.5}
                        />
                      </div>
                      <div>
                        <span
                          className={`block font-Satoshi text-[10px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${
                            isActive ? "text-[#c9a962]" : "text-white/40"
                          }`}
                        >
                          {category.subtitle}
                        </span>
                        <span
                          className={`block font-SchnyderS text-xl font-light transition-colors duration-300 lg:text-2xl ${
                            isActive ? "text-white" : "text-white/70"
                          }`}
                        >
                          {category.title}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right: Category Details and Partners */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="h-full"
              >
                {/* Description Card */}
                <div className="mb-8 border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm lg:p-10">
                  <p className="mb-6 font-Satoshi text-lg font-light leading-relaxed text-white/70 lg:text-xl">
                    {activeCategoryData?.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-[#c9a962]/50 to-transparent" />
                    <span className="font-Satoshi text-sm font-light text-[#c9a962]">
                      {categoryPartners.length} Partners
                    </span>
                  </div>
                </div>

                {/* Partner Logos Grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {categoryPartners.map((partner, index) => (
                    <motion.div
                      key={partner.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="group flex h-20 items-center justify-center border border-white/10 bg-white/[0.02] p-4 transition-all duration-300 hover:border-[#c9a962]/30 hover:bg-white/5"
                    >
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={120}
                        height={60}
                        className="max-h-12 w-auto object-contain brightness-0 invert opacity-60 transition-all duration-300 group-hover:opacity-100"
                        unoptimized
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="pointer-events-none absolute left-6 top-8 z-30 hidden h-16 w-16 sm:block lg:left-12">
        <div className="absolute left-0 top-0 h-8 w-px bg-[#c9a962]/30" />
        <div className="absolute left-0 top-0 h-px w-8 bg-[#c9a962]/30" />
      </div>
      <div className="pointer-events-none absolute bottom-8 right-6 z-30 hidden h-16 w-16 sm:block lg:right-12">
        <div className="absolute bottom-0 right-0 h-8 w-px bg-[#c9a962]/30" />
        <div className="absolute bottom-0 right-0 h-px w-8 bg-[#c9a962]/30" />
      </div>
    </section>
  );
}

// ============================================
// SECTION 3: Featured Partners Showcase
// ============================================
function FeaturedPartnersShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const featuredPartners = getFeaturedPartners();

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#faf8f5] py-32 lg:py-40"
    >
      {/* Subtle pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L30 60M0 30L60 30' stroke='%23000' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center lg:mb-20"
        >
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a962]/60" />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-[#3d3a36]/60">
              Featured Partnerships
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a962]/60" />
          </div>
          <h2 className="mb-6 font-SchnyderS text-4xl font-light tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
            Partners in <span className="text-[#c9a962]">Excellence</span>
          </h2>
          <p className="mx-auto max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-neutral-500">
            Our partnerships with industry leaders reflect our commitment to
            excellence and our capability to deliver at the highest standards.
          </p>
        </motion.div>

        {/* Partners Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredPartners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * (index % 8) }}
              className="group relative overflow-hidden border border-neutral-200 bg-white p-6 transition-all duration-500 hover:border-[#c9a962]/50 hover:shadow-lg"
            >
              {/* Corner accent on hover */}
              <div className="absolute left-0 top-0 h-0 w-0 border-l-[3px] border-t-[3px] border-transparent transition-all duration-300 group-hover:h-8 group-hover:w-8 group-hover:border-[#c9a962]" />

              {/* Logo */}
              <div className="mb-6 flex h-16 items-center justify-start">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={140}
                  height={56}
                  className="h-12 w-auto max-w-[120px] object-contain grayscale transition-all duration-300 group-hover:grayscale-0"
                  unoptimized
                />
              </div>

              {/* Partner Name */}
              <h3 className="mb-2 font-SchnyderS text-xl text-neutral-950 transition-colors duration-300 group-hover:text-[#c9a962]">
                {partner.name}
              </h3>

              {/* Category Badge */}
              <span className="mb-4 inline-block border border-neutral-200 px-3 py-1 font-Satoshi text-xs capitalize text-neutral-500">
                {partner.category}
              </span>

              {/* Stats */}
              <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
                <div>
                  <div className="font-SchnyderS text-2xl text-[#c9a962]">
                    {partner.projects}+
                  </div>
                  <div className="font-Satoshi text-xs text-neutral-400">
                    Joint Projects
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex h-10 w-10 items-center justify-center border border-neutral-200 transition-all duration-300 group-hover:border-[#c9a962] group-hover:bg-[#c9a962]">
                  <ArrowRight
                    className="h-4 w-4 text-neutral-400 transition-colors duration-300 group-hover:text-white"
                    strokeWidth={1.5}
                  />
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
// SECTION 4: Cinematic Testimonials
// ============================================
function CinematicTestimonials({
  testimonials: sanityTestimonials,
}: {
  testimonials?: SanityTestimonial[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);

  // Transform Sanity testimonials or use defaults
  const safeTestimonials = Array.isArray(sanityTestimonials)
    ? sanityTestimonials
    : [];
  const testimonials =
    safeTestimonials.length > 0
      ? safeTestimonials.map((t, idx) => ({
          id: idx + 1,
          quote: t.quote || "",
          author: t.isConfidential
            ? "Private Client"
            : t.name || t.author || "Anonymous",
          position: t.role || t.position || "",
          company: t.isConfidential
            ? "Confidential"
            : t.company || t.client?.name || "",
          rating: t.rating || 5,
        }))
      : defaultTestimonials;

  // Auto-advance
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () =>
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () =>
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-32 lg:py-40"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c9a962]/5 blur-[200px]" />
      </div>

      {/* Large Quote Background */}
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.02]">
        <Quote
          className="h-[600px] w-[600px] text-[#c9a962]"
          strokeWidth={0.3}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center lg:mb-20"
        >
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a962]/50" />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-[#c9a962]">
              Client Voices
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a962]/50" />
          </div>
          <h2 className="font-SchnyderS text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl">
            What Our <span className="text-white/30">Partners Say</span>
          </h2>
        </motion.div>

        {/* Testimonial Card */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
              className="relative border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm lg:p-12 xl:p-16"
            >
              {/* Quote Icon */}
              <div className="absolute -top-6 left-8 lg:left-12">
                <div className="flex h-12 w-12 items-center justify-center bg-[#c9a962]">
                  <Quote className="h-5 w-5 text-neutral-950" strokeWidth={2} />
                </div>
              </div>

              {/* Quote Text */}
              <blockquote className="mb-10 pt-6">
                <p className="font-Satoshi text-xl font-light italic leading-relaxed text-white/80 lg:text-2xl xl:text-3xl">
                  &ldquo;{activeTestimonial.quote}&rdquo;
                </p>
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center gap-5 border-t border-white/10 pt-8">
                <div className="flex h-16 w-16 items-center justify-center border-2 border-[#c9a962]/30 bg-[#c9a962]/10">
                  <span className="font-SchnyderS text-2xl text-[#c9a962]">
                    {activeTestimonial.author?.charAt(0) || "A"}
                  </span>
                </div>
                <div>
                  <div className="font-SchnyderS text-xl font-light text-white lg:text-2xl">
                    {activeTestimonial.author}
                  </div>
                  <div className="font-Satoshi text-sm font-light text-white/50">
                    {activeTestimonial.position}
                    {activeTestimonial.company && (
                      <span className="text-[#c9a962]">
                        {" "}
                        — {activeTestimonial.company}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Corner accents */}
              <div className="absolute right-0 top-0 h-16 w-16 border-r-2 border-t-2 border-[#c9a962]/20" />
              <div className="absolute bottom-0 left-0 h-16 w-16 border-b-2 border-l-2 border-[#c9a962]/20" />
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              onClick={prevTestimonial}
              className="flex h-12 w-12 items-center justify-center border border-white/10 transition-all duration-300 hover:border-[#c9a962]/50 hover:bg-[#c9a962]/10"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="h-5 w-5 text-white/50" strokeWidth={1.5} />
            </button>

            {/* Dots */}
            <div className="flex gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 transition-all duration-500 ${
                    index === activeIndex
                      ? "w-10 bg-[#c9a962]"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="flex h-12 w-12 items-center justify-center border border-white/10 transition-all duration-300 hover:border-[#c9a962]/50 hover:bg-[#c9a962]/10"
              aria-label="Next testimonial"
            >
              <ArrowRight className="h-5 w-5 text-white/50" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 5: Partnership CTA
// ============================================
function PartnershipCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-32 lg:py-40"
    >
      {/* Background glow */}
      <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-[#c9a962]/10 blur-[150px]" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[#c9a962]/10 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-[1000px] px-6 text-center lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Label */}
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a962]" />
            <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.3em] text-[#c9a962]">
              Join Our Network
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a962]" />
          </div>

          {/* Title */}
          <h2 className="mb-6 font-SchnyderS text-5xl font-light leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            Ready to Partner
            <br />
            <span className="text-[#c9a962]">with Excellence?</span>
          </h2>

          {/* Subtitle */}
          <p className="mx-auto mb-12 max-w-xl font-Satoshi text-lg font-light leading-relaxed text-white/60">
            Join the UAE&apos;s most prestigious brands and hospitality leaders.
            Let&apos;s discuss your next project.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 border border-[#c9a962] bg-[#c9a962] px-10 py-5 font-Satoshi text-sm font-light tracking-widest text-neutral-950 transition-all hover:bg-transparent hover:text-[#c9a962]"
            >
              <span>START A PROJECT</span>
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-2"
              />
            </Link>
            <Link
              href="/about/company-profile"
              className="group inline-flex items-center gap-3 border border-white/30 px-10 py-5 font-Satoshi text-sm font-light tracking-widest text-white transition-all hover:border-[#c9a962] hover:text-[#c9a962]"
            >
              <span>DOWNLOAD PROFILE</span>
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-2"
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
