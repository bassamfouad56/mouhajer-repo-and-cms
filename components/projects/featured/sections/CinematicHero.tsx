"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";

interface CinematicHeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string | null;
  videoUrl?: string;
  location?: string;
  year?: number;
  tags?: Array<{
    name?: { en?: string; ar?: string };
    slug?: string;
    category?: string;
  }>;
  locale: string;
}

export function CinematicHero({
  title,
  subtitle,
  backgroundImage,
  videoUrl,
  location,
  year,
  tags,
  locale,
}: CinematicHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Smooth spring-based animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  // Parallax and scale effects
  const y = useTransform(smoothProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(smoothProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(smoothProgress, [0, 0.5, 1], [1, 0.8, 0]);
  const titleY = useTransform(smoothProgress, [0, 1], ["0%", "50%"]);
  const titleOpacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);

  // Determine if we have a direct video URL (MP4) or YouTube/Vimeo
  const isDirectVideo = videoUrl?.match(/\.(mp4|webm|mov)$/i);
  const isYouTube =
    videoUrl?.includes("youtube.com") || videoUrl?.includes("youtu.be");
  const isVimeo = videoUrl?.includes("vimeo.com");

  // Extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&?\s]+)/
    );
    return match?.[1];
  };

  // Extract Vimeo video ID
  const getVimeoId = (url: string) => {
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return match?.[1];
  };

  useEffect(() => {
    if (videoRef.current && isDirectVideo) {
      videoRef.current
        .play()
        .then(() => {
          setIsVideoPlaying(true);
        })
        .catch(() => {
          // Autoplay blocked, show image fallback
          setIsVideoPlaying(false);
        });
    }
  }, [isDirectVideo]);

  // Award tags (filter by category if available)
  const awardTags = tags?.filter((t) => t.category === "award") || [];
  const featureTags =
    tags?.filter((t) => t.category !== "award")?.slice(0, 3) || [];

  const isRTL = locale === "ar";

  return (
    <section
      ref={containerRef}
      className="relative h-[100vh] min-h-[600px] overflow-hidden"
    >
      {/* Background Media Layer */}
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        {/* Video Background */}
        {isDirectVideo && videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              isVideoPlaying ? "opacity-100" : "opacity-0"
            }`}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
          />
        )}

        {/* YouTube Embed */}
        {isYouTube && videoUrl && (
          <div className="absolute inset-0 pointer-events-none">
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeId(videoUrl)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeId(videoUrl)}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
              className="absolute w-[150%] h-[150%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        )}

        {/* Vimeo Embed */}
        {isVimeo && videoUrl && (
          <div className="absolute inset-0 pointer-events-none">
            <iframe
              src={`https://player.vimeo.com/video/${getVimeoId(videoUrl)}?autoplay=1&muted=1&loop=1&background=1`}
              className="absolute w-[150%] h-[150%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        )}

        {/* Image Fallback with Ken Burns */}
        {backgroundImage &&
          (!videoUrl || (!isVideoPlaying && isDirectVideo)) && (
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Image
                src={backgroundImage}
                alt={title}
                fill
                className="object-cover"
                priority
                quality={90}
              />
            </motion.div>
          )}

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
      </motion.div>

      {/* Animated Corner Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-[#c9a962]/60"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
        <motion.div
          className="absolute top-8 right-8 w-24 h-24 border-r-2 border-t-2 border-[#c9a962]/60"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        />
        <motion.div
          className="absolute bottom-8 left-8 w-24 h-24 border-l-2 border-b-2 border-[#c9a962]/60"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        />
        <motion.div
          className="absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-[#c9a962]/60"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        />
      </div>

      {/* Content Layer */}
      <motion.div
        className="relative z-10 h-full flex flex-col justify-end pb-20 md:pb-32 px-6 md:px-16 lg:px-24"
        style={{ y: titleY, opacity: titleOpacity }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Award Badges */}
        {awardTags.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {awardTags.map((tag, index) => (
              <motion.div
                key={tag.slug || index}
                className="px-4 py-1.5 bg-[#c9a962] text-black text-xs font-medium tracking-wider uppercase"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="relative">
                  {isRTL ? tag.name?.ar : tag.name?.en}
                  {/* Gold shimmer effect */}
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  />
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Location & Year Badge */}
        <motion.div
          className="flex items-center gap-4 mb-4"
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {location && (
            <span className="text-[#c9a962] text-sm tracking-[0.2em] uppercase font-light">
              {location}
            </span>
          )}
          {location && year && <span className="w-8 h-px bg-[#c9a962]/50" />}
          {year && (
            <span className="text-white/60 text-sm tracking-[0.2em] font-light">
              {year}
            </span>
          )}
        </motion.div>

        {/* Main Title - Character Animation */}
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-white tracking-tight leading-[0.9] mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {title.split("").map((char, index) => (
            <motion.span
              key={index}
              className="inline-block"
              initial={{ opacity: 0, y: 50, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                delay: 0.3 + index * 0.03,
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              style={{ transformOrigin: "bottom" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle with Fill Effect */}
        <motion.div
          className="relative max-w-3xl overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed">
            {subtitle}
          </p>
          {/* Animated underline */}
          <motion.div
            className="absolute bottom-0 left-0 h-px bg-[#c9a962]"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
          />
        </motion.div>

        {/* Feature Tags */}
        {featureTags.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-2 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            {featureTags.map((tag, index) => (
              <span
                key={tag.slug || index}
                className="px-3 py-1 border border-white/20 text-white/60 text-xs tracking-wider uppercase"
              >
                {isRTL ? tag.name?.ar : tag.name?.en}
              </span>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        style={{ opacity }}
      >
        <span className="text-white/40 text-xs tracking-[0.3em] uppercase">
          {isRTL ? "مرر للأسفل" : "Scroll"}
        </span>
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-[#c9a962] to-transparent"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
