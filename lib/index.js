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
const {bootstrapConfig, Library, SongMetaData} = require('./lib/without-dom.js');

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
class BaldrSongbookToc extends HTMLElement {
  constructor() {
    super();
    let topUl = document.createElement('ul');

    Object.keys(library.tree).forEach((abc, index) => {
      let abcLi = document.createElement('li');
      abcLi.setAttribute('class', 'abc');
      abcLi.innerHTML = abc;

      let abcUl = document.createElement('ul');

      Object.keys(library.tree[abc]).forEach((folder, index) => {
        let li = document.createElement('li');
        let a = document.createElement('a');
        a.setAttribute('href', '#' + folder);
        a.setAttribute('id', 'song_' + folder);
        a.innerHTML = library.tree[abc][folder].title;
        li.appendChild(a);
        abcUl.appendChild(li);
      });
      topUl.appendChild(abcLi);
      abcLi.appendChild(abcUl);
    });
    this.appendChild(topUl);
  }
}

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
  customElements.define('baldr-songbook-toc', BaldrSongbookToc);

  song.set({
    "library": library.list,
    "selector": '#slide img',
    "songsPath": config.path
  });

  bindButtons();

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
