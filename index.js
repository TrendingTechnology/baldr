/**
 * @file Render process, assemble all submodules, bootstrap
 * configuration and run render process
 */

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

/**
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
  mousetrap.bind('alt', function() {modal.toggle('tableofcontents');});
  mousetrap.bind('left', song.previousSlide);
  mousetrap.bind('right', song.nextSlide);
}

/**
 * Map some buttons to the corresponding methods.
 */
function bindButtons() {
  jquery('#menu #menu-search').click(function() {modal.show('search');});
  jquery('#menu #menu-tableofcontents').click(function() {modal.show('tableofcontents');});
  jquery('#search a').click(modal.hide);
  jquery('.modal .close').click(modal.hide);
  jquery('#slide #previous').click(song.previousSlide);
  jquery('#slide #next').click(song.nextSlide);
}

var showByHash = function() {
  if (location.hash === "#search") {
    modal.show('search');
  }
  else if (location.hash === "#tableofcontents") {
    modal.show('tableofcontents');
  } else if (location.hash) {
    song.loadByHash();
  } else {
    modal.show('search');
  }
};

/**
 * Generate a tree view for the table of contents page.
 */
var tableOfContents = function(tree, element) {
  var topUl = document.createElement('ul');

  Object.keys(tree).forEach((abc, index) => {
    var abcLi = document.createElement('li');
    abcLi.setAttribute('class', 'abc');
    abcLi.innerHTML = abc;

    var abcUl = document.createElement('ul');

    Object.keys(tree[abc]).forEach((folder, index) => {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.setAttribute('href', '#' + folder);
      a.setAttribute('id', 'song_' + folder);
      a.innerHTML = tree[abc][folder].title;
      li.appendChild(a);
      abcUl.appendChild(li);
    });
    topUl.appendChild(abcLi);
    abcLi.appendChild(abcUl);
  });
  element.appendChild(topUl);
};

var main = function() {
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

  search.set({
    "library": json,
    "selector": "#field",
  });
  search.build();
  bindButtons();

  tableOfContents(tree, document.getElementById('toc-field'));

  window.onhashchange = showByHash;

  bindShortcuts();

  var selectized = jquery('select').selectize({
    onItemAdd: function(value, data) {
      song.setCurrent(value);
      modal.hide();
    }
  });
  search.selectize = selectized[0].selectize;
  search.selectize.focus();

  showByHash();
};

var config = bootstrapConfig();

if (config.path) {
  main();
}
