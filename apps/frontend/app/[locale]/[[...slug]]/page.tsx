import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SEOEnhanced from '@/components/SEOEnhanced';
import BlockRenderer from '@/components/BlockRenderer';
import { dataFetcher } from '@/lib/data-fetcher';
import { cmsBaseUrl } from '@/lib/cms-config';
import { getHomepageData } from '@/lib/homepage-data';

const CMS_API_URL = cmsBaseUrl;

type Props = {
  params: { locale: string; slug?: string[] };
};

async function fetchPageBySlug(locale: 'en' | 'ar', slug: string) {
  try {
    const response = await fetch(
      `${CMS_API_URL}/api/pages/slug/${locale}/${slug}`,
      {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch page: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching page by slug:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as 'en' | 'ar';
  const slug = params.slug?.join('/') || '';

  // Handle home page metadata
  if (!slug || slug === '') {
    try {
      const { settings } = await getHomepageData(locale);
      return {
        title: settings?.seo?.[locale]?.defaultTitle || 'Mouhajer Interior Design',
        description: settings?.seo?.[locale]?.defaultDescription || 'Luxury Interior Design Dubai',
        keywords: settings?.seo?.[locale]?.keywords?.join(', '),
        openGraph: {
          title: settings?.seo?.[locale]?.defaultTitle || 'Mouhajer Interior Design',
          description: settings?.seo?.[locale]?.defaultDescription || 'Luxury Interior Design Dubai',
          type: 'website',
          locale: locale === 'ar' ? 'ar_AE' : 'en_US',
        },
      };
    } catch (error) {
      console.error('Failed to load home SEO data:', error);
      return {
        title: 'Mouhajer Interior Design',
        description: 'Luxury Interior Design Dubai',
      };
    }
  }

  // Handle other pages
  const page = await fetchPageBySlug(locale, slug);

  if (!page) {
    return {
      title: 'Page Not Found',
      description: '',
    };
  }

  const title = page.seo?.metaTitle?.[locale] || page.title?.[locale] || 'Mouhajer Interior Design';
  const description = page.seo?.metaDescription?.[locale] || page.description?.[locale] || 'Luxury Interior Design Dubai';

  return {
    title,
    description,
    keywords: page.seo?.keywords || [],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale === 'ar' ? 'ar_AE' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/${locale}/${slug}`,
      languages: {
        'en': `/en/${page.slug?.en || slug}`,
        'ar': `/ar/${page.slug?.ar || slug}`,
      },
    },
  };
}

export default async function DynamicPage({ params }: Props) {
  const locale = params.locale as 'en' | 'ar';
  const slug = params.slug?.join('/') || '';

  // Handle home page
  if (!slug || slug === '') {
    try {
      const homepageData = await getHomepageData(locale);
      const blocks = homepageData.homePage?.blocks || [];

      console.log('[Page] Homepage data received:', {
        blocksCount: blocks.length,
        mediaCount: homepageData.media?.length || 0,
        mediaSample: homepageData.media?.[0],
        imageMedia: homepageData.media?.filter((m: any) => m.type === 'image').length || 0
      });

      if (blocks.length === 0) {
        return (
          <main className="min-h-screen" style={{ backgroundColor: '#FFFEF5' }}>
            <div className="container mx-auto px-4 py-16">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {locale === 'en' ? 'Welcome to Mouhajer Design' : 'مرحباً بكم في موهاجر للتصميم'}
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  {locale === 'en'
                    ? 'Luxury Interior Design & Architecture in Dubai'
                    : 'التصميم الداخلي الفاخر والهندسة المعمارية في دبي'}
                </p>
              </div>
            </div>
          </main>
        );
      }

      return (
        <main className="min-h-screen" style={{ backgroundColor: '#FFFEF5' }}>
          <BlockRenderer
            blocks={blocks}
            locale={locale}
            featuredProjects={homepageData.featuredProjects}
            featuredBlogs={homepageData.featuredBlogs}
            media={homepageData.media}
          />
        </main>
      );
    } catch (error) {
      console.error('Failed to load homepage:', error);
      // Continue to try fetching as a regular page
    }
  }

  // Fetch the page data from CMS
  const page = await fetchPageBySlug(locale, slug);

  if (!page) {
    notFound();
  }

  // Fetch additional data needed for blocks
  const [featuredProjects, featuredBlogs, settings, mediaData] = await Promise.allSettled([
    dataFetcher.getFeaturedProjects(6),
    dataFetcher.getFeaturedBlogs(3),
    dataFetcher.getSettings(),
    dataFetcher.getMedia(),
  ]);

  const projects = featuredProjects.status === 'fulfilled' ? featuredProjects.value : [];
  const blogs = featuredBlogs.status === 'fulfilled' ? featuredBlogs.value : [];
  const media = mediaData.status === 'fulfilled' ? mediaData.value : [];

  // SEO data from CMS page
  const seoData = {
    title: page.seo?.metaTitle?.[locale] || page.title?.[locale],
    description: page.seo?.metaDescription?.[locale] || page.description?.[locale],
    keywords: page.seo?.keywords || [],
    ogType: 'website',
  };

  return (
    <main>
      <SEOEnhanced {...seoData} />

      {/* Page Header (if needed) */}
      {page.title && (
        <div className="bg-[#202020] py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-SchnyderS text-white">
            {page.title[locale]}
          </h1>
          {page.description && (
            <p className="text-white/70 mt-4 max-w-3xl mx-auto font-Satoshi">
              {page.description[locale]}
            </p>
          )}
        </div>
      )}

      {/* Render page blocks */}
      {page.blocks && page.blocks.length > 0 ? (
        <BlockRenderer
          blocks={page.blocks}
          locale={locale}
          featuredProjects={projects}
          featuredBlogs={blogs}
          media={media}
        />
      ) : (
        <div className="p-8 text-center min-h-[50vh] flex items-center justify-center">
          <div>
            <h2 className="text-2xl font-SchnyderS mb-4">
              {locale === 'en' ? 'Page Content Coming Soon' : 'محتوى الصفحة قريباً'}
            </h2>
            <p className="text-gray-600 font-Satoshi">
              {locale === 'en'
                ? 'This page is being built. Check back soon!'
                : 'يتم بناء هذه الصفحة. تحقق مرة أخرى قريبًا!'}
            </p>
          </div>
        </div>
      )}

      {/* Child Pages (if any) */}
      {page.children && page.children.length > 0 && (
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-SchnyderS mb-8 text-center">
              {locale === 'en' ? 'Explore More' : 'استكشف المزيد'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {page.children.map((child: any) => (
                <a
                  key={child.id}
                  href={`/${locale}/${child.slug[locale]}`}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-SchnyderS mb-2">{child.title[locale]}</h3>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
