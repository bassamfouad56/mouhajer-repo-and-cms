# GraphQL Setup - Mouhajer CMS

## Overview
GraphQL API is now available in the Mouhajer CMS. This provides a flexible, type-safe way to query and mutate data.

## GraphQL Endpoint

**Development**: `http://localhost:3010/api/graphql`
**Production**: `https://your-domain.com/api/graphql`

## GraphQL Playground

To access the GraphQL Playground (development only):

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:3010/api/graphql
```

3. The Apollo Server Sandbox will open automatically where you can:
   - Explore the schema
   - Run queries and mutations
   - View documentation
   - Test with different variables

## Authentication

Most mutations and some queries require authentication. To authenticate in the Playground:

1. Login to the CMS at `http://localhost:3010/login`
2. Copy the session cookie from your browser's DevTools
3. In the Playground, add it to the Headers:
```json
{
  "Cookie": "your-session-cookie-here"
}
```

## Example Queries

### Get All Projects
```graphql
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
```

### Get Single Project
```graphql
query GetProject($id: ID!) {
  project(id: $id) {
    id
    titleEn
    titleAr
    descriptionEn
    descriptionAr
    images
    category
    featured
  }
}
```

Variables:
```json
{
  "id": "project-uuid-here"
}
```

### Get Filtered Projects
```graphql
query GetFeaturedProjects {
  projects(
    filter: { featured: true, status: "published" }
    limit: 5
  ) {
    projects {
      id
      titleEn
      titleAr
      images
      category
    }
    total
  }
}
```

### Search Projects
```graphql
query SearchProjects($search: String!) {
  projects(filter: { search: $search }) {
    projects {
      id
      titleEn
      titleAr
      category
    }
    total
  }
}
```

### Get All Services
```graphql
query GetServices {
  services {
    services {
      id
      titleEn
      titleAr
      shortDescriptionEn
      shortDescriptionAr
      icon
      featuresEn
      featuresAr
      price
      duration
      featured
    }
    total
  }
}
```

### Get Blog Posts
```graphql
query GetBlogPosts {
  blogPosts(limit: 10) {
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
```

### Get Single Blog Post by Slug
```graphql
query GetBlogPost($slugEn: String!) {
  blogPost(slugEn: $slugEn) {
    id
    titleEn
    titleAr
    contentEn
    contentAr
    featuredImage
    author
    publishedAt
  }
}
```

### Get Settings
```graphql
query GetSettings {
  settings {
    id
    siteNameEn
    siteNameAr
    siteDescriptionEn
    siteDescriptionAr
    contactEmail
    contactPhone
    contactAddressEn
    contactAddressAr
    socialFacebook
    socialInstagram
    socialTwitter
    socialLinkedin
    socialYoutube
    logoUrl
    faviconUrl
  }
}
```

## Example Mutations

### Create Project (Requires Authentication)
```graphql
mutation CreateProject($input: CreateProjectInput!) {
  createProject(input: $input) {
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
```

Variables:
```json
{
  "input": {
    "titleEn": "New Project",
    "titleAr": "مشروع جديد",
    "descriptionEn": "Project description in English",
    "descriptionAr": "وصف المشروع بالعربية",
    "images": ["https://example.com/image1.jpg"],
    "category": "residential",
    "featured": false,
    "status": "published"
  }
}
```

### Update Project (Requires Authentication)
```graphql
mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
  updateProject(id: $id, input: $input) {
    id
    titleEn
    titleAr
    featured
  }
}
```

Variables:
```json
{
  "id": "project-uuid-here",
  "input": {
    "featured": true
  }
}
```

### Delete Project (Requires Admin)
```graphql
mutation DeleteProject($id: ID!) {
  deleteProject(id: $id)
}
```

### Create Blog Post (Requires Authentication)
```graphql
mutation CreateBlogPost($input: CreateBlogPostInput!) {
  createBlogPost(input: $input) {
    id
    titleEn
    titleAr
    slugEn
    slugAr
    status
  }
}
```

Variables:
```json
{
  "input": {
    "titleEn": "My New Blog Post",
    "titleAr": "مقالتي الجديدة",
    "slugEn": "my-new-blog-post",
    "slugAr": "مقالتي-الجديدة",
    "excerptEn": "Short excerpt",
    "excerptAr": "مقتطف قصير",
    "contentEn": "Full content here",
    "contentAr": "المحتوى الكامل هنا",
    "category": "technology",
    "tags": ["graphql", "api"],
    "featured": false,
    "status": "draft"
  }
}
```

### Update Settings (Requires Admin)
```graphql
mutation UpdateSettings($input: UpdateSettingsInput!) {
  updateSettings(input: $input) {
    id
    siteNameEn
    siteNameAr
    contactEmail
  }
}
```

Variables:
```json
{
  "input": {
    "contactEmail": "contact@mouhajer.com",
    "contactPhone": "+1234567890"
  }
}
```

## Error Handling

GraphQL returns errors in a standardized format:

```json
{
  "errors": [
    {
      "message": "Authentication required",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ],
  "data": null
}
```

Common error codes:
- `UNAUTHENTICATED`: User not logged in
- `FORBIDDEN`: User doesn't have required permissions
- `BAD_REQUEST`: Invalid input or parameters

## Schema Exploration

In the Playground, click on the "Docs" or "Schema" tab to explore:
- All available types
- Query and mutation signatures
- Input types and their fields
- Field descriptions

## Performance Tips

1. **Request only what you need**: Don't fetch unnecessary fields
2. **Use pagination**: Always set `limit` and `offset` for large datasets
3. **Use filters**: Filter on the backend instead of fetching all data
4. **Batch requests**: You can send multiple queries in one request

## Next Steps

See [GRAPHQL_MIGRATION.md](../../mouhajer-repo/GRAPHQL_MIGRATION.md) in the frontend repository for instructions on:
- Setting up Apollo Client in mouhajer-repo
- Generating TypeScript types
- Creating queries and mutations
- Migrating from REST to GraphQL
