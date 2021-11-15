import { DOMParserU, documentU } from '@bldr/universal-dom';
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
    const span = documentU.createElement('span');
    span.classList.add('word');
    span.appendChild(makeText(txt));
    return span;
}
/**
 * Convert a text string into a text node.
 */
function makeText(txt) {
    return documentU.createTextNode(txt);
}
/**
 * Wrap each word in a string into `<span class="word">…</span>`
 * @see {@link https://stackoverflow.com/a/26030835}
 */
export function wrapWords(text) {
    if (Array.isArray(text)) {
        text = text.join(' ');
    }
    text = text.replace(/\s+/g, ' ');
    const dom = new DOMParserU().parseFromString(text, 'text/html');
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
