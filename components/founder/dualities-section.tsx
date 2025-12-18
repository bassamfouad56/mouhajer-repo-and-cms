'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { SafeImage } from '@/components/safe-image';

const philosophies = [
  {
    id: 'london',
    title: 'The London Discipline',
    subtitle: 'The Mind',
    description: 'Great design requires order. Educated in the UK, Eng. Maher applies a strict architectural discipline to every project. This ensures that even the most ornate spaces remain uncluttered and smart. We reject chaos. We embrace logic, flow, and function.',
  },
  {
    id: 'arabic',
    title: 'The Arabic Soul',
    subtitle: 'The Heart',
    description: 'Minimalism can often feel cold. We counter this with the warmth of our heritage. We infuse spaces with the texture, grandeur, and hospitality inherent in Arabic culture. This is the "Baroque" influence. It is a love for richness, gold, and detail, but tamed and polished for the modern executive.',
  },
  {
    id: 'immaculate',
    title: 'The Immaculate Standard',
    subtitle: 'The Result',
    description: 'A design is only as good as its finish. Eng. Maher works with an all-rounded approach. He is obsessed with the final touch. Whether it is the joinery of a private villa or the lobby of a 5-star hotel, the result must be pristine. We create environments that do not just impress guests. They elevate the way they live.',
  },
];

export function DualitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-32 sm:py-40 lg:py-48"
    >
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-linear-to-b from-neutral-50/50 via-white to-neutral-50/30" />

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 lg:px-12 xl:px-16">

        {/* Hero Section with Large Founder Image */}
        <div className="mb-32 grid gap-16 lg:grid-cols-12 lg:gap-20 xl:gap-24">

          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center lg:col-span-5"
          >
            <div className="mb-8">
              <div className="mb-2 h-px w-16 bg-neutral-900" />
              <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400">
                Design Philosophy
              </span>
            </div>

            <h2 className="mb-10 font-SchnyderS text-5xl font-light leading-[1.05] tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl xl:text-8xl">
              Defined by
              <br />
              <span className="text-neutral-300">Dualities</span>
            </h2>

            <div className="mb-12 space-y-6 font-Satoshi text-lg font-light leading-relaxed text-neutral-600 lg:text-xl">
              <p>
                Eng. Maher Mouhajer does not believe in choosing between the past and the future.
                His philosophy is built on the conviction that true luxury lies in the contrast.
              </p>
              <p className="text-neutral-950">
                By filtering his opulent Arabic heritage through the lens of his London education,
                he has created a signature style that is unique to MIDC.
              </p>
            </div>

            <div className="font-Satoshi text-sm font-light italic text-neutral-400">
              A design language spoken in two dialects:<br />
              European precision and Arabian warmth.
            </div>
          </motion.div>

          {/* Right: Large Founder Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative lg:col-span-7"
          >
            <motion.div
              style={{ y: imageY }}
              className="relative aspect-4/5 overflow-hidden bg-neutral-100"
            >
              <Image
                src="/founder/CID_2106_00_COVER.jpg"
                alt="Eng. Maher Mouhajer - Founder & CEO of MIDC"
                fill
                quality={100}
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
                unoptimized={false}
              />

              {/* Minimal overlay for depth */}
              <div className="absolute inset-0 bg-linear-to-t from-neutral-950/20 via-transparent to-transparent" />

              {/* Minimal frame accent */}
              <div className="absolute bottom-0 left-0 right-0 border-b-[3px] border-[#c9a962]" />
            </motion.div>

            {/* Floating caption */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute -bottom-8 right-8 bg-white px-8 py-5 shadow-2xl shadow-neutral-900/10"
            >
              <div className="font-Satoshi text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
                Eng. Maher Mouhajer
              </div>
              <div className="font-SchnyderS text-2xl font-light text-neutral-950">
                CEO & Founder
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Philosophy Cards - Minimalist Grid */}
        <div className="mb-32 grid gap-8 md:grid-cols-3 lg:gap-12">
          {philosophies.map((philosophy, index) => (
            <motion.div
              key={philosophy.id}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.3 + index * 0.15,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="group relative"
            >

              {/* Subtitle */}
              <div className="mb-3 font-Satoshi text-xs font-medium uppercase tracking-[0.25em] text-neutral-400">
                {philosophy.subtitle}
              </div>

              {/* Title */}
              <h3 className="mb-6 font-SchnyderS text-3xl font-light leading-tight text-neutral-950 transition-colors duration-300 group-hover:text-[#c9a962] xl:text-4xl">
                {philosophy.title}
              </h3>

              {/* Description */}
              <p className="font-Satoshi text-base font-light leading-relaxed text-neutral-600">
                {philosophy.description}
              </p>

              {/* Subtle bottom border that expands on hover */}
              <div className="mt-8 h-px w-0 bg-[#c9a962] transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>

        {/* Full-Width Founder Action Shot */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-32 aspect-[21/9] overflow-hidden bg-neutral-100"
        >
          <Image
            src="/founder/Pages from entrepreneur_middle_east_2025_may1_2025__.pdf (1).jpg"
            alt="Eng. Maher Mouhajer - Entrepreneur Middle East Feature"
            fill
            quality={100}
            className="object-cover"
            sizes="100vw"
            unoptimized={false}
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-linear-to-r from-neutral-950/80 via-neutral-950/40 to-transparent" />

          {/* Quote overlay */}
          <div className="absolute inset-y-0 left-0 flex items-center px-12 lg:px-20 xl:px-28">
            <div className="max-w-2xl">
              <div className="mb-4 h-px w-12 bg-[#c9a962]" />
              <p className="font-SchnyderS text-3xl font-light leading-tight text-white lg:text-4xl xl:text-5xl">
                "Every line, every detail must serve both beauty and function."
              </p>
              <div className="mt-6 font-Satoshi text-sm font-light text-white/60">
                — Philosophy in Practice
              </div>
            </div>
          </div>
        </motion.div>

        {/* Closing Quote Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="border-t border-neutral-200 py-20 text-center"
        >
          <div className="mx-auto max-w-4xl">
            <p className="font-SchnyderS text-3xl font-light leading-relaxed text-neutral-950 lg:text-4xl xl:text-5xl">
              We create spaces where the grandeur of history shakes hands with the clean lines of tomorrow.
            </p>
            <div className="mx-auto mt-12 h-px w-24 bg-[#c9a962]" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
