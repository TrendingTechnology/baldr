/**
 * @file Helper module for unit testing baldr.
 * @module @bldr/test-helper
 */

// Node packages.
const assert = require('assert')
const fs = require('fs')
const path = require('path')
const process = require('process')
const util = require('util')

// Third party packages.
const { JSDOM } = require('jsdom')
const rewire = require('rewire')
const packager = require('electron-packager')
const { Application } = require('spectron')

// Project packages.
const { getConfig } = require('@bldr/foundation-master')
const { Environment } = require('@bldr/core')

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

let renderHTMLPath = path.join(path.dirname(require.resolve('@bldr/electron-app')), 'render.html')

/**
 * The document object (DOM) of the file “render.html”.
 * @type {module:@bldr/core~Document}
 */
exports.document = exports.makeDOM(
  fs.readFileSync(renderHTMLPath, 'utf8')
)

/**
 *
 */
exports.getDOM = function () {
  return exports.makeDOM(
    fs.readFileSync(renderHTMLPath, 'utf8')
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
   * @param {string} packageName - The name of a node package which contains
   *   code to build a electron app from.
   * @param {string} baldrFile - The path of a BALDR file.
   */
  constructor (packageName, baldrFile = false) {
    /**
     * Absolute path to the node package to build an electron app with.
     *
     * @type {string}
     */
    this.packagePath = path.dirname(require.resolve(packageName))

    /**
     * The `package.json` of the node package to build an electron app with
     * as an object.
     *
     * @type {object}
     */
    this.packageJson = require(path.join(this.packagePath, 'package.json'))
    let electronName = this.packageJson.name.replace('/', '-')

    /**
     *
     */
    this.appName = util.format('%s-%s-%s', electronName, process.platform, process.arch)

    /**
     * The destination folder to build the electron app into.
     *
     * @type {string}
     */
    this.distFolder = path.join(this.packagePath, 'dist')
    let darwinPath = []
    if (process.platform === 'darwin') {
      darwinPath = [electronName + '.app', 'Contents', 'MacOS']
    }

    /**
     * @type {string}
     */
    this.appPath = path.join(this.distFolder, this.appName, ...darwinPath, electronName)

    let config = {
      path: this.appPath
    }
    if (baldrFile) config.args = [baldrFile]

    /**
     *
     */
    this.app = new Application(config)
  }

  /**
   * Build the Electron app using the package “electron-packager”
   *
   * @param {boolean} force - Force the building for the app
   */
  buildElectronApp (force = false) {
    if (!fs.existsSync(this.appPath) || force) {
      // derefSymlinks: lerna symlinks the some dependencies.
      // This symlinks are broken without the option derefSymlinks in the folder
      // packages/electron-app/dist/@bldr-songbook-electron-app-linux-x64/resources/app/node_modules/@bldr
      return packager({
        dir: this.packagePath,
        out: this.distFolder,
        prune: false,
        derefSymlinks: true,
        overwrite: true,
        arch: process.arch,
        icon: path.join(this.packagePath, 'icon.icns'),
        appVersion: this.packageJson.version
      })
    } else {
      return new Promise((resolve, reject) => {
        resolve()
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
   * Start the electron app. If the electron apps doesn’t exist, create it
   * first.
   *
   * @param {boolean} rebuild - Rebuild the electron on every test.
   */
  start (rebuild = false) {
    return this.buildElectronApp(rebuild).then(() => {
      return this.app.start()
    })
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
