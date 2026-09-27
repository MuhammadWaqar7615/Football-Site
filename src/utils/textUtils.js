/**
 * Text formatting, slugification, and highlighting utilities.
 */

/**
 * Cleans string of superfluous whitespaces, nulls, and unicode escape sequences.
 */
export function cleanText(input) {
  if (input === null || input === undefined) return '';
  let str = String(input);
  
  // Unescape unicode literals like \u00f3 or \u2161 if present as literal strings
  try {
    str = str.replace(/\\u([0-9a-fA-F]{4})/g, (_, code) =>
      String.fromCharCode(parseInt(code, 16))
    );
  } catch {
    // fallback if regex fails
  }

  // Collapse multiple spaces/tabs/newlines into single space
  return str.replace(/\s+/g, ' ').trim();
}

/**
 * Deterministically slugifies a string into an URL-safe slug.
 */
export function slugify(input) {
  const cleaned = cleanText(input);
  if (!cleaned) return 'uncategorized';

  return cleaned
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumerics with hyphens
    .replace(/^-+|-+$/g, '') // trim leading/trailing hyphens
    || 'uncategorized';
}

/**
 * Escapes regex special characters in a search term.
 */
export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Breaks text into chunks with `isMatch` flag for safe React markup highlighting.
 */
export function getHighlightedChunks(text, query) {
  if (!text) return [{ text: '', isMatch: false }];
  const cleanQuery = cleanText(query);
  if (!cleanQuery) return [{ text, isMatch: false }];

  const regex = new RegExp(`(${escapeRegExp(cleanQuery)})`, 'gi');
  const parts = text.split(regex);

  return parts
    .filter((part) => part.length > 0)
    .map((part) => ({
      text: part,
      isMatch: part.toLowerCase() === cleanQuery.toLowerCase(),
    }));
}
