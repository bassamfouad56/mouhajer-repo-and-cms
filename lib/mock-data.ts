/**
 * Mock Data for Mouhajer Website (Non-CMS Version)
 *
 * This file contains all mock data to replace WordPress CMS integration.
 * All types and data structures are defined here.
 *
 * NOTE: Real content from WordPress export is available in lib/real-content-data.ts
 */

import {
  realProjects,
  realServices,
  realIndustries,
  realPosts,
} from "./real-content-data";

// ============================================================================
// TYPES
// ============================================================================

export interface Image {
  sourceUrl: string;
  altText: string;
  mediaDetails?: {
    width: number;
    height: number;
  };
}

export interface FeaturedImage {
  node: Image;
}

export interface ACFFields {
  projectType?: string;
  location?: string;
  client?: string;
  yearCompleted?: string;
  projectArea?: string;
  projectBudget?: string;
  projectDescription?: string;
  gallery?: Image[];
  services?: Array<{ id: string; title: string; slug?: string }> | string[];
  challenges?: string;
  solutions?: string;
  results?: string;
  // Service fields
  serviceIcon?: string;
  shortDescription?: string;
  description?: string;
  serviceFeatures?: string[];
  processSteps?: Array<{
    title: string;
    description: string;
  }>;
  relatedProjects?: string[];
  relatedServices?: string[];
  pricingInfo?: string;
  stats?: {
    projectsCompleted?: number;
    clientsSatisfied?: number;
    yearsExperience?: number;
  };
  // Sanity project fields
  challenge?: string;
  approach?: string;
  outcome?: string;
  scopeOfWork?: Array<{ title: string; desc: string; icon?: unknown }>;
  testimonial?: string;
  testimonialAuthor?: string;
  awards?: boolean;
  area?: string;
  projectSize?: string;
  duration?: string;
  durationMonths?: string;
  projectDates?: string;
  status?: string;
  challengePoints?: string[];
  designApproach?: Array<{ icon?: unknown; title: string; desc: string }>;
  outcomes?: Array<{ value: string; label: string }>;
  videoUrl?: string;
  industries?: Array<{ id: string; title: string; slug?: string }>;
}

export interface Project {
  id: string;
  databaseId: number;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  date: string;
  modified: string;
  featuredImage?: FeaturedImage;
  acfFields?: ACFFields;
}

export interface Service {
  id: string;
  databaseId: number;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  date: string;
  modified: string;
  featuredImage?: FeaturedImage;
  acfFields?: ACFFields;
}

export type Industry = Service;

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

export interface Post {
  id: string;
  databaseId: number;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  date: string;
  modified: string;
  featuredImage?: FeaturedImage;
  categories?: {
    nodes: Category[];
  };
  tags?: {
    nodes: Category[];
  };
  author?: {
    node: {
      name: string;
      avatar?: {
        url: string;
      };
      description?: string;
    };
  };
  acfFields?: {
    readingTime?: string;
    featuredPost?: boolean;
  };
}

// ============================================================================
// MOCK DATA - PROJECTS
// ============================================================================

export const mockProjects: Project[] = [
  {
    id: "1",
    databaseId: 1,
    slug: "luxury-hotel-al-maha-desert-resort",
    title: "Luxury Hotel Al Maha Desert Resort",
    excerpt:
      "Award-winning luxury desert resort featuring 42 private suites with authentic Bedouin-inspired design and sustainable architecture.",
    content: `<h2>Project Vision</h2>
    <p>Al Maha Desert Resort represents the pinnacle of luxury hospitality design in the Arabian desert.</p>
    <h2>Design Approach</h2>
    <p>Drawing inspiration from traditional Bedouin architecture, we incorporated natural materials, earth tones, and flowing fabrics.</p>`,
    date: new Date("2024-01-15").toISOString(),
    modified: new Date("2024-01-15").toISOString(),
    featuredImage: {
      node: {
        sourceUrl:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80",
        altText: "Luxury Desert Resort",
      },
    },
    acfFields: {
      projectType: "Hospitality",
      location: "Dubai Desert Conservation Reserve, UAE",
      yearCompleted: "2024",
      client: "Al Maha Hotels & Resorts",
      projectArea: "15,000 sqm",
      projectDescription:
        "A transformative luxury hospitality project creating an authentic desert resort experience.",
      gallery: [
        {
          sourceUrl:
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
          altText: "Luxury Hotel Lobby",
        },
        {
          sourceUrl:
            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80",
          altText: "Desert View Suite",
        },
        {
          sourceUrl:
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80",
          altText: "Infinity Pool",
        },
        {
          sourceUrl:
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80",
          altText: "Fine Dining Restaurant",
        },
      ],
    },
  },
  {
    id: "2",
    databaseId: 2,
    slug: "downtown-dubai-penthouse",
    title: "Downtown Dubai Penthouse",
    excerpt:
      "Ultra-modern 800 sqm penthouse with panoramic Burj Khalifa views featuring bespoke design and smart home integration.",
    content: `<h2>Urban Luxury Redefined</h2>
    <p>This exclusive penthouse occupies the top two floors offering 360-degree views of the Burj Khalifa.</p>`,
    date: new Date("2024-02-20").toISOString(),
    modified: new Date("2024-02-20").toISOString(),
    featuredImage: {
      node: {
        sourceUrl:
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80",
        altText: "Luxury Penthouse",
      },
    },
    acfFields: {
      projectType: "Residential",
      location: "Downtown Dubai, UAE",
      yearCompleted: "2024",
      client: "Private Client",
      projectArea: "800 sqm",
      projectDescription:
        "A sophisticated penthouse transformation featuring premium Italian materials and smart home technology.",
      gallery: [
        {
          sourceUrl:
            "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80",
          altText: "Modern Living Room",
        },
        {
          sourceUrl:
            "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80",
          altText: "Custom Italian Kitchen",
        },
        {
          sourceUrl:
            "https://images.unsplash.com/photo-1615873968403-89e068629265?w=1200&q=80",
          altText: "Master Bedroom Suite",
        },
      ],
    },
  },
  {
    id: "3",
    databaseId: 3,
    slug: "difc-corporate-headquarters",
    title: "DIFC Corporate Headquarters",
    excerpt:
      "Modern 3,500 sqm corporate headquarters featuring activity-based design, biophilic elements, and LEED Platinum certification.",
    content: `<h2>Transforming Corporate Spaces</h2>
    <p>This flagship headquarters reimagines the modern workplace.</p>`,
    date: new Date("2023-11-10").toISOString(),
    modified: new Date("2023-11-10").toISOString(),
    featuredImage: {
      node: {
        sourceUrl:
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
        altText: "Corporate Office",
      },
    },
    acfFields: {
      projectType: "Commercial",
      location: "DIFC, Dubai",
      yearCompleted: "2023",
      client: "Leading Financial Services Firm",
      projectArea: "3,500 sqm",
      projectDescription:
        "A comprehensive corporate office transformation focusing on employee experience and sustainability.",
      gallery: [
        {
          sourceUrl:
            "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80",
          altText: "Open Plan Workspace",
        },
        {
          sourceUrl:
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80",
          altText: "Collaboration Zone",
        },
      ],
    },
  },
  {
    id: "4",
    databaseId: 4,
    slug: "palm-jumeirah-beach-villa",
    title: "Palm Jumeirah Beach Villa",
    excerpt:
      "1,200 sqm beachfront villa featuring seamless indoor-outdoor living with infinity pool and private beach access.",
    content: `<h2>Coastal Luxury Living</h2>
    <p>This spectacular beachfront villa offers unobstructed views of the Arabian Gulf.</p>`,
    date: new Date("2024-03-05").toISOString(),
    modified: new Date("2024-03-05").toISOString(),
    featuredImage: {
      node: {
        sourceUrl:
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80",
        altText: "Beach Villa",
      },
    },
    acfFields: {
      projectType: "Residential",
      location: "Palm Jumeirah, Dubai",
      yearCompleted: "2024",
      client: "Private Client",
      projectArea: "1,200 sqm",
      projectDescription:
        "A luxurious beachfront villa emphasizing indoor-outdoor living with marine-grade materials.",
      gallery: [
        {
          sourceUrl:
            "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80",
          altText: "Villa Living Room",
        },
        {
          sourceUrl:
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
          altText: "Infinity Pool",
        },
      ],
    },
  },
];

// ============================================================================
// MOCK DATA - INDUSTRIES/SERVICES
// ============================================================================

export const mockIndustries: Industry[] = [
  {
    id: "1",
    databaseId: 1,
    slug: "hospitality-hotels",
    title: "Hospitality & Hotels",
    excerpt:
      "Creating unforgettable guest experiences through exceptional hotel and resort design.",
    content: `
      <h2>Transforming Guest Experiences</h2>
      <p>Our hospitality design services transform hotels, resorts, and restaurants into destinations that guests remember long after they check out. We understand that every touchpoint matters in creating exceptional hospitality experiences.</p>
      <h3>Our Approach</h3>
      <p>We blend cultural authenticity with contemporary luxury, creating spaces that tell a story while meeting the highest operational standards. From boutique hotels to large-scale resorts, our designs balance aesthetics with functionality.</p>
    `,
    date: new Date().toISOString(),
    modified: new Date().toISOString(),
    featuredImage: {
      node: {
        sourceUrl:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80",
        altText: "Hospitality Design",
      },
    },
    acfFields: {
      shortDescription:
        "Transform hotels and resorts into memorable destinations",
      description:
        "Specialized in luxury hospitality design including hotels, resorts, restaurants, and wellness facilities.",
      serviceFeatures: [
        "Guest experience optimization",
        "Brand-aligned design concepts",
        "Sustainable hospitality solutions",
        "F&B and restaurant design",
        "Spa and wellness facilities",
        "Lobby and public space design",
      ],
      stats: {
        projectsCompleted: 45,
        yearsExperience: 12,
        clientsSatisfied: 98,
      },
    },
  },
  {
    id: "2",
    databaseId: 2,
    slug: "residential-luxury",
    title: "Residential Luxury",
    excerpt:
      "Bespoke luxury residential design creating sophisticated homes that reflect your unique lifestyle.",
    content: `
      <h2>Your Home, Your Story</h2>
      <p>Creating bespoke residential interiors for discerning clients who demand excellence. Every home tells a story, and we craft spaces that reflect your personality, lifestyle, and aspirations.</p>
      <h3>Personalized Design</h3>
      <p>From palatial villas to urban penthouses, we approach each project as a unique opportunity to create something extraordinary. Our designs seamlessly blend luxury with livability, creating homes that are both beautiful and functional.</p>
    `,
    date: new Date().toISOString(),
    modified: new Date().toISOString(),
    featuredImage: {
      node: {
        sourceUrl:
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80",
        altText: "Residential Luxury",
      },
    },
    acfFields: {
      shortDescription: "Personalized luxury living spaces",
      description:
        "Creating bespoke residential interiors for discerning clients who demand excellence.",
      serviceFeatures: [
        "Fully customized designs",
        "Premium materials and finishes",
        "Smart home technology integration",
        "Bespoke furniture and fixtures",
        "Landscape and outdoor design",
        "Home automation systems",
      ],
      stats: {
        projectsCompleted: 120,
        yearsExperience: 15,
        clientsSatisfied: 99,
      },
    },
  },
  {
    id: "3",
    databaseId: 3,
    slug: "commercial-office",
    title: "Commercial & Office",
    excerpt:
      "Innovative office design creating productive environments that inspire teams.",
    content: `
      <h2>Designing for Success</h2>
      <p>Designing productive workspaces that inspire innovation and collaboration. The modern workplace is more than just desks and meeting rooms it&apos;s a strategic tool for attracting talent and driving business success.</p>
      <h3>Future-Ready Workspaces</h3>
      <p>We create flexible, adaptive environments that support diverse working styles while reinforcing your brand identity and company culture. Our designs prioritize employee wellbeing, sustainability, and technological integration.</p>
    `,
    date: new Date().toISOString(),
    modified: new Date().toISOString(),
    featuredImage: {
      node: {
        sourceUrl:
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
        altText: "Commercial Office",
      },
    },
    acfFields: {
      shortDescription: "Inspiring workspaces for modern businesses",
      description:
        "Commercial interior design that balances productivity, aesthetics, and employee wellbeing.",
      serviceFeatures: [
        "Activity-based design",
        "Collaborative spaces",
        "Brand integration",
        "Sustainable workplace solutions",
        "Flexible workspace layouts",
        "Biophilic design elements",
      ],
      stats: {
        projectsCompleted: 85,
        yearsExperience: 10,
        clientsSatisfied: 96,
      },
    },
  },
  {
    id: "4",
    databaseId: 4,
    slug: "retail-spaces",
    title: "Retail Spaces",
    excerpt:
      "Innovative retail design that creates engaging shopping experiences and drives sales.",
    content: `
      <h2>Retail That Inspires</h2>
      <p>We design retail environments that captivate customers and create memorable brand experiences. In an era of online shopping, physical stores must offer something special to draw customers in.</p>
      <h3>Strategic Retail Design</h3>
      <p>Our approach combines visual merchandising expertise with strategic space planning to maximize both aesthetic impact and commercial performance. We create destinations that customers want to visit, explore, and return to.</p>
    `,
    date: new Date().toISOString(),
    modified: new Date().toISOString(),
    featuredImage: {
      node: {
        sourceUrl:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80",
        altText: "Retail Design",
      },
    },
    acfFields: {
      shortDescription: "Engaging retail environments that drive sales",
      description:
        "Creating innovative retail spaces that combine brand storytelling with commercial effectiveness.",
      serviceFeatures: [
        "Customer journey optimization",
        "Visual merchandising strategy",
        "Brand experience design",
        "Store layout planning",
        "Flagship store concepts",
        "Pop-up and temporary installations",
      ],
      stats: {
        projectsCompleted: 60,
        yearsExperience: 8,
        clientsSatisfied: 94,
      },
    },
  },
];

export const mockServices: Service[] = [
  {
    id: "S1",
    databaseId: 101,
    slug: "interior-design",
    title: "Interior Design",
    excerpt:
      "Comprehensive interior design services from concept to completion, creating spaces that inspire and delight.",
    content: `
      <h2>Design Excellence</h2>
      <p>Our interior design services encompass every aspect of creating beautiful, functional spaces. We work closely with you from initial concept through to final installation, ensuring every detail is perfect.</p>
      <h3>Our Design Philosophy</h3>
      <p>We believe great design balances aesthetics with functionality, creating spaces that not only look stunning but also enhance the way you live or work. Our team brings expertise in multiple design styles, from contemporary minimalism to classic luxury.</p>
    `,
    date: new Date().toISOString(),
    modified: new Date().toISOString(),
    featuredImage: {
      node: {
        sourceUrl:
          "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80",
        altText: "Interior Design",
      },
    },
    acfFields: {
      shortDescription: "Complete interior design from concept to completion",
      description:
        "Full-service interior design creating beautiful, functional spaces tailored to your needs.",
      serviceFeatures: [
        "Concept development and mood boards",
        "Space planning and layout design",
        "Material and finish selection",
        "Custom color palettes",
        "Furniture specification",
        "3D visualization and renderings",
      ],
      processSteps: [
        {
          title: "Discovery & Consultation",
          description:
            "We begin by understanding your vision, lifestyle, and requirements through in-depth consultations and site analysis.",
        },
        {
          title: "Concept Development",
          description:
            "Our team creates initial design concepts, mood boards, and spatial layouts that capture your vision.",
        },
        {
          title: "Design Development",
          description:
            "We refine the chosen concept, selecting materials, finishes, furniture, and fixtures to bring the design to life.",
        },
        {
          title: "Implementation",
          description:
            "We oversee the entire installation process, coordinating with contractors and suppliers to ensure flawless execution.",
        },
      ],
      stats: {
        projectsCompleted: 200,
        yearsExperience: 15,
        clientsSatisfied: 98,
      },
    },
  },
  {
    id: "S2",
    databaseId: 102,
    slug: "space-planning",
    title: "Space Planning",
    excerpt:
      "Strategic space planning services optimizing layout and flow for maximum functionality and efficiency.",
    content: `
      <h2>Maximize Your Space</h2>
      <p>Strategic space planning is the foundation of great interior design. We analyze how spaces are used and create layouts that optimize circulation, functionality, and user experience.</p>
      <h3>Data-Driven Design</h3>
      <p>Using advanced tools and our extensive experience, we create space plans that maximize every square meter while creating harmonious, well-proportioned environments.</p>
    `,
    date: new Date().toISOString(),
    modified: new Date().toISOString(),
    featuredImage: {
      node: {
        sourceUrl:
          "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80",
        altText: "Space Planning",
      },
    },
    acfFields: {
      shortDescription: "Optimize layouts for functionality and flow",
      description:
        "Professional space planning services to maximize the potential of every area.",
      serviceFeatures: [
        "Functional layout design",
        "Traffic flow optimization",
        "Zoning and area planning",
        "Ergonomic considerations",
        "Accessibility compliance",
        "Furniture arrangement studies",
      ],
      processSteps: [
        {
          title: "Site Analysis",
          description:
            "We conduct thorough measurements and assess existing conditions, constraints, and opportunities.",
        },
        {
          title: "Needs Assessment",
          description:
            "Understanding how the space will be used and by whom, including activity mapping and user requirements.",
        },
        {
          title: "Layout Development",
          description:
            "Creating multiple layout options with detailed floor plans showing furniture placement and circulation paths.",
        },
        {
          title: "Refinement & Documentation",
          description:
            "Finalizing the optimal layout and producing detailed drawings for implementation.",
        },
      ],
      stats: {
        projectsCompleted: 150,
        yearsExperience: 12,
        clientsSatisfied: 97,
      },
    },
  },
  {
    id: "S3",
    databaseId: 103,
    slug: "custom-furniture",
    title: "Custom Furniture",
    excerpt:
      "Bespoke furniture design and fabrication creating unique pieces perfectly tailored to your space.",
    content: `
      <h2>Furniture as Art</h2>
      <p>Our custom furniture service creates one-of-a-kind pieces designed specifically for your space. From concept sketches to final fabrication, we craft furniture that is both beautiful and perfectly suited to your needs.</p>
      <h3>Craftsmanship & Quality</h3>
      <p>Working with master craftsmen and premium materials, we produce furniture that becomes the centerpiece of your interior while meeting the highest standards of quality and durability.</p>
    `,
    date: new Date().toISOString(),
    modified: new Date().toISOString(),
    featuredImage: {
      node: {
        sourceUrl:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80",
        altText: "Custom Furniture",
      },
    },
    acfFields: {
      shortDescription: "Bespoke furniture pieces for unique spaces",
      description:
        "Custom-designed and handcrafted furniture tailored to your exact specifications.",
      serviceFeatures: [
        "Original furniture design",
        "Custom joinery and millwork",
        "Material and finish selection",
        "Prototype development",
        "Quality craftsmanship",
        "Installation and placement",
      ],
      processSteps: [
        {
          title: "Design Brief",
          description:
            "We discuss your requirements, style preferences, and functional needs for the custom piece.",
        },
        {
          title: "Concept & Sketches",
          description:
            "Our designers create initial sketches and 3D models showing the proposed design.",
        },
        {
          title: "Material Selection",
          description:
            "Together we select premium materials, finishes, and hardware that align with your vision.",
        },
        {
          title: "Fabrication & Installation",
          description:
            "Master craftsmen build your furniture to exacting standards, then we install it perfectly in your space.",
        },
      ],
      stats: {
        projectsCompleted: 180,
        yearsExperience: 14,
        clientsSatisfied: 99,
      },
    },
  },
  {
    id: "S4",
    databaseId: 104,
    slug: "lighting-design",
    title: "Lighting Design",
    excerpt:
      "Sophisticated lighting design creating ambiance, enhancing architecture, and improving functionality.",
    content: `
      <h2>The Power of Light</h2>
      <p>Lighting transforms spaces, influences mood, and highlights architectural features. Our lighting design service creates layered lighting schemes that are both beautiful and practical.</p>
      <h3>Technical Expertise</h3>
      <p>We combine artistic vision with technical knowledge of lighting technology, ensuring optimal illumination levels while creating the desired atmosphere.</p>
    `,
    date: new Date().toISOString(),
    modified: new Date().toISOString(),
    featuredImage: {
      node: {
        sourceUrl:
          "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1600&q=80",
        altText: "Lighting Design",
      },
    },
    acfFields: {
      shortDescription: "Create atmosphere through expert lighting",
      description:
        "Professional lighting design services combining aesthetics with technical precision.",
      serviceFeatures: [
        "Layered lighting schemes",
        "Custom fixture design",
        "Natural light optimization",
        "Energy-efficient solutions",
        "Smart lighting integration",
        "Lighting control systems",
      ],
      processSteps: [
        {
          title: "Lighting Analysis",
          description:
            "We assess natural light patterns, spatial requirements, and functional needs for each area.",
        },
        {
          title: "Design Strategy",
          description:
            "Developing a comprehensive lighting plan incorporating ambient, task, and accent lighting.",
        },
        {
          title: "Fixture Selection",
          description:
            "Specifying fixtures that complement the design while meeting technical requirements.",
        },
        {
          title: "Programming & Testing",
          description:
            "Setting up lighting scenes and controls, then fine-tuning levels for perfect results.",
        },
      ],
      stats: {
        projectsCompleted: 165,
        yearsExperience: 11,
        clientsSatisfied: 96,
      },
    },
  },
];

// ============================================================================
// MOCK DATA - BLOG POSTS
// ============================================================================

export const mockPosts: Post[] = [
  {
    id: "1",
    databaseId: 1,
    slug: "evolution-modern-interior-design",
    title: "The Evolution of Modern Interior Design",
    excerpt:
      "<p>Explore how interior design has transformed over the decades.</p>",
    content: `<h2>The Minimalist Movement</h2>
    <p>The mid-20th century saw the rise of minimalism.</p>`,
    date: new Date("2024-01-10").toISOString(),
    modified: new Date("2024-01-10").toISOString(),
    featuredImage: {
      node: {
        sourceUrl:
          "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
        altText: "Modern Interior Design",
      },
    },
    categories: {
      nodes: [{ id: "1", name: "Design Trends", slug: "design-trends" }],
    },
    tags: {
      nodes: [
        { id: "1", name: "Minimalism", slug: "minimalism" },
        { id: "2", name: "Modern Design", slug: "modern-design" },
      ],
    },
    author: {
      node: {
        name: "Sarah Johnson",
        description: "Senior Interior Designer with 15 years of experience.",
      },
    },
  },
];

// ============================================================================
// MOCK DATA FUNCTIONS
// ============================================================================

export async function getProjects(_locale: string = "en"): Promise<Project[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  // Use real projects from WordPress export (29 projects)
  return realProjects as any as Project[];
}

export async function getProjectBySlug(
  slug: string,
  _locale: string = "en"
): Promise<Project | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  // Use real projects from WordPress export
  return (realProjects as any).find((p: any) => p.slug === slug) || null;
}

export async function getServices(_locale: string = "en"): Promise<Service[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  // Use real services from WordPress export (12 services)
  return realServices as any as Service[];
}

export async function getServiceBySlug(
  slug: string,
  _locale: string = "en"
): Promise<Service | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  // Use real services from WordPress export
  return (realServices as any).find((s: any) => s.slug === slug) || null;
}

export async function getIndustries(
  _locale: string = "en"
): Promise<Industry[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  // Use real industries data
  return realIndustries as any as Industry[];
}

export async function getPosts(_locale: string = "en"): Promise<Post[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  // Use real posts (can be expanded with more blog content)
  return realPosts as any as Post[];
}

export async function getPostBySlug(
  slug: string,
  _locale: string = "en"
): Promise<Post | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  // Use real posts
  return (realPosts as any).find((p: any) => p.slug === slug) || null;
}

export async function getCategories(
  _locale: string = "en"
): Promise<Category[]> {
  return [
    { id: "1", name: "Design Trends", slug: "design-trends", count: 5 },
    { id: "2", name: "Tips & Guides", slug: "tips-guides", count: 3 },
  ];
}
