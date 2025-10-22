const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Case Studies...');

  const caseStudies = [
    // Luxury Villa - Featured Project
    {
      titleEn: 'Palm Jumeirah Luxury Villa Transformation',
      titleAr: 'تحويل فيلا فاخرة في نخلة جميرا',
      summaryEn:
        'A complete redesign of a 12,000 sqft beachfront villa, transforming traditional interiors into a contemporary luxury oasis while preserving Arabic architectural elements.',
      summaryAr:
        'إعادة تصميم كاملة لفيلا على الشاطئ بمساحة 12,000 قدم مربع، تحويل التصميمات الداخلية التقليدية إلى واحة فاخرة معاصرة مع الحفاظ على العناصر المعمارية العربية.',
      clientName: 'Private Client',
      clientType: 'residential',
      showClientName: false,
      projectType: 'villa',
      location: 'Palm Jumeirah, Dubai',
      projectSize: '12,000 sqft',
      completionDate: new Date('2024-06-15'),
      duration: '8 months',
      challengeEn:
        'The villa had outdated interiors with poor natural light distribution and disconnected living spaces. The client wanted a modern aesthetic while maintaining cultural authenticity and maximizing sea views from every room.',
      challengeAr:
        'كانت الفيلا تحتوي على تصميمات داخلية قديمة مع توزيع ضعيف للضوء الطبيعي ومساحات معيشة منفصلة. أراد العميل جمالية حديثة مع الحفاظ على الأصالة الثقافية وتعظيم إطلالات البحر من كل غرفة.',
      solutionEn:
        'We opened up the floor plan by removing non-structural walls, installed floor-to-ceiling windows to capture panoramic sea views, and integrated custom mashrabiya screens for privacy while allowing natural light. A neutral color palette with gold accents honored Arabic design traditions while feeling contemporary.',
      solutionAr:
        'فتحنا مخطط الطابق بإزالة الجدران غير الهيكلية، وقمنا بتركيب نوافذ من الأرض حتى السقف لالتقاط إطلالات بحرية بانورامية، ودمجنا شاشات مشربية مخصصة للخصوصية مع السماح بالضوء الطبيعي.',
      resultsEn:
        'The transformation resulted in a 40% increase in natural light, seamless indoor-outdoor living, and spaces that feel 30% larger. Client satisfaction rating: 5/5. The project was featured in Emirates Home magazine and won the 2024 Dubai Design Award for Residential Excellence.',
      resultsAr:
        'أدى التحويل إلى زيادة بنسبة 40% في الضوء الطبيعي ومعيشة سلسة من الداخل إلى الخارج ومساحات تبدو أكبر بنسبة 30%. تقييم رضا العميل: 5/5.',
      heroImage: '/images/case-studies/palm-villa/hero.jpg',
      beforeImages: ['/images/case-studies/palm-villa/before-1.jpg', '/images/case-studies/palm-villa/before-2.jpg'],
      afterImages: ['/images/case-studies/palm-villa/after-1.jpg', '/images/case-studies/palm-villa/after-2.jpg'],
      gallery: [
        '/images/case-studies/palm-villa/living.jpg',
        '/images/case-studies/palm-villa/kitchen.jpg',
        '/images/case-studies/palm-villa/master.jpg',
      ],
      features: [
        'Floor-to-ceiling windows',
        'Custom mashrabiya screens',
        'Smart home automation',
        'Infinity pool integration',
        'Marble and gold accents',
      ],
      stylesTags: ['Modern Luxury', 'Contemporary Arabic', 'Minimalist'],
      budget: 2500000,
      budgetSaved: 200000,
      timelineMet: true,
      clientSatisfaction: 5,
      teamMembers: ['Layla Al-Hamadi', 'Omar Khalil', 'Sarah Chen'],
      contractors: ['Elite Construction LLC', 'Marble Masters Dubai'],
      keywords: ['luxury villa design', 'Palm Jumeirah', 'modern Arabic design', 'beachfront villa'],
      tags: ['Featured', 'Award Winner', 'Luxury', 'Residential'],
      order: 1,
      locale: 'en',
      featured: true,
      published: true,
    },

    // Modern Apartment
    {
      titleEn: 'Downtown Dubai Penthouse Minimalist Redesign',
      titleAr: 'إعادة تصميم بنتهاوس بسيط وسط دبي',
      summaryEn:
        'Transforming a 3,500 sqft penthouse into a sophisticated minimalist sanctuary with panoramic Burj Khalifa views and smart home integration.',
      summaryAr:
        'تحويل بنتهاوس بمساحة 3,500 قدم مربع إلى ملاذ بسيط متطور مع إطلالات بانورامية على برج خليفة وتكامل المنزل الذكي.',
      clientName: 'Tech Entrepreneur',
      clientType: 'residential',
      showClientName: false,
      projectType: 'apartment',
      location: 'Downtown Dubai',
      projectSize: '3,500 sqft',
      completionDate: new Date('2024-03-20'),
      duration: '4 months',
      challengeEn:
        'The client, a busy tech professional, wanted a clutter-free, low-maintenance space that maximizes views while accommodating a home office and entertainment area.',
      challengeAr:
        'أراد العميل، وهو محترف تقني مشغول، مساحة خالية من الفوضى وسهلة الصيانة تزيد من المناظر مع استيعاب مكتب منزلي ومنطقة ترفيه.',
      solutionEn:
        'We implemented a monochromatic color scheme with hidden storage solutions, integrated a motorized glass partition for the home office, and used reflective surfaces to amplify natural light and views. All systems were connected to voice-controlled smart home automation.',
      solutionAr:
        'طبقنا نظام ألوان أحادي اللون مع حلول تخزين مخفية، ودمجنا قسمًا زجاجيًا آليًا للمكتب المنزلي، واستخدمنا أسطحًا عاكسة لتضخيم الضوء الطبيعي والمناظر.',
      resultsEn:
        'Delivered a functional yet elegant space that reduced visual clutter by 70%. The smart home system cut energy consumption by 25%. Client reports 50% improvement in work-life balance due to better space organization.',
      resultsAr:
        'قدمنا مساحة وظيفية وأنيقة قللت من الفوضى البصرية بنسبة 70%. خفض نظام المنزل الذكي استهلاك الطاقة بنسبة 25%.',
      heroImage: '/images/case-studies/downtown-penthouse/hero.jpg',
      beforeImages: ['/images/case-studies/downtown-penthouse/before-1.jpg'],
      afterImages: ['/images/case-studies/downtown-penthouse/after-1.jpg'],
      gallery: ['/images/case-studies/downtown-penthouse/living.jpg', '/images/case-studies/downtown-penthouse/office.jpg'],
      features: ['Motorized glass partitions', 'Hidden storage', 'Smart home automation', 'Minimalist design', 'Energy efficient'],
      stylesTags: ['Minimalist', 'Contemporary', 'Smart Home'],
      budget: 850000,
      budgetSaved: 50000,
      timelineMet: true,
      clientSatisfaction: 5,
      teamMembers: ['Fatima Al-Mazrouei', 'David Thompson'],
      contractors: ['Smart Homes UAE', 'Glass Tech Dubai'],
      keywords: ['penthouse design', 'minimalist interior', 'smart home', 'downtown dubai'],
      tags: ['Modern', 'Smart Home', 'Residential'],
      order: 2,
      locale: 'en',
      featured: true,
      published: true,
    },

    // Commercial Restaurant
    {
      titleEn: 'Jumeirah Beach Walk Restaurant Concept',
      titleAr: 'مفهوم مطعم جميرا بيتش ووك',
      summaryEn:
        'Creating an Instagram-worthy coastal dining experience that blends indoor-outdoor spaces with Mediterranean aesthetics and functional kitchen design.',
      summaryAr:
        'إنشاء تجربة تناول طعام ساحلية جديرة بالإنستغرام تمزج بين المساحات الداخلية والخارجية مع الجماليات المتوسطية وتصميم المطبخ الوظيفي.',
      clientName: 'Coastal Dining Group',
      clientType: 'commercial',
      showClientName: true,
      projectType: 'restaurant',
      location: 'Jumeirah Beach Walk, Dubai',
      projectSize: '4,200 sqft',
      completionDate: new Date('2024-01-10'),
      duration: '3 months',
      challengeEn:
        'Design a 120-seat restaurant that maximizes beachfront views, creates social media-worthy moments, and optimizes kitchen workflow for high-volume service during peak hours.',
      challengeAr:
        'تصميم مطعم بسعة 120 مقعدًا يزيد من إطلالات الواجهة البحرية، ويخلق لحظات جديرة بوسائل التواصل الاجتماعي، ويحسن سير عمل المطبخ للخدمة عالية الحجم خلال ساعات الذروة.',
      solutionEn:
        'We designed a flowing open layout with retractable glass walls, installed a show kitchen as a focal point, and created an overhead garden feature with cascading plants. Blue and white Mediterranean color palette with natural wood accents enhanced the coastal ambiance.',
      solutionAr:
        'صممنا تخطيطًا مفتوحًا متدفقًا مع جدران زجاجية قابلة للسحب، وقمنا بتركيب مطبخ عرض كنقطة محورية، وأنشأنا ميزة حديقة علوية مع نباتات متتالية.',
      resultsEn:
        'Restaurant achieved 95% occupancy within first month. Social media engagement increased by 300% with 50K+ Instagram check-ins in 6 months. Kitchen efficiency improved by 35%, reducing average meal prep time by 8 minutes.',
      resultsAr:
        'حقق المطعم إشغالًا بنسبة 95% خلال الشهر الأول. زادت مشاركة وسائل التواصل الاجتماعي بنسبة 300% مع أكثر من 50 ألف تسجيل وصول على الإنستغرام في 6 أشهر.',
      heroImage: '/images/case-studies/beach-restaurant/hero.jpg',
      beforeImages: ['/images/case-studies/beach-restaurant/before-1.jpg'],
      afterImages: ['/images/case-studies/beach-restaurant/after-1.jpg'],
      gallery: ['/images/case-studies/beach-restaurant/dining.jpg', '/images/case-studies/beach-restaurant/bar.jpg'],
      features: ['Retractable glass walls', 'Show kitchen', 'Overhead garden', 'Mediterranean design', 'Indoor-outdoor flow'],
      stylesTags: ['Mediterranean', 'Coastal', 'Commercial'],
      budget: 1200000,
      budgetSaved: 100000,
      timelineMet: true,
      clientSatisfaction: 5,
      teamMembers: ['Ahmed Al-Rashid', 'Mariam Al-Suwaidi'],
      contractors: ['Restaurant Fit-Out Specialists', 'Commercial Kitchen Pro'],
      keywords: ['restaurant design', 'commercial interior', 'jumeirah beach', 'mediterranean restaurant'],
      tags: ['Commercial', 'Restaurant', 'Featured'],
      order: 3,
      locale: 'en',
      featured: true,
      published: true,
    },

    // Office Space
    {
      titleEn: 'DIFC Tech Startup Office Innovation Hub',
      titleAr: 'مركز الابتكار لمكتب شركة ناشئة تقنية في مركز دبي المالي العالمي',
      summaryEn:
        'Transforming traditional office space into a collaborative innovation hub that boosts creativity, productivity, and employee wellbeing for a fast-growing fintech startup.',
      summaryAr:
        'تحويل مساحة مكتب تقليدية إلى مركز ابتكار تعاوني يعزز الإبداع والإنتاجية ورفاهية الموظفين لشركة ناشئة في مجال التكنولوجيا المالية سريعة النمو.',
      clientName: 'FinTech Innovations',
      clientType: 'commercial',
      showClientName: true,
      projectType: 'office',
      location: 'DIFC, Dubai',
      projectSize: '8,000 sqft',
      completionDate: new Date('2023-11-25'),
      duration: '5 months',
      challengeEn:
        'Create a workspace that supports 80 employees across different work styles (focus, collaboration, casual meetings) while maintaining brand identity and accommodating rapid growth.',
      challengeAr:
        'إنشاء مساحة عمل تدعم 80 موظفًا عبر أنماط عمل مختلفة (التركيز والتعاون والاجتماعات غير الرسمية) مع الحفاظ على هوية العلامة التجارية واستيعاب النمو السريع.',
      solutionEn:
        'We designed activity-based zones including focus pods, collaboration areas, casual lounges, and standing meeting spaces. Biophilic design elements, ergonomic furniture, and circadian lighting were integrated throughout. A modular furniture system allows easy reconfiguration as the team grows.',
      solutionAr:
        'صممنا مناطق قائمة على الأنشطة بما في ذلك كبسولات التركيز ومناطق التعاون والصالات غير الرسمية ومساحات الاجتماعات الدائمة. تم دمج عناصر التصميم البيوفيلي والأثاث المريح والإضاءة اليومية في جميع أنحاء.',
      resultsEn:
        'Employee satisfaction scores increased 45%. Productivity metrics improved by 30% in first quarter. The office became a recruitment tool, with 20% more qualified applicants citing office environment as a deciding factor. LEED Gold certified for sustainability.',
      resultsAr:
        'زادت درجات رضا الموظفين بنسبة 45%. تحسنت مقاييس الإنتاجية بنسبة 30% في الربع الأول. أصبح المكتب أداة توظيف، مع 20% المزيد من المتقدمين المؤهلين الذين استشهدوا ببيئة المكتب كعامل حاسم.',
      heroImage: '/images/case-studies/difc-office/hero.jpg',
      beforeImages: ['/images/case-studies/difc-office/before-1.jpg'],
      afterImages: ['/images/case-studies/difc-office/after-1.jpg'],
      gallery: ['/images/case-studies/difc-office/workspace.jpg', '/images/case-studies/difc-office/lounge.jpg'],
      features: ['Activity-based design', 'Biophilic elements', 'Modular furniture', 'Circadian lighting', 'LEED Gold'],
      stylesTags: ['Modern', 'Biophilic', 'Tech Office'],
      budget: 950000,
      budgetSaved: 75000,
      timelineMet: true,
      clientSatisfaction: 5,
      teamMembers: ['Ahmed Al-Rashid', 'Khalid bin Mohammed', 'Mariam Al-Suwaidi'],
      contractors: ['Office Interiors Dubai', 'Eco Solutions UAE'],
      keywords: ['office design', 'startup office', 'DIFC', 'collaborative workspace', 'biophilic design'],
      tags: ['Commercial', 'Office', 'LEED', 'Sustainability'],
      order: 4,
      locale: 'en',
      featured: false,
      published: true,
    },

    // Heritage Restoration
    {
      titleEn: 'Al Fahidi Historical District Heritage Home Restoration',
      titleAr: 'ترميم منزل تراثي في حي الفهيدي التاريخي',
      summaryEn:
        'Sensitive restoration and modernization of a 1920s heritage home, preserving historical authenticity while introducing modern comforts and sustainable systems.',
      summaryAr:
        'ترميم وتحديث حساس لمنزل تراثي من عشرينيات القرن الماضي، مع الحفاظ على الأصالة التاريخية مع تقديم وسائل الراحة الحديثة والأنظمة المستدامة.',
      clientName: 'Dubai Culture Authority',
      clientType: 'commercial',
      showClientName: true,
      projectType: 'villa',
      location: 'Al Fahidi Historical District, Dubai',
      projectSize: '3,800 sqft',
      completionDate: new Date('2023-09-15'),
      duration: '6 months',
      challengeEn:
        'Restore a culturally significant 1920s home while meeting modern building codes, adding climate control, and ensuring the project honors Emirati architectural heritage.',
      challengeAr:
        'ترميم منزل من عشرينيات القرن الماضي ذو أهمية ثقافية مع تلبية رموز البناء الحديثة وإضافة التحكم في المناخ وضمان أن المشروع يحترم التراث المعماري الإماراتي.',
      solutionEn:
        'We worked with heritage conservation experts to restore original coral stone walls, traditional wind towers (barjeel), and decorative gypsum work. Modern HVAC was discreetly integrated, hidden within the traditional architecture. Sustainable materials matching original finishes were sourced locally.',
      solutionAr:
        'عملنا مع خبراء الحفاظ على التراث لترميم جدران الحجر المرجاني الأصلية وأبراج الرياح التقليدية (برجيل) وأعمال الجبس الزخرفية. تم دمج نظام التدفئة والتهوية وتكييف الهواء الحديث بشكل سري، مخفي داخل الهندسة المعمارية التقليدية.',
      resultsEn:
        'Project received Dubai Heritage Conservation Award 2024. The home now serves as a cultural center and museum, attracting 15,000+ visitors annually. Successfully reduced energy consumption by 40% compared to modern buildings through passive cooling design.',
      resultsAr:
        'حصل المشروع على جائزة دبي للحفاظ على التراث 2024. يعمل المنزل الآن كمركز ثقافي ومتحف، يجذب أكثر من 15,000 زائر سنويًا.',
      heroImage: '/images/case-studies/fahidi-heritage/hero.jpg',
      beforeImages: ['/images/case-studies/fahidi-heritage/before-1.jpg', '/images/case-studies/fahidi-heritage/before-2.jpg'],
      afterImages: ['/images/case-studies/fahidi-heritage/after-1.jpg', '/images/case-studies/fahidi-heritage/after-2.jpg'],
      gallery: ['/images/case-studies/fahidi-heritage/courtyard.jpg', '/images/case-studies/fahidi-heritage/windtower.jpg'],
      features: ['Heritage restoration', 'Coral stone preservation', 'Traditional wind towers', 'Passive cooling', 'Sustainable materials'],
      stylesTags: ['Heritage', 'Traditional Arabic', 'Conservation'],
      budget: 680000,
      budgetSaved: 0,
      timelineMet: true,
      clientSatisfaction: 5,
      teamMembers: ['Omar Khalil', 'Mariam Al-Suwaidi'],
      contractors: ['Heritage Restoration Specialists', 'Traditional Craftsmen Guild'],
      keywords: ['heritage restoration', 'Al Fahidi', 'traditional arabic design', 'conservation'],
      tags: ['Heritage', 'Award Winner', 'Conservation', 'Cultural'],
      order: 5,
      locale: 'en',
      featured: false,
      published: true,
    },
  ];

  for (const caseStudy of caseStudies) {
    await prisma.caseStudy.create({
      data: caseStudy,
    });
    console.log(`✅ Created Case Study: ${caseStudy.titleEn}`);
  }

  console.log(`\n🎉 Seeding completed! Added ${caseStudies.length} case studies.`);
  console.log('\n📊 Breakdown by project type:');
  console.log(`  - Villa: ${caseStudies.filter((c) => c.projectType === 'villa').length}`);
  console.log(`  - Apartment: ${caseStudies.filter((c) => c.projectType === 'apartment').length}`);
  console.log(`  - Restaurant: ${caseStudies.filter((c) => c.projectType === 'restaurant').length}`);
  console.log(`  - Office: ${caseStudies.filter((c) => c.projectType === 'office').length}`);

  console.log('\n📊 Featured case studies:', caseStudies.filter((c) => c.featured).length);

  console.log('\n📊 Test the GraphQL API:');
  console.log('  URL: http://localhost:3010/api/graphql');
  console.log('  Query:');
  console.log('  query {');
  console.log('    caseStudies(filter: { locale: "en", published: true }) {');
  console.log('      id');
  console.log('      titleEn');
  console.log('      projectType');
  console.log('      location');
  console.log('      featured');
  console.log('    }');
  console.log('  }');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding case studies:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
