const os = require('os');
const pth = require('path');
const config = require(pth.join(os.homedir(), '.html5-school-presentation.json'));

const fs = require('fs');

const jquery = require("jquery");
const mousetrap = require('mousetrap');
const selectize = require("selectize");

//var library = require('../modules/library-update/index.js');
const library = require('songbook-library-update');
const modal = require('./modal.js');
const search = require('./search.js');
const song = require('./song.js');

require('./menu.js');

/**
 * Map some keyboard shortcuts to the corresponding methods.
 */
function bindShortcuts() {
  mousetrap.bind('esc', function() {modal.toggle('search')});
  mousetrap.bind('alt', function() {modal.toggle('search')});
  mousetrap.bind('left', song.previousSlide);
  mousetrap.bind('right', song.nextSlide);
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

var json = library.readJSON();

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

modal.show('search');
