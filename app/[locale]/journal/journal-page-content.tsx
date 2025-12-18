'use client';

import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { urlForImage } from '@/sanity/lib/image';
import { format } from 'date-fns';
import { Search, X, Clock, Eye, ArrowRight, Play } from 'lucide-react';

// Default hero image fallback
const DEFAULT_HERO_IMAGE = '/founder/CID_2106_00_COVER.jpg';

// Helper to get safe image URL from Sanity
function getSafeImageUrl(image: any, width: number, height: number): string {
  if (!image) return '';
  try {
    const url = urlForImage(image)?.width(width).height(height).url();
    return url || '';
  } catch {
    return '';
  }
}

interface Tag {
  _id: string;
  name: string;
  slug?: any;
}

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  mainImage: any;
  category: string;
  author: { name: string; image: any };
  publishedAt: string;
  readTime: number;
  featured: boolean;
  tags: Tag[];
  viewCount?: number;
}

interface JournalPageContentProps {
  posts: Post[];
  currentCategory?: string;
  locale: string;
}

const CATEGORIES = [
  { value: 'all', label: 'All', color: { bg: 'bg-neutral-950', text: 'text-white', border: 'border-neutral-950' } },
  { value: 'design-trends', label: 'Design Trends', color: { bg: 'bg-[#c9a962]/10', text: 'text-[#c9a962]', border: 'border-[#c9a962]/30' } },
  { value: 'project-stories', label: 'Project Stories', color: { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-500/30' } },
  { value: 'behind-the-scenes', label: 'Behind the Scenes', color: { bg: 'bg-green-500/10', text: 'text-green-600', border: 'border-green-500/30' } },
  { value: 'materials-craft', label: 'Materials & Craft', color: { bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-500/30' } },
  { value: 'engineering', label: 'Engineering', color: { bg: 'bg-orange-500/10', text: 'text-orange-600', border: 'border-orange-500/30' } },
  { value: 'founders-insights', label: "Founder's Insights", color: { bg: 'bg-rose-500/10', text: 'text-rose-600', border: 'border-rose-500/30' } }
];

// Helper to calculate reading time
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

// Get category color config
function getCategoryColor(category: string) {
  const cat = CATEGORIES.find(c => c.value === category);
  return cat?.color || CATEGORIES[0].color;
}

export default function JournalPageContent({
  posts,
  currentCategory: initialCategory = 'all',
  locale
}: JournalPageContentProps) {
  const searchParams = useSearchParams();
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });

  // State for filters - initialize from URL params
  const [currentCategory, setCurrentCategory] = useState(() => {
    const categoryFromUrl = searchParams.get('category');
    return categoryFromUrl || initialCategory;
  });
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const tagsParam = searchParams.get('tags');
    return tagsParam ? tagsParam.split(',') : [];
  });
  const [searchQuery, setSearchQuery] = useState(() => {
    return searchParams.get('search') || '';
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);

  // Parallax for hero
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  // Update URL when filters change (without page reload)
  const updateUrl = useCallback((category: string, tags: string[], search: string) => {
    const params = new URLSearchParams();

    if (category && category !== 'all') {
      params.set('category', category);
    }
    if (tags.length > 0) {
      params.set('tags', tags.join(','));
    }
    if (search) {
      params.set('search', search);
    }

    const queryString = params.toString();
    const newUrl = `/${locale}/journal${queryString ? `?${queryString}` : ''}`;

    // Update URL without page reload
    window.history.replaceState({}, '', newUrl);
  }, [locale]);

  // Sync URL when filters change
  useEffect(() => {
    updateUrl(currentCategory, selectedTags, searchQuery);
  }, [currentCategory, selectedTags, searchQuery, updateUrl]);

  // Extract all unique tags from posts
  const allTags = useMemo(() => {
    const tagMap = new Map<string, Tag>();
    posts.forEach(post => {
      post.tags?.forEach(tag => {
        if (tag && !tagMap.has(tag._id)) {
          tagMap.set(tag._id, tag);
        }
      });
    });
    return Array.from(tagMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [posts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Category filter
      if (currentCategory !== 'all' && post.category !== currentCategory) {
        return false;
      }

      // Tag filter
      if (selectedTags.length > 0) {
        const postTagIds = post.tags?.map(t => t._id) || [];
        const hasAllTags = selectedTags.every(tagId => postTagIds.includes(tagId));
        if (!hasAllTags) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          post.title.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [posts, currentCategory, selectedTags, searchQuery]);

  // Separate featured and regular posts
  const featuredPost = filteredPosts.find(p => p.featured) || filteredPosts[0];
  const secondaryFeatured = filteredPosts.slice(1, 3);
  const regularPosts = filteredPosts.filter(
    p => p._id !== featuredPost?._id && !secondaryFeatured.find(sf => sf._id === p._id)
  );
  const visiblePosts = regularPosts.slice(0, visibleCount);
  const hasMorePosts = visibleCount < regularPosts.length;

  // Handle tag toggle
  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setCurrentCategory('all');
    setSelectedTags([]);
    setSearchQuery('');
    setVisibleCount(9);
  };

  // Handle category change - just update state, URL syncs via useEffect
  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
    setVisibleCount(9); // Reset pagination when changing category
  };

  // Load more posts
  const loadMore = () => {
    setVisibleCount(prev => prev + 9);
  };

  return (
    <main className="relative bg-white">
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
                  className="w-full border-b-2 border-white/20 bg-transparent py-6 pl-16 pr-16 font-SchnyderS text-3xl font-light text-white placeholder:text-white/30 focus:border-[#c9a962] focus:outline-none"
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
                {['Interior Design', 'Luxury Villas', 'Fit-Out', 'MEP Engineering', 'Hospitality'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      setIsSearchOpen(false);
                    }}
                    className="border border-white/20 px-4 py-2 font-Satoshi text-sm font-light text-white/60 transition-all hover:border-[#c9a962] hover:text-[#c9a962]"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Hero Section */}
      <section ref={heroRef} className="relative min-h-[90vh] bg-neutral-950">
        {/* Background Image with Parallax */}
        <motion.div style={{ y: imageY }} className="absolute inset-0">
          <Image
            src={featuredPost?.mainImage ? getSafeImageUrl(featuredPost.mainImage, 1920, 1080) || DEFAULT_HERO_IMAGE : DEFAULT_HERO_IMAGE}
            alt={featuredPost?.title || 'Journal'}
            fill
            className="object-cover transition-all duration-1000"
            priority
          />
        </motion.div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-transparent to-transparent" />

        {/* Animated Grain Effect */}
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          }}
        />

        {/* Content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 flex min-h-[90vh] items-end px-6 py-24 lg:px-24"
        >
          <div className="max-w-3xl">
            {featuredPost ? (
              <>
                {/* Category Badge */}
                {featuredPost.category && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mb-6"
                  >
                    <span className={`inline-block rounded-full border px-5 py-2 font-Satoshi text-xs uppercase tracking-wider backdrop-blur-sm ${getCategoryColor(featuredPost.category).bg} ${getCategoryColor(featuredPost.category).text} ${getCategoryColor(featuredPost.category).border}`}>
                      {CATEGORIES.find(c => c.value === featuredPost.category)?.label || featuredPost.category}
                    </span>
                  </motion.div>
                )}

                {/* Meta */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="mb-6 flex flex-wrap items-center gap-6 font-Satoshi text-sm font-light text-white/60"
                >
                  {featuredPost.publishedAt && (
                    <span>{format(new Date(featuredPost.publishedAt), 'MMMM d, yyyy')}</span>
                  )}
                  <span className="flex items-center gap-2">
                    <Clock size={14} />
                    {calculateReadingTime(featuredPost.excerpt, featuredPost.readTime)} min read
                  </span>
                  {featuredPost.viewCount !== undefined && featuredPost.viewCount > 0 && (
                    <span className="flex items-center gap-2">
                      <Eye size={14} />
                      {formatViews(featuredPost.viewCount)} views
                    </span>
                  )}
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <Link href={`/${locale}/journal/${featuredPost.category || 'design-trends'}/${featuredPost.slug?.current || 'article'}`}>
                    <h1 className="mb-8 font-SchnyderS text-5xl font-light leading-[1.1] tracking-tight text-white transition-colors duration-500 hover:text-[#c9a962] sm:text-6xl lg:text-7xl">
                      {featuredPost.title}
                    </h1>
                  </Link>
                </motion.div>

                {/* Excerpt */}
                {featuredPost.excerpt && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mb-10 max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-white/70"
                  >
                    {featuredPost.excerpt}
                  </motion.p>
                )}

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  <Link
                    href={`/${locale}/journal/${featuredPost.category || 'design-trends'}/${featuredPost.slug?.current || 'article'}`}
                    className="group/link inline-flex items-center gap-4 border border-white/30 px-8 py-4 font-Satoshi text-sm uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-all duration-500 hover:border-[#c9a962] hover:bg-[#c9a962] hover:text-neutral-950"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-2" />
                  </Link>
                </motion.div>
              </>
            ) : (
              /* Default Hero Content when no posts */
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="mb-6 flex items-center gap-4"
                >
                  <div className="h-px w-12 bg-[#c9a962]/50" />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">
                    Our Journal
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="mb-8 font-SchnyderS text-5xl font-light leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl"
                >
                  Insights &<br />
                  <span className="text-[#c9a962]">Inspiration</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="mb-10 max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-white/70"
                >
                  Explore our thoughts on design, architecture, and the stories behind our most ambitious projects. From industry trends to behind-the-scenes insights.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  <Link
                    href={`/${locale}/contact`}
                    className="group/link inline-flex items-center gap-4 border border-white/30 px-8 py-4 font-Satoshi text-sm uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-all duration-500 hover:border-[#c9a962] hover:bg-[#c9a962] hover:text-neutral-950"
                  >
                    <span>Get in Touch</span>
                    <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-2" />
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>

        {/* Featured Badge - only show if there's a featured post */}
        {featuredPost && (
          <div className="absolute right-12 top-32 z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex items-center gap-3 bg-[#c9a962] px-6 py-3"
            >
              <Play size={14} className="fill-current" />
              <span className="font-Satoshi text-xs uppercase tracking-wider text-neutral-950">Featured</span>
            </motion.div>
          </div>
        )}

        {/* Corner Accents */}
        <div className="absolute left-8 top-32 h-24 w-24 border-l border-t border-[#c9a962]/20" />
        <div className="absolute bottom-32 right-8 h-24 w-24 border-b border-r border-[#c9a962]/20" />
      </section>

      {/* Category Filter Bar */}
      <section className="sticky top-20 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur-md lg:top-24">
        <div className="mx-auto max-w-[1800px] px-6 py-5 lg:px-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-3 font-Satoshi text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                Filter:
              </span>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={`rounded-full px-5 py-2 font-Satoshi text-xs uppercase tracking-wider transition-all duration-300 ${
                    currentCategory === cat.value
                      ? `${cat.color.bg} ${cat.color.text} border ${cat.color.border}`
                      : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
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

      {/* Editor's Picks - Two Column */}
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
                <SecondaryFeaturedCard key={post._id} post={post} index={index} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content with Sidebar */}
      <section id="all-articles" className="relative bg-neutral-50 px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-[1800px]">
          <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
            {/* Filters Sidebar */}
            <aside className="space-y-8">
              {/* Search */}
              <div className="rounded-lg border border-neutral-200 bg-white p-6">
                <h3 className="mb-4 font-Satoshi text-xs uppercase tracking-[0.2em] text-neutral-500">
                  Search
                </h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 py-2.5 pl-10 pr-4 text-sm focus:border-[#c9a962] focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Tags Filter */}
              {allTags.length > 0 && (
                <div className="rounded-lg border border-neutral-200 bg-white p-6">
                  <h3 className="mb-4 font-Satoshi text-xs uppercase tracking-[0.2em] text-neutral-500">
                    Topics
                  </h3>
                  <div className="space-y-2">
                    {allTags.map(tag => {
                      const count = posts.filter(p =>
                        p.tags?.some(t => t._id === tag._id)
                      ).length;
                      const isSelected = selectedTags.includes(tag._id);

                      return (
                        <button
                          key={tag._id}
                          onClick={() => toggleTag(tag._id)}
                          className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-all ${
                            isSelected
                              ? 'bg-[#c9a962]/10 text-[#c9a962]'
                              : 'text-neutral-600 hover:bg-neutral-50'
                          }`}
                        >
                          <span>{tag.name}</span>
                          <span className={`text-xs ${isSelected ? 'text-[#c9a962]' : 'text-neutral-400'}`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Clear Filters */}
              {(selectedTags.length > 0 || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="w-full rounded-lg border border-neutral-200 bg-white py-3 font-Satoshi text-sm text-neutral-600 transition-colors hover:border-[#c9a962] hover:text-[#c9a962]"
                >
                  Clear all filters
                </button>
              )}
            </aside>

            {/* Posts Grid */}
            <div>
              {/* Applied Filters */}
              {(selectedTags.length > 0 || searchQuery) && (
                <div className="mb-8 flex flex-wrap items-center gap-2">
                  <span className="mr-2 font-Satoshi text-xs uppercase tracking-[0.2em] text-neutral-400">
                    Applied:
                  </span>

                  <AnimatePresence mode="popLayout">
                    {/* Tag Chips */}
                    {selectedTags.map(tagId => {
                      const tag = allTags.find(t => t._id === tagId);
                      if (!tag) return null;

                      return (
                        <motion.div
                          key={tagId}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          className="group flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 transition-all hover:border-[#c9a962] hover:bg-[#c9a962]/5"
                        >
                          <span className="font-Satoshi text-xs font-light text-neutral-700 group-hover:text-neutral-900">
                            {tag.name}
                          </span>
                          <button
                            onClick={() => toggleTag(tagId)}
                            className="flex items-center justify-center rounded-full transition-colors hover:bg-[#c9a962]/10"
                            aria-label={`Remove ${tag.name} filter`}
                          >
                            <X className="h-3 w-3 text-neutral-500 transition-colors group-hover:text-[#c9a962]" strokeWidth={2.5} />
                          </button>
                        </motion.div>
                      );
                    })}

                    {/* Search Chip */}
                    {searchQuery && (
                      <motion.div
                        key="search"
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="group flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 transition-all hover:border-[#c9a962] hover:bg-[#c9a962]/5"
                      >
                        <span className="font-Satoshi text-xs font-light text-neutral-700 group-hover:text-neutral-900">
                          Search: &quot;{searchQuery}&quot;
                        </span>
                        <button
                          onClick={() => setSearchQuery('')}
                          className="flex items-center justify-center rounded-full transition-colors hover:bg-[#c9a962]/10"
                          aria-label="Clear search"
                        >
                          <X className="h-3 w-3 text-neutral-500 transition-colors group-hover:text-[#c9a962]" strokeWidth={2.5} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Section Header */}
              <div className="mb-12">
                <span className="mb-4 block font-Satoshi text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                  All Articles
                </span>
                <h2 className="font-SchnyderS text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                  Latest Insights
                </h2>
              </div>

              {/* Posts Grid */}
              {visiblePosts.length > 0 ? (
                <>
                  <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
                    {visiblePosts.map((post, index) => (
                      <PostCard key={post._id} post={post} index={index} locale={locale} />
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
                </>
              ) : (
                /* No Results */
                <div className="py-24 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
                    <Search size={32} className="text-neutral-400" />
                  </div>
                  <h3 className="mb-4 font-SchnyderS text-3xl font-light tracking-tight text-neutral-950">
                    No articles found
                  </h3>
                  <p className="mb-8 font-Satoshi text-lg font-light text-neutral-500">
                    {searchQuery
                      ? `No articles match "${searchQuery}". Try a different search term.`
                      : 'Try selecting a different category or adjusting your filters.'}
                  </p>
                  <button
                    onClick={clearFilters}
                    className="font-Satoshi text-sm font-light text-[#c9a962] underline transition-colors hover:text-neutral-950"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Professional CTA Section - Cinematic Banner */}
      <section className="relative overflow-hidden bg-neutral-950 px-6 py-32 lg:px-12 lg:py-48">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0">
          <Image
            src={featuredPost?.mainImage ? getSafeImageUrl(featuredPost.mainImage, 1920, 1080) || DEFAULT_HERO_IMAGE : DEFAULT_HERO_IMAGE}
            alt="Background"
            fill
            className="object-cover"
          />
          {/* Multi-layer gradient overlays for cinematic effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/60 via-transparent to-neutral-950/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </div>

        {/* Animated Background Elements */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse 80% 60% at 20% 80%, rgba(201,169,98,0.08) 0%, transparent 60%)',
              'radial-gradient(ellipse 80% 60% at 80% 20%, rgba(201,169,98,0.08) 0%, transparent 60%)',
              'radial-gradient(ellipse 80% 60% at 20% 80%, rgba(201,169,98,0.08) 0%, transparent 60%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-50" />

        {/* Decorative Lines */}
        <div className="absolute left-0 top-1/2 h-px w-1/4 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#c9a962]/20 to-transparent" />
        <div className="absolute right-0 top-1/2 h-px w-1/4 -translate-y-1/2 bg-gradient-to-l from-transparent via-[#c9a962]/20 to-transparent" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            {/* Decorative top element */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mx-auto mb-8 h-px w-24 origin-center bg-gradient-to-r from-transparent via-[#c9a962] to-transparent"
            />

            <span className="mb-6 block font-Satoshi text-xs uppercase tracking-[0.5em] text-[#c9a962]">
              Stay Connected
            </span>

            <h2 className="mb-8 font-SchnyderS text-5xl font-light tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
              Get Design
              <br />
              <span className="bg-gradient-to-r from-[#c9a962] via-[#f5d87a] to-[#c9a962] bg-clip-text text-transparent">
                Inspiration
              </span>
            </h2>

            <p className="mx-auto mb-12 max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-white/60 lg:text-xl">
              Subscribe to receive exclusive insights, project showcases, and industry trends directly to your inbox.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                href={`/${locale}/contact`}
                className="group relative inline-flex items-center gap-4 overflow-hidden border-2 border-[#c9a962] bg-[#c9a962] px-12 py-5 font-Satoshi text-sm uppercase tracking-[0.2em] text-neutral-950 transition-all duration-500 hover:bg-transparent hover:text-[#c9a962]"
              >
                <span className="relative z-10">Get in Touch</span>
                <ArrowRight size={16} className="relative z-10 transition-transform group-hover:translate-x-2" />
                {/* Shine effect on hover */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>
            </motion.div>

            {/* Decorative bottom element */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mx-auto mt-12 h-px w-24 origin-center bg-gradient-to-r from-transparent via-[#c9a962]/50 to-transparent"
            />
          </motion.div>
        </div>

        {/* Corner Accents - Larger */}
        <div className="absolute left-6 top-6 h-24 w-24 border-l-2 border-t-2 border-[#c9a962]/30 lg:left-12 lg:top-12 lg:h-32 lg:w-32" />
        <div className="absolute bottom-6 right-6 h-24 w-24 border-b-2 border-r-2 border-[#c9a962]/30 lg:bottom-12 lg:right-12 lg:h-32 lg:w-32" />

        {/* Floating decorative elements */}
        <motion.div
          className="absolute left-[10%] top-[20%] h-2 w-2 rounded-full bg-[#c9a962]/30"
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-[15%] top-[30%] h-1.5 w-1.5 rounded-full bg-[#c9a962]/20"
          animate={{ y: [0, 15, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute bottom-[25%] left-[20%] h-1 w-1 rounded-full bg-[#c9a962]/40"
          animate={{ y: [0, -10, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </section>
    </main>
  );
}

// Default card fallback images
const CARD_FALLBACK_IMAGES = [
  '/founder/CID_2106_00_COVER.jpg',
  '/placeholder.jpg',
  '/founder/CID_2106_00_COVER.jpg',
  '/placeholder.jpg',
];

// Secondary Featured Card Component - Full Background Image with Overlay
function SecondaryFeaturedCard({ post, index, locale }: { post: Post; index: number; locale: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });
  const readingTime = calculateReadingTime(post.excerpt, post.readTime);
  const colors = getCategoryColor(post.category);

  // Get image URL with fallback
  const imageUrl = getSafeImageUrl(post.mainImage, 1200, 750) || CARD_FALLBACK_IMAGES[index % CARD_FALLBACK_IMAGES.length];

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={`/${locale}/journal/${post.category || 'design-trends'}/${post.slug?.current || 'article'}`} className="block">
        {/* Full Background Image Card */}
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900 sm:aspect-[16/12]">
          {/* Background Image */}
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-all duration-1000 group-hover:scale-110"
          />

          {/* Multi-layer Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/40 via-transparent to-transparent" />

          {/* Hover Enhancement */}
          <div className="absolute inset-0 bg-[#c9a962]/0 transition-all duration-700 group-hover:bg-[#c9a962]/10" />

          {/* Category Badge - Top */}
          {post.category && (
            <div className="absolute left-6 top-6 z-10">
              <span className={`inline-block rounded-full border px-4 py-1.5 font-Satoshi text-xs uppercase tracking-wider backdrop-blur-sm ${colors.bg} ${colors.text} ${colors.border}`}>
                {CATEGORIES.find(c => c.value === post.category)?.label || post.category}
              </span>
            </div>
          )}

          {/* Reading Time - Top Right */}
          <div className="absolute right-6 top-6 z-10">
            <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 font-Satoshi text-xs font-light text-white backdrop-blur-sm">
              <Clock size={12} />
              {readingTime} min read
            </span>
          </div>

          {/* Content - Bottom */}
          <div className="absolute inset-x-0 bottom-0 z-10 p-6 lg:p-8">
            {/* Meta */}
            <div className="mb-4 flex items-center gap-4 font-Satoshi text-xs font-light text-white/60">
              {post.publishedAt && (
                <span>{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</span>
              )}
              {post.viewCount !== undefined && post.viewCount > 0 && (
                <span className="flex items-center gap-1.5">
                  <Eye size={12} />
                  {formatViews(post.viewCount)} views
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="mb-4 font-SchnyderS text-2xl font-light leading-tight tracking-tight text-white transition-colors duration-500 group-hover:text-[#c9a962] sm:text-3xl lg:text-4xl">
              {post.title}
            </h3>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="mb-6 line-clamp-2 font-Satoshi text-sm font-light leading-relaxed text-white/70 lg:text-base">
                {post.excerpt}
              </p>
            )}

            {/* Read More CTA */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 font-Satoshi text-xs uppercase tracking-wider text-white transition-colors group-hover:text-[#c9a962]">
                Read Article
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-2" />
              </span>
              <div className="h-px flex-1 bg-white/20 transition-all duration-500 group-hover:bg-[#c9a962]/50" />
            </div>
          </div>

          {/* Corner Accents */}
          <div className="absolute left-0 top-0 h-16 w-16 border-l-2 border-t-2 border-[#c9a962]/0 transition-all duration-500 group-hover:border-[#c9a962]/50" />
          <div className="absolute bottom-0 right-0 h-16 w-16 border-b-2 border-r-2 border-[#c9a962]/0 transition-all duration-500 group-hover:border-[#c9a962]/50" />
        </div>
      </Link>
    </motion.article>
  );
}

// Post Card Component - Full Background Image with Overlay
function PostCard({ post, index, locale }: { post: Post; index: number; locale: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });
  const readingTime = calculateReadingTime(post.excerpt, post.readTime);
  const colors = getCategoryColor(post.category);

  // Get image URL with fallback
  const imageUrl = getSafeImageUrl(post.mainImage, 800, 600) || CARD_FALLBACK_IMAGES[index % CARD_FALLBACK_IMAGES.length];

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={`/${locale}/journal/${post.category || 'design-trends'}/${post.slug?.current || 'article'}`} className="block">
        {/* Full Background Image Card */}
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900">
          {/* Background Image */}
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110"
          />

          {/* Multi-layer Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
          <div className="absolute inset-0 bg-neutral-950/20" />

          {/* Hover Enhancement */}
          <div className="absolute inset-0 bg-[#c9a962]/0 transition-all duration-500 group-hover:bg-[#c9a962]/10" />

          {/* Animated Border on Hover */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-0 top-0 h-0 w-full bg-[#c9a962] transition-all duration-500 group-hover:h-[2px]" />
            <div className="absolute right-0 top-0 h-full w-0 bg-[#c9a962] transition-all duration-500 delay-100 group-hover:w-[2px]" />
            <div className="absolute bottom-0 right-0 h-0 w-full bg-[#c9a962] transition-all duration-500 delay-200 group-hover:h-[2px]" />
            <div className="absolute bottom-0 left-0 h-full w-0 bg-[#c9a962] transition-all duration-500 delay-300 group-hover:w-[2px]" />
          </div>

          {/* Category Badge - Top Left */}
          {post.category && (
            <div className="absolute left-4 top-4 z-10">
              <span className={`inline-block rounded-full border px-3 py-1 font-Satoshi text-[10px] uppercase tracking-wider backdrop-blur-sm ${colors.bg} ${colors.text} ${colors.border}`}>
                {CATEGORIES.find(c => c.value === post.category)?.label || post.category}
              </span>
            </div>
          )}

          {/* Reading Time Badge - Top Right */}
          <div className="absolute right-4 top-4 z-10">
            <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 font-Satoshi text-[10px] font-light text-white backdrop-blur-sm">
              <Clock size={10} />
              {readingTime} min
            </span>
          </div>

          {/* Content - Bottom */}
          <div className="absolute inset-x-0 bottom-0 z-10 p-5">
            {/* Meta Row */}
            <div className="mb-3 flex items-center gap-3 font-Satoshi text-[10px] font-light text-white/60">
              {post.publishedAt && (
                <span>{format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>
              )}
              {post.viewCount !== undefined && post.viewCount > 0 && (
                <>
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                  <span className="flex items-center gap-1">
                    <Eye size={10} />
                    {formatViews(post.viewCount)}
                  </span>
                </>
              )}
            </div>

            {/* Title */}
            <h3 className="mb-3 line-clamp-2 font-SchnyderS text-xl font-light leading-tight tracking-tight text-white transition-colors duration-300 group-hover:text-[#c9a962] sm:text-2xl">
              {post.title}
            </h3>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="mb-4 line-clamp-2 font-Satoshi text-xs font-light leading-relaxed text-white/60">
                {post.excerpt}
              </p>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1.5">
                {post.tags.slice(0, 2).map(tag => (
                  <span
                    key={tag._id}
                    className="rounded-full bg-white/10 px-2.5 py-0.5 text-[9px] font-light text-white/70 backdrop-blur-sm"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Read More Link */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 font-Satoshi text-[10px] uppercase tracking-wider text-white/70 transition-colors group-hover:text-[#c9a962]">
                Read Article
                <ArrowRight size={10} className="transition-transform group-hover:translate-x-1" />
              </span>
              <div className="h-px flex-1 bg-white/10 transition-all duration-500 group-hover:bg-[#c9a962]/30" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
