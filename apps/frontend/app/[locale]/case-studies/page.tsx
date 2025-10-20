import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import SEOEnhanced from '@/components/SEOEnhanced';
import CaseStudyHero from '@/components/case-studies/CaseStudyHero';
import CaseStudyGrid from '@/components/case-studies/CaseStudyGrid';
import ProjectMetrics from '@/components/case-studies/ProjectMetrics';
import { SquareStack, Users, Award, Sparkles } from 'lucide-react';
import { getCaseStudies } from '@/lib/fetchers/case-studies';

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as 'en' | 'ar';
  const t = await getTranslations({ locale, namespace: 'caseStudies' });

  const title = t('meta.title');
  const description = t('meta.description');
  const keywords =
    locale === 'en'
      ? [
          'interior design case studies',
          'design portfolio',
          'completed projects',
          'Mouhajer projects',
          'luxury interiors',
          'residential design projects',
        ]
      : [
          'دراسات حالة التصميم الداخلي',
          'محفظة التصميم',
          'المشاريع المكتملة',
          'مشاريع مهاجر',
          'التصميم الداخلي الفاخر',
          'مشاريع التصميم السكني',
        ];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale === 'ar' ? 'ar_AE' : 'en_US',
      siteName: 'Mouhajer International Design',
      images: [
        {
          url: '/images/case-studies-og.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/case-studies-og.jpg'],
    },
    alternates: {
      canonical: `/${locale}/case-studies`,
      languages: {
        'en': '/en/case-studies',
        'ar': '/ar/case-studies',
      },
    },
  };
}

export default async function CaseStudiesPage({ params }: Props) {
  const locale = params.locale as 'en' | 'ar';
  const t = await getTranslations({ locale, namespace: 'caseStudies' });

  // Fetch case studies from GraphQL backend
  const caseStudiesData = await getCaseStudies(locale);

  // Transform GraphQL data for components
  const caseStudies = caseStudiesData.map((study) => ({
    id: study.id,
    title: locale === 'ar' && study.titleAr ? study.titleAr : study.titleEn,
    location: study.location || '',
    category: study.projectType,
    budget: study.budget
      ? locale === 'en'
        ? `AED ${(study.budget / 1000).toFixed(0)}K`
        : `${(study.budget / 1000).toFixed(0)} ألف درهم`
      : '',
    duration: study.duration || '',
    completion: study.completionDate
      ? new Date(study.completionDate).toLocaleDateString(
          locale === 'ar' ? 'ar-AE' : 'en-US',
          { year: 'numeric', month: 'long' }
        )
      : '',
    excerpt:
      locale === 'ar' && study.summaryAr ? study.summaryAr : study.summaryEn,
    image: study.heroImage || '/images/placeholder.jpg',
    slug: study.id,
  }));

  // Overall portfolio metrics
  const portfolioMetrics = [
    {
      label: locale === 'en' ? 'Projects Completed' : 'المشاريع المكتملة',
      value: '500+',
      icon: <SquareStack className="w-8 h-8 text-primary" />,
    },
    {
      label: locale === 'en' ? 'Happy Clients' : 'عملاء سعداء',
      value: '350+',
      icon: <Users className="w-8 h-8 text-primary" />,
    },
    {
      label: locale === 'en' ? 'Design Awards' : 'جوائز التصميم',
      value: '25+',
      icon: <Award className="w-8 h-8 text-primary" />,
    },
    {
      label: locale === 'en' ? 'Years Experience' : 'سنوات الخبرة',
      value: '15+',
      icon: <Sparkles className="w-8 h-8 text-primary" />,
    },
  ];

  return (
    <>
      {/* SEO Components */}
      <SEOEnhanced title={t('meta.title')} description={t('meta.description')} />

      {/* Page Sections */}
      <CaseStudyHero locale={locale} />
      <ProjectMetrics metrics={portfolioMetrics} locale={locale} />
      <CaseStudyGrid caseStudies={caseStudies} locale={locale} />

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {locale === 'en'
              ? 'Ready to Start Your Project?'
              : 'هل أنت مستعد لبدء مشروعك؟'}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            {locale === 'en'
              ? "Let's create something extraordinary together. Schedule a consultation to discuss your vision."
              : 'دعنا نصنع شيئًا استثنائيًا معًا. حدد موعدًا لاستشارة لمناقشة رؤيتك.'}
          </p>
          <a
            href={`/${locale}/contact`}
            className="inline-block bg-background text-foreground px-8 py-4 rounded-lg font-semibold hover:bg-background/90 transition-colors"
          >
            {locale === 'en' ? 'Schedule Consultation' : 'حدد موعد استشارة'}
          </a>
        </div>
      </section>
    </>
  );
}
