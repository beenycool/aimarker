'use client';

import { useEffect, useRef } from 'react';
import { initPerformanceMonitoring, memoryOptimizer, serviceWorkerUtils } from '@/lib/performance-utils';

export const usePerformanceMonitoring = () => {
  const initialized = useRef(false);
  const performanceData = useRef({
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null
  });

  useEffect(() => {
    if (initialized.current || typeof window === 'undefined') return;
    initialized.current = true;

    // Initialize performance monitoring
    initPerformanceMonitoring();

    // Register service worker for caching
    serviceWorkerUtils.register();

    // Monitor Core Web Vitals
    const measureWebVitals = () => {
      // Time to First Byte
      if ('performance' in window && 'getEntriesByType' in performance) {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          performanceData.current.ttfb = navigation.responseStart - navigation.requestStart;
        }
      }

      // Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            if (entries.length > 0) {
              const lastEntry = entries[entries.length - 1];
              performanceData.current.lcp = lastEntry.startTime;
            }
          });
          lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

          // First Input Delay
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              performanceData.current.fid = entry.processingStart - entry.startTime;
            });
          });
          fidObserver.observe({ type: 'first-input', buffered: true });

          // Cumulative Layout Shift
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
                performanceData.current.cls = clsValue;
              }
            });
          });
          clsObserver.observe({ type: 'layout-shift', buffered: true });
        } catch (error) {
          console.warn('Performance Observer not supported:', error);
        }
      }
    };

    // Memory management
    const scheduleMemoryCleanup = () => {
      // Clean up memory every 5 minutes
      const interval = setInterval(() => {
        memoryOptimizer.scheduleCleanup();
      }, 300000);

      return () => clearInterval(interval);
    };

    // Resource hints for critical resources
    const addResourceHints = () => {
      const hints = [
        { rel: 'prefetch', href: '/games' },
        { rel: 'prefetch', href: '/marker' },
        { rel: 'preload', href: '/sounds/notify.mp3', as: 'audio' },
        { rel: 'preload', href: '/sounds/game-end.mp3', as: 'audio' }
      ];

      hints.forEach(hint => {
        const link = document.createElement('link');
        Object.assign(link, hint);
        document.head.appendChild(link);
      });
    };

    // Report performance data (in development)
    const reportPerformance = () => {
      if (process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          console.group('Performance Metrics');
          console.log('LCP:', performanceData.current.lcp?.toFixed(2), 'ms');
          console.log('FID:', performanceData.current.fid?.toFixed(2), 'ms');
          console.log('CLS:', performanceData.current.cls?.toFixed(4));
          console.log('TTFB:', performanceData.current.ttfb?.toFixed(2), 'ms');
          
          const memoryInfo = memoryOptimizer.getMemoryInfo();
          if (memoryInfo) {
            console.log('Memory Usage:', {
              used: Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024) + ' MB',
              total: Math.round(memoryInfo.totalJSHeapSize / 1024 / 1024) + ' MB',
              limit: Math.round(memoryInfo.jsHeapSizeLimit / 1024 / 1024) + ' MB'
            });
          }
          console.groupEnd();
        }, 3000);
      }
    };

    measureWebVitals();
    addResourceHints();
    reportPerformance();
    const cleanupMemory = scheduleMemoryCleanup();

    return () => {
      cleanupMemory();
    };
  }, []);

  return {
    getPerformanceData: () => performanceData.current,
    triggerMemoryCleanup: () => memoryOptimizer.scheduleCleanup()
  };
};

export default usePerformanceMonitoring;