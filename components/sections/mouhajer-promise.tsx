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

  // Default background image when no card is hovered
  const DEFAULT_BG_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80';

  const cards = [
    {
      title: 'Land Owners',
      subtitle: 'From Ground Zero',
      description:
        'You see potential in the sand. We have the engineering license to turn that empty plot into a structural masterpiece. We handle the excavation, the concrete, and the keys.',
      image: images?.landOwners || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
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
      image: images?.propertyOwners || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
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
      className="relative min-h-screen overflow-hidden bg-[#faf8f5] scroll-mt-24"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #c9a962 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }} />

      {/* Animated grid lines - subtle */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute left-1/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#c9a962]/10 to-transparent"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#c9a962]/15 to-transparent"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute left-3/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#c9a962]/10 to-transparent"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-[#c9a962]/40"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.7, 0.3],
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
              className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a962]/60"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
            />
            <span className="font-Satoshi text-[10px] uppercase tracking-[0.3em] text-[#c9a962] sm:text-xs">
              The Mouhajer Promise
            </span>
            <motion.div
              className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a962]/60"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 font-SchnyderS text-4xl font-light tracking-tight text-[#262420] sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            The Architect of
            <br />
            <span className="bg-gradient-to-r from-[#262420]/60 via-[#262420] to-[#262420]/60 bg-clip-text text-transparent">
              Assets & Sanctuaries.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto max-w-2xl font-Satoshi text-base font-light leading-relaxed text-[#3d3a36]/70 sm:text-lg"
          >
            We understand that our clients fall into two categories,
            but they share one demand: <span className="text-[#c9a962] font-medium">Perfection.</span>
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
                  {/* Lighter gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#262420]/90 via-[#262420]/50 to-[#262420]/20" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#262420]/30 via-transparent to-transparent" />
                </div>

                {/* Glass morphism border effect */}
                <div className="absolute inset-0 border border-white/20 transition-colors duration-500 group-hover:border-[#c9a962]/40" />

                {/* Animated shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ transform: 'skewX(-20deg) translateX(-100%)' }}
                  animate={activeCard === index ? { translateX: ['0%', '200%'] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                />

                {/* Content */}
                <div className="relative z-10 flex min-h-[400px] flex-col justify-end p-8 lg:min-h-[450px] lg:p-10">
                  {/* Icon */}
                  <motion.div
                    className="mb-6 text-[#c9a962] transition-colors duration-500 group-hover:text-[#d4b978]"
                    animate={activeCard === index ? { y: [0, -5, 0] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {card.icon}
                  </motion.div>

                  {/* Subtitle */}
                  <motion.span
                    className="mb-2 font-Satoshi text-[10px] uppercase tracking-[0.3em] text-[#c9a962]/80 transition-colors duration-500 group-hover:text-[#c9a962] sm:text-xs"
                  >
                    {card.subtitle}
                  </motion.span>

                  {/* Title */}
                  <h3 className="mb-4 font-SchnyderS text-3xl font-light text-white transition-all duration-500 group-hover:text-white sm:text-4xl lg:text-5xl">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="mb-6 max-w-md font-Satoshi text-sm font-light leading-relaxed text-white/70 transition-colors duration-500 group-hover:text-white/90 sm:text-base">
                    {card.description}
                  </p>

                  {/* Animated underline */}
                  <motion.div
                    className="h-px w-0 bg-gradient-to-r from-[#c9a962] to-transparent transition-all duration-700 group-hover:w-full"
                  />
                </div>

                {/* 3D depth layers */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ transform: 'translateZ(20px)' }}
                />

                {/* Corner accents */}
                <div className="absolute left-4 top-4 h-8 w-8 border-l border-t border-[#c9a962]/30 transition-colors duration-500 group-hover:border-[#c9a962]/60" />
                <div className="absolute bottom-4 right-4 h-8 w-8 border-b border-r border-[#c9a962]/30 transition-colors duration-500 group-hover:border-[#c9a962]/60" />
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
          <p className="mx-auto mb-10 max-w-xl font-Satoshi text-sm font-light leading-relaxed text-[#3d3a36]/60 sm:text-base">
            We are not just designers. We are a{' '}
            <span className="text-[#262420] font-medium">Grade-A Construction Company</span> that bridges
            the gap between dreams and reality.
          </p>

          <Link
            href="/services"
            className="group inline-flex items-center gap-3 border border-[#c9a962] bg-[#c9a962]/10 px-10 py-5 font-Satoshi text-xs uppercase tracking-[0.2em] text-[#262420] transition-all duration-500 hover:bg-[#c9a962] hover:text-white sm:text-sm"
          >
            Our Construction Capabilities
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
          </Link>
        </motion.div>
      </div>

      {/* Mouse follower glow */}
      <motion.div
        className="pointer-events-none fixed z-50 h-64 w-64 rounded-full bg-[#c9a962]/10 blur-3xl"
        style={{
          left: mousePosition.x - 128,
          top: mousePosition.y - 128,
        }}
      />
    </section>
  );
}
