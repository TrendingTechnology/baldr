var fs = require('fs');
var path = require('path');
const spawn = require('child_process').spawnSync;
//var util = require('util');

/***********************************************************************
 * Object 'library'
 **********************************************************************/

var library = {};

library.path = '/var/songs';

library.json = library.path + '/songs.json';

library.songs = {};

library.generateJSON = function() {
  folders = fs.readdirSync(library.path);

  folders.forEach(function (folder) {
    var songFolder = library.path + '/' + folder + '/';
    var jsonFile = songFolder + 'info.json';
    if (fs.existsSync(jsonFile)) {
      var json = fs.readFileSync(jsonFile, 'utf8');
      var info = JSON.parse(json);
      info.folder = folder;
      info.slides = fs.readdirSync(songFolder + 'slides/');
      library.songs[folder] = info;
    }
  });

  var json = JSON.stringify(library.songs, null, 4);

  fs.writeFileSync(library.json, json);
  console.log(json);
}

library.updateMTime = function(folder) {
  var score = path.join(folder, 'score.mscx')
  stat = fs.statSync(score);
  fs.writeFile(path.join(folder, '.mtime'), stat.mtime, function(err) {
    if(err) {
        return console.log(err);
    }
  });
}

library.getMTime = function(folder) {
  var stat = fs.statSync(folder + '/score.mscx');
  return stat.mtime
}

library.getCachedMTime = function(folder) {
  if (fs.existsSync(folder + '/.mtime')) {
    return fs.readFileSync(folder + '/.mtime', 'utf8');
  }
  else {
    return '';
  }
}

library.getModifiedFiles = function() {
  var modified = [];
  folders = fs.readdirSync(library.path);
  folders.forEach(function (folder) {
    var folder = path.join(library.path, folder);
    var score = path.join(folder, 'score.mscx');
    if (fs.existsSync(score)) {
      var MTime = library.getMTime(folder);
      var cachedMTime = library.getCachedMTime(folder);
      if (cachedMTime != MTime) {
        modified[modified.length] = folder;
      }
    }
  });
  return modified;
}

library.generatePDF = function(folder) {
  const mscore = spawn('mscore', [
    '--export-to',
    path.join(folder, 'score.pdf'),
    path.join(folder, 'score.mscx')
  ]);
}

library.generateSVGs = function(folder) {
  console.log(folder);
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

library.update = function() {
  var modified = library.getModifiedFiles();
  modified.forEach(function(folder) {
    library.generatePDF(folder);
    library.generateSVGs(folder);
    library.updateMTime(folder);
  });
  library.generateJSON();
}

/**
 * Map some keyboard shortcuts to the corresponding methods.
 */
function bindShortcuts() {
  Mousetrap.bind('esc', toc.toggle);
  Mousetrap.bind('alt', toc.toggle);
  Mousetrap.bind('left', song.previousSlide);
  Mousetrap.bind('right', song.nextSlide);
}

/**
 * Map some buttons to the corresponding methods.
 */
function bindButtons() {
  $('#menu #menu-toc').click(toc.toggle);
  $('#toc a').click(toc.toggle);
  $('#toc .close').click(toc.toggle);
  $('#slide #previous').click(song.previousSlide);
  $('#slide #next').click(song.nextSlide);
}

/***********************************************************************
 * Object 'songs': All songs in the songs library.
 **********************************************************************/

var songs = {}

/**
 *
 */
songs.setLibrary = function() {
  if (!fs.existsSync(library.json)) {
    library.generateJSON();
  }
  songs.library = JSON.parse(fs.readFileSync(library.json, 'utf8'));
  song.loadByHash();
  toc.build();
  bindButtons();
}

/***********************************************************************
 * Object 'song': The current song
 **********************************************************************/

var song = {}

/**
 * The current slide number.
 */
song.slideNumber = 0;

/**
 * The biggest slide number.
 */
song.slideNumberMax;

/**
 * Array of all images files of a song.
 */
song.slides;

/**
 * The folder containing the images files.
 */
song.folder;

/**
 * Set all properties for the current song.
 */
song.setCurrent = function(songID) {
  var tmp = songs.library[songID];
  if (typeof tmp != 'undefined') {
    song.slideNumber = 0;
    song.slides = tmp.slides;
    song.slideNumberMax = song.slides.length - 1;
    song.folder = tmp.folder;
  }
}

/**
 * Load the current image to the slide section.
 */
song.setSlide = function() {
  var image_path = path.join(library.path, song.folder, 'slides', song.slides[song.slideNumber])
  $('#slide img').attr('src', image_path);
}

/**
 * Show the next slide.
 */
song.nextSlide = function() {
  song.slideNumber += 1;
  if (song.slideNumber > song.slideNumberMax) {
    song.slideNumber = 0;
  }
  song.setSlide();
}

/**
 * Show the previous slide.
 */
song.previousSlide = function() {
  song.slideNumber -= 1;
  if (song.slideNumber < 0) {
    song.slideNumber = song.slideNumberMax;
  }
  song.setSlide();
}

/**
 *
 */
song.loadByHash = function() {
  if (location.hash != '') {
    song.setCurrent(location.hash.substring(1));
    song.setSlide();
    $('#slide').show();
  }
  else {
    toc.toggle();
  }
}

window.onhashchange = song.loadByHash;

/***********************************************************************
 * Object 'toc': table of contents
 **********************************************************************/

var toc = {};

toc.build = function() {
  document.getElementById('search').appendChild(toc.makeList(songs.library));
}

toc.makeList = function(library) {
  var select = document.createElement('select');
  select.setAttribute('id', 'select');
  select.setAttribute('placeholder', 'Suche nach einem Lied');

  var option = document.createElement('option');
  option.setAttribute('value', '');
  select.appendChild(option);

  for (songID in library) {
    var option = document.createElement('option');
    option.setAttribute('value', songID);
    option.innerHTML = library[songID].title;
    select.appendChild(option);
  }
  return select;
}

/**
 * Hide or show table of contents.
 */
toc.toggle = function() {
  var element = document.getElementById('toc');
  var displayState = element.style.display;
  if (displayState == 'none') {
    element.style.display = 'block';
    if (typeof toc.selectize != 'undefined') {
      toc.selectize.focus();
      toc.selectize.clear();
    }
  } else {
    element.style.display = 'none';
  }
}

toc.resetSelect = function() {
  // fetch our section element
  var select = document.getElementById('select');
  var option = document.createElement('option');
  option.setAttribute('value', '');
  select.insertBefore(option, select.firstChild);
}

songs.setLibrary();
bindShortcuts();

$(function() {
    var selectized = $('select').selectize({
      onItemAdd: function(value, data) {
        song.setCurrent(value);
        song.setSlide();
        toc.toggle();
      }
    });
    toc.selectize = selectized[0].selectize;
    toc.selectize.focus();
});

const {remote} = require('electron');
const {Menu, MenuItem} = remote;

const contextMenu = new Menu();
contextMenu.append(new MenuItem(
  {
    label: 'Akualisieren der Liedersammlung',
    accelerator: 'CmdOrCtrl+u',
    click: library.update
  }
));

window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  contextMenu.popup(remote.getCurrentWindow());
}, false);
