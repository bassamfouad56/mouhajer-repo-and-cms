import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import { client } from '@/sanity/lib/client';
import JournalPageContent from './journal-page-content';

export const metadata: Metadata = {
  title: 'Journal | MIDC - Insights, Stories & Expertise',
  description: 'Explore our insights, project stories, and expertise. From design trends to engineering excellence, discover the stories behind our work.',
};

export const revalidate = 3600;

async function getPosts(locale: string) {
  try {
    const query = `
      *[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        mainImage,
        category,
        "author": author->{
          name,
          image
        },
        publishedAt,
        readTime,
        featured,
        "tags": tags[]->{
          _id,
          "name": name[$locale],
          slug
        }
      }
    `;

    const posts = await client.fetch(query, { locale });
    return posts || [];
  } catch (error) {
    console.error('Error fetching posts from Sanity:', error);
    return [];
  }
}

export default async function JournalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const posts = await getPosts(locale);

  return (
    <>
      <Header />
      <JournalPageContent posts={posts} currentCategory="all" locale={locale} />
      <LogoMarquee />
      <Footer />
    </>
  );
}
