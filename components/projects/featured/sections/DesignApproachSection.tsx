"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Lightbulb, Sparkles } from "lucide-react";

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

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  const labels = {
    en: { title: "Design Approach" },
    ar: { title: "منهج التصميم" },
  };

  const t = labels[locale as keyof typeof labels] || labels.en;

  if (!approach) return null;

  // Split approach text into paragraphs
  const paragraphs = approach.split("\n\n").filter((p) => p.trim());
  const mainTitle = paragraphs[0];
  const contentParagraphs = paragraphs.slice(1);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-0 md:min-h-[150vh] bg-white overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_70%_30%,#c9a962,transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_30%_70%,#c9a962,transparent_50%)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Image Banner */}
        {images[0] && (
          <motion.div
            style={{ y: y1 }}
            className="relative h-[60vh] md:h-[80vh] overflow-hidden"
          >
            <Image
              src={images[0].url}
              alt={images[0].alt || "Design approach hero"}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />

            {/* Overlay Text */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center px-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
                >
                  <Lightbulb className="w-8 h-8 text-[#c9a962]" />
                </motion.div>
                <span className="text-[#c9a962] text-xs tracking-[0.3em] uppercase mb-4 block">
                  {t.title}
                </span>
                <h2 className="font-SchnyderS text-4xl md:text-6xl lg:text-7xl text-neutral-900 font-light max-w-4xl">
                  {mainTitle}
                </h2>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Content Grid with Images */}
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-16 md:py-24">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Text Content */}
            <div className="lg:col-span-5 space-y-8">
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
                      initial={{ opacity: 0, x: -30 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.8, delay: 0.2 + index * 0.15 }}
                      className="group"
                    >
                      <div className="flex items-start gap-4 p-6 bg-neutral-50 rounded-xl border border-neutral-100 hover:border-[#c9a962]/30 transition-colors">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#c9a962]/10 flex items-center justify-center group-hover:bg-[#c9a962]/20 transition-colors">
                          <Sparkles className="w-5 h-5 text-[#c9a962]" />
                        </div>
                        <div>
                          <h3 className="font-SchnyderS text-xl text-neutral-900 font-light mb-2">
                            {subtitle}
                          </h3>
                          <p className="text-neutral-600 leading-relaxed text-sm">
                            {content}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                return (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 + index * 0.15 }}
                    className="text-neutral-600 text-lg leading-relaxed"
                  >
                    {paragraph}
                  </motion.p>
                );
              })}
            </div>

            {/* Image Grid */}
            <div className="lg:col-span-7">
              <motion.div style={{ y: y2 }} className="grid grid-cols-2 gap-4">
                {images.slice(1, 5).map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                    className={`relative overflow-hidden rounded-xl group ${
                      index === 0
                        ? "col-span-2 aspect-[16/9]"
                        : index === 1
                          ? "aspect-[4/5]"
                          : index === 2
                            ? "aspect-[4/5]"
                            : "col-span-2 aspect-[21/9]"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || `Design ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/20 transition-colors duration-500" />

                    {/* Caption on hover */}
                    {image.caption && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-neutral-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <p className="text-white text-sm">{image.caption}</p>
                      </div>
                    )}

                    {/* Frame Corners */}
                    <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-white/0 group-hover:border-[#c9a962]/70 transition-colors duration-500" />
                    <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-white/0 group-hover:border-[#c9a962]/70 transition-colors duration-500" />

                    {/* Number Badge */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-neutral-900 text-xs tracking-wider rounded-full">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Decorative Number */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-0 right-0 text-[300px] font-SchnyderS text-[#c9a962]/5 leading-none select-none pointer-events-none"
        >
          02
        </motion.div>
      </div>
    </section>
  );
}
