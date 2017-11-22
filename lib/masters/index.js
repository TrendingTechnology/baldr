/**
 * @file Gather informations about all available master slides
 * @module baldr-masters
 */

const fs = require('fs');
const path = require('path');

/**
 * Generate a link element and append this element to the head section
 * of the document object
 *
 * @param {object} document The HTML DOM Document Object.
 * @param {string} cssFile Path of the CSS file to include
 * @param {string} className A CSS class name to add to the link element.
 */
var addCSSFile;
exports.addCSSFile = addCSSFile = function(document, cssFile, className=false) {
  let link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  if (className) {
    link.classList.add(className);
  }
  link.href = cssFile;
  document.head.appendChild(link);
};

/**
 * Gather informations about all available master slides.
 */
class LoadMasters {

  constructor() {

    /**
     * Parent path of all master slide modules.
     * @type {string}
     */
    this.path = path.join(__dirname, '..', '..', 'masters');

    /**
     * Folder name of master slides
     * @type {array}
     */
    this.all = this.getAll();
    for (let master of this.all) {
      let masterPath = path.join(this.path, master);
      this[master] = require(
        path.join(masterPath, 'index.js')
      );
      this[master].path = masterPath;
      this[master].css = this.hasCSS_(masterPath);
    }
  }

  /**
   * Check if the CSS style file “styles.css” in the master slide
   * folder exists.
   *
   * @private
   */
  hasCSS_(masterPath) {
    if (fs.existsSync(path.join(masterPath, 'styles.css'))) {
      return true;
    }
    else {
      return false;
    }
  }

  getHooks(hookName, type='function') {
    return this.all.filter(
      master => typeof this[master][hookName] === type
    );
  }

  /**
   * Get the folder off all master slide modules.
   * @return {array} Folder name of master slides
   */
  getAll() {
    return fs.readdirSync(this.path, 'utf8')
    .filter(
      dir => fs.statSync(
        path.join(this.path, dir)
      ).isDirectory()
    );
  }
}

let masters;
exports.masters = masters = new LoadMasters();

let setMain = function(masterName, data, config, document) {
  let master = masters[masterName];
  let elements = {
    slide: document.getElementById('slide-content'),
    modal: document.getElementById('modal-content')
  };

  let dataset = document.body.dataset;
  dataset.master = masterName;
  if (master.hasOwnProperty('config')) {
    let config = master.config;
  }
  dataset.centerVertically = false;
  dataset.theme = 'default';
  if (master.hasOwnProperty('config')) {
    let config_ = master.config;
    if (config_.centerVertically) {
      dataset.centerVertically = config_.centerVertically;
    }
    if (config_.theme) {
      dataset.theme = config_.theme;
    }
  }

  if (master.hasOwnProperty('mainHTML')) {
    elements.slide.innerHTML = master.mainHTML(data, config, document);
  }
  else {
    elements.slide.innerHTML = '';
  }
  if (master.hasOwnProperty('modalHTML')) {
    elements.modal.innerHTML = master.modalHTML();
  }
  else {
    elements.modal.innerHTML = '';
  }
};

exports.setMain = setMain;
exports.LoadMasters = LoadMasters;
