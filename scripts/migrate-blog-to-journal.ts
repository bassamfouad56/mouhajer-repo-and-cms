import { client } from '@/sanity/lib/client';

const CATEGORY_MAPPING: Record<string, string> = {
  'trends': 'design-trends',
  'tips': 'engineering',
  'case-studies': 'project-stories',
  'news': 'founders-insights'
};

async function migrateBlogPosts() {
  console.log('🔄 Starting blog category migration...\n');

  try {
    // Get all posts
    const posts = await client.fetch(`*[_type == "post"]{ _id, category, title }`);

    console.log(`📊 Found ${posts.length} blog post(s) to migrate\n`);

    if (posts.length === 0) {
      console.log('ℹ️  No posts found. Nothing to migrate.');
      return;
    }

    let migratedCount = 0;
    let skippedCount = 0;

    // Update categories
    for (const post of posts) {
      const oldCategory = post.category;
      const newCategory = CATEGORY_MAPPING[oldCategory];

      if (!newCategory) {
        console.log(`⚠️  Skipping ${post._id} (${post.title}): Unknown category "${oldCategory}"`);
        skippedCount++;
        continue;
      }

      if (oldCategory === newCategory) {
        console.log(`⏩ Skipping ${post._id} (${post.title}): Already using new category "${newCategory}"`);
        skippedCount++;
        continue;
      }

      await client
        .patch(post._id)
        .set({ category: newCategory })
        .commit();

      console.log(`✅ Updated "${post.title}": ${oldCategory} → ${newCategory}`);
      migratedCount++;
    }

    console.log(`\n📈 Migration Summary:`);
    console.log(`   ✅ Migrated: ${migratedCount}`);
    console.log(`   ⏩ Skipped: ${skippedCount}`);
    console.log(`\n🎉 Migration complete!`);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

migrateBlogPosts().catch(console.error);
