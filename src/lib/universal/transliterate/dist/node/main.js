"use strict";
/// https://github.com/sindresorhus/transliterate/blob/main/index.js
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_deburr_1 = require("lodash.deburr");
// import escapeStringRegexp from 'escape-string-regexp'
const replacements_1 = require("./replacements");
// https://github.com/sindresorhus/escape-string-regexp/blob/main/index.js
function escapeStringRegexp(string) {
    if (typeof string !== 'string') {
        throw new TypeError('Expected a string');
    }
    // Escape characters with special meaning either inside or outside character sets.
    // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
    return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}
const doCustomReplacements = (string, replacements) => {
    for (const [key, value] of replacements) {
        // TODO: Use `String#replaceAll()` when targeting Node.js 16.
        string = string.replace(new RegExp(escapeStringRegexp(key), 'g'), value);
    }
    return string;
};
function transliterate(string, options) {
    if (typeof string !== 'string') {
        throw new TypeError(`Expected a string, got \`${typeof string}\``);
    }
    options = Object.assign({ customReplacements: [] }, options);
    const customReplacements = new Map([
        ...replacements_1.default,
        ...options.customReplacements
    ]);
    string = string.normalize();
    string = doCustomReplacements(string, customReplacements);
    string = lodash_deburr_1(string);
    return string;
}
exports.default = transliterate;
