import { groq } from 'next-sanity'

// Project Queries
export const projectsQuery = groq`
  *[_type == "project"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    category,
    location,
    year,
    featured,
    publishedAt
  }
`

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    gallery,
    category,
    location,
    year,
    area,
    client,
    content,
    publishedAt,
    seo,
    "services": services[]-> {
      _id,
      title,
      slug
    },
    "industries": industries[]-> {
      _id,
      title,
      slug
    }
  }
`

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(publishedAt desc) [0...6] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    category,
    location,
    year
  }
`

// Service Queries
export const servicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    icon,
    featured,
    order
  }
`

export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    icon,
    features,
    process,
    content,
    seo,
    "relatedProjects": relatedProjects[]-> {
      _id,
      title,
      slug,
      mainImage,
      category,
      location
    }
  }
`

// Industry Queries
export const industriesQuery = groq`
  *[_type == "industry"] | order(order asc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    icon,
    featured,
    order
  }
`

export const industryBySlugQuery = groq`
  *[_type == "industry" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    icon,
    challenges,
    solutions,
    content,
    seo,
    "relatedProjects": relatedProjects[]-> {
      _id,
      title,
      slug,
      mainImage,
      category,
      location
    },
    "relatedServices": relatedServices[]-> {
      _id,
      title,
      slug,
      mainImage
    }
  }
`

// Blog Post Queries
export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    category,
    author,
    readTime,
    tags,
    featured,
    publishedAt
  }
`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    category,
    author,
    content,
    readTime,
    tags,
    publishedAt,
    seo,
    "relatedProjects": relatedProjects[]-> {
      _id,
      title,
      slug,
      mainImage,
      category
    }
  }
`

export const featuredPostsQuery = groq`
  *[_type == "post" && featured == true] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    category,
    author,
    readTime,
    publishedAt
  }
`

// Category Queries
export const projectsByCategoryQuery = groq`
  *[_type == "project" && category == $category] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    category,
    location,
    year
  }
`

export const postsByCategoryQuery = groq`
  *[_type == "post" && category == $category] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    category,
    author,
    readTime,
    publishedAt
  }
`
