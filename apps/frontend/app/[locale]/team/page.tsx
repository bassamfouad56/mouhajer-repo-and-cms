import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import SEOEnhanced from '@/components/SEOEnhanced';
import PersonSchema from '@/components/seo/PersonSchema';
import TeamHero from '@/components/team/TeamHero';
import TeamGrid from '@/components/team/TeamGrid';
import CompanyValues from '@/components/team/CompanyValues';
import { getTeamMembers } from '@/lib/fetchers/team';

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as 'en' | 'ar';
  const t = await getTranslations({ locale, namespace: 'team' });

  const title = t('meta.title');
  const description = t('meta.description');
  const keywords =
    locale === 'en'
      ? [
          'interior design team',
          'expert designers',
          'Mouhajer team',
          'design professionals',
          'interior architects',
          'design leadership',
        ]
      : [
          'فريق التصميم الداخلي',
          'مصممون خبراء',
          'فريق مهاجر',
          'محترفو التصميم',
          'مهندسو ديكور',
          'قيادة التصميم',
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
          url: '/images/team-og.jpg',
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
      images: ['/images/team-og.jpg'],
    },
    alternates: {
      canonical: `/${locale}/team`,
      languages: {
        'en': '/en/team',
        'ar': '/ar/team',
      },
    },
  };
}

export default async function TeamPage({ params }: Props) {
  const locale = params.locale as 'en' | 'ar';
  const t = await getTranslations({ locale, namespace: 'team' });

  // Fetch team members from CMS
  const teamMembersData = await getTeamMembers(locale);

  // Transform to match component expected format
  const teamMembers = teamMembersData.map(member => ({
    id: member.id,
    name: locale === 'ar' && member.nameAr ? member.nameAr : member.nameEn,
    role: locale === 'ar' && member.roleAr ? member.roleAr : member.roleEn,
    bio: locale === 'ar' && member.bioAr ? member.bioAr : member.bioEn,
    image: member.profileImage || '/images/team/default-avatar.jpg',
    email: member.email || undefined,
    phone: undefined, // Not in schema
    socialProfiles: [
      ...(member.linkedin ? [{ platform: 'linkedin', url: member.linkedin }] : []),
    ],
    department: member.department,
    specialties: member.specialties,
    yearsExperience: member.yearsExperience,
  }));

  return (
    <>
      {/* SEO Components */}
      <SEOEnhanced title={t('meta.title')} description={t('meta.description')} />
      <PersonSchema
        members={teamMembers}
        organizationName="Mouhajer International Design"
        organizationUrl="https://mouhajer.com"
      />

      {/* Page Sections */}
      <TeamHero locale={locale} />
      <TeamGrid members={teamMembers} />
      <CompanyValues locale={locale} />

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-4">{t('mission.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('mission.description')}
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">{t('vision.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('vision.description')}
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
            {t('cta.title')}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            {t('cta.subtitle')}
          </p>
          <a
            href={`/${locale}/contact`}
            className="inline-block bg-background text-foreground px-8 py-4 rounded-lg font-semibold hover:bg-background/90 transition-colors"
          >
            {t('cta.button')}
          </a>
        </div>
      </section>
    </>
  );
}
