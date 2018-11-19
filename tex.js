/**
 * @file Build a TeX file (songs.tex) of all piano scores.
 */

'use strict';

const folderTree = require('./tree.js');
const fs = require('fs-extra');
const path = require('path');

/**
 * Build a tree object which contains the number of piano files of
 * each song. This tree is necessary to avoid page breaks on multipage
 * piano scores.
 *
 * @param {object} tree The object of songs.json
 * @param {string} basePath Base path of the song collection.
 * @return {object}
 * <code><pre>
 * { a: { '3': { 'Auf-der-Mauer_auf-der-Lauer': [Object] } },
 *   s:
 *    { '1': { 'Stille-Nacht': [Object] },
 *      '3': { 'Swing-low': [Object] } },
 *   z: { '2': { 'Zum-Tanze-da-geht-ein-Maedel': [Object] } } }
 * </pre><code>
 *
 * One song entry has following properties:
 *
 * <code><pre>
 * { title: 'Swing low',
 *   folder: '/test/songs/processed/some/s/Swing-low',
 *   slides: [ '01.svg', '02.svg', '03.svg' ],
 *   pianoFiles: [ 'piano_1.eps', 'piano_2.eps', 'piano_3.eps' ] }
 * </pre><code>
 */
var buildPianoFilesCountTree = function(tree, basePath) {
  let output = {};
  Object.keys(tree).forEach((abc, index) => {
    Object.keys(tree[abc]).forEach((songFolder, index) => {
      let absSongFolder = path.join(basePath, abc, songFolder, 'piano');
      let pianoFiles = folderTree.getFolderFiles(absSongFolder, '.eps');
      let count = pianoFiles.length;
      if (!(abc in output)) output[abc] = {};
      if (!(count in output[abc])) output[abc][count] = {};
      output[abc][count][songFolder] = tree[abc][songFolder];
      output[abc][count][songFolder].pianoFiles = pianoFiles;
    });
  });
  return output;
};

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
