import { client } from '@/sanity/lib/client';

// Smart category assignment based on post title/content
const categoryMapping: Record<string, string> = {
  // Project Stories
  'anatomy-winner-2025': 'project-stories',
  'blame-game-turnkey': 'project-stories',

  // Founder's Insights
  'sound-of-luxury': 'founders-insights',

  // Design Trends (default for others)
};

async function assignDefaultCategories() {
  console.log('🔄 Starting category assignment for posts with null categories...\n');

  try {
    // Get all posts with null categories
    const posts = await client.fetch(`
      *[_type == "post" && !defined(category)] {
        _id,
        title,
        slug
      }
    `);

    console.log(`📊 Found ${posts.length} post(s) without categories\n`);

    if (posts.length === 0) {
      console.log('✅ All posts already have categories assigned!');
      return;
    }

    let updatedCount = 0;

    for (const post of posts) {
      const slugValue = post.slug?.current;

      // Determine category based on slug or use default
      let category = categoryMapping[slugValue] || 'design-trends';

      // Smart category detection based on title
      const title = post.title?.toLowerCase() || '';
      if (title.includes('winner') || title.includes('award')) {
        category = 'project-stories';
      } else if (title.includes('luxury') || title.includes('silence')) {
        category = 'founders-insights';
      } else if (title.includes('construction') || title.includes('turnkey')) {
        category = 'project-stories';
      } else if (title.includes('material') || title.includes('craft')) {
        category = 'materials-craft';
      } else if (title.includes('engineering') || title.includes('mep')) {
        category = 'engineering';
      } else if (title.includes('behind') || title.includes('process')) {
        category = 'behind-the-scenes';
      } else if (title.includes('trend') || title.includes('design')) {
        category = 'design-trends';
      }

      await client
        .patch(post._id)
        .set({ category })
        .commit();

      console.log(`✅ "${post.title}"`);
      console.log(`   → Assigned category: ${category}\n`);
      updatedCount++;
    }

    console.log(`\n📈 Assignment Summary:`);
    console.log(`   ✅ Updated: ${updatedCount}`);
    console.log(`\n🎉 Category assignment complete!`);
  } catch (error) {
    console.error('❌ Assignment failed:', error);
    throw error;
  }
}

assignDefaultCategories().catch(console.error);
