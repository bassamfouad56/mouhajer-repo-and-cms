"use client";

import { motion } from "framer-motion";
import { Award, Shield, Users, Building2, Clock, CheckCircle } from "lucide-react";
import Image from "next/image";

interface TrustBadgesSectionProps {
  variant?: "light" | "dark";
  showPartners?: boolean;
  compact?: boolean;
}

const awards = [
  {
    title: "Best Hotel Suite Interior",
    subtitle: "Arabia 2023-2024",
    icon: Award,
    highlight: "5-Star Winner",
  },
  {
    title: "Best Residential Interior",
    subtitle: "Dubai 2023-2024",
    icon: Award,
    highlight: "5-Star Winner",
  },
  {
    title: "Best Hotel Interior",
    subtitle: "Abu Dhabi 2022-2023",
    icon: Award,
    highlight: "5-Star Winner",
  },
];

const certifications = [
  {
    name: "ISO 9001:2015",
    description: "Quality Management",
    icon: Shield,
  },
  {
    name: "ISO 14001:2015",
    description: "Environmental",
    icon: Shield,
  },
  {
    name: "ISO 45001:2018",
    description: "Health & Safety",
    icon: Shield,
  },
];

const stats = [
  { value: "150+", label: "Projects Completed", icon: Building2 },
  { value: "20+", label: "Years Experience", icon: Clock },
  { value: "100%", label: "Client Satisfaction", icon: Users },
  { value: "0", label: "Safety Incidents", icon: CheckCircle },
];

const partners = [
  { name: "Address Hotels", logo: "/partners/address.png" },
  { name: "Sheraton", logo: "/partners/sheraton.png" },
  { name: "Grand Hyatt", logo: "/partners/grand-hyatt.png" },
  { name: "ADNH", logo: "/partners/adnh.png" },
];

export function TrustBadgesSection({
  variant = "light",
  showPartners = true,
  compact = false,
}: TrustBadgesSectionProps) {
  const isDark = variant === "dark";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (compact) {
    return (
      <section className={`py-8 ${isDark ? "bg-[#faf8f5]" : "bg-neutral-50"}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {/* Awards inline */}
            <div className="flex items-center gap-2">
              <Award className={`h-5 w-5 ${isDark ? "text-[#c9a962]" : "text-[#c9a962]"}`} />
              <span className={`text-sm font-medium ${isDark ? "text-white" : "text-neutral-900"}`}>
                5x International Property Awards Winner
              </span>
            </div>

            {/* Certifications inline */}
            <div className="flex items-center gap-2">
              <Shield className={`h-5 w-5 ${isDark ? "text-[#c9a962]" : "text-[#c9a962]"}`} />
              <span className={`text-sm font-medium ${isDark ? "text-white" : "text-neutral-900"}`}>
                Triple ISO Certified
              </span>
            </div>

            {/* Stats inline */}
            <div className="flex items-center gap-6">
              {stats.slice(0, 2).map((stat, i) => (
                <div key={i} className="text-center">
                  <div className={`text-lg font-bold ${isDark ? "text-[#c9a962]" : "text-neutral-900"}`}>
                    {stat.value}
                  </div>
                  <div className={`text-xs ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 md:py-24 ${isDark ? "bg-[#faf8f5]" : "bg-white"}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className={`mb-2 inline-block text-sm font-medium uppercase tracking-wider ${isDark ? "text-[#c9a962]" : "text-[#c9a962]"}`}>
            Why Trust Us
          </span>
          <h2 className={`text-3xl font-light md:text-4xl ${isDark ? "text-neutral-900" : "text-neutral-900"}`}>
            Award-Winning Excellence
          </h2>
        </motion.div>

        {/* Awards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 grid gap-4 md:grid-cols-3"
        >
          {awards.map((award, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`group relative overflow-hidden rounded-xl p-6 transition-all hover:shadow-lg ${
                isDark ? "bg-white/70 hover:bg-white/90" : "bg-neutral-50 hover:bg-white"
              }`}
            >
              {/* Gold accent */}
              <div className="absolute left-0 top-0 h-full w-1 bg-[#c9a962]" />

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#c9a962]/10">
                  <award.icon className="h-6 w-6 text-[#c9a962]" />
                </div>
                <div>
                  <span className="mb-1 inline-block rounded-full bg-[#c9a962]/10 px-2 py-0.5 text-xs font-medium text-[#c9a962]">
                    {award.highlight}
                  </span>
                  <h3 className={`font-medium ${isDark ? "text-neutral-900" : "text-neutral-900"}`}>
                    {award.title}
                  </h3>
                  <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
                    {award.subtitle}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`rounded-xl p-6 text-center ${isDark ? "bg-white/70" : "bg-neutral-50"}`}
            >
              <stat.icon className={`mx-auto mb-2 h-6 w-6 ${isDark ? "text-[#c9a962]" : "text-[#c9a962]"}`} />
              <div className={`text-3xl font-bold ${isDark ? "text-neutral-900" : "text-neutral-900"}`}>
                {stat.value}
              </div>
              <div className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Certifications */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className={`mb-6 text-center text-lg font-medium ${isDark ? "text-neutral-900" : "text-neutral-900"}`}>
            Certified Excellence
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`flex items-center gap-3 rounded-full px-5 py-3 ${
                  isDark ? "bg-white/70" : "bg-neutral-50"
                }`}
              >
                <cert.icon className="h-5 w-5 text-[#c9a962]" />
                <div>
                  <div className={`text-sm font-medium ${isDark ? "text-neutral-900" : "text-neutral-900"}`}>
                    {cert.name}
                  </div>
                  <div className={`text-xs ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                    {cert.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Partners */}
        {showPartners && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className={`mb-6 text-center text-lg font-medium ${isDark ? "text-neutral-900" : "text-neutral-900"}`}>
              Trusted By Industry Leaders
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {partners.map((partner, index) => (
                <div
                  key={index}
                  className={`flex h-16 w-32 items-center justify-center rounded-lg p-4 transition-opacity hover:opacity-100 ${
                    isDark ? "opacity-60 grayscale hover:grayscale-0" : "opacity-50 grayscale hover:opacity-100 hover:grayscale-0"
                  }`}
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={120}
                    height={48}
                    className="h-auto max-h-12 w-auto object-contain"
                    onError={(e) => {
                      // Fallback to text if image fails
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.parentElement!.innerHTML = `<span class="${isDark ? "text-neutral-400" : "text-neutral-600"} text-sm font-medium">${partner.name}</span>`;
                    }}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Compact inline version for headers/footers
export function TrustBadgesInline({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-500 ${className}`}>
      <span className="flex items-center gap-1">
        <Award className="h-4 w-4 text-[#c9a962]" />
        5-Star Award Winner
      </span>
      <span className="hidden sm:inline">•</span>
      <span className="flex items-center gap-1">
        <Shield className="h-4 w-4 text-[#c9a962]" />
        Triple ISO Certified
      </span>
      <span className="hidden sm:inline">•</span>
      <span>150+ Projects</span>
      <span className="hidden sm:inline">•</span>
      <span>20+ Years</span>
    </div>
  );
}

export default TrustBadgesSection;
