'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Post, Category } from '@/lib/wordpress';
import { ArrowRight, Calendar, User, Tag, Search } from 'lucide-react';
import { format } from 'date-fns';

interface BlogPageContentProps {
  posts: Post[];
  categories: Category[];
}

export default function BlogPageContent({ posts, categories }: BlogPageContentProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const displayPosts = posts.length > 0 ? posts : placeholderPosts;

  // Filter posts by category and search
  const filteredPosts = displayPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      post.categories.nodes.some((cat) => cat.slug === selectedCategory);
    const matchesSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  return (
    <main className="relative bg-white">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 px-6 py-32 lg:px-12 lg:py-48"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full bg-purple-500/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-[1400px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-8 flex items-center gap-4"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-neutral-600" />
            <span className="text-sm font-light tracking-[0.3em] text-neutral-400">
              INSIGHTS & INSPIRATION
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8 max-w-4xl text-6xl font-light tracking-tight text-white lg:text-8xl"
          >
            Our Blog
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12 max-w-2xl text-xl font-light leading-relaxed text-neutral-400"
          >
            Explore expert insights, design trends, project stories, and
            inspiration from our team of creative professionals.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative max-w-xl"
          >
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-neutral-700 bg-neutral-900/50 px-12 py-4 font-light text-white placeholder:text-neutral-500 focus:border-white focus:outline-none"
            />
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-[1600px] px-6 py-6 lg:px-12">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 text-sm font-light tracking-wider transition-all ${
                selectedCategory === 'all'
                  ? 'border-b-2 border-neutral-950 text-neutral-950'
                  : 'text-neutral-500 hover:text-neutral-950'
              }`}
            >
              ALL
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-4 py-2 text-sm font-light tracking-wider transition-all ${
                  selectedCategory === category.slug
                    ? 'border-b-2 border-neutral-950 text-neutral-950'
                    : 'text-neutral-500 hover:text-neutral-950'
                }`}
              >
                {category.name.toUpperCase()}
                {category.count && (
                  <span className="ml-2 text-neutral-400">({category.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="relative bg-neutral-50 px-6 py-16 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-8 text-sm font-light tracking-wider text-neutral-500">
              FEATURED ARTICLE
            </div>
            <FeaturedPostCard post={featuredPost} />
          </div>
        </section>
      )}

      {/* Regular Posts Grid */}
      <section className="relative bg-white px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-16">
            {regularPosts.map((post, index) => (
              <BlogPostCard key={post.id} post={post} index={index} />
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="py-24 text-center">
              <p className="text-lg font-light text-neutral-500">
                No articles found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative bg-neutral-950 px-6 py-32 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-light tracking-tight text-white lg:text-5xl">
            Subscribe to Our Newsletter
          </h2>
          <p className="mb-10 text-lg font-light text-neutral-400">
            Get the latest design insights, project updates, and exclusive content
            delivered to your inbox.
          </p>
          <form className="mx-auto flex max-w-md gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 border border-neutral-700 bg-neutral-900 px-6 py-4 font-light text-white placeholder:text-neutral-500 focus:border-white focus:outline-none"
            />
            <button
              type="submit"
              className="group flex items-center gap-3 border border-white bg-white px-6 py-4 text-sm font-light tracking-widest text-neutral-950 transition-all hover:bg-transparent hover:text-white"
            >
              <span>SUBSCRIBE</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function FeaturedPostCard({ post }: { post: Post }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="grid gap-12 lg:grid-cols-2"
    >
      {/* Image */}
      <Link
        href={`/blog/${post.slug}`}
        className="group relative aspect-[16/10] overflow-hidden bg-neutral-200"
      >
        {post.featuredImage?.node?.sourceUrl ? (
          <Image
            src={post.featuredImage.node.sourceUrl}
            alt={post.title}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-200">
            <span className="text-neutral-400">No image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-neutral-950/0 transition-all duration-500 group-hover:bg-neutral-950/20" />
      </Link>

      {/* Content */}
      <div className="flex flex-col justify-center">
        {/* Categories */}
        {post.categories.nodes.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.categories.nodes.map((category) => (
              <span
                key={category.id}
                className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-light tracking-wider text-neutral-600"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h2 className="mb-4 text-4xl font-light tracking-tight text-neutral-950 transition-colors hover:text-neutral-600 lg:text-5xl">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <div
          className="mb-6 text-lg font-light leading-relaxed text-neutral-600"
          dangerouslySetInnerHTML={{ __html: post.excerpt.substring(0, 200) + '...' }}
        />

        {/* Meta */}
        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm font-light text-neutral-500">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{format(new Date(post.date), 'MMM d, yyyy')}</span>
          </div>
          {post.author?.node?.name && (
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{post.author.node.name}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <Link
          href={`/blog/${post.slug}`}
          className="group inline-flex items-center gap-3 border-b-2 border-neutral-950 pb-1 text-sm font-light tracking-widest text-neutral-950 transition-all hover:gap-5"
        >
          <span>READ ARTICLE</span>
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
        </Link>
      </div>
    </motion.div>
  );
}

function BlogPostCard({ post, index }: { post: Post; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      {/* Image */}
      <Link
        href={`/blog/${post.slug}`}
        className="relative mb-6 block aspect-[4/3] overflow-hidden bg-neutral-100"
      >
        {post.featuredImage?.node?.sourceUrl ? (
          <Image
            src={post.featuredImage.node.sourceUrl}
            alt={post.title}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
            <span className="text-neutral-300">No image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-neutral-950/0 transition-all duration-500 group-hover:bg-neutral-950/10" />
      </Link>

      {/* Categories */}
      {post.categories.nodes.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {post.categories.nodes.slice(0, 2).map((category) => (
            <span
              key={category.id}
              className="text-xs font-light tracking-wider text-neutral-500"
            >
              {category.name}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <Link href={`/blog/${post.slug}`}>
        <h3 className="mb-3 text-2xl font-light tracking-tight text-neutral-950 transition-colors group-hover:text-neutral-600 lg:text-3xl">
          {post.title}
        </h3>
      </Link>

      {/* Excerpt */}
      <div
        className="mb-4 line-clamp-3 text-sm font-light leading-relaxed text-neutral-600"
        dangerouslySetInnerHTML={{ __html: post.excerpt }}
      />

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs font-light text-neutral-500">
        <div className="flex items-center gap-1.5">
          <Calendar size={14} />
          <span>{format(new Date(post.date), 'MMM d, yyyy')}</span>
        </div>
        {post.author?.node?.name && (
          <div className="flex items-center gap-1.5">
            <User size={14} />
            <span>{post.author.node.name}</span>
          </div>
        )}
      </div>
    </motion.article>
  );
}

// Placeholder posts
const placeholderPosts: Post[] = [
  {
    id: '1',
    title: 'The Evolution of Modern Interior Design',
    slug: 'evolution-modern-interior-design',
    excerpt: 'Explore how interior design has transformed over the decades, from minimalism to maximalism and everything in between.',
    content: '',
    date: new Date().toISOString(),
    modified: new Date().toISOString(),
    featuredImage: {
      node: {
        sourceUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
        altText: 'Modern Interior Design',
      },
    },
    categories: { nodes: [{ id: '1', name: 'Design Trends', slug: 'design-trends' }] },
    tags: { nodes: [] },
    author: { node: { name: 'Sarah Johnson' } },
  },
  {
    id: '2',
    title: '5 Essential Tips for Small Space Living',
    slug: 'tips-small-space-living',
    excerpt: 'Maximize your small space with these expert design strategies that combine style and functionality.',
    content: '',
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    modified: new Date(Date.now() - 86400000 * 3).toISOString(),
    featuredImage: {
      node: {
        sourceUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
        altText: 'Small Space Design',
      },
    },
    categories: { nodes: [{ id: '2', name: 'Tips & Guides', slug: 'tips-guides' }] },
    tags: { nodes: [] },
    author: { node: { name: 'Michael Chen' } },
  },
  {
    id: '3',
    title: 'Sustainable Materials in Luxury Design',
    slug: 'sustainable-materials-luxury-design',
    excerpt: 'How eco-friendly materials are reshaping the luxury design landscape without compromising on elegance.',
    content: '',
    date: new Date(Date.now() - 86400000 * 7).toISOString(),
    modified: new Date(Date.now() - 86400000 * 7).toISOString(),
    categories: { nodes: [{ id: '3', name: 'Sustainability', slug: 'sustainability' }] },
    tags: { nodes: [] },
    author: { node: { name: 'Emma Williams' } },
  },
];
