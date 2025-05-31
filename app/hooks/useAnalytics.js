'use client';

// Empty implementation of analytics hooks
export function useAnalytics() {
  return {
    trackEvent: () => {},
    identifyUser: () => {},
    resetUser: () => {},
    trackPageView: () => {},
    setTracking: () => {}
  };
}