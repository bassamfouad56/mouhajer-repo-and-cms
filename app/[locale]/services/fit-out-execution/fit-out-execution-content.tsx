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

interface FitOutExecutionContentProps {
  projects?: Project[];
  heroImage?: string | null;
  caseStudyProject?: Project | null;
}

// Local capability images from public folder - using related service images for fit-out
const CAPABILITY_IMAGES = {
  flooringWall: '/services/inside interior architecture/The Uncluttered Baroque/_MID0166-HDR.jpg',
  joineryFurniture: '/services/inside manufacturing and joinery/Custom Millwork & Built-Ins/_MID0105-HDR.jpg',
  mepConnections: '/services/inside MEP engineering/Electrical & Lighting Engineering/_MID5317.jpg',
  finalFinishes: '/services/inside interior architecture/Conceptual Design & Narrative/_MID0183-HDR.jpg',
  caseStudy: '/services/inside services/we do not outsource your vision/_MID3905-HDR.jpg',
  hero: '/services/fitout execution/_MID1778-HDR.jpg',
};

export default function FitOutExecutionContent({
  projects = [],
  heroImage,
  caseStudyProject,
}: FitOutExecutionContentProps) {

  // Fit-Out Execution specific content configuration
  const templateProps: UnifiedServiceTemplateProps = {
    projects,
    heroImage: heroImage || CAPABILITY_IMAGES.hero,
    caseStudyProject,
    serviceSlug: 'fit-out-execution',

    hero: {
      label: 'Fit-Out Execution',
      title: 'The',
      titleHighlight: 'Craftsmen.',
      subtitle: 'The difference between a drawing and a landmark is the hand that builds it.',
    },

    immersiveSection: {
      label: 'Precision Installation',
      title: 'We',
      titleHighlight: 'Install.',
      subtitle: 'We employ full-time installation teams who know our standards. Every installer is trained in our internal "MIDC Installation Standards" manual.',
      images: [
        CAPABILITY_IMAGES.flooringWall,
        CAPABILITY_IMAGES.joineryFurniture,
        CAPABILITY_IMAGES.mepConnections,
        CAPABILITY_IMAGES.finalFinishes,
      ],
      capabilities: [
        {
          title: 'Flooring & Wall Finishes',
          subtitle: 'Foundation of Quality',
          description: 'Laser-guided leveling systems ensure floor tiles are within 1mm tolerance. Book-matched slabs are dry-laid before installation to verify vein continuity.',
          methodology: 'Precision',
          methodDesc: 'Epoxy grouting for stain resistance.',
        },
        {
          title: 'Joinery & Furniture',
          subtitle: 'Factory to Final',
          description: 'Our joinery installation teams are the same craftsmen who built the pieces in our factory. They know every drawer, hinge, and handle.',
          methodology: 'Continuity',
          methodDesc: 'Same craftsmen from factory to site.',
        },
        {
          title: 'MEP Final Connections',
          subtitle: 'Lighting, Power, Plumbing',
          description: 'We install all architectural lighting and then "aim" every spotlight to highlight artwork, floral arrangements, and key design features.',
          methodology: 'Integration',
          methodDesc: 'Dimming systems with preset scenes.',
        },
        {
          title: 'Final Finishes & Detailing',
          subtitle: 'The Last 5%',
          description: 'After all trades are complete, we send in a "finish team" to repair any dings, scratches, or paint chips. Walls are inspected under raking light.',
          methodology: 'Perfection',
          methodDesc: 'White-glove handover ready.',
        },
      ],
    },

    caseStudy: {
      title: 'Armani Hotel,',
      titleHighlight: 'Burj Khalifa',
      client: 'Emaar Hospitality Group',
      scope: '160 guest rooms renovation — working night shifts to avoid guest disturbance.',
      challenge: 'Fit-out in an occupied hotel without disrupting operations.',
      outcome: '160 rooms completed in 10 months. Zero defects. Zero guest complaints. Zero rework.',
      image: CAPABILITY_IMAGES.caseStudy,
    },

    faqSection: {
      label: 'Expert Insights',
      title: 'Questions',
      titleHighlight: '& Answers',
      subtitle: 'Common questions about our fit-out execution process',
      faqs: [
        {
          question: 'Why does fit-out always take longer than promised?',
          answer: 'Because most contractors don\'t control their supply chain. They order materials from 10 different suppliers, and if one shipment is delayed, the entire schedule collapses. We avoid this by: (1) Manufacturing joinery in-house, (2) Pre-ordering long-lead items at project start, and (3) Maintaining buffer stock of common finishes. We also build 10% schedule contingency into every timeline.',
        },
        {
          question: 'How do you prevent damage during installation?',
          answer: 'Three layers of protection: (1) Floor protection — corrugated cardboard + reinforced plastic over finished floors until final handover. (2) Corner guards — every door frame, column, and furniture corner gets foam corner guards during construction. (3) Final inspection — before we remove protection, we walk every space looking for dings, scratches, or defects.',
        },
        {
          question: 'Can you work around an operating business?',
          answer: 'Yes — but it doubles the complexity. We\'ve renovated operating hotel lobbies, restaurants, and offices by: (1) Phasing the work, (2) Working night shifts or weekends, (3) Using dust barriers, sound blankets, and HEPA vacuums to minimize disruption. It takes longer and costs more, but it\'s possible.',
        },
      ],
    },

    cta: {
      label: 'Start Your Project',
      title: 'Ready to',
      titleHighlight: 'Execute Perfection?',
      primaryButtonText: 'DISCUSS YOUR PROJECT',
      primaryButtonHref: '/contact',
      secondaryButtonText: 'VIEW OUR WORK',
      secondaryButtonHref: '/projects',
    },
  };

  return <UnifiedServiceTemplate {...templateProps} />;
}
