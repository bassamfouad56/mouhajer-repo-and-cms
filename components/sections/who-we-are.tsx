"use client";

import { useRef, useState } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SafeImage } from "@/components/safe-image";

const cards = [
  {
    id: 1,
    title: "The Main Contractor",
    image:
      "",
    size: "large",
  },
  {
    id: 2,
    title: "The Designer",
    image:
      "",
    size: "medium",
  },
  {
    id: 3,
    title: "The Manufacturer",
    image:
      "",
    size: "medium",
  },
];


// 3D Tilt Card Component
function LegoCard({
  card,
  index,
  isInView,
}: {
  card: (typeof cards)[0];
  index: number;
  isInView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, rotateX: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: 0.3 + index * 0.15,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className={`group relative h-full w-full cursor-pointer overflow-hidden bg-neutral-900 ${
        card.size === "large"
          ? "col-span-1 row-span-2"
          : "col-span-1 row-span-1"
      }`}
    >
      {/* Image */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <SafeImage
          src={card.image}
          alt={card.title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 50vw, 33vw"
        />
      </motion.div>

      {/* Gradient Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"
        animate={{ opacity: isHovered ? 0.9 : 0.7 }}
        transition={{ duration: 0.3 }}
      />

      {/* 3D Floating Title */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6"
        style={{ transform: "translateZ(40px)" }}
      >
        <motion.h3
          className="font-SchnyderS text-xl font-light text-white sm:text-2xl lg:text-3xl"
          animate={{ y: isHovered ? -8 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {card.title}
        </motion.h3>

        {/* Animated underline */}
        <motion.div
          className="mt-2 h-px bg-white/60"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ originX: 0 }}
        />
      </motion.div>

      {/* Corner Accent - Lego-style notch */}
      <div
        className="absolute right-0 top-0 h-8 w-8 bg-white/10 sm:h-10 sm:w-10"
        style={{ clipPath: "polygon(100% 0, 100% 100%, 0 0)" }}
      />

      {/* Bottom Lego connector visual */}
      <div className="absolute bottom-0 left-1/2 h-2 w-8 -translate-x-1/2 translate-y-1 rounded-full bg-white/20 blur-sm" />
    </motion.div>
  );
}

export function WhoWeAre() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const gridY = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.6, 1, 1, 0.6]
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-12 lg:py-24"
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] sm:bg-[size:60px_60px]" />
      </div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto w-full max-w-7xl"
      >
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* Left Column - Content */}
          <motion.div style={{ y: contentY }}>
            {/* Section Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-4 flex items-center gap-3 sm:mb-6 sm:gap-4"
            >
              <div className="h-px w-8 bg-neutral-300 sm:w-12" />
              <span className="font-Satoshi text-[10px] font-light uppercase tracking-[0.2em] text-neutral-400 sm:text-xs sm:tracking-[0.3em]">
                Who We Are
              </span>
            </motion.div>

            {/* Main Headline */}

            {/* Sub-Headline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 font-SchnyderS text-2xl font-light italic text-neutral-700 sm:mb-8 sm:text-3xl lg:text-4xl"
            >
              We are all three.
            </motion.p>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8 space-y-4 sm:mb-10"
            >
              <p className="font-Satoshi text-sm font-light leading-relaxed text-neutral-600 sm:text-base lg:text-lg">
                Mouhajer International Design & Contracting (MIDC) is more than
                a construction firm; we are the architects of experience. As a
                premier turnkey solution provider based in Dubai and Abu Dhabi,
                we specialize in transforming ambitious concepts into
                award-winning realities.
              </p>
              <p className="font-Satoshi text-sm font-light leading-relaxed text-neutral-500 sm:text-base">
                From the intricate luxury of 5-star hospitality to the
                personalized grandeur of private residences, our reputation is
                built on a seamless fusion of aesthetic mastery and engineering
                rigor. We do not just build spaces; we curate environments that
                stand the test of time.
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 border border-neutral-950 bg-neutral-950 px-6 py-3 font-Satoshi text-[10px] font-light uppercase tracking-[0.15em] text-white transition-all duration-500 hover:bg-transparent hover:text-neutral-950 sm:gap-3 sm:px-8 sm:py-4 sm:text-xs"
              >
                Explore the MIDC Legacy
                <ArrowRight
                  className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1 sm:h-4 sm:w-4"
                  strokeWidth={1}
                />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column - Lego-style Image Grid */}
          <motion.div style={{ y: gridY }} className="relative">
            {/* Grid Container with 3D perspective */}
            <div
              className="grid grid-cols-2 gap-3 sm:gap-4"
              style={{
                perspective: "1200px",
                perspectiveOrigin: "center center",
              }}
            >
              {/* Large Card - Left side, spans 2 rows */}
              <div className="row-span-2 aspect-[3/4]">
                <LegoCard card={cards[0]} index={0} isInView={isInView} />
              </div>

              {/* Medium Card - Top Right */}
              <div className="aspect-square">
                <LegoCard card={cards[1]} index={1} isInView={isInView} />
              </div>

              {/* Medium Card - Bottom Right */}
              <div className="aspect-square">
                <LegoCard card={cards[2]} index={2} isInView={isInView} />
              </div>
            </div>

            {/* "We Are All Three" Visual Connector */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.7,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="mt-6 sm:mt-8"
            >
              <div className="relative border-l-2 border-neutral-950 py-3 pl-4 sm:py-4 sm:pl-6">
                <motion.p
                  className="font-SchnyderS text-lg font-light text-neutral-600 sm:text-xl lg:text-2xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  Three pillars, one vision
                </motion.p>
                <motion.p
                  className="font-Satoshi text-xs font-light text-neutral-400 sm:text-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  Complete lifecycle control under one roof
                </motion.p>

                {/* Decorative dots - Lego-style connectors */}
                <div className="absolute -left-1 top-1/2 flex -translate-y-1/2 flex-col gap-2">
                  <motion.div
                    className="h-2 w-2 rounded-full bg-neutral-950"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 1.1 }}
                  />
                  <motion.div
                    className="h-2 w-2 rounded-full bg-neutral-400"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 1.2 }}
                  />
                  <motion.div
                    className="h-2 w-2 rounded-full bg-neutral-200"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 1.3 }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
