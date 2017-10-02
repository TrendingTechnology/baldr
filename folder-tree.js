/* jshint esversion: 6 */

/**
 * @file Retrieve a object representation of a song folder tree.
 * <pre><code>
 * .
 * ├── a
 * │   ├── Aint-she-sweet
 * │   │   ├── info.json
 * │   │   ├── piano
 * │   │   │   └── piano.mscx
 * │   │   ├── piano.mscx
 * │   │   ├── projector.mscx
 * │   │   ├── projector.pdf
 * │   │   └── slides
 * │   │       ├── 01.svg
 * │   │       └── 02.svg
 * │   ├── Altes-Fieber
 * │   │   ├── info.json
 * │   │   ├── lead.mscx
 * │   │   ├── piano
 * │   │   │   └── piano.mscx
 * │   │   ├── projector.mscx
 * │   │   ├── projector.pdf
 * │   │   └── slides
 * │   │       ├── 01.svg
 * │   │       ├── 02.svg
 * │   │       ├── 03.svg
 * │   │       ├── 04.svg
 * │   │       ├── 05.svg
 * │   │       └── 06.svg
 * </code></pre>
 */

'use strict';

const fs = require('fs');
const path = require('path');

/**
 * @param {string} folder - Absolute path to a song folder.
 */
var getSongInfo = function(folder) {
  var jsonFile = path.join(folder, 'info.json');
  if (fs.existsSync(jsonFile)) {
    return JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
  }
  else {
    return false;
  }
};

/**
 * @param {string} folder - Absolute path.
 * @param {string} filter - String to filter.
 */
var getFolderFiles = function(folder, filter) {
  if (fs.existsSync(folder)) {
    return fs.readdirSync(folder).filter((file) => {
      return file.indexOf(filter) > -1 ? true : false;
    });
  }
  else {
    return [];
  }
};

/**
 * Return the folder that might contain MuseScore files.
 * @param {string} basePath - Basepath to the songbook tree.
 * @return {array} Array of folder paths.
 */
var getSongFolders = function(basePath, folder) {
  var absPath = path.join(basePath, folder);
  var folders = fs.readdirSync(absPath);
  return folders.filter(
    (file) => {
      if (
           fs.statSync(path.join(absPath, file)).isDirectory() &&
           file.substr(0, 1) != '_' &&
           file.substr(0, 1) != '.'
         ) {
        return true;
      }
      else {
        return false;
      }
    }
  );
};

/**
 * @param {string} basePath - Basepath to the songbook tree.
 */
var getABCFolders = function(basePath) {
  var abc = '0abcdefghijklmnopqrstuvwxyz'.split('');
  return abc.filter((file) => {
    var folder = path.join(basePath, file);
    if (fs.existsSync(folder) && fs.statSync(folder).isDirectory()) {
      return true;
    }
    else {
      return false;
    }
  });
};

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
var getTree = function(basePath) {
  var tree = {};
  getABCFolders(basePath).forEach((abc) => {
    var folders = {};
    getSongFolders(basePath, abc).forEach((song) => {
      folders[song] = {};
    });
    tree[abc] = folders;
  });
  return tree;
};

/**
 * @return {array} Array of folder paths.
 */
var flattenTree = function(tree) {
  var flattFolders = [];
  Object.keys(tree).forEach((abc, index) => {
    Object.keys(tree[abc]).forEach((folder, index) => {
      flattFolders.push(path.join(abc, folder));
    });
  });
  return flattFolders;
};

/**
 * @param {string} basePath - Basepath to the songbook tree.
 * @return {array} Array of folder paths.
 */
var flat = function(basePath) {
  return flattenTree(
    getTree(basePath)
  ).map(folder => path.join(basePath, folder));
};

exports.getSongInfo = getSongInfo;
exports.getFolderFiles = getFolderFiles;
exports.getTree = getTree;
exports.flattenTree = flattenTree;
exports.flat = flat;
