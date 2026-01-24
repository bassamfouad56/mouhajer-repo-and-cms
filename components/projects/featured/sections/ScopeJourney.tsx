"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import Image from "next/image";
import {
  Layers,
  Hammer,
  PaintBucket,
  Wrench,
  Building2,
  Cpu,
} from "lucide-react";

interface ScopeItem {
  title: string;
  description: string;
  image?: string;
}

interface GalleryImage {
  url: string;
  alt?: string;
}

interface ScopeJourneyProps {
  scope: ScopeItem[];
  services: string[];
  backgroundImages: GalleryImage[];
  scopeImages?: GalleryImage[]; // Images to distribute across scope cards
  locale: string;
}

// Icon mapping for scope items
const scopeIcons = [Building2, Layers, PaintBucket, Hammer, Wrench, Cpu];

export function ScopeJourney({
  scope,
  services,
  backgroundImages,
  scopeImages = [],
  locale,
}: ScopeJourneyProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useInView(titleRef, { once: true, margin: "-100px" });
  const isRTL = locale === "ar";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  // Calculate horizontal scroll based on number of scope items
  // Each card needs scroll room to reveal
  const totalCards = scope.length;
  const x = useTransform(
    smoothProgress,
    [0.15, 0.85],
    isRTL
      ? [`-${(totalCards - 1) * 25}%`, "0%"]
      : ["0%", `-${(totalCards - 1) * 25}%`],
  );

  const labels = {
    en: {
      title: "Scope of Work",
      subtitle: "Our Comprehensive Approach",
      services: "Services Delivered",
    },
    ar: {
      title: "نطاق العمل",
      subtitle: "منهجنا الشامل",
      services: "الخدمات المقدمة",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  if (scope.length === 0) return null;

  // Calculate section height based on number of cards
  // More cards = more scroll room needed
  const sectionHeight = Math.max(200, 100 + totalCards * 40);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0a0a0a]"
      style={{ height: `${sectionHeight}vh` }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        {/* Background Images with Parallax */}
        <div className="absolute inset-0">
          {backgroundImages.slice(0, 2).map((img, index) => {
            const yOffset = useTransform(
              smoothProgress,
              [0, 1],
              [index === 0 ? -50 : 50, index === 0 ? 50 : -50],
            );
            return (
              <motion.div
                key={index}
                className={`absolute ${
                  index === 0
                    ? "top-0 left-0 w-1/2 h-1/2 opacity-20"
                    : "bottom-0 right-0 w-1/3 h-1/2 opacity-15"
                }`}
                style={{ y: yOffset }}
              >
                <Image
                  src={img.url}
                  alt={img.alt || ""}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
              </motion.div>
            );
          })}
        </div>

        <div className="relative z-10 max-w-full px-6 md:px-16">
          {/* Section Header */}
          <motion.div
            ref={titleRef}
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={isTitleInView ? { width: 48 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="h-px bg-[#8f7852]"
              />
              <span className="text-[#8f7852] text-sm tracking-[0.3em] uppercase">
                {t.title}
              </span>
              <motion.div
                initial={{ width: 0 }}
                animate={isTitleInView ? { width: 48 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="h-px bg-[#8f7852]"
              />
            </div>
            <h2 className="font-SchnyderS text-3xl md:text-4xl lg:text-5xl text-white font-light">
              {t.subtitle}
            </h2>
          </motion.div>

          {/* Horizontal Scroll Cards */}
          <motion.div className="flex gap-6 md:gap-8 px-4" style={{ x }}>
            {scope.map((item, index) => (
              <ScopeCard
                key={index}
                item={item}
                index={index}
                totalCards={totalCards}
                progress={smoothProgress}
                locale={locale}
                image={scopeImages[index]?.url || item.image}
                Icon={scopeIcons[index % scopeIcons.length]}
              />
            ))}

            {/* End Spacer */}
            <div className="flex-shrink-0 w-[20vw]" />
          </motion.div>

          {/* Progress Dots */}
          <div className="mt-8 flex items-center justify-center gap-3">
            {scope.map((_, index) => (
              <ProgressDot
                key={index}
                index={index}
                total={totalCards}
                progress={smoothProgress}
              />
            ))}
          </div>

          {/* Services Tags */}
          {services.length > 0 && (
            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="text-center mb-6">
                <span className="text-white/40 text-sm tracking-[0.2em] uppercase">
                  {t.services}
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {services.map((service, index) => (
                  <motion.span
                    key={index}
                    className="px-5 py-2 border border-[#8f7852]/30 text-[#8f7852] text-sm tracking-wider hover:bg-[#8f7852]/10 transition-colors cursor-default"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isTitleInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.5 + index * 0.05, duration: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {service}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Scroll Instruction */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-white/40"
          >
            <span className="text-xs tracking-wider">
              {isRTL ? "مرر للاستكشاف" : "SCROLL TO EXPLORE"}
            </span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Individual Scope Card with scroll-linked animation
function ScopeCard({
  item,
  index,
  totalCards,
  progress,
  locale,
  image,
  Icon,
}: {
  item: ScopeItem;
  index: number;
  totalCards: number;
  progress: any;
  locale: string;
  image?: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  // Calculate when this card should animate in
  const cardStart = 0.1 + (index * 0.7) / totalCards;
  const cardEnd = cardStart + 0.15;

  const opacity = useTransform(progress, [cardStart, cardEnd], [0, 1]);
  const y = useTransform(progress, [cardStart, cardEnd], [60, 0]);
  const scale = useTransform(progress, [cardStart, cardEnd], [0.9, 1]);

  return (
    <motion.div
      className="flex-shrink-0 w-[320px] md:w-[420px] lg:w-[480px]"
      style={{ opacity, y, scale }}
    >
      <div className="group relative h-full bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl hover:border-[#8f7852]/30 transition-all duration-500 overflow-hidden">
        {/* Card Image */}
        {image && (
          <div className="relative h-48 md:h-56 overflow-hidden">
            <Image
              src={image}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />

            {/* Number Badge on Image */}
            <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#8f7852]/90 flex items-center justify-center">
              <span className="text-white text-lg font-medium">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Icon Badge on Image */}
            <div className="absolute bottom-4 left-4 w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Icon className="w-5 h-5 text-[#8f7852]" />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 p-6 md:p-8">
          {/* If no image, show number and icon here */}
          {!image && (
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#8f7852]/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#8f7852]" />
              </div>
              <span className="text-[#8f7852]/40 text-4xl font-light font-SchnyderS">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          )}

          <h3 className="font-SchnyderS text-xl md:text-2xl text-white font-light mb-3">
            {item.title}
          </h3>
          <p className="text-white/60 leading-relaxed text-sm md:text-base">
            {item.description}
          </p>
        </div>

        {/* Bottom Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[#8f7852]/0 via-[#8f7852]/30 to-[#8f7852]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-[#8f7852]/0 group-hover:border-[#8f7852]/50 transition-colors duration-500" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-[#8f7852]/0 group-hover:border-[#8f7852]/50 transition-colors duration-500" />
      </div>
    </motion.div>
  );
}

// Progress Dot with scroll-linked animation
function ProgressDot({
  index,
  total,
  progress,
}: {
  index: number;
  total: number;
  progress: any;
}) {
  const dotProgress = useTransform(
    progress,
    [0.1 + (index * 0.7) / total, 0.1 + ((index + 1) * 0.7) / total],
    [0, 1],
  );

  const scale = useTransform(dotProgress, [0, 0.5, 1], [1, 1.5, 1]);
  const backgroundColor = useTransform(
    dotProgress,
    [0, 0.3, 1],
    ["rgba(255,255,255,0.2)", "#8f7852", "rgba(201,169,98,0.5)"],
  );

  return (
    <motion.div
      className="w-2 h-2 rounded-full"
      style={{ scale, backgroundColor }}
    />
  );
}
