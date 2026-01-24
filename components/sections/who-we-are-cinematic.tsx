"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SafeImage } from "@/components/safe-image";
import { ArrowRight, ChevronDown } from "lucide-react";

interface WhoWeAreCinematicProps {
  images?: {
    contractor: string;
    designer: string;
    manufacturer: string;
  };
}

// Panel data with rich content
const createPanels = (images?: WhoWeAreCinematicProps["images"]) => [
  {
    id: "build",
    number: "01",
    label: "We Build",
    title: "The Main Contractor",
    subtitle: "From Foundation to Finish",
    description:
      "We hold the trade license to execute heavy civil works. From excavation and piling to the concrete superstructure, our own teams are on site daily — ensuring quality control at every pour, every weld, every connection.",
    longDescription:
      "Our construction division operates with full autonomy, equipped with the latest machinery and a workforce trained to international standards. We don't subcontract the critical path — we own it.",
    image: images?.contractor || "/placeholder.jpg",
    accent: "#8f7852",
    capabilities: [
      { title: "Civil Works", desc: "Excavation, piling, foundations" },
      { title: "Structural", desc: "Concrete & steel frameworks" },
      { title: "MEP Systems", desc: "Mechanical, electrical, plumbing" },
      { title: "Finishing", desc: "Premium interior finishes" },
    ],
  },
  {
    id: "design",
    number: "02",
    label: "We Design",
    title: "The Design Studio",
    subtitle: "Vision Meets Feasibility",
    description:
      "Our creative team designs the vision, but because they work alongside the builders, every drawing is validated for cost and feasibility before you see it. No surprises, no value engineering disappointments.",
    longDescription:
      "Architecture and interiors conceived with construction intelligence. Our designers understand material costs, installation complexities, and timeline implications — creating designs that are as buildable as they are beautiful.",
    image: images?.designer || "/placeholder.jpg",
    accent: "#a8a29e",
    capabilities: [
      { title: "Architecture", desc: "Concept to construction docs" },
      { title: "Interiors", desc: "Space planning & styling" },
      { title: "3D Visualization", desc: "Photorealistic renders" },
      { title: "Documentation", desc: "Full permit packages" },
    ],
  },
  {
    id: "make",
    number: "03",
    label: "We Make",
    title: "The Mouhajer Factory",
    subtitle: "Crafted Locally, Delivered Precisely",
    description:
      "Why wait for imports? We manufacture your fire-rated doors, wardrobes, and custom furniture in our own local facility — ensuring perfect fit, zero shipping delays, and the ability to adjust on the fly.",
    longDescription:
      "Our 20,000 sqft manufacturing facility houses CNC machinery, spray booths, and skilled craftsmen. From bespoke joinery to metal fabrication, we control the quality and timeline of every custom element.",
    image: images?.manufacturer || "/placeholder.jpg",
    accent: "#78716c",
    capabilities: [
      { title: "Joinery", desc: "Doors, wardrobes, millwork" },
      { title: "Furniture", desc: "Custom beds, tables, seating" },
      { title: "Metalwork", desc: "Railings, screens, fixtures" },
      { title: "Custom Pieces", desc: "One-of-a-kind creations" },
    ],
  },
];

export function WhoWeAreCinematic({ images }: WhoWeAreCinematicProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const panels = createPanels(images);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Transform vertical scroll to horizontal scroll
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-200%"]);

  // Overall progress for indicators
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[400vh] bg-neutral-950 md:h-[500vh] lg:h-[600vh]"
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Fixed Header - with navbar offset */}
        <div className="absolute left-0 right-0 top-0 z-40 px-4 pb-4 pt-20 sm:px-6 sm:pb-6 sm:pt-24 lg:px-12 lg:pb-8 lg:pt-28">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-4"
          >
            {/* Left: Title */}
            <div className="text-center lg:text-left">
              <span className="mb-2 inline-block font-Satoshi text-[9px] uppercase tracking-[0.3em] text-[#8f7852] sm:text-[10px] sm:tracking-[0.4em]">
                Who We Are
              </span>
              <h2 className="font-SchnyderS text-2xl font-light tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
                <span className="block sm:inline">
                  The Contractor. The Designer.
                </span>{" "}
                <span className="text-[#8f7852]">The Maker.</span>
              </h2>
            </div>

            {/* Right: Tagline - Hidden on mobile */}
            <div className="hidden lg:block">
              <p className="max-w-xs text-right font-Satoshi text-sm font-light leading-relaxed text-white/50">
                Three disciplines. One integrated team.
                <br />
                <span className="text-[#8f7852]">We are all three.</span>
              </p>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="mx-auto mt-4 max-w-4xl sm:mt-6 lg:mt-8">
            <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#8f7852] to-[#e8d5a3]"
                style={{ width: progressWidth }}
              />
            </div>
            {/* Panel Indicators */}
            <div className="mt-3 flex justify-between sm:mt-4">
              {panels.map((panel, index) => (
                <motion.div
                  key={panel.id}
                  className="flex items-center gap-1 sm:gap-2"
                  style={{
                    opacity: useTransform(
                      scrollYProgress,
                      [
                        Math.max(0, (index - 0.5) / panels.length),
                        index / panels.length,
                        (index + 0.5) / panels.length,
                        Math.min(1, (index + 1) / panels.length),
                      ],
                      [0.3, 1, 1, index === panels.length - 1 ? 1 : 0.3],
                    ),
                  }}
                >
                  <span
                    className="font-Satoshi text-[8px] uppercase tracking-[0.2em] sm:text-[10px] sm:tracking-[0.3em] lg:text-xs"
                    style={{ color: panel.accent }}
                  >
                    {panel.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <motion.div className="flex h-full" style={{ x }}>
          {panels.map((panel, index) => (
            <div
              key={panel.id}
              className="relative flex h-full w-screen shrink-0"
            >
              {/* Full Background Image */}
              <motion.div
                className="absolute inset-0"
                style={{
                  scale: useTransform(
                    scrollYProgress,
                    [
                      index / panels.length,
                      (index + 0.5) / panels.length,
                      (index + 1) / panels.length,
                    ],
                    [1.1, 1, 1.05],
                  ),
                }}
              >
                <SafeImage
                  src={panel.image}
                  alt={panel.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                {/* Cinematic Overlays - Stronger on mobile for readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/60 to-neutral-950/30 sm:via-neutral-950/40 sm:to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent sm:from-neutral-950/60" />
                <div className="absolute inset-0 bg-neutral-950/40 sm:bg-neutral-950/30" />
              </motion.div>

              {/* Content Container */}
              <div className="relative z-10 flex h-full w-full flex-col justify-end px-4 pb-20 pt-44 sm:px-6 sm:pb-24 sm:pt-52 lg:flex-row lg:items-center lg:justify-start lg:px-12 lg:pb-16 lg:pt-64 xl:px-20">
                {/* Main Content */}
                <div className="max-w-full sm:max-w-xl lg:max-w-3xl">
                  {/* Panel Label */}
                  <motion.div
                    className="mb-4 flex items-center gap-3 sm:mb-6 sm:gap-4"
                    style={{
                      opacity: useTransform(
                        scrollYProgress,
                        [
                          Math.max(0, index / panels.length - 0.05),
                          index / panels.length + 0.08,
                        ],
                        [0, 1],
                      ),
                      y: useTransform(
                        scrollYProgress,
                        [
                          Math.max(0, index / panels.length - 0.05),
                          index / panels.length + 0.1,
                        ],
                        [40, 0],
                      ),
                    }}
                  >
                    <div
                      className="h-0.5 w-8 sm:h-1 sm:w-12"
                      style={{ backgroundColor: panel.accent }}
                    />
                    <span
                      className="font-Satoshi text-[10px] uppercase tracking-[0.2em] sm:text-xs sm:tracking-[0.3em]"
                      style={{ color: panel.accent }}
                    >
                      {panel.label}
                    </span>
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    className="mb-2 font-SchnyderS text-3xl font-light leading-[1.1] text-white sm:mb-3 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                    style={{
                      opacity: useTransform(
                        scrollYProgress,
                        [
                          Math.max(0, index / panels.length),
                          index / panels.length + 0.1,
                        ],
                        [0, 1],
                      ),
                      y: useTransform(
                        scrollYProgress,
                        [
                          Math.max(0, index / panels.length),
                          index / panels.length + 0.12,
                        ],
                        [60, 0],
                      ),
                    }}
                  >
                    {panel.title}
                  </motion.h3>

                  {/* Subtitle */}
                  <motion.p
                    className="mb-4 font-Satoshi text-sm font-light tracking-wide text-white/60 sm:mb-6 sm:text-base lg:text-xl"
                    style={{
                      opacity: useTransform(
                        scrollYProgress,
                        [
                          Math.max(0, index / panels.length + 0.02),
                          index / panels.length + 0.12,
                        ],
                        [0, 1],
                      ),
                    }}
                  >
                    {panel.subtitle}
                  </motion.p>

                  {/* Main Description */}
                  <motion.p
                    className="mb-6 max-w-md font-Satoshi text-sm font-light leading-relaxed text-white/70 sm:mb-8 sm:max-w-xl sm:text-base lg:text-lg lg:leading-relaxed"
                    style={{
                      opacity: useTransform(
                        scrollYProgress,
                        [
                          Math.max(0, index / panels.length + 0.04),
                          index / panels.length + 0.14,
                        ],
                        [0, 1],
                      ),
                      y: useTransform(
                        scrollYProgress,
                        [
                          Math.max(0, index / panels.length + 0.04),
                          index / panels.length + 0.16,
                        ],
                        [30, 0],
                      ),
                    }}
                  >
                    {panel.description}
                  </motion.p>

                  {/* Capabilities Grid */}
                  <motion.div
                    className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4"
                    style={{
                      opacity: useTransform(
                        scrollYProgress,
                        [
                          Math.max(0, index / panels.length + 0.08),
                          index / panels.length + 0.18,
                        ],
                        [0, 1],
                      ),
                    }}
                  >
                    {panel.capabilities.map((cap, capIndex) => (
                      <motion.div
                        key={cap.title}
                        className="group relative overflow-hidden rounded-sm border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10 sm:p-4 lg:p-5"
                        style={{
                          y: useTransform(
                            scrollYProgress,
                            [
                              Math.max(
                                0,
                                index / panels.length + 0.08 + capIndex * 0.02,
                              ),
                              index / panels.length + 0.2 + capIndex * 0.02,
                            ],
                            [20, 0],
                          ),
                        }}
                      >
                        {/* Accent line */}
                        <div
                          className="absolute left-0 top-0 h-full w-[2px] transition-all duration-300 group-hover:w-1"
                          style={{ backgroundColor: panel.accent }}
                        />
                        <h4 className="mb-0.5 font-Satoshi text-xs font-medium text-white sm:mb-1 sm:text-sm lg:text-base">
                          {cap.title}
                        </h4>
                        <p className="font-Satoshi text-[10px] font-light leading-tight text-white/50 sm:text-xs lg:text-sm">
                          {cap.desc}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* Panel Divider */}
              {index < panels.length - 1 && (
                <div className="absolute right-0 top-1/2 hidden h-2/3 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-white/20 to-transparent lg:block" />
              )}
            </div>
          ))}
        </motion.div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 sm:bottom-6 sm:gap-6 lg:bottom-10 lg:gap-8">
          {panels.map((panel, index) => (
            <motion.div
              key={panel.id}
              className="relative"
              style={{
                scale: useTransform(
                  scrollYProgress,
                  [
                    Math.max(0, (index - 0.3) / panels.length),
                    index / panels.length,
                    (index + 0.7) / panels.length,
                    Math.min(1, (index + 1) / panels.length),
                  ],
                  [0.8, 1.2, 1.2, index === panels.length - 1 ? 1.2 : 0.8],
                ),
              }}
            >
              <motion.div
                className="h-1.5 rounded-full transition-all duration-500 sm:h-2"
                style={{
                  width: useTransform(
                    scrollYProgress,
                    [
                      Math.max(0, (index - 0.3) / panels.length),
                      index / panels.length,
                      (index + 0.7) / panels.length,
                      Math.min(1, (index + 1) / panels.length),
                    ],
                    [6, 32, 32, index === panels.length - 1 ? 32 : 6],
                  ),
                  backgroundColor: useTransform(
                    scrollYProgress,
                    [
                      Math.max(0, (index - 0.3) / panels.length),
                      index / panels.length,
                      (index + 0.7) / panels.length,
                      Math.min(1, (index + 1) / panels.length),
                    ],
                    [
                      "rgba(255,255,255,0.2)",
                      panel.accent,
                      panel.accent,
                      index === panels.length - 1
                        ? panel.accent
                        : "rgba(255,255,255,0.2)",
                    ],
                  ),
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Mobile Scroll Hint */}
        <motion.div
          className="absolute bottom-4 right-4 z-40 flex items-center gap-2 sm:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4 text-[#8f7852]" />
          </motion.div>
        </motion.div>

        {/* Desktop Scroll Hint */}

        {/* Corner Decorations - Hidden on very small screens */}
        <div className="pointer-events-none absolute bottom-6 left-4 z-30 hidden h-12 w-12 sm:block sm:left-6 lg:left-12 lg:h-16 lg:w-16">
          <div className="absolute bottom-0 left-0 h-6 w-px bg-[#8f7852]/30 lg:h-8" />
          <div className="absolute bottom-0 left-0 h-px w-6 bg-[#8f7852]/30 lg:w-8" />
        </div>
        <div className="pointer-events-none absolute right-4 top-6 z-30 hidden h-12 w-12 sm:block sm:right-6 lg:right-12 lg:h-16 lg:w-16">
          <div className="absolute right-0 top-0 h-6 w-px bg-[#8f7852]/30 lg:h-8" />
          <div className="absolute right-0 top-0 h-px w-6 bg-[#8f7852]/30 lg:w-8" />
        </div>
      </div>
    </section>
  );
}
