'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Palette, Hammer, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { MagneticButton } from '@/components/animations/magnetic-button';
import { SVGLineDraw, SVGCircleDraw, SVGPathDraw } from '@/components/animations/svg-line-draw';
import { RevealText } from '@/components/animations/reveal-text';

const teams = [
  {
    id: 'design',
    icon: Palette,
    title: 'The Design Team',
    description: 'knows their concepts are buildable.',
    color: '#8b5cf6',
  },
  {
    id: 'construction',
    icon: Hammer,
    title: 'The Construction Team',
    description: 'respects the artistic intent.',
    color: '#d4af37',
  },
  {
    id: 'mep',
    icon: Zap,
    title: 'The MEP Team',
    description: 'ensures the systems support the beauty.',
    color: '#3b82f6',
  },
];

function TeamCard({ team, index }: { team: typeof teams[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-15%' });

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-5, 0, 5]);

  const Icon = team.icon;

  return (
    <motion.div
      ref={cardRef}
      style={{ y, rotateY }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      className="group relative border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm transition-all duration-500 hover:border-white/10 hover:bg-white/[0.04] hover:shadow-2xl"
    >
      {/* Glowing border on hover */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${team.color}10 0%, transparent 50%, ${team.color}10 100%)`,
        }}
      />

      <div className="relative z-10">
        {/* Animated Icon Circle */}
        <motion.div
          className="relative mb-6 inline-flex h-14 w-14"
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.8, delay: index * 0.15 + 0.3, type: 'spring', stiffness: 100 }}
        >
          <SVGCircleDraw
            size={56}
            strokeColor={team.color}
            strokeWidth={1.5}
            duration={1.5}
            delay={index * 0.15 + 0.5}
          />
          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-500 group-hover:scale-110"
            style={{ backgroundColor: `${team.color}10` }}
          >
            <Icon className="h-6 w-6 transition-transform duration-500 group-hover:rotate-12" style={{ color: team.color }} strokeWidth={1} />
          </div>
        </motion.div>

        {/* Title with reveal */}
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: index * 0.15 + 0.4 }}
          className="mb-3 font-SchnyderS text-xl font-light text-white transition-all duration-500 group-hover:translate-x-1 lg:text-2xl"
          style={{ color: isInView ? 'white' : team.color }}
        >
          {team.title}
        </motion.h3>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: index * 0.15 + 0.5 }}
          className="font-Satoshi text-sm font-light text-white/60"
        >
          {team.description}
        </motion.p>

        {/* Animated underline */}
        <div className="mt-6 overflow-hidden">
          <SVGLineDraw
            width={80}
            height={2}
            strokeColor={team.color}
            duration={1}
            delay={index * 0.15 + 0.6}
          />
        </div>

        {/* Large number watermark */}
        <div
          className="absolute right-6 top-6 font-SchnyderS text-6xl font-extralight opacity-[0.02] transition-opacity duration-500 group-hover:opacity-[0.05]"
          style={{ color: team.color }}
        >
          0{index + 1}
        </div>

        {/* Corner decorations */}
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.5, delay: index * 0.15 + 0.7 }}
          className="absolute left-4 top-4 h-10 w-10 border-l border-t opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ borderColor: `${team.color}40` }}
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.5, delay: index * 0.15 + 0.8 }}
          className="absolute bottom-4 right-4 h-10 w-10 border-b border-r opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ borderColor: `${team.color}40` }}
        />
      </div>
    </motion.div>
  );
}

export function UnitySectionEnhanced() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-24 sm:py-32 lg:py-40"
    >
      {/* Animated Background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </motion.div>

      {/* Glowing orb */}
      <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2">
        <div className="h-full w-full rounded-full bg-[#d4af37]/[0.02] blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center justify-center gap-4"
          >
            <SVGLineDraw width={80} height={1} strokeColor="rgba(255,255,255,0.3)" duration={1.5} delay={0.2} />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-white/40">
              Leadership Philosophy
            </span>
            <SVGLineDraw width={80} height={1} strokeColor="rgba(255,255,255,0.3)" duration={1.5} delay={0.2} />
          </motion.div>

          <div className="text-center">
            <RevealText
              className="mb-8 font-SchnyderS text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl"
              delay={0.4}
              stagger={0.03}
              animationType="luxury"
            >
              Unity is Strength
            </RevealText>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mx-auto max-w-3xl space-y-6 text-center font-Satoshi text-base font-light leading-relaxed text-white/70 lg:text-lg"
          >
            <p>
              Many CEOs outsource their problems.{' '}
              <span className="font-medium text-white">Eng. Maher brings them in-house.</span>
            </p>
            <p>
              He built MIDC as a turnkey powerhouse because he wanted his designers to sit next to
              his engineers. He wanted the person drawing the joinery to know the person building it.
            </p>
            <p className="text-white/50">
              This unity creates a culture of mutual respect and efficiency.
            </p>
          </motion.div>
        </div>

        {/* Teams Grid with enhanced cards */}
        <div className="mb-16 grid gap-6 md:grid-cols-3 lg:mb-24">
          {teams.map((team, index) => (
            <TeamCard key={team.id} team={team} index={index} />
          ))}
        </div>

        {/* Connecting lines between cards (visual) */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="mx-auto mb-16 hidden h-px w-full max-w-5xl origin-center bg-gradient-to-r from-transparent via-white/10 to-transparent md:block lg:mb-24"
        />

        {/* Leadership Statement with 3D card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border-t border-white/5 pt-16"
        >
          <div className="mx-auto max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 text-center font-Satoshi text-base font-light leading-relaxed text-white/70 lg:text-lg"
            >
              Eng. Maher sits at the head of this table, not to dictate, but to{' '}
              <span className="font-medium text-white">orchestrate this collaboration</span>.
            </motion.p>

            {/* Quote card with 3D effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotateX: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="group relative border-l-2 bg-white/[0.02] p-8 backdrop-blur-sm transition-all duration-500 hover:bg-white/[0.04]"
              style={{ borderColor: '#d4af37' }}
            >
              <RevealText
                className="font-SchnyderS text-xl font-light italic text-white/90 lg:text-2xl"
                delay={0.6}
                stagger={0.015}
                animationType="luxury"
              >
                "The magic happens when everyone understands they are building something bigger than themselves."
              </RevealText>

              {/* Glowing accent */}
              <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-[#d4af37]/0 via-[#d4af37] to-[#d4af37]/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </motion.div>
          </div>
        </motion.div>

        {/* CTA with magnetic button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <MagneticButton strength={0.25}>
            <Link
              href="/about/process"
              className="group inline-flex items-center gap-3 border border-[#d4af37]/30 bg-[#d4af37]/5 px-10 py-5 font-Satoshi text-sm font-light uppercase tracking-wider text-white transition-all duration-500 hover:border-[#d4af37]/50 hover:bg-[#d4af37]/10"
            >
              <span>See Our Integrated Process</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1} />
            </Link>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
