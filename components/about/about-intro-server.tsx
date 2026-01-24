"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProjectImage {
  url: string;
  alt: string;
}

interface AboutIntroServerProps {
  projectImages: ProjectImage[];
}

// Fallback images if no Sanity images available
const fallbackImages = [
  {
    url: "/founder/CID_2106_00_COVER.jpg",
    alt: "Commercial Interior Design Magazine Cover",
  },
  { url: "/founder/CEO%20Arabia.jpg", alt: "CEO Arabia - Founder Feature" },
  { url: "/founder/1765530910_27.jpg", alt: "MIDC Project" },
];

// Split text into words for reveal effect
function SplitRevealText({
  text,
  className = "",
  highlightWords = [],
}: {
  text: string;
  className?: string;
  highlightWords?: string[];
}) {
  const containerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const words = containerRef.current.querySelectorAll(".word");

    gsap.fromTo(
      words,
      {
        opacity: 0.15,
        y: 0,
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.02,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 40%",
          scrub: 1,
        },
      },
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const words = text.split(" ");

  return (
    <p ref={containerRef} className={className}>
      {words.map((word, i) => {
        const isHighlight = highlightWords.some((hw) =>
          word.toLowerCase().includes(hw.toLowerCase()),
        );
        return (
          <span
            key={i}
            className={`word inline-block mr-[0.25em] ${isHighlight ? "font-medium text-white" : ""}`}
          >
            {word}
          </span>
        );
      })}
    </p>
  );
}

// Stroke text that fills on scroll
function StrokeFillText({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 30%"],
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );

  return (
    <div ref={containerRef} className="relative">
      {/* Stroke text (outline only) */}
      <span
        className="font-SchnyderS text-4xl font-light leading-[1.3] tracking-tight sm:text-5xl lg:text-6xl"
        style={{
          WebkitTextStroke: "1px rgba(201, 169, 98, 0.4)",
          WebkitTextFillColor: "transparent",
        }}
      >
        {text}
      </span>

      {/* Fill text (clips in on scroll) */}
      <motion.span
        ref={fillRef}
        className="absolute inset-0 font-SchnyderS text-4xl font-light leading-[1.3] tracking-tight text-white sm:text-5xl lg:text-6xl"
        style={{ clipPath }}
      >
        {text}
      </motion.span>
    </div>
  );
}

export function AboutIntroServer({ projectImages }: AboutIntroServerProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const image1Y = useTransform(scrollYProgress, [0, 1], ["15%", "-15%"]);
  const image2Y = useTransform(scrollYProgress, [0, 1], ["-10%", "20%"]);
  const image3Y = useTransform(scrollYProgress, [0, 1], ["20%", "-10%"]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  // Use fetched images or fallbacks
  const images = projectImages.length >= 3 ? projectImages : fallbackImages;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950"
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ y: bgY }}
          className="absolute -left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-[#8f7852]/[0.02] blur-[150px]"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["10%", "-20%"]) }}
          className="absolute -right-1/4 bottom-1/4 h-[800px] w-[800px] rounded-full bg-white/[0.01] blur-[200px]"
        />
      </div>

      {/* Full-width cinematic image strip */}
      <div className="relative h-[70vh] min-h-[550px] overflow-hidden lg:h-[80vh]">
        <div className="absolute inset-0 grid grid-cols-3 gap-[2px]">
          {/* Image 1 */}
          <motion.div
            style={{ y: image1Y }}
            className="relative h-[130%] -mt-[15%]"
          >
            <Image
              src={images[0]?.url || ""}
              alt={images[0]?.alt || "MIDC Luxury Project"}
              fill
              className="object-cover transition-transform duration-[2s] hover:scale-105"
              sizes="33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/50 via-neutral-950/20 to-neutral-950/60" />

            {/* Floating label */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute bottom-8 left-6 z-10"
            >
              <span className="font-Satoshi text-[10px] font-light uppercase tracking-[0.3em] text-white/50">
                Hospitality
              </span>
            </motion.div>
          </motion.div>

          {/* Image 2 */}
          <motion.div
            style={{ y: image2Y }}
            className="relative h-[130%] -mt-[15%]"
          >
            <Image
              src={images[1]?.url || ""}
              alt={images[1]?.alt || "MIDC Luxury Project"}
              fill
              className="object-cover transition-transform duration-[2s] hover:scale-105"
              sizes="33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/50 via-neutral-950/20 to-neutral-950/60" />

            {/* Floating label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="absolute bottom-8 left-6 z-10"
            >
              <span className="font-Satoshi text-[10px] font-light uppercase tracking-[0.3em] text-white/50">
                Residential
              </span>
            </motion.div>
          </motion.div>

          {/* Image 3 */}
          <motion.div
            style={{ y: image3Y }}
            className="relative h-[130%] -mt-[15%]"
          >
            <Image
              src={images[2]?.url || ""}
              alt={images[2]?.alt || "MIDC Luxury Project"}
              fill
              className="object-cover transition-transform duration-[2s] hover:scale-105"
              sizes="33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/50 via-neutral-950/20 to-neutral-950/60" />

            {/* Floating label */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="absolute bottom-8 left-6 z-10"
            >
              <span className="font-Satoshi text-[10px] font-light uppercase tracking-[0.3em] text-white/50">
                Commercial
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/80" />
      </div>

      {/* Content Section with scroll text reveal */}
      <div className="relative z-10 mx-auto container px-6 py-28 lg:px-12 lg:py-40">
        {/* First paragraph with word-by-word reveal */}
        <SplitRevealText
          text="In a market often fragmented by disconnected service providers, MIDC stands apart as a unified force. We bridge the critical gap between architectural design and technical execution. Our philosophy is simple: a design is only as good as its buildability. By integrating luxury interior fit-out, structural construction, and complex MEP engineering services under one roof, we eliminate the friction that typically plagues high-stakes projects."
          className="font-Satoshi text-xl font-light leading-[1.9] text-white/60 lg:text-2xl"
          highlightWords={["buildability", "unified", "luxury"]}
        />

        {/* Visual divider with animation */}
        <div className="my-20 flex items-center gap-6 lg:my-28">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="h-px flex-1 origin-left bg-gradient-to-r from-[#8f7852]/60 to-transparent"
          />
          <motion.div
            initial={{ scale: 0, rotate: 45 }}
            whileInView={{ scale: 1, rotate: 45 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-2 w-2 bg-[#8f7852]/40"
          />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="h-px flex-1 origin-right bg-gradient-to-l from-[#8f7852]/60 to-transparent"
          />
        </div>

        {/* Second paragraph with word-by-word reveal */}
        <SplitRevealText
          text="Our portfolio speaks to the diversity of our expertise. Whether we are executing a complex hospitality renovation for a 5-star landmark like the Sheraton Abu Dhabi or managing the ground-up construction of a high-end residential villa in District One, our approach remains the same. We combine aesthetic mastery with rigorous project management excellence. From the initial concept 3D renderings to the final installation of bespoke joinery and FF&E (Furniture, Fixtures, and Equipment), we control every variable to ensure your project is delivered on time, on budget, and to an award-winning standard."
          className="font-Satoshi text-xl font-light leading-[1.9] text-white/60 lg:text-2xl"
          highlightWords={["Sheraton", "District One", "award-winning"]}
        />

        {/* Quote section with stroke-fill effect */}
        <div className="mt-28 text-center lg:mt-40">
          <div className="mx-auto max-w-4xl">
            {/* Opening quote mark */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-8 font-SchnyderS text-6xl font-light text-[#8f7852]/20"
            >
              &ldquo;
            </motion.div>

            {/* Stroke-to-fill quote */}
            <StrokeFillText text="We are not just contractors; we are partners in your legacy." />

            {/* Sub-quote */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="mt-10 font-Satoshi text-lg font-light text-white/40 lg:text-xl"
            >
              When you choose MIDC, you are choosing a design and build firm
              that values transparency, safety, and the relentless pursuit of
              perfection.
            </motion.p>

            {/* Closing accent */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="mx-auto mt-12 h-0.5 w-24 origin-center bg-gradient-to-r from-transparent via-[#8f7852]/50 to-transparent"
            />
          </div>
        </div>
      </div>

      {/* Bottom transition gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent" />
    </section>
  );
}
