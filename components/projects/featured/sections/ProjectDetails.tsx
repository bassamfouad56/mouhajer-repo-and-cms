"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

interface ServiceLink {
  title: string;
  slug?: string;
}

interface ProjectDetailsProps {
  location?: string;
  client?: string;
  sector?: string;
  projectType?: string;
  year?: number;
  area?: number;
  duration?: {
    startDate?: string;
    endDate?: string;
    months?: number;
  };
  status?: string;
  services: ServiceLink[];
  outcome?: string;
  locale: string;
}

export function ProjectDetails({
  location,
  client,
  sector,
  projectType,
  year,
  area,
  duration,
  status,
  services,
  outcome,
  locale,
}: ProjectDetailsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isRTL = locale === "ar";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 0.3], [50, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const labels = {
    en: {
      title: "Project Details",
      location: "Location",
      client: "Client",
      sector: "Sector",
      type: "Project Type",
      year: "Year",
      area: "Total Area",
      sqm: "sqm",
      duration: "Duration",
      months: "months",
      status: "Status",
      services: "Services",
      outcome: "The Outcome",
    },
    ar: {
      title: "تفاصيل المشروع",
      location: "الموقع",
      client: "العميل",
      sector: "القطاع",
      type: "نوع المشروع",
      year: "السنة",
      area: "المساحة الكلية",
      sqm: "م²",
      duration: "المدة",
      months: "شهر",
      status: "الحالة",
      services: "الخدمات",
      outcome: "النتيجة",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  const statusLabels: Record<string, { en: string; ar: string }> = {
    completed: { en: "Completed", ar: "مكتمل" },
    "in-progress": { en: "In Progress", ar: "قيد التنفيذ" },
    awarded: { en: "Awarded", ar: "تم الترسية" },
    "on-hold": { en: "On Hold", ar: "معلق" },
  };

  // Build details array
  const details: Array<{ label: string; value: string | number }> = [];

  if (location) details.push({ label: t.location, value: location });
  if (client) details.push({ label: t.client, value: client });
  if (sector) details.push({ label: t.sector, value: sector });
  if (projectType) details.push({ label: t.type, value: projectType });
  if (year) details.push({ label: t.year, value: year });
  if (area)
    details.push({ label: t.area, value: `${area.toLocaleString()} ${t.sqm}` });
  if (duration?.months)
    details.push({
      label: t.duration,
      value: `${duration.months} ${t.months}`,
    });
  if (status) {
    details.push({
      label: t.status,
      value: isRTL
        ? statusLabels[status]?.ar || status
        : statusLabels[status]?.en || status,
    });
  }

  return (
    <section
      ref={containerRef}
      className="relative py-24 md:py-32 bg-[#0a0a0a] overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-16"
        style={{ y, opacity }}
      >
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#c9a962] text-sm tracking-[0.3em] uppercase block mb-4">
            {isRTL ? "معلومات المشروع" : "Project Information"}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-white font-light">
            {t.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Details Grid */}
          <div>
            <div className="grid grid-cols-2 gap-6 md:gap-8">
              {details.map((detail, index) => (
                <motion.div
                  key={detail.label}
                  className="group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className="relative p-4 md:p-6 bg-white/[0.02] border border-white/10 hover:border-[#c9a962]/30 transition-colors duration-300">
                    {/* Label */}
                    <span className="text-white/40 text-xs tracking-[0.2em] uppercase block mb-2">
                      {detail.label}
                    </span>
                    {/* Value */}
                    <span className="text-white text-lg md:text-xl font-light">
                      {detail.value}
                    </span>
                    {/* Corner accent */}
                    <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[20px] border-r-[20px] border-b-[#c9a962]/0 border-r-transparent group-hover:border-b-[#c9a962]/20 transition-colors duration-300" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Services */}
            {services.length > 0 && (
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <span className="text-white/40 text-xs tracking-[0.2em] uppercase block mb-4">
                  {t.services}
                </span>
                <div className="flex flex-wrap gap-2">
                  {services.map((service, index) =>
                    service.slug ? (
                      <Link
                        key={index}
                        href={`/${locale}/services/${service.slug}`}
                        className="px-4 py-2 border border-[#c9a962]/30 text-[#c9a962] text-sm tracking-wider hover:bg-[#c9a962]/10 transition-colors"
                      >
                        {service.title}
                      </Link>
                    ) : (
                      <span
                        key={index}
                        className="px-4 py-2 border border-white/20 text-white/60 text-sm tracking-wider"
                      >
                        {service.title}
                      </span>
                    )
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Outcome */}
          {outcome && (
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="relative h-full p-8 md:p-10 bg-gradient-to-br from-[#c9a962]/10 to-transparent border border-[#c9a962]/20">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-[#c9a962]/50" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-[#c9a962]/50" />

                <span className="text-[#c9a962] text-sm tracking-[0.3em] uppercase block mb-6">
                  {t.outcome}
                </span>
                <p className="text-white/80 text-lg leading-relaxed">
                  {outcome}
                </p>

                {/* Decorative quote */}
                <span className="absolute top-4 right-4 text-[#c9a962]/10 text-6xl font-serif leading-none">
                  "
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Timeline Visual (if duration provided) */}
        {duration?.startDate && duration?.endDate && (
          <motion.div
            className="mt-16 pt-16 border-t border-white/10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              <div className="text-center">
                <span className="text-white/40 text-xs tracking-wider uppercase block mb-2">
                  {isRTL ? "البداية" : "Start"}
                </span>
                <span className="text-white text-lg">
                  {new Date(duration.startDate).toLocaleDateString(
                    isRTL ? "ar-AE" : "en-US",
                    {
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>

              {/* Progress Line */}
              <div className="flex-1 mx-8 relative">
                <div className="h-px bg-white/20" />
                <motion.div
                  className="absolute top-0 left-0 h-px bg-[#c9a962]"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, duration: 1.5, ease: "easeOut" }}
                />
                {/* Duration Label */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2">
                  <span className="text-[#c9a962] text-sm">
                    {duration.months} {t.months}
                  </span>
                </div>
              </div>

              <div className="text-center">
                <span className="text-white/40 text-xs tracking-wider uppercase block mb-2">
                  {isRTL ? "النهاية" : "End"}
                </span>
                <span className="text-white text-lg">
                  {new Date(duration.endDate).toLocaleDateString(
                    isRTL ? "ar-AE" : "en-US",
                    {
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, #c9a962 1px, transparent 1px), linear-gradient(to bottom, #c9a962 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>
    </section>
  );
}
