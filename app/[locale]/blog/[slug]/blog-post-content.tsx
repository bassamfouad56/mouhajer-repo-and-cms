"use client";

import { useRef, useState, useMemo } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { urlForImage } from "@/sanity/lib/image";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  User,
  Tag,
  Clock,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Check,
  ChevronDown,
  Eye,
  Bookmark,
  Heart,
  X,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  Maximize2,
} from "lucide-react";
import { format } from "date-fns";

// Import blog components
import ReadingProgress from "@/components/blog/reading-progress";
import TableOfContents from "@/components/blog/table-of-contents";
import ReactionButtons from "@/components/blog/reaction-buttons";
import ViewCounter from "@/components/blog/view-counter";
import MobileBlogBar from "@/components/blog/mobile-blog-bar";
import { ImageSeparator } from "@/components/blog/image-separators";

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
    bio?: string;
  };
  content?: any[];
  readTime?: number;
  tags?: Array<
    { _id: string; name: string; slug?: { current: string } } | string
  >;
  publishedAt: string;
  viewCount?: number;
  reactions?: {
    helpful: number;
    insightful: number;
    loved: number;
  };
}

interface BlogPostContentProps {
  post: SanityPost;
  relatedPosts: SanityPost[];
  locale?: string;
}

// Category colors
const categoryColors: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  trends: {
    bg: "bg-[#c9a962]/10",
    text: "text-[#c9a962]",
    border: "border-[#c9a962]/30",
  },
  tips: {
    bg: "bg-blue-500/10",
    text: "text-blue-600",
    border: "border-blue-500/30",
  },
  "case-studies": {
    bg: "bg-green-500/10",
    text: "text-green-600",
    border: "border-green-500/30",
  },
  news: {
    bg: "bg-purple-500/10",
    text: "text-purple-600",
    border: "border-purple-500/30",
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

// Generate IDs for headings in content
function addHeadingIds(content: any[]): any[] {
  let headingIndex = 0;
  return content.map((block) => {
    if (block._type === "block" && ["h2", "h3"].includes(block.style)) {
      const text =
        block.children?.map((child: any) => child.text).join("") || "";
      const id = `heading-${headingIndex}-${text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")}`;
      headingIndex++;
      return { ...block, _headingId: id };
    }
    return block;
  });
}

// Portable Text components for custom rendering with enhanced visuals
const createPortableTextComponents = (
  locale: string = "en"
): PortableTextComponents => ({
  block: {
    h1: ({ children, value }) => (
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        id={value._headingId}
        className="mb-6 mt-16 scroll-mt-32 font-SchnyderS text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl"
      >
        {children}
      </motion.h1>
    ),
    h2: ({ children, value }) => (
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        id={value._headingId}
        className="mb-6 mt-14 scroll-mt-32 font-SchnyderS text-3xl font-light tracking-tight text-neutral-950 lg:text-4xl"
      >
        <span className="mr-4 inline-block h-px w-8 bg-[#c9a962] align-middle" />
        {children}
      </motion.h2>
    ),
    h3: ({ children, value }) => (
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        id={value._headingId}
        className="mb-4 mt-10 scroll-mt-32 font-SchnyderS text-2xl font-light tracking-tight text-neutral-950 lg:text-3xl"
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
      const imageUrl = urlForImage(value)?.width(1400).height(900).url();
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
              alt={value.alt || "Blog image"}
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

export default function BlogPostContent({
  post,
  relatedPosts,
  locale = "en",
}: BlogPostContentProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true });
  const [showMobileTOC, setShowMobileTOC] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Gallery images - combine from gallery field
  const galleryImages = useMemo(() => post.gallery || [], [post.gallery]);
  const hasGallery = galleryImages.length > 0;

  // Lightbox handlers
  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
  const nextImage = () =>
    setLightboxIndex((prev) =>
      prev !== null && prev < galleryImages.length - 1 ? prev + 1 : prev
    );

  // Parallax effect for hero
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroImageY = useTransform(heroScrollProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 1.1]);

  // Calculate reading time
  const readingTime = useMemo(
    () => calculateReadingTime(post.content, post.readTime),
    [post.content, post.readTime]
  );

  // Add IDs to headings for TOC linking
  const contentWithIds = useMemo(
    () => (post.content ? addHeadingIds(post.content) : []),
    [post.content]
  );

  // Get image URLs safely
  const mainImageUrl = post.mainImage
    ? urlForImage(post.mainImage)?.width(1920).height(1080).url()
    : null;
  const authorImageUrl = post.author?.image
    ? urlForImage(post.author.image)?.width(200).height(200).url()
    : null;

  // Category colors
  const colors = categoryColors[post.category || ""] || categoryColors.news;

  // Copy link handler
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
    }
  };

  // Portable text components
  const portableTextComponents = useMemo(
    () => createPortableTextComponents(locale),
    [locale]
  );

  return (
    <>
      {/* Reading Progress Bar */}
      <ReadingProgress targetRef={articleRef} />

      {/* Mobile Bottom Bar */}
      <MobileBlogBar
        postTitle={post.title}
        onTOCToggle={() => setShowMobileTOC(!showMobileTOC)}
        showTOC={showMobileTOC}
      />

      <main className="relative bg-white pb-16 lg:pb-0">
        <article ref={articleRef}>
          {/* Cinematic Hero Section with Parallax Image */}
          <section
            ref={heroRef}
            className="relative h-screen min-h-[800px] overflow-hidden bg-neutral-950"
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

            {/* Grid Pattern */}

            {/* Hero Content */}
            <motion.div
              style={{ opacity: heroOpacity }}
              className="relative z-10 flex h-full flex-col justify-end px-6 pb-24 lg:px-24 lg:pb-32"
            >
              <div className="mx-auto w-full max-w-6xl">
                {/* Back Button */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-12"
                >
                  <Link
                    href="/blog"
                    className="group inline-flex items-center gap-3 font-Satoshi text-sm font-light tracking-wider text-white/60 transition-all hover:gap-4 hover:text-white"
                  >
                    <ArrowLeft
                      size={18}
                      className="transition-transform group-hover:-translate-x-1"
                    />
                    <span>BACK TO INSIGHTS</span>
                  </Link>
                </motion.div>

                {/* Category & Meta Row */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mb-8 flex flex-wrap items-center gap-4"
                >
                  {post.category && (
                    <span
                      className={`inline-block rounded-full border px-5 py-2 font-Satoshi text-xs font-light uppercase tracking-wider backdrop-blur-sm ${colors.bg} ${colors.text} ${colors.border}`}
                    >
                      {post.category.replace("-", " ")}
                    </span>
                  )}
                  <div className="flex items-center gap-6 font-Satoshi text-sm font-light text-white/50">
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
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mb-8 max-w-5xl font-SchnyderS text-5xl font-light leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl"
                >
                  {post.title}
                </motion.h1>

                {/* Excerpt */}
                {post.excerpt && (
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mb-10 max-w-2xl font-Satoshi text-xl font-light leading-relaxed text-white/70"
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
                      {authorImageUrl && (
                        <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-white/20">
                          <Image
                            src={authorImageUrl}
                            alt={post.author.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-Satoshi text-sm font-light text-white/50">
                          Written by
                        </p>
                        <p className="font-Satoshi text-base font-medium text-white">
                          {post.author.name}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex items-center gap-4">
                    <ViewCounter
                      postId={post._id}
                      initialViews={post.viewCount || 0}
                    />
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
          </section>

          {/* Article Content */}
          <section className="relative bg-white px-6 py-20 lg:px-12 lg:py-32">
            <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1fr_280px]">
              {/* Main Content */}
              <motion.div
                ref={contentRef}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="max-w-none"
              >
                {/* Lead paragraph styling */}
                {post.excerpt && (
                  <p className="mb-12 border-l-4 border-[#c9a962] pl-6 font-SchnyderS text-2xl font-light leading-relaxed text-neutral-700 lg:text-3xl">
                    {post.excerpt}
                  </p>
                )}

                {contentWithIds && contentWithIds.length > 0 ? (
                  <PortableText
                    value={contentWithIds}
                    components={portableTextComponents}
                  />
                ) : null}

                {/* Tags Section */}
                {post.tags && post.tags.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 border-t border-neutral-200 pt-10"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-Satoshi text-xs uppercase tracking-wider text-neutral-400">
                        Tags:
                      </span>
                      {post.tags.map((tag) => {
                        const tagKey = typeof tag === "string" ? tag : tag._id;
                        const tagName =
                          typeof tag === "string" ? tag : tag.name;
                        return (
                          <span
                            key={tagKey}
                            className="rounded-full border border-neutral-200 bg-neutral-50 px-4 py-1.5 font-Satoshi text-xs font-light text-neutral-600 transition-colors hover:border-[#c9a962] hover:bg-[#c9a962]/5"
                          >
                            {tagName}
                          </span>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Reaction Buttons */}
                <div className="mt-12 border-t border-neutral-200 pt-12">
                  <ReactionButtons
                    postId={post._id}
                    initialReactions={post.reactions}
                  />
                </div>
              </motion.div>

              {/* Sidebar */}
              <aside className="hidden lg:block">
                <div className="sticky top-24 space-y-8">
                  {/* Table of Contents */}
                  {post.content && post.content.length > 0 && (
                    <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-6">
                      <TableOfContents content={post.content} />
                    </div>
                  )}

                  {/* Share Card */}
                  <div className="rounded-xl border border-neutral-200 p-6">
                    <h3 className="mb-5 flex items-center gap-2 font-Satoshi text-xs font-medium uppercase tracking-wider text-neutral-700">
                      <Share2 size={14} />
                      Share Article
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            window.open(
                              `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`,
                              "_blank"
                            );
                          }
                        }}
                        className="flex items-center justify-center gap-2 rounded-lg border border-neutral-200 py-3 font-Satoshi text-xs text-neutral-600 transition-all hover:border-neutral-950 hover:bg-neutral-950 hover:text-white"
                      >
                        <Twitter size={14} />
                        Twitter
                      </button>
                      <button
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            window.open(
                              `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`,
                              "_blank"
                            );
                          }
                        }}
                        className="flex items-center justify-center gap-2 rounded-lg border border-neutral-200 py-3 font-Satoshi text-xs text-neutral-600 transition-all hover:border-neutral-950 hover:bg-neutral-950 hover:text-white"
                      >
                        <Linkedin size={14} />
                        LinkedIn
                      </button>
                      <button
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            window.open(
                              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                              "_blank"
                            );
                          }
                        }}
                        className="flex items-center justify-center gap-2 rounded-lg border border-neutral-200 py-3 font-Satoshi text-xs text-neutral-600 transition-all hover:border-neutral-950 hover:bg-neutral-950 hover:text-white"
                      >
                        <Facebook size={14} />
                        Facebook
                      </button>
                      <button
                        onClick={copyLink}
                        className="flex items-center justify-center gap-2 rounded-lg border border-neutral-200 py-3 font-Satoshi text-xs text-neutral-600 transition-all hover:border-[#c9a962] hover:bg-[#c9a962]/10 hover:text-[#c9a962]"
                      >
                        {copied ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <Copy size={14} />
                        )}
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>

                  {/* Related Services Promo */}
                  <div className="overflow-hidden rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-950 p-6">
                    <h3 className="mb-3 font-SchnyderS text-xl font-light text-white">
                      Need Expert Help?
                    </h3>
                    <p className="mb-5 font-Satoshi text-sm font-light text-white/60">
                      Our team specializes in luxury interior design and fit-out
                      projects.
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 font-Satoshi text-xs uppercase tracking-wider text-[#c9a962] transition-colors hover:text-white"
                    >
                      <span>Get in Touch</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </section>

          {/* Author Bio Section */}
          {post.author?.name && (
            <section className="relative border-t border-neutral-200 bg-neutral-50 px-6 py-20 lg:px-12">
              <div className="mx-auto max-w-4xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center gap-8 text-center md:flex-row md:text-left"
                >
                  {authorImageUrl && (
                    <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full bg-neutral-200 ring-4 ring-white shadow-xl">
                      <Image
                        src={authorImageUrl}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="mb-2 font-Satoshi text-xs font-light uppercase tracking-wider text-[#c9a962]">
                      About the Author
                    </p>
                    <h3 className="mb-3 font-SchnyderS text-3xl font-light tracking-tight text-neutral-950">
                      {post.author.name}
                    </h3>
                    {post.author.role && (
                      <p className="mb-4 font-Satoshi text-base font-medium text-neutral-600">
                        {post.author.role}
                      </p>
                    )}
                    {post.author.bio && (
                      <p className="mb-6 max-w-xl font-Satoshi text-base font-light leading-relaxed text-neutral-500">
                        {post.author.bio}
                      </p>
                    )}
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-2 border-b border-neutral-950 pb-1 font-Satoshi text-sm font-light uppercase tracking-wider text-neutral-950 transition-colors hover:border-[#c9a962] hover:text-[#c9a962]"
                    >
                      View all articles
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </section>
          )}
        </article>

        {/* ============================================= */}
        {/* IMAGE GALLERY SECTIONS                       */}
        {/* ============================================= */}

        {/* Full-width Image Break - Show first gallery image */}
        {hasGallery && galleryImages[0] && (
          <FullWidthImageBreak
            image={galleryImages[0]}
            onImageClick={() => openLightbox(0)}
          />
        )}

        {/* Gallery Grid Section - Show images 1-6 */}
        {hasGallery && galleryImages.length > 1 && (
          <GalleryGridSection
            images={galleryImages.slice(1, 7)}
            onImageClick={(index) => openLightbox(index + 1)}
          />
        )}

        {/* Masonry Grid Section - Show remaining images */}
        {hasGallery && galleryImages.length > 7 && (
          <MasonryGridSection
            images={galleryImages.slice(7)}
            onImageClick={(index) => openLightbox(index + 7)}
          />
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="relative bg-white px-6 py-24 lg:px-12 lg:py-32">
            <div className="mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16 text-center"
              >
                <span className="mb-4 block font-Satoshi text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                  Continue Reading
                </span>
                <h2 className="font-SchnyderS text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                  Related Articles
                </h2>
              </motion.div>

              <div className="grid gap-8 md:grid-cols-3">
                {relatedPosts.map((relatedPost, index) => (
                  <RelatedPostCard
                    key={relatedPost._id}
                    post={relatedPost}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section with Background */}
        <section className="relative overflow-hidden bg-neutral-950 px-6 py-32 lg:px-12">
          {/* Background Pattern */}
          <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-[#c9a962]/5 blur-[150px]" />
          <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[#c9a962]/5 blur-[150px]" />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="mb-6 block font-Satoshi text-[10px] uppercase tracking-[0.4em] text-[#c9a962]">
                Start Your Project
              </span>
              <h2 className="mb-8 font-SchnyderS text-5xl font-light tracking-tight text-white lg:text-7xl">
                Inspired by What
                <br />
                You&apos;ve <span className="text-[#c9a962]">Read?</span>
              </h2>
              <p className="mb-12 font-Satoshi text-xl font-light text-white/60">
                Let&apos;s discuss how we can bring your interior design vision
                to life.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-3 border border-[#c9a962] bg-[#c9a962] px-10 py-5 font-Satoshi text-sm uppercase tracking-[0.2em] text-neutral-950 transition-all duration-500 hover:bg-transparent hover:text-[#c9a962]"
                >
                  <span>Start Your Project</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-2"
                  />
                </Link>
                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-3 border border-white/30 px-10 py-5 font-Satoshi text-sm uppercase tracking-[0.2em] text-white transition-all duration-500 hover:border-white hover:bg-white hover:text-neutral-950"
                >
                  <span>View Portfolio</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-2"
                  />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Mobile TOC Drawer */}
      <AnimatePresence>
        {showMobileTOC && post.content && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setShowMobileTOC(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-y-auto rounded-t-3xl bg-white p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-Satoshi text-sm font-medium uppercase tracking-wider text-neutral-950">
                  Table of Contents
                </h3>
                <button
                  onClick={() => setShowMobileTOC(false)}
                  className="rounded-full bg-neutral-100 p-2 text-neutral-500"
                >
                  <ChevronDown size={18} />
                </button>
              </div>
              <TableOfContents content={post.content} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && hasGallery && (
          <ImageLightbox
            images={galleryImages}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function RelatedPostCard({ post, index }: { post: SanityPost; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  const imageUrl = post.mainImage
    ? urlForImage(post.mainImage)?.width(600).height(450).url()
    : null;
  const colors = categoryColors[post.category || ""] || categoryColors.news;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/blog/${post.slug.current}`} className="block">
        {/* Image */}
        <div className="relative mb-5 aspect-[4/3] overflow-hidden bg-neutral-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.mainImage?.alt || post.title}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
              <span className="font-Satoshi text-neutral-300">No image</span>
            </div>
          )}

          {/* Animated Border */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-0 top-0 h-0 w-full bg-[#c9a962] transition-all duration-500 group-hover:h-1" />
            <div className="absolute right-0 top-0 h-full w-0 bg-[#c9a962] transition-all duration-500 delay-75 group-hover:w-1" />
            <div className="absolute bottom-0 right-0 h-0 w-full bg-[#c9a962] transition-all duration-500 delay-150 group-hover:h-1" />
            <div className="absolute bottom-0 left-0 h-full w-0 bg-[#c9a962] transition-all duration-500 delay-200 group-hover:w-1" />
          </div>

          {/* Category Badge */}
          {post.category && (
            <div className="absolute left-4 top-4">
              <span
                className={`inline-block rounded-full border px-3 py-1 font-Satoshi text-[9px] uppercase tracking-wider backdrop-blur-sm ${colors.bg} ${colors.text} ${colors.border}`}
              >
                {post.category.replace("-", " ")}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          {/* Title */}
          <h3 className="mb-3 line-clamp-2 font-SchnyderS text-2xl font-light tracking-tight text-neutral-950 transition-colors group-hover:text-[#c9a962]">
            {post.title}
          </h3>

          {/* Date */}
          {post.publishedAt && (
            <div className="font-Satoshi text-sm font-light text-neutral-500">
              {format(new Date(post.publishedAt), "MMM d, yyyy")}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

// ===========================================
// IMAGE GALLERY COMPONENTS
// ===========================================

// Full-width Cinematic Image Break Component
function FullWidthImageBreak({
  image,
  onImageClick,
}: {
  image: GalleryImage;
  onImageClick: () => void;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imageUrl = image.asset
    ? urlForImage(image as any)
        ?.width(1920)
        .height(1080)
        .url()
    : null;

  if (!imageUrl) return null;

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 1 }}
      className="relative -mx-6 my-20 h-[60vh] min-h-[400px] overflow-hidden lg:-mx-12 lg:my-32 lg:h-[80vh]"
    >
      {/* Parallax Image */}
      <motion.div style={{ y: imageY, scale }} className="absolute inset-0">
        <Image
          src={imageUrl}
          alt={image.alt || "Gallery image"}
          fill
          className="object-cover"
        />
      </motion.div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

      {/* Zoom Button */}
      <button
        onClick={onImageClick}
        className="absolute bottom-6 right-6 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-Satoshi text-xs uppercase tracking-wider text-white backdrop-blur-md transition-all hover:bg-white/20"
      >
        <Maximize2 size={14} />
        <span>View Full</span>
      </button>

      {/* Caption */}
      {image.caption && (
        <div className="absolute bottom-6 left-6 max-w-md">
          <p className="font-Satoshi text-sm font-light text-white/80">
            {image.caption}
          </p>
        </div>
      )}

      {/* Corner Accents */}
      <div className="absolute left-4 top-4 h-16 w-16 border-l-2 border-t-2 border-[#c9a962]/50 lg:left-8 lg:top-8 lg:h-24 lg:w-24" />
      <div className="absolute bottom-4 right-4 h-16 w-16 border-b-2 border-r-2 border-[#c9a962]/50 lg:bottom-8 lg:right-8 lg:h-24 lg:w-24" />
    </motion.div>
  );
}

// Gallery Grid Section Component
function GalleryGridSection({
  images,
  onImageClick,
}: {
  images: GalleryImage[];
  onImageClick: (index: number) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  if (!images || images.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-neutral-200 bg-neutral-50 px-6 py-20 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-[#c9a962]" />
            <Grid3X3 size={20} className="text-[#c9a962]" />
            <div className="h-px w-12 bg-[#c9a962]" />
          </div>
          <h2 className="font-SchnyderS text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
            Visual Gallery
          </h2>
          <p className="mt-4 font-Satoshi text-base font-light text-neutral-500">
            Explore the imagery from this article
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
          {images.map((image, index) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const imageUrl = image.asset
              ? urlForImage(image as any)
                  ?.width(600)
                  .height(450)
                  .url()
              : null;
            if (!imageUrl) return null;

            // Different sizes for visual interest
            const isLarge = index === 0 || index === 5;
            const isTall = index === 2;

            return (
              <motion.button
                key={image._key || index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => onImageClick(index)}
                className={`group relative overflow-hidden bg-neutral-200 ${
                  isLarge
                    ? "col-span-2 row-span-2 aspect-[4/3]"
                    : isTall
                      ? "row-span-2 aspect-[3/4]"
                      : "aspect-square"
                }`}
              >
                <Image
                  src={imageUrl}
                  alt={image.alt || `Gallery image ${index + 1}`}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/40" />

                {/* Zoom Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                    <ZoomIn size={24} className="text-white" />
                  </div>
                </div>

                {/* Index Badge */}
                <div className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 font-Satoshi text-xs font-medium text-white backdrop-blur-md opacity-0 transition-all group-hover:opacity-100">
                  {index + 1}
                </div>

                {/* Animated Border */}
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute left-0 top-0 h-0 w-full bg-[#c9a962] transition-all duration-500 group-hover:h-1" />
                  <div className="absolute right-0 top-0 h-full w-0 bg-[#c9a962] transition-all duration-500 delay-75 group-hover:w-1" />
                  <div className="absolute bottom-0 right-0 h-0 w-full bg-[#c9a962] transition-all duration-500 delay-150 group-hover:h-1" />
                  <div className="absolute bottom-0 left-0 h-full w-0 bg-[#c9a962] transition-all duration-500 delay-200 group-hover:w-1" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Masonry Grid Section Component
function MasonryGridSection({
  images,
  onImageClick,
}: {
  images: GalleryImage[];
  onImageClick: (index: number) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  if (!images || images.length === 0) return null;

  // Split images into columns for masonry effect
  const columns = [[], [], []] as GalleryImage[][];
  images.forEach((image, index) => {
    columns[index % 3].push(image);
  });

  return (
    <section
      ref={sectionRef}
      className="relative bg-neutral-950 px-6 py-20 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 block font-Satoshi text-[10px] uppercase tracking-[0.3em] text-[#c9a962]">
            Behind the Scenes
          </span>
          <h2 className="font-SchnyderS text-4xl font-light tracking-tight text-white lg:text-5xl">
            Project Imagery
          </h2>
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-4 lg:gap-6">
              {column.map((image, imgIndex) => {
                const globalIndex = imgIndex * 3 + colIndex;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const imageUrl = image.asset
                  ? urlForImage(image as any)
                      ?.width(800)
                      .height(600 + (imgIndex % 3) * 200)
                      .url()
                  : null;
                if (!imageUrl) return null;

                // Vary heights for masonry effect
                const heightClass =
                  imgIndex % 3 === 0
                    ? "aspect-[3/4]"
                    : imgIndex % 3 === 1
                      ? "aspect-square"
                      : "aspect-[4/3]";

                return (
                  <motion.button
                    key={image._key || globalIndex}
                    initial={{ opacity: 0, y: 60 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: globalIndex * 0.1 }}
                    onClick={() => onImageClick(globalIndex)}
                    className={`group relative overflow-hidden bg-neutral-800 ${heightClass}`}
                  >
                    <Image
                      src={imageUrl}
                      alt={image.alt || `Gallery image ${globalIndex + 1}`}
                      fill
                      className="object-cover transition-all duration-1000 group-hover:scale-110"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />

                    {/* Caption on Hover */}
                    {image.caption && (
                      <div className="absolute inset-x-0 bottom-0 translate-y-full p-6 transition-all duration-500 group-hover:translate-y-0">
                        <p className="font-Satoshi text-sm font-light text-white/90">
                          {image.caption}
                        </p>
                      </div>
                    )}

                    {/* Zoom Icon */}
                    <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md opacity-0 transition-all duration-500 group-hover:opacity-100">
                      <ZoomIn size={18} className="text-white" />
                    </div>

                    {/* Corner Accents */}
                    <div className="absolute left-0 top-0 h-12 w-12 border-l-2 border-t-2 border-[#c9a962]/0 transition-all duration-500 group-hover:border-[#c9a962]/60" />
                    <div className="absolute bottom-0 right-0 h-12 w-12 border-b-2 border-r-2 border-[#c9a962]/0 transition-all duration-500 group-hover:border-[#c9a962]/60" />
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Lightbox Component for Full-screen Image Viewing
function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const currentImage = images[currentIndex];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imageUrl = currentImage?.asset
    ? urlForImage(currentImage as any)
        ?.width(1920)
        .height(1080)
        .url()
    : null;

  if (!imageUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute right-6 top-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20"
      >
        <X size={24} />
      </button>

      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-6 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20"
        >
          <ChevronLeft size={28} />
        </button>
      )}
      {currentIndex < images.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-6 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20"
        >
          <ChevronRight size={28} />
        </button>
      )}

      {/* Image */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="relative max-h-[85vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={imageUrl}
          alt={currentImage.alt || "Gallery image"}
          width={1920}
          height={1080}
          className="max-h-[85vh] w-auto object-contain"
        />
      </motion.div>

      {/* Caption & Counter */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center">
        {currentImage.caption && (
          <p className="mb-4 max-w-2xl font-Satoshi text-base font-light text-white/80">
            {currentImage.caption}
          </p>
        )}
        <div className="flex items-center justify-center gap-4">
          <span className="font-Satoshi text-sm font-light text-white/50">
            {currentIndex + 1} / {images.length}
          </span>
          <div className="flex gap-1">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all ${
                  idx === currentIndex ? "w-6 bg-[#c9a962]" : "w-1 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
