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

interface HighEndResidentialContentProps {
  projects?: Project[];
  clients?: Client[];
  heroImage?: string | null;
  caseStudyProject?: Project | null;
}

export default function HighEndResidentialContent({
  projects = [],
  clients = [],
  heroImage,
  caseStudyProject,
}: HighEndResidentialContentProps) {
  // High-End Residential specific content configuration
  const templateProps: UnifiedIndustryTemplateProps = {
    projects,
    clients,
    heroImage,
    caseStudyProject,
    industrySlug: 'high-end-residential',

    hero: {
      label: 'High-End Residential',
      title: 'Private',
      titleHighlight: 'Sanctuaries.',
      subtitle: 'A home designed for your status. Built for your peace.',
    },

    immersiveSection: {
      label: 'Absolute Discretion',
      title: 'White-Glove',
      titleHighlight: 'Exclusivity.',
      subtitle: 'For over 25 years, Eng. Maher Mouhajer has been the secret architect behind some of the region\'s most exclusive addresses. Privacy is the ultimate luxury.',
      images: [
        '/website%202.0%20content/services/industries/highend%20residential/_MID0001-HDR-2.jpg',
        '/website%202.0%20content/projects/residential/_MID0031-HDR.jpg',
        '/website%202.0%20content/homepage/Property%20Owners/vlcsnap-2026-01-03-15h21m57s058.jpg',
        '/website%202.0%20content/homepage/The%20Design%20Studio/_MID7172-HDR.jpg',
        '/website%202.0%20content/homepage/The%20Main%20Contractor/_MID9168.jpg',
      ],
      capabilities: [
        {
          title: 'Turnkey Villa Construction',
          subtitle: 'From Foundation to Finishing',
          description: 'Complete ground-up construction of luxury villas in Dubai\'s most exclusive communities. From the first pile to the final landscaped garden.',
          methodology: 'Single Contract',
          methodDesc: 'Design, engineering, and construction under one roof.',
        },
        {
          title: 'Penthouse Fit-Out',
          subtitle: 'High-Rise Expertise',
          description: 'Managing the complex logistics of working in ultra-high-rise towers. Coordinating material lifts, noise schedules, and live-building protocols.',
          methodology: 'Tower Logistics',
          methodDesc: 'Freight elevators, loading bays, and resident schedules.',
        },
        {
          title: 'Bespoke Manufacturing',
          subtitle: 'Crafted, Not Purchased',
          description: 'We do not buy furniture; we make it. Our factory creates custom walk-in wardrobes, vanity units, and loose furniture tailored to your exact specifications.',
          methodology: 'In-House Factory',
          methodDesc: 'Italian materials. Custom craftsmanship.',
        },
        {
          title: 'The "Uncluttered Baroque"',
          subtitle: 'Our Signature Style',
          description: 'A design philosophy that blends the opulence of your heritage with the comfort of modern living. Ornate yet breathable. Luxurious yet livable.',
          methodology: 'MIDC Signature',
          methodDesc: 'Timeless elegance meets modern comfort.',
        },
      ],
    },

    caseStudy: {
      title: 'Boulevard Penthouse',
      titleHighlight: '70-71',
      client: 'Private Client',
      scope: 'Design & Build of a duplex penthouse.',
      challenge: 'Working on the 70th floor of a live hotel tower.',
      outcome: 'A 5-Star Award Winner for Best Residential Interior, featuring Fendi-inspired joinery and smart home integration.',
      certificatePath: '/awards/APA%20-%202023-2024%20Best%20Residential%20Interior%20Apartment%20Dubai%20-%20Address%20Boulevard%20Penthouse%2070-71.pdf',
      awardTitle: 'Best Residential Interior',
      awardRegion: 'Dubai',
      awardYear: '2023-2024',
      image: '/website%202.0%20content/services/industries/highend%20residential/_MID0001-HDR-2.jpg',
    },

    partners: {
      title: 'Residential',
      titleHighlight: 'Partners',
      partnerCategory: 'developer',
      showLocations: true,
      locations: [
        'Jumeirah Bay (Bulgari Island)',
        'District One (MBR City)',
        'Palm Jumeirah (The Fronds)',
        'Emirates Hills',
      ],
      awards: [
        {
          title: 'Best Residential Interior',
          region: 'Dubai',
          project: 'Address Boulevard Penthouse 70-71',
          year: '2023-2024',
          certificate: '/awards/APA%20-%202023-2024%20Best%20Residential%20Interior%20Apartment%20Dubai%20-%20Address%20Boulevard%20Penthouse%2070-71.pdf',
        },
      ],
    },

    faqSection: {
      label: 'Expert Insights',
      title: 'Addressing',
      titleHighlight: 'Your Vision',
      subtitle: 'Professional guidance for private homeowners',
      faqs: [
        {
          question: 'Do I need to hire a separate architect and contractor?',
          answer: 'No, and we advise against it. Hiring separate entities often leads to conflict and delays. With MIDC, you have a single contract. We design the villa, we engineer it, and we build it. If a design detail is expensive, we tell you immediately, not after construction starts.',
        },
        {
          question: 'My villa is in a gated community (District One). Can you work there?',
          answer: 'Yes. We are pre-qualified to work in Dubai\'s most exclusive gated communities, including District One, Jumeirah Bay, and Emirates Hills. We handle all the specific logistics, gate passes, and developer approvals (Meydan, Meraas, Nakheel) so you don\'t have to.',
        },
        {
          question: 'How do you ensure my privacy?',
          answer: 'Privacy is our default setting. We sign strict Non-Disclosure Agreements (NDAs). Your home\'s location, floor plans, and photos are never shared publicly without your explicit written permission. Our site teams are vetted and trained in discretion.',
        },
      ],
    },

    cta: {
      label: 'Start Your Project',
      title: 'Commission Your',
      titleHighlight: 'Masterpiece.',
      primaryButtonText: 'REQUEST PRIVATE CONSULTATION',
      primaryButtonHref: '/contact',
      secondaryButtonText: 'DOWNLOAD MIDC RESIDENTIAL PROFILE',
      secondaryButtonHref: '/downloads/midc-residential-profile.pdf',
    },
  };

  return <UnifiedIndustryTemplate {...templateProps} />;
}
