import React from 'react';

/**
 * Loading Skeleton placeholders — maintains layout while data loads.
 */
export const SkeletonBlock = ({ className = '' }) => (
  <div className={`skeleton ${className}`} />
);

export const HeroSkeleton = () => (
  <div className="glass-card p-6 md:p-8 animate-fade-in">
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <SkeletonBlock className="h-7 w-40" />
          <SkeletonBlock className="h-4 w-24" />
        </div>
        <SkeletonBlock className="h-5 w-32" />
      </div>
      <div className="flex items-center gap-6 mt-4">
        <SkeletonBlock className="h-20 w-20 rounded-full" />
        <div className="flex flex-col gap-3">
          <SkeletonBlock className="h-16 w-36" />
          <SkeletonBlock className="h-5 w-28" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-8" />
        ))}
      </div>
    </div>
  </div>
);

export const StatsSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
    {Array.from({ length: 9 }).map((_, i) => (
      <div key={i} className="glass-card p-4 flex flex-col gap-3 animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
        <SkeletonBlock className="h-4 w-3/4" />
        <SkeletonBlock className="h-8 w-1/2" />
        <SkeletonBlock className="h-2 w-full" />
      </div>
    ))}
  </div>
);

export const HourlyForecastSkeleton = () => (
  <div className="flex gap-3 overflow-hidden">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="glass-card p-4 flex-shrink-0 w-24 flex flex-col gap-3 items-center animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
        <SkeletonBlock className="h-3 w-12" />
        <SkeletonBlock className="h-8 w-8 rounded-full" />
        <SkeletonBlock className="h-4 w-10" />
        <SkeletonBlock className="h-3 w-8" />
      </div>
    ))}
  </div>
);

export const ForecastSkeleton = () => (
  <div className="flex flex-col gap-2">
    {Array.from({ length: 7 }).map((_, i) => (
      <div key={i} className="glass-card px-5 py-4 flex items-center gap-4 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
        <SkeletonBlock className="h-4 w-16" />
        <SkeletonBlock className="h-7 w-7 rounded-full ml-auto" />
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-4 w-16" />
      </div>
    ))}
  </div>
);

const LoadingSkeleton = () => (
  <div className="flex flex-col gap-6 animate-fade-in">
    <HeroSkeleton />
    <StatsSkeleton />
    <HourlyForecastSkeleton />
    <ForecastSkeleton />
  </div>
);

export default LoadingSkeleton;
