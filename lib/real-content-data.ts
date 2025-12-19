import servicesData from "../exported-content/services.json";

// Helper to convert WordPress HTML to plain text for excerpts
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&[^;]+;/g, " ")
    .trim();
}

// ============================================================================
// REAL PROJECTS DATA - Using actual images from public/projects folder
// ============================================================================

export const realProjects = [
  // ===== BATHROOM PROJECTS =====
  {
    id: "bathroom-1",
    slug: "luxury-bathroom-design-dubai",
    title: "Luxury Bathroom Interior Design",
    excerpt: "Elegant bathroom design featuring premium marble finishes, custom vanities, and sophisticated lighting. A harmonious blend of functionality and luxury.",
    content: `<h2>Project Overview</h2>
    <p>This luxury bathroom project showcases our expertise in creating spa-like retreats within residential spaces. The design emphasizes clean lines, premium materials, and thoughtful functionality.</p>
    <h3>Design Features</h3>
    <ul>
      <li>Premium Italian marble throughout</li>
      <li>Custom-designed double vanity</li>
      <li>Walk-in rain shower with frameless glass</li>
      <li>Heated flooring system</li>
      <li>Ambient and task lighting design</li>
    </ul>`,
    category: "residential",
    location: "Dubai, UAE",
    year: "2024",
    client: "Private Residence",
    featuredImage: {
      url: "/placeholder.jpg",
      alt: "Luxury Bathroom Design Dubai",
    },
    gallery: [
      { url: "/placeholder.jpg", alt: "Bathroom Main View" },
      { url: "/placeholder.jpg", alt: "Vanity Area" },
      { url: "/placeholder.jpg", alt: "Shower Design" },
      { url: "/placeholder.jpg", alt: "Bathroom Details" },
      { url: "/placeholder.jpg", alt: "Lighting Design" },
      { url: "/placeholder.jpg", alt: "Bathroom Fixtures" },
      { url: "/placeholder.jpg", alt: "Marble Finishes" },
      { url: "/placeholder.jpg", alt: "Full Bathroom View" },
    ],
    services: ["Interior Design", "Custom Joinery", "Lighting Design"],
    industries: ["Residential"],
    seo: {
      metaTitle: "Luxury Bathroom Design Dubai | Mouhajer International Design",
      metaDescription: "Premium bathroom interior design in Dubai featuring Italian marble, custom vanities, and sophisticated lighting solutions.",
      keywords: ["bathroom design Dubai", "luxury bathroom", "bathroom interior design"],
    },
    date: new Date("2024-01-15").toISOString(),
  },

  // ===== BEDROOM INTERIOR PROJECTS =====
  {
    id: "bedroom-1",
    slug: "villa-hatem-master-bedroom",
    title: "Villa Hatem Master Bedroom Suite",
    excerpt: "Opulent master bedroom design featuring bespoke headboard, custom lighting, and premium textiles. A perfect sanctuary for rest and relaxation.",
    content: `<h2>Project Overview</h2>
    <p>The Villa Hatem master bedroom represents the pinnacle of luxury residential design. Every element has been carefully curated to create a serene yet sophisticated sleeping environment.</p>
    <h3>Design Highlights</h3>
    <ul>
      <li>Custom upholstered headboard with integrated lighting</li>
      <li>Premium silk and velvet textiles</li>
      <li>Bespoke bedside tables with hidden storage</li>
      <li>Layered ambient lighting scheme</li>
      <li>Floor-to-ceiling drapery system</li>
    </ul>`,
    category: "residential",
    location: "UAE",
    year: "2024",
    client: "Villa Hatem",
    featuredImage: {
      url: "/placeholder.jpg",
      alt: "Villa Hatem Master Bedroom",
    },
    gallery: [
      { url: "/placeholder.jpg", alt: "Master Bedroom View 1" },
      { url: "/placeholder.jpg", alt: "Master Bedroom View 2" },
      { url: "/placeholder.jpg", alt: "Master Bedroom View 3" },
      { url: "/placeholder.jpg", alt: "Master Bedroom View 4" },
    ],
    services: ["Interior Design", "Custom Furniture", "Lighting Design"],
    industries: ["Residential"],
    seo: {
      metaTitle: "Villa Hatem Master Bedroom | Luxury Bedroom Design Dubai",
      metaDescription: "Opulent master bedroom suite design featuring bespoke furniture, premium textiles, and sophisticated lighting.",
      keywords: ["master bedroom design", "luxury bedroom Dubai", "villa interior design"],
    },
    date: new Date("2024-02-10").toISOString(),
  },
  {
    id: "bedroom-2",
    slug: "modern-bedroom-interior-ajman",
    title: "Modern Bedroom Interior - Ajman Villa",
    excerpt: "Contemporary bedroom design with clean lines, natural light optimization, and modern amenities for the discerning homeowner.",
    content: `<h2>Project Overview</h2>
    <p>This Ajman villa bedroom showcases modern design principles with a focus on natural light, minimalist aesthetics, and maximum comfort.</p>`,
    category: "residential",
    location: "Ajman, UAE",
    year: "2023",
    client: "Private Client",
    featuredImage: {
      url: "/placeholder.jpg",
      alt: "Ajman Villa Bedroom",
    },
    gallery: [
      { url: "/placeholder.jpg", alt: "Bedroom Main" },
      { url: "/placeholder.jpg", alt: "Bedroom Detail" },
      { url: "/placeholder.jpg", alt: "Bedroom View" },
      { url: "/placeholder.jpg", alt: "Interior Details" },
      { url: "/placeholder.jpg", alt: "Lighting" },
      { url: "/placeholder.jpg", alt: "Full View" },
    ],
    services: ["Interior Design", "Lighting Design", "Space Planning"],
    industries: ["Residential"],
    seo: {
      metaTitle: "Modern Bedroom Interior Ajman | Mouhajer International Design",
      metaDescription: "Contemporary bedroom design in Ajman featuring clean lines and modern amenities.",
      keywords: ["bedroom design Ajman", "modern bedroom interior", "villa bedroom design"],
    },
    date: new Date("2023-11-06").toISOString(),
  },
  {
    id: "bedroom-3",
    slug: "amani-bedroom-design",
    title: "Amani Residence Bedroom",
    excerpt: "Elegant bedroom design combining comfort with sophisticated style for the Amani residence project.",
    content: `<h2>Project Overview</h2>
    <p>The Amani residence bedroom project features a harmonious blend of contemporary design and timeless elegance.</p>`,
    category: "residential",
    location: "Dubai, UAE",
    year: "2023",
    client: "Amani Residence",
    featuredImage: {
      url: "/placeholder.jpg",
      alt: "Amani Bedroom Design",
    },
    gallery: [
      { url: "/placeholder.jpg", alt: "Amani Bedroom" },
      { url: "/placeholder.jpg", alt: "Bedroom View 1" },
      { url: "/placeholder.jpg", alt: "Bedroom View 2" },
      { url: "/placeholder.jpg", alt: "Master View" },
      { url: "/placeholder.jpg", alt: "Bedroom Details" },
    ],
    services: ["Interior Design", "3D Visualization", "Custom Furniture"],
    industries: ["Residential"],
    seo: {
      metaTitle: "Amani Residence Bedroom Design | Mouhajer International Design",
      metaDescription: "Elegant bedroom interior design for Amani residence in Dubai.",
      keywords: ["bedroom design Dubai", "residential interior", "luxury bedroom"],
    },
    date: new Date("2023-08-15").toISOString(),
  },

  // ===== COMMERCIAL INTERIOR PROJECTS =====
  {
    id: "commercial-1",
    slug: "luxury-commercial-interior-dubai",
    title: "Premium Commercial Interior Fit-out",
    excerpt: "High-end commercial space design featuring sophisticated finishes, optimal space planning, and brand-aligned aesthetics.",
    content: `<h2>Project Overview</h2>
    <p>This commercial interior project demonstrates our capability in creating professional, brand-aligned spaces that inspire productivity and impress clients.</p>
    <h3>Design Features</h3>
    <ul>
      <li>Premium reception area design</li>
      <li>Collaborative workspace zones</li>
      <li>Executive meeting rooms</li>
      <li>Brand integration throughout</li>
      <li>Sustainable material selection</li>
    </ul>`,
    category: "commercial",
    location: "Dubai, UAE",
    year: "2024",
    client: "Corporate Client",
    featuredImage: {
      url: "/placeholder.jpg",
      alt: "Commercial Interior Dubai",
    },
    gallery: [
      { url: "/placeholder.jpg", alt: "Reception Area" },
      { url: "/placeholder.jpg", alt: "Workspace" },
      { url: "/placeholder.jpg", alt: "Meeting Room" },
      { url: "/placeholder.jpg", alt: "Office Details" },
      { url: "/placeholder.jpg", alt: "Common Area" },
      { url: "/placeholder.jpg", alt: "Executive Office" },
    ],
    services: ["Interior Design", "Space Planning", "Project Management"],
    industries: ["Commercial"],
    seo: {
      metaTitle: "Commercial Interior Design Dubai | Mouhajer International Design",
      metaDescription: "Premium commercial interior fit-out services in Dubai. Professional workspace design that inspires productivity.",
      keywords: ["commercial interior Dubai", "office design", "corporate fit-out"],
    },
    date: new Date("2024-03-01").toISOString(),
  },
  {
    id: "commercial-2",
    slug: "corporate-headquarters-fitout",
    title: "Corporate Headquarters Interior Design",
    excerpt: "Complete corporate headquarters design featuring executive offices, collaborative spaces, and state-of-the-art meeting facilities.",
    content: `<h2>Project Overview</h2>
    <p>A comprehensive corporate headquarters project showcasing modern workplace design principles.</p>`,
    category: "commercial",
    location: "Dubai, UAE",
    year: "2023",
    client: "Corporate Client",
    featuredImage: {
      url: "/placeholder.jpg",
      alt: "Corporate Headquarters",
    },
    gallery: [
      { url: "/placeholder.jpg", alt: "Main Office" },
      { url: "/placeholder.jpg", alt: "Workspace Area" },
      { url: "/placeholder.jpg", alt: "Conference Room" },
      { url: "/placeholder.jpg", alt: "Break Area" },
    ],
    services: ["Interior Design", "Turnkey Solutions", "Project Management"],
    industries: ["Commercial"],
    seo: {
      metaTitle: "Corporate Headquarters Design | Mouhajer International Design",
      metaDescription: "Complete corporate headquarters interior design in Dubai.",
      keywords: ["corporate design", "headquarters interior", "office fit-out Dubai"],
    },
    date: new Date("2023-10-20").toISOString(),
  },

  // ===== OFFICE FIT-OUT PROJECTS =====
  {
    id: "office-1",
    slug: "modern-office-fitout-dubai",
    title: "Modern Office Fit-out Project",
    excerpt: "Contemporary office fit-out featuring ergonomic workstations, collaborative zones, and sophisticated meeting spaces.",
    content: `<h2>Project Overview</h2>
    <p>This modern office fit-out project showcases our expertise in creating productive, inspiring workspaces that support diverse working styles.</p>
    <h3>Design Features</h3>
    <ul>
      <li>Activity-based working zones</li>
      <li>Ergonomic furniture selection</li>
      <li>Acoustic management solutions</li>
      <li>Biophilic design elements</li>
      <li>Smart lighting systems</li>
    </ul>`,
    category: "commercial",
    location: "Dubai, UAE",
    year: "2024",
    client: "Corporate Client",
    featuredImage: {
      url: "/placeholder.jpg",
      alt: "Modern Office Fit-out Dubai",
    },
    gallery: [
      { url: "/placeholder.jpg", alt: "Office Main View" },
      { url: "/placeholder.jpg", alt: "Workspace Area" },
      { url: "/placeholder.jpg", alt: "Meeting Space" },
      { url: "/placeholder.jpg", alt: "Reception" },
      { url: "/placeholder.jpg", alt: "Work Area" },
      { url: "/placeholder.jpg", alt: "Office Details" },
      { url: "/placeholder.jpg", alt: "Collaborative Zone" },
    ],
    services: ["Interior Design", "Space Planning", "Furniture Specification"],
    industries: ["Commercial"],
    seo: {
      metaTitle: "Modern Office Fit-out Dubai | Mouhajer International Design",
      metaDescription: "Contemporary office fit-out services in Dubai featuring ergonomic design and collaborative workspaces.",
      keywords: ["office fit-out Dubai", "modern office design", "workspace interior"],
    },
    date: new Date("2024-02-15").toISOString(),
  },

  // ===== TURNKEY DESIGN FIT-OUT PROJECTS =====
  {
    id: "turnkey-1",
    slug: "turnkey-residential-fitout",
    title: "Turnkey Residential Fit-out Project",
    excerpt: "Complete turnkey residential fit-out from design concept to final handover, featuring premium finishes throughout.",
    content: `<h2>Project Overview</h2>
    <p>This turnkey project demonstrates our end-to-end capability in delivering complete residential interiors from initial concept through to final styling.</p>
    <h3>Scope of Work</h3>
    <ul>
      <li>Interior design and 3D visualization</li>
      <li>Custom joinery and millwork</li>
      <li>Furniture, fixtures and equipment</li>
      <li>Lighting design and supply</li>
      <li>Project management and handover</li>
    </ul>`,
    category: "residential",
    location: "Dubai, UAE",
    year: "2024",
    client: "Private Client",
    featuredImage: {
      url: "/placeholder.jpg",
      alt: "Turnkey Residential Fit-out",
    },
    gallery: [
      { url: "/placeholder.jpg", alt: "Living Area" },
      { url: "/placeholder.jpg", alt: "Interior View" },
      { url: "/placeholder.jpg", alt: "Dining Area" },
      { url: "/placeholder.jpg", alt: "Kitchen" },
      { url: "/placeholder.jpg", alt: "Details" },
      { url: "/placeholder.jpg", alt: "Bedroom" },
      { url: "/placeholder.jpg", alt: "Bathroom" },
      { url: "/placeholder.jpg", alt: "Full View" },
    ],
    services: ["Turnkey Solutions", "Interior Design", "Custom Furniture", "Project Management"],
    industries: ["Residential"],
    seo: {
      metaTitle: "Turnkey Residential Fit-out Dubai | Mouhajer International Design",
      metaDescription: "Complete turnkey residential fit-out services in Dubai from design to handover.",
      keywords: ["turnkey fit-out Dubai", "residential fit-out", "complete interior design"],
    },
    date: new Date("2024-01-20").toISOString(),
  },
  {
    id: "turnkey-2",
    slug: "luxury-apartment-turnkey",
    title: "Luxury Apartment Turnkey Project",
    excerpt: "Full turnkey delivery for a luxury apartment including bespoke joinery, lighting design, and premium finishes.",
    content: `<h2>Project Overview</h2>
    <p>A comprehensive turnkey project for a high-end apartment featuring our signature attention to detail and quality craftsmanship.</p>`,
    category: "residential",
    location: "Dubai, UAE",
    year: "2023",
    client: "Private Client",
    featuredImage: {
      url: "/placeholder.jpg",
      alt: "Luxury Apartment Turnkey",
    },
    gallery: [
      { url: "/placeholder.jpg", alt: "Apartment Interior" },
      { url: "/placeholder.jpg", alt: "Living Space" },
    ],
    services: ["Turnkey Solutions", "Interior Design", "Custom Joinery"],
    industries: ["Residential"],
    seo: {
      metaTitle: "Luxury Apartment Turnkey Dubai | Mouhajer International Design",
      metaDescription: "Full turnkey apartment fit-out in Dubai with premium finishes.",
      keywords: ["apartment fit-out", "turnkey Dubai", "luxury interior"],
    },
    date: new Date("2023-12-10").toISOString(),
  },

  // ===== CLOSET/WARDROBE PROJECTS =====
  {
    id: "closet-1",
    slug: "custom-walk-in-closet-design",
    title: "Custom Walk-in Closet Design",
    excerpt: "Bespoke walk-in closet featuring custom joinery, intelligent storage solutions, and premium finishes.",
    content: `<h2>Project Overview</h2>
    <p>This custom walk-in closet project showcases our expertise in creating organized, beautiful storage solutions that maximize space efficiency.</p>
    <h3>Design Features</h3>
    <ul>
      <li>Custom cabinetry and shelving</li>
      <li>Integrated lighting system</li>
      <li>Premium hardware and finishes</li>
      <li>Island with jewelry storage</li>
      <li>Full-length mirrors</li>
    </ul>`,
    category: "residential",
    location: "Dubai, UAE",
    year: "2024",
    client: "Private Residence",
    featuredImage: {
      url: "/placeholder.jpg",
      alt: "Custom Walk-in Closet",
    },
    gallery: [
      { url: "/placeholder.jpg", alt: "Closet Main View" },
      { url: "/placeholder.jpg", alt: "Storage Details" },
      { url: "/placeholder.jpg", alt: "Closet Island" },
      { url: "/placeholder.jpg", alt: "Full View" },
    ],
    services: ["Custom Joinery", "Interior Design", "Lighting Design"],
    industries: ["Residential"],
    seo: {
      metaTitle: "Custom Walk-in Closet Design Dubai | Mouhajer International Design",
      metaDescription: "Bespoke walk-in closet design in Dubai featuring custom joinery and premium finishes.",
      keywords: ["walk-in closet Dubai", "custom closet design", "wardrobe interior"],
    },
    date: new Date("2024-01-05").toISOString(),
  },
];

// Icon mapping for services
const serviceIconMap: { [key: string]: string } = {
  "fb-restaurants": "Utensils",
  "healthcare-wellness-2": "Heart",
  "retail-showrooms-2": "ShoppingBag",
  "commercial-office-2": "Building2",
  "residential-luxury-2": "Home",
  "hospitality-hotels-2": "Hotel",
  "3d-visualization": "Box",
  "turnkey-solutions": "Package",
  "project-management": "Briefcase",
  "custom-furniture": "Sofa",
  architecture: "Building",
  "interior-design": "Palette",
};

// Service features mapping
const serviceFeatures: {
  [key: string]: Array<{ title: string; description: string }>;
} = {
  "fb-restaurants": [
    {
      title: "Fine Dining Concepts",
      description: "Sophisticated restaurant environments",
    },
    {
      title: "Casual Dining",
      description: "Comfortable and inviting atmospheres",
    },
    {
      title: "Bar & Lounge Design",
      description: "Social spaces with character",
    },
    { title: "Kitchen Planning", description: "Efficient workflow design" },
  ],
  "healthcare-wellness-2": [
    {
      title: "Medical Clinics",
      description: "Functional healing environments",
    },
    { title: "Spa & Wellness", description: "Tranquil relaxation spaces" },
    {
      title: "Evidence-Based Design",
      description: "Scientifically proven approaches",
    },
    { title: "Patient Experience", description: "Comfort-focused design" },
  ],
  "retail-showrooms-2": [
    { title: "Flagship Stores", description: "Brand-defining retail spaces" },
    { title: "Boutique Design", description: "Intimate shopping experiences" },
    { title: "Visual Merchandising", description: "Strategic product display" },
    { title: "Customer Journey", description: "Optimized shopping flow" },
  ],
  "commercial-office-2": [
    {
      title: "Corporate Headquarters",
      description: "Executive office environments",
    },
    { title: "Open-Plan Offices", description: "Collaborative workspaces" },
    { title: "Meeting Spaces", description: "Productive conference areas" },
    { title: "Flexible Workstations", description: "Adaptable work zones" },
  ],
  "residential-luxury-2": [
    { title: "Luxury Apartments", description: "High-end urban living" },
    { title: "Private Villas", description: "Bespoke estate design" },
    {
      title: "Smart Home Integration",
      description: "Technology-enhanced living",
    },
    { title: "Custom Interiors", description: "Personalized design solutions" },
  ],
  "hospitality-hotels-2": [
    {
      title: "Hotel Lobby Design",
      description: "Impressive first impressions",
    },
    { title: "Guest Room Design", description: "Comfortable stays" },
    { title: "Restaurant & Bar", description: "Dining destinations" },
    { title: "Spa Facilities", description: "Wellness experiences" },
  ],
  "3d-visualization": [
    {
      title: "Photorealistic Renderings",
      description: "Lifelike visualizations",
    },
    { title: "360° Virtual Tours", description: "Immersive experiences" },
    { title: "VR Walkthroughs", description: "Interactive exploration" },
    { title: "Animation & Flythroughs", description: "Dynamic presentations" },
  ],
};

// Process steps for services
const serviceProcessSteps: {
  [key: string]: Array<{ title: string; description: string }>;
} = {
  default: [
    {
      title: "Discovery & Brief",
      description: "Understanding your vision and requirements",
    },
    {
      title: "Concept Development",
      description: "Creating initial design concepts",
    },
    { title: "Design Refinement", description: "Perfecting every detail" },
    { title: "Implementation", description: "Bringing the design to life" },
  ],
};

// Service image mapping to real project images
const serviceImageMap: { [key: string]: string } = {
  "fb-restaurants": "/placeholder.jpg",
  "healthcare-wellness-2": "/placeholder.jpg",
  "retail-showrooms-2": "/placeholder.jpg",
  "commercial-office-2": "/placeholder.jpg",
  "residential-luxury-2": "/placeholder.jpg",
  "hospitality-hotels-2": "/placeholder.jpg",
  "3d-visualization": "/placeholder.jpg",
  "turnkey-solutions": "/placeholder.jpg",
  "project-management": "/placeholder.jpg",
  "custom-furniture": "/placeholder.jpg",
  "architecture": "/placeholder.jpg",
  "interior-design": "/placeholder.jpg",
};

// Transform services from WordPress export format
export const realServices = servicesData.map((service) => {
  const features = serviceFeatures[service.slug] || [
    {
      title: "Professional Design",
      description: "Expert design solutions tailored to your needs",
    },
    {
      title: "Quality Execution",
      description: "Meticulous attention to detail",
    },
    {
      title: "Client Collaboration",
      description: "Working closely with you throughout",
    },
  ];

  const processSteps =
    serviceProcessSteps[service.slug] || serviceProcessSteps.default;

  // Get image URL from mapping or use default
  const imageUrl = serviceImageMap[service.slug] || "/placeholder.jpg";

  return {
    id: service.databaseId.toString(),
    slug: service.slug,
    title: service.title,
    excerpt: stripHtml(service.excerpt || "").substring(0, 200),
    content: service.content,
    icon: serviceIconMap[service.slug] || "Palette",
    featuredImage: {
      url: imageUrl,
      alt: service.title,
    },
    acfFields: {
      serviceIcon: serviceIconMap[service.slug] || "Palette",
      shortDescription: stripHtml(service.excerpt || "").substring(0, 100),
      description: stripHtml(service.content || "").substring(0, 500),
      serviceFeatures: features.map((f) => `${f.title}: ${f.description}`),
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
      metaTitle: service.title + " | Mouhajer International Design",
      metaDescription: stripHtml(service.excerpt || "").substring(0, 160),
      keywords: [service.title, "interior design service", "Dubai"],
    },
    date: service.date,
  };
});

// Industries data - Updated with real project images
export const realIndustries = [
  {
    id: "1",
    slug: "residential",
    title: "Residential",
    excerpt:
      "Luxury villas, penthouses, and apartments designed to reflect your unique lifestyle and personality.",
    content:
      "<p>Our residential design services create homes that are both beautiful and functional. From luxury penthouses to private villas, we craft spaces that reflect your personality and enhance your lifestyle.</p>",
    icon: "Home",
    featuredImage: {
      url: "/placeholder.jpg",
      alt: "Residential Design",
    },
    relatedServices: ["Interior Design", "Architecture", "Custom Furniture"],
    relatedProjects: realProjects.filter(p => p.category === "residential").slice(0, 3).map((p) => p.slug),
    seo: {
      metaTitle: "Residential Interior Design | Luxury Homes Dubai",
      metaDescription:
        "Premium residential interior design services in Dubai. Creating bespoke luxury villas, penthouses, and apartments.",
      keywords: [
        "residential design",
        "luxury homes Dubai",
        "villa interior design",
      ],
    },
  },
  {
    id: "2",
    slug: "hospitality",
    title: "Hospitality",
    excerpt:
      "Creating unforgettable guest experiences through exceptional hotel, resort, and restaurant design.",
    content:
      "<p>We design hospitality spaces that create emotional connections with guests. From boutique hotels to world-class resorts and restaurants, every touchpoint is carefully crafted.</p>",
    icon: "Hotel",
    featuredImage: {
      url: "/placeholder.jpg",
      alt: "Hospitality Design",
    },
    relatedServices: [
      "Hospitality & Hotels",
      "F&B & Restaurants",
      "3D Visualization",
    ],
    relatedProjects: realProjects
      .filter(
        (p) =>
          p.title.toLowerCase().includes("hotel") ||
          p.title.toLowerCase().includes("restaurant")
      )
      .map((p) => p.slug),
    seo: {
      metaTitle: "Hospitality Design | Hotels & Restaurants Dubai",
      metaDescription:
        "Award-winning hospitality interior design for hotels, resorts, and restaurants in Dubai and the Middle East.",
      keywords: [
        "hospitality design",
        "hotel interior design",
        "restaurant design Dubai",
      ],
    },
  },
  {
    id: "3",
    slug: "retail",
    title: "Retail",
    excerpt:
      "Immersive retail experiences that engage customers and drive sales through innovative design.",
    content:
      "<p>In the age of e-commerce, physical retail must offer something special. We create immersive brand experiences that draw customers in and keep them engaged.</p>",
    icon: "ShoppingBag",
    featuredImage: {
      url: "/placeholder.jpg",
      alt: "Retail Design",
    },
    relatedServices: [
      "Retail & Showrooms",
      "3D Visualization",
      "Project Management",
    ],
    relatedProjects: realProjects
      .filter(
        (p) =>
          p.title.toLowerCase().includes("retail") ||
          p.title.toLowerCase().includes("store")
      )
      .map((p) => p.slug),
    seo: {
      metaTitle: "Retail Interior Design | Showrooms Dubai",
      metaDescription:
        "Creating engaging retail spaces and showrooms in Dubai. Immersive brand experiences that captivate customers.",
      keywords: [
        "retail design",
        "showroom design Dubai",
        "flagship store design",
      ],
    },
  },
  {
    id: "4",
    slug: "healthcare",
    title: "Healthcare",
    excerpt:
      "Healing environments that promote wellness and support both patients and healthcare professionals.",
    content:
      "<p>Healthcare spaces should promote healing, reduce stress, and support both patients and staff. We design environments that are clinically excellent and emotionally supportive.</p>",
    icon: "Heart",
    featuredImage: {
      url: "/placeholder.jpg",
      alt: "Healthcare Design",
    },
    relatedServices: [
      "Healthcare & Wellness",
      "Interior Design",
      "Project Management",
    ],
    relatedProjects: realProjects
      .filter(
        (p) =>
          p.title.toLowerCase().includes("medical") ||
          p.title.toLowerCase().includes("wellness") ||
          p.title.toLowerCase().includes("spa")
      )
      .map((p) => p.slug),
    seo: {
      metaTitle: "Healthcare Interior Design | Medical Centers Dubai",
      metaDescription:
        "Compassionate healthcare and wellness design creating healing environments in Dubai. Evidence-based medical facility design.",
      keywords: [
        "healthcare design",
        "medical center design",
        "wellness spa design Dubai",
      ],
    },
  },
  {
    id: "5",
    slug: "commercial",
    title: "Commercial",
    excerpt:
      "Innovative office and commercial spaces that inspire productivity and reflect your brand identity.",
    content:
      "<p>Modern offices need to be more than just functional they should inspire creativity, foster collaboration, and support employee wellbeing. We design spaces that do all three.</p>",
    icon: "Building2",
    featuredImage: {
      url: "/placeholder.jpg",
      alt: "Commercial Design",
    },
    relatedServices: [
      "Commercial & Office",
      "Interior Design",
      "Turnkey Solutions",
    ],
    relatedProjects: realProjects
      .filter(
        (p) =>
          p.title.toLowerCase().includes("office") ||
          p.title.toLowerCase().includes("corporate") ||
          p.title.toLowerCase().includes("headquarters")
      )
      .map((p) => p.slug),
    seo: {
      metaTitle: "Commercial Office Design | Corporate Interiors Dubai",
      metaDescription:
        "Innovative office and commercial design in Dubai. Creating productive workspaces that inspire teams.",
      keywords: [
        "commercial design",
        "office interior design Dubai",
        "corporate headquarters design",
      ],
    },
  },
];

// Blog posts data (can be enhanced with real blog data when available)
export const realPosts = [
  {
    id: "1",
    slug: "evolution-modern-interior-design",
    title: "The Evolution of Modern Interior Design",
    excerpt:
      "Explore how interior design has evolved over the decades and what trends are shaping the future of luxury spaces.",
    content:
      "<p>Interior design has undergone a remarkable transformation over the past century...</p>",
    category: "trends",
    author: {
      name: "Mouhajer Design Team",
      role: "Design Experts",
      image: "/images/team/author.jpg",
    },
    featuredImage: {
      url: "/placeholder.jpg",
      alt: "Modern Interior Design",
    },
    readTime: 8,
    tags: ["Interior Design", "Trends", "Luxury Design"],
    date: new Date().toISOString(),
    seo: {
      metaTitle:
        "The Evolution of Modern Interior Design | Mouhajer Design Blog",
      metaDescription:
        "Discover how interior design has evolved and learn about the latest trends shaping luxury spaces in Dubai and beyond.",
      keywords: ["interior design trends", "modern design", "luxury interiors"],
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
