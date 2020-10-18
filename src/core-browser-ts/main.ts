/**
 * Base core functionality for the code running in the browser without node.
 *
 * Run `npm run build` to build the node version of this code. The node
 * version uses the CommonJS module system instead of the ES module system.
 *
 * @module @bldr/core-browser-ts
 */

/**
 * Get the extension from a file path.
 *
 * @param filePath - A file path or a single file name.
 *
 * @returns The extension in lower case characters.
 */
export function getExtension (filePath: string): string | undefined {
  if (filePath) {
    const extension = String(filePath).split('.').pop()
    if (extension) {
      return extension.toLowerCase()
    }
  }
}

/**
 * Convert `camelCase` into `snake_case` strings.
 *
 * @param text - A camel cased string.
 *
 * @returns A string formatted in `snake_case`.
 *
 * @see {@link module:@bldr/core-browser.convertPropertiesCase}
 * @see {@link https://vladimir-ivanov.net/camelcase-to-snake_case-and-vice-versa-with-javascript/}
 */
export function camelToSnake (text: string): string {
  return text.replace(/[\w]([A-Z])/g, function (m) {
    return m[0] + '_' + m[1]
  }).toLowerCase()
}

/**
 * Convert `snake_case` or `kebab-case` strings into `camelCase` strings.
 *
 * @param text - A snake or kebab cased string
 *
 * @returns A string formatted in `camelCase`.
 *
 * @see {@link module:@bldr/core-browser.convertPropertiesCase}
 * @see {@link https://catalin.me/javascript-snake-to-camel/}
 */
export function snakeToCamel (text: string): string {
  return text.replace(
    /([-_][a-z])/g,
    (group) => group.toUpperCase()
      .replace('-', '')
      .replace('_', '')
  )
}

interface StringObject {
  [key: string]: any;
}

// enum PropertyFormatConvertDirection {
//   SNAKE_TO_CAMEL,
//   CAMEL_TO_SNAKE
// }

/**
 * Convert all properties in an object from `snake_case` to `camelCase` or vice
 * versa in a recursive fashion.
 *
 * @param data - Some data in various formats.
 * @param direction - `snake-to-camel` or `camel-to-snake`
 *
 * @returns Possibly an new object is returned. One should always
 *   use this returned object.
 */
export function convertPropertiesCase (data: any, direction = 'snake-to-camel'): object {
  // To perserve the order of the props.
  let newObject: StringObject | null = null
  if (!['snake-to-camel', 'camel-to-snake'].includes(direction)) {
    throw new Error(`convertPropertiesCase: argument direction must be “snake-to-camel” or “camel-to-snake”, got ${direction}`)
  }
  // Array
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      if (typeof item === 'object') {
        data[i] = convertPropertiesCase(item, direction)
      }
    }
  // Object
  } else if (typeof data === 'object') {
    newObject = {}
    for (const oldProp in data) {
      let newProp: string
      if (direction === 'camel-to-snake') {
        newProp = camelToSnake(oldProp)
      } else {
        newProp = snakeToCamel(oldProp)
      }
      newObject[newProp] = data[oldProp]
      // Object or array
      if (typeof newObject[newProp] === 'object') {
        newObject[newProp] = convertPropertiesCase(newObject[newProp], direction)
      }
    }
  }
  if (newObject) return newObject
  return data
}
