"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTitleCase = exports.shortenText = exports.convertHtmlToPlainText = exports.stripTags = exports.escapeHtml = void 0;
const universal_dom_1 = require("@bldr/universal-dom");
/**
 * Escape some characters with HTML entities.
 *
 * @see {@link https://coderwall.com/p/ostduq/escape-html-with-javascript}
 */
function escapeHtml(htmlString) {
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
exports.escapeHtml = escapeHtml;
/**
 * Strip HTML tags from a string.
 *
 * @param text - A text containing HTML tags.
 */
function stripTags(text) {
    return text.replace(/<[^>]+>/g, '');
}
exports.stripTags = stripTags;
/**
 * Get the plain text version of a HTML string.
 *
 * @param html - A HTML formated string.
 *
 * @returns The plain text version.
 */
function convertHtmlToPlainText(html) {
    // To get spaces between heading and paragraphs
    html = html.replace(/></g, '> <');
    const markup = new universal_dom_1.DOMParserU().parseFromString(html, 'text/html');
    const result = markup.body.textContent;
    if (result == null) {
        return '';
    }
    return result.replace(/\s\s+/g, ' ').trim();
}
exports.convertHtmlToPlainText = convertHtmlToPlainText;
/**
 * Shorten a text string. By default the string is shortend to the maximal
 * length of 80 characters.
 */
function shortenText(text, options) {
    const defaults = {
        stripTags: false,
        maxLength: 80
    };
    if (options == null) {
        options = defaults;
    }
    else {
        options = Object.assign(defaults, options);
    }
    if (options.stripTags) {
        text = convertHtmlToPlainText(text);
    }
    if (text.length < options.maxLength) {
        return text;
    }
    // https://stackoverflow.com/a/5454303
    // trim the string to the maximum length
    text = text.substr(0, options.maxLength);
    // re-trim if we are in the middle of a word
    text = text.substr(0, Math.min(text.length, text.lastIndexOf(' ')));
    return `${text} …`;
}
exports.shortenText = shortenText;
/**
 * Convert a single word into title case, for example `word` gets `Word`.
 */
function toTitleCase(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
exports.toTitleCase = toTitleCase;
