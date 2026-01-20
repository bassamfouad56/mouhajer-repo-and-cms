"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
  Headphones,
  Gauge,
} from "lucide-react";

interface AudioPlayerProps {
  content: any[];
  postSlug: string;
  postTitle: string;
}

// Extract plain text from Portable Text content
function extractPlainText(content: any[]): string {
  let text = "";

  content.forEach((block) => {
    if (block._type === "block" && block.children) {
      const blockText = block.children
        .map((child: any) => child.text || "")
        .join("");
      text += blockText + " ";
    }
  });

  return text.trim();
}

// Calculate estimated listen time (average 150 words per minute)
function calculateListenTime(text: string): number {
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / 150);
}

export default function AudioPlayer({
  content,
  postSlug,
  postTitle,
}: AudioPlayerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(0);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const sentencesRef = useRef<string[]>([]);

  const plainText = useMemo(() => extractPlainText(content), [content]);
  const listenTime = useMemo(() => calculateListenTime(plainText), [plainText]);

  // Split text into sentences
  useEffect(() => {
    sentencesRef.current = plainText
      .replace(/([.!?])\s+/g, "|")
      .split("|")
      .filter((s) => s.trim().length > 0);
  }, [plainText]);

  // Load saved position
  useEffect(() => {
    const saved = localStorage.getItem(`audio-position-${postSlug}`);
    if (saved) {
      const { sentence, progress: savedProgress } = JSON.parse(saved);
      setCurrentSentence(sentence);
      setProgress(savedProgress);
    }
  }, [postSlug]);

  // Save position periodically
  useEffect(() => {
    if (isPlaying) {
      localStorage.setItem(
        `audio-position-${postSlug}`,
        JSON.stringify({ sentence: currentSentence, progress })
      );
    }
  }, [currentSentence, progress, isPlaying, postSlug]);

  const speak = useCallback(
    (startIndex = 0) => {
      if (!("speechSynthesis" in window)) {
        alert("Text-to-speech is not supported in your browser.");
        return;
      }

      // Cancel any existing speech
      window.speechSynthesis.cancel();

      const sentences = sentencesRef.current;
      if (sentences.length === 0 || startIndex >= sentences.length) return;

      let currentIndex = startIndex;

      const speakSentence = () => {
        if (currentIndex >= sentences.length) {
          setIsPlaying(false);
          setProgress(100);
          setCurrentSentence(0);
          localStorage.removeItem(`audio-position-${postSlug}`);
          return;
        }

        const utterance = new SpeechSynthesisUtterance(sentences[currentIndex]);
        utterance.rate = speed;
        utterance.volume = isMuted ? 0 : 1;
        utterance.lang = "en-US";

        // Try to use a natural voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            (v.name.includes("Natural") ||
              v.name.includes("Enhanced") ||
              v.name.includes("Premium"))
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onstart = () => {
          setCurrentSentence(currentIndex);
          setProgress((currentIndex / sentences.length) * 100);
        };

        utterance.onend = () => {
          currentIndex++;
          speakSentence();
        };

        utterance.onerror = (e) => {
          if (e.error !== "interrupted") {
            console.error("Speech error:", e);
          }
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      };

      speakSentence();
      setIsPlaying(true);
      setIsPaused(false);
    },
    [speed, isMuted, postSlug]
  );

  const togglePlay = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    if (isPlaying) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else {
      speak(currentSentence);
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const skipForward = () => {
    const newIndex = Math.min(
      currentSentence + 5,
      sentencesRef.current.length - 1
    );
    if (isPlaying) {
      window.speechSynthesis.cancel();
      speak(newIndex);
    } else {
      setCurrentSentence(newIndex);
      setProgress((newIndex / sentencesRef.current.length) * 100);
    }
  };

  const skipBack = () => {
    const newIndex = Math.max(currentSentence - 5, 0);
    if (isPlaying) {
      window.speechSynthesis.cancel();
      speak(newIndex);
    } else {
      setCurrentSentence(newIndex);
      setProgress((newIndex / sentencesRef.current.length) * 100);
    }
  };

  const changeSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 2];
    const currentIdx = speeds.indexOf(speed);
    const nextSpeed = speeds[(currentIdx + 1) % speeds.length];
    setSpeed(nextSpeed);

    if (isPlaying && utteranceRef.current) {
      window.speechSynthesis.cancel();
      speak(currentSentence);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isPlaying && utteranceRef.current) {
      window.speechSynthesis.cancel();
      speak(currentSentence);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isOpen) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-3 shadow-lg transition-all hover:border-[#c9a962] hover:shadow-xl"
      >
        <Headphones size={18} className="text-[#c9a962]" />
        <span className="font-Satoshi text-xs font-medium text-neutral-700">
          Listen ({listenTime} min)
        </span>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white/95 backdrop-blur-lg"
    >
      <div className="mx-auto max-w-4xl px-4 py-4">
        <div className="flex items-center gap-4">
          {/* Close Button */}
          <button
            onClick={() => {
              stop();
              setIsOpen(false);
            }}
            className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
          >
            <X size={18} />
          </button>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="truncate font-Satoshi text-sm font-medium text-neutral-900">
              {postTitle}
            </p>
            <p className="font-Satoshi text-xs text-neutral-500">
              {Math.round(progress)}% complete • {listenTime} min total
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={skipBack}
              className="rounded-full p-2 text-neutral-600 hover:bg-neutral-100"
              title="Back 5 sentences"
            >
              <SkipBack size={18} />
            </button>

            <button
              onClick={togglePlay}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c9a962] text-white shadow-lg transition-all hover:bg-[#b8984f]"
            >
              {isPlaying && !isPaused ? (
                <Pause size={20} />
              ) : (
                <Play size={20} className="ml-0.5" />
              )}
            </button>

            <button
              onClick={skipForward}
              className="rounded-full p-2 text-neutral-600 hover:bg-neutral-100"
              title="Forward 5 sentences"
            >
              <SkipForward size={18} />
            </button>
          </div>

          {/* Speed & Volume */}
          <div className="flex items-center gap-2">
            <button
              onClick={changeSpeed}
              className="flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-1.5 font-Satoshi text-xs font-medium text-neutral-600 hover:border-neutral-300"
            >
              <Gauge size={14} />
              {speed}x
            </button>

            <button
              onClick={toggleMute}
              className="rounded-full p-2 text-neutral-600 hover:bg-neutral-100"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-neutral-200">
          <motion.div
            className="h-full bg-[#c9a962]"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
