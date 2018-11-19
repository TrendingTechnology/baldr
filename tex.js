/**
 * @file Build a TeX file (songs.tex) of all piano scores.
 */

'use strict';

const folderTree = require('./tree.js');
const fs = require('fs-extra');
const path = require('path');

/**
 *
 */
var texCmd = function(command, value) {
  return '\\tmp' + command + '{' + value  + '}\n';
};

/**
 * Generate TeX markup for one song.
 *
 * @param {string} basePath Base path of the song collection.
 * @param {string} songFolder Path of a single song.
 * @return {string} TeX markup for a single song.
 * <code><pre>
 * \tmpheading{Swing low}
 * \tmpimage{s/Swing-low/piano/piano_1.eps}
 * \tmpimage{s/Swing-low/piano/piano_2.eps}
 * \tmpimage{s/Swing-low/piano/piano_3.eps}
 * </pre><code>
 */
var texSong = function(basePath, songPath) {
  basePath = path.resolve(basePath);
  songPath = path.resolve(songPath);
  let relativeSongPath = songPath
    .replace(basePath, '')
    .replace(/^\//, '');
  const info = folderTree.getSongInfo(songPath);
  const eps = folderTree.getFolderFiles(path.join(songPath, 'piano'), '.eps');
  var output = '';

  if (info.hasOwnProperty('title') && eps.length > 0) {
    output += '\n' + texCmd('heading', info.title);
    eps.forEach(
      (file) => {
        output += texCmd('image', path.join(relativeSongPath, 'piano', file));
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
  var texFile = path.join(basePath, 'songs.tex');
  const tree = folderTree.getTree(basePath);
  fs.removeSync(texFile);

  Object.keys(tree).forEach((abc, index) => {
    fs.appendFileSync(texFile, texABC(abc));

    Object.keys(tree[abc]).forEach((folder, index) => {
      fs.appendFileSync(texFile, texSong(basePath, path.join(basePath, abc, folder)));
    });
  });
};
exports.generateTeX = generateTeX;
