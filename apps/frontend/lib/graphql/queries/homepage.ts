export const GET_HOMEPAGE_DATA = `
  query GetHomepageData($locale: String!, $mediaLimit: Int) {
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
    homePage: pages(where: { OR: [{ slug: "home" }, { slug: "Home" }, { title: "Home" }] }) {
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
    }
    featuredBlogs: blogPosts(filter: { featured: true }, limit: 3) {
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
    }
  }
`;

export const GET_PROJECTS = `
  query GetProjects($featured: Boolean, $category: String, $limit: Int) {
    projects(filter: { featured: $featured, category: $category }, limit: $limit) {
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
    }
  }
`;

export const GET_BLOG_POSTS = `
  query GetBlogPosts($featured: Boolean, $status: String, $limit: Int) {
    blogPosts(filter: { featured: $featured, status: $status }, limit: $limit) {
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