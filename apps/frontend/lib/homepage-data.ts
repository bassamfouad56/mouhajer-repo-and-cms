// Homepage data fetching - GraphQL only

import { queryGraphQL } from './graphql/server-client';
import { GET_HOMEPAGE_DATA } from './graphql/queries/homepage';
import { getTestimonials } from './fetchers/testimonials';
import { getTeamMembers } from './fetchers/team';
import { getPricingPlans } from './fetchers/pricing';
import { getCaseStudies } from './fetchers/case-studies';
import { getFAQs } from './fetchers/faq';

export interface HomepageData {
  settings: any;
  featuredProjects: any[];
  featuredBlogs: any[];
  featuredTestimonials: any[];
  featuredTeamMembers: any[];
  featuredPricingPlans: any[];
  featuredCaseStudies: any[];
  featuredFAQs: any[];
  homePage: any;
  media: any[];
}

export async function getHomepageData(locale: 'en' | 'ar'): Promise<HomepageData> {
  try {
    console.log('[Homepage] Using GraphQL...');
    const data = await queryGraphQL({
      query: GET_HOMEPAGE_DATA,
      variables: {
        locale,
        mediaLimit: 50,
      },
    });

    console.log('[Homepage] Raw GraphQL response:', JSON.stringify(data, null, 2));

    if (data && data.settings) {
      // Transform GraphQL response to match expected structure
      const transformProject = (p: any) => ({
        ...p,
        title: { en: p.titleEn, ar: p.titleAr },
        description: { en: p.descriptionEn, ar: p.descriptionAr },
      });

      const transformBlogPost = (b: any) => ({
        ...b,
        title: { en: b.titleEn, ar: b.titleAr },
        slug: { en: b.slugEn, ar: b.slugAr },
        excerpt: { en: b.excerptEn, ar: b.excerptAr },
      });

      const transformSettings = (s: any) => ({
        ...s,
        siteName: { en: s.siteNameEn, ar: s.siteNameAr },
        siteDescription: { en: s.siteDescriptionEn, ar: s.siteDescriptionAr },
        logo: s.logoUrl,
        seo: {
          en: {
            defaultTitle: s.seoMetaTitleEn,
            defaultDescription: s.seoMetaDescriptionEn,
            keywords: s.seoKeywords?.filter((k: string) => /^[a-zA-Z]/.test(k)) || [],
          },
          ar: {
            defaultTitle: s.seoMetaTitleAr,
            defaultDescription: s.seoMetaDescriptionAr,
            keywords: s.seoKeywords?.filter((k: string) => /[\u0600-\u06FF]/.test(k)) || [],
          },
        },
      });

      // Fetch featured content from new content types
      const [
        featuredTestimonials,
        featuredTeamMembers,
        featuredPricingPlans,
        featuredCaseStudies,
        featuredFAQs
      ] = await Promise.all([
        getTestimonials(locale, { featured: true, limit: 3 }),
        getTeamMembers(locale, { featured: true, limit: 4 }),
        getPricingPlans({ filter: { locale, published: true, popular: true }, limit: 3 }),
        getCaseStudies(locale, { filter: { featured: true, published: true }, limit: 3 }),
        getFAQs(locale, { limit: 6 })
      ]);

      return {
        settings: transformSettings(data.settings),
        featuredProjects: (data.featuredProjects?.projects || []).map(transformProject),
        featuredBlogs: (data.featuredBlogs?.posts || []).map(transformBlogPost),
        featuredTestimonials,
        featuredTeamMembers,
        featuredPricingPlans,
        featuredCaseStudies,
        featuredFAQs,
        homePage: data.homePage?.pages?.[0] || null,
        media: [],
      };
    }
  } catch (error) {
    console.error('[Homepage] GraphQL failed:', error);
    throw error;
  }

  // Return empty data if GraphQL fails
  return {
    settings: {},
    featuredProjects: [],
    featuredBlogs: [],
    featuredTestimonials: [],
    featuredTeamMembers: [],
    featuredPricingPlans: [],
    featuredCaseStudies: [],
    featuredFAQs: [],
    homePage: null,
    media: [],
  };
}
