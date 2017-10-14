const os = require('os');
const path = require('path');
const fs = require('fs');

const jquery = require('jquery');
const mousetrap = require('mousetrap');
const selectize = require('selectize');

const modal = require('./modal.js');
const search = require('./search.js');
const song = require('./song.js');

var bootstrapConfig = function() {
  let configFile = path.join(os.homedir(), '.baldr.json');
  let config;

  if (fs.existsSync(configFile)) {
    config = require(configFile).songbook;
  }
  else {
    config = {};
  }

  if (process.env.BALDR_SBOOK_PATH) {
    config.path = process.env.BALDR_SBOOK_PATH;
  }
  return config;
};

var config = bootstrapConfig();

/**configFile
 * @return {array} Array of folder paths.
 */
var flattenTree = function(tree) {
  var newTree = {};
  Object.keys(tree).forEach((abc, index) => {
    Object.keys(tree[abc]).forEach((folder, index) => {
      newTree[folder] = tree[abc][folder];
    });
  });
  return newTree;
};

/**
 * Map some keyboard shortcuts to the corresponding methods.
 */
function bindShortcuts() {
  mousetrap.bind('esc', function() {modal.toggle('search');});
  mousetrap.bind('alt', function() {modal.toggle('search');});
  mousetrap.bind('left', song.previousSlide);
  mousetrap.bind('right', song.nextSlide);
}

/**
 * Map some buttons to the corresponding methods.
 */
function bindButtons() {
  jquery('#menu #menu-search').click(function() {modal.show('search');});
  jquery('#menu #menu-tableofcontents').click(function() {modal.show('tableofcontents');});
  jquery('#menu #menu-settings').click(function() {modal.show('settings');});
  jquery('#search a').click(modal.hide);
  jquery('.modal .close').click(modal.hide);
  jquery('#slide #previous').click(song.previousSlide);
  jquery('#slide #next').click(song.nextSlide);
}

var tree = JSON.parse(
  fs.readFileSync(
    path.join(config.path, 'songs.json'), 'utf8'
  )
);

json = flattenTree(tree);

song.set({
  "library": json,
  "selector": '#slide img',
  "songsPath": config.path
});
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
