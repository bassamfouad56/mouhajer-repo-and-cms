'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SafeImage } from '@/components/safe-image';
import { getSafeImageUrl } from '@/lib/image-utils';
import { MagneticButton } from '@/components/animations/magnetic-button';
import { SVGLineDraw } from '@/components/animations/svg-line-draw';
import { RevealText } from '@/components/animations/reveal-text';

const clients = [
  { name: 'ADNH', fullName: 'Abu Dhabi National Hotels' },
  { name: 'Wasl', fullName: 'Wasl Properties' },
  { name: 'Emaar', fullName: 'Emaar Properties' },
];

export function StandardsSectionEnhanced() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);
  const imageRotate = useTransform(scrollYProgress, [0, 0.5, 1], [-2, 0, 2]);

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-100 py-24 sm:py-32 lg:py-40"
    >
      {/* Animated Background Pattern */}
      <motion.div
        style={{ y: bgY }}
      />

      {/* Gradient orbs */}
      <div className="absolute right-0 top-1/4 h-[600px] w-[600px] translate-x-1/3 rounded-full bg-[#c9a962]/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 lg:items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-6 flex items-center gap-4"
            >
              <SVGLineDraw width={60} height={1} strokeColor="#c9a962" duration={1.5} delay={0.2} />
              <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-neutral-400">
                Company Culture
              </span>
            </motion.div>

            <RevealText
              className="mb-8 font-SchnyderS text-4xl font-light tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl"
              delay={0.4}
              stagger={0.02}
            >
              We Are All Allergic to Average
            </RevealText>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-6 font-Satoshi text-base font-light leading-relaxed text-neutral-600 lg:text-lg"
            >
              <p>
                The{' '}
                <span className="font-medium text-neutral-950">"MIDC Standard"</span>{' '}
                is not just Eng. Maher&apos;s rule; it is the company&apos;s heartbeat.
              </p>

              <p>
                Whether it is a site laborer ensuring a clean workspace or a senior architect
                refining a Royal Suite layout, every employee understands that{' '}
                <span className="font-medium text-neutral-950">
                  "good enough" is not in our vocabulary
                </span>
                .
              </p>

              <p>
                Eng. Maher Mouhajer is often found on-site, not to police his team, but to support them.
                He is there to solve the impossible problems and to celebrate the breakthroughs.
              </p>

              <div className="pt-6">
                <p className="font-medium text-neutral-950">
                  It is this culture of mutual trust and high expectations that has earned MIDC the
                  loyalty of clients like:
                </p>
              </div>
            </motion.div>

            {/* Client Logos/Names with enhanced animation */}
            <div className="mt-8 space-y-3">
              {clients.map((client, index) => (
                <motion.div
                  key={client.name}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="group flex items-center gap-3"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 + 0.1, type: 'spring' }}
                  >
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#c9a962] transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
                  </motion.div>
                  <div>
                    <span className="font-SchnyderS text-lg font-light text-neutral-950 transition-colors duration-300 group-hover:text-[#c9a962]">
                      {client.name}
                    </span>
                    <span className="ml-2 font-Satoshi text-sm font-light text-neutral-400">
                      ({client.fullName})
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Image with enhanced 3D effects */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:order-last"
            style={{ perspective: '1000px' }}
          >
            <motion.div
              style={{ y: imageY, scale: imageScale, rotateY: imageRotate }}
              className="relative aspect-[4/5] overflow-hidden"
            >
              <SafeImage
                src={getSafeImageUrl('/founder/CID_2106_00_COVER.jpg', 'Eng. Maher Mouhajer', 'hospitality')}
                alt="Eng. Maher Mouhajer on construction site"
                fill
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent" />

              {/* Animated Corner Frames */}
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={isInView ? { scale: 1, rotate: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute left-4 top-4 h-20 w-20 border-l-2 border-t-2 border-[#c9a962]/60"
              />
              <motion.div
                initial={{ scale: 0, rotate: 45 }}
                animate={isInView ? { scale: 1, rotate: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute bottom-4 right-4 h-20 w-20 border-b-2 border-r-2 border-[#c9a962]/60"
              />

              {/* SVG Line decorations */}
              <div className="absolute left-4 top-28">
                <SVGLineDraw width={60} height={2} strokeColor="#c9a962" duration={1.2} delay={0.6} />
              </div>
              <div className="absolute bottom-28 right-4">
                <SVGLineDraw width={60} height={2} strokeColor="#c9a962" duration={1.2} delay={0.7} />
              </div>

              {/* Enhanced Quote Overlay with 3D effect */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute bottom-0 left-0 right-0 p-8"
              >
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="group relative border-l-2 border-[#c9a962] bg-neutral-950/90 p-6 backdrop-blur-md"
                >
                  <p className="font-Satoshi text-sm font-light italic text-white">
                    "Excellence is not an act, but a habit embedded in every team member."
                  </p>
                  <p className="mt-2 font-Satoshi text-xs font-light text-white/60">
                    — Eng. Maher Mouhajer
                  </p>

                  {/* Glowing accent line */}
                  <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-[#c9a962]/0 via-[#c9a962] to-[#c9a962]/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom CTA Section with enhanced animations */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 border-t border-neutral-200 pt-16 lg:mt-28"
        >
          <div className="mx-auto max-w-4xl text-center">
            <RevealText
              className="mb-6 font-SchnyderS text-3xl font-light text-neutral-950 lg:text-4xl"
              delay={0.2}
              stagger={0.015}
            >
              See the Results of Our Obsession
            </RevealText>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-10 font-Satoshi text-base font-light text-neutral-600"
            >
              From Arabian Property Awards to the trust of the region&apos;s most prestigious brands,
              our commitment to excellence speaks for itself.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <MagneticButton strength={0.25}>
                <Link
                  href="/about/awards"
                  className="group inline-flex items-center gap-3 border border-[#c9a962]/30 bg-[#c9a962]/5 px-10 py-5 font-Satoshi text-sm font-light uppercase tracking-wider text-neutral-950 transition-all duration-500 hover:border-[#c9a962]/50 hover:bg-[#c9a962]/10"
                >
                  <span>View Our Achievements</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1} />
                </Link>
              </MagneticButton>

              <MagneticButton strength={0.2}>
                <Link
                  href="/about/clients"
                  className="group inline-flex items-center gap-3 border border-neutral-300 bg-white px-10 py-5 font-Satoshi text-sm font-light uppercase tracking-wider text-neutral-950 transition-all duration-500 hover:border-neutral-400 hover:bg-neutral-50 hover:shadow-lg"
                >
                  <span>Meet Our Clients</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1} />
                </Link>
              </MagneticButton>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
