# GraphQL Usage Guide - Mouhajer Frontend

## Overview
This guide shows you how to use GraphQL in the mouhajer-repo frontend application.

## Setup

### 1. Environment Variables

Add to your `.env.local` file:

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3010/api/graphql
```

For production:
```env
NEXT_PUBLIC_GRAPHQL_URL=https://your-cms-domain.com/api/graphql
```

### 2. Wrap Your App with ApolloProvider

Update your root layout or `_app.tsx`:

```tsx
import { ApolloProvider } from '@/lib/graphql/ApolloProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ApolloProvider>
          {children}
        </ApolloProvider>
      </body>
    </html>
  );
}
```

## Usage Examples

### Using Queries in Server Components

```tsx
import { apolloClient } from '@/lib/graphql/client';
import { GET_PROJECTS } from '@/lib/graphql/queries/projects';

export default async function ProjectsPage() {
  const { data } = await apolloClient.query({
    query: GET_PROJECTS,
    variables: {
      filter: { status: 'published' },
      limit: 10,
    },
  });

  return (
    <div>
      {data.projects.projects.map((project: any) => (
        <div key={project.id}>
          <h2>{project.titleEn}</h2>
          <p>{project.descriptionEn}</p>
        </div>
      ))}
    </div>
  );
}
```

### Using Queries in Client Components with Hooks

```tsx
'use client';

import { useQuery } from '@apollo/client';
import { GET_FEATURED_PROJECTS } from '@/lib/graphql/queries/projects';

export function FeaturedProjects() {
  const { data, loading, error } = useQuery(GET_FEATURED_PROJECTS, {
    variables: { limit: 5 },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.projects.projects.map((project: any) => (
        <div key={project.id}>
          <h3>{project.titleEn}</h3>
          <img src={project.images[0]} alt={project.titleEn} />
        </div>
      ))}
    </div>
  );
}
```

### Using Mutations

```tsx
'use client';

import { useMutation } from '@apollo/client';
import { CREATE_PROJECT } from '@/lib/graphql/mutations/projects';
import { GET_PROJECTS } from '@/lib/graphql/queries/projects';

export function CreateProjectForm() {
  const [createProject, { loading, error }] = useMutation(CREATE_PROJECT, {
    // Refetch queries after mutation
    refetchQueries: [{ query: GET_PROJECTS }],
    // Or update cache manually
    update(cache, { data: { createProject } }) {
      cache.modify({
        fields: {
          projects(existingProjects = { projects: [] }) {
            return {
              ...existingProjects,
              projects: [createProject, ...existingProjects.projects],
            };
          },
        },
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createProject({
        variables: {
          input: {
            titleEn: 'New Project',
            titleAr: 'مشروع جديد',
            descriptionEn: 'Description',
            descriptionAr: 'وصف',
            images: [],
            category: 'residential',
          },
        },
      });
      alert('Project created!');
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Project'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}
```

### Fetching Single Items

```tsx
import { apolloClient } from '@/lib/graphql/client';
import { GET_BLOG_POST } from '@/lib/graphql/queries/blog';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { data } = await apolloClient.query({
    query: GET_BLOG_POST,
    variables: {
      slugEn: params.slug,
    },
  });

  const post = data.blogPost;

  return (
    <article>
      <h1>{post.titleEn}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.contentEn }} />
    </article>
  );
}
```

### Using with Filters and Pagination

```tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_BLOG_POSTS } from '@/lib/graphql/queries/blog';

export function BlogList() {
  const [page, setPage] = useState(0);
  const [category, setCategory] = useState<string>();

  const { data, loading, fetchMore } = useQuery(GET_BLOG_POSTS, {
    variables: {
      filter: { status: 'published', category },
      limit: 10,
      offset: page * 10,
    },
  });

  const loadMore = () => {
    fetchMore({
      variables: {
        offset: (page + 1) * 10,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          blogPosts: {
            ...fetchMoreResult.blogPosts,
            posts: [...prev.blogPosts.posts, ...fetchMoreResult.blogPosts.posts],
          },
        };
      },
    });
    setPage(page + 1);
  };

  return (
    <div>
      <select onChange={(e) => setCategory(e.target.value || undefined)}>
        <option value="">All Categories</option>
        <option value="technology">Technology</option>
        <option value="design">Design</option>
      </select>

      {loading && <div>Loading...</div>}

      {data?.blogPosts.posts.map((post: any) => (
        <div key={post.id}>
          <h2>{post.titleEn}</h2>
          <p>{post.excerptEn}</p>
        </div>
      ))}

      {data?.blogPosts.hasMore && (
        <button onClick={loadMore}>Load More</button>
      )}
    </div>
  );
}
```

### Error Handling

```tsx
'use client';

import { useQuery } from '@apollo/client';
import { GET_SETTINGS } from '@/lib/graphql/queries/settings';

export function SiteSettings() {
  const { data, loading, error } = useQuery(GET_SETTINGS, {
    onError: (error) => {
      console.error('GraphQL Error:', error);
      // Handle specific error codes
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach((err) => {
          if (err.extensions?.code === 'UNAUTHENTICATED') {
            // Redirect to login
            window.location.href = '/login';
          }
        });
      }
    },
  });

  if (loading) return <div>Loading settings...</div>;

  if (error) {
    return (
      <div>
        <h3>Error loading settings</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>{data.settings.siteNameEn}</h1>
      <p>{data.settings.siteDescriptionEn}</p>
    </div>
  );
}
```

### Optimistic UI Updates

```tsx
'use client';

import { useMutation } from '@apollo/client';
import { UPDATE_PROJECT } from '@/lib/graphql/mutations/projects';

export function ToggleFeatured({ project }: { project: any }) {
  const [updateProject] = useMutation(UPDATE_PROJECT, {
    optimisticResponse: {
      updateProject: {
        ...project,
        featured: !project.featured,
        __typename: 'Project',
      },
    },
  });

  const handleToggle = () => {
    updateProject({
      variables: {
        id: project.id,
        input: {
          featured: !project.featured,
        },
      },
    });
  };

  return (
    <button onClick={handleToggle}>
      {project.featured ? 'Unfeature' : 'Feature'}
    </button>
  );
}
```

## Available Queries

### Projects
- `GET_PROJECTS` - List all projects with filtering
- `GET_PROJECT` - Get single project by ID
- `GET_FEATURED_PROJECTS` - Get featured projects only

### Blog
- `GET_BLOG_POSTS` - List all blog posts with filtering
- `GET_BLOG_POST` - Get single post by ID or slug
- `GET_FEATURED_BLOG_POSTS` - Get featured posts only

### Services
- `GET_SERVICES` - List all services with filtering
- `GET_SERVICE` - Get single service by ID
- `GET_FEATURED_SERVICES` - Get featured services only

### Settings
- `GET_SETTINGS` - Get site settings (singleton)

## Available Mutations

### Projects
- `CREATE_PROJECT` - Create new project (requires auth)
- `UPDATE_PROJECT` - Update existing project (requires auth)
- `DELETE_PROJECT` - Delete project (requires admin)

### Blog
- `CREATE_BLOG_POST` - Create new blog post (requires auth)
- `UPDATE_BLOG_POST` - Update existing post (requires auth)
- `DELETE_BLOG_POST` - Delete post (requires admin)

### Services
- `CREATE_SERVICE` - Create new service (requires auth)
- `UPDATE_SERVICE` - Update existing service (requires auth)
- `DELETE_SERVICE` - Delete service (requires admin)

## Best Practices

1. **Use Server Components when possible**: Fetch data on the server for better SEO and performance
2. **Enable cache**: The Apollo Client is configured with caching - use it wisely
3. **Handle loading states**: Always show loading indicators
4. **Handle errors gracefully**: Show user-friendly error messages
5. **Use TypeScript**: Generate types from your GraphQL schema (see below)
6. **Pagination**: Use offset-based pagination for lists
7. **Optimistic updates**: Use for better UX on mutations

## Type Generation (Optional)

To generate TypeScript types from your GraphQL schema:

1. Install codegen:
```bash
npm install -D @graphql-codegen/cli @graphql-codegen/client-preset
```

2. Create `codegen.ts`:
```ts
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:3010/api/graphql',
  documents: ['lib/graphql/**/*.ts'],
  generates: {
    './lib/generated/': {
      preset: 'client',
      plugins: [],
    },
  },
};

export default config;
```

3. Add script to `package.json`:
```json
{
  "scripts": {
    "codegen": "graphql-codegen"
  }
}
```

4. Run:
```bash
npm run codegen
```

## Playground Access

To test queries and mutations, access the GraphQL Playground:

- **Development**: http://localhost:3010/api/graphql
- See [GRAPHQL_SETUP.md](../mouhajer-cms/GRAPHQL_SETUP.md) in the CMS repo for examples

## Troubleshooting

### CORS Errors
Make sure cookies are enabled in the Apollo Client configuration (`credentials: 'include'`)

### Authentication Errors
Check that you're logged into the CMS and that cookies are being sent

### Cache Issues
Clear the Apollo cache:
```tsx
apolloClient.clearStore();
```

## Next Steps

1. Replace REST API calls with GraphQL queries
2. Generate TypeScript types for type safety
3. Implement real-time updates with subscriptions (future)
4. Add error boundaries for better error handling
