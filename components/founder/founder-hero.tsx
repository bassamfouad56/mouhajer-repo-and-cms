'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import gsap from 'gsap';
import SplitType from 'split-type';

interface FounderHeroProps {
  heroImage?: string;
  founderName?: string;
  founderTitle?: string;
}

export function FounderHero({
  heroImage,
  founderName = 'Eng. Maher Mouhajer',
  founderTitle = 'CEO & Founder',
}: FounderHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Use Sanity image or fallback to local
  const imageUrl = heroImage || '/founder/CEO Arabia.jpg';

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
      className="relative h-screen min-h-[700px] max-h-[1000px] overflow-hidden bg-neutral-950"
    >
      {/* Hero Background - Professional Photo of Eng. Maher */}
      <motion.div
        style={{ scale: videoScale }}
        className="absolute inset-0"
      >
        <Image
          src={imageUrl}
          alt={`${founderName} - ${founderTitle}`}
          fill
          priority
          quality={100}
          className="object-cover object-center"
          onLoad={() => setIsLoaded(true)}
          sizes="100vw"
          unoptimized={false}
        />

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-linear-to-b from-neutral-950/80 via-neutral-950/50 to-neutral-950/90" />
        <div className="absolute inset-0 bg-linear-to-r from-neutral-950/70 via-transparent to-neutral-950/70" />

        {/* Vignette */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.6) 100%)',
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
            <div className="h-px w-16 bg-linear-to-r from-transparent to-white/40" />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.4em] text-white/70">
              The Founder
            </span>
            <div className="h-px w-16 bg-linear-to-l from-transparent to-white/40" />
          </motion.div>

          {/* Main Title */}
          <div className="mb-8 overflow-hidden" style={{ perspective: '1000px' }}>
            <h1
              ref={titleRef}
              className="font-SchnyderS text-4xl font-light leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            >
              The Mind Behind
              <br />
              <span className="text-[#d4af37]">the Masterpiece</span>
            </h1>
          </div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mx-auto mb-12 max-w-3xl px-4 font-Satoshi text-base font-light leading-relaxed text-white/70 sm:px-0 sm:text-lg lg:text-xl"
          >
            Eng. Maher Mouhajer: Curating visual splendor for the Middle East&apos;s most discerning clientele.
          </motion.p>

          {/* Name Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="inline-flex items-center gap-4 border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-sm"
          >
            <div className="text-left">
              <div className="font-Satoshi text-xs font-light uppercase tracking-[0.2em] text-white/50">
                {founderTitle}
              </div>
              <div className="font-SchnyderS text-2xl font-light text-white">
                {founderName}
              </div>
            </div>
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
          <span className="font-Satoshi text-[10px] font-light tracking-[0.2em] text-white/50">
            DISCOVER HIS VISION
          </span>
          <ChevronDown className="h-4 w-4 text-white/50" />
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute left-8 top-28 hidden h-24 w-24 border-l border-t border-white/10 lg:block" />
      <div className="absolute bottom-8 right-8 hidden h-24 w-24 border-b border-r border-white/10 lg:block" />
    </section>
  );
}
