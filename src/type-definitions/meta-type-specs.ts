/**
 * Some basic Typescript interfaces and type defintions.
 *
 * @module @bldr/type-definitions/meta-type-specs
 */

import { DeepTitleInterface } from './titles'
import { AssetFileFormatGeneric } from './asset'

export namespace MetaDataSpec {
  export interface Lol {

  }
}

/**
 * The specification of a wikidata media metadata property.
 */
export interface MetaWikidataPropSpec {
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

  alwaysUpdate?: boolean

  /**
   * A function or `formatDate`, `formatYear`, `formatWikicommons`,
   * `formatList`, `formatSingleValue`.
   */
  format?: WikidataFormatFunc | 'formatDate' | 'formatList' | 'formatYear' | 'formatWikicommons' | 'formatSingleValue'
}

type WikidataFormatFunc = (value: string, arg: TypeDataAndSpec) => string

/**
 * The name of a property.
 */
export type MetaPropName = string

export type MediaState = 'absent' | 'present'

/**
 * The specification of a media metadata property.
 */
export interface MetaPropSpec {
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
   * is called with `derive ({ typeData, typeSpec, folderTitles,
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
   * has this arguments: `format (value, { typeData, typeSpec })`
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
  wikidata?: MetaWikidataPropSpec

  /**
   * `absent` or `present`
   */
  state?: MediaState
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
export interface MetaPropSpecCollection {
  [key: string]: MetaPropSpec
}

/**
 * The name of a meta type, for example `person`, `group`.
 */
export type MetaTypeName =
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
  * The specification of one metadata type.
  */
export interface MetaTypeSpec {
  /**
   * A title for the metadata type.
   */
  title: string

  /**
   * A text to describe a metadata type.
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
   * `basePath`). The function is called with `relPath ({ typeData,
   * typeSpec, oldRelPath })`.
   */
  relPath?: RelPathFunc

  /**
   * A regular expression that is matched against file paths or a
   * function which is called with `typeSpec` that returns a regexp.
   */
  detectTypeByPath?: RegExp | DetectTypeByPathFunc

  /**
   * A function which is called before all processing steps: `initialize
   * ({ typeData, typeSpec })`.
   */
  initialize?: InitializeFunc

  /**
   * A function which is called after all processing steps: arguments:
   * `finalize ({ typeData, typeSpec })`
   */
  finalize?: FinalizeFunc

  /**
   *
   */
  props: MetaPropSpecCollection

  /**
   * This functions is called after properties are present. The function
   * is called with `function ({ typeData, entity, functions })`
   */
  normalizeWikidata?: NormalizeWikidataFunc
}

type InitializeFunc = (arg: TypeDataAndSpec) => AssetFileFormatGeneric

interface NormalizeWikidataFuncArg {
  typeData: AssetFileFormatGeneric
  entity: { [key: string]: any }
  functions: { [key: string]: Function }
}
type NormalizeWikidataFunc = (arg: NormalizeWikidataFuncArg) => AssetFileFormatGeneric

/**
 * The specification of all meta types
 *
 * ```js
 * const TypeSpecCollection = {
 *   typeName1: typeSpec1,
 *   typeName2: typeSpec2
 *   ...
 * }
 * ```
 */
export type MetaTypeSpecCollection = {[key in MetaTypeName]: MetaTypeSpec}

/**
 * Multiple meta data type names, separated by commas, for example
 * `work,recording`. `work,recording` is equivalent to `general,work,recording`.
 */
export type MetaTypeNames = string

/**
 * Some actual data which can be assigned to a meta type.
 */
export type MetaTypeData = object

export interface TypeDataAndSpec {
  typeData: AssetFileFormatGeneric
  typeSpec: MetaTypeSpec
}

export type ValidateFunc = (value: any) => boolean
export type FinalizeFunc = (dataAndSpec: TypeDataAndSpec) => AssetFileFormatGeneric

export type FormatFunc = (value: any, dataAndSpec: TypeDataAndSpec) => any

interface DeriveFuncArg {
  typeData: AssetFileFormatGeneric
  typeSpec: MetaTypeSpec
  folderTitles: DeepTitleInterface
  filePath: string
}
export type DeriveFunc = (arg: DeriveFuncArg) => any

interface RelPathFuncArg {
  typeData: AssetFileFormatGeneric
  typeSpec: MetaTypeSpec
  oldRelPath: string
}
export type RelPathFunc = (arg: RelPathFuncArg) => string

export type DetectTypeByPathFunc = (arg: MetaTypeSpec) => RegExp
