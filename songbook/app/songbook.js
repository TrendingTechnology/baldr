var fs = require('fs');
var path = require('path');
//var util = require('util');

/***********************************************************************
 * Object 'library'
 **********************************************************************/

var library = {};

library.path = '/var/songs';

library.json = library.path + '/songs.json';

library.songs = {};

library.writeMTime = function(file) {
  stat = fs.statSync(file);
  fileMTime = file.replace('info.json', '.mtime');
  fs.writeFile(fileMTime, stat.mtime, function(err) {
    if(err) {
        return console.log(err);
    }
  });
}

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

library.getModifiedFiles = function () {
  folders = fs.readdirSync(library.path);
  folders.forEach(function (folder) {
    var score = folder + '/score.mscx';
    if (fs.existsSync(score)) {
      var stat = fs.statSync(folder + '/score.mscx');
      var mtime = fs.readFileSync(folder + '/.mtime', 'utf8');
      if (stat.mtime != mtime) {
        console.log('Change: ' + score);
      }
    }
  });
}

library.update = function() {
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
contextMenu.append(new MenuItem({label: 'Akualisieren der Liedersammlung', click: library.update}));

window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  contextMenu.popup(remote.getCurrentWindow());
}, false);
