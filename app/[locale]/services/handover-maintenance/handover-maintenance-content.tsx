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

interface HandoverMaintenanceContentProps {
  projects?: Project[];
  heroImage?: string | null;
  caseStudyProject?: Project | null;
}

// Local capability images from public folder - using related service images for handover
const CAPABILITY_IMAGES = {
  handoverDocs: '/services/inside interior architecture/3D Visualization/Main Villa 3D_Page_22.jpg',
  defectsLiability: '/services/inside services/we do not outsource your vision/_MID3905-HDR.jpg',
  postWarranty: '/services/inside MEP engineering/engineer your asset/_MID5275.jpg',
  training: '/services/inside services/the art of integrated construction/construction-+ more labor.jpg',
  caseStudy: '/services/inside interior architecture/Visualize Your Future/2.jpg',
  hero: '/services/fitout execution/_MID1778-HDR.jpg',
};

export default function HandoverMaintenanceContent({
  projects = [],
  heroImage,
  caseStudyProject,
}: HandoverMaintenanceContentProps) {

  // Handover & Maintenance specific content configuration
  const templateProps: UnifiedServiceTemplateProps = {
    projects,
    heroImage: heroImage || CAPABILITY_IMAGES.hero,
    caseStudyProject,
    serviceSlug: 'handover-maintenance',

    hero: {
      label: 'Handover & Maintenance',
      title: 'The Keys',
      titleHighlight: '& Beyond.',
      subtitle: 'We don\'t just build your asset. We protect it.',
    },

    immersiveSection: {
      label: 'We Protect.',
      title: 'Long-Term',
      titleHighlight: 'Partnership.',
      subtitle: 'Most contractors disappear the day after handover. We stay. We provide a 12-month defects liability period and extend it with optional maintenance contracts.',
      images: [
        CAPABILITY_IMAGES.handoverDocs,
        CAPABILITY_IMAGES.defectsLiability,
        CAPABILITY_IMAGES.postWarranty,
        CAPABILITY_IMAGES.training,
      ],
      capabilities: [
        {
          title: 'Handover & Documentation',
          subtitle: 'The Final Step',
          description: 'Room-by-room walkthrough with digital punchlist. As-Built drawings showing final installed layout. O&M manuals for all systems.',
          methodology: 'Completeness',
          methodDesc: 'Nothing is "complete" until you agree.',
        },
        {
          title: '12-Month Defects Liability',
          subtitle: 'Standard Protection',
          description: 'Any defect caused by faulty workmanship or materials fixed at no cost. Non-urgent: 7 days. Urgent: 24 hours.',
          methodology: '24/7 Support',
          methodDesc: 'Round-the-clock for hotels.',
        },
        {
          title: 'Post-Warranty Maintenance',
          subtitle: 'Peace of Mind',
          description: 'Annual maintenance contracts with quarterly inspections. On-call maintenance for pay-per-visit. Refurbishment planning for Year 5-7.',
          methodology: 'Prevention',
          methodDesc: 'Catch issues before they\'re expensive.',
        },
        {
          title: 'Training & Knowledge',
          subtitle: 'Empowerment',
          description: 'MEP systems training for your facilities team. Finishing care instructions for every material. Printed care guides.',
          methodology: 'Transfer',
          methodDesc: 'Printed manual + video tutorials.',
        },
      ],
    },

    caseStudy: {
      title: 'Four Seasons Resort',
      titleHighlight: '— 5-Year Contract',
      client: 'Four Seasons',
      scope: 'Quarterly inspections of 60 villas, 24/7 emergency response, proactive refurbishment.',
      challenge: 'Maintaining resort-quality standards across beachfront villas with high wear-and-tear.',
      outcome: 'Estimated savings of AED 1.2M vs. reactive maintenance. Average emergency response time: 2.3 hours.',
      image: CAPABILITY_IMAGES.caseStudy,
    },

    faqSection: {
      label: 'Expert Insights',
      title: 'Maintenance',
      titleHighlight: 'Questions',
      subtitle: 'Common questions about our handover and maintenance services',
      faqs: [
        {
          question: 'Do I really need a maintenance contract, or can I just call when something breaks?',
          answer: 'You can call us on-demand (pay-per-visit). But without a contract, we don\'t proactively monitor your space. A slow plumbing leak behind a wall might go unnoticed for months — causing AED 50,000 in water damage. With quarterly inspections, we\'d catch it during the first visit and fix it for AED 500.',
        },
        {
          question: 'What happens if MIDC goes out of business? Will I lose my warranty?',
          answer: 'We provide manufacturer warranties (not just contractor warranties) for all fixtures, appliances, and materials. Even if MIDC vanished tomorrow, you could claim warranty directly from Hansgrohe, Daikin, etc. We\'re a 30+ year-old company with 200+ employees and AED 100M+ annual revenue.',
        },
        {
          question: 'Can I hire a cheaper contractor for post-warranty maintenance?',
          answer: 'Yes — but they won\'t know your space the way we do. They\'ll need to figure out which HVAC unit serves which room, where the shutoff valves are, what type of wood finish was used. We already have all that information. We walk in, diagnose the issue in 5 minutes, and fix it.',
        },
      ],
    },

    cta: {
      label: 'Start Your Project',
      title: 'Protect Your',
      titleHighlight: 'Investment.',
      primaryButtonText: 'DISCUSS MAINTENANCE OPTIONS',
      primaryButtonHref: '/contact',
      secondaryButtonText: 'VIEW OUR PORTFOLIO',
      secondaryButtonHref: '/projects',
    },
  };

  return <UnifiedServiceTemplate {...templateProps} />;
}
