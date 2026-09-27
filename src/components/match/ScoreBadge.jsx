import React from 'react';
import { MATCH_STATUS } from '../../utils/constants.js';
import { LiveIndicator } from './LiveIndicator.jsx';
import { Clock } from 'lucide-react';

export function ScoreBadge({ status, score, minute, timeDisplay }) {
  if (status === MATCH_STATUS.LIVE) {
    return (
      <div className="flex items-center space-x-2">
        {score && (
          <span className="font-extrabold text-sm sm:text-base font-mono text-sport-text px-2 py-0.5 rounded bg-pitch-surface border border-pitch-border">
            {score.home} - {score.away}
          </span>
        )}
        <LiveIndicator minute={minute} />
      </div>
    );
  }

  if (status === MATCH_STATUS.FINISHED) {
    return (
      <div className="flex items-center space-x-2">
        {score && (
          <span className="font-extrabold text-sm sm:text-base font-mono text-sport-text px-2 py-0.5 rounded bg-pitch-surface border border-pitch-border">
            {score.home} - {score.away}
          </span>
        )}
        <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-sport-muted text-xs font-bold tracking-wider uppercase">
          FT
        </span>
      </div>
    );
  }

  // Upcoming Match
  return (
    <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-xs font-semibold">
      <Clock className="w-3.5 h-3.5 shrink-0" />
      <span>{timeDisplay || 'Upcoming'}</span>
    </div>
  );
}

export default ScoreBadge;
