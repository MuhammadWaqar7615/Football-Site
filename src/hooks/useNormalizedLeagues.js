import { useMemo } from 'react';
import { useMatchData } from '../context/MatchDataContext.jsx';

/**
 * Hook to access canonical normalized leagues, top 4 rankings, and league validation helpers.
 *
 * @param {string} [currentSlug] - Optional league slug to resolve active league metadata
 * @returns {Object} League metadata, topLeagues, allLeagues, and validation functions
 */
export function useNormalizedLeagues(currentSlug = null) {
  const { topLeagues, allLeagues, matches } = useMatchData();

  const activeLeague = useMemo(() => {
    if (!currentSlug) return null;
    return allLeagues.find((l) => l.id === currentSlug) || null;
  }, [allLeagues, currentSlug]);

  const isLeagueValid = useMemo(() => {
    return (slug) => allLeagues.some((l) => l.id === slug);
  }, [allLeagues]);

  const leagueStats = useMemo(() => {
    if (!currentSlug) return null;
    const leagueMatches = matches.filter((m) => m.league?.id === currentSlug);
    const liveMatches = leagueMatches.filter((m) => m.status === 'LIVE');
    const upcomingMatches = leagueMatches.filter((m) => m.status === 'UPCOMING');
    const finishedMatches = leagueMatches.filter((m) => m.status === 'FINISHED');

    return {
      total: leagueMatches.length,
      live: liveMatches.length,
      upcoming: upcomingMatches.length,
      finished: finishedMatches.length,
    };
  }, [matches, currentSlug]);

  return {
    topLeagues,
    allLeagues,
    activeLeague,
    isLeagueValid,
    leagueStats,
  };
}

export default useNormalizedLeagues;
