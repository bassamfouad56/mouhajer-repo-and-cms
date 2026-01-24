"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
} from "framer-motion";
import { useRef, ReactNode, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { FAQSection } from "@/components/sections/faq";
import Link from "next/link";
import { SafeImage } from "@/components/safe-image";

// Types for the template
interface CapabilityItem {
  label: string;
  desc: string;
}

interface Capability {
  id: number;
  icon?: () => ReactNode; // Optional - not displayed in cards
  title: string;
  subtitle: string;
  image: string;
  items: CapabilityItem[];
}

interface CaseStudyStat {
  value: string | number;
  label: string;
}

interface CaseStudyCertificate {
  image: string;
  label: string;
}

interface CaseStudy {
  label: string;
  title: string;
  description: string[];
  approach?: string;
  approachItems?: string[];
  result?: string;
  stats?: CaseStudyStat[];
  certificates?: CaseStudyCertificate[];
}

interface FAQ {
  question: string;
  answer: string;
}

interface ServiceDetailTemplateProps {
  // Hero section
  heroImage: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroSubtitle: string;

  // Section 1 - Introduction
  introTitle: string;
  introHighlight?: string;
  introParagraphs: string[];

  // Section 2 - Capabilities
  capabilitiesTitle: string;
  capabilities: Capability[];

  // Section 3 - Case Study
  caseStudy: CaseStudy;

  // Section 4 - FAQs
  faqs: FAQ[];

  // Section 5 - CTA
  ctaTitle: string;
  ctaTitleHighlight: string;
  ctaSubtitle: string;
  ctaImage?: string;
}

// Stagger animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const imageRevealVariants = {
  hidden: {
    clipPath: "inset(100% 0 0 0)",
    opacity: 0,
  },
  visible: {
    clipPath: "inset(0% 0 0 0)",
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const scaleRevealVariants = {
  hidden: {
    scale: 1.3,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function ServiceDetailTemplate({
  heroImage,
  heroTitle,
  heroTitleHighlight,
  heroSubtitle,
  introTitle,
  introHighlight,
  introParagraphs,
  capabilitiesTitle,
  capabilities,
  caseStudy,
  faqs,
  ctaTitle,
  ctaTitleHighlight,
  ctaSubtitle,
  ctaImage,
}: ServiceDetailTemplateProps) {
  return (
    <main className="overflow-hidden bg-white">
      <CinematicHero
        image={heroImage}
        title={heroTitle}
        titleHighlight={heroTitleHighlight}
        subtitle={heroSubtitle}
      />
      <IntroSection
        title={introTitle}
        highlight={introHighlight}
        paragraphs={introParagraphs}
      />
      <ImmersiveCapabilities
        title={capabilitiesTitle}
        capabilities={capabilities}
      />
      <CaseStudySection caseStudy={caseStudy} />
      <FAQSection
        label="Expert Insights"
        title="Questions"
        titleHighlight="& Answers"
        showCTA={false}
        faqs={faqs}
      />
      <CTASection
        title={ctaTitle}
        titleHighlight={ctaTitleHighlight}
        subtitle={ctaSubtitle}
        image={ctaImage || heroImage}
      />
    </main>
  );
}

// Cinematic Hero with Parallax and Ken Burns Effect
function CinematicHero({
  image,
  title,
  titleHighlight,
  subtitle,
}: {
  image: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950"
    >
      {/* Parallax Background with Ken Burns */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <motion.div
          className="absolute -inset-[10%]"
          style={{ scale }}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        >
          <SafeImage
            src={image}
            alt={`${title} ${titleHighlight}`}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-neutral-950/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/50 via-transparent to-neutral-950/50" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-6 text-center sm:px-12 lg:px-20"
        style={{ opacity }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Decorative Line */}
          <motion.div
            variants={itemVariants}
            className="mx-auto h-20 w-px bg-gradient-to-b from-transparent via-[#8f7852] to-transparent"
          />

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="font-SchnyderS text-5xl font-light leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
          >
            {title}
            <br />
            <span className="text-[#8f7852]">{titleHighlight}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="mx-auto max-w-3xl font-Satoshi text-lg font-light leading-relaxed text-white/70 sm:text-xl lg:text-2xl"
          >
            {subtitle}
          </motion.p>

          {/* Scroll Indicator */}
          <motion.div variants={itemVariants} className="pt-12">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto flex h-14 w-8 items-start justify-center rounded-full border border-white/20 p-2"
            >
              <motion.div className="h-2 w-1 rounded-full bg-[#8f7852]" />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Corner Accents */}
      <div className="pointer-events-none absolute left-8 top-8 h-20 w-20 border-l border-t border-white/10 sm:left-12 lg:left-20" />
      <div className="pointer-events-none absolute bottom-8 right-8 h-20 w-20 border-b border-r border-white/10 sm:right-12 lg:right-20" />
    </section>
  );
}

// Intro Section with Stagger
function IntroSection({
  title,
  highlight,
  paragraphs,
}: {
  title: string;
  highlight?: string;
  paragraphs: string[];
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-white px-6 py-32 sm:px-12 sm:py-40 lg:px-20 lg:py-48"
    >
      {/* Background Pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #8f7852 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid gap-16 lg:grid-cols-12 lg:gap-20"
        >
          <motion.div variants={itemVariants} className="lg:col-span-5">
            {/* Label */}
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px w-12 bg-[#8f7852]" />
              <span className="font-Satoshi text-sm font-light uppercase tracking-[0.2em] text-[#8f7852]">
                Overview
              </span>
            </div>

            <h2 className="font-SchnyderS text-4xl font-light leading-tight tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
              {title}{" "}
              {highlight && (
                <span className="italic text-[#8f7852]">{highlight}</span>
              )}
            </h2>
          </motion.div>

          <div className="space-y-8 lg:col-span-7">
            {paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                variants={itemVariants}
                className="font-Satoshi text-lg font-light leading-relaxed text-neutral-600 lg:text-xl"
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Scroll-Driven Section Title with Background Reveal
function ScrollRevealSectionTitle({
  title,
  label,
  backgroundImage,
}: {
  title: string;
  label: string;
  backgroundImage: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Transform values for cinematic effects
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 0.5], ["0%", "-20%"]);
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 1, 1, 0],
  );
  const labelOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const titleScale = useTransform(scrollYProgress, [0, 0.3], [0.9, 1]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.7, 0.5]);

  return (
    <section ref={sectionRef} className="relative h-[200vh] bg-neutral-950">
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
          <SafeImage
            src={backgroundImage}
            alt={title}
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Dynamic Overlay */}
        <motion.div
          className="absolute inset-0 bg-neutral-950"
          style={{ opacity: overlayOpacity }}
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/60 via-transparent to-neutral-950/60" />

        {/* Gold Ambient Glow */}
        <motion.div
          className="absolute left-1/4 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#8f7852]/[0.08] blur-[150px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Content */}
        <div className="relative z-10 flex h-full items-center justify-center">
          <motion.div
            className="mx-auto container px-6 text-center sm:px-12"
            style={{ y: textY }}
          >
            {/* Label */}
            <motion.div
              style={{ opacity: labelOpacity }}
              className="mb-8 flex items-center justify-center gap-4"
            >
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#8f7852]" />
              <span className="font-Satoshi text-xs font-medium uppercase tracking-[0.4em] text-[#8f7852]">
                {label}
              </span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#8f7852]" />
            </motion.div>

            {/* Title with Scale and Opacity Animation */}
            <motion.h2
              style={{ opacity: textOpacity, scale: titleScale }}
              className="font-SchnyderS text-5xl font-light leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl"
            >
              {title}
            </motion.h2>

            {/* Decorative Line Below */}
            <motion.div
              style={{ opacity: textOpacity }}
              className="mx-auto mt-10 h-20 w-px bg-gradient-to-b from-[#8f7852] to-transparent"
            />
          </motion.div>
        </div>

        {/* Corner Accents */}
        <div className="pointer-events-none absolute left-8 top-24 h-16 w-16 border-l border-t border-[#8f7852]/20 sm:left-12 lg:left-20" />
        <div className="pointer-events-none absolute bottom-24 right-8 h-16 w-16 border-b border-r border-[#8f7852]/20 sm:right-12 lg:right-20" />

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="font-Satoshi text-[10px] uppercase tracking-[0.3em] text-white/40">
              Scroll
            </span>
            <div className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Immersive Capabilities with Dramatic Image Reveals
function ImmersiveCapabilities({
  title,
  capabilities,
}: {
  title: string;
  capabilities: Capability[];
}) {
  // Get the first capability's image for the scroll reveal background
  const backgroundImage = capabilities[0]?.image || "/placeholder.jpg";

  return (
    <>
      {/* Scroll-Driven Section Title */}
      <ScrollRevealSectionTitle
        title={title}
        label="What We Deliver"
        backgroundImage={backgroundImage}
      />

      {/* Capabilities Cards */}
      <section className="relative bg-neutral-50">
        {/* Capabilities */}
        <div className="space-y-0">
          {capabilities.map((capability, index) => (
            <CapabilityCard
              key={capability.id}
              capability={capability}
              index={index}
              isEven={index % 2 === 0}
            />
          ))}
        </div>
      </section>
    </>
  );
}

// Individual Capability Card with Full-Width Image
function CapabilityCard({
  capability,
  isEven,
}: {
  capability: Capability;
  index: number;
  isEven: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [isHovered, setIsHovered] = useState(false);

  // Smooth spring for hover effects
  const hoverScale = useSpring(1, { stiffness: 300, damping: 30 });

  return (
    <motion.div
      ref={ref}
      className="group relative"
      onMouseEnter={() => {
        setIsHovered(true);
        hoverScale.set(1.02);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        hoverScale.set(1);
      }}
    >
      <div
        className={`grid lg:grid-cols-12 ${isEven ? "" : "lg:[direction:rtl]"}`}
      >
        {/* Image Side - Larger and Taller */}
        <motion.div
          className="relative aspect-3/4 overflow-hidden sm:aspect-4/3 lg:aspect-auto lg:col-span-7 lg:min-h-[800px] lg:[direction:ltr]"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={imageRevealVariants}
        >
          <motion.div
            className="absolute inset-0"
            style={{ scale: hoverScale }}
          >
            <motion.div
              className="absolute inset-0"
              variants={scaleRevealVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <SafeImage
                src={capability.image}
                alt={capability.title}
                fill
                className="object-cover"
              />
            </motion.div>
          </motion.div>

          {/* Image Overlay on Hover */}
          <motion.div
            className="absolute inset-0 bg-[#8f7852]/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>

        {/* Content Side */}
        <motion.div
          className="flex flex-col justify-center bg-white px-6 py-16 sm:px-12 sm:py-20 lg:col-span-5 lg:min-h-[800px] lg:px-12 lg:py-24 xl:px-16 lg:[direction:ltr]"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="mx-auto max-w-xl">
            {/* Title & Subtitle */}
            <motion.div variants={itemVariants} className="mb-10 space-y-3">
              <p className="font-Satoshi text-sm font-light uppercase tracking-[0.15em] text-[#8f7852]">
                {capability.subtitle}
              </p>
              <h3 className="font-SchnyderS text-3xl font-light text-neutral-950 transition-colors duration-500 group-hover:text-[#8f7852] lg:text-4xl xl:text-5xl">
                {capability.title}
              </h3>
            </motion.div>

            {/* Items */}
            <div className="space-y-8">
              {capability.items.map((item, itemIndex) => (
                <motion.div
                  key={itemIndex}
                  variants={itemVariants}
                  className="group/item relative pl-8 transition-all duration-300 hover:pl-10"
                >
                  {/* Animated Border */}
                  <motion.div
                    className="absolute left-0 top-0 h-full w-0.5 bg-neutral-200"
                    whileHover={{ backgroundColor: "#8f7852" }}
                  >
                    <motion.div
                      className="absolute left-0 top-0 h-0 w-full bg-[#8f7852]"
                      initial={{ height: 0 }}
                      whileHover={{ height: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>

                  <div className="mb-2">
                    <span className="font-Satoshi text-lg font-medium text-neutral-950">
                      {item.label}
                    </span>
                  </div>
                  <p className="font-Satoshi text-base font-light leading-relaxed text-neutral-600">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Case Study Section with Stats Animation
function CaseStudySection({ caseStudy }: { caseStudy: CaseStudy }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-neutral-950 px-6 py-32 sm:px-12 sm:py-40 lg:px-20 lg:py-48"
    >
      {/* Background Pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #8f7852 1px, transparent 0)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative mx-auto max-w-7xl"
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="mb-16">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px w-12 bg-[#8f7852]" />
            <span className="font-Satoshi text-sm font-light uppercase tracking-[0.2em] text-[#8f7852]">
              Case Study
            </span>
          </div>
        </motion.div>

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Content Column */}
          <div className="space-y-8">
            <motion.div
              variants={itemVariants}
              className="inline-block border-b-2 border-[#8f7852] pb-2 font-Satoshi text-sm font-light uppercase tracking-wider text-[#8f7852]"
            >
              {caseStudy.label}
            </motion.div>

            <motion.h3
              variants={itemVariants}
              className="font-SchnyderS text-3xl font-light text-white lg:text-4xl xl:text-5xl"
            >
              {caseStudy.title}
            </motion.h3>

            {caseStudy.description.map((desc, index) => (
              <motion.p
                key={index}
                variants={itemVariants}
                className="font-Satoshi text-base font-light leading-relaxed text-white/70 lg:text-lg"
                dangerouslySetInnerHTML={{ __html: desc }}
              />
            ))}

            {caseStudy.approach && (
              <motion.p
                variants={itemVariants}
                className="font-Satoshi text-base font-light leading-relaxed text-white/70 lg:text-lg"
              >
                {caseStudy.approach}
              </motion.p>
            )}

            {caseStudy.approachItems && caseStudy.approachItems.length > 0 && (
              <motion.ul
                variants={itemVariants}
                className="space-y-4 border-l-2 border-[#8f7852] pl-6"
              >
                {caseStudy.approachItems.map((item, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    className="font-Satoshi text-base font-light leading-relaxed text-white/70"
                    dangerouslySetInnerHTML={{ __html: item }}
                  />
                ))}
              </motion.ul>
            )}

            {caseStudy.result && (
              <motion.p
                variants={itemVariants}
                className="font-Satoshi text-base font-light leading-relaxed text-white/70 lg:text-lg"
                dangerouslySetInnerHTML={{ __html: caseStudy.result }}
              />
            )}
          </div>

          {/* Stats/Certificates Column */}
          <motion.div variants={itemVariants} className="flex items-center">
            <div className="w-full space-y-8 border-t border-white/10 pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
              {/* Show Certificates if available */}
              {caseStudy.certificates && caseStudy.certificates.length > 0 ? (
                <>
                  <div className="font-Satoshi text-sm font-light uppercase tracking-wider text-white/50">
                    Certifications
                  </div>
                  <div className="grid grid-cols-2 gap-8 lg:gap-12">
                    {caseStudy.certificates.map((cert, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                        className="group flex flex-col items-center text-center"
                      >
                        <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-lg border border-white/10 bg-white/5 p-4 transition-all duration-300 group-hover:border-[#8f7852]/30 group-hover:bg-white/10 lg:h-32 lg:w-32">
                          <SafeImage
                            src={cert.image}
                            alt={cert.label}
                            width={80}
                            height={80}
                            className="h-auto w-full object-contain"
                          />
                        </div>
                        <div className="font-Satoshi text-sm font-light text-white/70">
                          {cert.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : caseStudy.stats && caseStudy.stats.length > 0 ? (
                <>
                  <div className="font-Satoshi text-sm font-light uppercase tracking-wider text-white/50">
                    Project Stats
                  </div>
                  <div className="grid grid-cols-2 gap-8 lg:gap-12">
                    {caseStudy.stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                        className="group"
                      >
                        <div className="mb-3 font-SchnyderS text-4xl font-light text-[#8f7852] transition-transform duration-300 group-hover:scale-110 lg:text-5xl">
                          {stat.value}
                        </div>
                        <div className="font-Satoshi text-sm font-light text-white/70">
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// CTA Section with Parallax
function CTASection({
  title,
  titleHighlight,
  subtitle,
  image,
}: {
  title: string;
  titleHighlight: string;
  subtitle: string;
  image: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-neutral-950"
    >
      {/* Parallax Background */}
      <motion.div className="absolute inset-0">
        <motion.div className="absolute -inset-[10%]" style={{ scale }}>
          <SafeImage
            src={image}
            alt="CTA Background"
            fill
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-neutral-950/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/50 h-full" />
      </motion.div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center sm:px-12"
      >
        <motion.div
          variants={itemVariants}
          className="mb-8 inline-block border border-white/20 px-6 py-2 font-Satoshi text-sm font-light uppercase tracking-[0.2em] text-white/60"
        >
          Get Started
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="mb-8 font-SchnyderS text-4xl font-light leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
        >
          {title}
          <br />
          <span className="text-[#8f7852]">{titleHighlight}</span>
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="mx-auto mb-12 max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-white/70"
        >
          {subtitle}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 border-2 border-[#8f7852] bg-[#8f7852] px-8 py-4 font-Satoshi text-sm font-medium uppercase tracking-wider text-neutral-950 transition-all duration-300 hover:bg-transparent hover:text-[#8f7852]"
          >
            Start Your Project
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="/services"
            className="group inline-flex items-center gap-3 border-2 border-white/30 px-8 py-4 font-Satoshi text-sm font-medium uppercase tracking-wider text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-neutral-950"
          >
            All Services
            <ArrowUpRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </motion.div>
      </motion.div>

      {/* Corner Accents */}
      <div className="pointer-events-none absolute left-8 top-8 h-16 w-16 border-l border-t border-[#8f7852]/30 sm:left-12 lg:left-20" />
      <div className="pointer-events-none absolute bottom-8 right-8 h-16 w-16 border-b border-r border-[#8f7852]/30 sm:right-12 lg:right-20" />
    </section>
  );
}

export default ServiceDetailTemplate;
