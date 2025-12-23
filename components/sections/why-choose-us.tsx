'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { SafeImage } from '@/components/safe-image';
import { Award, Target, Users, TrendingUp, Shield, Sparkles } from 'lucide-react';

const reasons = [
  {
    icon: Award,
    title: 'Award-Winning Design',
    description: 'Recognized globally for innovative and luxurious interior design solutions that set industry standards.',
  },
  {
    icon: Target,
    title: 'Precision & Detail',
    description: 'Every element is meticulously crafted to perfection, ensuring flawless execution from concept to completion.',
  },
  {
    icon: Users,
    title: 'Client-Centric Approach',
    description: 'Your vision drives our design. We collaborate closely to bring your unique style to life with expertise.',
  },
  {
    icon: TrendingUp,
    title: '15+ Years Excellence',
    description: 'Over a decade of creating timeless spaces for prestigious clients across the UAE and beyond.',
  },
  {
    icon: Shield,
    title: 'Quality Assurance',
    description: 'We partner with the finest craftsmen and suppliers to ensure uncompromising quality in every project.',
  },
  {
    icon: Sparkles,
    title: 'Timeless Innovation',
    description: 'Blending contemporary trends with classic elegance to create spaces that remain beautiful for years.',
  },
];

interface WhyChooseUsProps {
  mainImage?: string;
  secondaryImage?: string;
}

export function WhyChooseUs({ mainImage, secondaryImage }: WhyChooseUsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({
    target: imageContainerRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-neutral-50 px-6 py-32 lg:px-12 lg:py-48"
    >
      {/* Decorative Background */}

      <div className="mx-auto max-w-[1800px]">
        {/* Section Header */}
        <div className="mb-24 text-center lg:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-6 flex items-center justify-center gap-4"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-neutral-400" />
            <span className="text-sm font-light tracking-[0.3em] text-neutral-500">
              WHY CHOOSE US
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-neutral-400" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mx-auto max-w-4xl text-5xl font-light tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl"
          >
            Excellence in Every Detail
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg font-light leading-relaxed text-neutral-600"
          >
            Discover what sets Mouhajer apart in the world of luxury interior design
          </motion.p>
        </div>

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left Column - Image Collage */}
          <div ref={imageContainerRef} className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1 }}
              className="relative"
            >
              {/* Main Large Image */}
              <motion.div
                style={{ y: imageY, scale: imageScale }}
                className="relative aspect-[3/4] overflow-hidden bg-neutral-200"
              >
                {mainImage && (
                  <SafeImage
                    src={mainImage}
                    alt="Luxury Interior Design"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/20 to-transparent" />
              </motion.div>

              {/* Small Overlapping Image */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 1, delay: 0.3 }}
                className="absolute -bottom-12 -right-12 aspect-square w-1/2 overflow-hidden border-8 border-white shadow-2xl lg:-right-24 bg-neutral-200"
              >
                {secondaryImage && (
                  <SafeImage
                    src={secondaryImage}
                    alt="Interior Design Detail"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                )}
              </motion.div>

              {/* Stats Badge */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute -left-8 top-1/3 bg-neutral-950 px-8 py-6 text-white shadow-2xl lg:-left-16"
              >
                <div className="mb-2 text-5xl font-light">300+</div>
                <div className="text-sm font-light tracking-wider text-neutral-400">
                  PROJECTS<br />COMPLETED
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Reasons Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:gap-12">
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                className="group relative flex h-full flex-col"
              >
                {/* Icon */}
                <div className="mb-4 inline-flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-neutral-950/5 blur-xl transition-all group-hover:bg-neutral-950/10" />
                    <reason.icon
                      className="relative h-8 w-8 text-neutral-950 transition-transform group-hover:scale-110"
                      strokeWidth={1}
                    />
                  </div>
                </div>

                {/* Content */}
                <h3 className="mb-3 text-xl font-light tracking-tight text-neutral-950">
                  {reason.title}
                </h3>
                <p className="flex-1 font-light leading-relaxed text-neutral-600">
                  {reason.description}
                </p>

                {/* Decorative Line */}
                <div className="mt-4 h-px w-12 bg-neutral-200 transition-all group-hover:w-24 group-hover:bg-neutral-950" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
