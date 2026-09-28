import React from 'react';
import { MATCH_STATUS } from '../../utils/constants.js';
import { LiveIndicator } from './LiveIndicator.jsx';
import { Clock } from 'lucide-react';

/**
 * Compact, responsive Match Status / Kickoff pill for headers and lists.
 */
export function ScoreBadge({ status, score, minute, timeDisplay, showScore = false, className = '' }) {
  if (status === MATCH_STATUS.LIVE) {
    return (
      <div className={`flex items-center space-x-1.5 shrink-0 ${className}`}>
        {showScore && score && (
          <span className="font-extrabold text-xs sm:text-sm font-mono text-sport-text px-2 py-0.5 rounded bg-pitch-surface border border-pitch-border">
            {score.home} - {score.away}
          </span>
        )}
        <LiveIndicator minute={minute} />
      </div>
    );
  }

  if (status === MATCH_STATUS.FINISHED) {
    return (
      <div className={`flex items-center space-x-1.5 shrink-0 ${className}`}>
        {showScore && score && (
          <span className="font-extrabold text-xs sm:text-sm font-mono text-sport-text px-2 py-0.5 rounded bg-pitch-surface border border-pitch-border">
            {score.home} - {score.away}
          </span>
        )}
        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-pitch-surface border border-pitch-border text-sport-muted text-[10px] sm:text-xs font-bold tracking-wider uppercase select-none">
          FT
        </span>
      </div>
    );
  }

  // Upcoming Match
  return (
    <div className={`inline-flex items-center space-x-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/25 text-accent-cyan text-[11px] sm:text-xs font-semibold shrink-0 select-none ${className}`}>
      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
      <span className="truncate max-w-[80px] sm:max-w-none">{timeDisplay || 'Upcoming'}</span>
    </div>
  );
}

export default ScoreBadge;
