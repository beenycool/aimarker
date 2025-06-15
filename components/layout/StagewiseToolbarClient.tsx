"use client";

import { useEffect } from 'react';

// Global flag to prevent multiple initializations
let isToolbarInitialized = false;

// Stagewise toolbar is disabled for web deployment
// It's designed for IDE integration (Cursor, Windsurf, etc.)
export default function StagewiseToolbarClient() {
  useEffect(() => {
    // Only initialize in development mode and if not already initialized
    if (process.env.NODE_ENV === 'development' && !isToolbarInitialized) {
      isToolbarInitialized = true;
      
      // Use dynamic import to avoid SSR issues
      import('@stagewise/toolbar').then((module) => {
        const { initToolbar } = module;
        
        initToolbar({
          plugins: [],
        });
      }).catch((error) => {
        console.warn('Failed to initialize stagewise toolbar:', error);
      });
    }
  }, []);

  // Return null as we're using the imperative API
  return null;
} 