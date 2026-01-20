export type ContentType = 'project' | 'post' | 'service' | 'industry'

export interface BaseHit {
  objectID: string
  type: ContentType
  title: { en: string; ar: string }
  slug: string
}

export interface ProjectHit extends BaseHit {
  type: 'project'
  mainImage?: string
  location?: string
  industry?: string
  year?: number
}

export interface PostHit extends BaseHit {
  type: 'post'
  excerpt?: { en: string; ar: string }
  category?: string
  mainImage?: string
  readTime?: number
  publishedAt?: string
}

export interface ServiceHit extends BaseHit {
  type: 'service'
  description?: { en: string; ar: string }
  icon?: string
}

export interface IndustryHit extends BaseHit {
  type: 'industry'
  description?: { en: string; ar: string }
  projectCount?: number
  mainImage?: string
}

export type SearchHit = ProjectHit | PostHit | ServiceHit | IndustryHit

// Type guard functions
export function isProjectHit(hit: SearchHit): hit is ProjectHit {
  return hit.type === 'project'
}

export function isPostHit(hit: SearchHit): hit is PostHit {
  return hit.type === 'post'
}

export function isServiceHit(hit: SearchHit): hit is ServiceHit {
  return hit.type === 'service'
}

export function isIndustryHit(hit: SearchHit): hit is IndustryHit {
  return hit.type === 'industry'
}
