/* jshint esversion: 6 */

const os = require('os');
const path = require('path');
const fs = require('fs');

const configFileName = '.html5-school-presentation.json';

bootstrap = function() {
  var configFile = path.join(os.homedir(), configFileName);
  if (fs.existsSync(configFile)) {
    return require(configFile).songbook;
  }
  else {
    console.log('No config file \'~/' + configFileName + '\' found!');
    process.exit(1);
  }
};

const config = bootstrap();
const spawn = require('child_process').spawnSync;

exports.songsPath = config.path;

var jsonPath = path.join(config.path, config.json);

exports.generateJSON = generateJSON = function() {
  var tmp = {};
  folders = fs.readdirSync(config.path);
  folders.forEach(function (folder) {
    var songFolder = path.join(config.path, folder);
    var jsonFile = path.join(songFolder, config.info);
    if (fs.existsSync(jsonFile)) {
      var info = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
      info.folder = folder;
      info.slides = fs.readdirSync(path.join(songFolder, config.slidesFolder));
      tmp[folder] = info;
    }
  });

  fs.writeFileSync(jsonPath, JSON.stringify(tmp, null, 4));
  message('Datenbank-Datei erzeugen');
};

updateMTime = function(folder) {
  var score = path.join(folder, config.score);
  stat = fs.statSync(score);
  fs.writeFileSync(path.join(folder, config.mtime), stat.mtime);
};

getMTime = function(folder) {
  var stat = fs.statSync(path.join(folder, config.score));
  return stat.mtime;
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

getFolders = function(mode) {
  var output = [];
  folders = fs.readdirSync(config.path);
  folders.forEach(function (folder) {
    var absFolder = path.join(config.path, folder);
    var score = path.join(absFolder, config.score);
    if (fs.existsSync(score)) {
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

pull = function() {
  var gitpull = spawn('git', ['pull'], {cwd: config.path});
  message('Nach Aktualsierungen suchen: ' + gitpull.stdout.toString('utf8'));
};

generatePDF = function(folder) {
  if (process.platform == 'darwin') {
    var command = '/Applications/MuseScore 2.app/Contents/MacOS/mscore';
  } else {
    var command = 'mscore';
  }
  const mscore = spawn(command, [
    '--export-to',
    path.join(folder, config.pdf),
    path.join(folder, config.score)
  ]);
};

deletePDF = function(folder) {
  fs.stat(path.join(folder, config.pdf), function (err, stats) {
    if (err) return console.error(err);
      fs.unlink(path.join(folder, config.pdf), function(err) {
      if(err) return console.error(err);
    });
  });
};

generateSVGs = function(folder) {
  message(folder + ': Bilder erzeugen');
  var slides = path.join(folder, config.slidesFolder);

  if (!fs.existsSync(slides)) {
    fs.mkdirSync(slides);
  } else {
    files = fs.readdirSync(slides);
    files.map(function (file) {
      return path.join(slides, file);
    }).filter(function (file) {
      return fs.statSync(file).isFile();
    }).forEach(function (file) {
      fs.unlinkSync(file);
    });
  }

  const pdf2svg = spawn('pdf2svg', [
    path.join(folder, config.pdf),
    path.join(slides, '%02d.svg'),
     'all'
  ]);
};

message =  function(text) {
  console.log(text);

  var date = new Date();
  var isoDate = date.toISOString();
  fs.appendFile(path.join(config.path, 'update.log'), isoDate + ': ' + text + '\n', function (err) {
    if (err) {
      throw err;
    }
  });
};

exports.update = update = function(mode) {
  pull();
  var folders = getFolders(mode);
  folders.forEach(function(folder) {
    generatePDF(folder);
    generateSVGs(folder);
    deletePDF(folder);
    updateMTime(folder);
  });
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
