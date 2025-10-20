'use client';

interface SocialProfile {
  platform: string;
  url: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
  email?: string;
  phone?: string;
  socialProfiles?: SocialProfile[];
}

interface PersonSchemaProps {
  members: TeamMember[];
  organizationName: string;
  organizationUrl: string;
}

export default function PersonSchema({
  members,
  organizationName,
  organizationUrl,
}: PersonSchemaProps) {
  const schema = members.map((member) => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: member.name,
    jobTitle: member.role,
    description: member.bio,
    image: member.image || '',
    email: member.email || '',
    telephone: member.phone || '',
    worksFor: {
      '@type': 'Organization',
      name: organizationName,
      url: organizationUrl,
    },
    sameAs: member.socialProfiles?.map((profile) => profile.url) || [],
  }));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
