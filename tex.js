/**
 * @file Build a TeX file (songs.tex) of all piano scores.
 */

'use strict';

const folderTree = require('./folder-tree.js');
const fs = require('fs-extra');
const path = require('path');

/**
 *
 */
var texCmd = function(command, value) {
  return '\\tmp' + command + '{' + value  + '}\n';
};

/**
 *
 */
var texSong = function(folder) {
  const info = folderTree.getSongInfo(folder);
  const eps = folderTree.getFolderFiles(path.join(folder, 'piano'), '.eps');
  var output = '';

  if (info.hasOwnProperty('title') && eps.length > 0) {
    output += '\n' + texCmd('heading', info.title);
    var basename = path.basename(folder);
    eps.forEach(
      (file) => {
        output += texCmd('image', path.join(basename, 'piano', file));
      }
    );
  }
  return output;
};

/**
 *
 */
var texABC = function(abc) {
  return '\n\n' + texCmd('chapter', abc.toUpperCase());
};

/**
 * Generate TeX file for the piano version of the songbook
 * @param {string} basePath - Basepath to the songbook tree.
 */
var generateTeX = function(basePath) {
  var tex = path.join(basePath, 'songs.tex');
  const tree = folderTree.getTree(basePath);
  fs.removeSync(tex);

  Object.keys(tree).forEach((abc, index) => {
    fs.appendFileSync(tex, texABC(abc));

    Object.keys(tree[abc]).forEach((folder, index) => {
      fs.appendFileSync(tex, texSong(path.join(basePath, abc, folder)));
    });
  });
};
exports.generateTeX = generateTeX;
