/**
 * Some basic Typescript interfaces and type defintions.
 *
 * @module @bldr/type-definitions
 */

export * from './meta-type-specs'

 /**
  * The meta informations of a presentation file.
  */
export interface PresentationMetaFileFormat {

  /**
   * An unique ID.
   */
  id: string

  /**
   * The title of the presentation.
   */
  title: string

  /**
   * The subtitle of the presentation.
   */
  subtitle?: string

  /**
   * The grade the presentation belongs to.
   */
  grade: number

  /**
   * Relation to the curriculum.
   */
  curriculum: string

  /**
   * URL of the curriculum web page.
   */
  curriculumUrl?: string
}

export interface PresentationFileFormat {
  meta: PresentationMetaFileFormat
  slides: object
}

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

/**
 * The specification of a wikidata media metadata property.
 */
export interface MediaWikidataPropSpec {
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

type WikidataFormatFunc = (value: string, arg: MediaTypeDataAndSpec) => string

/**
 * The name of a property.
 */
export type MediaPropName = string

export type MediaState = 'absent' | 'present'

/**
 * The specification of a media metadata property.
 */
export interface MediaPropSpec {
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
  wikidata?: MediaWikidataPropSpec

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
export interface MediaPropSpecCollection {
  [key: string]: MediaPropSpec
}

/**
 * The name of a meta type, for example `person`, `group`.
 */
export type MediaTypeName =
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
export interface MediaTypeSpec {
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
  props: MediaPropSpecCollection

  /**
   * This functions is called after properties are present. The function
   * is called with `function ({ typeData, entity, functions })`
   */
  normalizeWikidata?: NormalizeWikidataFunc
}

type InitializeFunc = (arg: MediaTypeDataAndSpec) => AssetFileFormatGeneric

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
export type MediaTypeSpecCollection = {[key in MediaTypeName]: MediaTypeSpec}

/**
 * Multiple meta data type names, separated by commas, for example
 * `work,recording`. `work,recording` is equivalent to `general,work,recording`.
 */
export type MediaTypeNames = string

/**
 * Some actual data which can be assigned to a meta type.
 */
export type MediaTypeData = object

export interface MediaTypeDataAndSpec {
  typeData: AssetFileFormatGeneric
  typeSpec: MediaTypeSpec
}

export type ValidateFunc = (value: any) => boolean
export type FinalizeFunc = (dataAndSpec: MediaTypeDataAndSpec) => AssetFileFormatGeneric

export type FormatFunc = (value: any, dataAndSpec: MediaTypeDataAndSpec) => any

interface DeriveFuncArg {
  typeData: AssetFileFormatGeneric
  typeSpec: MediaTypeSpec
  folderTitles: DeepTitle
  filePath: string
}
export type DeriveFunc = (arg: DeriveFuncArg) => any

interface RelPathFuncArg {
  typeData: AssetFileFormatGeneric
  typeSpec: MediaTypeSpec
  oldRelPath: string
}
export type RelPathFunc = (arg: RelPathFuncArg) => string


export type DetectTypeByPathFunc = (arg: MediaTypeSpec) => RegExp


interface FolderTitleSpec {
  /**
   * The title. It is the first line in the file `titles.txt`.
   */
  title: string;
  /**
   * The subtitle. It is the second line in the file `titles.txt`.
   */
  subtitle: string;
  /**
   * The name of the parent folder, for example `10_Konzertierende-Musiker`
   */
  folderName: string;
  /**
   * The relative path of the folder inside the base path, for example
   * `12/10_Interpreten/10_Konzertierende-Musiker`.
   */
  path: string;
  /**
   * True if the folder contains a file with the file name
   * `Praesentation.baldr.yml`
   */
  hasPraesentation: boolean;
  /**
   * The level in a folder title tree, starting with 1. 1 ist the top level.
   */
  level: number;
}
/**
* Hold some meta data about a folder and its title.
*/
declare class FolderTitle {
  /**
   * The title. It is the first line in the file `titles.txt`.
   */
  title: string;
  /**
   * The subtitle. It is the second line in the file `titles.txt`.
   */
  subtitle: string;
  /**
   * The name of the parent folder, for example `10_Konzertierende-Musiker`
   */
  folderName: string;
  /**
   * The relative path of the folder inside the base path, for example
   * `12/10_Interpreten/10_Konzertierende-Musiker`.
   */
  path: string;
  /**
   * True if the folder contains a file with the file name
   * `Praesentation.baldr.yml`
   */
  hasPraesentation: boolean;
  /**
   * The level in a folder title tree, starting with 1. 1 ist the top level.
   */
  level: number;
  /**
   * @param {Object} data - Some meta data about the folder.
   */
  constructor({ title, subtitle, folderName, path, hasPraesentation, level }: FolderTitleSpec);
}
/**
 * Hold metadata about a folder and its titles in a hierarchical folder
 * structure.
 *
 * ```js
 * HierarchicalFolderTitle {
 *   titles_: [
 *     FolderTitle {
 *       path: '06',
 *       title: '6. Jahrgangsstufe',
 *       folderName: '06'
 *     },
 *     FolderTitle {
 *       path: '06/20_Mensch-Zeit',
 *       title: 'Lernbereich 2: Musik - Mensch - Zeit',
 *       folderName: '20_Mensch-Zeit'
 *     },
 *     FolderTitle {
 *       path: '06/20_Mensch-Zeit/10_Bach',
 *       title: 'Johann Sebastian Bach: Musik als Bekenntnis',
 *       folderName: '10_Bach'
 *     },
 *     FolderTitle {
 *       path: '06/20_Mensch-Zeit/10_Bach/40_Bachs-vergebliche-Reise',
 *       title: 'Johann Sebastian Bachs Reise nach Berlin 1747',
 *       folderName: '40_Bachs-vergebliche-Reise'
 *     }
 *   ]
 * }
 * ```
 */
export declare class DeepTitle {
  private titles;
  /**
   * An array of folder names. This array is used to descent the folder tree.
   */
  private folderNames;
  /**
   * @param filePath - The path of a file in a folder with `title.txt`
   *   files.
   */
  constructor(filePath: string);
  /**
   * Get the first folder name and remove it from the array.
   */
  shiftFolderName(): string | undefined;
  /**
   * Parse the `title.txt` text file. The first line of this file contains
   * the title, the second lines contains the subtitle.
   *
   * @param filePath - The absolute path of a `title.txt` file.
   */
  private readTitleTxt;
  /**
   * Read all `title.txt` files. Descend to all parent folders which contain
   * a `title.txt` file.
   *
   * @param filePath - The path of the presentation file.
   */
  private read;
  /**
   * Get an array of title strings.
   */
  private get titlesArray();
  /**
   * Get the last instance of the class FolderTitle
   */
  private get lastFolderTitleObject();
  /**
   * All titles concatenated with ` / ` (Include the first and the last title)
   * without the subtitles.
   *
   *
   * for example:
   *
   * 6. Jahrgangsstufe / Lernbereich 2: Musik - Mensch - Zeit /
   * Johann Sebastian Bach: Musik als Bekenntnis /
   * Johann Sebastian Bachs Reise nach Berlin 1747
   */
  get allTitles(): string;
  /**
   * Not the first and last title as a array.
   */
  get curriculumTitlesArray(): string[];
  /**
   * Not the title of the first and the last folder.
   *
   * ```js
   * HierarchicalFolderTitles {
   *   titles_: [
   *     FolderTitle {
   *       title: '6. Jahrgangsstufe'
   *     },
   *     FolderTitle {
   *       title: 'Lernbereich 2: Musik - Mensch - Zeit'
   *     },
   *     FolderTitle {
   *       title: 'Johann Sebastian Bach: Musik als Bekenntnis'
   *     },
   *     FolderTitle {
   *       title: 'Johann Sebastian Bachs Reise nach Berlin 1747'
   *     }
   *   ]
   * }
   * ```
   *
   * -> Lernbereich 2: Musik - Mensch - Zeit / Johann Sebastian Bach: Musik als Bekenntnis
   */
  get curriculum(): string;
  /**
   * The parent directory name with the numeric prefix: For example
   * `Bachs-vergebliche-Reise`.
   */
  get id(): string;
  /**
   * The title. It is the first line in the text file `title.txt` in the
   * same folder as the constructor `filePath` file.
   */
  get title(): string;
  /**
   * The subtitle. It is the second line in the text file `title.txt` in the
   * same folder as the constructor `filePath` file.
   */
  get subtitle(): string | undefined;
  /**
   * Combine the title and the subtitle (`Title - Subtitle`).
   */
  get titleAndSubtitle(): string;
  /**
   * The first folder level in the hierachical folder structure must be named
   * with numbers.
   */
  get grade(): number;
  /**
   * List all `FolderTitle()` objects.
   *
   * @returns {Array}
   */
  list(): FolderTitle[];
  /**
   * Generate a object containing the meta informations of a presentation.
   */
  generatePresetationMeta(): PresentationMetaFileFormat;
}
