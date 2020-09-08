/**
 * @module @bldr/media-server/titles
 */

// Node packages.
const fs = require('fs')
const path = require('path')

// Project packages.
const { bootstrapConfig } = require('@bldr/core-node')

/**
 * The configuration object from `/etc/baldr.json`
 */
const config = bootstrapConfig()

/**
 * Hold some meta data about a folder and its title.
 */
class FolderTitle {
  /**
   * @param {Object} data - Some meta data about the folder.
   * @property {String} title - The title. It is the first line in the file
   *   `titles.txt`.
   * @property {String} subtitle - The subtitle. It is the second line in the
   *   file `titles.txt`.
   * @property {String} folderName - The name of the parent folder, for
   *   example `10_Konzertierende-Musiker`
   * @property {String} path - The relative path of the folder inside the
   *   base path, for example `12/10_Interpreten/10_Konzertierende-Musiker`.
   * @property {Boolean} hasPraesentation - True if the folder contains a file
   *   with the file name `Praesentation.baldr.yml`
   */
  constructor ({ title, subtitle, folderName, path, hasPraesentation }) {
    /**
     * The title. It is the first line in the file `titles.txt`.
     *
     * @type {String}
     */
    this.title = title

    /**
     * The subtitle. It is the second line in the file `titles.txt`.
     *
     * @type {String}
     */
    this.subtitle = subtitle

    /**
     * The name of the parent folder, for example `10_Konzertierende-Musiker`
     *
     * @type {String}
     */
    this.folderName = folderName

    /**
     * The relative path of the folder inside the base path, for example
     * `12/10_Interpreten/10_Konzertierende-Musiker`.
     *
     * @type {String}
     */
    this.path = path

    /**
     * True if the folder contains a file with the file name
     * `Praesentation.baldr.yml`
     *
     * @type {Boolean}
     */
    this.hasPraesentation = hasPraesentation
  }
}

/**
 * Hold metadata about a folder and its titles in a hierarchical folder
 * structure.
 *
 * ```js
 * HierarchicalFolderTitles {
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
class HierarchicalFolderTitles {
  /**
   * @param {String} filePath - The path of a file in a folder with `title.txt`
   *   files.
   */
  constructor (filePath) {
    this.titles_ = []
    this.read_(filePath)
  }

  /**
   * Parse the `title.txt` text file. The first line of this file contains
   * the title, the second lines contains the subtitle.
   *
   * @param {String} filePath - The absolute path of a `title.txt` file.
   *
   * @private
   */
  readTitleTxt_ (filePath) {
    const titleRaw = fs.readFileSync(filePath, { encoding: 'utf-8' })
    const titles = titleRaw.split('\n')
    const folderTitle = new FolderTitle({})
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
   * @param {String} filePath - The path of the presentation file.
   *
   * @private
   */
  read_ (filePath) {
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
        const folderTitle = this.readTitleTxt_(titleTxt)
        folderTitle.path = folderNames.join(path.sep)
        folderTitle.folderName = folderName
        this.titles_.push(folderTitle)
      }
    }
  }

  /**
   * An array of title strings.
   *
   * @type {array}
   * @private
   */
  get titlesArray_ () {
    return this.titles_.map(folderTitle => folderTitle.title)
  }

  /**
   * @private
   */
  get lastFolderTitleObject_ () {
    return this.titles_[this.titles_.length - 1]
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
   *
   * @returns {string}
   */
  get allTitles () {
    return this.titlesArray_.join(' / ')
  }

  /**
   * Not the first and last title as a array.
   *
   * @type {Array}
   */
  get curriculumTitlesArray () {
    return this.titlesArray_.slice(1, this.titles_.length - 1)
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
   *
   */
  get curriculum () {
    return this.curriculumTitlesArray.join(' / ')
  }

  /**
   * The parent directory name with the numeric prefix: For example
   * `Bachs-vergebliche-Reise`.
   *
   * @returns {String}
   */
  get id () {
    return this.lastFolderTitleObject_.folderName.replace(/\d\d_/, '')
  }

  /**
   * The title. It is the first line in the text file `title.txt` in the
   * same folder as the constructor `filePath` file.
   *
   * @returns {String}
   */
  get title () {
    return this.lastFolderTitleObject_.title
  }

  /**
   * The subtitle. It is the second line in the text file `title.txt` in the
   * same folder as the constructor `filePath` file.
   *
   * @returns {String}
   */
  get subtitle () {
    if (this.lastFolderTitleObject_.subtitle) {
      return this.lastFolderTitleObject_.subtitle
    }
  }

  /**
   * Combine the title and the subtitle (`Title - Subtitle`).
   *
   * @returns {String}
   */
  get titleAndSubtitle () {
    if (this.subtitle) return `${this.title} - ${this.subtitle}`
    return this.title
  }

  /**
   * The first folder level in the hierachical folder structure must be named
   * with numbers.
   *
   * @returns {string}
   */
  get grade () {
    return this.titles_[0].title.replace(/[^\d]+$/, '')
  }

  /**
   * List all `FolderTitle()` objects.
   *
   * @returns {Array}
   */
  list () {
    return this.titles_
  }
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
class FolderTitleTree {
  constructor () {
    /**
     * @private
     */
    this.tree_ = {}
  }

  /**
   * Add one folder title to the tree.
   *
   * @param {module:@bldr/media-server/titles~HierarchicalFolderTitles} folderTitles
   */
  add (folderTitles) {
    let tmp = this.tree_
    let count = 1
    for (const title of folderTitles.list()) {
      if (!(title.folderName in tmp)) {
        tmp[title.folderName] = {
          _title: title
        }
        tmp[title.folderName]._title.level = count
      }
      tmp = tmp[title.folderName]
      count += 1
    }
  }

  /**
   * Get the tree.
   *
   * @returns {Object}
   */
  get () {
    return this.tree_
  }
}

module.exports = {
  HierarchicalFolderTitles,
  FolderTitleTree
}
