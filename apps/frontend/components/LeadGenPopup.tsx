"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight, Sparkles, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import Image from "next/image";
import { SERVICE_IMAGES } from "@/lib/cms-images";

interface LeadGenPopupProps {
  trigger?: "exit" | "scroll" | "time" | "manual";
  delay?: number;
  showOnce?: boolean;
  className?: string;
  backgroundImage?: string;
}

export default function LeadGenPopup({
  trigger = "scroll",
  delay = 15000,
  showOnce = true,
  className,
  backgroundImage
}: LeadGenPopupProps) {
  const popupImage = backgroundImage || SERVICE_IMAGES.structureHotel;
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const locale = useLocale();

  const translations = {
    en: {
      badge: "Exclusive Offer",
      title: "Transform Your Space",
      subtitle: "Join 500+ luxury clients",
      description: "Get exclusive design insights, early access to new projects, and special offers.",
      placeholder: "Enter your email",
      button: "Get Started",
      submitting: "Sending...",
      closeAlt: "Close popup",
      guarantee: "No spam, unsubscribe anytime",
      successMessage: "Thank you! We'll be in touch soon.",
      errorMessage: "Something went wrong. Please try again.",
      invalidEmail: "Please enter a valid email address"
    },
    ar: {
      badge: "عرض حصري",
      title: "حوّل مساحتك",
      subtitle: "انضم إلى 500+ عميل فاخر",
      description: "احصل على رؤى تصميمية حصرية، وصول مبكر للمشاريع الجديدة، وعروض خاصة.",
      placeholder: "أدخل بريدك الإلكتروني",
      button: "ابدأ الآن",
      submitting: "جارٍ الإرسال...",
      closeAlt: "إغلاق النافذة",
      guarantee: "لا رسائل مزعجة، إلغاء الاشتراك في أي وقت",
      successMessage: "شكراً لك! سنتواصل معك قريباً.",
      errorMessage: "حدث خطأ. يرجى المحاولة مرة أخرى.",
      invalidEmail: "يرجى إدخال بريد إلكتروني صحيح"
    }
  };

  const t = translations[locale as keyof typeof translations] || translations.en;

  useEffect(() => {
    if (hasShown && showOnce) return;

    let timeoutId: NodeJS.Timeout;
    let scrollHandler: () => void;
    let mouseHandler: (e: MouseEvent) => void;

    const showPopup = () => {
      setIsVisible(true);
      setHasShown(true);
    };

    switch (trigger) {
      case "time":
        timeoutId = setTimeout(showPopup, delay);
        break;

      case "scroll":
        scrollHandler = () => {
          const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
          if (scrollPercentage > 50) {
            showPopup();
            window.removeEventListener("scroll", scrollHandler);
          }
        };
        window.addEventListener("scroll", scrollHandler);
        break;

      case "exit":
        mouseHandler = (e: MouseEvent) => {
          if (e.clientY <= 0) {
            showPopup();
            document.removeEventListener("mouseleave", mouseHandler);
          }
        };
        document.addEventListener("mouseleave", mouseHandler);
        break;
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (scrollHandler) window.removeEventListener("scroll", scrollHandler);
      if (mouseHandler) document.removeEventListener("mouseleave", mouseHandler);
    };
  }, [trigger, delay, hasShown, showOnce]);

  // ESC key handler
  useEffect(() => {
    if (!isVisible) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsVisible(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isVisible]);

  // Focus trap
  useEffect(() => {
    if (!isVisible) return;

    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleTab);
    firstElement?.focus();

    return () => window.removeEventListener("keydown", handleTab);
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsSubmitting(true);

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t.invalidEmail);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/lead-generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source: "lead_popup",
          timestamp: new Date().toISOString(),
          locale
        }),
      });

      if (response.ok) {
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "conversion", {
            event_category: "Lead Generation",
            event_label: "Popup Submission",
            value: 1
          });
        }

        setSuccess(true);
        setEmail("");

        // Close after showing success message
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(t.errorMessage);
      }
    } catch (err) {
      console.error("Lead submission error:", err);
      setError(t.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn"
      style={{
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(10px)",
      }}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
      aria-describedby="popup-description"
    >
      <div
        className={cn(
          "relative w-full max-w-lg overflow-hidden bg-white rounded-3xl shadow-2xl animate-fadeInUp",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          aria-label={t.closeAlt}
          type="button"
        >
          <X className="h-4 w-4 text-gray-700 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Image Section with Enhanced Overlay */}
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={popupImage}
            alt="Luxury interior design showcase"
            fill
            className="object-cover scale-105 transition-transform duration-700 hover:scale-100"
            priority
            sizes="(max-width: 768px) 100vw, 512px"
          />
          {/* Elegant gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Animated sparkle effect */}
          <div className="absolute top-6 left-6 motion-reduce:animate-none animate-pulse">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/90 backdrop-blur-sm rounded-full">
              <Sparkles className="h-3.5 w-3.5 text-white" aria-hidden="true" />
              <span className="text-xs font-medium text-white">{t.badge}</span>
            </div>
          </div>

          {/* Text Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h2 id="popup-title" className="text-3xl font-light font-SchnyderS mb-2 leading-tight">
              {t.title}
            </h2>
            <p className="text-sm text-white/90 font-medium">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          {/* Description */}
          <p id="popup-description" className="text-gray-600 text-sm mb-6 leading-relaxed" dir={locale === "ar" ? "rtl" : "ltr"}>
            {t.description}
          </p>

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 animate-fadeIn" role="alert">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-green-800 text-sm">{t.successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fadeIn" role="alert" aria-live="polite">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p id="email-error" className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className={cn(
              "relative transition-all duration-300 motion-reduce:transition-none",
              isFocused && "scale-[1.02]"
            )}>
              <label htmlFor="email-input" className="sr-only">
                {t.placeholder}
              </label>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={t.placeholder}
                required
                autoComplete="email"
                aria-required="true"
                aria-invalid={!!error}
                aria-describedby={error ? "email-error" : undefined}
                disabled={isSubmitting || success}
                className={cn(
                  "w-full px-5 py-4 bg-gray-50 border-2 rounded-xl",
                  "focus:outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-400",
                  "shadow-sm focus:shadow-md disabled:opacity-50 disabled:cursor-not-allowed",
                  error ? "border-red-300 focus:border-red-500" : "border-transparent focus:border-amber-500 focus:bg-white"
                )}
                dir={locale === "ar" ? "rtl" : "ltr"}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || success}
              className={cn(
                "group relative w-full px-6 py-4 bg-black hover:bg-gray-900",
                "text-white rounded-xl font-medium",
                "transition-all duration-300 motion-reduce:transition-none",
                "shadow-lg hover:shadow-xl hover:-translate-y-0.5",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
                "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2",
                "overflow-hidden"
              )}
            >
              {/* Button gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600/0 via-amber-600/20 to-amber-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                    <span>{t.submitting}</span>
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="h-5 w-5" aria-hidden="true" />
                    <span>{t.successMessage}</span>
                  </>
                ) : (
                  <>
                    <span>{t.button}</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300 motion-reduce:transition-none" aria-hidden="true" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Trust Badge */}
          <p className="text-center text-xs text-gray-400 mt-4">
            <span aria-hidden="true">🔒</span> {t.guarantee}
          </p>
        </div>

        {/* Decorative bottom accent */}
        <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" aria-hidden="true" />
      </div>
    </div>
  );
}
