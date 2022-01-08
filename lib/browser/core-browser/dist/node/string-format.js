"use strict";
/**
 * Format functions to manipulate strings.
 *
 * @module @bldr/core-browser/string-format
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripTags = exports.toTitleCase = exports.formatToYear = void 0;
/**
 * Extract the 4 digit year from a date string
 *
 * @param dateSpec - For example `1968-01-01`
 *
 * @returns for example `1968`
 */
function formatToYear(dateSpec) {
    return dateSpec.substr(0, 4);
}
exports.formatToYear = formatToYear;
/**
 * Convert a single word into title case, for example `word` gets `Word`.
 */
function toTitleCase(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
exports.toTitleCase = toTitleCase;
/**
 * Strip HTML tags from a string.
 *
 * @param text - A text containing HTML tags.
 */
function stripTags(text) {
    return text.replace(/<[^>]+>/g, '');
}
exports.stripTags = stripTags;
