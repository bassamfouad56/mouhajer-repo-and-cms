'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Clock, Calendar } from 'lucide-react'
import type { PostHit } from '@/lib/algolia/types'

interface PostHitProps {
  hit: PostHit
  locale: string
  onClick?: () => void
}

const categoryColors: Record<string, string> = {
  'design-trends': 'bg-blue-500/20 text-blue-400',
  'project-stories': 'bg-purple-500/20 text-purple-400',
  'behind-the-scenes': 'bg-orange-500/20 text-orange-400',
  'materials-craft': 'bg-emerald-500/20 text-emerald-400',
  'engineering': 'bg-cyan-500/20 text-cyan-400',
  'founders-insights': 'bg-amber-500/20 text-amber-400',
}

export function PostHitComponent({ hit, locale, onClick }: PostHitProps) {
  const title = hit.title?.[locale as 'en' | 'ar'] || hit.title?.en || 'Untitled'
  const excerpt = hit.excerpt?.[locale as 'en' | 'ar'] || hit.excerpt?.en || ''
  const categoryClass = categoryColors[hit.category || ''] || 'bg-neutral-500/20 text-neutral-400'

  const formattedDate = hit.publishedAt
    ? new Date(hit.publishedAt).toLocaleDateString(locale === 'ar' ? 'ar-AE' : 'en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null

  return (
    <Link
      href={`/${locale}/journal/${hit.category}/${hit.slug}`}
      onClick={onClick}
      className="group flex items-center gap-4 rounded-lg border-l-4 border-blue-500 bg-white/5 p-4 transition-all hover:bg-blue-500/10"
    >
      {/* Thumbnail */}
      {hit.mainImage && (
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-neutral-800">
          <Image
            src={hit.mainImage}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-blue-400">
            Article
          </span>
          {hit.category && (
            <span className={`rounded-full px-2 py-0.5 text-xs ${categoryClass}`}>
              {hit.category.replace(/-/g, ' ')}
            </span>
          )}
        </div>

        <h4 className="mt-1 truncate font-medium text-white group-hover:text-blue-400">
          {title}
        </h4>

        {excerpt && (
          <p className="mt-0.5 line-clamp-1 text-xs text-neutral-400">
            {excerpt}
          </p>
        )}

        <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500">
          {hit.readTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {hit.readTime} min read
            </span>
          )}
          {formattedDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formattedDate}
            </span>
          )}
        </div>
      </div>

      {/* Arrow indicator */}
      <div className="text-neutral-500 transition-transform group-hover:translate-x-1 group-hover:text-blue-400">
        →
      </div>
    </Link>
  )
}
