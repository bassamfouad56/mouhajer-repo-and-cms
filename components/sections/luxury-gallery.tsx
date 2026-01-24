"use client";

import { useRef, useState } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { SafeImage } from "@/components/safe-image";
import { X, ArrowLeft, ArrowRight, Expand } from "lucide-react";

const galleryImages = [
  {
    id: 1,
    src: "",
    alt: "Luxury living room with marble floors and golden accents",
    category: "Living Spaces",
    title: "Grand Living Room",
    aspect: "tall", // tall, wide, or square
  },
  {
    id: 2,
    src: "",
    alt: "Modern luxury kitchen with island",
    category: "Kitchen",
    title: "Gourmet Kitchen",
    aspect: "wide",
  },
  {
    id: 3,
    src: "",
    alt: "Elegant master bedroom suite",
    category: "Bedroom",
    title: "Master Suite",
    aspect: "square",
  },
  {
    id: 4,
    src: "",
    alt: "Luxury villa exterior at dusk",
    category: "Exterior",
    title: "Villa Entrance",
    aspect: "wide",
  },
  {
    id: 5,
    src: "",
    alt: "Luxurious bathroom with freestanding tub",
    category: "Bathroom",
    title: "Spa Bathroom",
    aspect: "tall",
  },
  {
    id: 6,
    src: "",
    alt: "Modern dining room with chandelier",
    category: "Dining",
    title: "Formal Dining",
    aspect: "square",
  },
  {
    id: 7,
    src: "",
    alt: "Contemporary villa with pool",
    category: "Exterior",
    title: "Pool Terrace",
    aspect: "wide",
  },
  {
    id: 8,
    src: "",
    alt: "Luxury office space",
    category: "Office",
    title: "Executive Office",
    aspect: "square",
  },
  {
    id: 9,
    src: "",
    alt: "Elegant hallway with artwork",
    category: "Living Spaces",
    title: "Gallery Corridor",
    aspect: "tall",
  },
  {
    id: 10,
    src: "",
    alt: "Modern minimalist living room",
    category: "Living Spaces",
    title: "Contemporary Lounge",
    aspect: "wide",
  },
  {
    id: 11,
    src: "",
    alt: "Luxury walk-in closet",
    category: "Bedroom",
    title: "Dressing Room",
    aspect: "square",
  },
  {
    id: 12,
    src: "",
    alt: "Rooftop terrace with city views",
    category: "Exterior",
    title: "Rooftop Lounge",
    aspect: "tall",
  },
];

export function LuxuryGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [selectedImage, setSelectedImage] = useState<
    (typeof galleryImages)[0] | null
  >(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  const navigateImage = (direction: "prev" | "next") => {
    if (!selectedImage) return;
    const currentIndex = galleryImages.findIndex(
      (img) => img.id === selectedImage.id,
    );
    const newIndex =
      direction === "next"
        ? (currentIndex + 1) % galleryImages.length
        : (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedImage(galleryImages[newIndex]);
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-24 sm:py-32 lg:py-40"
    >
      {/* Background */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950" />

        {/* Ambient glow */}
        <div className="absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-[#8f7852]/[0.02] blur-[150px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[500px] w-[500px] rounded-full bg-white/[0.02] blur-[120px]" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-[1800px] px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center gap-4"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#8f7852]/50" />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-white/40">
              Visual Excellence
            </span>
          </motion.div>

          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-SchnyderS text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              A Glimpse Into
              <br />
              <span className="text-white/30">Luxury Living</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-md font-Satoshi text-base font-light text-white/50 lg:text-right"
            >
              Every space tells a story of craftsmanship, attention to detail,
              and uncompromising quality.
            </motion.p>
          </div>
        </div>

        {/* Masonry Gallery Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.05 }}
              className={`group relative cursor-pointer overflow-hidden ${
                image.aspect === "tall"
                  ? "row-span-2"
                  : image.aspect === "wide"
                    ? "col-span-2 md:col-span-1 lg:col-span-2"
                    : ""
              }`}
              onMouseEnter={() => setHoveredId(image.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedImage(image)}
            >
              <div
                className={`relative overflow-hidden ${
                  image.aspect === "tall"
                    ? "aspect-[3/5]"
                    : image.aspect === "wide"
                      ? "aspect-[16/9]"
                      : "aspect-square"
                }`}
              >
                <SafeImage
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />

                {/* Golden border on hover */}
                <motion.div
                  className="absolute inset-0 border-2 border-[#8f7852]/0 transition-all duration-500 group-hover:border-[#8f7852]/40"
                  animate={{
                    borderColor:
                      hoveredId === image.id
                        ? "rgba(201, 169, 98, 0.4)"
                        : "rgba(201, 169, 98, 0)",
                  }}
                />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: hoveredId === image.id ? 1 : 0,
                      y: hoveredId === image.id ? 0 : 10,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="mb-1 block font-Satoshi text-[10px] font-light uppercase tracking-wider text-[#8f7852]">
                      {image.category}
                    </span>
                    <h3 className="font-SchnyderS text-lg font-light text-white lg:text-xl">
                      {image.title}
                    </h3>
                  </motion.div>
                </div>

                {/* Expand icon */}
                <motion.div
                  className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center bg-neutral-950/50 backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: hoveredId === image.id ? 1 : 0,
                    scale: hoveredId === image.id ? 1 : 0.8,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Expand className="h-4 w-4 text-white" strokeWidth={1.5} />
                </motion.div>

                {/* Corner accents */}
                <div className="absolute left-0 top-0 h-8 w-8 border-l border-t border-white/0 transition-colors duration-500 group-hover:border-[#8f7852]/30" />
                <div className="absolute bottom-0 right-0 h-8 w-8 border-b border-r border-white/0 transition-colors duration-500 group-hover:border-[#8f7852]/30" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* View count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 flex items-center justify-center gap-4"
        >
          <div className="h-px w-16 bg-white/10" />
          <span className="font-Satoshi text-sm font-light text-white/30">
            {galleryImages.length} Featured Spaces
          </span>
          <div className="h-px w-16 bg-white/10" />
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/95 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-6 top-6 z-50 flex h-12 w-12 items-center justify-center border border-white/10 bg-white/5 transition-all hover:border-white/30 hover:bg-white/10"
            >
              <X className="h-5 w-5 text-white" strokeWidth={1.5} />
            </button>

            {/* Navigation */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage("prev");
              }}
              className="absolute left-6 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/10 bg-white/5 transition-all hover:border-white/30 hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5 text-white" strokeWidth={1.5} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage("next");
              }}
              className="absolute right-6 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/10 bg-white/5 transition-all hover:border-white/30 hover:bg-white/10"
            >
              <ArrowRight className="h-5 w-5 text-white" strokeWidth={1.5} />
            </button>

            {/* Image */}
            <motion.div
              key={selectedImage.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative mx-auto h-[80vh] w-[90vw] max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <SafeImage
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
                sizes="90vw"
              />

              {/* Info bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-neutral-950 to-transparent p-6">
                <span className="mb-2 block font-Satoshi text-xs font-light uppercase tracking-wider text-[#8f7852]">
                  {selectedImage.category}
                </span>
                <h3 className="font-SchnyderS text-2xl font-light text-white">
                  {selectedImage.title}
                </h3>
              </div>
            </motion.div>

            {/* Image counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-Satoshi text-sm font-light text-white/50">
              {galleryImages.findIndex((img) => img.id === selectedImage.id) +
                1}{" "}
              / {galleryImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corner decorations */}
      <div className="absolute left-8 top-24 hidden h-32 w-32 border-l border-t border-white/5 lg:block" />
      <div className="absolute bottom-24 right-8 hidden h-32 w-32 border-b border-r border-white/5 lg:block" />
    </section>
  );
}
