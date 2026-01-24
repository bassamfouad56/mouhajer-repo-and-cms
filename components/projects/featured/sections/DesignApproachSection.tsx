"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

interface GalleryImage {
  url: string;
  alt?: string;
  caption?: string;
}

interface DesignApproachSectionProps {
  approach: string;
  images?: GalleryImage[];
  locale: string;
}

export function DesignApproachSection({
  approach,
  images = [],
  locale,
}: DesignApproachSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const isRTL = locale === "ar";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  const labels = {
    en: { label: "Our Approach", title: "Design Philosophy" },
    ar: { label: "منهجنا", title: "فلسفة التصميم" },
  };

  const t = labels[locale as keyof typeof labels] || labels.en;

  if (!approach) return null;

  // Split approach text into paragraphs
  const paragraphs = approach.split("\n\n").filter((p) => p.trim());
  const mainTitle = paragraphs[0];
  const contentParagraphs = paragraphs.slice(1);

  // Get featured images (first 3)
  const featuredImages = images.slice(0, 3);

  return (
    <section
      ref={sectionRef}
      className="relative bg-neutral-950 py-24 lg:py-32 overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950" />

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 lg:mb-20"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#8f7852]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#8f7852]">
              {t.label}
            </span>
          </div>

          <h2 className="font-SchnyderS text-4xl md:text-5xl lg:text-6xl font-light text-white max-w-3xl leading-[1.1]">
            {mainTitle || t.title}
          </h2>
        </motion.div>

        {/* Content Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Left Column - Text Content */}
          <div className="space-y-8 lg:space-y-10">
            {contentParagraphs.map((paragraph, index) => {
              const lines = paragraph.split("\n");
              const firstLine = lines[0].trim();
              const hasSubtitle =
                firstLine.endsWith(":") ||
                (lines.length > 1 && firstLine.length < 50);

              if (hasSubtitle) {
                const subtitle = firstLine.replace(/:$/, "");
                const content =
                  lines.slice(1).join(" ") ||
                  paragraph.replace(firstLine, "").trim();

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                    className="group"
                  >
                    <div className="relative pl-6 border-l border-white/10 hover:border-[#8f7852]/50 transition-colors duration-500">
                      <h3 className="font-SchnyderS text-2xl text-white font-light mb-3">
                        {subtitle}
                      </h3>
                      <p className="text-white/60 leading-relaxed text-base">
                        {content}
                      </p>
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                  className="text-white/60 text-lg leading-relaxed"
                >
                  {paragraph}
                </motion.p>
              );
            })}

            {/* If no content paragraphs, show a placeholder message */}
            {contentParagraphs.length === 0 && (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-white/60 text-lg leading-relaxed"
              >
                {approach}
              </motion.p>
            )}
          </div>

          {/* Right Column - Images */}
          <motion.div
            style={{ y: imageY }}
            className="space-y-6"
          >
            {featuredImages.length > 0 ? (
              <>
                {/* Main Featured Image */}
                {featuredImages[0] && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="relative aspect-[4/3] overflow-hidden group"
                  >
                    <Image
                      src={featuredImages[0].url}
                      alt={featuredImages[0].alt || "Design approach"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-neutral-950/10 group-hover:bg-neutral-950/0 transition-colors duration-500" />

                    {/* Corner Accents */}
                    <div className="absolute top-4 left-4 h-8 w-px bg-[#8f7852]/50" />
                    <div className="absolute top-4 left-4 h-px w-8 bg-[#8f7852]/50" />
                    <div className="absolute bottom-4 right-4 h-8 w-px bg-[#8f7852]/50" />
                    <div className="absolute bottom-4 right-4 h-px w-8 bg-[#8f7852]/50" />
                  </motion.div>
                )}

                {/* Secondary Images Grid */}
                {featuredImages.length > 1 && (
                  <div className="grid grid-cols-2 gap-6">
                    {featuredImages.slice(1, 3).map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                        className="relative aspect-square overflow-hidden group"
                      >
                        <Image
                          src={image.url}
                          alt={image.alt || `Design detail ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-neutral-950/10 group-hover:bg-neutral-950/0 transition-colors duration-500" />
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* Placeholder when no images */
              <div className="relative aspect-[4/3] bg-neutral-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="h-px w-12 bg-[#8f7852]/30 mx-auto mb-4" />
                  <span className="text-white/30 text-sm tracking-widest uppercase">
                    Design Vision
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bottom Decorative Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.8 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8f7852]/20 to-transparent"
      />
    </section>
  );
}
