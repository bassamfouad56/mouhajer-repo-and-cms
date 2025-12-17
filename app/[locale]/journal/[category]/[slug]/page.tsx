import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import { client } from '@/sanity/lib/client';
import { postBySlugQuery } from '@/sanity/lib/queries';
import { getLocalizedValue } from '@/lib/error-handling';
import BlogPostContent from '../../../blog/[slug]/blog-post-content';

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
    bio?: string;
    image?: any;
  };
  content?: any[];
  readTime?: number;
  tags?: Array<{ _id: string; name: string; slug?: { current: string } } | string>;
  publishedAt: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  relatedProjects?: any[];
}

interface JournalPostPageProps {
  params: Promise<{
    category: string;
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

async function getRelatedPosts(category: string, currentPostId: string, locale: string): Promise<SanityPost[]> {
  try {
    const query = `
      *[_type == "post" && category == $category && _id != $currentPostId] | order(publishedAt desc)[0...3] {
        _id,
        title,
        slug,
        excerpt,
        mainImage,
        category,
        "author": author->{
          name,
          role,
          bio,
          "image": image {
            asset,
            alt
          }
        },
        publishedAt,
        readTime,
        "tags": tags[]->{
          _id,
          "name": coalesce(name[$locale], name.en, name),
          slug
        }
      }
    `;

    const posts = await client.fetch(query, { category, currentPostId, locale });
    return posts || [];
  } catch (error) {
    console.error('Error fetching related posts from Sanity:', error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: JournalPostPageProps): Promise<Metadata> {
  const { slug, locale, category } = await params;

  // Decode URL-encoded category (e.g., "Cost%20Management" -> "Cost Management")
  const decodedCategory = decodeURIComponent(category);

  const post = await getPost(slug, locale);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  // Verify post category matches URL category (decoded)
  if (post.category !== decodedCategory) {
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
    title: seoTitle || `${postTitle} | Journal | MIDC`,
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

export default async function JournalPostPage({ params }: JournalPostPageProps) {
  const { category, slug, locale } = await params;

  // Decode URL-encoded category (e.g., "Cost%20Management" -> "Cost Management")
  const decodedCategory = decodeURIComponent(category);

  const post = await getPost(slug, locale);

  if (!post) {
    notFound();
  }

  // Verify post category matches URL category (decoded)
  if (post.category !== decodedCategory) {
    notFound();
  }

  // Get related posts from same category
  const relatedPosts = await getRelatedPosts(decodedCategory, post._id, locale);

  // Transform post with localized values
  const localizedPost = {
    ...post,
    title: getLocalizedValue(post.title, locale, ''),
    excerpt: getLocalizedValue(post.excerpt, locale, ''),
    category: getLocalizedValue(post.category, locale, ''),
  };

  // Transform related posts with localized values
  const localizedRelatedPosts = relatedPosts.map((p) => ({
    ...p,
    title: getLocalizedValue(p.title, locale, ''),
    excerpt: getLocalizedValue(p.excerpt, locale, ''),
    category: getLocalizedValue(p.category, locale, ''),
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
