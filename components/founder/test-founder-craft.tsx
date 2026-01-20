"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SafeImage } from "@/components/safe-image";

export function TestFounderCraft() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const leftImageY = useTransform(scrollYProgress, [0, 1], ["15%", "-15%"]);
  const rightImageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const centerScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.95, 1, 0.95]
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-32 sm:py-40 lg:py-48"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-neutral-50/30 to-white" />

      <div className="relative z-10 mx-auto max-w-[1800px] px-6 lg:px-12">
        {/* Intro Text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9 }}
          className="mb-24 text-center"
        >
          <div className="mb-6 inline-flex items-center gap-3 border border-neutral-200 bg-neutral-50 px-6 py-3">
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.4em] text-neutral-400">
              Chapter II
            </span>
          </div>

          <h2 className="mb-10 font-SchnyderS text-5xl font-light leading-[1.05] text-neutral-950 sm:text-6xl lg:text-7xl">
            The Art of
            <br />
            <span className="text-neutral-300">Precision</span>
          </h2>

          <p className="mx-auto max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-neutral-600">
            Behind every immaculate finish lies an obsession with craft. A
            dedication to details most will never notice, but everyone will
            feel.
          </p>
        </motion.div>

        {/* Three Column Image Layout */}
        <div className="mb-32 grid gap-8 lg:grid-cols-3 lg:gap-12">
          {/* Left Image - Vertical */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[600px] lg:h-[800px]"
          >
            <div className="relative h-full overflow-hidden bg-neutral-100">
              <motion.div style={{ y: leftImageY }} className="h-full">
                <SafeImage
                  src="/founder/CEO Arabia.jpg"
                  alt="Luxury interior details"
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent" />

              {/* Caption */}
              <div className="absolute bottom-8 left-8 right-8">
                <p className="font-Satoshi text-sm font-light text-white/90">
                  Every material is chosen not just for its beauty, but for how
                  it ages, how it feels, how it serves.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Center Image - Large */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[600px] lg:col-span-1 lg:h-[800px]"
          >
            <motion.div
              style={{ scale: centerScale }}
              className="relative h-full overflow-hidden bg-neutral-100"
            >
              <SafeImage
                src="/founder/CEO Arabia.jpg"
                alt="Eng. Maher reviewing blueprints"
                fill
                className="object-cover"
              />

              {/* Gold border accent */}
              <div className="absolute inset-0 border-[6px] border-[#c9a962]/0 transition-all duration-500 hover:border-[#c9a962]/30" />

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#c9a962]" />
            </motion.div>
          </motion.div>

          {/* Right Image - Vertical */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative h-[600px] lg:h-[800px]"
          >
            <div className="relative h-full overflow-hidden bg-neutral-100">
              <motion.div style={{ y: rightImageY }} className="h-full">
                <SafeImage
                  src="/founder/CEO Arabia.jpg"
                  alt="Craftsmanship and joinery"
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent" />

              {/* Caption */}
              <div className="absolute bottom-8 left-8 right-8">
                <p className="font-Satoshi text-sm font-light text-white/90">
                  From concept sketches to final installation, perfection is not
                  negotiable. It's the only standard.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quote Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border-t border-neutral-200 pt-20 text-center"
        >
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 h-px w-16 mx-auto bg-[#c9a962]" />

            <p className="mb-8 font-SchnyderS text-3xl font-light leading-relaxed text-neutral-950 lg:text-4xl xl:text-5xl">
              "I visit every site personally.
              <br />
              Not to supervise, but to understand.
              <br />
              To see what the blueprints cannot show."
            </p>

            <div className="font-Satoshi text-sm font-light text-neutral-400">
              — Eng. Maher Mouhajer
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
