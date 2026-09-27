import { sanitizeMatch, extractTopLeagues } from '../utils/normalizer.js';
import { DEFAULT_REFERENCE_TIMESTAMP, MATCH_STATUS } from '../utils/constants.js';

let inMemoryCache = null;

/**
 * Fetches, defensively parses, and normalizes matches from cached mock dataset.
 *
 * @param {Object} options
 * @param {boolean} [options.simulateDelay=false] - Whether to simulate artificial network latency for skeleton testing
 * @param {number} [options.referenceTime=DEFAULT_REFERENCE_TIMESTAMP] - Timestamp anchor for live/finished calculations
 * @param {boolean} [options.forceRefresh=false] - Ignore in-memory cache
 * @returns {Promise<Object>} Sanitized matches dataset & aggregated stats
 */
export async function fetchMatches({
  simulateDelay = false,
  referenceTime = DEFAULT_REFERENCE_TIMESTAMP,
  forceRefresh = false,
} = {}) {
  if (inMemoryCache && !forceRefresh && inMemoryCache.referenceTime === referenceTime) {
    return inMemoryCache.data;
  }

  if (simulateDelay) {
    await new Promise((resolve) => setTimeout(resolve, 600));
  }

  try {
    const response = await fetch('/mock/matches.json');
    if (!response.ok) {
      throw new Error(`Failed to load matches: HTTP ${response.status}`);
    }

    const payload = await response.json();
    const rawMatches = Array.isArray(payload.matches) ? payload.matches : [];

    // Defensive parsing pipeline for all matches
    const sanitizedMatches = rawMatches
      .map((item) => sanitizeMatch(item, referenceTime))
      .filter(Boolean);

    // Sort chronologically: valid timestamps ascending first, TBD/null timestamps at the very bottom
    sanitizedMatches.sort((a, b) => {
      if (!a.timestamp && !b.timestamp) return 0;
      if (!a.timestamp) return 1; // a goes to bottom
      if (!b.timestamp) return -1; // b goes to bottom
      return a.timestamp - b.timestamp;
    });

    // Compute aggregated metrics
    let liveCount = 0;
    let upcomingCount = 0;
    let finishedCount = 0;
    const leagueMap = new Map();

    for (const match of sanitizedMatches) {
      if (match.status === MATCH_STATUS.LIVE) liveCount += 1;
      else if (match.status === MATCH_STATUS.FINISHED) finishedCount += 1;
      else upcomingCount += 1;

      if (match.league && match.league.id !== 'uncategorized') {
        const existing = leagueMap.get(match.league.id) || {
          id: match.league.id,
          name: match.league.name,
          badgeColor: match.league.badgeColor,
          count: 0,
        };
        existing.count += 1;
        leagueMap.set(match.league.id, existing);
      }
    }

    const topLeagues = extractTopLeagues(sanitizedMatches, 4);
    const allLeagues = Array.from(leagueMap.values()).sort((a, b) => b.count - a.count);

    const result = {
      generatedAt: payload.generated_at || referenceTime,
      totalCount: sanitizedMatches.length,
      liveCount,
      upcomingCount,
      finishedCount,
      matches: sanitizedMatches,
      topLeagues,
      allLeagues,
      referenceTime,
    };

    inMemoryCache = {
      referenceTime,
      data: result,
    };

    return result;
  } catch (error) {
    console.error('Error in fetchMatches service:', error);
    throw error;
  }
}
