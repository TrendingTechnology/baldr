import { DOMParserU } from '@bldr/universal-dom';
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
 * Strip HTML tags from a string.
 *
 * @param text - A text containing HTML tags.
 */
export function stripTags(text) {
    return text.replace(/<[^>]+>/g, '');
}
/**
 * Get the plain text version of a HTML string.
 *
 * @param html - A HTML formated string.
 *
 * @returns The plain text version.
 */
export function convertHtmlToPlainText(html) {
    // To get spaces between heading and paragraphs
    html = html.replace(/></g, '> <');
    const markup = new DOMParserU().parseFromString(html, 'text/html');
    const result = markup.body.textContent;
    if (result == null) {
        return '';
    }
    return result.replace(/\s\s+/g, ' ').trim();
}
/**
 * Shorten a text string. By default the string is shortend to the maximal
 * length of 80 characters.
 */
export function shortenText(text, options) {
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
/**
 * Convert a single word into title case, for example `word` gets `Word`.
 */
export function toTitleCase(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
