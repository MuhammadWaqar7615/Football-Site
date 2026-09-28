import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchMatches } from '../services/api.js';
import { DEFAULT_REFERENCE_TIMESTAMP } from '../utils/constants.js';

const MatchDataContext = createContext(null);

export function MatchDataProvider({ children }) {
  const [matches, setMatches] = useState([]);
  const [topLeagues, setTopLeagues] = useState([]);
  const [allLeagues, setAllLeagues] = useState([]);
  const [liveCount, setLiveCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [finishedCount, setFinishedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Controllable simulation clock anchor (defaults to 1766244600)
  const [referenceTime, setReferenceTime] = useState(DEFAULT_REFERENCE_TIMESTAMP);

  // Global search modal and query state
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const loadData = useCallback(async (options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMatches({
        referenceTime: options.referenceTime || referenceTime,
        simulateDelay: options.simulateDelay ?? true,
        forceRefresh: options.forceRefresh ?? false,
      });

      setMatches(data.matches);
      setTopLeagues(data.topLeagues);
      setAllLeagues(data.allLeagues);
      setLiveCount(data.liveCount);
      setUpcomingCount(data.upcomingCount);
      setFinishedCount(data.finishedCount);
      setTotalCount(data.totalCount);
    } catch (err) {
      console.error('Failed to load match data:', err);
      setError(err.message || 'Failed to load football match data.');
    } finally {
      setLoading(false);
    }
  }, [referenceTime]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Update data when referenceTime changes
  const updateReferenceTime = useCallback((newTime) => {
    setReferenceTime(newTime);
    loadData({ referenceTime: newTime, forceRefresh: true });
  }, [loadData]);

  const getMatchById = useCallback((id) => {
    return matches.find((m) => m.id === id) || null;
  }, [matches]);

  const getMatchesByLeague = useCallback((leagueSlug) => {
    if (!leagueSlug) return [];
    return matches.filter((m) => m.league?.id === leagueSlug);
  }, [matches]);

  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  const value = {
    matches,
    topLeagues,
    allLeagues,
    liveCount,
    upcomingCount,
    finishedCount,
    totalCount,
    loading,
    error,
    referenceTime,
    updateReferenceTime,
    refetchMatches: (opts) => loadData({ forceRefresh: true, ...opts }),
    globalSearchQuery,
    setGlobalSearchQuery,
    isSearchOpen,
    setIsSearchOpen,
    openSearch,
    closeSearch,
    getMatchById,
    getMatchesByLeague,
  };

  return <MatchDataContext.Provider value={value}>{children}</MatchDataContext.Provider>;
}

export function useMatchData() {
  const context = useContext(MatchDataContext);
  if (!context) {
    throw new Error('useMatchData must be used within a MatchDataProvider');
  }
  return context;
}

export default MatchDataContext;
