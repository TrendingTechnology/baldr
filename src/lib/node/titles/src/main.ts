/**
 * Read the nexted titles.txt files and form a hierarchical data structure.
 *
 * @module @bldr/titles
 */

// Node packages.
import fs from 'fs'
import path from 'path'

import { PresentationTypes, StringIndexedObject } from '@bldr/type-definitions'

/**
 * Hold some meta data about a folder and its title.
 */
class FolderTitle {
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
  path: string

  /**
   * True if the folder contains a file with the file name
   * `Praesentation.baldr.yml`
   */
  hasPraesentation: boolean

  /**
   * The level in a folder title tree, starting with 1. 1 ist the top level.
   */
  level: number

  /**
   * @param data - Some meta data about the folder.
   */
  constructor ({ title, subtitle, folderName, path, hasPraesentation, level }: StringIndexedObject) {
    this.title = title
    if (subtitle != null) this.subtitle = subtitle
    this.folderName = folderName
    this.path = path
    this.hasPraesentation = (hasPraesentation != null && hasPraesentation)
    this.level = level
  }
}

/**
 * Hold metadata about a folder and its titles in a hierarchical folder
 * structure.
 */
export class DeepTitle {
  /**
   * An array of folder titles. The last element is the folder title of
   * the `filePath`.
   */
  private readonly titles: FolderTitle[]

  /**
   * An array of folder names. This array is used to descent the folder tree.
   */
  private readonly folderNames: string[]

  /**
   * @param filePath - The path of a file in a folder with `title.txt`
   *   files.
   */
  constructor (filePath: string) {
    this.titles = []
    this.read(filePath)
    this.folderNames = this.titles.map(folderTitle => folderTitle.folderName)
  }

  /**
   * Get the first folder name and remove it from the array.
   */
  shiftFolderName (): string | undefined {
    return this.folderNames.shift()
  }

  /**
   * Parse the `title.txt` text file. The first line of this file contains
   * the title, the second lines contains the subtitle.
   *
   * @param filePath - The absolute path of a `title.txt` file.
   */
  private readTitleTxt (filePath: string): FolderTitle {
    const titleRaw = fs.readFileSync(filePath, { encoding: 'utf-8' })
    const titles = titleRaw.split('\n')
    const folderTitle = new FolderTitle({})
    if (titles.length > 0) {
      folderTitle.title = titles[0]
    }
    if (titles.length > 1 && titles[1] != null && titles[1] !== '') {
      folderTitle.subtitle = titles[1]
    }
    if (fs.existsSync(path.join(path.dirname(filePath), 'Praesentation.baldr.yml'))) {
      folderTitle.hasPraesentation = true
    }
    return folderTitle
  }

  /**
   * Generate the path of the title.txt file `/var/data/baldr/media/05/title.txt`
   *
   * @param pathSegments An array of path segments `['', 'var', 'data', 'baldr',
   *   'media', '05']` without the filename `title.txt` itself.
   *
   * @returns The path of a title.txt file
   */
  private generateTitleTxtPath (pathSegments: string[]): string {
    return [...pathSegments, 'title.txt'].join(path.sep)
  }

  /**
   * Find all title.txt files (from the deepest to the shallowest title.txt)
   *
   * @param filePath A file path from which to descend into the folder
   *   structure.
   *
   * @returns An array with absolute file path. First the deepest title.txt
   *   file. Last the shallowest title.txt file.
   */
  private findTitleTxt (filePath: string): string[] {
    let parentDir: string
    if (fs.lstatSync(filePath).isDirectory()) {
      parentDir = filePath
    } else {
      parentDir = path.dirname(filePath)
    }
    const segments = parentDir.split(path.sep)
    const titlePaths: string[] = []
    for (let index = segments.length; index >= 0; index--) {
      const pathSegments = segments.slice(0, index)
      // /media/05/20_Mensch-Zeit/10_Mozart/20_Biographie-Salzburg-Wien/title.txt
      // /media/05/20_Mensch-Zeit/10_Mozart/title.txt
      // /media/05/20_Mensch-Zeit/title.txt
      // /media/05/title.txt
      const titleTxt = this.generateTitleTxtPath(pathSegments)
      if (fs.existsSync(titleTxt)) {
        // Do not push “title.txt” in the parent working directory (without initial /).
        // Push only absolute paths
        if (titleTxt.indexOf(path.sep) === 0) {
          titlePaths.push(titleTxt)
        }
      }
    }
    return titlePaths.reverse()
  }

  /**
   * Read all `title.txt` files. Descend to all parent folders which contain
   * a `title.txt` file.
   *
   * @param filePath - The path of the presentation file.
   */
  private read (filePath: string): void {
    // We need absolute paths. The cli gives us relative paths.
    filePath = path.resolve(filePath)
    const titleTxtPaths = this.findTitleTxt(filePath)
    let level: number = 1
    for (const titleTxtPath of titleTxtPaths) {
      const folderTitle = this.readTitleTxt(titleTxtPath)
      folderTitle.path = path.dirname(titleTxtPath)
      folderTitle.folderName = path.basename(folderTitle.path)
      folderTitle.level = level++
      this.titles.push(folderTitle)
    }
  }

  /**
   * Get an array of title strings.
   */
  private get titlesArray (): string[] {
    return this.titles.map(folderTitle => folderTitle.title)
  }

  /**
   * Get the last instance of the class FolderTitle
   */
  private get lastFolderTitleObject (): FolderTitle {
    return this.titles[this.titles.length - 1]
  }

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
  get allTitles (): string {
    return this.titlesArray.join(' / ')
  }

  /**
   * Not the first and last title as a array.
   */
  get curriculumTitlesArray (): string[] {
    return this.titlesArray.slice(1, this.titles.length - 1)
  }

  /**
   * Not the title of the first and the last folder.
   *
   * -> Lernbereich 2: Musik - Mensch - Zeit / Johann Sebastian Bach: Musik als Bekenntnis
   */
  get curriculum (): string {
    return this.curriculumTitlesArray.join(' / ')
  }

  /**
   * The parent directory name with the numeric prefix: For example
   * `Bachs-vergebliche-Reise`.
   */
  get id (): string {
    return this.lastFolderTitleObject.folderName.replace(/\d\d_/, '')
  }

  /**
   * The title. It is the first line in the text file `title.txt` in the
   * same folder as the constructor `filePath` file.
   */
  get title (): string {
    return this.lastFolderTitleObject.title
  }

  /**
   * The subtitle. It is the second line in the text file `title.txt` in the
   * same folder as the constructor `filePath` file.
   */
  get subtitle (): string | undefined {
    if (this.lastFolderTitleObject.subtitle != null) {
      return this.lastFolderTitleObject.subtitle
    }
  }

  /**
   * Combine the title and the subtitle (`Title - Subtitle`).
   */
  get titleAndSubtitle (): string {
    if (this.subtitle != null) return `${this.title} - ${this.subtitle}`
    return this.title
  }

  /**
   * The first folder level in the hierachical folder structure must be named
   * with numbers.
   */
  get grade (): number {
    return parseInt(this.titles[0].title.replace(/[^\d]+$/, ''))
  }

  /**
   * List all `FolderTitle()` objects.
   */
  list (): FolderTitle[] {
    return this.titles
  }

  /**
   * Get the folder title object by the name of the current folder.
   *
   * @param folderName - A folder name. The name must in the titles
   *   array to get an result.
   */
  getFolderTitleByFolderName (folderName: string): FolderTitle | undefined {
    for (const folderTitle of this.titles) {
      if (folderTitle.folderName === folderName) {
        return folderTitle
      }
    }
  }

  /**
   * Generate a object containing the meta informations of a presentation.
   */
  generatePresetationMeta (): PresentationTypes.PresentationMeta {
    const result: PresentationTypes.PresentationMeta = {
      id: this.id,
      subtitle: this.subtitle,
      title: this.title,
      grade: this.grade,
      curriculum: this.curriculum
    }
    if (result.subtitle == null || result.subtitle === '') delete result.subtitle
    return result
  }
}

interface SubTree {
  [key: string]: TitleTree
}

/**
 * A tree of folder titles.
 *
 * ```json
 * {
 *   "10": {
 *     "subTree": {
 *       "10_Kontext": {
 *         "subTree": {
 *           "20_Oper-Carmen": {
 *             "subTree": {
 *               "30_Habanera": {
 *                 "subTree": {},
 *                 "title": {
 *                   "title": "Personencharakterisierung in der Oper",
 *                   "folderName": "30_Habanera",
 *                   "path": "10/10_Kontext/20_Musiktheater/20_Oper-Carmen/30_Habanera",
 *                   "hasPraesentation": true,
 *                   "level": 4,
 *                   "subtitle": "<em class=\"person\">Georges Bizet</em>:..."
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
export class TitleTree {
  private subTree: SubTree
  title?: FolderTitle
  constructor (deepTitle: DeepTitle, folderName?: string) {
    this.subTree = {}
    if (folderName != null) {
      this.title = deepTitle.getFolderTitleByFolderName(folderName)
    }
  }

  /**
   * Add one deep folder title to the tree.
   *
   * @param deepTitle The deep folder title to add.
   */
  add (deepTitle: DeepTitle): void {
    const folderName = deepTitle.shiftFolderName()
    if (folderName == null) return
    if (this.subTree[folderName] == null) {
      this.subTree[folderName] = new TitleTree(deepTitle, folderName)
    } else {
      this.subTree[folderName].add(deepTitle)
    }
  }

  /**
   * Get the tree.
   */
  get (): SubTree {
    return this.subTree
  }
}
