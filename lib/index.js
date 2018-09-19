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

const modal = require('./lib/modal.js');
const song = require('./lib/song.js');
const {Library, SongMetaData} = require('./lib/without-dom.js');

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
  let bindings = [
    {selector: "#menu #menu-search", function: () => {modal.show('search');}},
    {selector: "#menu #menu-tableofcontents", function: () => {modal.show('tableofcontents');}},
    {selector: ".modal .close", function: modal.hide},
    {selector: "#slide #previous", function: song.previousSlide},
    {selector: "#slide #next", function: song.nextSlide}
  ];
  for (let binding of bindings) {
    document
    .querySelector(binding.selector)
    .addEventListener('click', binding.function);
  }
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

/**
 * Build the drop down menu for selectize
 */
class BaldrSongbookSearch extends HTMLElement {

  constructor() {
    super();

    let select = document.createElement('select');
    select.setAttribute('id', 'select');
    select.setAttribute('placeholder', 'Suche nach einem Lied');

    let option = document.createElement('option');
    option.setAttribute('value', '');
    select.appendChild(option);

    for (let songID in library.list) {
      option = document.createElement('option');
      option.setAttribute('value', songID);
      option.innerHTML = library.list[songID].title;
      select.appendChild(option);
    }
    this.appendChild(select);
  }
}

const config = bootstrapConfig();

const library = new Library(path.join(config.path, 'songs.json'));

var main = function() {

  customElements.define('baldr-songbook-search', BaldrSongbookSearch);

  song.set({
    "library": library.list,
    "selector": '#slide img',
    "songsPath": config.path
  });

  bindButtons();

  tableOfContents(library.tree, document.getElementById('toc-field'));

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


if (config.path) {
  main();
}
