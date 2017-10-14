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
const tex = require('./tex.js');
const tree = require('./tree.js');
// For test purposes, to be able to overwrite “message” with rewire.
var message = require('./message.js');

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
  status.info = tree.getSongInfo(folder);

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
  tree.flat(config.path).forEach(updateSongFolder);
  json.generateJSON(config.path);
  tex.generateTeX(config.path);
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
  tree.flat(config.path).forEach(cleanFolder);

  cleanFiles(config.path, [
    'songs.json',
    'songs.tex',
    'filehashes.db'
  ]);
};

exports.bootstrapConfig = bootstrapConfig;
exports.clean = clean;
exports.generateJSON = function() {json.generateJSON(config.path);};
exports.generateTeX = function() {tex.generateTeX(config.path);};
exports.setTestMode = setTestMode;
exports.update = update;
exports.updateSongFolder = updateSongFolder;
