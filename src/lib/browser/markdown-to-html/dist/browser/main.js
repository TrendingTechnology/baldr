import * as marked from 'marked';
import { JSDOM } from 'jsdom';
const DOMParser = new JSDOM().window.DOMParser;
/**
 * @param text - The raw input text coming directly form YAML
 */
function convertCustomMarkup(text) {
    return text
        // ↔ 8596 2194 &harr; LEFT RIGHT ARROW
        .replace(/<->/g, '↔')
        // → 8594 2192 &rarr; RIGHTWARDS ARROW
        .replace(/->/g, '→')
        // ← 8592 2190 &larr; LEFTWARDS ARROW
        .replace(/<-/g, '←');
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
function convertMarkdown(text) {
    text = marked(text);
    const dom = new DOMParser().parseFromString(text, 'text/html');
    // Solution using the browser only implementation.
    if (dom.body.childElementCount === 1 && dom.body.childNodes[0].tagName === 'P') {
        return dom.body.childNodes[0].innerHTML;
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
export function convertMarkdownFromString(text) {
    return convertMarkdown(convertCustomMarkup(text));
}
/**
 * Convert the specifed text to HTML. At the moment Markdown and HTML formats
 * are supported. The conversion is done in a recursive fashion, that means
 * nested strings are also converted.
 *
 * @param input - Various input types
 */
export function convertMarkdownFromAny(input) {
    // string
    if (typeof input === 'string') {
        return convertMarkdownFromString(input);
        // array
    }
    else if (Array.isArray(input)) {
        for (let index = 0; index < input.length; index++) {
            const value = input[index];
            if (typeof value === 'string') {
                input[index] = convertMarkdownFromString(value);
            }
            else {
                convertMarkdownFromAny(value);
            }
        }
        // object
    }
    else if (typeof input === 'object') {
        for (const key in input) {
            const value = input[key];
            if (typeof value === 'string') {
                input[key] = convertMarkdownFromString(value);
            }
            else {
                convertMarkdownFromAny(value);
            }
        }
    }
    return input;
}
