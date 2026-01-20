"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { SafeImage } from "@/components/safe-image";
import { Globe, GraduationCap, Heart, Star } from "lucide-react";

const philosophies = [
  {
    id: "london",
    icon: GraduationCap,
    title: "The London Discipline",
    subtitle: "The Mind",
    description:
      "Great design requires order. Educated in the UK, Eng. Maher applies a strict architectural discipline to every project. This ensures that even the most ornate spaces remain uncluttered and smart. We reject chaos. We embrace logic, flow, and function.",
  },
  {
    id: "arabic",
    icon: Heart,
    title: "The Arabic Soul",
    subtitle: "The Heart",
    description:
      'Minimalism can often feel cold. We counter this with the warmth of our heritage. We infuse spaces with the texture, grandeur, and hospitality inherent in Arabic culture. This is the "Baroque" influence—a love for richness, gold, and detail, but tamed and polished for the modern executive.',
  },
  {
    id: "immaculate",
    icon: Star,
    title: "The Immaculate Standard",
    subtitle: "The Result",
    description:
      "A design is only as good as its finish. Eng. Maher works with an all-rounded approach. He is obsessed with the final touch. Whether it is the joinery of a private villa or the lobby of a 5-star hotel, the result must be pristine.",
  },
];

export function FounderSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  // Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 100, damping: 30 };
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [3, -3]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-3, 3]),
    springConfig
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
      setMousePosition({ x: e.clientX, y: e.clientY });
    },
    [mouseX, mouseY]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-100 py-24 sm:py-32 lg:py-40"
    >
      {/* Background */}

      <div
        ref={containerRef}
        className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12"
      >
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center gap-4"
          >
            <div className="h-px w-12 bg-neutral-300" />
            <Globe className="h-4 w-4 text-[#c9a962]" strokeWidth={1} />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-neutral-400">
              The Founder
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-SchnyderS text-4xl font-light tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl"
          >
            The Mind Behind
            <br />
            <span className="text-neutral-400">the Masterpiece</span>
          </motion.h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Image Column */}
          <motion.div
            className="lg:col-span-2"
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          >
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <motion.div
                style={{ y: imageY }}
                className="relative aspect-[3/4] overflow-hidden"
              >
                {/* Outer frame */}
                <div className="absolute -inset-4 border border-neutral-200" />

                <SafeImage
                  src="/founder/CID_2106_00_COVER.jpg"
                  alt="Eng. Maher Mouhajer - CEO & Founder"
                  fill
                  className="object-cover object-center"
                />

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/10 to-transparent" />

                {/* Name */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="font-Satoshi text-xs font-light uppercase tracking-[0.2em] text-white/60">
                    CEO & Founder
                  </div>
                  <div className="mt-1 font-SchnyderS text-2xl font-light text-white">
                    Eng. Maher Mouhajer
                  </div>
                </div>

                {/* Corner accents */}
                <div className="absolute left-0 top-0 h-20 w-20 border-l-2 border-t-2 border-[#c9a962]/50" />
                <div className="absolute bottom-0 right-0 h-20 w-20 border-b-2 border-r-2 border-[#c9a962]/50" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Content Column */}
          <motion.div className="lg:col-span-3" style={{ y: contentY }}>
            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-12"
            >
              <div className="mb-4 font-SchnyderS text-5xl font-light text-neutral-200">
                &ldquo;
              </div>
              <p className="font-SchnyderS text-2xl font-light leading-relaxed text-neutral-950 lg:text-3xl">
                We create spaces where the grandeur of history shakes hands with
                the clean lines of tomorrow.
              </p>
              <div className="mt-4 h-1 w-16 bg-[#c9a962]/50" />
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12 font-Satoshi text-sm font-light uppercase tracking-[0.2em] text-[#c9a962]"
            >
              Defined by Dualities: European precision meets Arabian warmth
            </motion.p>

            {/* Philosophies */}
            <div className="space-y-6">
              {philosophies.map((philosophy, index) => {
                const Icon = philosophy.icon;
                return (
                  <motion.div
                    key={philosophy.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.15 }}
                    className="group relative border border-neutral-200 bg-white p-6 transition-all duration-300 hover:border-[#c9a962]/30 hover:shadow-lg lg:p-8"
                  >
                    <div className="flex items-start gap-6">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center border border-[#c9a962]/30 bg-[#c9a962]/5 transition-all duration-300 group-hover:border-[#c9a962]/50 group-hover:bg-[#c9a962]/10">
                        <Icon
                          className="h-5 w-5 text-[#c9a962]"
                          strokeWidth={1}
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="mb-1 font-Satoshi text-xs font-light uppercase tracking-wider text-neutral-400">
                          {philosophy.subtitle}
                        </div>
                        <h3 className="mb-3 font-SchnyderS text-xl font-light text-neutral-950 transition-colors group-hover:text-[#c9a962] lg:text-2xl">
                          {philosophy.title}
                        </h3>
                        <p className="font-Satoshi text-sm font-light leading-relaxed text-neutral-600">
                          {philosophy.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
