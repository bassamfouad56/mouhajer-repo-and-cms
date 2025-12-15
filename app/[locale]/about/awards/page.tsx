import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { AwardsHero } from '@/components/awards/awards-hero';
import { LuxuryAwardsShowcase } from '@/components/awards/luxury-awards-showcase';
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
function getAwardCertificatePath(title: string, year: number): string {
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
                .width(1200)
                .height(750)
                .auto('format')
                .url()
            : '/placeholder.jpg',
          year: award.year || new Date().getFullYear(),
          organization: award.organization || 'International Property Awards',
          level: award.level || '5-Star',
          certificate: getAwardCertificatePath(award.title || '', award.year || new Date().getFullYear()),
          description: award.subtitle || '',
        };
      })
    );

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
      <main className="relative">
        <AwardsHero />
        <LuxuryAwardsShowcase awards={awards} />
      </main>
      <Footer />
    </>
  );
}
