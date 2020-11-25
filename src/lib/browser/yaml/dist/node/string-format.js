"use strict";
/**
 * Format functions to manipulate strings.
 *
 * @module @bldr/yaml/object-manipulation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertSnakeToCamel = exports.convertCamelToSnake = void 0;
/**
 * Convert `camelCase` into `snake_case` strings.
 *
 * @param text - A camel cased string.
 *
 * @returns A string formatted in `snake_case`.
 *
 * @see {@link module:@bldr/core-browser.convertProperties}
 * @see {@link https://vladimir-ivanov.net/camelcase-to-snake_case-and-vice-versa-with-javascript/}
 */
function convertCamelToSnake(text) {
    return text.replace(/[\w]([A-Z])/g, function (m) {
        return m[0] + '_' + m[1];
    }).toLowerCase();
}
exports.convertCamelToSnake = convertCamelToSnake;
/**
 * Convert `snake_case` or `kebab-case` strings into `camelCase` strings.
 *
 * @param text - A snake or kebab cased string
 *
 * @returns A string formatted in `camelCase`.
 *
 * @see {@link module:@bldr/core-browser.convertProperties}
 * @see {@link https://catalin.me/javascript-snake-to-camel/}
 */
function convertSnakeToCamel(text) {
    return text.replace(/([-_][a-z])/g, (group) => group.toUpperCase()
        .replace('-', '')
        .replace('_', ''));
}
exports.convertSnakeToCamel = convertSnakeToCamel;
