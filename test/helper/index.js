/**
 * @file Helper module for unit testing baldr.
 * @module baldr-test
 */

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const { JSDOM } = require('jsdom')
const rewire = require('rewire')
const { getConfig } = require('baldr-library')
const { Environment } = require('baldr-application')

/**
 * Resolves a sequence of paths or path segments into an absolute path
 * of a file in the “src” folder.
 *
 *     let path = srcPath('lib', 'player.js');
 *
 * @param {...string} paths A sequence of path segments
 *
 * @returns {string} Absolute path of a file in the “src” folder.
 */
exports.srcPath = function () {
  return path.join(__dirname, '..', '..', 'src', ...arguments)
}

/**
 * Require a file as a module in the “src” folder.
 *
 *     const player = requireFile('lib', 'player.js');
 *
 * @param {...string} paths A sequence of path segments
 *
 * @returns {object} The required module.
 */
exports.requireFile = function () {
  return require(exports.srcPath(...arguments))
}

const { getMasters } = exports.requireFile('app', 'masters.js')

/**
 *
 */
exports.assert = assert

/**
 *
 */
exports.fs = fs

/**
 *
 */
exports.path = path

/**
 *
 */
exports.rewire = rewire

/**
 *
 */
exports.allMasters = [
  'audio',
  'camera',
  'editor',
  'image',
  'markdown',
  'person',
  'question',
  'quote',
  'svg',
  'video',
  'website'
]

/**
 *
 */
exports.allThemes = [
  'default',
  'handwriting'
]

/**
 *
 */
exports.makeDOM = function (html) {
  return new JSDOM(html).window.document
}

/**
 * The document object (DOM) of the file “render.html”.
 * @type {module:baldr-application~Document}
 */
exports.document = exports.makeDOM(
  fs.readFileSync(
    path.join(__dirname, '..', '..', 'render.html'),
    'utf8'
  )
)

/**
 *
 */
exports.getDOM = function () {
  return exports.makeDOM(
    fs.readFileSync(
      path.join(__dirname, '..', '..', 'render.html'),
      'utf8'
    )
  )
}

/**
 * Absolute path of the minimal baldr session file.
 * @type {string}
 */
exports.testFileMinimal = path.resolve('test', 'files', 'minimal.baldr')

/**
 * @returns {module:baldr-application~Environment}
 */
exports.freshEnv = function () {
  return new Environment([exports.testFileMinimal], exports.getDOM())
}

/**
 * Low level environment data.
 * @type {module:baldr-application~Environment}
 */
exports.env = exports.freshEnv()

/**
 * `config` object of the test file
 * {@link module:baldr-test.testFileMinimal testFileMinimal}.
 *
 * @type {module:baldr-library/config~Config}
 *
 * @see module:baldr-test.testFileMinimal
 */
exports.config = getConfig([exports.testFileMinimal])

/**
 * Clone the `config` object {@link module:baldr-test.config}
 *
 * @return {module:baldr-library/config~Config}
 */
exports.cloneConfig = function () {
  return Object.assign({}, exports.config)
}

/**
 * All available master slides.
 * @type {module:baldr-application/masters~Masters}
 */
exports.masters = getMasters(exports.document)

/**
 *
 */
class Spectron {
  /**
   *
   */
  constructor (baldrFile) {
    if (process.platform === 'linux') {
      this.appPath = 'dist/linux-unpacked/baldr'
    } else if (process.platform === 'darwin') {
      this.appPath = 'dist/mac/baldr.app/Contents/MacOS/baldr'
    }
    let { Application } = require('spectron')
    let config = {
      path: this.appPath
    }
    if (baldrFile) config.args = [baldrFile]
    this.app = new Application(config)
  }

  /**
   *
   */
  getApp () {
    return this.app
  }

  /**
   *
   */
  start () {
    return this.app.start()
  }

  /**
   *
   */
  stop () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  }
}

exports.Spectron = Spectron
