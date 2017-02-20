/* jshint esversion: 6 */

const os = require('os');
const path = require('path');
const p = path.join;
const colors = require('colors');
const fs = require('fs-extra');
const spawn = require('child_process').spawnSync;
const storage = require('node-persist');
storage.initSync();

const warning = 'Warning! '.yellow;
const error = 'Error! '.red;

const configDefault = {
  json: "songs.json",
  info: "info.json",
  slidesFolder: "slides",
  configFileName: '.html5-school-presentation.json',
  test: false,
  force: false
};

var config = {};

/**
 * Check if executable is installed.
 * @param {string} executable - Name of the executable.
 */
checkExecutable = function(executable) {
  var exec = spawn(executable, ['--help']);
  if (exec.status == null) {
    return message('Install executable: ' + executable);
  }
}

/**
 * By default this module reads the config file ~/.html5-school-presentation to
 * generate its config object.
 * @param {object} newConfig - An object containing the same properties as the
 * config object.
 */
exports.bootstrapConfig = function(newConfig=false) {
  checkExecutable(getMscoreCommand());
  checkExecutable('mscore-to-eps.sh');
  checkExecutable('pdf2svg');

  // default object
  config = configDefault;

  // config file
  var configFile = p(os.homedir(), config.configFileName);
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
  const sampleConfigFile = p(__dirname, 'sample.config.json');
  const sampleConfig = fs.readFileSync(sampleConfigFile, 'utf8');
  console.log('\nCreate a config file with this keys:\n' + sampleConfig);
  process.exit(1);
}

exports.generateJSON = generateJSON = function() {
  var tmp = {};
  var jsonPath = p(config.path, config.json);
  var output = '';
  getFolders().forEach(function (folder) {
    output += folder;
    var songFolder = folder;
    var jsonFile = p(songFolder, config.info);
    if (fs.existsSync(jsonFile)) {
      var jsonFileContents = fs.readFileSync(jsonFile, 'utf8');
      var info = JSON.parse(jsonFileContents);
      info.folder = folder;
      var slidesFolder = p(songFolder, config.slidesFolder);
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
    return p(config.path, folder);
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
    p(folder, destination + '.pdf'),
    p(folder, source + '.mscx')
  ]);
};

/**
 * Generate svg files in a "slides" subfolder.
 * @param {string} folder - A song folder.
 */
generateSlides = function(folder) {
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
generatePianoEPS = function(folder) {
  var piano = p(folder, 'piano')
  fs.removeSync(piano);
  fs.mkdirSync(piano);

  if (fs.existsSync(p(folder, 'piano.mscx'))) {
    fs.copySync(p(folder, 'piano.mscx'), p(piano, 'piano.mscx'))
  }
  else if (fs.existsSync(p(folder, 'lead.mscx'))) {
    fs.copySync(p(folder, 'lead.mscx'), p(piano, 'piano.mscx'))
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
  if (config.force || fileChanged(p(folder, 'projector.mscx'))) {
    generatePDF(folder, 'projector');
    generateSlides(folder);
  }

  // piano
  if (config.force ||
    fileChanged(p(folder, 'piano.mscx')) ||
    fileChanged(p(folder, 'lead.mscx'))
  ) {
    generatePianoEPS(folder);
  }

}

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
cleanFolder = function(folder) {
  fs.removeSync(p(folder, 'piano'));
  fs.removeSync(p(folder, 'slides'));
  fs.removeSync(p(folder, 'projector.pdf'));
}

/**
 * Clean all temporary media files.
 */
exports.clean = function() {
  getFolders().forEach(cleanFolder);
  fs.removeSync(p(config.path, 'songs.json'));
};
