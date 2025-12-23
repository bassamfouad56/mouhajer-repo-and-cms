"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Award, Users, Globe, Target } from "lucide-react";

interface AboutProps {
  mainImage?: string;
}

export function About({ mainImage }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const stats = [
    { icon: Award, value: "15+", label: "Years of Excellence" },
    { icon: Users, value: "200+", label: "Happy Clients" },
    { icon: Globe, value: "50+", label: "Awards Won" },
    { icon: Target, value: "300+", label: "Projects Delivered" },
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-neutral-50 px-6 py-32 lg:px-12 lg:py-48"
    >
      {/* Decorative Background Elements */}
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-purple-100/30 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-blue-100/30 blur-3xl" />
      <div className="mx-auto max-w-[1800px]">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left Column - Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="mb-6 flex items-center gap-4"
            >
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-neutral-400" />
              <span className="text-sm font-light tracking-[0.3em] text-neutral-500">
                ABOUT US
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-neutral-400" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-8 text-5xl font-light tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl"
            >
              Redefining Luxury
              <br />
              Interior Design
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <p className="text-lg font-light leading-relaxed text-neutral-600">
                Mouhajer International Design is a Dubai-based interior design
                studio specializing in creating timeless, elegant spaces that
                reflect the unique personality and lifestyle of our clients.
              </p>

              <p className="text-lg font-light leading-relaxed text-neutral-600">
                With over 15 years of experience in luxury residential and
                commercial design, we combine innovative thinking with
                impeccable craftsmanship to deliver spaces that inspire and
                endure.
              </p>

              <p className="text-lg font-light leading-relaxed text-neutral-600">
                Our approach is rooted in understanding our clients&apos;
                vision, translating it into sophisticated design solutions that
                seamlessly blend form, function, and artistic expression.
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-10"
            >
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 border-b border-neutral-950 pb-1 text-sm font-light tracking-widest text-neutral-950 transition-all hover:gap-4 focus-visible:gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
              >
                START YOUR PROJECT
                <span className="transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1">
                  →
                </span>
              </a>
            </motion.div>
          </div>

          {/* Right Column - Image */}
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-200">
              <motion.div style={{ y: imageY }} className="h-full w-full">
                {mainImage && (
                  <Image
                    src={mainImage}
                    alt="Luxury Interior Design"
                    fill
                    className="object-cover"
                  />
                )}
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-8 -right-8 -z-10 h-64 w-64">
              <div className="h-full w-full bg-gradient-to-br from-neutral-100 to-neutral-200/50 opacity-50" />
            </div>
            <div className="absolute -bottom-12 -right-12 -z-10 h-48 w-48 rounded-full bg-purple-100/20 blur-3xl" />
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-32"
        >
          <div className="mb-16 h-px w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
          <div className="grid grid-cols-2 gap-12 lg:grid-cols-4 lg:gap-16">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="group relative text-center"
              >
                {/* Background Circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-32 w-32 rounded-full bg-neutral-100/50 transition-all duration-500 group-hover:scale-110 group-hover:bg-neutral-200/50" />
                </div>

                {/* Icon */}
                <div className="relative mb-6 flex justify-center pt-6 text-neutral-400 transition-colors duration-500 group-hover:text-neutral-950">
                  <stat.icon size={40} strokeWidth={1} />
                </div>

                {/* Value */}
                <div className="relative mb-3 text-5xl font-light text-neutral-950 transition-all duration-500 group-hover:scale-110 lg:text-6xl">
                  {stat.value}
                </div>

                {/* Label */}
                <div className="relative text-sm font-light tracking-wider text-neutral-600">
                  {stat.label}
                </div>

                {/* Decorative Line */}
                <div className="absolute -bottom-4 left-1/2 h-px w-0 -translate-x-1/2 bg-neutral-950 transition-all duration-500 group-hover:w-16" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-32 rounded-sm bg-neutral-950 p-12 lg:p-16"
        >
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-neutral-700" />
              <span className="text-xs font-light tracking-[0.3em] text-neutral-500">
                OUR PHILOSOPHY
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-neutral-700" />
            </div>
            <blockquote className="text-center text-2xl font-light italic leading-relaxed text-neutral-200 lg:text-3xl lg:leading-relaxed">
              &ldquo;We believe that great design is not about following trends,
              but about creating timeless spaces that tell a story and enhance
              the human experience.&rdquo;
            </blockquote>
            <div className="mt-8 text-center text-sm font-light tracking-wider text-neutral-500">
              MOUHAJER DESIGN PHILOSOPHY
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
