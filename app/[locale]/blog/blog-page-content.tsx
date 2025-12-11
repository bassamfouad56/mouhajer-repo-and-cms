'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';
import { format } from 'date-fns';
import { Eye, Clock, ArrowRight, Play, Search, X, ChevronDown } from 'lucide-react';

interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: any;
  category?: string;
  author?: {
    name: string;
    image?: any;
  };
  readTime?: number;
  tags?: string[];
  publishedAt: string;
  featured?: boolean;
  viewCount?: number;
}

interface BlogPageContentProps {
  posts: SanityPost[];
  categories: string[];
}

const POSTS_PER_PAGE = 9;

// Category colors for badges
const categoryColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  trends: { bg: 'bg-[#d4af37]/10', text: 'text-[#d4af37]', border: 'border-[#d4af37]/30', gradient: 'from-[#d4af37]/20' },
  tips: { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-500/30', gradient: 'from-blue-500/20' },
  'case-studies': { bg: 'bg-green-500/10', text: 'text-green-600', border: 'border-green-500/30', gradient: 'from-green-500/20' },
  news: { bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-500/30', gradient: 'from-purple-500/20' },
};

// Interior design hero images
const heroImages = [
  '/projects/grand-hyatt-prince-suite/prince01.jpg',
  '/projects/park-hyatt-villa/hotelparkhyattvilla01.jpg',
  '/projects/jumeirah-bay-villa/jumeirahbay01.jpg',
];

// Helper to calculate reading time from content
function calculateReadingTime(excerpt?: string, readTime?: number): number {
  if (readTime) return readTime;
  if (excerpt) {
    const words = excerpt.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200) * 3);
  }
  return 5;
}

// Helper to format view count
function formatViews(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

export default function BlogPageContent({ posts, categories }: BlogPageContentProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter posts by category and search
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'all' || post.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const featuredPost = filteredPosts.find((p) => p.featured) || filteredPosts[0];
  const secondaryFeatured = filteredPosts.slice(1, 3);
  const regularPosts = filteredPosts.filter((p) => p._id !== featuredPost?._id && !secondaryFeatured.find(sf => sf._id === p._id));
  const visiblePosts = regularPosts.slice(0, visibleCount);
  const hasMorePosts = visibleCount < regularPosts.length;

  const loadMore = () => {
    setVisibleCount((prev) => prev + POSTS_PER_PAGE);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setVisibleCount(POSTS_PER_PAGE);
  };

  return (
    <main className="relative bg-white">
      {/* Cinematic Hero Section with Video/Image Background */}
      <section
        ref={heroRef}
        className="relative h-screen min-h-[900px] overflow-hidden bg-neutral-950"
      >
        {/* Animated Background Images */}
        <motion.div
          style={{ scale: heroScale }}
          className="absolute inset-0"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHeroImage}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={heroImages[currentHeroImage]}
                alt="Interior design showcase"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/50 to-neutral-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-transparent to-neutral-950/40" />
        </motion.div>

        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroOpacity, y: textY }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center lg:px-24"
        >
          <div className="max-w-[1200px]">
            {/* Animated Label */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-8 flex items-center justify-center gap-4"
            >
              <motion.div
                className="h-px w-16 bg-gradient-to-r from-transparent to-[#d4af37]"
                initial={{ scaleX: 0 }}
                animate={isHeroInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.5 }}
              />
              <span className="font-Satoshi text-xs uppercase tracking-[0.4em] text-[#d4af37]">
                Insights & Inspiration
              </span>
              <motion.div
                className="h-px w-16 bg-gradient-to-l from-transparent to-[#d4af37]"
                initial={{ scaleX: 0 }}
                animate={isHeroInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </motion.div>

            {/* Hero Title with Staggered Animation */}
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8 font-SchnyderS text-6xl font-light tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl"
            >
              Design
              <motion.span
                initial={{ opacity: 0, x: -30 }}
                animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 1, delay: 0.7 }}
                className="text-[#d4af37]"
              > Stories</motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0 }}
                animate={isHeroInView ? { opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.9 }}
              >
                & Expertise
              </motion.span>
            </motion.h1>

            {/* Hero Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mb-12 max-w-2xl font-Satoshi text-xl font-light leading-relaxed text-white/70 sm:text-2xl"
            >
              Behind-the-scenes insights from 400+ luxury projects across hospitality, residential, and commercial sectors.
            </motion.p>

            {/* Interactive Search & Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-8"
            >
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="group flex items-center gap-3 border border-white/30 bg-white/5 px-8 py-4 backdrop-blur-sm transition-all duration-500 hover:border-[#d4af37] hover:bg-white/10"
              >
                <Search size={18} className="text-white/60 transition-colors group-hover:text-[#d4af37]" />
                <span className="font-Satoshi text-sm font-light tracking-wider text-white/60 transition-colors group-hover:text-white">
                  Search articles...
                </span>
              </button>

              {/* Stats Row */}
              <div className="flex items-center gap-12">
                {[
                  { value: '400+', label: 'Projects' },
                  { value: '50+', label: 'Articles' },
                  { value: '15+', label: 'Years Experience' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 1.2 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="font-SchnyderS text-3xl font-light text-white lg:text-4xl">
                      {stat.value}
                    </div>
                    <div className="font-Satoshi text-[10px] uppercase tracking-[0.2em] text-white/50">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isHeroInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-12 left-1/2 z-10 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2"
          >
            <span className="font-Satoshi text-[10px] uppercase tracking-[0.3em] text-white/40">
              Scroll to Explore
            </span>
            <ChevronDown className="h-5 w-5 text-white/40" />
          </motion.div>
        </motion.div>

        {/* Image Navigation Dots */}
        <div className="absolute bottom-12 right-12 z-10 flex gap-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentHeroImage(i)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                i === currentHeroImage ? 'w-8 bg-[#d4af37]' : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-neutral-950/95 pt-32 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-3xl px-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <Search size={24} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Search articles, topics, insights..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full border-b-2 border-white/20 bg-transparent py-6 pl-16 pr-16 font-SchnyderS text-3xl font-light text-white placeholder:text-white/30 focus:border-[#d4af37] focus:outline-none"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/40 transition-colors hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Quick search suggestions */}
              <div className="mt-8 flex flex-wrap gap-3">
                {['Interior Design', 'Hospitality', 'Luxury Villas', 'Fit-Out', 'MEP Engineering'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      setIsSearchOpen(false);
                    }}
                    className="border border-white/20 px-4 py-2 font-Satoshi text-sm font-light text-white/60 transition-all hover:border-[#d4af37] hover:text-[#d4af37]"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Professional Filter Bar */}
      <section className="sticky top-20 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur-md lg:top-24">
        <div className="mx-auto max-w-[1800px] px-6 py-5 lg:px-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-3 font-Satoshi text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                Filter:
              </span>
              <button
                onClick={() => handleCategoryChange('all')}
                className={`rounded-full px-5 py-2 font-Satoshi text-xs uppercase tracking-wider transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'bg-neutral-950 text-white'
                    : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950'
                }`}
              >
                All
              </button>
              {categories.map((category) => {
                const colors = categoryColors[category] || categoryColors.news;
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`rounded-full px-5 py-2 font-Satoshi text-xs uppercase tracking-wider transition-all duration-300 ${
                      selectedCategory === category
                        ? `${colors.bg} ${colors.text} border ${colors.border}`
                        : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950'
                    }`}
                  >
                    {category.replace('-', ' ')}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 text-neutral-400 transition-colors hover:text-neutral-950"
              >
                <Search size={16} />
              </button>
              <span className="font-Satoshi text-xs font-light text-neutral-400">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post - Cinematic Full-Width */}
      {featuredPost && (
        <section className="relative bg-neutral-950">
          <FeaturedPostCard post={featuredPost} />
        </section>
      )}

      {/* Secondary Featured - Two Column */}
      {secondaryFeatured.length > 0 && (
        <section className="relative bg-white px-6 py-24 lg:px-12">
          <div className="mx-auto max-w-[1800px]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-12 flex items-end justify-between"
            >
              <div>
                <span className="mb-4 block font-Satoshi text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                  Editor&apos;s Picks
                </span>
                <h2 className="font-SchnyderS text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                  Must-Read Articles
                </h2>
              </div>
              <Link
                href="#all-articles"
                className="hidden items-center gap-2 font-Satoshi text-sm font-light text-neutral-500 transition-colors hover:text-neutral-950 md:flex"
              >
                View all articles
                <ArrowRight size={14} />
              </Link>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2">
              {secondaryFeatured.map((post, index) => (
                <SecondaryFeaturedCard key={post._id} post={post} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Visual Inspiration Gallery */}
      <section className="relative overflow-hidden bg-neutral-100 py-24">
        <div className="mx-auto max-w-[1800px] px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <span className="mb-4 block font-Satoshi text-[10px] uppercase tracking-[0.3em] text-neutral-400">
              Visual Journey
            </span>
            <h2 className="font-SchnyderS text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
              Our Work in Focus
            </h2>
          </motion.div>

          {/* Masonry-style Image Grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
            {[
              {
                src: '/projects/grand-hyatt-prince-suite/prince02.jpg',
                span: 'col-span-2 row-span-2',
                aspect: 'aspect-square',
                title: 'Grand Hyatt Prince Suite',
                category: 'Hospitality',
                slug: 'grand-hyatt-prince-suite'
              },
              {
                src: '/projects/jumeirah-island-villa/JumIsl01.jpg',
                span: '',
                aspect: 'aspect-[4/5]',
                title: 'Jumeirah Island Villa',
                category: 'Residential',
                slug: 'jumeirah-island-villa'
              },
              {
                src: '/projects/park-hyatt-villa/hotelparkhyattvilla03.jpg',
                span: '',
                aspect: 'aspect-[4/5]',
                title: 'Park Hyatt Villa',
                category: 'Hospitality',
                slug: 'park-hyatt-villa'
              },
              {
                src: '/projects/district-one-villa-79x/01.jpg',
                span: 'col-span-2',
                aspect: 'aspect-[2/1]',
                title: 'District One Villa',
                category: 'Residential',
                slug: 'district-one-villa-79x'
              },
              {
                src: '/projects/ritz-carlton-villas/ritzcarl01.jpg',
                span: '',
                aspect: 'aspect-square',
                title: 'Ritz Carlton Villas',
                category: 'Hospitality',
                slug: 'ritz-carlton-villas'
              },
              {
                src: '/projects/jumeirah-bay-villa/jumeirahbay02.jpg',
                span: '',
                aspect: 'aspect-square',
                title: 'Jumeirah Bay Villa',
                category: 'Residential',
                slug: 'jumeirah-bay-villa'
              },
            ].map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className={`group relative overflow-hidden bg-neutral-200 ${project.span} ${project.aspect}`}
              >
                <Link href={`/projects/${project.slug}`} className="block h-full w-full">
                  <Image
                    src={project.src}
                    alt={project.title}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Project Info on Hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="mb-2 block font-Satoshi text-[10px] uppercase tracking-wider text-[#d4af37]">
                      {project.category}
                    </span>
                    <h3 className="mb-3 font-SchnyderS text-xl font-light text-white lg:text-2xl">
                      {project.title}
                    </h3>
                    <span className="inline-flex items-center gap-2 font-Satoshi text-xs uppercase tracking-wider text-white/80 transition-colors hover:text-white">
                      View Project
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <Link
              href="/projects"
              className="group inline-flex items-center gap-3 border border-neutral-950 px-10 py-4 font-Satoshi text-xs uppercase tracking-[0.2em] text-neutral-950 transition-all duration-500 hover:bg-neutral-950 hover:text-white"
            >
              <span>Explore All Projects</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Regular Posts Grid */}
      {visiblePosts.length > 0 && (
        <section id="all-articles" className="relative bg-white px-6 py-24 lg:px-12">
          <div className="mx-auto max-w-[1800px]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <span className="mb-4 block font-Satoshi text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                All Articles
              </span>
              <h2 className="font-SchnyderS text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                Latest Insights
              </h2>
            </motion.div>

            <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
              {visiblePosts.map((post, index) => (
                <PostCard key={post._id} post={post} index={index} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMorePosts && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-20 flex flex-col items-center gap-4"
              >
                <span className="font-Satoshi text-sm font-light text-neutral-400">
                  Showing {visiblePosts.length} of {regularPosts.length} articles
                </span>
                <button
                  onClick={loadMore}
                  className="group relative overflow-hidden border border-neutral-950 px-12 py-5 font-Satoshi text-xs uppercase tracking-[0.2em] text-neutral-950 transition-all duration-500 hover:text-white"
                >
                  <span className="relative z-10">Load More Articles</span>
                  <div className="absolute inset-0 -translate-x-full bg-neutral-950 transition-transform duration-500 group-hover:translate-x-0" />
                </button>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* No Results */}
      {filteredPosts.length === 0 && (
        <section className="relative bg-white px-6 py-32 lg:px-12">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="mb-4 font-SchnyderS text-3xl font-light text-neutral-950">
              No articles found
            </h2>
            <p className="mb-8 font-Satoshi text-lg font-light text-neutral-500">
              Try adjusting your search or filter to find what you&apos;re looking for.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="font-Satoshi text-sm font-light text-[#d4af37] underline transition-colors hover:text-neutral-950"
            >
              Clear filters
            </button>
          </div>
        </section>
      )}

      {/* Professional CTA Section with Background Video */}
      <section className="relative overflow-hidden bg-neutral-950 px-6 py-40 lg:px-12">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/projects/grand-hyatt-prince-suite/prince05.jpg"
            alt="Interior design background"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/60" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="mb-6 block font-Satoshi text-[10px] uppercase tracking-[0.4em] text-[#d4af37]">
              Stay Connected
            </span>
            <h2 className="mb-8 font-SchnyderS text-5xl font-light tracking-tight text-white lg:text-7xl">
              Get Design
              <br />
              <span className="text-[#d4af37]">Inspiration</span>
            </h2>
            <p className="mb-12 font-Satoshi text-xl font-light text-white/60">
              Subscribe to receive exclusive insights, project showcases, and industry trends.
            </p>
            <Link
              href="/#contact"
              className="group inline-flex items-center gap-4 border border-[#d4af37] bg-[#d4af37] px-12 py-5 font-Satoshi text-sm uppercase tracking-[0.2em] text-neutral-950 transition-all duration-500 hover:bg-transparent hover:text-[#d4af37]"
            >
              <span>Subscribe Now</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

// Featured Post Card - Cinematic Full-Width
function FeaturedPostCard({ post }: { post: SanityPost }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true });
  const readingTime = calculateReadingTime(post.excerpt, post.readTime);
  const colors = categoryColors[post.category || ''] || categoryColors.news;

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative min-h-[90vh]"
    >
      {/* Full-width Background Image with Parallax */}
      <motion.div style={{ y: imageY }} className="absolute inset-0">
        {post.mainImage ? (
          <Image
            src={urlForImage(post.mainImage).width(1920).height(1080).url()}
            alt={post.title}
            fill
            className="object-cover transition-all duration-1000 group-hover:scale-105"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-800" />
        )}
      </motion.div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[90vh] items-end px-6 py-24 lg:px-24">
        <div className="max-w-3xl">
          {/* Category Badge */}
          {post.category && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-6"
            >
              <span className={`inline-block rounded-full border px-5 py-2 font-Satoshi text-xs uppercase tracking-wider backdrop-blur-sm ${colors.bg} ${colors.text} ${colors.border}`}>
                {post.category.replace('-', ' ')}
              </span>
            </motion.div>
          )}

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-6 flex flex-wrap items-center gap-6 font-Satoshi text-sm font-light text-white/60"
          >
            {post.publishedAt && (
              <span>{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</span>
            )}
            <span className="flex items-center gap-2">
              <Clock size={14} />
              {readingTime} min read
            </span>
            {post.viewCount !== undefined && post.viewCount > 0 && (
              <span className="flex items-center gap-2">
                <Eye size={14} />
                {formatViews(post.viewCount)} views
              </span>
            )}
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Link href={`/blog/${post.slug.current}`}>
              <h2 className="mb-8 font-SchnyderS text-5xl font-light leading-[1.1] tracking-tight text-white transition-colors duration-500 hover:text-[#d4af37] sm:text-6xl lg:text-7xl">
                {post.title}
              </h2>
            </Link>
          </motion.div>

          {/* Excerpt */}
          {post.excerpt && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-10 max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-white/70"
            >
              {post.excerpt}
            </motion.p>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Link
              href={`/blog/${post.slug.current}`}
              className="group/link inline-flex items-center gap-4 border border-white/30 px-8 py-4 font-Satoshi text-sm uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-all duration-500 hover:border-[#d4af37] hover:bg-[#d4af37] hover:text-neutral-950"
            >
              <span>Read Full Article</span>
              <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-2" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Featured Badge */}
      <div className="absolute right-12 top-12 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex items-center gap-3 bg-[#d4af37] px-6 py-3"
        >
          <Play size={14} className="fill-current" />
          <span className="font-Satoshi text-xs uppercase tracking-wider text-neutral-950">Featured</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Secondary Featured Card
function SecondaryFeaturedCard({ post, index }: { post: SanityPost; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });
  const readingTime = calculateReadingTime(post.excerpt, post.readTime);
  const colors = categoryColors[post.category || ''] || categoryColors.news;

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={`/blog/${post.slug.current}`} className="block">
        {/* Image with Hover Effect */}
        <div className="relative mb-8 aspect-[16/10] overflow-hidden bg-neutral-100">
          {post.mainImage ? (
            <Image
              src={urlForImage(post.mainImage).width(1200).height(750).url()}
              alt={post.title}
              fill
              className="object-cover transition-all duration-1000 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-200" />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

          {/* Category Badge */}
          {post.category && (
            <div className="absolute left-6 top-6">
              <span className={`inline-block rounded-full border px-4 py-1.5 font-Satoshi text-xs uppercase tracking-wider backdrop-blur-sm ${colors.bg} ${colors.text} ${colors.border}`}>
                {post.category.replace('-', ' ')}
              </span>
            </div>
          )}

          {/* Hover Content */}
          <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="inline-flex items-center gap-2 font-Satoshi text-xs uppercase tracking-wider text-white">
              Read Article
              <ArrowRight size={12} />
            </span>
          </div>
        </div>

        {/* Content */}
        <div>
          {/* Meta */}
          <div className="mb-4 flex items-center gap-4 font-Satoshi text-xs font-light text-neutral-500">
            {post.publishedAt && (
              <span>{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              {readingTime} min read
            </span>
          </div>

          {/* Title */}
          <h3 className="mb-4 font-SchnyderS text-3xl font-light tracking-tight text-neutral-950 transition-colors duration-500 group-hover:text-[#d4af37] lg:text-4xl">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="line-clamp-2 font-Satoshi text-base font-light leading-relaxed text-neutral-600">
              {post.excerpt}
            </p>
          )}
        </div>
      </Link>
    </motion.article>
  );
}

// Post Card - Enhanced Design
function PostCard({ post, index }: { post: SanityPost; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });
  const readingTime = calculateReadingTime(post.excerpt, post.readTime);
  const colors = categoryColors[post.category || ''] || categoryColors.news;

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col"
    >
      <Link href={`/blog/${post.slug.current}`} className="block">
        {/* Image Container with Animated Border */}
        <div className="relative mb-6 aspect-[4/3] overflow-hidden bg-neutral-100">
          {post.mainImage ? (
            <Image
              src={urlForImage(post.mainImage).width(800).height(600).url()}
              alt={post.title}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-200" />
          )}

          {/* Animated Border on Hover */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-0 top-0 h-0 w-full bg-[#d4af37] transition-all duration-500 group-hover:h-1" />
            <div className="absolute right-0 top-0 h-full w-0 bg-[#d4af37] transition-all duration-500 delay-100 group-hover:w-1" />
            <div className="absolute bottom-0 right-0 h-0 w-full bg-[#d4af37] transition-all duration-500 delay-200 group-hover:h-1" />
            <div className="absolute bottom-0 left-0 h-full w-0 bg-[#d4af37] transition-all duration-500 delay-300 group-hover:w-1" />
          </div>

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Category Badge */}
          {post.category && (
            <div className="absolute left-4 top-4">
              <span className={`inline-block rounded-full border px-3 py-1 font-Satoshi text-[10px] uppercase tracking-wider backdrop-blur-sm ${colors.bg} ${colors.text} ${colors.border}`}>
                {post.category.replace('-', ' ')}
              </span>
            </div>
          )}

          {/* Reading Time Badge */}
          <div className="absolute right-4 top-4">
            <span className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 font-Satoshi text-[10px] font-light text-neutral-700 backdrop-blur-sm">
              <Clock size={10} />
              {readingTime} min
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col">
          {/* Meta Row */}
          <div className="mb-3 flex items-center gap-3 font-Satoshi text-xs font-light text-neutral-500">
            {post.publishedAt && (
              <span>{format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>
            )}
            {post.viewCount !== undefined && post.viewCount > 0 && (
              <>
                <span className="h-1 w-1 rounded-full bg-neutral-300" />
                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  {formatViews(post.viewCount)}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="mb-3 line-clamp-2 font-SchnyderS text-2xl font-light tracking-tight text-neutral-950 transition-colors duration-300 group-hover:text-[#d4af37]">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mb-4 line-clamp-2 flex-1 font-Satoshi text-sm font-light leading-relaxed text-neutral-600">
              {post.excerpt}
            </p>
          )}

          {/* Read More Link */}
          <div className="mt-auto pt-4">
            <span className="inline-flex items-center gap-2 font-Satoshi text-xs uppercase tracking-wider text-neutral-400 transition-colors group-hover:text-[#d4af37]">
              Read Article
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
