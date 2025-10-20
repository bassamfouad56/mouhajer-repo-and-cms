# Mouhajer CMS - GraphQL API Documentation

## 🚀 Quick Start

### Access the GraphQL Playground
Navigate to: **http://localhost:3010/api/graphql**

The Apollo Sandbox playground will automatically load, allowing you to:
- Explore the complete GraphQL schema
- Test queries and mutations interactively
- View documentation for all types and fields
- Test authentication

---

## 📚 API Overview

The Mouhajer CMS GraphQL API provides complete CRUD operations for all CMS resources with:
- ✅ **Strong typing** via GraphQL schema
- ✅ **Automatic documentation** via introspection
- ✅ **Authentication** via NextAuth.js sessions
- ✅ **Admin-only mutations** for content management
- ✅ **Bilingual support** (English/Arabic)
- ✅ **Pagination** for list queries
- ✅ **Filtering and search** capabilities

---

## 🔐 Authentication

### Session-Based Auth
The API uses NextAuth.js session cookies for authentication. Protected queries/mutations check:
- User is authenticated (`user` exists in context)
- User has admin role (`user.role === 'admin'`) for mutations

### Public Queries
Some queries are public (no auth required):
- `pages`, `page`, `pageBySlug`
- `projects`, `project`
- `services`, `service`, `serviceBySlug`
- `blog`, `blogPost`
- `publicNavigation`
- `activeAds`

### Protected Queries (Admin Only)
- All `users` queries
- All `mediaFiles` queries
- All `activityLogs` queries
- CRM queries (`leads`, `contacts`, `companies`, `deals`, `tasks`)

### Protected Mutations (Admin Only)
All mutations require admin authentication except:
- `logActivity` (requires any authenticated user)
- `verifyRoomRedesign` (owner or admin)
- `deleteRoomRedesign` (owner or admin)

---

## 📦 Available Resources

### Content Management
1. **Pages** - Website pages with blocks and SEO
2. **Projects** - Project portfolio items
3. **Services** - Service offerings
4. **Blog** - Blog posts with categories

### Media & Assets
5. **Media** - File management (upload via REST `/api/media/upload`)
6. **Ads** - Advertisement management and tracking

### Navigation
7. **Navigation** - Menu items with hierarchy and reordering

### User Management
8. **Users** - User accounts with role-based access

### CRM
9. **Leads** - Potential clients with scoring
10. **Contacts** - Active clients
11. **Companies** - Business accounts
12. **Deals** - Sales pipeline
13. **Tasks** - CRM tasks and follow-ups
14. **CRM Activities** - Call logs, emails, meetings

### Features
15. **Room Redesign** - AI room redesign uploads and results
16. **Activity Logs** - System activity tracking
17. **Settings** - Site-wide configuration

---

## 🎯 Query Examples

### Get All Pages
```graphql
query GetPages {
  pages(limit: 10, offset: 0, filter: { status: "published" }) {
    pages {
      id
      titleEn
      titleAr
      slugEn
      slugAr
      status
      featured
      createdAt
    }
    total
    hasMore
  }
}
```

### Get Page by Slug
```graphql
query GetPageBySlug($slugEn: String, $slugAr: String) {
  pageBySlug(slugEn: $slugEn, slugAr: $slugAr) {
    id
    titleEn
    titleAr
    blocks {
      id
      type
      data
      order
    }
    seoMetaTitleEn
    seoMetaDescEn
  }
}
```

### Get Projects with Filtering
```graphql
query GetProjects {
  projects(
    limit: 12,
    offset: 0,
    filter: { featured: true, category: "residential" }
  ) {
    projects {
      id
      titleEn
      titleAr
      descriptionEn
      descriptionAr
      images
      category
      featured
    }
    total
    hasMore
  }
}
```

### Get Service by Slug
```graphql
query GetServiceBySlug($slugEn: String!) {
  serviceBySlug(slugEn: $slugEn) {
    id
    titleEn
    titleAr
    descriptionEn
    descriptionAr
    shortDescriptionEn
    shortDescriptionAr
    featuresEn
    featuresAr
    price
    duration
    images
    faqs {
      questionEn
      answerEn
    }
  }
}
```

### Get Current User
```graphql
query GetMe {
  me {
    id
    name
    email
    role
    image
    createdAt
  }
}
```

### Get CRM Leads
```graphql
query GetLeads {
  leads(
    limit: 20,
    filter: { status: "new", qualified: true }
  ) {
    leads {
      id
      name
      email
      phone
      projectType
      budgetRange
      score
      assignedTo
      createdAt
    }
    total
    hasMore
  }
}
```

---

## ✏️ Mutation Examples

### Create Page
```graphql
mutation CreatePage($input: CreatePageInput!) {
  createPage(input: $input) {
    id
    titleEn
    titleAr
    slugEn
    slugAr
    status
  }
}

# Variables:
{
  "input": {
    "titleEn": "About Us",
    "titleAr": "معلومات عنا",
    "slugEn": "about",
    "slugAr": "معلومات",
    "descriptionEn": "Learn about our company",
    "descriptionAr": "تعرف على شركتنا",
    "status": "draft",
    "featured": false
  }
}
```

### Update Project
```graphql
mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
  updateProject(id: $id, input: $input) {
    id
    titleEn
    titleAr
    featured
  }
}

# Variables:
{
  "id": "project-uuid",
  "input": {
    "featured": true
  }
}
```

### Create Lead
```graphql
mutation CreateLead($input: CreateLeadInput!) {
  createLead(input: $input) {
    id
    name
    email
    phone
    projectType
    score
  }
}

# Variables:
{
  "input": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+971501234567",
    "source": "website",
    "projectType": "villa_design",
    "budgetRange": "500k-1m"
  }
}
```

### Track Ad Click
```graphql
mutation TrackAdClick($id: ID!) {
  trackAdClick(id: $id)
}
```

---

## 🔍 Schema Types

### Bilingual Fields
Most content uses bilingual fields with `En` and `Ar` suffixes:
```graphql
type Page {
  titleEn: String!
  titleAr: String!
  descriptionEn: String
  descriptionAr: String
}
```

### Custom Scalars
- `DateTime` - ISO 8601 date-time strings
- `JSON` - Arbitrary JSON data for dynamic content

### Enums
```graphql
enum UserRole {
  USER
  ADMIN
}
```

### Pagination Pattern
All list queries return a response type with:
```graphql
type PagesResponse {
  pages: [Page!]!
  total: Int!
  hasMore: Boolean!
}
```

---

## 📁 File Uploads

**Note:** File uploads are handled via REST API (not GraphQL):

### Upload Media
```bash
POST /api/media/upload
Content-Type: multipart/form-data

Body: { file: <binary> }
```

### Room Redesign Upload
```bash
POST /api/room-redesign/upload
Content-Type: multipart/form-data

Body: { file: <binary>, roomType: "living_room", style: "modern" }
```

After upload, use GraphQL to query/update metadata:
```graphql
query GetMediaFile($id: ID!) {
  mediaFile(id: $id) {
    id
    url
    filename
    mimeType
  }
}

mutation UpdateMediaAlt($id: ID!, $input: UpdateMediaInput!) {
  updateMedia(id: $id, input: $input) {
    id
    altEn
    altAr
  }
}
```

---

## 🔄 Real-World Workflows

### Workflow 1: Create and Publish a Page
```graphql
# 1. Create draft page
mutation {
  createPage(input: {
    titleEn: "Services",
    titleAr: "خدمات",
    slugEn: "services",
    slugAr: "خدمات",
    status: "draft"
  }) {
    id
  }
}

# 2. Add blocks (update page)
mutation {
  updatePage(id: "page-id", input: {
    blocks: [
      {
        type: "hero",
        data: {
          titleEn: "Our Services",
          titleAr: "خدماتنا"
        },
        order: 0
      }
    ]
  }) {
    id
  }
}

# 3. Publish
mutation {
  updatePage(id: "page-id", input: {
    status: "published"
  }) {
    id
    status
  }
}
```

### Workflow 2: Convert Lead to Contact
```graphql
mutation ConvertLead($leadId: ID!) {
  convertLead(id: $leadId, createDeal: true, dealValue: 500000) {
    contact {
      id
      firstName
      lastName
    }
    deal {
      id
      titleEn
      value
      stage
    }
    success
    message
  }
}
```

### Workflow 3: Reorder Navigation
```graphql
mutation ReorderNavigation {
  reorderNavigation(items: [
    { id: "nav-1", order: 0 },
    { id: "nav-2", order: 1 },
    { id: "nav-3", order: 2 }
  ])
}
```

---

## 🛠️ Development Tips

### Use GraphQL Introspection
The playground automatically provides:
- Auto-completion
- Field documentation
- Type information
- Query validation

### Test with Variables
Always use GraphQL variables instead of inline values:
```graphql
# ✅ Good
query GetPage($id: ID!) {
  page(id: $id) { ... }
}

# ❌ Bad
query {
  page(id: "hardcoded-id") { ... }
}
```

### Explore the Schema
Use the "Schema" tab in Apollo Sandbox to:
- Browse all types
- View field descriptions
- Understand relationships
- Find available queries/mutations

### Handle Errors
GraphQL returns errors in standard format:
```json
{
  "errors": [
    {
      "message": "Unauthorized - Admin access required",
      "extensions": {
        "code": "UNAUTHORIZED"
      }
    }
  ]
}
```

---

## 🎨 Frontend Integration

### Apollo Client Setup (Next.js)
```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3010/api/graphql',
  credentials: 'include', // Include cookies for auth
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
```

### Query in Component
```typescript
import { useQuery, gql } from '@apollo/client';

const GET_PAGES = gql`
  query GetPages {
    pages(limit: 10) {
      pages {
        id
        titleEn
        slugEn
      }
    }
  }
`;

function PagesList() {
  const { data, loading, error } = useQuery(GET_PAGES);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.pages.pages.map(page => (
        <li key={page.id}>{page.titleEn}</li>
      ))}
    </ul>
  );
}
```

---

## 🚦 Rate Limits & Best Practices

1. **Pagination**: Always use `limit` and `offset` for large datasets
2. **Field Selection**: Only query fields you need (avoid over-fetching)
3. **Caching**: Apollo Client caches automatically by ID
4. **Error Handling**: Always handle both `loading` and `error` states
5. **Authentication**: Include credentials in all requests
6. **Batch Queries**: Use GraphQL's ability to query multiple resources in one request

---

## 📞 Support

For issues or questions:
- Check the Apollo Sandbox documentation tab
- Use GraphQL introspection to explore the schema
- Review error messages in the `extensions` field
- Test queries in the playground before integrating

---

## 🎉 Summary

The Mouhajer CMS GraphQL API provides:
- **50+ Queries** across 17 resource types
- **60+ Mutations** for full CRUD operations
- **Complete type safety** with GraphQL schema
- **Built-in documentation** via introspection
- **Interactive playground** at `/api/graphql`
- **Bilingual support** for EN/AR content
- **Authentication & authorization** via NextAuth
- **Pagination, filtering, and search** capabilities

Happy querying! 🚀
