/**
 * Base core functionality for the code running in the browser without node.
 *
 * Run `npm run build` to build the node version of this code. The node
 * version uses the CommonJS module system instead of the ES module system.
 *
 * @module @bldr/core-browser-ts
 */

/**
 * Create a deep copy of an object. This functions uses the two methods
 * `JSON.parse()` and `JSON.stringify()` to accomplish its task.
 *
 * @param data
 */
export function deepCopy (data: object): object {
  return JSON.parse(JSON.stringify(data))
}

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

enum PropertyConvertDirection {
  SNAKE_TO_CAMEL,
  CAMEL_TO_SNAKE
}

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
export function convertProperties (data: any, direction: PropertyConvertDirection = PropertyConvertDirection.SNAKE_TO_CAMEL): object {
  // To perserve the order of the props.
  let newObject: StringObject | null = null

  // Array
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      if (typeof item === 'object') {
        data[i] = convertProperties(item, direction)
      }
    }
  // Object
  } else if (typeof data === 'object') {
    newObject = {}
    for (const oldProp in data) {
      let newProp: string
      if (direction === PropertyConvertDirection.CAMEL_TO_SNAKE) {
        newProp = camelToSnake(oldProp)
      } else {
        newProp = snakeToCamel(oldProp)
      }
      newObject[newProp] = data[oldProp]
      // Object or array
      if (typeof newObject[newProp] === 'object') {
        newObject[newProp] = convertProperties(newObject[newProp], direction)
      }
    }
  }
  if (newObject) return newObject
  return data
}

/**
 * Convert all properties in an object from `snake_case` to `camelCase`.
 *
 * @param data - Some data in various formats.
 *
 * @returns Possibly an new object is returned. One should always use
 *   this returned object. Do not rely on the by reference passed in
 *   object `data`.
 */
export function convertPropertiesSnakeToCamel (data: any): object {
  return convertProperties(data, PropertyConvertDirection.SNAKE_TO_CAMEL)
}

/**
 * Convert all properties in an object from `camelCase` to `snake_case`.
 *
 * @param data - Some data in various formats.
 *
 * @returns Possibly an new object is returned. One should always use
 *   this returned object. Do not rely on the by reference passed in
 *   object `data`.
 */
export function convertPropertiesCamelToSnake (data: any): object {
  return convertProperties(data, PropertyConvertDirection.CAMEL_TO_SNAKE)
}

/**
 * @link {@see https://www.npmjs.com/package/js-yaml}
 */
export const jsYamlConfig = {
  noArrayIndent: true,
  lineWidth: 72,
  noCompatMode: true
}

/**
 * Regular expression to detect media URIs.
 *
 * Possible URIs are: `id:Rhythm-n-Blues-Rock-n-Roll_BD_Bill-Haley#complete`
 * `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7`
 */
export const mediaUriRegExp = new RegExp('((id|uuid):(([a-zA-Z0-9-_]+)(#([a-zA-Z0-9-_]+))?))')
