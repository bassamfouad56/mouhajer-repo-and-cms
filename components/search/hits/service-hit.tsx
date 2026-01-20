'use client'

import Link from 'next/link'
import {
  Ruler,
  Wrench,
  Zap,
  Hammer,
  Building2,
  Settings
} from 'lucide-react'
import type { ServiceHit } from '@/lib/algolia/types'

interface ServiceHitProps {
  hit: ServiceHit
  locale: string
  onClick?: () => void
}

const serviceIcons: Record<string, React.ReactNode> = {
  'interior-architecture': <Ruler className="h-5 w-5" />,
  'manufacturing-joinery': <Hammer className="h-5 w-5" />,
  'mep-engineering': <Zap className="h-5 w-5" />,
  'civil-construction': <Building2 className="h-5 w-5" />,
  'handover-maintenance': <Wrench className="h-5 w-5" />,
}

export function ServiceHitComponent({ hit, locale, onClick }: ServiceHitProps) {
  const title = hit.title?.[locale as 'en' | 'ar'] || hit.title?.en || 'Untitled'
  const description = hit.description?.[locale as 'en' | 'ar'] || hit.description?.en || ''
  const icon = serviceIcons[hit.slug] || <Settings className="h-5 w-5" />

  return (
    <Link
      href={`/${locale}/services/${hit.slug}`}
      onClick={onClick}
      className="group flex items-center gap-4 rounded-lg border-l-4 border-emerald-500 bg-white/5 p-4 transition-all hover:bg-emerald-500/10"
    >
      {/* Icon */}
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 transition-colors group-hover:bg-emerald-500/30">
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-emerald-400">
            Service
          </span>
        </div>

        <h4 className="mt-1 truncate font-medium text-white group-hover:text-emerald-400">
          {title}
        </h4>

        {description && (
          <p className="mt-0.5 line-clamp-1 text-xs text-neutral-400">
            {description}
          </p>
        )}
      </div>

      {/* Arrow indicator */}
      <div className="text-neutral-500 transition-transform group-hover:translate-x-1 group-hover:text-emerald-400">
        →
      </div>
    </Link>
  )
}
