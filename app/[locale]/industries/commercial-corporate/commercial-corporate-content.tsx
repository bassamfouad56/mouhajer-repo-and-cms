'use client';

import UnifiedIndustryTemplate, { UnifiedIndustryTemplateProps } from '@/components/industries/unified-industry-template';

interface Project {
  id: string;
  slug: string;
  title: string;
  titleAr?: string;
  excerpt?: string;
  client?: string;
  year?: number;
  location?: string;
  mainImage?: string | null;
  gallery?: string[];
}

interface Client {
  id: string;
  name: string;
  logo?: string | null;
}

interface CommercialCorporateContentProps {
  projects?: Project[];
  clients?: Client[];
  heroImage?: string | null;
  caseStudyProject?: Project | null;
}

export default function CommercialCorporateContent({
  projects = [],
  clients = [],
  heroImage,
  caseStudyProject,
}: CommercialCorporateContentProps) {
  // Commercial & Corporate specific content configuration
  const templateProps: UnifiedIndustryTemplateProps = {
    projects,
    clients,
    heroImage,
    caseStudyProject,
    industrySlug: 'commercial-corporate',

    hero: {
      label: 'Commercial & Corporate',
      title: 'Defining Business',
      titleHighlight: 'Environments.',
      subtitle: 'Engineered for performance. Designed for the brand.',
    },

    immersiveSection: {
      label: 'Time is Revenue',
      title: 'Fast-Track',
      titleHighlight: 'Delivery.',
      subtitle: 'In commercial real estate, every day of construction is a day of lost rent or revenue. MIDC is structured for speed.',
      images: [
        '/website%202.0%20content/services/industries/commercial%20and%20corporate/_MID1004-HDR.jpg',
        '/website%202.0%20content/projects/commercial/_MID7383-HDR.jpg',
        '/website%202.0%20content/homepage/Property%20Owners/vlcsnap-2026-01-03-15h21m57s058.jpg',
        '/website%202.0%20content/homepage/The%20Design%20Studio/_MID7172-HDR.jpg',
        '/website%202.0%20content/homepage/The%20Main%20Contractor/_MID9168.jpg',
      ],
      capabilities: [
        {
          title: 'Corporate Headquarters',
          subtitle: 'Productive Workspaces',
          description: 'Creating productive, acoustically optimized workspaces that enhance focus and collaboration.',
          methodology: 'Fast-Track Fit-Out',
          methodDesc: 'In-house joinery and MEP teams cut weeks off schedules.',
        },
        {
          title: 'Luxury Retail',
          subtitle: 'High-Precision Fit-Outs',
          description: 'High-precision fit-outs where the finish must match the product. Every detail reflects your brand.',
          methodology: 'Brand Alignment',
          methodDesc: 'Translating brand guidelines into physical space.',
        },
        {
          title: 'F&B & Restaurants',
          subtitle: 'Culinary Environments',
          description: 'Integrating complex kitchen MEP systems with dining aesthetics for memorable experiences.',
          methodology: 'Durability',
          methodDesc: 'High-traffic grade materials that last.',
        },
        {
          title: 'Mixed-Use Developments',
          subtitle: 'Multi-Function Spaces',
          description: 'Coordinating retail, office, and hospitality spaces within single developments.',
          methodology: 'Phased Delivery',
          methodDesc: 'Sequential handover to meet tenant schedules.',
        },
      ],
    },

    caseStudy: {
      title: 'C1 New Head Quarter',
      titleHighlight: 'Office Building',
      client: 'Osoul',
      scope: '7 Floors of high-spec office fit-out.',
      outcome: 'Delivered a fully automated, smart-office environment that serves as the operational hub for a major holding company.',
      certificatePath: '/awards/Luxury%20Lifestyle%20-%202021%20Certificate%20of%20Recognition.pdf',
      awardTitle: 'Certificate of Recognition',
      awardRegion: 'Excellence in Luxury Construction',
      awardYear: '2021',
      image: '/website%202.0%20content/services/industries/commercial%20and%20corporate/_MID1004-HDR.jpg',
    },

    partners: {
      title: 'Commercial',
      titleHighlight: 'Partners',
      partnerCategory: 'corporate',
      awards: [
        {
          title: 'Certificate of Recognition',
          region: 'Luxury Lifestyle',
          project: 'Excellence in Luxury Construction',
          year: '2021',
          certificate: '/awards/Luxury%20Lifestyle%20-%202021%20Certificate%20of%20Recognition.pdf',
        },
      ],
    },

    faqSection: {
      label: 'Expert Insights',
      title: 'Operational',
      titleHighlight: 'Protocols',
      subtitle: 'Ensuring your business opens on time',
      faqs: [
        {
          question: 'What is the timeline for a standard office fit-out?',
          answer: 'Speed is our priority. Because we have in-house joinery and MEP teams, we can execute a high-end office fit-out (1,000 sq. m) in as little as 12-16 weeks. We often run 24-hour shifts to meet aggressive opening dates for clients like Osoul and Louis Vuitton.',
        },
        {
          question: 'Do you handle the Civil Defence approvals?',
          answer: 'Yes. This is the most critical part of the commercial fit-out. Our engineering team prepares all Fire & Life Safety drawings and manages the inspection process with Dubai Civil Defence (DCD) to ensure you get your Occupancy Certificate on time.',
        },
        {
          question: 'Can you work in an occupied office tower?',
          answer: 'Yes. We are experts at logistics in high-rise towers (like the Burj Vista or Opus Tower). We manage the strict booking slots for freight elevators and loading bays to ensure materials arrive without disrupting other tenants.',
        },
      ],
    },

    cta: {
      label: 'Start Your Project',
      title: 'Build for',
      titleHighlight: 'Business.',
      primaryButtonText: 'DISCUSS YOUR FIT-OUT',
      primaryButtonHref: '/contact',
      secondaryButtonText: 'DOWNLOAD MIDC PROFILE 2025',
      secondaryButtonHref: '/downloads/midc-profile-2025.pdf',
    },
  };

  return <UnifiedIndustryTemplate {...templateProps} />;
}
