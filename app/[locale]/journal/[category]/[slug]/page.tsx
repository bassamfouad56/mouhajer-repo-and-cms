import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { client } from '@/sanity/lib/client';
import { postBySlugQuery } from '@/sanity/lib/queries';
import JournalArticleContent from './journal-article-content';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const VALID_CATEGORIES = [
  'design-trends',
  'project-stories',
  'behind-the-scenes',
  'materials-craft',
  'engineering',
  'founders-insights'
] as const;

interface JournalPostPageProps {
  params: Promise<{
    category: string;
    slug: string;
    locale: string;
  }>;
}

// Fetch post by slug
async function getPost(slug: string, locale: string) {
  try {
    const post = await client.fetch(postBySlugQuery, { slug, locale });
    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// Fetch related posts (same category, excluding current)
async function getRelatedPosts(category: string, currentSlug: string, locale: string) {
  try {
    const query = `
      *[_type == "post" && category == $category && slug.current != $currentSlug] | order(publishedAt desc) [0...3] {
        _id,
        "title": coalesce(title[$locale], title.en, title),
        slug,
        "excerpt": coalesce(excerpt[$locale], excerpt.en, excerpt),
        mainImage,
        category,
        "author": {
          "name": author.name,
          "image": author.image
        },
        readTime,
        publishedAt
      }
    `;
    const posts = await client.fetch(query, { category, currentSlug, locale });
    return posts || [];
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

export async function generateMetadata({
  params
}: JournalPostPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await getPost(slug, locale);

  if (!post) {
    return {
      title: 'Article Not Found | MIDC Journal',
    };
  }

  return {
    title: `${post.title} | MIDC Journal`,
    description: post.excerpt || post.seo?.metaDescription || `Read ${post.title} on MIDC Journal`,
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      type: 'article',
      publishedTime: post.publishedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
    },
  };
}

export default async function JournalPostPage({ params }: JournalPostPageProps) {
  const { slug, locale, category } = await params;

  // Validate category
  if (!VALID_CATEGORIES.includes(category as typeof VALID_CATEGORIES[number])) {
    notFound();
  }

  // Fetch post data
  const post = await getPost(slug, locale);

  if (!post) {
    notFound();
  }

  // Fetch related posts
  const relatedPosts = await getRelatedPosts(post.category || category, slug, locale);

  return (
    <>
      <Header />
      <JournalArticleContent
        post={post}
        relatedPosts={relatedPosts}
        locale={locale}
        category={category}
      />
      <Footer />
    </>
  );
}
