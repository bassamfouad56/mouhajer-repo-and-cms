"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  Home,
  Building2,
  Hotel,
  ArrowRight,
  Mail,
  Phone,
  Loader2,
  CheckCircle2,
  Info,
} from "lucide-react";
import Link from "next/link";

type ProjectType = "residential" | "commercial" | "hospitality";
type FinishLevel = "standard" | "premium" | "luxury";

interface RoomType {
  id: string;
  name: string;
  icon: string;
  basePrice: number; // AED per sqm
}

const roomTypes: Record<ProjectType, RoomType[]> = {
  residential: [
    { id: "living", name: "Living Room", icon: "🛋️", basePrice: 1200 },
    { id: "bedroom", name: "Bedroom", icon: "🛏️", basePrice: 1000 },
    { id: "kitchen", name: "Kitchen", icon: "🍳", basePrice: 2500 },
    { id: "bathroom", name: "Bathroom", icon: "🚿", basePrice: 3000 },
    { id: "dining", name: "Dining Room", icon: "🍽️", basePrice: 1100 },
    { id: "office", name: "Home Office", icon: "💼", basePrice: 1300 },
  ],
  commercial: [
    { id: "office", name: "Office Space", icon: "🏢", basePrice: 1500 },
    { id: "reception", name: "Reception", icon: "🛎️", basePrice: 2000 },
    { id: "meeting", name: "Meeting Room", icon: "👥", basePrice: 1800 },
    { id: "breakout", name: "Break Room", icon: "☕", basePrice: 1200 },
    { id: "retail", name: "Retail Space", icon: "🛍️", basePrice: 2200 },
  ],
  hospitality: [
    { id: "lobby", name: "Lobby", icon: "🏨", basePrice: 3500 },
    { id: "suite", name: "Guest Suite", icon: "🛏️", basePrice: 2800 },
    { id: "restaurant", name: "Restaurant", icon: "🍴", basePrice: 3000 },
    { id: "spa", name: "Spa/Wellness", icon: "💆", basePrice: 3500 },
    { id: "bar", name: "Bar/Lounge", icon: "🍸", basePrice: 3200 },
  ],
};

const finishLevels: Record<
  FinishLevel,
  { name: string; multiplier: number; description: string }
> = {
  standard: {
    name: "Standard",
    multiplier: 1,
    description: "Quality materials with functional design",
  },
  premium: {
    name: "Premium",
    multiplier: 1.5,
    description: "Enhanced materials with designer touches",
  },
  luxury: {
    name: "Luxury",
    multiplier: 2.2,
    description: "Premium materials with bespoke craftsmanship",
  },
};

interface BudgetCalculatorProps {
  className?: string;
}

export function BudgetCalculator({ className = "" }: BudgetCalculatorProps) {
  const [step, setStep] = useState<"input" | "results" | "contact">("input");
  const [projectType, setProjectType] = useState<ProjectType>("residential");
  const [selectedRooms, setSelectedRooms] = useState<Record<string, number>>(
    {},
  );
  const [finishLevel, setFinishLevel] = useState<FinishLevel>("premium");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Calculate totals
  const calculation = useMemo(() => {
    const rooms = roomTypes[projectType];
    let totalSqm = 0;
    let baseTotal = 0;

    Object.entries(selectedRooms).forEach(([roomId, sqm]) => {
      if (sqm > 0) {
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
          totalSqm += sqm;
          baseTotal += sqm * room.basePrice;
        }
      }
    });

    const multiplier = finishLevels[finishLevel].multiplier;
    const designFee = baseTotal * 0.15; // 15% design fee
    const subtotal = baseTotal * multiplier;
    const total = subtotal + designFee;

    return {
      totalSqm,
      baseTotal,
      multiplier,
      designFee,
      subtotal,
      total,
      lowEstimate: total * 0.85,
      highEstimate: total * 1.15,
    };
  }, [projectType, selectedRooms, finishLevel]);

  const handleRoomChange = (roomId: string, value: number) => {
    setSelectedRooms((prev) => ({
      ...prev,
      [roomId]: Math.max(0, value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Budget Calculator Lead",
          email,
          phone,
          subject: "Budget Calculator Estimate Request",
          message: `Project Type: ${projectType}\nFinish Level: ${finishLevel}\nTotal Sqm: ${calculation.totalSqm}\nEstimated Budget: AED ${calculation.lowEstimate.toLocaleString()} - ${calculation.highEstimate.toLocaleString()}`,
          projectType,
          budget: `AED ${calculation.lowEstimate.toLocaleString()} - ${calculation.highEstimate.toLocaleString()}`,
          source: "budget_calculator",
        }),
      });

      setIsSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectTypes = [
    { id: "residential", name: "Residential", icon: Home },
    { id: "commercial", name: "Commercial", icon: Building2 },
    { id: "hospitality", name: "Hospitality", icon: Hotel },
  ];

  return (
    <div className={`rounded-2xl bg-white p-6 shadow-lg sm:p-8 ${className}`}>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8f7852]/10">
          <Calculator className="h-6 w-6 text-[#8f7852]" />
        </div>
        <div>
          <h3 className="text-xl font-medium text-neutral-900">
            Budget Estimator
          </h3>
          <p className="text-sm text-neutral-500">
            Get an instant project estimate
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Project Type */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Project Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {projectTypes.map(({ id, name, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setProjectType(id as ProjectType);
                      setSelectedRooms({});
                    }}
                    className={`flex flex-col items-center gap-1 rounded-lg border-2 p-3 transition-all ${
                      projectType === id
                        ? "border-[#8f7852] bg-[#8f7852]/5"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        projectType === id
                          ? "text-[#8f7852]"
                          : "text-neutral-400"
                      }`}
                    />
                    <span className="text-xs font-medium">{name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Rooms/Spaces */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Spaces & Areas (sqm)
              </label>
              <div className="space-y-2">
                {roomTypes[projectType].map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center gap-3 rounded-lg border border-neutral-200 p-3"
                  >
                    <span className="text-lg">{room.icon}</span>
                    <span className="flex-1 text-sm text-neutral-700">
                      {room.name}
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={selectedRooms[room.id] || ""}
                      onChange={(e) =>
                        handleRoomChange(room.id, parseInt(e.target.value) || 0)
                      }
                      placeholder="0"
                      className="w-20 rounded-lg border border-neutral-200 px-3 py-2 text-center text-sm outline-none focus:border-[#8f7852]"
                    />
                    <span className="text-xs text-neutral-400">sqm</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Finish Level */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Finish Level
              </label>
              <div className="space-y-2">
                {(
                  Object.entries(finishLevels) as [
                    FinishLevel,
                    typeof finishLevels.standard,
                  ][]
                ).map(([level, config]) => (
                  <button
                    key={level}
                    onClick={() => setFinishLevel(level)}
                    className={`flex w-full items-center gap-3 rounded-lg border-2 p-3 text-left transition-all ${
                      finishLevel === level
                        ? "border-[#8f7852] bg-[#8f7852]/5"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded-full border-2 ${
                        finishLevel === level
                          ? "border-[#8f7852] bg-[#8f7852]"
                          : "border-neutral-300"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-neutral-900">
                        {config.name}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {config.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={() => setStep("results")}
              disabled={calculation.totalSqm === 0}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 py-4 font-medium text-white transition-all hover:bg-neutral-800 disabled:opacity-50"
            >
              Calculate Estimate
              <ArrowRight className="h-5 w-5" />
            </button>
          </motion.div>
        )}

        {step === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Results Summary */}
            <div className="mb-6 rounded-xl bg-neutral-50 p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-neutral-500">Total Area</span>
                <span className="font-medium text-neutral-900">
                  {calculation.totalSqm} sqm
                </span>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-neutral-500">Finish Level</span>
                <span className="font-medium text-neutral-900">
                  {finishLevels[finishLevel].name}
                </span>
              </div>
              <div className="border-t border-neutral-200 pt-4">
                <div className="mb-2 text-sm text-neutral-500">
                  Estimated Investment Range
                </div>
                <div className="text-2xl font-light text-neutral-900">
                  AED {calculation.lowEstimate.toLocaleString()} -{" "}
                  {calculation.highEstimate.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mb-6 flex items-start gap-2 rounded-lg bg-blue-50 p-3">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
              <p className="text-xs text-blue-700">
                This is an indicative estimate. Actual costs depend on specific
                requirements, materials, and site conditions. Get a detailed
                quote from our team.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep("input")}
                className="flex-1 border border-neutral-950 bg-transparent py-3 font-Satoshi text-xs font-medium uppercase tracking-wider text-neutral-950 transition-all hover:bg-neutral-950 hover:text-white"
              >
                Adjust Estimate
              </button>
              <button
                onClick={() => setStep("contact")}
                className="flex flex-1 items-center justify-center gap-2 border border-neutral-950 bg-neutral-950 py-3 font-Satoshi text-xs font-medium uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-neutral-950"
              >
                Get Detailed Quote
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === "contact" && (
          <motion.div
            key="contact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {!isSubmitted ? (
              <>
                <div className="mb-6 rounded-xl bg-[#8f7852]/10 p-4">
                  <div className="text-sm text-neutral-600">Your Estimate</div>
                  <div className="text-xl font-medium text-neutral-900">
                    AED {calculation.lowEstimate.toLocaleString()} -{" "}
                    {calculation.highEstimate.toLocaleString()}
                  </div>
                </div>

                <p className="mb-6 text-sm text-neutral-600">
                  Get a detailed, personalized quote from our team. We&apos;ll
                  contact you within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full rounded-lg border border-neutral-200 py-3 pl-11 pr-4 outline-none focus:border-[#8f7852]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      Phone (optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+971 XX XXX XXXX"
                        className="w-full rounded-lg border border-neutral-200 py-3 pl-11 pr-4 outline-none focus:border-[#8f7852]"
                      />
                    </div>
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 py-4 font-medium text-white transition-all hover:bg-neutral-800 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Request Detailed Quote
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>

                <button
                  onClick={() => setStep("results")}
                  className="mt-4 w-full text-center text-sm text-neutral-500 hover:text-neutral-700"
                >
                  ← Back to estimate
                </button>
              </>
            ) : (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="mb-2 text-xl font-medium text-neutral-900">
                  Request Received!
                </h4>
                <p className="mb-6 text-neutral-600">
                  Our team will contact you within 24 hours with a detailed
                  quote.
                </p>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 text-[#8f7852] hover:underline"
                >
                  Browse Our Projects
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BudgetCalculator;
