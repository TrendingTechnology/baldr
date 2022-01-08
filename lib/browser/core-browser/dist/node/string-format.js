"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripTags = exports.toTitleCase = void 0;
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
