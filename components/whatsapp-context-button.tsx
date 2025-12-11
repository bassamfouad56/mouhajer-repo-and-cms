"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { WhatsAppButton } from "./whatsapp-button";

/**
 * Context-Aware WhatsApp Button
 *
 * Automatically generates relevant pre-filled messages based on the current page.
 * This increases conversion by making the inquiry more specific and actionable.
 */

interface ContextMessages {
  [key: string]: {
    pattern: RegExp;
    message: string;
  };
}

const contextMessages: ContextMessages = {
  // Project pages
  projectDetail: {
    pattern: /^\/(?:en|ar)?\/projects\/([^/]+)$/,
    message: "Hi! I saw your project and I'm interested in something similar for my space. Can we discuss?",
  },
  projects: {
    pattern: /^\/(?:en|ar)?\/projects\/?$/,
    message: "Hello! I've been looking at your portfolio and would love to discuss a potential project.",
  },

  // Service pages
  serviceDetail: {
    pattern: /^\/(?:en|ar)?\/services\/([^/]+)$/,
    message: "Hi! I'm interested in your {service} services. Can you tell me more about the process?",
  },
  services: {
    pattern: /^\/(?:en|ar)?\/services\/?$/,
    message: "Hello! I'd like to learn more about your design and construction services.",
  },

  // Industry pages
  residential: {
    pattern: /^\/(?:en|ar)?\/industries\/.*residential/,
    message: "Hi! I'm looking for interior design services for my villa/apartment. Can we discuss?",
  },
  commercial: {
    pattern: /^\/(?:en|ar)?\/industries\/.*commercial/,
    message: "Hello! I need commercial interior design for my business. Would love to discuss.",
  },
  hospitality: {
    pattern: /^\/(?:en|ar)?\/industries\/.*hospitality/,
    message: "Hi! I'm interested in your hospitality design services for my hotel/restaurant project.",
  },

  // Contact & Consultation
  contact: {
    pattern: /^\/(?:en|ar)?\/contact/,
    message: "Hi! I'd like to schedule a consultation to discuss my design project.",
  },
  consultation: {
    pattern: /^\/(?:en|ar)?\/.*consultation/,
    message: "Hello! I'd like to book a free design consultation. When are you available?",
  },

  // About & Company
  about: {
    pattern: /^\/(?:en|ar)?\/about/,
    message: "Hi! I've read about your company and am impressed. I'd like to discuss a project.",
  },
  founder: {
    pattern: /^\/(?:en|ar)?\/about\/founder/,
    message: "Hello! I'd love to discuss working with MIDC on my upcoming project.",
  },

  // Blog
  blog: {
    pattern: /^\/(?:en|ar)?\/blog/,
    message: "Hi! I've been reading your blog and have some questions about design for my space.",
  },

  // Showroom
  showroom: {
    pattern: /^\/(?:en|ar)?\/showroom/,
    message: "Hello! I'd like to visit your showroom. What are your opening hours?",
  },

  // Calculator/Quiz (high intent)
  calculator: {
    pattern: /^\/(?:en|ar)?\/.*calculator/,
    message: "Hi! I just used your budget calculator. I'd like to get a detailed quote for my project.",
  },
  quiz: {
    pattern: /^\/(?:en|ar)?\/.*quiz/,
    message: "Hello! I completed your design style quiz and would love to discuss how MIDC can bring my vision to life.",
  },

  // Homepage
  home: {
    pattern: /^\/(?:en|ar)?\/?$/,
    message: "Hello! I'm interested in your design services. Can we schedule a consultation?",
  },
};

// Service name extraction for dynamic messages
const serviceNameMap: Record<string, string> = {
  "interior-architecture": "Interior Architecture",
  "fit-out-execution": "Fit-Out & Execution",
  "manufacturing-joinery": "Manufacturing & Joinery",
  "civil-construction": "Civil Construction",
  "mep-engineering": "MEP Engineering",
  "handover-maintenance": "Handover & Maintenance",
};

interface WhatsAppContextButtonProps {
  phoneNumber?: string;
  position?: "bottom-right" | "bottom-left";
  customMessage?: string; // Override automatic message
}

export function WhatsAppContextButton({
  phoneNumber = "971523041482", // MIDC phone number
  position = "bottom-right",
  customMessage,
}: WhatsAppContextButtonProps) {
  const pathname = usePathname();

  const message = useMemo(() => {
    // If custom message provided, use it
    if (customMessage) return customMessage;

    // Try to match pathname to context
    for (const [key, config] of Object.entries(contextMessages)) {
      const match = pathname?.match(config.pattern);
      if (match) {
        let msg = config.message;

        // Handle dynamic service names
        if (key === "serviceDetail" && match[1]) {
          const serviceName = serviceNameMap[match[1]] || match[1].replace(/-/g, " ");
          msg = msg.replace("{service}", serviceName);
        }

        return msg;
      }
    }

    // Default message
    return "Hello! I'm interested in your design services.";
  }, [pathname, customMessage]);

  return <WhatsAppButton phoneNumber={phoneNumber} message={message} position={position} />;
}

/**
 * Project-Specific WhatsApp CTA
 *
 * Use this on project detail pages for even more targeted messaging.
 */
interface ProjectWhatsAppCTAProps {
  projectTitle: string;
  projectCategory?: string;
  className?: string;
}

export function ProjectWhatsAppCTA({
  projectTitle,
  projectCategory,
  className = "",
}: ProjectWhatsAppCTAProps) {
  const phoneNumber = "971523041482";
  const message = `Hi! I saw your "${projectTitle}" project${projectCategory ? ` (${projectCategory})` : ""} and I'd love to discuss something similar for my space.`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 font-medium text-white transition-all hover:bg-[#20BD5A] ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
      Discuss This Project
    </a>
  );
}

export default WhatsAppContextButton;
