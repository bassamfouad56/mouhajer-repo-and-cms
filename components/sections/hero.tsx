'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
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

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      {/* Gradient Orbs */}
      <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/10 blur-[120px] animation-delay-2000" />

      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 mx-auto max-w-7xl px-6 text-center lg:px-12"
      >
        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mb-6 text-sm font-light tracking-[0.3em] text-neutral-400"
        >
          DUBAI • LUXURY INTERIOR DESIGN
        </motion.div>

        {/* Main Title */}
        <h1
          ref={titleRef}
          className="mb-8 text-5xl font-light leading-tight tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Crafting Timeless
          <br />
          Elegant Spaces
        </h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="mx-auto mb-12 max-w-2xl text-base font-light leading-relaxed text-neutral-300 sm:text-lg"
        >
          Transforming visions into extraordinary interiors. Award-winning design
          studio specializing in luxury residential and commercial spaces.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="#projects"
            className="group relative overflow-hidden border border-white px-8 py-4 text-sm font-light tracking-widest text-white transition-all hover:bg-white hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            <span className="relative z-10">VIEW PROJECTS</span>
            <div className="absolute inset-0 -translate-x-full bg-white transition-transform duration-300 group-hover:translate-x-0" />
          </a>
          <a
            href="#contact"
            className="group relative overflow-hidden border border-neutral-600 px-8 py-4 text-sm font-light tracking-widest text-neutral-300 transition-all hover:border-white hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            <span className="relative z-10">
              GET IN TOUCH
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="mt-20 rounded-sm border-t border-neutral-800 bg-neutral-900/30 px-8 pt-12 backdrop-blur-sm"
        >
          <div className="grid grid-cols-3 gap-8">
            {[
              { value: '15+', label: 'Years Experience' },
              { value: '200+', label: 'Projects Completed' },
              { value: '50+', label: 'Awards Won' },
            ].map((stat, index) => (
              <div key={index} className="group relative text-center">
                <div className="mb-2 text-3xl font-light text-white transition-all duration-300 group-hover:scale-110 sm:text-4xl">
                  {stat.value}
                </div>
                <div className="text-xs font-light tracking-wider text-neutral-500">
                  {stat.label}
                </div>
                <div className="absolute -bottom-6 left-1/2 h-px w-0 -translate-x-1/2 bg-white transition-all duration-300 group-hover:w-16" />
              </div>
            ))}
          </div>
          <div className="h-6" />
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
          <span className="text-xs font-light tracking-widest text-neutral-500">
            SCROLL
          </span>
          <ChevronDown className="text-neutral-500" size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}
