import { format, isValid, fromUnixTime } from 'date-fns';

/**
 * Normalizes input timestamp or date string to valid epoch seconds.
 * Returns null if timestamp is missing or invalid.
 */
export function normalizeTimestamp(rawTs, rawDateStr) {
  if (rawTs !== null && rawTs !== undefined) {
    const num = Number(rawTs);
    if (!Number.isNaN(num) && num > 0) {
      // If timestamp is in milliseconds (length > 11 digits), convert to seconds
      return num > 9999999999 ? Math.floor(num / 1000) : num;
    }
  }

  // Fallback to parsing ISO or formatted date string if provided
  if (rawDateStr && typeof rawDateStr === 'string') {
    const parsed = new Date(rawDateStr);
    if (isValid(parsed) && parsed.getTime() > 0) {
      return Math.floor(parsed.getTime() / 1000);
    }
  }

  return null;
}

/**
 * Formats match timestamp to full readable date (e.g. "Saturday, Dec 20, 2025")
 */
export function formatMatchDate(timestamp) {
  if (!timestamp) return 'TBD / Date TBA';
  try {
    const date = fromUnixTime(timestamp);
    if (!isValid(date)) return 'TBD / Date TBA';
    return format(date, 'EEEE, MMM d, yyyy');
  } catch {
    return 'TBD / Date TBA';
  }
}

/**
 * Formats match timestamp to display kickoff time (e.g. "08:30 PM")
 */
export function formatMatchTime(timestamp) {
  if (!timestamp) return 'TBA';
  try {
    const date = fromUnixTime(timestamp);
    if (!isValid(date)) return 'TBA';
    return format(date, 'h:mm a');
  } catch {
    return 'TBA';
  }
}

/**
 * Generates sticky date header label with relative anchor (e.g., "Saturday, Dec 20, 2025").
 */
export function getDateHeaderLabel(timestamp) {
  if (!timestamp) return 'TBD / Date TBA';
  try {
    const date = fromUnixTime(timestamp);
    if (!isValid(date)) return 'TBD / Date TBA';
    return format(date, 'EEEE - MMM d, yyyy');
  } catch {
    return 'TBD / Date TBA';
  }
}

/**
 * Generates unique date group key in YYYY-MM-DD format for chronological grouping.
 */
export function getDateGroupKey(timestamp) {
  if (!timestamp) return '9999-99-99-TBD';
  try {
    const date = fromUnixTime(timestamp);
    if (!isValid(date)) return '9999-99-99-TBD';
    return format(date, 'yyyy-MM-dd');
  } catch {
    return '9999-99-99-TBD';
  }
}
