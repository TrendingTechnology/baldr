var fs = require('fs');
var path = require('path');
const spawn = require('child_process').spawnSync;

exports.path = path = '/var/songs';
exports.json = path + '/songs.json';

exports.generateJSON = function() {
  folders = fs.readdirSync(path);

  folders.forEach(function (folder) {
    var songFolder = path + '/' + folder + '/';
    var jsonFile = songFolder + 'info.json';
    if (fs.existsSync(jsonFile)) {
      var json = fs.readFileSync(jsonFile, 'utf8');
      var info = JSON.parse(json);
      info.folder = folder;
      info.slides = fs.readdirSync(songFolder + 'slides/');
      songs[folder] = info;
    }
  });

  var json = JSON.stringify(songs, null, 4);

  fs.writeFileSync(json, json);
  message('Datenbank-Datei erzeugen');
}

updateMTime = function(folder) {
  var score = path.join(folder, 'score.mscx')
  stat = fs.statSync(score);
  fs.writeFile(path.join(folder, '.mtime'), stat.mtime, function(err) {
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
  if (fs.existsSync(folder + '/.mtime')) {
    return fs.readFileSync(folder + '/.mtime', 'utf8');
  }
  else {
    return '';
  }
}

getFolders = function(mode) {
  var output = [];
  folders = fs.readdirSync(path);
  folders.forEach(function (folder) {
    var folder = path.join(path, folder);
    var score = path.join(folder, 'score.mscx');
    if (fs.existsSync(score)) {
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
  var gitpull = spawn('git', ['pull'], {cwd: path});
  //message('Nach Aktualsierungen suchen');
  console.log(gitpull.stdout.toString('utf8'));
}

generatePDF = function(folder) {
  const mscore = spawn('mscore', [
    '--export-to',
    path.join(folder, 'score.pdf'),
    path.join(folder, 'score.mscx')
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
  //message(folder + ': Bilder erzeugen');
  var slides = path.join(folder, 'slides');
  fs.access(slides, function(err) {
    if (err) {
      fs.mkdir(slides);
    }
  })
  const pdf2svg = spawn('pdf2svg', [
    path.join(folder, 'score.pdf'),
    path.join(slides, '%02d.svg'),
     'all'
  ]);
}

toggle = function() {
  var element = document.getElementById('update');
  var displayState = element.style.display;
  if (displayState == 'none') {
    element.style.display = 'block';
  } else {
    element.style.display = 'none';
  }
}

message =  function(text) {
  var element = document.getElementById('progress');
  var p = document.createElement('p');
  p.innerHTML = text;
  element.appendChild(p);
}

exports.update = function(mode) {
  //modal.show('update');
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
