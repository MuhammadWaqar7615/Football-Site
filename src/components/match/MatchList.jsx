import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatchCard } from './MatchCard.jsx';
import { StickyDateHeader } from './StickyDateHeader.jsx';
import { SkeletonCard } from '../ui/SkeletonCard.jsx';
import { Button } from '../ui/Button.jsx';
import { Trophy, RefreshCw, AlertCircle } from 'lucide-react';

export function MatchList({
  groupedMatches = [],
  loading = false,
  error = null,
  searchQuery = '',
  onResetFilters,
  onLeagueClick,
  skeletonCount = 6,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card rounded-2xl p-8 border border-red-500/30 text-center max-w-md mx-auto my-12 space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-sport-text">Unable to Load Matches</h3>
        <p className="text-sm text-sport-muted">{error}</p>
        {onResetFilters && (
          <Button variant="secondary" onClick={onResetFilters} icon={RefreshCw}>
            Try Again
          </Button>
        )}
      </div>
    );
  }

  const totalMatches = groupedMatches.reduce((acc, g) => acc + g.matches.length, 0);

  if (totalMatches === 0) {
    return (
      <div className="glass-card rounded-2xl p-10 border border-pitch-border text-center max-w-lg mx-auto my-12 space-y-5">
        {/* Friendly Sporty Vector Icon Graphic */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-accent-green/10 animate-pulse-subtle"></div>
          <div className="w-16 h-16 rounded-full bg-pitch-surface border border-pitch-border flex items-center justify-center text-sport-muted">
            <Trophy className="w-8 h-8 opacity-60" />
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xl font-extrabold text-sport-text">No Matches Found</h3>
          <p className="text-sm text-sport-muted">
            {searchQuery
              ? `No fixtures matching "${searchQuery}". Try searching for another team or league.`
              : 'There are no football matches matching your current filter selections.'}
          </p>
        </div>

        {onResetFilters && (
          <Button variant="primary" onClick={onResetFilters} icon={RefreshCw}>
            Reset All Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groupedMatches.map((group) => (
        <section key={group.dateKey} className="space-y-4">
          <StickyDateHeader label={group.label} count={group.matches.length} />

          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence>
              {group.matches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  searchQuery={searchQuery}
                  onLeagueClick={onLeagueClick}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </section>
      ))}
    </div>
  );
}

export default MatchList;
