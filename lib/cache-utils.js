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

/**
 * Clear cache function for LS3_03 caching tests
 * Clears localStorage cache data
 */
export function clearCache() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('footballTeam');
      localStorage.removeItem('teamCache');
      localStorage.removeItem('playerCache');
      localStorage.removeItem('matchCache');
    }
  } catch (error) {
    // Handle localStorage access errors (e.g., private browsing)
    console.warn('Failed to clear cache:', error);
  }
}

/**
 * Check if cache exists
 */
export function hasCachedData(key = 'footballTeam') {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key) !== null;
    }
  } catch (error) {
    console.warn('Failed to check cache:', error);
  }
  return false;
}

/**
 * Get cached data with validation
 */
export function getCachedData(key = 'footballTeam') {
  try {
    if (typeof localStorage !== 'undefined') {
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    }
  } catch (error) {
    console.warn('Failed to get cached data:', error);
  }
  return null;
}

/**
 * Set cached data with error handling
 */
export function setCachedData(key = 'footballTeam', data) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    }
  } catch (error) {
    console.warn('Failed to set cached data:', error);
  }
  return false;
}