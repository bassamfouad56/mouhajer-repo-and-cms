'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { ArrowRight, Briefcase, Users, TrendingUp, Award, MapPin, Clock, DollarSign, ChevronRight, X } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';

/**
 * Careers Page - Award-winning luxury aesthetic
 * Features: 3D animations, massive typography, physics-based interactions
 */

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
}

const jobPositions: JobPosition[] = [
  {
    id: 'senior-architect',
    title: 'Senior Architect',
    department: 'Architecture',
    location: 'Dubai, UAE',
    type: 'Full-time',
    experience: '5+ years',
    description: 'Lead architectural projects from concept to completion, working with luxury residential and commercial clients across the UAE.',
    responsibilities: [
      'Lead design development for high-end residential and commercial projects',
      'Collaborate with clients to understand vision and requirements',
      'Manage project teams and coordinate with consultants',
      'Ensure design quality and adherence to regulations',
      'Present concepts and designs to clients and stakeholders',
    ],
    requirements: [
      "Bachelor's or Master's degree in Architecture",
      '5+ years of experience in luxury residential/commercial projects',
      'Proficiency in AutoCAD, Revit, SketchUp, and Adobe Creative Suite',
      'Strong portfolio demonstrating high-end design work',
      'Excellent communication and presentation skills',
      'UAE experience preferred',
    ],
    benefits: [
      'Competitive salary package',
      'Health insurance',
      'Annual performance bonuses',
      'Professional development opportunities',
      'Work on award-winning projects',
      'Collaborative studio environment',
    ],
  },
  {
    id: 'interior-designer',
    title: 'Interior Designer',
    department: 'Interior Design',
    location: 'Dubai, UAE',
    type: 'Full-time',
    experience: '3+ years',
    description: 'Create exceptional interior spaces for luxury residential, hospitality, and commercial projects with a focus on materiality and detail.',
    responsibilities: [
      'Develop interior design concepts and mood boards',
      'Select finishes, furniture, and FF&E specifications',
      'Create detailed design documentation and drawings',
      'Coordinate with contractors and suppliers',
      'Conduct site visits and quality inspections',
    ],
    requirements: [
      "Bachelor's degree in Interior Design or Architecture",
      '3+ years of experience in high-end interior design',
      'Strong skills in 3D visualization (3ds Max, V-Ray, or similar)',
      'Knowledge of FF&E specification and procurement',
      'Excellent taste in luxury finishes and materials',
      'Strong attention to detail',
    ],
    benefits: [
      'Competitive salary',
      'Health insurance coverage',
      'Creative freedom on projects',
      'Access to premium suppliers and showrooms',
      'Annual leave and flight tickets',
      'Growth opportunities',
    ],
  },
  {
    id: 'project-manager',
    title: 'Project Manager',
    department: 'Project Management',
    location: 'Dubai, UAE',
    type: 'Full-time',
    experience: '5+ years',
    description: 'Oversee project delivery from inception to handover, ensuring timelines, budgets, and quality standards are met for luxury developments.',
    responsibilities: [
      'Manage multiple projects simultaneously',
      'Coordinate with design teams, contractors, and clients',
      'Monitor project budgets and schedules',
      'Conduct regular site inspections',
      'Resolve project issues and conflicts',
      'Ensure quality control and compliance',
    ],
    requirements: [
      "Bachelor's degree in Architecture, Engineering, or Construction Management",
      '5+ years of project management experience in luxury fit-out',
      'PMP or similar certification preferred',
      'Strong knowledge of UAE building codes and regulations',
      'Excellent organizational and leadership skills',
      'Proficiency in MS Project or similar tools',
    ],
    benefits: [
      'Competitive package',
      'Health and life insurance',
      'Performance-based incentives',
      'Company vehicle or allowance',
      'Professional certifications sponsored',
      'Career advancement opportunities',
    ],
  },
  {
    id: 'junior-architect',
    title: 'Junior Architect',
    department: 'Architecture',
    location: 'Dubai, UAE',
    type: 'Full-time',
    experience: '1-3 years',
    description: 'Join our dynamic team as a Junior Architect and contribute to award-winning projects while developing your skills under experienced mentors.',
    responsibilities: [
      'Assist in developing architectural drawings and models',
      'Support senior architects in design development',
      'Prepare presentation materials and renderings',
      'Coordinate with consultants and contractors',
      'Conduct site surveys and measurements',
    ],
    requirements: [
      "Bachelor's degree in Architecture",
      '1-3 years of experience in architectural practice',
      'Proficiency in AutoCAD, Revit, and 3D modeling software',
      'Strong visualization and rendering skills',
      'Passion for luxury and high-end design',
      'Eagerness to learn and grow',
    ],
    benefits: [
      'Competitive entry-level salary',
      'Health insurance',
      'Mentorship from senior architects',
      'Exposure to luxury projects',
      'Skills development programs',
      'Annual leave',
    ],
  },
];

const benefits = [
  {
    icon: Award,
    title: 'Award-Winning Projects',
    description: 'Work on luxury projects recognized internationally for design excellence',
  },
  {
    icon: Users,
    title: 'Collaborative Culture',
    description: 'Join a talented team of architects and designers pushing creative boundaries',
  },
  {
    icon: TrendingUp,
    title: 'Career Growth',
    description: 'Clear progression paths with continuous learning and development opportunities',
  },
  {
    icon: Briefcase,
    title: 'Premium Clients',
    description: 'Collaborate with high-profile clients on prestigious residential and commercial projects',
  },
];

export default function CareersPageContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null);

  return (
    <>
      <Header />

      <div ref={containerRef} className="relative bg-white">
        {/* Hero Section */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950">
          {/* Animated Grid Background */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="h-full w-full"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                `,
                backgroundSize: '100px 100px',
              }}
            />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-6 py-32">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.6, 0.01, 0.05, 0.95] }}
              className="text-center"
            >
              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-6 flex items-center justify-center gap-4"
              >
                <div className="h-px w-12 bg-white/30" />
                <span className="text-xs font-light tracking-[0.3em] text-white/60">
                  JOIN OUR TEAM
                </span>
                <div className="h-px w-12 bg-white/30" />
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                style={{ y, opacity }}
                className="mb-8 text-7xl font-light leading-[0.9] tracking-tighter text-white sm:text-8xl lg:text-9xl"
              >
                Build Your
                <br />
                <span className="text-white/40">Career</span> With Us
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mx-auto mb-12 max-w-2xl text-lg font-light leading-relaxed text-white/70"
              >
                Join a team of passionate designers, architects, and innovators creating
                exceptional spaces across the UAE. We&apos;re looking for talented individuals
                who share our commitment to design excellence.
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <a
                  href="#positions"
                  className="group inline-flex items-center gap-3 border border-white px-8 py-4 text-sm font-light tracking-widest text-white transition-all hover:bg-white hover:text-neutral-950"
                >
                  VIEW OPEN POSITIONS
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-xs font-light tracking-widest text-white/40">SCROLL</span>
              <div className="h-12 w-px bg-gradient-to-b from-white/40 to-transparent" />
            </motion.div>
          </motion.div>
        </section>

        {/* Why Join Us Section */}
        <section className="relative py-32">
          <div className="mx-auto max-w-7xl px-6">
            {/* Section Title */}
            <SectionTitle title="Why Work With Us" />

            {/* Benefits Grid */}
            <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit, index) => (
                <BenefitCard key={index} benefit={benefit} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions Section */}
        <section id="positions" className="relative bg-neutral-50 py-32">
          <div className="mx-auto max-w-7xl px-6">
            {/* Section Title */}
            <SectionTitle title="Open Positions" dark />

            {/* Jobs List */}
            <div className="mt-20 space-y-4">
              {jobPositions.map((job, index) => (
                <JobCard key={job.id} job={job} index={index} onClick={() => setSelectedJob(job)} />
              ))}
            </div>
          </div>
        </section>

        {/* Culture Section */}
        <section className="relative py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
              {/* Left Column */}
              <div>
                <SectionTitle title="Our Culture" align="left" />
                <div className="mt-12 space-y-6 text-lg font-light leading-relaxed text-neutral-600">
                  <p>
                    At Mouhajer Design, we believe exceptional spaces are created by exceptional
                    people. Our studio culture is built on collaboration, creativity, and a
                    relentless pursuit of design excellence.
                  </p>
                  <p>
                    We foster an environment where ideas flourish, innovation thrives, and every
                    team member has the opportunity to make a meaningful impact on projects that
                    shape the urban landscape of the UAE.
                  </p>
                  <p>
                    With over 150 projects completed, including partnerships with Address Hotels
                    and numerous award-winning developments, our team works at the forefront of
                    luxury architecture and interior design.
                  </p>
                </div>
              </div>

              {/* Right Column - Stats */}
              <div className="flex items-center">
                <div className="grid w-full gap-8 sm:grid-cols-2">
                  <StatCard number="150+" label="Projects Delivered" />
                  <StatCard number="20+" label="Team Members" />
                  <StatCard number="10+" label="Years Experience" />
                  <StatCard number="5★" label="Client Rating" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Application CTA */}
        <section className="relative bg-neutral-950 py-32">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="mb-6 text-5xl font-light tracking-tight text-white lg:text-6xl">
                Don&apos;t See a Fit?
              </h2>
              <p className="mb-12 text-lg font-light leading-relaxed text-white/70">
                We&apos;re always looking for talented individuals. Send us your portfolio and
                CV—we&apos;d love to hear from you.
              </p>
              <a
                href="mailto:careers@mouhajerdesign.com"
                className="group inline-flex items-center gap-3 border border-white px-8 py-4 text-sm font-light tracking-widest text-white transition-all hover:bg-white hover:text-neutral-950"
              >
                SEND YOUR CV
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />

      {/* Job Detail Modal */}
      <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
    </>
  );
}

// Section Title Component
function SectionTitle({ title, dark = false, align = 'center' }: { title: string; dark?: boolean; align?: 'left' | 'center' }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className={align === 'center' ? 'text-center' : ''}
    >
      <h2 className={`text-5xl font-light tracking-tight lg:text-6xl ${dark ? 'text-neutral-950' : 'text-neutral-950'}`}>
        {title}
      </h2>
    </motion.div>
  );
}

// Benefit Card Component
function BenefitCard({ benefit, index }: { benefit: { icon: any; title: string; description: string }; index: number }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const Icon = benefit.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center border border-neutral-200 transition-colors group-hover:border-neutral-950">
        <Icon className="h-8 w-8 text-neutral-950" strokeWidth={1} />
      </div>
      <h3 className="mb-3 text-xl font-light tracking-tight text-neutral-950">
        {benefit.title}
      </h3>
      <p className="font-light leading-relaxed text-neutral-600">
        {benefit.description}
      </p>
    </motion.div>
  );
}

// Job Card Component
function JobCard({ job, index, onClick }: { job: JobPosition; index: number; onClick: () => void }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      onClick={onClick}
      className="group cursor-pointer border border-neutral-200 bg-white p-8 transition-all hover:border-neutral-950 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="text-xs font-light tracking-widest text-neutral-400">
              {job.department.toUpperCase()}
            </span>
            <span className="text-neutral-300">•</span>
            <div className="flex items-center gap-2 text-xs font-light text-neutral-500">
              <MapPin className="h-3 w-3" strokeWidth={1.5} />
              {job.location}
            </div>
            <span className="text-neutral-300">•</span>
            <div className="flex items-center gap-2 text-xs font-light text-neutral-500">
              <Clock className="h-3 w-3" strokeWidth={1.5} />
              {job.type}
            </div>
          </div>

          <h3 className="mb-2 text-2xl font-light tracking-tight text-neutral-950 transition-colors group-hover:text-neutral-700">
            {job.title}
          </h3>

          <p className="mb-4 font-light leading-relaxed text-neutral-600">
            {job.description}
          </p>

          <div className="text-sm font-light text-neutral-500">
            Experience: {job.experience}
          </div>
        </div>

        <ChevronRight className="h-6 w-6 flex-shrink-0 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-neutral-950" strokeWidth={1} />
      </div>
    </motion.div>
  );
}

// Stat Card Component
function StatCard({ number, label }: { number: string; label: string }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6 }}
      className="border border-neutral-200 p-8 text-center"
    >
      <div className="mb-3 text-5xl font-light tracking-tight text-neutral-950">
        {number}
      </div>
      <div className="text-sm font-light tracking-wider text-neutral-600">
        {label}
      </div>
    </motion.div>
  );
}

// Job Detail Modal Component
function JobDetailModal({ job, onClose }: { job: JobPosition | null; onClose: () => void }) {
  useEffect(() => {
    if (job) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [job]);

  return (
    <AnimatePresence>
      {job && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 z-50 max-h-[90vh] w-auto max-w-4xl -translate-y-1/2 overflow-y-auto bg-white p-8 shadow-2xl sm:inset-x-auto sm:left-1/2 sm:w-full sm:-translate-x-1/2 lg:p-12"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-6 top-6 text-neutral-400 transition-colors hover:text-neutral-950"
            >
              <X className="h-6 w-6" strokeWidth={1} />
            </button>

            {/* Header */}
            <div className="mb-8 border-b border-neutral-200 pb-8">
              <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-light tracking-widest text-neutral-400">
                <span>{job.department.toUpperCase()}</span>
                <span>•</span>
                <span>{job.location}</span>
                <span>•</span>
                <span>{job.type}</span>
              </div>

              <h2 className="mb-4 text-4xl font-light tracking-tight text-neutral-950">
                {job.title}
              </h2>

              <p className="text-lg font-light leading-relaxed text-neutral-600">
                {job.description}
              </p>
            </div>

            {/* Responsibilities */}
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-light tracking-tight text-neutral-950">
                Responsibilities
              </h3>
              <ul className="space-y-3">
                {job.responsibilities.map((item, index) => (
                  <li key={index} className="flex gap-3 font-light text-neutral-600">
                    <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-neutral-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-light tracking-tight text-neutral-950">
                Requirements
              </h3>
              <ul className="space-y-3">
                {job.requirements.map((item, index) => (
                  <li key={index} className="flex gap-3 font-light text-neutral-600">
                    <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-neutral-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-light tracking-tight text-neutral-950">
                Benefits
              </h3>
              <ul className="space-y-3">
                {job.benefits.map((item, index) => (
                  <li key={index} className="flex gap-3 font-light text-neutral-600">
                    <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-neutral-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Apply Button */}
            <div className="flex gap-4">
              <a
                href={`mailto:careers@mouhajerdesign.com?subject=Application for ${job.title}`}
                className="inline-flex flex-1 items-center justify-center gap-3 border border-neutral-950 bg-neutral-950 px-8 py-4 text-sm font-light tracking-widest text-white transition-all hover:bg-transparent hover:text-neutral-950"
              >
                APPLY FOR THIS POSITION
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
