'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import { AIImageGenerator } from './ai-image-generator';

/**
 * Example integration of AI Image Generator with your chatbot
 * Replace your existing chatbot component or add this as a floating button
 */
export function ChatbotWithAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  return (
    <>
      {/* Floating Chatbot Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#c9a962] to-[#b8941f] text-white shadow-2xl transition-shadow hover:shadow-[0_0_30px_rgba(201,169,98,0.6)]"
      >
        <MessageCircle className="h-7 w-7" />
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-neutral-950 to-neutral-800 p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#c9a962] flex items-center justify-center">
                  <span className="font-SchnyderS text-white text-lg">M</span>
                </div>
                <div>
                  <h3 className="font-SchnyderS text-white text-base">MIDC Assistant</h3>
                  <p className="font-Satoshi text-xs text-white/70">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Content */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-neutral-50">
              {/* Welcome Message */}
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-[#c9a962] flex items-center justify-center flex-shrink-0">
                  <span className="font-SchnyderS text-white text-sm">M</span>
                </div>
                <div className="flex-1">
                  <div className="rounded-2xl rounded-tl-sm bg-white p-4 shadow-sm">
                    <p className="font-Satoshi text-sm text-neutral-700">
                      Welcome to MIDC! I'm here to help you with your design and construction needs.
                    </p>
                  </div>
                  <p className="mt-1 px-1 font-Satoshi text-xs text-neutral-400">Just now</p>
                </div>
              </div>

              {/* AI Generator CTA */}
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-[#c9a962] flex items-center justify-center flex-shrink-0">
                  <span className="font-SchnyderS text-white text-sm">M</span>
                </div>
                <div className="flex-1">
                  <div className="rounded-2xl rounded-tl-sm bg-gradient-to-br from-[#c9a962]/10 to-[#c9a962]/5 p-4 border border-[#c9a962]/20">
                    <div className="flex items-start gap-3 mb-3">
                      <Sparkles className="h-5 w-5 text-[#c9a962] flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-SchnyderS text-base text-neutral-950 mb-1">
                          Try Our AI Design Studio
                        </h4>
                        <p className="font-Satoshi text-sm text-neutral-600 mb-4">
                          Describe your vision, and our AI will create a luxury design concept for you in seconds.
                        </p>
                        <button
                          onClick={() => {
                            setShowAIGenerator(true);
                            setIsOpen(false);
                          }}
                          className="inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-4 py-2 font-Satoshi text-xs font-medium text-white transition-colors hover:bg-[#c9a962]"
                        >
                          <Sparkles className="h-4 w-4" />
                          Generate Design
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="mt-1 px-1 font-Satoshi text-xs text-neutral-400">Just now</p>
                </div>
              </div>

              {/* Add your existing chatbot messages here */}
            </div>

            {/* Input Area */}
            <div className="border-t border-neutral-200 bg-white p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 font-Satoshi text-sm focus:border-[#c9a962] focus:outline-none focus:ring-2 focus:ring-[#c9a962]/20"
                />
                <button className="rounded-lg bg-neutral-950 px-4 py-2 font-Satoshi text-sm font-medium text-white transition-colors hover:bg-[#c9a962]">
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Image Generator Modal */}
      <AnimatePresence>
        {showAIGenerator && (
          <AIImageGenerator
            onClose={() => {
              setShowAIGenerator(false);
              setIsOpen(true); // Reopen chatbot after closing generator
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
