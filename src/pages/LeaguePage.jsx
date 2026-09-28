import React, { useMemo } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Radio, Clock, CheckCircle2, ArrowUpDown, RefreshCw, AlertTriangle } from 'lucide-react';
import { useMatchData } from '../context/MatchDataContext.jsx';
import { useNormalizedLeagues } from '../hooks/useNormalizedLeagues.js';
import { useMatches } from '../hooks/useMatches.js';
import { MatchList } from '../components/match/MatchList.jsx';
import { Button } from '../components/ui/Button.jsx';
import { FILTER_PILLS, SORT_OPTIONS } from '../utils/constants.js';

export function LeaguePage() {
  const { leagueSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { loading, error } = useMatchData();
  const { isLeagueValid, activeLeague, leagueStats } = useNormalizedLeagues(leagueSlug);

  // Read URL search parameters with fallbacks
  const statusParam = searchParams.get('status') || FILTER_PILLS.ALL;
  const sortParam = searchParams.get('sort') || SORT_OPTIONS.TIME_ASC;
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  // Sync state to URL parameters
  const updateUrlParams = (newParams, resetPage = true) => {
    const updated = new URLSearchParams(searchParams);
    if (resetPage && !('page' in newParams)) {
      updated.delete('page');
    }
    Object.entries(newParams).forEach(([key, val]) => {
      if (
        val === null ||
        val === undefined ||
        val === 'ALL' ||
        val === SORT_OPTIONS.TIME_ASC ||
        (key === 'page' && val === 1)
      ) {
        updated.delete(key);
      } else {
        updated.set(key, String(val));
      }
    });
    setSearchParams(updated, { replace: true });
  };

  const setStatus = (newStatus) => updateUrlParams({ status: newStatus });
  const setSort = (newSort) => updateUrlParams({ sort: newSort });
  const handlePageChange = (page) => updateUrlParams({ page }, false);

  const { groupedMatches, totalCount } = useMatches({
    leagueSlug,
    status: statusParam,
    sortBy: sortParam,
  });

  // Check if league exists in canonical registry
  const leagueExists = isLeagueValid(leagueSlug);

  // Render 404 Empty State if league does not exist
  if (!loading && !leagueExists) {
    return (
      <div className="py-16 text-center space-y-6 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-sport-text">League Not Found</h1>
          <p className="text-sm text-sport-muted">
            The league route <code className="text-accent-cyan font-mono text-xs">/league/{leagueSlug}</code> does not exist in the active fixture database.
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/')} icon={ArrowLeft}>
          Back to Homepage
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Back Button & League Header */}
      <div className="space-y-4">
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-sport-muted hover:text-accent-cyan transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Leagues</span>
        </Link>

        {/* League Hero Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-pitch-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center space-x-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shrink-0"
              style={{ backgroundColor: activeLeague?.badgeColor || '#10b981' }}
            >
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-sport-text tracking-tight">
                {activeLeague?.name || leagueSlug}
              </h1>
              <div className="flex items-center space-x-3 text-xs text-sport-muted font-mono mt-1">
                <span>/league/{leagueSlug}</span>
                {leagueStats && (
                  <>
                    <span>•</span>
                    <span>{leagueStats.total} Total Fixtures</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* League Real-time Counters */}
          {leagueStats && (
            <div className="flex items-center space-x-3 shrink-0">
              {leagueStats.live > 0 && (
                <div className="px-3.5 py-1.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-extrabold flex items-center space-x-1.5">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>{leagueStats.live} LIVE</span>
                </div>
              )}
              <div className="px-3.5 py-1.5 rounded-xl bg-pitch-surface border border-pitch-border text-sport-muted text-xs font-semibold">
                <span>{leagueStats.upcoming} Upcoming</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-pitch-surface border border-pitch-border text-sport-muted text-xs font-semibold">
                <span>{leagueStats.finished} Finished</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sorting & Filtering Control Header (mandated by SRS 4.3) */}
      <div className="glass-card rounded-2xl p-4 border border-pitch-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Filter Pills: All Matches, Upcoming, Finished */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => setStatus(FILTER_PILLS.ALL)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              statusParam === FILTER_PILLS.ALL
                ? 'bg-accent-green text-slate-950 font-bold shadow-glow-green'
                : 'bg-pitch-surface text-sport-muted hover:text-sport-text border border-pitch-border'
            }`}
          >
            All Matches ({leagueStats?.total || totalCount})
          </button>

          <button
            type="button"
            onClick={() => setStatus(FILTER_PILLS.LIVE)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              statusParam === FILTER_PILLS.LIVE
                ? 'bg-red-500 text-white font-bold'
                : 'bg-pitch-surface text-sport-muted hover:text-red-400 border border-pitch-border'
            }`}
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Live ({leagueStats?.live || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatus(FILTER_PILLS.UPCOMING)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              statusParam === FILTER_PILLS.UPCOMING
                ? 'bg-accent-cyan text-slate-950 font-bold shadow-glow-cyan'
                : 'bg-pitch-surface text-sport-muted hover:text-accent-cyan border border-pitch-border'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Upcoming ({leagueStats?.upcoming || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatus(FILTER_PILLS.FINISHED)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              statusParam === FILTER_PILLS.FINISHED
                ? 'bg-slate-700 text-white font-bold'
                : 'bg-pitch-surface text-sport-muted hover:text-sport-text border border-pitch-border'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Finished ({leagueStats?.finished || 0})</span>
          </button>
        </div>

        {/* Sort Select Options (Kickoff Time Asc, Kickoff Time Desc, Status LIVE first) */}
        <div className="flex items-center space-x-2 shrink-0">
          <ArrowUpDown className="w-4 h-4 text-sport-muted" />
          <select
            value={sortParam}
            onChange={(e) => setSort(e.target.value)}
            className="bg-pitch-surface border border-pitch-border text-sport-text text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-accent-green cursor-pointer"
          >
            <option value={SORT_OPTIONS.TIME_ASC}>Kickoff Time (Ascending)</option>
            <option value={SORT_OPTIONS.TIME_DESC}>Kickoff Time (Descending)</option>
            <option value={SORT_OPTIONS.STATUS_LIVE_FIRST}>Status (LIVE first)</option>
          </select>
        </div>
      </div>

      {/* Match List in chronological sequence with sticky date headers */}
      <MatchList
        groupedMatches={groupedMatches}
        loading={loading}
        error={error}
        onResetFilters={() => updateUrlParams({ status: 'ALL', sort: SORT_OPTIONS.TIME_ASC })}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default LeaguePage;
