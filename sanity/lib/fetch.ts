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
export async function getSanityProjects() {
  return await client.fetch(projectsQuery, {}, { next: { revalidate: 3600 } })
}

export async function getSanityProjectBySlug(slug: string) {
  return await client.fetch(projectBySlugQuery, { slug }, { next: { revalidate: 3600 } })
}

export async function getFeaturedProjects() {
  return await client.fetch(featuredProjectsQuery, {}, { next: { revalidate: 3600 } })
}

export async function getProjectsByCategory(category: string) {
  return await client.fetch(projectsByCategoryQuery, { category }, { next: { revalidate: 3600 } })
}

// Services
export async function getSanityServices() {
  return await client.fetch(servicesQuery, {}, { next: { revalidate: 3600 } })
}

export async function getSanityServiceBySlug(slug: string) {
  return await client.fetch(serviceBySlugQuery, { slug }, { next: { revalidate: 3600 } })
}

// Industries
export async function getSanityIndustries() {
  return await client.fetch(industriesQuery, {}, { next: { revalidate: 3600 } })
}

export async function getSanityIndustryBySlug(slug: string) {
  return await client.fetch(industryBySlugQuery, { slug }, { next: { revalidate: 3600 } })
}

// Blog Posts
export async function getSanityPosts() {
  return await client.fetch(postsQuery, {}, { next: { revalidate: 3600 } })
}

export async function getSanityPostBySlug(slug: string) {
  return await client.fetch(postBySlugQuery, { slug }, { next: { revalidate: 3600 } })
}

export async function getFeaturedPosts() {
  return await client.fetch(featuredPostsQuery, {}, { next: { revalidate: 3600 } })
}

export async function getPostsByCategory(category: string) {
  return await client.fetch(postsByCategoryQuery, { category }, { next: { revalidate: 3600 } })
}
