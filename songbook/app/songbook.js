var fs = require('fs');
var path = require('path');
var library = require('./library.js');
var modal = require('./modal.js');

/**
 * Map some keyboard shortcuts to the corresponding methods.
 */
function bindShortcuts() {
  Mousetrap.bind('esc', function() {modal.toggle('search')});
  Mousetrap.bind('alt', function() {modal.toggle('search')});
  Mousetrap.bind('left', song.previousSlide);
  Mousetrap.bind('right', song.nextSlide);
}
search
/**
 * Map some buttons to the corresponding methods.
 */
function bindButtons() {
  $('#menu #menu-search').click(function() {modal.show('search')});
  $('#menu #menu-tableofcontents').click(function() {modal.show('tableofcontents')});
  $('#menu #menu-settings').click(function() {modal.show('settings')});
  $('#search a').click(modal.hide);
  $('.modal .close').click(modal.hide);
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
  search.build();
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
    modal.show('search');
  }
}

window.onhashchange = song.loadByHash;

/***********************************************************************
 * Object 'search': table of contents
 **********************************************************************/

var search = {};

search.build = function() {
  document.getElementById('field').appendChild(search.makeList(songs.library));
}

search.makeList = function(library) {
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
search.toggle = function() {
  var element = document.getElementById('search');
  var displayState = element.style.display;
  if (displayState == 'none') {
    element.style.display = 'block';
    if (typeof search.selectize != 'undefined') {
      search.selectize.focus();
      search.selectize.clear();
    }
  } else {
    element.style.display = 'none';
  }
}

search.resetSelect = function() {
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
        modal.hide();
      }
    });
    search.selectize = selectized[0].selectize;
    search.selectize.focus();
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

contextMenu.append(new MenuItem(
  {
    label: 'Akualisieren der Liedersammlung (komplett)',
    click: library.updateForce
  }
));

window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  contextMenu.popup(remote.getCurrentWindow());
}, false);
