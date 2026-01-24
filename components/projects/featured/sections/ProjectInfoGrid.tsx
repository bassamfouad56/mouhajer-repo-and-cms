"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  MapPin,
  Building2,
  Calendar,
  Tag,
  Clock,
  CheckCircle,
} from "lucide-react";

interface ServiceTag {
  title: string;
  slug?: string;
}

interface ProjectInfoGridProps {
  location?: string;
  client?: string;
  status?: string;
  projectType?: string;
  sector?: string;
  services?: ServiceTag[];
  duration?: {
    startDate?: string;
    endDate?: string;
    months?: number;
  };
  locale: string;
}

export function ProjectInfoGrid({
  location,
  client,
  status,
  projectType,
  sector,
  services = [],
  duration,
  locale,
}: ProjectInfoGridProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const isRTL = locale === "ar";

  const labels = {
    en: {
      title: "Project Information",
      location: "Location",
      client: "Client",
      status: "Status",
      type: "Type",
      sector: "Sector",
      services: "Services",
      dates: "Duration",
    },
    ar: {
      title: "معلومات المشروع",
      location: "الموقع",
      client: "العميل",
      status: "الحالة",
      type: "النوع",
      sector: "القطاع",
      services: "الخدمات",
      dates: "المدة",
    },
  };

  const t = labels[locale as keyof typeof labels] || labels.en;

  // Format date range
  const formatDateRange = () => {
    if (!duration?.startDate) return null;
    const start = new Date(duration.startDate);
    const end = duration.endDate ? new Date(duration.endDate) : null;

    const formatDate = (date: Date) => {
      return date.toLocaleDateString(locale === "ar" ? "ar-AE" : "en-US", {
        month: "short",
        year: "numeric",
      });
    };

    if (end) {
      return `${formatDate(start)} - ${formatDate(end)}`;
    }
    return formatDate(start);
  };

  const dateRange = formatDateRange();

  // Info items
  const infoItems = [
    { label: t.location, value: location, icon: MapPin },
    { label: t.client, value: client, icon: Building2 },
    { label: t.status, value: status, icon: CheckCircle },
    { label: t.type, value: projectType || sector, icon: Tag },
    {
      label: t.dates,
      value: dateRange,
      icon: Calendar,
      subValue: duration?.months
        ? `${duration.months} ${locale === "ar" ? "شهر" : "months"}`
        : undefined,
    },
  ].filter((item) => item.value);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-neutral-50"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-16"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: 48 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-px bg-[#8f7852]"
          />
          <span className="text-[#8f7852] text-xs tracking-[0.3em] uppercase font-light">
            {t.title}
          </span>
        </motion.div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 mb-12">
          {infoItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="group"
              >
                <div className="relative p-6 bg-white rounded-lg border border-neutral-200 hover:border-[#8f7852]/30 transition-colors">
                  {/* Icon */}
                  <div className="mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#8f7852]/10 flex items-center justify-center group-hover:bg-[#8f7852]/20 transition-colors">
                      <Icon className="w-5 h-5 text-[#8f7852]" />
                    </div>
                  </div>

                  {/* Label */}
                  <span className="block text-neutral-400 text-xs tracking-wider uppercase mb-2">
                    {item.label}
                  </span>

                  {/* Value */}
                  <p className="font-SchnyderS text-lg text-neutral-900">
                    {item.value}
                  </p>

                  {/* Sub Value */}
                  {item.subValue && (
                    <p className="text-neutral-500 text-sm mt-1">
                      {item.subValue}
                    </p>
                  )}

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-[#8f7852]/0 group-hover:border-[#8f7852]/50 transition-colors rounded-tr-lg" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Service Tags */}
        {services.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <span className="block text-neutral-400 text-xs tracking-wider uppercase mb-4">
              {t.services}
            </span>
            <div className="flex flex-wrap gap-3">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.05 }}
                >
                  {service.slug ? (
                    <Link
                      href={`/${locale}/services/${service.slug}`}
                      className="inline-block px-5 py-2 bg-white border border-[#8f7852]/30 text-[#8f7852] text-sm tracking-wider rounded-full hover:bg-[#8f7852] hover:text-white transition-all"
                    >
                      {service.title}
                    </Link>
                  ) : (
                    <span className="inline-block px-5 py-2 bg-white border border-[#8f7852]/30 text-[#8f7852] text-sm tracking-wider rounded-full">
                      {service.title}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
