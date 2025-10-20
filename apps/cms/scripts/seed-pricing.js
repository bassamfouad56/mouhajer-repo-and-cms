const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Pricing Plans...');

  const pricingPlans = [
    // ESSENTIAL - Entry-level package
    {
      nameEn: 'Essential Design',
      nameAr: 'التصميم الأساسي',
      descriptionEn:
        'Perfect for small spaces or single-room makeovers. Get professional interior design consultation with detailed mood boards and shopping lists to transform your space on a budget.',
      descriptionAr:
        'مثالي للمساحات الصغيرة أو تجديد غرفة واحدة. احصل على استشارة تصميم داخلي احترافية مع لوحات مزاج مفصلة وقوائم تسوق لتحويل مساحتك بميزانية محدودة.',
      price: 5000,
      currency: 'AED',
      pricingModel: 'fixed',
      pricePrefix: 'Starting from',
      priceSuffix: '/room',
      tier: 'basic',
      popular: false,
      recommended: false,
      featuresEn: [
        'Initial consultation (2 hours)',
        'Space assessment and measurements',
        'Mood board creation',
        'Color palette recommendation',
        'Furniture and decor shopping list',
        'Basic layout plan (2D)',
        'Email support for 30 days',
      ],
      featuresAr: [
        'استشارة أولية (ساعتان)',
        'تقييم المساحة والقياسات',
        'إنشاء لوحة المزاج',
        'توصية لوحة الألوان',
        'قائمة تسوق الأثاث والديكور',
        'خطة تخطيط أساسية (ثنائية الأبعاد)',
        'دعم البريد الإلكتروني لمدة 30 يومًا',
      ],
      includedServices: ['Consultation', 'Mood Board', 'Shopping List', '2D Layout'],
      deliverables: ['Mood board PDF', 'Color palette guide', '2D floor plan', 'Shopping list with links'],
      limitations: [
        'No 3D renderings',
        'No procurement services',
        'No project management',
        'Single room only',
      ],
      minProjectSize: '1 room',
      maxProjectSize: '1 room',
      estimatedTimeline: '1-2 weeks',
      ctaTextEn: 'Get Started',
      ctaTextAr: 'ابدأ الآن',
      icon: 'home',
      color: '#3B82F6',
      order: 1,
      locale: 'en',
      featured: false,
      published: true,
    },

    // PROFESSIONAL - Most popular package
    {
      nameEn: 'Professional Design',
      nameAr: 'التصميم المحترف',
      descriptionEn:
        'Our most popular package for apartments and villas. Includes comprehensive design services with 3D visualizations, custom furniture design, and full project coordination from concept to completion.',
      descriptionAr:
        'باقتنا الأكثر شعبية للشقق والفلل. تتضمن خدمات تصميم شاملة مع تصورات ثلاثية الأبعاد وتصميم أثاث مخصص وتنسيق كامل للمشروع من المفهوم إلى الإكمال.',
      price: 50000,
      currency: 'AED',
      pricingModel: 'fixed',
      pricePrefix: 'Starting from',
      priceSuffix: '/project',
      tier: 'professional',
      popular: true,
      recommended: true,
      featuresEn: [
        'Comprehensive design consultation',
        'Detailed space planning',
        '3D photorealistic renderings (5 views)',
        'Custom mood boards and material palettes',
        'Furniture layout and specifications',
        'Lighting design plan',
        'Custom furniture design (up to 3 pieces)',
        'Material and finish selection',
        'Shopping and procurement assistance',
        'Contractor coordination',
        'Project management support',
        'Site visits (3 included)',
        '90-day support period',
      ],
      featuresAr: [
        'استشارة تصميم شاملة',
        'تخطيط مفصل للمساحة',
        'عروض ثلاثية الأبعاد واقعية (5 عروض)',
        'لوحات مزاج مخصصة ولوحات مواد',
        'تخطيط الأثاث والمواصفات',
        'خطة تصميم الإضاءة',
        'تصميم أثاث مخصص (حتى 3 قطع)',
        'اختيار المواد والتشطيبات',
        'مساعدة التسوق والشراء',
        'تنسيق المقاولين',
        'دعم إدارة المشروع',
        'زيارات الموقع (3 مشمولة)',
        'فترة دعم 90 يومًا',
      ],
      includedServices: [
        'Full Design Service',
        '3D Visualization',
        'Custom Furniture Design',
        'Procurement Support',
        'Project Management',
        'Site Visits',
      ],
      deliverables: [
        '3D renderings (5 views)',
        'Detailed floor plans',
        'Elevation drawings',
        'Material specification sheets',
        'Furniture catalog',
        'Lighting plan',
        'Timeline and budget estimate',
      ],
      limitations: ['Maximum 2000 sqft', 'Excludes construction costs', 'Additional site visits charged separately'],
      minProjectSize: '500 sqft',
      maxProjectSize: '2000 sqft',
      estimatedTimeline: '6-8 weeks',
      ctaTextEn: 'Choose Professional',
      ctaTextAr: 'اختر المحترف',
      icon: 'star',
      color: '#8B5CF6',
      badge: 'Most Popular',
      order: 2,
      locale: 'en',
      featured: true,
      published: true,
    },

    // PREMIUM - Luxury package
    {
      nameEn: 'Premium Luxury',
      nameAr: 'الفخامة الممتازة',
      descriptionEn:
        'For discerning clients seeking exceptional design. Includes everything in Professional plus VR walkthroughs, extensive custom furniture, art curation, and white-glove project management with unlimited revisions.',
      descriptionAr:
        'للعملاء المميزين الذين يبحثون عن تصميم استثنائي. يتضمن كل شيء في المحترف بالإضافة إلى جولات الواقع الافتراضي وأثاث مخصص واسع النطاق وتنسيق الفن وإدارة مشروع بقفازات بيضاء مع مراجعات غير محدودة.',
      price: 150000,
      currency: 'AED',
      pricingModel: 'fixed',
      pricePrefix: 'Starting from',
      priceSuffix: '/project',
      tier: 'premium',
      popular: false,
      recommended: false,
      featuresEn: [
        'Everything in Professional, plus:',
        'Virtual Reality (VR) walkthrough',
        'Unlimited 3D renderings',
        'Unlimited custom furniture design',
        'Art and accessories curation',
        'Smart home integration design',
        'Luxury material sourcing',
        'Full procurement and delivery management',
        'Dedicated project manager',
        'Weekly progress meetings',
        'Unlimited site visits',
        'Installation supervision',
        'Styling and final touches',
        'Professional photography session',
        'Unlimited revisions',
        '6-month post-completion support',
      ],
      featuresAr: [
        'كل شيء في المحترف، بالإضافة إلى:',
        'جولة الواقع الافتراضي (VR)',
        'عروض ثلاثية الأبعاد غير محدودة',
        'تصميم أثاث مخصص غير محدود',
        'تنسيق الفن والإكسسوارات',
        'تصميم تكامل المنزل الذكي',
        'الحصول على مواد فاخرة',
        'إدارة الشراء والتسليم الكاملة',
        'مدير مشروع مخصص',
        'اجتماعات تقدم أسبوعية',
        'زيارات موقع غير محدودة',
        'إشراف التثبيت',
        'التصميم واللمسات النهائية',
        'جلسة تصوير احترافية',
        'مراجعات غير محدودة',
        'دعم 6 أشهر بعد الإكمال',
      ],
      includedServices: [
        'Complete Luxury Service',
        'VR Experience',
        'Full Procurement',
        'Dedicated PM',
        'Art Curation',
        'Smart Home',
        'Professional Photography',
      ],
      deliverables: [
        'Unlimited 3D renderings',
        'VR walkthrough file',
        'Complete construction documents',
        'Custom furniture drawings',
        'Smart home specifications',
        'Art and accessory catalog',
        'Professional project photos',
        'As-built documentation',
      ],
      limitations: ['Excludes construction and furniture costs'],
      minProjectSize: '1500 sqft',
      maxProjectSize: 'Unlimited',
      estimatedTimeline: '10-14 weeks',
      ctaTextEn: 'Experience Luxury',
      ctaTextAr: 'اختبر الفخامة',
      icon: 'crown',
      color: '#F59E0B',
      badge: 'Best Value',
      order: 3,
      locale: 'en',
      featured: true,
      published: true,
    },

    // ENTERPRISE - Custom for large projects
    {
      nameEn: 'Enterprise & Commercial',
      nameAr: 'المؤسسات والتجاري',
      descriptionEn:
        'Tailored solutions for commercial spaces, multi-unit developments, and large-scale projects. Includes brand integration, multiple location coordination, and long-term partnership benefits with flexible pricing models.',
      descriptionAr:
        'حلول مخصصة للمساحات التجارية والتطويرات متعددة الوحدات والمشاريع الكبيرة. يتضمن تكامل العلامة التجارية وتنسيق مواقع متعددة ومزايا الشراكة طويلة الأجل مع نماذج تسعير مرنة.',
      price: null, // Custom pricing
      currency: 'AED',
      pricingModel: 'custom',
      pricePrefix: 'Custom pricing',
      priceSuffix: null,
      tier: 'enterprise',
      popular: false,
      recommended: false,
      featuresEn: [
        'Customized service package',
        'Brand identity integration',
        'Multi-location coordination',
        'Large-scale project management',
        'Dedicated design team',
        'BIM and technical documentation',
        'Sustainability and LEED consulting',
        'Value engineering services',
        'Contractor bidding support',
        'Quality control inspections',
        'Warranty and maintenance programs',
        'Priority support and service',
        'Flexible payment terms',
        'Long-term partnership benefits',
      ],
      featuresAr: [
        'حزمة خدمة مخصصة',
        'تكامل هوية العلامة التجارية',
        'تنسيق مواقع متعددة',
        'إدارة مشاريع كبيرة الحجم',
        'فريق تصميم مخصص',
        'وثائق BIM والوثائق الفنية',
        'استشارات الاستدامة و LEED',
        'خدمات هندسة القيمة',
        'دعم عطاءات المقاولين',
        'فحوصات مراقبة الجودة',
        'برامج الضمان والصيانة',
        'دعم وخدمة ذات أولوية',
        'شروط دفع مرنة',
        'مزايا الشراكة طويلة الأجل',
      ],
      includedServices: [
        'Enterprise Solutions',
        'Multi-Location',
        'Brand Integration',
        'BIM Services',
        'LEED Consulting',
        'Value Engineering',
        'Long-term Support',
      ],
      deliverables: [
        'Customized based on project scope',
        'Complete technical documentation',
        'Brand guidelines integration',
        'Multi-site coordination plans',
        'Comprehensive project reports',
      ],
      limitations: ['Minimum project value applies', 'Contract terms vary by project scope'],
      minProjectSize: '5000 sqft or multiple locations',
      maxProjectSize: 'Unlimited',
      estimatedTimeline: 'Project-dependent (typically 3-12 months)',
      ctaTextEn: 'Contact Us',
      ctaTextAr: 'اتصل بنا',
      icon: 'building',
      color: '#10B981',
      order: 4,
      locale: 'en',
      featured: false,
      published: true,
    },
  ];

  for (const plan of pricingPlans) {
    await prisma.pricingPlan.create({
      data: plan,
    });
    console.log(`✅ Created Pricing Plan: ${plan.nameEn} (${plan.tier})`);
  }

  console.log(`\n🎉 Seeding completed! Added ${pricingPlans.length} pricing plans.`);
  console.log('\n📊 Breakdown by tier:');
  console.log(`  - Basic: ${pricingPlans.filter((p) => p.tier === 'basic').length}`);
  console.log(`  - Professional: ${pricingPlans.filter((p) => p.tier === 'professional').length}`);
  console.log(`  - Premium: ${pricingPlans.filter((p) => p.tier === 'premium').length}`);
  console.log(`  - Enterprise: ${pricingPlans.filter((p) => p.tier === 'enterprise').length}`);

  console.log('\n📊 Popular plans:', pricingPlans.filter((p) => p.popular).length);
  console.log('📊 Recommended plans:', pricingPlans.filter((p) => p.recommended).length);
  console.log('📊 Featured plans:', pricingPlans.filter((p) => p.featured).length);

  console.log('\n📊 Test the GraphQL API:');
  console.log('  URL: http://localhost:3010/api/graphql');
  console.log('  Query:');
  console.log('  query {');
  console.log('    pricingPlans(filter: { locale: "en", published: true }) {');
  console.log('      id');
  console.log('      nameEn');
  console.log('      tier');
  console.log('      price');
  console.log('      popular');
  console.log('      recommended');
  console.log('    }');
  console.log('  }');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding pricing plans:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
