/**
 * @file Gather informations about all available master slides
 */

const fs = require('fs');
const path = require('path');

/**
 * Each master slide class extends this class. It provides basic
 * functionality for the master slide classes. This class is a
 * interface for all child classes
 */
var MasterOfMasters = class {

  constructor(document, data) {
    this.masterPath = __dirname;
    this.document = document;
    this.elemSlide = document.getElementById('slide');
    this.data = data;
  }

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

  render() {
    return 'No slide loaded.';
  }

  set() {
    this.setCSS();
    this.elemSlide.innerHTML = this.render(this.data);
  }
};

/**
 * An unifed interface for a master slide.
 *
 * This class builds an unifed interface to access the properties and
 * methods of a master slide.
 *
 * @constructor
 */
var Master = function(name) {

  /**
   * The name of the master slide.
   * @type {string}
   */
  this.name = name;

  /**
   * The path of the master slide folder.
   * @type {string}
   */
  this.path = path.join(__dirname, '..', 'masters', name);


  let masterObj = this.require('index.js');

  /**
   * The render() method returns HTML output.
   * @type {function}
   */
  this.render = this.checkMethods(masterObj, 'render');


  /**
   * The document object is exposed after the render() method.
   * @type {function}
   */
  this.postRender = this.checkMethods(masterObj, 'postRender');
  let pkg = this.require('package.json');

  /**
   * The name of the css file in the master slide folder.
   * @type {string}
   */
  this.css = false;
  if (pkg.css) {
    this.css = pkg.css;
  }

};

/**
 * Require a file in a master slide folder. The file must be located in
 * the root directory of the master slide.
 *
 * @param {string} file The file name
 */
Master.prototype.require = function(file) {
  return require(path.join(this.path, file));
};

/**
 * @param {object} masterObj The object of the required master slide.
 * @param {object} methodName The name of the method to check.
 */
Master.prototype.checkMethods = function(masterObj, methodName) {
  if (typeof masterObj[methodName] === 'function') {
    return masterObj[methodName];
  }
  else {
    return function(){};
  }
};

/**
 * Gather informations about all available master slides.
 *
 * @constructor
 */
var Masters = function() {

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
    this[name] = new Master(name);
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
