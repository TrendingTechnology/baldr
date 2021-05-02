/**
 * Some basic Typescript interfaces and type defintions.
 *
 * @module @bldr/type-definitions/asset
 */

/**
 * Following properties are moved into the sample “complete”: `startTime`,
 * `duration`, `endTime`, `fadeIn`, `fadeOut`, `shortcut`
 */
export interface SampleYamlFormat {
  /**
   * for example `Theme 1`
   */
  title?: string

  /**
   * without spaces, only ASCII, for example `theme_1`
   */
  ref?: string

  /**
   * The start time in seconds or as a duration string like `1:23:45` = 1 hour
   * 23 minutes and 45 seconds, for example `61.123435`.
   */
  startTime?: number

  /**
   * The duration in seconds or as a duration string like `1:23:45` = 1 hour 23
   * minutes and 45 seconds, mutually exclusive to `endTime`, for example `12`.
   */
  duration?: number

  /**
   * The end time in seconds or as a duration string like `1:23:45` = 1 hour 23
   * minutes and 45 seconds, mutually exclusive to `duration` `163.12376`.
   */
  endTime?: number

  /**
   * The fade in time in seconds or as a duration string like `1:23:45` = 1 hour
   * 23 minutes and 45 seconds for example `5`.
   */
  fadeIn?: number

  /**
   * The fade out time in seconds or as a duration string like `1:23:45` = 1
   * hour 23 minutes and 45 seconds for example `5`.
   */
  fadeOut?: number

  /**
   * A custom shortcut for mousetrap, for example `o 1`.
   */
  shortcut?: string
}

/**
 * The metadata YAML file format.
 *
 * This interface corresponds to the structure of the YAML files
 * `*.extension.yml`. The most frequently used properties are explicitly
 * specified.
 *
 * ```yml
 * ---
 * ref: Schuetz-Freue_HB_Freue-dich
 * uuid: 02dcf8df-8f34-4b0d-b121-32b0f54cfd74
 * categories: 'composition,recording'
 * title: 'Freue dich des Weibes deiner Jugend, SWV 453 (verm. um 1620)'
 * wikidata: Q90698578
 * composer: Heinrich Schütz
 * imslp: 'Freue_dich_des_Weibes_deiner_Jugend,_SWV_453_(Schütz,_Heinrich)'
 * musicbrainz_work_id: 0f6faed6-4892-4b43-855f-e3fe8f49bffa
 * ```
 */
export interface YamlFormat {
  /**
   * A reference string, for example `Haydn_Joseph`.
   */
  ref: string
  uuid: string
  title: string
  categories?: string

  /**
   * This property is moved into the sample “complete”. The start time in
   * seconds or as a duration string like `1:23:45` = 1 hour 23 minutes and 45
   * seconds, for example `61.123435`.
   */
  startTime?: number

  /**
   * This property is moved into the sample “complete”. The duration in seconds
   * or as a duration string like `1:23:45` = 1 hour 23 minutes and 45 seconds,
   * mutually exclusive to `endTime`, for example `12`.
   */
  duration?: number

  /**
   * This property is moved into the sample “complete”. The end time in seconds
   * or as a duration string like `1:23:45` = 1 hour 23 minutes and 45 seconds,
   * mutually exclusive to `duration` `163.12376`.
   */
  endTime?: number

  /**
   * This property is moved into the sample “complete”. The fade in time in
   * seconds or as a duration string like `1:23:45` = 1 hour 23 minutes and 45
   * seconds for example `5`.
   */
  fadeIn?: number

  /**
   * This property is moved into the sample “complete”. The fade out time in
   * seconds or as a duration string like `1:23:45` = 1 hour 23 minutes and 45
   * seconds for example `5`.
   */
  fadeOut?: number

  /**
   * This property is moved into the sample “complete”. The keyboard shortcut to
   * play the media. A custom shortcut for mousetrap, for example `o 1`.
   */
  shortcut?: string

  /**
   * An array of Sample instances.
   */
  samples?: SampleYamlFormat[]

  /**
   * An media URI of a image to use a preview image for mainly audio files.
   * Video files are also supported.
   */
  cover?: string

  composer?: string
  artist?: string

  [property: string]: any
}

/**
 * Exported from the media server REST API
 */
export interface RestApiRaw extends YamlFormat {
  mimeType: string
  extension: string

  /**
   * The file name, for example `Haydn_Joseph.jpg`.
   */
  filename: string

  /**
   * The relative path on the HTTP server, for example
   * `composer/Haydn_Joseph.jpg`.
   */
  path: string
  previewImage: boolean
  size: number
  timeModified: number

  /**
   * The of count of parts if the media file is a multi part asset.
   */
  multiPartCount?: number
  [property: string]: any
}

/**
 * A type for the possible property names.
 */
export type PropName =
  'ref' |
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
