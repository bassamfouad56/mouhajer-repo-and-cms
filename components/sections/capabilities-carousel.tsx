"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { SafeImage } from "@/components/safe-image";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { getProjectPlaceholder } from "@/lib/image-utils";
import { useTranslations } from "next-intl";

export function CapabilitiesCarousel() {
  const t = useTranslations("Capabilities");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [displayedIndex, setDisplayedIndex] = useState<number | null>(null);
  // Mobile: expanded card index for tap-to-expand
  const [mobileExpandedIndex, setMobileExpandedIndex] = useState<number | null>(0);
  const listRef = useRef<HTMLDivElement>(null);

  // Combined active index for both hover and focus
  const activeIndex = focusedIndex ?? hoveredIndex;

  // Mobile tap handler
  const handleMobileTap = (index: number) => {
    setMobileExpandedIndex(mobileExpandedIndex === index ? null : index);
  };

  // Debounce the displayed index to prevent rapid flickering
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayedIndex(activeIndex);
    }, 50); // Small delay to debounce rapid hover changes
    return () => clearTimeout(timer);
  }, [activeIndex]);

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number, totalItems: number) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex(Math.min(index + 1, totalItems - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex(Math.max(index - 1, 0));
          break;
        case "Home":
          e.preventDefault();
          setFocusedIndex(0);
          break;
        case "End":
          e.preventDefault();
          setFocusedIndex(totalItems - 1);
          break;
      }
    },
    []
  );

  // Focus the appropriate link when focusedIndex changes
  useEffect(() => {
    if (focusedIndex !== null && listRef.current) {
      const links = listRef.current.querySelectorAll<HTMLAnchorElement>(
        "[data-capability-link]"
      );
      links[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  // Fallback images from website 2.0 content/homepage folder - matching titles exactly
  // URLs must have spaces encoded as %20
  const fallbackImages = {
    build:
      "/website%202.0%20content/homepage/The%20Main%20Contractor/_MID9168.jpg",
    design:
      "/website%202.0%20content/homepage/The%20Design%20Studio/_MID7172-HDR.jpg",
    power:
      "/website%202.0%20content/homepage/In-House%20MEP%20Division/_MID5317.jpg",
    make: "/website%202.0%20content/services/inside%20manufacturing%20and%20joinery/The%20Mouhajer%20factory/real-people-real-work-real-rewards-view-of-the-2025-03-26-02-17-24-utc.jpg", // homepage folder is empty, using services folder
    install:
      "/website%202.0%20content/homepage/The%20Craftsmen/carpenter-examining-wooden-board-2025-01-29-08-16-13-utc.jpg",
    care: "/website%202.0%20content/homepage/The%20Keys/real-estate-agents-explain-models-of-housing-estat-2025-01-16-23-03-08-utc.jpg",
  };

  const capabilities = [
    {
      id: 1,
      stage: "01",
      badge: t("items.build.badge"),
      title: t("items.build.title"),
      hoverTitle: "Civil Construction (We Build)",
      shortTitle: t("items.build.shortTitle"),
      description: t("items.build.description"),
      buttonLabel: "Construction Services",
      link: "/services/civil-construction",
      image: fallbackImages.build, // The Main Contractor
    },
    {
      id: 2,
      stage: "02",
      badge: t("items.design.badge"),
      title: t("items.design.title"),
      hoverTitle: "Interior Architecture (We Design)",
      shortTitle: t("items.design.shortTitle"),
      description: t("items.design.description"),
      buttonLabel: "Design Services",
      link: "/services/interior-architecture",
      image: fallbackImages.design, // The Design Studio
    },
    {
      id: 3,
      stage: "03",
      badge: t("items.power.badge"),
      title: t("items.power.title"),
      hoverTitle: "MEP Engineering (We Power)",
      shortTitle: t("items.power.shortTitle"),
      description: t("items.power.description"),
      buttonLabel: "MEP Solutions",
      link: "/services/mep-engineering",
      image: fallbackImages.power, // In-House MEP Division
    },
    {
      id: 4,
      stage: "04",
      badge: t("items.make.badge"),
      title: t("items.make.title"),
      hoverTitle: "Manufacturing (We Make)",
      shortTitle: t("items.make.shortTitle"),
      description: t("items.make.description"),
      buttonLabel: "Custom Furniture Service",
      link: "/services/manufacturing-joinery",
      image: fallbackImages.make, // The Mouhajer Factory
    },
    {
      id: 5,
      stage: "05",
      badge: t("items.install.badge"),
      title: t("items.install.title"),
      hoverTitle: "Fit-Out Execution (We Install)",
      shortTitle: t("items.install.shortTitle"),
      description: t("items.install.description"),
      buttonLabel: "Fit-Out Services",
      link: "/services/fit-out-execution",
      image: fallbackImages.install, // The Craftsmen
    },
    {
      id: 6,
      stage: "06",
      badge: t("items.care.badge"),
      title: t("items.care.title"),
      hoverTitle: "Handover & Maintenance (We Care)",
      shortTitle: t("items.care.shortTitle"),
      description: t("items.care.description"),
      buttonLabel: "Post-Handover Care",
      link: "/services/handover-maintenance",
      image: fallbackImages.care, // The Keys
    },
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const backgroundScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.1, 1, 1.1]
  );

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="relative min-h-screen overflow-hidden bg-[#0a0a0a]"
    >
      {/* Full-screen background images - Desktop only */}
      <div className="absolute inset-0 hidden lg:block">
        {/* All background images preloaded with CSS opacity transitions */}
        {capabilities.map((capability, index) => (
          <div
            key={capability.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              displayedIndex === index ? "opacity-100" : "opacity-0"
            }`}
            style={{ willChange: "opacity" }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ y: backgroundY, scale: backgroundScale }}
            >
              <SafeImage
                src={capability.image}
                alt={capability.title}
                fallbackSrc={getProjectPlaceholder(
                  capability.title,
                  "commercial"
                )}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </motion.div>
            {/* Gradient overlays for readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/40 to-[#0a0a0a]/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/10" />
            {/* Gold tint overlay */}
            <div className="absolute inset-0 bg-[#c9a962]/5 mix-blend-overlay" />
          </div>
        ))}

        {/* Default state - subtle gradient (CSS transition) */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
            displayedIndex === null ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,169,98,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(201,169,98,0.05),transparent_50%)]" />
        </div>
      </div>

      {/* ==================== MOBILE DESIGN ==================== */}
      <div className="lg:hidden relative z-10 px-5 py-16">
        {/* Mobile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-10 text-center"
        >
          <span className="inline-flex items-center justify-center gap-3 font-Satoshi text-[10px] font-semibold uppercase tracking-[0.4em] text-[#c9a962] mb-4">
            <span className="h-px w-8 bg-[#c9a962]" />
            {t("heading")}
            <span className="h-px w-8 bg-[#c9a962]" />
          </span>
          <h2 className="font-SchnyderS text-4xl font-light tracking-tight text-white leading-[1.1]">
            {t("titleLine1")}
            <br />
            <span className="text-[#c9a962]">{t("titleLine2")}</span>
          </h2>
        </motion.div>

        {/* Mobile Cards - Vertical Stack with Tap-to-Expand */}
        <div className="space-y-3">
          {capabilities.map((capability, index) => {
            const isExpanded = mobileExpandedIndex === index;
            return (
              <motion.div
                key={capability.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/10"
              >
                {/* Card Header - Always visible, tap to expand */}
                <button
                  onClick={() => handleMobileTap(index)}
                  className="w-full flex items-center justify-between p-4 text-left"
                  aria-expanded={isExpanded}
                  aria-controls={`capability-content-${index}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Step number */}
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        isExpanded
                          ? "border-[#c9a962] bg-[#c9a962]"
                          : "border-white/20 bg-transparent"
                      }`}
                    >
                      <span
                        className={`font-Satoshi text-xs font-semibold transition-colors ${
                          isExpanded ? "text-[#0a0a0a]" : "text-white/50"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    {/* Title */}
                    <div>
                      <h3
                        className={`font-SchnyderS text-xl font-light transition-colors duration-300 ${
                          isExpanded ? "text-[#c9a962]" : "text-white"
                        }`}
                      >
                        {capability.title}
                      </h3>
                      <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
                        {capability.badge}
                      </span>
                    </div>
                  </div>
                  {/* Chevron */}
                  <ChevronDown
                    className={`h-5 w-5 text-[#c9a962] transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Expandable Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      id={`capability-content-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      {/* Image */}
                      <div className="relative aspect-[4/3] mx-4 mb-4 rounded-xl overflow-hidden">
                        <SafeImage
                          src={capability.image}
                          alt={capability.title}
                          fallbackSrc={getProjectPlaceholder(capability.title, "commercial")}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw"
                        />
                        {/* Subtle overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent" />
                      </div>

                      {/* Description */}
                      <div className="px-4 pb-4">
                        <p className="font-Satoshi text-sm font-light leading-relaxed text-white/70 mb-4">
                          {capability.description}
                        </p>

                        {/* CTA Button */}
                        <Link
                          href={capability.link}
                          className="inline-flex items-center gap-2 rounded-full bg-[#c9a962] px-5 py-3 font-Satoshi text-[11px] font-medium uppercase tracking-wider text-[#0a0a0a] transition-all duration-300 active:scale-95"
                        >
                          {capability.buttonLabel}
                          <ArrowRight className="h-4 w-4" strokeWidth={2} />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Progress Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex justify-center items-center gap-2 mt-8"
        >
          {capabilities.map((_, index) => (
            <button
              key={index}
              onClick={() => setMobileExpandedIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                mobileExpandedIndex === index
                  ? "w-6 bg-[#c9a962]"
                  : "w-2 bg-white/20"
              }`}
              aria-label={`Go to capability ${index + 1}`}
            />
          ))}
        </motion.div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-10 text-center"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-3 border border-white/20 bg-white/[0.03] px-6 py-4 font-Satoshi text-xs font-light uppercase tracking-[0.15em] text-white transition-all duration-300 active:scale-95"
          >
            <span>{t("ctaButton")}</span>
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </motion.div>
      </div>

      {/* ==================== DESKTOP DESIGN ==================== */}
      <div className="hidden lg:block relative z-10 mx-auto max-w-[1600px] px-6 py-32 lg:px-16 lg:py-44">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="mb-24 lg:mb-32"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-end">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-8"
              >
                <span className="inline-flex items-center gap-4 font-Satoshi text-[11px] font-semibold uppercase tracking-[0.5em] text-[#c9a962]">
                  <span className="h-px w-12 bg-[#c9a962]" />
                  {t("heading")}
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.3 }}
                className="font-SchnyderS text-6xl font-light tracking-tight text-white sm:text-7xl lg:text-[5.5rem] leading-[0.9]"
              >
                {t("titleLine1")}
                <br />
                <span className="text-[#c9a962]">{t("titleLine2")}</span>
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="lg:pb-4"
            >
              <p className="font-Satoshi text-lg font-light leading-relaxed text-neutral-400">
                {t("description")}
                <span className="text-white font-normal">
                  {" "}
                  {t("descriptionHighlight")}
                </span>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Capabilities - Accordion Style - All CSS transitions, no Framer Motion on hover */}
        <div
          ref={listRef}
          className="relative"
          role="list"
          aria-label={t("heading")}
        >
          {capabilities.map((capability, index) => {
            const isActive = activeIndex === index;
            return (
              <motion.div
                key={capability.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative"
                role="listitem"
              >
                <Link
                  href={capability.link}
                  className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a962] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] rounded"
                  data-capability-link
                  aria-label={`${capability.title}: ${capability.description}`}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(null)}
                  onKeyDown={(e) =>
                    handleKeyDown(e, index, capabilities.length)
                  }
                >
                  <div
                    className={`relative border-t transition-all duration-500 ease-out ${
                      isActive
                        ? "border-[#c9a962]/50 bg-[#c9a962]/5"
                        : "border-white/10"
                    }`}
                  >
                    {/* Content Row - Fixed height to prevent flickering */}
                    <div className="relative z-10 grid grid-cols-12 items-center gap-4 py-6 lg:gap-6 lg:py-8 min-h-[100px] lg:min-h-[120px]">
                      {/* Title - Y-axis swap animation on hover */}
                      <div className="col-span-12 lg:col-span-5 relative overflow-hidden h-10 lg:h-[52px]">
                        {/* Default title - slides up and fades out on hover */}
                        <h3
                          className={`font-SchnyderS text-2xl font-light lg:text-4xl transition-all duration-500 ease-out absolute inset-0 ${
                            isActive
                              ? "opacity-0 -translate-y-full text-white"
                              : "opacity-100 translate-y-0 text-white/80"
                          }`}
                        >
                          {capability.title}
                        </h3>
                        {/* Hover title - slides in from below */}
                        <h3
                          className={`font-SchnyderS text-2xl font-light lg:text-4xl transition-all duration-500 ease-out absolute inset-0 text-[#c9a962] ${
                            isActive
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-full"
                          }`}
                        >
                          {capability.hoverTitle}
                        </h3>
                      </div>

                      {/* Description & Badge - Container sized for content */}
                      <div className="col-span-12 lg:col-span-4 lg:pl-8 relative min-h-[80px] lg:min-h-[100px]">
                        {/* Description - Opacity only, no height change */}
                        <p
                          className={`font-Satoshi text-sm font-light leading-relaxed text-white/70 lg:text-base transition-opacity duration-500 ease-out absolute inset-0 ${
                            isActive
                              ? "opacity-100"
                              : "opacity-0 pointer-events-none"
                          }`}
                        >
                          {capability.description}
                        </p>

                        {/* Badge - Opacity only, no height change */}
                        <span
                          className={`font-Satoshi text-xs font-medium uppercase tracking-[0.3em] text-[#c9a962]/50 transition-opacity duration-300 ease-out ${
                            isActive ? "opacity-0" : "opacity-100"
                          }`}
                        >
                          {capability.badge}
                        </span>
                      </div>

                      {/* Expandable Arrow Button - Circle expands to reveal text on hover */}
                      <div className="col-span-12 lg:col-span-3 flex items-center justify-end">
                        <div
                          className={`relative flex items-center justify-end rounded-full border transition-all duration-500 ease-out overflow-hidden ${
                            isActive
                              ? "border-[#c9a962] bg-[#c9a962] pl-5 pr-1"
                              : "border-white/20 bg-transparent"
                          }`}
                          style={{
                            width: isActive ? "auto" : "3.5rem",
                            minWidth: isActive ? "180px" : "3.5rem",
                          }}
                        >
                          {/* Button Label - Fades in when expanded */}
                          <span
                            className={`font-Satoshi text-[11px] font-medium uppercase tracking-wider whitespace-nowrap transition-all duration-500 ease-out ${
                              isActive
                                ? "opacity-100 translate-x-0 text-[#0a0a0a]"
                                : "opacity-0 -translate-x-4 absolute"
                            }`}
                          >
                            {capability.buttonLabel}
                          </span>

                          {/* Arrow Circle */}
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-500 ease-out lg:h-14 lg:w-14 shrink-0 ${
                              isActive ? "bg-[#0a0a0a]/10" : "bg-transparent"
                            }`}
                          >
                            <ArrowRight
                              className={`h-5 w-5 transition-all duration-300 ease-out ${
                                isActive
                                  ? "translate-x-0.5 text-[#0a0a0a]"
                                  : "translate-x-0 text-white/60"
                              }`}
                              strokeWidth={1.5}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom accent line - CSS transition */}
                    <div
                      className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#c9a962] via-[#e8d5a3] to-transparent transition-all duration-600 ease-out ${
                        isActive ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}

          {/* Last border */}
          <div className="border-t border-white/10" />
        </div>

        {/* Redesigned Process Navigation - Elegant pill design with smooth interactions */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1 }}
          className="mt-20 lg:mt-28"
        >
          {/* Navigation Container with subtle border */}
          <div className="mx-auto max-w-4xl">
            <div className="relative flex items-center justify-between rounded-full border border-white/10 bg-white/[0.02] px-4 py-3 backdrop-blur-sm lg:px-8 lg:py-4">
              {/* Progress fill bar - uses displayedIndex to prevent flicker */}
              <div className="absolute inset-y-0 left-0 overflow-hidden rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-[#c9a962]/20 via-[#c9a962]/10 to-transparent transition-all duration-700 ease-out"
                  style={{
                    width:
                      displayedIndex !== null
                        ? `${((displayedIndex + 1) / capabilities.length) * 100}%`
                        : "0%",
                  }}
                />
              </div>

              {/* Navigation Items */}
              {capabilities.map((cap, index) => {
                const isActive = displayedIndex === index;
                const isPast =
                  displayedIndex !== null && index < displayedIndex;

                return (
                  <button
                    key={cap.id}
                    className="group/nav relative z-10 flex flex-col items-center gap-2 px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a962] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] rounded-lg transition-all duration-300 lg:px-4"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
                    aria-label={`${cap.shortTitle} - capability ${index + 1} of ${capabilities.length}`}
                  >
                    {/* Step number badge */}
                    <div
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-500 ease-out lg:h-10 lg:w-10 ${
                        isActive
                          ? "border-[#c9a962] bg-[#c9a962] shadow-lg shadow-[#c9a962]/30"
                          : isPast
                            ? "border-[#c9a962]/60 bg-[#c9a962]/20"
                            : "border-white/20 bg-transparent group-hover/nav:border-[#c9a962]/40 group-hover/nav:bg-[#c9a962]/10"
                      }`}
                    >
                      <span
                        className={`font-Satoshi text-[10px] font-semibold transition-colors duration-300 lg:text-xs ${
                          isActive
                            ? "text-[#0a0a0a]"
                            : isPast
                              ? "text-[#c9a962]"
                              : "text-white/50 group-hover/nav:text-[#c9a962]"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {/* Active pulse ring */}
                      {isActive && (
                        <span className="absolute -inset-1 animate-ping rounded-full border border-[#c9a962]/30" />
                      )}
                    </div>

                    {/* Label */}
                    <span
                      className={`hidden font-Satoshi text-[9px] font-medium uppercase tracking-wider transition-all duration-300 lg:block lg:text-[10px] ${
                        isActive
                          ? "text-[#c9a962] translate-y-0 opacity-100"
                          : isPast
                            ? "text-[#c9a962]/60"
                            : "text-white/40 group-hover/nav:text-white/60"
                      }`}
                    >
                      {cap.shortTitle}
                    </span>

                    {/* Active indicator dot */}
                    <div
                      className={`h-1 w-1 rounded-full bg-[#c9a962] transition-all duration-300 ${
                        isActive ? "scale-100 opacity-100" : "scale-0 opacity-0"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Current capability info */}
            <div className="mt-6 flex items-center justify-center gap-4 text-center">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/20" />
              <span className="font-Satoshi text-xs font-light text-white/40">
                {displayedIndex !== null
                  ? `${capabilities[displayedIndex].shortTitle} — ${capabilities[displayedIndex].badge}`
                  : "Hover to explore capabilities"}
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/20" />
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-16 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-8"
        >
          <span className="font-Satoshi text-sm font-light text-neutral-500">
            {t("ctaPrompt")}
          </span>
          <Link
            href="/services"
            className="group relative inline-flex items-center gap-3 overflow-hidden border border-neutral-950 bg-neutral-950 px-8 py-4 font-Satoshi text-xs font-light uppercase tracking-[0.15em] text-white transition-all duration-300 hover:bg-transparent hover:text-neutral-950"
          >
            <span>{t("ctaButton")}</span>
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={2}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
