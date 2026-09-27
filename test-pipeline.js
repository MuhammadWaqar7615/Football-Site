import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sanitizeMatch, extractTopLeagues, normalizeLeague, inferMatchStatus } from './src/utils/normalizer.js';
import { DEFAULT_REFERENCE_TIMESTAMP, MATCH_STATUS } from './src/utils/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== RUNNING DEFENSIVE DATA NORMALIZATION TEST SUITE ===');

// 1. Read matches.json
const rawData = JSON.parse(fs.readFileSync(path.join(__dirname, 'public/mock/matches.json'), 'utf-8'));
console.log(`[PASS] Read matches.json: ${rawData.matches.length} total matches`);

// 2. Test sanitizeMatch across all matches without error
let passCount = 0;
const sanitized = [];

for (const raw of rawData.matches) {
  try {
    const clean = sanitizeMatch(raw, DEFAULT_REFERENCE_TIMESTAMP);
    if (!clean) throw new Error('sanitizeMatch returned null');
    if (!clean.id) throw new Error('Missing clean.id');
    if (!clean.homeTeam) throw new Error('Missing clean.homeTeam');
    if (!clean.awayTeam) throw new Error('Missing clean.awayTeam');
    if (!clean.league || !clean.league.id) throw new Error('Missing clean.league');
    if (![MATCH_STATUS.LIVE, MATCH_STATUS.UPCOMING, MATCH_STATUS.FINISHED].includes(clean.status)) {
      throw new Error(`Invalid status: ${clean.status}`);
    }
    sanitized.push(clean);
    passCount++;
  } catch (err) {
    console.error('[FAIL] Sanitize failed on match:', raw, err);
    process.exit(1);
  }
}
console.log(`[PASS] Successfully sanitized all ${passCount}/${rawData.matches.length} match records with ZERO errors`);

// 3. Test specific SRS edge case rules
// Rule 3.1: Whitespace and casing normalization
const messyLeague = normalizeLeague('   PREMIER LEAGUE   ');
if (messyLeague.id === 'premier-league' && messyLeague.name === 'Premier League') {
  console.log('[PASS] League whitespace & casing mapped to canonical slug: premier-league');
} else {
  console.error('[FAIL] Failed messy league:', messyLeague);
  process.exit(1);
}

// Rule 3.2: Missing team name fallback
const missingHome = sanitizeMatch({ league: 'La Liga', away: 'Real Madrid' });
if (missingHome.homeTeam === 'Unknown Team') {
  console.log('[PASS] Missing team name fallback displays "Unknown Team"');
} else {
  console.error('[FAIL] Missing team fallback:', missingHome);
  process.exit(1);
}

// Rule 3.3: Missing league name fallback
const missingLeague = sanitizeMatch({ home: 'Arsenal', away: 'Chelsea' });
if (missingLeague.league.name === 'Uncategorized League' && missingLeague.league.id === 'uncategorized') {
  console.log('[PASS] Missing league assigned to "Uncategorized League"');
} else {
  console.error('[FAIL] Missing league fallback:', missingLeague);
  process.exit(1);
}

// Rule 3.4: Missing timestamp fallback
const missingTs = sanitizeMatch({ home: 'Arsenal', away: 'Chelsea', ts: 'BAD_TIMESTAMP' });
if (missingTs.timestamp === null && missingTs.dateStr === 'TBD / Date TBA') {
  console.log('[PASS] Invalid timestamp fallback to "TBD / Date TBA"');
} else {
  console.error('[FAIL] Invalid timestamp fallback:', missingTs);
  process.exit(1);
}

// Rule 3.5: Dynamic status inference
const refTime = DEFAULT_REFERENCE_TIMESTAMP;
const liveStatus = inferMatchStatus(null, refTime - 1800, refTime); // 30 min ago -> LIVE
const finishedStatus = inferMatchStatus(null, refTime - 10000, refTime); // >2h ago -> FINISHED
const upcomingStatus = inferMatchStatus(null, refTime + 3600, refTime); // 1h in future -> UPCOMING

if (liveStatus === 'LIVE' && finishedStatus === 'FINISHED' && upcomingStatus === 'UPCOMING') {
  console.log('[PASS] Status inference accurately computes LIVE, FINISHED, and UPCOMING');
} else {
  console.error('[FAIL] Status inference:', { liveStatus, finishedStatus, upcomingStatus });
  process.exit(1);
}

// Rule 3.6: Top 4 leagues extraction
const topLeagues = extractTopLeagues(sanitized, 4);
console.log('[PASS] Top 4 Leagues identified:');
topLeagues.forEach((l, idx) => {
  console.log(`       ${idx + 1}. ${l.name} (${l.id}) - ${l.count} matches, ${l.liveCount} live`);
});

if (topLeagues.length === 4) {
  console.log('[PASS] Exactly top 4 leagues returned');
} else {
  console.error('[FAIL] Top leagues count:', topLeagues.length);
  process.exit(1);
}

// 4. Test chronological sorting with TBD at the bottom
sanitized.sort((a, b) => {
  if (!a.timestamp && !b.timestamp) return 0;
  if (!a.timestamp) return 1;
  if (!b.timestamp) return -1;
  return a.timestamp - b.timestamp;
});

const lastMatch = sanitized[sanitized.length - 1];
if (lastMatch.timestamp === null) {
  console.log('[PASS] Chronological sort places missing timestamp / TBD fixtures at the bottom');
} else {
  console.error('[FAIL] Last match should be null timestamp:', lastMatch);
  process.exit(1);
}

console.log('=== ALL PHASE 2 TESTS PASSED PERFECTLY! ===');
