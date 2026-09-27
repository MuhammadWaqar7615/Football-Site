/**
 * Match listing constants, status definitions, and canonical league dictionary.
 */

export const MATCH_STATUS = {
  LIVE: 'LIVE',
  UPCOMING: 'UPCOMING',
  FINISHED: 'FINISHED',
};

// Standard live match duration window in seconds (2 hours / 120 minutes with extra time)
export const LIVE_DURATION_SECONDS = 7200;

// Reference simulation timestamp anchored around the dataset's live window (2025-12-20T23:30:00+08:00)
// This enables deterministic demonstration of LIVE, UPCOMING, and FINISHED match states
export const DEFAULT_REFERENCE_TIMESTAMP = 1766244600;

export const SORT_OPTIONS = {
  TIME_ASC: 'time_asc',
  TIME_DESC: 'time_desc',
  STATUS_LIVE_FIRST: 'status_live',
};

export const FILTER_PILLS = {
  ALL: 'ALL',
  UPCOMING: 'UPCOMING',
  FINISHED: 'FINISHED',
  LIVE: 'LIVE',
};

/**
 * Canonical dictionary for normalizing raw free-text league strings
 */
export const KNOWN_LEAGUES = {
  'english premier league': { id: 'premier-league', name: 'Premier League', country: 'England', badgeColor: '#3d195b' },
  'premier league': { id: 'premier-league', name: 'Premier League', country: 'England', badgeColor: '#3d195b' },
  'spanish la liga': { id: 'la-liga', name: 'La Liga', country: 'Spain', badgeColor: '#ee2524' },
  'la liga': { id: 'la-liga', name: 'La Liga', country: 'Spain', badgeColor: '#ee2524' },
  'italian serie a': { id: 'serie-a', name: 'Serie A', country: 'Italy', badgeColor: '#008fd7' },
  'serie a': { id: 'serie-a', name: 'Serie A', country: 'Italy', badgeColor: '#008fd7' },
  'german bundesliga': { id: 'bundesliga', name: 'Bundesliga', country: 'Germany', badgeColor: '#d20515' },
  'bundesliga': { id: 'bundesliga', name: 'Bundesliga', country: 'Germany', badgeColor: '#d20515' },
  'coupe de france': { id: 'coupe-de-france', name: 'Coupe de France', country: 'France', badgeColor: '#0f2042' },
  'belgian pro league': { id: 'belgian-pro-league', name: 'Belgian Pro League', country: 'Belgium', badgeColor: '#000000' },
  'scottish premiership': { id: 'scottish-premiership', name: 'Scottish Premiership', country: 'Scotland', badgeColor: '#002f6c' },
  'netherlands eredivisie': { id: 'eredivisie', name: 'Eredivisie', country: 'Netherlands', badgeColor: '#174092' },
  'portuguese primera liga': { id: 'portuguese-primera-liga', name: 'Primeira Liga', country: 'Portugal', badgeColor: '#006633' },
  'turkish super league': { id: 'turkish-super-league', name: 'Süper Lig', country: 'Turkey', badgeColor: '#c8102e' },
  'turkish süper lig': { id: 'turkish-super-league', name: 'Süper Lig', country: 'Turkey', badgeColor: '#c8102e' },
  'greek super league': { id: 'greek-super-league', name: 'Super League Greece', country: 'Greece', badgeColor: '#0d5eaf' },
  'spanish segunda division': { id: 'spanish-segunda-division', name: 'LaLiga 2', country: 'Spain', badgeColor: '#1e3a8a' },
  'english football league championship': { id: 'efl-championship', name: 'Championship', country: 'England', badgeColor: '#1a365d' },
};
