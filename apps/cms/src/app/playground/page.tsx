'use client';

import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import 'graphiql/graphiql.css';

const fetcher = createGraphiQLFetcher({
  url: '/api/graphql',
});

const defaultQuery = `# Welcome to GraphQL Playground for Mouhajer CMS
#
# Example Queries and Mutations below
# Press the Play button to execute
# Use Ctrl+Space for autocomplete

# ========================================
# QUERIES
# ========================================

# Get All Projects
query GetProjects {
  projects(limit: 10, offset: 0) {
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
      updatedAt
    }
    total
    hasMore
  }
}

# Get Single Project by ID
# query GetProject {
#   project(id: "your-project-id-here") {
#     id
#     titleEn
#     titleAr
#     descriptionEn
#     descriptionAr
#     images
#     category
#     featured
#     status
#   }
# }

# Get Filtered Projects
# query GetFeaturedProjects {
#   projects(
#     filter: { featured: true, status: "published" }
#     limit: 5
#   ) {
#     projects {
#       id
#       titleEn
#       titleAr
#       images
#       category
#     }
#     total
#   }
# }

# Get All Services
# query GetServices {
#   services {
#     services {
#       id
#       titleEn
#       titleAr
#       shortDescriptionEn
#       shortDescriptionAr
#       icon
#       featuresEn
#       featuresAr
#       price
#       duration
#       featured
#     }
#     total
#   }
# }

# Get Blog Posts
# query GetBlogPosts {
#   blogPosts(limit: 10) {
#     posts {
#       id
#       titleEn
#       titleAr
#       slugEn
#       slugAr
#       excerptEn
#       excerptAr
#       featuredImage
#       category
#       tags
#       author
#       publishedAt
#       featured
#       status
#     }
#     total
#     hasMore
#   }
# }

# Get Blog Post by Slug
# query GetBlogPost {
#   blogPost(slugEn: "your-slug-here") {
#     id
#     titleEn
#     titleAr
#     contentEn
#     contentAr
#     featuredImage
#     author
#     publishedAt
#   }
# }

# Get Settings
# query GetSettings {
#   settings {
#     id
#     siteNameEn
#     siteNameAr
#     siteDescriptionEn
#     siteDescriptionAr
#     contactEmail
#     contactPhone
#     contactAddressEn
#     contactAddressAr
#     socialFacebook
#     socialInstagram
#     socialTwitter
#     socialLinkedin
#     socialYoutube
#     logoUrl
#     faviconUrl
#   }
# }

# ========================================
# MUTATIONS (Require Authentication)
# ========================================

# Create Project
# mutation CreateProject {
#   createProject(input: {
#     titleEn: "New Project"
#     titleAr: "مشروع جديد"
#     descriptionEn: "Project description in English"
#     descriptionAr: "وصف المشروع بالعربية"
#     images: ["https://example.com/image1.jpg"]
#     category: "residential"
#     featured: false
#     status: "published"
#   }) {
#     id
#     titleEn
#     titleAr
#     status
#   }
# }

# Update Project
# mutation UpdateProject {
#   updateProject(
#     id: "your-project-id-here"
#     input: {
#       featured: true
#     }
#   ) {
#     id
#     titleEn
#     featured
#   }
# }

# Delete Project (Requires Admin)
# mutation DeleteProject {
#   deleteProject(id: "your-project-id-here")
# }

# Create Blog Post
# mutation CreateBlogPost {
#   createBlogPost(input: {
#     titleEn: "My New Blog Post"
#     titleAr: "مقالتي الجديدة"
#     slugEn: "my-new-blog-post"
#     slugAr: "مقالتي-الجديدة"
#     excerptEn: "Short excerpt"
#     excerptAr: "مقتطف قصير"
#     contentEn: "Full content here"
#     contentAr: "المحتوى الكامل هنا"
#     category: "technology"
#     tags: ["graphql", "api"]
#     featured: false
#     status: "draft"
#   }) {
#     id
#     titleEn
#     titleAr
#     slugEn
#     status
#   }
# }

# Update Settings (Requires Admin)
# mutation UpdateSettings {
#   updateSettings(input: {
#     contactEmail: "contact@mouhajer.com"
#     contactPhone: "+1234567890"
#   }) {
#     id
#     siteNameEn
#     siteNameAr
#     contactEmail
#   }
# }
`;

export default function PlaygroundPage() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <GraphiQL fetcher={fetcher} defaultQuery={defaultQuery} />
    </div>
  );
}
