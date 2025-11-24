// Furniture Showroom Product Data

export interface FurnitureProduct {
  id: string;
  name: string;
  slug: string;
  category: 'seating' | 'tables' | 'storage' | 'beds' | 'lighting' | 'accessories';
  subcategory: string;
  price: number;
  salePrice?: number;
  currency: string;
  description: string;
  features: string[];
  materials: string[];
  dimensions: {
    width: string;
    height: string;
    depth: string;
  };
  colors: Array<{
    name: string;
    hex: string;
    image: string;
  }>;
  images: string[];
  inStock: boolean;
  isFeatured: boolean;
  isNew: boolean;
  customizable: boolean;
  leadTime: string;
  tags: string[];
}

export const furnitureProducts: FurnitureProduct[] = [
  {
    id: '1',
    name: 'Monarch Velvet Sofa',
    slug: 'monarch-velvet-sofa',
    category: 'seating',
    subcategory: 'Sofas',
    price: 45000,
    currency: 'AED',
    description: 'An exquisite three-seater sofa featuring premium Italian velvet upholstery and solid oak frame. The Monarch combines timeless elegance with contemporary comfort, perfect for luxurious living spaces.',
    features: [
      'Premium Italian velvet upholstery',
      'Solid oak hardwood frame',
      'High-density foam cushioning',
      'Hand-tufted back cushions',
      'Removable cushion covers',
      'Custom sizing available',
    ],
    materials: ['Italian Velvet', 'Oak Wood', 'High-Density Foam', 'Brass Accents'],
    dimensions: {
      width: '240cm',
      height: '85cm',
      depth: '95cm',
    },
    colors: [
      { name: 'Emerald Green', hex: '#2d5016', image: '/images/furniture/sofa-green.jpg' },
      { name: 'Navy Blue', hex: '#1a2332', image: '/images/furniture/sofa-navy.jpg' },
      { name: 'Blush Pink', hex: '#e8b4b8', image: '/images/furniture/sofa-pink.jpg' },
      { name: 'Charcoal Grey', hex: '#36454f', image: '/images/furniture/sofa-grey.jpg' },
    ],
    images: [
      '/images/furniture/monarch-sofa-1.jpg',
      '/images/furniture/monarch-sofa-2.jpg',
      '/images/furniture/monarch-sofa-3.jpg',
      '/images/furniture/monarch-sofa-4.jpg',
    ],
    inStock: true,
    isFeatured: true,
    isNew: false,
    customizable: true,
    leadTime: '6-8 weeks',
    tags: ['luxury', 'velvet', 'contemporary', 'italian-design'],
  },
  {
    id: '2',
    name: 'Metropolitan Dining Table',
    slug: 'metropolitan-dining-table',
    category: 'tables',
    subcategory: 'Dining Tables',
    price: 38000,
    salePrice: 32000,
    currency: 'AED',
    description: 'A stunning live-edge walnut dining table featuring a unique natural edge and elegant brass inlay. Each piece is one-of-a-kind, showcasing the natural beauty of solid walnut wood.',
    features: [
      'Solid American walnut wood',
      'Natural live edge design',
      'Brass inlay detailing',
      'Seats 8-10 people comfortably',
      'Hand-finished with natural oil',
      'Metal base with brass finish',
    ],
    materials: ['American Walnut', 'Brass', 'Steel Base'],
    dimensions: {
      width: '280cm',
      height: '76cm',
      depth: '110cm',
    },
    colors: [
      { name: 'Natural Walnut', hex: '#5d4037', image: '/images/furniture/table-walnut.jpg' },
      { name: 'Dark Oak', hex: '#3e2723', image: '/images/furniture/table-oak.jpg' },
    ],
    images: [
      '/images/furniture/metropolitan-table-1.jpg',
      '/images/furniture/metropolitan-table-2.jpg',
      '/images/furniture/metropolitan-table-3.jpg',
    ],
    inStock: true,
    isFeatured: true,
    isNew: false,
    customizable: true,
    leadTime: '8-10 weeks',
    tags: ['dining', 'live-edge', 'walnut', 'modern'],
  },
  {
    id: '3',
    name: 'Atlas Modular Sectional',
    slug: 'atlas-modular-sectional',
    category: 'seating',
    subcategory: 'Sectionals',
    price: 52000,
    currency: 'AED',
    description: 'A versatile modular sectional system that adapts to your space. Premium leather upholstery meets contemporary design with adjustable configurations for ultimate flexibility.',
    features: [
      'Full-grain Italian leather',
      'Modular design - 12 configurations',
      'Adjustable headrests',
      'Built-in USB charging ports',
      'Feather-down cushions',
      'Lifetime frame warranty',
    ],
    materials: ['Italian Leather', 'Hardwood Frame', 'Feather Down', 'Stainless Steel Legs'],
    dimensions: {
      width: '320cm',
      height: '88cm',
      depth: '175cm',
    },
    colors: [
      { name: 'Cognac Brown', hex: '#8b4513', image: '/images/furniture/sectional-cognac.jpg' },
      { name: 'Pure White', hex: '#f5f5f5', image: '/images/furniture/sectional-white.jpg' },
      { name: 'Slate Grey', hex: '#708090', image: '/images/furniture/sectional-grey.jpg' },
    ],
    images: [
      '/images/furniture/atlas-sectional-1.jpg',
      '/images/furniture/atlas-sectional-2.jpg',
      '/images/furniture/atlas-sectional-3.jpg',
      '/images/furniture/atlas-sectional-4.jpg',
    ],
    inStock: true,
    isFeatured: true,
    isNew: true,
    customizable: true,
    leadTime: '10-12 weeks',
    tags: ['sectional', 'leather', 'modular', 'contemporary'],
  },
  {
    id: '4',
    name: 'Renaissance Bed Frame',
    slug: 'renaissance-bed-frame',
    category: 'beds',
    subcategory: 'King Beds',
    price: 42000,
    currency: 'AED',
    description: 'An opulent king-size bed featuring an oversized upholstered headboard with hand-tufted detailing. The Renaissance brings five-star hotel luxury to your bedroom.',
    features: [
      'Hand-tufted headboard',
      'Premium linen upholstery',
      'Solid birch wood frame',
      'Button-detailed design',
      'Under-bed storage compatible',
      'King size (180x200cm)',
    ],
    materials: ['Belgian Linen', 'Birch Wood', 'High-Density Foam', 'Brass Hardware'],
    dimensions: {
      width: '200cm',
      height: '145cm',
      depth: '220cm',
    },
    colors: [
      { name: 'Warm Beige', hex: '#d4c5b9', image: '/images/furniture/bed-beige.jpg' },
      { name: 'Deep Navy', hex: '#000080', image: '/images/furniture/bed-navy.jpg' },
      { name: 'Charcoal', hex: '#36454f', image: '/images/furniture/bed-charcoal.jpg' },
    ],
    images: [
      '/images/furniture/renaissance-bed-1.jpg',
      '/images/furniture/renaissance-bed-2.jpg',
      '/images/furniture/renaissance-bed-3.jpg',
    ],
    inStock: true,
    isFeatured: false,
    isNew: false,
    customizable: true,
    leadTime: '6-8 weeks',
    tags: ['bedroom', 'luxury', 'upholstered', 'king-size'],
  },
  {
    id: '5',
    name: 'Horizon Console Table',
    slug: 'horizon-console-table',
    category: 'tables',
    subcategory: 'Console Tables',
    price: 18000,
    currency: 'AED',
    description: 'A sleek console table featuring a floating marble top and geometric brass base. Perfect for entryways or behind sofas, the Horizon adds sculptural elegance to any space.',
    features: [
      'Italian Carrara marble top',
      'Hand-finished brass base',
      'Geometric contemporary design',
      'Hidden cable management',
      'Anti-scratch protective coating',
      'Easy assembly',
    ],
    materials: ['Carrara Marble', 'Solid Brass', 'Tempered Glass Shelf'],
    dimensions: {
      width: '160cm',
      height: '85cm',
      depth: '40cm',
    },
    colors: [
      { name: 'White Marble/Brass', hex: '#f8f8f8', image: '/images/furniture/console-white.jpg' },
      { name: 'Black Marble/Black Steel', hex: '#1c1c1c', image: '/images/furniture/console-black.jpg' },
    ],
    images: [
      '/images/furniture/horizon-console-1.jpg',
      '/images/furniture/horizon-console-2.jpg',
      '/images/furniture/horizon-console-3.jpg',
    ],
    inStock: true,
    isFeatured: false,
    isNew: true,
    customizable: false,
    leadTime: '4-6 weeks',
    tags: ['console', 'marble', 'brass', 'contemporary'],
  },
  {
    id: '6',
    name: 'Cascade Chandelier',
    slug: 'cascade-chandelier',
    category: 'lighting',
    subcategory: 'Chandeliers',
    price: 28000,
    currency: 'AED',
    description: 'A breathtaking statement chandelier featuring hand-blown glass elements arranged in a cascading design. The Cascade creates dramatic ambiance with adjustable LED lighting.',
    features: [
      'Hand-blown glass elements',
      'Adjustable LED lighting',
      'Dimmable with remote control',
      'Brass or chrome finish',
      'Custom height adjustment',
      '3-year warranty',
    ],
    materials: ['Hand-Blown Glass', 'Brass/Chrome', 'LED Bulbs Included'],
    dimensions: {
      width: '90cm',
      height: '120cm (adjustable)',
      depth: '90cm',
    },
    colors: [
      { name: 'Clear Glass/Brass', hex: '#b8860b', image: '/images/furniture/chandelier-brass.jpg' },
      { name: 'Amber Glass/Chrome', hex: '#c0c0c0', image: '/images/furniture/chandelier-chrome.jpg' },
    ],
    images: [
      '/images/furniture/cascade-chandelier-1.jpg',
      '/images/furniture/cascade-chandelier-2.jpg',
      '/images/furniture/cascade-chandelier-3.jpg',
    ],
    inStock: true,
    isFeatured: true,
    isNew: true,
    customizable: true,
    leadTime: '8-10 weeks',
    tags: ['lighting', 'chandelier', 'statement', 'luxury'],
  },
  {
    id: '7',
    name: 'Artisan Sideboard',
    slug: 'artisan-sideboard',
    category: 'storage',
    subcategory: 'Sideboards',
    price: 35000,
    currency: 'AED',
    description: 'A masterpiece of craftsmanship featuring intricate marquetry and hand-carved details. This sideboard combines storage functionality with artistic expression.',
    features: [
      'Hand-carved walnut wood',
      'Intricate marquetry details',
      'Soft-close drawers and doors',
      'Interior LED lighting',
      'Adjustable shelving',
      'Handmade by master craftsmen',
    ],
    materials: ['Walnut Wood', 'Brass Hardware', 'Leather-Lined Drawers'],
    dimensions: {
      width: '220cm',
      height: '90cm',
      depth: '50cm',
    },
    colors: [
      { name: 'Natural Walnut', hex: '#5d4037', image: '/images/furniture/sideboard-walnut.jpg' },
      { name: 'Ebony Black', hex: '#0a0a0a', image: '/images/furniture/sideboard-black.jpg' },
    ],
    images: [
      '/images/furniture/artisan-sideboard-1.jpg',
      '/images/furniture/artisan-sideboard-2.jpg',
      '/images/furniture/artisan-sideboard-3.jpg',
    ],
    inStock: true,
    isFeatured: false,
    isNew: false,
    customizable: true,
    leadTime: '12-14 weeks',
    tags: ['storage', 'handcrafted', 'marquetry', 'luxury'],
  },
  {
    id: '8',
    name: 'Luxe Lounge Chair',
    slug: 'luxe-lounge-chair',
    category: 'seating',
    subcategory: 'Accent Chairs',
    price: 22000,
    currency: 'AED',
    description: 'An iconic mid-century inspired lounge chair with contemporary luxury. Premium leather upholstery meets ergonomic design for the ultimate reading chair.',
    features: [
      'Full-grain aniline leather',
      'Ergonomic curved design',
      'Solid walnut wood frame',
      'Swivel base option',
      'Ottoman included',
      'Five leather color options',
    ],
    materials: ['Aniline Leather', 'Walnut Wood', 'Aluminum Base'],
    dimensions: {
      width: '85cm',
      height: '82cm',
      depth: '85cm',
    },
    colors: [
      { name: 'Caramel', hex: '#c68642', image: '/images/furniture/chair-caramel.jpg' },
      { name: 'Black', hex: '#000000', image: '/images/furniture/chair-black.jpg' },
      { name: 'Cognac', hex: '#9a4500', image: '/images/furniture/chair-cognac.jpg' },
    ],
    images: [
      '/images/furniture/luxe-chair-1.jpg',
      '/images/furniture/luxe-chair-2.jpg',
      '/images/furniture/luxe-chair-3.jpg',
    ],
    inStock: true,
    isFeatured: false,
    isNew: false,
    customizable: false,
    leadTime: '6-8 weeks',
    tags: ['accent-chair', 'mid-century', 'leather', 'iconic'],
  },
  {
    id: '9',
    name: 'Infinity Coffee Table',
    slug: 'infinity-coffee-table',
    category: 'tables',
    subcategory: 'Coffee Tables',
    price: 24000,
    currency: 'AED',
    description: 'An architectural statement piece featuring a continuous loop design in polished stainless steel with a glass top. The Infinity defies gravity with its sculptural form.',
    features: [
      'Sculptural stainless steel base',
      'Tempered glass top',
      'Mirror or brushed finish',
      'Unique conversation piece',
      'Museum-quality construction',
      'Limited edition',
    ],
    materials: ['Stainless Steel', 'Tempered Glass', 'Polished Finish'],
    dimensions: {
      width: '130cm',
      height: '40cm',
      depth: '80cm',
    },
    colors: [
      { name: 'Polished Silver', hex: '#c0c0c0', image: '/images/furniture/coffee-silver.jpg' },
      { name: 'Rose Gold', hex: '#b76e79', image: '/images/furniture/coffee-rose.jpg' },
    ],
    images: [
      '/images/furniture/infinity-coffee-1.jpg',
      '/images/furniture/infinity-coffee-2.jpg',
      '/images/furniture/infinity-coffee-3.jpg',
    ],
    inStock: false,
    isFeatured: true,
    isNew: true,
    customizable: false,
    leadTime: '14-16 weeks',
    tags: ['coffee-table', 'sculptural', 'contemporary', 'statement'],
  },
  {
    id: '10',
    name: 'Sanctuary Wardrobe',
    slug: 'sanctuary-wardrobe',
    category: 'storage',
    subcategory: 'Wardrobes',
    price: 68000,
    currency: 'AED',
    description: 'A bespoke walk-in wardrobe system featuring floor-to-ceiling storage with integrated lighting and mirrors. Transform your dressing room into a luxury boutique.',
    features: [
      'Floor-to-ceiling design',
      'Integrated LED lighting',
      'Full-length mirrors',
      'Jewelry drawer inserts',
      'Soft-close mechanisms',
      'Fully customizable layout',
    ],
    materials: ['Oak Veneer', 'Brass Hardware', 'Leather Detailing', 'Mirror Glass'],
    dimensions: {
      width: '400cm',
      height: '280cm',
      depth: '65cm',
    },
    colors: [
      { name: 'White Oak', hex: '#f5f5dc', image: '/images/furniture/wardrobe-oak.jpg' },
      { name: 'Graphite Grey', hex: '#36454f', image: '/images/furniture/wardrobe-grey.jpg' },
    ],
    images: [
      '/images/furniture/sanctuary-wardrobe-1.jpg',
      '/images/furniture/sanctuary-wardrobe-2.jpg',
      '/images/furniture/sanctuary-wardrobe-3.jpg',
      '/images/furniture/sanctuary-wardrobe-4.jpg',
    ],
    inStock: true,
    isFeatured: true,
    isNew: false,
    customizable: true,
    leadTime: '12-16 weeks',
    tags: ['wardrobe', 'storage', 'walk-in', 'bespoke'],
  },
  {
    id: '11',
    name: 'Celestial Mirror',
    slug: 'celestial-mirror',
    category: 'accessories',
    subcategory: 'Mirrors',
    price: 12000,
    currency: 'AED',
    description: 'A stunning circular mirror featuring a hand-crafted brass sunburst frame. The Celestial adds dramatic flair to entryways, bedrooms, or living spaces.',
    features: [
      'Hand-crafted brass frame',
      'Beveled mirror glass',
      'Sunburst design',
      'Anti-tarnish coating',
      'Ready to hang',
      'Multiple sizes available',
    ],
    materials: ['Brass', 'Beveled Mirror Glass'],
    dimensions: {
      width: '120cm diameter',
      height: '120cm diameter',
      depth: '5cm',
    },
    colors: [
      { name: 'Antique Brass', hex: '#b8860b', image: '/images/furniture/mirror-brass.jpg' },
      { name: 'Matte Black', hex: '#000000', image: '/images/furniture/mirror-black.jpg' },
    ],
    images: [
      '/images/furniture/celestial-mirror-1.jpg',
      '/images/furniture/celestial-mirror-2.jpg',
    ],
    inStock: true,
    isFeatured: false,
    isNew: false,
    customizable: false,
    leadTime: '4-5 weeks',
    tags: ['mirror', 'brass', 'statement', 'decorative'],
  },
  {
    id: '12',
    name: 'Haven Daybed',
    slug: 'haven-daybed',
    category: 'seating',
    subcategory: 'Daybeds',
    price: 38000,
    currency: 'AED',
    description: 'A versatile daybed that serves as seating by day and sleeping by night. Upholstered in luxurious bouclé fabric with a sculptural curved design.',
    features: [
      'Bouclé fabric upholstery',
      'Curved contemporary design',
      'Hidden storage underneath',
      'Converts to single bed',
      'Premium comfort foam',
      'Left or right configuration',
    ],
    materials: ['Bouclé Fabric', 'Hardwood Frame', 'High-Density Foam'],
    dimensions: {
      width: '200cm',
      height: '75cm',
      depth: '95cm',
    },
    colors: [
      { name: 'Cream Bouclé', hex: '#f5f5dc', image: '/images/furniture/daybed-cream.jpg' },
      { name: 'Sage Green', hex: '#9caf88', image: '/images/furniture/daybed-sage.jpg' },
    ],
    images: [
      '/images/furniture/haven-daybed-1.jpg',
      '/images/furniture/haven-daybed-2.jpg',
      '/images/furniture/haven-daybed-3.jpg',
    ],
    inStock: true,
    isFeatured: false,
    isNew: true,
    customizable: true,
    leadTime: '8-10 weeks',
    tags: ['daybed', 'boucle', 'versatile', 'contemporary'],
  },
];

// Filter and category functions
export function getProductsByCategory(category: string): FurnitureProduct[] {
  return furnitureProducts.filter(p => p.category === category);
}

export function getFeaturedProducts(): FurnitureProduct[] {
  return furnitureProducts.filter(p => p.isFeatured);
}

export function getNewProducts(): FurnitureProduct[] {
  return furnitureProducts.filter(p => p.isNew);
}

export function getProductBySlug(slug: string): FurnitureProduct | undefined {
  return furnitureProducts.find(p => p.slug === slug);
}

export const categories = [
  { value: 'all', label: 'All Furniture', count: furnitureProducts.length },
  { value: 'seating', label: 'Seating', count: getProductsByCategory('seating').length },
  { value: 'tables', label: 'Tables', count: getProductsByCategory('tables').length },
  { value: 'storage', label: 'Storage', count: getProductsByCategory('storage').length },
  { value: 'beds', label: 'Beds', count: getProductsByCategory('beds').length },
  { value: 'lighting', label: 'Lighting', count: getProductsByCategory('lighting').length },
  { value: 'accessories', label: 'Accessories', count: getProductsByCategory('accessories').length },
];

export const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name-az', label: 'Name: A to Z' },
];
