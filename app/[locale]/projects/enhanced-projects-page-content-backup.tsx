'use client';

import { useRef, useState, useEffect, lazy, Suspense } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { urlForImage } from '@/sanity/lib/image';
import { SafeImage } from '@/components/safe-image';
import { Search, X } from 'lucide-react';
import { CategoryTabs } from '@/components/projects/filters/CategoryTabs';
import { FilterSidebar } from '@/components/projects/filters/FilterSidebar';
import { AppliedFilters } from '@/components/projects/filters/AppliedFilters';
import type { ProjectFilters, MainCategory, CategoryCount } from '@/types/filters';

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
} from '@/components/projects/view-modes';

// Type for raw Sanity data with potential i18n fields
type I18nField = string | { en?: string; ar?: string };
interface RawSanityProject {
  _id: string;
  title: I18nField;
  slug: { current: string };
  excerpt?: I18nField;
  mainImage?: any;
  category?: I18nField;
  location?: I18nField;
  year?: string;
  featured?: boolean;
}

// YouTube video ID for hero background
const HERO_VIDEO_ID = '9JeB0zJtPuM';

interface SanityIndustry {
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
  locale: string;
  initialCategory?: MainCategory;
}

// Helper to extract localized string from i18n field
function getLocalizedString(field: I18nField | undefined, locale: string): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  if (typeof field === 'object' && field !== null) {
    return field[locale as keyof typeof field] || field.en || field.ar || '';
  }
  return '';
}

// Helper to normalize project i18n fields to strings
function normalizeProject(project: RawSanityProject, locale: string): SanityProject {
  return {
    ...project,
    title: getLocalizedString(project.title, locale),
    excerpt: getLocalizedString(project.excerpt, locale),
    category: getLocalizedString(project.category, locale),
    location: getLocalizedString(project.location, locale),
  };
}

export default function EnhancedProjectsPageContent({ projects, industries, locale, initialCategory = 'all' }: ProjectsPageContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });

  // Pre-process projects to normalize i18n fields
  const normalizedProjects = projects.map(p => normalizeProject(p, locale));

  // Dynamic carousel images from Sanity projects
  const carouselImages = normalizedProjects
    .filter(p => p.mainImage) // Only projects with images
    .slice(0, 24) // Limit to 24 images for smooth animation
    .map(p => ({
      src: urlForImage(p.mainImage)?.width(800).height(600).quality(90).url() || '',
      title: p.title || '',
    }));

  // Get initial values from URL
  const viewFromUrl = (searchParams.get('view') as ViewMode) || 'grid';
  const columnsFromUrl = searchParams.get('columns');
  const searchFromUrl = searchParams.get('search') || '';
  const projectTypesFromUrl = searchParams.get('types')?.split(',').filter(Boolean) || [];
  const locationsFromUrl = searchParams.get('locations')?.split(',').filter(Boolean) || [];

  // New filter state
  const [filters, setFilters] = useState<ProjectFilters>({
    category: initialCategory,
    projectTypes: projectTypesFromUrl,
    locations: locationsFromUrl,
    search: searchFromUrl,
  });
  const [viewMode, setViewMode] = useState<ViewMode>(viewFromUrl);
  const [gridColumns, setGridColumns] = useState<GridColumns>(
    columnsFromUrl ? (parseInt(columnsFromUrl) as GridColumns) : 3
  );
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (viewMode !== 'grid') {
      params.set('view', viewMode);
    }

    if (viewMode === 'grid' && gridColumns !== 3) {
      params.set('columns', gridColumns.toString());
    }

    if (filters.search.trim()) {
      params.set('search', filters.search.trim());
    }

    if (filters.projectTypes.length > 0) {
      params.set('types', filters.projectTypes.join(','));
    }

    if (filters.locations.length > 0) {
      params.set('locations', filters.locations.join(','));
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
    // Search filter
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase().trim();
      const matchesSearch =
        project.title?.toLowerCase().includes(query) ||
        project.category?.toLowerCase().includes(query) ||
        project.location?.toLowerCase().includes(query) ||
        project.excerpt?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Project Type filter (client-side refinement)
    // Check if project category/type matches selected project types
    if (filters.projectTypes.length > 0) {
      const projectCategory = project.category?.toLowerCase() || '';
      const matchesType = filters.projectTypes.some(type =>
        projectCategory.includes(type.toLowerCase()) ||
        project.title?.toLowerCase().includes(type.toLowerCase())
      );
      if (!matchesType) return false;
    }

    // Location filter (client-side refinement)
    if (filters.locations.length > 0) {
      const projectLocation = project.location?.toLowerCase() || '';
      const matchesLocation = filters.locations.some(loc =>
        projectLocation.includes(loc.toLowerCase())
      );
      if (!matchesLocation) return false;
    }

    return true;
  };

  // Filter projects
  const filteredFeaturedProjects = featuredProjects.filter(matchesFilters);
  const filteredRegularProjects = regularProjects.filter(matchesFilters);

  // All filtered projects combined
  const allFilteredProjects = [...filteredFeaturedProjects, ...filteredRegularProjects];

  // Calculate category counts (simplified - in production this would come from server)
  // Note: These counts are approximate when viewing filtered results
  const categoryCounts: CategoryCount = {
    residential: normalizedProjects.length, // Will be accurate on category pages
    commercial: normalizedProjects.length,
    hospitality: normalizedProjects.length,
    ongoing: normalizedProjects.length,
  };

  // Render the active view
  const renderProjectsView = (projectsToRender: SanityProject[]) => {
    switch (viewMode) {
      case 'grid':
        return <GridView projects={projectsToRender} columns={gridColumns} />;
      case 'masonry':
        return <MasonryView projects={projectsToRender} />;
      case 'horizontal':
        return <HorizontalScrollView projects={projectsToRender} />;
      case 'infinite-scroll':
        return <InfiniteScrollView projects={projectsToRender} />;
      case 'case-study':
        return <CaseStudyView projects={projectsToRender} />;
      case 'split-screen':
        return <SplitScreenView projects={projectsToRender} />;
      case 'stacked-cards':
        return <StackedCardsView projects={projectsToRender} />;
      case 'timeline':
        return <TimelineView projects={projectsToRender} />;
      case 'immersive-3d':
        return <Immersive3DView projects={projectsToRender} />;
      case 'cinematic':
        return <CinematicView projects={projectsToRender} />;
      default:
        return <GridView projects={projectsToRender} columns={gridColumns} />;
    }
  };

  // Check if view uses combined projects (no featured/regular separation)
  const usesCombinedView = ['horizontal', 'split-screen', 'stacked-cards', 'infinite-scroll'].includes(viewMode);

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

        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-neutral-950/60 to-neutral-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-neutral-950/40 to-neutral-950/30" />

        {/* Animated Grain Effect */}
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          }}
        />

        {/* Subtle Grid Pattern */}

        {/* Floating Decorative Lines */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute right-[15%] top-[25%] h-px w-40 bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent"
            animate={{ x: [0, 50, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute left-[5%] top-[65%] h-px w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: [0, -30, 0], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          <motion.div
            className="absolute right-[25%] bottom-[20%] h-40 w-px bg-gradient-to-b from-transparent via-[#d4af37]/20 to-transparent"
            animate={{ y: [0, 20, 0], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
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
              <div className="h-px w-12 bg-[#d4af37]/50" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">
                Our Portfolio
              </span>
            </motion.div>

            {/* Hero Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8 font-SchnyderS text-6xl font-light tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl"
            >
              400+ Projects.
              <br />
              <span className="text-[#d4af37]">Zero Failures.</span>
            </motion.h1>

            {/* Hero Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-16 max-w-2xl font-Satoshi text-xl font-light leading-relaxed text-white/70 sm:text-2xl"
            >
              From empty land to final handover. One team. One vision.
              <br />No handover has ever been refused.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-12 sm:grid-cols-3"
            >
              <div className="border-l border-[#d4af37]/30 pl-6">
                <div className="mb-2 font-SchnyderS text-5xl font-light text-white lg:text-6xl">400+</div>
                <div className="font-Satoshi text-[10px] uppercase tracking-[0.3em] text-white/40">
                  Completed Projects
                </div>
              </div>
              <div className="border-l border-white/10 pl-6">
                <div className="mb-2 font-SchnyderS text-5xl font-light text-white lg:text-6xl">24</div>
                <div className="font-Satoshi text-[10px] uppercase tracking-[0.3em] text-white/40">
                  Years in Business
                </div>
              </div>
              <div className="border-l border-white/10 pl-6">
                <div className="mb-2 font-SchnyderS text-5xl font-light text-white lg:text-6xl">100%</div>
                <div className="font-Satoshi text-[10px] uppercase tracking-[0.3em] text-white/40">
                  Successful Handovers
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Corner Accents */}
        <div className="absolute left-8 top-32 h-24 w-24 border-l border-t border-[#d4af37]/20" />
        <div className="absolute bottom-32 right-8 h-24 w-24 border-b border-r border-[#d4af37]/20" />
      </section>

      {/* Infinite Animated Carousel */}
      <section className="relative overflow-hidden bg-neutral-950 py-8">
        <div className="flex">
          {/* First set - scrolling left */}
          <motion.div
            className="flex shrink-0 gap-4"
            animate={{ x: [0, -1920] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            {[...carouselImages, ...carouselImages].map((image, index) => (
              <div
                key={`carousel-1-${index}`}
                className="group relative h-32 w-48 flex-shrink-0 overflow-hidden lg:h-40 lg:w-64"
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
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            {[...carouselImages, ...carouselImages].map((image, index) => (
              <div
                key={`carousel-2-${index}`}
                className="group relative h-32 w-48 flex-shrink-0 overflow-hidden lg:h-40 lg:w-64"
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
          // Navigate to category route if not 'all'
          if (category !== 'all') {
            router.push(`/${locale}/projects/${category}`);
          } else {
            router.push(`/${locale}/projects`);
          }
        }}
        counts={categoryCounts}
      />

      {/* Main Content Area with Sidebar */}
      <div className="mx-auto flex max-w-[1800px] gap-8 px-6 py-8 lg:px-12">
        {/* Filter Sidebar */}
        <aside className="hidden w-80 shrink-0 lg:block">
          <div className="sticky top-24">
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              category={filters.category}
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
                      ? 'border-neutral-950 shadow-md'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <Search size={16} className="text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full min-w-[200px] bg-transparent font-Satoshi text-sm text-neutral-950 outline-none placeholder:text-neutral-400 lg:w-64"
                  />
                  {filters.search && (
                    <button
                      onClick={() => setFilters({ ...filters, search: '' })}
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
              <span className="text-neutral-400">{VIEW_MODE_CONFIG[viewMode].icon}</span>
              <span className="font-Satoshi text-sm text-neutral-600">
                <span className="font-medium text-neutral-950">{VIEW_MODE_CONFIG[viewMode].label}</span>
                {' · '}
                {VIEW_MODE_CONFIG[viewMode].description}
                {filters.search && (
                  <span className="ml-2 text-neutral-400">
                    · Searching for &quot;{filters.search}&quot;
                  </span>
                )}
              </span>
            </div>
            <span className="font-Satoshi text-sm text-neutral-500">
              {allFilteredProjects.length} {allFilteredProjects.length === 1 ? 'project' : 'projects'}
            </span>
          </div>

          {/* Projects Display */}
          <div className={`relative ${
            ['horizontal', 'split-screen', 'stacked-cards'].includes(viewMode) ? '' : ''
          }`}>
        <div className={`mx-auto ${
          ['horizontal', 'split-screen', 'stacked-cards'].includes(viewMode) ? '' : 'max-w-[1800px]'
        }`}>
          {/* For views that work best with all projects combined */}
          {usesCombinedView ? (
            <>
              {allFilteredProjects.length > 0 ? (
                renderProjectsView(allFilteredProjects)
              ) : (
                <NoProjectsFound
                  searchQuery={searchQuery}
                  onClear={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
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
                      {filteredFeaturedProjects.length} {filteredFeaturedProjects.length === 1 ? 'Project' : 'Projects'}
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
                        {filteredRegularProjects.length}{' '}
                        {filteredRegularProjects.length === 1 ? 'Project' : 'Projects'}
                      </div>
                    </div>
                  )}
                  {renderProjectsView(filteredRegularProjects)}
                </div>
              )}

              {/* No Projects Found */}
              {filteredFeaturedProjects.length === 0 && filteredRegularProjects.length === 0 && (
                <NoProjectsFound
                  searchQuery={filters.search}
                  onClear={() => {
                    setFilters({
                      category: 'all',
                      projectTypes: [],
                      locations: [],
                      search: '',
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
      {industries.length > 0 && (
        <section className="relative overflow-hidden bg-neutral-50 px-6 py-32 lg:px-12 lg:py-48">
          {/* Background Image */}
          <div className="absolute inset-0 opacity-5">
            <SafeImage
              src="/projects/commercial-interior/_MID7362-HDR.jpg"
              alt=""
              fill
              className="object-cover"
            />
          </div>

          {/* Grid Pattern */}

          <div className="relative z-10 mx-auto max-w-[1400px]">
            <div className="mb-16 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-4 flex items-center justify-center gap-4"
              >
                <div className="h-px w-12 bg-neutral-300" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                  Sectors of Excellence
                </span>
                <div className="h-px w-12 bg-neutral-300" />
              </motion.div>
              <h2 className="mb-6 font-SchnyderS text-5xl font-light tracking-tight text-neutral-950 lg:text-6xl">
                Industries We Serve
              </h2>
              <p className="mx-auto max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-neutral-600">
                Specialized expertise across multiple sectors
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {industries.slice(0, 8).map((industry, index) => (
                <IndustryCard key={industry._id} industry={industry} index={index} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Professional CTA Section with Background */}
      <section className="relative overflow-hidden bg-neutral-950 px-6 py-32 lg:px-12">
        {/* Background Image */}
        <div className="absolute inset-0">
          <SafeImage
            src="/projects/turnkey-design-fitout/_MID2543-HDR.jpg"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-neutral-950/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/50" />
        </div>

        {/* Animated Lines */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute left-[10%] top-[30%] h-px w-24 bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent"
            animate={{ x: [0, 30, 0], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute right-[15%] bottom-[40%] h-px w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: [0, -20, 0], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </div>

        {/* Corner Accents */}
        <div className="absolute left-8 top-8 h-16 w-16 border-l border-t border-[#d4af37]/20" />
        <div className="absolute bottom-8 right-8 h-16 w-16 border-b border-r border-[#d4af37]/20" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-4 flex items-center justify-center gap-4"
          >
            <div className="h-px w-8 bg-[#d4af37]/50" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">
              Let&apos;s Build Together
            </span>
            <div className="h-px w-8 bg-[#d4af37]/50" />
          </motion.div>
          <h2 className="mb-6 font-SchnyderS text-4xl font-light tracking-tight text-white lg:text-5xl xl:text-6xl">
            Start Your Project
          </h2>
          <p className="mb-10 font-Satoshi text-lg font-light text-white/60">
            One team. From land to handover. Let&apos;s build something extraordinary.
          </p>
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-3 border border-[#d4af37] bg-[#d4af37]/10 px-12 py-4 font-Satoshi text-xs uppercase tracking-[0.3em] text-[#d4af37] transition-all duration-500 hover:bg-[#d4af37] hover:text-neutral-950"
          >
            Get in Touch
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}

// No Projects Found Component
function NoProjectsFound({ searchQuery, onClear }: { searchQuery?: string; onClear?: () => void }) {
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
          : 'Try selecting a different category or adjusting your filters.'}
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
function IndustryCard({ industry, index, locale }: { industry: SanityIndustry; index: number; locale: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  const title = getLocalizedString(industry.title, locale);
  const excerpt = getLocalizedString(industry.excerpt, locale);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/industries/${industry.slug.current}`}
        className="group block border border-neutral-200 p-8 transition-all duration-500 hover:border-neutral-950 hover:bg-neutral-950"
      >
        <h3 className="mb-2 font-SchnyderS text-xl font-light tracking-tight text-neutral-950 transition-colors duration-500 group-hover:text-white">
          {title}
        </h3>
        {excerpt && (
          <p className="font-Satoshi text-sm font-light text-neutral-600 transition-colors duration-500 group-hover:text-neutral-300">
            {excerpt}
          </p>
        )}
      </Link>
    </motion.div>
  );
}
