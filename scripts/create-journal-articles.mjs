import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'b6q28exv',
  dataset: 'mouhajer-db',
  apiVersion: '2024-11-21',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const articles = [
  {
    _type: 'post',
    _id: 'post-silent-luxury-hvac',
    title: {
      en: 'The Sound of Luxury is Silence',
      ar: 'صوت الفخامة هو الصمت',
    },
    slug: { current: 'silent-luxury-hvac' },
    excerpt: {
      en: 'A 50-Million Dirham Villa Should Not Hum. True luxury is not just about gold leaf, book-matched marble, or silk carpets. True luxury is the absence of irritation.',
      ar: 'فيلا بقيمة 50 مليون درهم لا يجب أن تصدر أزيزًا. الفخامة الحقيقية ليست فقط في أوراق الذهب والرخام والسجاد الحريري.',
    },
    category: 'engineering',
    featured: true,
    readTime: 8,
    publishedAt: new Date().toISOString(),
    author: {
      name: 'MIDC Engineering Team',
      role: 'MEP Division',
    },
    content: [
      {
        _type: 'block',
        _key: 'intro1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'intro1-span',
            text: 'You walk into the lobby of a 5-star hotel like the Ritz-Carlton. You feel the cool air instantly, but you don\'t hear it. You don\'t see ugly plastic vents punching through the ceiling. The atmosphere is pristine. It feels expensive because it is silent.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'intro2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'intro2-span',
            text: 'Now, walk into a standard "luxury" villa delivered by an average contractor in Dubai. You hear the low drone of the Fan Coil Unit (FCU) vibrating against the gypsum. You see condensation dripping from a yellowing aluminium grille. You have to turn up the volume on the television just to drown out the "wind noise" of the air conditioning.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'intro3',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'intro3-span',
            text: 'True luxury is not just about gold leaf, book-matched marble, or silk carpets. True luxury is the absence of irritation.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'h2-invisible',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'h2-invisible-span',
            text: 'The "Invisible" Standard',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'invisible1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'invisible1-span',
            text: 'The first mistake most contractors make is treating AC as an afterthought. Interior designers draw a beautiful ceiling, and then, at the last minute, the MEP contractor cuts ugly holes in the gypsum to fit standard 60x60cm supply diffusers.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'invisible2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'invisible2-span',
            text: 'We reject this approach. At MIDC, our MEP engineers sit with our designers during the Concept Phase. We design the cooling to be felt, not seen.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'h2-physics',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'h2-physics-span',
            text: 'The Physics of Noise: Air Velocity',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'physics1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'physics1-span',
            text: 'Why is your current AC noisy? The answer is usually Static Pressure and Air Velocity. When a contractor wants to save money, they use smaller ducts. When you force a large volume of air through a small duct, the air must travel faster. Fast-moving air creates turbulence (wind noise).',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'physics2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'physics2-span',
            text: 'The MIDC Calculation: We do not guess. We calculate. Standard Practice: Most residential AC systems run air at 6-8 meters per second (m/s). This creates an audible "whoosh." The MIDC Standard: We oversize our ducting network to lower the air velocity to 3-4 m/s. By slowing the air down, we eliminate the turbulence.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'h2-decibel',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'h2-decibel-span',
            text: 'The "Decibel Budget": Aiming for NC-25',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'decibel1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'decibel1-span',
            text: 'Sound is measured in Decibels (dB), but in HVAC engineering, we use Noise Criteria (NC) Curves. A standard luxury bedroom typically operates at NC-35 to NC-40 (roughly 45-50 dB). This sounds like a refrigerator humming in the corner.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'decibel2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'decibel2-span',
            text: 'For our clients in District One and Jumeirah Bay, that is unacceptable. We engineer our systems to achieve NC-25 (approx. 30-35 dB). This is the sound level of a quiet library or a recording studio.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'h2-summary',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'h2-summary-span',
            text: 'Executive Summary',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'summary1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'summary1-span',
            text: 'If you are building a high-end property, do not leave the MEP to a sub-contractor you have never met. The Risk: Undersized ducts, high velocity, and sleepless nights. The Solution: Engineering air velocity below 4 m/s and using acoustic vibration isolation.',
          },
        ],
      },
    ],
  },
  {
    _type: 'post',
    _id: 'post-turnkey-vs-split-contract',
    title: {
      en: 'The Blame Game: Why "Split Contracts" Double Your Risk',
      ar: 'لعبة اللوم: لماذا تضاعف العقود المنفصلة مخاطرك',
    },
    slug: { current: 'turnkey-vs-split-contract' },
    excerpt: {
      en: 'In the construction industry, we call this the "Triangle of Blame." It is the inevitable result of the "Split Contract" model. Who pays for the replacement? You do.',
      ar: 'في صناعة البناء، نسمي هذا "مثلث اللوم". إنه النتيجة الحتمية لنموذج العقد المنفصل.',
    },
    category: 'founders-insights',
    featured: true,
    readTime: 6,
    publishedAt: new Date().toISOString(),
    author: {
      name: 'Eng. Maher Mouhajer',
      role: 'CEO & Founder',
    },
    content: [
      {
        _type: 'block',
        _key: 'intro1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'intro1-span',
            text: 'Picture this scenario: You are building your dream villa in District One. The marble flooring arrives, but the color is slightly off.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'intro2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'intro2-span',
            text: 'The Architect says: "I specified the right code. The Contractor ordered the wrong batch." The Contractor says: "I ordered what was available. The Supplier said this is the new batch." The Supplier says: "This is the industry standard. The Architect should have checked the sample."',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'intro3',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'intro3-span',
            text: 'Who pays for the replacement? You do. Who suffers the 6-week delay? You do. In the construction industry, we call this the "Triangle of Blame." It is the inevitable result of the "Split Contract" model.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'h2-fails',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'h2-fails-span',
            text: 'Why the Traditional Model Fails in Luxury',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'fails1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'fails1-span',
            text: 'In a traditional setup, you hire a Design Consultant to draw the pictures, and a separate Contractor to build them. The problem? Designers draw ideals. Contractors build realities.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'fails2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'fails2-span',
            text: 'When these two entities work for different companies, their incentives are misaligned: The Designer wants it to look good (regardless of cost). The Contractor wants to build it fast (regardless of detail).',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'h2-solution',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'h2-solution-span',
            text: 'The Solution: The MIDC Turnkey Protocol',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'solution1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'solution1-span',
            text: 'At MIDC, we operate under a Single-Point of Responsibility model. We do not have a separate "Design Team" and "Construction Team" fighting over email. We are one entity.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'solution2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'solution2-span',
            text: 'How This Changes Your Project: Instant Feasibility - Our Architects sit next to our Quantity Surveyors. We never draw a floating staircase without knowing exactly what it costs and how to build it.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'h2-cost',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'h2-cost-span',
            text: 'The Cost of "Cheap"',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'cost1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'cost1-span',
            text: 'Many clients choose Split Contracts because they think they can get a lower price by bidding the construction out to the cheapest contractor. The Math of Illusion:',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'cost2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'cost2-span',
            text: 'Split Contract: Initial Bid (AED 10M) + Variations (15%) + Delay Costs (10%) = Final Cost AED 12.5M. MIDC Turnkey: Fixed Price (AED 11.5M) + Variations (0%) + Delays (0%) = Final Cost AED 11.5M.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'quote',
        style: 'blockquote',
        children: [
          {
            _type: 'span',
            _key: 'quote-span',
            text: '"Luxury is about precision. And precision requires proximity." — Eng. Maher Mouhajer',
          },
        ],
      },
    ],
  },
  {
    _type: 'post',
    _id: 'post-anatomy-of-winner-2025',
    title: {
      en: 'The Anatomy of a Winner: Why Turnkey Construction is the Future',
      ar: 'تشريح الفائز: لماذا البناء الجاهز هو المستقبل',
    },
    slug: { current: 'anatomy-of-winner-2025' },
    excerpt: {
      en: 'The industry recognized MIDC with the prestigious Architecture Leaders Award 2025 for "Villa Project of the Year". This article is not about the trophy. It is about the methodology that won it.',
      ar: 'اعترفت الصناعة بـ MIDC بجائزة قادة الهندسة المعمارية المرموقة 2025 لـ "مشروع الفيلا لهذا العام".',
    },
    category: 'project-stories',
    featured: true,
    readTime: 6,
    publishedAt: new Date().toISOString(),
    author: {
      name: 'MIDC Editorial',
      role: 'Journal Team',
    },
    content: [
      {
        _type: 'block',
        _key: 'intro1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'intro1-span',
            text: 'The industry recognized Mouhajer International Design & Contracting (MIDC) with the prestigious Architecture Leaders Award 2025 for "Villa Project of the Year" (Mansion in District One).',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'intro2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'intro2-span',
            text: 'But this article is not about the trophy. It is about the methodology that won it. In a market plagued by delays and budget overruns, this project was delivered on time and to a "Zero Defect" standard.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'h2-risk',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'h2-risk-span',
            text: '1. Construction Risk Management: "Foreseeing the Storm"',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'risk1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'risk1-span',
            text: 'The biggest fear for any investor is the timeline. In traditional construction, contractors react to delays. As a Turnkey Contractor in Dubai, we predict them.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'risk2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'risk2-span',
            text: 'Our internal Planning Protocol, titled "Foreseeing the Storm", dictates that we perform a comprehensive risk assessment before mobilization. We break the massive scope down into "manageable bricks".',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'h2-material',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'h2-material-span',
            text: '2. Material Control: The "Chain of Custody"',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'material1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'material1-span',
            text: 'A "Turnkey" solution means we own the supply chain. Most disputes in luxury fit-outs happen when materials arrive damaged. The Consultant blames the Supplier; the Supplier blames the Logistics.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'material2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'material2-span',
            text: 'At MIDC, we utilize strict Material Control Procedures: Procurement (negotiate delivery times and verify quality), Storage (suitable and secure locations), Verification (live inventory system tracking every item).',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'h2-quality',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'h2-quality-span',
            text: '3. Quality Assurance: The ISO 9001 Standard',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'quality1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'quality1-span',
            text: 'Why did this project win "Villa of the Year"? Precision. Many Dubai contractors aim for "good enough." Our Quality Policy has a singular objective: "Achieve zero defects".',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'h2-design',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'h2-design-span',
            text: '4. The "Design-Build" Advantage',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'design1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'design1-span',
            text: 'Our Vision states that "construction is not only a technical process, but also a creative one". The District One project featured complex structural elements that a standard contractor would have "Value Engineered" out of the design.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'design2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'design2-span',
            text: 'Because MIDC operates as a Design & Build firm, our architects and engineers sit at the same table. We solved the structural challenges internally, preserving the aesthetic vision without compromising the budget.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'h2-summary',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'h2-summary-span',
            text: 'Executive Summary: Why Choose Turnkey?',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'summary1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'summary1-span',
            text: 'The Architecture Leaders Award 2025 is proof that the Turnkey Construction model works. By unifying Design, Procurement, and Build under one roof, you eliminate the "Triangle of Blame" that destroys luxury projects.',
          },
        ],
      },
    ],
  },
];

async function createArticles() {
  console.log('Creating 3 journal articles in Sanity...\n');

  for (const article of articles) {
    try {
      // Delete if exists
      try {
        await client.delete(article._id);
        console.log(`Deleted existing: ${article._id}`);
      } catch (e) {
        // Doesn't exist, continue
      }

      // Create new
      const created = await client.create(article);
      const title = typeof article.title === 'object' ? article.title.en : article.title;
      console.log(`✅ Created: "${title}"`);
      console.log(`   Category: ${article.category}`);
      console.log(`   Slug: /${article.slug.current}`);
      console.log('');
    } catch (error) {
      console.error(`❌ Error creating ${article._id}:`, error.message);
    }
  }

  // Verify
  console.log('\n--- Verification ---');
  const posts = await client.fetch('*[_type == "post"] | order(publishedAt desc) { _id, title, slug, category, featured }');
  console.log(`Total posts in Sanity: ${posts.length}`);
  posts.forEach(p => {
    const title = typeof p.title === 'object' ? p.title.en : p.title;
    console.log(`  - ${title} (${p.category}) ${p.featured ? '⭐' : ''}`);
  });
}

createArticles().catch(console.error);
