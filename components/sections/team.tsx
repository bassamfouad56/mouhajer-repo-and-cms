'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Linkedin, Mail } from 'lucide-react';

const teamMembers = [
  {
    id: 1,
    name: 'Mariam Mouhajer',
    role: 'Founder & Creative Director',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
    bio: 'With over 15 years of experience in luxury interior design, Mariam leads our creative vision and client relationships.',
    linkedin: '#',
    email: 'mariam@mouhajer.com',
  },
  {
    id: 2,
    name: 'Omar Al-Rashid',
    role: 'Lead Interior Designer',
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=600&q=80',
    bio: 'Omar brings innovative design solutions and technical expertise to every project, specializing in commercial spaces.',
    linkedin: '#',
    email: 'omar@mouhajer.com',
  },
  {
    id: 3,
    name: 'Fatima Al-Hassan',
    role: 'Senior Designer',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80',
    bio: 'Specializing in residential design, Fatima creates personalized spaces that reflect each client\'s unique lifestyle.',
    linkedin: '#',
    email: 'fatima@mouhajer.com',
  },
  {
    id: 4,
    name: 'Khalid Rahman',
    role: 'Project Manager',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80',
    bio: 'Khalid ensures seamless project execution, coordinating all aspects from concept to completion with precision.',
    linkedin: '#',
    email: 'khalid@mouhajer.com',
  },
];

export function Team() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      id="team"
      className="relative overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-neutral-50 px-6 py-32 lg:px-12 lg:py-48"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black,transparent)]" />
        <div className="absolute right-1/3 top-0 h-96 w-96 rounded-full bg-purple-100/30 blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 h-96 w-96 rounded-full bg-blue-100/30 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1800px]">
        {/* Section Header */}
        <div className="mb-24 text-center lg:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-6 flex items-center justify-center gap-4"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-neutral-400" />
            <span className="text-sm font-light tracking-[0.3em] text-neutral-500">
              OUR TEAM
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-neutral-400" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl font-light tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl"
          >
            Meet The Team
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg font-light leading-relaxed text-neutral-600"
          >
            Our talented team of designers, architects, and project managers work
            together to create extraordinary spaces
          </motion.p>
        </div>

        {/* Team Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={member.id} member={member} index={index} />
          ))}
        </div>

        {/* Join Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-24 lg:mt-32"
        >
          <div className="mb-12 h-px w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
          <div className="rounded-sm bg-neutral-950 p-12 text-center lg:p-16">
            <h3 className="mb-6 text-3xl font-light tracking-tight text-white lg:text-4xl">
              Join Our Team
            </h3>
            <p className="mx-auto mb-8 max-w-2xl text-base font-light leading-relaxed text-white/70 lg:text-lg">
              We&apos;re always looking for talented designers and creative minds to
              join our growing team. Be part of creating exceptional spaces.
            </p>
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 border-b border-white/40 pb-2 text-sm font-light tracking-widest text-white transition-all hover:gap-5 hover:border-white focus-visible:gap-5 focus-visible:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            >
              VIEW OPEN POSITIONS
              <span className="transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1">
                →
              </span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TeamMemberCard({
  member,
  index,
}: {
  member: (typeof teamMembers)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative overflow-hidden bg-white">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-200">
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Social links - appear on hover */}
          <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <motion.a
              href={member.linkedin}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </motion.a>
            <motion.a
              href={`mailto:${member.email}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              aria-label="Email"
            >
              <Mail size={20} />
            </motion.a>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="mb-2 text-xl font-light tracking-tight text-neutral-950 transition-colors duration-300 group-hover:text-neutral-600 lg:text-2xl">
            {member.name}
          </h3>
          <div className="mb-4 text-sm font-light tracking-wider text-neutral-500">
            {member.role}
          </div>
          <p className="text-sm font-light leading-relaxed text-neutral-600">
            {member.bio}
          </p>
        </div>

        {/* Bottom accent line */}
        <div className="h-1 w-0 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 transition-all duration-700 group-hover:w-full" />
      </div>
    </motion.div>
  );
}
