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
const packager = require('electron-packager')

/**
 * Require a file as a module in the “src” folder.
 *
 * @param {string} packageName - The name of package.
 * @param {...string} pathSegment - A sequence of path segments.
 *
 * @returns {string} The path of the required file inside the package.
 */
exports.packageFilePath = function (packageName, pathSegment) {
  let segments = Array.from(arguments).slice(1)
  return path.join(path.dirname(require.resolve(packageName)), ...segments)
}

/**
 * Require a file of a node package-
 *
 *     const player = requireFile('@bldr/core', 'player.js');
 *
 * @param {string} packageName - The name of package.
 * @param {...string} pathSegment - A sequence of path segments.
 *
 * @returns {object} The required module.
 */
exports.requireFile = function (packageName, fileName) {
  return require(exports.packageFilePath(...arguments))
}

const { getMasters } = exports.requireFile('@bldr/core', 'masters.js')

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
    path.join(__dirname, '..', '..', 'src', 'electron-app', 'render.html'),
    'utf8'
  )
)

/**
 *
 */
exports.getDOM = function () {
  return exports.makeDOM(
    fs.readFileSync(
      path.join(__dirname, '..', '..', 'src', 'electron-app', 'render.html'),
      'utf8'
    )
  )
}

/**
 * Absolute path of the minimal baldr session file.
 * @type {string}
 */
exports.testFileMinimal = path.resolve(__dirname, '..', 'files', 'minimal.baldr')

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
 * Launch an Electron app using the testing framework Spectron.
 */
class Spectron {
  /**
   *
   */
  constructor (packageName, baldrFile) {
    this.packagePath = path.dirname(require.resolve(packageName))
    let packageJson = require(path.join(this.packagePath, 'package.json'))
    let electronName = packageJson.name.replace('/', '-')
    this.appName = util.format('%s-%s-%s', electronName, process.platform, process.arch)
    let distFolder = path.join(packagePath, 'dist')
    let darwinPath = []
    if (process.platform === 'darwin') {
      darwinPath = [electronName + '.app', 'Contents', 'MacOS']
    }
    let appPath = path.join(distFolder, appName, ...darwinPath, packageName)

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
   * Build the Electron app using the package “electron-packager”
   *
   * @param {string} packageName - Path of the package Folder
   * @param {boolean} force - Force the building for the app
   */
  buildElectronApp (packageName, force = false) {

    if (!fs.existsSync(appPath) || force) {
      // derefSymlinks: lerna symlinks the some dependencies.
      // This symlinks are broken without the option derefSymlinks in the folder
      // packages/electron-app/dist/@bldr-songbook-electron-app-linux-x64/resources/app/node_modules/@bldr
      packager({
        dir: packagePath,
        out: distFolder,
        prune: false,
        derefSymlinks: true,
        overwrite: true,
        arch: process.arch,
        icon: path.join(packagePath, 'icon.icns'),
        appVersion: packageJson.version
      })
    }
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

exports.buildElectronApp = buildElectronApp
exports.Spectron = Spectron
