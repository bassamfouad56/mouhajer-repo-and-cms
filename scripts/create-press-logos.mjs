/**
 * Script to create SVG press logos for the "Trusted & Recognized" section
 * These are stylized text logos that look professional
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRESS_DIR = path.join(__dirname, '..', 'public', 'press');

// SVG templates for press logos - professional text-based designs
const PRESS_LOGOS = [
  {
    name: 'Arabian Business',
    filename: 'arabian-business.svg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
  <text x="100" y="35" font-family="Georgia, serif" font-size="18" font-weight="400" fill="#1a1a1a" text-anchor="middle">ARABIAN</text>
  <text x="100" y="52" font-family="Georgia, serif" font-size="14" font-weight="300" fill="#666" text-anchor="middle" letter-spacing="2">BUSINESS</text>
</svg>`,
  },
  {
    name: 'Gulf News',
    filename: 'gulf-news.svg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 60">
  <text x="90" y="40" font-family="Arial Black, sans-serif" font-size="24" font-weight="900" fill="#0066b3" text-anchor="middle">GULF NEWS</text>
</svg>`,
  },
  {
    name: 'Construction Week',
    filename: 'construction-week.svg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 60">
  <text x="110" y="32" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#1a1a1a" text-anchor="middle">CONSTRUCTION</text>
  <text x="110" y="50" font-family="Arial, sans-serif" font-size="14" font-weight="400" fill="#e65100" text-anchor="middle" letter-spacing="3">WEEK</text>
</svg>`,
  },
  {
    name: 'Hotelier Middle East',
    filename: 'hotelier-me.svg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
  <text x="100" y="32" font-family="Georgia, serif" font-size="20" font-style="italic" fill="#1a1a1a" text-anchor="middle">Hotelier</text>
  <text x="100" y="50" font-family="Arial, sans-serif" font-size="10" font-weight="300" fill="#888" text-anchor="middle" letter-spacing="2">MIDDLE EAST</text>
</svg>`,
  },
  {
    name: 'Architectural Digest',
    filename: 'architectural-digest.svg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
  <text x="30" y="42" font-family="Didot, Georgia, serif" font-size="36" font-weight="400" fill="#1a1a1a" text-anchor="middle">AD</text>
</svg>`,
  },
  {
    name: 'Forbes Middle East',
    filename: 'forbes-me.svg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 60">
  <text x="90" y="38" font-family="Georgia, serif" font-size="28" font-weight="700" font-style="italic" fill="#1a1a1a" text-anchor="middle">Forbes</text>
  <text x="90" y="52" font-family="Arial, sans-serif" font-size="9" font-weight="400" fill="#888" text-anchor="middle" letter-spacing="1">MIDDLE EAST</text>
</svg>`,
  },
];

function main() {
  console.log('🚀 Creating Press Logo SVGs\n');

  // Ensure directory exists
  if (!fs.existsSync(PRESS_DIR)) {
    fs.mkdirSync(PRESS_DIR, { recursive: true });
  }

  for (const logo of PRESS_LOGOS) {
    const filepath = path.join(PRESS_DIR, logo.filename);
    fs.writeFileSync(filepath, logo.svg.trim());
    console.log(`  ✓ Created: ${logo.filename}`);
  }

  console.log(`\n✅ Created ${PRESS_LOGOS.length} logo files`);
  console.log('📁 Location: public/press/');
}

main();
