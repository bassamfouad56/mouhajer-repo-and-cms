import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import SEOEnhanced from '@/components/SEOEnhanced';
import FAQAccordion from '@/components/faq/FAQAccordion';
import FAQSchema from '@/components/seo/FAQSchema';
import FAQHero from '@/components/faq/FAQHero';
import FAQCategories from '@/components/faq/FAQCategories';
import { getFAQs } from '@/lib/fetchers/faq';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as 'en' | 'ar';
  const t = await getTranslations({ locale, namespace: 'faq' });

  const title = t('meta.title');
  const description = t('meta.description');

  return {
    title,
    description,
    keywords: locale === 'en'
      ? ['FAQ', 'frequently asked questions', 'interior design questions', 'design process', 'pricing questions', 'Dubai interior design FAQ']
      : ['الأسئلة الشائعة', 'أسئلة متكررة', 'أسئلة التصميم الداخلي', 'عملية التصميم', 'أسئلة التسعير'],
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
      canonical: `/${locale}/faq`,
      languages: {
        'en': '/en/faq',
        'ar': '/ar/faq',
      },
    },
  };
}

export default async function FAQPage({ params }: Props) {
  const locale = params.locale as 'en' | 'ar';
  const t = await getTranslations({ locale, namespace: 'faq' });

  // Fetch FAQs from CMS
  const faqsData = await getFAQs(locale);

  // Group FAQs by category and transform to component format
  const faqsByCategory = faqsData.reduce((acc, faq) => {
    const category = faq.category || (locale === 'en' ? 'General' : 'عام');

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push({
      id: faq.id,
      question: locale === 'ar' && faq.questionAr ? faq.questionAr : faq.questionEn,
      answer: locale === 'ar' && faq.answerAr ? faq.answerAr : faq.answerEn,
    });

    return acc;
  }, {} as Record<string, Array<{ id: string; question: string; answer: string }>>);

  // Convert to array format for components
  const faqs = Object.entries(faqsByCategory).map(([category, questions]) => ({
    category,
    questions: questions.sort((a, b) => {
      // Find original FAQs to get their order
      const aFaq = faqsData.find(f => f.id === a.id);
      const bFaq = faqsData.find(f => f.id === b.id);
      return (aFaq?.order || 0) - (bFaq?.order || 0);
    }),
  }));

  return (
    <>
      <SEOEnhanced
        title={t('meta.title')}
        description={t('meta.description')}
        canonical={`/${locale}/faq`}
        locale={locale}
      />

      <FAQSchema faqs={faqs.flatMap(cat => cat.questions)} />

      <div className="min-h-screen bg-background">
        <FAQHero locale={locale} />

        <FAQCategories
          faqs={faqs}
          locale={locale}
        />

        {/* Contact CTA */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {t('contact.title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('contact.description')}
            </p>
            <a
              href={`/${locale}/contact-us`}
              className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              {t('contact.button')}
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
