/**
 * @file Helper module for unit testing baldr.
 * @module @bldr/test-helper
 */

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const { JSDOM } = require('jsdom')
const rewire = require('rewire')
const { getConfig } = require('@bldr/foundation-master')
const { Environment } = require('@bldr/core')
const process = require('process')
const util = require('util')

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
 * @type {module:@bldr/core~Document}
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
 * @returns {module:@bldr/core~Environment}
 */
exports.freshEnv = function () {
  return new Environment([exports.testFileMinimal], exports.getDOM())
}

/**
 * Low level environment data.
 * @type {module:@bldr/core~Environment}
 */
exports.env = exports.freshEnv()

/**
 * `config` object of the test file
 * {@link module:@bldr/test-helper.testFileMinimal testFileMinimal}.
 *
 * @type {module:@bldr/foundation-master/config~Config}
 *
 * @see module:@bldr/test-helper.testFileMinimal
 */
exports.config = getConfig([exports.testFileMinimal])

/**
 * Clone the `config` object {@link module:@bldr/test-helper.config}
 *
 * @return {module:@bldr/foundation-master/config~Config}
 */
exports.cloneConfig = function () {
  return Object.assign({}, exports.config)
}

/**
 * All available master slides.
 * @type {module:@bldr/core/masters~Masters}
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

/**
 * Build the Electron app using the package “electron-packager”
 *
 * @param {string} packageFolder - Path of the package Folder
 * @param {boolean} force - Force the building for the app
 */
function buildElectronApp (packageFolder, force = false) {
  let darwinPath = []
  if (process.platform === 'darwin') {
    darwinPath = [packageName + '.app', 'Contents', 'MacOS']
  }

  let packageJson = require(path.join(packageFolder, 'package.json'))
  let packageName = packageJson.name.replace('/', '-')
  let appName = util.format('%s-%s-%s', packageName, process.platform, process.arch)
  let distFolder = path.join(packageFolder, 'dist')
  let appPath = path.join(distFolder, appName, ...darwinPath, packageName)

  if (!fs.existsSync(appPath) || force) {
    // derefSymlinks: lerna symlinks the some dependencies.
    // This symlinks are broken without the option derefSymlinks in the folder
    // packages/electron-app/dist/@bldr-songbook-electron-app-linux-x64/resources/app/node_modules/@bldr
    return packager({
      dir: packageFolder,
      out: distFolder,
      prune: false,
      derefSymlinks: true,
      overwrite: true,
      arch: process.arch,
      icon: path.join(packageFolder, 'icon.icns'),
      appVersion: packageJson.version
    }).then(appPath => { return appPath })
  }
}

exports.buildElectronApp = buildElectronApp
exports.Spectron = Spectron
