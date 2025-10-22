import HeroBanner from './HeroBanner';
import AboutSectionHomePage from './AboutSectionHomePage';
import AnimatedHeadLine from './AnimatedHeadLine';
import NewSnippetForDubaiBEstInterioirDesign from './NewSnippetForDubaiBEstInterioirDesign';
import PortfolioHomePageDisplay from './PortfolioHomePageDisplay';
import MoreAboutUsSeperator from './MoreAboutUsSeperator';
import OurAwards from './OurAwards';
import FeaturedIn from './FeaturedIn';
import FeaturedBlogsHomepage from './FeaturedBlogsHomepage';
import OurClients from './OurCLients';
import InstagraSection from './InstagraSection';
import ContactForm from './ContactForm';
import KeyFacts from './KeyFacts';
import OurServicesSwiper from './OurServicesSwiper';
import HowWeWork from './HowWeWork';

// Import additional components for static pages
import AboutBanner from './AboutBanner';
import WhatWeDoAboutPage from './WhatWeDoAboutPage';
import BreadCrumbs from './BreadCrumbs';
import ProjectInnerIntro from './projectInnerIntro';
import BlogList from './BlogList';
import ServicesList from './ServicesList';
import TeamGrid from './TeamGrid';
import FAQSection from './FAQSection';
import TestimonialsSection from './TestimonialsSection';
import PricingTable from './PricingTable';
import CaseStudyList from './CaseStudyList';

interface BlockRendererProps {
  blocks: any[];
  locale: 'en' | 'ar';
  featuredProjects?: any[];
  featuredBlogs?: any[];
  media?: any[];
  services?: any[]; // Add for services pages
  teamMembers?: any[]; // Add for team pages
  faqs?: any[]; // Add for FAQ pages
  testimonials?: any[]; // Add for testimonials
  pricing?: any[]; // Add for pricing
  caseStudies?: any[]; // Add for case studies
}

export default function BlockRenderer({
  blocks,
  locale,
  featuredProjects = [],
  featuredBlogs = [],
  media = [],
  services = [],
  teamMembers = [],
  faqs = [],
  testimonials = [],
  pricing = [],
  caseStudies = []
}: BlockRendererProps) {
  return (
    <>
      {blocks
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((block) => {
          switch (block.type) {
            // Existing block types
            case 'hero_banner':
              const title = block.data?.title?.[locale] ||
                           block.data?.[`title${locale.charAt(0).toUpperCase() + locale.slice(1)}`] ||
                           block.data?.titleEn ||
                           block.data?.titleAr ||
                           block.data?.text?.[locale] ||
                           '';
              const subtitle = block.data?.subtitle?.[locale] ||
                              block.data?.[`subtitle${locale.charAt(0).toUpperCase() + locale.slice(1)}`] ||
                              block.data?.subtitleEn ||
                              block.data?.subtitleAr ||
                              block.data?.description?.[locale] ||
                              '';
              return (
                <HeroBanner
                  key={block.id}
                  welcomText={title}
                  welcomeSubText={subtitle}
                  heroImage={block.data?.backgroundImage || block.data?.image}
                  videoSrc={block.data?.backgroundVideo || block.data?.video}
                />
              );

            case 'animated_headline':
              return (
                <AnimatedHeadLine
                  key={block.id}
                  text={block.data?.text?.[locale] || ''}
                />
              );

            case 'text_content':
            case 'cta_section':
              return (
                <NewSnippetForDubaiBEstInterioirDesign
                  key={block.id}
                  EnTitle={block.data?.title?.en || ''}
                  arTitle={block.data?.title?.ar || ''}
                  enSubtitle={block.data?.subtitle?.en || ''}
                  arSubtitle={block.data?.subtitle?.ar || ''}
                  enDescription={block.data?.description?.en || ''}
                  arDescription={block.data?.description?.ar || ''}
                  image={block.data?.backgroundImage || block.data?.image}
                />
              );

            case 'about_section':
              const aboutContent = {
                title: block.data?.title?.[locale] || '',
                subtitle: block.data?.subtitle?.[locale] || '',
                description: block.data?.description?.[locale] || '',
                image: block.data?.image || '',
                features: block.data?.features || [],
                gallery: block.data?.gallery || [],
                stats: {
                  years: block.data?.yearsOfExperience || '22',
                  label: block.data?.experienceLabel?.[locale] || ''
                }
              };
              return (
                <AboutSectionHomePage
                  key={block.id}
                  locale={locale}
                  content={aboutContent}
                />
              );

            // New block types for static pages
            case 'about_banner':
              return (
                <AboutBanner
                  key={block.id}
                  hideScroll={block.data?.hideScroll}
                />
              );

            case 'services_list':
              return (
                <WhatWeDoAboutPage
                  key={block.id}
                  hideTitle={block.data?.hideTitle}
                  arr={block.data?.services || services}
                />
              );

            case 'breadcrumbs':
              return (
                <div key={block.id} className="flex items-center justify-center">
                  <BreadCrumbs />
                </div>
              );

            case 'project_intro':
              return (
                <ProjectInnerIntro
                  key={block.id}
                  second_small_image={block.data?.images?.[0] || ''}
                  big_image={block.data?.images?.[1] || ''}
                  third_small_image={block.data?.images?.[2] || ''}
                  title={block.data?.title?.[locale] || ''}
                  animatedTitle={{ rendered: block.data?.animatedTitle?.[locale] || '' }}
                />
              );

            case 'blog_list':
              return (
                <BlogList
                  key={block.id}
                  blogs={block.data?.blogs || featuredBlogs}
                  locale={locale}
                />
              );

            case 'services_grid':
              return (
                <ServicesList
                  key={block.id}
                  services={block.data?.services || services}
                  locale={locale}
                />
              );

            case 'team_grid':
              return (
                <TeamGrid
                  key={block.id}
                  teamMembers={block.data?.teamMembers || teamMembers}
                  locale={locale}
                />
              );

            case 'faq_section':
              return (
                <FAQSection
                  key={block.id}
                  faqs={block.data?.faqs || faqs}
                  locale={locale}
                />
              );

            case 'testimonials':
              return (
                <TestimonialsSection
                  key={block.id}
                  testimonials={block.data?.testimonials || testimonials}
                  locale={locale}
                />
              );

            case 'pricing_table':
              return (
                <PricingTable
                  key={block.id}
                  plans={block.data?.plans || pricing}
                  locale={locale}
                />
              );

            case 'case_studies':
              return (
                <CaseStudyList
                  key={block.id}
                  caseStudies={block.data?.caseStudies || caseStudies}
                  locale={locale}
                />
              );

            case 'stats_section':
              const stats = block.data?.stats?.map((stat: any) => ({
                title: stat.number || '',
                subtitle: stat.label?.[locale] || ''
              })) || [];
              return (
                <KeyFacts
                  key={block.id}
                  facts={stats}
                  title={block.data?.title?.[locale]}
                />
              );

            case 'portfolio_section':
            case 'portfolio_display_home':
              return (
                <PortfolioHomePageDisplay
                  key={block.id}
                  text={block.data?.title?.[locale] || (locale === 'en' ? 'Portfolio' : 'الأعمال')}
                  projects={featuredProjects}
                  locale={locale}
                />
              );

            case 'separator':
              return <MoreAboutUsSeperator key={block.id} />;

            case 'process_section':
              const processSteps = block.data?.steps?.map((step: any, index: number) => ({
                index: index + 1,
                how_we_work: step.title?.[locale] || '',
                desc: step.description?.[locale] || '',
                project_discovery_arabic: step.title?.ar || '',
                desc_arabic: step.description?.ar || ''
              })) || [];

              const mainImage = block.data?.mainImage || '/images/process/main.jpg';
              const smallImage = block.data?.smallImage || '/images/process/small.jpg';

              if (processSteps.length === 0) {
                return null;
              }

              return (
                <HowWeWork
                  key={block.id}
                  arr={processSteps}
                  big_image={mainImage}
                  small_image={smallImage}
                />
              );

            case 'awards_section':
              const awardsMedia = media?.filter((m: any) => m.tags?.includes('awards')) || [];
              return (
                <OurAwards
                  key={block.id}
                  locale={locale}
                  awards={awardsMedia}
                />
              );

            case 'featured_in':
              return (
                <FeaturedIn
                  key={block.id}
                  locale={locale}
                  media={block.data?.logos || []}
                />
              );

            case 'blog_section':
              return (
                <FeaturedBlogsHomepage
                  key={block.id}
                  blogs={featuredBlogs}
                />
              );

            case 'clients_section':
              const clientsMedia = media?.filter((m: any) => m.tags?.includes('clients')) || [];
              return (
                <OurClients
                  key={block.id}
                  locale={locale}
                  clients={clientsMedia}
                />
              );

            case 'instagram_section':
              const instagramMedia = media?.filter((m: any) => m.tags?.includes('instagram')) || [];
              return (
                <InstagraSection
                  key={block.id}
                  locale={locale}
                  media={instagramMedia}
                />
              );

            case 'contact_form':
              return <ContactForm key={block.id} />;

            case 'text_section':
              return (
                <div key={block.id} className="py-20 px-4 2xl:px-80 bg-[#F8F9FA]">
                  <h2 className="text-4xl 2xl:text-6xl font-SchnyderS uppercase mb-6">
                    {block.data?.title?.[locale]}
                  </h2>
                  {block.data?.subtitle?.[locale] && (
                    <p className="text-xl uppercase opacity-40 mb-8">{block.data.subtitle[locale]}</p>
                  )}
                  {block.data?.content?.[locale] && (
                    <div className="prose max-w-none text-lg leading-relaxed whitespace-pre-line">
                      {block.data.content[locale]}
                    </div>
                  )}
                </div>
              );

            case 'text_columns':
              return (
                <div key={block.id} className="py-20 px-4 2xl:px-80 bg-white">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {block.data?.columns?.map((column: any, index: number) => (
                      <div key={index} className="space-y-4">
                        <h3 className="text-2xl font-SchnyderS uppercase">{column.title?.[locale]}</h3>
                        <p className="text-base leading-relaxed opacity-70">{column.content?.[locale]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );

            case 'features_grid':
              return (
                <div key={block.id} className="py-20 px-4 2xl:px-80 bg-[#F8F9FA]">
                  <h2 className="text-4xl 2xl:text-6xl font-SchnyderS uppercase mb-12">
                    {block.data?.title?.[locale]}
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {block.data?.features?.map((feature: any, index: number) => (
                      <div key={index} className="space-y-3">
                        <h4 className="text-xl font-SchnyderS uppercase">{feature.title?.[locale]}</h4>
                        <p className="text-sm leading-relaxed opacity-60">{feature.description?.[locale]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );

            default:
              return null;
          }
        })}
    </>
  );
}