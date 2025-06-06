import React from 'react';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', children }) => (
  <div
    className={`animate-pulse bg-muted rounded-md ${className}`}
    aria-hidden="true"
    role="presentation"
  >
    {children}
  </div>
);

export const HeaderSkeleton = () => (
  <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-14 items-center">
      <Skeleton className="h-6 w-32" />
      <div className="ml-auto flex items-center space-x-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  </div>
);

export const FormSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-32 w-full" />
    </div>
    <div className="flex space-x-2">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);

export const CardSkeleton = () => (
  <div className="rounded-lg border bg-card p-6">
    <div className="space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  </div>
);

export const TableSkeleton = () => (
  <div className="w-full">
    <div className="border rounded-md">
      <div className="border-b px-4 py-3">
        <div className="flex space-x-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border-b px-4 py-3 last:border-b-0">
          <div className="flex space-x-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const GamesSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="space-y-6">
      <HeaderSkeleton />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <TableSkeleton />
    </div>
  </div>
);

export const MainPageSkeleton = () => (
  <div className="min-h-screen bg-background">
    <HeaderSkeleton />
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-96 mx-auto" />
          <Skeleton className="h-6 w-64 mx-auto" />
        </div>
        <FormSkeleton />
        <div className="grid gap-4 md:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  </div>
);

export default Skeleton;