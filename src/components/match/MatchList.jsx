import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatchCard } from './MatchCard.jsx';
import { StickyDateHeader } from './StickyDateHeader.jsx';
import { SkeletonCard } from '../ui/SkeletonCard.jsx';
import { Pagination } from '../ui/Pagination.jsx';
import { Button } from '../ui/Button.jsx';
import { Trophy, RefreshCw, AlertCircle } from 'lucide-react';
import { getDateGroupKey, getDateHeaderLabel } from '../../utils/dateUtils.js';

const PAGE_SIZE = 20;

export function MatchList({
  groupedMatches = [],
  loading = false,
  error = null,
  searchQuery = '',
  onResetFilters,
  onLeagueClick,
  skeletonCount = 6,
  currentPage: externalPage,
  onPageChange: externalOnPageChange,
}) {
  const [internalPage, setInternalPage] = useState(1);
  const [targetPage, setTargetPage] = useState(1);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const containerRef = useRef(null);

  const currentPage = externalPage !== undefined ? externalPage : internalPage;

  // Flatten matches across all date groups
  const allMatches = useMemo(() => {
    return groupedMatches.flatMap((g) => g.matches || []);
  }, [groupedMatches]);

  const totalMatches = allMatches.length;
  const totalPages = Math.max(1, Math.ceil(totalMatches / PAGE_SIZE));

  // Reset to page 1 whenever search query or total results change
  useEffect(() => {
    if (externalOnPageChange) {
      if (currentPage > totalPages) {
        externalOnPageChange(1);
      }
    } else {
      setInternalPage(1);
    }
  }, [groupedMatches.length, searchQuery, totalPages]);

  // Handle page change with smooth scroll and momentary skeleton transition
  const handlePageChange = (newPage) => {
    if (newPage === currentPage || newPage < 1 || newPage > totalPages) return;

    setTargetPage(newPage);
    setIsPageTransitioning(true);

    if (externalOnPageChange) {
      externalOnPageChange(newPage);
    } else {
      setInternalPage(newPage);
    }

    // Scroll smoothly to top of match list container
    if (containerRef.current) {
      const topOffset = containerRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
    }

    setTimeout(() => {
      setIsPageTransitioning(false);
    }, 280);
  };

  // Slice 20 matches for the active page
  const pageMatches = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return allMatches.slice(start, start + PAGE_SIZE);
  }, [allMatches, currentPage]);

  // Group the current page's 20 matches by date for clean sticky header rendering
  const pageGroupedMatches = useMemo(() => {
    const groups = new Map();

    for (const match of pageMatches) {
      const groupKey = getDateGroupKey(match.timestamp);
      if (!groups.has(groupKey)) {
        groups.set(groupKey, {
          dateKey: groupKey,
          label: getDateHeaderLabel(match.timestamp),
          matches: [],
        });
      }
      groups.get(groupKey).matches.push(match);
    }

    return Array.from(groups.values());
  }, [pageMatches]);

  // Initial Full Loading State
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-xs font-semibold text-sport-muted uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-accent-green animate-ping"></span>
          <span>Loading live fixtures & schedules...</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <SkeletonCard key={`init-skeleton-${i}`} />
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="glass-card rounded-2xl p-8 border border-red-500/30 text-center max-w-md mx-auto my-12 space-y-4 shadow-xl">
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

  // Empty State
  if (totalMatches === 0) {
    return (
      <div className="glass-card rounded-2xl p-10 border border-pitch-border text-center max-w-lg mx-auto my-12 space-y-5 shadow-xl">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-accent-green/10 animate-pulse-subtle"></div>
          <div className="w-16 h-16 rounded-full bg-pitch-surface border border-pitch-border flex items-center justify-center text-sport-muted">
            <Trophy className="w-8 h-8 opacity-60 text-accent-green" />
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xl font-extrabold text-sport-text">No Matches Found</h3>
          <p className="text-sm text-sport-muted">
            {searchQuery
              ? `No fixtures matching "${searchQuery}". Try checking spelling or searching for another club.`
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
    <div ref={containerRef} className="space-y-8 scroll-mt-24">
      {/* Skeletons on Page Change */}
      {isPageTransitioning ? (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-xs font-semibold text-sport-muted uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-ping"></span>
            <span>Switching to page {targetPage}...</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={`trans-skeleton-${i}`} />
            ))}
          </div>
        </div>
      ) : (
        /* Rendered Page Groups */
        pageGroupedMatches.map((group) => (
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
        ))
      )}

      {/* Professional Responsive Pagination Controls (20 Cards Per Page) */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalMatches}
        pageSize={PAGE_SIZE}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default MatchList;
