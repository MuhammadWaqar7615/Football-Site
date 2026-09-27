import { useMemo } from 'react';
import { useMatchData } from '../context/MatchDataContext.jsx';
import { SORT_OPTIONS, FILTER_PILLS, MATCH_STATUS } from '../utils/constants.js';
import { getDateGroupKey, getDateHeaderLabel } from '../utils/dateUtils.js';
import { cleanText } from '../utils/textUtils.js';

/**
 * Custom hook to filter, sort, search, and date-group football matches.
 *
 * @param {Object} options
 * @param {string} [options.leagueSlug] - Filter matches by specific canonical league slug
 * @param {string} [options.status='ALL'] - Status filter ('ALL', 'LIVE', 'UPCOMING', 'FINISHED')
 * @param {string} [options.sortBy='time_asc'] - Sorting criteria ('time_asc', 'time_desc', 'status_live')
 * @param {string} [options.searchQuery=''] - Search term filtering home/away/league names
 * @param {string} [options.tab='all'] - Quick tab filter ('live', 'today', 'all')
 * @returns {Object} Filtered and grouped matches, counts, loading, and error states
 */
export function useMatches({
  leagueSlug = null,
  status = FILTER_PILLS.ALL,
  sortBy = SORT_OPTIONS.TIME_ASC,
  searchQuery = '',
  tab = 'all',
} = {}) {
  const { matches, loading, error, referenceTime } = useMatchData();

  const filteredMatches = useMemo(() => {
    if (!matches || matches.length === 0) return [];

    let result = matches;

    // 1. Filter by League Slug
    if (leagueSlug && leagueSlug !== 'all') {
      result = result.filter((m) => m.league?.id === leagueSlug);
    }

    // 2. Filter by Tab (Homepage tabs: 'live', 'today', 'all')
    if (tab === 'live') {
      result = result.filter((m) => m.status === MATCH_STATUS.LIVE);
    } else if (tab === 'today') {
      // Filter matches on the same anchor date as referenceTime
      const refDateKey = getDateGroupKey(referenceTime);
      result = result.filter((m) => m.timestamp && getDateGroupKey(m.timestamp) === refDateKey);
    }

    // 3. Filter by Status Pill
    if (status && status !== FILTER_PILLS.ALL) {
      result = result.filter((m) => m.status === status);
    }

    // 4. Filter by Search Query
    const cleanQuery = cleanText(searchQuery).toLowerCase();
    if (cleanQuery) {
      result = result.filter((m) => {
        const home = (m.homeTeam || '').toLowerCase();
        const away = (m.awayTeam || '').toLowerCase();
        const league = (m.league?.name || '').toLowerCase();
        return home.includes(cleanQuery) || away.includes(cleanQuery) || league.includes(cleanQuery);
      });
    }

    // 5. Sorting
    const sorted = [...result];
    sorted.sort((a, b) => {
      // Missing timestamp fallback handling: always sort to the bottom
      if (!a.timestamp && !b.timestamp) return 0;
      if (!a.timestamp) return 1;
      if (!b.timestamp) return -1;

      if (sortBy === SORT_OPTIONS.STATUS_LIVE_FIRST) {
        // LIVE matches first, then chronological
        const aIsLive = a.status === MATCH_STATUS.LIVE ? 1 : 0;
        const bIsLive = b.status === MATCH_STATUS.LIVE ? 1 : 0;
        if (aIsLive !== bIsLive) return bIsLive - aIsLive;
        return a.timestamp - b.timestamp;
      }

      if (sortBy === SORT_OPTIONS.TIME_DESC) {
        return b.timestamp - a.timestamp;
      }

      // Default: TIME_ASC
      return a.timestamp - b.timestamp;
    });

    return sorted;
  }, [matches, leagueSlug, status, sortBy, searchQuery, tab, referenceTime]);

  // Group matches chronologically by date with sticky headers
  const groupedMatches = useMemo(() => {
    const groups = new Map();

    for (const match of filteredMatches) {
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
  }, [filteredMatches]);

  const liveMatchesCount = useMemo(() => {
    return filteredMatches.filter((m) => m.status === MATCH_STATUS.LIVE).length;
  }, [filteredMatches]);

  return {
    matches: filteredMatches,
    groupedMatches,
    totalCount: filteredMatches.length,
    liveCount: liveMatchesCount,
    loading,
    error,
  };
}

export default useMatches;
