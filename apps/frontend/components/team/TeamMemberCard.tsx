'use client';

import Image from 'next/image';
import { Mail, Phone, Linkedin, Twitter, Instagram } from 'lucide-react';

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

interface TeamMemberCardProps {
  member: TeamMember;
}

const getSocialIcon = (platform: string) => {
  const icons: { [key: string]: React.ReactNode } = {
    linkedin: <Linkedin className="w-5 h-5" />,
    twitter: <Twitter className="w-5 h-5" />,
    instagram: <Instagram className="w-5 h-5" />,
  };
  return icons[platform.toLowerCase()] || null;
};

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  const { name, role, bio, image, email, phone, socialProfiles } = member;

  return (
    <article className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-border">
      {/* Member Image */}
      <div className="relative h-80 bg-muted">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
            <span className="text-6xl font-bold text-primary">
              {name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Member Info */}
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{name}</h3>
        <p className="text-primary font-semibold mb-4">{role}</p>
        <p className="text-muted-foreground leading-relaxed mb-6">{bio}</p>

        {/* Contact & Social */}
        <div className="space-y-3">
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              aria-label={`Email ${name}`}
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
              <span>{email}</span>
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              aria-label={`Call ${name}`}
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              <span>{phone}</span>
            </a>
          )}

          {/* Social Profiles */}
          {socialProfiles && socialProfiles.length > 0 && (
            <div className="flex gap-3 pt-3 border-t border-border">
              {socialProfiles.map((profile) => (
                <a
                  key={profile.platform}
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={`${name}'s ${profile.platform} profile`}
                >
                  {getSocialIcon(profile.platform)}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
