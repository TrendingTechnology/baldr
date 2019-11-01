/**
 * The REST API and command line interface of the BALDR media server.
 *
 * # Media types:
 *
 * - presentation (`Presentation()`)
 * - asset (`Asset()`)
 *   - multipart asset
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
 *
 * - `mgmt`
 *   - `flush`: Delete all media files (assets, presentations) from the database.
 *   - `init`: Initialize the MongoDB database
 *   - `re-init`: Re-Initialize the MongoDB database (Drop all collections and
 *     initialize)
 *   - `update`: Update the media server database (Flush and insert).
 *   - `query`: Getting results by using query parameters. This query parameters
 *     are available:
 *      - `type`: `assets` (default), `presentations` (what)
 *      - `method`: `exactMatch`, `substringSearch` (default).
 *          - `exactMatch`: The query parameter `search` must be a perfect match
 *            to a top level database field to get a result.
 *          - `substringSearch`: The query parameter `search` is only a
 *            substring of the string to search in.
 *      - `field`: `id` (default), `title`, etc ... (where).
 *      - `search`: Some text to search for (search for).
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

// Project packages.
const { bootstrapConfig, snakeToCamel } = require('@bldr/core-node')

const packageJson = require('../package.json')

/**
 *
 */
const config = bootstrapConfig()

/**
 * Base path of the media server file store.
 */
const basePath = config.mediaServer.basePath

/* MongoDb setup **************************************************************/

/**
 *
 */
function setupMongoUrl () {
  const conf = config.databases.mongodb
  const user = encodeURIComponent(conf.user)
  const password = encodeURIComponent(conf.password)
  const authMechanism = 'DEFAULT'
  return `mongodb://${user}:${password}@${conf.url}/${conf.dbName}?authMechanism=${authMechanism}`
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

/* Media objects **************************************************************/

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
    this.extension = path.extname(this.absPath_).replace('.', '')

    /**
     * The basename (filename without extension) of the file.
     * @type {string}
     * @private
     */
    this.basename_ = path.basename(this.absPath_, `.${this.extension}`)

    return this
  }

  /**
   * Parse the info file of a media file.
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
}

/**
 * Convert all properties in a object to camelCase in a recursive fashion.
 *
 * @param {Object} object
 */
function convertProptiesToCamelCase (object) {
  for (const snakeCase in object) {
    const camelCase = snakeToCamel(snakeCase)
    if (camelCase !== snakeCase) {
      const value = object[snakeCase]
      object[camelCase] = value
      delete object[snakeCase]
    }
    if (typeof object[camelCase] === 'object' && Array.isArray(object[camelCase])) {
      convertProptiesToCamelCase(object[camelCase])
    }
  }
  return object
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

    if (fs.existsSync(previewImage)) {
      /**
       * The absolute path of the preview image.
       * @type {string}
       */
      this.previewImage = true
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
    convertProptiesToCamelCase(object)
    for (const property in object) {
      this[property] = object[property]
    }
  }
}

/**
 *
 */
class Presentation extends MediaFile {
  constructor (filePath) {
    super(filePath)
    const presentation = this.readYaml_(filePath)
    this.title = presentation.meta.title
    this.id = presentation.meta.id
  }
}

/* Checks *********************************************************************/

/**
 * @param {String} fileName
 */
function isAsset (fileName) {
  if (fileName.indexOf('_preview.jpg') > -1) {
    return false
  }
  const extension = path.extname(fileName).substr(1)
  if (['yml', 'db', 'md'].includes(extension)) {
    return false
  }
  return true
}

/**
 * @param {String} fileName
 */
function isPresentation (fileName) {
  if (fileName.indexOf('.baldr.yml') > -1) {
    return true
  }
  return false
}

/* Insert *********************************************************************/

/**
 * @param {String} relPath
 */
async function insertAsset (relPath) {
  const asset = new Asset(relPath).addFileInfos().cleanTmpProperties()
  await db.collection('assets').insertOne(asset)
}

/**
 * @param {String} relPath
 */
async function insertPresentation (relPath) {
  const presentation = new Presentation(relPath).addFileInfos().cleanTmpProperties()
  await db.collection('presentations').insertOne(presentation)
}

/**
 * @param {string} dir
 * @param {object} on - An object with callbacks. Properties: presentation,
 *   asset, all.
 */
async function walk (dir, on) {
  const files = fs.readdirSync(dir)
  for (const fileName of files) {
    const relPath = path.join(dir, fileName)
    // Exclude .git/
    if (fileName.substr(0, 1) !== '.') {
      if (fs.statSync(relPath).isDirectory()) {
        walk(relPath, on)
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
 *
 */
async function update () {
  console.log('Run git pull')
  const gitSettings = {
    cwd: basePath,
    encoding: 'utf-8'
  }
  const gitPull = childProcess.spawnSync(
    'git', ['pull'],
    gitSettings
  )
  console.log(`git pull stderr: ${gitPull.stderr.replace(/\n$/, '')}`)
  console.log(`git pull stdout: ${gitPull.stdout.replace(/\n$/, '')}`)
  if (gitPull.status !== 0) throw new Error(`git pull exits with an non-zero status code.`)

  const gitRevParse = childProcess.spawnSync('git', ['rev-parse', 'HEAD'], gitSettings)
  const lastCommitId = gitRevParse.stdout.replace(/\n$/, '')
  console.log(`lastCommitId: ${lastCommitId}`)
  await connectDb()
  await initializeDb()
  await flushMediaFiles()
  const begin = new Date().getTime()
  db.collection('updates').insertOne({ begin: begin, end: 0 })
  await walk(basePath, {
    presentation: insertPresentation,
    asset: insertAsset
  })
  const end = new Date().getTime()
  await db.collection('updates').updateOne({ begin: begin }, { $set: { end: end, lastCommitId } })
  return {
    finished: true,
    begin,
    end,
    duration: end - begin,
    lastCommitId
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
    mgmt: {
      flush: 'Delete all media files (assets, presentations) from the database.',
      init: 'Initialize the MongoDB database.',
      're-init': 'Re-Initialize the MongoDB database (Drop all collections and initialize).',
      update: 'Update the media server database (Flush and insert).',
    },
    query: {
      '#description': 'Get results by using query parameters',
      '#examples': [
        '?type=assets&field=id&method=exactMatch&search=Egmont-Ouverture',
        '?type=presentations&field=id&method=exactMatch&search=Beethoven_Marmotte'
      ],
      '#parameters': {
        type: '`assets` (default), `presentations` (what)',
        method: '`exactMatch`, `substringSearch` (default).`exactMatch`: The query parameter `search` must be a perfect match to a top level database field to get a result. `substringSearch`: The query parameter `search` is only a substring of the string to search in.',
        field: '`id` (default), `title`, etc ... (where).',
        search: 'Some text to search for (search for).'
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
      const types = ['assets', 'presentations']
      if (!('type' in query)) query.type = 'assets'
      if (!types.includes(query.type)) {
        throw new Error(`Unkown type “${query.type}”! Allowed types: ${types}`)
      }

      // method
      const methods = ['exactMatch', 'substringSearch']
      if (!('method' in query)) query.method = 'substringSearch'
      if (!methods.includes(query.method)) {
        throw new Error(`Unkown method “${query.method}”! Allowed methods: ${methods}`)
      }

      // id
      if (!('field' in query)) query.field = 'id'

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
        const findObject = {}
        findObject[query.field] = regex
        find = collection.aggregate([
          {
            $match: findObject
          },
          {
            $project: {
              _id: false,
              id: true,
              name: `$${query.field}`
            }
          }
        ])
        result = await find.toArray()
      }
      res.json(result)
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
  Asset,
  helpMessages,
  registerRestApi,
  walk
}
