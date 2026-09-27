import React from 'react';

/**
 * Pulsing live radar indicator with minute counter.
 */
export function LiveIndicator({ minute, className = '' }) {
  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 text-xs font-extrabold tracking-wide uppercase select-none ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
      </span>
      <span>{minute ? `${minute}'` : 'LIVE'}</span>
    </span>
  );
}

export default LiveIndicator;
