const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Team Members...');

  const teamMembers = [
    // Leadership / Design Team
    {
      nameEn: 'Layla Al-Hamadi',
      nameAr: 'ليلى الحمادي',
      roleEn: 'Lead Interior Designer & Creative Director',
      roleAr: 'مصممة داخلية رئيسية ومديرة إبداعية',
      bioEn:
        'With over 15 years of experience in luxury interior design, Layla leads our creative vision with a unique blend of contemporary elegance and cultural authenticity. Her award-winning designs have transformed some of the UAE\'s most prestigious residential and commercial spaces. Layla\'s philosophy centers on creating timeless spaces that tell stories while exceeding functional requirements.',
      bioAr:
        'مع أكثر من 15 عامًا من الخبرة في التصميم الداخلي الفاخر، تقود ليلى رؤيتنا الإبداعية بمزيج فريد من الأناقة المعاصرة والأصالة الثقافية. حولت تصاميمها الحائزة على جوائز بعضًا من أكثر المساحات السكنية والتجارية المرموقة في دولة الإمارات.',
      specialties: ['Luxury Residential Design', 'Modern Contemporary', 'Space Planning', 'Color Theory'],
      yearsExperience: 15,
      education: 'Master of Fine Arts in Interior Design, Rhode Island School of Design (RISD)',
      certifications: ['NCIDQ Certified', 'LEED AP Interior Design + Construction'],
      profileImage: '/images/team/layla-alhamadi.jpg',
      email: 'layla@mouhajer.design',
      linkedin: 'https://linkedin.com/in/layla-alhamadi',
      instagram: 'https://instagram.com/layla_designs',
      portfolio: 'https://laylaalhamadi.design',
      department: 'Design',
      order: 1,
      locale: 'en',
      featured: true,
      published: true,
      joinedAt: new Date('2015-03-15'),
    },
    {
      nameEn: 'Omar Khalil',
      nameAr: 'عمر خليل',
      roleEn: 'Senior Architect & Project Lead',
      roleAr: 'مهندس معماري أول وقائد مشروع',
      bioEn:
        'Omar brings architectural precision to every project with his background in both traditional and modern architectural styles. His expertise in spatial design and structural integration ensures that beauty and function coexist seamlessly. Having worked on projects across the GCC, Omar excels at translating client visions into architectural reality.',
      bioAr:
        'يجلب عمر الدقة المعمارية لكل مشروع بخلفيته في الأساليب المعمارية التقليدية والحديثة. تضمن خبرته في التصميم المكاني والتكامل الهيكلي أن الجمال والوظيفة يتعايشان بسلاسة.',
      specialties: ['Architectural Design', 'Structural Integration', 'CAD & BIM', 'Sustainable Architecture'],
      yearsExperience: 12,
      education: 'Bachelor of Architecture, American University of Sharjah',
      certifications: ['RIBA Chartered Architect', 'LEED Green Associate'],
      profileImage: '/images/team/omar-khalil.jpg',
      email: 'omar@mouhajer.design',
      linkedin: 'https://linkedin.com/in/omar-khalil',
      behance: 'https://behance.net/omar-khalil',
      department: 'Architecture',
      order: 2,
      locale: 'en',
      featured: true,
      published: true,
      joinedAt: new Date('2016-07-01'),
    },
    {
      nameEn: 'Fatima Al-Mazrouei',
      nameAr: 'فاطمة المزروعي',
      roleEn: 'Interior Designer - Residential Specialist',
      roleAr: 'مصممة داخلية - متخصصة في المساحات السكنية',
      bioEn:
        'Fatima\'s warm approach to residential design creates homes that nurture and inspire. Specializing in family-oriented spaces, she masterfully balances aesthetic appeal with practical living needs. Her designs are known for their thoughtful storage solutions, natural light optimization, and cultural sensitivity to Emirati lifestyles.',
      bioAr:
        'يخلق نهج فاطمة الدافئ في التصميم السكني منازل ترعى وتلهم. متخصصة في المساحات الموجهة للعائلة، فهي توازن ببراعة بين الجاذبية الجمالية واحتياجات المعيشة العملية.',
      specialties: ['Residential Design', 'Family Spaces', 'Storage Solutions', 'Emirati Interior Design'],
      yearsExperience: 8,
      education: 'Bachelor of Interior Design, UAE University',
      certifications: ['Certified Interior Designer (CID)', 'Residential Design Specialist'],
      profileImage: '/images/team/fatima-almazrouei.jpg',
      email: 'fatima@mouhajer.design',
      instagram: 'https://instagram.com/fatima_interiors',
      department: 'Design',
      order: 3,
      locale: 'en',
      featured: true,
      published: true,
      joinedAt: new Date('2018-01-10'),
    },
    {
      nameEn: 'Ahmed Al-Rashid',
      nameAr: 'أحمد الراشد',
      roleEn: 'Commercial Design Specialist',
      roleAr: 'أخصائي التصميم التجاري',
      bioEn:
        'Ahmed transforms commercial spaces into profitable, engaging environments. His portfolio includes restaurants, retail spaces, and office headquarters across Dubai and Abu Dhabi. Understanding that commercial design directly impacts business success, Ahmed combines brand identity with customer psychology to create spaces that drive performance.',
      bioAr:
        'يحول أحمد المساحات التجارية إلى بيئات مربحة وجذابة. تتضمن محفظته المطاعم ومساحات البيع بالتجزئة ومقرات المكاتب في دبي وأبو ظبي.',
      specialties: ['Commercial Interiors', 'Restaurant Design', 'Retail Spaces', 'Brand Integration'],
      yearsExperience: 10,
      education: 'Master of Interior Architecture, Parsons School of Design',
      certifications: ['NCIDQ Certified', 'Retail Design Certification'],
      profileImage: '/images/team/ahmed-alrashid.jpg',
      email: 'ahmed@mouhajer.design',
      linkedin: 'https://linkedin.com/in/ahmed-alrashid',
      behance: 'https://behance.net/ahmed-commercial',
      department: 'Design',
      order: 4,
      locale: 'en',
      featured: false,
      published: true,
      joinedAt: new Date('2017-05-20'),
    },
    {
      nameEn: 'Sarah Chen',
      nameAr: 'سارة تشين',
      roleEn: '3D Visualization Specialist',
      roleAr: 'أخصائية التصور ثلاثي الأبعاد',
      bioEn:
        'Sarah brings designs to life before a single wall is painted. Her photorealistic 3D renderings and virtual reality experiences allow clients to walk through their future spaces with confidence. With expertise in the latest visualization technologies, Sarah ensures no detail is overlooked in the design phase.',
      bioAr:
        'تجلب سارة التصاميم إلى الحياة قبل طلاء جدار واحد. تسمح عروضها ثلاثية الأبعاد الواقعية وتجارب الواقع الافتراضي للعملاء بالمرور عبر مساحاتهم المستقبلية بثقة.',
      specialties: ['3D Rendering', 'Virtual Reality', 'SketchUp', 'V-Ray', 'Enscape'],
      yearsExperience: 6,
      education: 'Bachelor of Digital Arts & Design, SAE Institute Dubai',
      certifications: ['Autodesk Certified Professional', 'V-Ray Certified Specialist'],
      profileImage: '/images/team/sarah-chen.jpg',
      email: 'sarah@mouhajer.design',
      behance: 'https://behance.net/sarahchen3d',
      instagram: 'https://instagram.com/sarah3dviz',
      department: 'Visualization',
      order: 5,
      locale: 'en',
      featured: false,
      published: true,
      joinedAt: new Date('2019-09-01'),
    },
    {
      nameEn: 'Khalid bin Mohammed',
      nameAr: 'خالد بن محمد',
      roleEn: 'Project Manager & Client Relations',
      roleAr: 'مدير المشاريع وعلاقات العملاء',
      bioEn:
        'Khalid ensures every project runs smoothly from initial consultation to final handover. His exceptional organizational skills and client-focused approach have earned him recognition for delivering complex projects on time and within budget. Khalid serves as the vital link between design vision and practical execution.',
      bioAr:
        'يضمن خالد أن كل مشروع يعمل بسلاسة من الاستشارة الأولية إلى التسليم النهائي. حصلت مهاراته التنظيمية الاستثنائية ونهجه المركز على العملاء على تقدير لتسليم المشاريع المعقدة في الوقت المحدد وضمن الميزانية.',
      specialties: ['Project Management', 'Client Relations', 'Budget Management', 'Vendor Coordination'],
      yearsExperience: 11,
      education: 'MBA in Project Management, American University in Dubai',
      certifications: ['PMP Certified', 'Prince2 Practitioner', 'Agile Project Management'],
      profileImage: '/images/team/khalid-binmohammed.jpg',
      email: 'khalid@mouhajer.design',
      phone: '+971 50 123 4567',
      linkedin: 'https://linkedin.com/in/khalid-binmohammed',
      department: 'Project Management',
      order: 6,
      locale: 'en',
      featured: false,
      published: true,
      joinedAt: new Date('2016-11-15'),
    },
    {
      nameEn: 'Mariam Al-Suwaidi',
      nameAr: 'مريم السويدي',
      roleEn: 'Sustainability & Materials Consultant',
      roleAr: 'مستشارة الاستدامة والمواد',
      bioEn:
        'Mariam is our expert in sustainable design practices and eco-friendly materials. She stays ahead of green building trends and ensures our projects meet environmental standards while maintaining luxury and comfort. Her material library knowledge spans traditional craftsmanship to cutting-edge sustainable innovations.',
      bioAr:
        'مريم هي خبيرتنا في ممارسات التصميم المستدام والمواد الصديقة للبيئة. تبقى في طليعة اتجاهات المباني الخضراء وتضمن أن مشاريعنا تلبي المعايير البيئية مع الحفاظ على الفخامة والراحة.',
      specialties: ['Sustainable Design', 'Material Selection', 'LEED Consulting', 'Eco-Friendly Solutions'],
      yearsExperience: 7,
      education: 'Master of Sustainable Design, Heriot-Watt University Dubai',
      certifications: ['LEED AP BD+C', 'WELL AP', 'Green Building Consultant'],
      profileImage: '/images/team/mariam-alsuwaidi.jpg',
      email: 'mariam@mouhajer.design',
      linkedin: 'https://linkedin.com/in/mariam-alsuwaidi',
      department: 'Sustainability',
      order: 7,
      locale: 'en',
      featured: false,
      published: true,
      joinedAt: new Date('2018-08-01'),
    },
    {
      nameEn: 'David Thompson',
      nameAr: 'ديفيد تومبسون',
      roleEn: 'Technical Drawing & CAD Specialist',
      roleAr: 'أخصائي الرسم الفني والكاد',
      bioEn:
        'David\'s precision in technical drawings ensures flawless execution of design concepts. With expertise in AutoCAD, Revit, and BIM technologies, he creates the detailed documentation that brings ideas to reality. His attention to detail prevents costly errors and ensures smooth collaboration with contractors.',
      bioAr:
        'تضمن دقة ديفيد في الرسومات الفنية تنفيذًا لا تشوبه شائبة لمفاهيم التصميم. مع الخبرة في AutoCAD و Revit وتقنيات BIM، يقوم بإنشاء الوثائق التفصيلية التي تجلب الأفكار إلى الواقع.',
      specialties: ['AutoCAD', 'Revit', 'BIM', 'Technical Documentation', 'Construction Drawings'],
      yearsExperience: 9,
      education: 'Bachelor of Architectural Technology, BCIT Canada',
      certifications: ['Autodesk Certified Professional', 'Revit Architecture Specialist'],
      profileImage: '/images/team/david-thompson.jpg',
      email: 'david@mouhajer.design',
      linkedin: 'https://linkedin.com/in/david-thompson-cad',
      department: 'Technical',
      order: 8,
      locale: 'en',
      featured: false,
      published: true,
      joinedAt: new Date('2017-12-01'),
    },
  ];

  for (const teamMember of teamMembers) {
    await prisma.teamMember.create({
      data: teamMember,
    });
    console.log(`✅ Created Team Member: ${teamMember.nameEn} - ${teamMember.roleEn}`);
  }

  console.log(`\n🎉 Seeding completed! Added ${teamMembers.length} team members.`);
  console.log('\n📊 Breakdown by department:');
  console.log(`  - Design: ${teamMembers.filter((t) => t.department === 'Design').length}`);
  console.log(`  - Architecture: ${teamMembers.filter((t) => t.department === 'Architecture').length}`);
  console.log(`  - Visualization: ${teamMembers.filter((t) => t.department === 'Visualization').length}`);
  console.log(`  - Project Management: ${teamMembers.filter((t) => t.department === 'Project Management').length}`);
  console.log(`  - Sustainability: ${teamMembers.filter((t) => t.department === 'Sustainability').length}`);
  console.log(`  - Technical: ${teamMembers.filter((t) => t.department === 'Technical').length}`);

  console.log('\n📊 Featured members:', teamMembers.filter((t) => t.featured).length);

  console.log('\n📊 Test the GraphQL API:');
  console.log('  URL: http://localhost:3010/api/graphql');
  console.log('  Query:');
  console.log('  query {');
  console.log('    teamMembers(filter: { locale: "en", published: true }, limit: 5) {');
  console.log('      id');
  console.log('      nameEn');
  console.log('      roleEn');
  console.log('      department');
  console.log('      featured');
  console.log('    }');
  console.log('  }');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding team members:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
