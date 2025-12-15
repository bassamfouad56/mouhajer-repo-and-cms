import { client } from '@/sanity/lib/client';

// Blog tags to create
const BLOG_TAGS = [
  {
    name: { en: 'Luxury Design', ar: 'تصميم فاخر' },
    slug: 'luxury-design',
    category: 'blog-topic',
    usedIn: ['blog'],
    description: {
      en: 'Articles about luxury interior design and high-end aesthetics',
      ar: 'مقالات حول التصميم الداخلي الفاخر والجماليات الراقية'
    },
    color: '#d4af37',
    icon: 'Gem',
    featured: true,
    order: 1
  },
  {
    name: { en: 'Construction Management', ar: 'إدارة البناء' },
    slug: 'construction-management',
    category: 'blog-topic',
    usedIn: ['blog'],
    description: {
      en: 'Best practices in construction project management',
      ar: 'أفضل الممارسات في إدارة مشاريع البناء'
    },
    color: '#8B7355',
    icon: 'HardHat',
    featured: true,
    order: 2
  },
  {
    name: { en: 'Turnkey Solutions', ar: 'حلول متكاملة' },
    slug: 'turnkey-solutions',
    category: 'blog-topic',
    usedIn: ['blog'],
    description: {
      en: 'End-to-end project delivery and turnkey construction',
      ar: 'تسليم المشاريع الشامل والبناء المتكامل'
    },
    color: '#2C5F2D',
    icon: 'Key',
    featured: true,
    order: 3
  },
  {
    name: { en: 'Dubai Projects', ar: 'مشاريع دبي' },
    slug: 'dubai-projects',
    category: 'blog-topic',
    usedIn: ['blog'],
    description: {
      en: 'Projects and insights specific to Dubai market',
      ar: 'المشاريع والرؤى الخاصة بسوق دبي'
    },
    color: '#C41E3A',
    featured: true,
    order: 4
  },
  {
    name: { en: 'Industry Insights', ar: 'رؤى الصناعة' },
    slug: 'industry-insights',
    category: 'blog-topic',
    usedIn: ['blog'],
    description: {
      en: 'Expert insights on construction and design industry trends',
      ar: 'رؤى الخبراء حول اتجاهات صناعة البناء والتصميم'
    },
    featured: false,
    order: 5
  },
  {
    name: { en: 'Design Philosophy', ar: 'فلسفة التصميم' },
    slug: 'design-philosophy',
    category: 'blog-topic',
    usedIn: ['blog'],
    description: {
      en: 'Our design principles and philosophy',
      ar: 'مبادئنا وفلسفتنا في التصميم'
    },
    featured: false,
    order: 6
  },
  {
    name: { en: 'Project Success', ar: 'نجاح المشروع' },
    slug: 'project-success',
    category: 'blog-topic',
    usedIn: ['blog'],
    description: {
      en: 'Keys to successful project delivery',
      ar: 'مفاتيح التسليم الناجح للمشروع'
    },
    featured: false,
    order: 7
  },
  {
    name: { en: 'Risk Management', ar: 'إدارة المخاطر' },
    slug: 'risk-management',
    category: 'blog-topic',
    usedIn: ['blog'],
    description: {
      en: 'Managing risks in construction projects',
      ar: 'إدارة المخاطر في مشاريع البناء'
    },
    featured: false,
    order: 8
  },
  {
    name: { en: 'Acoustic Design', ar: 'التصميم الصوتي' },
    slug: 'acoustic-design',
    category: 'blog-topic',
    usedIn: ['blog'],
    description: {
      en: 'Sound design and acoustic engineering',
      ar: 'التصميم الصوتي والهندسة الصوتية'
    },
    featured: false,
    order: 9
  },
  {
    name: { en: 'Awards & Recognition', ar: 'الجوائز والتكريمات' },
    slug: 'awards-recognition',
    category: 'blog-topic',
    usedIn: ['blog'],
    description: {
      en: 'Award-winning projects and recognition',
      ar: 'المشاريع الفائزة بالجوائز والتكريمات'
    },
    featured: false,
    order: 10
  }
];

// Post configurations with smart categorization
const POST_CONFIGS = [
  {
    titleMatch: 'anatomy-winner',
    category: 'project-stories',
    tags: ['Awards & Recognition', 'Turnkey Solutions', 'Dubai Projects', 'Project Success']
  },
  {
    titleMatch: 'blame-game-turnkey',
    category: 'project-stories',
    tags: ['Turnkey Solutions', 'Construction Management', 'Risk Management', 'Industry Insights']
  },
  {
    titleMatch: 'sound-of-luxury',
    category: 'founders-insights',
    tags: ['Luxury Design', 'Design Philosophy', 'Acoustic Design', 'Dubai Projects']
  }
];

async function seedBlogCategoriesAndTags() {
  console.log('🌱 Starting blog categories and tags seeding...\n');

  try {
    // Step 1: Create tags
    console.log('📌 Step 1: Creating blog tags...\n');
    const createdTags = new Map<string, string>(); // name -> _id

    for (const tagData of BLOG_TAGS) {
      // Check if tag already exists
      const existing = await client.fetch(
        `*[_type == "tag" && slug.current == $slug][0]{ _id }`,
        { slug: tagData.slug }
      );

      if (existing) {
        console.log(`  ⏩ Tag already exists: ${tagData.name.en}`);
        createdTags.set(tagData.name.en, existing._id);
        continue;
      }

      // Create new tag
      const newTag = await client.create({
        _type: 'tag',
        name: tagData.name,
        slug: { current: tagData.slug },
        category: tagData.category,
        usedIn: tagData.usedIn,
        description: tagData.description,
        color: tagData.color,
        icon: tagData.icon,
        featured: tagData.featured,
        order: tagData.order
      });

      createdTags.set(tagData.name.en, newTag._id);
      console.log(`  ✅ Created tag: ${tagData.name.en} (${newTag._id})`);
    }

    console.log(`\n✨ Created/found ${createdTags.size} tags\n`);

    // Step 2: Update blog posts
    console.log('📝 Step 2: Updating blog posts with categories and tags...\n');

    // Get all posts
    const posts = await client.fetch(`
      *[_type == "post"] {
        _id,
        title,
        slug,
        category
      }
    `);

    console.log(`📊 Found ${posts.length} blog post(s)\n`);

    if (posts.length === 0) {
      console.log('⚠️  No blog posts found in Sanity.');
      console.log('   Make sure you have blog posts created first.\n');
      return;
    }

    let updatedCount = 0;

    for (const post of posts) {
      const slugValue = post.slug?.current;

      // Find matching config
      const config = POST_CONFIGS.find(c => slugValue?.includes(c.titleMatch));

      if (!config) {
        console.log(`  ⚠️  No config found for: "${post.title}" (${slugValue})`);
        console.log(`     Assigning default category: design-trends\n`);

        // Assign default category only
        await client
          .patch(post._id)
          .set({ category: 'design-trends' })
          .commit();

        updatedCount++;
        continue;
      }

      // Convert tag names to references
      const tagRefs = config.tags
        .map(tagName => {
          const tagId = createdTags.get(tagName);
          return tagId ? { _type: 'reference', _ref: tagId } : null;
        })
        .filter(Boolean);

      // Update post
      await client
        .patch(post._id)
        .set({
          category: config.category,
          tags: tagRefs
        })
        .commit();

      console.log(`  ✅ "${post.title}"`);
      console.log(`     → Category: ${config.category}`);
      console.log(`     → Tags: ${config.tags.join(', ')}\n`);

      updatedCount++;
    }

    console.log(`\n📈 Seeding Summary:`);
    console.log(`   ✅ Tags created/found: ${createdTags.size}`);
    console.log(`   ✅ Posts updated: ${updatedCount}`);
    console.log(`\n🎉 Blog seeding complete!`);
    console.log(`\n📍 Next Steps:`);
    console.log(`   1. Visit http://localhost:4050/en/journal`);
    console.log(`   2. Test category filtering (tabs at top)`);
    console.log(`   3. Test tag filtering (sidebar)`);
    console.log(`   4. Test search functionality`);
    console.log(`   5. Test combined filters\n`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);

    if ((error as any).statusCode === 403) {
      console.log('\n💡 Permission Error: Your Sanity API token needs write permissions.');
      console.log('\n🔧 How to fix:');
      console.log('   1. Go to https://www.sanity.io/manage');
      console.log('   2. Select your project');
      console.log('   3. Go to API → Tokens');
      console.log('   4. Create a new token with "Editor" permissions');
      console.log('   5. Copy the token');
      console.log('   6. Update SANITY_API_TOKEN in .env.local');
      console.log('   7. Re-run this script: npx tsx scripts/seed-blog-categories-tags.ts\n');
    }

    throw error;
  }
}

seedBlogCategoriesAndTags().catch(console.error);
