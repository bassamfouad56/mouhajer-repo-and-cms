import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CinematicAwardsPage } from '@/components/awards/cinematic-awards-page';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';

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

// Map award titles to actual PDF filenames in public/awards
function getAwardCertificatePath(title: string): string {
  const certificateMap: Record<string, string> = {
    // 2023-2024 Awards
    'Best Hotel Suite Interior Dubai': 'APA - 2023-2024 Best Hotel Suite Interior Dubai - Address Boulevard VIP Suite.pdf',
    'Best Hotel Suite Interior Arabia': 'APA - 2023-2024 Best Hotel Suite Interior Arabia - Address Boulevard VIP Suite.pdf',
    'Best Residential Interior Apartment Dubai': 'APA - 2023-2024 Best Residential Interior Apartment Dubai - Address Boulevard Penthouse 70-71.pdf',
    'Award Winner for Hotel Suite Dubai': 'APA - 2023-2024 Award Winner for Hotel Suite Dubai - Address Boulevard VIP Suite.pdf',
    'Award Winner for Residential Interior Apartment Dubai': 'APA - 2023-2024 Award Winner for Residential Interior Apartment Dubai - Address Boulevard Penthouse 70-71.pdf',

    // 2022-2023 Awards
    'Best Hotel Interior Abu Dhabi': 'APA - 2022-2023 Best Hotel Interior Abu Dhabi - Sheraton Abu Dhabi (2).pdf',

    // 2021 Awards
    'Certificate of Recognition': 'Luxury Lifestyle - 2021 Certificate of Recognition.pdf',
  };

  // Try to match by title
  const exactMatch = certificateMap[title];
  if (exactMatch) {
    return `/awards/${encodeURIComponent(exactMatch)}`;
  }

  // Try to find partial match
  for (const [key, filename] of Object.entries(certificateMap)) {
    if (title.includes(key) || key.includes(title)) {
      return `/awards/${encodeURIComponent(filename)}`;
    }
  }

  // Fallback to encoded title
  return `/awards/${encodeURIComponent(title)}.pdf`;
}

// Default awards to show when Sanity has no data
const defaultAwards = [
  {
    id: 'default-1',
    title: 'Best Hotel Suite Interior Dubai',
    project: 'Address Boulevard VIP Suite',
    projectSlug: 'address-boulevard-vip-suite',
    projectImage: '/website%202.0%20content/projects/hospitality/_DSC3629-HDR.jpg',
    year: 2024,
    organization: 'International Property Awards',
    level: '5-Star Winner',
    certificate: '/awards/APA - 2023-2024 Best Hotel Suite Interior Dubai - Address Boulevard VIP Suite.pdf',
    description: 'Recognized for exceptional luxury interior design in hospitality, showcasing bespoke craftsmanship and attention to detail.',
  },
  {
    id: 'default-2',
    title: 'Best Hotel Suite Interior Arabia',
    project: 'Address Boulevard VIP Suite',
    projectSlug: 'address-boulevard-vip-suite',
    projectImage: '/website%202.0%20content/projects/hospitality/_DSC3629-HDR.jpg',
    year: 2024,
    organization: 'International Property Awards',
    level: '5-Star Winner',
    certificate: '/awards/APA - 2023-2024 Best Hotel Suite Interior Arabia - Address Boulevard VIP Suite.pdf',
    description: 'Regional recognition for outstanding hotel suite design across Arabia, celebrating excellence in luxury hospitality.',
  },
  {
    id: 'default-3',
    title: 'Best Residential Interior Apartment Dubai',
    project: 'Address Boulevard Penthouse',
    projectSlug: 'address-boulevard-penthouse',
    projectImage: '/website%202.0%20content/services/industries/highend%20residential/_MID0001-HDR-2.jpg',
    year: 2024,
    organization: 'International Property Awards',
    level: '5-Star Winner',
    certificate: '/awards/APA - 2023-2024 Best Residential Interior Apartment Dubai - Address Boulevard Penthouse 70-71.pdf',
    description: 'Excellence in luxury residential interior design, featuring Fendi-inspired joinery and smart home integration.',
  },
  {
    id: 'default-4',
    title: 'Best Hotel Interior Abu Dhabi',
    project: 'Sheraton Abu Dhabi Hotel & Resort',
    projectSlug: 'sheraton-abu-dhabi',
    projectImage: '/website%202.0%20content/services/industries/luxury%20hospitality/_MID3940-HDR.jpg',
    year: 2023,
    organization: 'International Property Awards',
    level: '5-Star Winner',
    certificate: '/awards/APA - 2022-2023 Best Hotel Interior Abu Dhabi - Sheraton Abu Dhabi (2).pdf',
    description: 'Honored for exceptional full hotel interior renovation, delivered on time while maintaining guest operations.',
  },
  {
    id: 'default-5',
    title: 'Certificate of Recognition',
    project: 'MIDC Excellence',
    projectSlug: undefined,
    projectImage: '/website%202.0%20content/services/industries/commercial%20and%20corporate/_MID1004-HDR.jpg',
    year: 2021,
    organization: 'Luxury Lifestyle Awards',
    level: 'Winner',
    certificate: '/awards/Luxury Lifestyle - 2021 Certificate of Recognition.pdf',
    description: 'Recognition for excellence in luxury construction and design, honoring 25+ years of industry leadership.',
  },
];

async function getAwards() {
  try {
    const awards = await client.fetch(`
      *[_type == "award"] | order(year desc) {
        _id,
        title,
        organization,
        year,
        type,
        category,
        level,
        projectName,
        subtitle,
        featured
      }
    `);

    // If no awards in Sanity, return defaults
    if (!awards || awards.length === 0) {
      return defaultAwards;
    }

    // Transform awards with project data
    const transformedAwards = await Promise.all(
      awards.map(async (award: any) => {
        // Try to find matching project by name
        let project = null;
        if (award.projectName) {
          const projects = await client.fetch(
            `*[_type == "project" && title.en match "*" + $name + "*"][0] {
              _id,
              "title": title.en,
              slug,
              mainImage
            }`,
            { name: award.projectName }
          );
          project = projects;
        }

        return {
          id: award._id,
          title: award.title || 'Award',
          project: award.projectName || project?.title || 'MIDC Project',
          projectSlug: project?.slug?.current,
          projectImage: project?.mainImage
            ? urlForImage(project.mainImage)
                ?.width(1200)
                .height(750)
                .auto('format')
                .url() || '/placeholder.jpg'
            : '/placeholder.jpg',
          year: award.year || new Date().getFullYear(),
          organization: award.organization || 'International Property Awards',
          level: award.level || '5-Star',
          certificate: getAwardCertificatePath(award.title || ''),
          description: award.subtitle || '',
        };
      })
    );

    return transformedAwards;
  } catch (error) {
    console.error('Error fetching awards:', error);
    // Return defaults on error
    return defaultAwards;
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
