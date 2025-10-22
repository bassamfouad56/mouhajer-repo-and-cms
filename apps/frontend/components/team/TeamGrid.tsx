'use client';

import TeamMemberCard from './TeamMemberCard';

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

interface TeamGridProps {
  members: TeamMember[];
}

export default function TeamGrid({ members }: TeamGridProps) {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
