#! /usr/bin/env node

// Node packages.
const fs = require('fs')
const path = require('path')

// Third party packages.
const commander = require('commander')
const glob = require('glob')
const Sqlite3 = require('better-sqlite3')

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
     *
     */
    this.db = new Sqlite3(this.dbFile)
    this.prepare_(
        `CREATE TABLE IF NOT EXISTS files (
          path TEXT UNIQUE,
          filename TEXT,
          id TEXT,
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

  update (path, filename, id, data) {
    this.prepare_(
      'INSERT OR IGNORE INTO files (path) VALUES ($path)',
      { path: path }
    )

    this.prepare_(`
      UPDATE files
        SET
          path = $path,
          filename = $filename,
          id = $id,
          data = $data
        WHERE path = $path
      `,
      {
        path: path,
        filename: filename,
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

function update () {

}

let sqlite
let basePath

let subcommand

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
sqlite = new Sqlite(dbFile)

if (subcommand === 'update') {
  const files = glob.sync(path.join(basePath, '**/*'), { ignore: ['**/*.db'] })
  for (const file of files) {
    if (!fs.lstatSync(file).isDirectory()) {
      console.log(file)
      sqlite.update(file, path.basename(file), 'id', '{"data": "data"}')
    }
  }
} else if (subcommand === 'list') {
  const result = sqlite.list()
  console.log(result)
}