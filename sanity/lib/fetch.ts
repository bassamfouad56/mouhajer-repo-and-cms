/**
 * Sanity Data Fetching with i18n Support
 */

import { client } from './client'
import {
  projectsQuery,
  projectBySlugQuery,
  featuredProjectsQuery,
  servicesQuery,
  serviceBySlugQuery,
  industriesQuery,
  industryBySlugQuery,
  postsQuery,
  postBySlugQuery,
  featuredPostsQuery,
  projectsByCategoryQuery,
  postsByCategoryQuery,
} from './queries'

// Projects
export async function getSanityProjects(locale: string = 'en') {
  try {
    return await client.fetch(projectsQuery, { locale }, { next: { revalidate: 3600 } })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

export async function getSanityProjectBySlug(slug: string, locale: string = 'en') {
  try {
    return await client.fetch(projectBySlugQuery, { slug, locale }, { next: { revalidate: 3600 } })
  } catch (error) {
    console.error(`Error fetching project ${slug}:`, error)
    return null
  }
}

export async function getFeaturedProjects(locale: string = 'en') {
  try {
    return await client.fetch(featuredProjectsQuery, { locale }, { next: { revalidate: 3600 } })
  } catch (error) {
    console.error('Error fetching featured projects:', error)
    return []
  }
}

export async function getProjectsByCategory(category: string, locale: string = 'en') {
  try {
    return await client.fetch(projectsByCategoryQuery, { category, locale }, { next: { revalidate: 3600 } })
  } catch (error) {
    console.error(`Error fetching projects by category ${category}:`, error)
    return []
  }
}

// Services
export async function getSanityServices(locale: string = 'en') {
  try {
    return await client.fetch(servicesQuery, { locale }, { next: { revalidate: 3600 } })
  } catch (error) {
    console.error('Error fetching services:', error)
    return []
  }
}

export async function getSanityServiceBySlug(slug: string, locale: string = 'en') {
  try {
    return await client.fetch(serviceBySlugQuery, { slug, locale }, { next: { revalidate: 3600 } })
  } catch (error) {
    console.error(`Error fetching service ${slug}:`, error)
    return null
  }
}

// Industries
export async function getSanityIndustries(locale: string = 'en') {
  try {
    return await client.fetch(industriesQuery, { locale }, { next: { revalidate: 3600 } })
  } catch (error) {
    console.error('Error fetching industries:', error)
    return []
  }
}

export async function getSanityIndustryBySlug(slug: string, locale: string = 'en') {
  try {
    return await client.fetch(industryBySlugQuery, { slug, locale }, { next: { revalidate: 3600 } })
  } catch (error) {
    console.error(`Error fetching industry ${slug}:`, error)
    return null
  }
}

// Blog Posts
export async function getSanityPosts(locale: string = 'en') {
  try {
    return await client.fetch(postsQuery, { locale }, { next: { revalidate: 3600 } })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export async function getSanityPostBySlug(slug: string, locale: string = 'en') {
  try {
    return await client.fetch(postBySlugQuery, { slug, locale }, { next: { revalidate: 3600 } })
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error)
    return null
  }
}

export async function getFeaturedPosts(locale: string = 'en') {
  try {
    return await client.fetch(featuredPostsQuery, { locale }, { next: { revalidate: 3600 } })
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    return []
  }
}

export async function getPostsByCategory(category: string, locale: string = 'en') {
  try {
    return await client.fetch(postsByCategoryQuery, { category, locale }, { next: { revalidate: 3600 } })
  } catch (error) {
    console.error(`Error fetching posts by category ${category}:`, error)
    return []
  }
}
