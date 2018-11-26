/**
 * @file Build a json file (songs.json) containing all slide files.
 */

'use strict'

const fs = require('fs')
const path = require('path')
const tree = require('./tree.js')
const yaml = require('js-yaml')

/**
 *
 * @param {string} songPath - Path of the song folder.
 */
var generateSongJSON = function (songPath) {
  var ymlFile = path.join(songPath, 'info.yml')
  if (fs.existsSync(ymlFile)) {
    var info = yaml.safeLoad(
      fs.readFileSync(ymlFile, 'utf8')
    )
    info.folder = songPath
    info.slides = tree.getFolderFiles_(
      path.join(songPath, 'slides'),
      '.svg'
    )

    if (info.title) {
      return info
    } else {
      return false
    }
  } else if (fs.lstatSync(songPath).isDirectory()) {
    return false
  }
}

/**
 *
 * @param {string} basePath - Basepath to the songbook tree.
 */
var generateJSON = function (basePath) {
  var folderTree = tree.getTree(basePath)

  Object.keys(folderTree).forEach((alpha, index) => {
    Object.keys(folderTree[alpha]).forEach((folder, index) => {
      folderTree[alpha][folder] = generateSongJSON(
        path.join(basePath, alpha, folder)
      )
    })
  })

  fs.writeFileSync(
    path.join(basePath, 'songs.json'),
    JSON.stringify(folderTree, null, 4)
  )
  return folderTree
}

/**
 *
 * @param {string} basePath - Basepath to the songbook tree.
 * @returns {object}
 */
var readJSON = function (basePath) {
  return JSON.parse(
    fs.readFileSync(
      path.join(basePath, 'songs.json'), 'utf8'
    )
  )
}

exports.generateJSON = generateJSON
exports.readJSON = readJSON
