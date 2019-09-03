#! /usr/bin/env node

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
 *
 */
class MetaData {
  constructor (filePath, basePath) {
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
     * The basename (filename) of the file.
     * @type {string}
     */
    this.filename = path.basename(filePath)

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

    const data = this.readInfoYaml_()

    /**
     * @type {string}
     */
    this.id = ''
    if ('id' in data) {
      this.id = data.id
    }

    /**
     * @type {object}
     */
    this.data = JSON.stringify(data)
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
  readInfoYaml_ () {
    const infoFile = this.absPath + '.yml'
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
        extension TEXT,
        id TEXT UNIQUE,
        data TEXT
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

  update ({ path, filename, extension, id, data }) {
    this.prepare_(
      'INSERT OR IGNORE INTO files (path) VALUES ($path)',
      { path: path }
    )

    this.prepare_(
      `UPDATE files
        SET
          path = $path,
          filename = $filename,
          extension = $extension,
          id = $id,
          data = $data
        WHERE path = $path
      `,
      {
        path: path,
        filename: filename,
        extension: extension,
        id: id,
        data: data
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
     *
     */
    this.basePath = ''
    if (!basePath) {
      const config = bootstrapConfig()
      if (!('basePathLocal' in config)) {
        throw new Error('Missing property “basePathLocal” in config.mediaServer')
      }
      this.basePath = config.basePathLocal
    } else {
      this.basePath = basePath
    }
    if (!fs.existsSync(this.basePath)) {
      throw new Error(`The base path of the media server doesn’t exist: ${this.basePath}`)
    }
    const dbFile = path.join(this.basePath, 'files.db')

    /**
     *
     */
    this.sqlite = new Sqlite(dbFile)

    /**
     *
     */
    this.ignore = [
      '**/*.db',
      '**/*.yml',
      '**/*robots.txt'
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
        const metaData = new MetaData(file, this.basePath)
        const title = metaData.basename.replace('_', ', ').replace('-', ' ')
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

  update () {
    const files = this.glob_(this.basePath)
    for (const file of files) {
      if (!fs.lstatSync(file).isDirectory()) {
        const metaData = new MetaData(file, this.basePath)
        console.log(metaData)
        this.sqlite.update(metaData)
      }
    }
  }

  flattenFileObject_ (result) {
    if (result && !result.error) {
      result = Object.assign(result, JSON.parse(result.data))
      delete result.data
      if (!result.id) delete result.id
      return result
    }
    return result
  }

  list () {
    const results = this.sqlite.list()
    if (results.length > 0) {
      const output = []
      for (const result of results) {
        output.push(this.flattenFileObject_(result))
      }
      return output
    }
    return {
      warning: 'No media files found.'
    }
  }

  queryByID (id) {
    const result = this.sqlite.queryByID(id)
    return this.flattenFileObject_(result)
  }

  queryByFilename (filename) {
    const result = this.sqlite.queryByFilename(filename)
    return this.flattenFileObject_(result)
  }

  flush () {
    this.sqlite.flush()
  }
}

exports.MediaServer = MediaServer
exports.bootstrapConfig = bootstrapConfig
