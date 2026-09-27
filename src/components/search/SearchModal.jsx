import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, CornerDownLeft, Radio, Clock, CheckCircle2 } from 'lucide-react';
import { useMatchData } from '../../context/MatchDataContext.jsx';
import { useMatches } from '../../hooks/useMatches.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { HighlightText } from './HighlightText.jsx';

export function SearchModal({ isOpen, onClose, onSelectMatch, onSelectLeague, onSelectSearchPage }) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const { matches: searchResults } = useMatches({
    searchQuery: debouncedSearch,
  });

  // Limit modal display to top 8 items for fast clean rendering
  const displayedResults = searchResults.slice(0, 8);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [debouncedSearch]);

  // Full keyboard navigation (ArrowUp, ArrowDown, Enter, Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < displayedResults.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : displayedResults.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (displayedResults[selectedIndex]) {
          const selected = displayedResults[selectedIndex];
          if (onSelectMatch) onSelectMatch(selected);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, displayedResults, selectedIndex, onClose, onSelectMatch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl glass-card rounded-2xl border border-pitch-border shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-pitch-border flex items-center space-x-3 bg-pitch-surface/60">
          <Search className="w-5 h-5 text-accent-green shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search teams (e.g. Chelsea, Real Madrid) or leagues..."
            className="w-full bg-transparent text-sm sm:text-base text-sport-text placeholder:text-sport-muted focus:outline-none"
            aria-autocomplete="list"
            aria-controls="search-results-list"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 rounded text-sport-muted hover:text-sport-text cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded bg-pitch-card border border-pitch-border text-sport-muted font-mono">
            ESC
          </kbd>
        </div>

        {/* Screen Reader ARIA Live Region */}
        <div className="sr-only" aria-live="polite">
          {debouncedSearch
            ? `${displayedResults.length} matches found for ${debouncedSearch}`
            : 'Type to search matches'}
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          id="search-results-list"
          role="listbox"
          className="overflow-y-auto p-2 space-y-1 divide-y divide-pitch-border/30"
        >
          {debouncedSearch && displayedResults.length === 0 ? (
            <div className="p-8 text-center text-sm text-sport-muted">
              No matching football fixtures found for <strong className="text-sport-text">"{debouncedSearch}"</strong>
            </div>
          ) : (
            displayedResults.map((match, index) => {
              const isSelected = selectedIndex === index;
              const isLive = match.status === 'LIVE';

              return (
                <div
                  key={match.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    if (onSelectMatch) onSelectMatch(match);
                    onClose();
                  }}
                  className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-accent-green/15 border border-accent-green/40'
                      : 'hover:bg-pitch-surface/60 border border-transparent'
                  }`}
                >
                  <div className="space-y-1 pr-3 flex-1 min-w-0">
                    <div className="flex items-center space-x-2 text-xs text-sport-muted">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: match.league?.badgeColor || '#38bdf8' }}
                      />
                      <span className="truncate">
                        <HighlightText text={match.league?.name} query={debouncedSearch} />
                      </span>
                    </div>

                    <div className="font-bold text-sm sm:text-base text-sport-text truncate">
                      <HighlightText text={match.homeTeam} query={debouncedSearch} />
                      <span className="text-sport-muted font-normal mx-2">vs</span>
                      <HighlightText text={match.awayTeam} query={debouncedSearch} />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0 text-right">
                    {isLive ? (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-extrabold text-[10px] inline-flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                        <span>{match.liveMinute || 'LIVE'}</span>
                      </span>
                    ) : match.status === 'FINISHED' ? (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-sport-muted font-bold text-[10px]">
                        FT {match.score ? `${match.score.home}-${match.score.away}` : ''}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-pitch-surface text-accent-cyan font-semibold text-[10px]">
                        {match.timeStr}
                      </span>
                    )}

                    {isSelected && (
                      <CornerDownLeft className="w-4 h-4 text-accent-green hidden sm:inline" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer Keybinds Helper & Full Search Link */}
        <div className="p-3 bg-pitch-surface/80 border-t border-pitch-border flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-sport-muted">
          <div className="flex items-center space-x-3">
            <span>
              <kbd className="px-1 py-0.5 rounded bg-pitch-card border border-pitch-border">↑</kbd>{' '}
              <kbd className="px-1 py-0.5 rounded bg-pitch-card border border-pitch-border">↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-pitch-card border border-pitch-border">Enter</kbd> Select
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-pitch-card border border-pitch-border">Esc</kbd> Close
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sport-subtle">
              {displayedResults.length} of {searchResults.length} matches
            </span>
            {debouncedSearch && (
              <button
                type="button"
                onClick={() => {
                  if (onSelectSearchPage) {
                    onSelectSearchPage(debouncedSearch);
                  }
                  onClose();
                }}
                className="text-accent-green hover:underline font-bold flex items-center space-x-1 cursor-pointer"
              >
                <span>Full Search Page</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default SearchModal;
