// Script to seed the home page
const { seedHomePage } = require('../src/lib/seed-home-page');

async function main() {
  console.log('Starting home page seed...');
  try {
    const result = await seedHomePage();
    console.log('Home page seeded successfully:', result.id);
  } catch (error) {
    console.error('Error seeding home page:', error);
    process.exit(1);
  }
}

main();