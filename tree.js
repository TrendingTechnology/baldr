/**
 * @file Retrieve a object representation of a song folder tree.
 */

'use strict'

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

/**
 * @param {string} folder - Absolute path to a song folder.
 */
let getSongInfo = function (folder) {
  let ymlFile = path.join(folder, 'info.yml')
  if (fs.existsSync(ymlFile)) {
    return yaml.safeLoad(fs.readFileSync(ymlFile, 'utf8'))
  } else {
    return false
  }
}

/**
 * @param {string} folder - Absolute path.
 * @param {string} filter - String to filter.
 */
let getFolderFiles_ = function (folder, filter) {
  if (fs.existsSync(folder)) {
    return fs.readdirSync(folder).filter((file) => {
      return file.indexOf(filter) > -1
    })
  } else {
    return []
  }
}

/**
 * Return the folder that might contain MuseScore files.
 * @param {string} basePath - Basepath to the songbook tree.
 * @return {array} Array of folder paths.
 */
let getSongFolders = function (basePath, folder) {
  let absPath = path.join(basePath, folder)
  let folders = fs.readdirSync(absPath)
  return folders.filter(
    (file) => {
      if (
        fs.statSync(path.join(absPath, file)).isDirectory() &&
           file.substr(0, 1) !== '_' &&
           file.substr(0, 1) !== '.'
      ) {
        return true
      } else {
        return false
      }
    }
  )
}

/**
 * @param {string} basePath - Basepath to the songbook tree.
 */
let getABCFolders = function (basePath) {
  let abc = '0abcdefghijklmnopqrstuvwxyz'.split('')
  return abc.filter((file) => {
    let folder = path.join(basePath, file)
    if (fs.existsSync(folder) && fs.statSync(folder).isDirectory()) {
      return true
    } else {
      return false
    }
  })
}

/**
 * @param {string} basePath - Basepath to the songbook tree.
 * <pre><code>
 * {
 *   "a": {
 *     "Auf-der-Mauer_auf-der-Lauer": {}
 *   },
 *   "s": {
 *     "Stille-Nacht": {},
 *     "Swing-low": {}
 *   },
 *   "z": {
 *     "Zum-Tanze-da-geht-ein-Maedel": {}
 *   }
 * }
 * </code></pre>
 */
let getTree = function (basePath) {
  let tree = {}
  getABCFolders(basePath).forEach((abc) => {
    let folders = {}
    getSongFolders(basePath, abc).forEach((song) => {
      folders[song] = {}
    })
    tree[abc] = folders
  })
  return tree
}

/**
 * @return {array} Array of folder paths.
 */
let flattenTree = function (tree) {
  let flattFolders = []
  Object.keys(tree).forEach((abc, index) => {
    Object.keys(tree[abc]).forEach((folder, index) => {
      flattFolders.push(path.join(abc, folder))
    })
  })
  return flattFolders
}

/**
 * @param {string} basePath - Basepath to the songbook tree.
 * @return {array} Array of folder paths.
 */
let flat = function (basePath) {
  return flattenTree(
    getTree(basePath)
  ).map(folder => path.join(basePath, folder))
}

exports.getSongInfo = getSongInfo
exports.getFolderFiles_ = getFolderFiles_
exports.getTree = getTree
exports.flattenTree = flattenTree
exports.flat = flat
