/**
 * Some basic Typescript interfaces and type defintions.
 *
 * @module @bldr/type-definitions/asset
 */

/**
 * The metadata YAML file format.
 *
 * This interface corresponds to the structure of the YAML files
 * `*.extension.yml`. The most frequently used properties are explicitly
 * specified.
 *
 * ```yml
 * ---
 * id: Schuetz-Freue_HB_Freue-dich
 * uuid: 02dcf8df-8f34-4b0d-b121-32b0f54cfd74
 * categories: 'composition,recording'
 * title: 'Freue dich des Weibes deiner Jugend, SWV 453 (verm. um 1620)'
 * wikidata: Q90698578
 * composer: Heinrich Schütz
 * imslp: 'Freue_dich_des_Weibes_deiner_Jugend,_SWV_453_(Schütz,_Heinrich)'
 * musicbrainz_work_id: 0f6faed6-4892-4b43-855f-e3fe8f49bffa
 * ```
 */
export interface FileFormat {
  id: string
  uuid: string
  title: string
  categories?: string
  [property: string]: any
}

/**
 * Intermediate data format for client media assets. The media categories
 * manager needs the `filePath` property.
 */
export interface Intermediate extends FileFormat {
  /**
   * Required by the function `categoriesManager.sortAndDeriveProps()`.
   */
  filePath: string

  /**
   * Required by the function `categoriesManager.formatFilePath()`.
   */
  extension: string
  [property: string]: any
}

/**
 * Exported from the media server REST API
 */
export interface RestApiRaw {
  assetType: string
  extension: string
  filename: string
  /**
   * Relative path
   */
  path: string
  previewImage: boolean
  size: number
  timeModified: number
  uuid: string
  id: string
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
