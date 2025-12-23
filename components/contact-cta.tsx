"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/magnetic-button";

interface ContactCTAProps {
  /** Custom source identifier (overrides automatic path detection) */
  source?: string;
  /** Button text */
  text?: string;
  /** Button variant */
  variant?: "primary" | "secondary" | "gold";
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
 * The source parameter is automatically captured from the current page path,
 * or can be overridden with a custom source identifier.
 *
 * Usage:
 * - Homepage: <ContactCTA /> -> /contact?source=home
 * - About page: <ContactCTA /> -> /contact?source=about
 * - Custom: <ContactCTA source="hero-banner" /> -> /contact?source=hero-banner
 */
export function ContactCTA({
  source,
  text = "Start Your Project",
  variant = "primary",
  className = "",
  showArrow = true,
  fullWidth = false,
}: ContactCTAProps) {
  const pathname = usePathname();

  // Extract source from pathname if not provided
  // Remove locale prefix (e.g., /en/, /ar/) and clean up the path
  const getSourceFromPath = (): string => {
    if (source) return source;

    // Remove locale prefix and get the page name
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");

    // Handle homepage
    if (pathWithoutLocale === "/" || pathWithoutLocale === "") {
      return "home";
    }

    // Clean up the path: remove leading slash, replace remaining slashes with dashes
    const cleanPath = pathWithoutLocale
      .replace(/^\//, "")
      .replace(/\//g, "-")
      .replace(/-+$/, ""); // Remove trailing dashes

    return cleanPath || "home";
  };

  const sourceParam = getSourceFromPath();
  const contactUrl = `/contact/book-consultation`;

  const variantStyles = {
    primary:
      "border-neutral-950 bg-neutral-950 text-white hover:bg-transparent hover:text-neutral-950",
    secondary:
      "border-neutral-950 bg-transparent text-neutral-950 hover:bg-neutral-950 hover:text-white",
    gold: "border-[#c9a962] bg-[#c9a962] text-neutral-950 hover:bg-transparent hover:text-[#c9a962] shadow-[0_0_30px_rgba(201,169,98,0.2)] hover:shadow-[0_0_40px_rgba(201,169,98,0.3)]",
  };

  return (
    <MagneticButton strength={0.15}>
      <Link
        href={contactUrl}
        className={`
          group inline-flex items-center justify-center gap-2 border
          px-6 py-3 text-[10px] font-light uppercase tracking-[0.15em]
          transition-all sm:gap-3 sm:px-8 sm:py-4 sm:text-xs
          ${variantStyles[variant]}
          ${fullWidth ? "w-full" : "w-auto"}
          ${className}
        `}
      >
        {text}
        {showArrow && (
          <ArrowRight
            className="h-3 w-3 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4"
            strokeWidth={1}
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
  source,
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
        source={source}
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
