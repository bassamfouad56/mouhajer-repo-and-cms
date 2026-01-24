"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface ProcessStep {
  title: string;
  description: string;
  image?: string;
  duration?: string;
}

interface ProcessTimelineProps {
  steps: ProcessStep[];
  title?: string;
  subtitle?: string;
  locale: string;
}

export function ProcessTimeline({
  steps,
  title,
  subtitle,
  locale,
}: ProcessTimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useInView(titleRef, { once: true, margin: "-100px" });
  const isRTL = locale === "ar";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  // Calculate horizontal scroll based on steps
  const totalSteps = steps.length;
  const x = useTransform(
    smoothProgress,
    [0.1, 0.9],
    isRTL
      ? [`-${(totalSteps - 1) * 100}vw`, "0vw"]
      : ["0vw", `-${(totalSteps - 1) * 100}vw`],
  );

  const labels = {
    en: {
      title: "The Process",
      subtitle: "From concept to completion",
      step: "Phase",
    },
    ar: {
      title: "العملية",
      subtitle: "من المفهوم إلى الإنجاز",
      step: "المرحلة",
    },
  };

  const t = labels[locale as keyof typeof labels] || labels.en;

  if (steps.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative bg-white"
      style={{ height: `${(totalSteps + 1) * 100}vh` }}
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49.5%,rgba(201,169,98,0.03)_50%,transparent_50.5%)] bg-[length:100px_100%]" />

        {/* Header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="absolute top-16 left-8 lg:left-16 z-20"
        >
          <div className="flex items-center gap-4 mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={isTitleInView ? { width: 48 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="h-px bg-[#8f7852]"
            />
            <span className="text-[#8f7852] text-xs tracking-[0.3em] uppercase font-light">
              {title || t.title}
            </span>
          </div>
          <p className="text-neutral-500 text-sm font-light">
            {subtitle || t.subtitle}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="absolute top-16 right-8 lg:right-16 z-20">
          <div className="flex items-center gap-4">
            <span className="text-neutral-400 text-xs tracking-wider">
              {t.step}
            </span>
            <div className="w-24 h-1 bg-neutral-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#8f7852] rounded-full origin-left"
                style={{ scaleX: smoothProgress }}
              />
            </div>
            <span className="text-neutral-600 text-xs font-medium min-w-[3ch]">
              {totalSteps}
            </span>
          </div>
        </div>

        {/* Horizontal Timeline */}
        <motion.div
          style={{ x }}
          className="absolute top-1/2 -translate-y-1/2 flex"
        >
          {steps.map((step, index) => (
            <TimelineStep
              key={index}
              step={step}
              index={index}
              total={totalSteps}
              locale={locale}
              progress={smoothProgress}
            />
          ))}
        </motion.div>

        {/* Timeline Line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-neutral-200" />
        <motion.div
          className="absolute top-1/2 left-0 h-px bg-[#8f7852] origin-left"
          style={{
            scaleX: smoothProgress,
            width: "100%",
          }}
        />

        {/* Navigation Arrows */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-8">
          <motion.div
            animate={{ x: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-2 text-neutral-400"
          >
            <span className="text-xs tracking-wider">SCROLL</span>
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TimelineStep({
  step,
  index,
  total,
  locale,
  progress,
}: {
  step: ProcessStep;
  index: number;
  total: number;
  locale: string;
  progress: any;
}) {
  const stepRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(stepRef, { once: true, margin: "-20%" });

  // Calculate when this step should be "active"
  const stepProgress = useTransform(
    progress,
    [(index - 0.5) / total, (index + 0.5) / total],
    [0, 1],
  );

  const scale = useTransform(stepProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const opacity = useTransform(
    stepProgress,
    [0, 0.3, 0.7, 1],
    [0.5, 1, 1, 0.5],
  );

  return (
    <motion.div
      ref={stepRef}
      style={{ scale, opacity }}
      className="relative w-screen h-screen flex items-center justify-center px-8 lg:px-24"
    >
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={index % 2 === 0 ? "order-1" : "order-1 lg:order-2"}
        >
          {/* Step Number */}
          <div className="flex items-center gap-6 mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
              className="relative"
            >
              <div className="w-16 h-16 rounded-full border-2 border-[#8f7852] flex items-center justify-center">
                <span className="text-[#8f7852] font-SchnyderS text-2xl">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-[#8f7852] rounded-full flex items-center justify-center"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
              </motion.div>
            </motion.div>

            {step.duration && (
              <span className="text-neutral-400 text-sm tracking-wider">
                {step.duration}
              </span>
            )}
          </div>

          {/* Title */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-SchnyderS text-4xl lg:text-5xl font-light text-neutral-950 mb-6"
          >
            {step.title}
          </motion.h3>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-neutral-600 text-lg font-light leading-relaxed"
          >
            {step.description}
          </motion.p>

          {/* Progress Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 h-px w-24 bg-[#8f7852] origin-left"
          />
        </motion.div>

        {/* Image */}
        {step.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`relative aspect-[4/3] overflow-hidden rounded-2xl ${
              index % 2 === 0 ? "order-2" : "order-2 lg:order-1"
            }`}
          >
            <Image
              src={step.image}
              alt={step.title}
              fill
              className="object-cover"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/30 to-transparent" />

            {/* Frame Corners */}
            <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-white/30" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-[#8f7852]/50" />
          </motion.div>
        )}
      </div>

      {/* Step Connector */}
      {index < total - 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-2"
        >
          <div className="w-8 h-px bg-neutral-300" />
          <ArrowRight className="w-4 h-4 text-neutral-400" />
        </motion.div>
      )}
    </motion.div>
  );
}
