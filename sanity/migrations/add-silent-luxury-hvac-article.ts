import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'b6q28exv',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'mouhajer-db',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// First, create the tags if they don't exist
const tags = [
  { name: { en: 'MEP Design', ar: 'تصميم MEP' }, slug: 'mep-design', category: 'blog-topic' },
  { name: { en: 'HVAC', ar: 'التكييف والتهوية' }, slug: 'hvac', category: 'blog-topic' },
  { name: { en: 'Luxury Villas', ar: 'الفلل الفاخرة' }, slug: 'luxury-villas', category: 'blog-topic' },
  { name: { en: 'Noise Control', ar: 'التحكم في الضوضاء' }, slug: 'noise-control', category: 'blog-topic' },
]

async function createTags() {
  const createdTags: string[] = []

  for (const tag of tags) {
    // Check if tag exists
    const existing = await client.fetch(`*[_type == "tag" && slug.current == $slug][0]`, { slug: tag.slug })

    if (existing) {
      console.log(`Tag "${tag.name.en}" already exists`)
      createdTags.push(existing._id)
    } else {
      const created = await client.create({
        _type: 'tag',
        name: tag.name,
        slug: { _type: 'slug', current: tag.slug },
        category: tag.category,
        usedIn: ['blog'],
        featured: false,
        order: 100,
      })
      console.log(`Created tag: ${tag.name.en}`)
      createdTags.push(created._id)
    }
  }

  return createdTags
}

async function createArticle(tagIds: string[]) {
  // Check if article already exists
  const existing = await client.fetch(`*[_type == "post" && slug.current == "silent-luxury-hvac"][0]`)

  if (existing) {
    console.log('Article already exists, updating...')
    await client.delete(existing._id)
  }

  const article = {
    _type: 'post',
    title: {
      en: 'The Sound of Luxury is Silence',
      ar: 'صوت الفخامة هو الصمت',
    },
    slug: {
      _type: 'slug',
      current: 'silent-luxury-hvac',
    },
    excerpt: {
      en: 'A 50-Million Dirham Villa Should Not Hum. True luxury is not just about gold leaf, book-matched marble, or silk carpets. True luxury is the absence of irritation.',
      ar: 'فيلا بقيمة 50 مليون درهم لا ينبغي أن تصدر صوتاً. الفخامة الحقيقية ليست فقط في الذهب والرخام والسجاد الحريري. الفخامة الحقيقية هي غياب الإزعاج.',
    },
    category: 'engineering',
    readTime: 8,
    featured: true,
    publishedAt: new Date().toISOString(),
    author: {
      name: 'MIDC Engineering Team',
      role: {
        en: 'MEP Division',
        ar: 'قسم MEP',
      },
    },
    tags: tagIds.map(id => ({ _type: 'reference', _ref: id, _key: Math.random().toString(36).substr(2, 9) })),
    seo: {
      metaTitle: {
        en: 'The Sound of Luxury is Silence | MIDC Engineering',
        ar: 'صوت الفخامة هو الصمت | MIDC',
      },
      metaDescription: {
        en: 'Discover how MIDC engineers acoustic comfort into luxury villas. Learn about silent HVAC systems, NC-25 standards, and why true luxury is the absence of irritation.',
        ar: 'اكتشف كيف تصمم MIDC الراحة الصوتية في الفلل الفاخرة. تعرف على أنظمة التكييف الصامتة ومعايير NC-25.',
      },
      keywords: ['MEP Design', 'HVAC', 'Luxury Villas', 'Noise Control', 'Acoustic Comfort', 'UAE Construction', 'Silent AC'],
    },
    content: [
      // Headline
      {
        _type: 'block',
        _key: 'h1',
        style: 'h2',
        children: [{ _type: 'span', _key: 's1', text: 'A 50-Million Dirham Villa Should Not Hum.' }],
      },
      // Intro paragraphs
      {
        _type: 'block',
        _key: 'p1',
        style: 'normal',
        children: [{ _type: 'span', _key: 's2', text: 'You walk into the lobby of a 5-star hotel like the Ritz-Carlton. You feel the cool air instantly, but you don\'t hear it. You don\'t see ugly plastic vents punching through the ceiling. The atmosphere is pristine. It feels expensive because it is silent.' }],
      },
      {
        _type: 'block',
        _key: 'p2',
        style: 'normal',
        children: [{ _type: 'span', _key: 's3', text: 'Now, walk into a standard "luxury" villa delivered by an average contractor in Dubai. You hear the low drone of the Fan Coil Unit (FCU) vibrating against the gypsum. You see condensation dripping from a yellowing aluminium grille. You have to turn up the volume on the television just to drown out the "wind noise" of the air conditioning.' }],
      },
      {
        _type: 'block',
        _key: 'p3',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's4', text: 'True luxury is not just about gold leaf, book-matched marble, or silk carpets. ' },
          { _type: 'span', _key: 's5', text: 'True luxury is the absence of irritation.', marks: ['strong'] },
        ],
      },
      {
        _type: 'block',
        _key: 'p4',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's6', text: 'At Mouhajer International Design & Contracting, we believe that ' },
          { _type: 'span', _key: 's7', text: 'Acoustic Comfort is a design material', marks: ['strong'] },
          { _type: 'span', _key: 's8', text: ', just as important as the stone or the wood. But unlike stone, you cannot buy silence off the shelf. It must be engineered.' },
        ],
      },
      {
        _type: 'block',
        _key: 'p5',
        style: 'normal',
        children: [{ _type: 'span', _key: 's9', text: 'Here is how our in-house MEP Division engineers silence into the homes of the UAE\'s elite.' }],
      },
      // Section 1
      {
        _type: 'block',
        _key: 'h2a',
        style: 'h2',
        children: [{ _type: 'span', _key: 's10', text: 'The "Invisible" Standard' }],
      },
      {
        _type: 'block',
        _key: 'p6',
        style: 'normal',
        children: [{ _type: 'span', _key: 's11', text: 'The first mistake most contractors make is treating AC as an afterthought. Interior designers draw a beautiful ceiling, and then, at the last minute, the MEP contractor cuts ugly holes in the gypsum to fit standard 60x60cm supply diffusers.' }],
      },
      {
        _type: 'block',
        _key: 'p7',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's12', text: 'We reject this approach. At MIDC, our MEP engineers sit with our designers during the ' },
          { _type: 'span', _key: 's13', text: 'Concept Phase', marks: ['strong'] },
          { _type: 'span', _key: 's14', text: '. We design the cooling to be felt, not seen.' },
        ],
      },
      {
        _type: 'block',
        _key: 'p8',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's15', text: 'Linear Slot Diffusers:', marks: ['strong'] },
          { _type: 'span', _key: 's16', text: ' We utilize architectural "knife-edge" diffusers that are often only 20mm to 30mm wide. These run seamlessly along the perimeter of the room, washing the walls and glazing with cool air without breaking the visual aesthetic of the ceiling.' },
        ],
      },
      {
        _type: 'block',
        _key: 'p9',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's17', text: 'The "Shadow Gap" Return:', marks: ['strong'] },
          { _type: 'span', _key: 's18', text: ' The most common source of noise is the "Return Air" grille. Instead of a visible metal grille, we often hide the air intake in the architectural shadow gaps of your joinery, wardrobes, or false ceiling levels. The air is pulled away silently, and the mechanism is completely invisible.' },
        ],
      },
      // Section 2
      {
        _type: 'block',
        _key: 'h2b',
        style: 'h2',
        children: [{ _type: 'span', _key: 's19', text: 'The Physics of Noise: Air Velocity' }],
      },
      {
        _type: 'block',
        _key: 'p10',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's20', text: 'Why is your current AC noisy? The answer is usually ' },
          { _type: 'span', _key: 's21', text: 'Static Pressure and Air Velocity', marks: ['strong'] },
          { _type: 'span', _key: 's22', text: '.' },
        ],
      },
      {
        _type: 'block',
        _key: 'p11',
        style: 'normal',
        children: [{ _type: 'span', _key: 's23', text: 'When a contractor wants to save money, they use smaller ducts. When you force a large volume of air through a small duct, the air must travel faster. Fast-moving air creates turbulence (wind noise).' }],
      },
      {
        _type: 'block',
        _key: 'p12',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's24', text: 'The MIDC Calculation:', marks: ['strong'] },
          { _type: 'span', _key: 's25', text: ' We do not guess. We calculate.' },
        ],
      },
      {
        _type: 'block',
        _key: 'p13',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's26', text: 'Standard Practice:', marks: ['strong'] },
          { _type: 'span', _key: 's27', text: ' Most residential AC systems run air at 6-8 meters per second (m/s). This creates an audible "whoosh."' },
        ],
      },
      {
        _type: 'block',
        _key: 'p14',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's28', text: 'The MIDC Standard:', marks: ['strong'] },
          { _type: 'span', _key: 's29', text: ' We oversize our ducting network to lower the air velocity to 3-4 m/s. By slowing the air down, we eliminate the turbulence. It requires more ceiling space and more sheet metal, but the result is absolute silence.' },
        ],
      },
      // Section 3
      {
        _type: 'block',
        _key: 'h2c',
        style: 'h2',
        children: [{ _type: 'span', _key: 's30', text: 'The "Decibel Budget": Aiming for NC-25' }],
      },
      {
        _type: 'block',
        _key: 'p15',
        style: 'normal',
        children: [{ _type: 'span', _key: 's31', text: 'Sound is measured in Decibels (dB), but in HVAC engineering, we use Noise Criteria (NC) Curves.' }],
      },
      {
        _type: 'block',
        _key: 'p16',
        style: 'normal',
        children: [{ _type: 'span', _key: 's32', text: 'A standard luxury bedroom typically operates at NC-35 to NC-40 (roughly 45-50 dB). This sounds like a refrigerator humming in the corner.' }],
      },
      {
        _type: 'block',
        _key: 'p17',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's33', text: 'For our clients in District One and Jumeirah Bay, that is unacceptable. We engineer our systems to achieve ' },
          { _type: 'span', _key: 's34', text: 'NC-25', marks: ['strong'] },
          { _type: 'span', _key: 's35', text: ' (approx. 30-35 dB). This is the sound level of a quiet library or a recording studio.' },
        ],
      },
      {
        _type: 'block',
        _key: 'p18',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's36', text: 'The Hardware of Silence:', marks: ['strong'] },
          { _type: 'span', _key: 's37', text: ' To achieve NC-25, we use a specific "sandwich" of materials:' },
        ],
      },
      {
        _type: 'block',
        _key: 'p19',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's38', text: 'Acoustic Lining:', marks: ['strong'] },
          { _type: 'span', _key: 's39', text: ' We do not just use bare metal ducts. We wrap the interior and exterior of the ductwork in high-density acoustic foam (25mm to 50mm thick). This absorbs the mechanical noise of the fan before it reaches the room.' },
        ],
      },
      {
        _type: 'block',
        _key: 'p20',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's40', text: 'Vibration Isolators:', marks: ['strong'] },
          { _type: 'span', _key: 's41', text: ' The loudest noise is often vibration traveling through the concrete. We never bolt AC machines directly to your ceiling slab. We suspend them on Neoprene Rubber Springs (Anti-Vibration Mounts) that act as shock absorbers, ensuring no vibration travels through the structure to your bed.' },
        ],
      },
      // Section 4
      {
        _type: 'block',
        _key: 'h2d',
        style: 'h2',
        children: [{ _type: 'span', _key: 's42', text: 'Intelligent Integration (KNX & BMS)' }],
      },
      {
        _type: 'block',
        _key: 'p21',
        style: 'normal',
        children: [{ _type: 'span', _key: 's43', text: 'Silence is also about efficiency. A system that runs at 100% power all the time is noisy and wasteful. We integrate your cooling into the KNX Smart Home System.' }],
      },
      {
        _type: 'block',
        _key: 'p22',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's44', text: 'The "Scenario" Approach:', marks: ['strong'] },
        ],
      },
      {
        _type: 'block',
        _key: 'p23',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's45', text: 'Party Mode:', marks: ['strong'] },
          { _type: 'span', _key: 's46', text: ' The system ramps up to handle the heat load of 50 guests, increasing airflow.' },
        ],
      },
      {
        _type: 'block',
        _key: 'p24',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's47', text: 'Sleep Mode:', marks: ['strong'] },
          { _type: 'span', _key: 's48', text: ' The system detects the room is occupied but the lights are off. It throttles the fan speed down to 20%, maintaining the temperature while dropping the noise floor to near zero.' },
        ],
      },
      {
        _type: 'block',
        _key: 'p25',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's49', text: 'Zoning:', marks: ['strong'] },
          { _type: 'span', _key: 's50', text: ' We use VAV (Variable Air Volume) dampers to control cooling room-by-room. You aren\'t pushing air into an empty Majlis while you are sleeping in the Master Suite.' },
        ],
      },
      // Section 5
      {
        _type: 'block',
        _key: 'h2e',
        style: 'h2',
        children: [{ _type: 'span', _key: 's51', text: 'The "Retrofit" Nightmare (Why you must decide now)' }],
      },
      {
        _type: 'block',
        _key: 'p26',
        style: 'normal',
        children: [{ _type: 'span', _key: 's52', text: 'We often receive calls from homeowners asking, "Can you fix the noise in my villa?"' }],
      },
      {
        _type: 'block',
        _key: 'p27',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's53', text: 'The uncomfortable truth is: ' },
          { _type: 'span', _key: 's54', text: 'Often, we cannot.', marks: ['strong'] },
          { _type: 'span', _key: 's55', text: ' Once the ceiling is closed, the ductwork is buried. Fixing a noisy system usually requires ripping out the entire gypsum ceiling, resizing the ducts, and changing the machines. It is a massive, disruptive, and expensive undertaking.' },
        ],
      },
      {
        _type: 'block',
        _key: 'p28',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's56', text: 'This is why the decision to hire a ' },
          { _type: 'span', _key: 's57', text: 'Turnkey Contractor with in-house MEP capability', marks: ['strong'] },
          { _type: 'span', _key: 's58', text: ' is critical before you pour the concrete. We plan the ceiling voids to be deep enough to accommodate silent, oversized ducts from Day One.' },
        ],
      },
      // Executive Summary
      {
        _type: 'block',
        _key: 'h2f',
        style: 'h2',
        children: [{ _type: 'span', _key: 's59', text: 'Executive Summary' }],
      },
      {
        _type: 'block',
        _key: 'p29',
        style: 'normal',
        children: [{ _type: 'span', _key: 's60', text: 'If you are building a high-end property, do not leave the MEP to a sub-contractor you have never met.' }],
      },
      {
        _type: 'block',
        _key: 'p30',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's61', text: 'The Risk:', marks: ['strong'] },
          { _type: 'span', _key: 's62', text: ' Undersized ducts, high velocity, and sleepless nights.' },
        ],
      },
      {
        _type: 'block',
        _key: 'p31',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's63', text: 'The Solution:', marks: ['strong'] },
          { _type: 'span', _key: 's64', text: ' Engineering air velocity below 4 m/s and using acoustic vibration isolation.' },
        ],
      },
      {
        _type: 'block',
        _key: 'p32',
        style: 'normal',
        children: [
          { _type: 'span', _key: 's65', text: 'Let MIDC validate your design before you build.', marks: ['strong'] },
        ],
      },
    ],
    viewCount: 0,
    reactions: {
      helpful: 0,
      insightful: 0,
      loved: 0,
    },
  }

  const created = await client.create(article)
  console.log(`Created article: ${created._id}`)
  return created
}

async function main() {
  console.log('Starting migration: Add "The Sound of Luxury is Silence" article')

  try {
    const tagIds = await createTags()
    console.log(`Tags ready: ${tagIds.length} tags`)

    const article = await createArticle(tagIds)
    console.log(`\nArticle created successfully!`)
    console.log(`View at: /journal/engineering/silent-luxury-hvac`)
    console.log(`Sanity ID: ${article._id}`)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

main()
