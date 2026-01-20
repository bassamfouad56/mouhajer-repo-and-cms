import { createClient } from '@sanity/client'
import { algoliasearch } from 'algoliasearch'
import imageUrlBuilder from '@sanity/image-url'

// Sanity client
const sanityClient = createClient({
  projectId: 'b6q28exv',
  dataset: 'mouhajer-db',
  apiVersion: '2024-11-21',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// Image URL builder
const imageBuilder = imageUrlBuilder(sanityClient)
function getImageUrl(image) {
  if (!image?.asset) return null
  try {
    return imageBuilder.image(image).width(400).height(300).url()
  } catch {
    return null
  }
}

// Algolia client
const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const algoliaAdminKey = process.env.ALGOLIA_ADMIN_KEY
const indexName = 'mouhajer_content'

if (!algoliaAppId || !algoliaAdminKey) {
  console.error('Missing Algolia credentials. Please set:')
  console.error('- NEXT_PUBLIC_ALGOLIA_APP_ID')
  console.error('- ALGOLIA_ADMIN_KEY')
  process.exit(1)
}

const algoliaClient = algoliasearch(algoliaAppId, algoliaAdminKey)

async function fetchProjects() {
  console.log('📦 Fetching projects...')
  const projects = await sanityClient.fetch(`
    *[_type == "project"] {
      _id,
      title,
      slug,
      "mainImage": coalesce(mainImage, featuredImage),
      "location": location->name,
      "industry": coalesce(
        industries[0]->title,
        sector->title,
        category
      ),
      "year": coalesce(year, yearCompleted)
    }
  `)

  return projects.map((project) => ({
    objectID: `project-${project._id}`,
    type: 'project',
    title: {
      en: project.title?.en || project.title || '',
      ar: project.title?.ar || '',
    },
    slug: project.slug?.current || '',
    mainImage: getImageUrl(project.mainImage),
    location: project.location?.en || project.location || '',
    industry: project.industry?.en || project.industry || '',
    year: project.year,
  }))
}

async function fetchPosts() {
  console.log('📝 Fetching blog posts...')
  const posts = await sanityClient.fetch(`
    *[_type == "post"] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      category,
      readTime,
      publishedAt
    }
  `)

  return posts.map((post) => ({
    objectID: `post-${post._id}`,
    type: 'post',
    title: {
      en: post.title?.en || post.title || '',
      ar: post.title?.ar || '',
    },
    slug: post.slug?.current || '',
    excerpt: {
      en: post.excerpt?.en || post.excerpt || '',
      ar: post.excerpt?.ar || '',
    },
    mainImage: getImageUrl(post.mainImage),
    category: post.category || '',
    readTime: post.readTime || 5,
    publishedAt: post.publishedAt || new Date().toISOString(),
  }))
}

async function fetchServices() {
  console.log('🔧 Fetching services...')
  const services = await sanityClient.fetch(`
    *[_type == "service"] {
      _id,
      title,
      slug,
      excerpt,
      icon
    }
  `)

  return services.map((service) => ({
    objectID: `service-${service._id}`,
    type: 'service',
    title: {
      en: service.title?.en || service.title || '',
      ar: service.title?.ar || '',
    },
    slug: service.slug?.current || '',
    description: {
      en: service.excerpt?.en || service.excerpt || '',
      ar: service.excerpt?.ar || '',
    },
    icon: service.icon || '',
  }))
}

async function fetchIndustries() {
  console.log('🏭 Fetching industries...')
  const industries = await sanityClient.fetch(`
    *[_type == "industry"] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      "projectCount": count(*[_type == "project" && references(^._id)])
    }
  `)

  return industries.map((industry) => ({
    objectID: `industry-${industry._id}`,
    type: 'industry',
    title: {
      en: industry.title?.en || industry.title || '',
      ar: industry.title?.ar || '',
    },
    slug: industry.slug?.current || '',
    description: {
      en: industry.excerpt?.en || industry.excerpt || '',
      ar: industry.excerpt?.ar || '',
    },
    mainImage: getImageUrl(industry.mainImage),
    projectCount: industry.projectCount || 0,
  }))
}

async function syncToAlgolia() {
  console.log('🚀 Starting Algolia sync...\n')

  try {
    // Fetch all content
    const [projects, posts, services, industries] = await Promise.all([
      fetchProjects(),
      fetchPosts(),
      fetchServices(),
      fetchIndustries(),
    ])

    const allRecords = [...projects, ...posts, ...services, ...industries]

    console.log(`\n📊 Found:`)
    console.log(`   - ${projects.length} projects`)
    console.log(`   - ${posts.length} posts`)
    console.log(`   - ${services.length} services`)
    console.log(`   - ${industries.length} industries`)
    console.log(`   Total: ${allRecords.length} records\n`)

    // Configure index settings
    console.log('⚙️  Configuring index settings...')
    await algoliaClient.setSettings({
      indexName,
      indexSettings: {
        searchableAttributes: [
          'title.en',
          'title.ar',
          'description.en',
          'description.ar',
          'excerpt.en',
          'excerpt.ar',
          'location',
          'industry',
          'category',
        ],
        attributesForFaceting: ['type', 'category', 'industry'],
        customRanking: ['desc(year)', 'desc(publishedAt)'],
      },
    })

    // Clear and save records
    console.log('📤 Uploading records to Algolia...')
    await algoliaClient.clearObjects({ indexName })
    await algoliaClient.saveObjects({
      indexName,
      objects: allRecords,
    })

    console.log('\n✅ Sync complete!')
    console.log(`   Index: ${indexName}`)
    console.log(`   Records: ${allRecords.length}`)
  } catch (error) {
    console.error('\n❌ Sync failed:', error.message)
    process.exit(1)
  }
}

syncToAlgolia()
