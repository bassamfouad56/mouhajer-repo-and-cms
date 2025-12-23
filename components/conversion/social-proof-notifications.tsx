'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, CheckCircle } from 'lucide-react';

interface Notification {
  id: number;
  name: string;
  location: string;
  action: string;
  timeAgo: string;
  type: 'inquiry' | 'consultation' | 'project';
}

// Simulated social proof notifications
const NOTIFICATIONS: Notification[] = [
  { id: 1, name: 'Ahmed', location: 'Dubai Marina', action: 'requested a consultation', timeAgo: '2 minutes ago', type: 'consultation' },
  { id: 2, name: 'Sarah', location: 'Abu Dhabi', action: 'started a villa project', timeAgo: '5 minutes ago', type: 'project' },
  { id: 3, name: 'Mohammed', location: 'Palm Jumeirah', action: 'inquired about fit-out services', timeAgo: '8 minutes ago', type: 'inquiry' },
  { id: 4, name: 'Fatima', location: 'Jumeirah', action: 'booked a design consultation', timeAgo: '12 minutes ago', type: 'consultation' },
  { id: 5, name: 'Omar', location: 'Business Bay', action: 'requested office renovation', timeAgo: '15 minutes ago', type: 'inquiry' },
  { id: 6, name: 'Layla', location: 'Al Barsha', action: 'started a kitchen project', timeAgo: '20 minutes ago', type: 'project' },
  { id: 7, name: 'Khalid', location: 'Downtown Dubai', action: 'inquired about luxury interiors', timeAgo: '25 minutes ago', type: 'inquiry' },
  { id: 8, name: 'Aisha', location: 'Emirates Hills', action: 'booked a site visit', timeAgo: '30 minutes ago', type: 'consultation' },
];

const STORAGE_KEY = 'midc_social_proof_disabled';
const INITIAL_DELAY = 15000; // 15 seconds before first notification
const INTERVAL = 45000; // 45 seconds between notifications
const DISPLAY_DURATION = 6000; // 6 seconds display time

export function SocialProofNotifications() {
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [notificationIndex, setNotificationIndex] = useState(0);

  // Check if disabled
  useEffect(() => {
    const disabled = sessionStorage.getItem(STORAGE_KEY);
    if (disabled) {
      setIsEnabled(false);
    }
  }, []);

  const showNextNotification = useCallback(() => {
    if (!isEnabled) return;

    // Randomize which notification to show
    const randomIndex = Math.floor(Math.random() * NOTIFICATIONS.length);
    setCurrentNotification(NOTIFICATIONS[randomIndex]);
    setNotificationIndex((prev) => prev + 1);

    // Hide after display duration
    setTimeout(() => {
      setCurrentNotification(null);
    }, DISPLAY_DURATION);
  }, [isEnabled]);

  // Initial delay, then interval
  useEffect(() => {
    if (!isEnabled) return;

    // First notification after initial delay
    const initialTimer = setTimeout(() => {
      showNextNotification();
    }, INITIAL_DELAY);

    return () => clearTimeout(initialTimer);
  }, [isEnabled, showNextNotification]);

  // Subsequent notifications at interval
  useEffect(() => {
    if (!isEnabled || notificationIndex === 0) return;

    const intervalTimer = setTimeout(() => {
      showNextNotification();
    }, INTERVAL);

    return () => clearTimeout(intervalTimer);
  }, [notificationIndex, isEnabled, showNextNotification]);

  const handleDismiss = () => {
    setCurrentNotification(null);
    setIsEnabled(false);
    sessionStorage.setItem(STORAGE_KEY, 'true');
  };

  return (
    <AnimatePresence>
      {currentNotification && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-24 left-6 z-50 max-w-xs"
        >
          <div
            className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 shadow-lg transition-shadow hover:shadow-xl"
            onClick={handleDismiss}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleDismiss()}
            aria-label="Dismiss notification"
          >
            {/* Subtle pulse animation */}
            <div className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </div>

            <div className="flex items-start gap-3 pl-3">
              {/* Icon */}
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#c9a962]/10">
                <CheckCircle className="h-5 w-5 text-[#c9a962]" />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <p className="font-Satoshi text-sm text-neutral-900">
                  <span className="font-medium">{currentNotification.name}</span>{' '}
                  <span className="text-neutral-600">{currentNotification.action}</span>
                </p>
                <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={10} />
                    {currentNotification.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {currentNotification.timeAgo}
                  </span>
                </div>
              </div>
            </div>

            {/* Close hint */}
            <p className="mt-2 pl-3 font-Satoshi text-[10px] text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100">
              Click to dismiss
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
