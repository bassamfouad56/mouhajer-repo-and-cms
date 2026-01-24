/* eslint-disable @typescript-eslint/no-explicit-any */
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroVideo } from "@/components/sections/hero-video";
import { StatsBanner } from "@/components/sections/stats-banner";
import { UnifiedShowcase } from "@/components/sections/unified-showcase";
import { FounderMessage } from "@/components/sections/founder-message";
import { CapabilitiesCarousel } from "@/components/sections/capabilities-carousel";
import { PortfolioShowcase } from "@/components/sections/portfolio-showcase";
import { PartnersTestimonials } from "@/components/sections/partners-testimonials";
import { CertificationsAwards } from "@/components/sections/certifications-awards";
import { IndustriesHorizontalScroll } from "@/components/sections/industries-horizontal-scroll";
import { Contact } from "@/components/sections/contact";
import { FAQSection } from "@/components/sections/faq";
import {
  // SectionDivider,
  LuxuryTransition,
  SimpleAnimatedDivider,
} from "@/components/section-divider";

// Homepage FAQ content - exact content from document
const homepageFAQs = [
  {
    question: "Do you handle the full construction scope from empty land?",
    answer:
      "Yes. We are a licensed Building Contractor (G+12). We handle excavation, concrete, structural steel, and all civil works. You do not need a separate builder.",
  },
  {
    question: "Who manages the government approvals?",
    answer:
      "We do. Our in-house engineering team handles all permits and NOCs from Dubai Municipality, Civil Defence, DEWA, and master developers like Nakheel or Emaar.",
  },
  {
    question: "Do you manufacture your own furniture?",
    answer:
      "Yes. We own a dedicated joinery and furniture factory. We custom-make doors, wardrobes, kitchens, and loose furniture to fit your space perfectly.",
  },
  {
    question: "Can you renovate my hotel while it stays open?",
    answer:
      'Yes. We specialize in "live environment" renovations. We phase the work to ensure your guests are undisturbed and your revenue stream continues.',
  },
  {
    question: "Do you provide maintenance after handover?",
    answer:
      "Yes. We offer comprehensive annual maintenance contracts to ensure your AC, lighting, and finishes remain in showroom condition.",
  },
];

import { LogoMarquee } from "@/components/logo-marquee";
import { draftMode } from "next/headers";
import { client, clientWithStega } from "@/sanity/lib/client";
import {
  projectsQuery,
  servicesQuery,
  industriesQuery,
  siteSettingsQuery,
  clientsQuery,
  featuredTestimonialsQuery,
  homepageQuery,
  awardsQuery,
} from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";

// Disable caching to ensure fresh Sanity data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getProjects(locale: string) {
  try {
    const sanityProjects = await client.fetch(projectsQuery, { locale });

    // Helper to get image URL from Sanity
    const getImageUrl = (image: any): string => {
      if (!image?.asset) return "";
      try {
        return urlForImage(image).width(1200).height(800).auto("format").url();
      } catch {
        return "";
      }
    };

    // Helper to extract localized string from i18n field
    // Handles both plain strings and {en, ar} objects from Sanity i18n
    const getLocalizedString = (field: any): string => {
      if (!field) return "";
      // If it's already a string, return it
      if (typeof field === "string") return field;
      // If it's an i18n object, extract the correct locale
      if (typeof field === "object" && field !== null) {
        return field[locale] || field.en || field.ar || "";
      }
      return "";
    };

    // Transform Sanity projects to match WordPress format expected by PortfolioShowcase
    const transformedProjects = (sanityProjects || []).map((project: any) => ({
      id: project._id || "",
      slug: project.slug?.current || "",
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
        yearCompleted: project.year || "",
      },
      // Keep original Sanity data for components that need it
      _sanityData: project,
    }));

    return transformedProjects;
  } catch (error) {
    console.error("Error fetching projects from Sanity:", error);
    return [];
  }
}

async function getServices(locale: string) {
  try {
    const services = await client.fetch(servicesQuery, { locale });
    return services || [];
  } catch (error) {
    console.error("Error fetching services from Sanity:", error);
    return [];
  }
}

async function getIndustries(locale: string) {
  try {
    const industries = await client.fetch(industriesQuery, { locale });
    return industries || [];
  } catch (error) {
    console.error("Error fetching industries from Sanity:", error);
    return [];
  }
}

async function getClients(locale: string) {
  try {
    const clients = await client.fetch(clientsQuery, { locale });
    return clients || [];
  } catch (error) {
    console.error("Error fetching clients from Sanity:", error);
    return [];
  }
}

async function getTestimonials(locale: string) {
  try {
    const testimonials = await client.fetch(featuredTestimonialsQuery, {
      locale,
    });
    return testimonials || [];
  } catch (error) {
    console.error("Error fetching testimonials from Sanity:", error);
    return [];
  }
}

async function getAwards() {
  try {
    const awards = await client.fetch(awardsQuery);
    return awards || [];
  } catch (error) {
    console.error("Error fetching awards from Sanity:", error);
    return [];
  }
}

// Fetch homepage document with all sections for visual editing
async function getHomepage(locale: string, isDraftMode: boolean = false) {
  try {
    // Use stega-enabled client in draft mode for visual editing
    const sanityClient = isDraftMode ? clientWithStega : client;
    const homepage = await sanityClient.fetch(
      homepageQuery,
      { locale },
      { next: { revalidate: 0 } } // Force fresh data, no caching
    );
    return homepage;
  } catch (error) {
    console.error("Error fetching homepage from Sanity:", error);
    return null;
  }
}

// Helper to find a section by type from homepage sections array
function findSection(sections: any[] | undefined, type: string) {
  if (!sections) return null;
  return sections.find((s: any) => s._type === type && s.enabled !== false);
}

// Fetch site settings from Sanity (section images, founder info, etc.)
async function getSiteSettings() {
  try {
    const settings = await client.fetch(siteSettingsQuery);

    // Helper to get image URL from Sanity
    const getImageUrl = (image: any, width = 1920, height = 1080): string => {
      if (!image?.asset) return "";
      try {
        return urlForImage(image)
          .width(width)
          .height(height)
          .auto("format")
          .url();
      } catch {
        return "";
      }
    };

    if (!settings) {
      return {
        founderImage: "",
        founderName: "Mariam Mouhajer",
        founderTitle: "Founder & Creative Director",
        founderQuote: "",
        contactBackgroundImage: "",
        statsBackgroundImage: "",
        aboutImage: "",
        heroImage: "",
      };
    }

    return {
      founderImage: getImageUrl(settings.founderImage, 800, 1000),
      founderName: settings.founderName || "Mariam Mouhajer",
      founderTitle: settings.founderTitle || "Founder & Creative Director",
      founderQuote: settings.founderQuote || "",
      contactBackgroundImage: getImageUrl(settings.contactBackgroundImage),
      statsBackgroundImage: getImageUrl(settings.statsBackgroundImage),
      aboutImage: getImageUrl(settings.aboutImage, 1200, 1500),
      heroImage: getImageUrl(settings.heroImage),
      whyChooseUsImage: getImageUrl(settings.whyChooseUsImage, 1200, 800),
      whyChooseUsSecondaryImage: getImageUrl(
        settings.whyChooseUsSecondaryImage,
        600,
        800,
      ),
    };
  } catch (error) {
    console.error("Error fetching site settings from Sanity:", error);
    return {
      founderImage: "",
      founderName: "Mariam Mouhajer",
      founderTitle: "Founder & Creative Director",
      founderQuote: "",
      contactBackgroundImage: "",
      statsBackgroundImage: "",
      aboutImage: "",
      heroImage: "",
    };
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  // Check if we're in draft mode for visual editing
  const isDraftMode = (await draftMode()).isEnabled;

  // Fetch data from Sanity CMS
  const [
    projects,
    services,
    industries,
    siteSettings,
    clients,
    testimonials,
    homepage,
    awards,
  ] = await Promise.all([
    getProjects(locale),
    getServices(locale),
    getIndustries(locale),
    getSiteSettings(),
    getClients(locale),
    getTestimonials(locale),
    getHomepage(locale, isDraftMode),
    getAwards(),
  ]);

  // Extract section data for visual editing
  const heroSection = findSection(homepage?.sections, "heroSection");
  const showcaseSection = findSection(homepage?.sections, "showcaseSection");
  const statsSection = findSection(homepage?.sections, "statsSection");
  const logoMarqueeSection = findSection(homepage?.sections, "logoMarqueeSection");
  const founderSection = findSection(homepage?.sections, "founderSection");
  const capabilitiesSection = findSection(homepage?.sections, "capabilitiesSection");
  const portfolioSection = findSection(homepage?.sections, "portfolioSection");
  const industriesSection = findSection(homepage?.sections, "industriesSection");
  const partnersSection = findSection(homepage?.sections, "partnersSection");
  const certificationsSection = findSection(homepage?.sections, "certificationsSection");
  const faqSection = findSection(homepage?.sections, "faqSection");
  const contactSection = findSection(homepage?.sections, "contactSection");

  // Homepage ID and section keys for visual editing data attributes
  const homepageId = homepage?._id || "";

  return (
    <>
      <Header />

      <main
        id="main-content"
        className="relative bg-neutral-950"
        role="main"
        aria-label="Main content"
      >
        {/* Section 1: Hero with Video */}
        <HeroVideo
          sanityData={heroSection}
          homepageId={homepageId}
          sectionKey={heroSection?._key}
        />

        {/* Section 2 & 3: Unified Showcase - Promise Cards + Who We Are Horizontal Scroll */}
        <UnifiedShowcase
          images={{
            background:
              "/website%202.0%20content/services/inside%20services/the%20art%20of%20integrated%20construction/construction-%2B%20more%20labor.jpg",
            contractor:
              "/website%202.0%20content/homepage/The%20Main%20Contractor/_MID9168.jpg",
            designer:
              "/website%202.0%20content/homepage/The%20Design%20Studio/_MID7172-HDR.jpg",
            manufacturer:
              "/website%202.0%20content/homepage/The%20Craftsmen/carpenter-examining-wooden-board-2025-01-29-08-16-13-utc.jpg",
            landOwners:
              "/website%202.0%20content/homepage/land%20owners/_MID9173.jpg",
            propertyOwners:
              "/website%202.0%20content/homepage/Property%20Owners/vlcsnap-2026-01-03-15h21m57s058.jpg",
          }}
        />

        {/* Transition: Who We Are to Stats */}
        {/* <LuxuryTransition theme="light" /> */}

        {/* Section 4: Stats Banner */}
        <StatsBanner
          sanityData={statsSection}
          homepageId={homepageId}
          sectionKey={statsSection?._key}
        />

        {/* Section 4.5: Trusted Partners Logo Marquee */}
        <LogoMarquee clients={clients} />

        {/* Transition: Logo Marquee to Founder */}
        {/* <SimpleAnimatedDivider theme="light" /> */}

        {/* Section 5: Founder's Message */}
        <FounderMessage
          founderImage={
            founderSection?.founderImage ? undefined : siteSettings.founderImage
          }
          founderName={founderSection?.founderName || siteSettings.founderName}
          founderTitle={
            founderSection?.founderTitle || siteSettings.founderTitle
          }
          sanityData={founderSection}
          homepageId={homepageId}
          sectionKey={founderSection?._key}
        />

        {/* Transition: Founder to Capabilities */}
        {/* <SectionDivider variant="diamond" theme="light" /> */}

        {/* Section 6: Our Capabilities */}
        <CapabilitiesCarousel />

        {/* Transition: Capabilities to Portfolio */}
        {/* <LuxuryTransition theme="light" /> */}

        {/* Section 7: Portfolio of Excellence */}
        <PortfolioShowcase projects={projects} />

        {/* Transition: Portfolio to Sectors */}
        {/* <SectionDivider variant="gradient" theme="light" /> */}

        {/* Section 8: Industries We Transform - Horizontal Scroll */}
        <IndustriesHorizontalScroll industries={industries} />

        {/* Transition: Sectors to Partners */}
        {/* <SimpleAnimatedDivider theme="light" /> */}

        {/* Section 9: Strategic Partners & Testimonials */}
        <PartnersTestimonials clients={clients} testimonials={testimonials} />

        {/* Transition: Partners to Awards */}
        {/* <SectionDivider variant="dots" theme="light" /> */}

        {/* Section 10: Certifications & Awards */}
        <CertificationsAwards awards={awards} />

        {/* Transition: Awards to FAQ */}
        {/* <LuxuryTransition theme="light" /> */}

        {/* Section 11: FAQ */}
        <FAQSection
          title={faqSection?.sectionTitle || "Clarity Before Commitment"}
          subtitle={
            faqSection?.sectionSubtitle ||
            "Find answers to common questions about our construction and design services."
          }
          faqs={faqSection?.faqs?.length ? faqSection.faqs : homepageFAQs}
          variant="light"
          sanityData={faqSection}
          homepageId={homepageId}
          sectionKey={faqSection?._key}
        />

        {/* Transition: FAQ to Contact */}
        {/* <SectionDivider variant="minimal" theme="light" /> */}

        {/* Section 12: Contact */}
        <Contact backgroundImage={siteSettings.contactBackgroundImage} />
      </main>

      <Footer />
    </>
  );
}
