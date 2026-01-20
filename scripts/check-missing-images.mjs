import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'b6q28exv',
  dataset: 'mouhajer-db',
  apiVersion: '2024-11-21',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function check() {
  // Check projects
  const projects = await client.fetch('*[_type == "project"] { _id, title, slug, "hasMainImage": defined(mainImage) }');
  console.log('\n📁 PROJECTS:');
  console.log('='.repeat(50));
  projects.forEach(p => {
    const title = typeof p.title === 'object' ? p.title.en : p.title;
    const status = p.hasMainImage ? '✅' : '❌';
    console.log(`${status} ${title} (/${p.slug?.current || 'no-slug'})`);
  });
  const missingProjects = projects.filter(p => !p.hasMainImage);
  console.log(`\nTotal: ${projects.length} | Missing image: ${missingProjects.length}`);

  // Check blog posts
  const posts = await client.fetch('*[_type == "post"] { _id, title, slug, "hasMainImage": defined(mainImage) }');
  console.log('\n📝 BLOG POSTS:');
  console.log('='.repeat(50));
  posts.forEach(p => {
    const title = typeof p.title === 'object' ? p.title.en : p.title;
    const status = p.hasMainImage ? '✅' : '❌';
    console.log(`${status} ${title} (/${p.slug?.current || 'no-slug'})`);
  });
  const missingPosts = posts.filter(p => !p.hasMainImage);
  console.log(`\nTotal: ${posts.length} | Missing image: ${missingPosts.length}`);
}

check().catch(console.error);
