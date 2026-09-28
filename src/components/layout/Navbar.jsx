import React from 'react';
import { Trophy, Search, Flame, Radio } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle.jsx';
import { useMatchData } from '../../context/MatchDataContext.jsx';
import { useNormalizedLeagues } from '../../hooks/useNormalizedLeagues.js';

export function Navbar({ onOpenSearch, onNavigateHome, onSelectLeague, activeLeagueSlug = null }) {
  const { liveCount } = useMatchData();
  const { topLeagues } = useNormalizedLeagues();

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-pitch-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-6">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center space-x-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-green/20 to-accent-cyan/10 border border-accent-green/40 flex items-center justify-center text-accent-green group-hover:shadow-glow-green transition-all">
              <Trophy className="w-5 h-5 transition-transform group-hover:scale-110" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r dark:from-white dark:via-slate-100 dark:to-accent-cyan from-slate-950 via-slate-800 to-emerald-600 bg-clip-text text-transparent">
                MATCHPULSE
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-accent-green">
                Live Football
              </span>
            </div>
          </button>

          {/* Top Leagues Quick Links in Navbar */}
          <nav className="hidden lg:flex items-center space-x-1 pl-4 border-l border-pitch-border/60">
            {topLeagues.map((league) => {
              const isActive = activeLeagueSlug === league.id;
              return (
                <button
                  key={league.id}
                  type="button"
                  onClick={() => onSelectLeague && onSelectLeague(league.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-accent-green/15 text-accent-green border border-accent-green/40'
                      : 'text-sport-muted hover:text-sport-text hover:bg-pitch-surface'
                  }`}
                >
                  {league.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action Shell: Live Badge, Search Trigger, Theme Switcher */}
        <div className="flex items-center space-x-3">
          {/* Active Live Match Count Badge */}
          {liveCount > 0 && (
            <div className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold tracking-wide">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>{liveCount} LIVE</span>
            </div>
          )}

          {/* Search Trigger Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl bg-pitch-card hover:bg-pitch-hover text-sport-muted hover:text-sport-text border border-pitch-border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-green/50"
            aria-label="Search matches or leagues"
          >
            <Search className="w-4 h-4 text-sport-muted" />
            <span className="hidden sm:inline text-xs font-medium">Quick search...</span>
            <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-pitch-surface border border-pitch-border text-sport-subtle">
              ⌘K
            </kbd>
          </button>

          {/* Dynamic Theme Switcher */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
