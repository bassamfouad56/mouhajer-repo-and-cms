"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  X,
  Copy,
  Check,
  Twitter,
  Linkedin,
  Facebook,
  Mail,
  Link2,
} from "lucide-react";

interface SocialShareProps {
  title: string;
  excerpt?: string;
  url?: string;
}

export default function SocialShare({ title, excerpt, url }: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined" ? url || window.location.href : "";
  const shareText = excerpt || title;

  const shareLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      color: "hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "hover:bg-[#1877F2]/10 hover:text-[#1877F2]",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Email",
      icon: Mail,
      color: "hover:bg-neutral-100 hover:text-neutral-700",
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`,
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=400");
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Share Button */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}
        className="fixed right-6 top-1/2 z-40 -translate-y-1/2 hidden lg:block"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 rounded-full border border-neutral-200 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm transition-all hover:border-[#8f7852] hover:shadow-xl"
        >
          <Share2 size={16} className="text-neutral-600" />
          <span className="font-Satoshi text-xs font-medium text-neutral-600 opacity-0 transition-opacity group-hover:opacity-100">
            Share
          </span>
        </button>
      </motion.div>

      {/* Share Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
                <h3 className="font-SchnyderS text-lg font-light text-neutral-900">
                  Share Article
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Social Links */}
              <div className="p-6">
                <div className="grid grid-cols-4 gap-3">
                  {shareLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => handleShare(link.url)}
                      className={`flex flex-col items-center gap-2 rounded-xl border border-neutral-100 p-4 text-neutral-500 transition-all ${link.color}`}
                    >
                      <link.icon size={20} />
                      <span className="font-Satoshi text-[10px] font-medium">
                        {link.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Copy Link */}
                <div className="mt-4">
                  <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                    <Link2
                      size={16}
                      className="flex-shrink-0 text-neutral-400"
                    />
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 bg-transparent font-Satoshi text-xs text-neutral-600 outline-none"
                    />
                    <button
                      onClick={copyLink}
                      className={`flex items-center gap-1 rounded-lg px-3 py-1.5 font-Satoshi text-xs font-medium transition-all ${
                        copied
                          ? "bg-green-100 text-green-600"
                          : "bg-white text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
