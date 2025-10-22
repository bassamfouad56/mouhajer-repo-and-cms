import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'data');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Generate a unique ID using timestamp + random string
function generateUniqueId(): string {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `${timestamp}-${randomPart}`;
}

export interface Project {
  id: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  images: string[];
  category: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  shortDescription: { en: string; ar: string };
  icon: string;
  images: string[];
  features: { en: string[]; ar: string[] };
  price: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: { en: string; ar: string };
  slug: { en: string; ar: string };
  excerpt: { en: string; ar: string };
  content: { en: string; ar: string };
  featuredImage: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  featured: boolean;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface MediaFile {
  id: string;
  name: string;
  originalName: string;
  url: string;
  thumbnailUrl?: string;
  type: 'image' | 'video' | 'document';
  size: number;
  width?: number;
  height?: number;
  uploadedAt: string;
  uploadedBy?: string;
  alt?: string;
  caption?: string;
}

export interface PageBlock {
  id: string;
  type: string;
  data: Record<string, unknown>;
  order: number;
}

export interface Page {
  id: string;
  title: { en: string; ar: string };
  slug: { en: string; ar: string };
  description: { en: string; ar: string };
  blocks: PageBlock[];
  seo: {
    metaTitle: { en: string; ar: string };
    metaDescription: { en: string; ar: string };
    keywords: string[];
  };
  status: 'draft' | 'published';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  siteName: { en: string; ar: string };
  siteDescription: { en: string; ar: string };
  contactEmail: string;
  contactPhone: string;
  address: { en: string; ar: string };
  socialMedia: {
    instagram: string;
    facebook: string;
    linkedin: string;
    twitter: string;
  };
  seo: {
    defaultTitle: { en: string; ar: string };
    defaultDescription: { en: string; ar: string };
    keywords: { en: string[]; ar: string[] };
  };
  appearance: {
    primaryColor: string;
    logo: string;
    favicon: string;
  };
  updatedAt: string;
}

export interface Advertisement {
  id: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  image: string;
  videoUrl?: string;
  linkUrl: string;
  ctaText: { en: string; ar: string };
  zone: 'header' | 'sidebar' | 'footer' | 'inline' | 'popup' | 'banner';
  type: 'image' | 'video' | 'html';
  htmlContent?: { en: string; ar: string };
  startDate: string;
  endDate: string;
  alwaysActive: boolean;
  pages: string[]; // Empty array means show on all pages
  showOnAllPages: boolean;
  priority: number; // 1-10, higher = more priority
  clickCount: number;
  impressionCount: number;
  maxImpressions?: number;
  active: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

class Database {
  private getFilePath(collection: string): string {
    return path.join(DB_DIR, `${collection}.json`);
  }

  private readCollection<T>(collection: string): T[] {
    const filePath = this.getFilePath(collection);
    try {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error(`Error reading ${collection}:`, error);
      return [];
    }
  }

  private writeCollection<T>(collection: string, data: T[]): void {
    const filePath = this.getFilePath(collection);
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error writing ${collection}:`, error);
      throw error;
    }
  }

  private readSettings(): SiteSettings | null {
    const filePath = this.getFilePath('settings');
    try {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error('Error reading settings:', error);
      return null;
    }
  }

  private writeSettings(settings: SiteSettings): void {
    const filePath = this.getFilePath('settings');
    try {
      fs.writeFileSync(filePath, JSON.stringify(settings, null, 2));
    } catch (error) {
      console.error('Error writing settings:', error);
      throw error;
    }
  }

  // Projects
  getProjects(): Project[] {
    return this.readCollection<Project>('projects');
  }

  createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const projects = this.getProjects();
    const newProject: Project = {
      ...project,
      id: generateUniqueId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    projects.push(newProject);
    this.writeCollection('projects', projects);
    return newProject;
  }

  updateProject(id: string, updates: Partial<Project>): Project | null {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return null;

    projects[index] = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.writeCollection('projects', projects);
    return projects[index];
  }

  deleteProject(id: string): boolean {
    const projects = this.getProjects();
    const filteredProjects = projects.filter(p => p.id !== id);
    if (filteredProjects.length === projects.length) return false;
    this.writeCollection('projects', filteredProjects);
    return true;
  }

  // Services
  getServices(): Service[] {
    return this.readCollection<Service>('services');
  }

  createService(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Service {
    const services = this.getServices();
    const newService: Service = {
      ...service,
      id: generateUniqueId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    services.push(newService);
    this.writeCollection('services', services);
    return newService;
  }

  updateService(id: string, updates: Partial<Service>): Service | null {
    const services = this.getServices();
    const index = services.findIndex(s => s.id === id);
    if (index === -1) return null;

    services[index] = {
      ...services[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.writeCollection('services', services);
    return services[index];
  }

  deleteService(id: string): boolean {
    const services = this.getServices();
    const filteredServices = services.filter(s => s.id !== id);
    if (filteredServices.length === services.length) return false;
    this.writeCollection('services', filteredServices);
    return true;
  }

  // Blog Posts
  getBlogPosts(): BlogPost[] {
    return this.readCollection<BlogPost>('blog-posts');
  }

  createBlogPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): BlogPost {
    const posts = this.getBlogPosts();
    const newPost: BlogPost = {
      ...post,
      id: generateUniqueId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    posts.push(newPost);
    this.writeCollection('blog-posts', posts);
    return newPost;
  }

  updateBlogPost(id: string, updates: Partial<BlogPost>): BlogPost | null {
    const posts = this.getBlogPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) return null;

    posts[index] = {
      ...posts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.writeCollection('blog-posts', posts);
    return posts[index];
  }

  deleteBlogPost(id: string): boolean {
    const posts = this.getBlogPosts();
    const filteredPosts = posts.filter(p => p.id !== id);
    if (filteredPosts.length === posts.length) return false;
    this.writeCollection('blog-posts', filteredPosts);
    return true;
  }

  // Media Files
  getMediaFiles(): MediaFile[] {
    return this.readCollection<MediaFile>('media-files');
  }

  createMediaFile(file: Omit<MediaFile, 'id' | 'uploadedAt'>): MediaFile {
    const files = this.getMediaFiles();
    const newFile: MediaFile = {
      ...file,
      id: generateUniqueId(),
      uploadedAt: new Date().toISOString(),
    };
    files.push(newFile);
    this.writeCollection('media-files', files);
    return newFile;
  }

  updateMediaFile(id: string, updates: Partial<MediaFile>): MediaFile | null {
    const files = this.getMediaFiles();
    const fileIndex = files.findIndex(f => f.id === id);

    if (fileIndex === -1) {
      return null;
    }

    const updatedFile = { ...files[fileIndex], ...updates };
    files[fileIndex] = updatedFile;
    this.writeCollection('media-files', files);
    return updatedFile;
  }

  deleteMediaFile(id: string): boolean {
    const files = this.getMediaFiles();
    const filteredFiles = files.filter(f => f.id !== id);
    if (filteredFiles.length === files.length) return false;
    this.writeCollection('media-files', filteredFiles);
    return true;
  }

  deleteMediaFiles(ids: string[]): boolean {
    const files = this.getMediaFiles();
    const filteredFiles = files.filter(f => !ids.includes(f.id));
    this.writeCollection('media-files', filteredFiles);
    return true;
  }

  // Settings
  getSettings(): SiteSettings {
    const settings = this.readSettings();
    if (settings) return settings;

    // Return default settings
    const defaultSettings: SiteSettings = {
      siteName: {
        en: 'Mouhajer International Design',
        ar: 'مهاجر الدولية للتصميم'
      },
      siteDescription: {
        en: 'Premier luxury interior design company in Dubai, UAE',
        ar: 'شركة التصميم الداخلي الفاخر الرائدة في دبي، الإمارات العربية المتحدة'
      },
      contactEmail: 'info@mouhajerdesign.com',
      contactPhone: '+971 4 123 4567',
      address: {
        en: 'Dubai Design District, Dubai, UAE',
        ar: 'حي دبي للتصميم، دبي، الإمارات العربية المتحدة'
      },
      socialMedia: {
        instagram: 'https://instagram.com/mouhajerdesign',
        facebook: 'https://facebook.com/mouhajerdesign',
        linkedin: 'https://linkedin.com/company/mouhajerdesign',
        twitter: 'https://twitter.com/mouhajerdesign'
      },
      seo: {
        defaultTitle: {
          en: 'Luxury Interior Design Dubai | Mouhajer International Design',
          ar: 'تصميم داخلي فاخر دبي | مهاجر الدولية للتصميم'
        },
        defaultDescription: {
          en: 'Award-winning luxury interior design company in Dubai. Transform your villa, apartment, or commercial space with our expert designers.',
          ar: 'شركة التصميم الداخلي الفاخر الحائزة على جوائز في دبي. حول الفيلا أو الشقة أو المساحة التجارية مع مصممينا الخبراء.'
        },
        keywords: {
          en: ['interior design Dubai', 'luxury design UAE', 'villa design', 'commercial design'],
          ar: ['تصميم داخلي دبي', 'تصميم فاخر الإمارات', 'تصميم فيلا', 'تصميم تجاري']
        }
      },
      appearance: {
        primaryColor: '#2563eb',
        logo: '/images/logo.png',
        favicon: '/images/favicon.ico'
      },
      updatedAt: new Date().toISOString(),
    };

    this.writeSettings(defaultSettings);
    return defaultSettings;
  }

  updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    const currentSettings = this.getSettings();
    const updatedSettings: SiteSettings = {
      ...currentSettings,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.writeSettings(updatedSettings);
    return updatedSettings;
  }

  // Pages
  getPages(): Page[] {
    return this.readCollection<Page>('pages');
  }

  getPageById(id: string): Page | null {
    const pages = this.getPages();
    return pages.find(p => p.id === id) || null;
  }

  getPageBySlug(slug: string, locale: 'en' | 'ar' = 'en'): Page | null {
    const pages = this.getPages();
    return pages.find(p => p.slug[locale] === slug) || null;
  }

  createPage(page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>): Page {
    const pages = this.getPages();
    const newPage: Page = {
      ...page,
      id: generateUniqueId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    pages.push(newPage);
    this.writeCollection('pages', pages);
    return newPage;
  }

  updatePage(id: string, updates: Partial<Page>): Page | null {
    const pages = this.getPages();
    const index = pages.findIndex(p => p.id === id);
    if (index === -1) return null;

    pages[index] = {
      ...pages[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.writeCollection('pages', pages);
    return pages[index];
  }

  deletePage(id: string): boolean {
    const pages = this.getPages();
    const filteredPages = pages.filter(p => p.id !== id);
    if (filteredPages.length === pages.length) return false;
    this.writeCollection('pages', filteredPages);
    return true;
  }

  // Advertisements
  getAds(): Advertisement[] {
    return this.readCollection<Advertisement>('advertisements');
  }

  getAdById(id: string): Advertisement | null {
    const ads = this.getAds();
    return ads.find(ad => ad.id === id) || null;
  }

  createAd(ad: Omit<Advertisement, 'id' | 'createdAt' | 'updatedAt' | 'clickCount' | 'impressionCount'>): Advertisement {
    const ads = this.getAds();
    const newAd: Advertisement = {
      ...ad,
      id: generateUniqueId(),
      clickCount: 0,
      impressionCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    ads.push(newAd);
    this.writeCollection('advertisements', ads);
    return newAd;
  }

  updateAd(id: string, updates: Partial<Advertisement>): Advertisement | null {
    const ads = this.getAds();
    const index = ads.findIndex(ad => ad.id === id);
    if (index === -1) return null;

    ads[index] = {
      ...ads[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.writeCollection('advertisements', ads);
    return ads[index];
  }

  deleteAd(id: string): boolean {
    const ads = this.getAds();
    const filteredAds = ads.filter(ad => ad.id !== id);
    if (filteredAds.length === ads.length) return false;
    this.writeCollection('advertisements', filteredAds);
    return true;
  }

  trackAdImpression(id: string): Advertisement | null {
    const ads = this.getAds();
    const index = ads.findIndex(ad => ad.id === id);
    if (index === -1) return null;

    ads[index] = {
      ...ads[index],
      impressionCount: ads[index].impressionCount + 1,
      updatedAt: new Date().toISOString(),
    };

    // Auto-disable if max impressions reached
    if (ads[index].maxImpressions && ads[index].impressionCount >= ads[index].maxImpressions) {
      ads[index].active = false;
    }

    this.writeCollection('advertisements', ads);
    return ads[index];
  }

  trackAdClick(id: string): Advertisement | null {
    const ads = this.getAds();
    const index = ads.findIndex(ad => ad.id === id);
    if (index === -1) return null;

    ads[index] = {
      ...ads[index],
      clickCount: ads[index].clickCount + 1,
      updatedAt: new Date().toISOString(),
    };

    this.writeCollection('advertisements', ads);
    return ads[index];
  }
}

export const db = new Database();