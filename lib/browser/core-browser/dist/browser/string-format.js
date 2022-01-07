/**
 * Format functions to manipulate strings.
 *
 * @module @bldr/core-browser/string-format
 */
// import { transliterate } from 'transliteration'
/**
 * Escape some characters with HTML entities.
 *
 * @see {@link https://coderwall.com/p/ostduq/escape-html-with-javascript}
 */
export function escapeHtml(htmlString) {
    // List of HTML entities for escaping.
    const htmlEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    };
    // Regex containing the keys listed immediately above.
    const htmlEscaper = /[&<>"'/]/g;
    // Escape a string for HTML interpolation.
    return ('' + htmlString).replace(htmlEscaper, function (match) {
        return htmlEscapes[match];
    });
}
/**
 * Format a date specification string into a local date string, for
 * example `28. August 1749`
 *
 * @param dateSpec - A valid input for the `Date()` class. If the input
 *   is invalid the raw `dateSpec` is returned.
 */
export function formatToLocalDate(dateSpec) {
    const date = new Date(dateSpec);
    // Invalid date
    if (isNaN(date.getDay()))
        return dateSpec;
    const months = [
        'Januar',
        'Februar',
        'März',
        'April',
        'Mai',
        'Juni',
        'Juli',
        'August',
        'September',
        'Oktober',
        'November',
        'Dezember'
    ];
    // Not getDay()
    return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
}
/**
 * Extract the 4 digit year from a date string
 *
 * @param dateSpec - For example `1968-01-01`
 *
 * @returns for example `1968`
 */
export function formatToYear(dateSpec) {
    return dateSpec.substr(0, 4);
}
/**
 * Convert a single word into title case, for example `word` gets `Word`.
 */
export function toTitleCase(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
/**
 * Strip HTML tags from a string.
 *
 * @param text - A text containing HTML tags.
 */
export function stripTags(text) {
    return text.replace(/<[^>]+>/g, '');
}
