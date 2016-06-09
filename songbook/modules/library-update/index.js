var fs = require('fs');
var pth = require('path');
const spawn = require('child_process').spawnSync;

exports.songsPath = songsPath = '/var/songs';

var jsonPath = songsPath + '/songs.json';

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
  folders = fs.readdirSync(songsPath);
  folders.forEach(function (folder) {
    var songFolder = songsPath + '/' + folder + '/';
    var jsonFile = songFolder + 'info.json';
    if (fileExists(jsonFile)) {
      var info = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
      info.folder = folder;
      info.slides = fs.readdirSync(songFolder + 'slides/');
      tmp[folder] = info;
    }
  });

  fs.writeFileSync(jsonPath, JSON.stringify(tmp, null, 4));
  message('Datenbank-Datei erzeugen');
}

updateMTime = function(folder) {
  var score = pth.join(folder, 'score.mscx')
  stat = fs.statSync(score);
  fs.writeFile(pth.join(folder, '.mtime'), stat.mtime, function(err) {
    if(err) {
        return console.log(err);
    }
  });
}

getMTime = function(folder) {
  var stat = fs.statSync(folder + '/score.mscx');
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
  folders = fs.readdirSync(songsPath);
  folders.forEach(function (folder) {
    var folder = pth.join(songsPath, folder);
    var score = pth.join(folder, 'score.mscx');
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
  var gitpull = spawn('git', ['pull'], {cwd: songsPath});
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
    pth.join(folder, 'score.pdf'),
    pth.join(folder, 'score.mscx')
  ]);
}

deletePDF = function(folder) {
  fs.stat(pth.join(folder, 'score.pdf'), function (err, stats) {
    if (err) return console.error(err);
      fs.unlink(pth.join(folder, 'score.pdf'), function(err) {
         if(err) return console.error(err);
    });
  });
}

generateSVGs = function(folder) {
  message(folder + ': Bilder erzeugen');
  var slides = pth.join(folder, 'slides');
  fs.access(slides, function(err) {
    if (err) {
      fs.mkdir(slides);
    }
  })
  files = fs.readdirSync(slides);
  files.map(function (file) {
    return pth.join(slides, file);
  }).filter(function (file) {
    return fs.statSync(file).isFile();
  }).forEach(function (file) {
    fs.unlinkSync(file);
  });

  const pdf2svg = spawn('pdf2svg', [
    pth.join(folder, 'score.pdf'),
    pth.join(slides, '%02d.svg'),
     'all'
  ]);
}

message =  function(text) {
  console.log(text);
  fs.appendFile(pth.join(songsPath, 'update.log'), text, function (err) {
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
