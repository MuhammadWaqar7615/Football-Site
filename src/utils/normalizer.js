import { cleanText, slugify } from './textUtils.js';
import { normalizeTimestamp, formatMatchDate, formatMatchTime } from './dateUtils.js';
import {
  MATCH_STATUS,
  LIVE_DURATION_SECONDS,
  DEFAULT_REFERENCE_TIMESTAMP,
  KNOWN_LEAGUES,
} from './constants.js';

/**
 * Deterministically generates a unique ID from home, away, and timestamp.
 */
export function generateMatchId(home, away, ts) {
  const homeSlug = slugify(home || 'home');
  const awaySlug = slugify(away || 'away');
  const timeKey = ts ? String(ts) : 'notime';
  return `match_${homeSlug}_vs_${awaySlug}_${timeKey}`;
}

/**
 * Normalizes raw league free-text to canonical ID, display name, and badge metadata.
 */
export function normalizeLeague(rawLeague) {
  const cleaned = cleanText(rawLeague);

  if (!cleaned) {
    return {
      id: 'uncategorized',
      name: 'Uncategorized League',
      raw: '',
      badgeColor: '#4b5563',
    };
  }

  const lookupKey = cleaned.toLowerCase();
  if (KNOWN_LEAGUES[lookupKey]) {
    const known = KNOWN_LEAGUES[lookupKey];
    return {
      id: known.id,
      name: known.name,
      raw: cleaned,
      badgeColor: known.badgeColor || '#2563eb',
    };
  }

  // Fallback for custom or international leagues: slugify and clean title
  const generatedSlug = slugify(cleaned);
  return {
    id: generatedSlug,
    name: cleaned,
    raw: cleaned,
    badgeColor: '#1e293b',
  };
}

/**
 * Infers match status based on timestamp and reference anchor time.
 */
export function inferMatchStatus(rawStatus, timestamp, referenceTime = DEFAULT_REFERENCE_TIMESTAMP) {
  // If explicit valid status provided in raw payload, respect it
  if (rawStatus && typeof rawStatus === 'string') {
    const upper = rawStatus.trim().toUpperCase();
    if (upper === MATCH_STATUS.LIVE || upper === MATCH_STATUS.FINISHED || upper === MATCH_STATUS.UPCOMING) {
      return upper;
    }
  }

  // Without timestamp, default to UPCOMING
  if (!timestamp) {
    return MATCH_STATUS.UPCOMING;
  }

  const now = referenceTime || Math.floor(Date.now() / 1000);

  // Match started in the last 2 hours (7200s) -> LIVE
  if (timestamp <= now && timestamp >= now - LIVE_DURATION_SECONDS) {
    return MATCH_STATUS.LIVE;
  }

  // Match started more than 2 hours ago -> FINISHED
  if (timestamp < now - LIVE_DURATION_SECONDS) {
    return MATCH_STATUS.FINISHED;
  }

  // Future match -> UPCOMING
  return MATCH_STATUS.UPCOMING;
}

/**
 * Calculates current match minute for LIVE matches.
 */
export function calculateLiveMinute(timestamp, referenceTime = DEFAULT_REFERENCE_TIMESTAMP) {
  if (!timestamp) return 45;
  const now = referenceTime || Math.floor(Date.now() / 1000);
  const elapsedMinutes = Math.floor((now - timestamp) / 60);

  if (elapsedMinutes < 0) return 1;
  if (elapsedMinutes > 90) return "90+";
  return Math.max(1, elapsedMinutes);
}

/**
 * Produces deterministic mock score for live or finished matches.
 */
function getDeterministicScore(id, status) {
  if (status === MATCH_STATUS.UPCOMING) return null;
  // Generate deterministic score from string char codes
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const homeScore = Math.abs(hash) % 4;
  const awayScore = Math.abs(hash >> 3) % 4;
  return { home: homeScore, away: awayScore };
}

/**
 * Full defensive sanitizer for a single match fixture record.
 */
export function sanitizeMatch(rawMatch, referenceTime = DEFAULT_REFERENCE_TIMESTAMP) {
  if (!rawMatch || typeof rawMatch !== 'object') {
    return null;
  }

  const home = cleanText(rawMatch.home || rawMatch.home_team) || 'Unknown Team';
  const away = cleanText(rawMatch.away || rawMatch.away_team) || 'Unknown Team';
  const timestamp = normalizeTimestamp(rawMatch.ts || rawMatch.timestamp, rawMatch.date || rawMatch.date_str);

  // ID generation (reuse raw id if clean and non-empty, else generate deterministic hash)
  const id = rawMatch.id && typeof rawMatch.id === 'string' && rawMatch.id.trim().length > 0
    ? rawMatch.id.trim()
    : generateMatchId(home, away, timestamp);

  const league = normalizeLeague(rawMatch.league);
  const status = inferMatchStatus(rawMatch.status, timestamp, referenceTime);
  const liveMinute = status === MATCH_STATUS.LIVE ? calculateLiveMinute(timestamp, referenceTime) : null;
  const score = getDeterministicScore(id, status);

  return {
    id,
    homeTeam: home,
    awayTeam: away,
    league,
    timestamp,
    dateStr: formatMatchDate(timestamp),
    timeStr: formatMatchTime(timestamp),
    timeDisplay: rawMatch.time_display || formatMatchTime(timestamp),
    status,
    liveMinute,
    score,
    raw: rawMatch,
  };
}

/**
 * Aggregates matches and extracts the Top N leagues with highest valid match counts.
 */
export function extractTopLeagues(matches, limit = 4) {
  const counts = new Map();

  for (const m of matches) {
    if (!m || !m.league || m.league.id === 'uncategorized') continue;
    const current = counts.get(m.league.id) || {
      id: m.league.id,
      name: m.league.name,
      badgeColor: m.league.badgeColor,
      count: 0,
      liveCount: 0,
    };
    current.count += 1;
    if (m.status === MATCH_STATUS.LIVE) {
      current.liveCount += 1;
    }
    counts.set(m.league.id, current);
  }

  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
