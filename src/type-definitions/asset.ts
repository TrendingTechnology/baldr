/**
 * Some basic Typescript interfaces and type defintions.
 *
 * @module @bldr/type-definitions/asset
 */

export interface AssetFileFormat {
  id: string
  uuid: string
  metaTypes?: string
  extension?: string
  mainImage?: string
  filePath?: string
}

export type AssetPropName =
  'id' |
  'uuid' |
  'metaTypes' |
  'extension' |
  'mainImage' |
  'filePath'

/**
 * Generic type of the Media asset file format.
 */
export interface AssetFileFormatGeneric {
  [key: string]: any
}
