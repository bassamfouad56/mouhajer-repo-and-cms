import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_API_URL!;

export const wpClient = new GraphQLClient(endpoint, {
  headers: {
    Authorization: `Basic ${Buffer.from(
      `${process.env.WP_USERNAME}:${process.env.WP_APP_PASSWORD}`
    ).toString('base64')}`,
  },
});

// Queries
export const GET_PROJECTS_QUERY = `
  query GetProjects {
    projects(first: 100) {
      nodes {
        id
        title
        slug
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        acfFields {
          category
          location
          year
          description
        }
      }
    }
  }
`;

export const GET_PROJECT_BY_SLUG_QUERY = `
  query GetProjectBySlug($slug: ID!) {
    project(id: $slug, idType: SLUG) {
      id
      title
      content
      excerpt
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
      acfFields {
        category
        location
        year
        description
        gallery {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
    }
  }
`;

export const GET_SERVICES_QUERY = `
  query GetServices {
    services(first: 100) {
      nodes {
        id
        title
        excerpt
        content
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

export const GET_TESTIMONIALS_QUERY = `
  query GetTestimonials {
    testimonials(first: 100) {
      nodes {
        id
        title
        content
      }
    }
  }
`;

export const GET_ABOUT_PAGE_QUERY = `
  query GetAboutPage {
    page(id: "about", idType: URI) {
      title
      content
    }
  }
`;

export const GET_INDUSTRIES_QUERY = `
  query GetIndustries {
    industries(first: 100) {
      nodes {
        id
        title
        excerpt
        content
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

export const GET_POSTS_QUERY = `
  query GetPosts($first: Int = 100, $after: String) {
    posts(first: $first, after: $after, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        excerpt
        date
        modified
        content
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        categories {
          nodes {
            id
            name
            slug
          }
        }
        tags {
          nodes {
            id
            name
            slug
          }
        }
        author {
          node {
            name
            avatar {
              url
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_POST_BY_SLUG_QUERY = `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      slug
      content
      excerpt
      date
      modified
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
      categories {
        nodes {
          id
          name
          slug
        }
      }
      tags {
        nodes {
          id
          name
          slug
        }
      }
      author {
        node {
          name
          avatar {
            url
          }
          description
        }
      }
    }
  }
`;

export const GET_CATEGORIES_QUERY = `
  query GetCategories {
    categories(first: 100) {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`;

// Types
export interface WPImage {
  sourceUrl: string;
  altText: string;
  mediaDetails?: {
    width: number;
    height: number;
  };
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: {
    node: WPImage;
  };
  acfFields?: {
    category?: string;
    location?: string;
    year?: string;
    description?: string;
    gallery?: WPImage[];
  };
}

export interface Service {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: {
    node: WPImage;
  };
}

export interface Testimonial {
  id: string;
  title: string;
  content: string;
  acfFields?: {
    clientName?: string;
    clientPosition?: string;
    rating?: number;
    projectName?: string;
  };
}

export interface Industry {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: {
    node: WPImage;
  };
  acfFields?: {
    icon?: string;
    description?: string;
    relatedServices?: string[]; // Service IDs
    relatedProjects?: string[]; // Project IDs
    stats?: {
      projectsCompleted?: number;
      yearsExperience?: number;
      clientsSatisfied?: number;
    };
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Author {
  name: string;
  avatar?: {
    url: string;
  };
  description?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  modified: string;
  featuredImage?: {
    node: WPImage;
  };
  categories: {
    nodes: Category[];
  };
  tags: {
    nodes: Tag[];
  };
  author: {
    node: Author;
  };
}

// Helper functions
export async function getProjects(): Promise<Project[]> {
  try {
    const data = await wpClient.request(GET_PROJECTS_QUERY) as { projects: { nodes: Project[] } };
    return data.projects.nodes;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const data = await wpClient.request(GET_PROJECT_BY_SLUG_QUERY, { slug }) as { project: Project };
    return data.project;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    const data = await wpClient.request(GET_SERVICES_QUERY) as { services: { nodes: Service[] } };
    return data.services.nodes;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const data = await wpClient.request(GET_TESTIMONIALS_QUERY) as { testimonials: { nodes: Testimonial[] } };
    return data.testimonials.nodes;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

export async function getIndustries(): Promise<Industry[]> {
  try {
    const data = await wpClient.request(GET_INDUSTRIES_QUERY) as { industries: { nodes: Industry[] } };
    return data.industries.nodes;
  } catch (error) {
    console.error('Error fetching industries:', error);
    return [];
  }
}

export async function getPosts(): Promise<Post[]> {
  try {
    const data = await wpClient.request(GET_POSTS_QUERY) as { posts: { nodes: Post[] } };
    return data.posts.nodes;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const data = await wpClient.request(GET_POST_BY_SLUG_QUERY, { slug }) as { post: Post };
    return data.post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const data = await wpClient.request(GET_CATEGORIES_QUERY) as { categories: { nodes: Category[] } };
    return data.categories.nodes;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
