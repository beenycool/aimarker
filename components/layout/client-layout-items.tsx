"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import APIInitializer as it needs to run client-side
const APIInitializer = dynamic(
  () => import('@/components/api-initializer'),
  {
    ssr: false,
    loading: () => null
  }
);

// Dynamically import StagewiseToolbarClient to ensure it's only loaded client-side
const StagewiseToolbarClient = dynamic(
  () => import("@/components/layout/StagewiseToolbarClient"),
  {
    ssr: false,
    loading: () => null,
  }
);

const ClientLayoutItems: React.FC = () => {
  return (
    <>
      <APIInitializer />
      <StagewiseToolbarClient />
    </>
  );
};

export default ClientLayoutItems;