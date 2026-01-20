/**
 * Seed Script: Blog Posts to Sanity CMS
 *
 * This script seeds blog posts from content.md to Sanity CMS
 * Run with: npx ts-node scripts/seed-blog-posts.ts
 * Or add to package.json: "seed:blogs": "ts-node scripts/seed-blog-posts.ts"
 */

import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@sanity/client";
import { createReadStream, existsSync } from "fs";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "b6q28exv",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-11-21",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Base path for images
const PROJECTS_DIR = resolve(process.cwd(), "public/projects");

// Image paths for each blog post
const blogImages: Record<string, string> = {
  "silent-luxury-hvac": "bedroom-interior/_MID0040-HDR.jpg",
  "turnkey-vs-split-contract": "address-boulevard-penthouse/penthouse01.jpg",
  "anatomy-of-winner-2025": "district-one-villa-79x/01.jpg",
};

// Upload image to Sanity
async function uploadImage(imagePath: string, filename: string): Promise<any> {
  const fullPath = resolve(PROJECTS_DIR, imagePath);

  if (!existsSync(fullPath)) {
    console.log(`   ⚠️  Image not found: ${fullPath}`);
    return null;
  }

  try {
    const imageAsset = await client.assets.upload(
      "image",
      createReadStream(fullPath),
      {
        filename,
      }
    );
    return {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: imageAsset._id,
      },
      alt: filename.replace(/[-_]/g, " ").replace(/\.[^/.]+$/, ""),
    };
  } catch (error: any) {
    console.log(`   ⚠️  Error uploading image: ${error.message}`);
    return null;
  }
}

// Blog post data structure
interface BlogPost {
  _type: "post";
  title: string;
  slug: { _type: "slug"; current: string };
  excerpt: string;
  category: string;
  author: {
    name: string;
    role: string;
  };
  content: any[];
  readTime: number;
  tags: string[];
  featured: boolean;
  publishedAt: string;
}

// Helper to create Portable Text block
function createBlock(
  text: string,
  style: "normal" | "h2" | "h3" | "h4" | "blockquote" = "normal"
): any {
  return {
    _type: "block",
    _key: Math.random().toString(36).substring(7),
    style,
    children: [
      {
        _type: "span",
        _key: Math.random().toString(36).substring(7),
        text,
        marks: [],
      },
    ],
    markDefs: [],
  };
}

// Helper to create bold text within a block
function createBlockWithBold(
  parts: Array<{ text: string; bold?: boolean }>
): any {
  return {
    _type: "block",
    _key: Math.random().toString(36).substring(7),
    style: "normal",
    children: parts.map((part) => ({
      _type: "span",
      _key: Math.random().toString(36).substring(7),
      text: part.text,
      marks: part.bold ? ["strong"] : [],
    })),
    markDefs: [],
  };
}

// Blog posts data from content.md - VERBATIM
const blogPosts: BlogPost[] = [
  // Article 01: The Sound of Luxury is Silence
  {
    _type: "post",
    title: "The Sound of Luxury is Silence",
    slug: { _type: "slug", current: "silent-luxury-hvac" },
    excerpt:
      "A 50-Million Dirham Villa Should Not Hum. True luxury is not just about gold leaf, book-matched marble, or silk carpets. True luxury is the absence of irritation.",
    category: "Engineering",
    author: {
      name: "MIDC Engineering Team",
      role: "MEP Division",
    },
    readTime: 8,
    tags: ["MEP Design", "HVAC", "Luxury Villas", "Noise Control"],
    featured: true,
    publishedAt: new Date().toISOString(),
    content: [
      createBlock("A 50-Million Dirham Villa Should Not Hum.", "h2"),
      createBlock(
        "You walk into the lobby of a 5-star hotel like the Ritz-Carlton. You feel the cool air instantly, but you don't hear it. You don't see ugly plastic vents punching through the ceiling. The atmosphere is pristine. It feels expensive because it is silent."
      ),
      createBlock(
        'Now, walk into a standard "luxury" villa delivered by an average contractor in Dubai. You hear the low drone of the Fan Coil Unit (FCU) vibrating against the gypsum. You see condensation dripping from a yellowing aluminium grille. You have to turn up the volume on the television just to drown out the "wind noise" of the air conditioning.'
      ),
      createBlock(
        "True luxury is not just about gold leaf, book-matched marble, or silk carpets. True luxury is the absence of irritation."
      ),
      createBlock(
        "At Mouhajer International Design & Contracting, we believe that Acoustic Comfort is a design material, just as important as the stone or the wood. But unlike stone, you cannot buy silence off the shelf. It must be engineered."
      ),
      createBlock(
        "Here is how our in-house MEP Division engineers silence into the homes of the UAE's elite."
      ),

      createBlock('The "Invisible" Standard', "h2"),
      createBlock(
        "The first mistake most contractors make is treating AC as an afterthought. Interior designers draw a beautiful ceiling, and then, at the last minute, the MEP contractor cuts ugly holes in the gypsum to fit standard 60x60cm supply diffusers."
      ),
      createBlock(
        "We reject this approach. At MIDC, our MEP engineers sit with our designers during the Concept Phase. We design the cooling to be felt, not seen."
      ),
      createBlockWithBold([
        { text: "Linear Slot Diffusers: ", bold: true },
        {
          text: 'We utilize architectural "knife-edge" diffusers that are often only 20mm to 30mm wide. These run seamlessly along the perimeter of the room, washing the walls and glazing with cool air without breaking the visual aesthetic of the ceiling.',
        },
      ]),
      createBlockWithBold([
        { text: 'The "Shadow Gap" Return: ', bold: true },
        {
          text: 'The most common source of noise is the "Return Air" grille. Instead of a visible metal grille, we often hide the air intake in the architectural shadow gaps of your joinery, wardrobes, or false ceiling levels. The air is pulled away silently, and the mechanism is completely invisible.',
        },
      ]),

      createBlock("The Physics of Noise: Air Velocity", "h2"),
      createBlock(
        "Why is your current AC noisy? The answer is usually Static Pressure and Air Velocity."
      ),
      createBlock(
        "When a contractor wants to save money, they use smaller ducts. When you force a large volume of air through a small duct, the air must travel faster. Fast-moving air creates turbulence (wind noise)."
      ),
      createBlockWithBold([
        { text: "The MIDC Calculation: ", bold: true },
        { text: "We do not guess. We calculate." },
      ]),
      createBlockWithBold([
        { text: "Standard Practice: ", bold: true },
        {
          text: 'Most residential AC systems run air at 6-8 meters per second (m/s). This creates an audible "whoosh."',
        },
      ]),
      createBlockWithBold([
        { text: "The MIDC Standard: ", bold: true },
        {
          text: "We oversize our ducting network to lower the air velocity to 3-4 m/s. By slowing the air down, we eliminate the turbulence. It requires more ceiling space and more sheet metal, but the result is absolute silence.",
        },
      ]),

      createBlock('The "Decibel Budget": Aiming for NC-25', "h2"),
      createBlock(
        "Sound is measured in Decibels (dB), but in HVAC engineering, we use Noise Criteria (NC) Curves."
      ),
      createBlock(
        "A standard luxury bedroom typically operates at NC-35 to NC-40 (roughly 45-50 dB). This sounds like a refrigerator humming in the corner."
      ),
      createBlock(
        "For our clients in District One and Jumeirah Bay, that is unacceptable. We engineer our systems to achieve NC-25 (approx. 30-35 dB). This is the sound level of a quiet library or a recording studio."
      ),
      createBlockWithBold([
        { text: "The Hardware of Silence: ", bold: true },
        {
          text: 'To achieve NC-25, we use a specific "sandwich" of materials:',
        },
      ]),
      createBlockWithBold([
        { text: "Acoustic Lining: ", bold: true },
        {
          text: "We do not just use bare metal ducts. We wrap the interior and exterior of the ductwork in high-density acoustic foam (25mm to 50mm thick). This absorbs the mechanical noise of the fan before it reaches the room.",
        },
      ]),
      createBlockWithBold([
        { text: "Vibration Isolators: ", bold: true },
        {
          text: "The loudest noise is often vibration traveling through the concrete. We never bolt AC machines directly to your ceiling slab. We suspend them on Neoprene Rubber Springs (Anti-Vibration Mounts) that act as shock absorbers, ensuring no vibration travels through the structure to your bed.",
        },
      ]),

      createBlock("Intelligent Integration (KNX & BMS)", "h2"),
      createBlock(
        "Silence is also about efficiency. A system that runs at 100% power all the time is noisy and wasteful. We integrate your cooling into the KNX Smart Home System."
      ),
      createBlock('The "Scenario" Approach:', "h3"),
      createBlockWithBold([
        { text: "Party Mode: ", bold: true },
        {
          text: "The system ramps up to handle the heat load of 50 guests, increasing airflow.",
        },
      ]),
      createBlockWithBold([
        { text: "Sleep Mode: ", bold: true },
        {
          text: "The system detects the room is occupied but the lights are off. It throttles the fan speed down to 20%, maintaining the temperature while dropping the noise floor to near zero.",
        },
      ]),
      createBlockWithBold([
        { text: "Zoning: ", bold: true },
        {
          text: "We use VAV (Variable Air Volume) dampers to control cooling room-by-room. You aren't pushing air into an empty Majlis while you are sleeping in the Master Suite.",
        },
      ]),

      createBlock('The "Retrofit" Nightmare (Why you must decide now)', "h2"),
      createBlock(
        'We often receive calls from homeowners asking, "Can you fix the noise in my villa?"'
      ),
      createBlock(
        "The uncomfortable truth is: Often, we cannot. Once the ceiling is closed, the ductwork is buried. Fixing a noisy system usually requires ripping out the entire gypsum ceiling, resizing the ducts, and changing the machines. It is a massive, disruptive, and expensive undertaking."
      ),
      createBlock(
        "This is why the decision to hire a Turnkey Contractor with in-house MEP capability is critical before you pour the concrete. We plan the ceiling voids to be deep enough to accommodate silent, oversized ducts from Day One."
      ),

      createBlock("Executive Summary", "h2"),
      createBlock(
        "If you are building a high-end property, do not leave the MEP to a sub-contractor you have never met."
      ),
      createBlockWithBold([
        { text: "The Risk: ", bold: true },
        { text: "Undersized ducts, high velocity, and sleepless nights." },
      ]),
      createBlockWithBold([
        { text: "The Solution: ", bold: true },
        {
          text: "Engineering air velocity below 4 m/s and using acoustic vibration isolation.",
        },
      ]),
      createBlock("Let MIDC validate your design before you build."),
    ],
  },

  // Article 02: The Blame Game
  {
    _type: "post",
    title:
      'The Blame Game: Why "Split Contracts" Double Your Risk in Dubai Construction',
    slug: { _type: "slug", current: "turnkey-vs-split-contract" },
    excerpt:
      'The Triangle of Blame is the inevitable result of the "Split Contract" model. Who pays for the replacement? You do. Who suffers the delay? You do.',
    category: "Insights",
    author: {
      name: "Eng. Maher Mouhajer",
      role: "CEO & Founder",
    },
    readTime: 6,
    tags: [
      "Turnkey Construction",
      "Contract Strategy",
      "Risk Management",
      "Dubai Construction",
    ],
    featured: true,
    publishedAt: new Date().toISOString(),
    content: [
      createBlock("The Triangle of Blame", "h2"),
      createBlock(
        "Picture this scenario: You are building your dream villa in District One. The marble flooring arrives, but the color is slightly off."
      ),
      createBlockWithBold([
        { text: "The Architect says: ", bold: true },
        {
          text: '"I specified the right code. The Contractor ordered the wrong batch."',
        },
      ]),
      createBlockWithBold([
        { text: "The Contractor says: ", bold: true },
        {
          text: '"I ordered what was available. The Supplier said this is the new batch."',
        },
      ]),
      createBlockWithBold([
        { text: "The Supplier says: ", bold: true },
        {
          text: '"This is the industry standard. The Architect should have checked the sample."',
        },
      ]),
      createBlock("Who pays for the replacement? You do."),
      createBlock("Who suffers the 6-week delay? You do."),
      createBlock(
        'In the construction industry, we call this the "Triangle of Blame." It is the inevitable result of the "Split Contract" model.'
      ),

      createBlock("Why the Traditional Model Fails in Luxury", "h2"),
      createBlock('The "Gap" Between Drawing and Building.', "h3"),
      createBlock(
        "In a traditional setup, you hire a Design Consultant to draw the pictures, and a separate Contractor to build them. The problem? Designers draw ideals. Contractors build realities."
      ),
      createBlock(
        "When these two entities work for different companies, their incentives are misaligned:"
      ),
      createBlock("The Designer wants it to look good (regardless of cost)."),
      createBlock(
        "The Contractor wants to build it fast (regardless of detail)."
      ),
      createBlockWithBold([
        { text: "The Result: ", bold: true },
        {
          text: '"Value Engineering." This is a polite term for cutting corners. When the contractor realizes the designer\'s vision is too expensive or complex, they swap your Italian marble for a ceramic look-alike. Your vision dies in the gap between the two contracts.',
        },
      ]),

      createBlock("The Solution: The MIDC Turnkey Protocol", "h2"),
      createBlock("One Signature. Total Accountability.", "h3"),
      createBlock(
        'At MIDC, we operate under a Single-Point of Responsibility model. We do not have a separate "Design Team" and "Construction Team" fighting over email. We are one entity.'
      ),
      createBlock("How This Changes Your Project:", "h3"),
      createBlockWithBold([
        { text: "Instant Feasibility: ", bold: true },
        {
          text: "Our Architects sit next to our Quantity Surveyors. We never draw a floating staircase without knowing exactly what it costs and how to build it.",
        },
      ]),
      createBlockWithBold([
        { text: 'The "Zero-Variation" Goal: ', bold: true },
        {
          text: 'Because we validate the design internally before you sign the contract, we take the risk on the quantities. We don\'t come back to you asking for more money because we "forgot" to count the skirting boards.',
        },
      ]),
      createBlockWithBold([
        { text: "Speed: ", bold: true },
        {
          text: 'We don\'t wait for a "Tender Process" between design and build. We start procuring long-lead items (like stone and elevators) while the final design is still being approved.',
        },
      ]),

      createBlock('The Cost of "Cheap"', "h2"),
      createBlock('Why "Low Bid" is the Most Expensive Choice.', "h3"),
      createBlock(
        "Many clients choose Split Contracts because they think they can get a lower price by bidding the construction out to the cheapest contractor."
      ),
      createBlock("The Math of Illusion:", "h3"),
      createBlock(
        "Split Contract: Initial Bid (AED 10M) + Variations (15%) + Delay Costs (10%) = Final Cost AED 12.5M"
      ),
      createBlock(
        "MIDC Turnkey: Fixed Price (AED 11.5M) + Variations (0%) + Delays (0%) = Final Cost AED 11.5M"
      ),
      createBlock(
        'The Reality: The "Cheaper" option ended up costing 1 Million AED more and took 4 months longer.'
      ),

      createBlock("The Secret Weapon: In-House Manufacturing", "h2"),
      createBlock("Controlling the Critical Path.", "h3"),
      createBlock(
        "In a luxury fit-out, Joinery and Stone are the two biggest causes of delays. If a shipment arrives damaged or incorrect, a traditional contractor is paralyzed for months."
      ),
      createBlockWithBold([
        { text: "Immediate Resolution: ", bold: true },
        {
          text: 'We own the supply chain. A damaged veneer or a misaligned panel is not a "Project Delay"; it is a "Morning Task."',
        },
      ]),
      createBlockWithBold([
        { text: "Seamless Integration: ", bold: true },
        {
          text: "Our joinery team speaks directly to our MEP team. We cut the air-conditioning vents into the wood at the factory, guaranteeing a clean, integrated finish that third-party suppliers can rarely achieve.",
        },
      ]),
      createBlock(
        '"Luxury is about precision. And precision requires proximity." — Eng. Maher Mouhajer',
        "blockquote"
      ),

      createBlock("Case Study: The Proof", "h2"),
      createBlockWithBold([
        { text: "Project: ", bold: true },
        { text: "Address Boulevard VIP Suite" },
      ]),
      createBlockWithBold([
        { text: "Challenge: ", bold: true },
        {
          text: 'A high-complexity renovation with a strict "Hotel Opening" deadline.',
        },
      ]),
      createBlockWithBold([
        { text: "Execution: ", bold: true },
        {
          text: "By running the Design, MEP, and Fit-Out teams in parallel, MIDC delivered the project 2 weeks ahead of schedule. There were zero conflict variations between the MEP and Design drawings because they were produced by the same office.",
        },
      ]),

      createBlock("Stop Managing Conflict. Start Building.", "h2"),
      createBlock(
        "You have a choice. You can be the referee between your Architect and your Contractor. Or you can be the client."
      ),
      createBlock(
        "Secure Your Project: Don't sign a contract until you understand the risks. Book a Contract Strategy Consultation with our commercial team."
      ),
    ],
  },

  // Article 03: The Anatomy of a Winner
  {
    _type: "post",
    title:
      "The Anatomy of a Winner: Why Turnkey Construction is the Future of Luxury in Dubai",
    slug: { _type: "slug", current: "anatomy-of-winner-2025" },
    excerpt:
      'The industry recognized MIDC with the Architecture Leaders Award 2025 for "Villa Project of the Year". This article reveals the methodology that won it.',
    category: "Case Studies",
    author: {
      name: "MIDC Editorial Team",
      role: "Project Stories",
    },
    readTime: 6,
    tags: [
      "Award Winning",
      "Turnkey Construction",
      "ISO Standards",
      "District One",
      "Villa Construction",
    ],
    featured: true,
    publishedAt: new Date().toISOString(),
    content: [
      createBlock(
        'The industry recognized Mouhajer International Design & Contracting (MIDC) with the prestigious Architecture Leaders Award 2025 for "Villa Project of the Year" (Mansion in District One).'
      ),
      createBlock(
        "But this article is not about the trophy. It is about the methodology that won it."
      ),
      createBlock(
        'In a market plagued by delays and budget overruns, this project was delivered on time and to a "Zero Defect" standard. How? Because we rejected the traditional "Consultant-Contractor" split and executed it as a full Turnkey Construction Project.'
      ),
      createBlock(
        "Here is the blueprint of how a Design-Build approach protects high-net-worth assets, backed by our internal ISO protocols."
      ),

      createBlock(
        '1. Construction Risk Management: "Foreseeing the Storm"',
        "h2"
      ),
      createBlock(
        "The biggest fear for any investor is the timeline. In traditional construction, contractors react to delays. As a Turnkey Contractor in Dubai, we predict them."
      ),
      createBlock(
        'Our internal Planning Protocol, titled "Foreseeing the Storm", dictates that we perform a comprehensive risk assessment before mobilization.'
      ),
      createBlockWithBold([
        { text: "The Protocol: ", bold: true },
        { text: 'We break the massive scope down into "manageable bricks".' },
      ]),
      createBlockWithBold([
        { text: "The Execution: ", bold: true },
        {
          text: 'For the District One Mansion, we identified potential "material shortages" of Italian stone 12 weeks in advance.',
        },
      ]),
      createBlockWithBold([
        { text: "The Result: ", bold: true },
        {
          text: "While other luxury villa contractors were stalled by global shipping issues, our resource allocation strategy ensured our site remained active.",
        },
      ]),

      createBlock('2. Material Control: The "Chain of Custody"', "h2"),
      createBlock(
        'A "Turnkey" solution means we own the supply chain. Most disputes in luxury fit-outs happen when materials arrive damaged. The Consultant blames the Supplier; the Supplier blames the Logistics.'
      ),
      createBlock(
        'At MIDC, we utilize strict Material Control Procedures that cover the "entire lifecycle" of your asset:'
      ),
      createBlockWithBold([
        { text: "Procurement: ", bold: true },
        {
          text: "We negotiate delivery times and verify quality before purchase.",
        },
      ]),
      createBlockWithBold([
        { text: "Storage: ", bold: true },
        {
          text: 'We store expensive joinery and stone in "suitable and secure" locations to prevent the humidity damage that ruins so many Dubai villas.',
        },
      ]),
      createBlockWithBold([
        { text: "Verification: ", bold: true },
        {
          text: 'We maintain a live "inventory system" tracking the status of every item.',
        },
      ]),
      createBlock(
        "This level of custody is impossible if you hire separate vendors. It is only possible with a Single-Point Turnkey Provider."
      ),

      createBlock("3. Quality Assurance: The ISO 9001 Standard", "h2"),
      createBlock(
        'Why did this project win "Villa of the Year"? Precision. Many Dubai contractors aim for "good enough." Our Quality Policy has a singular objective: "Achieve zero defects".'
      ),
      createBlock(
        "We differentiate ourselves through rigorous separation of duties:"
      ),
      createBlockWithBold([
        { text: "Independent Audits: ", bold: true },
        {
          text: 'Our Quality Control Inspectors perform "independent inspections". They do not report to the site team; they report to the Quality Manager.',
        },
      ]),
      createBlockWithBold([
        { text: "Pre-Vetting: ", bold: true },
        {
          text: 'We select only subcontractors with "proven track records". If a trade cannot meet our ISO 9001 standard, they do not step onto your site.',
        },
      ]),

      createBlock(
        '4. The "Design-Build" Advantage: Creativity Meets Construction',
        "h2"
      ),
      createBlock(
        'Our Vision states that "construction is not only a technical process, but also a creative one". The District One project featured complex structural elements that a standard contractor would have "Value Engineered" out of the design.'
      ),
      createBlock(
        "Because MIDC operates as a Design & Build firm, our architects and engineers sit at the same table. We solved the structural challenges internally, preserving the aesthetic vision without compromising the budget."
      ),

      createBlock("Executive Summary: Why Choose Turnkey?", "h2"),
      createBlock(
        'The Architecture Leaders Award 2025 is proof that the Turnkey Construction model works. By unifying Design, Procurement, and Build under one roof, you eliminate the "Triangle of Blame" that destroys luxury projects.'
      ),
      createBlockWithBold([
        { text: "Risk: ", bold: true },
        { text: 'Mitigated through "Foreseeing the Storm" protocols.' },
      ]),
      createBlockWithBold([
        { text: "Quality: ", bold: true },
        { text: "Guaranteed by ISO 9001 standards." },
      ]),
      createBlockWithBold([
        { text: "Result: ", bold: true },
        { text: "An award-winning asset delivered on time." },
      ]),
      createBlock(
        "Secure Your Project. Stop managing consultants. Start building a legacy."
      ),
    ],
  },
];

// Main seed function
async function seedBlogPosts() {
  console.log("🚀 Starting blog posts seed...\n");

  // Check for API token
  if (!process.env.SANITY_API_TOKEN) {
    console.error(
      "❌ Error: SANITY_API_TOKEN not found in environment variables"
    );
    console.log("Please add SANITY_API_TOKEN to your .env.local file");
    process.exit(1);
  }

  let successCount = 0;
  let errorCount = 0;

  for (const post of blogPosts) {
    try {
      console.log(`📝 Creating post: "${post.title}"...`);

      // Upload image for this post
      const imagePath = blogImages[post.slug.current];
      let mainImage = null;

      if (imagePath) {
        console.log(`   📷 Uploading image: ${imagePath}...`);
        mainImage = await uploadImage(
          imagePath,
          `blog-${post.slug.current}.jpg`
        );
        if (mainImage) {
          console.log(`   ✅ Image uploaded successfully`);
        }
      }

      // Add mainImage to post if uploaded
      const postWithImage = mainImage ? { ...post, mainImage } : post;

      // Check if post already exists
      const existingPost = await client.fetch(
        `*[_type == "post" && slug.current == $slug][0]`,
        { slug: post.slug.current }
      );

      if (existingPost) {
        console.log(`   ⚠️  Post already exists, updating...`);
        await client.patch(existingPost._id).set(postWithImage).commit();
        console.log(`   ✅ Updated: ${post.title}`);
      } else {
        await client.create(postWithImage);
        console.log(`   ✅ Created: ${post.title}`);
      }

      successCount++;
    } catch (error: any) {
      console.error(`   ❌ Error creating "${post.title}":`, error.message);
      errorCount++;
    }
  }

  console.log("\n========================================");
  console.log(`✅ Successfully processed: ${successCount} posts`);
  if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount} posts`);
  }
  console.log("========================================\n");

  console.log("📌 Blog URLs:");
  blogPosts.forEach((post) => {
    console.log(`   - /blog/${post.slug.current}`);
  });
}

// Run the seed
seedBlogPosts()
  .then(() => {
    console.log("\n🎉 Seed complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
