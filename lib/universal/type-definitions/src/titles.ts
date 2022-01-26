/**
 * @module @bldr/type-definitions/titles
 */

import { PresentationMeta } from './presentation'

/**
 * Hold metadata about a folder and its titles in a hierarchical folder
 * structure.
 */
export interface DeepTitle {
  /**
   * Get the first folder name and remove it from the array.
   */
  shiftFolderName: () => string | undefined

  /**
   * All titles concatenated with ` / ` (Include the first and the last title)
   * without the subtitles.
   *
   * for example:
   *
   * 6. Jahrgangsstufe / Lernbereich 2: Musik - Mensch - Zeit /
   * Johann Sebastian Bach: Musik als Bekenntnis /
   * Johann Sebastian Bachs Reise nach Berlin 1747
   */
  allTitles: string

  /**
   * Not the first and last title as an array. See `curriculum`.
   */
  curriculumTitlesArray: string[]

  /**
   * Not the title of the first and the last folder. This is a joined string
   * version of `curriculumTitlesArray`, for example: `7. Jahrgangsstufe /
   * Lernbereich 2: Musik - Mensch - Zeit / Johann Sebastian Bach: Musik als
   * Bekenntnis`.u
   */
  curriculum: string

  /**
   * All folder titles from the grade on, but not last folder title as an array.
   * See `curriculumFromGrade`.
   */
  curriculumTitlesArrayFromGrade: string[]

  /**
   * All folder titles from the grade on, but not last folder title. This is a
   * joined string version of `curriculumTitlesArrayFromGrade`, for example:
   * `Lernbereich 2: Musik - Mensch - Zeit / Johann Sebastian Bach: Musik als
   * Bekenntnis`.
   */
  curriculumFromGrade: string

  /**
   * The parent directory name with the numeric prefix: For example
   * `Bachs-vergebliche-Reise`.
   */
  ref: string

  /**
   * The title. It is the first line in the text file `title.txt` in the
   * same folder as the constructor `filePath` file.
   */
  title: string

  /**
   * The subtitle. It is the second line in the text file `title.txt` in the
   * same folder as the constructor `filePath` file.
   */
  subtitle: string | undefined

  /**
   * Combine the title and the subtitle (`Title - Subtitle`).
   */
  titleAndSubtitle: string

  /**
   * A folder in the hierachical folder structure must be named
   * “X. Jahrgangsstufe”.
   */
  grade: number

  /**
   * List all `FolderTitle()` objects.
   */
  list: () => FolderTitle[]

  /**
   * Get the folder title object by the name of the current folder.
   *
   * @param folderName - A folder name. The name must in the titles
   *   array to get an result.
   */
  getFolderTitleByFolderName: (folderName: string) => FolderTitle | undefined

  /**
   * Generate a object containing the meta informations of a presentation.
   */
  generatePresetationMeta: () => PresentationMeta
}

export interface FolderTitleSpec {
  /**
   * The title. It is the first line in the file `titles.txt`.
   */
  title: string

  /**
   * The subtitle. It is the second line in the file `titles.txt`.
   */
  subtitle?: string

  /**
   * The name of the parent folder, for example `10_Konzertierende-Musiker`
   */
  folderName: string

  /**
   * The relative path of the folder inside the base path, for example
   * `12/10_Interpreten/10_Konzertierende-Musiker`.
   */
  relPath: string

  /**
   * True if the folder contains a file with the file name
   * `Praesentation.baldr.yml`
   */
  hasPresentation: boolean

  /**
   * The level in a folder title tree, starting with 1. 1 ist the top level.
   */
  level?: number
}

/**
 * Hold some meta data about a folder and its title.
 */
export interface FolderTitle {
  /**
   * The title. It is the first line in the file `titles.txt`.
   */
  title: string

  /**
   * The subtitle. It is the second line in the file `titles.txt`.
   */
  subtitle?: string

  /**
   * The name of the parent folder, for example `10_Konzertierende-Musiker`
   */
  folderName: string

  /**
   * The relative path of the folder inside the base path, for example
   * `12/10_Interpreten/10_Konzertierende-Musiker`.
   */
  relPath: string

  /**
   * True if the folder contains a file with the file name
   * `Praesentation.baldr.yml`
   */
  hasPresentation: boolean

  /**
   * The level in a folder title tree, starting with 1. 1 ist the top level.
   */
  level?: number
}

/**
 * A title with sub trees lists.
 *
 * ```js
 * {
 *   "sub": {},
 *   "folder": {
 *     "title": "Personencharakterisierung in der Oper",
 *     "subtitle": "<em class=\"person\">Georges Bizet</em>:...",
 *     "folderName": "30_Habanera",
 *     "relPath": "10/10_Kontext/20_Musiktheater/20_Oper-Carmen/30_Habanera",
 *     "hasPresentation": true,
 *     "level": 4
 *   }
 * }
 * ```
 */
export interface TreeTitle {
  sub: TreeTitleList
  folder: FolderTitle
}

/**
 * A list of sub trees.
 *
 * ```js
 * {
 *   "10": {
 *     "sub": {
 *       "10_Kontext": {
 *         "sub": {
 *           "20_Oper-Carmen": {
 *             "sub": {
 *               "30_Habanera": {
 *                 "sub": {},
 *                 "folder": {
 *                   "title": "Personencharakterisierung in der Oper",
 *                   "subtitle": "<em class=\"person\">Georges Bizet</em>:...",
 *                   "folderName": "30_Habanera",
 *                   "relPath": "10/10_Kontext/20_Musiktheater/20_Oper-Carmen/30_Habanera",
 *                   "hasPresentation": true,
 *                   "level": 4
 *                 }
 *               }
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 * ```
 */
export interface TreeTitleList {
  [folderName: string]: TreeTitle
}
