"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitHtmlIntoChunks = exports.wrapWords = void 0;
const universal_dom_1 = require("@bldr/universal-dom");
/**
 * Visit all nodes in the DOM and process it with a callback.
 */
function walkDOM(node, callback) {
    if (node.nodeName !== 'SCRIPT') {
        // ignore javascript
        callback(node);
        for (let i = 0; i < node.childNodes.length; i++) {
            walkDOM(node.childNodes[i], callback);
        }
    }
}
/**
 * Add a HTML element before the other element. Simple utility functions to
 * avoid a lot of typing.
 */
function insertBefore(newElement, element) {
    var _a;
    (_a = element.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(newElement, element);
}
/**
 * Remove a HTML element.
 */
function removeElement(element) {
    var _a;
    (_a = element.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(element);
}
/**
 * Wrap a text string with `<span class="word">…</span>`
 */
function makeSpan(txt) {
    const span = universal_dom_1.documentU.createElement('span');
    span.classList.add('word');
    span.appendChild(makeText(txt));
    return span;
}
/**
 * Convert a text string into a text node.
 */
function makeText(txt) {
    return universal_dom_1.documentU.createTextNode(txt);
}
/**
 * Wrap each word in a string into `<span class="word">…</span>`
 * @see {@link https://stackoverflow.com/a/26030835}
 */
function wrapWords(text) {
    if (Array.isArray(text)) {
        text = text.join(' ');
    }
    text = text.replace(/\s+/g, ' ');
    const dom = new universal_dom_1.DOMParserU().parseFromString(text, 'text/html');
    const textNodes = [];
    walkDOM(dom.body, function (n) {
        if (n.nodeType === 3) {
            textNodes.push(n);
        }
    });
    for (let i = 0; i < textNodes.length; i++) {
        const node = textNodes[i];
        const txt = node.nodeValue;
        // A avoid spaces surrounded by <span class="word"></span>
        if (txt != null && txt !== ' ') {
            const words = txt.split(' ');
            // Insert span surrounded words:
            insertBefore(makeSpan(words[0]), node);
            for (let j = 1; j < words.length; j++) {
                // Join the words with spaces.
                insertBefore(makeText(' '), node);
                insertBefore(makeSpan(words[j]), node);
            }
            // Now remove the original text node:
            removeElement(node);
        }
    }
    return dom.body.innerHTML;
}
exports.wrapWords = wrapWords;
/**
 * Split a HTML text into smaller chunks by looping over the children.
 *
 * @param htmlString - A HTML string.
 * @param charactersPerChunks - The maximum number of characters that may be
 *   contained in a junk.
 *
 * @returns An array of HTML chunks.
 */
function splitHtmlIntoChunks(htmlString, charactersPerChunks = 400) {
    /**
     * Add text to the chunks array. Add only text with real letters not with
     * whitespaces.
     *
     * @param htmlChunks - The array to be filled with HTML chunks.
     * @param htmlString - A HTML string to be added to the array.
     */
    function addHtml(htmlChunks, htmlString) {
        if (htmlString != null && htmlString.match(/^\s*$/) == null) {
            htmlChunks.push(htmlString);
        }
    }
    // if (htmlString.length < charactersPerChunks) {
    //   return [htmlString]
    // }
    const domParser = new universal_dom_1.DOMParserU();
    let dom = domParser.parseFromString(htmlString, 'text/html');
    // If htmlString is a text without tags
    if (dom.body.children.length === 0) {
        dom = domParser.parseFromString(`<p>${htmlString}</p>`, 'text/html');
    }
    let text = '';
    const htmlChunks = [];
    // childNodes not children!
    for (const children of dom.body.childNodes) {
        const element = children;
        // If htmlString is a text with inner tags
        if (children.nodeName === '#text') {
            if (element.textContent != null) {
                text += `${element.textContent}`;
            }
        }
        else {
            if (element.outerHTML != null) {
                text += `${element.outerHTML}`;
            }
        }
        if (text.length > charactersPerChunks) {
            addHtml(htmlChunks, text);
            text = '';
        }
    }
    // Add last not full text
    addHtml(htmlChunks, text);
    return htmlChunks;
}
exports.splitHtmlIntoChunks = splitHtmlIntoChunks;
