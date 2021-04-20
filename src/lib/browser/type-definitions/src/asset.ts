/**
 * Some basic Typescript interfaces and type defintions.
 *
 * @module @bldr/type-definitions/asset
 */

/**
 * A type for the Metadata YAML file format for media assets.
 */
export interface FileFormat {
  id: string
  uuid: string
  categories?: string
  extension?: string
  mainImage?: string
  filePath?: string
  [key: string]: any
}

/**
 * A type for the possible property names.
 */
export type PropName =
  'id' |
  'uuid' |
  'categories' |
  'extension' |
  'mainImage' |
  'filePath'

/**
 * Generic type of the Media asset file format.
 */
export interface Generic {
  [key: string]: any
}
