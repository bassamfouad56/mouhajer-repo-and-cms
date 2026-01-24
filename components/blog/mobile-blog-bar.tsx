"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, List, ArrowUp, X } from "lucide-react";

interface MobileBlogBarProps {
  postTitle: string;
  onTOCToggle?: () => void;
  showTOC?: boolean;
}

export default function MobileBlogBar({
  postTitle,
  onTOCToggle,
  showTOC,
}: MobileBlogBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Show bar after scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: postTitle,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or share failed
        setShowShareMenu(true);
      }
    } else {
      setShowShareMenu(true);
    }
  };

  const shareOptions = [
    {
      name: "Copy Link",
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        setShowShareMenu(false);
      },
    },
    {
      name: "Twitter",
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(postTitle)}`,
          "_blank",
        );
        setShowShareMenu(false);
      },
    },
    {
      name: "LinkedIn",
      action: () => {
        window.open(
          `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(postTitle)}`,
          "_blank",
        );
        setShowShareMenu(false);
      },
    },
    {
      name: "Facebook",
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
          "_blank",
        );
        setShowShareMenu(false);
      },
    },
  ];

  return (
    <>
      {/* Mobile Bottom Bar */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur-sm lg:hidden"
          >
            <div className="mx-auto flex max-w-lg items-center justify-around">
              {/* Share Button */}
              <button
                onClick={handleShare}
                className="flex flex-col items-center gap-1 text-neutral-600 transition-colors hover:text-neutral-950"
              >
                <Share2 size={20} />
                <span className="font-Satoshi text-[10px] uppercase tracking-wider">
                  Share
                </span>
              </button>

              {/* TOC Button */}
              {onTOCToggle && (
                <button
                  onClick={onTOCToggle}
                  className={`flex flex-col items-center gap-1 transition-colors ${
                    showTOC
                      ? "text-[#8f7852]"
                      : "text-neutral-600 hover:text-neutral-950"
                  }`}
                >
                  <List size={20} />
                  <span className="font-Satoshi text-[10px] uppercase tracking-wider">
                    Contents
                  </span>
                </button>
              )}

              {/* Back to Top */}
              <button
                onClick={scrollToTop}
                className="flex flex-col items-center gap-1 text-neutral-600 transition-colors hover:text-neutral-950"
              >
                <ArrowUp size={20} />
                <span className="font-Satoshi text-[10px] uppercase tracking-wider">
                  Top
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Menu Overlay */}
      <AnimatePresence>
        {showShareMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareMenu(false)}
              className="fixed inset-0 z-50 bg-black/50"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-white p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-SchnyderS text-xl font-light">
                  Share Article
                </h3>
                <button
                  onClick={() => setShowShareMenu(false)}
                  className="rounded-full p-2 hover:bg-neutral-100"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-2">
                {shareOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={option.action}
                    className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-left font-Satoshi text-sm font-light transition-colors hover:bg-neutral-50"
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
