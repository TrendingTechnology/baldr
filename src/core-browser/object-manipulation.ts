/**
 * Manipulate javascript objects.
 *
 * @module @bldr/core-browser/object-manipulation
 */

import { convertSnakeToCamel, convertCamelToSnake } from './string-format'

/**
 * Create a deep copy of an object. This functions uses the two methods
 * `JSON.parse()` and `JSON.stringify()` to accomplish its task.
 *
 * @param data
 */
export function deepCopy (data: object): object {
  return JSON.parse(JSON.stringify(data))
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
        newProp = convertCamelToSnake(oldProp)
      } else {
        newProp = convertSnakeToCamel(oldProp)
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
 * Create a deep copy of and object.
 */
export class RawDataObject {
  /**
   * The raw data object.
   */
  raw: {[key: string]: any}
  constructor (rawData: object) {
    this.raw = deepCopy(rawData)
  }

  /**
   * Cut a property from the raw object, that means delete the property and
   * return the value.
   *
   * @param property - The property of the object.
   *
   * @returns The data stored in the property
   */
  cut (property: string): any {
    if ({}.hasOwnProperty.call(this.raw, property)) {
      const out = this.raw[property]
      delete this.raw[property]
      return out
    }
  }

  /**
   * Assert if the raw data object is empty.
   */
  isEmpty (): boolean {
    if (Object.keys(this.raw).length === 0) return true
    return false
  }
}
