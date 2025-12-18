'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { SafeImage } from '@/components/safe-image';

// Text reveal animation component
function RevealText({
  children,
  delay = 0,
  isInView
}: {
  children: string;
  delay?: number;
  isInView: boolean;
}) {
  const words = children.split(' ');

  return (
    <span className="inline">
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.6,
              delay: delay + i * 0.03,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// Animated signature SVG
function AnimatedSignature({ isInView }: { isInView: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 200 60"
      className="h-12 w-48 sm:h-16 sm:w-64"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <motion.path
        d="M10 45 Q30 10, 50 35 T90 30 Q110 25, 130 35 T170 30 Q185 28, 195 35"
        fill="none"
        stroke="rgba(38,36,32,0.5)"
        strokeWidth="1.5"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
              pathLength: { duration: 2, ease: "easeInOut", delay: 0.5 },
              opacity: { duration: 0.3, delay: 0.5 }
            }
          }
        }}
      />
      {/* Underline flourish */}
      <motion.path
        d="M30 50 Q100 55, 180 48"
        fill="none"
        stroke="rgba(201,169,98,0.4)"
        strokeWidth="0.5"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
              pathLength: { duration: 1, ease: "easeInOut", delay: 2 },
              opacity: { duration: 0.3, delay: 2 }
            }
          }
        }}
      />
    </motion.svg>
  );
}

interface FounderMessageProps {
  founderImage?: string;
  founderName?: string;
  founderTitle?: string;
  founderQuote?: string;
  backgroundImage?: string;
}

export function FounderMessage({
  founderImage,
  founderName = 'Eng. Maher Mouhajer',
  founderTitle = 'CEO & Founder',
  founderQuote,
  backgroundImage,
}: FounderMessageProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-20%' });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Parallax transforms
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.1]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
  const contentY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const quoteOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.7, 0.5]);

  // Mouse tracking for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 100, damping: 30 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={sectionRef}
      id="founder"
      className="relative min-h-screen overflow-hidden bg-[#faf8f5] scroll-mt-24"
    >
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: imageScale, y: imageY }}
      >
        {backgroundImage && (
          <SafeImage
            src={backgroundImage}
            alt="Luxury interior background"
            fill
            className="object-cover"
            priority
          />
        )}
        {/* Light overlay */}
        <motion.div
          className="absolute inset-0 bg-[#faf8f5]"
          style={{ opacity: overlayOpacity }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f5] via-[#faf8f5]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#faf8f5] via-transparent to-[#faf8f5]/50" />
      </motion.div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute right-[20%] top-[20%] h-px w-32 bg-gradient-to-r from-transparent via-[#c9a962]/30 to-transparent"
          animate={{ x: [0, 50, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-[10%] top-[60%] h-px w-24 bg-gradient-to-r from-transparent via-[#262420]/10 to-transparent"
          animate={{ x: [0, -30, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute right-[30%] bottom-[30%] h-32 w-px bg-gradient-to-b from-transparent via-[#c9a962]/20 to-transparent"
          animate={{ y: [0, 20, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Main Content Container */}
      <div
        ref={containerRef}
        className="relative z-10 mx-auto flex min-h-screen max-w-[1800px] items-center px-6 py-20 lg:px-12"
      >
        <div className="grid w-full gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column - Founder Image */}
          <motion.div
            className="relative lg:col-span-5"
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
              perspective: 1000,
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative"
            >
              {/* Image frame with 3D depth */}
              <div className="relative aspect-[3/4] overflow-hidden">
                {/* Outer frame */}
                <div className="absolute -inset-4 border border-[#262420]/10" style={{ transform: 'translateZ(-20px)' }} />

                {/* Main image */}
                <motion.div
                  className="relative h-full w-full overflow-hidden bg-[#e8e6e3]"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.6 }}
                >
                  {founderImage && (
                    <SafeImage
                      src={founderImage}
                      alt={`${founderName} - ${founderTitle}`}
                      fill
                      className="object-cover object-center"
                    />
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#262420]/80 via-[#262420]/20 to-transparent" />

                  {/* Scan line effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent"
                    animate={{ y: ['100%', '-100%'] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  />
                </motion.div>

                {/* Name badge - floating */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="absolute bottom-0 left-0 right-0 p-6 sm:p-8"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  <div className="border-l-2 border-white/50 pl-4">
                    <div className="font-Satoshi text-[10px] font-light uppercase tracking-[0.2em] text-white/70 sm:text-xs">
                      {founderTitle}
                    </div>
                    <div className="mt-1 font-SchnyderS text-xl font-light text-white sm:text-2xl">
                      {founderName}
                    </div>
                  </div>
                </motion.div>

                {/* Corner accents */}
                <div className="absolute left-0 top-0 h-16 w-16 border-l border-t border-[#c9a962]/30" />
                <div className="absolute bottom-0 right-0 h-16 w-16 border-b border-r border-[#c9a962]/30" />
              </div>

            </motion.div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            className="flex flex-col justify-center lg:col-span-7"
            style={{ y: contentY }}
          >
            {/* Section Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-6 flex items-center gap-4 sm:mb-8"
            >
              <div className="h-px w-12 bg-[#c9a962]/40" />
              <span className="font-Satoshi text-[10px] font-light uppercase tracking-[0.3em] text-[#c9a962] sm:text-xs">
                A Message from the Founder
              </span>
            </motion.div>

            {/* Headline - content.md line 250 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8 sm:mb-10"
            >
              <h2 className="font-SchnyderS text-4xl font-light leading-[1.1] tracking-tight text-[#262420] sm:text-5xl lg:text-6xl">
                We Don't Just Draw.
                <br />
                <span className="text-[#c9a962]">We Build.</span>
              </h2>
            </motion.div>

            {/* Large Quote */}
            <div className="mb-8 sm:mb-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-4 font-SchnyderS text-5xl font-light leading-none text-[#c9a962]/20 sm:text-7xl"
              >
                &ldquo;
              </motion.div>

              <h2 className="font-SchnyderS text-3xl font-light leading-[1.2] tracking-tight text-[#262420] sm:text-4xl lg:text-5xl xl:text-6xl">
                <RevealText delay={0.3} isInView={isInView}>
                  Designing a palace on paper is easy.
                </RevealText>
                <br />
                <span className="text-[#3d3a36]/50">
                  <RevealText delay={0.6} isInView={isInView}>
                    Building it on sand requires discipline.
                  </RevealText>
                </span>
              </h2>
            </div>

            {/* Body Copy */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mb-10 max-w-2xl space-y-6 sm:mb-12"
            >
              <p className="font-Satoshi text-base font-light leading-relaxed text-[#3d3a36]/80 sm:text-lg">
                For over two decades, I have led a firm that refuses to outsource the hard work.
                Whether we are pouring the foundation for a new mega-mansion or fitting out a
                5-star hotel lobby, my team controls the process.
              </p>

              <p className="font-Satoshi text-sm font-light leading-relaxed text-[#3d3a36]/60 sm:text-base">
                My promise to you is simple:{' '}
                <span className="text-[#262420] font-medium">
                  The luxury you see in the render is exactly the quality you will touch in reality.
                </span>
                {' '}No compromises. No excuses.
              </p>
            </motion.div>

            {/* Signature Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="border-t border-[#262420]/10 pt-8"
            >
              {/* Animated signature */}
              <AnimatedSignature isInView={isInView} />

              <div className="mt-4 flex items-center gap-6">
                <div>
                  <div className="font-SchnyderS text-lg font-light italic text-[#262420]/70 sm:text-xl">
                    {founderName}
                  </div>
                  <div className="font-Satoshi text-[10px] font-light uppercase tracking-[0.2em] text-[#3d3a36]/50 sm:text-xs">
                    {founderTitle}
                  </div>
                </div>

                {/* Decorative line */}
                <div className="hidden h-12 w-px bg-gradient-to-b from-transparent via-[#c9a962]/30 to-transparent sm:block" />

                {/* Location */}
                <div className="hidden sm:block">
                  <div className="font-Satoshi text-xs font-light text-[#3d3a36]/60">
                    Dubai & Abu Dhabi
                  </div>
                  <div className="font-Satoshi text-[10px] font-light uppercase tracking-[0.15em] text-[#3d3a36]/40">
                    United Arab Emirates
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#faf8f5] to-transparent" />

      {/* Mouse follower glow */}
      <motion.div
        className="pointer-events-none fixed h-64 w-64 rounded-full bg-[#c9a962]/[0.03] blur-3xl"
        style={{
          left: mousePosition.x - 128,
          top: mousePosition.y - 128,
        }}
      />
    </section>
  );
}
