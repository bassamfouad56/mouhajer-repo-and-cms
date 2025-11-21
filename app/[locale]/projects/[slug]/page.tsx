import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getProjectBySlug, getProjects, Project } from '@/lib/wordpress';
import { EnhancedProjectPageClient } from './enhanced-project-page';

// Placeholder projects for development
function getPlaceholderProjects(): Project[] {
  return [
    {
      id: '1',
      databaseId: 1,
      title: 'Sheraton Abu Dhabi Hotel & Resort',
      slug: 'sheraton-abu-dhabi-hotel-resort',
      excerpt: 'A luxurious beachfront resort featuring contemporary elegance and world-class amenities',
      date: new Date().toISOString(),
      modified: new Date().toISOString(),
      content: `
        <h2>Project Vision</h2>
        <p>The Sheraton Abu Dhabi Hotel & Resort represents the pinnacle of luxury hospitality design. Our vision was to create a space that seamlessly blends modern sophistication with the rich cultural heritage of the UAE, providing guests with an unforgettable experience from the moment they arrive.</p>

        <h2>Design Philosophy</h2>
        <p>Our approach centered on creating flowing, open spaces that maximize natural light and stunning views of the Arabian Gulf. We incorporated local materials and craftsmanship while maintaining the international standards expected from the Sheraton brand.</p>

        <h2>Key Features</h2>
        <ul>
          <li>350+ luxury guest rooms and suites with gulf views</li>
          <li>Multiple award-winning restaurants and lounges</li>
          <li>State-of-the-art spa and wellness facilities</li>
          <li>Infinity pools overlooking the Arabian Gulf</li>
          <li>Grand ballroom for events and conferences</li>
          <li>Private beach with premium amenities</li>
        </ul>

        <h2>Material Selection</h2>
        <p>We carefully selected premium materials that would withstand the coastal environment while maintaining their luxury appeal. Italian marble, custom-woven carpets, handcrafted wood panels, and bespoke lighting fixtures create an atmosphere of refined elegance throughout the property.</p>

        <h2>Challenges & Solutions</h2>
        <p>Working in a beachfront environment presented unique challenges, from salt air exposure to high temperatures. We addressed these through innovative material selection, climate control systems, and protective treatments that ensure longevity without compromising aesthetics.</p>

        <h2>Results</h2>
        <p>The completed resort has become a landmark destination in Abu Dhabi, winning multiple hospitality design awards and maintaining exceptional guest satisfaction ratings since its opening.</p>
      `,
      featuredImage: {
        node: {
          sourceUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80',
          altText: 'Sheraton Abu Dhabi Hotel & Resort',
        },
      },
      acfFields: {
        projectType: 'Hospitality',
        location: 'Abu Dhabi, UAE',
        yearCompleted: '2023',
        projectDescription: 'A transformative hospitality project spanning 50,000 square meters of luxury resort design. The Sheraton Abu Dhabi combines world-class amenities with stunning architectural design, creating a premier destination for international travelers seeking the ultimate in beachfront luxury.',
        gallery: [
          {
            sourceUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80',
            altText: 'Luxury Hotel Lobby',
          },
          {
            sourceUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80',
            altText: 'Hotel Room Interior',
          },
          {
            sourceUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80',
            altText: 'Resort Pool Area',
          },
          {
            sourceUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80',
            altText: 'Hotel Restaurant',
          },
        ],
      },
    },
    {
      id: '2',
      databaseId: 2,
      title: 'Downtown Luxury Penthouse',
      slug: 'downtown-luxury-penthouse',
      excerpt: 'Ultra-modern penthouse with panoramic city views',
      date: new Date(Date.now() - 86400000 * 3).toISOString(),
      modified: new Date(Date.now() - 86400000 * 3).toISOString(),
      content: `
        <h2>Project Overview</h2>
        <p>This exclusive penthouse represents the height of urban luxury living, occupying the top two floors of a prestigious downtown tower with 360-degree views of the city skyline.</p>

        <h2>Design Concept</h2>
        <p>The design philosophy centered on creating an elevated living experience that celebrates both privacy and connection to the urban landscape. Floor-to-ceiling windows, an open-concept layout, and premium finishes throughout create a sophisticated sanctuary in the sky.</p>

        <h2>Special Features</h2>
        <ul>
          <li>Private rooftop terrace with infinity pool</li>
          <li>Custom home automation system</li>
          <li>Wine cellar and tasting room</li>
          <li>Home theater with premium acoustics</li>
          <li>Master suite with spa-like bathroom</li>
          <li>Chef's kitchen with professional appliances</li>
        </ul>

        <h2>Materials & Finishes</h2>
        <p>We incorporated the finest materials available: Calacatta marble, European oak flooring, custom bronze fixtures, and handcrafted Italian furniture. Every surface was carefully considered to create a cohesive, luxurious aesthetic.</p>
      `,
      featuredImage: {
        node: {
          sourceUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80',
          altText: 'Luxury Penthouse',
        },
      },
      acfFields: {
        projectType: 'Residential',
        location: 'Dubai, UAE',
        yearCompleted: '2024',
        projectDescription: 'An 800-square-meter penthouse transformation featuring bespoke design elements, smart home integration, and unparalleled attention to detail.',
        gallery: [
          {
            sourceUrl: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80',
            altText: 'Modern Living Room',
          },
          {
            sourceUrl: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80',
            altText: 'Luxury Kitchen',
          },
        ],
      },
    },
    {
      id: '3',
      databaseId: 3,
      title: 'Corporate Headquarters Redesign',
      slug: 'corporate-headquarters-redesign',
      excerpt: 'Modern workspace design fostering collaboration and innovation',
      date: new Date(Date.now() - 86400000 * 7).toISOString(),
      modified: new Date(Date.now() - 86400000 * 7).toISOString(),
      content: `
        <h2>Transformation Vision</h2>
        <p>This corporate headquarters redesign transformed traditional office spaces into a dynamic, collaborative environment that reflects the company's innovative culture and commitment to employee wellbeing.</p>

        <h2>Workspace Innovation</h2>
        <p>We created diverse work zones including collaborative areas, quiet focus spaces, informal meeting lounges, and recreational zones. The design encourages movement and interaction while providing flexibility for different work styles.</p>

        <h2>Design Highlights</h2>
        <ul>
          <li>Open-plan workspace with acoustic solutions</li>
          <li>Multi-functional collaboration zones</li>
          <li>Wellness-focused amenities</li>
          <li>Sustainable materials and systems</li>
          <li>Integrated technology infrastructure</li>
        </ul>
      `,
      featuredImage: {
        node: {
          sourceUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80',
          altText: 'Corporate Office',
        },
      },
      acfFields: {
        projectType: 'Commercial',
        location: 'DIFC, Dubai',
        yearCompleted: '2023',
        projectDescription: 'A complete reimagining of 3,000 square meters of corporate office space, focusing on employee experience, sustainability, and brand expression.',
        gallery: [
          {
            sourceUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80',
            altText: 'Modern Office Space',
          },
        ],
      },
    },
  ];
}

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  let project = await getProjectBySlug(slug);

  if (!project) {
    const placeholderProjects = getPlaceholderProjects();
    project = placeholderProjects.find(p => p.slug === slug) || null;
  }

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  const description = project.excerpt?.replace(/<[^>]*>/g, '').substring(0, 160) || '';

  return {
    title: `${project.title} | Mouhajer Design Studio`,
    description,
    openGraph: {
      title: project.title,
      description,
      images: project.featuredImage?.node?.sourceUrl
        ? [{ url: project.featuredImage.node.sourceUrl }]
        : [],
      type: 'article',
    },
  };
}

export async function generateStaticParams() {
  try {
    const projects = await getProjects();

    if (projects.length === 0) {
      return [
        { slug: 'sheraton-abu-dhabi-hotel-resort' },
        { slug: 'downtown-luxury-penthouse' },
        { slug: 'corporate-headquarters-redesign' },
      ];
    }

    return projects.map((project) => ({
      slug: project.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [
      { slug: 'sheraton-abu-dhabi-hotel-resort' },
      { slug: 'downtown-luxury-penthouse' },
      { slug: 'corporate-headquarters-redesign' },
    ];
  }
}

export const dynamicParams = true;

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  let project = await getProjectBySlug(slug);
  let allProjects = await getProjects();

  if (!project || allProjects.length === 0) {
    const placeholderProjects = getPlaceholderProjects();
    if (!project) {
      project = placeholderProjects.find(p => p.slug === slug) || null;
    }
    if (allProjects.length === 0) {
      allProjects = placeholderProjects;
    }
  }

  if (!project) {
    notFound();
  }

  // Find related projects (same type/category)
  const relatedProjects = allProjects
    .filter(
      (p) =>
        p.id !== project.id &&
        p.acfFields?.projectType === project.acfFields?.projectType
    )
    .slice(0, 3);

  return (
    <>
      <Header />
      <EnhancedProjectPageClient
        project={project}
        relatedProjects={relatedProjects}
        allProjects={allProjects}
      />
      <Footer />
    </>
  );
}
