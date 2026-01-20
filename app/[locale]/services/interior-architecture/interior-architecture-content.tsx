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

interface InteriorArchitectureContentProps {
  projects?: Project[];
  heroImage?: string | null;
  caseStudyProject?: Project | null;
}

// Local capability images from public folder - mapped to capability titles
const CAPABILITY_IMAGES = {
  conceptualDesign: '/services/inside interior architecture/Conceptual Design & Narrative/_MID0183-HDR.jpg',
  visualization3D: '/services/inside interior architecture/3D Visualization/Main Villa 3D_Page_22.jpg',
  technicalDocumentation: '/services/inside interior architecture/The Uncluttered Baroque/_MID0166-HDR.jpg',
  materialSelection: '/services/inside interior architecture/Visualize Your Future/2.jpg',
  caseStudy: '/services/interior architecture/_MIDnf71-HDR.jpg',
};

export default function InteriorArchitectureContent({
  projects = [],
  heroImage,
  caseStudyProject,
}: InteriorArchitectureContentProps) {

  // Interior Architecture specific content configuration
  const templateProps: UnifiedServiceTemplateProps = {
    projects,
    heroImage: heroImage || '/services/interior architecture/_MIDnf71-HDR.jpg',
    caseStudyProject,
    serviceSlug: 'interior-architecture',

    hero: {
      label: 'Interior Architecture',
      title: 'The "Uncluttered',
      titleHighlight: 'Baroque"',
      subtitle: 'Where Arabic grandeur meets European architectural discipline.',
    },

    immersiveSection: {
      label: 'The Science Behind the Style',
      title: 'We Do Not',
      titleHighlight: 'Decorate.',
      subtitle: 'We analyze volumes. We align symmetry. We manipulate light. Our signature style takes the richness of Arabic heritage and applies the strict discipline of British architecture.',
      images: [
        CAPABILITY_IMAGES.conceptualDesign,
        CAPABILITY_IMAGES.visualization3D,
        CAPABILITY_IMAGES.technicalDocumentation,
        CAPABILITY_IMAGES.materialSelection,
      ],
      capabilities: [
        {
          title: 'Conceptual Design',
          subtitle: 'The Story',
          description: 'We define the emotion of the space. Is it a powerful corporate HQ? Or a serene sanctuary in Jumeirah Bay? Every project starts with a narrative.',
          methodology: 'Space Planning',
          methodDesc: 'Hidden service routes, private zones.',
        },
        {
          title: '3D Visualization',
          subtitle: 'The Digital Twin',
          description: 'Cinema-quality 3D visuals that show you exactly how your project will look. See the vein of the marble and the reflection in the mirror before we buy a single item.',
          methodology: 'Virtual Reality',
          methodDesc: 'Walk through your future space.',
        },
        {
          title: 'Technical Documentation',
          subtitle: 'Buildability',
          description: 'Because our designers sit alongside our construction team, every design is validated for feasibility. We never draw a floating staircase that cannot be supported.',
          methodology: 'Precision',
          methodDesc: 'Thousands of technical drawings.',
        },
        {
          title: 'Material Selection',
          subtitle: 'Curated Excellence',
          description: 'We source from the world\'s finest quarries and mills. Italian marble, French oak, Swiss engineered surfaces — every material tells a story.',
          methodology: 'Global Sourcing',
          methodDesc: 'Direct relationships with suppliers.',
        },
      ],
    },

    caseStudy: {
      title: 'Award-Winning',
      titleHighlight: 'Excellence',
      client: 'International Property Awards',
      scope: 'Best Hotel Suite Interior (Arabia), Best Residential Apartment (Dubai), Best Luxury Hotel Interior (Dubai)',
      outcome: 'Our design studio is the recipient of the region\'s highest honors. These awards validate our approach: great design is about solving problems with elegance and precision.',
      image: CAPABILITY_IMAGES.caseStudy,
    },

    faqSection: {
      label: 'Expert Insights',
      title: 'Design',
      titleHighlight: 'Questions',
      subtitle: 'Common questions about our interior architecture process',
      faqs: [
        {
          question: 'Do I need to hire a separate architect?',
          answer: 'No. Our Design Studio is a fully integrated architectural practice. We handle the spatial planning, the interior architecture (walls/ceilings), and the decoration. This single-point responsibility prevents the common conflict where the "Decorator" draws something the "Architect" says is impossible.',
        },
        {
          question: 'Can you work with my existing architect?',
          answer: 'Yes. We often act as the Executive Designer or Main Contractor alongside international "Concept Architects." We take their visual concept and produce the technical shop drawings required to build it in the UAE, ensuring it complies with local regulations while keeping the original aesthetic intact.',
        },
        {
          question: 'How do you visualize the design before construction?',
          answer: 'We use high-fidelity 3D rendering and Virtual Reality (VR). We build the room digitally first. This allows you to stand in your future Majlis or Lobby and approve every detail, from the marble vein to the curtain fabric, before we order a single item.',
        },
      ],
    },

    cta: {
      label: 'Start Your Project',
      title: 'Visualize',
      titleHighlight: 'Your Future.',
      primaryButtonText: 'DISCUSS YOUR VISION',
      primaryButtonHref: '/contact',
      secondaryButtonText: 'VIEW OUR PORTFOLIO',
      secondaryButtonHref: '/projects',
    },
  };

  return <UnifiedServiceTemplate {...templateProps} />;
}
