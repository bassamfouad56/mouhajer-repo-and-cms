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

interface CivilConstructionContentProps {
  projects?: Project[];
  heroImage?: string | null;
  caseStudyProject?: Project | null;
}

// Local capability images from public folder - mapped to capability titles
const CAPABILITY_IMAGES = {
  excavation: '/services/inside civil construction/Excavation & Enabling Works/_MID0608.jpg',
  rcSuperstructure: '/services/inside civil construction/Reinforced Concrete Superstructure/_MID9144.jpg',
  structuralModifications: '/services/inside civil construction/Structural Modifications/_MID0111-HDR.jpg',
  qualitySafety: '/services/inside civil construction/the backbone of luxury/_MID9161.jpg',
  caseStudy: '/services/inside civil construction/Build on solid ground/_MID9175.jpg',
  hero: '/services/civil construction/MID5703.jpg',
};

export default function CivilConstructionContent({
  projects = [],
  heroImage,
  caseStudyProject,
}: CivilConstructionContentProps) {

  // Civil Construction specific content configuration
  const templateProps: UnifiedServiceTemplateProps = {
    projects,
    heroImage: heroImage || CAPABILITY_IMAGES.hero,
    caseStudyProject,
    serviceSlug: 'civil-construction',

    hero: {
      label: 'Civil Construction',
      title: 'The Backbone',
      titleHighlight: 'of Luxury.',
      subtitle: 'We are not just decorators. We are builders. Licensed, certified, and equipped to execute heavy civil works from the ground up.',
    },

    immersiveSection: {
      label: 'Defining the Skyline',
      title: 'We',
      titleHighlight: 'Build.',
      subtitle: 'In a market saturated with \'fit-out\' companies that are only licensed to decorate interiors, MIDC stands apart as a fully licensed Main Contractor.',
      images: [
        CAPABILITY_IMAGES.excavation,
        CAPABILITY_IMAGES.rcSuperstructure,
        CAPABILITY_IMAGES.structuralModifications,
        CAPABILITY_IMAGES.qualitySafety,
      ],
      capabilities: [
        {
          title: 'Excavation & Enabling',
          subtitle: 'Ground Preparation',
          description: 'Managing soil removal for basements and underground parking with precision engineering. Shoring, piling, and dewatering for safe foundation work.',
          methodology: 'Safety',
          methodDesc: 'ISO 45001 certified operations.',
        },
        {
          title: 'RC Superstructure',
          subtitle: 'The Skeleton',
          description: 'Post-tensioned slabs for massive column-free spaces essential for Grand Majlises and Ballrooms. Laser-leveled flooring for large-format marble installation.',
          methodology: 'Precision',
          methodDesc: 'Tolerances within millimeters.',
        },
        {
          title: 'Structural Modifications',
          subtitle: 'Transformation',
          description: 'Safely removing load-bearing walls to open up lobbies or combine hotel rooms into suites. Carbon fiber and steel jacketing for strengthening.',
          methodology: 'Engineering',
          methodDesc: 'Calculated load transfer.',
        },
        {
          title: 'Quality & Safety',
          subtitle: 'Zero Tolerance',
          description: 'ISO 9001 Quality Management with internal QA/QC inspections before every concrete pour. Independent lab testing of concrete cubes.',
          methodology: 'Standards',
          methodDesc: 'Military precision on site.',
        },
      ],
    },

    caseStudy: {
      title: 'Zero Tolerance',
      titleHighlight: 'for Error',
      client: 'MIDC Standards',
      scope: 'ISO 45001 Occupational Health & Safety, ISO 9001 Quality Management, Independent Lab Testing.',
      outcome: 'A luxury finish is impossible without a perfect structure. We operate under strict international standards to ensure what we build lasts for generations.',
      image: CAPABILITY_IMAGES.caseStudy,
    },

    faqSection: {
      label: 'Expert Insights',
      title: 'Construction',
      titleHighlight: 'Questions',
      subtitle: 'Common questions about our civil construction capabilities',
      faqs: [
        {
          question: 'Can you build a villa from scratch?',
          answer: 'Yes. We handle the entire lifecycle. From the initial soil test and excavation to the final roof waterproofing, we are the single point of contact for the entire build.',
        },
        {
          question: 'Most fit-out companies cannot build the structure. How can you?',
          answer: 'You are correct. Most firms only hold a "Decor" license. MIDC holds a specific Trade License for Building Contracting. This legal authority allows us to deploy heavy machinery, cast concrete, and execute structural steel works. We do not sub-contract the skeleton of your building. We build it.',
        },
        {
          question: 'Do you handle authorities\' approvals?',
          answer: 'Yes. Our engineering team manages the entire submission process with Dubai Municipality, Trakhees, and Civil Defence. We ensure the structural design complies with all local codes before we break ground.',
        },
        {
          question: 'How do you ensure safety on deep excavation sites?',
          answer: 'We operate under ISO 45001 standards. For deep excavations (like basements in District One), we use advanced shoring systems to stabilize the soil. We also employ dedicated Safety Officers who have the authority to stop work immediately if a risk is detected.',
        },
      ],
    },

    cta: {
      label: 'Start Your Project',
      title: 'Build on',
      titleHighlight: 'Solid Ground.',
      primaryButtonText: 'DISCUSS YOUR PROJECT',
      primaryButtonHref: '/contact',
      secondaryButtonText: 'VIEW OUR PORTFOLIO',
      secondaryButtonHref: '/projects',
    },
  };

  return <UnifiedServiceTemplate {...templateProps} />;
}
