/* jshint esversion: 6 */

const os = require('os');
const path = require('path');
const colors = require('colors');
const fs = require('fs');
const storage = require('node-persist');
storage.initSync();

const configFileName = '.html5-school-presentation.json';
const warning = 'Warning! '.yellow;
const error = 'Error! '.red;

const configDefault = {
  json: "songs.json",
  info: "info.json",
  slidesFolder: "slides",
  projector: "projector",
  mtime: ".mtime",
  pdf: "projector"
};

bootstrap = function() {
  var configFile = path.join(os.homedir(), configFileName);
  var conf;
  if (fs.existsSync(configFile)) {
    conf = Object.assign(configDefault, require(configFile).songbook);
  }
  else {
    console.log(error + 'No config file \'~/' + configFileName + '\' found!');
    const sampleConfigFile = path.join(__dirname, 'sample.config.json');
    const sampleConfig = fs.readFileSync(sampleConfigFile, 'utf8');
    console.log('\nCreate a config file with this keys:\n' + sampleConfig);
    process.exit(1);
  }
  return conf;
};

var config = bootstrap();
const spawn = require('child_process').spawnSync;

exports.songsPath = config.path;

var jsonPath = path.join(config.path, config.json);

exports.generateJSON = generateJSON = function() {
  var tmp = {};
  folders = fs.readdirSync(config.path);
  folders.forEach(function (folder) {
    console.log(folder);
    var songFolder = path.join(config.path, folder);
    var jsonFile = path.join(songFolder, config.info);
    if (fs.existsSync(jsonFile)) {
      var jsonFileContents = fs.readFileSync(jsonFile, 'utf8');
      var info = JSON.parse(jsonFileContents);
      info.folder = folder;
      info.slides = fs.readdirSync(path.join(songFolder, config.slidesFolder));
      if (Boolean(info.title)) {
        tmp[folder] = info;
      } else {
        console.log(
          warning +
          folder.underline.yellow + '/' +
          config.info.underline.red +
          ' has no value for title!'
        );
      }
    }
    else if (fs.lstatSync(songFolder).isDirectory()) {
      console.log(
        warning +
        folder.underline.red + ' has no ' +
        config.info.underline.red + ' file!'
      );
    }
  });

  fs.writeFileSync(jsonPath, JSON.stringify(tmp, null, 4));
  message('Datenbank-Datei erzeugen'.green);
};

getMTime = function(folder) {
  var stat = fs.statSync(path.join(folder, config.projector + '.mscx'));
  return stat.mtime;
};

updateMTime = function(folder) {
  fs.writeFileSync(path.join(folder, config.mtime), getMTime(folder));
};

getCachedMTime = function(folder) {
  var mtime = path.join(folder, config.mtime);
  if (fs.existsSync(mtime)) {
    return fs.readFileSync(mtime, 'utf8');
  }
  else {
    return '';
  }
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

getFolders = function(mode) {
  var output = [];
  folders = fs.readdirSync(config.path);
  folders.forEach(function (folder) {
    var absFolder = path.join(config.path, folder);
    var projector = path.join(absFolder, config.projector + '.mscx');
    if (fs.existsSync(projector)) {
      if (mode != 'force') {
        var MTime = getMTime(absFolder);
        var cachedMTime = getCachedMTime(absFolder);
        if (cachedMTime != MTime) {
          output[output.length] = absFolder;
        }
      } else {
        output[output.length] = absFolder;
      }
    }
  });
  return output;
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
generatePDF = function(folder, source, destination) {
  const mscore = spawn(getMscoreCommand(), [
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

generateSVGs = function(folder) {
  message(folder + ': Bilder erzeugen');
  var slides = path.join(folder, config.slidesFolder);

  if (!fs.existsSync(slides)) {
    fs.mkdirSync(slides);
  } else {
    files = fs.readdirSync(slides);
    files
      .map(file => path.join(slides, file))
      .filter(file => fs.statSync(file).isFile())
      .forEach(file => fs.unlinkSync(file));
  }

  const pdf2svg = spawn('pdf2svg', [
    path.join(folder, config.pdf),
    path.join(slides, '%02d.svg'),
     'all'
  ]);
};

message = function(text) {
  console.log(text);

  var date = new Date();
  var isoDate = date.toISOString();
  fs.appendFile(path.join(config.path, 'update.log'), isoDate + ': ' + text + '\n', function (err) {
    if (err) {
      throw err;
    }
  });
};

/**
 * By default this module reads the config file ~/.html5-school-presentation to
 * generate its config object.
 * @param {object} newConfig - An object containing the same properties as the
 * config object.
 */
exports.overrideConfig = function(newConfig) {
  config = Object.assign(config, newConfig);
};

exports.update = update = function(mode) {
  pull();
  var folders = getFolders(mode);
  folders.forEach(folder => {
      generatePDF(folder, config.projector, config.pdf);
      generateSVGs(folder);
      deletePDF(folder);
      updateMTime(folder);
    }
  );
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
