import { groq } from 'next-sanity'

// Site Settings Query
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    _id,
    siteName,
    siteTagline,
    logo,
    logoAlt,
    heroImage,
    aboutImage,
    statsBackgroundImage,
    whyChooseUsImage,
    whyChooseUsSecondaryImage,
    contactBackgroundImage,
    processImages[] {
      step,
      image
    },
    founderName,
    founderTitle,
    founderImage,
    founderQuote,
    founderBio,
    defaultSeoTitle,
    defaultSeoDescription,
    ogImage
  }
`

// Project Queries with i18n support
// Note: Uses coalesce to handle both current schema field names and legacy migration field names
export const projectsQuery = groq`
  *[_type == "project" && (!defined(__i18n_lang) || __i18n_lang == $locale)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    "excerpt": coalesce(excerpt, description),
    "mainImage": coalesce(mainImage, featuredImage),
    category,
    location,
    "year": coalesce(year, yearCompleted),
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
    "excerpt": coalesce(excerpt, description),
    "mainImage": coalesce(mainImage, featuredImage),
    gallery,
    category,
    location,
    "year": coalesce(year, yearCompleted),
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
    "excerpt": coalesce(excerpt, description),
    "mainImage": coalesce(mainImage, featuredImage),
    category,
    location,
    "year": coalesce(year, yearCompleted),
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
      "mainImage": coalesce(mainImage, featuredImage),
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
      "mainImage": coalesce(mainImage, featuredImage),
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
    "excerpt": coalesce(excerpt, description),
    "mainImage": coalesce(mainImage, featuredImage),
    category,
    location,
    "year": coalesce(year, yearCompleted),
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

// Clients Queries
export const clientsQuery = groq`
  *[_type == "client" && (!defined(__i18n_lang) || __i18n_lang == $locale)] | order(order asc) {
    _id,
    name,
    logo,
    category,
    featured,
    isConfidential,
    website,
    order,
    __i18n_lang
  }
`

// Testimonials Queries
export const testimonialsQuery = groq`
  *[_type == "testimonial" && (!defined(__i18n_lang) || __i18n_lang == $locale)] | order(order asc) {
    _id,
    name,
    role,
    company,
    image,
    quote,
    rating,
    featured,
    order,
    __i18n_lang
  }
`

export const featuredTestimonialsQuery = groq`
  *[_type == "testimonial" && featured == true && (!defined(__i18n_lang) || __i18n_lang == $locale)] | order(order asc) [0...6] {
    _id,
    name,
    role,
    company,
    image,
    quote,
    rating,
    __i18n_lang
  }
`

// ============================================
// NEW TAXONOMY QUERIES
// ============================================

// Project Types Query
export const projectTypesQuery = groq`
  *[_type == "projectType"] | order(order asc) {
    _id,
    title,
    slug,
    description,
    icon,
    mainImage,
    order,
    "sector": sector->{
      _id,
      title,
      slug
    }
  }
`

export const projectTypeBySlugQuery = groq`
  *[_type == "projectType" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    icon,
    mainImage,
    seo,
    "sector": sector->{
      _id,
      title,
      slug
    }
  }
`

// Locations Query
export const locationsQuery = groq`
  *[_type == "location"] | order(type asc, order asc) {
    _id,
    name,
    slug,
    type,
    description,
    mainImage,
    countryCode,
    featured,
    order,
    "parent": parent->{
      _id,
      name,
      slug,
      type
    }
  }
`

export const featuredLocationsQuery = groq`
  *[_type == "location" && featured == true] | order(order asc) {
    _id,
    name,
    slug,
    type,
    mainImage,
    "parent": parent->{
      _id,
      name,
      slug
    }
  }
`

export const locationBySlugQuery = groq`
  *[_type == "location" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    type,
    description,
    mainImage,
    countryCode,
    coordinates,
    seo,
    "parent": parent->{
      _id,
      name,
      slug,
      type
    },
    "children": *[_type == "location" && references(^._id)] {
      _id,
      name,
      slug,
      type
    }
  }
`

// Tags Query
export const tagsQuery = groq`
  *[_type == "tag"] | order(category asc, order asc) {
    _id,
    name,
    slug,
    category,
    description,
    icon,
    color,
    featured,
    order
  }
`

export const featuredTagsQuery = groq`
  *[_type == "tag" && featured == true] | order(order asc) {
    _id,
    name,
    slug,
    category,
    icon,
    color
  }
`

export const tagsByCategoryQuery = groq`
  *[_type == "tag" && category == $category] | order(order asc) {
    _id,
    name,
    slug,
    category,
    description,
    icon,
    color
  }
`

// Enhanced Project Query with Full Taxonomy
export const projectWithTaxonomyQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    gallery,
    year,
    area,
    status,
    featured,
    publishedAt,
    client,
    duration,
    budget,
    units,
    challenge,
    approach,
    scope,
    outcome,
    testimonial,
    content,
    videoUrl,
    seo,
    "sector": sector->{
      _id,
      title,
      slug,
      icon
    },
    "projectType": projectType->{
      _id,
      title,
      slug,
      icon,
      "sector": sector->{
        _id,
        title,
        slug
      }
    },
    "location": location->{
      _id,
      name,
      slug,
      type,
      "parent": parent->{
        _id,
        name,
        slug,
        type
      }
    },
    "services": services[]->{
      _id,
      title,
      slug,
      icon
    },
    "tags": tags[]->{
      _id,
      name,
      slug,
      category,
      icon,
      color
    },
    "clientRef": clientRef->{
      _id,
      name,
      logo
    }
  }
`

// Projects with Full Taxonomy (for listing)
export const projectsWithTaxonomyQuery = groq`
  *[_type == "project"] | order(year desc, publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    year,
    area,
    status,
    featured,
    "sector": sector->{
      _id,
      title,
      slug
    },
    "projectType": projectType->{
      _id,
      title,
      slug
    },
    "location": location->{
      _id,
      name,
      slug,
      type
    },
    "services": services[]->{
      _id,
      title,
      slug
    },
    "tags": tags[]->{
      _id,
      name,
      slug,
      category
    }
  }
`

// Projects by Sector (Industry)
export const projectsBySectorQuery = groq`
  *[_type == "project" && references(*[_type == "industry" && slug.current == $sectorSlug]._id)] | order(year desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    year,
    area,
    status,
    featured,
    "sector": sector->{
      _id,
      title,
      slug
    },
    "projectType": projectType->{
      _id,
      title,
      slug
    },
    "location": location->{
      _id,
      name,
      slug,
      type
    }
  }
`

// Projects by Project Type
export const projectsByTypeQuery = groq`
  *[_type == "project" && references(*[_type == "projectType" && slug.current == $typeSlug]._id)] | order(year desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    year,
    status,
    "sector": sector->{
      _id,
      title,
      slug
    },
    "projectType": projectType->{
      _id,
      title,
      slug
    },
    "location": location->{
      _id,
      name,
      slug
    }
  }
`

// Projects by Location
export const projectsByLocationQuery = groq`
  *[_type == "project" && references(*[_type == "location" && slug.current == $locationSlug]._id)] | order(year desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    year,
    status,
    "sector": sector->{
      _id,
      title,
      slug
    },
    "projectType": projectType->{
      _id,
      title,
      slug
    },
    "location": location->{
      _id,
      name,
      slug,
      type
    }
  }
`

// Projects by Tag
export const projectsByTagQuery = groq`
  *[_type == "project" && references(*[_type == "tag" && slug.current == $tagSlug]._id)] | order(year desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    year,
    status,
    "sector": sector->{
      _id,
      title,
      slug
    },
    "tags": tags[]->{
      _id,
      name,
      slug,
      category
    }
  }
`

// Award-Winning Projects
export const awardWinningProjectsQuery = groq`
  *[_type == "project" && count(tags[_ref in *[_type == "tag" && category == "award"]._id]) > 0] | order(year desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    year,
    "sector": sector->{
      _id,
      title,
      slug
    },
    "tags": tags[]->{
      _id,
      name,
      slug,
      category,
      icon
    }
  }
`
