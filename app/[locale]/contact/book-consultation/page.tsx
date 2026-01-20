"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  Shield,
  Heart,
  User,
  Building2,
  Sparkles,
  FileText,
  X,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MagneticButton } from "@/components/magnetic-button";
import { SafeImage } from "@/components/safe-image";

// Form validation schema
const consultationSchema = z.object({
  // Step 1: The Visionary
  fullName: z.string().min(2, "Full name is required"),
  organization: z.string().optional(),
  role: z.string().min(1, "Please select your role"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number is required"),
  meetingLocation: z.string().min(1, "Please select meeting location"),

  // Step 2: The Asset
  projectCategory: z.string().min(1, "Please select project category"),
  scopeOfWork: z.array(z.string()).min(1, "Please select at least one scope"),
  scopeOther: z.string().optional(),
  projectStatus: z.string().min(1, "Please select project status"),
  location: z.string().min(1, "Please select location"),
  locationOther: z.string().optional(),
  approximateArea: z.string().optional(),
  isTender: z.string().min(1, "Please indicate if this is a formal tender"),

  // Step 3: The Ambition
  budget: z.string().min(1, "Please select budget range"),
  budgetOther: z.string().optional(),
  timeline: z.string().min(1, "Please select timeline"),
  description: z.string().min(10, "Please provide a brief description"),
  attachment: z.any().optional(),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

// Form options
const roleOptions = ["Owner", "Director", "Representative", "Other"];
const meetingOptions = ["MIDC HQ (Dubai)", "Project Site", "Virtual Call"];
const categoryOptions = [
  "Private Residential (Villa/Palace)",
  "Luxury Hospitality (Hotel/Resort)",
  "Commercial / Corporate HQ",
  "Retail / F&B",
];
const scopeOptions = [
  "Turnkey (Design + Build + MEP)",
  "Interior Design Only",
  "Fit-Out Construction Only",
  "MEP Engineering",
];
const statusOptions = [
  "New Build (Empty Plot)",
  "Renovation (Existing Structure)",
  "Shell & Core (Ready for Fit-out)",
];
const locationOptions = [
  "Dubai",
  "Abu Dhabi",
  "International (Doha/London/Syria)",
];
const budgetOptions = [
  "1M - 5M AED",
  "5M - 20M AED",
  "20M - 50M AED",
  "50M+ (Framework Contract)",
];
const timelineOptions = [
  "Immediate Start",
  "Within 3 Months",
  "Planning Stage (6+ Months)",
];

export default function BookConsultationPage() {
  const router = useRouter();
  const heroRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLElement>(null);
  const heroInView = useInView(heroRef, { once: true });
  const formInView = useInView(formRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      scopeOfWork: [],
    },
  });

  const watchedValues = watch();

  // Step validation before proceeding
  const validateStep = async (step: number) => {
    let fieldsToValidate: (keyof ConsultationFormData)[] = [];

    if (step === 1) {
      fieldsToValidate = [
        "fullName",
        "role",
        "email",
        "phone",
        "meetingLocation",
      ];
    } else if (step === 2) {
      fieldsToValidate = [
        "projectCategory",
        "scopeOfWork",
        "projectStatus",
        "location",
        "isTender",
      ];
    }

    const isValid = await trigger(fieldsToValidate);
    return isValid;
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleScopeChange = (scope: string) => {
    const newScopes = selectedScopes.includes(scope)
      ? selectedScopes.filter((s) => s !== scope)
      : [...selectedScopes, scope];
    setSelectedScopes(newScopes);
    setValue("scopeOfWork", newScopes);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File must be less than 10MB");
        return;
      }
      setUploadedFile(file);
      setValue("attachment", file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setValue("attachment", undefined);
  };

  const onSubmit = async (data: ConsultationFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate form submission
      console.log("Consultation form submitted:", data);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Redirect to thank you page
      router.push("/thank-you");
    } catch (error) {
      console.error("Form submission error:", error);
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: "The Visionary", subtitle: "About You", icon: User },
    {
      number: 2,
      title: "The Asset",
      subtitle: "Project Details",
      icon: Building2,
    },
    {
      number: 3,
      title: "The Ambition",
      subtitle: "Budget & Style",
      icon: Sparkles,
    },
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
              alt="Architect working on blueprint"
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
                Book Consultation
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-6 font-Playfair text-5xl font-light leading-tight text-white md:text-6xl lg:text-7xl"
            >
              Initiate Your Vision.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="max-w-xl text-lg font-light text-white/70 md:text-xl"
            >
              A landmark begins with a conversation. Tell us about your project.
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
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                Scroll
              </span>
              <div className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
            </motion.div>
          </motion.div>
        </section>

        {/* Form Section */}
        <section
          ref={formRef}
          className="relative overflow-hidden bg-neutral-50 py-24 lg:py-32"
        >
          <div className="mx-auto max-w-5xl px-6">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={formInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="mb-16 text-center"
            >
              <h2 className="mb-6 font-Playfair text-3xl font-light leading-tight text-neutral-950 md:text-4xl">
                This is More Than a Meeting.
                <br />
                <span className="text-neutral-500">
                  It is a Feasibility Study.
                </span>
              </h2>
              <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-neutral-600">
                At MIDC, we value your time. Our initial consultation is
                designed to provide you with actionable insights, not just a
                sales pitch. By sharing the details of your project below, you
                allow our engineering and design teams to prepare a preliminary
                analysis.
              </p>
            </motion.div>

            {/* Progress Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={formInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <button
                      onClick={() =>
                        step.number < currentStep && setCurrentStep(step.number)
                      }
                      disabled={step.number > currentStep}
                      className={`flex items-center gap-3 transition-all ${
                        step.number > currentStep
                          ? "cursor-not-allowed opacity-50"
                          : step.number < currentStep
                            ? "cursor-pointer"
                            : ""
                      }`}
                    >
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                          step.number === currentStep
                            ? "bg-neutral-950 text-white"
                            : step.number < currentStep
                              ? "bg-[#c9a962] text-neutral-950"
                              : "bg-neutral-200 text-neutral-400"
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
                            step.number === currentStep
                              ? "text-neutral-950"
                              : "text-neutral-400"
                          }`}
                        >
                          {step.title}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {step.subtitle}
                        </p>
                      </div>
                    </button>

                    {index < steps.length - 1 && (
                      <div
                        className={`mx-4 h-px w-8 md:w-24 ${
                          step.number < currentStep
                            ? "bg-[#c9a962]"
                            : "bg-neutral-200"
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
                {/* Step 1: The Visionary */}
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
                        Step 1: The Visionary
                      </h3>
                      <p className="mt-2 text-sm text-neutral-500">
                        Basic Contact Information
                      </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Full Name */}
                      <div>
                        <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                          Full Name *
                        </label>
                        <input
                          {...register("fullName")}
                          type="text"
                          placeholder="Your full name"
                          className={`w-full rounded-lg border ${
                            errors.fullName
                              ? "border-red-300"
                              : "border-neutral-200"
                          } bg-neutral-50 px-4 py-3 text-base font-light text-neutral-950 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none`}
                        />
                        {errors.fullName && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.fullName.message}
                          </p>
                        )}
                      </div>

                      {/* Organization */}
                      <div>
                        <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                          Organization / Family Office
                        </label>
                        <input
                          {...register("organization")}
                          type="text"
                          placeholder="Company or family office name"
                          className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-base font-light text-neutral-950 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none"
                        />
                      </div>

                      {/* Role */}
                      <div>
                        <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                          Role *
                        </label>
                        <select
                          {...register("role")}
                          className={`w-full rounded-lg border ${
                            errors.role
                              ? "border-red-300"
                              : "border-neutral-200"
                          } bg-neutral-50 px-4 py-3 text-base font-light text-neutral-950 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none`}
                        >
                          <option value="">Select your role</option>
                          {roleOptions.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                        {errors.role && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.role.message}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                          Email Address *
                        </label>
                        <input
                          {...register("email")}
                          type="email"
                          placeholder="your@email.com"
                          className={`w-full rounded-lg border ${
                            errors.email
                              ? "border-red-300"
                              : "border-neutral-200"
                          } bg-neutral-50 px-4 py-3 text-base font-light text-neutral-950 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none`}
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                          Phone / WhatsApp *
                        </label>
                        <input
                          {...register("phone")}
                          type="tel"
                          placeholder="+971 XX XXX XXXX"
                          className={`w-full rounded-lg border ${
                            errors.phone
                              ? "border-red-300"
                              : "border-neutral-200"
                          } bg-neutral-50 px-4 py-3 text-base font-light text-neutral-950 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none`}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>

                      {/* Meeting Location */}
                      <div>
                        <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                          Preferred Meeting Location *
                        </label>
                        <select
                          {...register("meetingLocation")}
                          className={`w-full rounded-lg border ${
                            errors.meetingLocation
                              ? "border-red-300"
                              : "border-neutral-200"
                          } bg-neutral-50 px-4 py-3 text-base font-light text-neutral-950 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none`}
                        >
                          <option value="">Select location</option>
                          {meetingOptions.map((loc) => (
                            <option key={loc} value={loc}>
                              {loc}
                            </option>
                          ))}
                        </select>
                        {errors.meetingLocation && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.meetingLocation.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: The Asset */}
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
                        Step 2: The Asset
                      </h3>
                      <p className="mt-2 text-sm text-neutral-500">
                        Project Details
                      </p>
                    </div>

                    {/* Project Category */}
                    <div>
                      <label className="mb-3 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                        Project Category *
                      </label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {categoryOptions.map((category) => (
                          <label
                            key={category}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all ${
                              watchedValues.projectCategory === category
                                ? "border-neutral-950 bg-neutral-950 text-white"
                                : "border-neutral-200 bg-neutral-50 hover:border-neutral-300"
                            }`}
                          >
                            <input
                              {...register("projectCategory")}
                              type="radio"
                              value={category}
                              className="sr-only"
                            />
                            <span className="text-sm font-light">
                              {category}
                            </span>
                          </label>
                        ))}
                      </div>
                      {errors.projectCategory && (
                        <p className="mt-2 text-xs text-red-500">
                          {errors.projectCategory.message}
                        </p>
                      )}
                    </div>

                    {/* Scope of Work */}
                    <div>
                      <label className="mb-3 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                        Scope of Work *
                      </label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {scopeOptions.map((scope, index) => (
                          <label
                            key={scope}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all ${
                              selectedScopes.includes(scope)
                                ? "border-[#c9a962] bg-[#c9a962]/10"
                                : "border-neutral-200 bg-neutral-50 hover:border-neutral-300"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedScopes.includes(scope)}
                              onChange={() => handleScopeChange(scope)}
                              className="sr-only"
                            />
                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded border ${
                                selectedScopes.includes(scope)
                                  ? "border-[#c9a962] bg-[#c9a962]"
                                  : "border-neutral-300"
                              }`}
                            >
                              {selectedScopes.includes(scope) && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <span className="text-sm font-light text-neutral-950">
                              {scope}
                              {index === 0 && (
                                <span className="ml-2 text-xs text-[#c9a962]">
                                  (Recommended)
                                </span>
                              )}
                            </span>
                          </label>
                        ))}
                      </div>

                      {/* Other scope */}
                      <div className="mt-3">
                        <input
                          {...register("scopeOther")}
                          type="text"
                          placeholder="Other (please specify)"
                          className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-light text-neutral-950 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none"
                        />
                      </div>
                      {errors.scopeOfWork && (
                        <p className="mt-2 text-xs text-red-500">
                          {errors.scopeOfWork.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      {/* Project Status */}
                      <div>
                        <label className="mb-3 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                          Project Status *
                        </label>
                        <select
                          {...register("projectStatus")}
                          className={`w-full rounded-lg border ${
                            errors.projectStatus
                              ? "border-red-300"
                              : "border-neutral-200"
                          } bg-neutral-50 px-4 py-3 text-base font-light text-neutral-950 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none`}
                        >
                          <option value="">Select status</option>
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        {errors.projectStatus && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.projectStatus.message}
                          </p>
                        )}
                      </div>

                      {/* Location */}
                      <div>
                        <label className="mb-3 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                          Location *
                        </label>
                        <select
                          {...register("location")}
                          className={`w-full rounded-lg border ${
                            errors.location
                              ? "border-red-300"
                              : "border-neutral-200"
                          } bg-neutral-50 px-4 py-3 text-base font-light text-neutral-950 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none`}
                        >
                          <option value="">Select location</option>
                          {locationOptions.map((loc) => (
                            <option key={loc} value={loc}>
                              {loc}
                            </option>
                          ))}
                        </select>
                        {watchedValues.location ===
                          "International (Doha/London/Syria)" && (
                          <input
                            {...register("locationOther")}
                            type="text"
                            placeholder="Specify location"
                            className="mt-2 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-light text-neutral-950 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none"
                          />
                        )}
                        {errors.location && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.location.message}
                          </p>
                        )}
                      </div>

                      {/* Approximate Area */}
                      <div>
                        <label className="mb-3 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                          Approximate Area (Sq. Ft)
                        </label>
                        <input
                          {...register("approximateArea")}
                          type="text"
                          placeholder="e.g., 5,000 sq.ft"
                          className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-base font-light text-neutral-950 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none"
                        />
                      </div>

                      {/* Is Tender */}
                      <div>
                        <label className="mb-3 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                          Is this a Formal Tender? *
                        </label>
                        <select
                          {...register("isTender")}
                          className={`w-full rounded-lg border ${
                            errors.isTender
                              ? "border-red-300"
                              : "border-neutral-200"
                          } bg-neutral-50 px-4 py-3 text-base font-light text-neutral-950 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none`}
                        >
                          <option value="">Select option</option>
                          <option value="yes">
                            Yes (I have a Tender Package / BOQ)
                          </option>
                          <option value="no">
                            No (Direct Appointment / Design-Build)
                          </option>
                        </select>
                        {errors.isTender && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.isTender.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: The Ambition */}
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
                        Step 3: The Ambition
                      </h3>
                      <p className="mt-2 text-sm text-neutral-500">
                        Budget & Style
                      </p>
                    </div>

                    {/* Budget */}
                    <div>
                      <label className="mb-3 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                        Project Budget (AED) *
                      </label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {budgetOptions.map((budget) => (
                          <label
                            key={budget}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all ${
                              watchedValues.budget === budget
                                ? "border-neutral-950 bg-neutral-950 text-white"
                                : "border-neutral-200 bg-neutral-50 hover:border-neutral-300"
                            }`}
                          >
                            <input
                              {...register("budget")}
                              type="radio"
                              value={budget}
                              className="sr-only"
                            />
                            <span className="text-sm font-light">{budget}</span>
                          </label>
                        ))}
                      </div>
                      <input
                        {...register("budgetOther")}
                        type="text"
                        placeholder="Other (please specify)"
                        className="mt-3 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-light text-neutral-950 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none"
                      />
                      {errors.budget && (
                        <p className="mt-2 text-xs text-red-500">
                          {errors.budget.message}
                        </p>
                      )}
                    </div>

                    {/* Timeline */}
                    <div>
                      <label className="mb-3 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                        Desired Timeline *
                      </label>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {timelineOptions.map((timeline) => (
                          <label
                            key={timeline}
                            className={`flex cursor-pointer items-center justify-center rounded-lg border p-4 text-center transition-all ${
                              watchedValues.timeline === timeline
                                ? "border-[#c9a962] bg-[#c9a962]/10 text-neutral-950"
                                : "border-neutral-200 bg-neutral-50 hover:border-neutral-300"
                            }`}
                          >
                            <input
                              {...register("timeline")}
                              type="radio"
                              value={timeline}
                              className="sr-only"
                            />
                            <span className="text-sm font-light">
                              {timeline}
                            </span>
                          </label>
                        ))}
                      </div>
                      {errors.timeline && (
                        <p className="mt-2 text-xs text-red-500">
                          {errors.timeline.message}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label className="mb-3 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                        Brief Description / Specific Requirements *
                      </label>
                      <textarea
                        {...register("description")}
                        rows={5}
                        placeholder="Tell us about the soul of the project..."
                        className={`w-full resize-none rounded-lg border ${
                          errors.description
                            ? "border-red-300"
                            : "border-neutral-200"
                        } bg-neutral-50 px-4 py-3 text-base font-light leading-relaxed text-neutral-950 placeholder:text-neutral-400 transition-all focus:border-neutral-400 focus:bg-white focus:outline-none`}
                      />
                      {errors.description && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.description.message}
                        </p>
                      )}
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="mb-3 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                        Attachment (Floor Plans / Mood Boards)
                      </label>
                      <div className="relative">
                        {!uploadedFile ? (
                          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-200 bg-neutral-50 p-8 transition-all hover:border-neutral-300 hover:bg-neutral-100">
                            <Upload className="mb-3 h-8 w-8 text-neutral-400" />
                            <span className="text-sm font-light text-neutral-600">
                              Click to upload or drag and drop
                            </span>
                            <span className="mt-1 text-xs text-neutral-400">
                              PDF, JPG, PNG (max 10MB)
                            </span>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={handleFileUpload}
                              className="sr-only"
                            />
                          </label>
                        ) : (
                          <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                            <div className="flex items-center gap-3">
                              <FileText className="h-8 w-8 text-[#c9a962]" />
                              <div>
                                <p className="text-sm font-medium text-neutral-950">
                                  {uploadedFile.name}
                                </p>
                                <p className="text-xs text-neutral-500">
                                  {(uploadedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                  MB
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={removeFile}
                              className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-neutral-600"
                            >
                              <X className="h-5 w-5" />
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

                {currentStep < 3 ? (
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
                        "Submitting..."
                      ) : (
                        <>
                          Submit Brief & Request Meeting
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </MagneticButton>
                )}
              </div>
            </motion.form>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={formInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-12"
            >
              <h3 className="mb-6 text-center font-Playfair text-2xl font-light text-neutral-950">
                Your Vision is Safe With Us.
              </h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-950">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-950">
                      Non-Disclosure
                    </h4>
                    <p className="text-sm font-light text-neutral-500">
                      All project details are treated with strict
                      confidentiality.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#c9a962]">
                    <Heart className="h-5 w-5 text-neutral-950" />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-950">
                      No Obligation
                    </h4>
                    <p className="text-sm font-light text-neutral-500">
                      This consultation is complimentary.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
