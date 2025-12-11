import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
})

// Client Data
const clients = [
  // Hospitality Partners
  {
    _type: 'client',
    name: 'Abu Dhabi National Hotels (ADNH)',
    slug: { current: 'adnh' },
    category: 'hospitality',
    projectsText: 'Sheraton, Radisson Blu',
    projects: ['Sheraton Renovation', 'Radisson Blu Upgrade'],
    description: 'When ADNH needed to renovate the Sheraton, they called us. When they needed to upgrade the Radisson Blu, they called us again.',
    isFrameworkContract: true,
    featured: true,
    displayOrder: 10,
    icon: 'Hotel',
  },
  {
    _type: 'client',
    name: 'Wasl Asset Management',
    slug: { current: 'wasl' },
    category: 'hospitality',
    projectsText: 'Park Hyatt, Emirates Golf Club',
    projects: ['Park Hyatt Villas', 'Emirates Golf Club'],
    description: 'When Wasl needed a partner for the Park Hyatt villas, they chose MIDC.',
    isFrameworkContract: true,
    featured: true,
    displayOrder: 20,
    icon: 'Sparkles',
  },
  {
    _type: 'client',
    name: 'Emaar Hospitality',
    slug: { current: 'emaar-hospitality' },
    category: 'hospitality',
    projectsText: 'Address Boulevard, Address Dubai Marina',
    projects: ['Address Boulevard', 'Address Dubai Marina'],
    isFrameworkContract: true,
    featured: true,
    displayOrder: 30,
    icon: 'Hotel',
  },
  {
    _type: 'client',
    name: 'Hyatt Hotels Corporation',
    slug: { current: 'hyatt' },
    category: 'hospitality',
    projectsText: 'Grand Hyatt Royal Suites',
    projects: ['Grand Hyatt Royal Suites'],
    isFrameworkContract: true,
    featured: true,
    displayOrder: 40,
    icon: 'Coffee',
  },
  {
    _type: 'client',
    name: 'The Ritz-Carlton',
    slug: { current: 'ritz-carlton' },
    category: 'hospitality',
    projectsText: 'Abu Dhabi Grand Canal Villas',
    projects: ['Abu Dhabi Grand Canal Villas'],
    isFrameworkContract: false,
    featured: true,
    displayOrder: 50,
    icon: 'Sparkles',
  },
  {
    _type: 'client',
    name: 'Dusit Thani',
    slug: { current: 'dusit-thani' },
    category: 'hospitality',
    projectsText: 'Dubai Renovation',
    projects: ['Dubai Renovation'],
    isFrameworkContract: false,
    featured: true,
    displayOrder: 60,
    icon: 'Hotel',
  },
  // Corporate & Commercial Partners
  {
    _type: 'client',
    name: 'Osoul',
    slug: { current: 'osoul' },
    category: 'corporate',
    projectsText: 'C1 Headquarters, Abu Dhabi',
    projects: ['C1 Headquarters, Abu Dhabi'],
    description: 'Corporate headquarters fit-out and design',
    isFrameworkContract: false,
    featured: true,
    displayOrder: 70,
    icon: 'Building2',
  },
  {
    _type: 'client',
    name: 'Dubai Golf',
    slug: { current: 'dubai-golf' },
    category: 'residential',
    projectsText: 'Villas & Resort Upgrades',
    projects: ['Villas & Resort Upgrades'],
    isFrameworkContract: false,
    featured: true,
    displayOrder: 80,
    icon: 'Briefcase',
  },
  {
    _type: 'client',
    name: 'Emaar Malls',
    slug: { current: 'emaar-malls' },
    category: 'retail',
    projectsText: 'Retail Fit-outs',
    projects: ['Retail Fit-outs'],
    isFrameworkContract: true,
    featured: true,
    displayOrder: 90,
    icon: 'Store',
  },
  {
    _type: 'client',
    name: 'Louis Vuitton Manufactures',
    slug: { current: 'louis-vuitton' },
    category: 'manufacturing',
    projectsText: 'Specialized Projects',
    projects: ['Specialized Projects'],
    isFrameworkContract: false,
    featured: true,
    displayOrder: 100,
    icon: 'TrendingUp',
  },
]

// Testimonials Data
const testimonials = [
  {
    _type: 'testimonial',
    author: 'Ghaleb Al Najjar',
    position: 'Consultant – Projects and Infrastructure',
    company: 'Abu Dhabi National Hotels',
    quote:
      'One of the standout qualities of MIDC is their dedication to meeting project timelines without compromising quality. MIDC has consistently demonstrated a strong commitment to meeting project timelines while maintaining high-quality standards. Their clear communication and attention to detail helped keep projects on track, even when handling complex requirements.',
    rating: 5,
    category: 'hospitality',
    featured: true,
    displayOrder: 10,
    isConfidential: false,
    publishedAt: new Date().toISOString(),
  },
  {
    _type: 'testimonial',
    author: 'Sayed Mohammed Al Sayed',
    position: 'Director of Area Procurement',
    company: 'Grand Hyatt Hotels Dubai',
    quote:
      "Throughout our collaboration, MIDC has consistently demonstrated exceptional skill, professionalism, and a strong commitment to delivering high-quality outcomes. They have been instrumental in the successful execution of our hotel refurbishment, design and built projects (Royal Suites, Prince Suites, Business Lounge, Luxury Villas valued up to 70M+). Their work on Hyatt Hotels Dubai surpassed our expectations, not only in terms of quality but also in their ability to manage the project within tight timelines. Their efficiency and proactive problem-solving approach were key factors in the project's success.",
    rating: 5,
    category: 'hospitality',
    featured: true,
    displayOrder: 20,
    isConfidential: false,
    publishedAt: new Date().toISOString(),
  },
  {
    _type: 'testimonial',
    author: 'Private Client',
    position: 'Villa Owner',
    company: 'Confidential',
    quote:
      'I did not want a house that felt like a hotel. I wanted a home that felt like art. Eng. Maher took my vague ideas and translated them into a reality that was sharper and more elegant than I could have imagined. His presence on-site gave me total peace of mind.',
    rating: 5,
    category: 'residential',
    featured: true,
    displayOrder: 30,
    isConfidential: true,
    publishedAt: new Date().toISOString(),
  },
]

async function seedData() {
  console.log('🌱 Starting to seed clients and testimonials...')

  try {
    // Create clients
    console.log('📦 Creating clients...')
    for (const client of clients) {
      const result = await client.create(client)
      console.log(`✅ Created client: ${client.name}`)
    }

    // Create testimonials
    console.log('💬 Creating testimonials...')
    for (const testimonial of testimonials) {
      const result = await client.create(testimonial)
      console.log(`✅ Created testimonial from: ${testimonial.author}`)
    }

    console.log('🎉 Successfully seeded all clients and testimonials!')
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    process.exit(1)
  }
}

// Run the seed function
seedData()
