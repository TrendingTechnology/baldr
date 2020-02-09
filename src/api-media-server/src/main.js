/**
 * The REST API and command line interface of the BALDR media server.
 *
 * # Media types:
 *
 * - presentation (`Presentation()`)
 * - asset (`Asset()`)
 *   - multipart asset (`filename.jpg`, `filename_no02.jpg`, `filename_no03.jpg`)
 *
 * # Definition of the objects:
 *
 * A _presentation_ is a YAML file for the BALDR presentation app. It must have
 * the file name scheme `*.baldr.yml`. The media server stores the whole YAML
 * file in the MongoDB database.
 *
 * A _asset_ is a media file which has a meta data file in the YAML format.
 * The file name scheme for this meta data file is `media-file.jpg.yml`. The
 * suffix `.yml` has to be appended. Only the content of the meta data file
 * is stored into the database.
 *
 * # REST API
 * - `get`
 *   - `folder-title-tree`: Get the folder title tree as a hierarchical json
 *     object.
 * - `mgmt`
 *   - `flush`: Delete all media files (assets, presentations) from the database.
 *   - `init`: Initialize the MongoDB database
 *   - `open`: Open a media file specified by an ID. This query parameters are
 *     available:
 *       - `id`: The ID of the media file (required).
 *       - `type`: `presentations`, `assets`. The default value is
 *         `presentations.`
 *       - `with`: `editor` specified in `config.mediaServer.editor`
 *         (`/etc/baldr.json`) or `folder` to open the parent folder of the
 *         given media file. The default value is `editor`
 *
 *   - `re-init`: Re-Initialize the MongoDB database (Drop all collections and
 *     initialize)
 *   - `update`: Update the media server database (Flush and insert).
 *   - `query`: Getting results by using query parameters. This query parameters
 *     are available:
 *      - `type`: `assets` (default), `presentations` (what)
 *      - `method`: `exactMatch`, `substringSearch` (default) (how).
 *          - `exactMatch`: The query parameter `search` must be a perfect match
 *            to a top level database field to get a result.
 *          - `substringSearch`: The query parameter `search` is only a
 *            substring of the string to search in.
 *      - `field`: `id` (default), `title`, etc ... (where).
 *      - `search`: Some text to search for (search for).
 *      - `result`: `fullObjects` (default), `dynamicSelect`
 * - `stats`:
 *   - `count`: Count / sum of the media files (assets, presentations) in the
 *     database.
 *   - `updates`: Journal of the update processes with timestamps.
 *
 * @module @bldr/api-media-server
 */

// Node packages.
const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')

// Third party packages.
const yaml = require('js-yaml')
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const { transliterate } = require('transliteration')

// Project packages.
const { bootstrapConfig, snakeToCamel } = require('@bldr/core-node')

const packageJson = require('../package.json')

/**
 * The configuration object from `/etc/baldr.json`
 */
const config = bootstrapConfig()

/**
 * Base path of the media server file store.
 */
const basePath = config.mediaServer.basePath

/**
 * A container array for all error messages send out via the REST API.
 */
let errors = []

/* MongoDb setup **************************************************************/

/**
 *
 */
function setupMongoUrl () {
  const conf = config.databases.mongodb
  const user = encodeURIComponent(conf.user)
  const password = encodeURIComponent(conf.password)
  const authMechanism = 'DEFAULT'
  const url = `mongodb://${user}:${password}@${conf.url}/${conf.dbName}?authMechanism=${authMechanism}`
  return url
}

/**
 *
 */
const mongoClient = new MongoClient(
  setupMongoUrl(),
  { useNewUrlParser: true, useUnifiedTopology: true }
)

/**
 * The MongoDB Db instance
 * @type {mongodb~Db}
 */
let db

/**
 * @return {Promise}
 */
async function connectDb () {
  if (!db) {
    await mongoClient.connect()
    db = mongoClient.db(config.databases.mongodb.dbName)
  }
}

/* Helper functions ***********************************************************/

/**
 * This function can be used to generate ids from different file names.
 *
 * @param {String} input
 *
 * @returns {String}
 */
function asciify (input) {
  let output = input
    .replace(/[\(\)';]/g, '')
    .replace(/[,.] /g, '_')
    .replace(/ +- +/g, '_')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/-*_-*/g, '_')
    .replace(/Ä/g, 'Ae')
    .replace(/ä/g, 'ae')
    .replace(/Ö/g, 'Oe')
    .replace(/ö/g, 'oe')
    .replace(/Ü/g, 'Ue')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
  return transliterate(output)
}

/**
 * This function can be used to generate a title from an ID string.
 *
 * @param {String} input
 *
 * @returns {String}
 */
function deasciify (input) {
  return input
    .replace(/_/g, ', ')
    .replace(/-/g, ' ')
    .replace(/Ae/g, 'Ä')
    .replace(/ae/g, 'ä')
    .replace(/Oe/g, 'Ö')
    .replace(/oe/g, 'ö')
    .replace(/Ue/g, 'Ü')
    .replace(/ue/g, 'ü')
}

/**
 * Convert all properties in an object to camelCase in a recursive fashion.
 *
 * TODO: Use the function in @bldr/core-browser
 *
 * @param {Object} object
 *
 * @returns {Object}
 */
function convertPropertiesToCamelCase (object) {
  // Array
  if (Array.isArray(object)) {
    for (const item of object) {
      if (typeof object === 'object') {
        convertPropertiesToCamelCase(item)
      }
    }
  // Object
  } else if (typeof object === 'object') {
    for (const snakeCase in object) {
      const camelCase = snakeToCamel(snakeCase)
      if (camelCase !== snakeCase) {
        const value = object[snakeCase]
        object[camelCase] = value
        delete object[snakeCase]
      }
      // Object or array
      if (typeof object[camelCase] === 'object') convertPropertiesToCamelCase(object[camelCase])
    }
  }
  return object
}

/**
 * Get the extension from a file path.
 *
 * @param {String} filePath
 *
 * @returns {String}
 */
function getExtension (filePath) {
  return path.extname(filePath).replace('.', '')
}

/**
 * Strip HTML tags from a string.
 *
 * @param {String} text - A text containing HTML tags.
 *
 * @returns {String}
 */
function stripTags (text) {
  return text.replace(/<[^>]+>/g, '');
}

/* Media objects **************************************************************/

/**
 * Hold some data about a folder and its title.
 */
class FolderTitle {
  constructor({ title, subtitle, folderName, path, hasPraesentation }) {
    /**
     * @type {String}
     */
    if (title) this.title = title

    /**
     * @type {String}
     */
    if (subtitle) this.subtitle = subtitle

    /**
     * for example `10_Konzertierende-Musiker`
     *
     * @type {String}
     */
    if (folderName) this.folderName = folderName

    /**
     * The relative path of the folder inside the base path, for example
     * `12/10_Interpreten/10_Konzertierende-Musiker`.
     *
     * @type {String}
     */
    if (path) this.path = path

    /**
     * True if the folder contains a file with the file name
     * `Praesentation.baldr.yml`
     *
     * @type {Booelan}
     */
    if (hasPraesentation) this.hasPraesentation = hasPraesentation
  }
}

/**
 * Hold metadata about a folder in a hierachical folder structure.
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
    const minDepth = basePath.split(path.sep).length
    // To build the path property of the FolderTitle class.
    const folderNames = []
    for (let index = minDepth + 1; index < depth; index++) {
      let folderName = segments[index - 1]
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
  get titlesArray_() {
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
  get curriculumTitlesArray() {
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
   * @returns {string}
   */
  get id () {
    return this.lastFolderTitleObject_.folderName.replace(/\d\d_/, '')
  }

  /**
   * The title. It is the first line in the text file `title.txt` in the
   * same folder as the constructor `filePath` file.
   *
   * @returns {string}
   */
  get title () {
    return this.lastFolderTitleObject_.title
  }

  /**
   * The subtitle. It is the second line in the text file `title.txt` in the
   * same folder as the constructor `filePath` file.
   *
   * @returns {string}
   */
  get subtitle () {
    if (this.lastFolderTitleObject_.subtitle) {
      return this.lastFolderTitleObject_.subtitle
    }
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
  list() {
    return this.titles_
  }
}

/**
 *
 */
class FolderTitleTree {
  constructor () {
    this.tree_ = {}
  }

  /**
   *
   * @param {HierarchicalFolderTitles} folderTitles
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

  get () {
    return this.tree_
  }
}

const folderTitleTree = new FolderTitleTree()

/**
 * Categories some asset file formats in three asset types: `audio`, `image`,
 * `video`.
 *
 * TODO: Code which can be imported by ES modules and node modules.
 * The same code is in the module @bldr/api-media-server/src/main.js and
 * @bldr/vue-component-media/src/main.js
 */
class AssetTypes {
  constructor (config) {
    /**
     * @type {object}
     * @private
     */
    this.config_ = config.mediaServer.assetTypes

    /**
     * @type {object}
     * @private
     */
    this.allowedExtensions_ = this.spreadExtensions_()
  }

  /**
   * @private
   */
  spreadExtensions_ () {
    const out = {}
    for (const type in this.config_) {
      for (const extension of this.config_[type].allowedExtensions) {
        out[extension] = type
      }
    }
    return out
  }

  /**
   * Get the media type from the extension.
   *
   * @param {String} extension
   *
   * @returns {String}
   */
  extensionToType (extension) {
    extension = extension.toLowerCase()
    if (extension in this.allowedExtensions_) {
      return this.allowedExtensions_[extension]
    }
    throw new Error(`Unkown extension “${extension}”`)
  }

  /**
   * Get the color of the media type.
   *
   * @param {String} type - The asset type: for example `audio`, `image`,
   *   `video`.
   *
   * @returns {String}
   */
  typeToColor (type) {
    return this.config_[type].color
  }

  /**
   * Determine the target extension (for a conversion job) by a given
   * asset type.
   *
   * @param {String} type - The asset type: for example `audio`, `image`,
   *   `video`.
   *
   * @returns {String}
   */
  typeToTargetExtension (type) {
    return this.config_[type].targetExtension
  }

  /**
   * Check if file is an supported asset format.
   *
   * @param {String} filename
   *
   * @returns {Boolean}
   */
  isAsset (filename) {
    const extension = filename.split('.').pop().toLowerCase()
    if (extension in this.allowedExtensions_) {
      return true
    }
    return false
  }
}

const assetTypes = new AssetTypes(config)

/**
 * Base class to be extended.
 */
class MediaFile {
  constructor (filePath) {
    /**
     * Absolute path ot the file.
     * @type {string}
     * @private
     */
    this.absPath_ = path.resolve(filePath)

    /**
     * Relative path ot the file.
     * @type {string}
     */
    this.path = filePath.replace(basePath, '').replace(/^\//, '')

    /**
     * The basename (filename) of the file.
     * @type {string}
     */
    this.filename = path.basename(filePath)
  }

  /**
   * @private
   */
  addFileInfos_ () {
    const stats = fs.statSync(this.absPath_)

    /**
     * The file size in bytes.
     * @type {number}
     */
    this.size = stats.size

    /**
     * The timestamp indicating the last time this file was modified
     * expressed in milliseconds since the POSIX Epoch.
     * @type {float}
     */
    this.timeModified = stats.mtimeMs

    /**
     * The extension of the file.
     * @type {string}
     */
    this.extension = getExtension(this.absPath_)

    /**
     * The basename (filename without extension) of the file.
     * @type {string}
     * @private
     */
    this.basename_ = path.basename(this.absPath_, `.${this.extension}`)

    return this
  }

  /**
   * Parse the info file of a media asset or the presenation file itself.
   *
   * Each media file can have a info file that stores additional
   * metadata informations.
   *
   * File path:
   * `/home/baldr/beethoven.jpg`
   *
   * Info file in the YAML file format:
   * `/home/baldr/beethoven.jpg.yml`
   *
   * @param {string} filePath - The path of the YAML file.
   *
   * @returns {object}
   *
   * @private
   */
  readYaml_ (filePath) {
    if (fs.existsSync(filePath)) {
      return yaml.safeLoad(fs.readFileSync(filePath, 'utf8'))
    }
    return {}
  }

  /**
   * Add metadata from the file system, like file size or timeModifed.
   */
  addFileInfos () {
    return this.addFileInfos_()
  }

  /**
   *
   */
  cleanTmpProperties () {
    for (const property in this) {
      if (property.match(/_$/)) {
        delete this[property]
      }
    }
    return this
  }

  /**
   * Merge an object into the class object. Property can be in the `snake_case`
   * or `kebab-case` form. They are converted in to `camelCase` in recursive fashin.
   *
   * @param {object} properties - Add an object to the class properties.
   */
  mergeObject (object) {
    if (typeof object === 'object') {
      convertPropertiesToCamelCase(object)
      for (const property in object) {
        this[property] = object[property]
      }
    }
  }

  /**
   * Prepare the object for the insert into the MongoDB database
   * Generate `id` and `title` if this properties are not present.
   */
  prepareForInsert () {
    this.addFileInfos()
    if (!this.id) this.id = asciify(this.basename_)
    if (!this.title) this.title = deasciify(this.id)
    this.cleanTmpProperties()
    return this
  }
}

/**
 * This class is used both for the entries in the MongoDB database as well for
 * the queries.
 */
class Asset extends MediaFile {
  /**
   * @param {string} filePath - The file path of the media file.
   */
  constructor (filePath) {
    super(filePath)

    /**
     * The absolute path of the info file in the YAML format. On the absolute
     * media file path `.yml` is appended.
     * @type {string}
     */
    this.infoFile_ = `${this.absPath_}.yml`

    const data = this.readYaml_(this.infoFile_)
    this.mergeObject(data)
  }

  addFileInfos () {
    this.addFileInfos_()
    const previewImage = `${this.absPath_}_preview.jpg`
    this.assetType = assetTypes.extensionToType(this.extension)
    if (fs.existsSync(previewImage)) {
      /**
       * The absolute path of the preview image.
       * @type {string}
       */
      this.previewImage = true
    }
    this.detectMultiparts_()
    return this
  }

  /**
   * Search for mutlipart assets. The naming scheme of multipart assets is:
   * `filename.jpg`, `filename_no02.jpg`, `filename_no03.jpg`
   */
  detectMultiparts_ () {
    const nextAssetFileName = (count) => {
      let suffix
      if (count < 10) {
        suffix = `_no0${count}`
      } else if (count < 100) {
        suffix = `_no${count}`
      } else {
        throw new Error(`${this.absPath_} multipart asset counts greater than 100 are not supported.`)
      }
      const basePath = this.absPath_.replace(`.${this.extension}`, '')
      const fileName = `${basePath}${suffix}.${this.extension}`
      return fileName
    }
    let count = 2
    while (fs.existsSync(nextAssetFileName(count))) {
      count += 1
    }
    count -= 1 // The counter is increased before the file system check.
    if (count > 1) {
      /**
       * The count of parts of a multipart asset.
       *
       * @type {Number}
       */
      this.multiPartCount = count
    }
  }
}

/**
 * The whole presentation YAML file converted to an Javascript object. All
 * properties are in `camelCase`.
 */
class Presentation extends MediaFile {
  constructor (filePath) {
    super(filePath)
    const data = this.readYaml_(filePath)
    if (data) this.mergeObject(data)

    const folderTitles = new HierarchicalFolderTitles(filePath)
    folderTitleTree.add(folderTitles)

    if (typeof this.meta === 'undefined') this.meta = {}
    for (const property of ['id', 'title', 'subtitle', 'curriculum', 'grade']) {
      if (typeof this.meta[property] === 'undefined') this.meta[property] = folderTitles[property]
    }

    /**
     * The plain text version of `this.meta.title`.
     *
     * @type {String}
     */
    this.title = stripTags(this.meta.title)

    /**
     * The plain text version of `this.meta.title (this.meta.subtitle)`
     *
     * @type {String}
     */
    this.titleSubtitle = this.titleSubtitle_()

  /**
   * The plain text version of `folderTitles.allTitles
   * (this.meta.subtitle)`
   *
   * For example:
   *
   * 6. Jahrgangsstufe / Lernbereich 2: Musik - Mensch - Zeit /
   * Johann Sebastian Bach: Musik als Bekenntnis /
   * Johann Sebastian Bachs Reise nach Berlin 1747 (Ricercar a 3)
   *
   * @returns {String}
   * @private
   */
    this.allTitlesSubtitle = this.allTitlesSubtitle_ (folderTitles)

    /**
     * Value is the same as `meta.id`
     *
     * @type {String}
     */
    this.id = this.meta.id
  }

  /**
   * Generate the plain text version of `this.meta.title (this.meta.subtitle)`
   *
   * @returns {String}
   * @private
   */
  titleSubtitle_ () {
    if (this.meta.subtitle) {
      return `${this.title} (${stripTags(this.meta.subtitle)})`
    } else {
      return this.title
    }
  }

  /**
   * Generate the plain text version of `folderTitles.allTitles
   * (this.meta.subtitle)`
   *
   * For example:
   *
   * 6. Jahrgangsstufe / Lernbereich 2: Musik - Mensch - Zeit /
   * Johann Sebastian Bach: Musik als Bekenntnis /
   * Johann Sebastian Bachs Reise nach Berlin 1747 (Ricercar a 3)
   *
   * @returns {String}
   * @private
   */
  allTitlesSubtitle_ (folderTitles) {
    let all = folderTitles.allTitles
    if (this.meta.subtitle) {
      all = `${all} (${this.meta.subtitle})`
    }
    return stripTags(all)
  }
}

/* Checks *********************************************************************/

/**
 * Check if the given file is a media asset.
 *
 * @param {String} fileName
 */
function isAsset (fileName) {
  if (
    fileName.indexOf('_preview.jpg') > -1 || // Preview image
    fileName.match(/_no\d\d\./) // Multipart asset
  ) {
    return false
  }
  return assetTypes.isAsset(fileName)
}

/**
 * Check if the given file is a presentation.
 *
 * @param {String} fileName
 */
function isPresentation (fileName) {
  if (fileName.indexOf('Praesentation.baldr.yml') > -1) {
    return true
  }
  return false
}

/* Insert *********************************************************************/

/**
 * @param {String} filePath
 */
async function insertObjectIntoDb (filePath, mediaType) {
  let object
  try {
    if (mediaType === 'presentations') {
      object = new Presentation(filePath)
    } else if (mediaType === 'assets') {
      object = new Asset(filePath)
    }
    object = object.prepareForInsert()
    console.log(object.path)
    await db.collection(mediaType).insertOne(object)
  } catch (error) {
    console.log(error)
    let relPath = filePath.replace(config.mediaServer.basePath, '')
    relPath = relPath.replace(new RegExp('^/'), '')
    const msg = `${relPath}: [${error.name}] ${error.message}`
    console.log(msg)
    errors.push(msg)
  }
}

/**
 * @param {string} dir
 * @param {object} on - An object with callbacks. Properties: `presentation`,
 *   `asset`, `all` (`presentation`, `asset`), `everyFile`.
 */
async function walk (dir, on) {
  const files = fs.readdirSync(dir)
  for (const fileName of files) {
    const relPath = path.join(dir, fileName)
    // Exclude .git/
    if (fs.existsSync(relPath) && fileName.substr(0, 4) !== '.git') {
      if (fs.statSync(relPath).isDirectory()) {
        await walk(relPath, on)
      } else {
        if ('everyFile' in on) await on.everyFile(relPath)
        if (isPresentation(fileName)) {
          if ('presentation' in on) await on.presentation(relPath)
          if ('all' in on) await on.all(relPath)
        } else if (isAsset(fileName)) {
          if ('asset' in on) await on.asset(relPath)
          if ('all' in on) await on.all(relPath)
        }
      }
    }
  }
}

/**
 * Update the media server.
 *
 * @returns {Object}
 */
async function update (full = false) {
  const gitSettings = {
    cwd: basePath,
    encoding: 'utf-8'
  }

  /**
   * Run git pull on the `basePath`
   */
  function gitPull () {
    console.log('Run git pull')
    const gitPull = childProcess.spawnSync(
      'git', ['pull'],
      gitSettings
    )
    console.log(`git pull stderr: ${gitPull.stderr.replace(/\n$/, '')}`)
    console.log(`git pull stdout: ${gitPull.stdout.replace(/\n$/, '')}`)
    if (gitPull.status !== 0) throw new Error(`git pull exits with an non-zero status code.`)
  }
  if (full) gitPull()
  const gitRevParse = childProcess.spawnSync('git', ['rev-parse', 'HEAD'], gitSettings)
  const lastCommitId = gitRevParse.stdout.replace(/\n$/, '')
  console.log(`lastCommitId: ${lastCommitId}`)
  await connectDb()
  await initializeDb()
  await flushMediaFiles()
  const begin = new Date().getTime()
  await db.collection('updates').insertOne({ begin: begin, end: 0 })
  await walk(basePath, {
    everyFile: (filePath) => {
      if (filePath.match(/\.(aux|out|log|synctex\.gz|mscx,)$/)) {
        console.log(`Delete temporary file ${filePath}`)
        fs.unlinkSync(filePath)
      }
    },
    presentation: async (filePath) => { await insertObjectIntoDb(filePath, 'presentations') },
    asset: async (filePath) => { await insertObjectIntoDb(filePath, 'assets') }
  })

  // .replaceOne and upsert: Problems with merge objects?
  await db.collection('folderTitleTree').deleteOne({ id: 'root' })
  await db.collection('folderTitleTree').insertOne(
    {
      id: 'root',
      tree: folderTitleTree.get()
    }
  )
  const end = new Date().getTime()
  await db.collection('updates').updateOne({ begin: begin }, { $set: { end: end, lastCommitId } })
  return {
    finished: true,
    begin,
    end,
    duration: end - begin,
    lastCommitId,
    errors
  }
}

/* MongoDb Management *********************************************************/

/**
 * @returns {Promise}
 */
async function initializeDb () {
  const assets = await db.createCollection('assets')
  await assets.createIndex({ path: 1 }, { unique: true })
  await assets.createIndex({ id: 1 }, { unique: true })

  const presentations = await db.createCollection('presentations')
  await presentations.createIndex({ id: 1 }, { unique: true })

  const updates = await db.createCollection('updates')
  await updates.createIndex({ begin: 1 })

  // https://stackoverflow.com/a/35868933
  const folderTitleTree = await db.createCollection('folderTitleTree')
  await folderTitleTree.createIndex({ id: 1 }, { unique: true })

  const result = {}
  const collections = await db.listCollections().toArray()
  for (const collection of collections) {
    const indexes = await db.collection(collection.name).listIndexes().toArray()
    result[collection.name] = {
      name: collection.name,
      indexes: {}
    }
    for (const index of indexes) {
      result[collection.name].indexes[index.name] = index.unique
    }
  }
  return result
}

/**
 * @returns {Promise}
 */
async function dropDb () {
  const collections = await db.listCollections().toArray()
  const droppedCollections = []
  for (const collection of collections) {
    await db.dropCollection(collection.name)
    droppedCollections.push(collection.name)
  }
  return {
    droppedCollections
  }
}

/**
 * @returns {Promise}
 */
async function reInitializeDb () {
  const resultdropDb = await dropDb()
  const resultInitializeDb = await initializeDb()
  return {
    resultdropDb,
    resultInitializeDb
  }
}

/**
 * @returns {Promise}
 */
async function flushMediaFiles () {
  await db.collection('assets').deleteMany({})
  await db.collection('presentations').deleteMany({})
}

/* Express Rest API ***********************************************************/

/**
 * This object hold jsons for displaying help messages in the browser on
 * some entry point urls.
 *
 * Update docs on the top of this file in the JSDoc block.
 *
 * @type {Object}
 */
const helpMessages = {
  navigation: {
    get: {
      'folder-title-tree': 'Get the folder title tree as a hierarchical json object.'
    },
    mgmt: {
      flush: 'Delete all media files (assets, presentations) from the database.',
      init: 'Initialize the MongoDB database.',
      open: {
        '#description': 'Open a media file specified by an ID.',
        '#examples': [
          'mgmt/open?id=Beethoven_Egmont',
          'mgmt/open?with=editor&id=Beethoven_Egmont',
          'mgmt/open?with=editor&type=presentations&id=Beethoven_Egmont',
          'mgmt/open?with=editor&type=assets&id=Beethoven',
          'mgmt/open?with=folder&type=assets&id=Beethoven'
        ],
        '#parameters': {
          id: 'The ID of the media file (required).',
          type: '`presentations`, `assets`. The default value is `presentations.`',
          with: '`editor` specified in `config.mediaServer.editor` (`/etc/baldr.json`) or `folder` to open the parent folder of the given media file. The default value is `editor`.'
        }
      },
      're-init': 'Re-Initialize the MongoDB database (Drop all collections and initialize).',
      update: 'Update the media server database (Flush and insert).'
    },
    query: {
      '#description': 'Get results by using query parameters',
      '#examples': [
        'query?type=assets&field=id&method=exactMatch&search=Egmont-Ouverture',
        'query?type=presentations&field=id&method=exactMatch&search=Beethoven_Marmotte',
        'query?type=assets&field=path&method=substringSearch&search=35_Bilder-Ausstellung_Ueberblick&result=fullObjects',
        'query?type=assets&field=path&method=substringSearch&search=35_Bilder-Ausstellung_Ueberblick&result=dynamicSelect'
      ],
      '#parameters': {
        type: '`assets` (default), `presentations` (what)',
        method: '`exactMatch`, `substringSearch` (default) (how). `exactMatch`: The query parameter `search` must be a perfect match to a top level database field to get a result. `substringSearch`: The query parameter `search` is only a substring of the string to search in.',
        field: '`id` (default), `title`, etc ... (where).',
        search: 'Some text to search for (search for).',
        result: '`fullObjects` (default), `dynamicSelect`'
      }
    },
    stats: {
      count: 'Count / sum of the media files (assets, presentations) in the database.',
      updates: 'Journal of the update processes with timestamps.'
    }
  }
}

/**
 * Throw an error if the media type is unkown. Provide a default value.
 *
 * @param {String} mediaType - At the moment `assets` and `presentation`
 *
 * @return {String}
 */
function validateMediaType (mediaType) {
  const mediaTypes = ['assets', 'presentations']
  if (!mediaType) return 'assets'
  if (!mediaTypes.includes(mediaType)) {
    throw new Error(`Unkown media type “${mediaType}”! Allowed media types are: ${mediaTypes}`)
  } else {
    return mediaType
  }
}

/**
 * Resolve a ID from a given media type (`assets`, `presentations`) to a
 * absolute path.
 *
 * @param {String} id - The id of the media type.
 * @param {String} mediaType - At the moment `assets` and `presentation`
 *
 * @return {String}
 */
async function getAbsPathFromId (id, mediaType = 'presentations') {
  mediaType = validateMediaType(mediaType)
  const result = await db.collection(mediaType).find({ id: id }).next()
  if (!result) throw new Error(`Can not find media file with the type “${mediaType}” and the id “${id}”.`)
  let relPath
  if (mediaType === 'assets') {
    relPath = `${result.path}.yml`
  } else {
    relPath = result.path
  }
  return path.join(config.mediaServer.basePath, relPath)
}

/**
 * Open a media file specified by an ID with an editor specified in
 *   `config.mediaServer.editor` (`/etc/baldr.json`).
 *
 * @param {String} id - The id of the media type.
 * @param {String} mediaType - At the moment `assets` and `presentation`
 *
 * @return {Object}
 */
async function openEditor (id, mediaType) {
  const absPath = await getAbsPathFromId(id, mediaType)
  const editor = config.mediaServer.editor
  if (!fs.existsSync(editor)) {
    return {
      error: `Editor “${editor}” can’t be found.`
    }
  }
  childProcess.spawn(editor, [absPath], {
    env: {
      // Not needed
      //XAUTHORITY: '/run/user/1000/gdm/Xauthority',
      DISPLAY: ':0'
    }
  })
  return {
    absPath,
    editor
  }
}

/**
 * Open the parent folder of a presentation, a media asset in a file explorer
 * GUI application.
 *
 * @param {String} id - The id of the media type.
 * @param {String} mediaType - At the moment `assets` and `presentation`
 *
 * @return {Object}
 */
async function openParentFolder (id, mediaType) {
  const absPath = await getAbsPathFromId(id, mediaType)
  const parentFolder = path.dirname(absPath)
  childProcess.spawn('xdg-open', [parentFolder], {
    env: {
      // Not needed
      //XAUTHORITY: '/run/user/1000/gdm/Xauthority',
      DISPLAY: ':0'
    }
  })
  return {
    parentFolder
  }
}

/**
 * Register the express js rest api in a giant function.
 */
function registerRestApi () {
  // https://stackoverflow.com/a/38427476/10193818
  function escapeRegex (text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
  }

  const app = express()

  app.on('mount', async () => {
    await connectDb()
    await initializeDb()
  })

  app.get('/', (req, res) => {
    res.json(helpMessages.navigation)
  })

  app.get('/version', (req, res) => {
    res.json({
      name: packageJson.name,
      version: packageJson.version
    })
  })

  /* query */

  app.get('/query', async (req, res, next) => {
    try {
      const query = req.query
      if (Object.keys(query).length === 0) {
        res.status(500).send({
          error: {
            msg: 'Missing query parameters!',
            navigationGuide: helpMessages.navigation.query
          }
        })
        return
      }
      // type
      query.type = validateMediaType(query.type)

      // method
      const methods = ['exactMatch', 'substringSearch']
      if (!('method' in query)) query.method = 'substringSearch'
      if (!methods.includes(query.method)) {
        throw new Error(`Unkown method “${query.method}”! Allowed methods: ${methods}`)
      }

      // field
      if (!('field' in query)) query.field = 'id'

      // result
      if (!('result' in query)) query.result = 'fullObjects'

      await connectDb()
      const collection = db.collection(query.type)

      // find
      let result
      let find
      // exactMatch
      if (query.method === 'exactMatch') {
        const findObject = {}
        findObject[query.field] = query.search
        find = collection.find(findObject, { projection: { _id: 0 } })
        result = await find.next()
      // substringSearch
      } else if (query.method === 'substringSearch') {
        // https://stackoverflow.com/a/38427476/10193818
        const regex = new RegExp(escapeRegex(query.search), 'gi')
        const $match = {}
        $match[query.field] = regex
        let $project
        if (query.result === 'fullObjects') {
          $project = {
            _id: false
          }
        } else if (query.result === 'dynamicSelect') {
          $project = {
            _id: false,
            id: true,
            name: `$${query.field}`
          }
        }
        find = collection.aggregate([{ $match }, { $project }])
        result = await find.toArray()
      }
      res.json(result)
    } catch (error) {
      next(error)
    }
  })

  /* get */

  app.get('/get/folder-title-tree', async (req, res, next) => {
    try {
      const result = await db.collection('folderTitleTree').find({ id: 'root' }, { projection: { _id: 0 } }).next()
      res.json(result.tree)
    } catch (error) {
      next(error)
    }
  })

  /* mgmt = management */

  app.get('/mgmt/flush', async (req, res, next) => {
    try {
      await flushMediaFiles()
      res.json({ status: 'ok' })
    } catch (error) {
      next(error)
    }
  })

  app.get('/mgmt/init', async (req, res, next) => {
    try {
      res.json(await initializeDb())
    } catch (error) {
      next(error)
    }
  })

  app.get('/mgmt/open', async (req, res, next) => {
    try {
      const query = req.query
      if (!query.id) throw new Error('You have to specify an ID (?id=myfile).')
      if (!query.with) query.with = 'editor'
      if (!query.type) query.type = 'presentations'
      if (query.with === 'editor') {
        res.json(await openEditor(query.id, query.type))
      } else if (query.with === 'folder') {
        res.json(await openParentFolder(query.id, query.type))
      }
    } catch (error) {
      next(error)
    }
  })

  app.get('/mgmt/re-init', async (req, res, next) => {
    try {
      res.json(await reInitializeDb())
    } catch (error) {
      next(error)
    }
  })

  app.get('/mgmt/update', async (req, res, next) => {
    try {
      res.json(await update())
      // Clear error message store.
      errors = []
    } catch (error) {
      next(error)
    }
  })

  /* stats = statistics */

  app.get('/stats/count', async (req, res, next) => {
    try {
      res.json({
        assets: await db.collection('assets').countDocuments(),
        presentations: await db.collection('presentations').countDocuments()
      })
    } catch (error) {
      next(error)
    }
  })

  app.get('/stats/updates', async (req, res, next) => {
    try {
      res.json(await db.collection('updates')
        .find({}, { projection: { _id: 0 } })
        .sort({ begin: -1 })
        .limit(20)
        .toArray()
      )
    } catch (error) {
      next(error)
    }
  })

  return app
}

module.exports = {
  asciify,
  Asset,
  assetTypes,
  deasciify,
  FolderTitleTree,
  getExtension,
  helpMessages,
  HierarchicalFolderTitles,
  registerRestApi,
  walk
}
