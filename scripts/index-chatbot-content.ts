/**
 * Content Indexer for MIDC Chatbot
 *
 * This script indexes all website content (Sanity CMS + local files)
 * and generates a structured knowledge base for the AI chatbot.
 *
 * Run: npx tsx scripts/index-chatbot-content.ts
 */

import { createClient } from '@sanity/client';
import * as fs from 'fs';
import * as path from 'path';

// Sanity client configuration
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Output paths
const OUTPUT_DIR = path.join(process.cwd(), 'lib', 'ai');
const KNOWLEDGE_BASE_PATH = path.join(OUTPUT_DIR, 'knowledge-base.json');

// Types
interface ContentItem {
  id: string;
  type: 'project' | 'service' | 'industry' | 'blog' | 'faq' | 'testimonial' | 'page' | 'company';
  title: string;
  content: string;
  metadata: Record<string, any>;
  keywords: string[];
}

interface KnowledgeBase {
  version: string;
  generatedAt: string;
  totalItems: number;
  items: ContentItem[];
  companyInfo: CompanyInfo;
  statistics: Statistics;
}

interface CompanyInfo {
  name: string;
  shortName: string;
  founder: string;
  founderTitle: string;
  experience: string;
  locations: string[];
  phone: string;
  email: string;
  whatsapp: string;
  website: string;
  services: string[];
  awards: Award[];
  certifications: string[];
  partners: string[];
}

interface Award {
  name: string;
  year: string;
  project?: string;
}

interface Statistics {
  projectsCompleted: number;
  yearsExperience: number;
  teamSize?: number;
  clientSatisfaction?: string;
}

// ============================================
// COMPANY INFORMATION (Core static data)
// ============================================

const COMPANY_INFO: CompanyInfo = {
  name: 'Mouhajer International Design & Contracting',
  shortName: 'MIDC',
  founder: 'Eng. Maher Mouhajer',
  founderTitle: 'Founder & CEO',
  experience: '20+ years',
  locations: ['Dubai, UAE', 'Abu Dhabi, UAE'],
  phone: '+971 52 304 1482',
  email: 'info@mouhajerdesign.com',
  whatsapp: '+971 52 304 1482',
  website: 'mouhajerdesign.com',
  services: [
    'Design & Engineering',
    'Civil Construction',
    'Fit-Out & Execution',
    'Manufacturing & Joinery',
    'FF&E Specification',
    'Project Management',
  ],
  awards: [
    { name: 'Best Hotel Suite Interior Arabia', year: '2023-2024', project: 'Address Boulevard VIP Suite' },
    { name: 'Best Hotel Suite Interior Dubai', year: '2023-2024', project: 'Address Boulevard VIP Suite' },
    { name: 'Best Residential Interior Apartment Dubai', year: '2023-2024', project: 'Address Boulevard Penthouse' },
    { name: 'Best Hotel Interior Abu Dhabi', year: '2022-2023', project: 'Sheraton Abu Dhabi Hotel & Resort' },
    { name: 'Luxury Lifestyle Awards - Best Luxury Interior Design', year: '2021' },
  ],
  certifications: [
    'ISO 9001:2015 (Quality Management)',
    'ISO 14001:2015 (Environmental Management)',
    'ISO 45001:2018 (Occupational Health & Safety)',
  ],
  partners: [
    'Address Hotels & Resorts',
    'Sheraton Hotels',
    'Grand Hyatt Hotels',
    'Abu Dhabi National Hotels',
  ],
};

const STATISTICS: Statistics = {
  projectsCompleted: 150,
  yearsExperience: 20,
};

// ============================================
// SANITY CONTENT FETCHERS
// ============================================

async function fetchProjects(): Promise<ContentItem[]> {
  console.log('  Fetching projects from Sanity...');

  try {
    const projects = await sanityClient.fetch(`
      *[_type == "project"] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        category,
        location,
        year,
        area,
        client,
        "services": services[]->title,
        "tags": tags[]->name
      }
    `);

    if (!Array.isArray(projects)) return [];

    return projects
      .filter((p: any) => p && p._id)
      .map((p: any) => {
        const title = String(p.title || 'Untitled Project');
        const servicesArr = Array.isArray(p.services) ? p.services.filter(Boolean).map(String) : [];
        const tagsArr = Array.isArray(p.tags) ? p.tags.filter(Boolean).map(String) : [];

        return {
          id: p._id,
          type: 'project' as const,
          title,
          content: [
            p.excerpt,
            p.category ? `Category: ${p.category}` : '',
            p.location ? `Location: ${p.location}` : '',
            p.year ? `Year: ${p.year}` : '',
            p.area ? `Area: ${p.area}` : '',
            p.client ? `Client: ${p.client}` : '',
            servicesArr.length ? `Services: ${servicesArr.join(', ')}` : '',
          ].filter(Boolean).join('. '),
          metadata: {
            slug: p.slug,
            category: p.category,
            location: p.location,
            year: p.year,
            area: p.area,
            client: p.client,
            services: servicesArr,
            tags: tagsArr,
          },
          keywords: [
            title.toLowerCase(),
            p.category ? String(p.category).toLowerCase() : '',
            p.location ? String(p.location).toLowerCase() : '',
            ...servicesArr.map(s => s.toLowerCase()),
            ...tagsArr.map(t => t.toLowerCase()),
          ].filter(Boolean),
        };
      });
  } catch (error) {
    console.log('  Warning: Could not fetch projects from Sanity:', (error as Error).message);
    return [];
  }
}

async function fetchServices(): Promise<ContentItem[]> {
  console.log('  Fetching services from Sanity...');

  try {
    const services = await sanityClient.fetch(`
      *[_type == "service"] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        icon,
        features
      }
    `);

    if (!Array.isArray(services)) return [];

    return services
      .filter((s: any) => s && s._id)
      .map((s: any) => {
        const title = String(s.title || 'Untitled Service');
        const featuresArr = Array.isArray(s.features) ? s.features.filter(Boolean).map(String) : [];

        return {
          id: s._id,
          type: 'service' as const,
          title,
          content: [
            s.excerpt,
            featuresArr.length ? `Features: ${featuresArr.join(', ')}` : '',
          ].filter(Boolean).join('. '),
          metadata: {
            slug: s.slug,
            icon: s.icon,
            features: featuresArr,
          },
          keywords: [
            title.toLowerCase(),
            'service',
            ...featuresArr.map(f => f.toLowerCase()),
          ].filter(Boolean),
        };
      });
  } catch (error) {
    console.log('  Warning: Could not fetch services from Sanity:', (error as Error).message);
    return [];
  }
}

async function fetchIndustries(): Promise<ContentItem[]> {
  console.log('  Fetching industries from Sanity...');

  try {
    const industries = await sanityClient.fetch(`
      *[_type == "industry"] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        icon
      }
    `);

    if (!Array.isArray(industries)) return [];

    return industries
      .filter((i: any) => i && i._id)
      .map((i: any) => {
        const title = String(i.title || 'Untitled Industry');

        return {
          id: i._id,
          type: 'industry' as const,
          title,
          content: i.excerpt ? String(i.excerpt) : '',
          metadata: {
            slug: i.slug,
            icon: i.icon,
          },
          keywords: [
            title.toLowerCase(),
            'industry',
            'sector',
          ].filter(Boolean),
        };
      });
  } catch (error) {
    console.log('  Warning: Could not fetch industries from Sanity:', (error as Error).message);
    return [];
  }
}

async function fetchBlogPosts(): Promise<ContentItem[]> {
  console.log('  Fetching blog posts from Sanity...');

  try {
    const posts = await sanityClient.fetch(`
      *[_type == "post"] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        category,
        author,
        tags,
        publishedAt
      }
    `);

    if (!Array.isArray(posts)) return [];

    return posts
      .filter((p: any) => p && p._id)
      .map((p: any) => {
        const title = String(p.title || 'Untitled Post');
        const tagsArr = Array.isArray(p.tags) ? p.tags.filter(Boolean).map(String) : [];
        const authorName = typeof p.author === 'object' ? p.author?.name : p.author;

        return {
          id: p._id,
          type: 'blog' as const,
          title,
          content: [
            p.excerpt,
            p.category ? `Category: ${p.category}` : '',
            authorName ? `Author: ${authorName}` : '',
          ].filter(Boolean).join('. '),
          metadata: {
            slug: p.slug,
            category: p.category,
            author: p.author,
            tags: tagsArr,
            publishedAt: p.publishedAt,
          },
          keywords: [
            title.toLowerCase(),
            p.category ? String(p.category).toLowerCase() : '',
            'blog',
            'article',
            ...tagsArr.map(t => t.toLowerCase()),
          ].filter(Boolean),
        };
      });
  } catch (error) {
    console.log('  Warning: Could not fetch blog posts from Sanity:', (error as Error).message);
    return [];
  }
}

async function fetchTestimonials(): Promise<ContentItem[]> {
  console.log('  Fetching testimonials from Sanity...');

  try {
    const testimonials = await sanityClient.fetch(`
      *[_type == "testimonial"] {
        _id,
        name,
        role,
        company,
        quote,
        rating
      }
    `);

    if (!Array.isArray(testimonials)) return [];

    return testimonials
      .filter((t: any) => t && t._id)
      .map((t: any) => {
        const name = String(t.name || 'Anonymous');

        return {
          id: t._id,
          type: 'testimonial' as const,
          title: `Testimonial from ${name}`,
          content: [
            t.quote,
            `- ${name}`,
            t.role ? `, ${t.role}` : '',
            t.company ? ` at ${t.company}` : '',
          ].filter(Boolean).join(''),
          metadata: {
            name,
            role: t.role,
            company: t.company,
            rating: t.rating,
          },
          keywords: [
            'testimonial',
            'review',
            'client',
            t.company ? String(t.company).toLowerCase() : '',
          ].filter(Boolean),
        };
      });
  } catch (error) {
    console.log('  Warning: Could not fetch testimonials from Sanity:', (error as Error).message);
    return [];
  }
}

// ============================================
// LOCAL CONTENT FETCHERS
// ============================================

function loadFAQContent(): ContentItem[] {
  console.log('  Loading FAQ content...');

  try {
    const faqPath = path.join(process.cwd(), 'lib', 'faq-data.ts');
    if (!fs.existsSync(faqPath)) {
      console.log('  Warning: FAQ file not found');
      return [];
    }

    const content = fs.readFileSync(faqPath, 'utf-8');

    // Extract FAQ items using regex
    const faqRegex = /question:\s*["']([^"']+)["'],\s*answer:\s*["']([^"']+)["']/g;
    const faqs: ContentItem[] = [];
    let match;
    let index = 0;

    while ((match = faqRegex.exec(content)) !== null) {
      faqs.push({
        id: `faq-${index++}`,
        type: 'faq',
        title: match[1],
        content: match[2],
        metadata: {},
        keywords: ['faq', 'question', ...match[1].toLowerCase().split(' ')],
      });
    }

    return faqs;
  } catch (error) {
    console.log('  Warning: Could not load FAQ content:', (error as Error).message);
    return [];
  }
}

function loadServiceContent(): ContentItem[] {
  console.log('  Loading service content from local files...');

  try {
    const servicePath = path.join(process.cwd(), 'lib', 'service-content.ts');
    if (!fs.existsSync(servicePath)) {
      console.log('  Warning: Service content file not found');
      return [];
    }

    // We'll create basic service entries from the company info
    return COMPANY_INFO.services.map((service, index) => ({
      id: `service-local-${index}`,
      type: 'service',
      title: service,
      content: `${service} - One of MIDC's core service pillars. We provide comprehensive ${service.toLowerCase()} solutions for luxury residential, commercial, and hospitality projects.`,
      metadata: { pillar: true },
      keywords: [service.toLowerCase(), 'service', 'midc'],
    }));
  } catch (error) {
    console.log('  Warning: Could not load service content:', (error as Error).message);
    return [];
  }
}

function loadRealContentData(): ContentItem[] {
  console.log('  Loading real content data...');

  try {
    const contentPath = path.join(process.cwd(), 'lib', 'real-content-data.ts');
    if (!fs.existsSync(contentPath)) {
      console.log('  Warning: Real content data file not found');
      return [];
    }

    const content = fs.readFileSync(contentPath, 'utf-8');

    // Extract project data using regex
    const projectRegex = /title:\s*["']([^"']+)["'],[\s\S]*?excerpt:\s*["']([^"']+)["']/g;
    const projects: ContentItem[] = [];
    let match;
    let index = 0;

    while ((match = projectRegex.exec(content)) !== null) {
      projects.push({
        id: `local-project-${index++}`,
        type: 'project',
        title: match[1],
        content: match[2],
        metadata: { source: 'local' },
        keywords: ['project', ...match[1].toLowerCase().split(' ')],
      });
    }

    return projects;
  } catch (error) {
    console.log('  Warning: Could not load real content data:', (error as Error).message);
    return [];
  }
}

// ============================================
// GENERATE COMPANY INFO CONTENT
// ============================================

function generateCompanyContent(): ContentItem[] {
  console.log('  Generating company info content...');

  const items: ContentItem[] = [];

  // About the company
  items.push({
    id: 'company-about',
    type: 'company',
    title: 'About MIDC',
    content: `${COMPANY_INFO.name} (${COMPANY_INFO.shortName}) was founded by ${COMPANY_INFO.founder} over ${COMPANY_INFO.experience} ago. We are a full-service design and construction firm specializing in luxury residential, commercial, and hospitality projects across Dubai and Abu Dhabi, UAE. We have completed ${STATISTICS.projectsCompleted}+ projects and are triple ISO certified.`,
    metadata: { category: 'about' },
    keywords: ['about', 'company', 'midc', 'mouhajer', 'history', 'background'],
  });

  // Founder info
  items.push({
    id: 'company-founder',
    type: 'company',
    title: 'Our Founder',
    content: `Our founder and CEO is ${COMPANY_INFO.founder}, who has ${COMPANY_INFO.experience} of experience in luxury design and construction. Under his leadership, MIDC has become a multiple-time 5-Star Winner at the International Property Awards.`,
    metadata: { category: 'founder' },
    keywords: ['founder', 'ceo', 'maher', 'mouhajer', 'owner', 'leader'],
  });

  // Services
  items.push({
    id: 'company-services',
    type: 'company',
    title: 'Our Services',
    content: `MIDC offers 6 core pillars of service: ${COMPANY_INFO.services.join(', ')}. We handle everything from concept to completion for luxury residential, commercial, and hospitality projects.`,
    metadata: { category: 'services' },
    keywords: ['services', 'offer', 'provide', 'capabilities', 'pillars'],
  });

  // Awards
  items.push({
    id: 'company-awards',
    type: 'company',
    title: 'Awards & Certifications',
    content: `MIDC is a multiple-time 5-Star Winner at the International Property Awards: ${COMPANY_INFO.awards.map(a => `${a.name} (${a.year})`).join(', ')}. We are also ${COMPANY_INFO.certifications.join(', ')}.`,
    metadata: { category: 'awards' },
    keywords: ['awards', 'certifications', 'iso', 'recognition', 'achievements', 'property awards'],
  });

  // Contact
  items.push({
    id: 'company-contact',
    type: 'company',
    title: 'Contact Information',
    content: `Contact MIDC: Phone: ${COMPANY_INFO.phone}, Email: ${COMPANY_INFO.email}, WhatsApp: ${COMPANY_INFO.whatsapp}. We have offices in ${COMPANY_INFO.locations.join(' and ')}.`,
    metadata: { category: 'contact' },
    keywords: ['contact', 'phone', 'email', 'whatsapp', 'reach', 'location', 'address'],
  });

  // Partners
  items.push({
    id: 'company-partners',
    type: 'company',
    title: 'Our Partners',
    content: `MIDC has partnered with prestigious brands including: ${COMPANY_INFO.partners.join(', ')}. We specialize in luxury villas, 5-star hotel interiors, high-end apartments, penthouses, commercial offices, and restaurants.`,
    metadata: { category: 'partners' },
    keywords: ['partners', 'clients', 'hotels', 'address', 'sheraton', 'hyatt'],
  });

  return items;
}

// ============================================
// MAIN INDEXER
// ============================================

async function indexContent(): Promise<void> {
  console.log('\n========================================');
  console.log('MIDC Chatbot Content Indexer');
  console.log('========================================\n');

  const startTime = Date.now();
  const allItems: ContentItem[] = [];

  // Fetch from Sanity CMS
  console.log('1. Fetching content from Sanity CMS...');
  const [projects, services, industries, blogPosts, testimonials] = await Promise.all([
    fetchProjects(),
    fetchServices(),
    fetchIndustries(),
    fetchBlogPosts(),
    fetchTestimonials(),
  ]);

  allItems.push(...projects);
  allItems.push(...services);
  allItems.push(...industries);
  allItems.push(...blogPosts);
  allItems.push(...testimonials);

  console.log(`   - Projects: ${projects.length}`);
  console.log(`   - Services: ${services.length}`);
  console.log(`   - Industries: ${industries.length}`);
  console.log(`   - Blog Posts: ${blogPosts.length}`);
  console.log(`   - Testimonials: ${testimonials.length}`);

  // Load local content
  console.log('\n2. Loading local content files...');
  const faqs = loadFAQContent();
  const localServices = loadServiceContent();
  const localProjects = loadRealContentData();
  const companyContent = generateCompanyContent();

  allItems.push(...faqs);
  allItems.push(...localServices);
  allItems.push(...localProjects);
  allItems.push(...companyContent);

  console.log(`   - FAQs: ${faqs.length}`);
  console.log(`   - Local Services: ${localServices.length}`);
  console.log(`   - Local Projects: ${localProjects.length}`);
  console.log(`   - Company Content: ${companyContent.length}`);

  // Remove duplicates by ID
  const uniqueItems = Array.from(
    new Map(allItems.map(item => [item.id, item])).values()
  );

  // Create knowledge base
  const knowledgeBase: KnowledgeBase = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    totalItems: uniqueItems.length,
    items: uniqueItems,
    companyInfo: COMPANY_INFO,
    statistics: STATISTICS,
  };

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Write knowledge base to file
  console.log('\n3. Writing knowledge base...');
  fs.writeFileSync(KNOWLEDGE_BASE_PATH, JSON.stringify(knowledgeBase, null, 2));

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n========================================');
  console.log('INDEXING COMPLETE');
  console.log('========================================');
  console.log(`Total items indexed: ${uniqueItems.length}`);
  console.log(`Output file: ${KNOWLEDGE_BASE_PATH}`);
  console.log(`Duration: ${duration}s`);
  console.log('========================================\n');

  // Print summary by type
  const byType = uniqueItems.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('Content by type:');
  Object.entries(byType).forEach(([type, count]) => {
    console.log(`  - ${type}: ${count}`);
  });
}

// Run the indexer
indexContent().catch(console.error);
