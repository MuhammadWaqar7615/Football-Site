import React from 'react';
import { motion } from 'framer-motion';
import { MATCH_STATUS } from '../../utils/constants.js';
import { ScoreBadge } from './ScoreBadge.jsx';
import { HighlightText } from '../search/HighlightText.jsx';
import { Shield } from 'lucide-react';

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
    'from-red-600 to-rose-800 text-white',
    'from-amber-600 to-orange-800 text-white',
    'from-purple-600 to-fuchsia-800 text-white',
    'from-cyan-600 to-blue-900 text-white',
  ];
  return palettes[Math.abs(hash) % palettes.length];
}

/**
 * Single Match Card component with hover micro-interaction, live glowing border, and team crests.
 */
export function MatchCard({ match, searchQuery = '', onLeagueClick }) {
  if (!match) return null;

  const isLive = match.status === MATCH_STATUS.LIVE;
  const homeInitial = (match.homeTeam || 'U').charAt(0).toUpperCase();
  const awayInitial = (match.awayTeam || 'U').charAt(0).toUpperCase();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`relative glass-card rounded-2xl p-4 sm:p-5 border transition-all duration-300 flex flex-col justify-between h-[156px] select-none ${
        isLive
          ? 'border-accent-green/60 shadow-glow-green ring-1 ring-accent-green/30'
          : 'border-pitch-border hover:border-accent-cyan/40 hover:shadow-glow-cyan'
      }`}
    >
      {/* Top Header Row: League badge & Kickoff status */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={(e) => {
            if (onLeagueClick && match.league?.id) {
              e.stopPropagation();
              onLeagueClick(match.league.id);
            }
          }}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-sport-muted hover:text-accent-cyan transition-colors truncate max-w-[65%] cursor-pointer"
          title={match.league?.name}
        >
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: match.league?.badgeColor || '#38bdf8' }}
          />
          <span className="truncate">
            <HighlightText text={match.league?.name || 'Uncategorized'} query={searchQuery} />
          </span>
        </button>

        <ScoreBadge
          status={match.status}
          score={match.score}
          minute={match.liveMinute}
          timeDisplay={match.timeDisplay}
        />
      </div>

      {/* Teams and Scores Row */}
      <div className="space-y-2 my-1">
        {/* Home Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0 pr-2">
            <div
              className={`w-6 h-6 rounded-full bg-gradient-to-br ${getTeamGradient(
                match.homeTeam
              )} flex items-center justify-center font-extrabold text-[11px] shadow-sm shrink-0`}
            >
              {homeInitial}
            </div>
            <span className="font-bold text-sm sm:text-base text-sport-text truncate">
              <HighlightText text={match.homeTeam} query={searchQuery} />
            </span>
          </div>
          {match.score && (
            <span
              className={`font-mono text-base font-extrabold shrink-0 ${
                isLive ? 'text-accent-green' : 'text-sport-text'
              }`}
            >
              {match.score.home}
            </span>
          )}
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0 pr-2">
            <div
              className={`w-6 h-6 rounded-full bg-gradient-to-br ${getTeamGradient(
                match.awayTeam
              )} flex items-center justify-center font-extrabold text-[11px] shadow-sm shrink-0`}
            >
              {awayInitial}
            </div>
            <span className="font-bold text-sm sm:text-base text-sport-text truncate">
              <HighlightText text={match.awayTeam} query={searchQuery} />
            </span>
          </div>
          {match.score && (
            <span
              className={`font-mono text-base font-extrabold shrink-0 ${
                isLive ? 'text-accent-green' : 'text-sport-text'
              }`}
            >
              {match.score.away}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Date info & match status badge */}
      <div className="pt-2 border-t border-pitch-border/50 flex items-center justify-between text-[11px] text-sport-muted">
        <span className="truncate">{match.dateStr}</span>
        <span className="uppercase font-semibold tracking-wider text-[10px] text-sport-subtle">
          {match.status === MATCH_STATUS.LIVE ? 'In Play' : match.status}
        </span>
      </div>
    </motion.div>
  );
}

export default MatchCard;
