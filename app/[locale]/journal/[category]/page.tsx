import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import { client } from '@/sanity/lib/client';
import JournalPageContent from '../journal-page-content';

const VALID_CATEGORIES = [
  'design-trends',
  'project-stories',
  'behind-the-scenes',
  'materials-craft',
  'engineering',
  'founders-insights'
] as const;

type Category = typeof VALID_CATEGORIES[number];

export async function generateStaticParams() {
  return VALID_CATEGORIES.map(category => ({ category }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; category: string }>
}): Promise<Metadata> {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category as Category)) {
    return {};
  }

  const title = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${title} | Journal | MIDC`,
    description: `Explore our ${title.toLowerCase()} articles and insights from MIDC.`,
  };
}

export const revalidate = 3600;

async function getPosts(locale: string, category: string) {
  try {
    const query = `
      *[_type == "post" && category == $category] | order(publishedAt desc) {
        _id,
        "title": coalesce(title[$locale], title.en, title),
        slug,
        "excerpt": coalesce(excerpt[$locale], excerpt.en, excerpt),
        mainImage,
        category,
        "author": {
          "name": author.name,
          "role": coalesce(author.role[$locale], author.role.en, author.role),
          "image": author.image
        },
        publishedAt,
        readTime,
        featured,
        "tags": tags[]->{
          _id,
          "name": coalesce(name[$locale], name.en, name),
          slug
        }
      }
    `;

    const posts = await client.fetch(query, { category, locale });
    return posts || [];
  } catch (error) {
    console.error('Error fetching posts from Sanity:', error);
    return [];
  }
}

export default async function JournalCategoryPage({
  params
}: {
  params: Promise<{ locale: string; category: string }>
}) {
  const { locale, category } = await params;

  if (!VALID_CATEGORIES.includes(category as Category)) {
    notFound();
  }

  const posts = await getPosts(locale, category);

  return (
    <>
      <Header />
      <JournalPageContent posts={posts} currentCategory={category} locale={locale} />
      <LogoMarquee />
      <Footer />
    </>
  );
}
