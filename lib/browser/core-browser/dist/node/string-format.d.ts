/**
 * Format functions to manipulate strings.
 *
 * @module @bldr/core-browser/string-format
 */
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
