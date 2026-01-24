import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CinematicAwardsPage } from '@/components/awards/cinematic-awards-page';
import { client } from '@/sanity/lib/client';
import { awardsQuery } from '@/sanity/lib/queries';

// Use dynamic rendering to speed up build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Awards & Recognition | MIDC',
  description: 'MIDC has been recognized globally for excellence in luxury interior design and turnkey construction. View our awards from the International Property Awards and Luxury Lifestyle Awards.',
  openGraph: {
    title: 'Awards & Recognition | MIDC',
    description: 'Celebrating global recognition for excellence in luxury interior design and turnkey construction.',
  },
};

// Project images mapping for awards
const projectImages: Record<string, string> = {
  'Address Boulevard VIP Suite': '/website%202.0%20content/projects/hospitality/_DSC3629-HDR.jpg',
  'Address Boulevard Penthouse': '/website%202.0%20content/services/industries/highend%20residential/_MID0001-HDR-2.jpg',
  'Sheraton Abu Dhabi Hotel & Resort': '/website%202.0%20content/services/industries/luxury%20hospitality/_MID3940-HDR.jpg',
  'MIDC': '/website%202.0%20content/services/industries/commercial%20and%20corporate/_MID1004-HDR.jpg',
};

async function getAwards() {
  try {
    const awards = await client.fetch(awardsQuery);

    // Transform Sanity awards to component format
    const transformedAwards = (awards || []).map((award: any) => ({
      id: award._id,
      title: award.title || 'Award',
      project: award.projectName || 'MIDC Project',
      projectSlug: undefined,
      projectImage: projectImages[award.projectName] || '/website%202.0%20content/services/industries/commercial%20and%20corporate/_MID1004-HDR.jpg',
      year: award.year || new Date().getFullYear(),
      organization: award.organization || 'International Property Awards',
      level: award.level || '5-Star',
      certificate: award.certificatePath || '',
      description: award.description || award.subtitle || '',
    }));

    return transformedAwards;
  } catch (error) {
    console.error('Error fetching awards:', error);
    return [];
  }
}

export default async function AwardsPage() {
  const awards = await getAwards();

  return (
    <>
      <Header />
      <CinematicAwardsPage awards={awards} />
      <Footer />
    </>
  );
}
