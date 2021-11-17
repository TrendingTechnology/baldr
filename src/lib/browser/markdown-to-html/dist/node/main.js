"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertNestedMarkdownToHtml = exports.convertMarkdownToHtml = void 0;
const marked_1 = require("marked");
const universal_dom_1 = require("@bldr/universal-dom");
/**
 * Convert some custom markup like arrows.
 *
 * @param text - The raw input text coming directly form YAML.
 */
function convertCustomMarkup(text) {
    return (text
        // ↔ 8596 2194 &harr; LEFT RIGHT ARROW
        .replace(/<->/g, '↔')
        // → 8594 2192 &rarr; RIGHTWARDS ARROW
        .replace(/->/g, '→')
        // ← 8592 2190 &larr; LEFTWARDS ARROW
        .replace(/<-/g, '←'));
}
/**
 * Convert a string from Markdown to HTML. Automatically generate a
 * inline version (without surrounding `<p></p>`) if the text consists
 * of only one paragraph.
 *
 * Other no so stable solution:
 * https://github.com/markedjs/marked/issues/395
 *
 * @param text - The raw input text coming directly from YAML.
 */
function convertMarkdownAutoInline(text) {
    text = marked_1.marked(text);
    const dom = new universal_dom_1.DOMParserU().parseFromString(text, 'text/html');
    // Solution using the browser only implementation.
    if (dom.body.childElementCount === 1 &&
        dom.body.children[0].tagName === 'P') {
        return dom.body.children[0].innerHTML;
    }
    else {
        return dom.body.innerHTML;
    }
}
/**
 * Convert a string from the Markdown format into the HTML format.
 *
 * @param text - A string in the Markdown format.
 */
function convertMarkdownToHtml(text) {
    return convertMarkdownAutoInline(convertCustomMarkup(text));
}
exports.convertMarkdownToHtml = convertMarkdownToHtml;
/**
 * Convert Markdown texts into HTML texts.
 *
 * The conversion is done in a recursive fashion, that means
 * strings nested in objects or arrays are also converted.
 *
 * @param input - Various input types
 */
function convertNestedMarkdownToHtml(input) {
    // string
    if (typeof input === 'string') {
        return convertMarkdownToHtml(input);
        // array
    }
    else if (Array.isArray(input)) {
        for (let index = 0; index < input.length; index++) {
            const value = input[index];
            if (typeof value === 'string') {
                input[index] = convertMarkdownToHtml(value);
            }
            else {
                convertNestedMarkdownToHtml(value);
            }
        }
        // object
    }
    else if (typeof input === 'object') {
        for (const key in input) {
            const value = input[key];
            if (typeof value === 'string') {
                input[key] = convertMarkdownToHtml(value);
            }
            else {
                convertNestedMarkdownToHtml(value);
            }
        }
    }
    return input;
}
exports.convertNestedMarkdownToHtml = convertNestedMarkdownToHtml;
