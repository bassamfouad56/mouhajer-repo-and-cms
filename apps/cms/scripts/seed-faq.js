const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding FAQs...');

  const faqs = [
    // GENERAL Category
    {
      questionEn: 'What services does Mouhajer International Design offer?',
      questionAr: 'ما هي الخدمات التي تقدمها مهاجر للتصميم الدولي؟',
      answerEn:
        'We offer comprehensive interior design services including residential design (villas, apartments, penthouses), commercial design (offices, retail spaces, restaurants), turnkey projects, space planning, 3D visualization, custom furniture design, and project management from concept to completion.',
      answerAr:
        'نقدم خدمات تصميم داخلي شاملة بما في ذلك التصميم السكني (الفلل والشقق والبنتهاوس) والتصميم التجاري (المكاتب ومساحات البيع بالتجزئة والمطاعم) والمشاريع الجاهزة وتخطيط المساحات والتصور ثلاثي الأبعاد وتصميم الأثاث المخصص وإدارة المشروع من المفهوم إلى الإكمال.',
      category: 'general',
      order: 1,
      locale: 'en',
      featured: true,
      published: true,
      keywords: ['services', 'offerings', 'what we do', 'interior design'],
    },
    {
      questionEn: 'What areas do you serve in the UAE?',
      questionAr: 'ما هي المناطق التي تخدمونها في الإمارات؟',
      answerEn:
        'We serve all major areas across the UAE including Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, and Fujairah. Our team is equipped to handle projects throughout the Emirates with the same level of excellence and attention to detail.',
      answerAr:
        'نخدم جميع المناطق الرئيسية في جميع أنحاء الإمارات بما في ذلك دبي وأبو ظبي والشارقة وعجمان ورأس الخيمة والفجيرة. فريقنا مجهز للتعامل مع المشاريع في جميع أنحاء الإمارات بنفس المستوى من التميز والاهتمام بالتفاصيل.',
      category: 'general',
      order: 2,
      locale: 'en',
      featured: false,
      published: true,
      keywords: ['location', 'service area', 'UAE', 'Dubai', 'Abu Dhabi'],
    },
    {
      questionEn: 'Do you work on both residential and commercial projects?',
      questionAr: 'هل تعملون على المشاريع السكنية والتجارية؟',
      answerEn:
        'Yes! We have extensive experience in both residential and commercial interior design. Our residential portfolio includes luxury villas, modern apartments, and contemporary penthouses. For commercial projects, we specialize in offices, retail spaces, restaurants, cafes, and hospitality venues.',
      answerAr:
        'نعم! لدينا خبرة واسعة في التصميم الداخلي السكني والتجاري. تشمل محفظتنا السكنية الفلل الفاخرة والشقق الحديثة والبنتهاوس المعاصر. بالنسبة للمشاريع التجارية، نتخصص في المكاتب ومساحات البيع بالتجزئة والمطاعم والمقاهي وأماكن الضيافة.',
      category: 'general',
      order: 3,
      locale: 'en',
      featured: true,
      published: true,
      keywords: ['residential', 'commercial', 'project types'],
    },

    // PRICING Category
    {
      questionEn: 'How much does an interior design project cost?',
      questionAr: 'كم تكلفة مشروع التصميم الداخلي؟',
      answerEn:
        'Project costs vary based on scope, size, complexity, and materials selected. We offer flexible pricing models including fixed-price packages, hourly consultation rates, and percentage-based fees. Contact us for a free consultation where we\'ll discuss your vision and provide a detailed quote tailored to your budget.',
      answerAr:
        'تختلف تكاليف المشروع بناءً على النطاق والحجم والتعقيد والمواد المختارة. نقدم نماذج تسعير مرنة بما في ذلك باقات السعر الثابت ومعدلات الاستشارة بالساعة والرسوم القائمة على النسبة المئوية. اتصل بنا للحصول على استشارة مجانية حيث سنناقش رؤيتك ونقدم عرض أسعار مفصل مصمم خصيصًا لميزانيتك.',
      category: 'pricing',
      order: 1,
      locale: 'en',
      featured: true,
      published: true,
      keywords: ['cost', 'pricing', 'budget', 'how much', 'fees'],
    },
    {
      questionEn: 'Do you offer payment plans?',
      questionAr: 'هل تقدمون خطط الدفع؟',
      answerEn:
        'Yes, we offer flexible payment plans to make your dream space more accessible. Typically, we structure payments in phases: initial deposit, design approval, procurement milestone, installation phase, and final completion. We\'ll work with you to create a payment schedule that aligns with your project timeline and budget.',
      answerAr:
        'نعم، نقدم خطط دفع مرنة لجعل مساحة أحلامك أكثر سهولة. عادةً ما نقوم بهيكلة المدفوعات في مراحل: الإيداع الأولي، الموافقة على التصميم، معلم الشراء، مرحلة التثبيت، والإكمال النهائي. سنعمل معك لإنشاء جدول دفع يتماشى مع الجدول الزمني لمشروعك وميزانيتك.',
      category: 'pricing',
      order: 2,
      locale: 'en',
      featured: false,
      published: true,
      keywords: ['payment', 'payment plan', 'installments', 'financing'],
    },
    {
      questionEn: 'Is the initial consultation free?',
      questionAr: 'هل الاستشارة الأولية مجانية؟',
      answerEn:
        'Yes! We offer a complimentary initial consultation where we discuss your project requirements, vision, timeline, and budget. This is an opportunity for us to understand your needs and for you to learn about our process and expertise. There\'s no obligation, and we\'re happy to answer all your questions.',
      answerAr:
        'نعم! نقدم استشارة أولية مجانية حيث نناقش متطلبات مشروعك ورؤيتك والجدول الزمني والميزانية. هذه فرصة لنا لفهم احتياجاتك ولك لمعرفة المزيد عن عمليتنا وخبرتنا. لا يوجد التزام، ونحن سعداء للإجابة على جميع أسئلتك.',
      category: 'pricing',
      order: 3,
      locale: 'en',
      featured: true,
      published: true,
      keywords: ['consultation', 'free', 'initial meeting', 'no cost'],
    },

    // PROCESS Category
    {
      questionEn: 'What is your design process from start to finish?',
      questionAr: 'ما هي عملية التصميم الخاصة بك من البداية إلى النهاية؟',
      answerEn:
        'Our process includes 6 key phases: (1) Initial Consultation - discuss vision and requirements, (2) Concept Development - create mood boards and initial designs, (3) Design Development - detailed plans, 3D renderings, and material selection, (4) Approval & Refinement - review and finalize designs, (5) Procurement & Implementation - sourcing materials and installation, (6) Final Reveal - walkthrough and handover.',
      answerAr:
        'تتضمن عمليتنا 6 مراحل رئيسية: (1) الاستشارة الأولية - مناقشة الرؤية والمتطلبات، (2) تطوير المفهوم - إنشاء لوحات المزاج والتصاميم الأولية، (3) تطوير التصميم - خطط مفصلة وعروض ثلاثية الأبعاد واختيار المواد، (4) الموافقة والتحسين - مراجعة التصاميم ووضعها في صيغتها النهائية، (5) الشراء والتنفيذ - الحصول على المواد والتثبيت، (6) الكشف النهائي - المرور والتسليم.',
      category: 'process',
      order: 1,
      locale: 'en',
      featured: true,
      published: true,
      keywords: ['process', 'workflow', 'how it works', 'steps', 'phases'],
    },
    {
      questionEn: 'How long does a typical interior design project take?',
      questionAr: 'كم من الوقت يستغرق مشروع التصميم الداخلي النموذجي؟',
      answerEn:
        'Timeline varies based on project scope. Small projects (single room refresh) may take 4-6 weeks. Medium projects (apartment or villa partial renovation) typically require 2-3 months. Large projects (complete villa or commercial space) can take 4-6 months. We provide a detailed timeline during the consultation phase.',
      answerAr:
        'يختلف الجدول الزمني بناءً على نطاق المشروع. قد تستغرق المشاريع الصغيرة (تحديث غرفة واحدة) 4-6 أسابيع. تتطلب المشاريع المتوسطة (تجديد جزئي للشقة أو الفيلا) عادةً 2-3 أشهر. يمكن أن تستغرق المشاريع الكبيرة (فيلا كاملة أو مساحة تجارية) 4-6 أشهر. نقدم جدولًا زمنيًا مفصلًا خلال مرحلة الاستشارة.',
      category: 'process',
      order: 2,
      locale: 'en',
      featured: true,
      published: true,
      keywords: ['timeline', 'duration', 'how long', 'time', 'schedule'],
    },
    {
      questionEn: 'Will I have input throughout the design process?',
      questionAr: 'هل سيكون لي مدخلات طوال عملية التصميم؟',
      answerEn:
        'Absolutely! We believe in collaborative design. You\'ll be involved in every major decision - from initial concept approval to final material selection. We schedule regular check-ins and presentations to ensure the design reflects your vision. Your feedback is essential to creating a space you\'ll love.',
      answerAr:
        'بالتأكيد! نؤمن بالتصميم التعاوني. ستشارك في كل قرار رئيسي - من الموافقة على المفهوم الأولي إلى اختيار المواد النهائي. نجدول عمليات تحقق وعروض تقديمية منتظمة للتأكد من أن التصميم يعكس رؤيتك. ملاحظاتك ضرورية لإنشاء مساحة ستحبها.',
      category: 'process',
      order: 3,
      locale: 'en',
      featured: false,
      published: true,
      keywords: ['collaboration', 'input', 'involvement', 'feedback'],
    },

    // SERVICES Category
    {
      questionEn: 'Do you provide 3D visualization of designs?',
      questionAr: 'هل تقدمون التصور ثلاثي الأبعاد للتصاميم؟',
      answerEn:
        'Yes! We create photorealistic 3D renderings and visualizations for all our projects. This allows you to see exactly how your space will look before any work begins. We also offer virtual reality walkthroughs for select projects, giving you an immersive preview of your future space.',
      answerAr:
        'نعم! نقوم بإنشاء عروض وتصورات ثلاثية الأبعاد واقعية لجميع مشاريعنا. يتيح لك هذا رؤية كيف ستبدو مساحتك بالضبط قبل بدء أي عمل. نقدم أيضًا جولات واقع افتراضي لمشاريع مختارة، مما يمنحك معاينة غامرة لمساحتك المستقبلية.',
      category: 'services',
      order: 1,
      locale: 'en',
      featured: true,
      published: true,
      keywords: ['3D', 'visualization', 'rendering', 'virtual reality', 'VR'],
    },
    {
      questionEn: 'Can you help with furniture selection and custom pieces?',
      questionAr: 'هل يمكنك المساعدة في اختيار الأثاث والقطع المخصصة؟',
      answerEn:
        'Definitely! We offer complete furniture solutions including sourcing from premium brands, custom-designed pieces built to your specifications, and coordination with local craftsmen. Whether you prefer ready-made luxury furniture or bespoke creations, we\'ll curate the perfect pieces for your space.',
      answerAr:
        'بالتأكيد! نقدم حلول أثاث كاملة بما في ذلك الحصول على قطع من العلامات التجارية الممتازة والقطع المصممة خصيصًا والمبنية وفقًا لمواصفاتك والتنسيق مع الحرفيين المحليين. سواء كنت تفضل الأثاث الفاخر الجاهز أو الإبداعات المخصصة، سنختار القطع المثالية لمساحتك.',
      category: 'services',
      order: 2,
      locale: 'en',
      featured: false,
      published: true,
      keywords: ['furniture', 'custom', 'bespoke', 'selection'],
    },
    {
      questionEn: 'Do you handle the entire project including contractors?',
      questionAr: 'هل تتعاملون مع المشروع بأكمله بما في ذلك المقاولين؟',
      answerEn:
        'Yes, we offer full turnkey services. We manage all aspects including coordination with contractors, electricians, plumbers, painters, and installers. Our project management team ensures everything is executed to our exacting standards, on time and within budget. You get a single point of contact for peace of mind.',
      answerAr:
        'نعم، نقدم خدمات جاهزة كاملة. نحن ندير جميع الجوانب بما في ذلك التنسيق مع المقاولين والكهربائيين والسباكين والرسامين والمثبتين. يضمن فريق إدارة المشروع لدينا تنفيذ كل شيء وفقًا لمعاييرنا الدقيقة في الوقت المحدد وضمن الميزانية. تحصل على نقطة اتصال واحدة لراحة البال.',
      category: 'services',
      order: 3,
      locale: 'en',
      featured: true,
      published: true,
      keywords: ['turnkey', 'project management', 'contractors', 'full service'],
    },

    // TECHNICAL Category
    {
      questionEn: 'What design styles do you specialize in?',
      questionAr: 'ما هي أنماط التصميم التي تتخصصون فيها؟',
      answerEn:
        'We excel in a wide range of styles including Modern Contemporary, Minimalist, Luxury Classic, Industrial Chic, Scandinavian, Mid-Century Modern, Arabic/Islamic Contemporary, and Transitional designs. Our expertise lies in understanding your preferences and creating cohesive spaces that reflect your personality and lifestyle.',
      answerAr:
        'نتفوق في مجموعة واسعة من الأنماط بما في ذلك المعاصر الحديث والبسيط والكلاسيكي الفاخر والصناعي الأنيق والإسكندنافي والحديث من منتصف القرن والعربي/الإسلامي المعاصر والتصاميم الانتقالية. تكمن خبرتنا في فهم تفضيلاتك وإنشاء مساحات متماسكة تعكس شخصيتك ونمط حياتك.',
      category: 'technical',
      order: 1,
      locale: 'en',
      featured: false,
      published: true,
      keywords: ['styles', 'modern', 'contemporary', 'classic', 'minimalist'],
    },
    {
      questionEn: 'Are your designs sustainable and eco-friendly?',
      questionAr: 'هل تصاميمكم مستدامة وصديقة للبيئة؟',
      answerEn:
        'We prioritize sustainability by incorporating eco-friendly materials, energy-efficient lighting, water-saving fixtures, and sustainable sourcing practices. We work with suppliers who share our commitment to environmental responsibility. Many of our projects feature green certifications and contribute to healthier indoor environments.',
      answerAr:
        'نعطي الأولوية للاستدامة من خلال دمج المواد الصديقة للبيئة والإضاءة الموفرة للطاقة وتركيبات توفير المياه وممارسات التوريد المستدامة. نعمل مع الموردين الذين يشاركوننا التزامنا بالمسؤولية البيئية. تتميز العديد من مشاريعنا بشهادات خضراء وتساهم في بيئات داخلية أكثر صحة.',
      category: 'technical',
      order: 2,
      locale: 'en',
      featured: false,
      published: true,
      keywords: ['sustainable', 'eco-friendly', 'green', 'environment'],
    },
  ];

  for (const faq of faqs) {
    await prisma.fAQ.create({
      data: faq,
    });
    console.log(`✅ Created FAQ: ${faq.questionEn.substring(0, 50)}...`);
  }

  console.log(`🎉 Seeding completed! Added ${faqs.length} FAQs.`);
  console.log('\n📊 Breakdown by category:');
  console.log(`  - General: ${faqs.filter((f) => f.category === 'general').length}`);
  console.log(`  - Pricing: ${faqs.filter((f) => f.category === 'pricing').length}`);
  console.log(`  - Process: ${faqs.filter((f) => f.category === 'process').length}`);
  console.log(`  - Services: ${faqs.filter((f) => f.category === 'services').length}`);
  console.log(`  - Technical: ${faqs.filter((f) => f.category === 'technical').length}`);

  console.log('\n📊 Test the GraphQL API:');
  console.log('  URL: http://localhost:3010/api/graphql');
  console.log('  Query:');
  console.log('  query {');
  console.log('    faqs(filter: { locale: "en", published: true }) {');
  console.log('      id');
  console.log('      questionEn');
  console.log('      answerEn');
  console.log('      category');
  console.log('    }');
  console.log('  }');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding FAQs:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
