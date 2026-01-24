"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Reactions {
  helpful: number;
  insightful: number;
  loved: number;
}

interface ReactionButtonsProps {
  postId: string;
  initialReactions?: Reactions;
}

const reactionTypes = [
  { key: "helpful", emoji: "👏", label: "Helpful" },
  { key: "insightful", emoji: "💡", label: "Insightful" },
  { key: "loved", emoji: "❤️", label: "Loved it" },
] as const;

export default function ReactionButtons({
  postId,
  initialReactions,
}: ReactionButtonsProps) {
  const [reactions, setReactions] = useState<Reactions>(
    initialReactions || { helpful: 0, insightful: 0, loved: 0 },
  );
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState<string | null>(null);

  // Load user's previous reaction from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`blog-reaction-${postId}`);
    if (stored) {
      setUserReaction(stored);
    }
  }, [postId]);

  const handleReaction = async (type: keyof Reactions) => {
    // Prevent multiple clicks
    if (isAnimating) return;

    setIsAnimating(type);

    // If user already reacted with this type, remove it
    if (userReaction === type) {
      setReactions((prev) => ({
        ...prev,
        [type]: Math.max(0, prev[type] - 1),
      }));
      setUserReaction(null);
      localStorage.removeItem(`blog-reaction-${postId}`);
    } else {
      // Remove previous reaction if exists
      if (userReaction) {
        setReactions((prev) => ({
          ...prev,
          [userReaction]: Math.max(
            0,
            prev[userReaction as keyof Reactions] - 1,
          ),
        }));
      }

      // Add new reaction
      setReactions((prev) => ({
        ...prev,
        [type]: prev[type] + 1,
      }));
      setUserReaction(type);
      localStorage.setItem(`blog-reaction-${postId}`, type);
    }

    // Optional: Send to API
    try {
      await fetch("/api/blog/reaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          type,
          action: userReaction === type ? "remove" : "add",
        }),
      });
    } catch (error) {
      // Silently fail - reactions are stored locally anyway
    }

    setTimeout(() => setIsAnimating(null), 500);
  };

  const totalReactions =
    reactions.helpful + reactions.insightful + reactions.loved;

  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
      <h3 className="mb-4 text-center font-Satoshi text-sm font-light text-neutral-600">
        Did you find this article helpful?
      </h3>

      <div className="flex justify-center gap-3">
        {reactionTypes.map(({ key, emoji, label }) => (
          <motion.button
            key={key}
            onClick={() => handleReaction(key as keyof Reactions)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`group flex flex-col items-center gap-1 rounded-lg border px-4 py-3 transition-all duration-300 ${
              userReaction === key
                ? "border-[#8f7852] bg-[#8f7852]/10"
                : "border-neutral-200 bg-white hover:border-neutral-300"
            }`}
          >
            <motion.span
              className="text-2xl"
              animate={
                isAnimating === key
                  ? { scale: [1, 1.4, 1], rotate: [0, -10, 10, 0] }
                  : {}
              }
              transition={{ duration: 0.4 }}
            >
              {emoji}
            </motion.span>
            <span className="font-Satoshi text-xs font-light text-neutral-600">
              {label}
            </span>
            <span
              className={`font-Satoshi text-xs font-medium ${
                userReaction === key ? "text-[#8f7852]" : "text-neutral-400"
              }`}
            >
              {reactions[key as keyof Reactions]}
            </span>
          </motion.button>
        ))}
      </div>

      {totalReactions > 0 && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center font-Satoshi text-xs font-light text-neutral-500"
        >
          {totalReactions} {totalReactions === 1 ? "reaction" : "reactions"}
        </motion.p>
      )}
    </div>
  );
}
