import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { FAQSection } from '@/components/sections/faq';
import { getPosts, getCategories } from '@/lib/wordpress';
import BlogPageContent from './blog-page-content';
import { blogFAQs } from '@/lib/faq-data';

export const metadata: Metadata = {
  title: 'Blog | Mouhajer Design Studio',
  description: 'Insights, inspiration, and expertise in interior design, architecture, and luxury living.',
  openGraph: {
    title: 'Blog | Mouhajer Design Studio',
    description: 'Insights, inspiration, and expertise in interior design, architecture, and luxury living.',
  },
};

export const revalidate = 3600;

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getPosts(),
    getCategories(),
  ]);

  return (
    <>
      <Header />
      <BlogPageContent posts={posts} categories={categories} />
      <FAQSection faqs={blogFAQs} variant="dark" />
      <Footer />
    </>
  );
}
