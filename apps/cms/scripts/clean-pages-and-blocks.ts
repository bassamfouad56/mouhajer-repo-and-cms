import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning up all content data...\n');
  console.log('This will remove:');
  console.log('  ❌ All pages');
  console.log('  ❌ All page blocks');
  console.log('  ❌ All projects');
  console.log('  ❌ All services');
  console.log('  ❌ All blog posts');
  console.log('\nThis will keep:');
  console.log('  ✓ Media files');
  console.log('  ✓ Google Analytics data');
  console.log('  ✓ Google Search Console data');
  console.log('  ✓ Settings');
  console.log('  ✓ Navigation items');
  console.log('  ✓ All other data\n');

  try {
    // Count before deletion
    const pageBlockCount = await prisma.pageBlock.count();
    const pageCount = await prisma.page.count();
    const projectCount = await prisma.project.count();
    const serviceCount = await prisma.service.count();
    const blogCount = await prisma.blogPost.count();

    console.log(`Found:\n  ${pageBlockCount} blocks\n  ${pageCount} pages\n  ${projectCount} projects\n  ${serviceCount} services\n  ${blogCount} blog posts\n`);

    // Delete all page blocks first (due to foreign key constraints)
    console.log('Deleting page blocks...');
    const deletedBlocks = await prisma.pageBlock.deleteMany({});
    console.log(`✓ Deleted ${deletedBlocks.count} page blocks`);

    // Delete all pages
    console.log('Deleting pages...');
    const deletedPages = await prisma.page.deleteMany({});
    console.log(`✓ Deleted ${deletedPages.count} pages`);

    // Delete all projects
    console.log('Deleting projects...');
    const deletedProjects = await prisma.project.deleteMany({});
    console.log(`✓ Deleted ${deletedProjects.count} projects`);

    // Delete all services
    console.log('Deleting services...');
    const deletedServices = await prisma.service.deleteMany({});
    console.log(`✓ Deleted ${deletedServices.count} services`);

    // Delete all blog posts
    console.log('Deleting blog posts...');
    const deletedBlogs = await prisma.blogPost.deleteMany({});
    console.log(`✓ Deleted ${deletedBlogs.count} blog posts`);

    // Verify cleanup
    const remainingBlocks = await prisma.pageBlock.count();
    const remainingPages = await prisma.page.count();
    const remainingProjects = await prisma.project.count();
    const remainingServices = await prisma.service.count();
    const remainingBlogs = await prisma.blogPost.count();
    const mediaCount = await prisma.mediaFile.count();

    console.log('\n✅ Cleanup complete!\n');
    console.log('Verification:');
    console.log(`  Pages remaining: ${remainingPages}`);
    console.log(`  Blocks remaining: ${remainingBlocks}`);
    console.log(`  Projects remaining: ${remainingProjects}`);
    console.log(`  Services remaining: ${remainingServices}`);
    console.log(`  Blog posts remaining: ${remainingBlogs}`);
    console.log(`  Media files: ${mediaCount} (preserved)`);

  } catch (error) {
    console.error('\n❌ Error during cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('\n✓ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  });
