import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import SEOEnhanced from '@/components/SEOEnhanced';
import OfferSchema from '@/components/seo/OfferSchema';
import PricingHero from '@/components/pricing/PricingHero';
import PricingGrid from '@/components/pricing/PricingGrid';
import PricingComparison from '@/components/pricing/PricingComparison';
import { getPricingPlans, PricingPlan } from '@/lib/fetchers/pricing';

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as 'en' | 'ar';
  const t = await getTranslations({ locale, namespace: 'pricing' });

  const title = t('meta.title');
  const description = t('meta.description');
  const keywords =
    locale === 'en'
      ? [
          'interior design pricing',
          'design packages',
          'interior design cost',
          'Mouhajer pricing',
          'design services pricing',
          'luxury interior packages',
        ]
      : [
          'أسعار التصميم الداخلي',
          'باقات التصميم',
          'تكلفة التصميم الداخلي',
          'أسعار مهاجر',
          'أسعار خدمات التصميم',
          'باقات التصميم الفاخر',
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
          url: '/images/pricing-og.jpg',
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
      images: ['/images/pricing-og.jpg'],
    },
    alternates: {
      canonical: `/${locale}/pricing`,
      languages: {
        'en': '/en/pricing',
        'ar': '/ar/pricing',
      },
    },
  };
}

export default async function PricingPage({ params }: Props) {
  const locale = params.locale as 'en' | 'ar';
  const t = await getTranslations({ locale, namespace: 'pricing' });

  // Fetch pricing plans from GraphQL backend
  const pricingData = await getPricingPlans({
    filter: {
      locale,
      published: true,
    },
    limit: 10,
  });

  // Transform GraphQL data to component format
  const pricingTiers = pricingData.map((plan: PricingPlan) => ({
    id: plan.id,
    name: locale === 'en' ? plan.nameEn : (plan.nameAr || plan.nameEn),
    description: locale === 'en' ? plan.descriptionEn : (plan.descriptionAr || plan.descriptionEn),
    price: plan.price || 0,
    currency: plan.currency,
    priceSuffix: plan.priceSuffix || (locale === 'en' ? '/project' : '/مشروع'),
    features: locale === 'en' ? plan.featuresEn : (plan.featuresAr.length > 0 ? plan.featuresAr : plan.featuresEn),
    highlighted: plan.popular || plan.recommended,
    ctaText: locale === 'en' ? plan.ctaTextEn : (plan.ctaTextAr || plan.ctaTextEn),
  }));

  return (
    <>
      {/* SEO Components */}
      <SEOEnhanced title={t('meta.title')} description={t('meta.description')} />
      <OfferSchema
        pricingTiers={pricingTiers}
        organizationName="Mouhajer International Design"
        organizationUrl="https://mouhajer.com"
      />

      {/* Page Sections */}
      <PricingHero locale={locale} />
      <PricingGrid tiers={pricingTiers} locale={locale} />
      <PricingComparison locale={locale} />

      {/* Additional Information */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              {locale === 'en'
                ? 'Frequently Asked Questions About Pricing'
                : 'الأسئلة الشائعة حول الأسعار'}
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  {locale === 'en'
                    ? 'What factors affect the final price?'
                    : 'ما العوامل التي تؤثر على السعر النهائي؟'}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {locale === 'en'
                    ? 'The final price depends on project scope, square footage, material selections, custom furniture requirements, and timeline. We provide a detailed quote after the initial consultation.'
                    : 'يعتمد السعر النهائي على نطاق المشروع، والمساحة بالقدم المربع، واختيارات المواد، ومتطلبات الأثاث المخصص، والجدول الزمني. نقدم عرض أسعار مفصل بعد الاستشارة الأولية.'}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">
                  {locale === 'en'
                    ? 'Do you offer payment plans?'
                    : 'هل تقدمون خطط دفع؟'}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {locale === 'en'
                    ? 'Yes, we offer flexible payment plans tied to project milestones. Typically: 30% upon contract signing, 40% at design approval, and 30% upon project completion.'
                    : 'نعم، نقدم خطط دفع مرنة مرتبطة بمعالم المشروع. عادةً: 30٪ عند توقيع العقد، 40٪ عند الموافقة على التصميم، و30٪ عند إكمال المشروع.'}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">
                  {locale === 'en'
                    ? 'Are furniture and materials included?'
                    : 'هل الأثاث والمواد مشمولة؟'}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {locale === 'en'
                    ? 'Our packages include design services. Furniture, materials, and construction are quoted separately based on your selections. We work with trusted suppliers to get the best pricing.'
                    : 'تتضمن باقاتنا خدمات التصميم. يتم تسعير الأثاث والمواد والبناء بشكل منفصل بناءً على اختياراتك. نعمل مع موردين موثوقين للحصول على أفضل الأسعار.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {locale === 'en'
              ? 'Ready to Transform Your Space?'
              : 'هل أنت مستعد لتحويل مساحتك؟'}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            {locale === 'en'
              ? 'Schedule a free consultation to discuss your project and get a custom quote'
              : 'حدد موعدًا لاستشارة مجانية لمناقشة مشروعك والحصول على عرض أسعار مخصص'}
          </p>
          <a
            href={`/${locale}/contact`}
            className="inline-block bg-background text-foreground px-8 py-4 rounded-lg font-semibold hover:bg-background/90 transition-colors"
          >
            {locale === 'en' ? 'Get Free Consultation' : 'احصل على استشارة مجانية'}
          </a>
        </div>
      </section>
    </>
  );
}
