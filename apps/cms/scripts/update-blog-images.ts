import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const blogImageUpdates = [
  {
    id: 'blog-001-luxury-trends-uae-2025',
    featuredImage: '/images/blog/luxury-trends-2025-calacatta-marble-gold-leaf.jpg'
  },
  {
    id: 'blog-002-smart-home-luxury-villas',
    featuredImage: '/images/blog/smart-home-villa-automation-dubai.jpg'
  },
  {
    id: 'blog-003-sustainable-luxury-design-uae',
    featuredImage: '/images/blog/sustainable-luxury-leed-villa-solar-panels.jpg'
  },
  {
    id: 'blog-004-cultural-fusion-design-uae',
    featuredImage: '/images/blog/cultural-fusion-mashrabiya-arabic-calligraphy.jpg'
  },
  {
    id: 'blog-005-luxury-materials-guide',
    featuredImage: '/images/blog/luxury-materials-calacatta-marble-exotic-woods.jpg'
  }
];

async function updateBlogImages() {
  console.log('🖼️  Updating blog featured images...');
  
  for (const update of blogImageUpdates) {
    await prisma.blogPost.update({
      where: { id: update.id },
      data: { featuredImage: update.featuredImage }
    });
    console.log(`✅ Updated ${update.id}`);
  }
  
  console.log('🎉 All blog images updated successfully!');
}

updateBlogImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());