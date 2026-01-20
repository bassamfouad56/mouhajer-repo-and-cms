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

interface MEPEngineeringContentProps {
  projects?: Project[];
  heroImage?: string | null;
  caseStudyProject?: Project | null;
}

// Local capability images from public folder - mapped to capability titles
const CAPABILITY_IMAGES = {
  hvacSystems: '/services/inside MEP engineering/HVAC Systems/Efficient-HVAC-System-scaled-e1643831703361.jpg',
  electricalLighting: '/services/inside MEP engineering/Electrical & Lighting Engineering/_MID5317.jpg',
  plumbingFirefighting: '/services/inside MEP engineering/Plumbing & Firefighting/pipe-2025-03-31-17-59-30-utc.jpg',
  smartHome: '/services/inside MEP engineering/The invisible art/cover.jpg',
  caseStudy: '/services/inside MEP engineering/engineer your asset/_MID5275.jpg',
  hero: '/services/MEP Engineering/_MID5351.jpg',
};

export default function MEPEngineeringContent({
  projects = [],
  heroImage,
  caseStudyProject,
}: MEPEngineeringContentProps) {

  // MEP Engineering specific content configuration
  const templateProps: UnifiedServiceTemplateProps = {
    projects,
    heroImage: heroImage || CAPABILITY_IMAGES.hero,
    caseStudyProject,
    serviceSlug: 'mep-engineering',

    hero: {
      label: 'MEP Engineering',
      title: 'The',
      titleHighlight: 'Invisible Art.',
      subtitle: 'Perfect comfort. Zero noise. Absolute efficiency. The systems you don\'t see are just as important as the ones you do.',
    },

    immersiveSection: {
      label: 'We Do Not Outsource Critical Systems',
      title: 'In-House',
      titleHighlight: 'Engineering.',
      subtitle: 'We maintain a dedicated in-house MEP Division with over 30 specialized engineers. Because a beautiful ceiling is ruined if the AC vent is placed incorrectly.',
      images: [
        CAPABILITY_IMAGES.hvacSystems,
        CAPABILITY_IMAGES.electricalLighting,
        CAPABILITY_IMAGES.plumbingFirefighting,
        CAPABILITY_IMAGES.smartHome,
      ],
      capabilities: [
        {
          title: 'HVAC Systems',
          subtitle: 'Climate Control',
          description: 'We calculate the precise cooling load for every room to ensure it stays at 21°C even in the August heat. Linear slot diffusers and hidden vents disappear into the joinery.',
          methodology: 'Noise Control',
          methodDesc: 'Feel the cool air, not hear it.',
        },
        {
          title: 'Electrical & Lighting',
          subtitle: 'Power & Illumination',
          description: 'Robust power distribution boards that handle the heavy load of a modern luxury mansion without tripping. Smart home automation cabling during construction phase.',
          methodology: 'Lux Calculation',
          methodDesc: 'Perfect lighting in every corner.',
        },
        {
          title: 'Plumbing & Firefighting',
          subtitle: 'Water Systems',
          description: 'High-pressure pumps and filtration systems ensure hotel-quality showers in private residences. Civil Defence compliant firefighting systems.',
          methodology: 'Safety First',
          methodDesc: 'Strict Civil Defence compliance.',
        },
        {
          title: 'Smart Home Integration',
          subtitle: 'Automation',
          description: 'We plan the cabling infrastructure for full home automation (KNX/Lutron) during construction. Control lights, curtains, and AC from your phone.',
          methodology: 'Future-Ready',
          methodDesc: 'No visible wires.',
        },
      ],
    },

    caseStudy: {
      title: 'Park Hyatt Dubai Creek',
      titleHighlight: '— 24 Villas',
      client: 'Park Hyatt',
      scope: 'Retrofitting modern cooling systems into heritage villa structures.',
      challenge: 'Installing modern, energy-efficient systems without damaging the heritage aesthetic or expanding ceiling voids.',
      outcome: '24 villas transformed with state-of-the-art climate control, zero visual impact on the original design intent.',
      image: CAPABILITY_IMAGES.caseStudy,
    },

    faqSection: {
      label: 'Expert Insights',
      title: 'Engineering',
      titleHighlight: 'Questions',
      subtitle: 'Common questions about our MEP engineering process',
      faqs: [
        {
          question: 'Why is "In-House" MEP better than outsourcing?',
          answer: 'Coordination. When MEP is outsourced, you often end up with air conditioning units clashing with chandeliers or access panels ruining a beautiful ceiling. Because our MEP engineers sit next to our designers, we route the ducting around the design. The result is a system that is invisible and silent.',
        },
        {
          question: 'Can you integrate Smart Home systems?',
          answer: 'Yes. We specialize in Home Automation (KNX, Lutron, Crestron). We plan the cabling infrastructure during the shell-and-core phase. This allows you to control your lighting, climate, curtains, and security from a single tablet or phone, with no visible wires.',
        },
        {
          question: 'Do you do MEP for renovations?',
          answer: 'Absolutely. This is our specialty. For projects like the Sheraton Abu Dhabi, we surveyed the 30-year-old existing infrastructure and retrofitted modern, energy-efficient systems without damaging the heritage structure of the building.',
        },
      ],
    },

    cta: {
      label: 'Start Your Project',
      title: 'Engineer',
      titleHighlight: 'Your Asset.',
      primaryButtonText: 'DISCUSS YOUR PROJECT',
      primaryButtonHref: '/contact',
      secondaryButtonText: 'VIEW OUR WORK',
      secondaryButtonHref: '/projects',
    },
  };

  return <UnifiedServiceTemplate {...templateProps} />;
}
