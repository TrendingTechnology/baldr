/**
 * Some basic Typescript interfaces and type defintions.
 *
 * @module @bldr/type-definitions/meta-spec
 */

import { DeepTitleInterface } from './titles'
import * as AssetType from './asset'

/**
 * Defintion of the function `format()`.
 */
type WikidataFormatFunc = (value: string, arg: Category) => string

/**
 * The specification of a wikidata media metadata property.
 */
export interface WikidataProp {
  /**
   * for example `P123` or `['P123', 'P234']`. If `fromClaim` is an
   * array, the first existing claim an a certain item is taken.
   */
  fromClaim?: string | string[]

  /**
   * `getDescription`, `getLabel`, `getWikipediaTitle`. If `fromClaim`
   * is specifed and the item has a value on this claim, `fromEntity` is
   * omitted.
   */
  fromEntity?: 'getDescription' | 'getLabel' | 'getWikipediaTitle'

  /**
   * `queryLabels`
   */
  secondQuery?: string

  /**
   * Update the wikidata property always.
   */
  alwaysUpdate?: boolean

  /**
   * A function or `formatDate`, `formatYear`, `formatWikicommons`,
   * `formatList`, `formatSingleValue`.
   */
  format?: WikidataFormatFunc | 'formatDate' | 'formatList' | 'formatYear' | 'formatWikicommons' | 'formatSingleValue'
}

/**
 * The name of a property.
 */
export type PropName = string

/**
 * Definition of the argument for the function `derive()`.
 */
interface DeriveFuncArg {
  data: AssetType.FileFormat
  category: Category
  folderTitles?: DeepTitleInterface
  filePath?: string
}

/**
 * Defintion of the function `derive()`.
 */
type DeriveFunc = (arg: DeriveFuncArg) => any

/**
 * Defintion of the function `format()`.
 */
type FormatFunc = (value: any, args: DataCategoryFilePath) => any

/**
 * Defintion of the function `validate()`.
 */
type ValidateFunc = (value: any) => boolean

/**
 * Defintion of type for the property `state`.
 */
type State = 'absent' | 'present'

/**
 * The specification of a media metadata property.
 */
export interface Prop {
  /**
   * A title of the property.
   */
  title: string

  /**
   * A text which describes the property.
   */
  description?: string

  /**
   * True if the property is required.
   */
  required?: boolean

  /**
   * A function to derive this property from other values. The function
   * is called with `derive ({ data, category, folderTitles,
   * filePath })`.
   */
  derive?: DeriveFunc

  /**
   * Overwrite the original value by the
   * the value obtained from the `derive` function.
   */
  overwriteByDerived?: boolean

  /**
   * Format the value of the property using this function. The function
   * has this arguments: `format (value, { data, category })`
   */
  format?: FormatFunc

  /**
   * If the value matches the specified regular expression, remove the
   * property.
   *
   */
  removeByRegexp?: RegExp

  /**
   * Validate the property using this function.
   */
  validate?: ValidateFunc

  /**
   * See package `@bldr/wikidata`.
   */
  wikidata?: WikidataProp

  /**
   * `absent` or `present`
   */
  state?: State
}

/**
 * The specification of all properties. The single `propSpec`s are indexed
 * by the `propName`.
 *
 * ```js
 * const propSpecs = {
 *   propName1: propSpec1,
 *   propName2: propSpec2
 *   ...
 * }
 * ```
 */
export interface PropCollection {
  [key: string]: Prop
}

/**
 * Definition of the argument for the function `relPath()`.
 */
interface RelPathFuncArg {
  data: AssetType.FileFormat
  category: Category
  oldRelPath: string
}

/**
 * Defintion of the function `relPath()`.
 */
type RelPathFunc = (relPathFuncArg: RelPathFuncArg) => string

/**
 * Defintion of the function `detectCategoryByPath()`.
 */
type DetectTypeByPathFunc = (category: Category) => RegExp

/**
 * Defintion of the function `intialize()`.
 */
type InitializeFunc = (args: DataCategoryFilePath) => AssetType.FileFormat

/**
 * Defintion of the function `finalize()`.
 */
type FinalizeFunc = (args: DataCategoryFilePath) => AssetType.FileFormat

/**
 * Defintion of the argument of the function `normalizeWikidata()`.
 */
interface NormalizeWikidataFuncArg {
  data: AssetType.FileFormat
  entity: { [key: string]: any }
  functions: { [key: string]: Function }
}

/**
 * Defintion of the function `normalizeWikidata()`.
 */
type NormalizeWikidataFunc = (arg: NormalizeWikidataFuncArg) => AssetType.FileFormat

/**
 * Apart from different file formats, media files can belong to several media
 * categories regardless of their file format.
 */
export interface Category {
  /**
   * A title for the media category.
   */
  title: string

  /**
   * A text to describe a media category.
   */
  description?: string

  /**
   * A two letter abbreviation. Used in the IDs.
   */
  abbreviation?: string

  /**
   * The base path where all meta typs stored in.
   */
  basePath?: string

  /**
   * A function which must return the relative path (relative to
   * `basePath`).
   */
  relPath?: RelPathFunc

  /**
   * A regular expression that is matched against file paths or a
   * function which is called with `category` that returns a regexp.
   */
  detectCategoryByPath?: RegExp | DetectTypeByPathFunc

  /**
   * A function which is called before all processing steps: `initialize
   * ({ data, category })`.
   */
  initialize?: InitializeFunc

  /**
   * A function which is called after all processing steps: arguments:
   * `finalize ({ data, category })`
   */
  finalize?: FinalizeFunc

  /**
   *
   */
  props: PropCollection

  /**
   * This functions is called after properties are present.
   */
  normalizeWikidata?: NormalizeWikidataFunc
}

/**
 * The name of a meta type, for example `person`, `group`.
 */
export type Name =
  'cloze' |
  'composition' |
  'cover' |
  'group' |
  'instrument' |
  'person' |
  'photo' |
  'radio' |
  'recording' |
  'reference' |
  'score' |
  'song' |
  'worksheet' |
  'youtube' |
  'general'

/**
 * Multiple meta data type names, separated by commas, for example
 * `work,recording`. `work,recording` is equivalent to `general,work,recording`.
 */
export type Names = string

/**
 * A collection of all media categories.
 *
 * ```js
 * const Collection = {
 *   name1: category1,
 *   name2: category2
 *   ...
 * }
 * ```
 */
export interface Collection {
  cloze: Category
  composition: Category
  cover: Category
  group: Category
  instrument: Category
  person: Category
  photo: Category
  radio: Category
  recording: Category
  reference: Category
  score: Category
  song: Category
  worksheet: Category
  youtube: Category
  general: Category
}

/**
 * Generic type for metadata of assets.
 */
export interface Data { [key: string]: any }

/**
 * Used in many functions as an argument.
 */
interface DataCategoryFilePath {
  data: AssetType.FileFormat
  category: Category

  /**
   * The path of media asset itself, not the metadata `*.extension.yml` file.
   */
  filePath?: string
}
