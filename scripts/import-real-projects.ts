import { createClient } from "@sanity/client";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "b6q28exv",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-11-21",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const PROJECTS_DIR = path.join(process.cwd(), "projects", "our projects page");
const MAX_IMAGES_PER_PROJECT = 100; // Upload ALL HQ images per project (each has ~95 images)

interface ProjectMetadata {
  service?: string;
  status?: string;
  location?: string;
  category?: string;
  client?: string;
}

interface ProjectData {
  folderName: string;
  title: string;
  slug: string;
  metadata: ProjectMetadata;
  images: string[];
}

// Parse keyfact.txt file
function parseKeyfactFile(content: string): ProjectMetadata {
  const lines = content.split("\n");
  const metadata: ProjectMetadata = {};
  let currentKey = "";

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === "SERVICE(S)") {
      currentKey = "service";
    } else if (trimmed === "CURRENT STATUS") {
      currentKey = "status";
    } else if (trimmed === "LOCATION") {
      currentKey = "location";
    } else if (trimmed === "CATEGORY") {
      currentKey = "category";
    } else if (trimmed === "CLIENT") {
      currentKey = "client";
    } else if (trimmed && currentKey) {
      metadata[currentKey as keyof ProjectMetadata] = trimmed;
      currentKey = "";
    }
  }

  return metadata;
}

// Generate clean title from folder name
function generateTitle(folderName: string): string {
  // Remove leading numbers and clean up
  const cleaned = folderName.replace(/^\d+\s*/, "").trim();

  // Title case
  return cleaned
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Generate slug from folder name
function generateSlug(folderName: string): string {
  return folderName
    .toLowerCase()
    .replace(/^\d+\s*/, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Determine category from metadata and folder name
function determineCategory(
  metadata: ProjectMetadata,
  folderName: string
): string {
  const folder = folderName.toLowerCase();
  const metaCategory = metadata.category?.toLowerCase() || "";

  if (folder.includes("hotel") || metaCategory.includes("hotel"))
    return "Hospitality";
  if (folder.includes("villa") || folder.includes("penthouse"))
    return "Residential";
  if (folder.includes("restaurant") || metaCategory.includes("restaurant"))
    return "Hospitality";
  if (folder.includes("office") || metaCategory.includes("office"))
    return "Commercial";
  if (folder.includes("lounge") || metaCategory.includes("lounge"))
    return "Hospitality";

  return "Residential";
}

// Extract year from folder name or default to recent year
function extractYear(folderName: string, metadata: ProjectMetadata): string {
  const yearMatch = folderName.match(/20\d{2}/);
  if (yearMatch) return yearMatch[0];

  // Default to 2023 or 2024 based on index
  return Math.random() > 0.5 ? "2023" : "2024";
}

// Scan projects directory
async function scanProjects(): Promise<ProjectData[]> {
  const projects: ProjectData[] = [];

  try {
    const folders = await readdir(PROJECTS_DIR);

    for (const folder of folders) {
      if (folder.startsWith(".")) continue; // Skip hidden folders

      const folderPath = path.join(PROJECTS_DIR, folder);
      const folderStat = await stat(folderPath);

      if (!folderStat.isDirectory()) continue;

      // Read keyfact.txt if exists
      let metadata: ProjectMetadata = {};
      const keyfactPath = path.join(folderPath, "keyfact.txt");

      try {
        const keyfactContent = await readFile(keyfactPath, "utf-8");
        metadata = parseKeyfactFile(keyfactContent);
      } catch (error) {
        console.log(`No keyfact.txt for ${folder}, using defaults`);
      }

      // Get images
      const files = await readdir(folderPath);
      const images = files
        .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
        .slice(0, MAX_IMAGES_PER_PROJECT)
        .map((file) => path.join(folderPath, file));

      if (images.length === 0) {
        console.log(`No images found for ${folder}, skipping`);
        continue;
      }

      projects.push({
        folderName: folder,
        title: generateTitle(folder),
        slug: generateSlug(folder),
        metadata,
        images,
      });
    }

    return projects;
  } catch (error) {
    console.error("Error scanning projects:", error);
    return [];
  }
}

// Upload image to Sanity
async function uploadImage(imagePath: string): Promise<any> {
  try {
    const imageBuffer = await readFile(imagePath);
    const fileName = path.basename(imagePath);

    const asset = await client.assets.upload("image", imageBuffer, {
      filename: fileName,
    });

    return {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
    };
  } catch (error) {
    console.error(`Error uploading ${imagePath}:`, error);
    return null;
  }
}

// Generate professional excerpt
function generateExcerpt(
  title: string,
  metadata: ProjectMetadata,
  category: string
): string {
  const templates = {
    Hospitality: [
      `Premium ${category.toLowerCase()} fit-out featuring luxury finishes and bespoke interior design.`,
      `Complete renovation and fit-out maintaining operations throughout the transformation.`,
      `Turnkey design and build with seamless integration of MEP systems and custom joinery.`,
    ],
    Residential: [
      `Luxury residential project featuring contemporary design and premium finishes.`,
      `Turnkey design and build of a modern ${title.toLowerCase()} with bespoke interiors.`,
      `Complete fit-out and handover of high-end residential property.`,
    ],
    Commercial: [
      `Premium commercial fit-out featuring executive spaces and modern design.`,
      `Complete office transformation with integrated MEP systems and custom millwork.`,
      `Professional workspace design with attention to functionality and aesthetics.`,
    ],
  };

  const categoryTemplates =
    templates[category as keyof typeof templates] || templates.Residential;
  return categoryTemplates[
    Math.floor(Math.random() * categoryTemplates.length)
  ];
}

// Seed Sanity with projects
async function seedProjects() {
  console.log("🔍 Scanning projects directory...\n");

  const projects = await scanProjects();

  if (projects.length === 0) {
    console.log("❌ No projects found!");
    return;
  }

  console.log(`✅ Found ${projects.length} projects\n`);
  console.log("📦 Starting upload to Sanity...\n");

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    const category = determineCategory(project.metadata, project.folderName);
    const year = extractYear(project.folderName, project.metadata);

    console.log(`\n[${i + 1}/${projects.length}] Processing: ${project.title}`);
    console.log(`   Slug: ${project.slug}`);
    console.log(`   Category: ${category}`);
    console.log(`   Images: ${project.images.length}`);

    // Upload main image
    console.log(`   Uploading main image...`);
    const mainImage = await uploadImage(project.images[0]);

    if (!mainImage) {
      console.log(`   ❌ Failed to upload main image, skipping project`);
      continue;
    }

    // Upload gallery images (skip first as it's the main image)
    const gallery: any[] = [];
    for (
      let j = 1;
      j < Math.min(project.images.length, MAX_IMAGES_PER_PROJECT);
      j++
    ) {
      console.log(
        `   Uploading gallery image ${j}/${Math.min(project.images.length, MAX_IMAGES_PER_PROJECT) - 1}...`
      );
      const galleryImage = await uploadImage(project.images[j]);
      if (galleryImage) {
        gallery.push(galleryImage);
      }
    }

    // Create project document
    const projectDoc = {
      _type: "project",
      _id: `project-${project.slug}`,
      title: project.title,
      slug: {
        _type: "slug",
        current: project.slug,
      },
      excerpt: generateExcerpt(project.title, project.metadata, category),
      mainImage,
      gallery,
      category,
      location: project.metadata.location || "Dubai, UAE",
      year,
      client: project.metadata.client || undefined,
      featured: i < 6, // Mark first 6 as featured
      publishedAt: new Date().toISOString(),
      __i18n_lang: "en",
    };

    try {
      await client.createOrReplace(projectDoc);
      console.log(`   ✅ Created project: ${project.title}`);
    } catch (error) {
      console.error(`   ❌ Error creating project:`, error);
    }
  }

  console.log("\n\n✨ Import complete!");
  console.log(`\n📊 Summary:`);
  console.log(`   Total projects: ${projects.length}`);
  console.log(`   Images per project: Up to ${MAX_IMAGES_PER_PROJECT}`);
  console.log(`\n🌐 View in Sanity Studio: https://b6q28exv.sanity.studio`);
}

// Run the import
seedProjects().catch(console.error);
