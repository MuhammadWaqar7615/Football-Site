import React from 'react';
import { Calendar } from 'lucide-react';

/**
 * Sticky Date Header with blurred glassmorphism background and fixture counter.
 */
export function StickyDateHeader({ label, count }) {
  return (
    <div className="sticky top-16 z-20 py-2 my-3 glass-panel rounded-xl border border-pitch-border/80 shadow-sm transition-colors">
      <div className="flex items-center justify-between px-3 sm:px-4">
        <div className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-sport-text tracking-wide uppercase">
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-green shrink-0" />
          <span className="truncate">{label}</span>
        </div>
        {count !== undefined && (
          <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full bg-pitch-surface text-sport-muted border border-pitch-border shrink-0 ml-2">
            {count} {count === 1 ? 'fixture' : 'fixtures'}
          </span>
        )}
      </div>
    </div>
  );
}

export default StickyDateHeader;
