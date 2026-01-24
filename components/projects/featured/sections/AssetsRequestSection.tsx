"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Image, Video, FileText, Download, ExternalLink } from "lucide-react";

interface AssetLink {
  type: "images" | "video" | "document" | "folder";
  label: string;
  url?: string;
  description?: string;
}

interface AssetsRequestSectionProps {
  assets?: AssetLink[];
  projectTitle?: string;
  contactEmail?: string;
  locale: string;
}

export function AssetsRequestSection({
  assets = [],
  projectTitle,
  contactEmail = "assets@mouhajer.com",
  locale,
}: AssetsRequestSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const isRTL = locale === "ar";

  const labels = {
    en: {
      title: "Project Assets",
      subtitle: "Access project media and documentation",
      requestAssets: "Request Assets",
      requestDescription:
        "For high-resolution images, videos, and additional project documentation, please contact our team.",
      contactTeam: "Contact Team",
      available: "Available Assets",
      images: "Photography",
      video: "Video Content",
      document: "Documentation",
      folder: "Asset Folder",
      viewAsset: "View",
      downloadAsset: "Download",
    },
    ar: {
      title: "أصول المشروع",
      subtitle: "الوصول إلى وسائط المشروع والوثائق",
      requestAssets: "طلب الأصول",
      requestDescription:
        "للحصول على صور عالية الدقة وفيديوهات ووثائق إضافية للمشروع، يرجى التواصل مع فريقنا.",
      contactTeam: "تواصل مع الفريق",
      available: "الأصول المتاحة",
      images: "التصوير الفوتوغرافي",
      video: "محتوى الفيديو",
      document: "الوثائق",
      folder: "مجلد الأصول",
      viewAsset: "عرض",
      downloadAsset: "تحميل",
    },
  };

  const t = labels[locale as keyof typeof labels] || labels.en;

  const getIcon = (type: AssetLink["type"]) => {
    switch (type) {
      case "images":
        return Image;
      case "video":
        return Video;
      case "document":
        return FileText;
      case "folder":
        return Download;
      default:
        return FileText;
    }
  };

  const getTypeLabel = (type: AssetLink["type"]) => {
    switch (type) {
      case "images":
        return t.images;
      case "video":
        return t.video;
      case "document":
        return t.document;
      case "folder":
        return t.folder;
      default:
        return type;
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-white"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-6 md:px-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-4"
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

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-neutral-500 mb-12"
        >
          {t.subtitle}
        </motion.p>

        {/* Available Assets */}
        {assets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h3 className="text-neutral-400 text-xs tracking-wider uppercase mb-6">
              {t.available}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {assets.map((asset, index) => {
                const Icon = getIcon(asset.type);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="group"
                  >
                    <div className="flex items-center gap-4 p-4 border border-neutral-200 rounded-lg hover:border-[#8f7852]/50 transition-colors">
                      <div className="w-12 h-12 rounded-lg bg-[#8f7852]/10 flex items-center justify-center group-hover:bg-[#8f7852]/20 transition-colors">
                        <Icon className="w-6 h-6 text-[#8f7852]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900">
                          {asset.label}
                        </p>
                        <p className="text-neutral-500 text-sm">
                          {getTypeLabel(asset.type)}
                        </p>
                      </div>
                      {asset.url && (
                        <a
                          href={asset.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full border border-[#8f7852]/30 flex items-center justify-center text-[#8f7852] hover:bg-[#8f7852] hover:text-white transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Request Assets Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative p-8 md:p-12 bg-neutral-50 rounded-2xl overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#8f7852,transparent_50%)]" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="flex-1">
              <h3 className="font-SchnyderS text-2xl text-neutral-900 mb-3">
                {t.requestAssets}
              </h3>
              <p className="text-neutral-600">{t.requestDescription}</p>
            </div>
            <a
              href={`mailto:${contactEmail}?subject=${encodeURIComponent(`Asset Request: ${projectTitle || "Featured Project"}`)}`}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#8f7852] text-white rounded-full hover:bg-[#b8984f] transition-colors whitespace-nowrap"
            >
              <span className="tracking-wider">{t.contactTeam}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Decorative Corner */}
          <div className="absolute top-4 right-4 w-12 h-12 border-r border-t border-[#8f7852]/20 rounded-tr-lg" />
        </motion.div>
      </div>
    </section>
  );
}
