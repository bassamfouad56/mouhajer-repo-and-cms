'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SafeImage } from '@/components/safe-image';

export function TestFounderVision() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.2]);
  const textY = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[800px] overflow-hidden bg-neutral-950"
    >
      {/* Parallax Background Image */}
      <motion.div
        style={{ scale: imageScale }}
        className="absolute inset-0"
      >
        <SafeImage
          src="/founder/CEO Arabia.jpg"
          alt="Eng. Maher Mouhajer in contemplation"
          fill
          className="object-cover"
          priority
        />

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/40 to-neutral-950/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/60 via-transparent to-neutral-950/60" />

        {/* Film grain effect */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
        }} />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 flex h-full items-center justify-center px-6 lg:px-12"
      >
        <div className="max-w-5xl text-center">
          {/* Chapter indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="mb-4 inline-flex items-center gap-3 border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-md">
              <div className="h-px w-8 bg-[#c9a962]" />
              <span className="font-Satoshi text-xs font-light uppercase tracking-[0.4em] text-white/70">
                Chapter I
              </span>
              <div className="h-px w-8 bg-[#c9a962]" />
            </div>
          </motion.div>

          {/* Main Quote */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h2 className="mb-10 font-SchnyderS text-4xl font-light leading-[1.15] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              "A building is not complete
              <br />
              until the last detail
              <br />
              <span className="text-[#c9a962]">serves its purpose."</span>
            </h2>

            <div className="mb-16 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-[#c9a962] to-transparent" />

            <p className="mx-auto max-w-3xl font-Satoshi text-lg font-light leading-relaxed text-white/70 lg:text-xl">
              For Eng. Maher Mouhajer, architecture is not about making a statement.
              It's about creating environments where people live better, work smarter, and feel more.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent" />
    </section>
  );
}
