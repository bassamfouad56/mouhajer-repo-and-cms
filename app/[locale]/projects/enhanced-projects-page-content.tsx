"use client";

import { useRef, useState, useEffect, useMemo, lazy, Suspense } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { urlForImage, getSafeImageUrl } from "@/sanity/lib/image";
import { SafeImage } from "@/components/safe-image";
import { Search, X } from "lucide-react";
import { CategoryTabs } from "@/components/projects/filters/CategoryTabs";
import { FilterSidebar } from "@/components/projects/filters/FilterSidebar";
import { AppliedFilters } from "@/components/projects/filters/AppliedFilters";
import type {
  ProjectFilters,
  MainCategory,
  CategoryCount,
} from "@/types/filters";
import { VideoBackground } from "@/components/projects/video-background";

// Import all view modes
import {
  GridView,
  MasonryView,
  HorizontalScrollView,
  InfiniteScrollView,
  CaseStudyView,
  SplitScreenView,
  StackedCardsView,
  TimelineView,
  Immersive3DView,
  CinematicView,
  ViewModeSelector,
  VIEW_MODE_CONFIG,
  type ViewMode,
  type GridColumns,
  type SanityProject,
} from "@/components/projects/view-modes";

// Type for raw Sanity data - now pre-localized by query
type I18nField = string | { en?: string; ar?: string };

// Taxonomy reference types
interface TaxonomyRef {
  _id: string;
  title: string;
  slug: { current: string };
}

interface LocationRef {
  _id: string;
  name: string;
  slug: { current: string };
}

interface RawSanityProject {
  _id: string;
  title: string; // Pre-localized by query
  slug: { current: string };
  excerpt?: string; // Pre-localized by query
  mainImage?: any;
  legacyCategory?: string; // Old category field for backwards compatibility
  sector?: TaxonomyRef;
  projectType?: TaxonomyRef;
  location?: LocationRef;
  services?: TaxonomyRef[];
  year?: number;
  status?: string;
  featured?: boolean;
}

// YouTube video ID for hero background
const HERO_VIDEO_ID = "9JeB0zJtPuM";

interface SanityIndustry {
  _id: string;
  title: string | { en?: string; ar?: string };
  slug: { current: string };
  excerpt?: string | { en?: string; ar?: string };
  mainImage?: any;
  icon?: string;
}

interface SanityService {
  _id: string;
  title: string | { en?: string; ar?: string };
  slug: { current: string };
  excerpt?: string | { en?: string; ar?: string };
  mainImage?: any;
  icon?: string;
}

interface ProjectsPageContentProps {
  projects: RawSanityProject[];
  industries: SanityIndustry[];
  services: SanityService[];
  locale: string;
  initialCategory?: MainCategory;
}

// Helper to extract localized string from i18n field (for legacy support)
function getLocalizedString(
  field: I18nField | undefined,
  locale: string
): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object" && field !== null) {
    return field[locale as keyof typeof field] || field.en || field.ar || "";
  }
  return "";
}

// Helper to normalize project - maps new taxonomy fields to display strings
function normalizeProject(
  project: RawSanityProject,
  locale: string
): SanityProject {
  return {
    _id: project._id,
    title: project.title || "",
    slug: project.slug,
    excerpt: project.excerpt || "",
    mainImage: project.mainImage,
    featured: project.featured,
    year: project.year,
    status: project.status,
    // Map taxonomy refs to display strings for backwards compatibility
    category: project.sector?.title || project.legacyCategory || "",
    location: project.location?.name || "",
    // Pass through taxonomy refs for filtering
    legacyCategory: project.legacyCategory,
    sector: project.sector,
    projectType: project.projectType,
    locationRef: project.location,
    services: project.services,
  };
}

export default function EnhancedProjectsPageContent({
  projects,
  industries,
  services,
  locale,
  initialCategory = "all",
}: ProjectsPageContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });

  // Track navbar visibility for sticky sidebar positioning
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastNavScrollY, setLastNavScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 100) {
        setIsNavbarVisible(true);
      } else if (currentScrollY < lastNavScrollY) {
        setIsNavbarVisible(true);
      } else if (currentScrollY > lastNavScrollY && currentScrollY > 100) {
        setIsNavbarVisible(false);
      }

      setLastNavScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastNavScrollY]);

  // Pre-process projects to normalize i18n fields
  const normalizedProjects = projects.map((p) => normalizeProject(p, locale));

  // Dynamic carousel images from Sanity projects
  const carouselImages = normalizedProjects
    .filter((p) => p.mainImage) // Only projects with images
    .slice(0, 24) // Limit to 24 images for smooth animation
    .map((p) => ({
      src: getSafeImageUrl(p.mainImage, 800, 600, "/placeholder.jpg"),
      title: p.title || "",
    }));

  // State for hovered carousel image
  const [hoveredImage, setHoveredImage] = useState<{
    src: string;
    title: string;
  } | null>(null);

  // Get initial values from URL
  const viewFromUrl = (searchParams.get("view") as ViewMode) || "grid";
  const columnsFromUrl = searchParams.get("columns");
  const searchFromUrl = searchParams.get("search") || "";
  const filterFromUrl =
    (searchParams.get("filter") as MainCategory) || initialCategory;
  const projectTypesFromUrl =
    searchParams.get("types")?.split(",").filter(Boolean) || [];
  const locationsFromUrl =
    searchParams.get("locations")?.split(",").filter(Boolean) || [];
  const servicesFromUrl =
    searchParams.get("services")?.split(",").filter(Boolean) || [];

  // New filter state
  const [filters, setFilters] = useState<ProjectFilters>({
    category: filterFromUrl,
    projectTypes: projectTypesFromUrl,
    locations: locationsFromUrl,
    services: servicesFromUrl,
    search: searchFromUrl,
  });
  const [viewMode, setViewMode] = useState<ViewMode>(viewFromUrl);
  const [gridColumns, setGridColumns] = useState<GridColumns>(
    columnsFromUrl ? (parseInt(columnsFromUrl) as GridColumns) : 3
  );
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    // Add filter (category) parameter
    if (filters.category && filters.category !== "all") {
      params.set("filter", filters.category);
    }

    if (viewMode !== "grid") {
      params.set("view", viewMode);
    }

    if (viewMode === "grid" && gridColumns !== 3) {
      params.set("columns", gridColumns.toString());
    }

    if (filters.search.trim()) {
      params.set("search", filters.search.trim());
    }

    if (filters.projectTypes.length > 0) {
      params.set("types", filters.projectTypes.join(","));
    }

    if (filters.locations.length > 0) {
      params.set("locations", filters.locations.join(","));
    }

    if (filters.services.length > 0) {
      params.set("services", filters.services.join(","));
    }

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;

    router.push(newUrl, { scroll: false });
  }, [filters, viewMode, gridColumns, router]);

  // Separate featured and regular projects (using normalized data)
  const featuredProjects = normalizedProjects.filter((p) => p.featured);
  const regularProjects = normalizedProjects.filter((p) => !p.featured);

  // Helper function to check if project matches filters
  const matchesFilters = (project: SanityProject) => {
    // Main category filter - use sector slug OR legacy category
    if (filters.category && filters.category !== "all") {
      if (filters.category === "ongoing") {
        // Check year >= current year OR status is 'in-progress'
        const currentYear = new Date().getFullYear();
        const projectYear =
          typeof project.year === "number"
            ? project.year
            : parseInt(String(project.year)) || 0;
        const isOngoing =
          projectYear >= currentYear || project.status === "in-progress";
        if (!isOngoing) return false;
      } else {
        // Match against sector slug or legacy category
        const sectorSlug = project.sector?.slug?.current?.toLowerCase() || "";
        const sectorTitle = project.sector?.title?.toLowerCase() || "";
        const legacyCategory = project.legacyCategory?.toLowerCase() || "";

        // Check if any match the filter category
        const categoryMatches =
          sectorSlug === filters.category ||
          sectorSlug.includes(filters.category) ||
          sectorTitle.includes(filters.category) ||
          legacyCategory === filters.category ||
          legacyCategory.includes(filters.category);

        if (!categoryMatches) return false;
      }
    }

    // Search filter - search across multiple fields including taxonomy
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase().trim();
      const matchesSearch =
        project.title?.toLowerCase().includes(query) ||
        project.sector?.title?.toLowerCase().includes(query) ||
        project.projectType?.title?.toLowerCase().includes(query) ||
        project.locationRef?.name?.toLowerCase().includes(query) ||
        project.location?.toLowerCase().includes(query) ||
        project.excerpt?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Project Type filter - use projectType slug and title
    if (filters.projectTypes.length > 0) {
      const typeSlug = project.projectType?.slug?.current?.toLowerCase() || "";
      const typeTitle = project.projectType?.title?.toLowerCase() || "";
      const matchesType = filters.projectTypes.some((type) => {
        const typeLower = type.toLowerCase();
        return typeSlug.includes(typeLower) || typeTitle.includes(typeLower);
      });
      if (!matchesType) return false;
    }

    // Location filter - use locationRef name
    if (filters.locations.length > 0) {
      const locationName =
        project.locationRef?.name?.toLowerCase() ||
        project.location?.toLowerCase() ||
        "";
      const matchesLocation = filters.locations.some((loc) =>
        locationName.includes(loc.toLowerCase())
      );
      if (!matchesLocation) return false;
    }

    // Service filter - use service slugs from services array
    if (filters.services.length > 0) {
      const projectServiceSlugs =
        project.services?.map((s) => s.slug?.current) || [];
      const matchesService = filters.services.some((serviceSlug) =>
        projectServiceSlugs.includes(serviceSlug)
      );
      if (!matchesService) return false;
    }

    return true;
  };

  // Filter projects
  const filteredFeaturedProjects = featuredProjects.filter(matchesFilters);
  const filteredRegularProjects = regularProjects.filter(matchesFilters);

  // All filtered projects combined
  const allFilteredProjects = [
    ...filteredFeaturedProjects,
    ...filteredRegularProjects,
  ];

  // Calculate category counts based on actual project data (using sector for taxonomy)
  const categoryCounts: CategoryCount = useMemo(
    () => ({
      residential: normalizedProjects.filter((p) => {
        const sectorSlug = p.sector?.slug?.current?.toLowerCase() || "";
        const sectorTitle = p.sector?.title?.toLowerCase() || "";
        const legacy = p.legacyCategory?.toLowerCase() || "";
        return (
          sectorSlug.includes("resid") ||
          sectorTitle.includes("resid") ||
          legacy.includes("resid")
        );
      }).length,
      commercial: normalizedProjects.filter((p) => {
        const sectorSlug = p.sector?.slug?.current?.toLowerCase() || "";
        const sectorTitle = p.sector?.title?.toLowerCase() || "";
        const legacy = p.legacyCategory?.toLowerCase() || "";
        return (
          sectorSlug.includes("commer") ||
          sectorTitle.includes("commer") ||
          legacy.includes("commer")
        );
      }).length,
      hospitality: normalizedProjects.filter((p) => {
        const sectorSlug = p.sector?.slug?.current?.toLowerCase() || "";
        const sectorTitle = p.sector?.title?.toLowerCase() || "";
        const legacy = p.legacyCategory?.toLowerCase() || "";
        return (
          sectorSlug.includes("hospit") ||
          sectorTitle.includes("hospit") ||
          legacy.includes("hospit")
        );
      }).length,
      ongoing: normalizedProjects.filter((p) => {
        const currentYear = new Date().getFullYear();
        const projectYear =
          typeof p.year === "number" ? p.year : parseInt(String(p.year)) || 0;
        return projectYear >= currentYear || p.status === "in-progress";
      }).length,
    }),
    [normalizedProjects]
  );

  // Render the active view
  const renderProjectsView = (projectsToRender: SanityProject[]) => {
    switch (viewMode) {
      case "grid":
        return <GridView projects={projectsToRender} columns={gridColumns} />;
      case "masonry":
        return <MasonryView projects={projectsToRender} />;
      case "horizontal":
        return <HorizontalScrollView projects={projectsToRender} />;
      case "infinite-scroll":
        return <InfiniteScrollView projects={projectsToRender} />;
      case "case-study":
        return <CaseStudyView projects={projectsToRender} />;
      case "split-screen":
        return <SplitScreenView projects={projectsToRender} />;
      case "stacked-cards":
        return <StackedCardsView projects={projectsToRender} />;
      case "timeline":
        return <TimelineView projects={projectsToRender} />;
      case "immersive-3d":
        return <Immersive3DView projects={projectsToRender} />;
      case "cinematic":
        return <CinematicView projects={projectsToRender} />;
      default:
        return <GridView projects={projectsToRender} columns={gridColumns} />;
    }
  };

  // Check if view uses combined projects (no featured/regular separation)
  // Also use combined view when any filter is active
  const hasActiveFilters =
    filters.category !== "all" ||
    filters.projectTypes.length > 0 ||
    filters.locations.length > 0 ||
    filters.services.length > 0 ||
    filters.search.trim() !== "";
  const usesCombinedView =
    hasActiveFilters ||
    ["horizontal", "split-screen", "stacked-cards", "infinite-scroll"].includes(
      viewMode
    );

  return (
    <main className="relative bg-white">
      {/* Professional Hero Section with YouTube Video Background */}
      <section
        ref={heroRef}
        className="relative h-screen min-h-[800px] overflow-hidden bg-neutral-950"
      >
        {/* YouTube Video Background */}
        <div className="absolute inset-0 z-0">
          <iframe
            className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-screen w-[177.77vh] min-w-full -translate-x-1/2 -translate-y-1/2"
            src={`https://www.youtube.com/embed/${HERO_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${HERO_VIDEO_ID}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
            title="MIDC Portfolio Showcase"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Hovered Image Overlay */}
        <AnimatePresence>
          {hoveredImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute inset-0 z-5 flex items-center justify-center"
            >
              {/* Background blur */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

              {/* Image */}
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="relative z-10 h-[75vh] w-[85vw] overflow-hidden rounded-xl border border-white/10 shadow-2xl lg:h-[70vh] lg:w-[80vw]"
              >
                <SafeImage
                  src={hoveredImage.src}
                  alt={hoveredImage.title}
                  fill
                  className="object-cover"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                {/* Image title */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-SchnyderS text-4xl font-light text-white md:text-5xl lg:text-6xl"
                  >
                    {hoveredImage.title}
                  </motion.h3>
                </div>

                {/* Decorative corner accents */}
                <div className="pointer-events-none absolute left-6 top-6 h-16 w-16 border-l-2 border-t-2 border-[#c9a962]/60" />
                <div className="pointer-events-none absolute bottom-6 right-6 h-16 w-16 border-b-2 border-r-2 border-[#c9a962]/60" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-neutral-950/60 to-neutral-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-neutral-950/40 to-neutral-950/30" />

        {/* Animated Grain Effect */}
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Subtle Grid Pattern */}

        {/* Floating Decorative Lines */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute right-[15%] top-[25%] h-px w-40 bg-gradient-to-r from-transparent via-[#c9a962]/30 to-transparent"
            animate={{ x: [0, 50, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute left-[5%] top-[65%] h-px w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: [0, -30, 0], opacity: [0.1, 0.3, 0.1] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute right-[25%] bottom-[20%] h-40 w-px bg-gradient-to-b from-transparent via-[#c9a962]/20 to-transparent"
            animate={{ y: [0, 20, 0], opacity: [0.1, 0.3, 0.1] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 flex h-full flex-col items-start justify-center px-6 lg:px-24"
        >
          <div className="max-w-[1400px]">
            {/* Minimal Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-8 flex items-center gap-4"
            >
              <div className="h-px w-12 bg-[#c9a962]/50" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">
                Our Portfolio
              </span>
            </motion.div>

            {/* Hero Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 1.2,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mb-8 font-SchnyderS text-6xl font-light tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl"
            >
              400+ Projects.
              <br />
              <span className="text-[#c9a962]">Zero Failures.</span>
            </motion.h1>

            {/* Hero Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 1.2,
                delay: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mb-16 max-w-2xl font-Satoshi text-xl font-light leading-relaxed text-white/70 sm:text-2xl"
            >
              From empty land to final handover. One team. One vision.
              <br />
              No handover has ever been refused.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 1.2,
                delay: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="grid gap-12 sm:grid-cols-3"
            >
              <div className="border-l border-[#c9a962]/30 pl-6">
                <div className="mb-2 font-SchnyderS text-5xl font-light text-white lg:text-6xl">
                  400+
                </div>
                <div className="font-Satoshi text-[10px] uppercase tracking-[0.3em] text-white/40">
                  Completed Projects
                </div>
              </div>
              <div className="border-l border-white/10 pl-6">
                <div className="mb-2 font-SchnyderS text-5xl font-light text-white lg:text-6xl">
                  24
                </div>
                <div className="font-Satoshi text-[10px] uppercase tracking-[0.3em] text-white/40">
                  Years in Business
                </div>
              </div>
              <div className="border-l border-white/10 pl-6">
                <div className="mb-2 font-SchnyderS text-5xl font-light text-white lg:text-6xl">
                  100%
                </div>
                <div className="font-Satoshi text-[10px] uppercase tracking-[0.3em] text-white/40">
                  Successful Handovers
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Corner Accents */}
        <div className="absolute left-8 top-32 h-24 w-24 border-l border-t border-[#c9a962]/20" />
        <div className="absolute bottom-32 right-8 h-24 w-24 border-b border-r border-[#c9a962]/20" />
      </section>

      {/* Infinite Animated Carousel */}
      <section className="relative overflow-hidden bg-neutral-950 py-8">
        <div className="flex">
          {/* First set - scrolling left */}
          <motion.div
            className="flex shrink-0 gap-4"
            animate={{ x: [0, -1920] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {[...carouselImages, ...carouselImages].map((image, index) => (
              <div
                key={`carousel-1-${index}`}
                className="group relative h-32 w-48 flex-shrink-0 cursor-pointer overflow-hidden lg:h-40 lg:w-64"
                onMouseEnter={() => setHoveredImage(image)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <SafeImage
                  src={image.src}
                  alt={image.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-neutral-950/30 transition-opacity duration-500 group-hover:opacity-0" />
                <div className="absolute inset-0 flex items-end justify-center p-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="bg-neutral-950/80 px-3 py-1 text-[10px] uppercase tracking-wider text-white backdrop-blur-sm">
                    {image.title}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
          {/* Second set - continuous */}
          <motion.div
            className="flex shrink-0 gap-4"
            animate={{ x: [0, -1920] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {[...carouselImages, ...carouselImages].map((image, index) => (
              <div
                key={`carousel-2-${index}`}
                className="group relative h-32 w-48 flex-shrink-0 cursor-pointer overflow-hidden lg:h-40 lg:w-64"
                onMouseEnter={() => setHoveredImage(image)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <SafeImage
                  src={image.src}
                  alt={image.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-neutral-950/30 transition-opacity duration-500 group-hover:opacity-0" />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Gradient fades on edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-neutral-950 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-neutral-950 to-transparent" />
      </section>

      {/* Category Tabs */}
      <CategoryTabs
        selected={filters.category}
        onChange={(category) => {
          setFilters({ ...filters, category });
        }}
        counts={categoryCounts}
      />

      {/* Main Content Area with Sidebar */}
      <div className="mx-auto flex max-w-[1800px] gap-8 px-6 py-8 lg:px-12">
        {/* Filter Sidebar */}
        <aside className="hidden w-80 shrink-0 lg:block">
          <div
            className={`sticky transition-all duration-300 ${
              isNavbarVisible ? "top-40" : "top-16"
            }`}
          >
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              services={services}
            />
          </div>
        </aside>

        {/* Projects Area */}
        <div className="flex-1">
          {/* Search Bar + Applied Filters + View Selector */}
          <div className="mb-6 space-y-4">
            {/* Search + View Mode */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Search Input */}
              <div className="relative">
                <div
                  className={`flex items-center gap-2 border bg-white px-4 py-2 transition-all duration-300 ${
                    isSearchFocused
                      ? "border-neutral-950 shadow-md"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <Search size={16} className="text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full min-w-[200px] bg-transparent font-Satoshi text-sm text-neutral-950 outline-none placeholder:text-neutral-400 lg:w-64"
                  />
                  {filters.search && (
                    <button
                      onClick={() => setFilters({ ...filters, search: "" })}
                      className="text-neutral-400 transition-colors hover:text-neutral-950"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* View Mode Selector */}
              <ViewModeSelector
                currentView={viewMode}
                onViewChange={setViewMode}
                gridColumns={gridColumns}
                onGridColumnsChange={setGridColumns}
              />
            </div>

            {/* Applied Filters */}
            <AppliedFilters filters={filters} onChange={setFilters} />
          </div>

          {/* Current View Mode Indicator */}
          <div className="mb-6 flex items-center justify-between border-b border-neutral-100 bg-neutral-50/50 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-neutral-400">
                {VIEW_MODE_CONFIG[viewMode].icon}
              </span>
              <span className="font-Satoshi text-sm text-neutral-600">
                <span className="font-medium text-neutral-950">
                  {VIEW_MODE_CONFIG[viewMode].label}
                </span>
                {" · "}
                {VIEW_MODE_CONFIG[viewMode].description}
                {filters.search && (
                  <span className="ml-2 text-neutral-400">
                    · Searching for &quot;{filters.search}&quot;
                  </span>
                )}
              </span>
            </div>
            <span className="font-Satoshi text-sm text-neutral-500">
              {allFilteredProjects.length}{" "}
              {allFilteredProjects.length === 1 ? "project" : "projects"}
            </span>
          </div>

          {/* Projects Display */}
          <div
            className={`relative ${
              ["horizontal", "split-screen", "stacked-cards"].includes(viewMode)
                ? ""
                : ""
            }`}
          >
            <div
              className={`mx-auto ${
                ["horizontal", "split-screen", "stacked-cards"].includes(
                  viewMode
                )
                  ? ""
                  : "max-w-[1800px]"
              }`}
            >
              {/* For views that work best with all projects combined */}
              {usesCombinedView ? (
                <>
                  {allFilteredProjects.length > 0 ? (
                    renderProjectsView(allFilteredProjects)
                  ) : (
                    <NoProjectsFound
                      searchQuery={filters.search}
                      onClear={() => {
                        setFilters({
                          category: "all",
                          projectTypes: [],
                          locations: [],
                          services: [],
                          search: "",
                        });
                      }}
                    />
                  )}
                </>
              ) : (
                <>
                  {/* Featured Projects Section */}
                  {filteredFeaturedProjects.length > 0 && (
                    <div className="mb-24">
                      <div className="mb-12 flex items-center justify-between">
                        <h2 className="font-SchnyderS text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                          Featured Projects
                        </h2>
                        <div className="font-Satoshi text-sm text-neutral-500">
                          {filteredFeaturedProjects.length}{" "}
                          {filteredFeaturedProjects.length === 1
                            ? "Project"
                            : "Projects"}
                        </div>
                      </div>
                      {renderProjectsView(filteredFeaturedProjects)}
                    </div>
                  )}

                  {/* Regular Projects Section */}
                  {filteredRegularProjects.length > 0 && (
                    <div>
                      {filteredFeaturedProjects.length > 0 && (
                        <div className="mb-12 flex items-center justify-between border-t border-neutral-200 pt-12">
                          <h2 className="font-SchnyderS text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                            All Projects
                          </h2>
                          <div className="font-Satoshi text-sm text-neutral-500">
                            {filteredRegularProjects.length}{" "}
                            {filteredRegularProjects.length === 1
                              ? "Project"
                              : "Projects"}
                          </div>
                        </div>
                      )}
                      {renderProjectsView(filteredRegularProjects)}
                    </div>
                  )}

                  {/* No Projects Found */}
                  {filteredFeaturedProjects.length === 0 &&
                    filteredRegularProjects.length === 0 && (
                      <NoProjectsFound
                        searchQuery={filters.search}
                        onClear={() => {
                          setFilters({
                            category: "all",
                            projectTypes: [],
                            locations: [],
                            search: "",
                          });
                        }}
                      />
                    )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Industries Section with Background */}

      {/* Professional CTA Section with Background */}
      <section className="relative overflow-hidden bg-neutral-950 px-6 py-32 lg:px-12">
        {/* Background Image */}
        <div className="absolute inset-0">
          <SafeImage
            src="/website%202.0%20content/projects/hospitality/_DSC3629-HDR.jpg"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-neutral-950/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/50 h-full" />
        </div>

        {/* Animated Lines */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute left-[10%] top-[30%] h-px w-24 bg-gradient-to-r from-transparent via-[#c9a962]/30 to-transparent"
            animate={{ x: [0, 30, 0], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[15%] bottom-[40%] h-px w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: [0, -20, 0], opacity: [0.1, 0.3, 0.1] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>

        {/* Corner Accents */}
        <div className="absolute left-8 top-8 h-16 w-16 border-l border-t border-[#c9a962]/20" />
        <div className="absolute bottom-8 right-8 h-16 w-16 border-b border-r border-[#c9a962]/20" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-4 flex items-center justify-center gap-4"
          >
            <div className="h-px w-8 bg-[#c9a962]/50" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">
              Let&apos;s Build Together
            </span>
            <div className="h-px w-8 bg-[#c9a962]/50" />
          </motion.div>
          <h2 className="mb-6 font-SchnyderS text-4xl font-light tracking-tight text-white lg:text-5xl xl:text-6xl">
            Start Your Project
          </h2>
          <p className="mb-10 font-Satoshi text-lg font-light text-white/60">
            One team. From land to handover. Let&apos;s build something
            extraordinary.
          </p>
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-3 border border-[#c9a962] bg-[#c9a962]/10 px-12 py-4 font-Satoshi text-xs uppercase tracking-[0.3em] text-[#c9a962] transition-all duration-500 hover:bg-[#c9a962] hover:text-neutral-950"
          >
            Get in Touch
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}

// No Projects Found Component
function NoProjectsFound({
  searchQuery,
  onClear,
}: {
  searchQuery?: string;
  onClear?: () => void;
}) {
  return (
    <div className="py-32 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
        <Search size={32} className="text-neutral-400" />
      </div>
      <h3 className="mb-4 font-SchnyderS text-3xl font-light tracking-tight text-neutral-950">
        No projects found
      </h3>
      <p className="mb-6 font-Satoshi text-lg text-neutral-500">
        {searchQuery
          ? `No projects match "${searchQuery}". Try a different search term or category.`
          : "Try selecting a different category or adjusting your filters."}
      </p>
      {onClear && (
        <button
          onClick={onClear}
          className="inline-flex items-center gap-2 border border-neutral-950 px-6 py-3 font-Satoshi text-sm uppercase tracking-wider text-neutral-950 transition-all hover:bg-neutral-950 hover:text-white"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}

// Industry Card Component
function IndustryCard({
  industry,
  index,
  locale,
}: {
  industry: SanityIndustry;
  index: number;
  locale: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  const title = getLocalizedString(industry.title, locale);
  const excerpt = getLocalizedString(industry.excerpt, locale);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      <Link
        href={`/industries/${industry.slug.current}`}
        className="group flex h-full flex-col border border-neutral-200 p-8 transition-all duration-500 hover:border-neutral-950 hover:bg-neutral-950"
      >
        <h3 className="mb-2 font-SchnyderS text-xl font-light tracking-tight text-neutral-950 transition-colors duration-500 group-hover:text-white">
          {title}
        </h3>
        {excerpt && (
          <p className="flex-1 font-Satoshi text-sm font-light text-neutral-600 transition-colors duration-500 group-hover:text-neutral-300">
            {excerpt}
          </p>
        )}
      </Link>
    </motion.div>
  );
}
