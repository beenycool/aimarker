import React from 'react';

// Provide a fallback implementation for React's cache function
// This is used to fix the "(0 , _react.cache) is not a function" error

/**
 * A fallback implementation of React's cache function
 * This simply returns the original function if React's cache is not available
 */
export function safeCache(fn) {
  try {
    if (typeof React.cache === 'function') {
      return React.cache(fn);
    }
  } catch {
    // React.cache exists but isn't working—fall back
  }
  return fn;
}