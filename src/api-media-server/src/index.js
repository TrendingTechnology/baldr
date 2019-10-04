#! /usr/bin/env node

/**
 * @file Base code for the cli and the rest interface.
 * @module @bldr/media-server
 */

// Node packages.
const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')

// Third party packages.
const glob = require('glob')
const yaml = require('js-yaml')
const express = require('express')
const MongoClient = require('mongodb').MongoClient;

// Project packages.
const { utils } = require('@bldr/core')
const packageJson = require('../package.json')

const config = utils.bootstrapConfig()
const mongoClient = new MongoClient(
  `${config.databases.mongodb.url}/${config.databases.mongodb.dbName}`,
  { useNewUrlParser: true, useUnifiedTopology: true }
)

/**
 * @return {Promise}
 */
async function connectMongodb () {
  await mongoClient.connect()
  return mongoClient.db(config.databases.mongodb.dbName)
}

/**
 * @return {Promise}
 */
async function queryMongodb (queryName, payload) {
  const db = await connectMongodb()
  const result = await mongoDbQueries[queryName](db, payload)
  mongoClient.close()
  return result
}

/**
 * This class is used both for the entries in the SQLite database as well for
 * the queries.
 */
class MediaAsset {
  /**
   * @param {string} filePath - The file path of the media file.
   */
  constructor (filePath) {
    this.absPath_ = path.resolve(filePath)
    /**
     * Absolute path ot the file.
     * @type {string}
     */
    this.path = filePath.replace(config.mediaServer.basePath, '').replace(/^\//, '')

    /**
     * The basename (filename) of the file.
     * @type {string}
     */
    this.filename = path.basename(filePath)

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

  cleanTmpProperties () {
    for (const property in this) {
      if (property.match(/_$/)) {
        delete this[property]
      }
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

    /**
     * @type {array}
     */
    this.ignore = [
      '**/*.db',
      '**/*.yml',
      '**/*robots.txt',
      '**/*_preview.jpg',
      '**/README.md'
    ]
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

  glob_ (searchPath) {
    return glob.sync(path.join(searchPath, '**/*'), { ignore: this.ignore })
  }

  createInfoFiles () {
    const cwd = process.cwd()
    const files = this.glob_(cwd)
    for (const file of files) {
      const yamlFile = `${file}.yml`
      if (!fs.lstatSync(file).isDirectory() && !fs.existsSync(yamlFile)) {
        const mediaAsset = new MediaAsset(file)
        const title = mediaAsset.basename
          .replace(/_/g, ', ')
          .replace(/-/g, ' ')
          .replace(/Ae/g, 'Ä')
          .replace(/ae/g, 'ä')
          .replace(/Oe/g, 'Ö')
          .replace(/oe/g, 'ö')
          .replace(/Ue/g, 'Ü')
          .replace(/ue/g, 'ü')
        const yamlMarkup = `---
# path: ${mediaAsset.path}
# filename: ${mediaAsset.filename}
# extension: ${mediaAsset.extension}
title: ${title}
id: ${mediaAsset.basename}
`
        console.log(yamlMarkup)
        fs.writeFileSync(yamlFile, yamlMarkup)
      }
    }
  }

  rename () {
    const cwd = process.cwd()
    const files = this.glob_(cwd)
    for (const oldPath of files) {
      console.log(oldPath)
      const newPath = oldPath
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
      if (oldPath !== newPath) {
        console.log(newPath)
        fs.renameSync(oldPath, newPath)
      }
    }
  }

  async update () {
    const gitPull = childProcess.spawnSync('git', ['pull'], { cwd: this.basePath, encoding: 'utf-8' })
    if (gitPull.status !== 0) throw new Error(`git pull exits with an none zero status code.`)

    const files = this.glob_(this.basePath)
    for (const file of files) {
      if (!fs.lstatSync(file).isDirectory()) {
        const mediaAsset = new MediaAsset(file).gatherMetaData().cleanTmpProperties()
        await this.db.collection('mediaAssets').updateOne(
          { path: mediaAsset.path },
          { $set: mediaAsset },
          { upsert: true }
        )
      }
    }
    return { finished: true }
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

  list () {
    const results = this.sqlite.list()
    if (results.length > 0) {
      const output = []
      for (const result of results) {
        output.push(this.loadMediaDataObject_(result))
      }
      return output
    }
    return {
      warning: 'No media files found.'
    }
  }

  /**
   * @returns {Promise}
   */
  async queryById (id) {
    return this.normalizeResult_(await this.db.collection('mediaAssets').find( { id: id } ).next())
  }

  /**
   * @returns {Promise}
   */
  async queryByFilename (filename) {
    return this.normalizeResult_(await queryMongodb('queryById', filename))
  }

  searchInPath (pathSubstring) {
    const results = this.sqlite.searchInPath(pathSubstring)
    return this.normalizeResults_(results)
  }

  searchInId (idSubstring) {
    const results = this.sqlite.searchInId(idSubstring.toLowerCase())
    return this.normalizeResults_(results)
  }

  /**
   * @returns {Promise}
   */
  async flushMediaAssets () {
    const countBefore = await this.countMediaAssets()
    await this.db.collection('mediaAssets').deleteMany({})
    const countAfter = await this.countMediaAssets()
    if (countAfter !== 0) throw new Error('Flush was not successfull')
    return { flushCount: countBefore }
  }

  /**
   * @returns {Promise}
   */
  countMediaAssets () {
    return this.db.collection('mediaAssets').countDocuments()
  }

  /**
   * @returns {Promise}
   */
  async initializeDb () {
    const mediaAssets = await this.db.createCollection('mediaAssets')
    await mediaAssets.createIndex( { path: 1 }, { unique: true } )
    await mediaAssets.createIndex( { id: 1 }, { unique: true } )
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
  async dropDb_ (db) {
    const collections = await db.listCollections().toArray()
    for (const collection of collections) {
      console.log(collection.name)
      await db.dropCollection(collection.name)
    }
    console.log('finished')
  }

  /**
   * @returns {Promise}
   */
  async reInitializeDb () {
    const db = await connectMongodb()
    await this.dropDb_(db)
    await this.initializeDb_(db)
    mongoClient.close()
  }
}

const mediaServer = new MediaServer()

function sendJsonMessage (res, message) {
  res.json(message)
  console.log(message)
}

const app = express()

app.on('mount', async () => {
  await mediaServer.connectDb()
})

app.get(['/', '/version'], (req, res) => {
  res.json({
    name: packageJson.name,
    version: packageJson.version
  })
})

app.post('/query-by-id', (req, res) => {
  const body = req.body
  if (!('id' in body)) {
    res.sendStatus(400)
  } else {
    sendJsonMessage(res, mediaServer.queryByID(body.id))
  }
})

app.get('/asset/by-id/:id', async (req, res, next) => {
  try {
    res.json(await mediaServer.queryById(req.params.id))
  } catch (error) {
    next(error)
  }
})

app.get('/assets/count', async (req, res, next) => {
  try {
    res.json({ count: await mediaServer.countMediaAssets() })
  } catch (error) {
    next(error)
  }
})

app.post('/query-by-filename', (req, res) => {
  const body = req.body
  if (!('filename', body)) {
    res.sendStatus(400)
  } else {
    sendJsonMessage(res, mediaServer.queryByFilename(body.filename))
  }
})

app.get('/search-in-path', (req, res) => {
  const query = req.query
  if (!('path' in query) || !query.path) {
    res.sendStatus(400)
  } else {
    sendJsonMessage(res, mediaServer.searchInPath(query.path))
  }
})

app.get('/search-in-id', (req, res) => {
  const query = req.query
  if (!('id' in query) || !query.id) {
    res.sendStatus(400)
  } else {
    sendJsonMessage(res, mediaServer.searchInId(query.id))
  }
})

app.get('/management/initialize-db', async (req, res, next) => {
  try {
    res.json(await mediaServer.initializeDb())
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
    res.json(await mediaServer.flushMediaAssets())
  } catch (error) {
    next(error)
  }
})


module.exports = {
  config,
  MediaServer,
  expressApp: app
}