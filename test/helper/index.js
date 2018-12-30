/**
 * @file Helper module for unit testing baldr.
 * @module @bldr/test-helper
 */

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const { JSDOM } = require('jsdom')
const rewire = require('rewire')
const { getConfig } = require('@bldr/library')
const { Environment } = require('@bldr/electron-app')

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
 * @type {module:@bldr/electron-app~Document}
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
 * @returns {module:@bldr/electron-app~Environment}
 */
exports.freshEnv = function () {
  return new Environment([exports.testFileMinimal], exports.getDOM())
}

/**
 * Low level environment data.
 * @type {module:@bldr/electron-app~Environment}
 */
exports.env = exports.freshEnv()

/**
 * `config` object of the test file
 * {@link module:@bldr/test-helper.testFileMinimal testFileMinimal}.
 *
 * @type {module:@bldr/library/config~Config}
 *
 * @see module:@bldr/test-helper.testFileMinimal
 */
exports.config = getConfig([exports.testFileMinimal])

/**
 * Clone the `config` object {@link module:@bldr/test-helper.config}
 *
 * @return {module:@bldr/library/config~Config}
 */
exports.cloneConfig = function () {
  return Object.assign({}, exports.config)
}

/**
 * All available master slides.
 * @type {module:@bldr/electron-app/masters~Masters}
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
