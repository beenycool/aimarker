"use client";

import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';
import usePerformanceMonitoring from './hooks/usePerformanceMonitoring';
import { MainPageSkeleton } from '@/components/loading-skeletons';
// Simplified dynamic import
const AIMarkerComponent = dynamic(
  () => import('./aimarker'),
  {
    ssr: false,
    loading: () => <MainPageSkeleton />,
  }
);

export default function AIMarkerClientWrapper() {
  // Initialize performance monitoring while preserving all functionality
  usePerformanceMonitoring();
  
  return (
    <div className="critical-layout">
      <Suspense fallback={<MainPageSkeleton />}>
        <AIMarkerComponent />
      </Suspense>
    </div>
  );
}