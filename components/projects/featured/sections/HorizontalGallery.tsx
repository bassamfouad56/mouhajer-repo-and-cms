"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";

interface GalleryImage {
  url: string;
  alt?: string;
  caption?: string;
}

interface HorizontalGalleryProps {
  images: GalleryImage[];
  title?: string;
  subtitle?: string;
  locale: string;
}

export function HorizontalGallery({
  images,
  title,
  subtitle,
  locale,
}: HorizontalGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const isRTL = locale === "ar";
  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useInView(titleRef, { once: true, margin: "-100px" });

  // Calculate total scroll width
  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollWidth = scrollContainerRef.current.scrollWidth;
      const clientWidth = scrollContainerRef.current.clientWidth;
      setContainerWidth(scrollWidth - clientWidth);
    }
  }, [images]);

  // Scroll-linked horizontal movement
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const x = useTransform(
    smoothProgress,
    [0.1, 0.9],
    isRTL ? [containerWidth, 0] : [0, -containerWidth]
  );

  // Mouse wheel horizontal scroll (for the sticky section)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Only intercept if we're in the sticky section
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const isInSection = rect.top <= 0 && rect.bottom >= window.innerHeight;

      if (isInSection && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        // Don't prevent default - let natural scroll handle it via scrollYProgress
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  if (images.length === 0) return null;

  const labels = {
    en: {
      title: "Visual Journey",
      subtitle: "Explore every detail of this transformation",
    },
    ar: { title: "رحلة بصرية", subtitle: "استكشف كل تفاصيل هذا التحول" },
  };

  const t = labels[locale as keyof typeof labels] || labels.en;

  return (
    <section
      ref={sectionRef}
      className="relative bg-neutral-950"
      style={{ height: `${Math.max(300, images.length * 40)}vh` }}
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950" />

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a962]/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a962]/30 to-transparent" />
        </div>

        {/* Title */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="absolute top-12 left-0 right-0 z-10 px-8 lg:px-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={isTitleInView ? { width: 48 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="h-px bg-[#c9a962]"
            />
            <span className="text-[#c9a962] text-xs tracking-[0.3em] uppercase font-light">
              {title || t.title}
            </span>
          </div>
          <p className="text-white/50 text-sm font-light max-w-md">
            {subtitle || t.subtitle}
          </p>
        </motion.div>

        {/* Horizontal Scroll Container */}
        <motion.div
          ref={scrollContainerRef}
          style={{ x }}
          className="absolute top-1/2 -translate-y-1/2 flex items-center gap-8 px-8 lg:px-16"
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className={`relative flex-shrink-0 group ${
                index % 3 === 0
                  ? "w-[70vw] h-[60vh]"
                  : index % 3 === 1
                    ? "w-[50vw] h-[70vh]"
                    : "w-[40vw] h-[50vh]"
              }`}
            >
              {/* Image Container */}
              <div className="relative w-full h-full overflow-hidden rounded-lg">
                <Image
                  src={image.url}
                  alt={image.alt || `Gallery image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="70vw"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Caption */}
                {image.caption && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                  >
                    <p className="text-white/80 text-sm font-light">
                      {image.caption}
                    </p>
                  </motion.div>
                )}

                {/* Frame Corners */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#c9a962]/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#c9a962]/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[#c9a962]/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#c9a962]/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Image Number */}
              <div className="absolute -bottom-8 left-0 flex items-center gap-2">
                <span className="text-[#c9a962] text-xs font-light">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="w-8 h-px bg-white/20" />
              </div>
            </motion.div>
          ))}

          {/* End Spacer */}
          <div className="w-[20vw] flex-shrink-0" />
        </motion.div>

        {/* Progress Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <span className="text-white/40 text-xs tracking-wider">SCROLL</span>
          <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#c9a962] rounded-full origin-left"
              style={{ scaleX: smoothProgress }}
            />
          </div>
          <motion.span className="text-white/40 text-xs tracking-wider min-w-[3ch]">
            {images.length}
          </motion.span>
        </div>

        {/* Scroll Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-12 right-8 lg:right-16 flex items-center gap-3"
        >
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-white/30 text-xs tracking-wider"
          >
            {isRTL ? "← SCROLL" : "SCROLL →"}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
