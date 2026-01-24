"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { GraduationCap, Heart, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { MagneticButton } from "@/components/animations/magnetic-button";
import {
  SVGLineDraw,
  SVGCircleDraw,
} from "@/components/animations/svg-line-draw";
import { RevealText } from "@/components/animations/reveal-text";

const philosophies = [
  {
    id: "london",
    icon: GraduationCap,
    title: "The London Discipline",
    subtitle: "The Mind",
    description:
      "Great design requires order. Educated in the UK, Eng. Maher applies a strict architectural discipline to every project. This ensures that even the most ornate spaces remain uncluttered and smart. We reject chaos. We embrace logic, flow, and function.",
    color: "#3b82f6",
  },
  {
    id: "arabic",
    icon: Heart,
    title: "The Arabic Soul",
    subtitle: "The Heart",
    description:
      'Minimalism can often feel cold. We counter this with the warmth of our heritage. We infuse spaces with the texture, grandeur, and hospitality inherent in Arabic culture. This is the "Baroque" influence. It is a love for richness, gold, and detail, but tamed and polished for the modern executive.',
    color: "#8f7852",
  },
  {
    id: "immaculate",
    icon: Star,
    title: "The Immaculate Standard",
    subtitle: "The Result",
    description:
      "A design is only as good as its finish. Eng. Maher works with an all-rounded approach. He is obsessed with the final touch. Whether it is the joinery of a private villa or the lobby of a 5-star hotel, the result must be pristine. We create environments that do not just impress guests. They elevate the way they live.",
    color: "#8b5cf6",
  },
];

function PhilosophyCard({
  philosophy,
  index,
}: {
  philosophy: (typeof philosophies)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-15%" });

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  const Icon = philosophy.icon;

  return (
    <motion.div
      ref={cardRef}
      style={{ y, rotateX, scale }}
      className="group relative border border-neutral-200 bg-white p-8 transition-all duration-500 hover:border-transparent hover:shadow-2xl lg:p-10"
    >
      {/* Animated border gradient on hover */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${philosophy.color}15 0%, transparent 50%, ${philosophy.color}15 100%)`,
        }}
      />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
        {/* Icon & Number */}
        <div className="flex items-center gap-6 lg:flex-col lg:items-start">
          {/* Animated Circle Icon */}
          <motion.div
            className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{
              duration: 0.8,
              delay: index * 0.1,
              type: "spring",
              stiffness: 100,
            }}
          >
            <SVGCircleDraw
              size={64}
              strokeColor={philosophy.color}
              strokeWidth={1.5}
              duration={1.5}
              delay={index * 0.1 + 0.3}
            />
            <div
              className="absolute inset-0 flex items-center justify-center transition-all duration-500 group-hover:scale-110"
              style={{ backgroundColor: `${philosophy.color}10` }}
            >
              <Icon
                className="h-7 w-7 transition-colors duration-500"
                style={{ color: philosophy.color }}
                strokeWidth={1}
              />
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-grow">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.5 }}
            className="mb-2 font-Satoshi text-xs font-light uppercase tracking-wider"
            style={{ color: `${philosophy.color}80` }}
          >
            {philosophy.subtitle}
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.6 }}
            className="mb-4 font-SchnyderS text-2xl font-light text-neutral-950 transition-colors duration-500 lg:text-3xl"
            style={{ color: isInView ? "inherit" : philosophy.color }}
          >
            {philosophy.title}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.7 }}
            className="font-Satoshi text-sm font-light leading-relaxed text-neutral-600 lg:text-base"
          >
            {philosophy.description}
          </motion.p>

          {/* Animated line underneath */}
          <div className="mt-6 overflow-hidden">
            <SVGLineDraw
              width={120}
              height={2}
              strokeColor={philosophy.color}
              duration={1}
              delay={index * 0.1 + 0.8}
            />
          </div>
        </div>
      </div>

      {/* 3D Corner accents */}
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={isInView ? { scale: 1, rotate: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.9 }}
        className="absolute left-4 top-4 h-12 w-12 border-l border-t opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ borderColor: philosophy.color }}
      />
      <motion.div
        initial={{ scale: 0, rotate: 45 }}
        animate={isInView ? { scale: 1, rotate: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 + 1 }}
        className="absolute bottom-4 right-4 h-12 w-12 border-b border-r opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ borderColor: philosophy.color }}
      />

      {/* Watermark number */}
    </motion.div>
  );
}

export function DualitiesSectionEnhanced() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-100 py-24 sm:py-32 lg:py-40"
    >
      {/* Animated Background Pattern */}
      <motion.div style={{ y: bgY }} />

      {/* Gradient orbs */}
      <div className="absolute left-0 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#3b82f6]/5 blur-[100px]" />
      <div className="absolute bottom-1/4 right-0 h-[500px] w-[500px] translate-x-1/2 rounded-full bg-[#8f7852]/5 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center gap-4"
          >
            <SVGLineDraw
              width={60}
              height={1}
              strokeColor="#8f7852"
              duration={1.5}
              delay={0.2}
            />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-neutral-400">
              Design Philosophy
            </span>
            <SVGLineDraw
              width={60}
              height={1}
              strokeColor="#8f7852"
              duration={1.5}
              delay={0.2}
            />
          </motion.div>

          <RevealText
            className="mb-6 font-SchnyderS text-4xl font-light tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl"
            delay={0.4}
            stagger={0.02}
          >
            Defined by Dualities
          </RevealText>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-3xl font-Satoshi text-base font-light text-neutral-600 lg:text-lg"
          >
            A design language spoken in two dialects: European precision and
            Arabian warmth.
          </motion.p>
        </div>

        {/* Intro Paragraph with reveal animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-16 lg:mb-24"
        >
          <div className="mx-auto max-w-4xl space-y-6 font-Satoshi text-base font-light leading-relaxed text-neutral-600 lg:text-lg">
            <p>
              Eng. Maher Mouhajer does not believe in choosing between the past
              and the future. His philosophy is built on the conviction that
              true luxury lies in the contrast.
            </p>
            <p>
              By filtering his opulent Arabic heritage through the lens of his
              London education, he has created a signature style that is unique
              to MIDC.{" "}
              <span className="font-medium text-neutral-950">
                It is not just about how a room looks. It is about how a room
                feels.
              </span>
            </p>
          </div>
        </motion.div>

        {/* Philosophies Grid with enhanced cards */}
        <div className="space-y-6 lg:space-y-8">
          {philosophies.map((philosophy, index) => (
            <PhilosophyCard
              key={philosophy.id}
              philosophy={philosophy}
              index={index}
            />
          ))}
        </div>

        {/* Quote with 3D effect */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 border-t border-neutral-200 pt-16 lg:mt-28"
        >
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6 font-SchnyderS text-6xl font-light text-neutral-200"
            >
              &ldquo;
            </motion.div>
            <RevealText
              className="font-SchnyderS text-2xl font-light leading-relaxed text-neutral-950 lg:text-3xl"
              delay={0.4}
              stagger={0.015}
              animationType="luxury"
            >
              We create spaces where the grandeur of history shakes hands with
              the clean lines of tomorrow.
            </RevealText>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mx-auto mt-8 h-1 w-16 origin-center bg-[#8f7852]/50"
            />
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
              href="/projects"
              className="group inline-flex items-center gap-3 border border-[#8f7852]/30 bg-[#8f7852]/5 px-10 py-5 font-Satoshi text-sm font-light uppercase tracking-wider text-neutral-950 transition-all duration-500 hover:border-[#8f7852]/50 hover:bg-[#8f7852]/10"
            >
              <span>Explore What We Built Together</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1}
              />
            </Link>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
