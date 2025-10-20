/**
 * Fetch all content from live CMS and display image mapping
 * Run with: node scripts/fetch-cms-content.js
 */

const CMS_URL = 'https://mouhajer-dh6ryndkm-bassam-fouads-projects.vercel.app';

async function fetchAPI(endpoint) {
  try {
    const res = await fetch(`${CMS_URL}${endpoint}`);
    if (!res.ok) throw new Error(`API returned ${res.status} for ${endpoint}`);
    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🔄 Fetching content from live CMS...\n');

  const [projects, services, blogs, media, settings] = await Promise.all([
    fetchAPI('/api/projects'),
    fetchAPI('/api/services'),
    fetchAPI('/api/blog'),
    fetchAPI('/api/media'),
    fetchAPI('/api/settings'),
  ]);

  console.log('📊 CMS Content Summary:\n');
  console.log(`Projects: ${projects?.length || 0}`);
  console.log(`Services: ${services?.length || 0}`);
  console.log(`Blogs: ${blogs?.length || 0}`);
  console.log(`Media: ${media?.length || 0}\n`);

  // Group media by tags
  const mediaByTags = {};
  media?.forEach(m => {
    if (m.tags && Array.isArray(m.tags)) {
      m.tags.forEach(tag => {
        if (!mediaByTags[tag]) mediaByTags[tag] = [];
        mediaByTags[tag].push(m);
      });
    }
  });

  console.log('🏷️  Media Tags Available:');
  Object.keys(mediaByTags).forEach(tag => {
    console.log(`  - ${tag}: ${mediaByTags[tag].length} images`);
  });
  console.log('');

  // Projects with images
  console.log('🏗️  Projects with Images:\n');
  projects?.slice(0, 5).forEach((p, i) => {
    console.log(`${i + 1}. ${p.title?.en || 'Untitled'}`);
    console.log(`   Images: ${p.images?.length || 0}`);
    if (p.images?.length > 0) {
      console.log(`   First image: ${p.images[0].substring(0, 80)}...`);
    }
    console.log('');
  });

  // Services with images
  console.log('🛠️  Services with Images:\n');
  services?.slice(0, 5).forEach((s, i) => {
    console.log(`${i + 1}. ${s.title?.en || 'Untitled'}`);
    console.log(`   Images: ${s.images?.length || 0}`);
    if (s.images?.length > 0) {
      console.log(`   First image: ${s.images[0].substring(0, 80)}...`);
    }
    console.log('');
  });

  // Blogs with featured images
  console.log('📝 Blogs with Featured Images:\n');
  blogs?.slice(0, 5).forEach((b, i) => {
    console.log(`${i + 1}. ${b.title?.en || 'Untitled'}`);
    console.log(`   Featured: ${b.featured ? 'Yes' : 'No'}`);
    if (b.featuredImage) {
      console.log(`   Image: ${b.featuredImage.substring(0, 80)}...`);
    }
    console.log('');
  });

  // WhatsApp images
  const whatsappImages = media?.filter(m =>
    m.filename?.toLowerCase().includes('whats') ||
    m.filename?.toLowerCase().includes('whts')
  );

  if (whatsappImages?.length > 0) {
    console.log('💬 WhatsApp Images Found:');
    whatsappImages.forEach(img => {
      console.log(`   - ${img.filename}: ${img.url}`);
    });
    console.log('');
  }

  // Logo and branding
  console.log('🎨 Branding Assets:\n');
  if (settings?.logo) {
    console.log(`Logo: ${settings.logo}`);
  }
  if (settings?.appearance?.logo) {
    console.log(`Appearance Logo: ${settings.appearance.logo}`);
  }

  console.log('\n✅ CMS content fetched successfully!');
  console.log('\n💡 Next Steps:');
  console.log('1. Review the images above');
  console.log('2. Update components to use CMS images instead of static imports');
  console.log('3. Add proper tags to media in CMS (awards, clients, instagram, etc.)');
  console.log('4. Test all pages for valid image resources');
}

main().catch(console.error);
