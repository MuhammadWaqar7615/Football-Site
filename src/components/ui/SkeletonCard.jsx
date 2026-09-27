import React from 'react';

/**
 * Loading skeleton matching the exact dimensions and layout of MatchCard with shimmer pulse effect.
 */
export function SkeletonCard() {
  return (
    <div className="relative overflow-hidden glass-card rounded-2xl p-4 sm:p-5 border border-pitch-border flex flex-col justify-between h-[156px]">
      {/* Top Meta Row */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-28 bg-pitch-hover/60 rounded-md animate-pulse"></div>
        <div className="h-4 w-16 bg-pitch-hover/40 rounded-full animate-pulse"></div>
      </div>

      {/* Teams and Score Section */}
      <div className="space-y-2.5 my-2">
        {/* Home Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-full bg-pitch-hover/80 animate-pulse shrink-0"></div>
            <div className="h-4 w-36 sm:w-44 bg-pitch-hover/60 rounded animate-pulse"></div>
          </div>
          <div className="h-4 w-6 bg-pitch-hover/50 rounded animate-pulse"></div>
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-full bg-pitch-hover/80 animate-pulse shrink-0"></div>
            <div className="h-4 w-32 sm:w-40 bg-pitch-hover/60 rounded animate-pulse"></div>
          </div>
          <div className="h-4 w-6 bg-pitch-hover/50 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Bottom Footer Info */}
      <div className="pt-2 border-t border-pitch-border/50 flex items-center justify-between">
        <div className="h-3 w-20 bg-pitch-hover/40 rounded animate-pulse"></div>
        <div className="h-4 w-14 bg-pitch-hover/50 rounded-full animate-pulse"></div>
      </div>

      {/* Shimmer sweep overlay */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none"></div>
    </div>
  );
}

export default SkeletonCard;
