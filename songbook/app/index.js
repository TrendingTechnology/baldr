var fs = require('fs');
var pth = require('path');
var library = require('../modules/library-update/index.js');
var modal = require('./modal.js');
var search = require('./search.js');
var song = require('./song.js');
var jquery = require("jquery");
var Mousetrap = require('mousetrap');
require("selectize");

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
  jquery('#menu #menu-search').click(function() {modal.show('search')});
  jquery('#menu #menu-tableofcontents').click(function() {modal.show('tableofcontents')});
  jquery('#menu #menu-settings').click(function() {modal.show('settings')});
  jquery('#settings #update-library').click(library.update);
  jquery('#settings #update-library-force').click(function() {library.update('force')});
  jquery('#search a').click(modal.hide);
  jquery('.modal .close').click(modal.hide);
  jquery('#slide #previous').click(song.previousSlide);
  jquery('#slide #next').click(song.nextSlide);
}

var json =library.readJSON();

song.set({
  "library": json,
  "selector": '#slide img',
  "songsPath": library.songsPath
})
song.loadByHash();
search.set({
  "library": json,
  "selector": "#field",
});
search.build();
bindButtons();

window.onhashchange = song.loadByHash;

bindShortcuts();

var selectized = jquery('select').selectize({
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
