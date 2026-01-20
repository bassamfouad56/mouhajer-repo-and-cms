import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import CommercialCorporateContent from './commercial-corporate-content';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';

// Use dynamic rendering to speed up build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Commercial & Corporate | MIDC - Defining Business Environments',
  description: 'Engineered for performance. Designed for the brand. MIDC delivers fast-track commercial fit-outs with in-house joinery and MEP teams.',
};

// Fetch commercial projects from Sanity
async function getCommercialData() {
  try {
    // Get commercial projects with images
    const projects = await client.fetch(`
      *[_type == 'project' && sector._ref == 'industry-commercial-corporate'] | order(yearCompleted desc) {
        _id,
        title,
        slug,
        excerpt,
        mainImage,
        gallery,
        client,
        yearCompleted,
        location
      }
    `);

    // Get all projects for section images (fallback)
    const allProjects = await client.fetch(`
      *[_type == 'project' && defined(mainImage)] | order(yearCompleted desc) [0...20] {
        _id,
        title,
        mainImage,
        gallery
      }
    `);

    // Get clients for logos
    const clients = await client.fetch(`
      *[_type == 'client' && defined(logo)] {
        _id,
        name,
        logo
      }
    `);

    // Helper to get image URL
    const getImageUrl = (image: any, width = 1920, height = 1080) => {
      if (!image?.asset) return null;
      try {
        return urlForImage(image).width(width).height(height).auto('format').url();
      } catch {
        return null;
      }
    };

    // Transform projects for the component
    const transformedProjects = projects.map((project: any) => ({
      id: project._id,
      slug: project.slug?.current || '',
      title: project.title?.en || project.title || '',
      titleAr: project.title?.ar || '',
      excerpt: project.excerpt?.en || project.excerpt || '',
      client: project.client?.en || project.client || '',
      year: project.yearCompleted,
      location: project.location?.en || project.location || '',
      mainImage: getImageUrl(project.mainImage, 1920, 1280),
      gallery: (project.gallery || []).slice(0, 6).map((img: any) => getImageUrl(img, 800, 600)).filter(Boolean),
    }));

    // Transform clients for logos
    const transformedClients = clients.map((c: any) => ({
      id: c._id,
      name: c.name?.en || c.name || '',
      logo: getImageUrl(c.logo, 200, 100),
    })).filter((c: any) => c.logo);

    // Get section images from all projects
    const allImages: string[] = [];
    allProjects.forEach((project: any) => {
      const mainImg = getImageUrl(project.mainImage, 1200, 900);
      if (mainImg) allImages.push(mainImg);
      (project.gallery || []).forEach((img: any) => {
        const galleryImg = getImageUrl(img, 1200, 900);
        if (galleryImg) allImages.push(galleryImg);
      });
    });

    // Create section images object with fallbacks
    const sectionImages = {
      timeIsRevenue: [
        allImages[0] || '/placeholder.jpg',
        allImages[1] || '/placeholder.jpg',
        allImages[2] || '/placeholder.jpg',
      ],
      capabilities: [
        allImages[3] || '/placeholder.jpg',
        allImages[4] || '/placeholder.jpg',
        allImages[5] || '/placeholder.jpg',
      ],
    };

    return {
      projects: transformedProjects,
      clients: transformedClients,
      heroImage: transformedProjects[0]?.mainImage || allImages[0] || '/placeholder.jpg',
      caseStudyProject: transformedProjects[0] || null,
      sectionImages,
    };
  } catch (error) {
    console.error('Error fetching commercial data:', error);
    return {
      projects: [],
      clients: [],
      heroImage: '/placeholder.jpg',
      caseStudyProject: null,
      sectionImages: {
        timeIsRevenue: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'],
        capabilities: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'],
      },
    };
  }
}

export default async function CommercialCorporatePage() {
  const data = await getCommercialData();

  return (
    <>
      <Header />
      <CommercialCorporateContent
        projects={data.projects}
        clients={data.clients}
        heroImage={data.heroImage}
        caseStudyProject={data.caseStudyProject}
        sectionImages={data.sectionImages}
      />
      <LogoMarquee clients={data.clients} />
      <Footer />
    </>
  );
}
