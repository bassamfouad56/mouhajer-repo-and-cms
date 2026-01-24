"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * MOUHAJER DESIGN STUDIO - Button System
 *
 * Only 3 variants to maintain visual consistency:
 *
 * 1. PRIMARY   - Solid black, main actions (Book Consultation, Submit, Start Project)
 * 2. SECONDARY - Outlined, secondary actions (Learn More, View Details, Cancel)
 * 3. LINK      - Text with underline, tertiary actions (Back, Skip, See All)
 */

const buttonVariants = cva(
  // Base styles for all buttons
  "inline-flex items-center justify-center gap-2 font-Satoshi text-xs font-light uppercase tracking-[0.15em] transition-all duration-300 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        /**
         * PRIMARY - Main call-to-action
         * Use for: Book Consultation, Submit forms, Start Project, Primary CTAs
         */
        primary: [
          "border border-neutral-950 bg-neutral-950 text-white",
          "hover:bg-transparent hover:text-neutral-950",
          "active:scale-[0.98]",
        ].join(" "),

        /**
         * SECONDARY - Secondary actions
         * Use for: Learn More, View Details, Cancel, Alternative options
         */
        secondary: [
          "border border-neutral-950 bg-transparent text-neutral-950",
          "hover:bg-neutral-950 hover:text-white",
          "active:scale-[0.98]",
        ].join(" "),

        /**
         * LINK - Text-only tertiary actions
         * Use for: Back links, Skip, View All, Inline text links
         */
        link: [
          "border-b border-neutral-950 bg-transparent text-neutral-950 tracking-[0.1em]",
          "hover:border-[#8f7852] hover:text-[#8f7852]",
          "px-0 py-0",
        ].join(" "),
      },
      size: {
        default: "px-6 py-3 sm:px-8 sm:py-4",
        sm: "px-4 py-2 sm:px-5 sm:py-2.5 text-[10px]",
        lg: "px-8 py-4 sm:px-10 sm:py-5",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  showArrow?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      showArrow = false,
      loading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    // Don't show arrow for link variant by default
    const shouldShowArrow = showArrow && variant !== "link";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <>
            {children}
            {shouldShowArrow && (
              <ArrowRight
                className="h-3 w-3 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4"
                strokeWidth={1.5}
              />
            )}
          </>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
