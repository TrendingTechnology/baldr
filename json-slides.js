/* jshint esversion: 6 */

'use strict';

const path = require('path');
const fs = require('fs');
const tree = require('./folder-tree.js');

/**
 *
 * @param {string} songPath - Path of the song folder.
 */
var generateSongJSON = function(songPath) {
  var jsonFile = path.join(songPath, 'info.json');
  if (fs.existsSync(jsonFile)) {
    var info = JSON.parse(
      fs.readFileSync(jsonFile, 'utf8')
    );
    info.folder = songPath;
    info.slides = tree.getFolderFiles(
      path.join(songPath, 'slides'),
      '.svg'
    );

    if (Boolean(info.title)) {
      return info;
    } else {
      return false;
    }
  }
  else if (fs.lstatSync(songPath).isDirectory()) {
    return false;
  }
}

/**
 *
 * @param {string} basePath - Basepath to the songbook tree.
 */
var generateJSON = function(basePath) {
  var folderTree = tree.getTree(basePath);

  Object.keys(folderTree).forEach((alpha, index) => {
    Object.keys(folderTree[alpha]).forEach((folder, index) => {
      folderTree[alpha][folder] = generateSongJSON(
        path.join(basePath, alpha, folder)
      );
    });
  });

  fs.writeFileSync(
    path.join(basePath, 'songs.json'),
    JSON.stringify(folderTree, null, 4)
  );
  return folderTree;
};

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
  );
};

exports.generateJSON = generateJSON;
exports.readJSON = readJSON;
