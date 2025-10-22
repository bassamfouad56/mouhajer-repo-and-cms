/**
 * CMS Image URLs
 * Centralized image URLs from live CMS (Vercel Blob Storage)
 * Last updated: 2025-10-20
 * Total images: 62
 *
 * Usage: Import these constants instead of using static imports or PLACEHOLDER_IMAGE
 * Example: import { WHATSAPP_TEXT, CLIENT_LOGOS } from '@/lib/cms-images'
 */

// ==================== WhatsApp & Contact ====================
export const WHATSAPP_GIF =
  'https://tupbs9ia8fmtwvjh.public.blob.vercel-storage.com/images/1760006894363-whts-ZmktEdoOUPaLVo8qJTtSAG1CTrTns6.webp';
export const WHATSAPP_TEXT =
  'https://tupbs9ia8fmtwvjh.public.blob.vercel-storage.com/images/1760006894324-whatsapptext-BHZUJdi9GcCIxHfeUOR1lpOqmNSPHT.webp';

// ==================== Hero & Banners ====================
export const VILLA_DESIGN_BANNER =
  'https://tupbs9ia8fmtwvjh.public.blob.vercel-storage.com/images/1760006894739-villadesign-kIYa6WqpNCUHhwdlebf5hc33Qrqv51.webp';
export const VV_BANNER =
  'https://tupbs9ia8fmtwvjh.public.blob.vercel-storage.com/images/1760006894724-vv-9l1qwbLUlWPOd0vqcjdJ5zFhgvI5Mu.webp';
export const V1_BANNER =
  'https://tupbs9ia8fmtwvjh.public.blob.vercel-storage.com/images/1760006885725-v1-ac5OYCYIIwPQlCZOQr3Kwr30gSnYx3.webp';
export const V2_BANNER =
  'https://tupbs9ia8fmtwvjh.public.blob.vercel-storage.com/images/1760006889391-v2-3WNvT5ceo9YEVSoOrc5QPYwMuzvEHn.webp';
export const THUMBNAIL_BANNER =
  'https://tupbs9ia8fmtwvjh.public.blob.vercel-storage.com/images/1760006886149-thumbnail-6EESAhHO8MDp8PUH7bcjSaoAIAXlOK.webp';

// ==================== Projects ====================
export const PROJECT_IMAGES = {
  villas: '/images/projects/villa-1-living.jpg',
  penthouses: '/images/projects/penthouse-1-main.jpg',
  commercial: '/images/projects/hotel-1-main.jpg',
  apartments: '/images/projects/apartment-1-main.jpg',
};

// Array of all project images
export const PROJECT_GALLERY_IMAGES = [
  '/images/projects/villa-1-living.jpg',
  '/images/projects/villa-1-kitchen.jpg',
  '/images/projects/villa-1-main.jpg',
  '/images/projects/mansion-1-entrance.jpg',
  '/images/projects/mansion-1-main.jpg',
  '/images/projects/penthouse-1-main.jpg',
  '/images/projects/penthouse-1-living.jpg',
  '/images/projects/hotel-1-main.jpg',
  '/images/projects/office-1-main.jpg',
  '/images/projects/office-1-workspace.jpg',
];

// ==================== Services ====================
export const SERVICE_IMAGES = {
  residential: '/images/services/office-commercial.jpg',
};

// ==================== Homepage ====================
export const HOMEPAGE_IMAGES = {
  banners: '/newbanner.jpg',
};

// ==================== About ====================
export const ABOUT_IMAGES = [
  '/images/about/mouhajer-studio.jpg',
  '/images/about/founder.jpg',
  '/images/about/team-at-work.jpg',
];

// ==================== Team ====================
export const TEAM_IMAGES = ['/images/team/maher.jpg'];

// ==================== Clients ====================
export const CLIENT_LOGOS = {
  logos: '/images/clients/sobha.png',
};

// Array of all client logos
export const CLIENT_LOGOS_ARRAY = Object.values(CLIENT_LOGOS);

// ==================== Awards ====================
export const AWARD_IMAGES = [
  '/images/awards/luxury-residential-2023.jpg',
  '/images/awards/sustainable-design-2022.jpg',
  '/images/awards/commercial-design-2021.jpg',
  '/images/awards/innovation-design-2022.jpg',
  '/ images/awards/hospitality-design-2023.jpg',
];

// ==================== Blog ====================
export const BLOG_IMAGES = [
  '/images/blog/smart-home-villa.jpg',
  '/images/blog/luxury-trends-2025.jpg',
  '/images/blog/cultural-fusion.jpg',
];

// ==================== Social ====================
export const SOCIAL_IMAGES = {
  instagram: [
    '/images/instagram/smart-home-control-panel.jpg',
    '/images/instagram/luxury-villa-pool-area.jpg',
    '/images/instagram/fine-dining-restaurant.jpg',
    '/images/instagram/gold-leaf-luxury.jpg',
    '/images/instagram/villa-living-luxury.jpg',
    '/images/instagram/luxury-master-bedroom.jpg',
  ],
};

// ==================== Misc ====================
export const MISC_IMAGES = {
  quotes:
    'https://tupbs9ia8fmtwvjh.public.blob.vercel-storage.com/images/1760006859454-quotes-I7hO18QuKzNcBBpnIWYig8G3hdbtpI.webp',
  viewOne:
    'https://tupbs9ia8fmtwvjh.public.blob.vercel-storage.com/images/1760006889357-viewOne-bEPPf39ZeMOd7sRwMVhJnwSPxK0ghA.webp',
  viewTwo:
    'https://tupbs9ia8fmtwvjh.public.blob.vercel-storage.com/images/1760006889306-viewTwo-MtktkZcbNZVQIL10YmKK4AtzXljpjQ.webp',
  secondImage:
    'https://tupbs9ia8fmtwvjh.public.blob.vercel-storage.com/images/1760006881771-secondimage-b8lLtvjVrYmsYKRnVdfqbFlFKJ87bE.webp',
  smallQuoteImage:
    'https://tupbs9ia8fmtwvjh.public.blob.vercel-storage.com/images/1760006881378-small%20iamge%20quote-80LiW32YRE3lZEdkqzQILZeKJiiEJu.webp',
  general: '/khaleejitimes.png',
};

// ==================== Component Assignments ====================
export const COMPONENT_IMAGES = {
  HeroBanner: ['/newbanner.jpg'],
  AboutSectionCarousel: [
    '/images/about/founder.jpg',
    '/images/about/mouhajer-studio.jpg',
    '/images/about/team-at-work.jpg',
  ],
  ProjectGallery: [
    '/images/projects/mansion-1-entrance.jpg',
    '/images/projects/mansion-1-main.jpg',
    '/images/projects/villa-1-kitchen.jpg',
    '/images/projects/villa-1-living.jpg',
    '/images/projects/villa-1-main.jpg',
  ],
  ServiceImages: [
    '/images/services/office-commercial.jpg',
    '/images/services/custom-furniture.jpg',
    '/images/services/villa-fitout.jpg',
  ],
  BlogFeatured: [
    '/images/blog/smart-home-villa.jpg',
    '/images/blog/luxury-trends-2025.jpg',
    '/images/blog/cultural-fusion.jpg',
  ],
  TeamMembers: ['/images/team/maher.jpg'],
  ClientLogos: [
    '/images/clients/sobha.png',
    '/images/clients/emaar.png',
    '/images/clients/deyaar.png',
    '/images/clients/damac.png',
    '/images/clients/dubai-properties.png',
    '/images/clients/nakheel.png',
    '/images/clients/omniyat.png',
    '/images/clients/select-group.png',
  ],
  AwardCertificates: [
    '/images/awards/luxury-residential-2023.jpg',
    '/images/awards/sustainable-design-2022.jpg',
    '/images/awards/commercial-design-2021.jpg',
    '/images/awards/innovation-design-2022.jpg',
    '/ images/awards/hospitality-design-2023.jpg',
  ],
  SocialInstagram: [
    '/images/instagram/smart-home-control-panel.jpg',
    '/images/instagram/luxury-villa-pool-area.jpg',
    '/images/instagram/fine-dining-restaurant.jpg',
    '/images/instagram/gold-leaf-luxury.jpg',
    '/images/instagram/villa-living-luxury.jpg',
    '/images/instagram/luxury-master-bedroom.jpg',
  ],
  PortfolioCarousel: [
    '/images/projects/villa-1-living.jpg',
    '/images/projects/villa-1-kitchen.jpg',
    '/images/projects/villa-1-main.jpg',
    '/images/projects/mansion-1-entrance.jpg',
    '/images/projects/mansion-1-main.jpg',
  ],
  ContactImages: [
    '/images/about/mouhajer-studio.jpg',
    '/images/about/founder.jpg',
    '/images/about/team-at-work.jpg',
  ],
  ErrorPages: ['/khaleejitimes.png', '/zawya.png', '/images/about/mouhajer-studio.jpg'],
};

// ==================== Random Image Helpers ====================
export function getRandomProjectImage(): string {
  const images = PROJECT_GALLERY_IMAGES;
  return images[Math.floor(Math.random() * images.length)];
}

export function getRandomServiceImage(): string {
  const images = Object.values(SERVICE_IMAGES);
  return images[Math.floor(Math.random() * images.length)];
}

export function getRandomAboutImage(): string {
  const images = ABOUT_IMAGES;
  return images[Math.floor(Math.random() * images.length)];
}

export function getRandomTeamImage(): string {
  const images = TEAM_IMAGES;
  return images[Math.floor(Math.random() * images.length)];
}

export function getRandomClientLogo(): string {
  const images = CLIENT_LOGOS_ARRAY;
  return images[Math.floor(Math.random() * images.length)];
}

export function getRandomAwardImage(): string {
  const images = AWARD_IMAGES;
  return images[Math.floor(Math.random() * images.length)];
}

export function getRandomBlogImage(): string {
  const images = BLOG_IMAGES;
  return images[Math.floor(Math.random() * images.length)];
}

export function getRandomSocialImage(): string {
  const images = SOCIAL_IMAGES.instagram;
  return images[Math.floor(Math.random() * images.length)];
}

// ==================== Missing Exports ====================
export const PLACEHOLDER_IMAGE = '/images/placeholder.jpg';
export const PORTFOLIO_CAROUSEL_IMAGES = COMPONENT_IMAGES.PortfolioCarousel;
export const ERROR_IMAGES = COMPONENT_IMAGES.ErrorPages;

// ==================== Statistics ====================
export const IMAGE_STATS = {
  totalImages: 62,
  categories: 10,
  projects: 13,
  services: 9,
  homepage: 1,
  about: 3,
  team: 1,
  clients: 10,
  awards: 5,
  blog: 4,
  social: 12,
  misc: 4,
};
