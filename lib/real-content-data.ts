import projectsData from '../exported-content/projects.json';
import servicesData from '../exported-content/services.json';

// Helper to convert WordPress HTML to plain text for excerpts
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
}

// Helper to extract image URL from WordPress data
function getImageUrl(project: any): string {
  if (project.featuredImageLocal) {
    // Convert local path to public URL path
    const filename = project.featuredImageLocal.split('/').pop();
    return `/images/${filename}`;
  }
  return project.featuredImage?.node?.sourceUrl || '/images/placeholder.jpg';
}

// Transform projects from WordPress export format
export const realProjects = projectsData.map((project) => ({
  id: project.databaseId.toString(),
  slug: project.slug,
  title: project.title,
  excerpt: stripHtml(project.excerpt || '').substring(0, 200),
  content: project.content,
  category: 'commercial', // Default, can be enhanced based on content
  location: 'Dubai, UAE', // Default
  year: new Date(project.date).getFullYear().toString(),
  client: project.title.split(' ')[0] || 'Confidential',
  featuredImage: {
    url: getImageUrl(project),
    alt: project.title,
  },
  gallery: [
    {
      url: getImageUrl(project),
      alt: project.title,
    },
  ],
  services: ['Interior Design', 'Project Management'],
  industries: ['Commercial'],
  seo: {
    metaTitle: project.title + ' | Mouhajer International Design',
    metaDescription: stripHtml(project.excerpt || '').substring(0, 160),
    keywords: [project.title, 'interior design', 'Dubai', 'luxury design'],
  },
  date: project.date,
}));

// Icon mapping for services
const serviceIconMap: { [key: string]: string } = {
  'fb-restaurants': 'Utensils',
  'healthcare-wellness-2': 'Heart',
  'retail-showrooms-2': 'ShoppingBag',
  'commercial-office-2': 'Building2',
  'residential-luxury-2': 'Home',
  'hospitality-hotels-2': 'Hotel',
  '3d-visualization': 'Box',
  'turnkey-solutions': 'Package',
  'project-management': 'Briefcase',
  'custom-furniture': 'Sofa',
  'architecture': 'Building',
  'interior-design': 'Palette',
};

// Service features mapping
const serviceFeatures: { [key: string]: Array<{ title: string; description: string }> } = {
  'fb-restaurants': [
    { title: 'Fine Dining Concepts', description: 'Sophisticated restaurant environments' },
    { title: 'Casual Dining', description: 'Comfortable and inviting atmospheres' },
    { title: 'Bar & Lounge Design', description: 'Social spaces with character' },
    { title: 'Kitchen Planning', description: 'Efficient workflow design' },
  ],
  'healthcare-wellness-2': [
    { title: 'Medical Clinics', description: 'Functional healing environments' },
    { title: 'Spa & Wellness', description: 'Tranquil relaxation spaces' },
    { title: 'Evidence-Based Design', description: 'Scientifically proven approaches' },
    { title: 'Patient Experience', description: 'Comfort-focused design' },
  ],
  'retail-showrooms-2': [
    { title: 'Flagship Stores', description: 'Brand-defining retail spaces' },
    { title: 'Boutique Design', description: 'Intimate shopping experiences' },
    { title: 'Visual Merchandising', description: 'Strategic product display' },
    { title: 'Customer Journey', description: 'Optimized shopping flow' },
  ],
  'commercial-office-2': [
    { title: 'Corporate Headquarters', description: 'Executive office environments' },
    { title: 'Open-Plan Offices', description: 'Collaborative workspaces' },
    { title: 'Meeting Spaces', description: 'Productive conference areas' },
    { title: 'Flexible Workstations', description: 'Adaptable work zones' },
  ],
  'residential-luxury-2': [
    { title: 'Luxury Apartments', description: 'High-end urban living' },
    { title: 'Private Villas', description: 'Bespoke estate design' },
    { title: 'Smart Home Integration', description: 'Technology-enhanced living' },
    { title: 'Custom Interiors', description: 'Personalized design solutions' },
  ],
  'hospitality-hotels-2': [
    { title: 'Hotel Lobby Design', description: 'Impressive first impressions' },
    { title: 'Guest Room Design', description: 'Comfortable stays' },
    { title: 'Restaurant & Bar', description: 'Dining destinations' },
    { title: 'Spa Facilities', description: 'Wellness experiences' },
  ],
  '3d-visualization': [
    { title: 'Photorealistic Renderings', description: 'Lifelike visualizations' },
    { title: '360° Virtual Tours', description: 'Immersive experiences' },
    { title: 'VR Walkthroughs', description: 'Interactive exploration' },
    { title: 'Animation & Flythroughs', description: 'Dynamic presentations' },
  ],
};

// Process steps for services
const serviceProcessSteps: { [key: string]: Array<{ title: string; description: string }> } = {
  default: [
    { title: 'Discovery & Brief', description: 'Understanding your vision and requirements' },
    { title: 'Concept Development', description: 'Creating initial design concepts' },
    { title: 'Design Refinement', description: 'Perfecting every detail' },
    { title: 'Implementation', description: 'Bringing the design to life' },
  ],
};

// Transform services from WordPress export format
export const realServices = servicesData.map((service) => {
  const features = serviceFeatures[service.slug] || [
    { title: 'Professional Design', description: 'Expert design solutions tailored to your needs' },
    { title: 'Quality Execution', description: 'Meticulous attention to detail' },
    { title: 'Client Collaboration', description: 'Working closely with you throughout' },
  ];

  const processSteps = serviceProcessSteps[service.slug] || serviceProcessSteps.default;

  return {
    id: service.databaseId.toString(),
    slug: service.slug,
    title: service.title,
    excerpt: stripHtml(service.excerpt || '').substring(0, 200),
    content: service.content,
    icon: serviceIconMap[service.slug] || 'Palette',
    featuredImage: {
      url: getImageUrl(service),
      alt: service.title,
    },
    acfFields: {
      serviceIcon: serviceIconMap[service.slug] || 'Palette',
      shortDescription: stripHtml(service.excerpt || '').substring(0, 100),
      description: stripHtml(service.content || '').substring(0, 500),
      serviceFeatures: features.map(f => `${f.title}: ${f.description}`),
      processSteps: processSteps,
      relatedProjects: [],
      relatedServices: [],
      stats: {
        projectsCompleted: Math.floor(Math.random() * 50) + 30, // 30-80 projects
        yearsExperience: 15,
        clientsSatisfied: Math.floor(Math.random() * 100) + 100, // 100-200 clients
      },
    },
    features: features,
    processSteps: processSteps,
    relatedProjects: [],
    seo: {
      metaTitle: service.title + ' | Mouhajer International Design',
      metaDescription: stripHtml(service.excerpt || '').substring(0, 160),
      keywords: [service.title, 'interior design service', 'Dubai'],
    },
    date: service.date,
  };
});

// Industries data (keeping existing structure from mock data)
export const realIndustries = [
  {
    id: '1',
    slug: 'residential',
    title: 'Residential',
    excerpt:
      'Luxury villas, penthouses, and apartments designed to reflect your unique lifestyle and personality.',
    content:
      '<p>Our residential design services create homes that are both beautiful and functional. From luxury penthouses to private villas, we craft spaces that reflect your personality and enhance your lifestyle.</p>',
    icon: 'Home',
    featuredImage: {
      url: '/images/residential.jpg',
      alt: 'Residential Design',
    },
    relatedServices: ['Interior Design', 'Architecture', 'Custom Furniture'],
    relatedProjects: realProjects.slice(0, 3).map((p) => p.slug),
    seo: {
      metaTitle: 'Residential Interior Design | Luxury Homes Dubai',
      metaDescription:
        'Premium residential interior design services in Dubai. Creating bespoke luxury villas, penthouses, and apartments.',
      keywords: ['residential design', 'luxury homes Dubai', 'villa interior design'],
    },
  },
  {
    id: '2',
    slug: 'hospitality',
    title: 'Hospitality',
    excerpt:
      'Creating unforgettable guest experiences through exceptional hotel, resort, and restaurant design.',
    content:
      '<p>We design hospitality spaces that create emotional connections with guests. From boutique hotels to world-class resorts and restaurants, every touchpoint is carefully crafted.</p>',
    icon: 'Hotel',
    featuredImage: {
      url: '/images/hospitality.jpg',
      alt: 'Hospitality Design',
    },
    relatedServices: ['Hospitality & Hotels', 'F&B & Restaurants', '3D Visualization'],
    relatedProjects: realProjects.filter((p) =>
      p.title.toLowerCase().includes('hotel') ||
      p.title.toLowerCase().includes('restaurant')
    ).map((p) => p.slug),
    seo: {
      metaTitle: 'Hospitality Design | Hotels & Restaurants Dubai',
      metaDescription:
        'Award-winning hospitality interior design for hotels, resorts, and restaurants in Dubai and the Middle East.',
      keywords: ['hospitality design', 'hotel interior design', 'restaurant design Dubai'],
    },
  },
  {
    id: '3',
    slug: 'retail',
    title: 'Retail',
    excerpt:
      'Immersive retail experiences that engage customers and drive sales through innovative design.',
    content:
      '<p>In the age of e-commerce, physical retail must offer something special. We create immersive brand experiences that draw customers in and keep them engaged.</p>',
    icon: 'ShoppingBag',
    featuredImage: {
      url: '/images/retail.jpg',
      alt: 'Retail Design',
    },
    relatedServices: ['Retail & Showrooms', '3D Visualization', 'Project Management'],
    relatedProjects: realProjects.filter((p) =>
      p.title.toLowerCase().includes('retail') ||
      p.title.toLowerCase().includes('store')
    ).map((p) => p.slug),
    seo: {
      metaTitle: 'Retail Interior Design | Showrooms Dubai',
      metaDescription:
        'Creating engaging retail spaces and showrooms in Dubai. Immersive brand experiences that captivate customers.',
      keywords: ['retail design', 'showroom design Dubai', 'flagship store design'],
    },
  },
  {
    id: '4',
    slug: 'healthcare',
    title: 'Healthcare',
    excerpt:
      'Healing environments that promote wellness and support both patients and healthcare professionals.',
    content:
      '<p>Healthcare spaces should promote healing, reduce stress, and support both patients and staff. We design environments that are clinically excellent and emotionally supportive.</p>',
    icon: 'Heart',
    featuredImage: {
      url: '/images/healthcare.jpg',
      alt: 'Healthcare Design',
    },
    relatedServices: ['Healthcare & Wellness', 'Interior Design', 'Project Management'],
    relatedProjects: realProjects.filter((p) =>
      p.title.toLowerCase().includes('medical') ||
      p.title.toLowerCase().includes('wellness') ||
      p.title.toLowerCase().includes('spa')
    ).map((p) => p.slug),
    seo: {
      metaTitle: 'Healthcare Interior Design | Medical Centers Dubai',
      metaDescription:
        'Compassionate healthcare and wellness design creating healing environments in Dubai. Evidence-based medical facility design.',
      keywords: ['healthcare design', 'medical center design', 'wellness spa design Dubai'],
    },
  },
  {
    id: '5',
    slug: 'commercial',
    title: 'Commercial',
    excerpt:
      'Innovative office and commercial spaces that inspire productivity and reflect your brand identity.',
    content:
      '<p>Modern offices need to be more than just functional—they should inspire creativity, foster collaboration, and support employee wellbeing. We design spaces that do all three.</p>',
    icon: 'Building2',
    featuredImage: {
      url: '/images/commercial.jpg',
      alt: 'Commercial Design',
    },
    relatedServices: ['Commercial & Office', 'Interior Design', 'Turnkey Solutions'],
    relatedProjects: realProjects.filter((p) =>
      p.title.toLowerCase().includes('office') ||
      p.title.toLowerCase().includes('corporate') ||
      p.title.toLowerCase().includes('headquarters')
    ).map((p) => p.slug),
    seo: {
      metaTitle: 'Commercial Office Design | Corporate Interiors Dubai',
      metaDescription:
        'Innovative office and commercial design in Dubai. Creating productive workspaces that inspire teams.',
      keywords: ['commercial design', 'office interior design Dubai', 'corporate headquarters design'],
    },
  },
];

// Blog posts data (can be enhanced with real blog data when available)
export const realPosts = [
  {
    id: '1',
    slug: 'evolution-modern-interior-design',
    title: 'The Evolution of Modern Interior Design',
    excerpt:
      'Explore how interior design has evolved over the decades and what trends are shaping the future of luxury spaces.',
    content:
      '<p>Interior design has undergone a remarkable transformation over the past century...</p>',
    category: 'trends',
    author: {
      name: 'Mouhajer Design Team',
      role: 'Design Experts',
      image: '/images/team/author.jpg',
    },
    featuredImage: {
      url: '/images/blog/modern-design.jpg',
      alt: 'Modern Interior Design',
    },
    readTime: 8,
    tags: ['Interior Design', 'Trends', 'Luxury Design'],
    date: new Date().toISOString(),
    seo: {
      metaTitle: 'The Evolution of Modern Interior Design | Mouhajer Design Blog',
      metaDescription:
        'Discover how interior design has evolved and learn about the latest trends shaping luxury spaces in Dubai and beyond.',
      keywords: ['interior design trends', 'modern design', 'luxury interiors'],
    },
  },
];

// Export all real content
export const realContentData = {
  projects: realProjects,
  services: realServices,
  industries: realIndustries,
  posts: realPosts,
};
