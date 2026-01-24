"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, X, Clock, Video, MapPin, Loader2 } from "lucide-react";

interface CalendlyEmbedProps {
  url: string; // Calendly URL (e.g., "https://calendly.com/midc/consultation")
  className?: string;
}

/**
 * Inline Calendly Embed
 *
 * Embeds Calendly directly into the page
 */
export function CalendlyInline({ url, className = "" }: CalendlyEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Calendly script
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className={`min-h-[700px] ${className}`}>
      {!isLoaded && (
        <div className="flex h-[700px] items-center justify-center rounded-xl bg-neutral-50">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-[#8f7852]" />
            <p className="text-neutral-500">Loading calendar...</p>
          </div>
        </div>
      )}
      <div
        className="calendly-inline-widget"
        data-url={url}
        style={{ minWidth: "320px", height: "700px" }}
      />
    </div>
  );
}

/**
 * Calendly Popup Button
 *
 * Opens Calendly in a popup modal
 */
interface CalendlyPopupProps {
  url: string;
  buttonText?: string;
  buttonClassName?: string;
}

export function CalendlyPopupButton({
  url,
  buttonText = "Schedule a Consultation",
  buttonClassName = "",
}: CalendlyPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load Calendly script if needed
      if (!(window as any).Calendly) {
        const script = document.createElement("script");
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        script.onload = () => setIsLoaded(true);
        document.body.appendChild(script);
      } else {
        setIsLoaded(true);
      }
    }
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    // Prevent body scroll
    document.body.style.overflow = "hidden";
  };

  const handleClose = () => {
    setIsOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className={`inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-6 py-3 font-medium text-white transition-all hover:bg-neutral-800 ${buttonClassName}`}
      >
        <Calendar className="h-5 w-5" />
        {buttonText}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 z-[101] flex items-center justify-center md:inset-8"
            >
              <div className="relative h-full w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
                  <div>
                    <h3 className="text-lg font-medium text-neutral-900">
                      Schedule a Consultation
                    </h3>
                    <p className="text-sm text-neutral-500">
                      Choose a time that works for you
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Calendly embed */}
                <div className="h-[calc(100%-73px)] overflow-auto">
                  {!isLoaded ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-[#8f7852]" />
                        <p className="text-neutral-500">Loading calendar...</p>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="calendly-inline-widget h-full"
                      data-url={url}
                      style={{ minWidth: "320px", height: "100%" }}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Consultation Booking Card
 *
 * A beautiful card that explains the consultation and links to Calendly
 */
interface ConsultationCardProps {
  calendlyUrl: string;
  className?: string;
}

export function ConsultationBookingCard({
  calendlyUrl,
  className = "",
}: ConsultationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 ${className}`}
    >
      <div className="p-8">
        {/* Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#8f7852]/10 px-3 py-1.5">
          <Calendar className="h-4 w-4 text-[#8f7852]" />
          <span className="text-xs font-medium text-[#8f7852]">
            Free Consultation
          </span>
        </div>

        {/* Content */}
        <h3 className="mb-3 text-2xl font-light text-white">
          Book Your Design Consultation
        </h3>
        <p className="mb-6 text-neutral-400">
          Discuss your project with our award-winning design team. Get expert
          advice, explore possibilities, and receive a preliminary estimate.
        </p>

        {/* Features */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Clock, text: "30 min session" },
            { icon: Video, text: "Video or in-person" },
            { icon: MapPin, text: "Dubai & Abu Dhabi" },
          ].map(({ icon: Icon, text }, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm text-neutral-300"
            >
              <Icon className="h-4 w-4 text-[#8f7852]" />
              {text}
            </div>
          ))}
        </div>

        {/* CTA */}
        <CalendlyPopupButton
          url={calendlyUrl}
          buttonText="Book Free Consultation"
          buttonClassName="w-full justify-center bg-[#8f7852] text-black hover:bg-[#c4a030]"
        />

        {/* Trust text */}
        <p className="mt-4 text-center text-xs text-neutral-500">
          No obligation • 100% free • Reply within 24 hours
        </p>
      </div>
    </motion.div>
  );
}

/**
 * Pre-configured MIDC Consultation Button
 */
export function MIDCConsultationButton({
  className = "",
}: {
  className?: string;
}) {
  // Replace with actual MIDC Calendly URL
  const calendlyUrl = "https://calendly.com/mouhajerdesign/consultation";

  return (
    <CalendlyPopupButton
      url={calendlyUrl}
      buttonText="Book Free Consultation"
      buttonClassName={className}
    />
  );
}

export default CalendlyInline;
