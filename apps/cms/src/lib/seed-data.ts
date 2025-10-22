import { db } from './db';

export function seedDatabase() {
  // Check if data already exists
  const existingProjects = db.getProjects();
  if (existingProjects.length > 0) {
    console.log('Database already seeded');
    return;
  }

  console.log('Seeding database with initial data...');

  // Seed Projects
  db.createProject({
    title: {
      en: 'Luxury Villa Interior Design',
      ar: 'تصميم داخلي لفيلا فاخرة'
    },
    description: {
      en: 'Complete interior transformation of a luxury villa in Dubai Marina with modern furnishings and elegant design elements.',
      ar: 'تحويل داخلي كامل لفيلا فاخرة في دبي مارينا مع أثاث حديث وعناصر تصميم أنيقة.'
    },
    images: ['/images/projects/villa-1-main.jpg', '/images/projects/villa-1-living.jpg'],
    category: 'Residential',
    featured: true,
  });

  db.createProject({
    title: {
      en: 'Modern Office Space Design',
      ar: 'تصميم مساحة مكتب حديثة'
    },
    description: {
      en: 'Contemporary office design for a tech company in DIFC featuring open spaces and collaborative areas.',
      ar: 'تصميم مكتب معاصر لشركة تقنية في مركز دبي المالي يتميز بالمساحات المفتوحة ومناطق التعاون.'
    },
    images: ['/images/projects/office-1-main.jpg'],
    category: 'Commercial',
    featured: false,
  });

  // Seed Services
  db.createService({
    title: {
      en: 'Interior Design Consultation',
      ar: 'استشارة التصميم الداخلي'
    },
    description: {
      en: 'Comprehensive interior design consultation including space planning, color schemes, furniture selection, and 3D visualization to bring your vision to life.',
      ar: 'استشارة شاملة للتصميم الداخلي تشمل تخطيط المساحة وأنظمة الألوان واختيار الأثاث والتصور ثلاثي الأبعاد لإحياء رؤيتك.'
    },
    shortDescription: {
      en: 'Professional design consultation and planning',
      ar: 'استشارة وتخطيط تصميم احترافي'
    },
    icon: 'design',
    features: {
      en: [
        'Space Planning & Layout Design',
        'Color Consultation & Material Selection',
        'Furniture & Lighting Selection',
        '3D Visualization & Renderings'
      ],
      ar: [
        'تخطيط المساحة وتصميم التخطيط',
        'استشارة الألوان واختيار المواد',
        'اختيار الأثاث والإضاءة',
        'التصور والعرض ثلاثي الأبعاد'
      ]
    },
    price: 'Starting from AED 5,000',
    featured: true,
  });

  db.createService({
    title: {
      en: 'Complete Home Renovation',
      ar: 'تجديد المنزل الكامل'
    },
    description: {
      en: 'Full-scale home renovation including structural changes, MEP systems, complete interior transformation, and project management from start to finish.',
      ar: 'تجديد شامل للمنزل يشمل التغييرات الهيكلية وأنظمة الكهرباء والسباكة والتحويل الداخلي الكامل وإدارة المشروع من البداية إلى النهاية.'
    },
    shortDescription: {
      en: 'Full home transformation and renovation',
      ar: 'تحويل وتجديد المنزل بالكامل'
    },
    icon: 'renovation',
    features: {
      en: [
        'Structural Modifications',
        'Electrical & Plumbing Systems',
        'Complete Interior Design',
        'Project Management & Coordination'
      ],
      ar: [
        'التعديلات الهيكلية',
        'أنظمة الكهرباء والسباكة',
        'التصميم الداخلي الكامل',
        'إدارة وتنسيق المشاريع'
      ]
    },
    price: 'Starting from AED 50,000',
    featured: false,
  });

  // Seed Blog Posts
  db.createBlogPost({
    title: {
      en: 'Latest Interior Design Trends for 2024',
      ar: 'أحدث اتجاهات التصميم الداخلي لعام 2024'
    },
    slug: {
      en: 'latest-interior-design-trends-2024',
      ar: 'احدث-اتجاهات-التصميم-الداخلي-2024'
    },
    excerpt: {
      en: 'Discover the most exciting interior design trends that will dominate 2024, from sustainable materials to bold color palettes.',
      ar: 'اكتشف أكثر اتجاهات التصميم الداخلي إثارة التي ستهيمن على عام 2024، من المواد المستدامة إلى لوحات الألوان الجريئة.'
    },
    content: {
      en: `
        <h2>Embracing Sustainability in Interior Design</h2>
        <p>2024 marks a significant shift towards sustainable and eco-friendly interior design practices. Designers are increasingly incorporating recycled materials, energy-efficient lighting, and locally sourced furnishings.</p>

        <h3>Key Trends to Watch:</h3>
        <ul>
          <li><strong>Biophilic Design:</strong> Bringing nature indoors with living walls, natural materials, and organic shapes</li>
          <li><strong>Warm Earth Tones:</strong> Rich terracotta, sage green, and warm ochre dominating color palettes</li>
          <li><strong>Curved Furniture:</strong> Soft, rounded edges replacing sharp angular designs</li>
          <li><strong>Textural Contrast:</strong> Mixing smooth and rough textures for visual interest</li>
        </ul>
      `,
      ar: `
        <h2>احتضان الاستدامة في التصميم الداخلي</h2>
        <p>يشهد عام 2024 تحولاً كبيراً نحو ممارسات التصميم الداخلي المستدامة والصديقة للبيئة. يقوم المصممون بدمج المواد المعاد تدويرها والإضاءة الموفرة للطاقة والأثاث المحلي بشكل متزايد.</p>

        <h3>الاتجاهات الرئيسية التي يجب مراقبتها:</h3>
        <ul>
          <li><strong>التصميم البيوفيلي:</strong> إدخال الطبيعة إلى الداخل مع الجدران الحية والمواد الطبيعية والأشكال العضوية</li>
          <li><strong>درجات الأرض الدافئة:</strong> التراكوتا الغنية والأخضر الحكيم والمغرة الدافئة تهيمن على لوحات الألوان</li>
        </ul>
      `
    },
    featuredImage: '/images/blog/interior-trends-2024.jpg',
    category: 'Design Trends',
    tags: ['interior design', 'trends', '2024', 'sustainability'],
    author: 'Mouhajer Design Team',
    publishedAt: new Date().toISOString(),
    featured: true,
    status: 'published',
  });

  // Seed Media Files
  db.createMediaFile({
    name: 'luxury-villa-main.jpg',
    originalName: 'luxury-villa-main.jpg',
    url: '/images/projects/villa-1-main.jpg',
    type: 'image',
    size: 1024000,
    alt: 'Luxury villa main view',
    caption: 'Main exterior view of luxury villa project'
  });

  db.createMediaFile({
    name: 'office-workspace.jpg',
    originalName: 'office-workspace.jpg',
    url: '/images/projects/office-1-workspace.jpg',
    type: 'image',
    size: 856000,
    alt: 'Modern office workspace',
    caption: 'Contemporary office workspace design'
  });

  console.log('Database seeded successfully!');
}