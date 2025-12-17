/**
 * Script to download press/media logos for the "Trusted & Recognized" section
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRESS_DIR = path.join(__dirname, '..', 'public', 'press');

// Logo sources - using placeholder high-quality logo images
// These are generic business/media style logos that can be replaced with official ones
const PRESS_LOGOS = [
  {
    name: 'Arabian Business',
    filename: 'arabian-business.png',
    // Using a placeholder - replace with official logo URL
    url: 'https://logo.clearbit.com/arabianbusiness.com',
  },
  {
    name: 'Gulf News',
    filename: 'gulf-news.png',
    url: 'https://logo.clearbit.com/gulfnews.com',
  },
  {
    name: 'Construction Week',
    filename: 'construction-week.png',
    url: 'https://logo.clearbit.com/constructionweekonline.com',
  },
  {
    name: 'Hotelier Middle East',
    filename: 'hotelier-me.png',
    url: 'https://logo.clearbit.com/hoteliermiddleeast.com',
  },
  {
    name: 'Architectural Digest',
    filename: 'architectural-digest.png',
    url: 'https://logo.clearbit.com/architecturaldigest.com',
  },
  {
    name: 'Forbes Middle East',
    filename: 'forbes-me.png',
    url: 'https://logo.clearbit.com/forbesmiddleeast.com',
  },
];

async function downloadLogo(logo) {
  const filepath = path.join(PRESS_DIR, logo.filename);

  try {
    console.log(`  Downloading: ${logo.name}...`);
    const response = await fetch(logo.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFileSync(filepath, buffer);
    console.log(`  ✓ Saved: ${logo.filename}`);
    return true;
  } catch (error) {
    console.error(`  ✗ Failed: ${logo.name} - ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Downloading Press Logos\n');

  // Ensure directory exists
  if (!fs.existsSync(PRESS_DIR)) {
    fs.mkdirSync(PRESS_DIR, { recursive: true });
  }

  let success = 0;
  let failed = 0;

  for (const logo of PRESS_LOGOS) {
    const result = await downloadLogo(logo);
    if (result) success++;
    else failed++;
  }

  console.log(`\n✅ Downloaded: ${success}/${PRESS_LOGOS.length}`);
  if (failed > 0) {
    console.log(`⚠️  Failed: ${failed} - These need manual download`);
  }
}

main();
