/**
 * Database Seed Script
 * Migrates data from JSON files to PostgreSQL
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Helper to read JSON file
function readJSONFile(filename: string): any {
  const filePath = path.join(process.cwd(), 'data', filename);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filename}`);
    return null;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

// Transform Projects
async function seedProjects() {
  console.log('📦 Seeding Projects...');
  const projects = readJSONFile('projects.json');
  if (!projects || !Array.isArray(projects)) {
    console.log('No projects to seed');
    return;
  }

  for (const project of projects) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: {
        titleEn: project.title.en,
        titleAr: project.title.ar,
        descriptionEn: project.description.en,
        descriptionAr: project.description.ar,
        images: project.images || [],
        category: project.category || 'Uncategorized',
        featured: project.featured || false,
        status: project.status || 'published',
        updatedAt: new Date(project.updatedAt || Date.now()),
      },
      create: {
        id: project.id,
        titleEn: project.title.en,
        titleAr: project.title.ar,
        descriptionEn: project.description.en,
        descriptionAr: project.description.ar,
        images: project.images || [],
        category: project.category || 'Uncategorized',
        featured: project.featured || false,
        status: project.status || 'published',
        createdAt: new Date(project.createdAt || Date.now()),
        updatedAt: new Date(project.updatedAt || Date.now()),
      },
    });
  }
  console.log(`✅ Seeded ${projects.length} projects`);
}

// Transform Services
async function seedServices() {
  console.log('🛠️  Seeding Services...');
  const services = readJSONFile('services.json');
  if (!services || !Array.isArray(services)) {
    console.log('No services to seed');
    return;
  }

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: {
        titleEn: service.title.en,
        titleAr: service.title.ar,
        descriptionEn: service.description.en,
        descriptionAr: service.description.ar,
        shortDescriptionEn: service.shortDescription?.en || service.description.en,
        shortDescriptionAr: service.shortDescription?.ar || service.description.ar,
        icon: service.icon || null,
        featuresEn: service.features?.en || [],
        featuresAr: service.features?.ar || [],
        price: service.price || null,
        duration: service.duration || null,
        featured: service.featured || false,
        status: service.status || 'published',
        updatedAt: new Date(service.updatedAt || Date.now()),
      },
      create: {
        id: service.id,
        titleEn: service.title.en,
        titleAr: service.title.ar,
        descriptionEn: service.description.en,
        descriptionAr: service.description.ar,
        shortDescriptionEn: service.shortDescription?.en || service.description.en,
        shortDescriptionAr: service.shortDescription?.ar || service.description.ar,
        icon: service.icon || null,
        featuresEn: service.features?.en || [],
        featuresAr: service.features?.ar || [],
        price: service.price || null,
        duration: service.duration || null,
        featured: service.featured || false,
        status: service.status || 'published',
        createdAt: new Date(service.createdAt || Date.now()),
        updatedAt: new Date(service.updatedAt || Date.now()),
      },
    });
  }
  console.log(`✅ Seeded ${services.length} services`);
}

// Transform Blog Posts
async function seedBlogPosts() {
  console.log('📝 Seeding Blog Posts...');
  const posts = readJSONFile('blog-posts.json');
  if (!posts || !Array.isArray(posts)) {
    console.log('No blog posts to seed');
    return;
  }

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { id: post.id },
      update: {
        titleEn: post.title.en,
        titleAr: post.title.ar,
        slugEn: post.slug?.en || post.slugEn,
        slugAr: post.slug?.ar || post.slugAr,
        excerptEn: post.excerpt?.en || post.excerptEn,
        excerptAr: post.excerpt?.ar || post.excerptAr,
        contentEn: post.content?.en || post.contentEn,
        contentAr: post.content?.ar || post.contentAr,
        featuredImage: post.featuredImage || null,
        category: post.category || post.categoryEn || null,
        tags: post.tags || [],
        author: post.author || post.authorEn || null,
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
        featured: post.featured || false,
        status: post.status || 'draft',
        updatedAt: new Date(post.updatedAt || Date.now()),
      },
      create: {
        id: post.id,
        titleEn: post.title.en,
        titleAr: post.title.ar,
        slugEn: post.slug?.en || post.slugEn,
        slugAr: post.slug?.ar || post.slugAr,
        excerptEn: post.excerpt?.en || post.excerptEn,
        excerptAr: post.excerpt?.ar || post.excerptAr,
        contentEn: post.content?.en || post.contentEn,
        contentAr: post.content?.ar || post.contentAr,
        featuredImage: post.featuredImage || null,
        category: post.category || post.categoryEn || null,
        tags: post.tags || [],
        author: post.author || post.authorEn || null,
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
        featured: post.featured || false,
        status: post.status || 'draft',
        createdAt: new Date(post.createdAt || Date.now()),
        updatedAt: new Date(post.updatedAt || Date.now()),
      },
    });
  }
  console.log(`✅ Seeded ${posts.length} blog posts`);
}

// Transform Pages with Blocks
async function seedPages() {
  console.log('📄 Seeding Pages...');
  const pages = readJSONFile('pages.json');
  const additionalPages = readJSONFile('pages-additional.json');

  const allPages = [
    ...(Array.isArray(pages) ? pages : []),
    ...(Array.isArray(additionalPages) ? additionalPages : [])
  ];

  if (allPages.length === 0) {
    console.log('No pages to seed');
    return;
  }

  for (const page of allPages) {
    // First, delete existing page and its blocks by slug (cascade will handle blocks)
    await prisma.page.deleteMany({
      where: { slugEn: page.slug.en },
    });

    // Create new page with blocks
    await prisma.page.create({
      data: {
        id: page.id,
        titleEn: page.title.en,
        titleAr: page.title.ar,
        slugEn: page.slug.en,
        slugAr: page.slug.ar,
        descriptionEn: page.description.en,
        descriptionAr: page.description.ar,
        seoMetaTitleEn: page.seo?.metaTitle?.en || null,
        seoMetaTitleAr: page.seo?.metaTitle?.ar || null,
        seoMetaDescEn: page.seo?.metaDescription?.en || null,
        seoMetaDescAr: page.seo?.metaDescription?.ar || null,
        seoKeywords: page.seo?.keywords || [],
        status: page.status || 'draft',
        featured: page.featured || false,
        createdAt: new Date(page.createdAt || Date.now()),
        updatedAt: new Date(page.updatedAt || Date.now()),
        blocks: {
          create: (page.blocks || []).map((block: any) => ({
            id: block.id,
            type: block.type,
            data: block.data || {},
            order: block.order || 0,
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now()),
          })),
        },
      },
    });
  }
  console.log(`✅ Seeded ${allPages.length} pages`);
}

// Transform Settings
async function seedSettings() {
  console.log('⚙️  Seeding Settings...');
  const settings = readJSONFile('settings.json');
  if (!settings) {
    console.log('No settings to seed');
    return;
  }

  // Combine English and Arabic keywords into a single array
  const allKeywords = [
    ...(settings.seo?.keywords?.en || []),
    ...(settings.seo?.keywords?.ar || []),
  ];

  await prisma.settings.upsert({
    where: { id: 'default' },
    update: {
      siteNameEn: settings.siteName?.en || 'Mouhajer Design',
      siteNameAr: settings.siteName?.ar || 'مهاجر ديزاين',
      siteDescriptionEn: settings.siteDescription?.en || '',
      siteDescriptionAr: settings.siteDescription?.ar || '',
      contactEmail: settings.contactEmail || null,
      contactPhone: settings.contactPhone || null,
      contactAddressEn: settings.address?.en || null,
      contactAddressAr: settings.address?.ar || null,
      socialFacebook: settings.socialMedia?.facebook || null,
      socialInstagram: settings.socialMedia?.instagram || null,
      socialTwitter: settings.socialMedia?.twitter || null,
      socialLinkedin: settings.socialMedia?.linkedin || null,
      socialYoutube: settings.socialMedia?.youtube || null,
      seoMetaTitleEn: settings.seo?.defaultTitle?.en || null,
      seoMetaTitleAr: settings.seo?.defaultTitle?.ar || null,
      seoMetaDescriptionEn: settings.seo?.defaultDescription?.en || null,
      seoMetaDescriptionAr: settings.seo?.defaultDescription?.ar || null,
      seoKeywords: allKeywords,
      primaryColor: settings.appearance?.primaryColor || null,
      logoUrl: settings.appearance?.logo || null,
      faviconUrl: settings.appearance?.favicon || null,
      updatedAt: new Date(),
    },
    create: {
      id: 'default',
      siteNameEn: settings.siteName?.en || 'Mouhajer Design',
      siteNameAr: settings.siteName?.ar || 'مهاجر ديزاين',
      siteDescriptionEn: settings.siteDescription?.en || '',
      siteDescriptionAr: settings.siteDescription?.ar || '',
      contactEmail: settings.contactEmail || null,
      contactPhone: settings.contactPhone || null,
      contactAddressEn: settings.address?.en || null,
      contactAddressAr: settings.address?.ar || null,
      socialFacebook: settings.socialMedia?.facebook || null,
      socialInstagram: settings.socialMedia?.instagram || null,
      socialTwitter: settings.socialMedia?.twitter || null,
      socialLinkedin: settings.socialMedia?.linkedin || null,
      socialYoutube: settings.socialMedia?.youtube || null,
      seoMetaTitleEn: settings.seo?.defaultTitle?.en || null,
      seoMetaTitleAr: settings.seo?.defaultTitle?.ar || null,
      seoMetaDescriptionEn: settings.seo?.defaultDescription?.en || null,
      seoMetaDescriptionAr: settings.seo?.defaultDescription?.ar || null,
      seoKeywords: allKeywords,
      primaryColor: settings.appearance?.primaryColor || null,
      logoUrl: settings.appearance?.logo || null,
      faviconUrl: settings.appearance?.favicon || null,
      updatedAt: new Date(),
    },
  });
  console.log('✅ Seeded settings');
}

// Transform Advertisements
async function seedAdvertisements() {
  console.log('📢 Seeding Advertisements...');
  const ads = readJSONFile('advertisements.json');
  if (!ads || !Array.isArray(ads)) {
    console.log('No advertisements to seed');
    return;
  }

  for (const ad of ads) {
    await prisma.advertisement.upsert({
      where: { id: ad.id },
      update: {
        titleEn: ad.title.en,
        titleAr: ad.title.ar,
        descriptionEn: ad.description?.en || null,
        descriptionAr: ad.description?.ar || null,
        image: ad.image || null,
        videoUrl: ad.videoUrl || null,
        linkUrl: ad.linkUrl,
        ctaTextEn: ad.ctaText?.en || null,
        ctaTextAr: ad.ctaText?.ar || null,
        zone: ad.zone,
        type: ad.type,
        htmlContentEn: ad.htmlContent?.en || null,
        htmlContentAr: ad.htmlContent?.ar || null,
        startDate: new Date(ad.startDate),
        endDate: new Date(ad.endDate),
        alwaysActive: ad.alwaysActive || false,
        pages: ad.pages || [],
        showOnAllPages: ad.showOnAllPages || false,
        priority: ad.priority || 0,
        clickCount: ad.clickCount || 0,
        impressionCount: ad.impressionCount || 0,
        maxImpressions: ad.maxImpressions || null,
        active: ad.active !== false,
        featured: ad.featured || false,
        updatedAt: new Date(ad.updatedAt || Date.now()),
      },
      create: {
        id: ad.id,
        titleEn: ad.title.en,
        titleAr: ad.title.ar,
        descriptionEn: ad.description?.en || null,
        descriptionAr: ad.description?.ar || null,
        image: ad.image || null,
        videoUrl: ad.videoUrl || null,
        linkUrl: ad.linkUrl,
        ctaTextEn: ad.ctaText?.en || null,
        ctaTextAr: ad.ctaText?.ar || null,
        zone: ad.zone,
        type: ad.type,
        htmlContentEn: ad.htmlContent?.en || null,
        htmlContentAr: ad.htmlContent?.ar || null,
        startDate: new Date(ad.startDate),
        endDate: new Date(ad.endDate),
        alwaysActive: ad.alwaysActive || false,
        pages: ad.pages || [],
        showOnAllPages: ad.showOnAllPages || false,
        priority: ad.priority || 0,
        clickCount: ad.clickCount || 0,
        impressionCount: ad.impressionCount || 0,
        maxImpressions: ad.maxImpressions || null,
        active: ad.active !== false,
        featured: ad.featured || false,
        createdAt: new Date(ad.createdAt || Date.now()),
        updatedAt: new Date(ad.updatedAt || Date.now()),
      },
    });
  }
  console.log(`✅ Seeded ${ads.length} advertisements`);
}

// Create Users
async function seedUsers() {
  console.log('👤 Seeding Users...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@mouhajerdesign.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@mouhajerdesign.com',
      password: adminPassword,
      role: 'admin',
      active: true,
    },
  });

  const editorPassword = await bcrypt.hash('editor123', 10);
  await prisma.user.upsert({
    where: { email: 'editor@mouhajerdesign.com' },
    update: {},
    create: {
      name: 'Editor User',
      email: 'editor@mouhajerdesign.com',
      password: editorPassword,
      role: 'editor',
      active: true,
    },
  });

  console.log('✅ Seeded users');
  console.log('   Admin: admin@mouhajerdesign.com / admin123');
  console.log('   Editor: editor@mouhajerdesign.com / editor123');
}

// Seed Premium Content
async function seedPremiumContent() {
  console.log('🎨 Seeding Premium Content...');
  
  // Additional Premium Projects
  const premiumProjects = [
    {
      id: 'proj-015-luxury-yacht-interior',
      titleEn: 'Luxury Yacht Interior Design - Dubai Marina',
      titleAr: 'تصميم داخلي يخت فاخر - مرسى دبي',
      descriptionEn: 'A breathtaking 120-foot luxury yacht interior featuring Italian leather, teak decking, mother-of-pearl inlays, and state-of-the-art navigation systems. The design maximizes space efficiency while maintaining opulent comfort for 12 guests across 6 staterooms. Custom furniture pieces are secured for maritime conditions while providing hotel-level luxury. The main salon features panoramic windows, a marble bar, and entertainment systems integrated seamlessly into the design.',
      descriptionAr: 'تصميم داخلي مذهل ليخت فاخر بطول 120 قدم يتميز بالجلد الإيطالي وأرضية خشب الساج وتطعيمات عرق اللؤلؤ وأنظمة ملاحة متطورة. يزيد التصميم من كفاءة المساحة مع الحفاظ على الراحة الفخمة لـ 12 ضيف عبر 6 غرف نوم.',
      images: ['/images/projects/yacht-interior-main.jpg', '/images/projects/yacht-salon.jpg'],
      category: 'Marine Design',
      featured: true,
      status: 'published',
      createdAt: new Date('2024-12-01T10:00:00Z'),
      updatedAt: new Date('2024-12-15T10:00:00Z')
    },
    {
      id: 'proj-016-private-jet-interior',
      titleEn: 'Private Jet Interior - Gulfstream G650',
      titleAr: 'تصميم داخلي طائرة خاصة - جلف ستريم G650',
      descriptionEn: 'Ultra-luxury private jet interior design for a Gulfstream G650, accommodating 14 passengers in supreme comfort. Features include handcrafted leather seating, gold-plated fixtures, marble surfaces, and advanced entertainment systems. The cabin layout optimizes space with a conference area, private bedroom, and full galley. Every detail is engineered for high-altitude luxury while meeting strict aviation safety standards.',
      descriptionAr: 'تصميم داخلي فائق الفخامة لطائرة خاصة جلف ستريم G650، تستوعب 14 راكب في راحة عليا. تشمل المميزات مقاعد جلدية مصنوعة يدوياً وتركيبات مطلية بالذهب وأسطح رخامية وأنظمة ترفيه متقدمة.',
      images: ['/images/projects/jet-interior-main.jpg'],
      category: 'Aviation Design',
      featured: true,
      status: 'published',
      createdAt: new Date('2024-11-20T10:00:00Z'),
      updatedAt: new Date('2024-12-10T10:00:00Z')
    },
    {
      id: 'proj-017-royal-palace-renovation',
      titleEn: 'Royal Palace Wing Renovation - Abu Dhabi',
      titleAr: 'تجديد جناح القصر الملكي - أبوظبي',
      descriptionEn: 'A prestigious palace wing renovation spanning 15,000 sq ft, featuring hand-painted ceilings, imported Italian marble, gold leaf detailing, and priceless antique integration. The project required specialized conservation techniques to preserve historical elements while incorporating modern amenities. Custom-woven Persian carpets, crystal chandeliers from Baccarat, and furniture pieces from renowned European artisans complete this masterpiece of royal luxury.',
      descriptionAr: 'تجديد جناح قصر مرموق يمتد على مساحة 15,000 قدم مربع، يتميز بأسقف مرسومة يدوياً ورخام إيطالي مستورد وتفاصيل ورق الذهب ودمج تحف أثرية لا تقدر بثمن. تطلب المشروع تقنيات حفظ متخصصة للحفاظ على العناصر التاريخية مع دمج وسائل الراحة الحديثة.',
      images: ['/images/projects/palace-renovation-main.jpg', '/images/projects/palace-throne-room.jpg'],
      category: 'Heritage & Restoration',
      featured: true,
      status: 'published',
      createdAt: new Date('2024-10-15T10:00:00Z'),
      updatedAt: new Date('2024-12-05T10:00:00Z')
    }
  ];

  for (const project of premiumProjects) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: project,
      create: project
    });
  }

  // Additional Premium Services
  const premiumServices = [
    {
      id: 'service-009-yacht-aviation-design',
      titleEn: 'Yacht & Aviation Interior Design',
      titleAr: 'تصميم داخلي لليخوت والطيران',
      slugEn: 'yacht-aviation-interior-design-dubai',
      slugAr: 'تصميم-داخلي-يخوت-طيران-دبي',
      descriptionEn: 'Specialized luxury interior design for yachts and private jets. Our marine and aviation design expertise ensures compliance with international safety standards while delivering uncompromising luxury. From 80-foot yachts to Gulfstream jets, we create mobile palaces that rival the finest hotels. Our designs account for weight restrictions, safety regulations, and the unique challenges of mobile luxury environments.',
      descriptionAr: 'تصميم داخلي فاخر متخصص لليخوت والطائرات الخاصة. تضمن خبرتنا في التصميم البحري والطيران الامتثال لمعايير السلامة الدولية مع تقديم فخامة لا تساوم. من اليخوت 80 قدم إلى طائرات جلف ستريم، نخلق قصور متنقلة تنافس أفضل الفنادق.',
      shortDescriptionEn: 'Ultra-luxury yacht and private jet interiors. Marine and aviation certified designs meeting international safety standards.',
      shortDescriptionAr: 'تصميمات داخلية فائقة الفخامة لليخوت والطائرات الخاصة. تصاميم معتمدة بحرياً وطيرانياً تلبي معايير السلامة الدولية.',
      icon: '🛥️',
      featuresEn: ['Marine & Aviation Certified', 'Weight-Optimized Luxury', 'Safety Compliance', 'Custom Furniture Design', 'Entertainment Systems', 'Climate Control', 'Premium Materials', 'International Standards'],
      featuresAr: ['معتمد بحرياً وطيرانياً', 'فخامة محسنة الوزن', 'امتثال السلامة', 'تصميم أثاث مخصص', 'أنظمة ترفيه', 'تحكم مناخي', 'مواد متميزة', 'معايير دولية'],
      price: 'Custom Quote - Starting AED 500,000',
      duration: '6-12 months',
      featured: true,
      status: 'published',
      createdAt: new Date('2024-11-01T10:00:00Z'),
      updatedAt: new Date('2024-12-01T10:00:00Z')
    },
    {
      id: 'service-010-heritage-restoration',
      titleEn: 'Heritage & Palace Restoration',
      titleAr: 'ترميم التراث والقصور',
      slugEn: 'heritage-palace-restoration-uae',
      slugAr: 'ترميم-تراث-قصور-الإمارات',
      descriptionEn: 'Specialized restoration and renovation services for heritage buildings, palaces, and culturally significant properties. Our conservation experts use traditional techniques combined with modern technology to preserve historical integrity while adding contemporary functionality. We work with UNESCO guidelines and local heritage authorities to ensure authentic restoration that honors the past while serving present needs.',
      descriptionAr: 'خدمات ترميم وتجديد متخصصة للمباني التراثية والقصور والعقارات ذات الأهمية الثقافية. يستخدم خبراء الحفظ لدينا التقنيات التقليدية مع التكنولوجيا الحديثة للحفاظ على النزاهة التاريخية مع إضافة الوظائف المعاصرة.',
      shortDescriptionEn: 'UNESCO-compliant heritage restoration. Traditional techniques with modern functionality for palaces and historic properties.',
      shortDescriptionAr: 'ترميم تراث متوافق مع اليونسكو. تقنيات تقليدية مع وظائف حديثة للقصور والعقارات التاريخية.',
      icon: '🏛️',
      featuresEn: ['UNESCO Guidelines Compliance', 'Traditional Craftsmanship', 'Historical Research', 'Conservation Techniques', 'Modern Integration', 'Cultural Sensitivity', 'Archival Documentation', 'Expert Consultation'],
      featuresAr: ['امتثال إرشادات اليونسكو', 'حرفية تقليدية', 'بحث تاريخي', 'تقنيات الحفظ', 'تكامل حديث', 'حساسية ثقافية', 'توثيق أرشيفي', 'استشارة خبراء'],
      price: 'Custom Quote - Heritage Assessment Required',
      duration: '12-24 months',
      featured: false,
      status: 'published',
      createdAt: new Date('2024-10-01T10:00:00Z'),
      updatedAt: new Date('2024-11-15T10:00:00Z')
    }
  ];

  for (const service of premiumServices) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: {
        titleEn: service.titleEn,
        titleAr: service.titleAr,
        slugEn: service.slugEn,
        slugAr: service.slugAr,
        descriptionEn: service.descriptionEn,
        descriptionAr: service.descriptionAr,
        shortDescriptionEn: service.shortDescriptionEn,
        shortDescriptionAr: service.shortDescriptionAr,
        icon: service.icon,
        featuresEn: service.featuresEn,
        featuresAr: service.featuresAr,
        price: service.price,
        duration: service.duration,
        featured: service.featured,
        status: service.status,
        updatedAt: service.updatedAt
      },
      create: {
        id: service.id,
        titleEn: service.titleEn,
        titleAr: service.titleAr,
        slugEn: service.slugEn,
        slugAr: service.slugAr,
        descriptionEn: service.descriptionEn,
        descriptionAr: service.descriptionAr,
        shortDescriptionEn: service.shortDescriptionEn,
        shortDescriptionAr: service.shortDescriptionAr,
        icon: service.icon,
        featuresEn: service.featuresEn,
        featuresAr: service.featuresAr,
        price: service.price,
        duration: service.duration,
        featured: service.featured,
        status: service.status,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt
      }
    });
  }

  // Additional Premium Blog Posts
  const premiumBlogPosts = [
    {
      id: 'blog-005-luxury-materials-guide',
      titleEn: 'The Ultimate Guide to Luxury Interior Materials: From Calacatta to Cashmere',
      titleAr: 'الدليل النهائي لمواد التصميم الداخلي الفاخرة: من كالاكاتا إلى الكشمير',
      slugEn: 'ultimate-guide-luxury-interior-materials-calacatta-cashmere',
      slugAr: 'الدليل-النهائي-مواد-التصميم-الداخلي-الفاخرة',
      excerptEn: 'Discover the world\'s most coveted interior materials. From rare marbles to exotic woods, learn what makes these materials special and how to incorporate them into your luxury space.',
      excerptAr: 'اكتشف أكثر مواد التصميم الداخلي المرغوبة في العالم. من الرخام النادر إلى الأخشاب الفاخرة، تعلم ما يجعل هذه المواد مميزة وكيفية دمجها في مساحتك الفاخرة.',
      contentEn: '<h2>The Art of Luxury Materials</h2><p>In the world of luxury interior design, materials are the foundation of extraordinary spaces. The difference between good design and exceptional design often lies in the careful selection and application of premium materials that tell a story, evoke emotion, and stand the test of time.</p><h3>Exotic Marbles: Nature\'s Masterpieces</h3><h4>Calacatta Gold</h4><p>Calacatta Gold represents the pinnacle of marble luxury. Quarried exclusively from the Apuan Alps in Italy, this marble features dramatic gold and gray veining against a pristine white background. Each slab is unique, making every installation a one-of-a-kind artwork. In UAE luxury projects, Calacatta Gold appears in statement walls, kitchen islands, and bathroom sanctuaries where its natural beauty becomes the room\'s focal point.</p><h4>Statuario Marble</h4><p>Michelangelo\'s marble of choice, Statuario offers subtle gray veining with occasional gold threads. Its refined elegance makes it perfect for sophisticated spaces where understated luxury is preferred. The marble\'s consistent quality and workability make it ideal for intricate installations including curved surfaces and detailed moldings.</p><h4>Portoro Black Marble</h4><p>From the Italian Riviera, Portoro features dramatic gold veining against a deep black background. This striking marble creates powerful visual impact in contemporary settings. Its bold character works beautifully in powder rooms, accent walls, and modern fireplaces where drama is desired.</p><h3>Rare Woods: Living Luxury</h3><h4>Brazilian Rosewood</h4><p>Considered the holy grail of luxury woods, Brazilian Rosewood (Dalbergia nigra) is now protected under CITES regulations, making existing stocks incredibly valuable. Its rich chocolate tones with darker grain patterns create unmatched warmth and sophistication. We use certified reclaimed Brazilian Rosewood for custom furniture pieces and accent walls in ultra-luxury projects.</p><h4>Macassar Ebony</h4><p>This Indonesian hardwood features striking black and brown striping that creates natural artwork. Its density and stability make it perfect for high-end furniture, while its dramatic appearance adds instant sophistication to any space. Macassar Ebony works beautifully in contemporary settings where bold patterns are appreciated.</p><h4>Ziricote</h4><p>From Central America, Ziricote offers unique landscape-like grain patterns in rich browns and blacks. Each piece tells a different story through its natural markings. This exotic wood is perfect for statement furniture pieces and architectural details where uniqueness is valued over uniformity.</p><h3>Precious Metals: Gilded Elegance</h3><h4>24-Karat Gold Leaf</h4><p>Applied by master craftsmen using centuries-old techniques, gold leaf adds unparalleled luxury to architectural details. In UAE projects, we apply gold leaf to ceiling coffers, custom furniture inlays, and decorative moldings. The key is restraint—gold leaf should accent, not overwhelm.</p><h4>Brushed Brass</h4><p>Modern brass finishes offer warmth without the maintenance challenges of traditional brass. Brushed brass fixtures, hardware, and decorative elements complement both contemporary and traditional aesthetics. Its honey tones work particularly well in UAE\'s warm climate and lighting conditions.</p><h4>Rose Gold</h4><p>The contemporary choice for luxury accents, rose gold offers sophistication with a modern edge. We incorporate rose gold in lighting fixtures, bathroom fittings, and custom furniture details where a fresh take on metallic luxury is desired.</p><h3>Luxury Textiles: Tactile Opulence</h3><h4>Hermès Leather</h4><p>Beyond fashion, Hermès leather finds its way into luxury interiors through custom upholstery and wall coverings. The leather\'s impeccable quality and iconic status make it perfect for private studies, luxury offices, and statement furniture pieces.</p><h4>Cashmere Wall Coverings</h4><p>Cashmere-wrapped wall panels create unmatched tactile luxury. The natural fiber\'s softness and warmth transform rooms into cocoons of comfort. We use cashmere wall coverings in master bedrooms and private lounges where comfort and luxury converge.</p><h4>Silk Carpets</h4><p>Hand-knotted silk carpets represent the pinnacle of floor covering luxury. Persian and Turkish silk carpets with intricate patterns become room-defining artworks. Their lustrous finish and incredible detail make them perfect for formal living areas and dining rooms.</p><h3>Crystal and Glass: Luminous Beauty</h3><h4>Baccarat Crystal</h4><p>French Baccarat crystal brings centuries of craftsmanship to luxury interiors. Custom chandeliers, decorative objects, and architectural elements in Baccarat crystal create focal points that capture and reflect light beautifully.</p><h4>Venetian Glass</h4><p>Murano glass from Venice offers artistic flair with its vibrant colors and unique forms. We commission custom Murano glass installations for statement walls, lighting fixtures, and decorative elements that add personality to luxury spaces.</p><h3>Application Guidelines</h3><h4>Balance and Restraint</h4><p>Luxury materials should be used thoughtfully. Mixing too many premium materials can create visual chaos. We typically select 2-3 key materials per space, allowing each to shine without competition.</p><h4>Quality Over Quantity</h4><p>Better to use a smaller amount of exceptional material than large quantities of lesser quality alternatives. A single Calacatta marble wall makes more impact than multiple surfaces in standard marble.</p><h4>Maintenance Considerations</h4><p>Luxury materials often require specialized care. We provide detailed maintenance guides and connect clients with certified care specialists to ensure materials retain their beauty over time.</p><h3>Sourcing and Authentication</h3><p>Authentic luxury materials come with provenance documentation. We work directly with quarries, mills, and certified suppliers to ensure authenticity. Certificates of origin, quality grades, and sustainability credentials accompany all premium materials.</p><h3>Investment Value</h3><p>Premium materials often appreciate in value, especially rare woods and stones. Properties featuring authentic luxury materials command higher resale values and attract discerning buyers who recognize quality.</p><h3>Conclusion</h3><p>Luxury materials are investments in beauty, quality, and lasting value. When selected and applied expertly, they transform spaces from merely expensive to truly extraordinary. At Mouhajer, we guide clients through the complex world of luxury materials, ensuring every selection enhances their vision while providing lasting satisfaction.</p>',
      contentAr: '<h2>فن المواد الفاخرة</h2><p>في عالم التصميم الداخلي الفاخر، المواد هي أساس المساحات الاستثنائية. الفرق بين التصميم الجيد والتصميم الاستثنائي غالباً ما يكمن في الاختيار والتطبيق الدقيق للمواد المتميزة التي تحكي قصة وتثير المشاعر وتصمد أمام اختبار الزمن.</p>',
      featuredImage: '/images/blog/luxury-materials-guide.jpg',
      category: 'Materials',
      tags: ['luxury materials', 'marble', 'exotic woods', 'gold leaf', 'interior design'],
      author: 'Mouhajer Design Team',
      publishedAt: new Date('2025-01-25T10:00:00.000Z'),
      featured: true,
      status: 'published',
      createdAt: new Date('2025-01-25T10:00:00.000Z'),
      updatedAt: new Date('2025-01-25T10:00:00.000Z')
    }
  ];

  for (const post of premiumBlogPosts) {
    await prisma.blogPost.upsert({
      where: { id: post.id },
      update: {
        titleEn: post.titleEn,
        titleAr: post.titleAr,
        slugEn: post.slugEn,
        slugAr: post.slugAr,
        excerptEn: post.excerptEn,
        excerptAr: post.excerptAr,
        contentEn: post.contentEn,
        contentAr: post.contentAr,
        featuredImage: post.featuredImage,
        category: post.category,
        tags: post.tags,
        author: post.author,
        publishedAt: post.publishedAt,
        featured: post.featured,
        status: post.status,
        updatedAt: post.updatedAt
      },
      create: {
        id: post.id,
        titleEn: post.titleEn,
        titleAr: post.titleAr,
        slugEn: post.slugEn,
        slugAr: post.slugAr,
        excerptEn: post.excerptEn,
        excerptAr: post.excerptAr,
        contentEn: post.contentEn,
        contentAr: post.contentAr,
        featuredImage: post.featuredImage,
        category: post.category,
        tags: post.tags,
        author: post.author,
        publishedAt: post.publishedAt,
        featured: post.featured,
        status: post.status,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      }
    });
  }

  console.log('✅ Premium content seeded successfully');
}

// Main seed function
async function main() {
  console.log('\n🌱 Starting database seed...\n');

  try {
    await seedUsers();
    await seedProjects();
    await seedServices();
    await seedBlogPosts();
    await seedPages();
    await seedSettings();
    await seedAdvertisements();
    await seedPremiumContent();

    console.log('\n✨ Database seed completed successfully!\n');
    console.log('🎉 Your CMS now includes:');
    console.log('   • 17+ Premium Projects (including yacht & jet interiors)');
    console.log('   • 10+ Comprehensive Services');
    console.log('   • 5+ In-depth Blog Articles');
    console.log('   • Complete Settings & Pages');
    console.log('   • Sample Advertisements');
    console.log('   • User Accounts (admin/editor)');
    console.log('\n🚀 Ready for production!');
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
