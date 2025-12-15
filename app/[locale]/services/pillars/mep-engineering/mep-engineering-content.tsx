'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { SafeImage } from '@/components/safe-image';

// Professional minimalist SVG icons for MEP
const IconHVAC = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="12" width="40" height="24" rx="2" />
    <path d="M12 20h4M16 24h-4M12 28h4M32 20h4M36 24h-4M32 28h4" />
    <circle cx="24" cy="24" r="4" />
  </svg>
);

const IconElectrical = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M28 4L16 24h8l-4 20 16-24h-8z" />
  </svg>
);

const IconLighting = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 4v4M38 10l-3 3M44 24h-4M38 38l-3-3M24 44v-4M10 38l3-3M4 24h4M10 10l3 3" />
    <circle cx="24" cy="24" r="8" />
  </svg>
);

const IconPlumbing = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 4v12a8 8 0 0016 0V4" />
    <path d="M28 16v20" />
    <path d="M20 44h16" />
    <path d="M28 36v8" />
    <circle cx="28" cy="32" r="4" />
  </svg>
);

// Note: MEP partner brand logos should be added to public/mep folder
// Using placeholder text until images are available
const mepPartnerBrands = [
  { name: 'Daikin', alt: 'Daikin HVAC Systems' },
  { name: 'Carrier', alt: 'Carrier Air Conditioning' },
  { name: 'Trane', alt: 'Trane Commercial HVAC' },
  { name: 'Schneider Electric', alt: 'Schneider Electric' },
  { name: 'Siemens', alt: 'Siemens Building Technologies' },
  { name: 'ABB', alt: 'ABB Electrical Systems' },
  { name: 'Grundfos', alt: 'Grundfos Pumps' },
  { name: 'Grohe', alt: 'Grohe Plumbing' },
  { name: 'Legrand', alt: 'Legrand Electrical' },
  { name: 'Honeywell', alt: 'Honeywell Building Controls' },
  { name: 'Johnson Controls', alt: 'Johnson Controls' },
  { name: 'Lutron', alt: 'Lutron Lighting Control' },
];

export default function MEPEngineeringContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <main className="relative bg-white">
      {/* Hero */}
      <section ref={heroRef} className="relative h-screen min-h-[700px] max-h-[1000px] overflow-hidden bg-neutral-950">
        <div className="absolute inset-0">
          <SafeImage
            src="/projects/commercial-interior/17.jpg"
            alt="MEP Engineering excellence"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-neutral-950/70" />
          <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
        </div>
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-24 lg:px-12">
          <div className="mx-auto max-w-5xl text-center">
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={isHeroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, delay: 0.5 }} className="mb-8 font-SchnyderS text-5xl font-light leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
              The<br /><span className="text-[#d4af37]">Invisible Art</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 30 }} animate={isHeroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.7 }} className="mx-auto mb-12 max-w-3xl px-4 font-Satoshi text-lg font-light leading-relaxed text-white/70 sm:px-0 sm:text-xl">
              Perfect comfort. Zero noise. Absolute efficiency. The systems you don&apos;t see are just as important as the ones you do.
            </motion.p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={isHeroInView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 1.2 }} className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="flex flex-col items-center gap-2">
            <span className="font-Satoshi text-[10px] font-light tracking-[0.2em] text-white/50">DISCOVER OUR SYSTEMS</span>
            <ChevronDown className="h-4 w-4 text-white/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* Section 1 */}
      <Section1 />
      {/* Section 2 */}
      <Section2 />
      {/* Section 3 - Case Study */}
      <Section3 />
      {/* Section 4 - Partner Brands */}
      <Section4 />
      {/* Section 5 - Expert Insights */}
      <Section5 />
      {/* Section 6 - CTA */}
      <Section6 />
    </main>
  );
}

function Section1() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-32 sm:py-40 lg:py-48">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 xl:px-16">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="lg:col-span-12">
          <div className="mb-8"><div className="mb-2 h-px w-16 bg-neutral-900" /></div>
          <h2 className="mb-10 font-SchnyderS text-5xl font-light leading-[1.05] tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl">We Do Not Outsource<br /><span className="text-[#d4af37]">Critical Systems</span></h2>
          <div className="max-w-4xl space-y-6 font-Satoshi text-lg font-light leading-relaxed text-neutral-600 lg:text-xl">
            <p>Most luxury design firms rely on subcontractors for MEP (Mechanical, Electrical, Plumbing). <strong className="font-medium text-neutral-950">MIDC refuses to take that risk.</strong> We maintain a dedicated in-house MEP Division with over 30 specialized engineers.</p>
            <p><strong className="font-medium text-neutral-950">Why?</strong> Because a beautiful ceiling is ruined if the AC vent is placed incorrectly. A relaxing spa is ruined if the water pressure is low. By keeping MEP in-house, we integrate these systems perfectly into the architectural design.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Section2() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const capabilities = [
    { id: 1, icon: IconHVAC, title: 'HVAC Systems', subtitle: 'Climate Control', image: '/projects/commercial-interior/14.jpg', items: [
      { label: 'Load Calculation', desc: 'We calculate the precise cooling load for every room to ensure it stays at 21°C even in the August heat.' },
      { label: 'Noise Control', desc: 'We design ducting layouts that minimize airflow noise. You should feel the cool air, not hear it.' },
      { label: 'Aesthetic Integration', desc: 'We use linear slot diffusers and hidden vents that disappear into the joinery or gypsum ceiling.' }
    ]},
    { id: 2, icon: IconLighting, title: 'Electrical & Lighting Engineering', subtitle: '', image: '/projects/turnkey-design-fitout/_MID2491-HDR.jpg', items: [
      { label: 'Load Balancing', desc: 'We design robust power distribution boards (DBs) that can handle the heavy load of a modern luxury mansion without tripping.' },
      { label: 'Smart Home Automation', desc: 'We route the cabling for full home automation (KNX/Lutron) during the construction phase. This allows you to control lights, curtains, and AC from your phone.' },
      { label: 'Lighting Schematics', desc: 'We calculate the Lux levels to ensure every corner is perfectly lit, enhancing the texture of the wall finishes.' }
    ]},
    { id: 3, icon: IconPlumbing, title: 'Plumbing & Firefighting', subtitle: '', image: '/projects/commercial-interior/15.jpg', items: [
      { label: 'Water Systems', desc: 'We install high-pressure pumps and filtration systems to ensure hotel-quality showers in private residences.' },
      { label: 'Safety First', desc: 'We design and install comprehensive firefighting systems (sprinklers, smoke detectors) that comply strictly with Civil Defence regulations.' }
    ]}
  ];

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-neutral-50 py-32 sm:py-40 lg:py-48">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 xl:px-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="mb-20 text-center">
          <h2 className="font-SchnyderS text-5xl font-light leading-tight tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl">Our Engineering<br /><span className="text-[#d4af37]">Capabilities</span></h2>
        </motion.div>
        <div className="space-y-24 lg:space-y-32">
          {capabilities.map((cap, index) => {
            const IconComponent = cap.icon;
            const isEven = index % 2 === 0;
            return (
              <motion.div key={cap.id} initial={{ opacity: 0, y: 60 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }} className="group">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                  {/* Image */}
                  <div className={`relative lg:col-span-5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="relative aspect-4/3 overflow-hidden bg-neutral-100">
                      <SafeImage
                        src={cap.image}
                        alt={cap.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    {/* Icon badge */}
                    <div className="absolute -bottom-4 -right-4 flex h-16 w-16 items-center justify-center border border-neutral-200 bg-white text-[#d4af37] shadow-lg transition-all duration-300 group-hover:bg-[#d4af37] group-hover:text-white lg:h-20 lg:w-20">
                      <IconComponent />
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`flex flex-col justify-center lg:col-span-7 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <h3 className="mb-4 font-SchnyderS text-3xl font-light leading-tight text-neutral-950 transition-colors duration-300 group-hover:text-[#d4af37] lg:text-4xl">{cap.title}</h3>
                    {cap.subtitle && <p className="mb-8 font-Satoshi text-lg font-light italic text-neutral-500">{cap.subtitle}</p>}
                    <div className="space-y-6">
                      {cap.items.map((item, i) => (
                        <div key={i} className="border-l-2 border-[#d4af37] pl-6">
                          <div className="mb-2 font-Satoshi text-sm font-medium uppercase tracking-[0.2em] text-neutral-400">{item.label}</div>
                          <p className="font-Satoshi text-base font-light leading-relaxed text-neutral-700">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Section3() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-32 sm:py-40 lg:py-48">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="mb-16 text-center">
          <h2 className="mb-6 font-SchnyderS text-5xl font-light leading-tight tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl">Case Study:<br /><span className="text-[#d4af37]">MEP Renovation</span></h2>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="border border-neutral-200 bg-neutral-50 p-8 lg:p-12">
          <div className="mb-6 font-Satoshi text-sm font-medium uppercase tracking-[0.2em] text-neutral-400">Project</div>
          <h3 className="mb-4 font-SchnyderS text-3xl font-light text-neutral-950">Park Hyatt Dubai Creek</h3>
          <div className="mb-6"><strong className="font-medium text-neutral-950">Scope:</strong> Renovation of 24 Villas</div>
          <div className="mb-6"><strong className="font-medium text-neutral-950">Challenge:</strong> Retrofitting modern, energy-efficient cooling systems into existing villa structures without damaging the heritage aesthetic.</div>
          <div><strong className="font-medium text-neutral-950">Solution:</strong> Our MEP team redesigned the ducting routes to fit within the limited ceiling voids, upgrading the cooling capacity while remaining completely invisible to the guest.</div>
        </motion.div>
      </div>
    </section>
  );
}

function Section4() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true });
  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-neutral-50 py-32 sm:py-40 lg:py-48">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center">
          <h2 className="font-SchnyderS text-5xl font-light leading-tight tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl">MIDC<br /><span className="text-[#d4af37]">Partner Brands</span></h2>
          <p className="mt-8 font-Satoshi text-lg font-light text-neutral-600">World-class equipment brands used in our MEP installations</p>
        </motion.div>

        {/* Partner Brand Logos Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        >
          {mepPartnerBrands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.3 + index * 0.05,
              }}
              className="group relative flex aspect-3/2 items-center justify-center rounded-sm border border-neutral-200 bg-white p-4 transition-all duration-300 hover:border-[#d4af37]/30 hover:shadow-lg"
            >
              <span className="font-Satoshi text-sm font-medium text-neutral-400 transition-colors duration-300 group-hover:text-[#d4af37]">
                {brand.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center font-Satoshi text-sm font-light text-neutral-500"
        >
          We specify and install equipment from globally recognized manufacturers to ensure reliability and performance.
        </motion.p>
      </div>
    </section>
  );
}

function Section5() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const insights = [
    { question: 'Why is "In-House" MEP better than outsourcing?', answer: 'Coordination. When MEP is outsourced, you often end up with air conditioning units clashing with chandeliers or access panels ruining a beautiful ceiling. Because our MEP engineers sit next to our designers, we route the ducting around the design. The result is a system that is invisible and silent.' },
    { question: 'Can you integrate Smart Home systems?', answer: 'Yes. We specialize in Home Automation (KNX, Lutron, Crestron). We plan the cabling infrastructure during the shell-and-core phase. This allows you to control your lighting, climate, curtains, and security from a single tablet or phone, with no visible wires.' },
    { question: 'Do you do MEP for renovations?', answer: 'Absolutely. This is our specialty. For projects like the Sheraton Abu Dhabi, we surveyed the 30-year-old existing infrastructure and retrofitted modern, energy-efficient systems without damaging the heritage structure of the building.' }
  ];
  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-32 sm:py-40 lg:py-48">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="mb-20 text-center">
          <h2 className="mb-4 font-SchnyderS text-5xl font-light leading-tight tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl">Expert<br /><span className="text-[#d4af37]">Insights</span></h2>
          <p className="font-Satoshi text-lg font-light text-neutral-600">Professional guidance on the details that matter most to you.</p>
        </motion.div>
        <div className="space-y-8">
          {insights.map((insight, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: index * 0.1 }} className="border-b border-neutral-200 pb-8 last:border-b-0">
              <h3 className="mb-4 font-SchnyderS text-2xl font-light text-neutral-950 lg:text-3xl">{insight.question}</h3>
              <p className="font-Satoshi text-lg font-light leading-relaxed text-neutral-600">{insight.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Section6() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true });
  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-neutral-950 py-32 lg:py-40">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[80px_80px]" />
      <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-[#d4af37]/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-[#d4af37]/10 blur-[120px]" />
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 text-center lg:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
          <h2 className="mb-8 font-SchnyderS text-5xl font-light leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">Engineer<br /><span className="text-[#d4af37]">Your Asset</span></h2>
          <p className="mx-auto mb-12 max-w-3xl font-Satoshi text-lg font-light leading-relaxed text-white/70 lg:text-xl">Ensure your property runs as beautifully as it looks.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#contact" className="group inline-flex items-center gap-3 border border-[#d4af37] bg-[#d4af37] px-10 py-5 font-Satoshi text-sm font-light tracking-widest text-neutral-950 transition-all hover:bg-transparent hover:text-[#d4af37]">
              <span>CONSULT OUR ENGINEERS</span><ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
            </a>
            <a href="/about/company-profile" className="inline-flex items-center gap-3 border border-white/20 bg-white/5 px-10 py-5 font-Satoshi text-sm font-light tracking-widest text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10">
              <span>DOWNLOAD MIDC MEP PROFILE</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
