"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Github } from "lucide-react";

interface CommentsProps {
  postSlug: string;
  postTitle: string;
}

export default function Comments({ postSlug, postTitle }: CommentsProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (!showComments) return;

    // Load Giscus script
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute(
      "data-repo",
      process.env.NEXT_PUBLIC_GISCUS_REPO ||
        "mouhajer-international/blog-comments",
    );
    script.setAttribute(
      "data-repo-id",
      process.env.NEXT_PUBLIC_GISCUS_REPO_ID || "",
    );
    script.setAttribute(
      "data-category",
      process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "Blog Comments",
    );
    script.setAttribute(
      "data-category-id",
      process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || "",
    );
    script.setAttribute("data-mapping", "specific");
    script.setAttribute("data-term", postSlug);
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-lang", "en");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;

    script.onload = () => setIsLoaded(true);

    const container = document.getElementById("giscus-container");
    if (container) {
      container.appendChild(script);
    }

    return () => {
      const container = document.getElementById("giscus-container");
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [showComments, postSlug]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-16 border-t border-neutral-200 pt-12"
    >
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
            <MessageCircle size={20} className="text-neutral-600" />
          </div>
          <div>
            <h3 className="font-SchnyderS text-xl font-light text-neutral-900">
              Join the Discussion
            </h3>
            <p className="font-Satoshi text-sm font-light text-neutral-500">
              Share your thoughts on this article
            </p>
          </div>
        </div>
      </div>

      {!showComments ? (
        <motion.button
          onClick={() => setShowComments(true)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-6 py-4 font-Satoshi text-sm text-neutral-600 transition-all hover:border-neutral-300 hover:bg-neutral-100"
        >
          <Github size={18} />
          <span>Load comments (powered by GitHub Discussions)</span>
        </motion.button>
      ) : (
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div id="giscus-container" className="giscus min-h-[200px]">
            {!isLoaded && (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-[#8f7852]" />
              </div>
            )}
          </div>
        </div>
      )}

      <p className="mt-4 text-center font-Satoshi text-xs font-light text-neutral-400">
        Comments are powered by{" "}
        <a
          href="https://giscus.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#8f7852] hover:underline"
        >
          Giscus
        </a>{" "}
        using GitHub Discussions. Sign in with your GitHub account to
        participate.
      </p>
    </motion.div>
  );
}
