/**
 * @file Assemble all submodules and export to command.js
 */

'use strict';

const fs = require('fs-extra');
const os = require('os');
const path = require('path');

const Check = require('./check.js');
var CheckChange = new Check();
const json = require('./json.js');
const mscx = require('./mscx.js');
const folderTree = require('./tree.js');
// For test purposes, to be able to overwrite “message” with rewire.
var message = require('./message.js');

/***********************************************************************
 * Build a TeX file (songs.tex) of all piano scores.
 **********************************************************************/

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

/***********************************************************************
 * index
 **********************************************************************/

const configDefault = {
  test: false,
  force: false
};

var config = {};

/**
 * By default this module reads the config file ~/.baldr to
 * generate its config object.
 * @param {object} newConfig - An object containing the same properties as the
 * config object.
 */
var bootstrapConfig = function(newConfig=false) {

  let {status, unavailable} = mscx.checkExecutables([
    'mscore-to-eps.sh',
    'pdf2svg',
    'pdfcrop',
    'pdfinfo',
    'pdftops',
    mscx.getMscoreCommand()
  ]);

  if (!status) {
    let e = new Error(
      'Some dependencies are not installed: “' +
      unavailable.join('”, “') +
      '”'
    );
    e.name = 'UnavailableCommandsError';
    throw e;
  }

  // default object
  config = configDefault;

  // config file
  var configFile = path.join(os.homedir(), '.baldr.json');
  var configFileExits = fs.existsSync(configFile);
  if (configFileExits) {
    config = Object.assign(config, require(configFile).songbook);
  }

  // function parameter
  if (newConfig) {
    config = Object.assign(config, newConfig);
  }

  if (!config.path || config.path.length === 0) {
    message.noConfigPath();
  }

  CheckChange.init(path.join(config.path, 'filehashes.db'));
};

/**
 * External function for command line usage.
 */
var setTestMode = function() {
  config.test = true;
  config.path = path.resolve('test', 'songs', 'clean', 'some');
};

/**
 * Wrapper function for all process functions for one folder.
 * @param {string} folder - A song folder.
 */
var processSongFolder = function(folder) {
  let status = {changed: {}, generated: {}};

  status.folder = folder;
  status.folderName = path.basename(folder);
  status.info = folderTree.getSongInfo(folder);

  status.force = config.force;
  status.changed.slides = CheckChange.do(
    path.join(folder, 'projector.mscx')
  );
  // projector
  if (config.force || status.changed.slides) {
    status.generated.projector = mscx.generatePDF(folder, 'projector');
    status.generated.slides = mscx.generateSlides(folder);
  }

  if (
      CheckChange.do(path.join(folder, 'lead.mscx')) ||
      CheckChange.do(path.join(folder, 'piano.mscx'))
    ) {
      status.changed.piano = true;
    }
    else {
      status.changed.piano = false;
    }

  // piano
  if (config.force || status.changed.piano) {
    status.generated.piano = mscx.generatePianoEPS(folder);
  }
  return status;
};

var updateSongFolder = function(folder) {
  message.songFolder(
    processSongFolder(folder)
  );
};

/**
 * Update and generate when required media files for the songs.
 */
var update = function() {
  mscx.gitPull(config.path);
  folderTree.flat(config.path).forEach(updateSongFolder);
  json.generateJSON(config.path);
  generateTeX(config.path);
};

/**
 *
 */
var cleanFiles = function(folder, files) {
  files.forEach(
    (file) => {
      fs.removeSync(path.join(folder, file));
    }
  );
};

/**
 * Clean all temporary files in a song folder.
 * @param {string} folder - A song folder.
 */
var cleanFolder = function(folder) {
  cleanFiles(folder, [
    'piano',
    'slides',
    'projector.pdf'
  ]);
};

/**
 * Clean all temporary media files.
 */
var clean = function() {
  folderTree.flat(config.path).forEach(cleanFolder);

  cleanFiles(config.path, [
    'songs.json',
    'songs.tex',
    'filehashes.db'
  ]);
};

exports.bootstrapConfig = bootstrapConfig;
exports.clean = clean;
exports.generateJSON = function() {json.generateJSON(config.path);};
exports.generateTeX = function() {generateTeX(config.path);};
exports.setTestMode = setTestMode;
exports.update = update;
exports.updateSongFolder = updateSongFolder;
