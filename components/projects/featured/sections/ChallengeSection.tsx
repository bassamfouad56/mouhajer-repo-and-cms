"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { AlertTriangle, Target } from "lucide-react";

interface GalleryImage {
  url: string;
  alt?: string;
  caption?: string;
}

interface ChallengeSectionProps {
  challenge: string;
  images?: GalleryImage[];
  locale: string;
}

export function ChallengeSection({
  challenge,
  images = [],
  locale,
}: ChallengeSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const isRTL = locale === "ar";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.5, 1, 1, 0.5],
  );

  const labels = {
    en: { title: "The Challenge" },
    ar: { title: "التحدي" },
  };

  const t = labels[locale as keyof typeof labels] || labels.en;

  if (!challenge) return null;

  // Split challenge text into paragraphs
  const paragraphs = challenge.split("\n\n").filter((p) => p.trim());
  const mainTitle = paragraphs[0];
  const contentParagraphs = paragraphs.slice(1);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-neutral-950 overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Full-Bleed Background Image */}
      {images[0] && (
        <motion.div style={{ y: y1, opacity }} className="absolute inset-0">
          <Image
            src={images[0].url}
            alt={images[0].alt || "Challenge background"}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/90 to-neutral-950/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/50 via-transparent to-neutral-950" />
        </motion.div>
      )}

      {/* Content Grid */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* Text Content */}
            <div className={isRTL ? "lg:order-2" : ""}>
              {/* Section Label */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-4 mb-8"
              >
                <div className="w-12 h-12 rounded-full bg-[#8f7852]/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-[#8f7852]" />
                </div>
                <div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: 48 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="h-px bg-[#8f7852] mb-2"
                  />
                  <span className="text-[#8f7852] text-xs tracking-[0.3em] uppercase font-light">
                    {t.title}
                  </span>
                </div>
              </motion.div>

              {/* Main Title */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-SchnyderS text-4xl md:text-5xl lg:text-6xl text-white font-light mb-8 leading-tight"
              >
                {mainTitle}
              </motion.h2>

              {/* Content Paragraphs */}
              <div className="space-y-6">
                {contentParagraphs.map((paragraph, index) => {
                  // Check if paragraph has a subtitle (ends with colon or is short)
                  const lines = paragraph.split("\n");
                  const hasSubtitle =
                    lines[0].endsWith(":") ||
                    (lines.length > 1 && lines[0].length < 60);

                  if (hasSubtitle) {
                    const subtitle = lines[0].replace(/:$/, "");
                    const content =
                      lines.slice(1).join(" ") ||
                      paragraph.replace(lines[0], "").trim();

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                        className="relative pl-6 border-l-2 border-[#8f7852]/40"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-[#8f7852]" />
                          <h3 className="text-[#8f7852] text-lg font-medium">
                            {subtitle}
                          </h3>
                        </div>
                        <p className="text-white/70 leading-relaxed">
                          {content}
                        </p>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                      className="text-white/70 text-lg leading-relaxed"
                    >
                      {paragraph}
                    </motion.p>
                  );
                })}
              </div>
            </div>

            {/* Image Stack */}
            {images.length > 1 && (
              <motion.div
                style={{ y: y2 }}
                className={`relative h-[600px] ${isRTL ? "lg:order-1" : ""}`}
              >
                {images.slice(1, 4).map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.15 }}
                    className={`absolute overflow-hidden rounded-lg shadow-2xl ${
                      index === 0
                        ? "top-0 left-0 w-3/4 aspect-[4/5] z-10"
                        : index === 1
                          ? "top-1/4 right-0 w-2/3 aspect-square z-20"
                          : "bottom-0 left-1/4 w-1/2 aspect-[3/4] z-30"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || `Challenge image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/50 to-transparent" />

                    {/* Frame Corners */}
                    <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-[#8f7852]/50" />
                    <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-[#8f7852]/50" />
                  </motion.div>
                ))}

                {/* Decorative Number */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="absolute -bottom-8 -left-8 text-[200px] font-SchnyderS text-[#8f7852]/10 leading-none select-none"
                >
                  01
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent" />
    </section>
  );
}
