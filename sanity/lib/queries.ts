import { groq } from 'next-sanity'

// Project Queries with i18n support
export const projectsQuery = groq`
  *[_type == "project" && (!defined(__i18n_lang) || __i18n_lang == $locale)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    category,
    location,
    year,
    featured,
    publishedAt,
    __i18n_lang
  }
`

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug && (!defined(__i18n_lang) || __i18n_lang == $locale)][0] {
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
    __i18n_lang,
    "services": services[]-> {
      _id,
      title,
      slug,
      __i18n_lang
    },
    "industries": industries[]-> {
      _id,
      title,
      slug,
      __i18n_lang
    }
  }
`

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true && (!defined(__i18n_lang) || __i18n_lang == $locale)] | order(publishedAt desc) [0...6] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    category,
    location,
    year,
    __i18n_lang
  }
`

// Service Queries with i18n support
export const servicesQuery = groq`
  *[_type == "service" && (!defined(__i18n_lang) || __i18n_lang == $locale)] | order(order asc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    icon,
    featured,
    order,
    __i18n_lang
  }
`

export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug && (!defined(__i18n_lang) || __i18n_lang == $locale)][0] {
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
    __i18n_lang,
    "relatedProjects": relatedProjects[]-> {
      _id,
      title,
      slug,
      mainImage,
      category,
      location,
      __i18n_lang
    }
  }
`

// Industry Queries with i18n support
export const industriesQuery = groq`
  *[_type == "industry" && (!defined(__i18n_lang) || __i18n_lang == $locale)] | order(order asc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    icon,
    featured,
    order,
    __i18n_lang
  }
`

export const industryBySlugQuery = groq`
  *[_type == "industry" && slug.current == $slug && (!defined(__i18n_lang) || __i18n_lang == $locale)][0] {
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
    __i18n_lang,
    "relatedProjects": relatedProjects[]-> {
      _id,
      title,
      slug,
      mainImage,
      category,
      location,
      __i18n_lang
    },
    "relatedServices": relatedServices[]-> {
      _id,
      title,
      slug,
      mainImage,
      __i18n_lang
    }
  }
`

// Blog Post Queries with i18n support
export const postsQuery = groq`
  *[_type == "post" && (!defined(__i18n_lang) || __i18n_lang == $locale)] | order(publishedAt desc) {
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
    publishedAt,
    __i18n_lang
  }
`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug && (!defined(__i18n_lang) || __i18n_lang == $locale)][0] {
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
    __i18n_lang,
    "relatedProjects": relatedProjects[]-> {
      _id,
      title,
      slug,
      mainImage,
      category,
      __i18n_lang
    }
  }
`

export const featuredPostsQuery = groq`
  *[_type == "post" && featured == true && (!defined(__i18n_lang) || __i18n_lang == $locale)] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    category,
    author,
    readTime,
    publishedAt,
    __i18n_lang
  }
`

// Category Queries with i18n support
export const projectsByCategoryQuery = groq`
  *[_type == "project" && category == $category && (!defined(__i18n_lang) || __i18n_lang == $locale)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    category,
    location,
    year,
    __i18n_lang
  }
`

export const postsByCategoryQuery = groq`
  *[_type == "post" && category == $category && (!defined(__i18n_lang) || __i18n_lang == $locale)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    category,
    author,
    readTime,
    publishedAt,
    __i18n_lang
  }
`
