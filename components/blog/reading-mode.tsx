"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sun, Moon, Minus, Plus, X, Settings2 } from "lucide-react";

interface ReadingModeState {
  isActive: boolean;
  fontSize: "small" | "medium" | "large";
  isDarkMode: boolean;
}

interface ReadingModeContextType extends ReadingModeState {
  toggleReadingMode: () => void;
  setFontSize: (size: "small" | "medium" | "large") => void;
  toggleDarkMode: () => void;
}

const ReadingModeContext = createContext<ReadingModeContextType | null>(null);

export function useReadingMode() {
  const context = useContext(ReadingModeContext);
  if (!context) {
    throw new Error("useReadingMode must be used within ReadingModeProvider");
  }
  return context;
}

export function ReadingModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<ReadingModeState>({
    isActive: false,
    fontSize: "medium",
    isDarkMode: false,
  });

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("reading-mode-preferences");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState((prev) => ({ ...prev, ...parsed, isActive: false }));
      } catch {
        // Ignore invalid JSON
      }
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem(
      "reading-mode-preferences",
      JSON.stringify({
        fontSize: state.fontSize,
        isDarkMode: state.isDarkMode,
      }),
    );
  }, [state.fontSize, state.isDarkMode]);

  // Apply body classes when reading mode is active
  useEffect(() => {
    if (state.isActive) {
      document.body.classList.add("reading-mode-active");
      if (state.isDarkMode) {
        document.body.classList.add("reading-mode-dark");
      } else {
        document.body.classList.remove("reading-mode-dark");
      }
    } else {
      document.body.classList.remove(
        "reading-mode-active",
        "reading-mode-dark",
      );
    }

    return () => {
      document.body.classList.remove(
        "reading-mode-active",
        "reading-mode-dark",
      );
    };
  }, [state.isActive, state.isDarkMode]);

  const toggleReadingMode = () =>
    setState((prev) => ({ ...prev, isActive: !prev.isActive }));
  const setFontSize = (size: "small" | "medium" | "large") =>
    setState((prev) => ({ ...prev, fontSize: size }));
  const toggleDarkMode = () =>
    setState((prev) => ({ ...prev, isDarkMode: !prev.isDarkMode }));

  return (
    <ReadingModeContext.Provider
      value={{ ...state, toggleReadingMode, setFontSize, toggleDarkMode }}
    >
      {children}
    </ReadingModeContext.Provider>
  );
}

// Floating Reading Mode Toggle Button
export function ReadingModeToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    isActive,
    fontSize,
    isDarkMode,
    toggleReadingMode,
    setFontSize,
    toggleDarkMode,
  } = useReadingMode();

  const fontSizeLabel = {
    small: "14px",
    medium: "18px",
    large: "22px",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute bottom-16 right-0 mb-2 w-64 rounded-xl border p-4 shadow-2xl ${
              isDarkMode && isActive
                ? "border-white/10 bg-neutral-900"
                : "border-neutral-200 bg-white"
            }`}
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <h4
                className={`font-Satoshi text-sm font-medium ${
                  isDarkMode && isActive ? "text-white" : "text-neutral-900"
                }`}
              >
                Reading Settings
              </h4>
              <button
                onClick={() => setIsOpen(false)}
                className={`rounded-full p-1 transition-colors ${
                  isDarkMode && isActive
                    ? "hover:bg-white/10 text-white/60"
                    : "hover:bg-neutral-100 text-neutral-400"
                }`}
              >
                <X size={16} />
              </button>
            </div>

            {/* Reading Mode Toggle */}
            <div className="mb-4">
              <button
                onClick={toggleReadingMode}
                className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 transition-all ${
                  isActive
                    ? "border-[#8f7852] bg-[#8f7852]/10"
                    : isDarkMode
                      ? "border-white/10 hover:border-white/20"
                      : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen
                    size={18}
                    className={
                      isActive
                        ? "text-[#8f7852]"
                        : isDarkMode && isActive
                          ? "text-white/60"
                          : "text-neutral-400"
                    }
                  />
                  <span
                    className={`font-Satoshi text-sm ${
                      isActive
                        ? "text-[#8f7852]"
                        : isDarkMode && isActive
                          ? "text-white"
                          : "text-neutral-700"
                    }`}
                  >
                    Focus Mode
                  </span>
                </div>
                <div
                  className={`h-5 w-9 rounded-full p-0.5 transition-colors ${
                    isActive ? "bg-[#8f7852]" : "bg-neutral-200"
                  }`}
                >
                  <motion.div
                    className="h-4 w-4 rounded-full bg-white shadow-sm"
                    animate={{ x: isActive ? 16 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
              </button>
            </div>

            {/* Font Size */}
            <div className="mb-4">
              <label
                className={`mb-2 block font-Satoshi text-xs uppercase tracking-wider ${
                  isDarkMode && isActive ? "text-white/40" : "text-neutral-400"
                }`}
              >
                Font Size
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setFontSize(
                      fontSize === "large"
                        ? "medium"
                        : fontSize === "medium"
                          ? "small"
                          : "small",
                    )
                  }
                  disabled={fontSize === "small"}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                    fontSize === "small"
                      ? "cursor-not-allowed opacity-30"
                      : isDarkMode && isActive
                        ? "border-white/10 hover:border-white/20 text-white"
                        : "border-neutral-200 hover:border-neutral-300 text-neutral-600"
                  }`}
                >
                  <Minus size={16} />
                </button>
                <div
                  className={`flex-1 text-center font-Satoshi text-sm ${
                    isDarkMode && isActive ? "text-white" : "text-neutral-700"
                  }`}
                >
                  {fontSizeLabel[fontSize]}
                </div>
                <button
                  onClick={() =>
                    setFontSize(
                      fontSize === "small"
                        ? "medium"
                        : fontSize === "medium"
                          ? "large"
                          : "large",
                    )
                  }
                  disabled={fontSize === "large"}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                    fontSize === "large"
                      ? "cursor-not-allowed opacity-30"
                      : isDarkMode && isActive
                        ? "border-white/10 hover:border-white/20 text-white"
                        : "border-neutral-200 hover:border-neutral-300 text-neutral-600"
                  }`}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <div>
              <label
                className={`mb-2 block font-Satoshi text-xs uppercase tracking-wider ${
                  isDarkMode && isActive ? "text-white/40" : "text-neutral-400"
                }`}
              >
                Theme
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => isDarkMode && toggleDarkMode()}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 transition-all ${
                    !isDarkMode
                      ? "border-[#8f7852] bg-[#8f7852]/10 text-[#8f7852]"
                      : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                  }`}
                >
                  <Sun size={16} />
                  <span className="font-Satoshi text-xs">Light</span>
                </button>
                <button
                  onClick={() => !isDarkMode && toggleDarkMode()}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 transition-all ${
                    isDarkMode
                      ? "border-[#8f7852] bg-[#8f7852]/10 text-[#8f7852]"
                      : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                  }`}
                >
                  <Moon size={16} />
                  <span className="font-Satoshi text-xs">Dark</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all ${
          isActive
            ? "bg-[#8f7852] text-neutral-950"
            : isDarkMode
              ? "bg-neutral-900 text-white border border-white/10"
              : "bg-white text-neutral-700 border border-neutral-200"
        }`}
        aria-label="Reading mode settings"
      >
        {isOpen ? <X size={20} /> : <Settings2 size={20} />}
      </motion.button>
    </div>
  );
}

// Reading Mode Wrapper - wraps article content
export function ReadingModeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isActive, fontSize, isDarkMode } = useReadingMode();

  const fontSizeClass = {
    small: "reading-font-small",
    medium: "reading-font-medium",
    large: "reading-font-large",
  };

  return (
    <div
      className={`transition-all duration-500 ${isActive ? "reading-mode" : ""} ${
        fontSizeClass[fontSize]
      } ${isDarkMode && isActive ? "reading-dark" : ""}`}
    >
      {children}
    </div>
  );
}
