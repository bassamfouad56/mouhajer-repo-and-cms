"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Play,
  Quote,
  ChevronLeft,
  ChevronRight,
  Camera,
  Video,
  X,
} from "lucide-react";

interface GalleryImage {
  url: string;
  alt?: string;
  caption?: string;
  category?: string;
}

interface Testimonial {
  quote: string;
  author?: string;
  role?: string;
}

interface OutcomeResultsSectionProps {
  beforeImages?: GalleryImage[];
  afterImages?: GalleryImage[];
  btsImages?: GalleryImage[]; // Behind-the-scenes / process images
  videoUrl?: string;
  testimonial?: Testimonial;
  locale: string;
}

export function OutcomeResultsSection({
  beforeImages = [],
  afterImages = [],
  btsImages = [],
  videoUrl,
  testimonial,
  locale,
}: OutcomeResultsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const isRTL = locale === "ar";

  const [activeTab, setActiveTab] = useState<
    "transformation" | "bts" | "video"
  >("transformation");
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const labels = {
    en: {
      title: "Outcome & Results",
      transformation: "Transformation",
      bts: "Behind The Scenes",
      video: "Project Video",
      before: "Before",
      after: "After",
      dragToCompare: "Drag to compare",
      watchVideo: "Watch Project Video",
    },
    ar: {
      title: "النتائج والإنجازات",
      transformation: "التحول",
      bts: "كواليس العمل",
      video: "فيديو المشروع",
      before: "قبل",
      after: "بعد",
      dragToCompare: "اسحب للمقارنة",
      watchVideo: "شاهد فيديو المشروع",
    },
  };

  const t = labels[locale as keyof typeof labels] || labels.en;

  const hasTransformation = beforeImages.length > 0 && afterImages.length > 0;
  const hasBts = btsImages.length > 0;
  const hasVideo = !!videoUrl;
  const hasContent = hasTransformation || hasBts || hasVideo || testimonial;

  if (!hasContent) return null;

  // Get current before/after pair
  const currentBefore = beforeImages[currentPairIndex];
  const currentAfter = afterImages[currentPairIndex];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  const navigatePair = (direction: "prev" | "next") => {
    if (direction === "prev" && currentPairIndex > 0) {
      setCurrentPairIndex(currentPairIndex - 1);
    } else if (
      direction === "next" &&
      currentPairIndex < Math.min(beforeImages.length, afterImages.length) - 1
    ) {
      setCurrentPairIndex(currentPairIndex + 1);
    }
  };

  // Extract video ID for embedding
  const getVideoEmbedUrl = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      )?.[1];
      return videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
        : null;
    }
    if (url.includes("vimeo.com")) {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      return videoId
        ? `https://player.vimeo.com/video/${videoId}?autoplay=1`
        : null;
    }
    return url;
  };

  const tabs = [
    {
      id: "transformation" as const,
      label: t.transformation,
      show: hasTransformation,
    },
    { id: "bts" as const, label: t.bts, show: hasBts },
    { id: "video" as const, label: t.video, show: hasVideo },
  ].filter((tab) => tab.show);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-neutral-950 overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-12"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: 48 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-px bg-[#c9a962]"
          />
          <span className="text-[#c9a962] text-xs tracking-[0.3em] uppercase font-light">
            {t.title}
          </span>
        </motion.div>

        {/* Tab Navigation */}
        {tabs.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex gap-4 mb-12"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full text-sm tracking-wider transition-all ${
                  activeTab === tab.id
                    ? "bg-[#c9a962] text-white"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {/* Transformation View */}
          {activeTab === "transformation" &&
            hasTransformation &&
            currentBefore &&
            currentAfter && (
              <motion.div
                key="transformation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Before/After Slider */}
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
                  {/* After Image (Background) */}
                  <Image
                    src={currentAfter.url}
                    alt={currentAfter.alt || t.after}
                    fill
                    className="object-cover"
                  />

                  {/* Before Image (Clipped) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{
                      clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                    }}
                  >
                    <Image
                      src={currentBefore.url}
                      alt={currentBefore.alt || t.before}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Slider Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
                      <div className="flex gap-1">
                        <ChevronLeft className="w-4 h-4 text-neutral-600" />
                        <ChevronRight className="w-4 h-4 text-neutral-600" />
                      </div>
                    </div>
                  </div>

                  {/* Labels */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-neutral-950/70 text-white text-xs tracking-wider rounded">
                    {t.before}
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1 bg-[#c9a962]/90 text-white text-xs tracking-wider rounded">
                    {t.after}
                  </div>

                  {/* Invisible Slider Input */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={handleSliderChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
                  />
                </div>

                {/* Pair Navigation */}
                {beforeImages.length > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-6">
                    <button
                      onClick={() => navigatePair("prev")}
                      disabled={currentPairIndex === 0}
                      className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-[#c9a962] hover:text-[#c9a962] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-white/60 text-sm">
                      {currentPairIndex + 1} /{" "}
                      {Math.min(beforeImages.length, afterImages.length)}
                    </span>
                    <button
                      onClick={() => navigatePair("next")}
                      disabled={
                        currentPairIndex >=
                        Math.min(beforeImages.length, afterImages.length) - 1
                      }
                      className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-[#c9a962] hover:text-[#c9a962] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}

                <p className="text-center text-white/40 text-sm mt-4">
                  {t.dragToCompare}
                </p>
              </motion.div>
            )}

          {/* Behind The Scenes View */}
          {activeTab === "bts" && hasBts && (
            <motion.div
              key="bts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {btsImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="relative aspect-square rounded-lg overflow-hidden group"
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `BTS ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/50 transition-colors" />
                  <div className="absolute top-3 left-3">
                    <Camera className="w-4 h-4 text-white/0 group-hover:text-white/80 transition-colors" />
                  </div>
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm">{image.caption}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Video View */}
          {activeTab === "video" && hasVideo && (
            <motion.div
              key="video"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-video rounded-lg overflow-hidden bg-neutral-900"
            >
              <button
                onClick={() => setShowVideoModal(true)}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 group"
              >
                <div className="w-20 h-20 rounded-full bg-[#c9a962] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
                <span className="text-white text-lg tracking-wider">
                  {t.watchVideo}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Client Testimonial */}
        {testimonial && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-24 relative"
          >
            <div className="max-w-4xl mx-auto text-center">
              <Quote className="w-12 h-12 text-[#c9a962]/30 mx-auto mb-6" />
              <p className="font-SchnyderS text-2xl md:text-3xl text-white font-light leading-relaxed italic">
                "{testimonial.quote}"
              </p>
              {(testimonial.author || testimonial.role) && (
                <div className="mt-8">
                  {testimonial.author && (
                    <p className="text-[#c9a962] font-medium">
                      {testimonial.author}
                    </p>
                  )}
                  {testimonial.role && (
                    <p className="text-white/50 text-sm">{testimonial.role}</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && videoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-neutral-950/95 flex items-center justify-center p-4"
            onClick={() => setShowVideoModal(false)}
          >
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-5xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={getVideoEmbedUrl(videoUrl) || videoUrl}
                className="w-full h-full rounded-lg"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
