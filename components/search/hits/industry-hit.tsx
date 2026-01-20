'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Briefcase, Building, Home, Hotel } from 'lucide-react'
import type { IndustryHit } from '@/lib/algolia/types'

interface IndustryHitProps {
  hit: IndustryHit
  locale: string
  onClick?: () => void
}

const industryIcons: Record<string, React.ReactNode> = {
  'luxury-hospitality': <Hotel className="h-5 w-5" />,
  'high-end-residential': <Home className="h-5 w-5" />,
  'commercial-corporate': <Briefcase className="h-5 w-5" />,
}

export function IndustryHitComponent({ hit, locale, onClick }: IndustryHitProps) {
  const title = hit.title?.[locale as 'en' | 'ar'] || hit.title?.en || 'Untitled'
  const description = hit.description?.[locale as 'en' | 'ar'] || hit.description?.en || ''
  const icon = industryIcons[hit.slug] || <Building className="h-5 w-5" />

  return (
    <Link
      href={`/${locale}/industries/${hit.slug}`}
      onClick={onClick}
      className="group flex items-center gap-4 rounded-lg border-l-4 border-purple-500 bg-white/5 p-4 transition-all hover:bg-purple-500/10"
    >
      {/* Icon or Image */}
      {hit.mainImage ? (
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-800">
          <Image
            src={hit.mainImage}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 transition-colors group-hover:bg-purple-500/30">
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-purple-400">
            Industry
          </span>
          {hit.projectCount && hit.projectCount > 0 && (
            <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs text-purple-400">
              {hit.projectCount} project{hit.projectCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <h4 className="mt-1 truncate font-medium text-white group-hover:text-purple-400">
          {title}
        </h4>

        {description && (
          <p className="mt-0.5 line-clamp-1 text-xs text-neutral-400">
            {description}
          </p>
        )}
      </div>

      {/* Arrow indicator */}
      <div className="text-neutral-500 transition-transform group-hover:translate-x-1 group-hover:text-purple-400">
        →
      </div>
    </Link>
  )
}
