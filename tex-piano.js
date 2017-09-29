/* jshint esversion: 6 */

/**
 * @file Build a TeX file of all piano scores.
 */

'use strict';

const path = require('path');
const folderTree = require('./folder-tree.js');

/**
 *
 */
var texCmd = function(command, value) {
  return '\\tmp' + command + '{' + value  + '}\n';
}

/**
 *
 */
var texSong = function(folder) {
  const info = folderTree.getSongInfo(folder);
  const eps = folderTree.getFolderFiles(path.join(folder, 'piano'), '.eps');
  var output = '';

  if (info.hasOwnProperty('title') && eps.length > 0) {
    output += texCmd('heading', info.title);
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
var texABC = function(alpha) {
  return '\n\n' + texCmd('chapter', alpha.toUpperCase());
}

/**
 * Generate TeX file for the piano version of the songbook
 */
var generateTeX = function() {
  var previousInitial;
  var initial;
  var TeXFile = p(config.path, config.tex);
  fs.removeSync(TeXFile);
  getSongFolders().forEach((folder) => {


  });
};
exports.generateTeX = generateTeX;
