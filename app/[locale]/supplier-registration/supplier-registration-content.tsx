'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2, ChevronDown, Upload, Building2, Package, Shield, FileText, Clock, AlertTriangle, Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// FAQ Data for Procurement Protocols
const procurementFAQs = [
  {
    question: 'How long does the approval process take?',
    answer: 'Our Procurement Department reviews PQQ submissions on a weekly basis. If your profile matches our current requirements, you will be contacted within 10 working days for a formal audit.',
  },
  {
    question: 'Do you require samples?',
    answer: 'Yes. If you are pre-qualified, the next step is often a physical sample submission to our Burj Vista HQ for inspection by our Design Team.',
  },
  {
    question: 'Do you accept international suppliers?',
    answer: 'Yes. We regularly source directly from Italy, Turkey, China, and the UK for our luxury projects. However, international suppliers must demonstrate robust logistics capabilities to handle shipping to Dubai, Doha, or Syria.',
  },
];

// Supplier categories
const supplierTypes = [
  { id: 'manufacturer', label: 'Manufacturer (Direct)' },
  { id: 'distributor', label: 'Authorized Distributor' },
  { id: 'service-provider', label: 'Service Provider / Sub-Contractor' },
];

const primaryCategories = [
  { id: 'civil', label: 'Civil Materials (Concrete/Steel)' },
  { id: 'interior', label: 'Interior Finishes (Stone/Wood/Fabric)' },
  { id: 'mep', label: 'MEP Equipment' },
  { id: 'logistics', label: 'Logistics & Transport' },
  { id: 'other', label: 'Other' },
];

const certifications = [
  { id: 'iso9001', label: 'ISO 9001 (Quality)' },
  { id: 'iso14001', label: 'ISO 14001 (Environment)' },
  { id: 'iso45001', label: 'ISO 45001 (Safety)' },
  { id: 'icv', label: 'ICV Certified (In-Country Value)' },
];

const turnoverRanges = [
  'Under AED 1 Million',
  'AED 1-5 Million',
  'AED 5-10 Million',
  'AED 10-50 Million',
  'AED 50-100 Million',
  'Over AED 100 Million',
];

interface FormData {
  // Part 1
  companyName: string;
  tradeLicense: string;
  hqLocation: string;
  website: string;
  contactPerson: string;
  email: string;
  phone: string;
  // Part 2
  supplierType: string;
  primaryCategory: string;
  otherCategory: string;
  annualTurnover: string;
  // Part 3
  certifications: string[];
  referenceProjects: string;
  // Part 4
  documents: File | null;
}

export default function SupplierRegistrationContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    tradeLicense: '',
    hqLocation: '',
    website: '',
    contactPerson: '',
    email: '',
    phone: '',
    supplierType: '',
    primaryCategory: '',
    otherCategory: '',
    annualTurnover: '',
    certifications: [],
    referenceProjects: '',
    documents: null,
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate form submission and email sending
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return <ThankYouPage />;
  }

  return (
    <main className="bg-neutral-950">
      {/* Hero Section */}
      <HeroSection />

      {/* Beyond the Transaction Section */}
      <BeyondTransactionSection />

      {/* Vendor Registration Form Section */}
      <VendorRegistrationForm
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Procurement Protocols FAQ Section */}
      <ProcurementProtocolsSection />
    </main>
  );
}

// Hero Section
function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });

  return (
    <section
      ref={heroRef}
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-32 pb-20"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute left-0 top-0 h-[600px] w-[600px] bg-[radial-gradient(ellipse_at_top_left,rgba(201,169,98,0.08)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-0 h-[600px] w-[600px] bg-[radial-gradient(ellipse_at_bottom_right,rgba(201,169,98,0.05)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a962]/50" />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-white/40">
              Supplier Registration
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a962]/50" />
          </div>
          <h1 className="font-SchnyderS text-5xl font-light tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
            Join Our Supply Chain.
          </h1>
          <p className="mx-auto mt-8 max-w-2xl font-Satoshi text-xl font-light leading-relaxed text-white/60 lg:text-2xl">
            We build the best.{' '}
            <span className="text-[#c9a962]">We expect the best.</span>
          </p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="h-12 w-px bg-gradient-to-b from-[#c9a962]/50 to-transparent" />
      </motion.div>
    </section>
  );
}

// Beyond the Transaction Section
function BeyondTransactionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const commitments = [
    {
      title: 'Traceability',
      description: 'You know exactly where your raw materials come from.',
    },
    {
      title: 'Timeliness',
      description: 'You understand that "Just-in-Time" is a rule, not a suggestion.',
    },
    {
      title: 'Quality',
      description: 'You operate under ISO 9001 standards or equivalent.',
    },
  ];

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 border-t border-white/5">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a962]/50" />
              <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-white/40">
                Our Philosophy
              </span>
            </div>
            <h2 className="font-SchnyderS text-4xl font-light text-white lg:text-5xl xl:text-6xl">
              Beyond the
              <br />
              <span className="text-white/30">Transaction.</span>
            </h2>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="font-Satoshi text-lg font-light leading-relaxed text-white/70">
              At MIDC, we do not view our suppliers as vendors; we view them as{' '}
              <span className="text-white">extensions of our own team</span>. Whether you are supplying
              Italian marble for a Ritz-Carlton renovation or architectural steel for a C1 Headquarter
              build, your product becomes part of our legacy.
            </p>
            <p className="mt-6 font-Satoshi text-base font-light text-white/50">
              We maintain a rigorous Pre-Qualification Process (PQQ). We are actively seeking partners
              who share our commitment to:
            </p>
          </motion.div>
        </div>

        {/* Commitment Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid gap-6 md:grid-cols-3"
        >
          {commitments.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="group border border-white/10 bg-white/[0.02] p-8 transition-all hover:border-[#c9a962]/30 hover:bg-[#c9a962]/5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center border border-[#c9a962]/30 bg-[#c9a962]/10">
                <CheckCircle2 className="h-6 w-6 text-[#c9a962]" strokeWidth={1.5} />
              </div>
              <h3 className="mb-3 font-SchnyderS text-2xl font-light text-white">
                {item.title}
              </h3>
              <p className="font-Satoshi text-sm font-light leading-relaxed text-white/60">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Vendor Registration Form Component
interface VendorRegistrationFormProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

function VendorRegistrationForm({
  currentStep,
  setCurrentStep,
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
}: VendorRegistrationFormProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [fileName, setFileName] = useState<string>('');

  const steps = [
    { number: 1, title: 'Company Profile', icon: Building2 },
    { number: 2, title: 'Category & Capacity', icon: Package },
    { number: 3, title: 'Compliance & Quality', icon: Shield },
    { number: 4, title: 'Document Upload', icon: FileText },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, documents: file });
      setFileName(file.name);
    }
  };

  const handleCertificationChange = (certId: string) => {
    const newCerts = formData.certifications.includes(certId)
      ? formData.certifications.filter(c => c !== certId)
      : [...formData.certifications, certId];
    setFormData({ ...formData, certifications: newCerts });
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 border-t border-white/5">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="font-SchnyderS text-4xl font-light text-white lg:text-5xl">
            Vendor Registration Application
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-Satoshi text-base font-light text-white/60">
            Please complete all fields to be considered for our Approved Vendor List (AVL).
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center border transition-all ${
                      currentStep >= step.number
                        ? 'border-[#c9a962] bg-[#c9a962]/10 text-[#c9a962]'
                        : 'border-white/20 bg-white/[0.02] text-white/40'
                    }`}
                  >
                    <step.icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <span className="mt-2 hidden font-Satoshi text-xs font-light text-white/40 sm:block">
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-4 h-px w-12 sm:w-24 lg:w-32 transition-all ${
                      currentStep > step.number ? 'bg-[#c9a962]' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="border border-white/10 bg-white/[0.02] p-8 lg:p-12"
        >
          <AnimatePresence mode="wait">
            {/* Part 1: Company Profile */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="mb-8 font-SchnyderS text-2xl font-light text-white">
                  Part 1: Company Profile
                </h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block font-Satoshi text-xs font-light uppercase tracking-wider text-white/40">
                      Registered Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full border border-white/10 bg-white/[0.02] px-4 py-3 font-Satoshi text-sm font-light text-white placeholder-white/30 transition-colors focus:border-[#c9a962]/50 focus:outline-none"
                      placeholder="Company Legal Name"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-Satoshi text-xs font-light uppercase tracking-wider text-white/40">
                      Trade License Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.tradeLicense}
                      onChange={e => setFormData({ ...formData, tradeLicense: e.target.value })}
                      className="w-full border border-white/10 bg-white/[0.02] px-4 py-3 font-Satoshi text-sm font-light text-white placeholder-white/30 transition-colors focus:border-[#c9a962]/50 focus:outline-none"
                      placeholder="License Number"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block font-Satoshi text-xs font-light uppercase tracking-wider text-white/40">
                      HQ Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.hqLocation}
                      onChange={e => setFormData({ ...formData, hqLocation: e.target.value })}
                      className="w-full border border-white/10 bg-white/[0.02] px-4 py-3 font-Satoshi text-sm font-light text-white placeholder-white/30 transition-colors focus:border-[#c9a962]/50 focus:outline-none"
                      placeholder="Country / City"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-Satoshi text-xs font-light uppercase tracking-wider text-white/40">
                      Company Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={e => setFormData({ ...formData, website: e.target.value })}
                      className="w-full border border-white/10 bg-white/[0.02] px-4 py-3 font-Satoshi text-sm font-light text-white placeholder-white/30 transition-colors focus:border-[#c9a962]/50 focus:outline-none"
                      placeholder="https://www.company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-Satoshi text-xs font-light uppercase tracking-wider text-white/40">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full border border-white/10 bg-white/[0.02] px-4 py-3 font-Satoshi text-sm font-light text-white placeholder-white/30 transition-colors focus:border-[#c9a962]/50 focus:outline-none"
                    placeholder="Name & Designation"
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block font-Satoshi text-xs font-light uppercase tracking-wider text-white/40">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border border-white/10 bg-white/[0.02] px-4 py-3 font-Satoshi text-sm font-light text-white placeholder-white/30 transition-colors focus:border-[#c9a962]/50 focus:outline-none"
                      placeholder="email@company.com"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-Satoshi text-xs font-light uppercase tracking-wider text-white/40">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full border border-white/10 bg-white/[0.02] px-4 py-3 font-Satoshi text-sm font-light text-white placeholder-white/30 transition-colors focus:border-[#c9a962]/50 focus:outline-none"
                      placeholder="+971 XX XXX XXXX"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Part 2: Category & Capacity */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <h3 className="mb-8 font-SchnyderS text-2xl font-light text-white">
                  Part 2: Category & Capacity
                </h3>

                <div>
                  <label className="mb-4 block font-Satoshi text-xs font-light uppercase tracking-wider text-white/40">
                    Supplier Type *
                  </label>
                  <div className="space-y-3">
                    {supplierTypes.map(type => (
                      <label
                        key={type.id}
                        className={`flex cursor-pointer items-center gap-4 border p-4 transition-all ${
                          formData.supplierType === type.id
                            ? 'border-[#c9a962]/50 bg-[#c9a962]/5'
                            : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                        }`}
                      >
                        <div
                          className={`flex h-5 w-5 items-center justify-center border ${
                            formData.supplierType === type.id
                              ? 'border-[#c9a962] bg-[#c9a962]'
                              : 'border-white/30'
                          }`}
                        >
                          {formData.supplierType === type.id && (
                            <CheckCircle2 className="h-3 w-3 text-neutral-950" strokeWidth={2} />
                          )}
                        </div>
                        <span className="font-Satoshi text-sm font-light text-white">{type.label}</span>
                        <input
                          type="radio"
                          name="supplierType"
                          value={type.id}
                          checked={formData.supplierType === type.id}
                          onChange={e => setFormData({ ...formData, supplierType: e.target.value })}
                          className="hidden"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-4 block font-Satoshi text-xs font-light uppercase tracking-wider text-white/40">
                    Primary Category *
                  </label>
                  <div className="space-y-3">
                    {primaryCategories.map(cat => (
                      <label
                        key={cat.id}
                        className={`flex cursor-pointer items-center gap-4 border p-4 transition-all ${
                          formData.primaryCategory === cat.id
                            ? 'border-[#c9a962]/50 bg-[#c9a962]/5'
                            : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                        }`}
                      >
                        <div
                          className={`flex h-5 w-5 items-center justify-center border ${
                            formData.primaryCategory === cat.id
                              ? 'border-[#c9a962] bg-[#c9a962]'
                              : 'border-white/30'
                          }`}
                        >
                          {formData.primaryCategory === cat.id && (
                            <CheckCircle2 className="h-3 w-3 text-neutral-950" strokeWidth={2} />
                          )}
                        </div>
                        <span className="font-Satoshi text-sm font-light text-white">{cat.label}</span>
                        <input
                          type="radio"
                          name="primaryCategory"
                          value={cat.id}
                          checked={formData.primaryCategory === cat.id}
                          onChange={e => setFormData({ ...formData, primaryCategory: e.target.value })}
                          className="hidden"
                        />
                      </label>
                    ))}
                  </div>
                  {formData.primaryCategory === 'other' && (
                    <input
                      type="text"
                      value={formData.otherCategory}
                      onChange={e => setFormData({ ...formData, otherCategory: e.target.value })}
                      className="mt-4 w-full border border-white/10 bg-white/[0.02] px-4 py-3 font-Satoshi text-sm font-light text-white placeholder-white/30 transition-colors focus:border-[#c9a962]/50 focus:outline-none"
                      placeholder="Please specify category"
                    />
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-Satoshi text-xs font-light uppercase tracking-wider text-white/40">
                    Annual Turnover (AED) *
                  </label>
                  <select
                    required
                    value={formData.annualTurnover}
                    onChange={e => setFormData({ ...formData, annualTurnover: e.target.value })}
                    className="w-full border border-white/10 bg-neutral-950 px-4 py-3 font-Satoshi text-sm font-light text-white transition-colors focus:border-[#c9a962]/50 focus:outline-none"
                  >
                    <option value="">Select Range</option>
                    {turnoverRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {/* Part 3: Compliance & Quality */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <h3 className="mb-8 font-SchnyderS text-2xl font-light text-white">
                  Part 3: Compliance & Quality
                </h3>

                <div>
                  <label className="mb-4 block font-Satoshi text-xs font-light uppercase tracking-wider text-white/40">
                    Certifications Held
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {certifications.map(cert => (
                      <label
                        key={cert.id}
                        className={`flex cursor-pointer items-center gap-4 border p-4 transition-all ${
                          formData.certifications.includes(cert.id)
                            ? 'border-[#c9a962]/50 bg-[#c9a962]/5'
                            : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                        }`}
                      >
                        <div
                          className={`flex h-5 w-5 items-center justify-center border ${
                            formData.certifications.includes(cert.id)
                              ? 'border-[#c9a962] bg-[#c9a962]'
                              : 'border-white/30'
                          }`}
                        >
                          {formData.certifications.includes(cert.id) && (
                            <CheckCircle2 className="h-3 w-3 text-neutral-950" strokeWidth={2} />
                          )}
                        </div>
                        <span className="font-Satoshi text-sm font-light text-white">{cert.label}</span>
                        <input
                          type="checkbox"
                          checked={formData.certifications.includes(cert.id)}
                          onChange={() => handleCertificationChange(cert.id)}
                          className="hidden"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-Satoshi text-xs font-light uppercase tracking-wider text-white/40">
                    Reference Projects *
                  </label>
                  <p className="mb-3 font-Satoshi text-xs font-light text-white/40">
                    List 3 major projects supplied in the last 5 years
                  </p>
                  <textarea
                    required
                    rows={6}
                    value={formData.referenceProjects}
                    onChange={e => setFormData({ ...formData, referenceProjects: e.target.value })}
                    className="w-full resize-none border border-white/10 bg-white/[0.02] px-4 py-3 font-Satoshi text-sm font-light text-white placeholder-white/30 transition-colors focus:border-[#c9a962]/50 focus:outline-none"
                    placeholder="1. Project Name - Client - Year&#10;2. Project Name - Client - Year&#10;3. Project Name - Client - Year"
                  />
                </div>
              </motion.div>
            )}

            {/* Part 4: Document Upload */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <h3 className="mb-8 font-SchnyderS text-2xl font-light text-white">
                  Part 4: Document Upload
                </h3>

                <div className="border border-dashed border-white/20 bg-white/[0.02] p-8 text-center">
                  <p className="mb-6 font-Satoshi text-sm font-light text-white/60">
                    Please upload a single PDF (Max 10MB) containing:
                  </p>
                  <ul className="mb-8 space-y-2 text-left inline-block">
                    {[
                      'Trade License Copy',
                      'TRN (Tax Registration) Certificate',
                      'Company Profile',
                      'ISO Certificates (if applicable)',
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-3 font-Satoshi text-sm font-light text-white/50">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#c9a962]" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <label className="group inline-flex cursor-pointer items-center gap-3 border border-[#c9a962]/30 bg-[#c9a962]/10 px-8 py-4 font-Satoshi text-sm font-light uppercase tracking-wider text-[#c9a962] transition-all hover:bg-[#c9a962]/20">
                    <Upload className="h-5 w-5" strokeWidth={1.5} />
                    {fileName || 'Choose File'}
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {fileName && (
                    <p className="mt-4 font-Satoshi text-xs font-light text-[#c9a962]">
                      Selected: {fileName}
                    </p>
                  )}
                </div>

                <div className="border border-[#c9a962]/20 bg-[#c9a962]/5 p-6">
                  <p className="font-Satoshi text-sm font-light text-white/70">
                    <span className="text-[#c9a962]">Important:</span> By submitting this application,
                    you confirm that all information provided is accurate and that you consent to MIDC
                    verifying the details with relevant authorities.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`group flex items-center gap-3 font-Satoshi text-sm font-light text-white/60 transition-all hover:text-white ${
                currentStep === 1 ? 'invisible' : ''
              }`}
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" strokeWidth={1.5} />
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="group flex items-center gap-3 border border-[#c9a962] bg-[#c9a962] px-8 py-4 font-Satoshi text-sm font-light uppercase tracking-wider text-neutral-950 transition-all hover:bg-transparent hover:text-[#c9a962]"
              >
                Next
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
              </button>
            ) : (
              <button
                type="button"
                onClick={onSubmit}
                disabled={isSubmitting}
                className="group flex items-center gap-3 border border-[#c9a962] bg-[#c9a962] px-8 py-4 font-Satoshi text-sm font-light uppercase tracking-wider text-neutral-950 transition-all hover:bg-transparent hover:text-[#c9a962] disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit for Pre-Qualification'}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Procurement Protocols FAQ Section
function ProcurementProtocolsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 border-t border-white/5">
      <div className="mx-auto max-w-[1000px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="font-SchnyderS text-4xl font-light text-white lg:text-5xl">
            Procurement Protocols
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4"
        >
          {procurementFAQs.map((faq, index) => (
            <div
              key={index}
              className="border border-white/10 bg-white/[0.02]"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <span className="pr-4 font-Satoshi text-base font-light text-white">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="h-5 w-5 text-[#c9a962]" strokeWidth={1.5} />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-white/5 px-6 pb-6 pt-4">
                      <p className="font-Satoshi text-sm font-light leading-relaxed text-white/60">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Thank You Page Component
function ThankYouPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true });

  const vettingSteps = [
    {
      days: 'Days 1-3',
      title: 'Initial Screen',
      description: 'We verify your Trade License and Tax Registration (TRN).',
    },
    {
      days: 'Days 4-7',
      title: 'Technical Review',
      description: 'Our engineers review your product specifications and previous project history.',
    },
    {
      days: 'Days 8-10',
      title: 'Compliance Audit',
      description: 'We check your ISO certifications and safety records.',
    },
    {
      days: 'Decision',
      title: 'Final Notification',
      description: 'You will receive a formal notification of your status (Approved / Rejected / More Info Required) via email.',
    },
  ];

  return (
    <main ref={sectionRef} className="min-h-screen bg-neutral-950">
      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950" />
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(201,169,98,0.1)_0%,transparent_70%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1000px] px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center border border-[#c9a962]/30 bg-[#c9a962]/10">
              <CheckCircle2 className="h-12 w-12 text-[#c9a962]" strokeWidth={1} />
            </div>
            <h1 className="font-SchnyderS text-5xl font-light tracking-tight text-white sm:text-6xl lg:text-7xl">
              Application Logged.
            </h1>
            <p className="mx-auto mt-6 max-w-xl font-Satoshi text-xl font-light text-white/60">
              Your pre-qualification data is now in our system.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Procurement Review Process Section */}
      <section className="py-24 lg:py-32 border-t border-white/5">
        <div className="mx-auto max-w-[1200px] px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="mb-4 font-SchnyderS text-3xl font-light text-white lg:text-4xl">
              Procurement Review Process
            </h2>
            <p className="font-Satoshi text-base font-light text-white/60">
              Thank you for your interest in partnering with Mouhajer International Design & Contracting.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-6 font-Satoshi text-xs font-light uppercase tracking-wider text-[#c9a962]"
          >
            Our Vetting Protocol
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {vettingSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="border border-white/10 bg-white/[0.02] p-6"
              >
                <div className="mb-4 inline-flex items-center gap-2 border border-[#c9a962]/30 bg-[#c9a962]/10 px-3 py-1">
                  <Clock className="h-3 w-3 text-[#c9a962]" strokeWidth={1.5} />
                  <span className="font-Satoshi text-xs font-light text-[#c9a962]">{step.days}</span>
                </div>
                <h3 className="mb-2 font-SchnyderS text-lg font-light text-white">{step.title}</h3>
                <p className="font-Satoshi text-sm font-light leading-relaxed text-white/50">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Warning Section */}
      <section className="py-24 lg:py-32 border-t border-white/5">
        <div className="mx-auto max-w-[800px] px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="border border-amber-500/20 bg-amber-500/5 p-8 lg:p-12"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 flex-shrink-0 text-amber-500" strokeWidth={1.5} />
              <div>
                <h3 className="mb-3 font-SchnyderS text-xl font-light text-white">
                  Do Not Submit Duplicate Requests
                </h3>
                <p className="font-Satoshi text-sm font-light leading-relaxed text-white/60">
                  Please do not re-submit your application or call the procurement desk regarding your
                  status during the review period. Multiple submissions may result in your application
                  being flagged as spam.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <Link
              href="/"
              className="group inline-flex items-center gap-3 border border-white/20 bg-white/[0.02] px-8 py-4 font-Satoshi text-sm font-light uppercase tracking-wider text-white transition-all hover:border-[#c9a962]/50 hover:bg-[#c9a962]/10 hover:text-[#c9a962]"
            >
              <Home className="h-4 w-4" strokeWidth={1.5} />
              Return to Homepage
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
