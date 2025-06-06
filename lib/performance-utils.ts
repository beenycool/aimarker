// Performance monitoring and optimization utilities
export const performanceObserver = {
  // Measure and log Largest Contentful Paint
  observeLCP: () => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformancePaintTiming;
        console.log('LCP:', lastEntry.startTime);
      });
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    }
  },

  // Measure and log First Input Delay
  observeFID: () => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as any;
          const fid = fidEntry.processingStart - fidEntry.startTime;
          console.log('FID:', fid);
        }
      });
      observer.observe({ type: 'first-input', buffered: true });
    }
  },

  // Measure and log Cumulative Layout Shift
  observeCLS: () => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const clsEntry = entry as any;
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value;
            console.log('CLS:', clsValue);
          }
        }
      });
      observer.observe({ type: 'layout-shift', buffered: true });
    }
  }
};

// Resource preloading utilities
export const preloadResource = (href: string, as: string, type?: string) => {
  if (typeof window !== 'undefined' && document) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  }
};

// Critical resource hints
export const addResourceHints = () => {
  if (typeof window !== 'undefined' && document) {
    const hints = [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'dns-prefetch', href: '//cdn.jsdelivr.net' },
    ];

    hints.forEach(hint => {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      if (hint.crossOrigin) link.crossOrigin = hint.crossOrigin;
      document.head.appendChild(link);
    });
  }
};

// Lazy loading with Intersection Observer
export const createLazyLoader = (threshold = 0.1) => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
        }
      });
    },
    { threshold, rootMargin: '50px 0px' }
  );
};

// Memory optimization utilities
export const memoryOptimizer = {
  // Clean up unused resources
  cleanup: () => {
    if (typeof window !== 'undefined' && window.gc) {
      window.gc();
    }
  },

  // Monitor memory usage
  getMemoryInfo: () => {
    if (typeof window !== 'undefined' && (performance as any).memory) {
      return (performance as any).memory;
    }
    return null;
  },

  // Debounced memory cleanup
  scheduleCleanup: (() => {
    let timeoutId: NodeJS.Timeout;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        memoryOptimizer.cleanup();
      }, 5000);
    };
  })()
};

// Bundle size analyzer
export const bundleAnalyzer = {
  logBundleInfo: () => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      
      console.group('Bundle Analysis');
      console.log('Scripts loaded:', scripts.length);
      console.log('Stylesheets loaded:', styles.length);
      console.groupEnd();
    }
  }
};

// Service Worker utilities for caching
export const serviceWorkerUtils = {
  register: async () => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('SW registered:', registration);
        return registration;
      } catch (error) {
        console.log('SW registration failed:', error);
      }
    }
  },

  unregister: async () => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(reg => reg.unregister()));
    }
  }
};

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  if (typeof window !== 'undefined') {
    performanceObserver.observeLCP();
    performanceObserver.observeFID();
    performanceObserver.observeCLS();
    addResourceHints();
    bundleAnalyzer.logBundleInfo();
  }
};