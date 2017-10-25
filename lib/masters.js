/**
 * @file Gather informations about all available master slides
 */

const fs = require('fs');
const path = require('path');

/**
 * A master slide
 *
 * @constructor
 */
var Master = function(name) {
  this.name = name;
  this.path = path.join(__dirname, '..', 'masters', name);
  this.app = this.require('index.js');
  let pkg = this.require('package.json');
  if (pkg.css) {
    this.css = pkg.css;
  }
  else {
    this.css = false;
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
