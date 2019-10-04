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

const mongoDbQueries = {
  flushFiles (db) {
    return db.collection('mediaAssets').deleteMany({})
  },
  countMediaAssets (db) {
    return db.collection('mediaAssets').countDocuments()
  },
  queryById (db, id) {
    return db.collection('mediaAssets').find( { id: id } ).next()
  }
}

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
   * @param {string} basePath - The base path of the media server.
   * @param {boolean} dbInsertOnly - Gather a minimal amount of data needed for
   *   db update.
   */
  constructor (filePath, basePath, dbInsertOnly = false) {
    this.absPath = path.resolve(filePath)
    /**
     * Absolute path ot the file.
     * @type {string}
     */
    this.path = filePath.replace(basePath, '').replace(/^\//, '')

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
    this.infoFile = `${this.absPath}.yml`

    const data = this.readInfoYaml_(this.infoFile)
    this.mergeObject(data)

    if (!dbInsertOnly) {

      const stats = fs.statSync(this.absPath)

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
      this.extension = path.extname(filePath).replace('.', '')

      /**
       * The basename (filename without extension) of the file.
       * @type {string}
       */
      this.basename = path.basename(filePath, `.${this.extension}`)

      const previewImage = `${this.absPath}_preview.jpg`

      if (fs.existsSync(previewImage)) {
        /**
         * The absolute path of the preview image.
         * @type {string}
         */
        this.previewImage = true
      }
    }
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

  glob_ (searchPath) {
    return glob.sync(path.join(searchPath, '**/*'), { ignore: this.ignore })
  }

  createInfoFiles () {
    const cwd = process.cwd()
    const files = this.glob_(cwd)
    for (const file of files) {
      const yamlFile = `${file}.yml`
      if (!fs.lstatSync(file).isDirectory() && !fs.existsSync(yamlFile)) {
        const mediaAsset = new MediaAsset(file, this.basePath)
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
    console.log('Run git pull')
    const gitPull = childProcess.spawnSync('git', ['pull'], { cwd: this.basePath, encoding: 'utf-8' })
    console.log(gitPull.stderr)
    console.log(gitPull.stdout)
    if (gitPull.status !== 0) throw new Error(`git pull exits with an none zero status code.`)

    const db = await connectMongodb()

    const files = this.glob_(this.basePath)
    for (const file of files) {
      if (!fs.lstatSync(file).isDirectory()) {
        const mediaAsset = new MediaAsset(file, this.basePath, true)
        delete mediaAsset.absPath
        delete mediaAsset.infoFile
        delete mediaAsset.basename
        console.log(mediaAsset)
        await db.collection('mediaAssets').updateOne(
          { path: mediaAsset.path },
          { $set: mediaAsset },
          { upsert: true }
        )
      }
    }
    mongoClient.close()
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
    return this.normalizeResult_(await queryMongodb('queryById', id))
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
  flushFiles () {
    return queryMongodb('flushFiles')
  }

  /**
   * @returns {Promise}
   */
  countMediaAssets () {
    return queryMongodb('countMediaAssets')
  }

  /**
   * @returns {Promise}
   */
  async initializeDb_ (db) {
    const mediaAssets = await db.createCollection('mediaAssets')
    await mediaAssets.createIndex( { path: 1 }, { unique: true } )
    await mediaAssets.createIndex( { id: 1 }, { unique: true } )
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
  async initializeDb () {
    const db = await connectMongodb()
    const result = await this.initializeDb_(db)
    mongoClient.close()
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

module.exports = {
  config,
  MediaServer,
  expressApp: app
}