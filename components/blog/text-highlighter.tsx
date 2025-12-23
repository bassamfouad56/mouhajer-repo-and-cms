'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Highlighter, Share2, X, Trash2 } from 'lucide-react';

interface Highlight {
  id: string;
  text: string;
  range: {
    startOffset: number;
    endOffset: number;
    startPath: string;
    endPath: string;
  };
  createdAt: number;
}

interface TextHighlighterProps {
  postSlug: string;
}

export default function TextHighlighter({ postSlug }: TextHighlighterProps) {
  const [selectedText, setSelectedText] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [showHighlightsSidebar, setShowHighlightsSidebar] = useState(false);

  // Load highlights from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`highlights-${postSlug}`);
    if (stored) {
      try {
        setHighlights(JSON.parse(stored));
      } catch {
        // Invalid JSON
      }
    }
  }, [postSlug]);

  // Save highlights to localStorage
  useEffect(() => {
    if (highlights.length > 0) {
      localStorage.setItem(`highlights-${postSlug}`, JSON.stringify(highlights));
    } else {
      localStorage.removeItem(`highlights-${postSlug}`);
    }
  }, [highlights, postSlug]);

  // Handle text selection
  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      setShowPopup(false);
      return;
    }

    const text = selection.toString().trim();
    if (text.length < 5 || text.length > 500) {
      setShowPopup(false);
      return;
    }

    // Check if selection is within article content
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const article = document.querySelector('article');
    
    if (!article?.contains(container)) {
      setShowPopup(false);
      return;
    }

    const rect = range.getBoundingClientRect();
    setPopupPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setSelectedText(text);
    setShowPopup(true);
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('touchend', handleSelection);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('touchend', handleSelection);
    };
  }, [handleSelection]);

  const saveHighlight = () => {
    if (!selectedText) return;

    const newHighlight: Highlight = {
      id: `hl-${Date.now()}`,
      text: selectedText,
      range: {
        startOffset: 0,
        endOffset: 0,
        startPath: '',
        endPath: '',
      },
      createdAt: Date.now(),
    };

    setHighlights((prev) => [...prev, newHighlight]);
    setShowPopup(false);
    window.getSelection()?.removeAllRanges();
  };

  const shareHighlight = async () => {
    if (!selectedText) return;

    const shareUrl = `${window.location.href}#:~:text=${encodeURIComponent(selectedText)}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          text: `"${selectedText}"`,
          url: shareUrl,
        });
      } catch {
        await navigator.clipboard.writeText(shareUrl);
      }
    } else {
      await navigator.clipboard.writeText(`"${selectedText}" - ${shareUrl}`);
    }

    setShowPopup(false);
    window.getSelection()?.removeAllRanges();
  };

  const removeHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <>
      {/* Selection Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              left: popupPosition.x,
              top: popupPosition.y,
              transform: 'translate(-50%, -100%)',
              zIndex: 9999,
            }}
            className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-1 shadow-xl"
          >
            <button
              onClick={saveHighlight}
              className="flex items-center gap-2 rounded-md px-3 py-2 font-Satoshi text-xs font-medium text-neutral-700 transition-colors hover:bg-[#c9a962]/10 hover:text-[#c9a962]"
            >
              <Highlighter size={14} />
              <span>Highlight</span>
            </button>
            <div className="h-6 w-px bg-neutral-200" />
            <button
              onClick={shareHighlight}
              className="flex items-center gap-2 rounded-md px-3 py-2 font-Satoshi text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
            >
              <Share2 size={14} />
              <span>Share</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Highlights Sidebar Toggle */}
      {highlights.length > 0 && (
        <div className="fixed left-6 top-1/2 z-40 -translate-y-1/2">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setShowHighlightsSidebar(!showHighlightsSidebar)}
            className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 shadow-lg transition-all hover:border-[#c9a962] hover:shadow-xl"
          >
            <Highlighter size={16} className="text-[#c9a962]" />
            <span className="font-Satoshi text-xs font-medium text-neutral-700">
              {highlights.length}
            </span>
          </motion.button>
        </div>
      )}

      {/* Highlights Sidebar */}
      <AnimatePresence>
        {showHighlightsSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setShowHighlightsSidebar(false)}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 h-full w-80 overflow-y-auto border-r border-neutral-200 bg-white shadow-2xl"
            >
              <div className="sticky top-0 flex items-center justify-between border-b border-neutral-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <Highlighter size={18} className="text-[#c9a962]" />
                  <span className="font-Satoshi text-sm font-medium text-neutral-900">
                    Your Highlights
                  </span>
                </div>
                <button
                  onClick={() => setShowHighlightsSidebar(false)}
                  className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {highlights.map((highlight) => (
                  <motion.div
                    key={highlight.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative rounded-lg border border-neutral-200 bg-neutral-50 p-4"
                  >
                    <p className="font-Satoshi text-sm font-light leading-relaxed text-neutral-700">
                      "{highlight.text}"
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-Satoshi text-[10px] text-neutral-400">
                        {new Date(highlight.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => removeHighlight(highlight.id)}
                        className="rounded p-1 text-neutral-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
