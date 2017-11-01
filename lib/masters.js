/**
 * @file Gather informations about all available master slides
 * @module lib/masters
 */

const fs = require('fs');
const path = require('path');

/**
 * Load the master slide class
 *
 * @param {string} masterName The name of the master slide
 * @param {object} document The HTML DOM Document Object.
 * @param {object} presentation The presentation object.
 * @param {object} propObj Additonal properties for the slides and master objects
 */
var instantiateMaster = function(masterName, document, presentation, propObj) {
  let masterPath = path.join(__dirname, '..', 'masters', masterName);

  let className = 'Master' +
    masterName.charAt(0).toUpperCase() +
    masterName.slice(1);

  let properties = {
    "masterPath": masterPath,
    "masterName": masterName,
    "document": document,
    "presentation": presentation
  };

  let Master = require(masterPath)[className];
  return new Master(Object.assign({}, properties, propObj));
};

/**
 * Each master slide class extends this class. It provides basic
 * functionality for the master slide classes. This class is a
 * interface for all child classes
 */
var MasterOfMasters = class {

  /**
   * @param {object} propObj
   * @param {string} propObj.masterName Name of the master slide.
   * @param {string} propObj.masterPath Path of the master slide folder.
   * @param {object} propObj.document Javascript document object (DOM) of the render.html
   * @param {object} propObj.presentation Javascript document object (DOM) of the render.html
   * @param {object} propObj.data The slide data
   */
  constructor(propObj) {

    for (let property in propObj) {
      this[property] = propObj[property];
    }

    /**
     * The HTML-Element for the slide content.
     * @type {object}
     */
    this.elemSlide = this.document.getElementById('slide');

    /**
     * The HTML-Element for the modal content.
     * @type {object}
     */
    this.elemModal = this.document.getElementById('modal-content');

  }

  /**
   * Check if the CSS style file “styles.css” in the master slide
   * folder exists.
   */
  hasCSS() {
    if (fs.existsSync(path.join(this.masterPath, 'styles.css'))) {
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * Add and remove master slide specific CSS styles
   */
  setCSS() {
    if (this.hasCSS()) {
      let head = this.document.getElementsByTagName('head')[0];
      let link = this.document.createElement('link');
      link.id = 'current-master';
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = path.join(this.masterPath, 'styles.css');
      head.appendChild(link);
    }
    else {
      let link = this.document.querySelector('#current-master');
      if (link) {
        link.remove();
      }
    }
  }

  /**
   *
   */
  render() {
    return 'No slide loaded.';
  }

  /**
   *
   */
  set() {
    this.setCSS();
    this.elemSlide.innerHTML = this.render(this.data);
  }
};

/**
 * Gather informations about all available master slides.
 * @param {object} document The HTML DOM Document Object.
 * @param {object} presentation The presentation object.
 * @constructor
 */
var Masters = function(document, presentation) {

  /**
   * Parent path of all master slide modules.
   * @type {string}
   */
   this.path = path.join(__dirname, '..', 'masters');

  /**
   * Folder name of master slides
   * @type {array}
   */
  this.all = this.getModules();

  for (let name of this.all) {
    this[name] = instantiateMaster(name, document, presentation);
  }
};

/**
 * Get the folder off all master slide modules.
 * @return {array} Folder name of master slides
 */
Masters.prototype.getModules = function() {
  return fs.readdirSync(this.path, 'utf8')
    .filter(
      dir => fs.statSync(
        path.join(this.path, dir)
      ).isDirectory()
    );
};

exports.Masters = Masters;
exports.MasterOfMasters = MasterOfMasters;
exports.instantiateMaster = instantiateMaster;
