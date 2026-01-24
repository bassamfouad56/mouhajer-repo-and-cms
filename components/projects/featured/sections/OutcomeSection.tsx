"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { CheckCircle2, Award, Star, TrendingUp, Trophy } from "lucide-react";

interface GalleryImage {
  url: string;
  alt?: string;
  caption?: string;
}

interface OutcomeSectionProps {
  outcome: string;
  images?: GalleryImage[];
  stats?: Array<{
    value: string;
    label: string;
    suffix?: string;
  }>;
  locale: string;
}

export function OutcomeSection({
  outcome,
  images = [],
  stats = [],
  locale,
}: OutcomeSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const isRTL = locale === "ar";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  const labels = {
    en: { title: "The Outcome", success: "Project Success" },
    ar: { title: "النتيجة", success: "نجاح المشروع" },
  };

  const t = labels[locale as keyof typeof labels] || labels.en;

  if (!outcome) return null;

  // Split outcome text into paragraphs
  const paragraphs = outcome.split("\n\n").filter((p) => p.trim());

  // Check if last paragraph is a quote (starts and ends with quotes)
  const lastParagraph = paragraphs[paragraphs.length - 1];
  const isQuote =
    lastParagraph?.startsWith('"') && lastParagraph?.endsWith('"');

  // Default stats if none provided
  const displayStats =
    stats.length > 0
      ? stats
      : [
          { value: "100", label: isRTL ? "اكتمال" : "Completion", suffix: "%" },
          {
            value: "2x",
            label: isRTL ? "القيمة الفاخرة" : "Luxury Value",
            suffix: "",
          },
        ];

  return (
    <section
      ref={sectionRef}
      className="relative py-0 md:py-0 min-h-screen bg-white overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Split Layout */}
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Images */}
        <div className="relative h-[50vh] lg:h-auto lg:min-h-screen">
          {/* Main Image */}
          {images[0] && (
            <motion.div style={{ y: y1 }} className="absolute inset-0">
              <Image
                src={images[0].url}
                alt={images[0].alt || "Outcome"}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white lg:to-white" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent lg:hidden" />
            </motion.div>
          )}

          {/* Floating Secondary Image */}
          {images[1] && (
            <motion.div
              style={{ y: y2 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute bottom-8 right-8 w-48 md:w-64 aspect-[4/3] rounded-lg overflow-hidden shadow-2xl z-10 hidden lg:block"
            >
              <Image
                src={images[1].url}
                alt={images[1].alt || "Detail"}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 border-2 border-[#8f7852]/30" />
            </motion.div>
          )}

          {/* Stats Overlay */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute bottom-8 left-8 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 flex flex-col gap-4"
          >
            {displayStats.slice(0, 2).map((stat, index) => (
              <div
                key={index}
                className="px-6 py-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg"
              >
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-SchnyderS text-[#8f7852]">
                    {stat.value}
                  </span>
                  {stat.suffix && (
                    <span className="text-lg text-[#8f7852]">
                      {stat.suffix}
                    </span>
                  )}
                </div>
                <span className="text-neutral-600 text-sm">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Success Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.8, type: "spring" }}
            className="absolute top-8 left-8 w-20 h-20 rounded-full bg-[#8f7852] flex items-center justify-center shadow-lg"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>
        </div>

        {/* Right Side - Content */}
        <div className="relative flex items-center py-16 md:py-24 lg:py-32">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,#8f7852,transparent_50%)]" />
          </div>

          <div className="relative z-10 max-w-xl mx-auto px-6 md:px-12 lg:px-16">
            {/* Section Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 mb-8"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: 48 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-px bg-[#8f7852]"
              />
              <span className="text-[#8f7852] text-xs tracking-[0.3em] uppercase font-light">
                {t.title}
              </span>
            </motion.div>

            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
              className="mb-8"
            >
              <div className="w-14 h-14 rounded-full bg-[#8f7852]/10 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-[#8f7852]" />
              </div>
            </motion.div>

            {/* Outcome Content */}
            <div className="space-y-6">
              {paragraphs.map((paragraph, index) => {
                const isLastQuote = isQuote && index === paragraphs.length - 1;

                if (isLastQuote) {
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                      className="relative mt-8 pt-8 border-t border-[#8f7852]/30"
                    >
                      <Star className="absolute -top-4 left-0 w-8 h-8 text-[#8f7852]/30" />
                      <p className="font-SchnyderS text-xl md:text-2xl text-neutral-800 italic leading-relaxed">
                        {paragraph}
                      </p>
                    </motion.div>
                  );
                }

                return (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                    className={
                      index === 0
                        ? "font-SchnyderS text-2xl md:text-3xl lg:text-4xl text-neutral-900 font-light leading-tight"
                        : "text-neutral-600 text-lg leading-relaxed"
                    }
                  >
                    {paragraph}
                  </motion.p>
                );
              })}
            </div>

            {/* Third Image (below content on desktop) */}
            {images[2] && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-12 relative aspect-[16/9] rounded-xl overflow-hidden group"
              >
                <Image
                  src={images[2].url}
                  alt={images[2].alt || "Result"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/30 to-transparent" />

                {/* Frame Corners */}
                <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-[#8f7852]/70" />
                <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-[#8f7852]/70" />

                {images[2].caption && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-sm">{images[2].caption}</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Decorative Award */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1 }}
            className="absolute top-8 right-8 hidden lg:block"
          >
            <Award className="w-12 h-12 text-[#8f7852]/20" />
          </motion.div>
        </div>
      </div>

      {/* Decorative Number */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-0 right-0 text-[250px] font-SchnyderS text-[#8f7852]/5 leading-none select-none pointer-events-none hidden lg:block"
      >
        06
      </motion.div>
    </section>
  );
}
