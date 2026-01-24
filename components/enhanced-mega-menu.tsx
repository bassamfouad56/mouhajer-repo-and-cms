"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, Sparkles, Award } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { getSafeImageUrl } from "@/sanity/lib/image";
import { useMegaMenuImages } from "./providers/mega-menu-images-provider";
import type { MegaMenuImages } from "./server-header";

interface SubLink {
  href: string;
  label: string;
  description: string;
  image: string;
  icon?: React.ReactNode;
  animation?: "opacity" | "scale";
}

interface MegaMenuItem {
  href: string;
  label: string;
  isPage: boolean;
  subLinks?: SubLink[];
  featured?: {
    title: string;
    description: string;
    image: string;
    href: string;
  };
}

// Fallback images for when Sanity images are not available
// Using images from website 2.0 content folder (URL encoded)
const FALLBACK_IMAGES = {
  projects: {
    residential:
      "/website%202.0%20content/projects/residential/_MID0031-HDR.jpg",
    commercial: "/website%202.0%20content/projects/commercial/_MID7383-HDR.jpg",
    hospitality:
      "/website%202.0%20content/projects/hospitality/_DSC3629-HDR.jpg",
    ongoing: "/placeholder.jpg",
    featured: "/website%202.0%20content/projects/hospitality/_DSC3629-HDR.jpg",
  },
  services: {
    "civil-construction":
      "/website%202.0%20content/services/civil%20construction/MID5703.jpg",
    "interior-architecture":
      "/website%202.0%20content/services/interior%20architecture/_MIDnf71-HDR.jpg",
    "mep-engineering":
      "/website%202.0%20content/services/MEP%20Engineering/_MID5351.jpg",
    "manufacturing-joinery":
      "/website%202.0%20content/services/manufacturing%20and%20joinery/quality-control-at-workshop-2025-01-31-00-41-33-utc.jpg",
    "fit-out-execution":
      "/website%202.0%20content/services/fitout%20execution/_MID1778-HDR.jpg",
    "handover-maintenance":
      "/website%202.0%20content/services/inside%20services/we%20do%20not%20outsource%20your%20vision/_MID3905-HDR.jpg",
    featured:
      "/website%202.0%20content/services/interior%20architecture/_MIDnf71-HDR.jpg",
  },
  industries: {
    "luxury-hospitality":
      "/website%202.0%20content/services/industries/luxury%20hospitality/_MID3940-HDR.jpg",
    "high-end-residential":
      "/website%202.0%20content/services/industries/highend%20residential/_MID0001-HDR-2.jpg",
    "commercial-corporate":
      "/website%202.0%20content/services/industries/commercial%20and%20corporate/_MID1004-HDR.jpg",
    featured:
      "/website%202.0%20content/services/industries/luxury%20hospitality/_MID3940-HDR.jpg",
  },
  journal: {
    "design-trends": "/placeholder.jpg",
    "project-stories": "/placeholder.jpg",
    "materials-craft": "/placeholder.jpg",
    engineering: "/placeholder.jpg",
    featured: "/placeholder.jpg",
  },
  about: {
    logo: "/logo.svg",
    founder: "/founder/CEO Arabia.jpg",
    process: "/founder/CID_2106_00_COVER.jpg",
    awards: "/founder/CID_2106_00_COVER.jpg",
    featured: "/founder/CID_2106_00_COVER.jpg",
  },
  contact: {
    contactUs: "/placeholder.jpg",
    bookConsultation: "/placeholder.jpg",
    supplierRegistration: "/placeholder.jpg",
  },
};

interface EnhancedMegaMenuProps {
  megaMenuImages?: MegaMenuImages | null;
}

export function EnhancedMegaMenu({
  megaMenuImages: propImages,
}: EnhancedMegaMenuProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("MegaMenu");
  const tHeader = useTranslations("Header");

  // Use prop images first, fallback to context, then to null (which uses fallback images)
  const contextImages = useMegaMenuImages();
  const megaMenuImages = propImages ?? contextImages;

  const megaMenuItems: MegaMenuItem[] = useMemo(() => {
    // Helper function to get image URL from Sanity or fallback
    const getProjectImage = (
      category:
        | "residential"
        | "commercial"
        | "hospitality"
        | "ongoing"
        | "featured",
    ): string => {
      const sanityImage = megaMenuImages?.projects?.[category]?.mainImage;
      if (sanityImage) {
        return getSafeImageUrl(
          sanityImage,
          400,
          300,
          FALLBACK_IMAGES.projects[category],
        );
      }
      return FALLBACK_IMAGES.projects[category];
    };

    const getPostImage = (
      category:
        | "designTrends"
        | "projectStories"
        | "materialsCraft"
        | "engineering"
        | "featured",
    ): string => {
      const sanityImage = megaMenuImages?.posts?.[category]?.mainImage;
      const categoryToFallback: Record<
        string,
        keyof typeof FALLBACK_IMAGES.journal
      > = {
        designTrends: "design-trends",
        projectStories: "project-stories",
        materialsCraft: "materials-craft",
        engineering: "engineering",
        featured: "featured",
      };
      if (sanityImage) {
        return getSafeImageUrl(
          sanityImage,
          400,
          300,
          FALLBACK_IMAGES.journal[categoryToFallback[category]],
        );
      }
      return FALLBACK_IMAGES.journal[categoryToFallback[category]];
    };

    const getAboutImage = (section: "process" | "awards"): string => {
      const sanityImage = megaMenuImages?.about?.[section]?.mainImage;
      if (sanityImage) {
        return getSafeImageUrl(
          sanityImage,
          400,
          300,
          FALLBACK_IMAGES.about[section],
        );
      }
      return FALLBACK_IMAGES.about[section];
    };

    return [
      { href: "/", label: tHeader("home"), isPage: true },
      {
        href: "/projects",
        label: tHeader("projects"),
        isPage: true,
        subLinks: [
          {
            href: "/projects?filter=residential",
            label: t("projects.residential.label"),
            description: t("projects.residential.description"),
            image: getProjectImage("residential"),
          },
          {
            href: "/projects?filter=commercial",
            label: t("projects.commercial.label"),
            description: t("projects.commercial.description"),
            image: getProjectImage("commercial"),
          },
          {
            href: "/projects?filter=hospitality",
            label: t("projects.hospitality.label"),
            description: t("projects.hospitality.description"),
            image: getProjectImage("hospitality"),
          },
          {
            href: "/projects?filter=ongoing",
            label: t("projects.ongoing.label"),
            description: t("projects.ongoing.description"),
            image: getProjectImage("ongoing"),
          },
        ],
        featured: {
          title: t("projects.featured.title"),
          description: t("projects.featured.description"),
          image: getProjectImage("featured"),
          href: "/projects",
        },
      },
      {
        href: "/services",
        label: tHeader("services"),
        isPage: true,
        // Dynamically build subLinks from actual Sanity services data
        subLinks: (megaMenuImages?.services || [])
          .slice(0, 6)
          .map((service) => {
            const slug = service.slug?.current || "";
            const title =
              typeof service.title === "object"
                ? (service.title as any)?.[locale] ||
                  (service.title as any)?.en ||
                  ""
                : service.title || "";
            return {
              href: `/services/${slug}`,
              label: title,
              description: `Explore our ${title} services`,
              image: service.mainImage
                ? getSafeImageUrl(
                    service.mainImage,
                    400,
                    300,
                    FALLBACK_IMAGES.services.featured,
                  )
                : FALLBACK_IMAGES.services.featured,
            };
          }),
        featured: {
          title: t("services.featured.title"),
          description: t("services.featured.description"),
          image: megaMenuImages?.services?.[0]?.mainImage
            ? getSafeImageUrl(
                megaMenuImages.services[0].mainImage,
                400,
                300,
                FALLBACK_IMAGES.services.featured,
              )
            : FALLBACK_IMAGES.services.featured,
          href: "/services",
        },
      },
      {
        href: "/industries",
        label: tHeader("industries"),
        isPage: true,
        // Dynamically build subLinks from actual Sanity industries data (excluding healthcare)
        subLinks: (megaMenuImages?.industries || [])
          .filter((industry) => industry.slug?.current !== "healthcare")
          .slice(0, 3)
          .map((industry) => {
            const slug = industry.slug?.current || "";
            const title =
              typeof industry.title === "object"
                ? (industry.title as any)?.[locale] ||
                  (industry.title as any)?.en ||
                  ""
                : industry.title || "";
            return {
              href: `/industries/${slug}`,
              label: title,
              description: `Explore our ${title} projects`,
              image: industry.mainImage
                ? getSafeImageUrl(
                    industry.mainImage,
                    400,
                    300,
                    FALLBACK_IMAGES.industries.featured,
                  )
                : FALLBACK_IMAGES.industries.featured,
            };
          }),
        featured: {
          title: t("industries.featured.title"),
          description: t("industries.featured.description"),
          image: (() => {
            const filteredIndustries = (
              megaMenuImages?.industries || []
            ).filter((i) => i.slug?.current !== "healthcare");
            return filteredIndustries[0]?.mainImage
              ? getSafeImageUrl(
                  filteredIndustries[0].mainImage,
                  400,
                  300,
                  FALLBACK_IMAGES.industries.featured,
                )
              : FALLBACK_IMAGES.industries.featured;
          })(),
          href: "/industries",
        },
      },
      {
        href: "/journal",
        label: tHeader("blog"),
        isPage: true,
        subLinks: [
          {
            href: "/journal/design-trends",
            label: "Design Trends",
            description: "Latest trends in interior design and architecture",
            image: getPostImage("designTrends"),
          },
          {
            href: "/journal/project-stories",
            label: "Project Stories",
            description: "Behind the scenes of our signature projects",
            image: getPostImage("projectStories"),
          },
          {
            href: "/journal/materials-craft",
            label: "Materials & Craft",
            description: "Exploring materials, finishes, and craftsmanship",
            image: getPostImage("materialsCraft"),
          },
          {
            href: "/journal/engineering",
            label: "Engineering",
            description: "Technical insights and engineering excellence",
            image: getPostImage("engineering"),
          },
        ],
        featured: {
          title: t("blog.featured.title"),
          description: t("blog.featured.description"),
          image: getPostImage("featured"),
          href: "/journal",
        },
      },
      {
        href: "/about",
        label: tHeader("about"),
        isPage: true,
        subLinks: [
          {
            href: "/about",
            label: t("about.aboutMidc.label"),
            description: t("about.aboutMidc.description"),
            image: FALLBACK_IMAGES.about.logo,
            animation: "opacity" as const,
          },
          {
            href: "/about/founder",
            label: t("about.founder.label"),
            description: t("about.founder.description"),
            image: FALLBACK_IMAGES.about.founder,
            animation: "scale" as const,
          },
          {
            href: "/about/process",
            label: t("about.process.label"),
            description: t("about.process.description"),
            image: getAboutImage("process"),
          },
          {
            href: "/about/awards",
            label: t("about.awards.label"),
            description: t("about.awards.description"),
            image: getAboutImage("awards"),
          },
        ],
        featured: {
          title: t("about.featured.title"),
          description: t("about.featured.description"),
          image: getAboutImage("process"),
          href: "/about",
        },
      },
      {
        href: "/contact",
        label: tHeader("contact"),
        isPage: true,
        subLinks: [
          {
            href: "/contact",
            label: t("contact.contactUs.label"),
            description: t("contact.contactUs.description"),
            image: FALLBACK_IMAGES.contact.contactUs,
          },
          {
            href: "/contact/book-consultation",
            label: t("contact.bookConsultation.label"),
            description: t("contact.bookConsultation.description"),
            image: FALLBACK_IMAGES.contact.bookConsultation,
          },
          {
            href: "/supplier-registration",
            label: t("contact.supplierRegistration.label"),
            description: t("contact.supplierRegistration.description"),
            image: FALLBACK_IMAGES.contact.supplierRegistration,
          },
        ],
        // No featured section = simple dropdown
      },
    ];
  }, [megaMenuImages, t, tHeader, locale]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [hoveredSubLink, setHoveredSubLink] = useState<SubLink | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Delayed close to prevent flickering when moving between menu items
  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
      setHoveredSubLink(null);
    }, 150); // 150ms delay before closing
  };

  // Cancel close when entering menu area
  const handleMouseEnter = (href: string, hasSubLinks: boolean) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (hasSubLinks) {
      setActiveMenu(href);
      setHoveredSubLink(null);
    }
  };

  // Cancel timeout when entering dropdown area
  const handleDropdownMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname?.startsWith(href);
  };

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeMenu &&
        menuRef.current &&
        navRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !navRef.current.contains(event.target as Node)
      ) {
        setActiveMenu(null);
      }
    };

    if (activeMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenu]);

  return (
    <nav ref={navRef} className="hidden lg:block" aria-label="Main navigation">
      <ul className="flex items-center gap-10" role="menubar">
        {megaMenuItems.map((item) => (
          <li
            key={item.href}
            className="relative"
            role="none"
            onMouseEnter={() => handleMouseEnter(item.href, !!item.subLinks)}
            onMouseLeave={handleMouseLeave}
          >
            {item.subLinks ? (
              <>
                <Link
                  href={item.href}
                  role="menuitem"
                  aria-haspopup="true"
                  aria-expanded={activeMenu === item.href}
                  className={`group relative z-50 flex items-center gap-1.5 text-[13px] font-light tracking-[0.1em] transition-all duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:text-white rounded ${
                    isActive(item.href) ? "text-white" : "text-neutral-300"
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    size={13}
                    aria-hidden="true"
                    className={`transition-all duration-500 ${
                      activeMenu === item.href
                        ? "rotate-180 text-white"
                        : "text-neutral-400"
                    }`}
                  />
                </Link>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {activeMenu === item.href && (
                    <>
                      {/* Invisible backdrop for smooth close - below mega menu but above page content */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setActiveMenu(null)}
                      />

                      {/* Simple Dropdown for items without featured section */}
                      {!item.featured &&
                      item.subLinks &&
                      item.subLinks.length <= 4 ? (
                        <motion.div
                          ref={menuRef}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute left-0 top-full z-50 w-64 pt-3"
                          onMouseEnter={handleDropdownMouseEnter}
                          onMouseLeave={handleMouseLeave}
                        >
                          <div className="overflow-hidden rounded-xl border border-white/10 bg-neutral-950/98 shadow-2xl shadow-black/50 backdrop-blur-xl">
                            {/* Top accent */}
                            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8f7852]/40 to-transparent" />

                            <div className="p-2">
                              {item.subLinks.map((subLink, index) => (
                                <Link
                                  key={subLink.href}
                                  href={subLink.href}
                                  className="group/item flex items-center gap-3 rounded-lg px-4 py-3 transition-all hover:bg-white/5"
                                  onClick={() => setActiveMenu(null)}
                                >
                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex flex-1 items-center justify-between"
                                  >
                                    <div>
                                      <span className="block text-[13px] font-light text-white group-hover/item:text-[#8f7852]">
                                        {subLink.label}
                                      </span>
                                      <span className="mt-0.5 block text-[11px] text-neutral-500">
                                        {subLink.description}
                                      </span>
                                    </div>
                                    <ArrowRight
                                      size={14}
                                      className="text-neutral-600 transition-all group-hover/item:translate-x-1 group-hover/item:text-[#8f7852]"
                                    />
                                  </motion.div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        /* Luxurious Mega Menu Dropdown for items with featured section */
                        <motion.div
                          ref={menuRef}
                          initial={{ opacity: 0, y: 30, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 20, scale: 0.96 }}
                          transition={{
                            duration: 0.4,
                            ease: [0.19, 1, 0.22, 1],
                            opacity: { duration: 0.25 },
                          }}
                          className="fixed left-1/2 top-[88px] z-50 -translate-x-1/2"
                          onMouseEnter={handleDropdownMouseEnter}
                          onMouseLeave={handleMouseLeave}
                        >
                          {/* Premium container with subtle shadow */}
                          <div
                            className={`relative w-[95vw] overflow-hidden rounded-lg border border-white/8 bg-linear-to-br from-neutral-900/98 via-neutral-950/98 to-black/98 shadow-2xl shadow-black/40 backdrop-blur-2xl ${
                              item.subLinks && item.subLinks.length > 4
                                ? "max-w-[1200px]"
                                : "max-w-[1000px]"
                            }`}
                          >
                            {/* Subtle noise texture overlay */}
                            <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDMiLz48L3N2Zz4=')] opacity-40" />

                            {/* Top accent line */}
                            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                            <div className="relative grid grid-cols-12 gap-0">
                              {/* Left Side - SubLinks Grid with enhanced spacing */}
                              <div
                                className={`${(item.subLinks?.length ?? 0) > 4 ? "col-span-8" : "col-span-7"} border-r border-white/6 p-6 lg:p-8`}
                              >
                                {/* Premium header */}
                                <div className="mb-5 flex items-center gap-3">
                                  <div className="rounded-full bg-white/5 p-2 backdrop-blur-sm">
                                    <Sparkles
                                      size={14}
                                      className="text-neutral-400"
                                    />
                                  </div>
                                  <span className="text-[11px] font-light tracking-[0.25em] text-neutral-400">
                                    {t("explore")} {item.label.toUpperCase()}
                                  </span>
                                </div>

                                {/* Cards grid - 3 columns for 6+ items, 2 columns for less */}
                                <div
                                  className={`grid gap-4 ${
                                    (item.subLinks?.length ?? 0) > 4
                                      ? "grid-cols-3"
                                      : "grid-cols-2 gap-5"
                                  }`}
                                >
                                  {item.subLinks?.map((subLink, index) => (
                                    <Link
                                      key={subLink.href}
                                      href={subLink.href}
                                      className={`group/card relative overflow-hidden rounded-lg bg-neutral-900/40 backdrop-blur-sm transition-all duration-500 hover:bg-neutral-800/60 hover:shadow-xl hover:shadow-black/20 ${
                                        (item.subLinks?.length ?? 0) > 4 &&
                                        !subLink.image
                                          ? ""
                                          : ""
                                      } ${hoveredSubLink?.href === subLink.href ? "ring-1 ring-[#8f7852]/30" : ""}`}
                                      onMouseEnter={() =>
                                        setHoveredSubLink(subLink)
                                      }
                                    >
                                      <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                          delay: index * 0.05,
                                          duration: 0.5,
                                          ease: [0.19, 1, 0.22, 1],
                                        }}
                                        className="relative"
                                      >
                                        {/* Show image only if it exists and has content */}
                                        {subLink.image && (
                                          <div className="relative h-28 overflow-hidden bg-neutral-900/60">
                                            <Image
                                              src={subLink.image}
                                              alt={subLink.label}
                                              fill
                                              className={`transition-all duration-700 ${
                                                subLink.animation === "opacity"
                                                  ? "object-contain p-6 opacity-60 group-hover/card:opacity-100"
                                                  : subLink.animation ===
                                                      "scale"
                                                    ? "object-cover scale-110 group-hover/card:scale-100"
                                                    : "object-cover group-hover/card:scale-110 group-hover/card:brightness-110"
                                              }`}
                                            />
                                            <div
                                              className={`absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/40 to-transparent transition-opacity duration-500 ${
                                                subLink.animation === "opacity"
                                                  ? "opacity-0"
                                                  : "opacity-70 group-hover/card:opacity-50"
                                              }`}
                                            />

                                            {/* Shimmer effect on hover */}
                                            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover/card:translate-x-full" />
                                          </div>
                                        )}

                                        {/* Content - compact for 6+ items without images */}
                                        <div
                                          className={`${(item.subLinks?.length ?? 0) > 4 && !subLink.image ? "p-3" : "p-4"}`}
                                        >
                                          <div className="mb-2 flex items-center justify-between">
                                            <h4
                                              className={`font-light tracking-wide text-white transition-colors duration-300 ${
                                                (item.subLinks?.length ?? 0) >
                                                  4 && !subLink.image
                                                  ? "text-[13px]"
                                                  : "text-[15px]"
                                              }`}
                                            >
                                              {subLink.label}
                                            </h4>
                                            <div className="rounded-full bg-white/5 p-1.5 backdrop-blur-sm transition-all duration-300 group-hover/card:bg-white/10">
                                              <ArrowRight
                                                size={12}
                                                className="text-neutral-400 transition-all duration-300 group-hover/card:translate-x-0.5 group-hover/card:text-white"
                                              />
                                            </div>
                                          </div>
                                          <p
                                            className={`font-light leading-relaxed text-neutral-400 transition-colors duration-300 group-hover/card:text-neutral-300 ${
                                              (item.subLinks?.length ?? 0) >
                                                4 && !subLink.image
                                                ? "text-[11px]"
                                                : "text-[12px]"
                                            }`}
                                          >
                                            {subLink.description}
                                          </p>
                                        </div>

                                        {/* Subtle border glow on hover */}
                                        <div className="absolute inset-0 rounded-lg border border-white/0 transition-all duration-500 group-hover/card:border-white/10" />
                                      </motion.div>
                                    </Link>
                                  ))}
                                </div>
                              </div>

                              {/* Right Side - Dynamic Preview based on hovered item */}
                              {item.featured && (
                                <div
                                  className={`${(item.subLinks?.length ?? 0) > 4 ? "col-span-4" : "col-span-5"} p-6 lg:p-8`}
                                >
                                  <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                      delay: 0.15,
                                      duration: 0.5,
                                      ease: [0.19, 1, 0.22, 1],
                                    }}
                                    className="h-full"
                                  >
                                    {/* Premium badge - changes based on hover state */}
                                    <div className="mb-4 flex items-center gap-3">
                                      <div className="h-px flex-1 bg-gradient-to-r from-neutral-700 to-transparent" />
                                      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
                                        <Award
                                          size={12}
                                          className="text-neutral-400"
                                        />
                                        <span className="text-[10px] font-light tracking-[0.2em] text-neutral-400">
                                          {hoveredSubLink
                                            ? t("preview")
                                            : t("featured")}
                                        </span>
                                      </div>
                                    </div>

                                    <Link
                                      href={
                                        hoveredSubLink?.href ||
                                        item.featured.href
                                      }
                                      className="group/featured block"
                                    >
                                      {/* Dynamic image - shows hovered item's image or featured */}
                                      <div className="relative mb-4 h-40 overflow-hidden rounded-lg bg-neutral-900/60 shadow-lg shadow-black/20">
                                        <AnimatePresence mode="wait">
                                          <motion.div
                                            key={
                                              hoveredSubLink?.href || "featured"
                                            }
                                            initial={{ opacity: 0, scale: 1.1 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute inset-0"
                                          >
                                            <Image
                                              src={
                                                hoveredSubLink?.image ||
                                                item.featured.image
                                              }
                                              alt={
                                                hoveredSubLink?.label ||
                                                item.featured.title
                                              }
                                              fill
                                              className="object-cover transition-all duration-1000 group-hover/featured:scale-110 group-hover/featured:brightness-110"
                                            />
                                          </motion.div>
                                        </AnimatePresence>
                                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent" />

                                        {/* Premium overlay badge */}
                                        {!hoveredSubLink && (
                                          <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 backdrop-blur-md">
                                            <span className="text-[10px] font-light tracking-wider text-white">
                                              {t("new")}
                                            </span>
                                          </div>
                                        )}
                                      </div>

                                      {/* Dynamic content - shows hovered item's info or featured */}
                                      <AnimatePresence mode="wait">
                                        <motion.div
                                          key={
                                            hoveredSubLink?.href ||
                                            "featured-content"
                                          }
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -10 }}
                                          transition={{ duration: 0.2 }}
                                        >
                                          <h4 className="mb-2 text-[15px] font-light leading-snug tracking-wide text-white transition-all duration-300 group-hover/featured:text-neutral-200">
                                            {hoveredSubLink?.label ||
                                              item.featured.title}
                                          </h4>
                                          <p className="mb-4 text-[12px] font-light leading-relaxed text-neutral-400 transition-colors duration-300 group-hover/featured:text-neutral-300">
                                            {hoveredSubLink?.description ||
                                              item.featured.description}
                                          </p>
                                        </motion.div>
                                      </AnimatePresence>

                                      {/* Premium CTA button */}
                                      <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-sm transition-all duration-300 group-hover/featured:border-white/20 group-hover/featured:bg-white/10 group-hover/featured:shadow-lg group-hover/featured:shadow-white/5">
                                        <span className="text-[11px] font-light tracking-[0.15em] text-neutral-300 transition-colors duration-300 group-hover/featured:text-white">
                                          {hoveredSubLink
                                            ? t("viewDetails")
                                            : t("learnMore")}
                                        </span>
                                        <ArrowRight
                                          size={13}
                                          className="text-neutral-400 transition-all duration-300 group-hover/featured:translate-x-1 group-hover/featured:text-white"
                                        />
                                      </div>
                                    </Link>
                                  </motion.div>
                                </div>
                              )}
                            </div>

                            {/* Premium footer with better spacing */}
                            <div className="border-t border-white/[0.06] bg-gradient-to-r from-neutral-900/60 via-neutral-950/60 to-black/60 px-6 py-3 backdrop-blur-sm lg:px-8 lg:py-4">
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                                <Link
                                  href={item.href}
                                  className="group/footer flex items-center gap-2 text-[12px] font-light tracking-wide text-neutral-400 transition-colors duration-300 hover:text-white lg:text-[13px]"
                                  onClick={() => setActiveMenu(null)}
                                >
                                  <span>
                                    {t("viewAll")} {item.label}
                                  </span>
                                  <ArrowRight
                                    size={14}
                                    className="transition-transform duration-300 group-hover/footer:translate-x-1"
                                  />
                                </Link>
                                <Link
                                  href="/contact"
                                  className="group/cta relative overflow-hidden rounded-full border border-white/15 bg-white/5 px-5 py-2 text-center text-[10px] font-light tracking-[0.12em] text-white backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white hover:text-neutral-950 hover:shadow-lg hover:shadow-white/20 sm:px-6 sm:py-2.5 lg:text-[11px] lg:tracking-[0.15em]"
                                  onClick={() => setActiveMenu(null)}
                                >
                                  <span className="relative z-10">
                                    {t("getInTouch")}
                                  </span>
                                  <div className="absolute inset-0 -translate-x-full bg-white transition-transform duration-300 group-hover/cta:translate-x-0" />
                                </Link>
                              </div>
                            </div>

                            {/* Bottom accent line */}
                            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                          </div>
                        </motion.div>
                      )}
                    </>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                href={item.href}
                role="menuitem"
                className={`group relative text-[13px] font-light tracking-[0.1em] transition-all duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:text-white rounded ${
                  isActive(item.href) ? "text-white" : "text-neutral-300"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-[1.5px] rounded-full bg-white transition-all duration-500 ease-out group-hover:w-full group-focus-visible:w-full ${
                    isActive(item.href) ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
