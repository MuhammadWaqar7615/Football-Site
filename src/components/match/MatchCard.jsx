import React from 'react';
import { motion } from 'framer-motion';
import { MATCH_STATUS } from '../../utils/constants.js';
import { ScoreBadge } from './ScoreBadge.jsx';
import { HighlightText } from '../search/HighlightText.jsx';

/**
 * Generate a consistent team badge color gradient from team name
 */
function getTeamGradient(name) {
  if (!name || name === 'Unknown Team') return 'from-slate-700 to-slate-800 text-slate-300';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const palettes = [
    'from-emerald-600 to-teal-800 text-white',
    'from-sky-600 to-blue-800 text-white',
    'from-indigo-600 to-violet-800 text-white',
    'from-rose-600 to-red-800 text-white',
    'from-amber-600 to-orange-800 text-white',
    'from-purple-600 to-fuchsia-800 text-white',
    'from-cyan-600 to-blue-900 text-white',
  ];
  return palettes[Math.abs(hash) % palettes.length];
}

/**
 * Highly responsive Match Card component with fluid typography,
 * consistent score blocks, and live highlight state.
 */
export function MatchCard({ match, searchQuery = '', onLeagueClick }) {
  if (!match) return null;

  const isLive = match.status === MATCH_STATUS.LIVE;
  const homeInitial = (match.homeTeam || 'U').charAt(0).toUpperCase();
  const awayInitial = (match.awayTeam || 'U').charAt(0).toUpperCase();

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`relative glass-card rounded-2xl p-4 sm:p-5 border transition-all duration-200 flex flex-col justify-between min-h-[160px] h-full select-none ${
        isLive
          ? 'border-accent-green/60 shadow-glow-green ring-1 ring-accent-green/30'
          : 'border-pitch-border hover:border-accent-cyan/40 hover:shadow-glow-cyan'
      }`}
    >
      {/* 1. Top Header Row: League badge button & Match status pill */}
      <div className="flex items-center justify-between gap-2 w-full pb-1 border-b border-pitch-border/30">
        <button
          type="button"
          onClick={(e) => {
            if (onLeagueClick && match.league?.id) {
              e.stopPropagation();
              onLeagueClick(match.league.id);
            }
          }}
          className="inline-flex items-center space-x-1.5 min-w-0 flex-1 text-left text-xs font-semibold text-sport-muted hover:text-accent-cyan transition-colors cursor-pointer group"
          title={match.league?.name || 'League details'}
        >
          <span
            className="w-2 h-2 rounded-full shrink-0 group-hover:scale-125 transition-transform"
            style={{ backgroundColor: match.league?.badgeColor || '#38bdf8' }}
          />
          <span className="truncate block font-medium">
            <HighlightText text={match.league?.name || 'Uncategorized'} query={searchQuery} />
          </span>
        </button>

        <ScoreBadge
          status={match.status}
          score={match.score}
          minute={match.liveMinute}
          timeDisplay={match.timeDisplay}
          showScore={false}
        />
      </div>

      {/* 2. Teams & Scores Row: Fully responsive with dedicated score boxes */}
      <div className="space-y-2.5 my-2.5 flex-1 flex flex-col justify-center">
        {/* Home Team */}
        <div className="flex items-center justify-between gap-2 w-full">
          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
            <div
              className={`w-6 h-6 rounded-full bg-gradient-to-br ${getTeamGradient(
                match.homeTeam
              )} flex items-center justify-center font-extrabold text-[11px] shadow-sm shrink-0`}
              aria-hidden="true"
            >
              {homeInitial}
            </div>
            <span
              className="font-bold text-xs sm:text-sm text-sport-text truncate block flex-1 min-w-0 tracking-tight"
              title={match.homeTeam}
            >
              <HighlightText text={match.homeTeam} query={searchQuery} />
            </span>
          </div>

          {/* Home Score Box */}
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-mono text-sm sm:text-base font-bold shrink-0 select-none ${
              isLive
                ? 'bg-accent-green/15 text-accent-green border border-accent-green/30'
                : match.score
                ? 'bg-pitch-surface text-sport-text border border-pitch-border'
                : 'bg-pitch-surface/40 text-sport-subtle text-xs border border-pitch-border/40'
            }`}
          >
            {match.score ? match.score.home : '-'}
          </div>
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between gap-2 w-full">
          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
            <div
              className={`w-6 h-6 rounded-full bg-gradient-to-br ${getTeamGradient(
                match.awayTeam
              )} flex items-center justify-center font-extrabold text-[11px] shadow-sm shrink-0`}
              aria-hidden="true"
            >
              {awayInitial}
            </div>
            <span
              className="font-bold text-xs sm:text-sm text-sport-text truncate block flex-1 min-w-0 tracking-tight"
              title={match.awayTeam}
            >
              <HighlightText text={match.awayTeam} query={searchQuery} />
            </span>
          </div>

          {/* Away Score Box */}
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-mono text-sm sm:text-base font-bold shrink-0 select-none ${
              isLive
                ? 'bg-accent-green/15 text-accent-green border border-accent-green/30'
                : match.score
                ? 'bg-pitch-surface text-sport-text border border-pitch-border'
                : 'bg-pitch-surface/40 text-sport-subtle text-xs border border-pitch-border/40'
            }`}
          >
            {match.score ? match.score.away : '-'}
          </div>
        </div>
      </div>

      {/* 3. Card Footer: Date info & match status */}
      <div className="pt-2 border-t border-pitch-border/50 flex items-center justify-between gap-2 text-[10px] sm:text-[11px] text-sport-muted">
        <span className="truncate font-medium">{match.dateStr}</span>
        <span
          className={`uppercase font-semibold tracking-wider text-[10px] shrink-0 ${
            isLive ? 'text-accent-green font-bold' : 'text-sport-subtle'
          }`}
        >
          {isLive ? 'In Play' : match.status === MATCH_STATUS.FINISHED ? 'Full Time' : 'Scheduled'}
        </span>
      </div>
    </motion.div>
  );
}

export default MatchCard;
