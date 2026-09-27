import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, X, ArrowLeft, Trophy, Radio, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useMatches } from '../hooks/useMatches.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { HighlightText } from '../components/search/HighlightText.jsx';
import { MatchCard } from '../components/match/MatchCard.jsx';
import { Button } from '../components/ui/Button.jsx';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';

  const [inputVal, setInputVal] = useState(initialQuery);
  const debouncedQuery = useDebounce(inputVal, 300);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);

  // Sync debounced search to URL search param ?q=
  useEffect(() => {
    const updated = new URLSearchParams(searchParams);
    if (debouncedQuery.trim()) {
      updated.set('q', debouncedQuery.trim());
    } else {
      updated.delete('q');
    }
    setSearchParams(updated, { replace: true });
  }, [debouncedQuery, setSearchParams]);

  const { matches: searchResults, loading } = useMatches({
    searchQuery: debouncedQuery,
  });

  // Reset selected index on query change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [debouncedQuery]);

  // Full keyboard accessibility: ArrowUp, ArrowDown, Escape, Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setInputVal('');
        inputRef.current?.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && searchResults[selectedIndex]) {
          e.preventDefault();
          const match = searchResults[selectedIndex];
          if (match.league?.id) {
            navigate(`/league/${match.league.id}`);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchResults, selectedIndex, navigate]);

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header and Search Input */}
      <div className="space-y-4">
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-sport-muted hover:text-accent-cyan transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-sport-text tracking-tight">
            Match Search & Finder
          </h1>
          <p className="text-sm text-sport-muted">
            Instant search across team names, leagues, and fixtures with real-time match highlighting.
          </p>
        </div>

        {/* 300ms Debounced Input with Clear Button */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-accent-green">
            <Search className="w-5 h-5" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Search teams (e.g. Arsenal, Chelsea, Barcelona) or leagues..."
            autoFocus
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-pitch-card border border-pitch-border text-sport-text text-base placeholder:text-sport-muted focus:outline-none focus:border-accent-green focus:ring-1 focus:ring-accent-green shadow-xl transition-all"
            aria-label="Search football matches"
            aria-autocomplete="list"
          />
          {inputVal && (
            <button
              type="button"
              onClick={() => {
                setInputVal('');
                inputRef.current?.focus();
              }}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-sport-muted hover:text-sport-text cursor-pointer"
              aria-label="Clear search input"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* ARIA Live Region for Screen Readers */}
      <div className="sr-only" aria-live="polite">
        {debouncedQuery
          ? `${searchResults.length} matches found for query ${debouncedQuery}`
          : 'Ready for search'}
      </div>

      {/* Results Header Info */}
      {debouncedQuery && (
        <div className="flex items-center justify-between text-xs text-sport-muted px-1">
          <span>
            Found <strong>{searchResults.length}</strong> matching fixtures for "
            <strong className="text-sport-text">{debouncedQuery}</strong>"
          </span>
          <span className="hidden sm:inline">Use ↑ ↓ arrows to navigate results</span>
        </div>
      )}

      {/* Search Results Grid */}
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((match, index) => {
            const isSelected = selectedIndex === index;
            return (
              <div
                key={match.id}
                className={isSelected ? 'ring-2 ring-accent-green rounded-2xl' : ''}
              >
                <MatchCard
                  match={match}
                  searchQuery={debouncedQuery}
                  onLeagueClick={(slug) => navigate(`/league/${slug}`)}
                />
              </div>
            );
          })}
        </div>
      ) : debouncedQuery ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-pitch-border space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-pitch-surface border border-pitch-border flex items-center justify-center text-sport-muted mx-auto">
            <Trophy className="w-8 h-8 opacity-40" />
          </div>
          <h3 className="text-lg font-bold text-sport-text">No Matches Found</h3>
          <p className="text-xs text-sport-muted">
            We couldn't find any fixtures matching "<strong>{debouncedQuery}</strong>". Try checking for spelling or searching for another club.
          </p>
          <Button variant="secondary" onClick={() => setInputVal('')}>
            Clear Search
          </Button>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-10 text-center border border-pitch-border space-y-3">
          <p className="text-sm text-sport-muted">
            Type team or league names to start live search with instant character matching.
          </p>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
