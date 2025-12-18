"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Sparkles,
  User,
  Bot,
  RotateCcw,
  ChevronDown,
  Copy,
  Check,
  Trash2,
  Minimize2,
  Upload,
  Loader2,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { nanoid } from "nanoid";
import Image from "next/image";

/**
 * Enhanced AI Chatbot Component
 *
 * Features:
 * - Session persistence (localStorage)
 * - Keyboard shortcuts (Escape to close)
 * - Mobile responsive
 * - Smart suggestions
 * - Message timestamps
 * - Copy message feature
 * - Clear conversation
 * - Minimized preview mode
 * - Better typing indicator
 * - Retry on error
 */

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  error?: boolean;
  imageUrl?: string; // For displaying uploaded or generated images
  isImageUpload?: boolean; // Marks this as an image upload message
}

// Interior design upload flow states
type DesignFlowStep = "idle" | "collecting_email" | "awaiting_upload" | "processing" | "completed";

// Contact information
const PHONE = "971523041482";
const PHONE_DISPLAY = "+971 52 304 1482";
const EMAIL = "info@mouhajerdesign.com";
const WHATSAPP_LINK = `https://wa.me/${PHONE}?text=${encodeURIComponent("Hello! I'm interested in your design services.")}`;

// Storage key for localStorage
const STORAGE_KEY = "midc_chat_history";

// Pre-defined responses for common queries (accurate MIDC information)
const chatbotResponses: { [key: string]: string } = {
  greeting:
    "Hello! Welcome to Mouhajer International Design & Contracting (MIDC). We're a luxury design and construction company founded by Eng. Maher Mouhajer with over 20 years of experience. How can I help you today?",
  services:
    "Our 6 core pillars of service:\n\n• Design & Engineering\n• Civil Construction\n• Fit-Out & Execution\n• Manufacturing & Joinery\n• FF&E Specification\n• Project Management\n\nWe handle everything from concept to completion. Which area interests you?",
  projects:
    "We've completed 150+ projects including:\n\n• Address Boulevard VIP Suite (5-Star Award Winner)\n• Sheraton Abu Dhabi Hotel & Resort\n• Luxury villas & penthouses\n\nOur partners include Address Hotels, Grand Hyatt, and Abu Dhabi National Hotels. Would you like to see our portfolio?",
  consultation:
    "Let's schedule a complimentary consultation! Contact us:\n\n💬 [WhatsApp](" +
    WHATSAPP_LINK +
    ")\n📧 [Email](mailto:" +
    EMAIL +
    ")\n📞 [Call " +
    PHONE_DISPLAY +
    "](tel:+" +
    PHONE +
    ")\n\nWhat type of project are you considering?",
  pricing:
    "Pricing depends on your project's scope and specifications. We create bespoke solutions for each client.\n\nFor a personalized consultation:\n\n💬 [WhatsApp](" +
    WHATSAPP_LINK +
    ")\n📧 [Email](mailto:" +
    EMAIL +
    ")\n📞 [Call " +
    PHONE_DISPLAY +
    "](tel:+" +
    PHONE +
    ")",
  timeline:
    "Typical project timelines:\n\n• Concept Design: 2-3 weeks\n• Design Development: 3-4 weeks\n• Documentation: 4-6 weeks\n• Execution: Varies by project\n\nLet's discuss your timeline:\n💬 [WhatsApp](" +
    WHATSAPP_LINK +
    ")",
  contact:
    "Contact MIDC:\n\n💬 [WhatsApp " +
    PHONE_DISPLAY +
    "](" +
    WHATSAPP_LINK +
    ")\n📧 [" +
    EMAIL +
    "](mailto:" +
    EMAIL +
    ")\n📞 [Call " +
    PHONE_DISPLAY +
    "](tel:+" +
    PHONE +
    ")\n📍 Dubai & Abu Dhabi, UAE\n\nWe respond within 2 hours!",
  founder:
    "Our founder and CEO is Eng. Maher Mouhajer, who has over 20 years of experience in luxury design and construction. Under his leadership, MIDC has become a multiple-time 5-Star Winner at the International Property Awards. Would you like to know more about our services?",
  awards:
    "We're proud recipients of:\n\n🏆 International Property Awards (5-Star Winner):\n• Best Hotel Suite Interior Arabia 2023-2024\n• Best Hotel Suite Interior Dubai 2023-2024\n• Best Residential Interior Apartment Dubai 2023-2024\n• Best Hotel Interior Abu Dhabi 2022-2023\n\n🏆 Luxury Lifestyle Awards 2021\n\n✅ Triple ISO Certified (9001, 14001, 45001)",
  about:
    "Mouhajer International Design & Contracting (MIDC) was founded by Eng. Maher Mouhajer over 20 years ago.\n\nWe're a full-service design & construction firm specializing in luxury residential, commercial, and hospitality projects across Dubai and Abu Dhabi.\n\n✅ 150+ completed projects\n✅ Triple ISO certified\n✅ Multiple 5-Star International Property Awards\n\nHow can we help with your project?",
  default:
    "I'm here to help you with your design & construction needs! You can ask me about:\n\n• Our services\n• Projects & portfolio\n• Our founder\n• Awards & certifications\n• Consultations\n\nOr reach us directly:\n💬 [WhatsApp](" +
    WHATSAPP_LINK +
    ")\n📧 [Email](mailto:" +
    EMAIL +
    ")",
  outOfScope:
    "I'm here specifically to help with design and construction inquiries! I can tell you about MIDC's services, our projects, awards, or help you schedule a consultation.\n\nWhat would you like to know about our design & construction work?",
};

// Off-topic keywords that should trigger the outOfScope response
const offTopicKeywords = [
  "report", "analysis", "seo", "marketing", "website performance", "traffic",
  "analytics", "bounce rate", "conversion", "google", "facebook", "instagram",
  "social media strategy", "content strategy", "keywords", "ranking",
  "stock", "crypto", "bitcoin", "investment", "finance", "loan", "mortgage",
  "legal", "lawyer", "court", "lawsuit", "insurance", "medical", "doctor",
  "recipe", "cooking", "movie", "music", "game", "sports", "news",
  "politics", "election", "weather", "travel booking", "flight", "hotel booking",
  "code", "programming", "javascript", "python", "software development",
  "write me", "generate", "create a document", "write an essay", "write a report",
];

// Quick action buttons
const quickActions = [
  { id: "services", label: "Our Services", icon: "🎨" },
  { id: "projects", label: "View Projects", icon: "🏗️" },
  { id: "design_upload", label: "Redesign My Space", icon: "📷" },
  { id: "consultation", label: "Book Consultation", icon: "📅" },
];

// Smart suggestions based on context
const getSuggestions = (lastMessage: string): string[] => {
  const lower = lastMessage.toLowerCase();

  // After greeting
  if (lower.includes("welcome") || lower.includes("hello") || lower.includes("help you")) {
    return ["Tell me about your services", "Who is the founder?", "View your awards"];
  }

  // After services info
  if (lower.includes("service") || lower.includes("pillar") || lower.includes("offer")) {
    return ["View your projects", "How much does it cost?", "Book a consultation"];
  }

  // After project info
  if (lower.includes("project") || lower.includes("portfolio") || lower.includes("partner")) {
    return ["Tell me about your awards", "Book a consultation", "What's your process?"];
  }

  // After founder/about info
  if (lower.includes("maher") || lower.includes("founder") || lower.includes("years")) {
    return ["View your services", "What awards have you won?", "Contact info"];
  }

  // After awards info
  if (lower.includes("award") || lower.includes("iso") || lower.includes("certified")) {
    return ["View your projects", "Book a consultation", "Contact us"];
  }

  // After pricing discussion
  if (lower.includes("price") || lower.includes("cost") || lower.includes("scope")) {
    return ["Book a consultation", "Contact via WhatsApp", "View past projects"];
  }

  // After consultation offer
  if (lower.includes("consult") || lower.includes("meeting") || lower.includes("schedule")) {
    return ["What services do you offer?", "Tell me about the founder", "View your portfolio"];
  }

  // Default suggestions
  return ["Our services", "Who is the founder?", "View awards", "Contact us"];
};

// Convert markdown links to clickable HTML
function renderMessageWithLinks(text: string) {
  const parts = text.split(/(\[.*?\]\(.*?\))/g);
  return parts.map((part, index) => {
    const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
    if (linkMatch) {
      const [, linkText, url] = linkMatch;
      return (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[#c9a962] underline decoration-[#c9a962]/30 underline-offset-2 hover:text-[#c4a030] hover:decoration-[#c4a030]/50 transition-colors"
        >
          {linkText}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

// Format timestamp
function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId] = useState(() => nanoid());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);

  // Interior design upload flow state
  const [designFlowStep, setDesignFlowStep] = useState<DesignFlowStep>("idle");
  const [userEmail, setUserEmail] = useState("");
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setMessages(
          parsed.map((m: Message) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          }))
        );
      }
    } catch (e) {
      console.error("[Chatbot] Failed to load history:", e);
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (e) {
        console.error("[Chatbot] Failed to save history:", e);
      }
    }
  }, [messages]);

  // Scroll handling
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Check if user has scrolled up
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  // Initialize with greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addMessage("assistant", chatbotResponses.greeting);
      }, 500);
    }
  }, [isOpen, messages.length]);

  const addMessage = (role: "user" | "assistant", content: string, error = false) => {
    const newMessage: Message = {
      id: nanoid(),
      role,
      content,
      timestamp: new Date(),
      error,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const getFallbackResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // ============ CHECK OFF-TOPIC FIRST ============
    // This prevents the bot from responding to out-of-scope queries
    if (offTopicKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      return chatbotResponses.outOfScope;
    }

    // Greeting
    if (["hello", "hi", "hey", "good morning", "good evening"].some((g) => lowerMessage.includes(g))) {
      return chatbotResponses.greeting;
    }

    // Founder/CEO questions - IMPORTANT: Must come before general "who" questions
    if (["founder", "ceo", "owner", "maher", "who started", "who founded", "who is the"].some((f) => lowerMessage.includes(f))) {
      return chatbotResponses.founder;
    }

    // Awards and certifications
    if (["award", "certificate", "iso", "recognition", "achievement", "accredit"].some((a) => lowerMessage.includes(a))) {
      return chatbotResponses.awards;
    }

    // About the company
    if (["about", "company", "history", "background", "midc", "mouhajer"].some((a) => lowerMessage.includes(a))) {
      return chatbotResponses.about;
    }

    // Services
    if (["service", "offer", "do you", "what can", "provide", "specialize"].some((s) => lowerMessage.includes(s))) {
      return chatbotResponses.services;
    }

    // Projects
    if (["project", "portfolio", "work", "example", "client", "partner"].some((p) => lowerMessage.includes(p))) {
      return chatbotResponses.projects;
    }

    // Consultation
    if (["consult", "meeting", "appointment", "book", "schedule"].some((c) => lowerMessage.includes(c))) {
      return chatbotResponses.consultation;
    }

    // Pricing
    if (["price", "cost", "fee", "budget", "quote", "how much", "expensive"].some((p) => lowerMessage.includes(p))) {
      return chatbotResponses.pricing;
    }

    // Timeline
    if (["timeline", "how long", "duration", "when", "time", "delivery"].some((t) => lowerMessage.includes(t))) {
      return chatbotResponses.timeline;
    }

    // Contact
    if (["contact", "reach", "phone", "email", "whatsapp", "call", "address", "location"].some((c) => lowerMessage.includes(c))) {
      return chatbotResponses.contact;
    }

    // Beneficial/value questions
    if (["benefit", "help me", "why should", "what makes", "different", "advantage"].some((b) => lowerMessage.includes(b))) {
      return chatbotResponses.about;
    }

    return chatbotResponses.default;
  };

  const getBotResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, conversationId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.useFallback) {
          return getFallbackResponse(userMessage);
        }
        return data.response;
      }
    } catch (error) {
      console.error("[Chatbot] AI request failed:", error);
    }
    return getFallbackResponse(userMessage);
  };

  const handleSend = async (messageOverride?: string) => {
    const message = messageOverride || inputValue.trim();
    if (!message) return;

    setRetryMessage(null);
    addMessage("user", message);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await getBotResponse(message);
      addMessage("assistant", response);
    } catch (error) {
      console.error("[Chatbot] Error:", error);
      addMessage("assistant", "Sorry, I encountered an error. Please try again.", true);
      setRetryMessage(message);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRetry = () => {
    if (retryMessage) {
      // Remove the error message
      setMessages((prev) => prev.filter((m) => !m.error));
      handleSend(retryMessage);
    }
  };

  const handleQuickAction = (actionId: string) => {
    if (actionId === "design_upload") {
      startDesignFlow();
      return;
    }
    const action = quickActions.find((a) => a.id === actionId);
    if (action) {
      handleSend(action.label);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    handleSend(suggestion);
  };

  // ============ Interior Design Upload Flow ============

  const startDesignFlow = () => {
    setDesignFlowStep("collecting_email");
    addMessage(
      "assistant",
      "Exciting! Let me help you reimagine your space with AI. 🎨\n\nFirst, please enter your email address so we can send you the redesigned image and have our design engineer contact you within 15 minutes to discuss your project."
    );
  };

  const handleEmailSubmit = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      addMessage("assistant", "Please enter a valid email address.");
      return;
    }

    setUserEmail(email);
    setDesignFlowStep("awaiting_upload");
    addMessage("user", email);
    addMessage(
      "assistant",
      `Perfect! I've saved your email: ${email}\n\nNow, please upload a photo of your interior space. Our AI will analyze it and create a stunning redesigned version for you!\n\nClick the upload button below to select your image.`
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      addMessage("assistant", "Please upload a valid image file (JPG, PNG, etc.)");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      addMessage("assistant", "Image must be less than 10MB. Please choose a smaller file.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setUploadPreviewUrl(previewUrl);

    // Add user message with image preview
    const imageMessage: Message = {
      id: nanoid(),
      role: "user",
      content: "Uploaded interior photo",
      timestamp: new Date(),
      imageUrl: previewUrl,
      isImageUpload: true,
    };
    setMessages((prev) => [...prev, imageMessage]);

    // Start processing
    processDesignUpload(file);
  };

  const processDesignUpload = async (file: File) => {
    setDesignFlowStep("processing");
    setIsTyping(true);

    addMessage(
      "assistant",
      "Analyzing your space... Our AI is working on creating a beautiful redesign. This may take 30-60 seconds. ✨"
    );

    try {
      const formData = new FormData();
      formData.append("email", userEmail);
      formData.append("image", file);
      formData.append("prompt", "Redesign this interior space with a modern luxury aesthetic, incorporating elegant materials, sophisticated lighting, and premium finishes while maintaining the room's functional layout");
      formData.append("serviceCategory", "interior");
      formData.append("requestEngineerCallback", "true");

      const response = await fetch("/api/ai/redesign-interior", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process image");
      }

      setDesignFlowStep("completed");

      // Different message based on actual email status
      const isDemoMode = data.data.demoMode;
      const emailWasSent = data.data.emailSent;

      let successContent: string;
      if (emailWasSent) {
        successContent = isDemoMode
          ? `Request received! 📬\n\nWe've saved your interior photo and **an engineer will contact you within 15 minutes** to discuss your project and create a personalized redesign concept.\n\nCheck your email at ${userEmail} for confirmation.\n\nWould you like to:\n• [Schedule a consultation](${WHATSAPP_LINK})\n• [Call us now](tel:+${PHONE})`
          : `Your redesigned space is ready! 🎉\n\nWe've sent the full-resolution image to ${userEmail}.\n\n**An engineer will contact you within 15 minutes** to discuss your project and answer any questions.\n\nWould you like to:\n• [Schedule a consultation](${WHATSAPP_LINK})\n• [Call us now](tel:+${PHONE})`;
      } else {
        // Email failed - be honest about it
        successContent = `Request received! 📋\n\nWe've saved your interior photo. **An engineer will contact you within 15 minutes** to discuss your project.\n\n⚠️ We couldn't send the confirmation email, but don't worry - our team has been notified!\n\nContact us directly:\n• [WhatsApp](${WHATSAPP_LINK})\n• [Call us now](tel:+${PHONE})`;
      }

      // Add success message with generated image (or original in demo mode)
      const successMessage: Message = {
        id: nanoid(),
        role: "assistant",
        content: successContent,
        timestamp: new Date(),
        imageUrl: isDemoMode ? undefined : data.data.imageUrl,
      };
      setMessages((prev) => [...prev, successMessage]);

      // Reset flow after delay
      setTimeout(() => {
        resetDesignFlow();
      }, 5000);

    } catch (error) {
      console.error("[Chatbot] Design processing error:", error);
      addMessage(
        "assistant",
        `Sorry, there was an issue processing your image. Please try again or contact us directly:\n\n💬 [WhatsApp](${WHATSAPP_LINK})\n📞 [Call ${PHONE_DISPLAY}](tel:+${PHONE})`,
        true
      );
      resetDesignFlow();
    } finally {
      setIsTyping(false);
    }
  };

  const resetDesignFlow = () => {
    setDesignFlowStep("idle");
    setUserEmail("");
    if (uploadPreviewUrl) {
      URL.revokeObjectURL(uploadPreviewUrl);
    }
    setUploadPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const copyMessage = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error("[Chatbot] Copy failed:", e);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    setTimeout(() => {
      addMessage("assistant", chatbotResponses.greeting);
    }, 300);
  };

  const lastAssistantMessage = messages.filter((m) => m.role === "assistant").pop();
  const suggestions = lastAssistantMessage ? getSuggestions(lastAssistantMessage.content) : [];

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1.2 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open chat assistant"
            className="fixed bottom-6 right-24 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-950 shadow-2xl transition-all hover:scale-110 hover:bg-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
          >
            <Sparkles className="h-7 w-7 text-white" strokeWidth={1.5} />
            {messages.length === 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#c9a962] text-xs font-medium text-black">
                1
              </span>
            )}
            <motion.div
              className="absolute inset-0 -z-10 rounded-full bg-neutral-950"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "auto" : "min(600px, 85vh)",
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-label="Chat with Mouhajer Assistant"
            className="fixed bottom-6 right-6 z-50 flex w-[min(400px,calc(100vw-48px))] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            style={{ overscrollBehavior: "contain" }}
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-neutral-950 px-4 py-3 text-white sm:px-6 sm:py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 sm:h-10 sm:w-10">
                  <Bot className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-light sm:text-base">Mouhajer Assistant</h3>
                  <p className="text-[10px] text-white/60 sm:text-xs">
                    {isTyping ? "Typing..." : "Online • Ready to help"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 1 && (
                  <button
                    onClick={clearHistory}
                    aria-label="Clear conversation"
                    className="rounded-full p-2 transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                  className="rounded-full p-2 transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Minimize2 className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat (Esc)"
                  className="rounded-full p-2 transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Minimized State */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex flex-1 flex-col overflow-hidden"
                >
                  {/* Messages */}
                  <div
                    ref={messagesContainerRef}
                    onScroll={handleScroll}
                    onWheel={(e) => {
                      // Prevent scroll from propagating to the page
                      const container = e.currentTarget;
                      const { scrollTop, scrollHeight, clientHeight } = container;
                      const isAtTop = scrollTop === 0;
                      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

                      // Only stop propagation if we can scroll in that direction
                      if ((e.deltaY < 0 && !isAtTop) || (e.deltaY > 0 && !isAtBottom)) {
                        e.stopPropagation();
                      } else if ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom)) {
                        // At boundary, prevent default to stop page scroll
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                    className="relative flex-1 overflow-y-auto bg-neutral-50 p-3 sm:p-4"
                    style={{ maxHeight: "calc(85vh - 180px)", overscrollBehavior: "contain" }}
                  >
                    <div className="space-y-3 sm:space-y-4">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`group flex gap-2 sm:gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                        >
                          {/* Avatar */}
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8 ${
                              message.role === "assistant"
                                ? "bg-neutral-950 text-white"
                                : "bg-[#c9a962] text-black"
                            }`}
                          >
                            {message.role === "assistant" ? (
                              <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.5} />
                            ) : (
                              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.5} />
                            )}
                          </div>

                          {/* Message bubble */}
                          <div className="flex max-w-[80%] flex-col gap-1">
                            <div
                              className={`relative rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
                                message.role === "assistant"
                                  ? `bg-white text-neutral-900 shadow-sm ${message.error ? "border border-red-200" : ""}`
                                  : "bg-neutral-950 text-white"
                              }`}
                            >
                              {/* Image display */}
                              {message.imageUrl && (
                                <div className="mb-2 overflow-hidden rounded-lg">
                                  <Image
                                    src={message.imageUrl}
                                    alt={message.isImageUpload ? "Uploaded interior" : "AI redesigned space"}
                                    width={300}
                                    height={200}
                                    className="w-full h-auto object-cover"
                                    unoptimized={message.imageUrl.startsWith("blob:")}
                                  />
                                </div>
                              )}

                              <div className="text-xs font-light leading-relaxed whitespace-pre-line sm:text-sm">
                                {renderMessageWithLinks(message.content)}
                              </div>

                              {/* Copy button */}
                              {message.role === "assistant" && !message.imageUrl && (
                                <button
                                  onClick={() => copyMessage(message.content, message.id)}
                                  className="absolute -right-1 -top-1 rounded-full bg-white p-1 opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                                  aria-label="Copy message"
                                >
                                  {copiedId === message.id ? (
                                    <Check className="h-3 w-3 text-green-600" />
                                  ) : (
                                    <Copy className="h-3 w-3 text-neutral-400" />
                                  )}
                                </button>
                              )}
                            </div>

                            {/* Timestamp */}
                            <span
                              className={`text-[10px] text-neutral-400 ${message.role === "user" ? "text-right" : ""}`}
                            >
                              {formatTime(message.timestamp)}
                            </span>

                            {/* Retry button for errors */}
                            {message.error && retryMessage && (
                              <button
                                onClick={handleRetry}
                                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                              >
                                <RotateCcw className="h-3 w-3" />
                                Retry
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}

                      {/* Typing indicator */}
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex gap-2 sm:gap-3"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-950 text-white sm:h-8 sm:w-8">
                            <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.5} />
                          </div>
                          <div className="flex items-center gap-1 rounded-2xl bg-white px-4 py-3 shadow-sm">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                animate={{ y: [0, -4, 0] }}
                                transition={{
                                  duration: 0.6,
                                  repeat: Infinity,
                                  delay: i * 0.15,
                                }}
                                className="h-2 w-2 rounded-full bg-neutral-400"
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Quick actions (show when few messages) */}
                      {messages.length <= 1 && !isTyping && (
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          {quickActions.map((action) => (
                            <button
                              key={action.id}
                              onClick={() => handleQuickAction(action.id)}
                              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-left text-xs font-light transition-all hover:border-[#c9a962]/50 hover:shadow-md sm:text-sm"
                            >
                              <span className="mr-1.5">{action.icon}</span>
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Smart suggestions */}
                      {messages.length > 1 && !isTyping && suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {suggestions.slice(0, 3).map((suggestion, i) => (
                            <button
                              key={i}
                              onClick={() => handleSuggestion(suggestion)}
                              className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[10px] font-light text-neutral-600 transition-all hover:border-[#c9a962]/50 hover:text-neutral-900 sm:text-xs"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>

                    {/* Scroll to bottom button */}
                    <AnimatePresence>
                      {showScrollButton && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={scrollToBottom}
                          className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-neutral-950 p-2 text-white shadow-lg"
                          aria-label="Scroll to bottom"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Input Area - Dynamic based on design flow state */}
                  <div className="border-t border-neutral-200 bg-white p-3 sm:p-4">
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    {/* Email Collection State */}
                    {designFlowStep === "collecting_email" && (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleEmailSubmit(inputValue);
                          setInputValue("");
                        }}
                        className="flex gap-2"
                      >
                        <div className="relative flex-1">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                          <input
                            ref={inputRef}
                            type="email"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Enter your email address..."
                            aria-label="Email input"
                            className="w-full rounded-lg border border-neutral-200 py-2 pl-10 pr-3 text-sm font-light outline-none transition-colors focus:border-[#c9a962] focus-visible:ring-2 focus-visible:ring-[#c9a962]/20"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={!inputValue.trim()}
                          className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c9a962] text-white transition-all hover:bg-[#c4a030] disabled:opacity-30"
                        >
                          <Send className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </form>
                    )}

                    {/* Image Upload State */}
                    {designFlowStep === "awaiting_upload" && (
                      <div className="space-y-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-dashed border-[#c9a962]/50 bg-[#c9a962]/5 py-4 text-sm font-medium text-neutral-700 transition-all hover:border-[#c9a962] hover:bg-[#c9a962]/10"
                        >
                          <Upload className="h-5 w-5 text-[#c9a962]" />
                          <span>Upload Interior Photo</span>
                        </button>
                        <button
                          onClick={resetDesignFlow}
                          className="w-full text-xs text-neutral-400 hover:text-neutral-600"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {/* Processing State */}
                    {designFlowStep === "processing" && (
                      <div className="flex items-center justify-center gap-3 py-3">
                        <Loader2 className="h-5 w-5 animate-spin text-[#c9a962]" />
                        <span className="text-sm text-neutral-600">
                          AI is redesigning your space...
                        </span>
                      </div>
                    )}

                    {/* Completed State */}
                    {designFlowStep === "completed" && (
                      <div className="flex items-center justify-center gap-2 py-3 text-green-600">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="text-sm font-medium">Design sent to your email!</span>
                      </div>
                    )}

                    {/* Normal Chat Input */}
                    {designFlowStep === "idle" && (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSend();
                        }}
                        className="flex gap-2"
                      >
                        {/* Redesign My Space button - always visible */}
                        <button
                          type="button"
                          onClick={startDesignFlow}
                          disabled={isTyping}
                          aria-label="Redesign my space with AI"
                          title="Upload a photo to redesign your space"
                          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#c9a962]/50 bg-[#c9a962]/10 text-[#c9a962] transition-all hover:bg-[#c9a962]/20 hover:border-[#c9a962] disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a962] focus-visible:ring-offset-2"
                        >
                          <Upload className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                        </button>
                        <input
                          ref={inputRef}
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Type your message..."
                          aria-label="Chat message input"
                          disabled={isTyping}
                          className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-light outline-none transition-colors focus:border-neutral-400 focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-1 disabled:opacity-50"
                        />
                        <button
                          type="submit"
                          disabled={!inputValue.trim() || isTyping}
                          aria-label="Send message"
                          className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-950 text-white transition-all hover:bg-neutral-900 disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
                        >
                          <Send className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                        </button>
                      </form>
                    )}

                    <p className="mt-2 text-center text-[10px] text-neutral-400">
                      Press <kbd className="rounded bg-neutral-100 px-1">Esc</kbd> to close
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AIChatbot;
