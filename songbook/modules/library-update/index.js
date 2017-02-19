/* jshint esversion: 6 */

const os = require('os');
const path = require('path');
const p = path.join;
const colors = require('colors');
const fs = require('fs');
const spawn = require('child_process').spawnSync;
const fse = require('fs-extra');
const storage = require('node-persist');
storage.initSync();

const warning = 'Warning! '.yellow;
const error = 'Error! '.red;

const configDefault = {
  json: "songs.json",
  info: "info.json",
  slidesFolder: "slides",
  projector: "projector",
  mtime: ".mtime",
  pdf: "projector",
  configFileName: '.html5-school-presentation.json',
  test: false
};

var config = {};

/**
 * By default this module reads the config file ~/.html5-school-presentation to
 * generate its config object.
 * @param {object} newConfig - An object containing the same properties as the
 * config object.
 */
exports.bootstrapConfig = function(newConfig=false) {

  // default object
  config = configDefault;

  // config file
  var configFile = path.join(os.homedir(), config.configFileName);
  if (fs.existsSync(configFile)) {
    config = Object.assign(config, require(configFile).songbook);
  }

  // function parameter
  if (newConfig) {
    config = Object.assign(config, newConfig)
  }
};

messageConfigFile = function() {
  console.log(error + 'No config file \'~/' + configFileName + '\' found!');
  const sampleConfigFile = path.join(__dirname, 'sample.config.json');
  const sampleConfig = fs.readFileSync(sampleConfigFile, 'utf8');
  console.log('\nCreate a config file with this keys:\n' + sampleConfig);
  process.exit(1);
}

exports.generateJSON = generateJSON = function() {
  var tmp = {};
  var jsonPath = path.join(config.path, config.json);
  var output = '';
  getFolders().forEach(function (folder) {
    output += folder;
    var songFolder = folder;
    var jsonFile = path.join(songFolder, config.info);
    if (fs.existsSync(jsonFile)) {
      var jsonFileContents = fs.readFileSync(jsonFile, 'utf8');
      var info = JSON.parse(jsonFileContents);
      info.folder = folder;
      var slidesFolder = path.join(songFolder, config.slidesFolder);
      if (fs.existsSync(slidesFolder)) {
        info.slides = fs.readdirSync(slidesFolder);
      }
      if (Boolean(info.title)) {
        tmp[folder] = info;
      } else {
        output += warning +
          folder.underline.yellow + '/' +
          config.info.underline.red +
          ' has no value for title!';
      }
    }
    else if (fs.lstatSync(songFolder).isDirectory()) {
      output += warning +
        folder.underline.red + ' has no ' +
        config.info.underline.red + ' file!';
    }
  });

  fs.writeFileSync(jsonPath, JSON.stringify(tmp, null, 4));
  output += 'Datenbank-Datei erzeugen'.green;
  return message(output);
};

/**
 * Check for file modifications
 * @param {string} file - Path to the file.
 * @returns {boolean}
 */
fileChanged = function(file) {
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
getFolders = function(mode) {
  var output = [];
  folders = fs.readdirSync(config.path);
  function noSpecial(file) {
    if (file.substr(0, 1) == '_' || file.substr(0, 1) == '.') {
      return false;
    }
    else {
      return true;
    }
  }
  function makeAbs(folder) {
    return path.join(config.path, folder);
  }
  function isDir(file) {
    var stats = fs.statSync(file);
    if (stats.isDirectory()) {
      return true;
    }
    else {
      return false;
    }
  }
  return folders.filter(noSpecial).map(makeAbs).filter(isDir);
};

/**
 * Execute git pull if repository exists.
 */
pull = function() {
  if (fs.existsSync(path.join(config.path, '.git'))) {
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
getMscoreCommand = function() {
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
generatePDF = function(folder, source, destination = '') {
  if (destination == '') {
    destination = source;
  }
  spawn(getMscoreCommand(), [
    '--export-to',
    path.join(folder, destination + '.pdf'),
    path.join(folder, source + '.mscx')
  ]);
};

/**
 * Delete a file in a folder.
 * @param {string} folder - Folder containing the file to delete.
 * @param {string} file - Name of the file to delete.
 */
deleteFile = function(folder, file) {
  const del = path.join(folder, file);
  if (fs.existsSync(del)) {
    fs.unlinkSync(del);
  }
};

/**
 * @param {string} folder - Folder containing the files to delete.
 */
deleteFilesInFolder = function (folder) {
  if (fs.existsSync(folder)) {
    fs.readdirSync(folder)
      .map(file => path.join(folder, file))
      .filter(file => fs.statSync(file).isFile())
      .forEach(file => fs.unlinkSync(file));
  }
}

/**
 * Generate svg files in a "slides" subfolder.
 * @param {string} folder - A song folder.
 */
generateSlides = function(folder) {
  var slides = path.join(folder, config.slidesFolder);

  if (!fs.existsSync(slides)) {
    fs.mkdirSync(slides);
  }
  deleteFilesInFolder(slides);

  spawn('pdf2svg', [
    path.join(folder, 'projector.pdf'),
    path.join(slides, '%02d.svg'),
     'all'
  ]);
  return message(folder + ': Bilder erzeugen');
};

/**
 * Generate a PDF named piano.pdf a) from piano.mscx or b) from lead.mscx
 * @param {string} folder - A song folder.
 */
generatePianoEPS = function(folder) {
  var piano = p(folder, 'piano')
  if (!fs.existsSync(piano)) {
    fs.mkdirSync(piano);
  }
  if (fs.existsSync(p(folder, 'piano.mscx'))) {
    fse.copySync(p(folder, 'piano.mscx'), p(piano, 'piano.mscx'))
  }
  else if (fs.existsSync(p(folder, 'lead.mscx'))) {
    fse.copySync(p(folder, 'lead.mscx'), p(piano, 'piano.mscx'))
  }
  spawn('mscore-to-eps.sh', [p(piano, 'piano.mscx')]);
}

/**
 * Print out or return text.
 * @param {string} text - Text to display.
 */
message = function(text) {
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
processFolder = function(folder) {
  // projector
  generatePDF(folder, 'projector');
  generateSVGs(folder);

  // piano
  generatePDFPiano(folder);
}

exports.update = update = function(mode) {
  pull();
  getFolders().forEach(processFolder);
  generateJSON();
};

exports.updateForce = function() {
  update('force');
};

exports.readJSON = function () {
  if (!fs.existsSync(jsonPath)) {
    generateJSON();
  }
  return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
};
