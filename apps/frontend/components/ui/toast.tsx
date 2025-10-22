"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
  id?: string;
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export function Toast({
  type = "info",
  title,
  message,
  duration = 5000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: {
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
      icon: "text-green-600 dark:text-green-400",
      text: "text-green-900 dark:text-green-100",
    },
    error: {
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-200 dark:border-red-800",
      icon: "text-red-600 dark:text-red-400",
      text: "text-red-900 dark:text-red-100",
    },
    warning: {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      border: "border-amber-200 dark:border-amber-800",
      icon: "text-amber-600 dark:text-amber-400",
      text: "text-amber-900 dark:text-amber-100",
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      icon: "text-blue-600 dark:text-blue-400",
      text: "text-blue-900 dark:text-blue-100",
    },
  };

  const Icon = icons[type];
  const colorScheme = colors[type];

  return (
    <div
      className={cn(
        "pointer-events-auto w-full max-w-sm overflow-hidden rounded-xl border shadow-lg",
        "transition-all duration-300 motion-reduce:transition-none",
        colorScheme.bg,
        colorScheme.border,
        isExiting
          ? "translate-x-full opacity-0"
          : "translate-x-0 opacity-100"
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Icon
            className={cn("h-5 w-5 flex-shrink-0", colorScheme.icon)}
            aria-hidden="true"
          />

          <div className="flex-1 min-w-0">
            {title && (
              <p
                className={cn(
                  "font-medium text-sm mb-1",
                  colorScheme.text
                )}
              >
                {title}
              </p>
            )}
            <p className={cn("text-sm", colorScheme.text)}>{message}</p>
          </div>

          <button
            onClick={handleClose}
            className={cn(
              "flex-shrink-0 rounded-lg p-1 hover:bg-black/5 dark:hover:bg-white/10",
              "transition-colors focus:outline-none focus:ring-2",
              "focus:ring-offset-2",
              type === "success" && "focus:ring-green-500",
              type === "error" && "focus:ring-red-500",
              type === "warning" && "focus:ring-amber-500",
              type === "info" && "focus:ring-blue-500"
            )}
            aria-label="Close"
          >
            <X className={cn("h-4 w-4", colorScheme.icon)} />
          </button>
        </div>

        {/* Progress bar */}
        {duration > 0 && (
          <div className="mt-3 h-1 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full",
                type === "success" && "bg-green-600",
                type === "error" && "bg-red-600",
                type === "warning" && "bg-amber-600",
                type === "info" && "bg-blue-600"
              )}
              style={{
                animation: `shrink ${duration}ms linear forwards`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Toast Container
export function ToastContainer({ toasts }: { toasts: ToastProps[] }) {
  return (
    <div
      className="fixed bottom-0 right-0 z-[10000] flex flex-col gap-3 p-4 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast, index) => (
        <Toast key={toast.id || index} {...toast} />
      ))}
    </div>
  );
}

// Custom CSS for progress bar animation
const style = document.createElement("style");
style.textContent = `
  @keyframes shrink {
    from { width: 100%; }
    to { width: 0%; }
  }
`;
if (typeof document !== "undefined") {
  document.head.appendChild(style);
}

// Toast Hook
let toastId = 0;
const toastCallbacks: Set<(toasts: ToastProps[]) => void> = new Set();
let toasts: ToastProps[] = [];

function notify() {
  toastCallbacks.forEach((callback) => callback([...toasts]));
}

export const toast = {
  success: (message: string, title?: string, duration?: number) => {
    toastId++;
    const newToast: ToastProps = {
      id: `toast-${toastId}`,
      type: "success",
      message,
      ...(title !== undefined && { title }),
      ...(duration !== undefined && { duration }),
      onClose: () => removeToast(`toast-${toastId}`),
    };
    toasts.push(newToast);
    notify();
  },

  error: (message: string, title?: string, duration?: number) => {
    toastId++;
    const newToast: ToastProps = {
      id: `toast-${toastId}`,
      type: "error",
      message,
      ...(title !== undefined && { title }),
      ...(duration !== undefined && { duration }),
      onClose: () => removeToast(`toast-${toastId}`),
    };
    toasts.push(newToast);
    notify();
  },

  warning: (message: string, title?: string, duration?: number) => {
    toastId++;
    const newToast: ToastProps = {
      id: `toast-${toastId}`,
      type: "warning",
      message,
      ...(title !== undefined && { title }),
      ...(duration !== undefined && { duration }),
      onClose: () => removeToast(`toast-${toastId}`),
    };
    toasts.push(newToast);
    notify();
  },

  info: (message: string, title?: string, duration?: number) => {
    toastId++;
    const newToast: ToastProps = {
      id: `toast-${toastId}`,
      type: "info",
      message,
      ...(title !== undefined && { title }),
      ...(duration !== undefined && { duration }),
      onClose: () => removeToast(`toast-${toastId}`),
    };
    toasts.push(newToast);
    notify();
  },
};

function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

export function useToast() {
  const [currentToasts, setCurrentToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    toastCallbacks.add(setCurrentToasts);
    return () => {
      toastCallbacks.delete(setCurrentToasts);
    };
  }, []);

  return { toasts: currentToasts, toast };
}
