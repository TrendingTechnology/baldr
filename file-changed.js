/* jshint esversion: 6 */

'use strict';

const path = require('path');
const sqlite3 = require('better-sqlite3');
const crypto = require('crypto');

var Sqlite = function(dbFile) {
  this.dbFile = dbFile;
}

Sqlite.prototype.initialize = function() {
  this.db = new sqlite3(this.dbFile);
  this.db
    .prepare("CREATE TABLE IF NOT EXISTS hashes (filename TEXT, hash TEXT)")
    .run();
}

Sqlite.prototype.insert = function(filename, hash) {
  this.db
    .prepare('INSERT INTO hashes values ($filename, $hash)')
    .run({"filename": filename, "hash": hash});
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
var hash = function(filename) {
  var hash = crypto
    .createHash('sha1')
    .update(
      fs.readFileSync(filename)
    )
    .digest('hex');
}

/**
 * Check for file modifications
 * @param {string} filename - Path to the file.
 * @returns {boolean}
 */
var fileChanged = function(filename) {
  filename = path.resolve(filename);
  if (!fs.existsSync(filename)) {
    return false;
  }

  var hash = crypto
    .createHash('sha1')
    .update(
      fs.readFileSync(filename)
    )
    .digest('hex');

  var row = config.db.prepare('SELECT * FROM hashes WHERE filename = $filename').get({filename: filename});

  if (row) {
    var hashStored = row.hash;
  } else  {
    config.db.prepare('INSERT INTO hashes values ($filename, $hash)').run({filename: filename, hash: hash});
    var hashStored = '';
  }
  if (hash != hashStored) {
    config.db.prepare("UPDATE hashes SET hash = $hash WHERE filename = $filename").run({filename: filename, hash: hash});
    return true;
  }
  else {
    return false;
  }
};

exports.Sqlite = Sqlite;
