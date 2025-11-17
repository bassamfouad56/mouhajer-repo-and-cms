'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/wordpress';
import { ArrowLeft, Calendar, User, Tag, Clock, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { format } from 'date-fns';

interface BlogPostContentProps {
  post: Post;
  relatedPosts: Post[];
}

export default function BlogPostContent({ post, relatedPosts }: BlogPostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true });

  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <main className="relative bg-white">
      {/* Hero Section */}
      <article>
        <section className="relative overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 px-6 py-32 lg:px-12 lg:py-48">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />

          <div className="relative z-10 mx-auto max-w-4xl">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 text-sm font-light tracking-wider text-neutral-400 transition-all hover:gap-4 hover:text-white"
              >
                <ArrowLeft size={16} />
                <span>BACK TO BLOG</span>
              </Link>
            </motion.div>

            {/* Categories */}
            {post.categories.nodes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-6 flex flex-wrap gap-2"
              >
                {post.categories.nodes.map((category) => (
                  <span
                    key={category.id}
                    className="rounded-full border border-neutral-700 px-4 py-2 text-xs font-light tracking-wider text-neutral-400"
                  >
                    {category.name}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8 text-5xl font-light tracking-tight text-white lg:text-7xl"
            >
              {post.title}
            </motion.h1>

            {/* Meta Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-6 border-t border-neutral-800 pt-8 text-sm font-light text-neutral-400"
            >
              {post.author?.node?.name && (
                <div className="flex items-center gap-2">
                  <User size={18} />
                  <span>{post.author.node.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{format(new Date(post.date), 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{readingTime} min read</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Image */}
        {post.featuredImage?.node?.sourceUrl && (
          <section className="relative bg-neutral-50 px-6 py-16 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mx-auto max-w-6xl"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-neutral-200">
                <Image
                  src={post.featuredImage.node.sourceUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          </section>
        )}

        {/* Article Content */}
        <section className="relative bg-white px-6 py-16 lg:px-12 lg:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_300px]">
            {/* Main Content */}
            <motion.div
              ref={contentRef}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="prose prose-lg prose-neutral max-w-none font-light prose-headings:font-light prose-headings:tracking-tight prose-a:text-neutral-950 prose-a:underline prose-a:transition-colors hover:prose-a:text-neutral-600"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Share */}
              <div className="sticky top-24">
                <div className="rounded-lg border border-neutral-200 p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-light tracking-wider text-neutral-500">
                    <Share2 size={16} />
                    SHARE ARTICLE
                  </h3>
                  <div className="space-y-3">
                    <button className="flex w-full items-center gap-3 border border-neutral-200 px-4 py-3 text-sm font-light text-neutral-700 transition-all hover:border-neutral-950 hover:bg-neutral-950 hover:text-white">
                      <Facebook size={18} />
                      <span>Facebook</span>
                    </button>
                    <button className="flex w-full items-center gap-3 border border-neutral-200 px-4 py-3 text-sm font-light text-neutral-700 transition-all hover:border-neutral-950 hover:bg-neutral-950 hover:text-white">
                      <Twitter size={18} />
                      <span>Twitter</span>
                    </button>
                    <button className="flex w-full items-center gap-3 border border-neutral-200 px-4 py-3 text-sm font-light text-neutral-700 transition-all hover:border-neutral-950 hover:bg-neutral-950 hover:text-white">
                      <Linkedin size={18} />
                      <span>LinkedIn</span>
                    </button>
                  </div>
                </div>

                {/* Tags */}
                {post.tags.nodes.length > 0 && (
                  <div className="mt-8 rounded-lg border border-neutral-200 p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-light tracking-wider text-neutral-500">
                      <Tag size={16} />
                      TAGS
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.nodes.map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-light text-neutral-600"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </section>

        {/* Author Bio */}
        {post.author?.node && (
          <section className="relative border-t border-neutral-200 bg-neutral-50 px-6 py-16 lg:px-12">
            <div className="mx-auto max-w-4xl">
              <div className="flex gap-6">
                {post.author.node.avatar?.url && (
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-neutral-200">
                    <Image
                      src={post.author.node.avatar.url}
                      alt={post.author.node.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="mb-2 text-xl font-light tracking-tight text-neutral-950">
                    Written by {post.author.node.name}
                  </h3>
                  {post.author.node.description && (
                    <p className="font-light leading-relaxed text-neutral-600">
                      {post.author.node.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="relative bg-white px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12">
              <h2 className="text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                Related Articles
              </h2>
            </div>

            <div className="grid gap-12 md:grid-cols-3">
              {relatedPosts.map((relatedPost, index) => (
                <RelatedPostCard key={relatedPost.id} post={relatedPost} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative bg-neutral-950 px-6 py-32 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-light tracking-tight text-white lg:text-5xl">
            Inspired by What You've Read?
          </h2>
          <p className="mb-10 text-lg font-light text-neutral-400">
            Let's discuss how we can bring your design vision to life.
          </p>
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-3 border border-white px-10 py-5 text-sm font-light tracking-widest text-white transition-all hover:bg-white hover:text-neutral-950"
          >
            <span>START YOUR PROJECT</span>
            <ArrowLeft size={18} className="rotate-180 transition-transform group-hover:translate-x-2" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function RelatedPostCard({ post, index }: { post: Post; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Image */}
        <div className="relative mb-4 aspect-[4/3] overflow-hidden bg-neutral-100">
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
        </div>

        {/* Title */}
        <h3 className="mb-2 text-xl font-light tracking-tight text-neutral-950 transition-colors group-hover:text-neutral-600">
          {post.title}
        </h3>

        {/* Date */}
        <div className="text-sm font-light text-neutral-500">
          {format(new Date(post.date), 'MMM d, yyyy')}
        </div>
      </Link>
    </motion.div>
  );
}
