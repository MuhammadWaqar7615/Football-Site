import React from 'react';

/**
 * Professional, pixel-perfect loading skeleton mirroring MatchCard.
 * Uses hardware-accelerated shimmer sweeping with zero layout shift
 * in both sporty dark and crisp light modes.
 */
export function SkeletonCard() {
  return (
    <div
      aria-hidden="true"
      className="glass-card skeleton-container rounded-2xl p-4 sm:p-5 border border-pitch-border flex flex-col justify-between min-h-[160px] h-full select-none"
    >
      {/* Top Meta Row: League dot & name + Status pill */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="w-2 h-2 rounded-full skeleton-bone shrink-0" />
          <div className="h-3.5 w-24 sm:w-32 skeleton-bone" />
        </div>
        <div className="h-5 w-16 rounded-full skeleton-bone shrink-0" />
      </div>

      {/* Teams and Scores Section */}
      <div className="space-y-2.5 my-2">
        {/* Home Team Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
            <div className="w-6 h-6 rounded-full skeleton-bone shrink-0" />
            <div className="h-4 w-28 sm:w-40 skeleton-bone rounded-md" />
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg skeleton-bone shrink-0" />
        </div>

        {/* Away Team Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
            <div className="w-6 h-6 rounded-full skeleton-bone shrink-0" />
            <div className="h-4 w-32 sm:w-36 skeleton-bone rounded-md" />
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg skeleton-bone shrink-0" />
        </div>
      </div>

      {/* Card Footer: Date & Status Pill */}
      <div className="pt-2 border-t border-pitch-border/50 flex items-center justify-between gap-2">
        <div className="h-3 w-20 sm:w-28 skeleton-bone rounded" />
        <div className="h-3 w-12 skeleton-bone rounded" />
      </div>
    </div>
  );
}

export default SkeletonCard;
