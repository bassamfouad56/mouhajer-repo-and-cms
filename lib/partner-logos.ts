export interface PartnerLogo {
  name: string;
  logo: string;
  projects?: number;
  category: 'hospitality' | 'corporate' | 'luxury' | 'developer';
  featured?: boolean;
}

export const partnerLogos: PartnerLogo[] = [
  // Hospitality Partners
  {
    name: 'ADNH',
    logo: '/partners/adnh-logo.png',
    projects: 12,
    category: 'hospitality',
    featured: true,
  },
  {
    name: 'Hyatt',
    logo: '/partners/hyatt-logo.png',
    projects: 6,
    category: 'hospitality',
    featured: true,
  },
  {
    name: 'Ritz-Carlton',
    logo: '/partners/1200px-RitzCarlton.svg.png',
    projects: 4,
    category: 'hospitality',
    featured: true,
  },
  {
    name: 'Sofitel',
    logo: '/partners/Sofitel-JBR-Logo-2019-01_white.png',
    projects: 8,
    category: 'hospitality',
    featured: true,
  },
  {
    name: 'DoubleTree',
    logo: '/partners/1200px-DoubletreeLogo.svg.png',
    projects: 5,
    category: 'hospitality',
  },
  {
    name: 'Radisson Blu',
    logo: '/partners/2880px-Radisson_Blu_logo.svg.png',
    projects: 7,
    category: 'hospitality',
  },
  {
    name: 'Marriott',
    logo: '/partners/Marriott_International.png',
    projects: 9,
    category: 'hospitality',
    featured: true,
  },
  {
    name: 'The Residences',
    logo: '/partners/The Residences.png',
    projects: 3,
    category: 'hospitality',
  },
  // Developer Partners
  {
    name: 'Meydan',
    logo: '/partners/meydan-logo.png',
    projects: 15,
    category: 'developer',
    featured: true,
  },
  {
    name: 'DMCC',
    logo: '/partners/DMCC-logo.png',
    projects: 10,
    category: 'developer',
    featured: true,
  },
  {
    name: 'UCC',
    logo: '/partners/UCCLogo.png',
    projects: 6,
    category: 'developer',
  },
  // Luxury Brand Partners (Layer files are luxury furniture brands)
  {
    name: 'Fendi Casa',
    logo: '/partners/Layer 788.png',
    projects: 8,
    category: 'luxury',
    featured: true,
  },
  {
    name: 'Bentley Home',
    logo: '/partners/Layer 792.png',
    projects: 5,
    category: 'luxury',
    featured: true,
  },
  {
    name: 'Boca do Lobo',
    logo: '/partners/Layer 793.png',
    projects: 4,
    category: 'luxury',
  },
  {
    name: 'Smania',
    logo: '/partners/Layer 796.png',
    projects: 6,
    category: 'luxury',
  },
  {
    name: 'Trussardi',
    logo: '/partners/Layer 798.png',
    projects: 3,
    category: 'luxury',
  },
  {
    name: 'Visionnaire',
    logo: '/partners/Layer 799.png',
    projects: 7,
    category: 'luxury',
  },
  {
    name: 'Minotti',
    logo: '/partners/Layer 801.png',
    projects: 9,
    category: 'luxury',
    featured: true,
  },
  {
    name: 'B&B Italia',
    logo: '/partners/Layer 803.png',
    projects: 8,
    category: 'luxury',
  },
  {
    name: 'Poliform',
    logo: '/partners/Layer 806.png',
    projects: 5,
    category: 'luxury',
  },
  {
    name: 'Molteni&C',
    logo: '/partners/Layer 810.png',
    projects: 6,
    category: 'luxury',
  },
  {
    name: 'Giorgetti',
    logo: '/partners/Layer 811.png',
    projects: 4,
    category: 'luxury',
  },
  // Corporate Partners
  {
    name: 'Honeywell',
    logo: '/partners/Layer 816.png',
    projects: 12,
    category: 'corporate',
    featured: true,
  },
  {
    name: 'Carrier',
    logo: '/partners/Layer 817.png',
    projects: 15,
    category: 'corporate',
    featured: true,
  },
];

export const getPartnersByCategory = (category: PartnerLogo['category']) =>
  partnerLogos.filter((p) => p.category === category);

export const getFeaturedPartners = () =>
  partnerLogos.filter((p) => p.featured);

export const getAllPartners = () => partnerLogos;
