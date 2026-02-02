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

// Fetch existing project images to use for the services page
async function getProjectImages() {
  console.log('📸 Fetching existing project images from Sanity...')

  const projects = await client.fetch(`
    *[_type == 'project' && defined(mainImage.asset)] | order(_createdAt desc) [0...10] {
      _id,
      title,
      mainImage
    }
  `)

  console.log(`   Found ${projects.length} projects with images`)
  return projects
}

// Create the services page document
async function seedServicesPage() {
  console.log('🛠️  Seeding Services Page document...\n')

  try {
    // Check if servicesPage already exists
    const existing = await client.fetch('*[_type == "servicesPage"][0]._id')

    if (existing) {
      console.log('⚠️  Services page document already exists.')
      console.log('   Do you want to replace it? (This will overwrite existing content)')
      console.log('   Run with --force flag to replace: node scripts/seed-services-page.mjs --force\n')

      if (!process.argv.includes('--force')) {
        console.log('Skipping... Use --force to overwrite.')
        return
      }

      console.log('🔄 Replacing existing services page...')
      await client.delete(existing)
    }

    // Get project images to use
    const projects = await getProjectImages()

    // Use first two project images for hero and turnkey sections
    const heroImage = projects[0]?.mainImage || null
    const turnkeyImage = projects[1]?.mainImage || projects[0]?.mainImage || null

    const servicesPageDocument = {
      _id: 'servicesPage',
      _type: 'servicesPage',

      // Hero Section
      heroTitle: {
        en: 'The Art of',
        ar: 'فن'
      },
      heroSubtitle: {
        en: 'Integrated Construction',
        ar: 'البناء المتكامل'
      },
      ...(heroImage && {
        heroImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: heroImage.asset._ref
          }
        }
      }),

      // Turnkey Section
      turnkeyTitle: {
        en: 'We Do Not',
        ar: 'نحن لا'
      },
      turnkeyTitleAccent: {
        en: 'Outsource Your Vision',
        ar: 'نستعين بمصادر خارجية لرؤيتك'
      },
      turnkeyParagraphs: [
        {
          en: 'In the UAE construction market, quality often gets lost in the handovers. Architects hand over to contractors. Contractors hand over to sub-contractors. By the end, the vision is diluted.',
          ar: 'في سوق البناء في الإمارات، غالبًا ما تضيع الجودة في عمليات التسليم. يسلم المهندسون المعماريون للمقاولين. يسلم المقاولون للمقاولين من الباطن. في النهاية، تتلاشى الرؤية.'
        },
        {
          en: 'MIDC was built to solve this. We are a true Turnkey Solution Provider.',
          ar: 'تم بناء MIDC لحل هذه المشكلة. نحن مزود حلول متكاملة حقيقي.'
        },
        {
          en: "From the initial 3D visualization created by Eng. Maher's design team to the final HVAC testing performed by our in-house MEP engineers, we control every single variable.",
          ar: 'من التصور ثلاثي الأبعاد الأولي الذي أنشأه فريق تصميم المهندس ماهر إلى اختبار التكييف النهائي الذي يجريه مهندسو MEP الداخليون لدينا، نتحكم في كل متغير.'
        }
      ],
      turnkeyHighlight: {
        en: 'No Blame Games.\nNo Delays.\nNo Compromise.',
        ar: 'لا ألعاب لوم.\nلا تأخيرات.\nلا تنازلات.'
      },
      ...(turnkeyImage && {
        turnkeyImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: turnkeyImage.asset._ref
          }
        }
      }),

      // Service Pillars Section
      pillarsLabel: {
        en: 'Complete Lifecycle Control',
        ar: 'التحكم الكامل في دورة الحياة'
      },
      pillarsTitle: {
        en: 'Our Core',
        ar: 'خدماتنا'
      },
      pillarsTitleAccent: {
        en: 'Service Pillars',
        ar: 'الأساسية'
      },

      // FAQ Section
      faqLabel: {
        en: 'Expert Insights',
        ar: 'رؤى الخبراء'
      },
      faqTitle: {
        en: 'Questions',
        ar: 'أسئلة'
      },
      faqTitleHighlight: {
        en: '& Answers',
        ar: 'وأجوبة'
      },
      faqs: [
        {
          question: {
            en: 'Do you handle the full construction scope from empty land?',
            ar: 'هل تتعاملون مع نطاق البناء الكامل من الأرض الفارغة؟'
          },
          answer: {
            en: 'Yes. We are a licensed Building Contractor (G+12). We handle excavation, concrete, structural steel, and all civil works. You do not need a separate builder.',
            ar: 'نعم. نحن مقاول بناء مرخص (G+12). نتعامل مع الحفريات والخرسانة والصلب الإنشائي وجميع الأعمال المدنية. لا تحتاج إلى مقاول منفصل.'
          }
        },
        {
          question: {
            en: 'Who manages the government approvals?',
            ar: 'من يدير الموافقات الحكومية؟'
          },
          answer: {
            en: 'We do. Our in-house engineering team handles all permits and NOCs from Dubai Municipality, Civil Defence, DEWA, and master developers like Nakheel or Emaar.',
            ar: 'نحن. فريق الهندسة الداخلي لدينا يتعامل مع جميع التصاريح وشهادات عدم الممانعة من بلدية دبي والدفاع المدني وديوا والمطورين الرئيسيين مثل نخيل أو إعمار.'
          }
        },
        {
          question: {
            en: 'Do you manufacture your own furniture?',
            ar: 'هل تصنعون أثاثكم الخاص؟'
          },
          answer: {
            en: 'Yes. We own a dedicated joinery and furniture factory. We custom-make doors, wardrobes, kitchens, and loose furniture to fit your space perfectly.',
            ar: 'نعم. نحن نملك مصنعًا مخصصًا للنجارة والأثاث. نصنع أبوابًا وخزائن ومطابخ وأثاثًا حسب الطلب ليناسب مساحتك تمامًا.'
          }
        },
        {
          question: {
            en: 'Can you renovate my hotel while it stays open?',
            ar: 'هل يمكنكم تجديد فندقي وهو يعمل؟'
          },
          answer: {
            en: 'Yes. We specialize in "live environment" renovations. We phase the work to ensure your guests are undisturbed and your revenue stream continues.',
            ar: 'نعم. نحن متخصصون في تجديدات "البيئة الحية". نقسم العمل على مراحل لضمان عدم إزعاج ضيوفك واستمرار تدفق إيراداتك.'
          }
        },
        {
          question: {
            en: 'Do you only do design, or can you build it too?',
            ar: 'هل تقومون بالتصميم فقط، أم يمكنكم البناء أيضًا؟'
          },
          answer: {
            en: 'We are a full Turnkey Solution Provider. We can design your project and then build it using our in-house construction and MEP teams. This is the preferred route for 90% of our clients as it guarantees quality and budget control.',
            ar: 'نحن مزود حلول متكاملة. يمكننا تصميم مشروعك ثم بنائه باستخدام فرق البناء و MEP الداخلية لدينا. هذا هو الطريق المفضل لـ 90٪ من عملائنا لأنه يضمن الجودة والتحكم في الميزانية.'
          }
        },
        {
          question: {
            en: 'Do you provide maintenance after handover?',
            ar: 'هل تقدمون الصيانة بعد التسليم؟'
          },
          answer: {
            en: 'Yes. We offer comprehensive annual maintenance contracts to ensure your AC, lighting, and finishes remain in showroom condition.',
            ar: 'نعم. نقدم عقود صيانة سنوية شاملة لضمان بقاء مكيفاتك وإضاءتك وتشطيباتك في حالة صالة العرض.'
          }
        }
      ],

      // CTA Section
      ctaTitle: {
        en: 'Choose the',
        ar: 'اختر'
      },
      ctaSubtitle: {
        en: 'Stop managing multiple vendors. Start building your legacy with one partner.',
        ar: 'توقف عن إدارة موردين متعددين. ابدأ ببناء إرثك مع شريك واحد.'
      },
      ctaButtonText: {
        en: 'DISCUSS YOUR PROJECT',
        ar: 'ناقش مشروعك'
      },
      ctaButtonLink: '/contact',

      // SEO
      seo: {
        metaTitle: {
          en: 'Our Services | MIDC - Design, Build, Engineering',
          ar: 'خدماتنا | MIDC - تصميم، بناء، هندسة'
        },
        metaDescription: {
          en: 'Complete turnkey solutions for interior design and construction. From concept to handover, MIDC controls every variable with in-house design, MEP engineering, and construction teams.',
          ar: 'حلول متكاملة للتصميم الداخلي والبناء. من المفهوم إلى التسليم، MIDC يتحكم في كل متغير مع فرق التصميم والهندسة والبناء الداخلية.'
        }
      }
    }

    // Create the document
    const result = await client.createOrReplace(servicesPageDocument)

    console.log('✅ Services Page document created successfully!')
    console.log(`   Document ID: ${result._id}`)
    console.log('\n📝 Content populated:')
    console.log('   - Hero Section with title and image')
    console.log('   - Turnkey Section with paragraphs and image')
    console.log('   - Service Pillars section headers')
    console.log('   - FAQ Section with 6 questions')
    console.log('   - CTA Section')
    console.log('   - SEO metadata')
    console.log('\n💡 Tips:')
    console.log('   - Edit images in Sanity Studio to customize')
    console.log('   - Add more FAQs or modify existing ones')
    console.log('   - All text supports both English and Arabic')

  } catch (error) {
    console.error('❌ Error seeding services page:', error.message)
    throw error
  }
}

seedServicesPage()
