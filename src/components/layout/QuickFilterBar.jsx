import React from 'react';
import { motion } from 'framer-motion';
import { useNormalizedLeagues } from '../../hooks/useNormalizedLeagues.js';
import { useMatchData } from '../../context/MatchDataContext.jsx';
import { Layers } from 'lucide-react';

export function QuickFilterBar({ selectedLeagueSlug = 'all', onSelectLeague }) {
  const { topLeagues, allLeagues } = useNormalizedLeagues();
  const { totalCount } = useMatchData();

  // Combine All option + top leagues + other popular leagues
  const displayLeagues = [
    { id: 'all', name: 'All Leagues', count: totalCount },
    ...topLeagues,
    ...allLeagues.slice(4, 10),
  ];

  return (
    <div className="w-full overflow-hidden py-1">
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1">
        {displayLeagues.map((league) => {
          const isSelected = selectedLeagueSlug === league.id;

          return (
            <motion.button
              key={league.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => onSelectLeague(league.id)}
              className={`shrink-0 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-green/40 ${
                isSelected
                  ? 'bg-accent-green text-slate-950 font-bold shadow-glow-green'
                  : 'bg-pitch-card text-sport-muted hover:text-sport-text hover:bg-pitch-hover border border-pitch-border'
              }`}
            >
              {league.id !== 'all' && (
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: league.badgeColor || '#38bdf8' }}
                />
              )}
              {league.id === 'all' && <Layers className="w-3.5 h-3.5 shrink-0" />}
              <span>{league.name}</span>
              {league.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? 'bg-black/20 text-slate-950 font-bold'
                      : 'bg-pitch-surface text-sport-muted'
                  }`}
                >
                  {league.count}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default QuickFilterBar;
