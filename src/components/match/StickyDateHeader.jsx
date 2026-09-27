import React from 'react';
import { Calendar } from 'lucide-react';

export function StickyDateHeader({ label, count }) {
  return (
    <div className="sticky top-16 z-30 py-2.5 my-2 backdrop-blur-md bg-pitch-bg/85 border-y border-pitch-border/60 transition-colors">
      <div className="flex items-center justify-between px-2 sm:px-1">
        <div className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-sport-text tracking-wide uppercase">
          <Calendar className="w-4 h-4 text-accent-green" />
          <span>{label}</span>
        </div>
        {count !== undefined && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-pitch-card text-sport-muted border border-pitch-border">
            {count} {count === 1 ? 'fixture' : 'fixtures'}
          </span>
        )}
      </div>
    </div>
  );
}

export default StickyDateHeader;
