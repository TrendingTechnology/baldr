/**
 * Format functions to manipulate strings.
 *
 * @module @bldr/core-browser/string-format
 */
/**
 * Escape some characters with HTML entities.
 *
 * @see {@link https://coderwall.com/p/ostduq/escape-html-with-javascript}
 */
export declare function escapeHtml(htmlString: string): string;
/**
 * Format a date specification string into a local date string, for
 * example `28. August 1749`
 *
 * @param dateSpec - A valid input for the `Date()` class. If the input
 *   is invalid the raw `dateSpec` is returned.
 */
export declare function formatToLocalDate(dateSpec: string): string;
/**
 * Extract the 4 digit year from a date string
 *
 * @param dateSpec - For example `1968-01-01`
 *
 * @returns for example `1968`
 */
export declare function formatToYear(dateSpec: string): string;
/**
 * Convert a single word into title case, for example `word` gets `Word`.
 */
export declare function toTitleCase(text: string): string;
/**
 * Strip HTML tags from a string.
 *
 * @param text - A text containing HTML tags.
 */
export declare function stripTags(text: string): string;
