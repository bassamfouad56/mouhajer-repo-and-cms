'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

/**
 * WhatsApp Floating Button Component
 *
 * Always-visible quick link to WhatsApp chat
 * Professional, minimalist design matching the luxury aesthetic
 */

interface WhatsAppButtonProps {
  phoneNumber?: string; // Phone number in international format (e.g., "971501234567")
  message?: string; // Pre-filled message
  position?: 'bottom-right' | 'bottom-left';
}

export function WhatsAppButton({
  phoneNumber = '971501234567', // Default UAE number
  message = 'Hello! I\'m interested in your design services.',
  position = 'bottom-right',
}: WhatsAppButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);

  // WhatsApp URL
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  // Position classes
  const positionClasses = position === 'bottom-right'
    ? 'bottom-6 right-6'
    : 'bottom-6 left-6';

  return (
    <>
      {/* Floating WhatsApp Button */}
      <motion.div
        className={`fixed z-50 ${positionClasses}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: 1,
        }}
        onHoverStart={() => {
          setIsHovered(true);
          setShowTooltip(true);
        }}
        onHoverEnd={() => {
          setIsHovered(false);
          setShowTooltip(false);
        }}
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="group relative flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 rounded-full"
        >
          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-full mr-4 whitespace-nowrap rounded-lg bg-neutral-950 px-4 py-2 text-sm font-light text-white shadow-2xl"
              >
                Chat with us on WhatsApp
                <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1 rotate-45 bg-neutral-950" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Button */}
          <motion.div
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 17,
            }}
            className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#25D366] shadow-2xl"
          >
            {/* Ripple effect on hover */}
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: isHovered ? 2 : 0,
                opacity: isHovered ? 0.2 : 0,
              }}
              transition={{ duration: 0.6 }}
            />

            {/* WhatsApp Icon (custom SVG for brand accuracy) */}
            <svg
              viewBox="0 0 24 24"
              fill="white"
              className="h-8 w-8 relative z-10"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </motion.div>
        </a>

        {/* Pulse rings */}
        <motion.div
          className="absolute inset-0 -z-10 rounded-full bg-[#25D366]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'loop',
          }}
        />
      </motion.div>
    </>
  );
}

export default WhatsAppButton;
