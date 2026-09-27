import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Trophy, Radio, Clock, ArrowRight, Flame, Layers, ArrowUpDown } from 'lucide-react';
import { useMatchData } from '../context/MatchDataContext.jsx';
import { useNormalizedLeagues } from '../hooks/useNormalizedLeagues.js';
import { useMatches } from '../hooks/useMatches.js';
import { QuickFilterBar } from '../components/layout/QuickFilterBar.jsx';
import { MatchList } from '../components/match/MatchList.jsx';
import { FILTER_PILLS, SORT_OPTIONS } from '../utils/constants.js';

export function HomePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { totalCount, liveCount, loading, error, openSearch } = useMatchData();
  const { topLeagues } = useNormalizedLeagues();

  // Read URL search parameters with defaults
  const activeTab = searchParams.get('tab') || 'all'; // 'live', 'today', 'all'
  const selectedLeague = searchParams.get('league') || 'all';
  const selectedStatus = searchParams.get('status') || FILTER_PILLS.ALL;
  const selectedSort = searchParams.get('sort') || SORT_OPTIONS.STATUS_LIVE_FIRST;

  // Sync state changes to URL parameters
  const updateUrlParams = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (
        val === null ||
        val === undefined ||
        val === 'all' ||
        val === 'ALL' ||
        val === SORT_OPTIONS.STATUS_LIVE_FIRST
      ) {
        updated.delete(key);
      } else {
        updated.set(key, val);
      }
    });
    setSearchParams(updated, { replace: true });
  };

  const setActiveTab = (tab) => updateUrlParams({ tab });
  const setSelectedLeague = (league) => updateUrlParams({ league });
  const setSelectedStatus = (status) => updateUrlParams({ status });
  const setSelectedSort = (sort) => updateUrlParams({ sort });

  const { groupedMatches, totalCount: filteredCount } = useMatches({
    tab: activeTab,
    leagueSlug: selectedLeague,
    status: selectedStatus,
    sortBy: selectedSort,
  });

  const handleResetFilters = () => {
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="space-y-10 pb-12">
      {/* 1. Hero Banner Section with Sporty Typography & Pulsing Live Ticker */}
      <section className="relative overflow-hidden rounded-3xl glass-card border border-pitch-border p-6 sm:p-10 md:p-12 shadow-2xl">
        {/* Pitch Green Background Glow Effect */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-accent-green/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-accent-cyan/10 blur-3xl pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-3xl space-y-6"
        >
          {/* Pulsing Live Ticker Pill */}
          <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-pitch-surface/90 border border-pitch-border shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-xs font-extrabold tracking-wide uppercase text-sport-text">
              {liveCount > 0 ? `${liveCount} Live Matches In Play` : 'Live Coverage Active'}
            </span>
            <span className="text-sport-subtle">•</span>
            <span className="text-xs text-accent-cyan font-semibold">{totalCount} Fixtures</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-sport-text leading-[1.1]">
            Live Football Scores, Fixtures & Match Analytics
          </h1>

          <p className="text-base sm:text-lg text-sport-muted max-w-2xl leading-relaxed">
            Real-time score updates, defensive data normalization, and canonical league coverage across over 40 worldwide competitions.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('live');
                setSelectedStatus(FILTER_PILLS.LIVE);
              }}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-accent-green text-slate-950 font-bold text-sm shadow-glow-green hover:bg-emerald-400 transition-all cursor-pointer"
            >
              <Radio className="w-4 h-4" />
              <span>Explore Live ({liveCount})</span>
            </button>

            <button
              type="button"
              onClick={openSearch}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-pitch-surface hover:bg-pitch-hover text-sport-text border border-pitch-border font-semibold text-sm transition-all cursor-pointer"
            >
              <span>Quick Search (⌘K)</span>
              <ArrowRight className="w-4 h-4 text-accent-cyan" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* 2. Top Leagues Grid: Cards featuring top 4 leagues with match count indicators */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-accent-amber" />
            <h2 className="text-xl font-bold text-sport-text">Top Canonical Leagues</h2>
          </div>
          <span className="text-xs text-sport-muted hidden sm:inline">
            Direct dynamic routes to /league/:slug
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topLeagues.map((league, index) => (
            <motion.div
              key={league.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate(`/league/${league.id}`)}
              className="glass-card p-5 rounded-2xl border border-pitch-border hover:border-accent-green/50 hover:shadow-glow-green transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm"
                    style={{ backgroundColor: league.badgeColor || '#10b981' }}
                  >
                    #{index + 1}
                  </div>
                  {league.liveCount > 0 && (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-extrabold text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                      <span>{league.liveCount} LIVE</span>
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-base text-sport-text group-hover:text-accent-green transition-colors truncate">
                  {league.name}
                </h3>
                <p className="text-xs text-sport-muted font-mono mt-0.5">/league/{league.id}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-pitch-border/50 flex items-center justify-between text-xs text-sport-muted">
                <span>{league.count} matches scheduled</span>
                <ArrowRight className="w-4 h-4 text-sport-subtle group-hover:text-accent-green group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. League Quick Filter Bar: Animated horizontal scroll chip bar */}
      <section className="space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-sport-muted uppercase tracking-wider">
          <Layers className="w-4 h-4 text-accent-green" />
          <span>Quick League Filter</span>
        </div>
        <QuickFilterBar
          selectedLeagueSlug={selectedLeague}
          onSelectLeague={(slug) => setSelectedLeague(slug)}
        />
      </section>

      {/* 4. Live / Today's Matches Section with Tabbed Filter and Controls */}
      <section className="space-y-5">
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-pitch-border flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Tab Filter: 'Live Now', 'Today', 'All Fixtures' (mandated by SRS 4.2) */}
          <div className="flex items-center space-x-2 p-1 bg-pitch-surface rounded-xl border border-pitch-border overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => {
                setActiveTab('all');
                setSelectedStatus(FILTER_PILLS.ALL);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-accent-green text-slate-950 shadow-glow-green'
                  : 'text-sport-muted hover:text-sport-text'
              }`}
            >
              All Fixtures ({totalCount})
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('live');
                setSelectedStatus(FILTER_PILLS.LIVE);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'live'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'text-sport-muted hover:text-red-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span>Live Now ({liveCount})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('today');
                setSelectedStatus(FILTER_PILLS.ALL);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'today'
                  ? 'bg-accent-cyan text-slate-950 shadow-glow-cyan'
                  : 'text-sport-muted hover:text-accent-cyan'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Today's Slate</span>
            </button>
          </div>

          {/* Sort Select Control Header */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="flex items-center space-x-2">
              <ArrowUpDown className="w-4 h-4 text-sport-muted" />
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="bg-pitch-surface border border-pitch-border text-sport-text text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-accent-green cursor-pointer"
                aria-label="Sort match fixtures"
              >
                <option value={SORT_OPTIONS.STATUS_LIVE_FIRST}>Status (LIVE first)</option>
                <option value={SORT_OPTIONS.TIME_ASC}>Kickoff Time (Ascending)</option>
                <option value={SORT_OPTIONS.TIME_DESC}>Kickoff Time (Descending)</option>
              </select>
            </div>

            {(selectedLeague !== 'all' || activeTab !== 'all' || selectedStatus !== FILTER_PILLS.ALL) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-accent-cyan hover:underline font-semibold cursor-pointer shrink-0"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Chronological Match List with Sticky Date Headers */}
        <MatchList
          groupedMatches={groupedMatches}
          loading={loading}
          error={error}
          onResetFilters={handleResetFilters}
          onLeagueClick={(slug) => navigate(`/league/${slug}`)}
        />
      </section>
    </div>
  );
}

export default HomePage;
