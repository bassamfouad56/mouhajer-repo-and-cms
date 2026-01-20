'use client';

import UnifiedIndustryTemplate, { UnifiedIndustryTemplateProps } from '@/components/industries/unified-industry-template';

interface Project {
  id: string;
  slug: string;
  title: string;
  titleAr?: string;
  excerpt: string;
  client: string;
  year?: number;
  location?: string;
  mainImage: string | null;
  gallery: string[];
}

interface Client {
  id: string;
  name: string;
  logo: string | null;
}

interface LuxuryHospitalityContentProps {
  projects?: Project[];
  clients?: Client[];
  heroImage?: string | null;
  caseStudyProject?: Project | null;
}

export default function LuxuryHospitalityContent({
  projects = [],
  clients = [],
  heroImage,
  caseStudyProject,
}: LuxuryHospitalityContentProps) {
  // Luxury Hospitality specific content configuration
  const templateProps: UnifiedIndustryTemplateProps = {
    projects,
    clients,
    heroImage,
    caseStudyProject,
    industrySlug: 'luxury-hospitality',

    hero: {
      label: 'Luxury Hospitality',
      title: 'The Art of the',
      titleHighlight: 'Live Renovation.',
      subtitle: 'Upgrading your asset while protecting your guest experience.',
    },

    immersiveSection: {
      label: 'Live Environment Renovations',
      title: 'Invisible',
      titleHighlight: 'Construction.',
      subtitle: 'Renovating a 5-star hotel while protecting your guest experience. Zero complaints. Revenue uninterrupted.',
      images: [
        '/website%202.0%20content/services/industries/luxury%20hospitality/_MID3940-HDR.jpg',
        '/website%202.0%20content/homepage/Property%20Owners/vlcsnap-2026-01-03-15h21m57s058.jpg',
        '/website%202.0%20content/homepage/The%20Design%20Studio/_MID7172-HDR.jpg',
        '/website%202.0%20content/services/inside%20services/the%20art%20of%20integrated%20construction/construction-%2B%20more%20labor.jpg',
        '/website%202.0%20content/homepage/The%20Main%20Contractor/_MID9168.jpg',
      ],
      capabilities: [
        {
          title: 'Lobbies & Public Areas',
          subtitle: 'The Wow Factor',
          description: 'Creating the arrival experience that defines your brand. From grand atriums to intimate reception areas.',
          methodology: 'Acoustic Barriers',
          methodDesc: 'Sound-proof walls that look like finished decor.',
        },
        {
          title: 'VIP & Royal Suites',
          subtitle: 'Bespoke Luxury',
          description: 'High-spec fit-outs involving gold leaf, mother-of-pearl, and smart automation for distinguished guests.',
          methodology: 'Night Works',
          methodDesc: 'Strategic scheduling during guest sleeping hours.',
        },
        {
          title: 'F&B Venues',
          subtitle: 'Revenue Maximized',
          description: 'Fast-track restaurant and bar fit-outs designed to minimize closure time and maximize revenue days.',
          methodology: 'Invisible Logistics',
          methodDesc: 'Back-of-house routes. Zero visibility to guests.',
        },
        {
          title: 'MEP Upgrades',
          subtitle: 'Operational Excellence',
          description: 'Replacing aging HVAC and electrical systems with energy-efficient solutions that reduce costs.',
          methodology: 'Phased Delivery',
          methodDesc: 'Systematic renovation without operational disruption.',
        },
      ],
    },

    caseStudy: {
      title: 'Sheraton Abu Dhabi',
      titleHighlight: 'Hotel & Resort',
      client: 'Abu Dhabi National Hotels (ADNH)',
      scope: 'Full renovation of Lobby, VIP Lounge, and Guestrooms.',
      outcome: 'Delivered on time and won the Arabian Property Award for Best Hotel Interior.',
      certificatePath: '/awards/APA%20-%202022-2023%20Best%20Hotel%20Interior%20Abu%20Dhabi%20-%20Sheraton%20Abu%20Dhabi%20(2).pdf',
      awardTitle: 'Best Hotel Interior',
      awardRegion: 'Abu Dhabi',
      awardYear: '2022-2023',
      image: '/website%202.0%20content/services/industries/luxury%20hospitality/_MID3940-HDR.jpg',
    },

    partners: {
      title: 'Hospitality',
      titleHighlight: 'Partners',
      partnerCategory: 'hospitality',
      awards: [
        {
          title: 'Best Hotel Suite Interior',
          region: 'Arabia',
          project: 'Address Boulevard VIP Suite',
          year: '2023-2024',
          certificate: '/awards/APA%20-%202023-2024%20Best%20Hotel%20Suite%20Interior%20Arabia%20-%20Address%20Boulevard%20VIP%20Suite.pdf',
        },
        {
          title: 'Best Hotel Interior',
          region: 'Abu Dhabi',
          project: 'Sheraton Abu Dhabi Hotel & Resort',
          year: '2022-2023',
          certificate: '/awards/APA%20-%202022-2023%20Best%20Hotel%20Interior%20Abu%20Dhabi%20-%20Sheraton%20Abu%20Dhabi%20(2).pdf',
        },
        {
          title: 'Best Hotel Suite Interior',
          region: 'Dubai',
          project: 'Address Boulevard VIP Suite',
          year: '2023-2024',
          certificate: '/awards/APA%20-%202023-2024%20Best%20Hotel%20Suite%20Interior%20Dubai%20-%20Address%20Boulevard%20VIP%20Suite.pdf',
        },
      ],
    },

    faqSection: {
      label: 'Expert Insights',
      title: 'Hotel Renovation',
      titleHighlight: 'Questions',
      subtitle: 'Clear answers for operators and asset managers',
      faqs: [
        {
          question: 'How do you renovate a "Live" hotel without complaints?',
          answer: 'We use a proprietary Live Environment Protocol. This involves creating acoustic buffer zones, using silent demolition tools, and scheduling noisy works during strict windows (typically 10:00 AM – 4:00 PM). We also use separate service elevators and back-of-house routes so your guests never see a worker.',
        },
        {
          question: 'Do you handle FF&E procurement?',
          answer: 'Yes. We are a full turnkey contractor. We procure Furniture, Fixtures, and Equipment (FF&E) directly from manufacturers, often using our own factory for bespoke joinery. This ensures the "Sheraton Standard" or "Ritz-Carlton Standard" is met without the markup of third-party agents.',
        },
        {
          question: 'Can you work with our brand standards?',
          answer: 'Absolutely. We have extensive experience working with international operator guidelines (Marriott, Hyatt, Accor, Hilton). We understand the non-negotiable standards for safety, material durability, and brand identity.',
        },
      ],
    },

    cta: {
      label: 'Start Your Project',
      title: 'Revitalize',
      titleHighlight: 'Your Asset.',
      primaryButtonText: 'CONSULT ON HOTEL RENOVATION',
      primaryButtonHref: '/contact',
      secondaryButtonText: 'DOWNLOAD MIDC HOSPITALITY PROFILE',
      secondaryButtonHref: '/about/company-profile',
    },
  };

  return <UnifiedIndustryTemplate {...templateProps} />;
}
