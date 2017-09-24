/* jshint esversion: 6 */

'use strict';

const os = require('os');
const path = require('path');
const p = path.join;
const colors = require('colors');
const fs = require('fs-extra');
const spawn = require('child_process').spawnSync;
const storage = require('node-persist');
const sqlite3 = require('better-sqlite3');
storage.initSync();

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
 * Check if executable is installed.
 * @param {string} executable - Name of the executable.
 */
var checkExecutable = function(executable) {
  var exec = spawn(executable, ['--help']);
  if (exec.status === null) {
    return message('Install executable: ' + executable);
  }
};

/**
 * By default this module reads the config file ~/.html5-school-presentation to
 * generate its config object.
 * @param {object} newConfig - An object containing the same properties as the
 * config object.
 */
var bootstrapConfig = function(newConfig=false) {
  checkExecutable(getMscoreCommand());
  checkExecutable('mscore-to-eps.sh');
  checkExecutable('pdf2svg');
  checkExecutable('pdfcrop');
  checkExecutable('pdfinfo');
  checkExecutable('pdftops');


  // default object
  config = configDefault;

  // config file
  var configFile = p(os.homedir(), config.configFileName);
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

  config.db = new sqlite3(p(config.path, 'filestats.db'));
  config.db.prepare("CREATE TABLE IF NOT EXISTS stats (filename TEXT, timestamp INTEGER)").run();

};
exports.bootstrapConfig = bootstrapConfig;

/**
 * External function for command line usage.
 */
var setTestMode = function() {
  config.test = true;
  config.path = path.resolve('songs');
}
exports.setTestMode = setTestMode;

/**
 * Display a message about the config file.
 */
var messageConfigFile = function() {
  var output = error + 'No config file \'~/' + config.configFileName + '\' found!';
  const sampleConfigFile = p(__dirname, 'sample.config.json');
  const sampleConfig = fs.readFileSync(sampleConfigFile, 'utf8');
  output += '\nCreate a config file with this keys:\n' + sampleConfig;
  if (!config.test) {
    message(output);
    process.exit(1);
  }
  else {
    return message(output);
  }
};

/**
 * Assemble warning message when info.json doesn’t exists.
 * @param {string} folder - A song folder.
 */
var warningInfoJson = function(folder) {
  return warning +
    folder.underline.yellow + '/' +
    config.info.underline.red;
};

var generateJSON = function() {
  var tmp = {};
  var output = '';
  getFolders().forEach(function (folder) {
    output += folder;
    var jsonFile = p(folder, config.info);
    if (fs.existsSync(jsonFile)) {
      var info = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
      info.folder = folder;
      info.slides = getFolderFiles(p(folder, config.slidesFolder), '.svg');
      if (Boolean(info.title)) {
        tmp[folder] = info;
      } else {
        output += warningInfoJson(folder);
      }
    }
    else if (fs.lstatSync(folder).isDirectory()) {
      output += warningInfoJson(folder);
    }
  });

  fs.writeFileSync(p(config.path, config.json), JSON.stringify(tmp, null, 4));
  output += 'Datenbank-Datei erzeugen'.green;
  return message(output);
};
exports.generateJSON = generateJSON;

var readJSON = function () {
  // if (!fs.existsSync(p(config.path, config.json))) {
  //   generateJSON();
  // }
  return JSON.parse(fs.readFileSync(p(config.path, config.json), 'utf8'));
};
exports.readJSON = readJSON;

/**
 * @param {string} folder - Absolute path to a song folder.
 */
var getSongInfo = function(folder) {
  var jsonFile = p(folder, config.info);
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
 * Generate TeX file for the piano version of the songbook
 */
var generateTeX = function() {
  var previousInitial;
  var initial;
  var TeXFile = p(config.path, config.tex);
  fs.removeSync(TeXFile);
  getFolders().forEach((folder) => {
    var info = getSongInfo(folder);
    var eps = getFolderFiles(p(folder, config.pianoFolder), '.eps');
    if (info.hasOwnProperty('title') && eps.length > 0) {
      previousInitial = initial;
      initial = info.title.substr(0, 1).toUpperCase();
      if (previousInitial != initial) {
        fs.appendFileSync(TeXFile, '\n\n\\tmpchapter{' + initial + '}\n');
      }
      fs.appendFileSync(TeXFile, '\n\n\\tmpheading{' + info.title + '}\n');
      eps.forEach(
        (file) => {
          fs.appendFileSync(TeXFile, '\\tmpimage{' + p(folder.split(path.sep).pop(), config.pianoFolder, file) + '}\n');
        }
      );
    }
  });
};
exports.generateTeX = generateTeX;

/**
 * Check for file modifications
 * @param {string} file - Path to the file.
 * @returns {boolean}
 */
var fileChanged = function(file) {
  if (!fs.existsSync(file)) {
    return false;
  }
  var fileMtime = fs.statSync(file).mtime.getTime();
  var storedMtime = storage.getItemSync(file);
  if (typeof storedMtime == 'undefined') {
    storedMtime = 0;
  }
  if (fileMtime > storedMtime) {
    storage.setItemSync(file, fileMtime);
    return true;
  }
  else {
    return false;
  }
};

/**
 * Return the folder that might contain MuseScore files.
 * @return {array} Array of absolute folder paths.
 */
var getFolders = function(mode) {
  if (config.folder) {
    return [config.folder];
  }
  var folders = fs.readdirSync(config.path);
  return folders.filter(
      (file) => {
        return file.substr(0, 1) == '_' || file.substr(0, 1) == '.' ? false : true;
      }
    ).map(
      (folder) => {
        return p(config.path, folder);
      }
    ).filter(
      (file) => {
        return fs.statSync(file).isDirectory() ? true : false;
      }
    );
};

/**
 * Execute git pull if repository exists.
 */
var pull = function() {
  if (fs.existsSync(p(config.path, '.git'))) {
    var gitpull = spawn('git', ['pull'], {cwd: config.path});
    message('Nach Aktualsierungen suchen: ' + gitpull.stdout.toString('utf8'));
  }
  else {
    return false;
  }
};

/**
 * Get the MuseScore command.
 * @returns {string} The name of the MuseScore command.
 */
var getMscoreCommand = function() {
  if (process.platform == 'darwin') {
    return '/Applications/MuseScore 2.app/Contents/MacOS/mscore';
  } else {
    return 'mscore';
  }
};

/**
 * Generate form a given *.mscx file a PDF file.
 * @param {string} folder - Folder containing the *.mscx file.
 * @param {string} source - Name of the *.mscx file without the extension.
 * @param {string} destination - Name of the PDF without the extension.
 */
var generatePDF = function(folder, source, destination = '') {
  if (destination === '') {
    destination = source;
  }
  spawn(getMscoreCommand(), [
    '--export-to',
    p(folder, destination + '.pdf'),
    p(folder, source + '.mscx')
  ]);
};

/**
 * Generate svg files in a 'slides' subfolder.
 * @param {string} folder - A song folder.
 */
var generateSlides = function(folder) {
  var slides = p(folder, config.slidesFolder);
  fs.removeSync(slides);
  fs.mkdirSync(slides);

  spawn('pdf2svg', [
    p(folder, 'projector.pdf'),
    p(slides, '%02d.svg'),
     'all'
  ]);
  return message(folder + ': Bilder erzeugen');
};

/**
 * Generate a PDF named piano.pdf a) from piano.mscx or b) from lead.mscx
 * @param {string} folder - A song folder.
 */
var generatePianoEPS = function(folder) {
  var piano = p(folder, config.pianoFolder);
  fs.removeSync(piano);
  fs.mkdirSync(piano);

  if (fs.existsSync(p(folder, config.pianoMScore))) {
    fs.copySync(p(folder, config.pianoMScore), p(piano, config.pianoMScore));
  }
  else if (fs.existsSync(p(folder, config.leadMScore))) {
    fs.copySync(p(folder, config.leadMScore), p(piano, config.pianoMScore));
  }
  spawn('mscore-to-eps.sh', [p(piano, config.pianoMScore)]);
};

/**
 * Print out or return text.
 * @param {string} text - Text to display.
 */
var message = function(text) {
  if (!config.test) {
    console.log(text);
  }
  else {
    return text;
  }
};

/**
 * Wrapper function for all process functions for one folder.
 * @param {string} folder - A song folder.
 */
var processFolder = function(folder) {
  // projector
  if (config.force || fileChanged(p(folder, 'projector.mscx'))) {
    generatePDF(folder, 'projector');
    generateSlides(folder);
  }

  // piano
  if (config.force ||
    fileChanged(p(folder, config.pianoMScore)) ||
    fileChanged(p(folder, config.leadMScore))
  ) {
    generatePianoEPS(folder);
  }
};

/**
 * Update and generate when required media files for the songs.
 */
exports.update = function() {
  pull();
  getFolders().forEach(processFolder);
  generateJSON();
};

/**
 * Clean all temporary files in a song folder.
 * @param {string} folder - A song folder.
 */
var cleanFolder = function(folder) {
  fs.removeSync(p(folder, config.pianoFolder));
  fs.removeSync(p(folder, config.slidesFolder));
  fs.removeSync(p(folder, 'projector.pdf'));
};

/**
 * Clean all temporary media files.
 */
exports.clean = function() {
  getFolders().forEach(cleanFolder);
  fs.removeSync(p(config.path, config.json));
  fs.removeSync(p(config.path, config.tex));
};
