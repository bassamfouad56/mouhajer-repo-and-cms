import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load .env.local
try {
  const envPath = resolve(process.cwd(), '.env.local')
  const envContent = readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim().replace(/^["']|["']$/g, '')
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  })
} catch (e) {
  console.log('Note: Could not load .env.local')
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'b6q28exv',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'mouhajer-db',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const homepageDocument = {
  _id: 'homepage',
  _type: 'homepage',
  title: 'Homepage',
  sections: [
    // 1. Hero Section
    {
      _key: 'hero-section',
      _type: 'heroSection',
      enabled: true,
      headline: {
        en: 'Exceptional Interior Design & Construction',
        ar: 'تصميم وإنشاء داخلي استثنائي'
      },
      subheadline: {
        en: 'Transforming visions into luxury realities across Dubai and the UAE',
        ar: 'تحويل الرؤى إلى حقائق فاخرة في دبي والإمارات'
      },
      videoUrl: '/banner-2s.mp4',
      primaryCta: {
        text: { en: 'Start Your Project', ar: 'ابدأ مشروعك' },
        link: '/contact'
      },
      secondaryCta: {
        text: { en: 'View Projects', ar: 'عرض المشاريع' },
        link: '/projects'
      },
      showAwardBadge: true,
      showScrollIndicator: true
    },

    // 2. Unified Showcase Section
    {
      _key: 'showcase-section',
      _type: 'showcaseSection',
      enabled: true,
      clientTypes: [
        {
          title: { en: 'Land Owners', ar: 'ملاك الأراضي' },
          subtitle: { en: 'Build Your Vision', ar: 'ابنِ رؤيتك' },
          stat: {
            value: '200+',
            label: { en: 'Projects Completed', ar: 'مشروع مكتمل' }
          },
          link: '/services'
        },
        {
          title: { en: 'Property Owners', ar: 'ملاك العقارات' },
          subtitle: { en: 'Transform Your Space', ar: 'حوّل مساحتك' },
          stat: {
            value: '500+',
            label: { en: 'Spaces Transformed', ar: 'مساحة محولة' }
          },
          link: '/services'
        }
      ],
      panels: [
        {
          number: '01',
          title: { en: 'We Build', ar: 'نحن نبني' },
          subtitle: { en: 'The Main Contractor', ar: 'المقاول الرئيسي' },
          services: [
            { en: 'Civil Works', ar: 'الأعمال المدنية' },
            { en: 'Structural Engineering', ar: 'الهندسة الإنشائية' },
            { en: 'MEP Systems', ar: 'أنظمة MEP' },
            { en: 'Premium Finishing', ar: 'التشطيبات الفاخرة' }
          ],
          link: '/services/civil-construction'
        },
        {
          number: '02',
          title: { en: 'We Design', ar: 'نحن نصمم' },
          subtitle: { en: 'The Design Studio', ar: 'استوديو التصميم' },
          services: [
            { en: 'Architecture', ar: 'العمارة' },
            { en: 'Interior Design', ar: 'التصميم الداخلي' },
            { en: '3D Visualization', ar: 'التصور ثلاثي الأبعاد' },
            { en: 'Technical Documentation', ar: 'التوثيق الفني' }
          ],
          link: '/services/interior-architecture'
        },
        {
          number: '03',
          title: { en: 'We Make', ar: 'نحن نصنع' },
          subtitle: { en: 'The Mouhajer Factory', ar: 'مصنع مهاجر' },
          services: [
            { en: 'Custom Joinery', ar: 'النجارة المخصصة' },
            { en: 'Bespoke Furniture', ar: 'الأثاث المصمم' },
            { en: 'Precision Metalwork', ar: 'الأعمال المعدنية الدقيقة' },
            { en: 'Artisan Crafts', ar: 'الحرف اليدوية' }
          ],
          link: '/services/manufacturing-joinery'
        }
      ]
    },

    // 3. Stats Section
    {
      _key: 'stats-section',
      _type: 'statsSection',
      enabled: true,
      stats: [
        { value: 400, suffix: '+', label: { en: 'Projects Completed', ar: 'مشروع مكتمل' } },
        { value: 20, suffix: '+', label: { en: 'Years Experience', ar: 'سنة خبرة' } },
        { value: 10, suffix: '+', label: { en: 'International Awards', ar: 'جائزة دولية' } },
        { value: 100, suffix: '%', label: { en: 'Client Satisfaction', ar: 'رضا العملاء' } }
      ]
    },

    // 4. Logo Marquee Section
    {
      _key: 'logo-marquee-section',
      _type: 'logoMarqueeSection',
      enabled: true,
      sectionTitle: {
        en: 'Trusted by Leading Brands',
        ar: 'موثوق من العلامات التجارية الرائدة'
      },
      displayMode: 'auto',
      animationSpeed: 'normal'
    },

    // 5. Founder Section
    {
      _key: 'founder-section',
      _type: 'founderSection',
      enabled: true,
      sectionTitle: {
        en: "We Don't Just Draw. We Build.",
        ar: 'نحن لا نرسم فقط. نحن نبني.'
      },
      founderName: 'Eng. Maher Mouhajer',
      founderTitle: {
        en: 'Founder & CEO',
        ar: 'المؤسس والرئيس التنفيذي'
      },
      quote: {
        en: 'In 20+ years of delivering luxury projects across the Middle East, I have learned that excellence is not about expensive materials—it is about the precision of execution, the integrity of craftsmanship, and the accountability of one unified team.',
        ar: 'على مدار أكثر من 20 عامًا من تسليم المشاريع الفاخرة في جميع أنحاء الشرق الأوسط، تعلمت أن التميز لا يتعلق بالمواد باهظة الثمن - بل يتعلق بدقة التنفيذ ونزاهة الحرفية ومسؤولية فريق واحد موحد.'
      },
      message: {
        en: 'That is why MIDC was built differently. We are not a design studio that hands off to a contractor. We are not a contractor who blames the designer. We are one company that owns every millimeter—from the first sketch to the final key.',
        ar: 'لهذا السبب تم بناء MIDC بشكل مختلف. نحن لسنا استوديو تصميم يسلم إلى مقاول. نحن لسنا مقاولًا يلوم المصمم. نحن شركة واحدة تمتلك كل مليمتر - من أول رسم إلى المفتاح النهائي.'
      },
      ctaText: {
        en: 'Read the Full Story',
        ar: 'اقرأ القصة الكاملة'
      },
      ctaLink: '/about'
    },

    // 6. Capabilities Section
    {
      _key: 'capabilities-section',
      _type: 'capabilitiesSection',
      enabled: true,
      sectionTitle: {
        en: 'Our Capabilities',
        ar: 'قدراتنا'
      },
      capabilities: [
        {
          title: { en: 'Build', ar: 'بناء' },
          subtitle: { en: 'Civil Construction', ar: 'البناء المدني' },
          description: { en: 'Complete civil works and structural engineering for new builds and renovations.', ar: 'أعمال مدنية كاملة وهندسة إنشائية للمباني الجديدة والتجديدات.' },
          link: '/services/civil-construction'
        },
        {
          title: { en: 'Design', ar: 'تصميم' },
          subtitle: { en: 'Interior Architecture', ar: 'العمارة الداخلية' },
          description: { en: 'Bespoke interior design that balances aesthetics with functionality.', ar: 'تصميم داخلي مخصص يوازن بين الجماليات والوظائف.' },
          link: '/services/interior-architecture'
        },
        {
          title: { en: 'Power', ar: 'طاقة' },
          subtitle: { en: 'MEP Engineering', ar: 'هندسة MEP' },
          description: { en: 'Integrated mechanical, electrical, and plumbing systems engineering.', ar: 'هندسة أنظمة ميكانيكية وكهربائية وسباكة متكاملة.' },
          link: '/services/mep-engineering'
        },
        {
          title: { en: 'Make', ar: 'صنع' },
          subtitle: { en: 'Manufacturing & Joinery', ar: 'التصنيع والنجارة' },
          description: { en: 'Custom furniture and joinery crafted in our own factory.', ar: 'أثاث ونجارة مخصصة مصنوعة في مصنعنا الخاص.' },
          link: '/services/manufacturing-joinery'
        },
        {
          title: { en: 'Install', ar: 'تركيب' },
          subtitle: { en: 'Fit-Out Execution', ar: 'تنفيذ التشطيبات' },
          description: { en: 'Precision installation and fit-out of all interior elements.', ar: 'تركيب وتشطيب دقيق لجميع العناصر الداخلية.' },
          link: '/services/fit-out-execution'
        },
        {
          title: { en: 'Care', ar: 'رعاية' },
          subtitle: { en: 'Handover & Maintenance', ar: 'التسليم والصيانة' },
          description: { en: 'Complete handover support and ongoing maintenance services.', ar: 'دعم تسليم كامل وخدمات صيانة مستمرة.' },
          link: '/services/handover-maintenance'
        }
      ],
      ctaText: {
        en: 'Explore Services',
        ar: 'استكشف الخدمات'
      },
      ctaLink: '/services'
    },

    // 7. Portfolio Section
    {
      _key: 'portfolio-section',
      _type: 'portfolioSection',
      enabled: true,
      sectionTitle: {
        en: 'Selected Works',
        ar: 'أعمال مختارة'
      },
      sectionSubtitle: {
        en: 'A showcase of our finest projects across hospitality, residential, and commercial sectors.',
        ar: 'عرض لأفضل مشاريعنا في قطاعات الضيافة والسكن والتجارة.'
      },
      displayMode: 'auto',
      maxProjects: 12,
      ctaText: {
        en: 'View All Projects',
        ar: 'عرض جميع المشاريع'
      },
      ctaLink: '/projects'
    },

    // 8. Industries Section
    {
      _key: 'industries-section',
      _type: 'industriesSection',
      enabled: true,
      sectionTitle: {
        en: 'Industries We Serve',
        ar: 'الصناعات التي نخدمها'
      },
      displayMode: 'auto',
      ctaText: {
        en: 'Explore Industries',
        ar: 'استكشف الصناعات'
      },
      ctaLink: '/industries'
    },

    // 9. Partners Section
    {
      _key: 'partners-section',
      _type: 'partnersSection',
      enabled: true,
      sectionTitle: {
        en: 'Strategic Partners & Testimonials',
        ar: 'الشركاء الاستراتيجيون والشهادات'
      },
      showPartners: true,
      showTestimonials: true
    },

    // 10. Certifications Section
    {
      _key: 'certifications-section',
      _type: 'certificationsSection',
      enabled: true,
      sectionTitle: {
        en: 'Certifications & Awards',
        ar: 'الشهادات والجوائز'
      },
      certifications: [
        {
          code: 'ISO 9001',
          name: 'Quality Management',
          description: { en: 'Quality Management System Certification', ar: 'شهادة نظام إدارة الجودة' }
        },
        {
          code: 'ISO 14001',
          name: 'Environmental Management',
          description: { en: 'Environmental Management System Certification', ar: 'شهادة نظام الإدارة البيئية' }
        },
        {
          code: 'ISO 45001',
          name: 'Health & Safety',
          description: { en: 'Occupational Health & Safety Certification', ar: 'شهادة الصحة والسلامة المهنية' }
        }
      ],
      awards: [
        {
          title: { en: 'Best Hotel Suite Interior', ar: 'أفضل تصميم داخلي لجناح فندقي' },
          year: '2023-2024',
          organization: 'Design Awards UAE'
        },
        {
          title: { en: 'Best Residential Interior', ar: 'أفضل تصميم داخلي سكني' },
          year: '2023-2024',
          organization: 'Design Awards UAE'
        },
        {
          title: { en: 'Best Hotel Interior Abu Dhabi', ar: 'أفضل تصميم داخلي فندقي أبوظبي' },
          year: '2022-2023',
          organization: 'Hospitality Excellence Awards'
        }
      ]
    },

    // 11. FAQ Section
    {
      _key: 'faq-section',
      _type: 'faqSection',
      enabled: true,
      sectionTitle: {
        en: 'Clarity Before Commitment',
        ar: 'الوضوح قبل الالتزام'
      },
      sectionSubtitle: {
        en: 'Common questions answered',
        ar: 'الإجابة على الأسئلة الشائعة'
      },
      faqs: [
        {
          question: {
            en: 'Do you handle full construction from empty land?',
            ar: 'هل تتعاملون مع البناء الكامل من الأرض الفارغة؟'
          },
          answer: {
            en: 'Yes. Our Civil Construction division handles everything from foundations to finishing, giving you one accountable partner for your entire project.',
            ar: 'نعم. قسم البناء المدني لدينا يتعامل مع كل شيء من الأساسات إلى التشطيب، مما يمنحك شريكًا مسؤولًا واحدًا لمشروعك بالكامل.'
          }
        },
        {
          question: {
            en: 'Who manages government approvals?',
            ar: 'من يدير الموافقات الحكومية؟'
          },
          answer: {
            en: 'We handle all municipality permits, NOCs, and regulatory approvals as part of our service—no need to coordinate with multiple parties.',
            ar: 'نحن نتعامل مع جميع تصاريح البلدية وشهادات عدم الممانعة والموافقات التنظيمية كجزء من خدمتنا - لا حاجة للتنسيق مع أطراف متعددة.'
          }
        },
        {
          question: {
            en: 'Do you manufacture your own furniture?',
            ar: 'هل تصنعون أثاثكم الخاص؟'
          },
          answer: {
            en: 'Yes. Our 50,000 sq ft factory produces custom joinery, millwork, and furniture—ensuring quality control and faster delivery.',
            ar: 'نعم. مصنعنا الذي تبلغ مساحته 50,000 قدم مربع ينتج نجارة وأعمال خشبية وأثاثًا مخصصًا - مما يضمن مراقبة الجودة والتسليم الأسرع.'
          }
        },
        {
          question: {
            en: 'Can you renovate my hotel while it stays open?',
            ar: 'هل يمكنكم تجديد فندقي وهو يعمل؟'
          },
          answer: {
            en: 'Absolutely. We specialize in phased renovations that minimize disruption. Our Sheraton Abu Dhabi project was completed with the hotel at full occupancy.',
            ar: 'بالتأكيد. نحن متخصصون في التجديدات على مراحل التي تقلل من الاضطراب. تم إنجاز مشروع شيراتون أبوظبي مع الفندق بكامل إشغاله.'
          }
        },
        {
          question: {
            en: 'Do you provide maintenance after handover?',
            ar: 'هل تقدمون الصيانة بعد التسليم؟'
          },
          answer: {
            en: 'Yes. Our Handover & Maintenance division offers warranty support and ongoing maintenance contracts to protect your investment.',
            ar: 'نعم. قسم التسليم والصيانة لدينا يقدم دعم الضمان وعقود الصيانة المستمرة لحماية استثمارك.'
          }
        }
      ]
    },

    // 12. Contact Section
    {
      _key: 'contact-section',
      _type: 'contactSection',
      enabled: true,
      sectionTitle: {
        en: 'Start Your Project',
        ar: 'ابدأ مشروعك'
      },
      sectionSubtitle: {
        en: 'Ready to transform your space? Get in touch with our team.',
        ar: 'هل أنت مستعد لتحويل مساحتك؟ تواصل مع فريقنا.'
      },
      theme: 'light',
      contactInfo: {
        email: 'info@mouhajer.com',
        phone: '+971 4 123 4567',
        address: {
          en: 'MIDC Headquarters, Al Quoz Industrial Area, Dubai, UAE',
          ar: 'مقر MIDC، منطقة القوز الصناعية، دبي، الإمارات العربية المتحدة'
        },
        hours: 'Sun - Thu: 9:00 AM - 6:00 PM'
      }
    }
  ],
  seo: {
    metaTitle: {
      en: 'Mouhajer International Design & Contracting | Luxury Interior Design Dubai',
      ar: 'مهاجر الدولية للتصميم والمقاولات | تصميم داخلي فاخر دبي'
    },
    metaDescription: {
      en: 'Award-winning luxury interior design and construction in Dubai. From concept to completion, we deliver exceptional spaces for hospitality, residential, and commercial projects.',
      ar: 'تصميم داخلي فاخر وبناء حائز على جوائز في دبي. من الفكرة إلى الإنجاز، نقدم مساحات استثنائية لمشاريع الضيافة والسكن والتجارة.'
    }
  }
}

async function seedHomepage() {
  console.log('🏠 Seeding Homepage document...\n')

  try {
    // Check if homepage already exists
    const existing = await client.fetch('*[_type == "homepage"][0]._id')

    if (existing) {
      console.log('⚠️  Homepage document already exists.')
      console.log('   Do you want to replace it? (This will overwrite existing content)')
      console.log('   Run with --force flag to replace: node scripts/seed-homepage.mjs --force\n')

      if (!process.argv.includes('--force')) {
        console.log('Skipping... Use --force to overwrite.')
        return
      }

      console.log('🔄 Replacing existing homepage...')
      await client.delete(existing)
    }

    // Create the homepage document
    const result = await client.createOrReplace(homepageDocument)

    console.log('✅ Homepage document created successfully!')
    console.log(`   Document ID: ${result._id}`)
    console.log('\n📝 You can now edit the homepage content in Sanity Studio:')
    console.log('   https://mouhajer-new-marketing-website-eosin.vercel.app/studio/structure/homepage')
    console.log('\n💡 Tips:')
    console.log('   - Drag sections to reorder them')
    console.log('   - Toggle "Enabled" to show/hide sections')
    console.log('   - Edit content in both English and Arabic')

  } catch (error) {
    console.error('❌ Error seeding homepage:', error.message)
    throw error
  }
}

seedHomepage()
