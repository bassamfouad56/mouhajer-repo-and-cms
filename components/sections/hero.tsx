'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { SafeImage } from '@/components/safe-image';
import gsap from 'gsap';
import SplitType from 'split-type';

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);

  useEffect(() => {
    if (!titleRef.current) return;

    const split = new SplitType(titleRef.current, {
      types: 'chars',
      tagName: 'span',
    });

    gsap.fromTo(
      split.chars,
      { opacity: 0, y: 100, rotateX: -90 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.02,
        duration: 1,
        ease: 'power4.out',
        delay: 1.5,
      }
    );

    return () => {
      split.revert();
    };
  }, []);

  // Carousel images - Using placeholder until Sanity images are integrated
  const carouselImages = [
    '/placeholder.jpg',
    '/placeholder.jpg',
    '/placeholder.jpg',
    '/placeholder.jpg',
    '/placeholder.jpg',
    '/placeholder.jpg',
    '/placeholder.jpg',
    '/placeholder.jpg',
  ];

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#faf8f5]"
    >
      {/* Left Carousel Column */}
      <div className="absolute left-0 top-0 hidden h-full w-48 lg:block xl:w-64">
        {/* Column 1 */}
        <motion.div
          animate={{ y: ['-100%', '0%'] }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex flex-col gap-6"
        >
          {[...carouselImages.slice(0, 4), ...carouselImages.slice(0, 4)].map((img, idx) => (
            <div key={idx} className="relative h-80 w-full overflow-hidden">
              <SafeImage
                src={img}
                alt="Interior Design Project"
                fill
                className="object-cover opacity-90 transition-all duration-700 hover:opacity-100 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#faf8f5]/30 via-transparent to-transparent" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right Carousel Column */}
      <div className="absolute right-0 top-0 hidden h-full w-48 lg:block xl:w-64">
        {/* Column 2 */}
        <motion.div
          animate={{ y: ['0%', '-100%'] }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex flex-col gap-6"
        >
          {[...carouselImages.slice(4, 8), ...carouselImages.slice(4, 8)].map((img, idx) => (
            <div key={idx} className="relative h-80 w-full overflow-hidden">
              <SafeImage
                src={img}
                alt="Interior Design Project"
                fill
                className="object-cover opacity-90 transition-all duration-700 hover:opacity-100 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#faf8f5]/30 via-transparent to-transparent" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Light overlay for carousel fade */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f5]/90 via-[#faf8f5]/70 to-[#faf8f5]/90" />

      {/* Architectural Line Pattern */}
      <div className="absolute inset-0">
        {/* Subtle diagonal lines for architectural feel */}
        <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#c9a962]/30 to-transparent" />
        <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#c9a962]/30 to-transparent" />
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#c9a962]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#c9a962]/30 to-transparent" />

        {/* Decorative corner elements */}
        <svg className="absolute left-12 top-12 h-32 w-32 opacity-30" viewBox="0 0 100 100">
          <path d="M 0 0 L 0 100 M 0 0 L 100 0" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-[#c9a962]" />
        </svg>
        <svg className="absolute right-12 bottom-12 h-32 w-32 opacity-30" viewBox="0 0 100 100">
          <path d="M 100 100 L 100 0 M 100 100 L 0 100" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-[#c9a962]" />
        </svg>
      </div>

      {/* Elegant accent lines - architectural blueprint style */}
      <div className="absolute left-1/4 top-1/3 h-px w-32 bg-gradient-to-r from-[#c9a962]/40 to-transparent" />
      <div className="absolute right-1/4 bottom-1/3 h-px w-32 bg-gradient-to-l from-[#c9a962]/40 to-transparent" />

      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,98,0.03)_0%,transparent_70%)]" />

      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 mx-auto max-w-7xl px-6 text-center lg:px-12"
      >
        {/* Subtitle with decorative elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mb-8 flex items-center justify-center gap-4"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a962]" />
          <span className="text-xs font-light uppercase tracking-[0.3em] text-[#c9a962]">
            Dubai • Luxury Interior Design
          </span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a962]" />
        </motion.div>

        {/* Main Title */}
        <h1
          ref={titleRef}
          className="mb-8 text-5xl font-light leading-tight tracking-tight text-neutral-900 sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Crafting Timeless
          <br />
          <span className="text-[#c9a962]">Elegant Spaces</span>
        </h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="mx-auto mb-12 max-w-2xl text-base font-light leading-relaxed text-neutral-600 sm:text-lg"
        >
          Transforming visions into extraordinary interiors. Award-winning design
          studio specializing in luxury residential and commercial spaces.
        </motion.p>

        {/* CTA Buttons - More refined design studio aesthetic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="flex flex-col items-center justify-center gap-6 sm:flex-row"
        >
          <a
            href="#projects"
            className="group relative overflow-hidden border border-[#c9a962] bg-[#c9a962] px-10 py-5 text-xs font-light uppercase tracking-[0.25em] text-white transition-all hover:bg-transparent hover:text-[#c9a962] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a962] focus-visible:ring-offset-2"
          >
            <span className="relative z-10">Explore Portfolio</span>
          </a>
          <a
            href="#contact"
            className="group relative border-b-2 border-neutral-400 pb-2 text-xs font-light uppercase tracking-[0.25em] text-neutral-600 transition-all hover:border-[#c9a962] hover:text-[#c9a962] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a962] focus-visible:ring-offset-2"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Your Project
              <span className="inline-block transition-transform group-hover:translate-x-2">
                →
              </span>
            </span>
          </a>
        </motion.div>

        {/* Stats - More refined design-focused presentation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="mt-24"
        >
          <div className="relative">
            {/* Top decorative line */}
            <div className="absolute -top-8 left-1/2 h-16 w-px -translate-x-1/2 bg-gradient-to-b from-[#c9a962]/40 to-transparent" />

            <div className="grid grid-cols-3 gap-12 border-y border-[#c9a962]/20 py-8">
              {[
                { value: '15+', label: 'Years of Excellence' },
                { value: '200+', label: 'Completed Projects' },
                { value: '50+', label: 'Design Awards' },
              ].map((stat, index) => (
                <div key={index} className="group relative text-center">
                  {/* Vertical divider between stats */}
                  {index < 2 && (
                    <div className="absolute -right-6 top-1/2 h-8 w-px -translate-y-1/2 bg-[#c9a962]/20" />
                  )}
                  <div className="mb-3 text-3xl font-light tracking-tight text-neutral-900 transition-all duration-300 sm:text-4xl">
                    {stat.value}
                  </div>
                  <div className="text-xs font-light uppercase tracking-[0.2em] text-neutral-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ y }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs font-light tracking-widest text-[#c9a962]">
            SCROLL
          </span>
          <ChevronDown className="text-[#c9a962]" size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}
