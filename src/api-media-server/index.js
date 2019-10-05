#! /usr/bin/env node

/**
 * @file Base code for the cli and the rest interface.
 * @module @bldr/media-server
 */

// Node packages.
const fs = require('fs')
const path = require('path')

// Third party packages.
const yaml = require('js-yaml')
const express = require('express')
const MongoClient = require('mongodb').MongoClient;

// Project packages.
const { utils } = require('@bldr/core')
const packageJson = require('./package.json')

const config = utils.bootstrapConfig()

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
    this.path = filePath.replace(config.mediaServer.basePath, '').replace(/^\//, '')

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
  constructor (filePath) {
    super(filePath)
  }
}

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

class MediaServer {
  constructor (basePath) {
    /**
     * @type {string}
     */
    this.basePath = ''
    if (!basePath) {
      if (!('basePath' in config.mediaServer)) {
        throw new Error('Missing property “basePath” in config.mediaServer')
      }
      this.basePath = config.mediaServer.basePath
    } else {
      this.basePath = basePath
    }
    if (!fs.existsSync(this.basePath)) {
      throw new Error(`The base path of the media server doesn’t exist: ${this.basePath}`)
    }
  }

  /**
   * @return {Promise}
   */
  async connectDb () {
    await mongoClient.connect()
    this.db = mongoClient.db(config.databases.mongodb.dbName)
    return this.db
  }

  closeDb () {
    mongoClient.close()
  }

  async addMediaAsset_ (relPath) {
    const mediaAsset = new MediaAsset(relPath).gatherMetaData().cleanTmpProperties()
    await this.db.collection('mediaAssets').insertOne(mediaAsset)
  }

  async addPresentation_ (relPath) {
    const presentation = new Presentation(relPath).addFileInfos().cleanTmpProperties()
    await this.db.collection('presentations').insertOne(presentation)
  }

  async walkSync_ (dir) {
    const files = fs.readdirSync(dir)
    for (const fileName of files) {
      const relPath = path.join(dir, fileName)
      // Exclude .git/
      if (fileName.substr(0, 1) !== '.') {
        if (fs.statSync(relPath).isDirectory()) {
          this.walkSync_(relPath)
        } else if (isPresentation(fileName)) {
          await this.addPresentation_(relPath)
        } else if (isMediaAsset(fileName)) {
          await this.addMediaAsset_(relPath)
        }
      }
    }
  }

  async update () {
    await this.initializeDb()
    await this.flushMediaFiles()
    const begin = new Date().getTime()
    this.db.collection('updates').insertOne({ begin: begin, end: 0 })
    await this.walkSync_(this.basePath)
    const end = new Date().getTime()
    await this.db.collection('updates').updateOne({ begin: begin }, { $set: { end: end } })
    return {
      finished: true,
      begin,
      end,
      duration: end - begin
    }
  }

  normalizeResult_ (result) {
    if (result && !result.error) {
      delete result._id
      return result
    }
    return result
  }

  normalizeResults_ (results) {
    const output = []
    for (const result of results) {
      output.push(this.normalizeResult_(result))
    }
    return output
  }

  /**
   * @returns {Promise}
   */
  async getMediaAssetById (id) {
    return this.normalizeResult_(await this.db.collection('mediaAssets').find( { id: id } ).next())
  }

  /**
   * @returns {Promise}
   */
  async getMediaAssetByFilename (filename) {
    const cursor = await this.db.collection('mediaAssets').find( { filename: filename } )
    const count = await cursor.count()
    if (count !== 1) throw new Error(`filename “${filename}” is not unambiguous.`)
    return this.normalizeResult_(await cursor.next())
  }

  /**
   * @returns {Promise}
   */
  async searchInPath (substring) {
    return await this.db.collection('mediaAssets').aggregate([
      {
        $match: {
          $expr: { $gt: [{ $indexOfCP: [ "$path", substring ] }, -1]}
        }
      },
      {
        $project: {
          _id: false,
          id: true,
          name: '$path'
        }
      }
    ]).toArray()
  }

  /**
   * @returns {Promise}
   */
  async searchInId (substring) {
    return await this.db.collection('mediaAssets').aggregate([
      {
        $match: {
          $expr: { $gt: [{ $indexOfCP: [ "$id", substring ] }, -1]}
        }
      },
      {
        $project: {
          _id: false,
          id: true,
          name: '$title'
        }
      }
    ]).toArray()
  }

  /**
   * @returns {Promise}
   */
  async flushMediaFiles () {
    await this.db.collection('mediaAssets').deleteMany({})
    await this.db.collection('presentations').deleteMany({})
  }

  /**
   * @returns {Promise}
   */
  async initializeDb () {
    const mediaAssets = await this.db.createCollection('mediaAssets')
    await mediaAssets.createIndex( { path: 1 }, { unique: true } )
    await mediaAssets.createIndex( { id: 1 }, { unique: true } )

    const presentations = await this.db.createCollection('presentations')
    await presentations.createIndex( { id: 1 }, { unique: true } )

    const updates = await this.db.createCollection('updates')
    await updates.createIndex( { begin: 1 } )

    const result = {}
    const collections = await this.db.listCollections().toArray()
    for (const collection of collections) {
      const indexes = await this.db.collection(collection.name).listIndexes().toArray()
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
  async dropDb () {
    const collections = await this.db.listCollections().toArray()
    const droppedCollections = []
    for (const collection of collections) {
      await this.db.dropCollection(collection.name)
      droppedCollections.push(collection.name)
    }
    return {
      droppedCollections
    }
  }

  /**
   * @returns {Promise}
   */
  async reInitializeDb () {
    const dropDb = await this.dropDb()
    const initializeDb = await this.initializeDb()
    return {
      dropDb,
      initializeDb
    }
  }
}

const mediaServer = new MediaServer()

const app = express()

app.on('mount', async () => {
  await mediaServer.connectDb()
  await mediaServer.initializeDb()
})

app.get(['/', '/version'], (req, res) => {
  res.json({
    name: packageJson.name,
    version: packageJson.version
  })
})

app.get('/media-asset/by-id/:id', async (req, res, next) => {
  try {
    res.json(await mediaServer.getMediaAssetById(req.params.id))
  } catch (error) {
    next(error)
  }
})

app.get('/media-asset/by-filename/:filename', async (req, res, next) => {
  try {
    res.json(await mediaServer.getMediaAssetByFilename(req.params.filename))
  } catch (error) {
    next(error)
  }
})

app.get('/stats/count', async (req, res, next) => {
  try {
    res.json({
      mediaAssets: await mediaServer.db.collection('mediaAssets').countDocuments(),
      presentations: await mediaServer.db.collection('presentations').countDocuments()
    })
  } catch (error) {
    next(error)
  }
})

app.get('/stats/updates', async (req, res, next) => {
  try {
    res.json(await mediaServer.db.collection('updates')
      .find({}, { projection: { _id: 0 } })
      .sort({ begin: -1 })
      .limit(20)
      .toArray()
    )
  } catch (error) {
    next(error)
  }
})

app.get('/search-in/id', async (req, res, next) => {
  try {
    if (!('substring' in req.query) || !req.query.substring) {
      res.sendStatus(400)
    } else {
      res.json(await mediaServer.searchInId(req.query.substring))
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
      res.json(await mediaServer.searchInPath(req.query.substring))
    }
  } catch (error) {
    next(error)
  }
})

app.get('/management/initialize-db', async (req, res, next) => {
  try {
    res.json(await mediaServer.initializeDb())
  } catch (error) {
    next(error)
  }
})

app.get('/management/re-initialize-db', async (req, res, next) => {
  try {
    res.json(await mediaServer.reInitializeDb())
  } catch (error) {
    next(error)
  }
})

app.get('/management/update', async (req, res, next) => {
  try {
    res.json(await mediaServer.update())
  } catch (error) {
    next(error)
  }
})

app.get('/management/flush-media-assets', async (req, res, next) => {
  try {
    res.json(await mediaServer.flushMediaFiles())
  } catch (error) {
    next(error)
  }
})

module.exports = {
  config,
  MediaServer,
  expressApp: app
}