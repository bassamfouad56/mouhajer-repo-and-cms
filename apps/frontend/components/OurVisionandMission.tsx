"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Sparkles, Target, Heart, Award } from "lucide-react";
import { SERVICE_IMAGES } from "@/lib/cms-images";

// Icon mapping
const iconMap: { [key: string]: any } = {
  Sparkles,
  Target,
  Heart,
  Award,
};

interface Highlight {
  icon: string; // Icon name as string (e.g., "Sparkles")
  title: string;
  text: string;
}

interface ContentSection {
  title: string;
  subtitle: string;
  description: string;
  highlights: Highlight[];
}

interface VisionMissionData {
  vision: ContentSection;
  mission: ContentSection;
}

type Props = {
  visionMissionData?: VisionMissionData;
  visionImage?: string;
  missionImage?: string;
};

const OurVisionandMission = ({ visionMissionData, visionImage, missionImage }: Props) => {
  const props = { visionImage, missionImage };
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<"vision" | "mission">("vision");

  // Default fallback content
  const defaultContent: VisionMissionData = {
    vision: {
      title: locale === "en" ? "Our Vision" : "رؤيتنا",
      subtitle: locale === "en" ? "Crafting Timeless Excellence" : "صياغة التميز الخالد",
      description:
        locale === "en"
          ? "We create timeless, distinctive designs with imagination and refined taste, placing every client at the heart of the process. Our vision is to be the most recognized name in luxury interior design across the Middle East."
          : "إنشاء تصاميم مميّزة وتحتفظ برونقها وفخامتها على مر الزمن، تتمتع بالخيال والذوق الرفيع، وتضع كل عميل من عملائنا في قلب عملية التصميم. رؤيتنا هي أن نكون الاسم الأكثر شهرة في التصميم الداخلي الفاخر في جميع أنحاء الشرق الأوسط.",
      highlights: [
        {
          icon: "Sparkles",
          title: locale === "en" ? "Timeless Design" : "تصميم خالد",
          text: locale === "en" ? "Creating spaces that remain elegant and relevant for generations" : "إنشاء مساحات تظل أنيقة وذات صلة لأجيال",
        },
        {
          icon: "Heart",
          title: locale === "en" ? "Client-Centric" : "يركز على العميل",
          text: locale === "en" ? "Placing your unique vision and needs at the core of every project" : "وضع رؤيتك واحتياجاتك الفريدة في قلب كل مشروع",
        },
        {
          icon: "Award",
          title: locale === "en" ? "Award-Winning" : "حائز على جوائز",
          text: locale === "en" ? "Recognized excellence in luxury residential and commercial design" : "التميز المعترف به في التصميم السكني والتجاري الفاخر",
        },
      ],
    },
    mission: {
      title: locale === "en" ? "Our Mission" : "رسالتنا",
      subtitle: locale === "en" ? "Dubai's Premier Design Firm" : "شركة التصميم الرائدة في دبي",
      description:
        locale === "en"
          ? "Our mission is to inspire, fulfill, and uplift through creative concepts and unique designs, providing unparalleled support from project inception to aftercare. As Dubai's leading interior design and contracting firm, we stand by your side throughout the entire journey."
          : "الإلهام والارتقاء بالمفاهيم الإبداعية والتصاميم الفريدة من نوعها، بدءاً من بداية المشروع، وحتى الدعم الاستثنائي بعد التسليم. نبقى إلى جانبك طوال رحلة التصميم. فهذا أقل ما يمكن توقعه من أفضل شركات التصميم الداخلي والمقاولات الرائدة في دبي.",
      highlights: [
        {
          icon: "Target",
          title: locale === "en" ? "Full-Service Excellence" : "التميز في الخدمة الشاملة",
          text: locale === "en" ? "Complete interior design and contracting solutions under one roof" : "حلول التصميم الداخلي والمقاولات الكاملة تحت سقف واحد",
        },
        {
          icon: "Sparkles",
          title: locale === "en" ? "End-to-End Support" : "دعم شامل",
          text: locale === "en" ? "From initial concept to final delivery and beyond" : "من المفهوم الأولي إلى التسليم النهائي وما بعده",
        },
        {
          icon: "Award",
          title: locale === "en" ? "Dubai's Finest" : "الأفضل في دبي",
          text: locale === "en" ? "The most trusted name in luxury interior design and contracting" : "الاسم الأكثر ثقة في التصميم الداخلي والمقاولات الفاخرة",
        },
      ],
    },
  };

  const t = visionMissionData || defaultContent;
  const isRTL = locale === "ar";
  const currentContent = activeTab === "vision" ? t.vision : t.mission;

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mouhajer Interior Design",
    description: currentContent.description,
    url: typeof window !== "undefined" ? window.location.origin : "",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: "25.2048",
        longitude: "55.2708",
      },
    },
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section
        className="relative bg-[#202020] overflow-hidden"
        itemScope
        itemType="https://schema.org/AboutPage"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5" aria-hidden="true">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEyYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMTIgMTJjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEyYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMTIgMTJjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        </div>

        <div className="container mx-auto px-4 py-24 lg:py-32 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 lg:mb-24"
          >
            <motion.div
              className="inline-block mb-6"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/50">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h2 className="text-4xl lg:text-6xl font-SchnyderS font-light text-white mb-4">
              {isRTL ? "رؤيتنا ورسالتنا" : "Vision & Mission"}
            </h2>
            <p className="text-white/60 text-lg lg:text-xl max-w-2xl mx-auto">
              {isRTL
                ? "الأسس التي تقود تميزنا في التصميم الداخلي الفاخر"
                : "The foundation of our excellence in luxury interior design"}
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12 lg:mb-16">
            <div className="inline-flex bg-white/5 backdrop-blur-sm rounded-full p-2 border border-white/10">
              <button
                onClick={() => setActiveTab("vision")}
                className={`px-8 py-3 rounded-full text-base lg:text-lg font-light transition-all duration-300 ${
                  activeTab === "vision"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30"
                    : "text-white/60 hover:text-white/80"
                }`}
                aria-pressed={activeTab === "vision"}
              >
                {t.vision.title}
              </button>
              <button
                onClick={() => setActiveTab("mission")}
                className={`px-8 py-3 rounded-full text-base lg:text-lg font-light transition-all duration-300 ${
                  activeTab === "mission"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30"
                    : "text-white/60 hover:text-white/80"
                }`}
                aria-pressed={activeTab === "mission"}
              >
                {t.mission.title}
              </button>
            </div>
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
            >
              {/* Left Column - Image */}
              <motion.div
                initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="relative order-2 lg:order-1"
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-500/30 via-transparent to-transparent z-10" />

                  {/* Main Image */}
                  <Image
                    src={activeTab === "vision"
                      ? (props.visionImage || SERVICE_IMAGES.reesInterior)
                      : (props.missionImage || SERVICE_IMAGES.restaurant)}
                    alt={`${currentContent.title} - Luxury interior design by Mouhajer in Dubai`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={activeTab === "vision"}
                  />

                  {/* Decorative Elements */}
                  <div className="absolute top-0 left-0 w-full h-full border-2 border-amber-500/20 rounded-2xl" />
                  <div className="absolute -top-4 -left-4 w-24 h-24 border-l-2 border-t-2 border-amber-500/40 rounded-tl-2xl" />
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-amber-500/40 rounded-br-2xl" />
                </div>

                {/* Floating Stats */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="absolute -bottom-8 -right-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 shadow-xl shadow-amber-500/30 backdrop-blur-sm"
                >
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-1">15+</div>
                    <div className="text-white/90 text-sm">
                      {isRTL ? "سنوات من التميز" : "Years Excellence"}
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Column - Content */}
              <article
                className="order-1 lg:order-2"
                itemProp="about"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <motion.div
                  initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  {/* Title */}
                  <h1
                    className="text-4xl lg:text-5xl xl:text-6xl font-SchnyderS font-light text-white mb-4"
                    itemProp="headline"
                  >
                    {currentContent.title}
                  </h1>

                  {/* Subtitle */}
                  <h2
                    className="text-xl lg:text-2xl text-amber-400 font-light mb-8"
                    itemProp="alternativeHeadline"
                  >
                    {currentContent.subtitle}
                  </h2>

                  {/* Divider */}
                  <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-transparent mb-8" />

                  {/* Description */}
                  <p
                    className="text-white/80 text-lg lg:text-xl leading-relaxed mb-12 font-light"
                    itemProp="description"
                  >
                    {currentContent.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-6">
                    {currentContent.highlights.map((highlight, index) => {
                      const IconComponent = iconMap[highlight.icon] || Sparkles;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="flex items-start gap-4 group"
                        >
                          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/20 group-hover:border-amber-500/40 transition-all duration-300">
                            <IconComponent className="w-6 h-6 text-amber-400" />
                          </div>
                          <div>
                            <h3 className="text-white font-light text-lg mb-1">
                              {highlight.title}
                            </h3>
                            <p className="text-white/60 font-light">
                              {highlight.text}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </article>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10" aria-hidden="true">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill="url(#gradient)"
            />
            <defs>
              <linearGradient
                id="gradient"
                x1="0"
                y1="0"
                x2="1440"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#F59E0B" stopOpacity="0.3" />
                <stop offset="1" stopColor="#D97706" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>
    </>
  );
};

export default OurVisionandMission;
