var fs = require('fs');
var path = require('path');

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

songs.path = '/var/songs';

/**
 *
 */
songs.setLibrary = function() {
  songs.library = JSON.parse(fs.readFileSync(path.join(songs.path, 'songs.json'), 'utf8'));
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
  var image_path = path.join(songs.path, song.folder, 'slides', song.slides[song.slideNumber])
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
