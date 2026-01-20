"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ClientTestimonialProps {
  quote: string;
  author?: string;
  role?: string;
  locale: string;
}

export function ClientTestimonial({
  quote,
  author,
  role,
  locale,
}: ClientTestimonialProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isRTL = locale === "ar";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.95, 1, 1, 0.95]
  );

  // Split quote into words for reveal animation
  const words = quote.split(" ");

  return (
    <section
      ref={containerRef}
      className="relative py-24 md:py-32 bg-[#c9a962] overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Noise Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Diagonal Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 md:px-16"
        style={{ opacity, scale }}
      >
        {/* Large Opening Quote */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <span className="text-black/10 text-[120px] md:text-[180px] font-serif leading-none select-none">
            "
          </span>
        </motion.div>

        {/* Quote Text with Word-by-Word Reveal */}
        <blockquote className="text-center mb-12">
          <p className="text-2xl md:text-3xl lg:text-4xl text-black font-light leading-relaxed">
            {words.map((word, index) => (
              <motion.span
                key={index}
                className="inline-block mr-[0.3em]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.4,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                {word}
              </motion.span>
            ))}
          </p>
        </blockquote>

        {/* Author Attribution */}
        {(author || role) && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: words.length * 0.05 + 0.3, duration: 0.6 }}
          >
            <div className="inline-flex flex-col items-center">
              {/* Decorative Line */}
              <motion.div
                className="w-12 h-px bg-black/30 mb-6"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: words.length * 0.05 + 0.4, duration: 0.6 }}
              />

              {author && (
                <span className="text-black text-lg md:text-xl font-medium tracking-wide">
                  {author}
                </span>
              )}
              {role && (
                <span className="text-black/60 text-sm tracking-wider uppercase mt-1">
                  {role}
                </span>
              )}
            </div>
          </motion.div>
        )}

        {/* Closing Quote */}
        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
        >
          <span className="text-black/10 text-[120px] md:text-[180px] font-serif leading-none rotate-180 select-none">
            "
          </span>
        </motion.div>
      </motion.div>

      {/* Corner Accents */}
      <motion.div
        className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-black/10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      />
      <motion.div
        className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-black/10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      />
      <motion.div
        className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-black/10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      />
      <motion.div
        className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-black/10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      />
    </section>
  );
}
