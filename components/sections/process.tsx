"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { SafeImage } from "@/components/safe-image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const processSteps = [
  {
    id: "discovery",
    title: "Discovery",
    subtitle: "Understanding Your Vision",
    description:
      "We begin with an in-depth consultation to understand your aspirations, lifestyle needs, and aesthetic preferences. Every detail matters.",
    features: ["Site Analysis", "Client Brief", "Budget Planning"],
    image: "/placeholder.jpg",
    imageAlt: "Consultation meeting with architects",
  },
  {
    id: "concept",
    title: "Concept",
    subtitle: "Crafting the Blueprint",
    description:
      "Our design team creates initial concepts, mood boards, and 3D visualizations that bring your vision to life before construction begins.",
    features: ["3D Modeling", "Material Selection", "Design Approval"],
    image: "/placeholder.jpg",
    imageAlt: "Architectural blueprints and designs",
  },
  {
    id: "engineering",
    title: "Engineering",
    subtitle: "Technical Excellence",
    description:
      "Detailed engineering drawings, structural calculations, and MEP coordination ensure your project is built to perfection.",
    features: ["Structural Design", "MEP Planning", "Permit Acquisition"],
    image: "/placeholder.jpg",
    imageAlt: "Engineering and technical drawings",
  },
  {
    id: "construction",
    title: "Construction",
    subtitle: "Building Dreams",
    description:
      "Our in-house construction teams execute with precision. Grade-A materials, skilled craftsmen, and rigorous quality control.",
    features: ["Quality Assurance", "Progress Reports", "Safety Compliance"],
    image: "/placeholder.jpg",
    imageAlt: "Construction site with workers",
  },
  {
    id: "fitout",
    title: "Fit-Out",
    subtitle: "Interior Mastery",
    description:
      "From custom joinery to imported finishes, our fit-out specialists transform shells into stunning living and working spaces.",
    features: ["Custom Millwork", "Premium Finishes", "Lighting Design"],
    image: "/placeholder.jpg",
    imageAlt: "Luxury interior fit-out in progress",
  },
  {
    id: "handover",
    title: "Handover",
    subtitle: "Your Keys, Our Pride",
    description:
      "Final inspections, snag resolution, and a comprehensive handover. We stay connected for post-completion support.",
    features: ["Final Inspection", "Documentation", "Warranty Support"],
    image: "/placeholder.jpg",
    imageAlt: "Completed luxury property",
  },
];

// Redesigned Step Card Component
const StepCard = ({
  step,
  index,
  isActive,
  isCompleted,
  onClick,
}: {
  step: (typeof processSteps)[0];
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}) => (
  <motion.button
    onClick={onClick}
    className={`group relative flex flex-col items-center transition-all duration-500 ${
      isActive ? "scale-105" : "scale-100"
    }`}
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.98 }}
  >
    {/* Step Number Circle */}
    <div
      className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-500 ${
        isActive
          ? "border-[#c9a962] bg-[#c9a962] shadow-lg shadow-[#c9a962]/30"
          : isCompleted
            ? "border-[#c9a962] bg-[#c9a962]/20"
            : "border-neutral-200 bg-white group-hover:border-[#c9a962]/50"
      }`}
    >
      {isCompleted && !isActive ? (
        <CheckCircle2 className="h-5 w-5 text-[#c9a962]" strokeWidth={2} />
      ) : (
        <span
          className={`font-Satoshi text-sm font-medium transition-colors duration-300 ${
            isActive
              ? "text-neutral-950"
              : isCompleted
                ? "text-[#c9a962]"
                : "text-neutral-400 group-hover:text-[#c9a962]"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      )}

      {/* Active ring animation */}
      {isActive && (
        <motion.div
          className="absolute -inset-1 rounded-full border-2 border-[#c9a962]/40"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 1.3, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
        />
      )}
    </div>

    {/* Step Title */}
    <motion.span
      className={`mt-3 font-Satoshi text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
        isActive
          ? "text-[#c9a962]"
          : isCompleted
            ? "text-neutral-600"
            : "text-neutral-400 group-hover:text-neutral-600"
      }`}
      initial={false}
      animate={{
        y: isActive ? 0 : 2,
        opacity: isActive ? 1 : 0.7,
      }}
    >
      {step.title}
    </motion.span>

    {/* Active indicator bar */}
    <motion.div
      className="mt-2 h-0.5 w-8 bg-[#c9a962] origin-center"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: isActive ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    />
  </motion.button>
);

// Memoized Step Content to prevent flickering
const StepContent = ({
  step,
  isActive,
}: {
  step: (typeof processSteps)[0];
  isActive: boolean;
}) => (
  <AnimatePresence mode="wait">
    {isActive && (
      <motion.div
        key={step.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Subtitle Badge */}
        <div className="mb-4 inline-flex items-center gap-2 border border-[#c9a962]/30 bg-[#c9a962]/5 px-4 py-2">
          <span className="font-Satoshi text-xs font-light uppercase tracking-wider text-[#c9a962]">
            {step.subtitle}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-4 font-SchnyderS text-4xl font-light text-neutral-900 lg:text-5xl xl:text-6xl">
          {step.title}
        </h3>

        {/* Description */}
        <p className="mb-6 font-Satoshi text-base font-light leading-relaxed text-neutral-600 lg:text-lg">
          {step.description}
        </p>

        {/* Features */}
        <div className="mb-8 space-y-3">
          {step.features.map((feature, fIndex) => (
            <motion.div
              key={feature}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + fIndex * 0.1 }}
            >
              <CheckCircle2
                className="h-4 w-4 text-[#c9a962]"
                strokeWidth={1.5}
              />
              <span className="font-Satoshi text-sm font-light text-neutral-700">
                {feature}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Quick Nav hint */}
        <div className="flex items-center gap-4 border-t border-[#c9a962]/20 pt-6">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              {processSteps.slice(0, 3).map((_, i) => (
                <div
                  key={i}
                  className="h-2 w-2 rounded-full border border-white bg-[#c9a962]/40"
                />
              ))}
            </div>
            <span className="font-Satoshi text-xs font-light text-neutral-500">
              Click any phase above to explore
            </span>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeStep, setActiveStep] = useState(0);
  const lastStepRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Smooth progress for the timeline - with higher damping to reduce jitter
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001,
  });

  // Calculate active step based on scroll with debouncing via ref
  const progressValue = useTransform(
    smoothProgress,
    [0.1, 0.8],
    [0, processSteps.length - 1]
  );

  // Use transform to derive step without causing re-renders on every scroll tick
  const currentStepTransform = useTransform(progressValue, (value) => {
    const newStep = Math.max(
      0,
      Math.min(Math.round(value), processSteps.length - 1)
    );
    if (newStep !== lastStepRef.current) {
      lastStepRef.current = newStep;
      // Schedule state update to batch with other updates
      requestAnimationFrame(() => setActiveStep(newStep));
    }
    return newStep;
  });

  // Subscribe to the transform to ensure it runs
  currentStepTransform.get();

  // Memoize the progress line width
  const progressWidth = useTransform(
    smoothProgress,
    [0.1, 0.8],
    ["0%", "100%"]
  );

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative min-h-[300vh] overflow-hidden bg-[#faf8f5] scroll-mt-24"
    >
      {/* Background Elements - Simplified for performance */}
      <div className="absolute inset-0">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5] via-white to-[#faf8f5]" />

        {/* Static gradient orbs - no animation to prevent flickering */}
        <div className="absolute left-[20%] top-[10%] h-[500px] w-[500px] rounded-full bg-[#c9a962]/[0.03] blur-[150px]" />
        <div className="absolute right-[10%] top-[40%] h-[400px] w-[400px] rounded-full bg-[#c9a962]/[0.02] blur-[120px]" />
        <div className="absolute left-[40%] bottom-[20%] h-[600px] w-[600px] rounded-full bg-[#c9a962]/[0.02] blur-[180px]" />
      </div>

      {/* Sticky Container */}
      <div ref={containerRef} className="sticky top-0 h-screen overflow-hidden">
        <div className="relative z-10 flex h-full flex-col px-6 py-20 lg:px-12 lg:py-24">
          {/* Header */}
          <div className="mx-auto w-full max-w-[1800px]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="mb-8 flex flex-col items-start justify-between gap-6 lg:mb-12 lg:flex-row lg:items-end"
            >
              <div>
                <div className="mb-4 flex items-center gap-4">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a962]/50" />
                  <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-neutral-500">
                    Our Capabilities
                  </span>
                </div>
                <h2 className="font-SchnyderS text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
                  Complete Lifecycle
                  <br />
                  <span className="text-[#c9a962]">Control</span>
                </h2>
              </div>

              <p className="max-w-md font-Satoshi text-sm font-light text-neutral-600 lg:text-base lg:text-right">
                From concept to completion, every phase flows through our
                integrated system.
                <span className="text-neutral-800">
                  {" "}
                  Six stages, one seamless journey.
                </span>
              </p>
            </motion.div>

            {/* Redesigned Timeline Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8 lg:mb-12"
            >
              {/* Step Cards Container */}
              <div className="relative">
                {/* Connection Line */}
                <div className="absolute left-0 right-0 top-6 z-0 hidden h-0.5 bg-neutral-200 lg:block">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#c9a962] via-[#c9a962] to-[#c9a962]/40"
                    style={{ width: progressWidth }}
                  />
                </div>

                {/* Step Cards Grid */}
                <div className="grid grid-cols-3 gap-4 lg:grid-cols-6 lg:gap-0">
                  {processSteps.map((step, index) => (
                    <StepCard
                      key={step.id}
                      step={step}
                      index={index}
                      isActive={index === activeStep}
                      isCompleted={index < activeStep}
                      onClick={() => setActiveStep(index)}
                    />
                  ))}
                </div>
              </div>

              {/* Mobile Progress Indicator */}
              <div className="mt-6 flex items-center justify-center gap-2 lg:hidden">
                <span className="font-Satoshi text-xs text-neutral-500">
                  {activeStep + 1} / {processSteps.length}
                </span>
                <div className="flex gap-1.5">
                  {processSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveStep(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === activeStep
                          ? "w-6 bg-[#c9a962]"
                          : index < activeStep
                            ? "w-1.5 bg-[#c9a962]/50"
                            : "w-1.5 bg-neutral-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="mx-auto flex flex-1 w-full max-w-[1800px] items-center">
            <div className="grid w-full gap-8 lg:grid-cols-12 lg:gap-12">
              {/* Left Column - Image */}
              <motion.div
                className="relative lg:col-span-7"
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="relative aspect-[4/3] overflow-hidden lg:aspect-[16/10]">
                  {/* Single image with crossfade */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={processSteps[activeStep].id}
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <SafeImage
                        src={processSteps[activeStep].image}
                        alt={processSteps[activeStep].imageAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                      />

                      {/* Gradient overlays */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f5]/70 via-[#faf8f5]/30 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#faf8f5] via-transparent to-transparent" />
                    </motion.div>
                  </AnimatePresence>

                  {/* Corner accents */}
                  <div className="absolute left-0 top-0 h-20 w-20 border-l border-t border-[#c9a962]/20" />
                  <div className="absolute bottom-0 right-0 h-20 w-20 border-b border-r border-[#c9a962]/20" />
                </div>

                {/* Phase indicator below image */}
                <div className="mt-6 flex items-center justify-between border-t border-neutral-200/50 pt-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c9a962]/10"
                      key={activeStep}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="font-Satoshi text-xs font-semibold text-[#c9a962]">
                        {String(activeStep + 1).padStart(2, "0")}
                      </span>
                    </motion.div>
                    <div>
                      <p className="font-Satoshi text-xs font-light text-neutral-400">
                        Current Phase
                      </p>
                      <p className="font-SchnyderS text-lg font-light text-neutral-800">
                        {processSteps[activeStep].title}
                      </p>
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                      disabled={activeStep === 0}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
                        activeStep === 0
                          ? "border-neutral-200 text-neutral-300 cursor-not-allowed"
                          : "border-neutral-300 text-neutral-600 hover:border-[#c9a962] hover:text-[#c9a962]"
                      }`}
                    >
                      <ArrowRight
                        className="h-4 w-4 rotate-180"
                        strokeWidth={1.5}
                      />
                    </button>
                    <button
                      onClick={() =>
                        setActiveStep(
                          Math.min(processSteps.length - 1, activeStep + 1)
                        )
                      }
                      disabled={activeStep === processSteps.length - 1}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
                        activeStep === processSteps.length - 1
                          ? "border-neutral-200 text-neutral-300 cursor-not-allowed"
                          : "border-neutral-300 text-neutral-600 hover:border-[#c9a962] hover:text-[#c9a962]"
                      }`}
                    >
                      <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Right Column - Content */}
              <motion.div
                className="flex flex-col justify-center lg:col-span-5"
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="relative h-max">
                  <StepContent
                    step={processSteps[activeStep]}
                    isActive={true}
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            className="mx-auto mt-8 w-full max-w-[1800px]"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center justify-between border-t border-[#c9a962]/20 pt-6">
              <span className="font-Satoshi text-sm font-light text-neutral-500">
                Ready to begin your journey?
              </span>
              <Link
                href="/contact"
                className="group flex items-center gap-3 font-Satoshi text-sm font-light tracking-wide text-neutral-600 transition-colors hover:text-[#c9a962]"
              >
                Start Your Project
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={1}
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Corner decorations - static, no animation */}
      <div className="pointer-events-none absolute left-8 top-24 hidden h-32 w-32 border-l border-t border-neutral-200/50 lg:block" />
      <div className="pointer-events-none absolute bottom-24 right-8 hidden h-32 w-32 border-b border-r border-neutral-200/50 lg:block" />
    </section>
  );
}
