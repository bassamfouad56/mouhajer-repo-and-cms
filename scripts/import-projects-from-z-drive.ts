import fs from 'fs';
import path from 'path';
import { createClient } from '@sanity/client';

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN, // You'll need to create this token
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Z: drive path to projects
const Z_DRIVE_PATH = 'Z:/share/Monaam/bassam/our projects page';

// Project mapping based on folder names
const projectsMapping = [
  {
    folder: '1 hotel sofitel JBR',
    title: 'Sofitel Hotel Dubai JBR',
    category: 'hospitality',
    location: 'Dubai, UAE',
    client: 'ADNH',
    year: 2021,
    excerpt: 'Sophisticated upgrade of public areas, blending French elegance with local culture.',
  },
  {
    folder: '2 sheraton hotel and resort abudhabi',
    title: 'Sheraton Abu Dhabi Hotel & Resort',
    category: 'hospitality',
    location: 'Abu Dhabi, UAE',
    client: 'ADNH',
    year: 2023,
    featured: true,
    excerpt: 'Complete transformation of Lobby, VIP Lounge, and Le Bistrot - Modernizing a heritage landmark.',
  },
  {
    folder: '3 the restaurant hotel address marina mall',
    title: 'The Restaurant - Hotel Address Marina Mall',
    category: 'hospitality',
    location: 'Abu Dhabi, UAE',
    client: 'Emaar',
    year: 2022,
  },
  {
    folder: '4 penthouse address boulevard',
    title: 'Boulevard Penthouse 70-71',
    category: 'residential',
    location: 'Dubai, UAE',
    client: 'Private Client',
    year: 2023,
    featured: true,
    excerpt: 'Fendi-inspired sanctuary with immaculate joinery and bespoke furniture.',
  },
  {
    folder: '5 district one meydan villa 79X',
    title: 'District One Meydan Villa 79X',
    category: 'residential',
    location: 'Dubai, UAE',
    client: 'Meydan',
    year: 2022,
  },
  {
    folder: '6 Jumeirah bay villa',
    title: 'Jumeirah Bay Villa',
    category: 'residential',
    location: 'Dubai, UAE',
    client: 'Private Client',
    year: 2022,
  },
  {
    folder: '7 hotel park hyatt villa',
    title: 'Hotel Park Hyatt Villa',
    category: 'hospitality',
    location: 'Dubai, UAE',
    client: 'Park Hyatt',
    year: 2021,
  },
  {
    folder: '8 CLUB LOUNGE ADDRESS BOULEVARD',
    title: 'Club Lounge - Address Boulevard',
    category: 'hospitality',
    location: 'Dubai, UAE',
    client: 'Emaar',
    year: 2023,
  },
  {
    folder: '9 HOTEL ADDRESS BOULEVARD VIP SUITE',
    title: 'Address Boulevard VIP Suite',
    category: 'hospitality',
    location: 'Dubai, UAE',
    client: 'Emaar',
    year: 2023,
    featured: true,
    excerpt: 'Arabian Property Award Winner - Best Hotel Suite Interior (Arabia & Dubai).',
  },
  {
    folder: '9-1 palm jumeirah villa',
    title: 'Palm Jumeirah Villa',
    category: 'residential',
    location: 'Dubai, UAE',
    client: 'Private Client',
    year: 2023,
  },
  {
    folder: '10 grand hyatt prince suite',
    title: 'Grand Hyatt Prince Suite',
    category: 'hospitality',
    location: 'Dubai, UAE',
    client: 'Grand Hyatt',
    year: 2021,
  },
  {
    folder: '11 askim restaurant',
    title: 'Askim Restaurant',
    category: 'hospitality',
    location: 'Dubai, UAE',
    year: 2022,
  },
  {
    folder: '12 hotel grand hyatt prince suite',
    title: 'Hotel Grand Hyatt Prince Suite',
    category: 'hospitality',
    location: 'Dubai, UAE',
    client: 'Grand Hyatt',
    year: 2021,
  },
  {
    folder: '13 terraza restaurant radisson blu abudhabi',
    title: 'Terraza Restaurant - Radisson Blu Abu Dhabi',
    category: 'hospitality',
    location: 'Abu Dhabi, UAE',
    client: 'Radisson Blu',
    year: 2022,
  },
  {
    folder: '14 villa district 1 meydan 11X',
    title: 'District 1 Meydan Villa 11X',
    category: 'residential',
    location: 'Dubai, UAE',
    client: 'Meydan',
    year: 2022,
  },
  {
    folder: '15villa district 1 meydan 12X',
    title: 'District 1 Meydan Villa 12X',
    category: 'residential',
    location: 'Dubai, UAE',
    client: 'Meydan',
    year: 2022,
  },
  {
    folder: '16 jumeirah island villa',
    title: 'Jumeirah Islands Villa',
    category: 'residential',
    location: 'Dubai, UAE',
    client: 'Private Client',
    year: 2021,
  },
  {
    folder: '17 park hyatt vip room',
    title: 'Park Hyatt VIP Room',
    category: 'hospitality',
    location: 'Dubai, UAE',
    client: 'Park Hyatt',
    year: 2021,
  },
  {
    folder: '18 ritz carlton villas',
    title: 'Ritz Carlton Villas',
    category: 'hospitality',
    location: 'Abu Dhabi, UAE',
    client: 'Ritz Carlton',
    year: 2022,
  },
  {
    folder: '19 offices C1 abudhabi',
    title: 'C1 Offices Abu Dhabi',
    category: 'commercial',
    location: 'Abu Dhabi, UAE',
    year: 2022,
  },
];

/**
 * This script generates a JSON file with all project data
 * You'll need to manually upload images to Sanity Studio
 */
async function generateProjectsData() {
  console.log('📋 Scanning projects from Z: drive...\n');

  const projectsData = [];

  for (const project of projectsMapping) {
    const folderPath = path.join(Z_DRIVE_PATH, project.folder);

    try {
      if (!fs.existsSync(folderPath)) {
        console.log(`⚠️  Folder not found: ${project.folder}`);
        continue;
      }

      // Read all files in the folder
      const files = fs.readdirSync(folderPath);

      // Get only image files
      const imageFiles = files.filter(file =>
        /\.(jpg|jpeg|png|webp)$/i.test(file)
      ).sort();

      // Read keyfact.txt if exists
      let keyFacts: any = {};
      const keyFactPath = path.join(folderPath, 'keyfact.txt');
      if (fs.existsSync(keyFactPath)) {
        const content = fs.readFileSync(keyFactPath, 'utf-8');
        keyFacts = parseKeyFacts(content);
      }

      // Generate slug from title
      const slug = project.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const projectData = {
        _type: 'project',
        title: project.title,
        slug: { _type: 'slug', current: slug },
        excerpt: project.excerpt || keyFacts.description || '',
        category: project.category,
        location: project.location || keyFacts.location,
        year: project.year,
        client: project.client || keyFacts.client,
        featured: project.featured || false,
        publishedAt: new Date().toISOString(),

        // Image information (for manual upload reference)
        _imageInfo: {
          folder: project.folder,
          totalImages: imageFiles.length,
          images: imageFiles,
          // Path for reference
          sourcePath: folderPath,
        },

        seo: {
          metaTitle: `${project.title} | MIDC Projects`,
          metaDescription: project.excerpt || `Luxury ${project.category} project by MIDC in ${project.location}`,
          keywords: [
            project.category,
            'luxury interior design',
            'UAE construction',
            project.location?.split(',')[0] || '',
          ],
        },
      };

      projectsData.push(projectData);

      console.log(`✅ ${project.title}`);
      console.log(`   📁 ${imageFiles.length} images found`);
      console.log(`   📍 ${project.location}`);
      console.log(`   🏢 ${project.client || 'N/A'}\n`);

    } catch (error) {
      console.error(`❌ Error processing ${project.folder}:`, error);
    }
  }

  // Save to JSON file
  const outputPath = path.join(process.cwd(), 'projects-import-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(projectsData, null, 2));

  console.log(`\n✅ Generated projects data file: ${outputPath}`);
  console.log(`\n📊 Total projects: ${projectsData.length}`);
  console.log(`\n📸 Next Steps:`);
  console.log(`   1. Open Sanity Studio: npm run dev (in a separate terminal, navigate to the Sanity Studio)`);
  console.log(`   2. Go to Projects section`);
  console.log(`   3. For each project in projects-import-data.json:`);
  console.log(`      - Create a new project`);
  console.log(`      - Copy the data from the JSON file`);
  console.log(`      - Upload images from the folder path shown in _imageInfo.sourcePath`);
  console.log(`      - The first image should be the mainImage`);
  console.log(`      - Add remaining images to the gallery`);
  console.log(`\n💡 Tip: You can bulk upload images by dragging them into Sanity Studio!`);
}

function parseKeyFacts(content: string) {
  const lines = content.split('\n');
  const facts: any = {};

  let currentKey = '';
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('---')) {
      if (trimmed.toUpperCase() === trimmed && trimmed.length > 2) {
        currentKey = trimmed.toLowerCase();
        facts[currentKey] = '';
      } else if (currentKey) {
        facts[currentKey] = trimmed;
      }
    }
  });

  return facts;
}

// Run the script
generateProjectsData().catch(console.error);
