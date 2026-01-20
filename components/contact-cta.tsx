"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/magnetic-button";

/**
 * BUTTON VARIANTS (Site-wide standard):
 * - primary:   Solid dark background, main actions
 * - secondary: Outlined, secondary actions
 * - link:      Use ButtonLink component instead
 */
interface ContactCTAProps {
  /** Button text */
  text?: string;
  /** Button variant - only primary or secondary */
  variant?: "primary" | "secondary";
  /** Additional CSS classes */
  className?: string;
  /** Show arrow icon */
  showArrow?: boolean;
  /** Full width button */
  fullWidth?: boolean;
}

/**
 * ContactCTA - A call-to-action button that redirects to the contact page
 * with source tracking for analytics.
 *
 * Uses the site-wide 3-variant button system:
 * - primary (default): Solid dark button for main CTAs
 * - secondary: Outlined button for alternative actions
 */
export function ContactCTA({
  text = "Start Your Project",
  variant = "primary",
  className = "",
  showArrow = true,
  fullWidth = false,
}: ContactCTAProps) {
  const contactUrl = `/contact/book-consultation`;

  // Site-wide button variants (only 2 for CTAs, link variant uses ButtonLink)
  const variantStyles = {
    primary:
      "border-neutral-950 bg-neutral-950 text-white hover:bg-transparent hover:text-neutral-950",
    secondary:
      "border-neutral-950 bg-transparent text-neutral-950 hover:bg-neutral-950 hover:text-white",
  };

  return (
    <MagneticButton strength={0.15}>
      <Link
        href={contactUrl}
        className={`
          group inline-flex items-center justify-center gap-2 border
          px-6 py-3 font-Satoshi text-[10px] font-light uppercase tracking-[0.15em]
          transition-all duration-300 sm:gap-3 sm:px-8 sm:py-4 sm:text-xs
          active:scale-[0.98]
          ${variantStyles[variant]}
          ${fullWidth ? "w-full" : "w-auto"}
          ${className}
        `}
      >
        {text}
        {showArrow && (
          <ArrowRight
            className="h-3 w-3 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4"
            strokeWidth={1.5}
          />
        )}
      </Link>
    </MagneticButton>
  );
}

/**
 * ContactCTAAnimated - Animated version with Framer Motion
 * Use this when you need the button to animate into view
 */
export function ContactCTAAnimated({
  text = "Start Your Project",
  variant = "primary",
  className = "",
  showArrow = true,
  fullWidth = false,
  delay = 0,
}: ContactCTAProps & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <ContactCTA
        text={text}
        variant={variant}
        className={className}
        showArrow={showArrow}
        fullWidth={fullWidth}
      />
    </motion.div>
  );
}

export default ContactCTA;
