'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, MapPin, Phone, Mail, Clock, Sparkles } from 'lucide-react';
import { ContactCTA } from '@/components/contact-cta';
import { SafeImage } from '@/components/safe-image';

interface ContactProps {
  backgroundImage?: string;
}

export function Contact({ backgroundImage }: ContactProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Parallax effects
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const backgroundScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.05]);

  // Mouse tracking for subtle 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 100, damping: 30 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [2, -2]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-2, 2]), springConfig);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const contactInfo = [
    {
      label: 'Email',
      value: process.env.NEXT_PUBLIC_EMAIL || 'info@mouhajerdesign.com',
      href: `mailto:${process.env.NEXT_PUBLIC_EMAIL || 'info@mouhajerdesign.com'}`,
      icon: Mail,
      description: 'For inquiries and proposals',
    },
    {
      label: 'Phone',
      value: process.env.NEXT_PUBLIC_PHONE || '+971-4-323-4567',
      href: `tel:${process.env.NEXT_PUBLIC_PHONE || '+971-4-323-4567'}`,
      icon: Phone,
      description: 'Available during business hours',
    },
    {
      label: 'Location',
      value: 'Dubai, United Arab Emirates',
      href: '#',
      icon: MapPin,
      description: 'Dubai & Abu Dhabi offices',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen items-center overflow-hidden bg-neutral-950 py-24 sm:py-32 lg:py-40"
    >
      {/* Cinematic Background */}
      <motion.div
        className="absolute inset-0"
        style={{ y: backgroundY, scale: backgroundScale }}
      >
        {backgroundImage && (
          <SafeImage
            src={backgroundImage}
            alt="Luxury interior"
            fill
            className="object-cover"
            priority
          />
        )}
        {/* Multi-layer overlays for depth */}
        <div className="absolute inset-0 bg-neutral-950/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-neutral-950" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/80" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </motion.div>

      {/* Floating accent orbs */}
      <motion.div
        className="absolute left-[10%] top-[20%] h-96 w-96 rounded-full bg-[#d4af37]/[0.03] blur-[150px]"
        animate={{ y: [0, -40, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[15%] bottom-[20%] h-80 w-80 rounded-full bg-white/[0.02] blur-[120px]"
        animate={{ y: [0, 50, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-16 text-center lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center justify-center gap-4"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#d4af37]/50" />
            <Sparkles className="h-4 w-4 text-[#d4af37]" strokeWidth={1} />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.4em] text-white/50">
              Begin Your Journey
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#d4af37]/50" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6 font-SchnyderS text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            Let&apos;s Create
            <br />
            <span className="text-white/30">Something Extraordinary</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl font-Satoshi text-base font-light leading-relaxed text-white/50 lg:text-lg"
          >
            Ready to transform your vision into reality? Our team of experts is here to guide you
            through every step of the journey.
          </motion.p>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Column - Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-4"
          >
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              const isHovered = hoveredItem === index;

              return (
                <motion.a
                  key={index}
                  href={item.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="group relative block overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:border-[#d4af37]/30 hover:bg-white/[0.04]"
                >
                  <div className="relative z-10 flex items-center gap-6 p-6 lg:p-8">
                    {/* Icon */}
                    <motion.div
                      className="flex h-16 w-16 shrink-0 items-center justify-center border transition-all duration-500"
                      animate={{
                        borderColor: isHovered ? 'rgba(212, 175, 55, 0.5)' : 'rgba(255, 255, 255, 0.1)',
                        backgroundColor: isHovered ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                      }}
                    >
                      <Icon
                        className="h-6 w-6 transition-colors duration-500"
                        strokeWidth={1}
                        style={{ color: isHovered ? '#d4af37' : 'rgba(255, 255, 255, 0.4)' }}
                      />
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="mb-1 font-Satoshi text-[10px] font-light uppercase tracking-[0.2em] text-white/40 transition-colors duration-500 group-hover:text-[#d4af37]/70">
                        {item.label}
                      </div>
                      <div className="mb-1 font-SchnyderS text-xl font-light text-white transition-colors duration-500 group-hover:text-white lg:text-2xl">
                        {item.value}
                      </div>
                      <div className="font-Satoshi text-xs font-light text-white/30">
                        {item.description}
                      </div>
                    </div>

                    {/* Arrow */}
                    <motion.div
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition-all duration-500 group-hover:border-[#d4af37]/30 group-hover:bg-[#d4af37]/10"
                      animate={{ x: isHovered ? 5 : 0 }}
                    >
                      <ArrowRight className="h-4 w-4 text-white/40 transition-colors duration-500 group-hover:text-[#d4af37]" strokeWidth={1.5} />
                    </motion.div>
                  </div>

                  {/* Hover shimmer effect */}
                  {isHovered && (
                    <motion.div
                      initial={{ x: '-100%', opacity: 0 }}
                      animate={{ x: '200%', opacity: 0.1 }}
                      transition={{ duration: 1, ease: 'easeInOut' }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                      style={{ transform: 'skewX(-20deg)' }}
                    />
                  )}

                  {/* Corner accent */}
                  <div className="absolute right-0 top-0 h-12 w-12 border-r border-t border-[#d4af37]/0 transition-all duration-500 group-hover:border-[#d4af37]/30" />
                  <div className="absolute bottom-0 left-0 h-12 w-12 border-b border-l border-[#d4af37]/0 transition-all duration-500 group-hover:border-[#d4af37]/30" />
                </motion.a>
              );
            })}

            {/* Business Hours Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm lg:p-8"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center border border-[#d4af37]/30 bg-[#d4af37]/5">
                  <Clock className="h-5 w-5 text-[#d4af37]" strokeWidth={1} />
                </div>
                <div>
                  <h4 className="font-SchnyderS text-lg font-light text-white">Business Hours</h4>
                  <p className="font-Satoshi text-xs font-light text-white/40">Dubai & Abu Dhabi</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM', active: true },
                  { day: 'Saturday', hours: '10:00 AM - 4:00 PM', active: true },
                  { day: 'Sunday', hours: 'Closed', active: false },
                ].map((schedule, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between">
                      <span className={`font-Satoshi text-sm font-light ${schedule.active ? 'text-white/70' : 'text-white/30'}`}>
                        {schedule.day}
                      </span>
                      <span className={`font-Satoshi text-sm font-light ${schedule.active ? 'text-[#d4af37]/80' : 'text-white/20'}`}>
                        {schedule.hours}
                      </span>
                    </div>
                    {index < 2 && <div className="mt-4 h-px w-full bg-white/5" />}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - CTA Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="relative h-full overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-sm">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#d4af37]/[0.05] blur-[100px]" />
              </div>

              <div className="relative z-10 flex h-full flex-col justify-center p-8 lg:p-12 xl:p-16">
                {/* Decorative top element */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="mb-10"
                >
                  <div className="inline-flex items-center gap-3 border border-[#d4af37]/30 bg-[#d4af37]/5 px-5 py-3">
                    <div className="h-2 w-2 rounded-full bg-[#d4af37] animate-pulse" />
                    <span className="font-Satoshi text-xs font-light uppercase tracking-[0.2em] text-[#d4af37]">
                      Available for New Projects
                    </span>
                  </div>
                </motion.div>

                {/* Main heading */}
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="mb-6 font-SchnyderS text-3xl font-light text-white lg:text-4xl xl:text-5xl"
                >
                  Transform Your
                  <br />
                  <span className="text-[#d4af37]">Vision Into Reality</span>
                </motion.h3>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="mb-10 max-w-md font-Satoshi text-base font-light leading-relaxed text-white/50 lg:text-lg"
                >
                  Whether you&apos;re envisioning a luxury villa, a 5-star hotel suite, or a prestigious
                  commercial space, our team delivers uncompromising excellence.
                </motion.p>

                {/* Features list */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="mb-10 grid grid-cols-2 gap-4"
                >
                  {[
                    'Free Consultation',
                    'Detailed Proposals',
                    'Fixed Pricing',
                    'Dedicated Team',
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
                      <span className="font-Satoshi text-sm font-light text-white/60">{feature}</span>
                    </div>
                  ))}
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1 }}
                >
                  <ContactCTA
                    source="home-contact-section"
                    text="Book a Consultation"
                    variant="gold"
                  />
                </motion.div>

                {/* Trust indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 1.1 }}
                  className="mt-10 flex items-center gap-4 border-t border-white/5 pt-8"
                >
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-neutral-950 bg-gradient-to-br from-[#d4af37]/30 to-[#d4af37]/10" />
                    ))}
                  </div>
                  <div className="font-Satoshi text-xs font-light text-white/40">
                    <span className="text-white/70">400+</span> projects delivered with excellence
                  </div>
                </motion.div>
              </div>

              {/* Corner frame accents */}
              <div className="absolute left-0 top-0 h-20 w-20 border-l-2 border-t-2 border-[#d4af37]/30" />
              <div className="absolute bottom-0 right-0 h-20 w-20 border-b-2 border-r-2 border-[#d4af37]/30" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute left-8 top-24 hidden h-32 w-32 border-l border-t border-white/5 lg:block" />
      <div className="absolute bottom-24 right-8 hidden h-32 w-32 border-b border-r border-white/5 lg:block" />
    </section>
  );
}
