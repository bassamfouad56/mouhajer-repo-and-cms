import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import SEOEnhanced from '@/components/SEOEnhanced';
import TestimonialGrid from '@/components/testimonials/TestimonialGrid';
import TestimonialHero from '@/components/testimonials/TestimonialHero';
import ReviewSchema from '@/components/seo/ReviewSchema';
import { getTestimonials } from '@/lib/fetchers/testimonials';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as 'en' | 'ar';
  const t = await getTranslations({ locale, namespace: 'testimonials' });

  const title = t('meta.title');
  const description = t('meta.description');

  return {
    title,
    description,
    keywords: locale === 'en'
      ? ['client reviews', 'testimonials', 'interior design reviews', 'customer feedback', 'design testimonials', 'Dubai interior design reviews']
      : ['آراء العملاء', 'شهادات', 'مراجعات التصميم الداخلي', 'ملاحظات العملاء', 'شهادات التصميم'],
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
      canonical: `/${locale}/testimonials`,
      languages: {
        'en': '/en/testimonials',
        'ar': '/ar/testimonials',
      },
    },
  };
}

export default async function TestimonialsPage({ params }: Props) {
  const locale = params.locale as 'en' | 'ar';
  const t = await getTranslations({ locale, namespace: 'testimonials' });

  // Fetch testimonials from CMS
  const testimonialsData = await getTestimonials(locale);

  // Transform to match component expected format
  const testimonials = testimonialsData.map(item => ({
    id: item.id,
    name: locale === 'ar' && item.nameAr ? item.nameAr : item.nameEn,
    role: locale === 'ar' && item.roleAr ? item.roleAr : item.roleEn,
    rating: item.rating,
    comment: locale === 'ar' && item.testimonialAr ? item.testimonialAr : item.testimonialEn,
    project: item.projectType || '',
    image: item.avatarUrl || '/images/testimonials/default-avatar.jpg',
    date: new Date(item.createdAt).toISOString().split('T')[0],
    company: locale === 'ar' && item.companyAr ? item.companyAr : item.companyEn,
  }));

  return (
    <>
      <SEOEnhanced
        title={t('meta.title')}
        description={t('meta.description')}
        canonical={`/${locale}/testimonials`}
        locale={locale}
      />

      <ReviewSchema
        reviews={testimonials}
        businessName="Mouhajer International Design"
        aggregateRating={{
          ratingValue: 4.9,
          reviewCount: testimonials.length,
        }}
      />

      <div className="min-h-screen bg-background">
        <TestimonialHero locale={locale} />

        <TestimonialGrid
          testimonials={testimonials}
          locale={locale}
        />

        {/* Call to Action */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('cta.description')}
            </p>
            <a
              href={`/${locale}/contact-us`}
              className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              {t('cta.button')}
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
