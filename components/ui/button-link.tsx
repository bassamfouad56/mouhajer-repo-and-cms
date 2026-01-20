"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * MOUHAJER DESIGN STUDIO - ButtonLink Component
 *
 * For tertiary actions and inline text links.
 * Uses the "link" variant styling: underlined text with hover effect.
 *
 * Use for: Back links, Skip, View All, Inline navigation, See More
 */

export interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  /** External link (opens in new tab) */
  external?: boolean;
  /** Children content */
  children: React.ReactNode;
}

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, href, external = false, children, ...props }, ref) => {
    const baseStyles = cn(
      "inline-flex items-center gap-1",
      "font-Satoshi text-xs font-light uppercase tracking-[0.1em]",
      "border-b border-neutral-950 bg-transparent text-neutral-950",
      "hover:border-[#c9a962] hover:text-[#c9a962]",
      "transition-colors duration-300",
      className
    );

    if (external) {
      return (
        <a
          ref={ref}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={baseStyles}
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <Link ref={ref} href={href} className={baseStyles} {...props}>
        {children}
      </Link>
    );
  }
);

ButtonLink.displayName = "ButtonLink";

export { ButtonLink };
