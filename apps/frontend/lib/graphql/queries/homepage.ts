export const GET_HOMEPAGE_DATA = `
  query GetHomepageData($mediaLimit: Int) {
    settings {
      id
      siteNameEn
      siteNameAr
      siteDescriptionEn
      siteDescriptionAr
      contactPhone
      contactEmail
      logoUrl
      seoMetaTitleEn
      seoMetaTitleAr
      seoMetaDescriptionEn
      seoMetaDescriptionAr
      seoKeywords
    }
    homePage: pageBySlug(slugEn: "home") {
      id
      titleEn
      titleAr
      slugEn
      slugAr
      blocks {
        id
        type
        data
        order
      }
    }
    featuredProjects: projects(filter: { featured: true }, limit: 6) {
      projects {
        id
        titleEn
        titleAr
        descriptionEn
        descriptionAr
        images
        category
        featured
        status
      }
      total
      hasMore
    }
    featuredBlogs: blogPosts(filter: { featured: true, status: "published" }, limit: 3) {
      posts {
        id
        titleEn
        titleAr
        slugEn
        slugAr
        excerptEn
        excerptAr
        featuredImage
        category
        author
        publishedAt
        featured
      }
      total
      hasMore
    }
    media(limit: $mediaLimit) {
      media {
        id
        title
        url
        type
        altText
        caption
        size
      }
      total
      hasMore
    }
  }
`;

export const GET_PROJECTS = `
  query GetProjects($filter: ProjectFilterInput, $limit: Int) {
    projects(filter: $filter, limit: $limit) {
      projects {
        id
        titleEn
        titleAr
        descriptionEn
        descriptionAr
        images
        category
        featured
        status
        createdAt
      }
      total
      hasMore
    }
  }
`;

export const GET_BLOG_POSTS = `
  query GetBlogPosts($filter: BlogPostFilterInput, $limit: Int) {
    blogPosts(filter: $filter, limit: $limit) {
      posts {
        id
        titleEn
        titleAr
        slugEn
        slugAr
        excerptEn
        excerptAr
        contentEn
        contentAr
        featuredImage
        category
        tags
        author
        publishedAt
        featured
        status
      }
      total
      hasMore
    }
  }
`;

export const GET_SETTINGS = `
  query GetSettings {
    settings {
      id
      siteNameEn
      siteNameAr
      siteDescriptionEn
      siteDescriptionAr
      contactEmail
      contactPhone
      logoUrl
      seoMetaTitleEn
      seoMetaTitleAr
      seoMetaDescriptionEn
      seoMetaDescriptionAr
      seoKeywords
    }
  }
`;

export const GET_HOME_PAGE = `
  query GetHomePage {
    pages(where: { slug: "home" }) {
      pages {
        id
        title
        slug
        blocks {
          id
          type
          data
          order
        }
      }
    }
  }
`;

export const GET_MEDIA = `
  query GetMedia($limit: Int) {
    media(limit: $limit) {
      media {
        id
        title
        url
        type
        altText
        caption
        size
        tags
        createdAt
      }
      total
      hasMore
    }
  }
`;
