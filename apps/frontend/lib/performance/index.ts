// Performance optimization utilities

// Image optimization helper
export const getOptimizedImageUrl = (
  url: string,
  width: number,
  height: number,
  quality: number = 85
): string => {
  // If it's already an external optimized URL, return as is
  if (url.includes('w_') || url.includes('q_')) {
    return url;
  }

  // For Cloudinary or similar services
  if (url.includes('cloudinary')) {
    return url.replace('/upload/', `/upload/w_${width},h_${height},q_${quality},f_auto/`);
  }

  // For Next.js Image optimization
  return url;
};

// Lazy loading intersection observer
export const createLazyLoadObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) => {
  if (typeof window === 'undefined') return null;

  const defaultOptions = {
    rootMargin: '50px 0px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Preload critical resources
export const preloadCriticalResources = () => {
  if (typeof window === 'undefined') return;

  // Preload critical fonts
  const fontPreloads = [
    '/fonts/Satoshi-Variable.woff2',
    '/fonts/SchnyderS-Variable.woff2'
  ];

  fontPreloads.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = font;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // Preload critical images
  const criticalImages = [
    '/og-default.jpg',
    '/logo.png',
    '/hero-bg.jpg'
  ];

  criticalImages.forEach(img => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = img;
    link.as = 'image';
    document.head.appendChild(link);
  });
};

// Debounce utility for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}

// Throttle utility for scroll events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Web Vitals tracking
export const trackWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Track Core Web Vitals
  const trackVital = (name: string, value: number) => {
    // Send to analytics
    if (window.gtag) {
      window.gtag('event', name, {
        event_category: 'Web Vitals',
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        non_interaction: true,
      });
    }
  };

  // LCP (Largest Contentful Paint)
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      trackVital('LCP', entry.startTime);
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // FID (First Input Delay)
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      trackVital('FID', (entry as any).processingStart - entry.startTime);
    }
  }).observe({ entryTypes: ['first-input'] });

  // CLS (Cumulative Layout Shift)
  let clsValue = 0;
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
        trackVital('CLS', clsValue);
      }
    }
  }).observe({ entryTypes: ['layout-shift'] });
};

// Bundle size monitoring
export const trackBundleSize = () => {
  if (typeof window === 'undefined') return;

  // Monitor resource loading
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name.includes('.js') || entry.name.includes('.css')) {
        const size = (entry as PerformanceResourceTiming).transferSize;
        if (size > 100000) { // Log large bundles (>100KB)
          console.warn(`Large bundle detected: ${entry.name} (${Math.round(size / 1024)}KB)`);
        }
      }
    }
  }).observe({ entryTypes: ['resource'] });
};

// Critical CSS detection
export const detectCriticalCSS = () => {
  if (typeof window === 'undefined') return;

  const criticalSelectors = new Set<string>();

  // Get all visible elements above the fold
  const viewportHeight = window.innerHeight;
  const elements = document.querySelectorAll('*');

  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < viewportHeight && rect.bottom > 0) {
      // Element is visible above the fold
      const styles = window.getComputedStyle(el);
      if (styles.display !== 'none' && styles.visibility !== 'hidden') {
        criticalSelectors.add(el.tagName.toLowerCase());
        if (el.className) {
          el.className.split(' ').forEach(className => {
            if (className.trim()) {
              criticalSelectors.add(`.${className}`);
            }
          });
        }
      }
    }
  });

  return Array.from(criticalSelectors);
};

// Service Worker registration
export const registerServiceWorker = async () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('ServiceWorker registered successfully:', registration);
  } catch (error) {
    console.log('ServiceWorker registration failed:', error);
  }
};

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if (typeof window === 'undefined' || !('performance' in window)) return;

  const memory = (performance as any).memory;
  if (memory) {
    const used = memory.usedJSHeapSize / 1048576; // Convert to MB
    const total = memory.totalJSHeapSize / 1048576;
    const limit = memory.jsHeapSizeLimit / 1048576;

    if (used / total > 0.8) { // Warning at 80% memory usage
      console.warn(`High memory usage: ${Math.round(used)}MB / ${Math.round(total)}MB`);
    }

    return { used: Math.round(used), total: Math.round(total), limit: Math.round(limit) };
  }
};

// Connection quality detection
export const getConnectionInfo = () => {
  if (typeof window === 'undefined') return null;

  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

  if (connection) {
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  }

  return null;
};

// Adaptive loading based on connection
export const shouldLoadHighQuality = (): boolean => {
  const connection = getConnectionInfo();

  if (!connection) return true; // Default to high quality

  // Load lower quality on slow connections or save-data mode
  if (connection.saveData || connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
    return false;
  }

  return true;
};

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}