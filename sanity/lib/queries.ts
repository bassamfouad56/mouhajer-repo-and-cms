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
    "title": coalesce(title[$locale], title.en, title),
    slug,
    "excerpt": coalesce(excerpt[$locale], excerpt.en, coalesce(excerpt, description)),
    "mainImage": coalesce(mainImage, featuredImage),
    "legacyCategory": category,
    "sector": sector->{
      _id,
      "title": coalesce(title[$locale], title.en, title),
      slug
    },
    "projectType": projectType->{
      _id,
      "title": coalesce(title[$locale], title.en, title),
      slug
    },
    "location": location->{
      _id,
      "name": coalesce(name[$locale], name.en, name),
      slug
    },
    "services": services[]->{
      _id,
      "title": coalesce(title[$locale], title.en, title),
      slug
    },
    "year": coalesce(year, yearCompleted),
    status,
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
    gallery[] {
      _key,
      asset,
      alt,
      caption,
      category
    },
    category,
    "year": coalesce(year, yearCompleted),
    area,
    client,
    status,
    featured,
    duration,
    budget,
    units,
    challenge,
    approach,
    scope,
    outcome,
    testimonial,
    videoUrl,
    content,
    publishedAt,
    seo,
    __i18n_lang,
    // Taxonomy references
    "sector": sector->{
      _id,
      title,
      slug,
      icon
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
      slug,
      icon,
      __i18n_lang
    },
    "tags": tags[]->{
      _id,
      name,
      slug,
      category,
      icon
    },
    "industries": industries[]->{
      _id,
      title,
      slug,
      __i18n_lang
    }
  }
`

// Featured Project Query - includes all fields needed for featured template
export const featuredProjectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug && (!defined(__i18n_lang) || __i18n_lang == $locale)][0] {
    _id,
    title,
    slug,
    "excerpt": coalesce(excerpt, description),
    "mainImage": coalesce(mainImage, featuredImage),
    gallery[] {
      _key,
      asset,
      alt,
      caption,
      category
    },
    videoUrl,
    featured,
    status,
    "year": coalesce(year, yearCompleted),
    area,
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
    publishedAt,
    seo,
    __i18n_lang,
    // Featured content fields
    featuredContent {
      heroVideo,
      visionStatement,
      highlightStats[] {
        value,
        label,
        suffix
      },
      transformationTitle
    },
    // Taxonomy references
    "sector": sector->{
      _id,
      title,
      slug,
      icon
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
      type,
      "parent": parent->{
        _id,
        name,
        slug
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
      icon
    },
    "clientRef": clientRef->{
      _id,
      name,
      logo
    },
    // Related featured projects for navigation
    "relatedFeaturedProjects": *[_type == "project" && featured == true && slug.current != $slug] | order(publishedAt desc)[0...4] {
      _id,
      title,
      slug,
      "mainImage": coalesce(mainImage, featuredImage),
      "sector": sector->{ title, slug }
    },
    // All featured projects for prev/next navigation
    "allFeaturedProjects": *[_type == "project" && featured == true] | order(publishedAt desc) {
      _id,
      slug,
      title,
      "mainImage": coalesce(mainImage, featuredImage)
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
    "title": coalesce(title[$locale], title.en, title),
    slug,
    "excerpt": coalesce(excerpt[$locale], excerpt.en, excerpt),
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
    "title": coalesce(title[$locale], title.en, title),
    slug,
    "excerpt": coalesce(excerpt[$locale], excerpt.en, excerpt),
    mainImage,
    icon,
    "features": features[] {
      "title": coalesce(title[$locale], title.en, title),
      "description": coalesce(description[$locale], description.en, description)
    },
    "process": process[] {
      step,
      "title": coalesce(title[$locale], title.en, title),
      "description": coalesce(description[$locale], description.en, description)
    },
    content,
    "seo": {
      "metaTitle": coalesce(seo.metaTitle[$locale], seo.metaTitle.en, seo.metaTitle),
      "metaDescription": coalesce(seo.metaDescription[$locale], seo.metaDescription.en, seo.metaDescription),
      "keywords": seo.keywords
    },
    __i18n_lang,
    "relatedProjects": relatedProjects[]-> {
      _id,
      title,
      slug,
      "mainImage": coalesce(mainImage, featuredImage),
      gallery,
      category,
      location,
      __i18n_lang
    },
    // Auto-fetch projects that reference this service
    "linkedProjects": *[_type == "project" && references(^._id)] | order(featured desc, publishedAt desc)[0...8] {
      _id,
      title,
      slug,
      "mainImage": coalesce(mainImage, featuredImage),
      gallery
    },
    // Fallback: featured projects if no linked projects
    "featuredProjects": *[_type == "project" && featured == true] | order(publishedAt desc)[0...8] {
      _id,
      title,
      slug,
      "mainImage": coalesce(mainImage, featuredImage),
      gallery
    }
  }
`

// Industry Queries with i18n support
export const industriesQuery = groq`
  *[_type == "industry" && (!defined(__i18n_lang) || __i18n_lang == $locale)] | order(order asc) {
    _id,
    "title": coalesce(title[$locale], title.en, title),
    slug,
    "excerpt": coalesce(excerpt[$locale], excerpt.en, excerpt),
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
    "title": coalesce(title[$locale], title.en, title),
    slug,
    "excerpt": coalesce(excerpt[$locale], excerpt.en, excerpt),
    mainImage,
    icon,
    "challenges": challenges[] {
      "title": coalesce(title[$locale], title.en, title),
      "description": coalesce(description[$locale], description.en, description)
    },
    "solutions": solutions[] {
      "title": coalesce(title[$locale], title.en, title),
      "description": coalesce(description[$locale], description.en, description)
    },
    content,
    "seo": {
      "metaTitle": coalesce(seo.metaTitle[$locale], seo.metaTitle.en, seo.metaTitle),
      "metaDescription": coalesce(seo.metaDescription[$locale], seo.metaDescription.en, seo.metaDescription),
      "keywords": seo.keywords
    },
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
      "title": coalesce(title[$locale], title.en, title),
      slug,
      mainImage,
      __i18n_lang
    }
  }
`

// Blog/Journal Post Queries with i18n support
export const postsQuery = groq`
  *[_type == "post" && (!defined(__i18n_lang) || __i18n_lang == $locale)] | order(publishedAt desc) {
    _id,
    "title": coalesce(title[$locale], title.en, title),
    slug,
    "excerpt": coalesce(excerpt[$locale], excerpt.en, excerpt),
    mainImage,
    category,
    "author": {
      "name": author.name,
      "role": coalesce(author.role[$locale], author.role.en, author.role),
      "image": author.image
    },
    readTime,
    "tags": tags[]->{
      _id,
      "name": coalesce(name[$locale], name.en, name),
      slug
    },
    featured,
    publishedAt,
    __i18n_lang
  }
`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug && (!defined(__i18n_lang) || __i18n_lang == $locale)][0] {
    _id,
    "title": coalesce(title[$locale], title.en, title),
    slug,
    "excerpt": coalesce(excerpt[$locale], excerpt.en, excerpt),
    mainImage,
    gallery[] {
      _key,
      asset,
      alt,
      caption
    },
    category,
    "author": {
      "name": author.name,
      "role": coalesce(author.role[$locale], author.role.en, author.role),
      "image": author.image,
      "bio": author.bio
    },
    content,
    readTime,
    "tags": tags[]->{
      _id,
      "name": coalesce(name[$locale], name.en, name),
      slug
    },
    publishedAt,
    viewCount,
    reactions,
    "seo": {
      "metaTitle": coalesce(seo.metaTitle[$locale], seo.metaTitle.en, seo.metaTitle),
      "metaDescription": coalesce(seo.metaDescription[$locale], seo.metaDescription.en, seo.metaDescription),
      "keywords": seo.keywords
    },
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
    "title": coalesce(title[$locale], title.en, title),
    slug,
    "excerpt": coalesce(excerpt[$locale], excerpt.en, excerpt),
    mainImage,
    category,
    "author": {
      "name": author.name,
      "role": coalesce(author.role[$locale], author.role.en, author.role),
      "image": author.image
    },
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
    "title": coalesce(title[$locale], title.en, title),
    slug,
    "excerpt": coalesce(excerpt[$locale], excerpt.en, excerpt),
    mainImage,
    category,
    "author": {
      "name": author.name,
      "role": coalesce(author.role[$locale], author.role.en, author.role),
      "image": author.image
    },
    readTime,
    "tags": tags[]->{
      _id,
      "name": coalesce(name[$locale], name.en, name),
      slug
    },
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
    "role": coalesce(role[$locale], role.en, role),
    "company": coalesce(company[$locale], company.en, company),
    image,
    "quote": coalesce(quote[$locale], quote.en, quote),
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
    "role": coalesce(role[$locale], role.en, role),
    "company": coalesce(company[$locale], company.en, company),
    image,
    "quote": coalesce(quote[$locale], quote.en, quote),
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
    gallery[] {
      _key,
      asset,
      alt,
      caption,
      category
    },
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
    // Featured content fields
    featuredContent {
      heroVideo,
      visionStatement,
      highlightStats[] {
        value,
        label,
        suffix
      },
      transformationTitle
    },
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

// ============================================
// ADVANCED FILTERING QUERIES (Phase 1)
// ============================================

// Combined Filter Query - supports multiple filters at once
// Params: $sectorSlug (optional), $typeSlug (optional), $locationSlug (optional), $locale
export const projectsWithFiltersQuery = groq`
  *[_type == "project"
    && (!defined(__i18n_lang) || __i18n_lang == $locale)
    && (!defined($sectorSlug) || sector->slug.current == $sectorSlug)
    && (!defined($typeSlug) || projectType->slug.current == $typeSlug)
    && (!defined($locationSlug) || location->slug.current == $locationSlug)
  ] | order(year desc, publishedAt desc) {
    _id,
    title,
    slug,
    "excerpt": coalesce(excerpt, description),
    "mainImage": coalesce(mainImage, featuredImage),
    "year": coalesce(year, yearCompleted),
    status,
    featured,
    publishedAt,
    __i18n_lang,
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
    }
  }
`

// Ongoing Projects Query - filters by status (in-progress)
export const ongoingProjectsQuery = groq`
  *[_type == "project"
    && status == "in-progress"
    && (!defined(__i18n_lang) || __i18n_lang == $locale)
  ] | order(publishedAt desc) {
    _id,
    title,
    slug,
    "excerpt": coalesce(excerpt, description),
    "mainImage": coalesce(mainImage, featuredImage),
    "year": coalesce(year, yearCompleted),
    status,
    featured,
    publishedAt,
    __i18n_lang,
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

// Filter Counts Query - returns counts for each filter option
// Used for faceted filtering to show "Villa (12)" etc.
export const filterCountsQuery = groq`
{
  "sectors": {
    "residential": count(*[_type == "project" && sector->slug.current == "residential" && (!defined(__i18n_lang) || __i18n_lang == $locale)]),
    "commercial": count(*[_type == "project" && sector->slug.current == "commercial" && (!defined(__i18n_lang) || __i18n_lang == $locale)]),
    "hospitality": count(*[_type == "project" && sector->slug.current == "hospitality" && (!defined(__i18n_lang) || __i18n_lang == $locale)]),
    "ongoing": count(*[_type == "project" && status == "in-progress" && (!defined(__i18n_lang) || __i18n_lang == $locale)])
  },
  "projectTypes": *[_type == "projectType"] {
    "slug": slug.current,
    "count": count(*[_type == "project" && references(^._id) && (!defined(__i18n_lang) || __i18n_lang == $locale)])
  },
  "locations": *[_type == "location"] {
    "slug": slug.current,
    "count": count(*[_type == "project" && references(^._id) && (!defined(__i18n_lang) || __i18n_lang == $locale)])
  }
}
`

// Get Projects by Main Category (sector-based with i18n)
// This replaces the old category-based query for our new system
export const projectsByMainCategoryQuery = groq`
  *[_type == "project"
    && sector->slug.current == $category
    && (!defined(__i18n_lang) || __i18n_lang == $locale)
  ] | order(year desc, publishedAt desc) {
    _id,
    title,
    slug,
    "excerpt": coalesce(excerpt, description),
    "mainImage": coalesce(mainImage, featuredImage),
    "year": coalesce(year, yearCompleted),
    status,
    featured,
    publishedAt,
    __i18n_lang,
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

// ============================================
// MEGA MENU IMAGES QUERY
// ============================================

// Fetch images for mega menu from various content types
export const megaMenuImagesQuery = groq`
{
  "projects": {
    "residential": *[_type == "project" && (category == "residential" || sector->slug.current == "residential")][0] {
      "mainImage": coalesce(mainImage, featuredImage)
    },
    "commercial": *[_type == "project" && (category == "commercial" || sector->slug.current == "commercial")][0] {
      "mainImage": coalesce(mainImage, featuredImage)
    },
    "hospitality": *[_type == "project" && (category == "hospitality" || sector->slug.current == "hospitality")][0] {
      "mainImage": coalesce(mainImage, featuredImage)
    },
    "ongoing": *[_type == "project" && status == "in-progress"][0] {
      "mainImage": coalesce(mainImage, featuredImage)
    },
    "featured": *[_type == "project" && featured == true] | order(publishedAt desc)[0] {
      "mainImage": coalesce(mainImage, featuredImage)
    }
  },
  "services": *[_type == "service"] | order(order asc) {
    _id,
    title,
    slug,
    mainImage
  },
  "industries": *[_type == "industry"] | order(order asc) {
    _id,
    title,
    slug,
    // Use industry mainImage, or fallback to a matching project image based on slug
    "mainImage": coalesce(
      mainImage,
      // Fallback: get image from a project that matches the industry category
      select(
        slug.current == "luxury-hospitality" => *[_type == "project" && category == "hospitality"][0].mainImage,
        slug.current == "high-end-residential" => *[_type == "project" && category == "residential"][0].mainImage,
        slug.current == "commercial-corporate" => *[_type == "project" && category == "commercial"][0].mainImage,
        // Default fallback: any featured project
        *[_type == "project" && featured == true][0].mainImage
      )
    )
  },
  "posts": {
    "designTrends": *[_type == "post" && category == "design-trends"][0] {
      mainImage
    },
    "projectStories": *[_type == "post" && category == "project-stories"][0] {
      mainImage
    },
    "materialsCraft": *[_type == "post" && category == "materials-craft"][0] {
      mainImage
    },
    "engineering": *[_type == "post" && category == "engineering"][0] {
      mainImage
    },
    "featured": *[_type == "post" && featured == true] | order(publishedAt desc)[0] {
      mainImage
    }
  },
  "about": {
    "process": *[_type == "siteSettings"][0] {
      "mainImage": processImages[0].image
    },
    "awards": *[_type == "project" && featured == true][0] {
      "mainImage": coalesce(mainImage, featuredImage)
    }
  }
}`

// ============================================
// HOMEPAGE QUERY
// ============================================

export const homepageQuery = groq`
  *[_type == "homepage"][0] {
    _id,
    sections[] {
      _type,
      _key,
      enabled,

      // Hero Section
      _type == "heroSection" => {
        "headline": headline[$locale],
        "subheadline": subheadline[$locale],
        videoUrl,
        fallbackImage,
        "primaryCta": {
          "text": primaryCta.text[$locale],
          "link": primaryCta.link
        },
        "secondaryCta": {
          "text": secondaryCta.text[$locale],
          "link": secondaryCta.link
        },
        showAwardBadge,
        showScrollIndicator
      },

      // Unified Showcase Section
      _type == "showcaseSection" => {
        backgroundImage,
        "clientTypes": clientTypes[] {
          "title": title[$locale],
          "subtitle": subtitle[$locale],
          "stat": {
            "value": stat.value,
            "label": stat.label[$locale]
          },
          link
        },
        "panels": panels[] {
          number,
          "title": title[$locale],
          "subtitle": subtitle[$locale],
          "services": services[][$locale],
          image,
          link
        }
      },

      // Stats Section
      _type == "statsSection" => {
        "stats": stats[] {
          value,
          suffix,
          "label": label[$locale]
        },
        backgroundImages
      },

      // Logo Marquee Section
      _type == "logoMarqueeSection" => {
        "sectionTitle": sectionTitle[$locale],
        displayMode,
        "clients": select(
          displayMode == "manual" => selectedClients[]-> {
            _id,
            name,
            logo,
            category
          },
          displayMode == "auto" => *[_type == "client" && featured == true] | order(order asc) {
            _id,
            name,
            logo,
            category
          }
        ),
        animationSpeed
      },

      // Founder Section
      _type == "founderSection" => {
        "sectionTitle": sectionTitle[$locale],
        founderName,
        "founderTitle": founderTitle[$locale],
        founderImage,
        "quote": quote[$locale],
        "message": message[$locale],
        "ctaText": ctaText[$locale],
        ctaLink
      },

      // Capabilities Section
      _type == "capabilitiesSection" => {
        "sectionTitle": sectionTitle[$locale],
        "capabilities": capabilities[] {
          "title": title[$locale],
          "subtitle": subtitle[$locale],
          "description": description[$locale],
          image,
          link
        },
        "ctaText": ctaText[$locale],
        ctaLink
      },

      // Portfolio Section
      _type == "portfolioSection" => {
        "sectionTitle": sectionTitle[$locale],
        "sectionSubtitle": sectionSubtitle[$locale],
        displayMode,
        maxProjects,
        "projects": select(
          displayMode == "manual" => featuredProjects[]-> {
            _id,
            title,
            slug,
            "excerpt": coalesce(excerpt, description),
            "mainImage": coalesce(mainImage, featuredImage),
            category,
            "location": location->{name, slug},
            "year": coalesce(year, yearCompleted)
          },
          displayMode == "auto" => *[_type == "project" && featured == true] | order(publishedAt desc)[0..^.maxProjects] {
            _id,
            title,
            slug,
            "excerpt": coalesce(excerpt, description),
            "mainImage": coalesce(mainImage, featuredImage),
            category,
            "location": location->{name, slug},
            "year": coalesce(year, yearCompleted)
          }
        ),
        "ctaText": ctaText[$locale],
        ctaLink
      },

      // Industries Section
      _type == "industriesSection" => {
        "sectionTitle": sectionTitle[$locale],
        displayMode,
        "industries": select(
          displayMode == "manual" => featuredIndustries[]-> {
            _id,
            "title": coalesce(title[$locale], title.en, title),
            slug,
            "excerpt": coalesce(excerpt[$locale], excerpt.en, excerpt),
            mainImage,
            icon
          },
          displayMode == "auto" => *[_type == "industry" && featured == true] | order(order asc) {
            _id,
            "title": coalesce(title[$locale], title.en, title),
            slug,
            "excerpt": coalesce(excerpt[$locale], excerpt.en, excerpt),
            mainImage,
            icon
          }
        ),
        "ctaText": ctaText[$locale],
        ctaLink
      },

      // Partners & Testimonials Section
      _type == "partnersSection" => {
        "sectionTitle": sectionTitle[$locale],
        showPartners,
        showTestimonials,
        "testimonials": featuredTestimonials[]-> {
          _id,
          name,
          "role": coalesce(role[$locale], role.en, role),
          "company": coalesce(company[$locale], company.en, company),
          image,
          "quote": coalesce(quote[$locale], quote.en, quote),
          rating
        }
      },

      // Certifications Section
      _type == "certificationsSection" => {
        "sectionTitle": sectionTitle[$locale],
        "certifications": certifications[] {
          name,
          code,
          "description": description[$locale],
          icon
        },
        "awards": awards[] {
          "title": title[$locale],
          year,
          organization,
          certificate,
          downloadUrl,
          externalUrl
        }
      },

      // FAQ Section
      _type == "faqSection" => {
        "sectionTitle": sectionTitle[$locale],
        "sectionSubtitle": sectionSubtitle[$locale],
        "faqs": faqs[] {
          "question": question[$locale],
          "answer": answer[$locale]
        }
      },

      // Contact Section
      _type == "contactSection" => {
        "sectionTitle": sectionTitle[$locale],
        "sectionSubtitle": sectionSubtitle[$locale],
        backgroundImage,
        theme,
        "contactInfo": {
          "email": contactInfo.email,
          "phone": contactInfo.phone,
          "address": contactInfo.address[$locale],
          "hours": contactInfo.hours
        }
      }
    },
    "seo": {
      "metaTitle": seo.metaTitle[$locale],
      "metaDescription": seo.metaDescription[$locale],
      "ogImage": seo.ogImage
    }
  }
`
