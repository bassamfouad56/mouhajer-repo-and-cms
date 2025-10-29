"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";

interface WhatsAppFloatProps {
  phoneNumber?: string;
  position?: "bottom-right" | "bottom-left";
  showAfterSeconds?: number;
}

export default function WhatsAppFloat({
  phoneNumber = "971521341482", // Mouhajer WhatsApp number
  position = "bottom-right",
  showAfterSeconds = 3
}: WhatsAppFloatProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ id: number; text: string; isUser: boolean }>>([]);
  const locale = useLocale();

  const translations = {
    en: {
      startChat: "Start Chat",
      chatWithUs: "Chat with us",
      getQuote: "Get Free Quote",
      online: "Typically replies in few minutes",
      quickReplies: [
        "🏠 I need interior design consultation",
        "💰 What are your pricing packages?",
        "📋 I want to see your portfolio",
        "📞 Schedule a call with designer",
        "🎨 Custom design services inquiry"
      ],
      typeMessage: "Type your message here...",
      send: "Send",
      greeting: "Hello! 👋 Welcome to Mouhajer International Design.\n\nHow can we help you transform your space today?"
    },
    ar: {
      startChat: "ابدأ المحادثة",
      chatWithUs: "تحدث معنا",
      getQuote: "احصل على عرض مجاني",
      online: "نرد عادة في غضون دقائق",
      quickReplies: [
        "🏠 أحتاج استشارة للتصميم الداخلي",
        "💰 ما هي باقات الأسعار لديكم؟",
        "📋 أريد رؤية أعمالكم",
        "📞 حجز مكالمة مع المصمم",
        "🎨 استفسار عن خدمات التصميم المخصصة"
      ],
      typeMessage: "اكتب رسالتك هنا...",
      send: "إرسال",
      greeting: "مرحباً! 👋 أهلاً بك في مهاجر الدولية للتصميم.\n\nكيف يمكننا مساعدتك في تحويل مساحتك اليوم؟"
    }
  };

  const t = translations[locale as keyof typeof translations] || translations.en;

  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4"
  };

  const isRTL = locale === "ar";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, showAfterSeconds * 1000);

    return () => clearTimeout(timer);
  }, [showAfterSeconds]);

  const handleQuickReply = (message: string) => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const openWhatsApp = (message?: string) => {
    const defaultMessage = t.greeting;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message || defaultMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed z-[9998] ${positionClasses[position]}`}>
      {/* Chat Widget */}
      {isChatOpen && (
        <div className={`mb-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-slideInUp ${isRTL ? 'font-arabic' : ''}`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{t.chatWithUs}</h3>
                  <p className="text-xs text-green-100">{t.online}</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-64 p-4 bg-gray-50 overflow-y-auto">
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm">
                <p className="text-sm text-gray-700 whitespace-pre-line">{t.greeting}</p>
              </div>

              {/* Quick Replies */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium">Quick replies:</p>
                {t.quickReplies.slice(0, 3).map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="w-full text-left p-2 bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-sm group"
                  >
                    <span className="flex items-center justify-between">
                      {reply}
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={() => openWhatsApp()}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center space-x-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{t.startChat}</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <div className="relative">
        {/* Pulse Animation */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-30"></div>

        {/* Main Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="relative w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
          aria-label={t.startChat}
        >
          {isChatOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <MessageCircle className="h-7 w-7 text-white group-hover:scale-110 transition-transform" />
          )}

          {/* Message Count Badge (optional) */}
          {!isChatOpen && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-xs text-white font-bold">1</span>
            </div>
          )}
        </button>

        {/* Tooltip */}
        {!isChatOpen && (
          <div className={`absolute ${position === 'bottom-right' ? 'right-16' : 'left-16'} bottom-2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none`}>
            <span>{t.chatWithUs}</span>
            <div className={`absolute top-1/2 -translate-y-1/2 ${position === 'bottom-right' ? '-right-1' : '-left-1'} w-2 h-2 bg-gray-900 rotate-45`}></div>
          </div>
        )}
      </div>
    </div>
  );
}

// Add slide animation to global CSS
export const WhatsAppStyles = `
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;