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
 * Each master slide class extends this class. It provides basic
 * functionality for the master slide classes. This class is a
 * interface for all child classes
 *
 * @interface
 */
var LoadMaster = class {

  /**
   *
   */
  constructor(masterName, data) {

    /**
     * @memberof MasterOfMasters HTML-Element for the slide content.
     * @type {object}
     */
    this.elemSlide = this.document.getElementById('slide-content');

    /**
     * The HTML-Element for the modal content.
     * @type {object}
     */
    this.elemModal = this.document.getElementById('modal-content');

    /**
     * Indicates whether the master slide is already set.
     * @type {boolean}
     */
    this.alreadySet = false;

    /**
     * Set this property to true to center the slide content vertically
     * @type {boolean}
     */
    this.centerVertically = false;

    /**
     * The default theme
     * @type {string}
     */
    this.theme = 'default';
  }

  /**
   *
   */
  set() {
    this.elemSlide.innerHTML = this.hookSetHTMLSlide();
    this.elemModal.innerHTML = this.hookSetHTMLModal();
    this.document.body.dataset.master = this.masterName;
    this.document.body.dataset.centerVertically = this.centerVertically;
    this.document.body.dataset.theme = this.theme;
    if (!this.alreadySet) {
      this.hookPostFirstSet();
    }
    this.hookPostSet();
    this.alreadySet = true;
  }

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

exports.LoadMaster = LoadMaster;
exports.LoadMasters = LoadMasters;
exports.masters = new LoadMasters();
