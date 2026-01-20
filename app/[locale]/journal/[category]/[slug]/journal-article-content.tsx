"use client";

import { useRef, useState, useMemo } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { urlForImage } from "@/sanity/lib/image";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Share2,
  Copy,
  Check,
  ChevronDown,
  Eye,
  Bookmark,
  User,
  Tag,
  X,
  ZoomIn,
  ChevronLeft,
  Grid3X3,
  Maximize2,
} from "lucide-react";
import { format } from "date-fns";
import ViewCounter from "@/components/blog/view-counter";
import ReactionButtons from "@/components/blog/reaction-buttons";
import NewsletterCTA from "@/components/blog/newsletter-cta";
import {
  ReadingModeProvider,
  ReadingModeToggle,
  ReadingModeWrapper,
} from "@/components/blog/reading-mode";
import TableOfContents from "@/components/blog/table-of-contents";
// import Comments from '@/components/blog/comments';
import TextHighlighter from "@/components/blog/text-highlighter";
import AudioPlayer from "@/components/blog/audio-player";
import SocialShare from "@/components/blog/social-share";
import { ImageSeparator } from "@/components/blog/image-separators";

// Types
interface GalleryImage {
  _key?: string;
  asset?: any;
  alt?: string;
  caption?: string;
}

interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: any;
  gallery?: GalleryImage[];
  category?: string;
  author?: {
    name: string;
    role?: string;
    image?: any;
  };
  content?: any[];
  readTime?: number;
  tags?: Array<{ _id: string; name: string; slug?: { current: string } }>;
  publishedAt: string;
  viewCount?: number;
}

interface JournalArticleContentProps {
  post: SanityPost;
  relatedPosts: SanityPost[];
  locale: string;
  category: string;
}

// Category configurations
const CATEGORIES: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  "design-trends": {
    label: "Design Trends",
    bg: "bg-[#c9a962]/10",
    text: "text-[#c9a962]",
    border: "border-[#c9a962]/30",
  },
  "project-stories": {
    label: "Project Stories",
    bg: "bg-blue-500/10",
    text: "text-blue-600",
    border: "border-blue-500/30",
  },
  "behind-the-scenes": {
    label: "Behind the Scenes",
    bg: "bg-green-500/10",
    text: "text-green-600",
    border: "border-green-500/30",
  },
  "materials-craft": {
    label: "Materials & Craft",
    bg: "bg-purple-500/10",
    text: "text-purple-600",
    border: "border-purple-500/30",
  },
  engineering: {
    label: "Engineering",
    bg: "bg-orange-500/10",
    text: "text-orange-600",
    border: "border-orange-500/30",
  },
  "founders-insights": {
    label: "Founder's Insights",
    bg: "bg-rose-500/10",
    text: "text-rose-600",
    border: "border-rose-500/30",
  },
};

// Calculate reading time from content
function calculateReadingTime(content?: any[], readTime?: number): number {
  if (readTime) return readTime;
  if (!content) return 5;

  let wordCount = 0;
  content.forEach((block) => {
    if (block._type === "block" && block.children) {
      block.children.forEach((child: any) => {
        if (child.text) {
          wordCount += child.text.split(/\s+/).length;
        }
      });
    }
  });

  return Math.max(1, Math.ceil(wordCount / 200));
}

// Safe image URL helper
function getSafeImageUrl(
  image: any,
  width: number,
  height: number
): string | null {
  if (!image?.asset) return null;
  try {
    return urlForImage(image)?.width(width).height(height).url() || null;
  } catch {
    return null;
  }
}

// Portable Text components for rich content rendering
const createPortableTextComponents = (
  locale: string = "en"
): PortableTextComponents => ({
  block: {
    h1: ({ children }) => (
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-6 mt-16 font-SchnyderS text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl"
      >
        {children}
      </motion.h1>
    ),
    h2: ({ children }) => (
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-6 mt-14 font-SchnyderS text-3xl font-light tracking-tight text-neutral-950 lg:text-4xl"
      >
        <span className="mr-4 inline-block h-px w-8 bg-[#c9a962] align-middle" />
        {children}
      </motion.h2>
    ),
    h3: ({ children }) => (
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-4 mt-10 font-SchnyderS text-2xl font-light tracking-tight text-neutral-950 lg:text-3xl"
      >
        {children}
      </motion.h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-3 mt-8 font-SchnyderS text-xl font-light tracking-tight text-neutral-950 lg:text-2xl">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-6 font-Satoshi text-lg font-light leading-[1.9] text-neutral-700"
      >
        {children}
      </motion.p>
    ),
    blockquote: ({ children }) => (
      <motion.blockquote
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative my-12 overflow-hidden border-l-4 border-[#c9a962] bg-gradient-to-r from-neutral-50 to-transparent py-8 pl-10 pr-8"
      >
        <div className="absolute left-6 top-6 font-SchnyderS text-6xl text-[#c9a962]/20">
          &ldquo;
        </div>
        <div className="relative z-10 font-SchnyderS text-2xl font-light italic leading-relaxed text-neutral-700 lg:text-3xl">
          {children}
        </div>
      </motion.blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <motion.ul
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="mb-8 ml-8 space-y-3"
      >
        {children}
      </motion.ul>
    ),
    number: ({ children }) => (
      <motion.ol
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="mb-8 ml-8 list-decimal space-y-3 font-Satoshi text-lg font-light text-neutral-700"
      >
        {children}
      </motion.ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="relative pl-6 font-Satoshi text-lg font-light leading-relaxed text-neutral-700">
        <span className="absolute left-0 top-3 h-1.5 w-1.5 rounded-full bg-[#c9a962]" />
        {children}
      </li>
    ),
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-medium text-neutral-950">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const href = value?.href || "";
      const isExternal = href.startsWith("http");
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-[#c9a962] underline decoration-[#c9a962]/30 underline-offset-4 transition-colors hover:decoration-[#c9a962]"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const imageUrl = getSafeImageUrl(value, 1400, 900);
      if (!imageUrl) return null;
      return (
        <motion.figure
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="my-16 -mx-6 lg:-mx-12"
        >
          <div className="group relative aspect-[16/10] overflow-hidden bg-neutral-100">
            <Image
              src={imageUrl}
              alt={value.alt || "Article image"}
              fill
              className="object-cover transition-all duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
          {value.caption && (
            <figcaption className="mt-4 px-6 text-center font-Satoshi text-sm font-light italic text-neutral-500 lg:px-12">
              {value.caption}
            </figcaption>
          )}
        </motion.figure>
      );
    },
    imageSeparator: ({ value }) => {
      return <ImageSeparator value={value} locale={locale} />;
    },
  },
});

export default function JournalArticleContent({
  post,
  relatedPosts,
  locale,
  category,
}: JournalArticleContentProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isContentInView = useInView(contentRef, { once: true });
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Gallery images
  const galleryImages = useMemo(() => post.gallery || [], [post.gallery]);
  const hasGallery = galleryImages.length > 0;

  // Lightbox handlers
  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () => {
    if (lightboxIndex !== null && galleryImages.length > 0) {
      setLightboxIndex((lightboxIndex + 1) % galleryImages.length);
    }
  };
  const prevImage = () => {
    if (lightboxIndex !== null && galleryImages.length > 0) {
      setLightboxIndex(
        (lightboxIndex - 1 + galleryImages.length) % galleryImages.length
      );
    }
  };

  // Parallax effect for hero
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroImageY = useTransform(heroScrollProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 1.1]);

  // Reading progress bar
  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ["start start", "end end"],
  });

  // Calculate reading time
  const readingTime = useMemo(
    () => calculateReadingTime(post.content, post.readTime),
    [post.content, post.readTime]
  );

  // Get image URLs
  const mainImageUrl = getSafeImageUrl(post.mainImage, 1920, 1080);
  const authorImageUrl = post.author?.image
    ? getSafeImageUrl(post.author.image, 200, 200)
    : null;

  // Category styling
  const categoryStyle =
    CATEGORIES[post.category || category] || CATEGORIES["design-trends"];

  // Copy link handler
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Share handler
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || "",
          url: window.location.href,
        });
      } catch (err) {
        copyLink();
      }
    } else {
      copyLink();
    }
  };

  // Portable text components
  const portableTextComponents = useMemo(
    () => createPortableTextComponents(locale),
    [locale]
  );

  return (
    <ReadingModeProvider>
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed left-0 top-0 z-50 h-1 origin-left bg-[#c9a962]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Reading Mode Toggle Button */}
      <ReadingModeToggle />

      {/* Text Highlighter - enables Medium-style text highlighting */}
      <TextHighlighter postSlug={post.slug.current} />

      {/* Audio Player - TTS for article */}
      {post.content && (
        <AudioPlayer
          content={post.content}
          postSlug={post.slug.current}
          postTitle={post.title}
        />
      )}

      {/* Floating Table of Contents */}
      {post.content && <TableOfContents content={post.content} />}

      {/* Floating Social Share */}
      <SocialShare title={post.title} excerpt={post.excerpt} />

      <main className="relative bg-white">
        <article ref={articleRef}>
          {/* Cinematic Hero Section */}
          <section
            ref={heroRef}
            className="relative h-screen min-h-[700px] overflow-hidden bg-neutral-950"
          >
            {/* Background Image with Parallax */}
            {mainImageUrl ? (
              <motion.div
                style={{ y: heroImageY, scale: heroScale }}
                className="absolute inset-0"
              >
                <Image
                  src={mainImageUrl}
                  alt={post.mainImage?.alt || post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black" />
            )}

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-transparent to-neutral-950/30" />

            {/* Hero Content */}
            <motion.div
              style={{ opacity: heroOpacity }}
              className="relative z-10 flex h-full flex-col justify-end px-6 pb-20 lg:px-24 lg:pb-28"
            >
              <div className="mx-auto w-full max-w-5xl">
                {/* Back Button */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-10"
                >
                  <Link
                    href={`/${locale}/journal/${category}`}
                    className="group inline-flex items-center gap-3 font-Satoshi text-sm font-light tracking-wider text-white/60 transition-all hover:gap-4 hover:text-white"
                  >
                    <ArrowLeft
                      size={18}
                      className="transition-transform group-hover:-translate-x-1"
                    />
                    <span>BACK TO {categoryStyle.label.toUpperCase()}</span>
                  </Link>
                </motion.div>

                {/* Category & Meta Row */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mb-6 flex flex-wrap items-center gap-4"
                >
                  <span
                    className={`inline-block rounded-full border px-5 py-2 font-Satoshi text-xs font-light uppercase tracking-wider backdrop-blur-sm ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
                  >
                    {categoryStyle.label}
                  </span>
                  <div className="flex flex-wrap items-center gap-4 lg:gap-6 font-Satoshi text-sm font-light text-white/50">
                    {post.publishedAt && (
                      <span className="flex items-center gap-2">
                        <Calendar size={14} />
                        {format(new Date(post.publishedAt), "MMMM d, yyyy")}
                      </span>
                    )}
                    <span className="flex items-center gap-2">
                      <Clock size={14} />
                      {readingTime} min read
                    </span>
                    {/* Reading Time Badge */}
                    {readingTime <= 5 ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                        Quick read
                      </span>
                    ) : readingTime >= 10 ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c9a962]/20 px-3 py-1 text-xs font-medium text-[#c9a962]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#c9a962]" />
                        Deep dive
                      </span>
                    ) : null}
                    <ViewCounter
                      postId={post._id}
                      initialViews={post.viewCount || 0}
                      variant="dark"
                    />
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mb-8 max-w-4xl font-SchnyderS text-4xl font-light leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
                >
                  {post.title}
                </motion.h1>

                {/* Excerpt */}
                {post.excerpt && (
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mb-10 max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-white/70 lg:text-xl"
                  >
                    {post.excerpt}
                  </motion.p>
                )}

                {/* Author & Actions Row */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-8"
                >
                  {/* Author Info */}
                  {post.author?.name && (
                    <div className="flex items-center gap-4">
                      {authorImageUrl ? (
                        <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-white/20">
                          <Image
                            src={authorImageUrl}
                            alt={post.author.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 ring-2 ring-white/20">
                          <User size={24} className="text-white/60" />
                        </div>
                      )}
                      <div>
                        <p className="font-Satoshi text-sm font-light text-white/50">
                          Written by
                        </p>
                        <p className="font-Satoshi text-base font-medium text-white">
                          {post.author.name}
                        </p>
                        {post.author.role && (
                          <p className="font-Satoshi text-xs font-light text-white/40">
                            {post.author.role}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={`flex items-center gap-2 rounded-full border px-4 py-2 font-Satoshi text-xs transition-all ${
                        isBookmarked
                          ? "border-[#c9a962] bg-[#c9a962]/10 text-[#c9a962]"
                          : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
                      }`}
                    >
                      <Bookmark
                        size={14}
                        className={isBookmarked ? "fill-current" : ""}
                      />
                      <span>{isBookmarked ? "Saved" : "Save"}</span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 font-Satoshi text-xs text-white/60 transition-all hover:border-white/40 hover:text-white"
                    >
                      {copied ? <Check size={14} /> : <Share2 size={14} />}
                      <span>{copied ? "Copied!" : "Share"}</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex flex-col items-center gap-2"
              >
                <span className="font-Satoshi text-[10px] uppercase tracking-[0.3em] text-white/30">
                  Scroll to read
                </span>
                <ChevronDown className="h-5 w-5 text-white/30" />
              </motion.div>
            </motion.div>

            {/* Corner Accents */}
            <div className="absolute left-8 top-32 h-24 w-24 border-l border-t border-[#c9a962]/20" />
            <div className="absolute bottom-32 right-8 h-24 w-24 border-b border-r border-[#c9a962]/20" />
          </section>

          {/* Article Content */}
          <section className="relative bg-white px-6 py-20 lg:px-12 lg:py-32">
            <div className="mx-auto max-w-3xl">
              {/* Lead paragraph */}
              {post.excerpt && (
                <motion.div
                  ref={contentRef}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isContentInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8 }}
                >
                  <p className="mb-12 border-l-4 border-[#c9a962] pl-6 font-SchnyderS text-2xl font-light leading-relaxed text-neutral-700 lg:text-3xl">
                    {post.excerpt}
                  </p>
                </motion.div>
              )}

              {/* Main Content */}
              {post.content && post.content.length > 0 && (
                <PortableText
                  value={post.content}
                  components={portableTextComponents}
                />
              )}

              {/* Newsletter CTA */}
              <NewsletterCTA category={category} articleTitle={post.title} />

              {/* Tags Section */}
              {post.tags && post.tags.filter((t) => t && t.name).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-16 border-t border-neutral-200 pt-8"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Tag size={16} className="text-neutral-400" />
                    <span className="font-Satoshi text-sm font-light uppercase tracking-wider text-neutral-400">
                      Topics
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags
                      .filter((t) => t && t.name)
                      .map((tag) => (
                        <span
                          key={tag._id}
                          className="rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 font-Satoshi text-sm font-light text-neutral-600 transition-all hover:border-[#c9a962] hover:text-[#c9a962]"
                        >
                          {tag.name}
                        </span>
                      ))}
                  </div>
                </motion.div>
              )}

              {/* Author Bio Section */}
              {post.author?.name && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-16 rounded-2xl bg-neutral-50 p-8 lg:p-10"
                >
                  <div className="flex items-start gap-6">
                    {authorImageUrl ? (
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full">
                        <Image
                          src={authorImageUrl}
                          alt={post.author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-neutral-200">
                        <User size={32} className="text-neutral-400" />
                      </div>
                    )}
                    <div>
                      <p className="mb-1 font-Satoshi text-xs font-light uppercase tracking-wider text-neutral-400">
                        About the Author
                      </p>
                      <h4 className="mb-2 font-SchnyderS text-2xl font-light text-neutral-950">
                        {post.author.name}
                      </h4>
                      {post.author.role && (
                        <p className="font-Satoshi text-sm font-light text-neutral-500">
                          {post.author.role}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ============================================ */}
              {/* Image Gallery Sections */}
              {/* ============================================ */}
              {hasGallery && (
                <>
                  {/* Full-width cinematic image break (first image) */}
                  {galleryImages.length >= 1 && (
                    <FullWidthImageBreak
                      image={galleryImages[0]}
                      index={0}
                      onOpen={openLightbox}
                    />
                  )}

                  {/* Gallery grid (images 2-7) */}
                  {galleryImages.length > 1 && (
                    <GalleryGridSection
                      images={galleryImages.slice(1, 7)}
                      startIndex={1}
                      onOpen={openLightbox}
                    />
                  )}

                  {/* Second full-width break (if enough images) */}
                  {galleryImages.length >= 8 && (
                    <FullWidthImageBreak
                      image={galleryImages[7]}
                      index={7}
                      onOpen={openLightbox}
                    />
                  )}

                  {/* Masonry grid (remaining images) */}
                  {galleryImages.length > 8 && (
                    <MasonryGridSection
                      images={galleryImages.slice(8)}
                      startIndex={8}
                      onOpen={openLightbox}
                    />
                  )}
                </>
              )}

              {/* Share Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12 flex items-center justify-between border-t border-neutral-200 pt-8"
              >
                <span className="font-Satoshi text-sm font-light text-neutral-500">
                  Share this article
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={copyLink}
                    className="flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 font-Satoshi text-xs text-neutral-600 transition-all hover:border-[#c9a962] hover:text-[#c9a962]"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? "Copied!" : "Copy link"}</span>
                  </button>
                </div>
              </motion.div>

              {/* Reactions Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12"
              >
                <ReactionButtons postId={post._id} />
              </motion.div>

              {/* Comments Section - Disabled */}
              {/* <Comments postSlug={post.slug.current} postTitle={post.title} /> */}
            </div>
          </section>
        </article>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="bg-neutral-950 px-6 py-24 lg:px-12 lg:py-32">
            <div className="mx-auto max-w-[1800px]">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16 flex items-end justify-between"
              >
                <div>
                  <span className="mb-4 block font-Satoshi text-[10px] uppercase tracking-[0.3em] text-[#c9a962]">
                    Continue Reading
                  </span>
                  <h2 className="font-SchnyderS text-4xl font-light tracking-tight text-white lg:text-5xl">
                    Related Articles
                  </h2>
                </div>
                <Link
                  href={`/${locale}/journal/${category}`}
                  className="hidden items-center gap-2 font-Satoshi text-sm font-light text-white/60 transition-colors hover:text-white md:flex"
                >
                  View all {categoryStyle.label}
                  <ArrowRight size={14} />
                </Link>
              </motion.div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((relatedPost, index) => (
                  <RelatedPostCard
                    key={relatedPost._id}
                    post={relatedPost}
                    index={index}
                    locale={locale}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="relative overflow-hidden bg-white px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="mb-6 block font-Satoshi text-xs uppercase tracking-[0.3em] text-neutral-400">
                Ready to Start Your Project?
              </span>
              <h2 className="mb-8 font-SchnyderS text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                Let&apos;s Create Something
                <br />
                <span className="text-[#c9a962]">Extraordinary Together</span>
              </h2>
              <Link
                href={`/${locale}/contact`}
                className="group relative inline-flex items-center gap-4 overflow-hidden border-2 border-neutral-950 bg-neutral-950 px-10 py-5 font-Satoshi text-sm uppercase tracking-[0.2em] text-white transition-all duration-500 hover:bg-transparent hover:text-neutral-950"
              >
                <span className="relative z-10">Get in Touch</span>
                <ArrowRight
                  size={16}
                  className="relative z-10 transition-transform group-hover:translate-x-2"
                />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Image Lightbox */}
      {lightboxIndex !== null && hasGallery && (
        <ImageLightbox
          images={galleryImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </ReadingModeProvider>
  );
}

// ============================================
// Gallery Components
// ============================================

// Full-width Image Break - Cinematic parallax image
function FullWidthImageBreak({
  image,
  index,
  onOpen,
}: {
  image: GalleryImage;
  index: number;
  onOpen: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.6, 1, 1, 0.6]
  );

  const imageUrl = image?.asset
    ? urlForImage(image as any)
        ?.width(1920)
        .height(800)
        .url()
    : null;

  if (!imageUrl) return null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1 }}
      className="group relative my-20 -mx-6 h-[60vh] min-h-[400px] cursor-pointer overflow-hidden lg:-mx-12 lg:my-28"
      onClick={() => onOpen(index)}
    >
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        <motion.div style={{ opacity }} className="h-full w-full">
          <Image
            src={imageUrl}
            alt={image.alt || "Gallery image"}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </motion.div>
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

      {/* View icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm">
          <Maximize2 className="h-6 w-6 text-neutral-900" />
        </div>
      </div>

      {/* Caption */}
      {image.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 lg:p-8">
          <p className="font-Satoshi text-sm font-light italic text-white/80 lg:text-base">
            {image.caption}
          </p>
        </div>
      )}

      {/* Corner accents */}
      <div className="absolute left-4 top-4 h-12 w-12 border-l-2 border-t-2 border-white/30 transition-all duration-300 group-hover:h-16 group-hover:w-16 group-hover:border-[#c9a962]" />
      <div className="absolute bottom-4 right-4 h-12 w-12 border-b-2 border-r-2 border-white/30 transition-all duration-300 group-hover:h-16 group-hover:w-16 group-hover:border-[#c9a962]" />
    </motion.div>
  );
}

// Gallery Grid Section - 2-3 column grid
function GalleryGridSection({
  images,
  startIndex,
  onOpen,
}: {
  images: GalleryImage[];
  startIndex: number;
  onOpen: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (images.length === 0) return null;

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="my-20 lg:my-28"
    >
      {/* Section header */}
      <div className="mb-10 flex items-center gap-4">
        <Grid3X3 className="h-5 w-5 text-[#c9a962]" />
        <span className="font-Satoshi text-[10px] uppercase tracking-[0.3em] text-neutral-400">
          Project Gallery
        </span>
        <div className="flex-1 border-t border-neutral-200" />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
        {images.map((image, idx) => {
          const imageUrl = image?.asset
            ? urlForImage(image as any)
                ?.width(800)
                .height(600)
                .url()
            : null;

          if (!imageUrl) return null;

          // Vary sizes for visual interest
          const isLarge = idx === 0 || idx === 3;
          const globalIdx = startIndex + idx;

          return (
            <motion.div
              key={image._key || idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`group relative cursor-pointer overflow-hidden bg-neutral-100 ${
                isLarge
                  ? "col-span-2 aspect-[2/1] lg:col-span-1 lg:aspect-[4/3]"
                  : "aspect-[4/3]"
              }`}
              onClick={() => onOpen(globalIdx)}
            >
              <Image
                src={imageUrl}
                alt={image.alt || "Gallery image"}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/40" />

              {/* Zoom icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm">
                  <ZoomIn className="h-5 w-5 text-neutral-900" />
                </div>
              </div>

              {/* Caption on hover */}
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
                  <p className="font-Satoshi text-xs font-light text-white/90">
                    {image.caption}
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

// Masonry Grid Section - Pinterest-style layout
function MasonryGridSection({
  images,
  startIndex,
  onOpen,
}: {
  images: GalleryImage[];
  startIndex: number;
  onOpen: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (images.length === 0) return null;

  // Distribute images into 3 columns
  const columns: GalleryImage[][] = [[], [], []];
  images.forEach((image, idx) => {
    columns[idx % 3].push(image);
  });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
      className="my-20 lg:my-28"
    >
      {/* Section header */}
      <div className="mb-10 flex items-center gap-4">
        <Grid3X3 className="h-5 w-5 text-[#c9a962]" />
        <span className="font-Satoshi text-[10px] uppercase tracking-[0.3em] text-neutral-400">
          Visual Journey
        </span>
        <div className="flex-1 border-t border-neutral-200" />
      </div>

      <div className="flex gap-4 lg:gap-6">
        {columns.map((column, colIdx) => (
          <div key={colIdx} className="flex flex-1 flex-col gap-4 lg:gap-6">
            {column.map((image, imgIdx) => {
              const globalIdx = startIndex + colIdx + imgIdx * 3;
              const aspectRatio =
                imgIdx % 2 === 0 ? "aspect-[3/4]" : "aspect-[4/5]";

              const imageUrl = image?.asset
                ? urlForImage(image as any)
                    ?.width(600)
                    .height(800)
                    .url()
                : null;

              if (!imageUrl) return null;

              return (
                <motion.div
                  key={image._key || `${colIdx}-${imgIdx}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: colIdx * 0.1 + imgIdx * 0.15,
                  }}
                  className={`group relative cursor-pointer overflow-hidden bg-neutral-100 ${aspectRatio}`}
                  onClick={() => onOpen(globalIdx)}
                >
                  <Image
                    src={imageUrl}
                    alt={image.alt || "Gallery image"}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-105"
                  />

                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Zoom icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm">
                      <ZoomIn className="h-4 w-4 text-neutral-900" />
                    </div>
                  </div>

                  {/* Caption */}
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <p className="font-Satoshi text-xs font-light text-white">
                        {image.caption}
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </motion.section>
  );
}

// Image Lightbox - Full-screen image viewing
function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const currentImage = images[currentIndex];

  const imageUrl = currentImage?.asset
    ? urlForImage(currentImage as any)
        ?.width(1920)
        .height(1280)
        .url()
    : null;

  if (!imageUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-6 top-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Image counter */}
      <div className="absolute left-6 top-6 z-10 font-Satoshi text-sm font-light text-white/60">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-6 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-6 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <ArrowRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Main image */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="relative h-[80vh] w-[90vw] max-w-6xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={imageUrl}
          alt={currentImage.alt || "Gallery image"}
          fill
          className="object-contain"
        />
      </motion.div>

      {/* Caption */}
      {currentImage.caption && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-8 left-1/2 z-10 max-w-2xl -translate-x-1/2 text-center"
        >
          <p className="font-Satoshi text-sm font-light text-white/80 lg:text-base">
            {currentImage.caption}
          </p>
        </motion.div>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-20 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {images.slice(0, 8).map((img, idx) => {
            const thumbUrl = img?.asset
              ? urlForImage(img as any)
                  ?.width(80)
                  .height(60)
                  .url()
              : null;

            if (!thumbUrl) return null;

            return (
              <button
                key={img._key || idx}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                  setTimeout(() => {
                    const event = new CustomEvent("openLightbox", {
                      detail: idx,
                    });
                    window.dispatchEvent(event);
                  }, 100);
                }}
                className={`relative h-12 w-16 overflow-hidden transition-all ${
                  idx === currentIndex
                    ? "ring-2 ring-[#c9a962] ring-offset-2 ring-offset-black"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={thumbUrl} alt="" fill className="object-cover" />
              </button>
            );
          })}
          {images.length > 8 && (
            <div className="flex h-12 w-16 items-center justify-center bg-white/10 font-Satoshi text-xs text-white/60">
              +{images.length - 8}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

// Related Post Card Component
function RelatedPostCard({
  post,
  index,
  locale,
}: {
  post: SanityPost;
  index: number;
  locale: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  const imageUrl = getSafeImageUrl(post.mainImage, 800, 600);
  const categoryStyle =
    CATEGORIES[post.category || ""] || CATEGORIES["design-trends"];

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group"
    >
      <Link
        href={`/${locale}/journal/${post.category || "design-trends"}/${post.slug?.current || "article"}`}
        className="block"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-800">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />

          {/* Category Badge */}
          {post.category && (
            <div className="absolute left-4 top-4 z-10">
              <span
                className={`inline-block rounded-full border px-3 py-1 font-Satoshi text-[10px] uppercase tracking-wider backdrop-blur-sm ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
              >
                {categoryStyle.label}
              </span>
            </div>
          )}

          {/* Content */}
          <div className="absolute inset-x-0 bottom-0 z-10 p-5">
            {post.publishedAt && (
              <span className="mb-2 block font-Satoshi text-xs font-light text-white/50">
                {format(new Date(post.publishedAt), "MMM d, yyyy")}
              </span>
            )}
            <h3 className="mb-3 line-clamp-2 font-SchnyderS text-xl font-light leading-tight text-white transition-colors duration-300 group-hover:text-[#c9a962] lg:text-2xl">
              {post.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className="font-Satoshi text-[10px] uppercase tracking-wider text-white/60 transition-colors group-hover:text-[#c9a962]">
                Read Article
              </span>
              <ArrowRight
                size={12}
                className="text-white/60 transition-transform group-hover:translate-x-1 group-hover:text-[#c9a962]"
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
