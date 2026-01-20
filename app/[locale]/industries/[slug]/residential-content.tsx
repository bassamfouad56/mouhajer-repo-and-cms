'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight,
  ArrowRight,
  Shield,
  Lock,
  Eye,
  Home,
  Building2,
  Sofa,
  Sparkles,
  Award,
  Phone,
  Download,
} from 'lucide-react';
import { FAQSection } from '@/components/sections/faq';

export default function ResidentialContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);

  const faqs = [
    {
      question: "Do I need to hire a separate architect and contractor?",
      answer: "No, and we advise against it. Hiring separate entities often leads to conflict and delays. With MIDC, you have a single contract. We design the villa, we engineer it, and we build it. If a design detail is expensive, we tell you immediately, not after construction starts."
    },
    {
      question: "My villa is in a gated community (District One). Can you work there?",
      answer: "Yes. We are pre-qualified to work in Dubai's most exclusive gated communities, including District One, Jumeirah Bay, and Emirates Hills. We handle all the specific logistics, gate passes, and developer approvals (Meydan, Meraas, Nakheel) so you don't have to."
    },
    {
      question: "How do you ensure my privacy?",
      answer: "Privacy is our default setting. We sign strict Non-Disclosure Agreements (NDAs). Your home's location, floor plans, and photos are never shared publicly without your explicit written permission. Our site teams are vetted and trained in discretion."
    }
  ];

  const capabilities = [
    {
      icon: Home,
      title: "Turnkey Villa Construction",
      description: "From the first pile in the ground to the final landscaped garden.",
      reference: "Ref: District One, Jumeirah Bay"
    },
    {
      icon: Building2,
      title: "Penthouse Fit-Out",
      description: "Managing the logistics of working in high-rise towers.",
      reference: "Ref: Address Boulevard Fendi Penthouse"
    },
    {
      icon: Sofa,
      title: "Bespoke Manufacturing",
      description: "We do not buy furniture; we make it. Our factory creates custom walk-in wardrobes, vanity units, and loose furniture tailored to your taste."
    },
    {
      icon: Sparkles,
      title: 'The "Uncluttered Baroque"',
      description: "A design style that blends the opulence of your heritage with the comfort of modern living."
    }
  ];

  return (
    <main className="relative bg-white">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[85vh] overflow-hidden lg:min-h-[90vh]"
      >
        {/* Background Image with Parallax */}
        <motion.div
          style={{ y }}
          className="absolute inset-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075"
            alt="Luxury Villa at Dusk - Jumeirah Bay"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/30" />
        </motion.div>

        <motion.div style={{ opacity }} className="relative z-10 flex min-h-[85vh] flex-col justify-end px-6 pb-20 pt-32 lg:min-h-[90vh] lg:px-12 lg:pb-32">
          <div className="mx-auto w-full max-w-[1400px]">
            {/* Breadcrumbs */}
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-8 flex items-center gap-2 text-sm font-light text-neutral-300"
            >
              <Link href="/" className="transition-colors hover:text-white">Home</Link>
              <ChevronRight size={16} />
              <Link href="/industries" className="transition-colors hover:text-white">Industries</Link>
              <ChevronRight size={16} />
              <span className="text-white">Residential</span>
            </motion.nav>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-6 text-5xl font-light tracking-tight text-white lg:text-8xl"
            >
              Private Sanctuaries.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl text-xl font-light leading-relaxed text-neutral-200 lg:text-2xl"
            >
              A home designed for your status. Built for your peace.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Section 1: Absolute Discretion */}
      <section className="relative bg-neutral-950 px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Left: Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="mb-8 text-4xl font-light tracking-tight text-white lg:text-5xl">
                  Absolute Discretion.
                </h2>
                <p className="mb-10 text-lg font-light leading-relaxed text-neutral-300">
                  For over 25 years, Eng. Maher Mouhajer has been the secret architect behind some of the region&apos;s most exclusive addresses. We understand that for our VIP clients, privacy is the ultimate luxury.
                </p>
              </motion.div>

              {/* Features */}
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="flex gap-6"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-light text-white">White-Glove Service</h3>
                    <p className="text-base font-light text-neutral-400">
                      You deal directly with Eng. Maher and a dedicated Senior Project Manager.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex gap-6"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-light text-white">Privacy Protocols</h3>
                    <p className="text-base font-light text-neutral-400">
                      We have strict NDA protocols. No photos of your home are published without your explicit permission.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex gap-6"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-light text-white">Security Integration</h3>
                    <p className="text-base font-light text-neutral-400">
                      We integrate advanced security systems (CCTV, Biometrics) into the architectural design seamlessly.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right: Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/5] overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070"
                alt="Luxury Villa Interior"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/50 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: Our Residential Capabilities */}
      <section className="relative bg-white px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-6 text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
              Our Residential Capabilities
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {capabilities.map((capability, index) => (
              <motion.div
                key={capability.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group border border-neutral-200 p-8 transition-all hover:border-neutral-950 hover:shadow-lg"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-neutral-200 transition-all group-hover:border-neutral-950 group-hover:bg-neutral-950">
                  <capability.icon className="h-6 w-6 text-neutral-600 transition-colors group-hover:text-white" />
                </div>
                <h3 className="mb-3 text-2xl font-light tracking-tight text-neutral-950">
                  {capability.title}
                </h3>
                <p className="mb-2 text-base font-light leading-relaxed text-neutral-600">
                  {capability.description}
                </p>
                {capability.reference && (
                  <p className="text-sm font-light italic text-neutral-400">
                    {capability.reference}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Case Study - The Penthouse */}
      <section className="relative bg-neutral-50 px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: Image with Award Badge */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053"
                  alt="Boulevard Penthouse 70-71"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Award Badge */}
              <div className="absolute -bottom-6 -right-6 flex items-center gap-3 bg-neutral-950 px-6 py-4 shadow-xl lg:-right-8">
                <Award className="h-8 w-8 text-amber-400" />
                <div>
                  <p className="text-xs font-light uppercase tracking-wider text-neutral-400">5-Star Award</p>
                  <p className="text-sm font-medium text-white">Best Residential Interior</p>
                  <p className="text-xs font-light text-neutral-400">Dubai</p>
                </div>
              </div>
            </motion.div>

            {/* Right: Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-center lg:pl-8"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-8 bg-neutral-400" />
                <span className="text-sm font-light uppercase tracking-widest text-neutral-500">Case Study</span>
              </div>
              <h2 className="mb-6 text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                The Penthouse
              </h2>

              <div className="mb-8 space-y-4">
                <div>
                  <span className="text-sm font-medium uppercase tracking-wider text-neutral-500">Project</span>
                  <p className="text-lg font-light text-neutral-950">Boulevard Penthouse 70-71</p>
                </div>
                <div>
                  <span className="text-sm font-medium uppercase tracking-wider text-neutral-500">Scope</span>
                  <p className="text-lg font-light text-neutral-950">Design & Build of a duplex penthouse</p>
                </div>
                <div>
                  <span className="text-sm font-medium uppercase tracking-wider text-neutral-500">Challenge</span>
                  <p className="text-lg font-light text-neutral-950">Working on the 70th floor of a live hotel tower</p>
                </div>
                <div>
                  <span className="text-sm font-medium uppercase tracking-wider text-neutral-500">Outcome</span>
                  <p className="text-lg font-light text-neutral-950">
                    A 5-Star Award Winner for Best Residential Interior, featuring Fendi-inspired joinery and smart home integration.
                  </p>
                </div>
              </div>

              <Link
                href="/projects?filter=residential"
                className="group inline-flex items-center gap-3 text-sm font-light uppercase tracking-widest text-neutral-950 transition-colors hover:text-neutral-600"
              >
                <span>View All Residential Case Studies</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 4: FAQ - Addressing Your Vision */}
      <FAQSection
        label="Expert Guidance"
        title="Addressing"
        titleHighlight="Your Vision."
        subtitle="Professional guidance for private homeowners."
        faqs={faqs}
        variant="light"
        showCTA={false}
      />

      {/* Section 5: CTA - Commission Your Masterpiece */}
      <section className="relative bg-neutral-950 px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[900px] text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="mb-12 text-4xl font-light tracking-tight text-white lg:text-6xl">
              Commission Your Masterpiece.
            </h2>

            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 border border-white bg-white px-8 py-4 text-sm font-light uppercase tracking-widest text-neutral-950 transition-all hover:bg-transparent hover:text-white"
              >
                <Phone className="h-4 w-4" />
                <span>Request Private Consultation</span>
              </Link>
              <Link
                href="/downloads/midc-residential-profile.pdf"
                className="group inline-flex items-center gap-3 border border-white/30 px-8 py-4 text-sm font-light uppercase tracking-widest text-white transition-all hover:border-white hover:bg-white hover:text-neutral-950"
              >
                <Download className="h-4 w-4" />
                <span>Download Residential Profile</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
