
const assert = require('assert')
const fs = require('fs-extra')
const path = require('path')
const tmp = require('tmp')
const util = require('util')

exports.assertExists = function () {
  let file = path.join.apply(null, arguments)
  assert.ok(fs.existsSync(file), util.format('File exists not: %s', file))
}

exports.assertNotExists = function () {
  let file = path.join.apply(null, arguments)
  assert.ok(!fs.existsSync(file), util.format('File exists: %s', file))
}

let mkTmpDir
exports.mkTmpDir = mkTmpDir = function () {
  return tmp.dirSync().name
}

exports.mkTmpFile = function () {
  return tmp.fileSync().name
}

/**
 * @param {number} pianoFilesCount - Number of piano files
 */
let fakeSong = function (pianoFilesCount) {
  return {
    title: `${pianoFilesCount} piano file(s)`,
    pianoFiles: {
      length: pianoFilesCount
    }
  }
}

/**
 * @param {object} config
 * <code><pre>
 * let config = {
 *   number-of-piano-files: number-of-songs,
 * }
 * </pre><code>
 * <code><pre>
 * let config = {
 *   1: 4,
 *   2: 2,
 *   3: 3,
 *   4: 2
 * }
 * </pre><code>
 */
exports.fakeSongs = function (config) {
  let songs = []
  // Level 1: countCategory
  for (let numberPianoFiles in config) {
    // Level 2: numberOfSongs
    let numberOfSongs = config[numberPianoFiles]
    for (let i = 1; i <= numberOfSongs; i++) {
      songs.push(fakeSong(numberPianoFiles))
    }
  }
  return songs
}

/**
 *
 * @param {string} folder1 - “processed” or “clean”
 * @param {string} folder2 - “some” or “one”
 *
 * @return {string} Path of the temporary directory.
 */
exports.tmpCopy = function (folder1, folder2) {
  let tmpDir = mkTmpDir()
  fs.copySync(path.resolve(__dirname, 'songs', folder1, folder2), tmpDir)
  return tmpDir
}

/**
 * String containing ANSI escape sequences are not working with Visual Studio Code’s Test Explorer.
 *
 * @param {string} string
 *
 * @returns {string} A cleaned string
 */
exports.removeANSI = function (string) {
  return string.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '') // eslint-disable-line
}

/**
 * @param {...string} pathSegments - Path segments relative to the test folder.
 *
 * @return {string}
 */
exports.readPathSegments = function (pathSegments) {
  return fs.readFileSync(path.join('test', ...arguments), 'utf8')
}

/**
 * @param {...string} pathSegments - Path segments relative to the test folder.
 *
 * @return {string}
 */
exports.read = function (filePath) {
  return fs.readFileSync(filePath, 'utf8')
}
