#! /usr/bin/env node

/**
 * The REST API and command line interface of the BALDR media server.
 *
 * # Media types:
 *
 * - presentation (`Presentation()`)
 * - asset (`Asset()`)
 *   - multipart asset (`filename.jpg`, `filename_no002.jpg`, `filename_no003.jpg`)
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
 *       - `archive`: True if present, false by default. Open the file or the
           folder in the corresponding archive folder structure.
 *       - `create`: True if present, false by default. Create the possibly none
            existing directory structure in a recursive manner.
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
 * @module @bldr/media-server
 */

// Node packages.
const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')
const os = require('os')

// Third party packages.
const cors = require('cors')
const express = require('express')
const yaml = require('js-yaml')

// Project packages.
const config = require('@bldr/config')
const { MediaCategoriesManager, convertPropertiesSnakeToCamel } = require('@bldr/core-browser')

const registerSeatingPlan = require('./seating-plan.js').registerRestApi

// Submodules.
const { Database } = require('./database.js')
const { walk, asciify, deasciify, metaTypes, TitleTree, DeepTitle, locationIndicator } = require('@bldr/media-manager')

const packageJson = require('../package.json')

/**
 * Base path of the media server file store.
 */
const basePath = config.mediaServer.basePath

/**
 * A container array for all error messages send out via the REST API.
 */
let errors = []

/**
 * @type {module:@bldr/media-server/database.Database}
 */
let database

/* Helper functions ***********************************************************/

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
  return text.replace(/<[^>]+>/g, '')
}

/* Media objects **************************************************************/

const folderTitleTree = new TitleTree()

const mediaCategoriesManager = new MediaCategoriesManager(config)

/**
 * Base class to be extended.
 */
class MediaFile {
  constructor (filePath) {
    /**
     * Absolute path ot the file.
     * @type {string}
     * @access protected
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
   * @access protected
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
     * @type {Number}
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
   * @access protected
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
   * Delete the temporary properties of the object. Temporary properties end
   * with `_`.
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
   * Merge an object into the class object. Properties can be in the
   * `snake_case` or `kebab-case` form. They are converted into `camelCase` in a
   * recursive fashion.
   *
   * @param {object} properties - Add an object to the class properties.
   */
  importProperties (properties) {
    if (typeof properties === 'object') {
      properties = convertPropertiesSnakeToCamel(properties)
      for (const property in properties) {
        this[property] = properties[property]
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
    this.importProperties(data)
    /**
     * Indicates if the asset has a preview image.
     * @type {Boolean}
     */
    this.previewImage = false
  }

  /**
   *
   */
  addFileInfos () {
    this.addFileInfos_()
    const previewImage = `${this.absPath_}_preview.jpg`
    this.assetType = mediaCategoriesManager.extensionToType(this.extension)
    if (fs.existsSync(previewImage)) {
      this.previewImage = true
    }
    this.detectMultiparts_()
    return this
  }

  /**
   * Search for mutlipart assets. The naming scheme of multipart assets is:
   * `filename.jpg`, `filename_no002.jpg`, `filename_no003.jpg`
   */
  detectMultiparts_ () {
    const nextAssetFileName = (count) => {
      let suffix
      if (count < 10) {
        suffix = `_no00${count}`
      } else if (count < 100) {
        suffix = `_no0${count}`
      } else if (count < 1000) {
        suffix = `_no${count}`
      } else {
        throw new Error(`${this.absPath_} multipart asset counts greater than 100 are not supported.`)
      }
      const basePath = this.absPath_.replace(`.${this.extension}`, '')
      const fileName = `${basePath}${suffix}.${this.extension}`
      return fileName
    }

    /**
     * For old two digit numbering
     *
     * @todo remove
     * @param {Number} count
     */
    const nextAssetFileNameOld = (count) => {
      let suffix
      if (count < 10) {
        suffix = `_no0${count}`
      } else if (count < 100) {
        suffix = `_no${count}`
      }
      const basePath = this.absPath_.replace(`.${this.extension}`, '')
      const fileName = `${basePath}${suffix}.${this.extension}`
      return fileName
    }
    let count = 2
    while (fs.existsSync(nextAssetFileName(count)) || fs.existsSync(nextAssetFileNameOld(count))) {
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
    if (data) this.importProperties(data)

    const folderTitles = new DeepTitle(filePath)
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
    this.allTitlesSubtitle = this.allTitlesSubtitle_(folderTitles)

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

/* Insert *********************************************************************/

/**
 * @param {String} filePath
 * @param {String} mediaType
 */
async function insertObjectIntoDb (filePath, mediaType) {
  let object
  try {
    if (mediaType === 'presentations') {
      object = new Presentation(filePath)
    } else if (mediaType === 'assets') {
      // Now only with meta data yml. Fix problems with PDF lying around.
      if (!fs.existsSync(`${filePath}.yml`)) return
      object = new Asset(filePath)
    }
    object = object.prepareForInsert()
    await database.db.collection(mediaType).insertOne(object)
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
 * Run git pull on the `basePath`
 */
function gitPull () {
  const gitPull = childProcess.spawnSync(
    'git', ['pull'],
    {
      cwd: basePath,
      encoding: 'utf-8'
    }
  )
  if (gitPull.status !== 0) throw new Error(`git pull exits with an non-zero status code.`)
}

/**
 * Update the media server.
 *
 * @param {Boolean} full - Update with git pull.
 *
 * @returns {Promise.<Object>}
 */
async function update (full = false) {
  if (full) gitPull()
  const gitRevParse = childProcess.spawnSync('git', ['rev-parse', 'HEAD'], {
    cwd: basePath,
    encoding: 'utf-8'
  })
  const lastCommitId = gitRevParse.stdout.replace(/\n$/, '')
  await database.connect()
  await database.initialize()
  await database.flushMediaFiles()
  const begin = new Date().getTime()
  await database.db.collection('updates').insertOne({ begin: begin, end: 0 })
  await walk({
    everyFile: (filePath) => {
      // Delete temporary files.
      if (
        filePath.match(/\.(aux|out|log|synctex\.gz|mscx,)$/) ||
        filePath.indexOf('Praesentation_tmp.baldr.yml') > -1 ||
        filePath.indexOf('title_tmp.txt') > -1
      ) {
        fs.unlinkSync(filePath)
      }
    },
    directory: (filePath) => {
      // Delete empty directories.
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        const files = fs.readdirSync(filePath)
        if (files.length === 0) {
          fs.rmdirSync(filePath)
        }
      }
    },
    presentation: async (filePath) => { await insertObjectIntoDb(filePath, 'presentations') },
    asset: async (filePath) => { await insertObjectIntoDb(filePath, 'assets') }
  },
  {
    path: basePath
  })

  // .replaceOne and upsert: Problems with merge objects?
  await database.db.collection('folderTitleTree').deleteOne({ id: 'root' })
  await database.db.collection('folderTitleTree').insertOne(
    {
      id: 'root',
      tree: folderTitleTree.get()
    }
  )
  const end = new Date().getTime()
  await database.db.collection('updates').updateOne({ begin: begin }, { $set: { end: end, lastCommitId } })
  return {
    finished: true,
    begin,
    end,
    duration: end - begin,
    lastCommitId,
    errors
  }
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
          '/media/mgmt/open?id=Egmont',
          '/media/mgmt/open?with=editor&id=Egmont',
          '/media/mgmt/open?with=editor&type=presentations&id=Egmont',
          '/media/mgmt/open?with=folder&type=presentations&id=Egmont&archive=true',
          '/media/mgmt/open?with=folder&type=presentations&id=Egmont&archive=true&create=true',
          '/media/mgmt/open?with=editor&type=assets&id=Beethoven_Ludwig-van',
          '/media/mgmt/open?with=folder&type=assets&id=Beethoven_Ludwig-van'
        ],
        '#parameters': {
          id: 'The ID of the media file (required).',
          type: '`presentations`, `assets`. The default value is `presentations.`',
          with: '`editor` specified in `config.mediaServer.editor` (`/etc/baldr.json`) or `folder` to open the parent folder of the given media file. The default value is `editor`.',
          archive: 'True if present, false by default. Open the file or the folder in the corresponding archive folder structure.',
          create: 'True if present, false by default. Create the possibly non existing directory structure in a recursive manner.'
        }
      },
      're-init': 'Re-Initialize the MongoDB database (Drop all collections and initialize).',
      update: 'Update the media server database (Flush and insert).'
    },
    query: {
      '#description': 'Get results by using query parameters',
      '#examples': [
        '/media/query?type=assets&field=id&method=exactMatch&search=Egmont-Ouverture',
        '/media/query?type=assets&field=uuid&method=exactMatch&search=c64047d2-983d-4009-a35f-02c95534cb53',
        '/media/query?type=presentations&field=id&method=exactMatch&search=Beethoven_Marmotte',
        '/media/query?type=assets&field=path&method=substringSearch&search=35_Bilder-Ausstellung_Ueberblick&result=fullObjects',
        '/media/query?type=assets&field=path&method=substringSearch&search=35_Bilder-Ausstellung_Ueberblick&result=dynamicSelect'
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
 * @return {Promise.<String>}
 */
async function getAbsPathFromId (id, mediaType = 'presentations') {
  mediaType = validateMediaType(mediaType)
  const result = await database.db.collection(mediaType).find({ id: id }).next()
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
 *
 * @param {String} filePath
 *
 * @see {@link https://stackoverflow.com/a/36221905/10193818}
 */
function untildify (filePath) {
  if (filePath[0] === '~') {
    return path.join(os.homedir(), filePath.slice(1))
  }
  return filePath
}

/**
 * Open a file path using the linux command `xdg-open`.
 *
 * @param {String} currentPath
 * @param {Boolean} create - Create the directory structure of
 *   the given `currentPath` in a recursive manner.
 */
function openFolder (currentPath, create) {
  const result = {}
  if (create && !fs.existsSync(currentPath)) {
    fs.mkdirSync(currentPath, { recursive: true })
    result.create = true
  }
  if (fs.existsSync(currentPath)) {
    // xdg-open opens a mounted root folder in vs code.
    openWith(config.mediaServer.fileManager, currentPath)
    result.open = true
  }
  return result
}

/**
 * Open the current path multiple times.
 *
 * 1. In the main media server directory
 * 2. In a archive directory structure.
 * 3. In a second archive directory structure ... and so on.
 *
 * @param {String} currentPath
 * @param {Boolean} create - Create the directory structure of
 *   the given `currentPath` in a recursive manner.
 */
function openFolderWithArchives (currentPath, create) {
  const result = {}
  const relPath = locationIndicator.getRelPath(currentPath)
  for (const basePath of locationIndicator.get()) {
    if (relPath) {
      const currentPath = path.join(basePath, relPath)
      result[currentPath] = openFolder(currentPath, create)
    } else {
      result[basePath] = openFolder(basePath, create)
    }
  }
  return result
}

/**
 * Mirror the folder structure of the media folder into the archive folder or
 * vice versa. Only folders with two prefixed numbers followed by an
 * underscore (for example “10_”) are mirrored.
 *
 * @param {String} currentPath - Must be a relative path within one of the
 *   folder structures.
 *
 * @returns {Object} - Status informations of the action.
 */
function mirrorFolderStructure (currentPath) {
  function walkSync (dir, filelist) {
    const files = fs.readdirSync(dir)
    filelist = filelist || []
    files.forEach(function (file) {
      const filePath = path.join(dir, file)
      if (fs.statSync(filePath).isDirectory() && file.match(/^\d\d_/)) {
        filelist.push(filePath)
        walkSync(filePath, filelist)
      }
    })
    return filelist
  }

  const currentBasePath = locationIndicator.getBasePath(currentPath)

  let mirrorBasePath
  for (const basePath of locationIndicator.get()) {
    if (basePath !== currentBasePath) {
      mirrorBasePath = basePath
      break
    }
  }

  const relPaths = walkSync(currentPath)
  for (let index = 0; index < relPaths.length; index++) {
    relPaths[index] = locationIndicator.getRelPath(relPaths[index])
  }

  const created = []
  const existing = []
  for (const relPath of relPaths) {
    const newPath = path.join(mirrorBasePath, relPath)
    if (!fs.existsSync(newPath)) {
      try {
        fs.mkdirSync(newPath, { recursive: true })
      } catch (error) {
        return {
          error
        }
      }
      created.push(relPath)
    } else {
      existing.push(relPath)
    }
  }
  return {
    ok: {
      currentBasePath,
      mirrorBasePath,
      created,
      existing
    }
  }
}

/**
 * Open a file path with an executable.
 *
 * To launch apps via the REST API the systemd unit file must run as
 * the user you login in in your desktop environment. You also have to set
 * to environment variables: `DISPLAY=:0` and
 * `DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/$UID/bus`
 *
 * ```
 * Environment=DISPLAY=:0
 * Environment=DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus
 * User=1000
 * Group=1000
 * ```
 *
 * @param {String} executable - Name or path of an executable.
 * @param {String} filePath - The path of a file or a folder.
 *
 * @see node module on npmjs.org “open”
 * @see {@link https://unix.stackexchange.com/a/537848}
 */
function openWith (executable, filePath) {
  // See node module on npmjs.org “open”
  const subprocess = childProcess.spawn(executable, [filePath], {
    stdio: 'ignore',
    detached: true
  })
  subprocess.unref()
}

/**
 * Open a media file specified by an ID with an editor specified in
 *   `config.mediaServer.editor` (`/etc/baldr.json`).
 *
 * @param {String} id - The id of the media type.
 * @param {String} mediaType - At the moment `assets` and `presentation`
 */
async function openEditor (id, mediaType) {
  const absPath = await getAbsPathFromId(id, mediaType)
  const parentFolder = path.dirname(absPath)
  const editor = config.mediaServer.editor
  if (!fs.existsSync(editor)) {
    return {
      error: `Editor “${editor}” can’t be found.`
    }
  }
  openWith(config.mediaServer.editor, parentFolder)
  return {
    id,
    mediaType,
    absPath,
    parentFolder,
    editor
  }
}

/**
 * Open the parent folder of a presentation, a media asset in a file explorer
 * GUI application.
 *
 * @param {String} id - The id of the media type.
 * @param {String} mediaType - At the moment `assets` and `presentation`
 * @param {Boolean} archive - Addtionaly open the corresponding archive
 *   folder.
 * @param {Boolean} create - Create the directory structure of
 *   the relative path in the archive in a recursive manner.
 */
async function openParentFolder (id, mediaType, archive, create) {
  const absPath = await getAbsPathFromId(id, mediaType)
  const parentFolder = path.dirname(absPath)

  let result
  if (archive) {
    result = openFolderWithArchives(parentFolder, create)
  } else {
    result = openFolder(parentFolder, create)
  }
  return {
    id,
    parentFolder,
    mediaType,
    archive,
    create,
    result
  }
}

/**
 * Register the express js rest api in a giant function.
 */
function registerMediaRestApi () {
  const db = database.db
  // https://stackoverflow.com/a/38427476/10193818
  function escapeRegex (text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
  }

  const app = express()

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
      query.type = validateMediaType(query.type.toString())

      // method
      const methods = ['exactMatch', 'substringSearch']
      if (!('method' in query)) query.method = 'substringSearch'
      if (!methods.includes(query.method.toString())) {
        throw new Error(`Unkown method “${query.method}”! Allowed methods: ${methods}`)
      }

      // field
      if (!('field' in query)) query.field = 'id'

      // result
      if (!('result' in query)) query.result = 'fullObjects'

      await database.connect()
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
      res.json(await database.flushMediaFiles())
    } catch (error) {
      next(error)
    }
  })

  app.get('/mgmt/init', async (req, res, next) => {
    try {
      res.json(await database.initialize())
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
      const archive = ('archive' in query)
      const create = ('create' in query)
      if (query.with === 'editor') {
        res.json(await openEditor(query.id.toString(), query.type.toString()))
      } else if (query.with === 'folder') {
        res.json(await openParentFolder(query.id.toString(), query.type.toString(), archive, create))
      }
    } catch (error) {
      next(error)
    }
  })

  app.get('/mgmt/re-init', async (req, res, next) => {
    try {
      res.json(await database.reInitialize())
    } catch (error) {
      next(error)
    }
  })

  app.get('/mgmt/update', async (req, res, next) => {
    try {
      res.json(await update(false))
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

/**
 * Run the REST API. Listen to a TCP port.
 *
 * @param {Number} port - A TCP port.
 */
async function runRestApi (port) {
  const app = express()

  database = new Database()
  await database.connect()
  await database.initialize()

  app.use(cors())
  app.use(express.json())

  app.use('/seating-plan', registerSeatingPlan(database))
  app.use('/media', registerMediaRestApi())

  const helpMessages = {
    version: {
      name: packageJson.name,
      version: packageJson.version
    }
  }

  app.get('/', (req, res) => {
    res.json({
      version: packageJson.version,
      navigation: {
        media: helpMessages.navigation
      }
    })
  })

  app.get('/version', (req, res) => {
    res.json(helpMessages.version)
  })

  if (!port) {
    port = config.api.port
  }
  app.listen(port, () => {
    console.log(`The BALDR REST API is running on port ${port}.`)
  })
  return app
}

const main = function () {
  let port
  if (process.argv.length === 3) port = parseInt(process.argv[2])
  return runRestApi(port)
}

// @ts-ignore
if (require.main === module) {
  main()
}

module.exports = {
  asciify,
  Asset,
  mediaCategoriesManager,
  deasciify,
  TitleTree,
  getExtension,
  helpMessages,
  DeepTitle,
  metaTypes,
  mirrorFolderStructure,
  openFolderWithArchives,
  openWith,
  registerMediaRestApi,
  runRestApi
}
