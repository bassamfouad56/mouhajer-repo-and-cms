'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SafeImage } from '@/components/safe-image';
import {
  FadeIn,
  Counter,
  AnimatedLine,
  WordReveal,
  StaggerContainer,
  StaggerItem,
  HoverLift,
  BlurIn,
} from '@/components/animations';

const stats = [
  {
    value: 15,
    suffix: '+',
    label: 'Years of Excellence',
    description: 'Creating luxury spaces since 2008',
  },
  {
    value: 300,
    suffix: '+',
    label: 'Projects Delivered',
    description: 'Across residential and commercial sectors',
  },
  {
    value: 50,
    suffix: '+',
    label: 'Industry Awards',
    description: 'Recognized for design innovation',
  },
  {
    value: 200,
    suffix: '+',
    label: 'Happy Clients',
    description: 'Building lasting relationships',
  },
];

interface StatsShowcaseProps {
  backgroundImage?: string;
}

export function StatsShowcase({ backgroundImage }: StatsShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);

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
        {backgroundImage && (
          <SafeImage
            src={backgroundImage}
            alt="Luxury Interior"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950/90 to-neutral-950"
        />
      </motion.div>

      {/* Decorative Grid Overlay */}

      <div className="relative z-10 mx-auto max-w-[1800px]">
        {/* Section Header with enhanced animations */}
        <div className="mb-24 text-center lg:mb-32">
          {/* Animated label with lines */}
          <FadeIn direction="up" className="mb-6 flex items-center justify-center gap-4">
            <AnimatedLine color="rgba(255,255,255,0.4)" className="w-16" />
            <BlurIn className="text-sm font-light tracking-[0.3em] text-white/60">
              BY THE NUMBERS
            </BlurIn>
            <AnimatedLine color="rgba(255,255,255,0.4)" className="w-16" />
          </FadeIn>

          {/* Animated heading with word reveal */}
          <FadeIn direction="up" delay={0.1}>
            <h2 className="mx-auto max-w-4xl text-5xl font-light tracking-tight text-white sm:text-6xl lg:text-7xl">
              <WordReveal text="A Legacy of" delay={0.2} />
              <br />
              <WordReveal text="Design Excellence" delay={0.4} />
            </h2>
          </FadeIn>

          {/* Animated description */}
          <FadeIn direction="up" delay={0.3}>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-light leading-relaxed text-white/70">
              Our commitment to excellence is reflected in every project we undertake
            </p>
          </FadeIn>
        </div>

        {/* Stats Grid with staggered animations */}
        <StaggerContainer staggerDelay={0.15} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <HoverLift lift={12} shadow={false} className="group relative h-full">
                {/* Background Glow */}
                <div className="absolute -inset-4 rounded-2xl bg-white/5 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

                {/* Content */}
                <div className="relative h-full border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-500 group-hover:border-white/20 lg:p-10">
                  {/* Animated Counter Value */}
                  <div className="mb-4 text-6xl font-extralight tracking-tight text-white lg:text-7xl">
                    <Counter
                      from={0}
                      to={stat.value}
                      duration={2.5}
                      delay={0.5}
                      suffix={stat.suffix}
                    />
                  </div>

                  {/* Label with subtle animation */}
                  <motion.h3
                    className="mb-2 text-lg font-light tracking-wide text-white"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                  >
                    {stat.label}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    className="text-sm font-light leading-relaxed text-white/60"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                  >
                    {stat.description}
                  </motion.p>

                  {/* Animated underline that expands on hover */}
                  <div className="mt-6 h-px w-12 bg-gradient-to-r from-white/40 to-transparent transition-all duration-500 ease-out group-hover:w-full" />
                </div>

                {/* Animated Corner Accents */}
                <motion.div
                  className="absolute -right-1 -top-1 h-8 w-8 border-r border-t border-white/20"
                  whileHover={{ height: 48, width: 48, borderColor: 'rgba(255,255,255,0.4)' }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute -bottom-1 -left-1 h-8 w-8 border-b border-l border-white/20"
                  whileHover={{ height: 48, width: 48, borderColor: 'rgba(255,255,255,0.4)' }}
                  transition={{ duration: 0.3 }}
                />
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Bottom Quote with enhanced animations */}
        <FadeIn direction="up" delay={0.5} className="mt-24 text-center lg:mt-32">
          <blockquote className="mx-auto max-w-3xl text-2xl font-light italic leading-relaxed text-white/90 lg:text-3xl">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              "Every space tells a story. We ensure yours is extraordinary."
            </motion.span>
          </blockquote>
          <div className="mt-6 flex items-center justify-center gap-4">
            <AnimatedLine color="rgba(255,255,255,0.2)" className="w-12" delay={0.8} />
            <motion.p
              className="text-sm font-light tracking-widest text-white/60"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
            >
              MARIAM MOUHAJER, FOUNDER
            </motion.p>
            <AnimatedLine color="rgba(255,255,255,0.2)" className="w-12" delay={0.8} />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
