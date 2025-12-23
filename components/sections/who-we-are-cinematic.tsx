"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useInView,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SafeImage } from "@/components/safe-image";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface WhoWeAreCinematicProps {
  images?: {
    contractor: string;
    designer: string;
    manufacturer: string;
  };
}

// Pillar data - images will be passed as props
const createPillars = (images?: WhoWeAreCinematicProps["images"]) => [
  {
    id: "contractor",
    title: "The Main Contractor",
    subtitle: "We Build",
    description:
      "We hold the trade license to execute heavy civil works. From excavation and piling to the concrete superstructure, our own teams are on site daily.",
    image: images?.contractor || "/placeholder.jpg",
    accent: "#c9a962",
  },
  {
    id: "designer",
    title: "The Designer",
    subtitle: "We Create",
    description:
      "Our creative team designs the vision, but because they work alongside the builders, every drawing is validated for cost and feasibility before you see it.",
    image: images?.designer || "/placeholder.jpg",
    accent: "#a8a29e",
  },
  {
    id: "manufacturer",
    title: "The Manufacturer",
    subtitle: "We Craft",
    description:
      "We manufacture your fire-rated doors, wardrobes, and custom furniture in our own local facility, ensuring perfect fit and zero shipping delays.",
    image: images?.manufacturer || "/placeholder.jpg",
    accent: "#78716c",
  },
];

// Split Screen Panel Component - Image always on left, text on right
function PillarPanel({
  pillar,
  index,
}: {
  pillar: ReturnType<typeof createPillars>[0];
  index: number;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(panelRef, { once: true, margin: "-10%" });

  return (
    <div
      ref={panelRef}
      className="panel relative flex h-screen w-screen shrink-0 overflow-hidden"
    >
      {/* Split Layout - Image on Left, Content on Right */}
      <div className="flex h-full w-full flex-row">
        {/* Image Side */}
        <div className="relative h-full w-1/2">
          <motion.div
            initial={{ scale: 1.2, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <SafeImage
              src={pillar.image}
              alt={pillar.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-[#faf8f5]/20" />
          </motion.div>
        </div>

        {/* Content Side */}
        <div className="relative flex h-full w-1/2 items-center bg-[#faf8f5]">
          {/* Background Pattern */}

          {/* Accent Line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute left-0 top-0 h-full w-px origin-top"
            style={{ backgroundColor: pillar.accent }}
          />

          <div className="relative z-10 px-12 pl-16 lg:px-20 lg:pl-24">
            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-4 flex items-center gap-4"
            >
              <span
                className="font-Satoshi text-xs font-medium uppercase tracking-[0.3em]"
                style={{ color: pillar.accent }}
              >
                {pillar.subtitle}
              </span>
              <div
                className="h-px w-12"
                style={{ backgroundColor: pillar.accent }}
              />
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-8 font-SchnyderS text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl"
            >
              {pillar.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-10 max-w-md font-Satoshi text-base font-light leading-relaxed text-neutral-600 lg:text-lg"
            >
              {pillar.description}
            </motion.p>

            {/* Decorative Element */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={isInView ? { opacity: 1, width: 60 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="h-px"
              style={{ backgroundColor: `${pillar.accent}40` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Opening Panel - "We Are All Three" (Previously Final Panel, now first)
function OpeningPanel({
  pillars,
}: {
  pillars: ReturnType<typeof createPillars>;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(panelRef, { once: true, margin: "-10%" });

  return (
    <div
      ref={panelRef}
      className="panel relative flex h-screen w-screen shrink-0 overflow-hidden"
    >
      {/* Background with all three images blended */}
      <div className="absolute inset-0">
        {pillars.map((pillar, i) => (
          <motion.div
            key={pillar.id}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.15 } : {}}
            transition={{ duration: 1, delay: i * 0.2 }}
            className="absolute inset-0"
            style={{
              clipPath: `polygon(${i * 33}% 0, ${(i + 1) * 33}% 0, ${(i + 1) * 33}% 100%, ${i * 33}% 100%)`,
            }}
          >
            <SafeImage
              src={pillar.image}
              alt=""
              fill
              className="object-cover"
            />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-[#faf8f5]/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5]/50 via-transparent to-[#faf8f5]/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-8">
        {/* Three Cards Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-8 flex gap-4"
        >
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              className="group relative h-16 w-24 overflow-hidden border border-[#c9a962]/20 bg-white/60 backdrop-blur-sm lg:h-20 lg:w-32"
            >
              <SafeImage
                src={pillar.image}
                alt={pillar.title}
                fill
                className="object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100"
              />
              <div className="absolute bottom-1.5 left-2 font-Satoshi text-[8px] uppercase tracking-wider text-neutral-700 lg:text-[9px]">
                {pillar.subtitle}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-4 text-center"
        >
          <h2 className="font-SchnyderS text-2xl font-light tracking-tight text-neutral-700 sm:text-3xl lg:text-4xl">
            The Main Contractor. The Designer. The Manufacturer.
          </h2>
        </motion.div>

        {/* Sub-headline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-8"
        >
          <span className="font-SchnyderS text-4xl font-light italic text-[#c9a962] sm:text-5xl lg:text-6xl">
            We are all three.
          </span>
        </motion.div>

        {/* Body Copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-10 max-w-3xl space-y-4 text-center"
        >
          <p className="font-Satoshi text-sm font-light leading-relaxed text-neutral-600 sm:text-base lg:text-lg">
            Mouhajer International Design & Contracting (MIDC) is more than a
            construction firm; we are the architects of experience. As a premier
            turnkey solution provider based in Dubai and Abu Dhabi, we
            specialize in transforming ambitious concepts into award-winning
            realities.
          </p>
          <p className="font-Satoshi text-sm font-light leading-relaxed text-neutral-500 sm:text-base lg:text-lg">
            From the intricate luxury of 5-star hospitality to the personalized
            grandeur of private residences, our reputation is built on a
            seamless fusion of aesthetic mastery and engineering rigor. We do
            not just build spaces; we curate environments that stand the test of
            time.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <Link
            href="/about"
            className="group relative inline-flex items-center gap-4 overflow-hidden border border-[#c9a962] bg-transparent px-10 py-4 font-Satoshi text-sm font-light uppercase tracking-[0.2em] text-neutral-900 transition-all duration-500 hover:text-neutral-950"
          >
            {/* Background fill on hover */}
            <span className="absolute inset-0 -translate-x-full bg-[#c9a962] transition-transform duration-500 group-hover:translate-x-0" />

            <span className="relative z-10">Explore the MIDC Legacy</span>
            <ArrowUpRight
              className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
        </motion.div>
      </div>

      {/* Corner Accents */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute left-8 top-8 h-16 w-16 border-l border-t border-[#c9a962]/20"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute bottom-8 right-8 h-16 w-16 border-b border-r border-[#c9a962]/20"
      />
    </div>
  );
}

// Main Component with Horizontal Scroll
export function WhoWeAreCinematic({ images }: WhoWeAreCinematicProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [currentPanel, setCurrentPanel] = useState(0);

  // Create pillars with images
  const pillars = createPillars(images);

  // Total panels: Opening + 3 Pillars = 4 panels
  const totalPanels = 4;

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const panels = gsap.utils.toArray<HTMLElement>(".panel");

    // Kill any existing ScrollTrigger instances for this section
    ScrollTrigger.getAll().forEach((st) => {
      if (st.vars.trigger === sectionRef.current) {
        st.kill();
      }
    });

    // Create horizontal scroll animation
    const scrollTween = gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        scrub: 0.8,
        snap: 1 / (panels.length - 1),
        end: () => "+=" + container.offsetWidth * (panels.length - 1),
        onUpdate: (self) => {
          setProgress(self.progress);
          setCurrentPanel(Math.round(self.progress * (panels.length - 1)));
        },
      },
    });

    return () => {
      scrollTween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === sectionRef.current) {
          st.kill();
        }
      });
    };
  }, []);

  const panelLabels = ["Who We Are", ...pillars.map((p) => p.subtitle)];

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#faf8f5]">
      {/* Progress Bar - Top */}
      <div className="absolute left-0 top-0 z-50 h-[2px] w-full bg-[#c9a962]/10">
        <motion.div
          className="h-full bg-[#c9a962]"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Horizontal Scroll Container */}
      <div ref={containerRef} className="flex h-screen">
        {/* Panel 1: Opening - We Are All Three */}
        <OpeningPanel pillars={pillars} />

        {/* Panels 2-4: Three Pillars - Image left, text right */}
        {pillars.map((pillar, index) => (
          <PillarPanel
            key={pillar.id}
            pillar={pillar}
            index={index}
          />
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3">
        {Array.from({ length: totalPanels }).map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === currentPanel
                ? "w-10 bg-[#c9a962]"
                : i < currentPanel
                  ? "w-4 bg-[#c9a962]/50"
                  : "w-4 bg-neutral-300"
            }`}
          />
        ))}
      </div>

      {/* Side Navigation - Desktop */}
      <div className="absolute right-8 top-1/2 z-50 hidden -translate-y-1/2 lg:block">
        <div className="flex flex-col items-end gap-6">
          {panelLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-4">
              <span
                className={`font-Satoshi text-[10px] uppercase tracking-wider transition-all duration-300 ${
                  i === currentPanel ? "text-neutral-600" : "text-transparent"
                }`}
              >
                {label}
              </span>
              <div
                className={`h-3 w-3 rounded-full border transition-all duration-300 ${
                  i === currentPanel
                    ? "border-[#c9a962] bg-[#c9a962]"
                    : i < currentPanel
                      ? "border-[#c9a962]/50 bg-[#c9a962]/50"
                      : "border-neutral-300 bg-transparent"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
