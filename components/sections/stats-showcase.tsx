'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const stats = [
  {
    value: '15+',
    label: 'Years of Excellence',
    description: 'Creating luxury spaces since 2008',
  },
  {
    value: '300+',
    label: 'Projects Delivered',
    description: 'Across residential and commercial sectors',
  },
  {
    value: '50+',
    label: 'Industry Awards',
    description: 'Recognized for design innovation',
  },
  {
    value: '200+',
    label: 'Happy Clients',
    description: 'Building lasting relationships',
  },
];

export function StatsShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 0.5, 0.7]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 px-6 py-32 lg:px-12 lg:py-48"
    >
      {/* Background Image with Parallax */}
      <motion.div
        style={{ y: imageY }}
        className="absolute inset-0"
      >
        <Image
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=2000&q=80"
          alt="Luxury Interior"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950/90 to-neutral-950"
        />
      </motion.div>

      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" />

      <div className="relative z-10 mx-auto max-w-[1800px]">
        {/* Section Header */}
        <div className="mb-24 text-center lg:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-6 flex items-center justify-center gap-4"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/40" />
            <span className="text-sm font-light tracking-[0.3em] text-white/60">
              BY THE NUMBERS
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/40" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mx-auto max-w-4xl text-5xl font-light tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            A Legacy of
            <br />
            Design Excellence
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg font-light leading-relaxed text-white/70"
          >
            Our commitment to excellence is reflected in every project we undertake
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
              className="group relative"
            >
              {/* Background Glow */}
              <div className="absolute -inset-4 rounded-2xl bg-white/5 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

              {/* Content */}
              <div className="relative border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-500 group-hover:border-white/20 lg:p-10">
                {/* Value */}
                <div className="mb-4 text-6xl font-extralight tracking-tight text-white lg:text-7xl">
                  {stat.value}
                </div>

                {/* Label */}
                <h3 className="mb-2 text-lg font-light tracking-wide text-white">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-sm font-light leading-relaxed text-white/60">
                  {stat.description}
                </p>

                {/* Decorative Element */}
                <div className="mt-6 h-px w-12 bg-gradient-to-r from-white/40 to-transparent transition-all duration-500 group-hover:w-full" />
              </div>

              {/* Corner Accent */}
              <div className="absolute -right-1 -top-1 h-8 w-8 border-r border-t border-white/20 transition-all duration-500 group-hover:h-12 group-hover:w-12 group-hover:border-white/40" />
              <div className="absolute -bottom-1 -left-1 h-8 w-8 border-b border-l border-white/20 transition-all duration-500 group-hover:h-12 group-hover:w-12 group-hover:border-white/40" />
            </motion.div>
          ))}
        </div>

        {/* Bottom Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-24 text-center lg:mt-32"
        >
          <blockquote className="mx-auto max-w-3xl text-2xl font-light italic leading-relaxed text-white/90 lg:text-3xl">
            "Every space tells a story. We ensure yours is extraordinary."
          </blockquote>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-white/20" />
            <p className="text-sm font-light tracking-widest text-white/60">
              MARIAM MOUHAJER, FOUNDER
            </p>
            <div className="h-px w-12 bg-white/20" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
