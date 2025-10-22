const API_BASE_URL = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3002/api';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  filtered?: number;
  message?: string;
  error?: string;
}

export interface Project {
  id: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  images: string[];
  category: string;
  location?: string;
  completedAt?: string;
  featured: boolean;
  createdAt: string;
}

export interface Service {
  id: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  shortDescription: { en: string; ar: string };
  icon: string;
  features: { en: string[]; ar: string[] };
  price: string;
  duration?: string;
  featured: boolean;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: { en: string; ar: string };
  slug: { en: string; ar: string };
  excerpt: { en: string; ar: string };
  content: { en: string; ar: string };
  featuredImage: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  featured: boolean;
  status: 'draft' | 'published';
  readTime?: number;
  createdAt: string;
}

// Projects API
export async function getProjects(params?: {
  limit?: number;
  featured?: boolean;
  category?: string;
}): Promise<ApiResponse<Project[]>> {
  const searchParams = new URLSearchParams();

  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.featured) searchParams.set('featured', 'true');
  if (params?.category) searchParams.set('category', params.category);

  const response = await fetch(`${API_BASE_URL}/projects?${searchParams}`);
  return response.json();
}

export async function createProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<ApiResponse<Project>> {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(project),
  });
  return response.json();
}

// Services API
export async function getServices(params?: {
  limit?: number;
  featured?: boolean;
}): Promise<ApiResponse<Service[]>> {
  const searchParams = new URLSearchParams();

  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.featured) searchParams.set('featured', 'true');

  const response = await fetch(`${API_BASE_URL}/services?${searchParams}`);
  return response.json();
}

export async function createService(service: Omit<Service, 'id' | 'createdAt'>): Promise<ApiResponse<Service>> {
  const response = await fetch(`${API_BASE_URL}/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(service),
  });
  return response.json();
}

// Blog API
export async function getBlogPosts(params?: {
  limit?: number;
  featured?: boolean;
  category?: string;
  status?: 'draft' | 'published';
}): Promise<ApiResponse<BlogPost[]>> {
  const searchParams = new URLSearchParams();

  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.featured) searchParams.set('featured', 'true');
  if (params?.category) searchParams.set('category', params.category);
  if (params?.status) searchParams.set('status', params.status);

  const response = await fetch(`${API_BASE_URL}/blog?${searchParams}`);
  return response.json();
}

export async function createBlogPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'publishedAt'>): Promise<ApiResponse<BlogPost>> {
  const response = await fetch(`${API_BASE_URL}/blog`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  });
  return response.json();
}