import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const client = createClient({
  projectId: 'b6q28exv',
  dataset: 'mouhajer-db',
  apiVersion: '2024-11-21',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN environment variable is required');
  process.exit(1);
}

const PUBLIC_DIR = join(process.cwd(), 'public');

// New image assignments for industries (different from before)
const INDUSTRY_IMAGES = {
  'commercial': '/team/MID8563.jpg',           // Previously MID9207
  'hospitality': '/team/MID9207.jpg',          // Previously MID8563
  'residential': '/founder/CID_2106_00_COVER.jpg', // Previously MID9563
  'retail': '/team/MID9563.jpg',               // Previously CID_2106_00_COVER
};

async function uploadImage(imagePath) {
  const fullPath = join(PUBLIC_DIR, imagePath);

  try {
    console.log(`  📤 Uploading: ${imagePath}`);
    const imageBuffer = readFileSync(fullPath);
    const filename = imagePath.split('/').pop();

    const asset = await client.assets.upload('image', imageBuffer, {
      filename,
    });

    console.log(`  ✅ Uploaded: ${asset._id}`);
    return asset;
  } catch (error) {
    console.error(`  ❌ Failed to upload ${imagePath}:`, error.message);
    return null;
  }
}

async function updateIndustryImage(docId, assetId) {
  try {
    await client
      .patch(docId)
      .set({
        mainImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: assetId,
          },
        },
      })
      .commit();

    console.log(`  ✅ Updated document: ${docId}`);
    return true;
  } catch (error) {
    console.error(`  ❌ Failed to update ${docId}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Updating Industry Images\n');

  const industries = await client.fetch('*[_type == "industry" && slug.current != "healthcare"] { _id, slug, title }');
  console.log(`Found ${industries.length} industries (excluding healthcare)\n`);

  const uploadedImages = {};

  for (const industry of industries) {
    const slug = industry.slug?.current || '';
    const title = typeof industry.title === 'object' ? industry.title.en : industry.title;

    console.log(`\n🏢 Industry: ${title} (${slug})`);

    const imagePath = INDUSTRY_IMAGES[slug];
    if (!imagePath) {
      console.log(`  ⚠️ No image mapping for ${slug}`);
      continue;
    }

    // Upload the image if not already uploaded
    if (!uploadedImages[imagePath]) {
      const asset = await uploadImage(imagePath);
      if (asset) {
        uploadedImages[imagePath] = asset._id;
      }
    }

    if (uploadedImages[imagePath]) {
      await updateIndustryImage(industry._id, uploadedImages[imagePath]);
    }
  }

  console.log('\n✨ Done! Industry images have been updated.');
}

main().catch(console.error);
