/* jshint esversion: 6 */

'use strict';

const path = require('path');
const sqlite3 = require('better-sqlite3');
const crypto = require('crypto');
const fs = require('fs');

var Sqlite = function(dbFile) {
  this.dbFile = dbFile;
}

Sqlite.prototype.initialize = function() {
  this.db = new sqlite3(this.dbFile);
  this.db
    .prepare(
      "CREATE TABLE IF NOT EXISTS hashes (filename TEXT UNIQUE, hash TEXT)"
    )
    .run();

  this.db
    .prepare("CREATE INDEX filename ON hashes(filename)")
    .run();
}

Sqlite.prototype.insert = function(filename, hash) {
  try {
    this.db
      .prepare('INSERT INTO hashes values ($filename, $hash)')
      .run({"filename": filename, "hash": hash});
  }
  catch (e) {
    return e;
  }
}

Sqlite.prototype.select = function(filename) {
  return this.db
    .prepare('SELECT * FROM hashes WHERE filename = $filename')
    .get({"filename": filename});
}

Sqlite.prototype.update = function(filename, hash) {
  this.db
    .prepare("UPDATE hashes SET hash = $hash WHERE filename = $filename")
    .run({"filename": filename, "hash": hash});

}

/**
 *
 */
var hashSHA1 = function(filename) {
  return crypto
    .createHash('sha1')
    .update(
      fs.readFileSync(filename)
    )
    .digest('hex');
}

var CheckChange = function() {
  this.db = {};
}

CheckChange.prototype.init = function(dbFile) {
  this.db = new Sqlite(dbFile);
  this.db.initialize();
  return this.db;
}

/**
 * Check for file modifications
 * @param {string} filename - Path to the file.
 * @returns {boolean}
 */
CheckChange.prototype.do = function(filename) {
  filename = path.resolve(filename);
  if (!fs.existsSync(filename)) {
    return false;
  }

  var hash = hashSHA1(filename);
  var row = this.db.select(filename);

  if (row) {
    var hashStored = row.hash;
  } else  {
    this.db.insert(filename, hash);
    var hashStored = '';
  }
  if (hash != hashStored) {
    this.db.update(filename, hash);
    return true;
  }
  else {
    return false;
  }
};

module.exports = CheckChange;
