/**
 * Format functions to manipulate strings.
 *
 * @module @bldr/yaml/string-format
 */
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
export declare function convertCamelToSnake(text: string): string;
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
export declare function convertSnakeToCamel(text: string): string;
