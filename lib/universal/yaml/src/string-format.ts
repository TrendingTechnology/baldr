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
 * @see {@link https://vladimir-ivanov.net/camelcase-to-snake_case-and-vice-versa-with-javascript/}
 */
export function convertCamelToSnake (text: string): string {
  return text
    .replace(/[\w]([A-Z])/g, function (m) {
      return m[0] + '_' + m[1]
    })
    .toLowerCase()
}

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
export function convertSnakeToCamel (text: string): string {
  return text.replace(/([-_][a-z])/g, group =>
    group
      .toUpperCase()
      .replace('-', '')
      .replace('_', '')
  )
}
