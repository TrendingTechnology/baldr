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
const MongoClient = require('mongodb').MongoClient;
const glob = require('glob')

// Project packages.
const { utils } = require('@bldr/core')

// Project packages.

/**
 * This class is used both for the entries in the SQLite database as well for
 * the queries.
 */
class MediaFile {
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

const config = utils.bootstrapConfig()

console.log(config)

const url = 'mongodb://localhost:27017'
const dbName = 'baldr-media-server'
const client = new MongoClient(`${url}/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true })

const files = glob.sync(path.join(config.mediaServer.basePath, '**/*'), { ignore: [
  '**/*.db',
  '**/*.yml',
  '**/*robots.txt',
  '**/*_preview.jpg',
  '**/README.md'
] })


async function flushFiles () {
  client.connect((err, client) => {
    const db = client.db(dbName)
    db.collection('files').deleteMany({})
    client.close()
  })
}


function upsert () {
  client.connect(async (err, client) => {
    const db = client.db(dbName)
    for (const file of files) {
      if (!fs.lstatSync(file).isDirectory()) {
        const mediaFile = new MediaFile(file, this.basePath, false)
        await db.collection('files').updateOne(
          { id: mediaFile.id },
          { $set: mediaFile },
          { upsert: true }
        )
        console.log(mediaFile)
      }
    }
    client.close()
  })
}

upsert()
