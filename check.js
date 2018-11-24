/**
 * @file Export CheckChange() object
 */

'use strict'

const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const Sqlite3 = require('better-sqlite3')

class Sqlite {
  constructor (dbFile) {
    this.dbFile = dbFile
  }

  initialize () {
    this.db = new Sqlite3(this.dbFile)
    this.db
      .prepare(
        'CREATE TABLE IF NOT EXISTS hashes (filename TEXT UNIQUE, hash TEXT)'
      )
      .run()

    this.db
      .prepare('CREATE INDEX IF NOT EXISTS filename ON hashes(filename)')
      .run()
  }

  insert (filename, hash) {
    this.db
      .prepare('INSERT INTO hashes values ($filename, $hash)')
      .run({ 'filename': filename, 'hash': hash })
  }

  select (filename) {
    return this.db
      .prepare('SELECT * FROM hashes WHERE filename = $filename')
      .get({ 'filename': filename })
  }

  update (filename, hash) {
    this.db
      .prepare('UPDATE hashes SET hash = $hash WHERE filename = $filename')
      .run({ 'filename': filename, 'hash': hash })
  }
}

/**
 *
 */
var hashSHA1 = function (filename) {
  return crypto
    .createHash('sha1')
    .update(
      fs.readFileSync(filename)
    )
    .digest('hex')
}

class CheckChange {
  init (dbFile) {
    this.db = new Sqlite(dbFile)
    this.db.initialize()
  }

  /**
   * Check for file modifications
   * @param {string} filename - Path to the file.
   * @returns {boolean}
   */
  do (filename) {
    filename = path.resolve(filename)
    if (!fs.existsSync(filename)) {
      return false
    }

    var hash = hashSHA1(filename)
    var row = this.db.select(filename)
    var hashStored = ''

    if (row) {
      hashStored = row.hash
    } else {
      this.db.insert(filename, hash)
    }
    if (hash !== hashStored) {
      this.db.update(filename, hash)
      return true
    } else {
      return false
    }
  }
}

module.exports = CheckChange
