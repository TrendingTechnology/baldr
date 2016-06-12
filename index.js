const os = require('os');
const path = require('path');
const config = require(path.join(os.homedir(), '.html5-school-presentation.json')).songbook;

const fs = require('fs');
const spawn = require('child_process').spawnSync;

exports.songsPath = config.path;

var jsonPath = path.join(config.path, config.json);

function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  }
  catch (err) {
    return false;
  }
}

exports.generateJSON = generateJSON = function() {
  var tmp = {};
  folders = fs.readdirSync(config.path);
  folders.forEach(function (folder) {
    var songFolder = path.join(config.path, folder);
    var jsonFile = path.join(songFolder, config.info);
    if (fileExists(jsonFile)) {
      var info = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
      info.folder = folder;
      info.slides = fs.readdirSync(path.join(songFolder, config.slidesFolder));
      tmp[folder] = info;
    }
  });

  fs.writeFileSync(jsonPath, JSON.stringify(tmp, null, 4));
  message('Datenbank-Datei erzeugen');
}

updateMTime = function(folder) {
  var score = path.join(folder, config.score)
  stat = fs.statSync(score);
  fs.writeFile(path.join(folder, '.mtime'), stat.mtime, function(err) {
    if (err) {
      return console.log(err);
    }
  });
}

getMTime = function(folder) {
  var stat = fs.statSync(path.join(folder, config.score));
  return stat.mtime
}

getCachedMTime = function(folder) {
  if (fileExists(folder + '/.mtime')) {
    return fs.readFileSync(folder + '/.mtime', 'utf8');
  }
  else {
    return '';
  }
}

getFolders = function(mode) {
  var output = [];
  folders = fs.readdirSync(config.path);
  folders.forEach(function (folder) {
    var folder = path.join(config.path, folder);
    var score = path.join(folder, 'score.mscx');
    if (fileExists(score)) {
      if (mode != 'force') {
        var MTime = getMTime(folder);
        var cachedMTime = getCachedMTime(folder);
        if (cachedMTime != MTime) {
          output[output.length] = folder;
        }
      } else {
        output[output.length] = folder;
      }
    }
  });
  return output;
}

pull = function() {
  var gitpull = spawn('git', ['pull'], {cwd: config.path});
  message('Nach Aktualsierungen suchen: ' + gitpull.stdout.toString('utf8'));
}

generatePDF = function(folder) {
  if (process.platform == 'darwin') {
    var command = '/Applications/MuseScore.app/Contents/MacOS/mscore';
  } else {
    command = 'mscore'
  }
  const mscore = spawn(command, [
    '--export-to',
    path.join(folder, 'score.pdf'),
    path.join(folder, config.score)
  ]);
}

deletePDF = function(folder) {
  fs.stat(path.join(folder, 'score.pdf'), function (err, stats) {
    if (err) return console.error(err);
      fs.unlink(path.join(folder, 'score.pdf'), function(err) {
      if(err) return console.error(err);
    });
  });
}

generateSVGs = function(folder) {
  message(folder + ': Bilder erzeugen');
  var slides = path.join(folder, config.slidesFolder);

  if (!fileExists(slides)) {
    fs.mkdir(slides);
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
    path.join(folder, 'score.pdf'),
    path.join(slides, '%02d.svg'),
     'all'
  ]);
}

message =  function(text) {
  console.log(text);

  var date = new Date();
  var isoDate = date.toISOString();
  fs.appendFile(path.join(config.path, 'update.log'), isoDate + ': ' + text + '\n', function (err) {
    if (err) {
      throw err;
    }
  });
}

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
}

exports.updateForce = function() {
  update('force');
}

exports.readJSON = function () {
  if (!fileExists(jsonPath)) {
    generateJSON();
  }
  return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
}
