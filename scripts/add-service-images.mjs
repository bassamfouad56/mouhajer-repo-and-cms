import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const client = createClient({
  projectId: 'b6q28exv',
  dataset: 'mouhajer-db',
  apiVersion: '2024-11-21',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

if (!process.env.SANITY_API_TOKEN) {
  console.error('SANITY_API_TOKEN environment variable is required');
  process.exit(1);
}

const serviceImages = [
  {
    serviceId: 'service-civil-construction',
    imagePath: 'public/projects/sheraton/sheratonAD14.jpg',
    alt: { en: 'Civil Construction', ar: 'البناء المدني' },
  },
  {
    serviceId: 'service-interior-architecture',
    imagePath: 'public/projects/ritz-carlton-abu-dhabi/ritzcarl05.jpg',
    alt: { en: 'Interior Architecture', ar: 'الهندسة المعمارية الداخلية' },
  },
  {
    serviceId: 'service-mep-engineering',
    imagePath: 'public/projects/sheraton/sheratonAD20.jpg',
    alt: { en: 'MEP Engineering', ar: 'هندسة الميكانيك والكهرباء' },
  },
  {
    serviceId: 'service-manufacturing-joinery',
    imagePath: 'public/projects/address-boulevard/vip-BLVDvipsuit01.jpg',
    alt: { en: 'Manufacturing & Joinery', ar: 'التصنيع والنجارة' },
  },
  {
    serviceId: 'service-fit-out-execution',
    imagePath: 'public/projects/ritz-carlton-abu-dhabi/ritzcarl15.jpg',
    alt: { en: 'Fit-Out Execution', ar: 'تنفيذ التجهيز' },
  },
  {
    serviceId: 'service-handover-maintenance',
    imagePath: 'public/projects/sofitel-jbr/DSC3619-HDR.jpg',
    alt: { en: 'Handover & Maintenance', ar: 'التسليم والصيانة' },
  },
];

async function addServiceImages() {
  console.log('Adding main images to services...\n');
  console.log('='.repeat(50));

  for (const { serviceId, imagePath, alt } of serviceImages) {
    const fullPath = path.join(projectRoot, imagePath);
    const filename = path.basename(imagePath);

    try {
      // Check if file exists
      if (!fs.existsSync(fullPath)) {
        console.error(`❌ File not found: ${fullPath}`);
        continue;
      }

      // 1. Upload image to Sanity
      console.log(`\nUploading ${filename}...`);
      const imageBuffer = fs.readFileSync(fullPath);
      const asset = await client.assets.upload('image', imageBuffer, {
        filename,
      });
      console.log(`   Asset ID: ${asset._id}`);

      // 2. Update service with mainImage
      console.log(`   Updating ${serviceId}...`);
      await client
        .patch(serviceId)
        .set({
          mainImage: {
            _type: 'image',
            asset: { _type: 'reference', _ref: asset._id },
            alt,
          },
        })
        .commit();

      console.log(`✅ Added image to ${alt.en}`);
    } catch (error) {
      console.error(`❌ Failed to add image to ${serviceId}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('Done! Verifying services...\n');

  // Verify
  const services = await client.fetch(
    '*[_type == "service"] | order(order asc) { _id, title, slug, "hasImage": defined(mainImage) }'
  );

  console.log('Services status:');
  services.forEach((s, i) => {
    const title = typeof s.title === 'object' ? s.title.en : s.title;
    const status = s.hasImage ? '✅' : '❌';
    console.log(`${i + 1}. ${status} ${title} (/${s.slug?.current})`);
  });
}

addServiceImages().catch(console.error);
