#! /usr/bin/env node

// Node packages.
const fs = require('fs')
const path = require('path')

// Third party packages.
const commander = require('commander')
const glob = require('glob')
const Sqlite3 = require('better-sqlite3')
const yaml = require('js-yaml')

let basePath
let subcommand

/**
 *
 */
class MetaData {
  constructor (filePath) {
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
     * The extension of the file.
     * @type {string}
     */
    this.extension = path.extname(filePath).replace('.', '')

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
    const infoFile = this.path + '.yml'
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

  list () {
    return this.db
      .prepare('SELECT * FROM files')
      .all()
  }

  /**
   * Delete all rows from the table “hashes”.
   */
  flush () {
    this.db.prepare('DELETE FROM hashes').run()
  }
}

commander
  .version(require('../package.json').version)
  .option('--base-path <base-path>')

commander
  .command('update')
  .alias('u')
  .action(() => { subcommand = 'update' })

commander
  .command('list')
  .alias('l')
  .action(() => { subcommand = 'list' })

commander.parse(process.argv)

let dbFile
if (commander.basePath) {
  basePath = commander.basePath
  dbFile = path.join(basePath, 'files.db')
}

const sqlite = new Sqlite(dbFile)

if (subcommand === 'update') {
  const files = glob.sync(path.join(basePath, '**/*'), { ignore: ['**/*.db'] })
  for (const file of files) {
    if (!fs.lstatSync(file).isDirectory()) {
      const metaData = new MetaData(file)
      console.log(metaData)
      sqlite.update(metaData)
    }
  }
} else if (subcommand === 'list') {
  const result = sqlite.list()
  console.log(result)
}
