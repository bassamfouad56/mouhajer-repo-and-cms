import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroVideo } from "@/components/sections/hero-video";
import { StatsBanner } from "@/components/sections/stats-banner";
import { MouhajerPromise } from "@/components/sections/mouhajer-promise";
import { WhoWeAreCinematic } from "@/components/sections/who-we-are-cinematic";
import { FounderMessage } from "@/components/sections/founder-message";
import { CapabilitiesCarousel } from "@/components/sections/capabilities-carousel";
import { PortfolioShowcase } from "@/components/sections/portfolio-showcase";
import { PartnersTestimonials } from "@/components/sections/partners-testimonials";
import { CertificationsAwards } from "@/components/sections/certifications-awards";
import { SectorsExpertise } from "@/components/sections/sectors-expertise";
import { Contact } from "@/components/sections/contact";
import { FAQSection } from "@/components/sections/faq";

// Homepage FAQ content from content.md
const homepageFAQs = [
  {
    question: 'Do you handle the full construction scope from empty land?',
    answer: 'Yes. We are a licensed main contractor capable of executing the complete lifecycle—from land clearing and piling through to final handover. This is rare in the UAE\'s fragmented market.',
  },
  {
    question: 'Who manages the government approvals?',
    answer: 'We do. Our in-house team handles all permit applications, inspections, and compliance requirements with DDA, Civil Defence, DEWA, and other authorities.',
  },
  {
    question: 'Do you manufacture your own furniture?',
    answer: 'Yes. We own a 30,000 sq. ft. manufacturing facility where we produce custom joinery, fire-rated doors, wardrobes, and bespoke furniture pieces in-house.',
  },
  {
    question: 'Can you renovate my hotel while it stays open?',
    answer: 'Yes. We specialize in live-environment hospitality renovations. Our phased approach ensures minimal guest disruption while maintaining strict safety and quality standards.',
  },
  {
    question: 'Do you provide maintenance after handover?',
    answer: 'Yes. We offer comprehensive Annual Maintenance Contracts (AMCs) and ongoing support to protect your investment long after the keys are handed over.',
  },
];

import { LogoMarquee } from "@/components/logo-marquee";
import { client } from "@/sanity/lib/client";
import { projectsQuery, servicesQuery, industriesQuery, siteSettingsQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";

export const revalidate = 3600; // Revalidate every hour

async function getProjects(locale: string) {
  try {
    const sanityProjects = await client.fetch(projectsQuery, { locale });

    // Helper to get image URL from Sanity
    const getImageUrl = (image: any): string => {
      if (!image?.asset) return '';
      try {
        return urlForImage(image)
          .width(1200)
          .height(800)
          .auto('format')
          .url();
      } catch {
        return '';
      }
    };

    // Helper to extract localized string from i18n field
    // Handles both plain strings and {en, ar} objects from Sanity i18n
    const getLocalizedString = (field: any): string => {
      if (!field) return '';
      // If it's already a string, return it
      if (typeof field === 'string') return field;
      // If it's an i18n object, extract the correct locale
      if (typeof field === 'object' && field !== null) {
        return field[locale] || field.en || field.ar || '';
      }
      return '';
    };

    // Transform Sanity projects to match WordPress format expected by PortfolioShowcase
    const transformedProjects = (sanityProjects || []).map((project: any) => ({
      id: project._id || '',
      slug: project.slug?.current || '',
      title: getLocalizedString(project.title),
      excerpt: getLocalizedString(project.excerpt),
      featuredImage: {
        node: {
          sourceUrl: getImageUrl(project.mainImage),
          altText: getLocalizedString(project.title),
        },
      },
      acfFields: {
        location: getLocalizedString(project.location),
        projectType: getLocalizedString(project.category),
        yearCompleted: project.year || '',
      },
      // Keep original Sanity data for components that need it
      _sanityData: project,
    }));

    return transformedProjects;
  } catch (error) {
    console.error('Error fetching projects from Sanity:', error);
    return [];
  }
}

async function getServices(locale: string) {
  try {
    const services = await client.fetch(servicesQuery, { locale });
    return services || [];
  } catch (error) {
    console.error('Error fetching services from Sanity:', error);
    return [];
  }
}

async function getIndustries(locale: string) {
  try {
    const industries = await client.fetch(industriesQuery, { locale });
    return industries || [];
  } catch (error) {
    console.error('Error fetching industries from Sanity:', error);
    return [];
  }
}

// Fetch site settings from Sanity (section images, founder info, etc.)
async function getSiteSettings() {
  try {
    const settings = await client.fetch(siteSettingsQuery);

    // Helper to get image URL from Sanity
    const getImageUrl = (image: any, width = 1920, height = 1080): string => {
      if (!image?.asset) return '';
      try {
        return urlForImage(image)
          .width(width)
          .height(height)
          .auto('format')
          .url();
      } catch {
        return '';
      }
    };

    if (!settings) {
      return {
        founderImage: '',
        founderName: 'Mariam Mouhajer',
        founderTitle: 'Founder & Creative Director',
        founderQuote: '',
        contactBackgroundImage: '',
        statsBackgroundImage: '',
        aboutImage: '',
        heroImage: '',
      };
    }

    return {
      founderImage: getImageUrl(settings.founderImage, 800, 1000),
      founderName: settings.founderName || 'Mariam Mouhajer',
      founderTitle: settings.founderTitle || 'Founder & Creative Director',
      founderQuote: settings.founderQuote || '',
      contactBackgroundImage: getImageUrl(settings.contactBackgroundImage),
      statsBackgroundImage: getImageUrl(settings.statsBackgroundImage),
      aboutImage: getImageUrl(settings.aboutImage, 1200, 1500),
      heroImage: getImageUrl(settings.heroImage),
      whyChooseUsImage: getImageUrl(settings.whyChooseUsImage, 1200, 800),
      whyChooseUsSecondaryImage: getImageUrl(settings.whyChooseUsSecondaryImage, 600, 800),
    };
  } catch (error) {
    console.error('Error fetching site settings from Sanity:', error);
    return {
      founderImage: '',
      founderName: 'Mariam Mouhajer',
      founderTitle: 'Founder & Creative Director',
      founderQuote: '',
      contactBackgroundImage: '',
      statsBackgroundImage: '',
      aboutImage: '',
      heroImage: '',
    };
  }
}

// Get project images organized by category for homepage sections
async function getProjectImagesByCategory(locale: string) {
  try {
    const projects = await client.fetch(projectsQuery, { locale });

    const getImageUrl = (project: any): string => {
      // Return empty string if project is undefined or null
      if (!project) return '';

      if (project.mainImage?.asset) {
        try {
          return urlForImage(project.mainImage)
            .width(1200)
            .height(800)
            .auto('format')
            .url();
        } catch {
          return '';
        }
      }
      return '';
    };

    const allProjects = projects || [];

    // Return default empty values if no projects
    if (allProjects.length === 0) {
      return {
        promise: { landOwners: '', propertyOwners: '' },
        whoWeAre: { contractor: '', designer: '', manufacturer: '' },
        capabilities: [],
        sectors: { hospitality: '', residential: '', commercial: '' },
      };
    }

    // Categorize projects by type
    const hospitality = allProjects.filter((p: any) =>
      p?.category?.toLowerCase()?.includes('hospitality') ||
      p?.category?.toLowerCase()?.includes('hotel')
    );
    const residential = allProjects.filter((p: any) =>
      p?.category?.toLowerCase()?.includes('residential') ||
      p?.category?.toLowerCase()?.includes('villa')
    );
    const commercial = allProjects.filter((p: any) =>
      p?.category?.toLowerCase()?.includes('commercial') ||
      p?.category?.toLowerCase()?.includes('office') ||
      p?.category?.toLowerCase()?.includes('retail')
    );

    return {
      // For MouhajerPromise - 2 images (construction/renovation focus)
      promise: {
        landOwners: getImageUrl(allProjects[0]) || getImageUrl(allProjects[1]) || '',
        propertyOwners: getImageUrl(allProjects[2]) || getImageUrl(allProjects[3]) || '',
      },
      // For WhoWeAreCinematic - 3 images (contractor, designer, manufacturer)
      whoWeAre: {
        contractor: getImageUrl(allProjects[0]) || '',
        designer: getImageUrl(allProjects[1]) || '',
        manufacturer: getImageUrl(allProjects[2]) || '',
      },
      // For CapabilitiesCarousel - 6 images
      capabilities: allProjects.slice(0, 6).map((p: any) => ({
        url: getImageUrl(p),
        alt: p?.title || 'MIDC Project',
      })),
      // For SectorsExpertise - 3 images by category
      sectors: {
        hospitality: getImageUrl(hospitality[0]) || getImageUrl(allProjects[0]) || '',
        residential: getImageUrl(residential[0]) || getImageUrl(allProjects[1]) || '',
        commercial: getImageUrl(commercial[0]) || getImageUrl(allProjects[2]) || '',
      },
    };
  } catch (error) {
    console.error('Error fetching project images:', error);
    return {
      promise: { landOwners: '', propertyOwners: '' },
      whoWeAre: { contractor: '', designer: '', manufacturer: '' },
      capabilities: [],
      sectors: { hospitality: '', residential: '', commercial: '' },
    };
  }
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Fetch data from Sanity CMS
  const [projects, services, industries, projectImages, siteSettings] = await Promise.all([
    getProjects(locale),
    getServices(locale),
    getIndustries(locale),
    getProjectImagesByCategory(locale),
    getSiteSettings(),
  ]);

  return (
    <>
      <Header />

      <main className="relative">
        {/* Section 1: Hero with Video */}
        <HeroVideo />

        {/* Section 2: The Mouhajer Promise */}
        <MouhajerPromise images={projectImages.promise} />

        {/* Section 3: Who We Are - Cinematic Experience */}
        <WhoWeAreCinematic images={projectImages.whoWeAre} />

        {/* Section 4: Stats Banner */}
        <StatsBanner />

        {/* Section 4.5: Trusted Partners Logo Marquee */}
        <LogoMarquee />

        {/* Section 5: Founder's Message */}
        <FounderMessage
          founderImage={siteSettings.founderImage}
          founderName={siteSettings.founderName}
          founderTitle={siteSettings.founderTitle}
          founderQuote={siteSettings.founderQuote}
        />

        {/* Section 6: Our Capabilities */}
        <CapabilitiesCarousel images={projectImages.capabilities} />

        {/* Section 7: Portfolio of Excellence */}
        <PortfolioShowcase projects={projects} />

        {/* Section 9: Sectors of Expertise */}
        <SectorsExpertise images={projectImages.sectors} />

        {/* Section 9: Strategic Partners & Testimonials */}
        <PartnersTestimonials />

        {/* Section 10: Certifications & Awards */}
        <CertificationsAwards />

        {/* Section 11: FAQ */}
        <FAQSection
          title="Clarity Before Commitment"
          subtitle="Find answers to common questions about our construction and design services."
          faqs={homepageFAQs}
          variant="dark"
        />

        {/* Section 12: Contact */}
        <Contact backgroundImage={siteSettings.contactBackgroundImage} />
      </main>

      <Footer />
    </>
  );
}
