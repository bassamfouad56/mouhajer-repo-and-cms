import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import { client } from '@/sanity/lib/client';
import { postsQuery } from '@/sanity/lib/queries';
import BlogPageContent from './blog-page-content';

export const metadata: Metadata = {
  title: 'Insights | MIDC - Construction Knowledge & Industry Trends',
  description: 'Expert insights on integrated construction, MEP engineering, fit-out execution, and handover best practices. Real stories from 400+ successful projects.',
  openGraph: {
    title: 'Insights | MIDC - Construction Knowledge & Industry Trends',
    description: 'Expert insights on integrated construction, MEP engineering, fit-out execution, and handover best practices. Real stories from 400+ successful projects.',
  },
};

export const revalidate = 3600;

async function getPosts(locale: string) {
  try {
    const posts = await client.fetch(postsQuery, { locale });
    return posts || [];
  } catch (error) {
    console.error('Error fetching posts from Sanity:', error);
    return [];
  }
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const posts = await getPosts(locale);

  // Extract unique categories from posts, filter out empty/undefined
  const categories = Array.from(
    new Set(
      posts
        .map((p: any) => p.category)
        .filter((cat) => cat && cat.trim() !== '')
    )
  );

  return (
    <>
      <Header />
      <BlogPageContent posts={posts} categories={categories} />
      <LogoMarquee />
      <Footer />
    </>
  );
}
