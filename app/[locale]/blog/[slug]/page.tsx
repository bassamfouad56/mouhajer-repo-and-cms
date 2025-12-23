import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import { client } from '@/sanity/lib/client';
import { postBySlugQuery, postsQuery } from '@/sanity/lib/queries';
import { getLocalizedValue } from '@/lib/error-handling';
import BlogPostContent from './blog-post-content';

interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: any;
  category?: string;
  author?: {
    name: string;
    role?: string;
    image?: any;
  };
  content?: any[];
  readTime?: number;
  tags?: string[];
  publishedAt: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  relatedProjects?: any[];
}

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

async function getPost(slug: string, locale: string): Promise<SanityPost | null> {
  try {
    const post = await client.fetch(postBySlugQuery, { slug, locale });
    return post || null;
  } catch (error) {
    console.error('Error fetching post from Sanity:', error);
    return null;
  }
}

async function getAllPosts(locale: string): Promise<SanityPost[]> {
  try {
    const posts = await client.fetch(postsQuery, { locale });
    return posts || [];
  } catch (error) {
    console.error('Error fetching posts from Sanity:', error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await getPost(slug, locale);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const postTitle = getLocalizedValue(post.title, locale, 'Post');
  const postExcerpt = getLocalizedValue(post.excerpt, locale, '');
  const seoTitle = getLocalizedValue(post.seo?.metaTitle, locale);
  const seoDescription = getLocalizedValue(post.seo?.metaDescription, locale);

  const description = seoDescription || postExcerpt;

  return {
    title: seoTitle || `${postTitle} | MIDC Insights`,
    description,
    openGraph: {
      title: seoTitle || postTitle,
      description,
      type: 'article',
      publishedTime: post.publishedAt,
    },
    keywords: post.seo?.keywords,
  };
}

// Skip static generation at build time - use ISR instead
// Pages will be generated on-demand and cached
export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;
export const revalidate = 3600;

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug, locale } = await params;
  const post = await getPost(slug, locale);

  if (!post) {
    notFound();
  }

  // Get all posts for related posts section
  const allPosts = await getAllPosts(locale);

  // Get localized category for comparison
  const postCategory = getLocalizedValue(post.category, locale, '');

  // Filter related posts - same category, excluding current post
  const relatedPosts = allPosts
    .filter(
      (p) => {
        const pCategory = getLocalizedValue(p.category, locale, '');
        return p._id !== post._id && pCategory && postCategory && pCategory === postCategory;
      }
    )
    .slice(0, 3);

  // If not enough related by category, fill with recent posts
  if (relatedPosts.length < 3) {
    const additionalPosts = allPosts
      .filter(
        (p) =>
          p._id !== post._id &&
          !relatedPosts.some((rp) => rp._id === p._id)
      )
      .slice(0, 3 - relatedPosts.length);
    relatedPosts.push(...additionalPosts);
  }

  // Transform post with localized values and ensure required fields have defaults
  const localizedPost = {
    ...post,
    _id: post._id || '',
    title: getLocalizedValue(post.title, locale, 'Untitled') || 'Untitled',
    excerpt: getLocalizedValue(post.excerpt, locale, '') || '',
    category: postCategory || '',
    publishedAt: post.publishedAt || new Date().toISOString(),
    slug: post.slug || { current: '' },
    content: post.content || [],
    author: post.author || { name: 'MIDC Team' },
  };

  // Transform related posts with localized values and ensure required fields have defaults
  const localizedRelatedPosts = relatedPosts.map((p) => ({
    ...p,
    _id: p._id || '',
    title: getLocalizedValue(p.title, locale, 'Untitled') || 'Untitled',
    excerpt: getLocalizedValue(p.excerpt, locale, '') || '',
    category: getLocalizedValue(p.category, locale, '') || '',
    publishedAt: p.publishedAt || new Date().toISOString(),
    slug: p.slug || { current: '' },
  }));

  return (
    <>
      <Header />
      <BlogPostContent post={localizedPost} relatedPosts={localizedRelatedPosts} />
      <LogoMarquee />
      <Footer />
    </>
  );
}
