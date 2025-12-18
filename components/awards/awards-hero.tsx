'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Trophy, Award as AwardIcon } from 'lucide-react';
import gsap from 'gsap';
import SplitType from 'split-type';

export function AwardsHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  useEffect(() => {
    if (!titleRef.current || !isLoaded) return;

    const split = new SplitType(titleRef.current, {
      types: 'lines,words',
      tagName: 'span',
    });

    const tl = gsap.timeline({ delay: 0.6 });

    tl.fromTo(
      split.words,
      {
        opacity: 0,
        y: 80,
        rotateX: -60,
        transformOrigin: 'center bottom'
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.035,
        duration: 1,
        ease: 'power3.out',
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
      {/* Sophisticated Background Architecture */}
      <div className="absolute inset-0">
        {/* Refined Gradient Foundation */}
        <div className="absolute inset-0">
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0, 0.5], [1, 0]) }}
            className="absolute inset-0 bg-gradient-to-br from-[#faf8f5] via-white/80 to-[#faf8f5]"
          />
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0, 1], [0.3, 0]) }}
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,169,98,0.12),transparent_50%)]"
          />
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0, 1], [0.2, 0]) }}
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,169,98,0.08),transparent_50%)]"
          />
        </div>

        {/* Architectural Grid System */}
        <div className="absolute inset-0">
          {/* Vertical Lines */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`v-${i}`}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: isLoaded ? 1 : 0 }}
              transition={{ duration: 1.5, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
              className="absolute top-0 h-full w-px origin-top bg-gradient-to-b from-transparent via-[#c9a962]/20 to-transparent"
              style={{ left: `${20 + i * 15}%` }}
            />
          ))}

          {/* Horizontal Lines */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`h-${i}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isLoaded ? 1 : 0 }}
              transition={{ duration: 1.5, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
              className="absolute left-0 h-px w-full origin-left bg-gradient-to-r from-transparent via-[#c9a962]/20 to-transparent"
              style={{ top: `${25 + i * 25}%` }}
            />
          ))}
        </div>

        {/* Premium Frame Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 2, delay: 1 }}
          className="absolute inset-0 pointer-events-none"
        >
          {/* Top Left Corner */}
          <div className="absolute left-12 top-12 h-32 w-32">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
              className="absolute inset-0"
            >
              <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-[#c9a962] to-transparent" />
              <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-[#c9a962] to-transparent" />
              <div className="absolute left-0 top-0 h-2 w-2 rounded-full bg-[#c9a962] shadow-[0_0_20px_rgba(201,169,98,0.5)]" />
            </motion.div>
          </div>

          {/* Top Right Corner */}
          <div className="absolute right-12 top-12 h-32 w-32">
            <motion.div
              initial={{ scale: 0, rotate: 45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 1.3, ease: [0.34, 1.56, 0.64, 1] }}
              className="absolute inset-0"
            >
              <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-[#c9a962] to-transparent" />
              <div className="absolute right-0 top-0 h-px w-full bg-gradient-to-l from-[#c9a962] to-transparent" />
              <div className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#c9a962] shadow-[0_0_20px_rgba(201,169,98,0.5)]" />
            </motion.div>
          </div>

          {/* Bottom Left Corner */}
          <div className="absolute bottom-12 left-12 h-32 w-32">
            <motion.div
              initial={{ scale: 0, rotate: 45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 1.4, ease: [0.34, 1.56, 0.64, 1] }}
              className="absolute inset-0"
            >
              <div className="absolute bottom-0 left-0 h-full w-px bg-gradient-to-t from-[#c9a962] to-transparent" />
              <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-[#c9a962] to-transparent" />
              <div className="absolute bottom-0 left-0 h-2 w-2 rounded-full bg-[#c9a962] shadow-[0_0_20px_rgba(201,169,98,0.5)]" />
            </motion.div>
          </div>

          {/* Bottom Right Corner */}
          <div className="absolute bottom-12 right-12 h-32 w-32">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="absolute inset-0"
            >
              <div className="absolute bottom-0 right-0 h-full w-px bg-gradient-to-t from-[#c9a962] to-transparent" />
              <div className="absolute bottom-0 right-0 h-px w-full bg-gradient-to-l from-[#c9a962] to-transparent" />
              <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-[#c9a962] shadow-[0_0_20px_rgba(201,169,98,0.5)]" />
            </motion.div>
          </div>
        </motion.div>

        {/* Luxury Seal/Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{
            scale: isLoaded ? 1 : 0,
            rotate: isLoaded ? 0 : -180,
            opacity: isLoaded ? 1 : 0
          }}
          transition={{ duration: 1.5, delay: 1.8, ease: [0.34, 1.56, 0.64, 1] }}
          className="absolute right-20 top-1/2 -translate-y-1/2 hidden xl:block"
        >
          <div className="relative h-32 w-32">
            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-[#c9a962]/30" />

            {/* Inner Ring */}
            <div className="absolute inset-4 rounded-full border border-[#c9a962]/50" />

            {/* Center Badge */}
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-[#c9a962]/20 to-transparent backdrop-blur-sm" />

            {/* Rotating Accent */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0"
            >
              <div className="absolute left-1/2 top-0 h-1 w-1 -translate-x-1/2 rounded-full bg-[#c9a962]" />
            </motion.div>

            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="font-SchnyderS text-xs font-light text-[#c9a962]">EST</div>
                <div className="font-SchnyderS text-lg font-light text-[#c9a962]">2000</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Video Background - YouTube Awards Ceremony */}
      <motion.div
        style={{ scale: videoScale }}
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

        {/* Enhanced Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5]/90 via-[#faf8f5]/70 to-[#faf8f5]/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f5]/80 via-transparent to-[#faf8f5]/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#c9a962]/5 via-transparent to-transparent" />

        {/* Vignette */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(250,248,245,0.7) 100%)',
        }} />
      </motion.div>

      {/* Main Content */}
      <motion.div
        style={{ opacity, y }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-24 lg:px-12"
      >
        <div className="mx-auto max-w-5xl text-center">
          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8 flex items-center justify-center gap-4"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a962]/50" />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.4em] text-neutral-500">
              Awards & Recognition
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a962]/50" />
          </motion.div>

          {/* Main Title */}
          <div className="mb-8 overflow-hidden" style={{ perspective: '1000px' }}>
            <h1
              ref={titleRef}
              className="font-SchnyderS text-4xl font-light leading-[1.1] tracking-tight text-neutral-900 sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Excellence,
              <br />
              <span className="text-[#c9a962]">
                Certified
              </span>
            </h1>
          </div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mx-auto mb-12 max-w-3xl px-4 font-Satoshi text-base font-light leading-relaxed text-neutral-600 sm:px-0 sm:text-lg lg:text-xl"
          >
            We do not build for awards. We build for perfection.
            <br />
            The recognition is simply the result.
          </motion.p>

          {/* Awards Count - Refined Design */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="relative"
          >
            {/* Top Accent Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isLoaded ? 1 : 0 }}
              transition={{ duration: 1.5, delay: 1.6, ease: 'easeOut' }}
              className="mb-10 h-px w-full origin-center bg-linear-to-r from-transparent via-[#c9a962]/30 to-transparent"
            />

            <div className="grid grid-cols-3 gap-8 lg:gap-20">
              {[
                { value: '10+', label: 'International Awards', sublabel: 'Global Recognition' },
                { value: '5', label: 'Arabian Property', sublabel: 'Awards Received' },
                { value: '3', label: 'Award Categories', sublabel: 'Excellence Achieved' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 1.8 + index * 0.15 }}
                  className="group relative text-center"
                >
                  {/* Refined Border Frame */}
                  <div className="relative pb-6">
                    {/* Vertical Accent Line */}
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: isLoaded ? 1 : 0 }}
                      transition={{ duration: 1, delay: 2 + index * 0.1, ease: 'easeOut' }}
                      className="absolute left-1/2 top-0 h-full w-px origin-top -translate-x-1/2 bg-linear-to-b from-[#c9a962]/40 to-transparent"
                    />

                    {/* Value with Sophisticated Styling */}
                    <div className="relative mb-3">
                      <div className="font-SchnyderS text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
                        {stat.value}
                      </div>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isLoaded ? 1 : 0 }}
                        transition={{ duration: 0.8, delay: 2.3 + index * 0.1, ease: 'easeOut' }}
                        className="mx-auto mt-3 h-px w-12 origin-center bg-linear-to-r from-transparent via-[#c9a962] to-transparent"
                      />
                    </div>

                    {/* Label */}
                    <div className="mb-2 font-Satoshi text-xs font-light uppercase tracking-[0.25em] text-neutral-700">
                      {stat.label}
                    </div>

                    {/* Sublabel */}
                    <div className="font-Satoshi text-[10px] font-light uppercase tracking-[0.2em] text-neutral-500">
                      {stat.sublabel}
                    </div>
                  </div>

                  {/* Bottom Dot Accent */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: isLoaded ? 1 : 0 }}
                    transition={{ duration: 0.5, delay: 2.5 + index * 0.1, type: 'spring' }}
                    className="mx-auto h-1 w-1 rounded-full bg-[#c9a962]"
                  />
                </motion.div>
              ))}
            </div>

            {/* Bottom Accent Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isLoaded ? 1 : 0 }}
              transition={{ duration: 1.5, delay: 2.8, ease: 'easeOut' }}
              className="mt-10 h-px w-full origin-center bg-linear-to-r from-transparent via-[#c9a962]/30 to-transparent"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 2 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="font-Satoshi text-[10px] font-light tracking-[0.2em] text-neutral-500">
            VIEW OUR ACHIEVEMENTS
          </span>
          <ChevronDown className="h-4 w-4 text-neutral-500" />
        </motion.div>
      </motion.div>

      {/* Sophisticated Side Accents */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isLoaded ? 1 : 0 }}
        transition={{ duration: 2, delay: 2, ease: 'easeOut' }}
        className="absolute left-0 top-1/4 hidden h-1/2 w-px origin-top bg-linear-to-b from-transparent via-[#c9a962]/40 to-transparent lg:block"
      />
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isLoaded ? 1 : 0 }}
        transition={{ duration: 2, delay: 2.2, ease: 'easeOut' }}
        className="absolute right-0 top-1/4 hidden h-1/2 w-px origin-top bg-linear-to-b from-transparent via-[#c9a962]/40 to-transparent lg:block"
      />

      {/* Refined Typography Accent Lines */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isLoaded ? 1 : 0 }}
        transition={{ duration: 1.5, delay: 2.5, ease: 'easeOut' }}
        className="absolute left-1/2 top-1/3 h-px w-32 -translate-x-1/2 origin-center bg-linear-to-r from-transparent via-[#c9a962] to-transparent"
      />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isLoaded ? 1 : 0 }}
        transition={{ duration: 1.5, delay: 2.7, ease: 'easeOut' }}
        className="absolute bottom-1/3 left-1/2 h-px w-32 -translate-x-1/2 origin-center bg-linear-to-r from-transparent via-[#c9a962] to-transparent"
      />
    </section>
  );
}
