import SEOEnhanced from '@/components/SEOEnhanced';
import LeadGenPopup from '@/components/LeadGenPopup';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import BlockRenderer from '@/components/BlockRenderer';
import { dataFetcher } from '@/lib/data-fetcher';
import { Metadata } from 'next';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as 'en' | 'ar';

  try {
    const settings = await dataFetcher.getSettings();

    if (!settings || !settings.seo || !settings.seo[locale]) {
      throw new Error('Settings data is incomplete');
    }

    return {
      title: settings.seo[locale].defaultTitle || 'Mouhajer Interior Design',
      description: settings.seo[locale].defaultDescription || 'Luxury Interior Design Dubai',
      keywords: settings.seo[locale].keywords || [],
      openGraph: {
        title: settings.seo[locale].defaultTitle || 'Mouhajer Interior Design',
        description: settings.seo[locale].defaultDescription || 'Luxury Interior Design Dubai',
        type: 'website',
        locale: locale === 'ar' ? 'ar_AE' : 'en_US',
        images: settings.logo ? [settings.logo] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: settings.seo[locale].defaultTitle || 'Mouhajer Interior Design',
        description: settings.seo[locale].defaultDescription || 'Luxury Interior Design Dubai',
      },
      alternates: {
        canonical: '/',
        languages: {
          'en': '/en',
          'ar': '/ar',
        },
      },
    };
  } catch (error) {
    console.error('Failed to fetch settings for metadata:', error);
    return {
      title: 'Mouhajer Interior Design',
      description: 'Luxury Interior Design Dubai',
    };
  }
}

export default async function Home({ params }: Props) {
  const locale = params.locale as 'en' | 'ar';

  try {
    // Debug what pages exist
    const { debugPages } = await import('@/lib/debug-pages');
    await debugPages();
    
    // Fetch all data from CMS using GraphQL
    const { getHomepageData } = await import('@/lib/homepage-data');
    const { settings, featuredProjects, featuredBlogs, homePage, media } = await getHomepageData(locale);

    console.log('Homepage data:', { 
      homePage: homePage?.title, 
      blocks: homePage?.blocks?.length,
      allBlocks: homePage?.blocks,
      settings: !!settings,
      featuredProjects: featuredProjects?.length,
      featuredBlogs: featuredBlogs?.length
    });

    // Validate settings data
    if (!settings || !settings.seo || !settings.seo[locale]) {
      throw new Error('Settings data is incomplete or undefined');
    }

    // SEO data from CMS
    const seoData = {
      title: settings.seo[locale].defaultTitle,
      description: settings.seo[locale].defaultDescription,
      keywords: settings.seo[locale].keywords,
      ogImage: settings.logo,
      ogType: 'website',
    };

    return (
      <main>
        <SEOEnhanced {...seoData} />

        {homePage?.blocks?.length > 0 ? (
          <BlockRenderer
            blocks={homePage.blocks}
            locale={locale}
            featuredProjects={featuredProjects}
            featuredBlogs={featuredBlogs}
            media={media}
          />
        ) : (
          <div className="p-8 text-center">
            <p>No blocks found for Home page. Check your CMS configuration.</p>
            <p>Debug: {JSON.stringify({ homePage: homePage?.title, slug: homePage?.slug })}</p>
            <p>Go to your CMS and create a page with title &quot;Home&quot; and slug &quot;home&quot;</p>
          </div>
        )}

        <LeadGenPopup />

        <WhatsAppFloat
          phoneNumber={settings.contactPhone || '+971501234567'}
        />
      </main>
    );
  } catch (error) {
    console.error('Error loading homepage:', error);

    return (
      <main className="min-h-screen flex items-center justify-center bg-[#202020]">
        <div className="text-center p-8">
          <h1 className="text-4xl font-SchnyderS text-white mb-4">
            {locale === 'en' ? 'Service Unavailable' : 'الخدمة غير متاحة'}
          </h1>
          <p className="text-white/60 mb-4">
            {locale === 'en'
              ? 'Unable to connect to our content management system. Please try again later.'
              : 'تعذر الاتصال بنظام إدارة المحتوى. يرجى المحاولة مرة أخرى لاحقاً.'}
          </p>
          <p className="text-white/40 text-sm">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </main>
    );
  }
}
