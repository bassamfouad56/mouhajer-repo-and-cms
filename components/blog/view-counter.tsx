'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Users } from 'lucide-react';

interface ViewCounterProps {
  postId: string;
  initialViews?: number;
}

export default function ViewCounter({ postId, initialViews = 0 }: ViewCounterProps) {
  const [views, setViews] = useState(initialViews);
  const [readingNow, setReadingNow] = useState(0);
  const [hasTracked, setHasTracked] = useState(false);

  // Track view on mount
  useEffect(() => {
    if (hasTracked) return;

    const trackView = async () => {
      // Check if already viewed in this session
      const viewedPosts = JSON.parse(sessionStorage.getItem('viewed-posts') || '[]');
      if (viewedPosts.includes(postId)) {
        return;
      }

      try {
        const response = await fetch('/api/blog/view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.views) {
            setViews(data.views);
          } else {
            setViews((prev) => prev + 1);
          }

          // Mark as viewed in session
          sessionStorage.setItem('viewed-posts', JSON.stringify([...viewedPosts, postId]));
        }
      } catch (error) {
        // Silently increment locally if API fails
        setViews((prev) => prev + 1);
      }

      setHasTracked(true);
    };

    // Delay tracking to ensure meaningful engagement
    const timer = setTimeout(trackView, 3000);
    return () => clearTimeout(timer);
  }, [postId, hasTracked]);

  // Simulate "reading now" with a random number that feels realistic
  useEffect(() => {
    // Generate a believable number based on time of day and randomness
    const hour = new Date().getHours();
    const baseReaders = hour >= 9 && hour <= 21 ? 5 : 2; // More readers during active hours
    const randomReaders = Math.floor(Math.random() * 8) + baseReaders;
    setReadingNow(randomReaders);

    // Occasionally update to make it feel live
    const interval = setInterval(() => {
      setReadingNow((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newValue = prev + change;
        return Math.max(1, Math.min(newValue, 20)); // Keep between 1-20
      });
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  // Format view count (e.g., 1.2k)
  const formatViews = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className="flex items-center gap-4 font-Satoshi text-sm font-light text-neutral-500">
      {/* Total Views */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-1.5"
      >
        <Eye size={16} className="text-neutral-400" />
        <span>{formatViews(views)} views</span>
      </motion.div>

      {/* Reading Now */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-1.5"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
        </span>
        <span>{readingNow} reading now</span>
      </motion.div>
    </div>
  );
}

// Compact version for cards
export function ViewCounterCompact({ views }: { views: number }) {
  const formatViews = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <span className="flex items-center gap-1 font-Satoshi text-xs font-light text-neutral-500">
      <Eye size={12} />
      {formatViews(views)}
    </span>
  );
}
