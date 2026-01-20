"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Hotel,
  Home,
  Building2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { SafeImage } from "@/components/safe-image";
import { useTranslations } from "next-intl";

interface SectorsExpertiseProps {
  images?: {
    hospitality: string;
    residential: string;
    commercial: string;
  };
}

export function SectorsExpertise({ images }: SectorsExpertiseProps) {
  const t = useTranslations("Sectors");
  const tCommon = useTranslations("Common");

  // Define sectors inside component to use translations
  const defaultSectors = [
    {
      id: "hospitality",
      title: t("items.hospitality.title"),
      subtitle: t("items.hospitality.subtitle"),
      description: t("items.hospitality.description"),
      features: [
        t("items.hospitality.features.0"),
        t("items.hospitality.features.1"),
        t("items.hospitality.features.2"),
      ],
      link: "/industries/luxury-hospitality",
      icon: Hotel,
      stats: { projects: "50+", value: "AED 500M+" },
      accent: "#c9a962",
      gradient: "from-amber-900/80 via-neutral-900/60 to-neutral-900/90",
    },
    {
      id: "residential",
      title: t("items.residential.title"),
      subtitle: t("items.residential.subtitle"),
      description: t("items.residential.description"),
      features: [
        t("items.residential.features.0"),
        t("items.residential.features.1"),
        t("items.residential.features.2"),
      ],
      link: "/industries/high-end-residential",
      icon: Home,
      stats: { projects: "300+", value: "AED 2B+" },
      accent: "#d4c4a8",
      gradient: "from-stone-900/80 via-neutral-900/60 to-neutral-900/90",
    },
    {
      id: "commercial",
      title: t("items.commercial.title"),
      subtitle: t("items.commercial.subtitle"),
      description: t("items.commercial.description"),
      features: [
        t("items.commercial.features.0"),
        t("items.commercial.features.1"),
        t("items.commercial.features.2"),
      ],
      link: "/industries/commercial-corporate",
      icon: Building2,
      stats: { projects: "100+", value: "AED 300M+" },
      accent: "#9ca3af",
      gradient: "from-slate-900/80 via-neutral-900/60 to-neutral-900/90",
    },
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const headerInView = useInView(headerRef, { once: true, margin: "-50px" });

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax effects
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.3, 1, 1, 0.3]
  );

  // Mouse tracking for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [3, -3]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-3, 3]),
    springConfig
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, index: number) => {
      if (hoveredIndex !== index) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    },
    [hoveredIndex, mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setHoveredIndex(null);
  }, [mouseX, mouseY]);

  // Default fallback images for each sector
  const fallbackImages: Record<string, string> = {
    hospitality:
      "/website%202.0%20content/services/industries/luxury%20hospitality/_MID3940-HDR.jpg",
    residential:
      "/website%202.0%20content/services/industries/highend%20residential/_MID0001-HDR-2.jpg",
    commercial:
      "/website%202.0%20content/services/industries/commercial%20and%20corporate/_MID1004-HDR.jpg",
  };

  // Merge default sectors with images
  const sectors = useMemo(() => {
    return defaultSectors.map((sector) => ({
      ...sector,
      image:
        images?.[sector.id as keyof typeof images] ||
        fallbackImages[sector.id] ||
        "/placeholder.jpg",
    }));
  }, [images]);

  return (
    <section
      ref={sectionRef}
      id="sectors"
      className="relative overflow-hidden bg-neutral-950 py-24 sm:py-32 lg:py-40 scroll-mt-24"
    >
      {/* Cinematic Background Effects */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        {/* Gradient Orbs */}
        <div className="absolute -left-1/4 top-0 h-[800px] w-[800px] rounded-full bg-[#c9a962]/[0.03] blur-[150px]" />
        <div className="absolute -right-1/4 bottom-0 h-[600px] w-[600px] rounded-full bg-white/[0.02] blur-[120px]" />
      </motion.div>

      {/* Film Grain Overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.015]">
        <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')] bg-repeat" />
      </div>

      <motion.div className="relative z-10" style={{ opacity }}>
        {/* Section Header - Cinematic */}
        <div ref={headerRef} className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-20 lg:mb-28">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8 flex items-center justify-center gap-4"
            >
              <motion.div
                className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a962]/50"
                initial={{ scaleX: 0 }}
                animate={headerInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.3 }}
              />
              <Sparkles className="h-4 w-4 text-[#c9a962]" strokeWidth={1} />
              <span className="font-Satoshi text-[10px] font-light uppercase tracking-[0.4em] text-[#c9a962]">
                {t("label")}
              </span>
              <motion.div
                className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a962]/50"
                initial={{ scaleX: 0 }}
                animate={headerInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </motion.div>

            {/* Title */}
            <div className="text-center">
              <motion.h2
                initial={{ opacity: 0, y: 50 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 1,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mb-6 font-SchnyderS text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
              >
                {t("titleLine1")}
                <br />
                <motion.span
                  className="text-white/40"
                  initial={{ opacity: 0 }}
                  animate={headerInView ? { opacity: 1 } : {}}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  {t("titleLine2")}
                </motion.span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mx-auto max-w-2xl font-Satoshi text-base font-light leading-relaxed text-white/50 lg:text-lg"
              >
                {t("description")}
              </motion.p>
            </div>
          </div>
        </div>

        {/* Industries Cards - Cinematic Stacked Layout */}
        <div ref={cardsRef} className="relative">
          {/* Full-width cards container */}
          <div className="space-y-8 lg:space-y-12">
            {sectors.map((sector, index) => {
              const Icon = sector.icon;
              const isHovered = hoveredIndex === index;
              const isActive = activeIndex === index;

              return (
                <motion.div
                  key={sector.id}
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 1,
                    delay: index * 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={(e) => handleMouseMove(e, index)}
                >
                  <Link href={sector.link} className="group block">
                    <motion.div
                      className="relative mx-auto max-w-7xl overflow-hidden"
                      style={{
                        rotateX: isHovered ? rotateX : 0,
                        rotateY: isHovered ? rotateY : 0,
                        transformStyle: "preserve-3d",
                        perspective: 1000,
                      }}
                    >
                      {/* Card Container */}
                      <div className="relative mx-4 overflow-hidden border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm transition-all duration-700 hover:border-white/[0.15] lg:mx-12">
                        <div className="grid lg:grid-cols-2">
                          {/* Image Side */}
                          <div
                            className={`relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:h-[500px] xl:h-[550px] ${index % 2 === 1 ? "lg:order-2" : ""}`}
                          >
                            {/* Background Image with Parallax */}
                            <motion.div
                              className="absolute inset-0"
                              animate={{
                                scale: isHovered ? 1.08 : 1,
                              }}
                              transition={{
                                duration: 1.2,
                                ease: [0.25, 0.1, 0.25, 1],
                              }}
                            >
                              <SafeImage
                                src={sector.image}
                                alt={sector.title}
                                fill
                                className="object-cover"
                              />
                            </motion.div>

                            {/* Cinematic Overlays */}
                            <div
                              className={`absolute inset-0 bg-gradient-to-r ${sector.gradient}`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent lg:hidden" />
                            <div
                              className={`absolute inset-0 bg-gradient-to-${index % 2 === 1 ? "l" : "r"} from-neutral-950 via-neutral-950/40 to-transparent hidden lg:block`}
                            />

                            {/* Animated Scan Line */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c9a962]/10 to-transparent"
                              initial={{ y: "-100%" }}
                              animate={
                                isHovered ? { y: "100%" } : { y: "-100%" }
                              }
                              transition={{ duration: 1.5, ease: "easeInOut" }}
                            />

                            {/* Stats Overlay */}
                            <motion.div
                              className="absolute bottom-6 left-6 flex gap-6 lg:bottom-8 lg:left-8"
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.6,
                                delay: 0.3 + index * 0.1,
                              }}
                            >
                              <div className="text-center">
                                <motion.div
                                  className="font-SchnyderS text-3xl font-light text-white lg:text-4xl"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  viewport={{ once: true }}
                                  transition={{
                                    duration: 0.5,
                                    delay: 0.5 + index * 0.1,
                                  }}
                                >
                                  {sector.stats.projects}
                                </motion.div>
                                <div className="font-Satoshi text-[9px] font-light uppercase tracking-[0.2em] text-white/50">
                                  {t("projectsLabel")}
                                </div>
                              </div>
                              <div className="h-12 w-px bg-white/20" />
                              <div className="text-center">
                                <motion.div
                                  className="font-SchnyderS text-3xl font-light text-white lg:text-4xl"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  viewport={{ once: true }}
                                  transition={{
                                    duration: 0.5,
                                    delay: 0.6 + index * 0.1,
                                  }}
                                >
                                  {sector.stats.value}
                                </motion.div>
                                <div className="font-Satoshi text-[9px] font-light uppercase tracking-[0.2em] text-white/50">
                                  {t("valueDelivered")}
                                </div>
                              </div>
                            </motion.div>

                            {/* Corner Frame */}
                            <div className="absolute left-4 top-4 h-12 w-12 border-l border-t border-white/20 lg:left-6 lg:top-6" />
                            <div className="absolute bottom-4 right-4 h-12 w-12 border-b border-r border-white/20 lg:bottom-6 lg:right-6" />
                          </div>

                          {/* Content Side */}
                          <div
                            className={`relative flex flex-col justify-center p-8 lg:p-12 xl:p-16 ${index % 2 === 1 ? "lg:order-1" : ""}`}
                          >
                            {/* Number Badge */}
                            <motion.div
                              className="absolute right-6 top-6 font-SchnyderS text-6xl font-light text-white/[0.03] lg:right-12 lg:top-12 lg:text-8xl"
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.5 }}
                            >
                              0{index + 1}
                            </motion.div>

                            {/* Icon */}
                            <motion.div
                              className="mb-6 flex h-14 w-14 items-center justify-center border border-white/10 bg-white/5"
                              whileHover={{
                                scale: 1.05,
                                borderColor: "rgba(201, 169, 98, 0.3)",
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              <Icon
                                className="h-6 w-6 text-[#c9a962]"
                                strokeWidth={1}
                              />
                            </motion.div>

                            {/* Subtitle */}
                            <motion.div
                              className="mb-3 font-Satoshi text-[10px] font-medium uppercase tracking-[0.3em]"
                              style={{ color: sector.accent }}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6, delay: 0.2 }}
                            >
                              {sector.subtitle}
                            </motion.div>

                            {/* Title */}
                            <motion.h3
                              className="mb-4 font-SchnyderS text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-5xl"
                              initial={{ opacity: 0, y: 30 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: 0.3 }}
                            >
                              {sector.title}
                            </motion.h3>

                            {/* Description */}
                            <motion.p
                              className="mb-8 max-w-lg font-Satoshi text-base font-light leading-relaxed text-white/60 lg:text-lg"
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6, delay: 0.4 }}
                            >
                              {sector.description}
                            </motion.p>

                            {/* Features */}
                            <motion.div
                              className="mb-10 flex flex-wrap gap-2"
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6, delay: 0.5 }}
                            >
                              {sector.features.map((feature, i) => (
                                <motion.span
                                  key={i}
                                  className="border border-white/10 bg-white/5 px-4 py-2 font-Satoshi text-[10px] font-light uppercase tracking-[0.15em] text-white/70 transition-all duration-300 hover:border-[#c9a962]/30 hover:bg-[#c9a962]/10"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  viewport={{ once: true }}
                                  transition={{
                                    duration: 0.4,
                                    delay: 0.5 + i * 0.1,
                                  }}
                                >
                                  {feature}
                                </motion.span>
                              ))}
                            </motion.div>

                            {/* CTA */}
                            <motion.div
                              className="flex items-center gap-4"
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6, delay: 0.6 }}
                            >
                              <span className="font-Satoshi text-sm font-light tracking-wide text-white/80 transition-colors group-hover:text-[#c9a962]">
                                {tCommon("explore")} {sector.title}
                              </span>
                              <motion.div
                                className="flex h-10 w-10 items-center justify-center border border-white/20 transition-all duration-300 group-hover:border-[#c9a962] group-hover:bg-[#c9a962]"
                                whileHover={{ scale: 1.1 }}
                              >
                                <ArrowUpRight
                                  className="h-4 w-4 text-white transition-colors group-hover:text-neutral-950"
                                  strokeWidth={1.5}
                                />
                              </motion.div>
                            </motion.div>

                            {/* Animated accent line */}
                            <motion.div
                              className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#c9a962] to-transparent"
                              initial={{ width: 0 }}
                              whileInView={{
                                width: isHovered ? "100%" : "30%",
                              }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: 0.3 }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 text-center lg:mt-28"
        >
          <div className="mx-auto mb-8 h-16 w-px bg-gradient-to-b from-transparent via-[#c9a962]/30 to-transparent" />

          <p className="mb-8 font-Satoshi text-sm font-light text-white/40">
            {t("ctaQuestion")}
          </p>

          <Link
            href="#contact"
            className="group relative inline-flex items-center gap-4 overflow-hidden border border-[#c9a962] bg-[#c9a962] px-10 py-5 font-Satoshi text-xs font-light uppercase tracking-[0.2em] text-neutral-950 transition-all duration-500 hover:bg-transparent hover:text-[#c9a962]"
          >
            <span>{t("ctaButton")}</span>
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.5}
            />

            {/* Hover shimmer */}
            <motion.div
              className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
          </Link>
        </motion.div>
      </motion.div>

      {/* Corner Decorations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute left-8 top-24 hidden h-20 w-20 lg:block"
      >
        <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-[#c9a962]/30 to-transparent" />
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-[#c9a962]/30 to-transparent" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute bottom-24 right-8 hidden h-20 w-20 lg:block"
      >
        <div className="absolute bottom-0 right-0 h-full w-px bg-gradient-to-t from-[#c9a962]/30 to-transparent" />
        <div className="absolute bottom-0 right-0 h-px w-full bg-gradient-to-l from-[#c9a962]/30 to-transparent" />
      </motion.div>
    </section>
  );
}
