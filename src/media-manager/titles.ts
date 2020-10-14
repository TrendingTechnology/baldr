/**
 * @module @bldr/media-server/titles
 */

// Node packages.
import fs from 'fs'
import path from 'path'

/**
 * The configuration object from `/etc/baldr.json`
 */
import config from '@bldr/config'

interface FolderTitleSpec {
  /**
   * The title. It is the first line in the file `titles.txt`.
   */
  title: string

  /**
   * The subtitle. It is the second line in the file `titles.txt`.
   */
  subtitle: string

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
}

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
  subtitle: string

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
   * @param {Object} data - Some meta data about the folder.
   */
  constructor ({ title, subtitle, folderName, path, hasPraesentation, level }: FolderTitleSpec) {
    this.title = title
    this.subtitle = subtitle
    this.folderName = folderName
    this.path = path
    this.hasPraesentation = hasPraesentation
    this.level = level
  }
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
export class DeepTitle {

  private titles: FolderTitle[]

  /**
   * An array of folder names. This array is used to descent the folder tree.
   */
  private folderNames: string[]

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
  shiftFolderName() {
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
    const folderTitle = new FolderTitle(<FolderTitleSpec> {})
    if (titles.length > 0) {
      folderTitle.title = titles[0]
    }
    if (titles.length > 1 && titles[1]) {
      folderTitle.subtitle = titles[1]
    }
    if (fs.existsSync(path.join(path.dirname(filePath), 'Praesentation.baldr.yml'))) {
      folderTitle.hasPraesentation = true
    }
    return folderTitle
  }

  /**
   * Read all `title.txt` files. Descend to all parent folders which contain
   * a `title.txt` file.
   *
   * @param filePath - The path of the presentation file.
   */
  private read (filePath: string) {
    // We need absolute paths. The cli gives us relative paths.
    filePath = path.resolve(filePath)
    // ['', 'var', 'data', 'baldr', 'media', '12', ..., 'Praesentation.baldr.yml']
    const segments = filePath.split(path.sep)
    // 10, 11
    const depth = segments.length
    // 5
    const minDepth = config.mediaServer.basePath.split(path.sep).length
    // To build the path property of the FolderTitle class.
    const folderNames = []
    for (let index = minDepth + 1; index < depth; index++) {
      const folderName = segments[index - 1]
      folderNames.push(folderName)
      // [ '', 'var', 'data', 'baldr', 'media', '05' ]
      const pathSegments = segments.slice(0, index)
      // /var/data/baldr/media/05/title.txt
      // /var/data/baldr/media/05/20_Mensch-Zeit/title.txt
      // /var/data/baldr/media/05/20_Mensch-Zeit/10_Mozart/title.txt
      // /var/data/baldr/media/05/20_Mensch-Zeit/10_Mozart/20_Biographie-Salzburg-Wien/title.txt
      const titleTxt = [...pathSegments, 'title.txt'].join(path.sep)
      if (fs.existsSync(titleTxt)) {
        const folderTitle = this.readTitleTxt(titleTxt)
        folderTitle.path = folderNames.join(path.sep)
        folderTitle.folderName = folderName
        this.titles.push(folderTitle)
      }
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
  get title (): string  {
    return this.lastFolderTitleObject.title
  }

  /**
   * The subtitle. It is the second line in the text file `title.txt` in the
   * same folder as the constructor `filePath` file.
   */
  get subtitle (): string | undefined {
    if (this.lastFolderTitleObject.subtitle) {
      return this.lastFolderTitleObject.subtitle
    }
  }

  /**
   * Combine the title and the subtitle (`Title - Subtitle`).
   */
  get titleAndSubtitle (): string {
    if (this.subtitle) return `${this.title} - ${this.subtitle}`
    return this.title
  }

  /**
   * The first folder level in the hierachical folder structure must be named
   * with numbers.
   */
  get grade (): string {
    return this.titles[0].title.replace(/[^\d]+$/, '')
  }

  /**
   * List all `FolderTitle()` objects.
   *
   * @returns {Array}
   */
  list (): FolderTitle[] {
    return this.titles
  }
}

interface SubTree {
  [key: string]: FolderTitleTree
}

/**
 * A tree of folder titles.
 *
 * ```json
 * {
 *   "10": {
 *     "_title": {
 *       "title": "10. Jahrgangsstufe",
 *       "path": "10",
 *       "folderName": "10",
 *       "level": 1
 *     },
 *     "10_Kontext": {
 *       "_title": {
 *         "title": "Musik im Kontext",
 *         "path": "10/10_Kontext",
 *         "folderName": "10_Kontext",
 *         "level": 2
 *       },
 *       "10_Musiktheater-Ueberblick": {
 *         "_title": {
 *           "title": "Musiktheater: Überblick",
 *           "hasPraesentation": true,
 *           "path": "10/10_Kontext/20_Musiktheater/10_Musiktheater-Ueberblick",
 *           "folderName": "10_Musiktheater-Ueberblick",
 *           "level": 3
 *         }
 *       },
 *       "20_Oper-Carmen": {
 *         "_title": {
 *           "title": "<em class=\"person\">Georges Bizet</em>: Oper <em class=\"piece\">„Carmen“</em> (1875)",
 *           "path": "10/10_Kontext/20_Musiktheater/20_Oper-Carmen",
 *           "folderName": "20_Oper-Carmen",
 *           "level": 3
 *         },
 *         "10_Hauptpersonen": {
 *           "_title": {
 *             "title": "Personencharakteristik der vier Hauptpersonen",
 *             "hasPraesentation": true,
 *             "path": "10/10_Kontext/20_Musiktheater/20_Oper-Carmen/10_Hauptpersonen",
 *             "folderName": "10_Hauptpersonen",
 *             "level": 4
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 * ```
 */
export class FolderTitleTree {
  private subTree: SubTree
  deepTitle: DeepTitle
  constructor (folderTitle: DeepTitle) {
    this.subTree = {}
    this.deepTitle = folderTitle
  }

  /**
   * Add one folder title to the tree.
   *
   * @param deepTitle
   */
  add (deepTitle: DeepTitle) {
    const folderName = deepTitle.shiftFolderName()
    if (!folderName) return
    if (!this.subTree[folderName]) {
      this.subTree[folderName] = new FolderTitleTree(deepTitle)
    } else {
      this.subTree[folderName].add(deepTitle)
    }
  }

  /**
   * Get the tree.
   */
  get (): SubTree  {
    return this.subTree
  }
}
