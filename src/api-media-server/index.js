/**
 * @file Base code for the cli and the rest interface.
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
const { utils } = require('@bldr/core')
const packageJson = require('./package.json')

const config = utils.bootstrapConfig()

/**
 * Base path of the media server file store.
 */
const basePath = config.mediaServer.basePath

/* MongoDb setup **************************************************************/

function setupMongoUrl () {
  const conf = config.databases.mongodb
  const user = encodeURIComponent(conf.user)
  const password = encodeURIComponent(conf.password)
  const authMechanism = 'DEFAULT'
  return `mongodb://${user}:${password}@${conf.url}/${conf.dbName}?authMechanism=${authMechanism}`
}

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
   */
  readYaml_ (filePath) {
    if (fs.existsSync(filePath)) {
      return yaml.safeLoad(fs.readFileSync(filePath, 'utf8'))
    }
    return {}
  }

  addFileInfos () {
    return this.addFileInfos_()
  }

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
   * Merge an object into the class object.
   *
   * @param {object} properties - Add an object to the class properties.
   */
  mergeObject (object) {
    for (const property in object) {
      this[property] = object[property]
    }
  }
}

class Presentation extends MediaFile {
  constructor(filePath) {
    super(filePath)
    const presentation = this.readYaml_(filePath)
    this.title = presentation.meta.title
    this.id = presentation.meta.id
  }
}

/* Checks *********************************************************************/

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

function isPresentation (fileName) {
  if (fileName.indexOf('.baldr.yml') > -1) {
    return true
  }
  return false
}

/* Insert *********************************************************************/

async function insertAsset (relPath) {
  const asset = new Asset(relPath).addFileInfos().cleanTmpProperties()
  await db.collection('assets').insertOne(asset)
}

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
      } else if (isPresentation(fileName)) {
        if ('presentation' in on) await on.presentation(relPath)
        if ('all' in on) await on.all(relPath)
      } else if (isAsset(fileName)) {
        if ('asset' in on) await on.asset(relPath)
        if ('all' in on) await on.all(relPath)
      }
    }
  }
}

async function update () {
  console.log('Run git pull')
  const gitSettings =  {
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

function registerRestApi () {
  async function matchByField (collection, field, req, res, next) {
    try {
      await connectDb()
      query = {}
      query[field] = req.params[field]
      res.json(
        await db.collection(collection)
          .find(query, { projection: { _id: 0 } })
          .next()
      )
    } catch (error) {
      next(error)
    }
  }

  async function searchInField (collection, field, req, res, next) {
    try {
      await connectDb()
      if (!('substring' in req.query) || !req.query.substring) {
        res.sendStatus(400)
      } else {
        res.json(await db.collection(collection).aggregate([
          {
            $match: {
              $expr: { $gt: [{ $indexOfCP: [{ $toLower: `$${field}` }, { $toLower: req.query.substring } ] }, -1] } // https://stackoverflow.com/a/56808870
            }
          },
          {
            $project: {
              _id: false,
              id: true,
              name: `$${field}`
            }
          }
        ]).toArray())
      }
    } catch (error) {
      next(error)
    }
  }

  const app = express()

  app.on('mount', async () => {
    await connectDb()
    await initializeDb()
  })

  app.get('/', (req, res) => {
    res.json({
      '/mgmt/flush': 'Delete all media files (assets, presentations) from the database.',
      '/mgmt/init': 'Initialize the MongoDB database.',
      '/mgmt/re-init': 'Re-Initialize the MongoDB database (Drop all collections and initialize).',
      '/mgmt/update': 'Update the media server database (Flush and insert).',
      '/query/asset/match/filename/:id': '',
      '/query/asset/match/id/:id': '',
      '/query/assets/search/id?substring=:substring': '',
      '/query/assets/search/path?substring=:substring': '',
      '/query/assets/search/title?substring=:substring': '',
      '/query/presentation/match/id/:id': '',
      '/query/presentations/search/title?substring=:substring': '',
      '/stats/count': 'Count / sum of the media files (assets, presentations) in the database.',
      '/stats/updates': 'Journal of the update processes with timestamps.'
    })
  })

  app.get('/version', (req, res) => {
    res.json({
      name: packageJson.name,
      version: packageJson.version
    })
  })

  /* query */

  /* assets */

  app.get('/query/asset/match/filename/:filename', async (req, res, next) => {
    await matchByField('assets', 'filename', req, res, next)
  })

  app.get('/query/asset/match/id/:id', async (req, res, next) => {
    await matchByField('assets', 'id', req, res, next)
  })

  app.get('/query/assets/search/id', async (req, res, next) => {
    await searchInField('assets', 'id', req, res, next)
  })

  app.get('/query/assets/search/path', async (req, res, next) => {
    await searchInField('assets', 'path', req, res, next)
  })

  app.get('/query/assets/search/title', async (req, res, next) => {
    await searchInField('assets', 'title', req, res, next)
  })

  /* presentations */

  app.get('/query/presentation/match/id/:id', async (req, res, next) => {
    await matchByField('presentations', 'id', req, res, next)
  })

  app.get('/query/presentations/search/title', async (req, res, next) => {
    await searchInField('presentations', 'title', req, res, next)
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
  registerRestApi,
  walk,
  Asset
}
