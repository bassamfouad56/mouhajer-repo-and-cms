import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import LuxuryHospitalityContent from './luxury-hospitality-content';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';

// Use dynamic rendering to speed up build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Luxury Hospitality | MIDC - The Art of the Live Renovation',
  description: 'Upgrading your asset while protecting your guest experience. MIDC specializes in Live Environment Renovations for 5-star hotels.',
};

// Fetch hospitality projects from Sanity
async function getHospitalityData() {
  try {
    // Get hospitality projects with images
    const projects = await client.fetch(`
      *[_type == 'project' && sector._ref == 'industry-luxury-hospitality'] | order(yearCompleted desc) {
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

    // Get hospitality clients for logos
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

    return {
      projects: transformedProjects,
      clients: transformedClients,
      heroImage: transformedProjects[0]?.mainImage || '/new/services/industries/luxury hospitality/MID3940-HDR.jpg',
      caseStudyProject: transformedProjects.find((p: any) => p.slug === 'sheraton-abu-dhabi-hotel-resort') || transformedProjects[0],
    };
  } catch (error) {
    console.error('Error fetching hospitality data:', error);
    return {
      projects: [],
      clients: [],
      heroImage: '/new/services/industries/luxury hospitality/MID3940-HDR.jpg',
      caseStudyProject: null,
    };
  }
}

export default async function LuxuryHospitalityPage() {
  const data = await getHospitalityData();

  return (
    <>
      <Header />
      <LuxuryHospitalityContent
        projects={data.projects}
        clients={data.clients}
        heroImage={data.heroImage}
        caseStudyProject={data.caseStudyProject}
      />
      <LogoMarquee clients={data.clients} />
      <Footer />
    </>
  );
}
