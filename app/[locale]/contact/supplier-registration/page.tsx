'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  Building2,
  ClipboardList,
  Award,
  FileText,
  X,
  ChevronDown,
  Globe,
  Truck,
  Package,
  Clock,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import { MagneticButton } from '@/components/magnetic-button';
import { SafeImage } from '@/components/safe-image';

// Form validation schema
const supplierSchema = z.object({
  // Part 1: Company Profile
  companyName: z.string().min(2, 'Company name is required'),
  tradeLicenseNumber: z.string().min(2, 'Trade license number is required'),
  hqCountry: z.string().min(1, 'Please select country'),
  hqCity: z.string().min(2, 'City is required'),
  website: z.string().url('Please enter a valid URL').or(z.string().length(0)).optional(),
  contactPerson: z.string().min(2, 'Contact person name is required'),
  contactDesignation: z.string().min(2, 'Designation is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number is required'),

  // Part 2: Category & Capacity
  supplierType: z.string().min(1, 'Please select supplier type'),
  primaryCategory: z.array(z.string()).min(1, 'Please select at least one category'),
  categoryOther: z.string().optional(),
  annualTurnover: z.string().min(1, 'Please select annual turnover'),

  // Part 3: Compliance & Quality
  certifications: z.array(z.string()).optional(),
  referenceProject1: z.string().min(2, 'Please provide at least one reference project'),
  referenceProject2: z.string().optional(),
  referenceProject3: z.string().optional(),

  // Part 4: Document Upload
  documents: z.any().optional(),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

// Form options
const countryOptions = [
  'United Arab Emirates',
  'Saudi Arabia',
  'Qatar',
  'Italy',
  'Turkey',
  'China',
  'United Kingdom',
  'Germany',
  'Other',
];

const supplierTypeOptions = [
  { value: 'manufacturer', label: 'Manufacturer (Direct)' },
  { value: 'distributor', label: 'Authorized Distributor' },
  { value: 'service-provider', label: 'Service Provider / Sub-Contractor' },
];

const categoryOptions = [
  { value: 'civil-materials', label: 'Civil Materials (Concrete/Steel)' },
  { value: 'interior-finishes', label: 'Interior Finishes (Stone/Wood/Fabric)' },
  { value: 'mep-equipment', label: 'MEP Equipment' },
  { value: 'logistics', label: 'Logistics & Transport' },
];

const turnoverOptions = [
  'Under 1M AED',
  '1M - 5M AED',
  '5M - 20M AED',
  '20M - 50M AED',
  '50M+ AED',
];

const certificationOptions = [
  { value: 'iso-9001', label: 'ISO 9001 (Quality)' },
  { value: 'iso-14001', label: 'ISO 14001 (Environment)' },
  { value: 'iso-45001', label: 'ISO 45001 (Safety)' },
  { value: 'icv', label: 'ICV Certified (In-Country Value)' },
];

// FAQ data
const faqData = [
  {
    question: 'How long does the approval process take?',
    answer:
      'Our Procurement Department reviews PQQ submissions on a weekly basis. If your profile matches our current requirements, you will be contacted within 10 working days for a formal audit.',
  },
  {
    question: 'Do you require samples?',
    answer:
      'Yes. If you are pre-qualified, the next step is often a physical sample submission to our Burj Vista HQ for inspection by our Design Team.',
  },
  {
    question: 'Do you accept international suppliers?',
    answer:
      'Yes. We regularly source directly from Italy, Turkey, China, and the UK for our luxury projects. However, international suppliers must demonstrate robust logistics capabilities to handle shipping to Dubai, Doha, or Syria.',
  },
];

export default function SupplierRegistrationPage() {
  const heroRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);

  const heroInView = useInView(heroRef, { once: true });
  const introInView = useInView(introRef, { once: true, margin: '-100px' });
  const formInView = useInView(formRef, { once: true, margin: '-100px' });
  const faqInView = useInView(faqRef, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    reset,
    setValue,
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      primaryCategory: [],
      certifications: [],
    },
  });

  const watchedValues = watch();

  // Step validation before proceeding
  const validateStep = async (step: number) => {
    let fieldsToValidate: (keyof SupplierFormData)[] = [];

    if (step === 1) {
      fieldsToValidate = [
        'companyName',
        'tradeLicenseNumber',
        'hqCountry',
        'hqCity',
        'contactPerson',
        'contactDesignation',
        'email',
        'phone',
      ];
    } else if (step === 2) {
      fieldsToValidate = ['supplierType', 'primaryCategory', 'annualTurnover'];
    } else if (step === 3) {
      fieldsToValidate = ['referenceProject1'];
    }

    const isValid = await trigger(fieldsToValidate);
    return isValid;
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCategoryChange = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newCategories);
    setValue('primaryCategory', newCategories);
  };

  const handleCertificationChange = (cert: string) => {
    const newCerts = selectedCertifications.includes(cert)
      ? selectedCertifications.filter((c) => c !== cert)
      : [...selectedCertifications, cert];
    setSelectedCertifications(newCerts);
    setValue('certifications', newCerts);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File must be less than 10MB');
        return;
      }
      // Validate file type
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file only');
        return;
      }
      setUploadedFile(file);
      setValue('documents', file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setValue('documents', undefined);
  };

  const onSubmit = async (data: SupplierFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate form submission
      console.log('Supplier registration submitted:', data);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSubmitSuccess(true);
      reset();
      setSelectedCategories([]);
      setSelectedCertifications([]);
      setUploadedFile(null);
      setCurrentStep(1);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Company Profile', subtitle: 'Basic Info', icon: Building2 },
    { number: 2, title: 'Category & Capacity', subtitle: 'Your Services', icon: Package },
    { number: 3, title: 'Compliance & Quality', subtitle: 'Certifications', icon: Award },
    { number: 4, title: 'Documents', subtitle: 'Upload Files', icon: FileText },
  ];

  return (
    <>
      <Header />

      <main className="relative bg-white">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative h-[70vh] min-h-[500px] overflow-hidden bg-neutral-950"
        >
          {/* Background Image */}
          <motion.div className="absolute inset-0" style={{ y: heroY }}>
            <SafeImage
              src="/placeholder.jpg"
              alt="Premium materials and construction"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/60 to-neutral-950" />
          </motion.div>

          {/* Content */}
          <motion.div
            className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
            style={{ opacity: heroOpacity }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6"
            >
              <span className="inline-block rounded-full border border-[#c9a962]/30 bg-[#c9a962]/10 px-6 py-2 text-[11px] font-light uppercase tracking-[0.3em] text-[#c9a962] backdrop-blur-sm">
                Supplier Registration
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-6 font-Playfair text-5xl font-light leading-tight text-white md:text-6xl lg:text-7xl"
            >
              Join Our Supply Chain.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="max-w-xl text-lg font-light text-white/70 md:text-xl"
            >
              We build the best. We expect the best.
            </motion.p>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Scroll</span>
              <div className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
            </motion.div>
          </motion.div>
        </section>

        {/* Intro Section - Beyond the Transaction */}
        <section ref={introRef} className="relative overflow-hidden bg-white py-24 lg:py-32">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={introInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="mb-16 text-center"
            >
              <h2 className="mb-8 font-Playfair text-4xl font-light leading-tight text-neutral-950 md:text-5xl">
                Beyond the Transaction.
              </h2>
              <p className="mx-auto max-w-3xl text-lg font-light leading-relaxed text-neutral-600">
                At MIDC, we do not view our suppliers as vendors; we view them as extensions of our
                own team. Whether you are supplying Italian marble for a Ritz-Carlton renovation or
                architectural steel for a C1 Headquarter build, your product becomes part of our
                legacy.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={introInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12"
            >
              <p className="mb-8 text-center text-base font-light text-neutral-600">
                We maintain a rigorous Pre-Qualification Process (PQQ). We are actively seeking
                partners who share our commitment to:
              </p>

              <div className="grid gap-6 md:grid-cols-3">
                {/* Traceability */}
                <div className="group rounded-2xl border border-neutral-200 bg-neutral-50 p-8 transition-all hover:border-[#c9a962]/50 hover:bg-white hover:shadow-lg">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-950 transition-colors group-hover:bg-[#c9a962]">
                    <Globe className="h-6 w-6 text-white transition-colors group-hover:text-neutral-950" />
                  </div>
                  <h3 className="mb-3 text-xl font-medium text-neutral-950">Traceability</h3>
                  <p className="text-sm font-light leading-relaxed text-neutral-600">
                    You know exactly where your raw materials come from.
                  </p>
                </div>

                {/* Timeliness */}
                <div className="group rounded-2xl border border-neutral-200 bg-neutral-50 p-8 transition-all hover:border-[#c9a962]/50 hover:bg-white hover:shadow-lg">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-950 transition-colors group-hover:bg-[#c9a962]">
                    <Clock className="h-6 w-6 text-white transition-colors group-hover:text-neutral-950" />
                  </div>
                  <h3 className="mb-3 text-xl font-medium text-neutral-950">Timeliness</h3>
                  <p className="text-sm font-light leading-relaxed text-neutral-600">
                    You understand that &quot;Just-in-Time&quot; is a rule, not a suggestion.
                  </p>
                </div>

                {/* Quality */}
                <div className="group rounded-2xl border border-neutral-200 bg-neutral-50 p-8 transition-all hover:border-[#c9a962]/50 hover:bg-white hover:shadow-lg">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-950 transition-colors group-hover:bg-[#c9a962]">
                    <ShieldCheck className="h-6 w-6 text-white transition-colors group-hover:text-neutral-950" />
                  </div>
                  <h3 className="mb-3 text-xl font-medium text-neutral-950">Quality</h3>
                  <p className="text-sm font-light leading-relaxed text-neutral-600">
                    You operate under ISO 9001 standards or equivalent.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Form Section */}
        <section ref={formRef} className="relative overflow-hidden bg-neutral-50 py-24 lg:py-32">
          <div className="mx-auto max-w-5xl px-6">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={formInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="mb-16 text-center"
            >
              <h2 className="mb-6 font-Playfair text-3xl font-light leading-tight text-neutral-950 md:text-4xl">
                Vendor Registration Application.
              </h2>
              <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-neutral-600">
                Please complete all fields to be considered for our Approved Vendor List (AVL).
              </p>
            </motion.div>

            {/* Success Message */}
            <AnimatePresence>
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-12 rounded-2xl border border-green-200 bg-green-50 p-8 text-center"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="mb-2 text-2xl font-light text-green-800">
                    Pre-Qualification Request Submitted!
                  </h3>
                  <p className="text-green-700">
                    Our Procurement Department will review your submission and contact you within 10
                    working days if your profile matches our current requirements.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-6 text-sm text-green-600 underline hover:text-green-800"
                  >
                    Submit Another Application
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {!submitSuccess && (
              <>
                {/* Progress Steps */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={formInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mb-12"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {steps.map((step, index) => (
                      <div key={step.number} className="flex items-center">
                        <button
                          onClick={() => step.number < currentStep && setCurrentStep(step.number)}
                          disabled={step.number > currentStep}
                          className={`flex items-center gap-3 transition-all ${
                            step.number > currentStep
                              ? 'cursor-not-allowed opacity-50'
                              : step.number < currentStep
                                ? 'cursor-pointer'
                                : ''
                          }`}
                        >
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                              step.number === currentStep
                                ? 'bg-neutral-950 text-white'
                                : step.number < currentStep
                                  ? 'bg-[#c9a962] text-neutral-950'
                                  : 'bg-neutral-200 text-neutral-400'
                            }`}
                          >
                            {step.number < currentStep ? (
                              <Check className="h-5 w-5" />
                            ) : (
                              <step.icon className="h-5 w-5" />
                            )}
                          </div>
                          <div className="hidden text-left md:block">
                            <p
                              className={`text-sm font-medium ${
                                step.number === currentStep ? 'text-neutral-950' : 'text-neutral-400'
                              }`}
                            >
                              {step.title}
                            </p>
                            <p className="text-xs text-neutral-400">{step.subtitle}</p>
                          </div>
                        </button>

                        {index < steps.length - 1 && (
                          <div
                            className={`mx-2 hidden h-px w-8 md:mx-4 md:block md:w-12 lg:w-16 ${
                              step.number < currentStep ? 'bg-[#c9a962]' : 'bg-neutral-200'
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Form */}
                <motion.form
                  initial={{ opacity: 0, y: 30 }}
                  animate={formInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm md:p-12"
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
                        className="space-y-8"
                      >
                        <div className="mb-8 border-b border-neutral-100 pb-6">
                          <h3 className="text-2xl font-light text-neutral-950">
                            Part 1: Company Profile
                          </h3>
                          <p className="mt-2 text-sm text-neutral-500">
                            Basic company information
                          </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                          {/* Company Name */}
                          <div>
                            <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                              Registered Company Name *
                            </label>
                            <input
                              {...register('companyName')}
                              type="text"
                              placeholder="Your company name"
                              className={`w-full rounded-lg border ${
                                errors.companyName ? 'border-red-300' : 'border-neutral-200'
                              } bg-neutral-50 px-4 py-3 text-base font-light text-neutral-950 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none`}
                            />
                            {errors.companyName && (
                              <p className="mt-1 text-xs text-red-500">
                                {errors.companyName.message}
                              </p>
                            )}
                          </div>

                          {/* Trade License Number */}
                          <div>
                            <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                              Trade License Number *
                            </label>
                            <input
                              {...register('tradeLicenseNumber')}
                              type="text"
                              placeholder="License number"
                              className={`w-full rounded-lg border ${
                                errors.tradeLicenseNumber ? 'border-red-300' : 'border-neutral-200'
                              } bg-neutral-50 px-4 py-3 text-base font-light text-neutral-950 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none`}
                            />
                            {errors.tradeLicenseNumber && (
                              <p className="mt-1 text-xs text-red-500">
                                {errors.tradeLicenseNumber.message}
                              </p>
                            )}
                          </div>

                          {/* HQ Country */}
                          <div>
                            <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                              HQ Location - Country *
                            </label>
                            <select
                              {...register('hqCountry')}
                              className={`w-full rounded-lg border ${
                                errors.hqCountry ? 'border-red-300' : 'border-neutral-200'
                              } bg-neutral-50 px-4 py-3 text-base font-light text-neutral-950 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none`}
                            >
                              <option value="">Select country</option>
                              {countryOptions.map((country) => (
                                <option key={country} value={country}>
                                  {country}
                                </option>
                              ))}
                            </select>
                            {errors.hqCountry && (
                              <p className="mt-1 text-xs text-red-500">
                                {errors.hqCountry.message}
                              </p>
                            )}
                          </div>

                          {/* HQ City */}
                          <div>
                            <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                              HQ Location - City *
                            </label>
                            <input
                              {...register('hqCity')}
                              type="text"
                              placeholder="City"
                              className={`w-full rounded-lg border ${
                                errors.hqCity ? 'border-red-300' : 'border-neutral-200'
                              } bg-neutral-50 px-4 py-3 text-base font-light text-neutral-950 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none`}
                            />
                            {errors.hqCity && (
                              <p className="mt-1 text-xs text-red-500">{errors.hqCity.message}</p>
                            )}
                          </div>

                          {/* Website */}
                          <div className="md:col-span-2">
                            <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                              Company Website
                            </label>
                            <input
                              {...register('website')}
                              type="url"
                              placeholder="https://www.yourcompany.com"
                              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-base font-light text-neutral-950 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none"
                            />
                          </div>

                          {/* Contact Person */}
                          <div>
                            <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                              Contact Person - Name *
                            </label>
                            <input
                              {...register('contactPerson')}
                              type="text"
                              placeholder="Full name"
                              className={`w-full rounded-lg border ${
                                errors.contactPerson ? 'border-red-300' : 'border-neutral-200'
                              } bg-neutral-50 px-4 py-3 text-base font-light text-neutral-950 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none`}
                            />
                            {errors.contactPerson && (
                              <p className="mt-1 text-xs text-red-500">
                                {errors.contactPerson.message}
                              </p>
                            )}
                          </div>

                          {/* Contact Designation */}
                          <div>
                            <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                              Contact Person - Designation *
                            </label>
                            <input
                              {...register('contactDesignation')}
                              type="text"
                              placeholder="e.g., Sales Manager"
                              className={`w-full rounded-lg border ${
                                errors.contactDesignation ? 'border-red-300' : 'border-neutral-200'
                              } bg-neutral-50 px-4 py-3 text-base font-light text-neutral-950 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none`}
                            />
                            {errors.contactDesignation && (
                              <p className="mt-1 text-xs text-red-500">
                                {errors.contactDesignation.message}
                              </p>
                            )}
                          </div>

                          {/* Email */}
                          <div>
                            <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                              Email Address *
                            </label>
                            <input
                              {...register('email')}
                              type="email"
                              placeholder="contact@company.com"
                              className={`w-full rounded-lg border ${
                                errors.email ? 'border-red-300' : 'border-neutral-200'
                              } bg-neutral-50 px-4 py-3 text-base font-light text-neutral-950 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none`}
                            />
                            {errors.email && (
                              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                            )}
                          </div>

                          {/* Phone */}
                          <div>
                            <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                              Phone / WhatsApp *
                            </label>
                            <input
                              {...register('phone')}
                              type="tel"
                              placeholder="+971 XX XXX XXXX"
                              className={`w-full rounded-lg border ${
                                errors.phone ? 'border-red-300' : 'border-neutral-200'
                              } bg-neutral-50 px-4 py-3 text-base font-light text-neutral-950 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none`}
                            />
                            {errors.phone && (
                              <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                            )}
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
                        <div className="mb-8 border-b border-neutral-100 pb-6">
                          <h3 className="text-2xl font-light text-neutral-950">
                            Part 2: Category & Capacity
                          </h3>
                          <p className="mt-2 text-sm text-neutral-500">
                            Tell us about your services
                          </p>
                        </div>

                        {/* Supplier Type */}
                        <div>
                          <label className="mb-3 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                            Supplier Type *
                          </label>
                          <div className="grid gap-3 sm:grid-cols-3">
                            {supplierTypeOptions.map((type) => (
                              <label
                                key={type.value}
                                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all ${
                                  watchedValues.supplierType === type.value
                                    ? 'border-neutral-950 bg-neutral-950 text-white'
                                    : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300'
                                }`}
                              >
                                <input
                                  {...register('supplierType')}
                                  type="radio"
                                  value={type.value}
                                  className="sr-only"
                                />
                                <span className="text-sm font-light">{type.label}</span>
                              </label>
                            ))}
                          </div>
                          {errors.supplierType && (
                            <p className="mt-2 text-xs text-red-500">
                              {errors.supplierType.message}
                            </p>
                          )}
                        </div>

                        {/* Primary Category */}
                        <div>
                          <label className="mb-3 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                            Primary Category *
                          </label>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {categoryOptions.map((category) => (
                              <label
                                key={category.value}
                                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all ${
                                  selectedCategories.includes(category.value)
                                    ? 'border-[#c9a962] bg-[#c9a962]/10'
                                    : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedCategories.includes(category.value)}
                                  onChange={() => handleCategoryChange(category.value)}
                                  className="sr-only"
                                />
                                <div
                                  className={`flex h-5 w-5 items-center justify-center rounded border ${
                                    selectedCategories.includes(category.value)
                                      ? 'border-[#c9a962] bg-[#c9a962]'
                                      : 'border-neutral-300'
                                  }`}
                                >
                                  {selectedCategories.includes(category.value) && (
                                    <Check className="h-3 w-3 text-white" />
                                  )}
                                </div>
                                <span className="text-sm font-light text-neutral-950">
                                  {category.label}
                                </span>
                              </label>
                            ))}
                          </div>

                          {/* Other category */}
                          <div className="mt-3">
                            <input
                              {...register('categoryOther')}
                              type="text"
                              placeholder="Other (please specify)"
                              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-light text-neutral-950 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none"
                            />
                          </div>
                          {errors.primaryCategory && (
                            <p className="mt-2 text-xs text-red-500">
                              {errors.primaryCategory.message}
                            </p>
                          )}
                        </div>

                        {/* Annual Turnover */}
                        <div>
                          <label className="mb-3 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                            Annual Turnover (AED) *
                          </label>
                          <select
                            {...register('annualTurnover')}
                            className={`w-full rounded-lg border ${
                              errors.annualTurnover ? 'border-red-300' : 'border-neutral-200'
                            } bg-neutral-50 px-4 py-3 text-base font-light text-neutral-950 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none`}
                          >
                            <option value="">Select range</option>
                            {turnoverOptions.map((turnover) => (
                              <option key={turnover} value={turnover}>
                                {turnover}
                              </option>
                            ))}
                          </select>
                          {errors.annualTurnover && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.annualTurnover.message}
                            </p>
                          )}
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
                        <div className="mb-8 border-b border-neutral-100 pb-6">
                          <h3 className="text-2xl font-light text-neutral-950">
                            Part 3: Compliance & Quality
                          </h3>
                          <p className="mt-2 text-sm text-neutral-500">
                            Certifications and reference projects
                          </p>
                        </div>

                        {/* Certifications */}
                        <div>
                          <label className="mb-3 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                            Certifications Held
                          </label>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {certificationOptions.map((cert) => (
                              <label
                                key={cert.value}
                                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all ${
                                  selectedCertifications.includes(cert.value)
                                    ? 'border-[#c9a962] bg-[#c9a962]/10'
                                    : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedCertifications.includes(cert.value)}
                                  onChange={() => handleCertificationChange(cert.value)}
                                  className="sr-only"
                                />
                                <div
                                  className={`flex h-5 w-5 items-center justify-center rounded border ${
                                    selectedCertifications.includes(cert.value)
                                      ? 'border-[#c9a962] bg-[#c9a962]'
                                      : 'border-neutral-300'
                                  }`}
                                >
                                  {selectedCertifications.includes(cert.value) && (
                                    <Check className="h-3 w-3 text-white" />
                                  )}
                                </div>
                                <span className="text-sm font-light text-neutral-950">
                                  {cert.label}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Reference Projects */}
                        <div>
                          <label className="mb-3 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                            Reference Projects *
                          </label>
                          <p className="mb-4 text-sm font-light text-neutral-500">
                            List 3 major projects supplied in the last 5 years
                          </p>

                          <div className="space-y-4">
                            <div>
                              <input
                                {...register('referenceProject1')}
                                type="text"
                                placeholder="Project 1 (required)"
                                className={`w-full rounded-lg border ${
                                  errors.referenceProject1 ? 'border-red-300' : 'border-neutral-200'
                                } bg-neutral-50 px-4 py-3 text-base font-light text-neutral-950 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none`}
                              />
                              {errors.referenceProject1 && (
                                <p className="mt-1 text-xs text-red-500">
                                  {errors.referenceProject1.message}
                                </p>
                              )}
                            </div>
                            <input
                              {...register('referenceProject2')}
                              type="text"
                              placeholder="Project 2 (optional)"
                              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-base font-light text-neutral-950 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none"
                            />
                            <input
                              {...register('referenceProject3')}
                              type="text"
                              placeholder="Project 3 (optional)"
                              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-base font-light text-neutral-950 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none"
                            />
                          </div>
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
                        <div className="mb-8 border-b border-neutral-100 pb-6">
                          <h3 className="text-2xl font-light text-neutral-950">
                            Part 4: Document Upload
                          </h3>
                          <p className="mt-2 text-sm text-neutral-500">
                            Mandatory documentation
                          </p>
                        </div>

                        {/* Document Requirements */}
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
                          <h4 className="mb-4 font-medium text-amber-800">
                            Please upload a single PDF (Max 10MB) containing:
                          </h4>
                          <ul className="space-y-2 text-sm text-amber-700">
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4" />
                              Trade License Copy
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4" />
                              TRN (Tax Registration) Certificate
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4" />
                              Company Profile
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4" />
                              ISO Certificates (if applicable)
                            </li>
                          </ul>
                        </div>

                        {/* File Upload */}
                        <div>
                          <div className="relative">
                            {!uploadedFile ? (
                              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-200 bg-neutral-50 p-12 transition-all hover:border-neutral-300 hover:bg-neutral-100">
                                <Upload className="mb-4 h-12 w-12 text-neutral-400" />
                                <span className="text-base font-light text-neutral-600">
                                  Click to upload or drag and drop
                                </span>
                                <span className="mt-2 text-sm text-neutral-400">
                                  PDF only (max 10MB)
                                </span>
                                <input
                                  type="file"
                                  accept=".pdf"
                                  onChange={handleFileUpload}
                                  className="sr-only"
                                />
                              </label>
                            ) : (
                              <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 p-6">
                                <div className="flex items-center gap-4">
                                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#c9a962]/10">
                                    <FileText className="h-8 w-8 text-[#c9a962]" />
                                  </div>
                                  <div>
                                    <p className="text-base font-medium text-neutral-950">
                                      {uploadedFile.name}
                                    </p>
                                    <p className="text-sm text-neutral-500">
                                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={removeFile}
                                  className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-neutral-600"
                                >
                                  <X className="h-6 w-6" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="mt-10 flex items-center justify-between border-t border-neutral-100 pt-8">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex items-center gap-2 text-sm font-light text-neutral-600 transition-colors hover:text-neutral-950"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Previous
                      </button>
                    ) : (
                      <div />
                    )}

                    {currentStep < 4 ? (
                      <MagneticButton>
                        <button
                          type="button"
                          onClick={nextStep}
                          className="group flex items-center gap-3 rounded-full bg-neutral-950 px-8 py-4 text-sm font-light tracking-wide text-white transition-all hover:bg-neutral-800"
                        >
                          Next
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </MagneticButton>
                    ) : (
                      <MagneticButton>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="group flex items-center gap-3 rounded-full bg-[#c9a962] px-8 py-4 text-sm font-light tracking-wide text-neutral-950 transition-all hover:bg-[#c4a030] disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            'Submitting...'
                          ) : (
                            <>
                              Submit for Pre-Qualification
                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </>
                          )}
                        </button>
                      </MagneticButton>
                    )}
                  </div>
                </motion.form>
              </>
            )}
          </div>
        </section>

        {/* FAQ Section - Procurement Protocols */}
        <section ref={faqRef} className="relative overflow-hidden bg-white py-24 lg:py-32">
          <div className="mx-auto max-w-4xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={faqInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="mb-12 text-center"
            >
              <h2 className="mb-6 font-Playfair text-3xl font-light leading-tight text-neutral-950 md:text-4xl">
                Procurement Protocols.
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={faqInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4"
            >
              {faqData.map((faq, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-neutral-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-950">
                        <HelpCircle className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-base font-medium text-neutral-950">{faq.question}</span>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-neutral-400 transition-transform ${
                        expandedFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-neutral-200 bg-white px-6 py-6 pl-20">
                          <p className="text-base font-light leading-relaxed text-neutral-600">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>

            {/* Additional Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={faqInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-16 text-center"
            >
              <div className="inline-flex items-center gap-3 rounded-full border border-neutral-200 bg-neutral-50 px-8 py-4">
                <Truck className="h-5 w-5 text-[#c9a962]" />
                <span className="text-sm font-light text-neutral-600">
                  Questions? Contact our Procurement Department at{' '}
                  <a
                    href="mailto:procurement@midc.ae"
                    className="font-medium text-neutral-950 underline hover:text-[#c9a962]"
                  >
                    procurement@midc.ae
                  </a>
                </span>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <LogoMarquee />
      <Footer />
    </>
  );
}
