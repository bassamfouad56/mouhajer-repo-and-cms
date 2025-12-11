'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SafeImage } from '@/components/safe-image';

interface MouhajerPromiseProps {
  images?: {
    landOwners: string;
    propertyOwners: string;
  };
}

export function MouhajerPromise({ images }: MouhajerPromiseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Parallax and 3D transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const headerY = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  // Mouse tracking for 3D card effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);

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

  const cards = [
    {
      title: 'Land Owners',
      subtitle: 'From Ground Zero',
      description:
        'You see potential in the sand. We have the engineering license to turn that empty plot into a structural masterpiece. We handle the excavation, the concrete, and the keys.',
      image: images?.landOwners || '/projects/commercial-interior/11.jpg',
      imageAlt: 'Construction site with modern building under construction',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="h-8 w-8">
          <path d="M3 21h18M3 7v14M21 7v14M6 21V10M10 21V10M14 21V10M18 21V10M12 7L3 3M12 7l9-4M12 7v4" />
        </svg>
      ),
    },
    {
      title: 'Property Owners',
      subtitle: 'Renaissance & Rebirth',
      description:
        'You own a villa or hotel that needs a rebirth. We manage complex renovations that transform dated structures into modern assets, increasing value and livability.',
      image: images?.propertyOwners || '/projects/turnkey-design-fitout/_MID2543-HDR.jpg',
      imageAlt: 'Luxury villa renovation interior design',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="h-8 w-8">
          <path d="M12 3L2 12h3v9h14v-9h3L12 3zM9 21v-6h6v6" />
        </svg>
      ),
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="promise"
      className="relative min-h-screen overflow-hidden bg-neutral-950 scroll-mt-24"
    >
      {/* Dynamic Background with Parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        {/* Background Image - changes based on active card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCard ?? 'default'}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <SafeImage
              src={activeCard !== null ? cards[activeCard].image : '/projects/commercial-interior/_MID7362-HDR.jpg'}
              alt="Background"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Multi-layer overlays for depth */}
        <div className="absolute inset-0 bg-neutral-950/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-transparent to-neutral-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-transparent to-neutral-950/80" />

        {/* Animated noise texture */}
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          }}
        />

        {/* Animated grid lines */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute left-1/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/5 to-transparent"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#d4af37]/10 to-transparent"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          <motion.div
            className="absolute left-3/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/5 to-transparent"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
        </div>
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-[#d4af37]/30"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div
        ref={containerRef}
        className="relative z-10 mx-auto flex min-h-screen max-w-[1800px] flex-col items-center justify-center px-6 py-24 lg:px-12"
      >
        {/* Section Header */}
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="mb-16 text-center lg:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center justify-center gap-4"
          >
            <motion.div
              className="h-px w-16 bg-gradient-to-r from-transparent to-[#d4af37]/50"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
            />
            <span className="font-Satoshi text-[10px] uppercase tracking-[0.3em] text-[#d4af37]/70 sm:text-xs">
              The Mouhajer Promise
            </span>
            <motion.div
              className="h-px w-16 bg-gradient-to-l from-transparent to-[#d4af37]/50"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 font-SchnyderS text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            The Architect of
            <br />
            <span className="bg-gradient-to-r from-white/40 via-white/60 to-white/40 bg-clip-text text-transparent">
              Assets & Sanctuaries.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto max-w-2xl font-Satoshi text-base font-light leading-relaxed text-white/60 sm:text-lg"
          >
            We understand that our clients fall into two categories,
            but they share one demand: <span className="text-[#d4af37]">Perfection.</span>
          </motion.p>
        </motion.div>

        {/* 3D Cards Container */}
        <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-2 lg:gap-12">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60, rotateX: 10 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 1, delay: 0.5 + index * 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="group perspective-1000"
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <motion.div
                className="relative overflow-hidden rounded-sm"
                style={{
                  transformStyle: 'preserve-3d',
                  rotateX: activeCard === index ? rotateX : 0,
                  rotateY: activeCard === index ? rotateY : 0,
                }}
                whileHover={{ scale: 1.02, z: 50 }}
                transition={{ duration: 0.4 }}
              >
                {/* Card Background Image */}
                <div className="absolute inset-0">
                  <SafeImage
                    src={card.image}
                    alt={card.imageAlt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/30" />
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-950/50 via-transparent to-transparent" />
                </div>

                {/* Glass morphism border effect */}
                <div className="absolute inset-0 border border-white/10 transition-colors duration-500 group-hover:border-[#d4af37]/30" />

                {/* Animated shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ transform: 'skewX(-20deg) translateX(-100%)' }}
                  animate={activeCard === index ? { translateX: ['0%', '200%'] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                />

                {/* Content */}
                <div className="relative z-10 flex min-h-[400px] flex-col justify-end p-8 lg:min-h-[450px] lg:p-10">
                  {/* Icon */}
                  <motion.div
                    className="mb-6 text-[#d4af37]/70 transition-colors duration-500 group-hover:text-[#d4af37]"
                    animate={activeCard === index ? { y: [0, -5, 0] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {card.icon}
                  </motion.div>

                  {/* Subtitle */}
                  <motion.span
                    className="mb-2 font-Satoshi text-[10px] uppercase tracking-[0.3em] text-[#d4af37]/60 transition-colors duration-500 group-hover:text-[#d4af37] sm:text-xs"
                  >
                    {card.subtitle}
                  </motion.span>

                  {/* Title */}
                  <h3 className="mb-4 font-SchnyderS text-3xl font-light text-white transition-all duration-500 group-hover:text-white sm:text-4xl lg:text-5xl">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="mb-6 max-w-md font-Satoshi text-sm font-light leading-relaxed text-white/60 transition-colors duration-500 group-hover:text-white/80 sm:text-base">
                    {card.description}
                  </p>

                  {/* Animated underline */}
                  <motion.div
                    className="h-px w-0 bg-gradient-to-r from-[#d4af37] to-transparent transition-all duration-700 group-hover:w-full"
                  />
                </div>

                {/* 3D depth layers */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ transform: 'translateZ(20px)' }}
                />

                {/* Corner accents */}
                <div className="absolute left-4 top-4 h-8 w-8 border-l border-t border-[#d4af37]/20 transition-colors duration-500 group-hover:border-[#d4af37]/50" />
                <div className="absolute bottom-4 right-4 h-8 w-8 border-b border-r border-[#d4af37]/20 transition-colors duration-500 group-hover:border-[#d4af37]/50" />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Statement */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 text-center lg:mt-20"
        >
          <p className="mx-auto mb-10 max-w-xl font-Satoshi text-sm font-light leading-relaxed text-white/40 sm:text-base">
            We are not just designers. We are a{' '}
            <span className="text-white/70">Grade-A Construction Company</span> that bridges
            the gap between dreams and reality.
          </p>

          <Link
            href="/services"
            className="group inline-flex items-center gap-3 border border-[#d4af37]/50 bg-[#d4af37]/5 px-10 py-5 font-Satoshi text-xs uppercase tracking-[0.2em] text-[#d4af37] backdrop-blur-sm transition-all duration-500 hover:border-[#d4af37] hover:bg-[#d4af37] hover:text-neutral-950 sm:text-sm"
          >
            Our Construction Capabilities
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
          </Link>
        </motion.div>
      </div>

      {/* Mouse follower glow */}
      <motion.div
        className="pointer-events-none fixed z-50 h-64 w-64 rounded-full bg-[#d4af37]/5 blur-3xl"
        style={{
          left: mousePosition.x - 128,
          top: mousePosition.y - 128,
        }}
      />

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent" />
    </section>
  );
}
