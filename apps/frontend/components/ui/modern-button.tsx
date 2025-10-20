"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-lg hover:-translate-y-0.5",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:shadow-md hover:border-primary/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-md hover:-translate-y-0.5",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        gradient:
          "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 hover:shadow-lg hover:-translate-y-0.5",
        glassmorphism:
          "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:shadow-xl hover:-translate-y-0.5",
        shine:
          "bg-primary text-primary-foreground hover:bg-primary/90 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-12 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const ModernButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    asChild = false,
    loading = false,
    leftIcon,
    rightIcon,
    disabled,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {!loading && leftIcon && (
          <span className="mr-2 transition-transform duration-200 group-hover:scale-110">
            {leftIcon}
          </span>
        )}

        <span className={cn(
          "transition-all duration-200",
          loading && "opacity-70"
        )}>
          {children}
        </span>

        {!loading && rightIcon && (
          <span className="ml-2 transition-transform duration-200 group-hover:scale-110 group-hover:translate-x-1">
            {rightIcon}
          </span>
        )}

        {/* Ripple effect overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 group-active:opacity-20 bg-white transition-opacity duration-200 pointer-events-none" />
      </Comp>
    );
  }
);
ModernButton.displayName = "ModernButton";

// Specific button variants for common use cases
export const CTAButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <ModernButton
      ref={ref}
      variant="gradient"
      size="lg"
      className="font-semibold tracking-wide shadow-lg hover:shadow-2xl transition-all duration-300"
      {...props}
    >
      {children}
    </ModernButton>
  )
);
CTAButton.displayName = "CTAButton";

export const GlassButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <ModernButton
      ref={ref}
      variant="glassmorphism"
      className="backdrop-blur-lg border-white/30"
      {...props}
    >
      {children}
    </ModernButton>
  )
);
GlassButton.displayName = "GlassButton";

export const ShineButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <ModernButton
      ref={ref}
      variant="shine"
      {...props}
    >
      {children}
    </ModernButton>
  )
);
ShineButton.displayName = "ShineButton";

export { ModernButton, buttonVariants };

// Add shimmer animation to globals.css:
export const ButtonStyles = `
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`;