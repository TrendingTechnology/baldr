'use strict';

const colors = require('colors');
const fs = require('fs-extra');
const os = require('os');
const path = require('path');

const Check = require('./file-changed.js');
var CheckChange = new Check();
const jsonSlides = require('./json-slides.js');
const mscxProcess = require('./mscx-process.js');
const tree = require('./folder-tree.js');

const warning = 'Warning! '.yellow;
const error = 'Error! '.red;

const configDefault = {
  json: 'songs.json',
  info: 'info.json',
  slidesFolder: 'slides',
  configFileName: '.html5-school-presentation.json',
  test: false,
  force: false,
  tex: 'songs.tex',
  pianoFolder: 'piano',
  pianoMScore: 'piano.mscx',
  leadMScore: 'lead.mscx'
};

var config = {};

/**
 * By default this module reads the config file ~/.html5-school-presentation to
 * generate its config object.
 * @param {object} newConfig - An object containing the same properties as the
 * config object.
 */
var bootstrapConfig = function(newConfig=false) {

  let {status, unavailable} = mscxProcess.checkExecutables([
    'mscore-to-eps.sh',
    'pdf2svg',
    'pdfcrop',
    'pdfinfo',
    'pdftops',
    mscxProcess.getMscoreCommand()
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
  var configFile = path.join(os.homedir(), '.html5-school-presentation.json');
  var configFileExits = fs.existsSync(configFile);
  if (configFileExits) {
    config = Object.assign(config, require(configFile).songbook);
  }

  // function parameter
  if (newConfig) {
    config = Object.assign(config, newConfig);
  }

  if (!config.test && !configFileExits) {
    messageConfigFile();
  }

  CheckChange.init(path.join(config.path, 'filehashes.db'));
};

/**
 * External function for command line usage.
 */
var setTestMode = function() {
  config.test = true;
  config.path = path.resolve('songs');
};

/**
 * Display a message about the config file.
 */
var messageConfigFile = function() {
  var output = error +
    'No config file \'~/html5-school-presentation.json\' found!';
  const sampleConfig = fs.readFileSync(
    path.join(__dirname, 'sample.config.json'), 'utf8'
  );
  output += '\nCreate a config file with this keys:\n' + sampleConfig;
  message(output);
  throw new Error('No configuration file found.');
};

/**
 * Assemble warning message when info.json doesn’t exists.
 * @param {string} folder - A song folder.
 */
var warningInfoJson = function(folder) {
  console.log(warning +
    folder.underline.yellow + '/' +
    config.info.underline.red);
};

/**
 * Print out or return text.
 * @param {string} text - Text to display.
 */
var message = function(text) {
  console.log(text);
};

/**
 * Wrapper function for all process functions for one folder.
 * @param {string} folder - A song folder.
 */
var processFolder = function(folder) {
  // projector
  if (config.force || CheckChange.do(path.join(folder, 'projector.mscx'))) {
    mscxProcess.generatePDF(folder, 'projector');
    mscxProcess.generateSlides(folder);
  }

  // piano
  if (config.force ||
    CheckChange.do(path.join(folder, 'piano.mscx')) ||
    CheckChange.do(path.join(folder, 'lead.mscx'))
  ) {
    mscxProcess.generatePianoEPS(folder);
  }
};

/**
 * Update and generate when required media files for the songs.
 */
var update = function() {
  mscxProcess.gitPull(config.path);
  tree.flat(config.path).forEach(processFolder);
  jsonSlides.generateJSON(config.path);
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
exports.setTestMode = setTestMode;
exports.update = update;
