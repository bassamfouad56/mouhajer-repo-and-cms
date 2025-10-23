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

interface BlockRendererProps {
  blocks: any[];
  locale: 'en' | 'ar';
  featuredProjects: any[];
  featuredBlogs: any[];
  media: any[];
}

export default function BlockRenderer({ blocks, locale, featuredProjects, featuredBlogs, media }: BlockRendererProps) {
  return (
    <>
      {blocks
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((block) => {
          switch (block.type) {
            case 'hero_banner':
              console.log('Hero banner block data:', block.data);
              // Handle multiple possible data structures
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
              console.log('Hero banner title/subtitle:', { title, subtitle, locale, rawData: block.data });
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

            case 'stats_section':
              // Map CMS stats data to KeyFacts component format
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

            case 'company_description_home':
              // Collect all 4 images into a gallery array
              const companyGallery = [
                block.data?.image1,
                block.data?.image2,
                block.data?.image3,
                block.data?.image4
              ].filter(Boolean); // Remove empty/undefined images

              return (
                <AboutSectionHomePage
                  key={block.id}
                  locale={locale}
                  content={{
                    title: block.data?.title?.[locale] || '',
                    subtitle: block.data?.subtitle?.[locale] || '',
                    description: block.data?.description?.[locale] || '',
                    image: companyGallery[0] || '',
                    features: block.data?.features || [],
                    gallery: companyGallery,
                    stats: {
                      years: block.data?.yearsOfExperience || '22',
                      label: block.data?.experienceLabel?.[locale] || (locale === 'en' ? 'Years of Excellence' : 'عاماً من التميز')
                    }
                  }}
                />
              );

            case 'services_showcase':
              // Map CMS services data to OurServicesSwiper format
              // Filter out services without valid images to prevent Invalid URL errors
              const services = block.data?.services
                ?.map((service: any) => ({
                  title: service.title?.[locale] || '',
                  description: service.description?.[locale] || '',
                  banner: service.image || service.icon || '/images/services/default.jpg'
                }))
                .filter((service: any) => {
                  // Only include services with valid image URLs
                  const hasValidImage = service.banner &&
                    (service.banner.startsWith('/') ||
                     service.banner.startsWith('http://') ||
                     service.banner.startsWith('https://'));
                  return hasValidImage && service.title;
                }) || [];

              // Only render if we have valid services
              if (services.length === 0) {
                return null;
              }

              return (
                <OurServicesSwiper
                  key={block.id}
                  services={services}
                  title={block.data?.title?.[locale]}
                />
              );

            case 'portfolio_section':
            case 'portfolio_display_home':
              // Filter projects based on block settings
              const showFeatured = block.data?.showFeatured !== false; // default true
              const categoryFilter = block.data?.category;
              const maxItems = block.data?.maxItems || 6;

              let filteredProjects = featuredProjects;

              // Apply category filter if specified
              if (categoryFilter) {
                filteredProjects = filteredProjects.filter((p: any) => p.category === categoryFilter);
              }

              // Apply maxItems limit
              filteredProjects = filteredProjects.slice(0, maxItems);

              return (
                <PortfolioHomePageDisplay
                  key={block.id}
                  text={block.data?.title?.[locale] || (locale === 'en' ? 'Portfolio' : 'الأعمال')}
                  headline={block.data?.headline?.[locale]}
                  projectCount={block.data?.projectCount?.[locale] || (locale === 'en' ? '+400 Projects' : '+400 مشروع')}
                  projects={filteredProjects}
                  locale={locale}
                />
              );

            case 'separator':
              return <MoreAboutUsSeperator key={block.id} />;

            case 'testimonials_section':
              // Testimonials block - currently no dedicated component
              // Render as text section for now
              return (
                <div key={block.id} className="py-20 px-4 2xl:px-80 bg-[#F8F9FA]">
                  <h2 className="text-4xl 2xl:text-6xl font-SchnyderS uppercase mb-8">
                    {block.data?.title?.[locale] || (locale === 'en' ? 'Testimonials' : 'شهادات العملاء')}
                  </h2>
                  {block.data?.subtitle?.[locale] && (
                    <p className="text-xl mb-12 opacity-60">{block.data.subtitle[locale]}</p>
                  )}
                  {/* Testimonials rendering would go here */}
                </div>
              );

            case 'process_section':
              // Map CMS process data to HowWeWork component
              const processSteps = block.data?.steps?.map((step: any, index: number) => ({
                index: index + 1,
                how_we_work: step.title?.[locale] || '',
                desc: step.description?.[locale] || '',
                project_discovery_arabic: step.title?.ar || '',
                desc_arabic: step.description?.ar || ''
              })) || [];

              // Validate images
              const mainImage = block.data?.mainImage || '/images/process/main.jpg';
              const smallImage = block.data?.smallImage || '/images/process/small.jpg';

              // Only render if we have valid process steps
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
              // Text section with optional image
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
              // Multi-column text layout (mission, vision, values)
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
              // Features/benefits grid
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

            case 'team_section':
              // Team members display
              return (
                <div key={block.id} className="py-20 px-4 2xl:px-80 bg-white">
                  <h2 className="text-4xl 2xl:text-6xl font-SchnyderS uppercase mb-6">
                    {block.data?.title?.[locale]}
                  </h2>
                  {block.data?.subtitle?.[locale] && (
                    <p className="text-xl uppercase opacity-40 mb-4">{block.data.subtitle[locale]}</p>
                  )}
                  {block.data?.description?.[locale] && (
                    <p className="text-base mb-12 max-w-3xl opacity-70">{block.data.description[locale]}</p>
                  )}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {block.data?.teamMembers?.map((member: any, index: number) => (
                      <div key={index} className="space-y-4">
                        <h4 className="text-xl font-SchnyderS uppercase">{member.name}</h4>
                        <p className="text-sm uppercase opacity-40">{member.title?.[locale]}</p>
                        <p className="text-sm leading-relaxed opacity-60">{member.bio?.[locale]}</p>
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