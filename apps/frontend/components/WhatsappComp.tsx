"use client";
import React, { useEffect, useRef, useState } from "react";
import WhatsAppSVG from "./SVG/WhatsAppSVG";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { cmsClient } from "@/lib/cms-client";
import { toast } from "sonner";

type Props = {
  whatsappTextImage?: string;
};

// CMS Images
const WHATSAPP_TEXT_IMAGE = "https://tupbs9ia8fmtwvjh.public.blob.vercel-storage.com/images/1760006894324-whatsapptext-BHZUJdi9GcCIxHfeUOR1lpOqmNSPHT.webp";

const WhatsappComp = ({ whatsappTextImage = WHATSAPP_TEXT_IMAGE }: Props) => {
  const textRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  gsap.registerPlugin(useGSAP);

  useEffect(() => {
    gsap.to(textRef.current, {
      rotation: 360,
      repeat: -1,
      duration: 10,
      ease: "linear",
    });
  }, []);

  const submitWhatsAppLead = async (userName: string) => {
    try {
      setIsSubmitting(true);

      // Submit lead to CRM
      await cmsClient.submitLead({
        name: userName,
        phone: "971523041482", // WhatsApp number they're contacting
        source: "whatsapp_click",
        locale: "en",
        message: "User clicked WhatsApp button",
      });

      // Google Tag Manager - Track WhatsApp click with conversion
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'whatsapp_click',
          button_location: 'floating_button',
          phone_number: '971523041482',
          user_name: userName,
          value: 500, // Lead value estimate
          currency: 'AED',
        });

        // Track as conversion
        (window as any).dataLayer.push({
          event: 'conversion',
          conversionType: 'whatsapp_contact',
          conversionValue: 500,
          currency: 'AED',
        });
      }

      // Redirect to WhatsApp
      window.open("https://api.whatsapp.com/send/?phone=971523041482&text&type=phone_number&app_absent=0", "_blank");

      // Close modal and reset
      setShowModal(false);
      setName("");

    } catch (error) {
      console.error("Failed to submit WhatsApp lead:", error);
      // Still open WhatsApp even if lead submission fails
      window.open("https://api.whatsapp.com/send/?phone=971523041482&text&type=phone_number&app_absent=0", "_blank");
      setShowModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      submitWhatsAppLead(name.trim());
    }
  };

  const handleSkip = () => {
    // Track anonymous click
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'whatsapp_click',
        button_location: 'floating_button',
        phone_number: '971523041482',
        user_name: 'anonymous',
        value: 200, // Lower value for anonymous
        currency: 'AED',
      });
    }

    window.open("https://api.whatsapp.com/send/?phone=971523041482&text&type=phone_number&app_absent=0", "_blank");
    setShowModal(false);
  };

  return (
    <>
      <a
        href="https://api.whatsapp.com/send/?phone=971523041482&text&type=phone_number&app_absent=0"
        target="_blank"
        onClick={handleWhatsAppClick}
      >
        <div className="fixed left-0 bottom-16 md:left-16 z-[8] ">
          <div className="flex justify-center items-center">
            <div className=" top-[50%] left-[50%] translate-x-[-50%]  ">
              <div className="w-32 h-32  absolute flex justify-center items-center translate-y-[-50%]">
                <WhatsAppSVG />
                <Image
                  className="w-full h-full object-contain absolute animate-spin-slow"
                  src={whatsappTextImage}
                  alt="WhatsApp Contact"
                  width={128}
                  height={128}
                />
              </div>
            </div>
          </div>
        </div>
      </a>

      {/* Quick Name Capture Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-SchnyderS mb-2">Quick Question!</h3>
              <p className="text-gray-600 font-Satoshi">May we know your name before connecting you to WhatsApp?</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-Satoshi"
                autoFocus
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-Satoshi transition-colors"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  disabled={!name.trim() || isSubmitting}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-Satoshi transition-colors"
                >
                  {isSubmitting ? "Connecting..." : "Continue"}
                </button>
              </div>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4 font-Satoshi">
              We'll save this for better service. You can skip if you prefer.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsappComp;
