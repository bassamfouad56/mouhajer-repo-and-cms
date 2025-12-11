"use client";

import { forwardRef, ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Interactive UI Elements
 *
 * Micro-interactions for buttons and cards:
 * - Subtle hover lift/scale
 * - Press feedback
 * - Ripple effect on click
 * - Focus ring animations
 */

// ========================
// ANIMATED BUTTON
// ========================

interface AnimatedButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  withRipple?: boolean;
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      withRipple = true,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative overflow-hidden inline-flex items-center justify-center font-light tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

    const variants = {
      primary:
        "bg-neutral-950 text-white hover:bg-neutral-900 focus-visible:ring-neutral-950",
      secondary:
        "bg-white text-neutral-950 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 focus-visible:ring-neutral-400",
      ghost:
        "bg-transparent text-neutral-950 hover:bg-neutral-100 focus-visible:ring-neutral-400",
      gold: "bg-[#d4af37] text-black hover:bg-[#c4a030] focus-visible:ring-[#d4af37]",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs rounded-lg",
      md: "px-6 py-3 text-sm rounded-lg",
      lg: "px-8 py-4 text-base rounded-xl",
    };

    return (
      <motion.button
        ref={ref}
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -2 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {/* Ripple overlay on hover */}
        {withRipple && !disabled && (
          <motion.span
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            whileHover={{
              opacity: 1,
              background:
                "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.15) 0%, transparent 50%)",
            }}
          />
        )}
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
);
AnimatedButton.displayName = "AnimatedButton";

// ========================
// ANIMATED LINK BUTTON
// ========================

interface AnimatedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: "primary" | "secondary" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
}

export const AnimatedLink = forwardRef<HTMLAnchorElement, AnimatedLinkProps>(
  ({ children, className, href, variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles =
      "relative overflow-hidden inline-flex items-center justify-center font-light tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

    const variants = {
      primary:
        "bg-neutral-950 text-white hover:bg-neutral-900 focus-visible:ring-neutral-950",
      secondary:
        "bg-white text-neutral-950 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 focus-visible:ring-neutral-400",
      ghost:
        "bg-transparent text-neutral-950 hover:bg-neutral-100 focus-visible:ring-neutral-400",
      gold: "bg-[#d4af37] text-black hover:bg-[#c4a030] focus-visible:ring-[#d4af37]",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs rounded-lg",
      md: "px-6 py-3 text-sm rounded-lg",
      lg: "px-8 py-4 text-base rounded-xl",
    };

    return (
      <Link href={href} passHref legacyBehavior>
        <motion.a
          ref={ref}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className={cn(baseStyles, variants[variant], sizes[size], className)}
          {...props}
        >
          <span className="relative z-10">{children}</span>
        </motion.a>
      </Link>
    );
  }
);
AnimatedLink.displayName = "AnimatedLink";

// ========================
// ANIMATED CARD
// ========================

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  hoverEffect?: "lift" | "glow" | "border" | "scale" | "none";
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, className, hoverEffect = "lift", ...props }, ref) => {
    const hoverVariants = {
      lift: { y: -8, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)" },
      glow: { boxShadow: "0 0 30px rgba(212, 175, 55, 0.15)" },
      border: { borderColor: "rgba(212, 175, 55, 0.5)" },
      scale: { scale: 1.02 },
      none: {},
    };

    return (
      <motion.div
        ref={ref}
        whileHover={hoverVariants[hoverEffect]}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "relative overflow-hidden rounded-xl bg-white border border-neutral-100 transition-colors",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
AnimatedCard.displayName = "AnimatedCard";

// ========================
// MAGNETIC HOVER (subtle)
// ========================

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticHover({
  children,
  className,
  strength = 0.3,
}: MagneticProps) {
  return (
    <motion.div
      className={cn("relative", className)}
      whileHover="hover"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        e.currentTarget.style.setProperty("--mouse-x", `${x * strength}px`);
        e.currentTarget.style.setProperty("--mouse-y", `${y * strength}px`);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.setProperty("--mouse-x", "0px");
        e.currentTarget.style.setProperty("--mouse-y", "0px");
      }}
      style={{
        transform: "translate(var(--mouse-x, 0), var(--mouse-y, 0))",
        transition: "transform 0.2s ease-out",
      }}
    >
      {children}
    </motion.div>
  );
}

// ========================
// TEXT HOVER UNDERLINE
// ========================

interface TextHoverProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

export function TextHoverUnderline({
  children,
  className,
  color = "currentColor",
}: TextHoverProps) {
  return (
    <span className={cn("group relative inline-block", className)}>
      {children}
      <span
        className="absolute bottom-0 left-0 h-[1px] w-0 transition-all duration-300 ease-out group-hover:w-full"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}

// ========================
// ICON BUTTON
// ========================

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost" | "outline";
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, className, size = "md", variant = "default", ...props }, ref) => {
    const sizes = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
    };

    const variants = {
      default: "bg-neutral-950 text-white hover:bg-neutral-900",
      ghost: "bg-transparent hover:bg-neutral-100",
      outline: "border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={cn(
          "inline-flex items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-400",
          sizes[size],
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
IconButton.displayName = "IconButton";

export default AnimatedButton;
