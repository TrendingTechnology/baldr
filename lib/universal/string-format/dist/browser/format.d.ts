/**
 * Escape some characters with HTML entities.
 *
 * @see {@link https://coderwall.com/p/ostduq/escape-html-with-javascript}
 */
export declare function escapeHtml(htmlString: string): string;
/**
 * Strip HTML tags from a string.
 *
 * @param text - A text containing HTML tags.
 */
export declare function stripTags(text: string): string;
/**
 * Get the plain text version of a HTML string.
 *
 * @param html - A HTML formated string.
 *
 * @returns The plain text version.
 */
export declare function convertHtmlToPlainText(html: string): string;
interface ShortenTextOptions {
    stripTags?: boolean;
    maxLength?: number;
}
/**
 * Shorten a text string. By default the string is shortend to the maximal
 * length of 80 characters.
 */
export declare function shortenText(text: string, options?: ShortenTextOptions): string;
/**
 * Convert a single word into title case, for example `word` gets `Word`.
 */
export declare function capitalize(text: string): string;
export {};
