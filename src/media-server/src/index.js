#! /usr/bin/env node

/**
 * @file Base code for the cli and the rest interface.
 * @module @bldr/media-server
 */

// Node packages.
const fs = require('fs')
const path = require('path')

// Third party packages.
const glob = require('glob')
const Sqlite3 = require('better-sqlite3')
const yaml = require('js-yaml')

// Project packages.
const { utils } = require('@bldr/core')

/**
 * This class is used both for the entries in the SQLite database as well for
 * the queries.
 */
class MetaData {
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
        this.previewImage = previewImage
      }

      /**
       * The extension of the file.
       * @type {string}
       */
      this.extension = path.extname(filePath).replace('.', '')
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

/**
 * Sqlite database wrapper.
 */
class Sqlite {
  /**
   * @param {string} dbFile - The path of the Sqlite database.
   */
  constructor (dbFile) {
    /**
     * The path of the Sqlite database.
     *
     * @type {string}
     */
    this.dbFile = dbFile

    /**
     * A instance of the class “Sqlite3”.
     */
    this.db = new Sqlite3(this.dbFile)
    this.prepare_(
      `CREATE TABLE IF NOT EXISTS files (
        path TEXT UNIQUE,
        filename TEXT,
        id TEXT UNIQUE
      )`
    )

    this.prepare_('CREATE INDEX IF NOT EXISTS id ON files(id)')
    this.prepare_('CREATE INDEX IF NOT EXISTS filename ON files(filename)')
  }

  prepare_ (sql, data) {
    if (data) {
      this.db.prepare(sql).run(data)
    } else {
      this.db.prepare(sql).run()
    }
  }

  update ({ path, filename, id }) {
    this.prepare_(
      'INSERT OR IGNORE INTO files (path) VALUES ($path)',
      { path: path }
    )

    this.prepare_(
      `UPDATE files
        SET
          path = $path,
          filename = $filename,
          id = $id
        WHERE path = $path
      `,
      {
        path: path,
        filename: filename,
        id: id
      }
    )
  }

  queryByID (id) {
    const results = this.db
      .prepare('SELECT * FROM files WHERE id = $id')
      .all({ id: id })

    if (results.length === 0) {
      return { error: `Media file with the '${id}' not found.` }
    }

    if (results.length > 1) {
      console.log(results)
      throw new Error(`Multiple ids '${id}' found.`)
    }
    return results[0]
  }

  queryByFilename (filename) {
    const results = this.db
      .prepare('SELECT * FROM files WHERE filename = $filename')
      .all({ filename: filename })

    if (results.length === 0) {
      return { error: `'${filename}' not found.` }
    }

    if (results.length > 1) {
      console.log(results)
      throw new Error(`Multiple file names '${filename}' found.`)
    }
    return results[0]
  }

  list () {
    return this.db
      .prepare('SELECT * FROM files')
      .all()
  }

  flush () {
    this.db.prepare('DELETE FROM files').run()
  }
}

function bootstrapConfig () {
  const config = utils.bootstrapConfig()
  if (!('mediaServer' in config)) {
    throw new Error('Missing property mediaServer in config.')
  }
  return config.mediaServer
}

class MediaServer {
  constructor (basePath) {
    /**
     * @type {string}
     */
    this.basePath = ''
    if (!basePath) {
      const config = bootstrapConfig()
      if (!('basePath' in config)) {
        throw new Error('Missing property “basePath” in config.mediaServer')
      }
      this.basePath = config.basePath
    } else {
      this.basePath = basePath
    }
    if (!fs.existsSync(this.basePath)) {
      throw new Error(`The base path of the media server doesn’t exist: ${this.basePath}`)
    }

    /**
     * @type {string}
     */
    this.SQLiteDBfile = path.join(this.basePath, 'files.db')

    /**
     *
     */
    this.sqlite = this.initSQLite_()

    /**
     * @type {array}
     */
    this.ignore = [
      '**/*.db',
      '**/*.yml',
      '**/*robots.txt',
      '**/*_preview.jpg'
    ]
  }

  initSQLite_ () {
    return new Sqlite(this.SQLiteDBfile)
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
        const metaData = new MetaData(file, this.basePath)
        const title = metaData.basename
          .replace(/_/g, ', ')
          .replace(/-/g, ' ')
          .replace(/Ae/g, 'Ä')
          .replace(/ae/g, 'ä')
          .replace(/Oe/g, 'Ö')
          .replace(/oe/g, 'ö')
          .replace(/Ue/g, 'Ü')
          .replace(/ue/g, 'ü')
        const yamlMarkup = `---
# path: ${metaData.path}
# filename: ${metaData.filename}
# extension: ${metaData.extension}
title: ${title}
id: ${metaData.basename}
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

  update () {
    const files = this.glob_(this.basePath)
    for (const file of files) {
      if (!fs.lstatSync(file).isDirectory()) {
        const metaData = new MetaData(file, this.basePath, true)
        console.log(metaData)
        this.sqlite.update(metaData)
      }
    }
  }

  loadMediaDataObject (result) {
    if (result && !result.error) {
      return new MetaData(path.join(this.basePath, result.path), this.basePath)
    }
    return result
  }

  list () {
    const results = this.sqlite.list()
    if (results.length > 0) {
      const output = []
      for (const result of results) {
        output.push(this.loadMediaDataObject(result))
      }
      return output
    }
    return {
      warning: 'No media files found.'
    }
  }

  queryByID (id) {
    const result = this.sqlite.queryByID(id)
    return this.loadMediaDataObject(result)
  }

  queryByFilename (filename) {
    const result = this.sqlite.queryByFilename(filename)
    return this.loadMediaDataObject(result)
  }

  flush () {
    this.sqlite.flush()
  }

  /**
   * Delete the SQLite db file and create a new one.
   */
  reInitializeDb () {
    fs.unlinkSync(this.SQLiteDBfile)
    this.sqlite = this.initSQLite_()
  }
}

/**
 * The main class.
 */
exports.MediaServer = MediaServer

/**
 * Helper function to get configurations.
 */
exports.bootstrapConfig = bootstrapConfig
