"use strict";
/**
 * Format functions to manipulate strings.
 *
 * @module @bldr/yaml/string-format
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
 * @see {@link https://vladimir-ivanov.net/camelcase-to-snake_case-and-vice-versa-with-javascript/}
 */
function convertCamelToSnake(text) {
    return text
        .replace(/[\w]([A-Z])/g, function (m) {
        return m[0] + '_' + m[1];
    })
        .toLowerCase();
}
exports.convertCamelToSnake = convertCamelToSnake;
/**
 * Convert a string that is in the `snake_case` or `kebab-case` format into
 * `camelCase` formatted string.
 *
 * @param text - A snake or kebab cased string.
 *
 * @returns A string formatted in `camelCase`.
 *
 * @see {@link https://catalin.me/javascript-snake-to-camel/}
 */
function convertSnakeToCamel(text) {
    return text.replace(/([-_][a-z])/g, group => group
        .toUpperCase()
        .replace('-', '')
        .replace('_', ''));
}
exports.convertSnakeToCamel = convertSnakeToCamel;
