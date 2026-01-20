"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import SplitType from "split-type";

export function AwardsHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    if (!titleRef.current || !isLoaded) return;

    const split = new SplitType(titleRef.current, {
      types: "lines,words",
      tagName: "span",
    });

    const tl = gsap.timeline({ delay: 0.6 });

    tl.fromTo(
      split.words,
      {
        opacity: 0,
        y: 80,
        rotateX: -60,
        transformOrigin: "center bottom",
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.035,
        duration: 1,
        ease: "power3.out",
      }
    );

    return () => {
      split.revert();
    };
  }, [isLoaded]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[700px] max-h-[1000px] overflow-hidden bg-[#faf8f5]"
    >
      {/* Dark Header Overlay - Ensures navbar is visible */}
      <div className="absolute inset-x-0 top-0 z-20 h-32 bg-linear-to-b from-neutral-950/80 via-neutral-950/40 to-transparent pointer-events-none" />

      {/* Video Background - YouTube Awards Ceremony with Cinematic Parallax */}
      <motion.div
        style={{ scale: videoScale, y: imageY }}
        className="absolute inset-0"
      >
        {/* YouTube Video Embed */}
        <div className="absolute inset-0 h-full w-full overflow-hidden">
          <iframe
            className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-screen w-[177.77vh] min-w-screen -translate-x-1/2 -translate-y-1/2"
            src="https://www.youtube.com/embed/FWywP5GXOmg?autoplay=1&mute=1&loop=1&playlist=FWywP5GXOmg&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1"
            title="Awards Ceremony"
            allow="autoplay; encrypted-media"
            onLoad={() => setIsLoaded(true)}
          />
        </div>

        {/* Cinematic Light Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5]/85 via-[#faf8f5]/60 to-[#faf8f5]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f5]/70 via-transparent to-[#faf8f5]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(250,248,245,0.5)_100%)]" />

        {/* Subtle gold accent gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(201,169,98,0.08)_0%,transparent_60%)]" />
      </motion.div>

      {/* Cinematic Frame Borders */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Top Border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isLoaded ? 1 : 0 }}
          transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
          className="absolute top-16 left-12 right-12 h-px origin-left bg-gradient-to-r from-[#c9a962]/40 via-[#c9a962]/20 to-transparent lg:top-20 lg:left-20 lg:right-20"
        />

        {/* Bottom Border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isLoaded ? 1 : 0 }}
          transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
          className="absolute bottom-16 left-12 right-12 h-px origin-right bg-gradient-to-l from-[#c9a962]/40 via-[#c9a962]/20 to-transparent lg:bottom-20 lg:left-20 lg:right-20"
        />

        {/* Left Border */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: isLoaded ? 1 : 0 }}
          transition={{ duration: 1.5, delay: 1.1, ease: "easeOut" }}
          className="absolute top-16 bottom-16 left-12 w-px origin-top bg-gradient-to-b from-[#c9a962]/40 via-[#c9a962]/20 to-transparent lg:top-20 lg:bottom-20 lg:left-20"
        />

        {/* Right Border */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: isLoaded ? 1 : 0 }}
          transition={{ duration: 1.5, delay: 1.3, ease: "easeOut" }}
          className="absolute top-16 bottom-16 right-12 w-px origin-bottom bg-gradient-to-t from-[#c9a962]/40 via-[#c9a962]/20 to-transparent lg:top-20 lg:bottom-20 lg:right-20"
        />

        {/* Corner Accents */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 1.6 }}
          className="absolute top-16 left-12 h-3 w-3 border-l border-t border-[#c9a962] lg:top-20 lg:left-20"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 1.7 }}
          className="absolute top-16 right-12 h-3 w-3 border-r border-t border-[#c9a962] lg:top-20 lg:right-20"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 1.8 }}
          className="absolute bottom-16 left-12 h-3 w-3 border-l border-b border-[#c9a962] lg:bottom-20 lg:left-20"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 1.9 }}
          className="absolute bottom-16 right-12 h-3 w-3 border-r border-b border-[#c9a962] lg:bottom-20 lg:right-20"
        />
      </div>

      {/* Main Content */}
      <motion.div
        style={{ opacity, y }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 lg:px-12"
      >
        <div className="mx-auto max-w-5xl text-center">
          {/* Subtitle with decorative elements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8 flex items-center justify-center gap-6"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isLoaded ? 1 : 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-px w-16 origin-right bg-gradient-to-r from-transparent to-[#c9a962]/60 sm:w-24"
            />
            <span className="font-Satoshi text-[10px] font-light uppercase tracking-[0.5em] text-neutral-500 sm:text-xs">
              Awards & Recognition
            </span>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isLoaded ? 1 : 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-px w-16 origin-left bg-gradient-to-l from-transparent to-[#c9a962]/60 sm:w-24"
            />
          </motion.div>

          {/* Main Title with 3D perspective */}
          <div
            className="mb-10 overflow-hidden"
            style={{ perspective: "1000px" }}
          >
            <h1
              ref={titleRef}
              className="font-SchnyderS text-5xl font-light leading-[1.1] tracking-tight text-neutral-900 sm:text-6xl md:text-7xl lg:text-8xl"
            >
              Excellence,
              <br />
              <span className="text-[#c9a962]">Certified</span>
            </h1>
          </div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mx-auto max-w-2xl px-4 font-Satoshi text-lg font-light leading-relaxed text-neutral-600 sm:px-0 sm:text-xl lg:text-2xl"
          >
            We do not build for awards. We build for perfection.
            <br className="hidden sm:block" />
            <span className="text-neutral-500">
              The recognition is simply the result.
            </span>
          </motion.p>

          {/* Decorative element below text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="mt-12 flex items-center justify-center gap-4"
          >
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#c9a962]/40" />
            <div className="h-1.5 w-1.5 rotate-45 bg-[#c9a962]/60" />
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#c9a962]/40" />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 2 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 lg:bottom-12"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3"
        >
          <span className="font-Satoshi text-[10px] font-light uppercase tracking-[0.3em] text-neutral-500">
            Explore Our Achievements
          </span>
          <div className="flex flex-col items-center gap-1">
            <div className="h-6 w-px bg-gradient-to-b from-[#c9a962]/50 to-transparent" />
            <ChevronDown className="h-4 w-4 text-[#c9a962]/60" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
