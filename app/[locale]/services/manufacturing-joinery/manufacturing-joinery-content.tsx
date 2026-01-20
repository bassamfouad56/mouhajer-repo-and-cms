'use client';

import UnifiedServiceTemplate, { UnifiedServiceTemplateProps } from '@/components/services/unified-service-template';

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

interface ManufacturingJoineryContentProps {
  projects?: Project[];
  heroImage?: string | null;
  caseStudyProject?: Project | null;
}

// Local capability images from public folder - mapped to capability titles
const CAPABILITY_IMAGES = {
  customMillwork: '/services/inside manufacturing and joinery/Custom Millwork & Built-Ins/_MID0105-HDR.jpg',
  furnitureManufacturing: '/services/inside manufacturing and joinery/Furniture Manufacturing/woodworking-equipment-in-a-furniture-manufacture-w-2026-01-08-07-54-57-utc.jpg',
  cncHandFinishing: '/services/inside manufacturing and joinery/CNC Precision & Hand Finishing/close-shot-of-a-drilling-cnc-machine-at-wood-machi-2025-04-01-13-06-20-utc.jpg',
  qualityControl: '/services/inside manufacturing and joinery/The Mouhajer factory/real-people-real-work-real-rewards-view-of-the-2025-03-26-02-17-24-utc.jpg',
  caseStudy: '/services/manufacturing and joinery/quality-control-at-workshop-2025-01-31-00-41-33-utc.jpg',
  hero: '/services/manufacturing and joinery/quality-control-at-workshop-2025-01-31-00-41-33-utc.jpg',
};

export default function ManufacturingJoineryContent({
  projects = [],
  heroImage,
  caseStudyProject,
}: ManufacturingJoineryContentProps) {

  // Manufacturing & Joinery specific content configuration
  const templateProps: UnifiedServiceTemplateProps = {
    projects,
    heroImage: heroImage || CAPABILITY_IMAGES.hero,
    caseStudyProject,
    serviceSlug: 'manufacturing-joinery',

    hero: {
      label: 'Manufacturing & Joinery',
      title: 'The Mouhajer',
      titleHighlight: 'Factory.',
      subtitle: 'Luxury cannot be bought from a catalogue. It must be crafted.',
    },

    immersiveSection: {
      label: 'We Make.',
      title: 'Bespoke',
      titleHighlight: 'Execution.',
      subtitle: 'We operate our own 40,000-square-foot joinery facility in Sharjah Industrial Area, staffed with full-time craftsmen, CNC operators, and finishing specialists.',
      images: [
        CAPABILITY_IMAGES.customMillwork,
        CAPABILITY_IMAGES.furnitureManufacturing,
        CAPABILITY_IMAGES.cncHandFinishing,
        CAPABILITY_IMAGES.qualityControl,
      ],
      capabilities: [
        {
          title: 'Custom Millwork',
          subtitle: 'Built-Ins',
          description: 'Full-height paneling systems in walnut, oak, marble-inlaid veneers. Every panel is shop-drawn, CNC-cut, and test-fitted before installation.',
          methodology: 'Precision',
          methodDesc: 'No visible seams.',
        },
        {
          title: 'Furniture Manufacturing',
          subtitle: 'Bespoke Pieces',
          description: 'Solid wood slabs, book-matched veneers, marble or brass inlay details. Each piece designed to match the interior narrative.',
          methodology: 'Durability',
          methodDesc: 'Hotel-grade construction.',
        },
        {
          title: 'CNC & Hand Finishing',
          subtitle: 'Technology + Craft',
          description: 'German CNC routers for precision cutting with tolerances down to 0.1mm. Industrial spray booth for high-gloss lacquer and hand-buffed finishes.',
          methodology: 'Artistry',
          methodDesc: 'Multiple coats, hand-buffed.',
        },
        {
          title: 'Quality Control',
          subtitle: 'Pre-Installation',
          description: 'Pre-approval mock-ups for every major joinery package. White-glove packaging with air-ride suspension delivery.',
          methodology: 'Standards',
          methodDesc: 'No surprises on site.',
        },
      ],
    },

    caseStudy: {
      title: 'The Address Boulevard',
      titleHighlight: '— 342 Custom Headboards',
      client: 'Emaar Hospitality Group',
      scope: '342 upholstered headboards with internal LED backlighting, 684 floating nightstands with hidden cable management.',
      outcome: 'Phased production over 8 weeks, installed floor-by-floor with perfect consistency. Zero units requiring rework.',
      image: CAPABILITY_IMAGES.caseStudy,
    },

    faqSection: {
      label: 'Expert Insights',
      title: 'Manufacturing',
      titleHighlight: 'Questions',
      subtitle: 'Common questions about our joinery and manufacturing process',
      faqs: [
        {
          question: 'Why not just use IKEA or catalogue furniture for commercial projects?',
          answer: 'IKEA is engineered for residential use — 5-10 years of occasional use. Hotels need furniture that withstands daily abuse from hundreds of guests. We build to "contract-grade" standards: reinforced joinery, commercial-grade hardware, and finishes that can be refinished (not wrapped in vinyl). An IKEA cabinet might cost AED 500. Ours costs AED 3,500. But ours lasts 20 years.',
        },
        {
          question: 'Can you replicate a designer piece I saw in a showroom?',
          answer: 'Yes — with caveats. If you show us a photo of a sculptural console from a European brand, we can reverse-engineer it and produce a similar piece. We will not claim it\'s the original, and we will not use trademarked designs. But if you want something inspired by Brand X, adapted to your space, we can do that.',
        },
        {
          question: 'How do you handle changes mid-production?',
          answer: 'Carefully. Once we\'ve cut the wood, there\'s no undo. That\'s why we insist on sign-offs at every stage: shop drawings, material samples, mock-ups. If you approve the walnut stain sample and then ask for oak after we\'ve stained 50 panels, we restart from scratch — and the cost/schedule adjusts accordingly.',
        },
      ],
    },

    cta: {
      label: 'Visit Our Factory',
      title: 'Tour the',
      titleHighlight: 'Mouhajer Factory.',
      primaryButtonText: 'BOOK A FACTORY VISIT',
      primaryButtonHref: '/contact',
      secondaryButtonText: 'VIEW OUR PORTFOLIO',
      secondaryButtonHref: '/projects',
    },
  };

  return <UnifiedServiceTemplate {...templateProps} />;
}
