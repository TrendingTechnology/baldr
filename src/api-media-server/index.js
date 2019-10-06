/**
 * @file Base code for the cli and the rest interface.
 * @module @bldr/api-media-server
 */

// Node packages.
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
  await mongoClient.connect()
  db = mongoClient.db(config.databases.mongodb.dbName)
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

  addFileInfos () {
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
class MediaAsset extends MediaFile {
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

    const data = this.readInfoYaml_(this.infoFile_)
    this.mergeObject(data)
  }

  gatherMetaData () {
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
  readInfoYaml_ (infoFile) {
    if (fs.existsSync(infoFile)) {
      return yaml.safeLoad(fs.readFileSync(infoFile, 'utf8'))
    }
    return {}
  }
}

class Presentation extends MediaFile {
}

/* Checks *********************************************************************/

function isMediaAsset (fileName) {
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

async function insertMediaAsset (relPath) {
  const mediaAsset = new MediaAsset(relPath).gatherMetaData().cleanTmpProperties()
  await db.collection('mediaAssets').insertOne(mediaAsset)
}

async function insertPresentation (relPath) {
  const presentation = new Presentation(relPath).addFileInfos().cleanTmpProperties()
  await db.collection('presentations').insertOne(presentation)
}

async function walkSync (dir) {
  const files = fs.readdirSync(dir)
  for (const fileName of files) {
    const relPath = path.join(dir, fileName)
    // Exclude .git/
    if (fileName.substr(0, 1) !== '.') {
      if (fs.statSync(relPath).isDirectory()) {
        walkSync(relPath)
      } else if (isPresentation(fileName)) {
        await insertPresentation(relPath)
      } else if (isMediaAsset(fileName)) {
        await insertMediaAsset(relPath)
      }
    }
  }
}

async function update () {
  await initializeDb()
  await flushMediaFiles()
  const begin = new Date().getTime()
  db.collection('updates').insertOne({ begin: begin, end: 0 })
  await walkSync(basePath)
  const end = new Date().getTime()
  await db.collection('updates').updateOne({ begin: begin }, { $set: { end: end } })
  return {
    finished: true,
    begin,
    end,
    duration: end - begin
  }
}

/* MongoDb Management *********************************************************/

/**
 * @returns {Promise}
 */
async function initializeDb () {
  const mediaAssets = await db.createCollection('mediaAssets')
  await mediaAssets.createIndex({ path: 1 }, { unique: true })
  await mediaAssets.createIndex({ id: 1 }, { unique: true })

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
  await db.collection('mediaAssets').deleteMany({})
  await db.collection('presentations').deleteMany({})
}

/* Express Rest API ***********************************************************/

function registerRestApi () {
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

  app.get('/media-asset/by-id/:id', async (req, res, next) => {
    try {
      res.json(await db.collection('mediaAssets').find({ id: req.params.id }).next())
    } catch (error) {
      next(error)
    }
  })

  app.get('/media-asset/by-filename/:filename', async (req, res, next) => {
    try {
      const cursor = await db.collection('mediaAssets').find({ filename: req.params.filename })
      const count = await cursor.count()
      if (count !== 1) throw new Error(`filename “${req.params.filename}” is not unambiguous.`)
      res.json(await cursor.next())
    } catch (error) {
      next(error)
    }
  })



  app.get('/search-in/id', async (req, res, next) => {
    try {
      if (!('substring' in req.query) || !req.query.substring) {
        res.sendStatus(400)
      } else {
        res.json(await db.collection('mediaAssets').aggregate([
          {
            $match: {
              $expr: { $gt: [{ $indexOfCP: ['$id', req.query.substring] }, -1] }
            }
          },
          {
            $project: {
              _id: false,
              id: true,
              name: '$title'
            }
          }
        ]).toArray())
      }
    } catch (error) {
      next(error)
    }
  })

  app.get('/search-in/path', async (req, res, next) => {
    try {
      if (!('substring' in req.query) || !req.query.substring) {
        res.sendStatus(400)
      } else {
        res.json(await db.collection('mediaAssets').aggregate([
          {
            $match: {
              $expr: { $gt: [{ $indexOfCP: ['$path', req.query.substring] }, -1] }
            }
          },
          {
            $project: {
              _id: false,
              id: true,
              name: '$path'
            }
          }
        ]).toArray())
      }
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
        mediaAssets: await db.collection('mediaAssets').countDocuments(),
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
  registerRestApi
}
