var fs = require('fs');
var pth = require('path');
var library = require('../modules/library-update/index.js');
var modal = require('./modal.js');
var search = require('./search.js');
var song = require('./song.js');

/**
 * Map some keyboard shortcuts to the corresponding methods.
 */
function bindShortcuts() {
  Mousetrap.bind('esc', function() {modal.toggle('search')});
  Mousetrap.bind('alt', function() {modal.toggle('search')});
  Mousetrap.bind('left', song.previousSlide);
  Mousetrap.bind('right', song.nextSlide);
}

/**
 * Map some buttons to the corresponding methods.
 */
function bindButtons() {
  $('#menu #menu-search').click(function() {modal.show('search')});
  $('#menu #menu-tableofcontents').click(function() {modal.show('tableofcontents')});
  $('#menu #menu-settings').click(function() {modal.show('settings')});
  $('#settings #update-library').click(library.update);
  $('#settings #update-library-force').click(function() {library.update('force')});
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
  song.set({
    "library": songs.library,
    "selector": '#slide img',
    "songsPath": library.path
  })
  song.loadByHash();
  search.set({
    "library": songs.library,
    "selector": "#field",
  });
  search.build();
  bindButtons();
}

songs.setLibrary();

window.onhashchange = song.loadByHash;

bindShortcuts();

var selectized = $('select').selectize({
  onItemAdd: function(value, data) {
    song.setCurrent(value);
    modal.hide();
  }
});
search.selectize = selectized[0].selectize;
search.selectize.focus();

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
