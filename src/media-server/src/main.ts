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
import childProcess from 'child_process'
import fs from 'fs'
import path from 'path'

// Third party packages.
import cors from 'cors'
import express, { json } from 'express'
import yaml from 'js-yaml'

// Project packages.
import config from '@bldr/config'
import { MediaCategoriesManager, convertPropertiesSnakeToCamel, getExtension, stripTags, deepCopy } from '@bldr/core-browser'
import { walk, asciify, deasciify, TitleTree, DeepTitle } from '@bldr/media-manager'
import type { StringIndexedObject } from '@bldr/type-definitions'

// Submodules.
import { connectDb, Database } from './database.js'
import { registerSeatingPlan } from './seating-plan'
import { openParentFolder, openEditor, validateMediaType } from './operations'

/**
 * Base path of the media server file store.
 */
const basePath = config.mediaServer.basePath

/**
 * A container array for all error messages send out via the REST API.
 */
let errors: string[] = []

/**
 * @type {module:@bldr/media-server/database.Database}
 */
export let database: Database

/* Media objects **************************************************************/

const titleTree = new TitleTree(new DeepTitle(config.mediaServer.basePath))

const mediaCategoriesManager = new MediaCategoriesManager(config)

/**
 * Base class to be extended.
 */
class MediaFile {
  absPath_: string
  path: string
  filename: string
  size?: number
  timeModified?: number
  extension?: string
  basename_?: string
  id?: string
  title?: string
  [key: string]: any
  constructor (filePath: string) {
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
  readYaml_ (filePath: string): StringIndexedObject {
    if (fs.existsSync(filePath)) {
      return <StringIndexedObject> yaml.safeLoad(fs.readFileSync(filePath, 'utf8'))
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
  importProperties (properties: StringIndexedObject) {
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
    if (!this.id && this.basename_) this.id = asciify(this.basename_)
    if (!this.title && this.id) this.title = deasciify(this.id)
    this.cleanTmpProperties()
    return this
  }
}

/**
 * This class is used both for the entries in the MongoDB database as well for
 * the queries.
 */
class Asset extends MediaFile {
  infoFile_: string
  previewImage: boolean
  assetType?: string
  multiPartCount?: number
  /**
   * @param {string} filePath - The file path of the media file.
   */
  constructor (filePath: string) {
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
    if (this.extension) {
      this.assetType = mediaCategoriesManager.extensionToType(this.extension)
    }
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
    const nextAssetFileName = (count: number) => {
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
    const nextAssetFileNameOld = (count: number) => {
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
  meta?: StringIndexedObject
  title: string
  titleSubtitle: string
  allTitlesSubtitle: string
  id: string
  constructor (filePath: string) {
    super(filePath)
    const data = this.readYaml_(filePath)
    if (data) this.importProperties(data)

    const deepTitle = new DeepTitle(filePath)
    titleTree.add(deepTitle)
    const deepTitleTmp: StringIndexedObject = deepTitle

    if (!this.meta) this.meta = {}
    for (const property of ['id', 'title', 'subtitle', 'curriculum', 'grade']) {
      if (typeof this.meta[property] === 'undefined') this.meta[property] = deepTitleTmp[property]
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
    this.allTitlesSubtitle = this.allTitlesSubtitle_(deepTitle)

    /**
     * Value is the same as `meta.id`
     *
     * @type {String}
     */
    this.id = this.meta.id
  }

  /**
   * Generate the plain text version of `this.meta.title (this.meta.subtitle)`
   */
  private titleSubtitle_ (): string {
    if (this.meta && this.meta.subtitle) {
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
   */
  private allTitlesSubtitle_ (folderTitles: DeepTitle): string {
    let all = folderTitles.allTitles
    if (this.meta && this.meta.subtitle) {
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
async function insertObjectIntoDb (filePath: string, mediaType: string): Promise<void> {
  let object: Presentation | Asset | undefined = undefined
  try {
    if (mediaType === 'presentations') {
      object = new Presentation(filePath)
    } else if (mediaType === 'assets') {
      // Now only with meta data yml. Fix problems with PDF lying around.
      if (!fs.existsSync(`${filePath}.yml`)) return
      object = new Asset(filePath)
    }
    if (!object) return
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
async function update (full: boolean = false): Promise<StringIndexedObject> {
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

  // .replaceOne and upsert: Problems with merged objects?
  await database.db.collection('folderTitleTree').deleteOne({ id: 'root' })
  // We use toJSON to get value from the getter functions.
  const tree = deepCopy(titleTree.get())
  await database.db.collection('folderTitleTree').insertOne({
    id: 'root', // To avoid duplicate trees.
    tree: titleTree.get()
  })
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
const helpMessages: StringIndexedObject = {
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
 * Register the express js rest api in a giant function.
 */
function registerMediaRestApi () {
  const db = database.db
  // https://stackoverflow.com/a/38427476/10193818
  function escapeRegex (text: string): string {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
  }

  const app = express()

  app.get('/', (req, res) => {
    res.json(helpMessages.navigation)
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
      const type: string  = validateMediaType(query.type ? query.type.toString() : '')

      // method
      const methods = ['exactMatch', 'substringSearch']
      const method: string = query.method ? query.method.toString() : 'substringSearch'
      if (!methods.includes(method)) {
        throw new Error(`Unkown method “${method}”! Allowed methods: ${methods}`)
      }

      // field
      const field: string = !query.field ? 'id' : <string> query.field

      // result
      if (!('result' in query)) query.result = 'fullObjects'

      await database.connect()
      const collection = db.collection(type)

      // find
      let result
      let find
      // exactMatch
      if (query.method === 'exactMatch') {
        const findObject: StringIndexedObject = {}
        findObject[field] = query.search
        find = collection.find(findObject, { projection: { _id: 0 } })
        result = await find.next()
      // substringSearch
      } else if (query.method === 'substringSearch') {
        // https://stackoverflow.com/a/38427476/10193818
        const search = query.search ? query.search.toString() : ''
        const regex = new RegExp(escapeRegex(search), 'gi')
        const $match: StringIndexedObject = {}
        $match[field] = regex
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
 * @param port - A TCP port.
 */
async function runRestApi (port?: number) {
  const app = express()

  const db = await connectDb()
  database = new Database(db)
  await database.initialize()

  app.use(cors())
  app.use(express.json())

  app.use('/seating-plan', registerSeatingPlan(database))
  app.use('/media', registerMediaRestApi())

  const helpMessages: StringIndexedObject = {}

  app.get('/', (req, res) => {
    res.json({
      navigation: {
        media: helpMessages.navigation
      }
    })
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
