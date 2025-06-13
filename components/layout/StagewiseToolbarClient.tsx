"use client";

// Stagewise toolbar is disabled for web deployment
// It's designed for IDE integration (Cursor, Windsurf, etc.)
export default function StagewiseToolbarClient() {
  // Return null to render nothing - toolbar not needed in web environment
  return null;
} 