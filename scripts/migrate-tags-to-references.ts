import { client } from '@/sanity/lib/client';

async function migrateTagsToReferences() {
  console.log('🔄 Starting tag migration...\n');

  try {
    // Get all posts with tags
    const posts = await client.fetch(`
      *[_type == "post" && defined(tags)]{
        _id,
        title,
        tags
      }
    `);

    console.log(`📊 Found ${posts.length} post(s) with tags\n`);

    if (posts.length === 0) {
      console.log('ℹ️  No posts with tags found. Nothing to migrate.');
      return;
    }

    let migratedCount = 0;
    let skippedCount = 0;
    let createdTagsCount = 0;

    for (const post of posts) {
      // Check if tags are already references
      const hasStringTags = post.tags.some((tag: any) => typeof tag === 'string');

      if (!hasStringTags) {
        console.log(`⏩ Skipping "${post.title}": Already using tag references`);
        skippedCount++;
        continue;
      }

      const stringTags = post.tags.filter((tag: any) => typeof tag === 'string');

      if (stringTags.length === 0) {
        console.log(`⏩ Skipping "${post.title}": No string tags found`);
        skippedCount++;
        continue;
      }

      console.log(`\n🔄 Processing "${post.title}" (${stringTags.length} string tags)...`);

      const tagRefs = [];

      // Create or find tag documents
      for (const tagName of stringTags) {
        // Check if tag exists
        let tag = await client.fetch(`
          *[_type == "tag" && name.en == $tagName][0]{ _id }
        `, { tagName });

        // Create if doesn't exist
        if (!tag) {
          tag = await client.create({
            _type: 'tag',
            name: {
              en: tagName,
              ar: tagName // Add translations manually later
            },
            slug: {
              current: tagName.toLowerCase().replace(/\s+/g, '-')
            },
            category: 'blog-topic',
            usedIn: ['blog']
          });
          console.log(`  ✨ Created new tag: "${tagName}"`);
          createdTagsCount++;
        } else {
          console.log(`  ✓ Found existing tag: "${tagName}"`);
        }

        tagRefs.push({
          _type: 'reference',
          _ref: tag._id
        });
      }

      // Update post with tag references
      await client
        .patch(post._id)
        .set({ tags: tagRefs })
        .commit();

      console.log(`  ✅ Updated "${post.title}" with ${tagRefs.length} tag reference(s)`);
      migratedCount++;
    }

    console.log(`\n📈 Migration Summary:`);
    console.log(`   ✅ Migrated posts: ${migratedCount}`);
    console.log(`   ⏩ Skipped posts: ${skippedCount}`);
    console.log(`   ✨ Created new tags: ${createdTagsCount}`);
    console.log(`\n🎉 Tag migration complete!`);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

migrateTagsToReferences().catch(console.error);
