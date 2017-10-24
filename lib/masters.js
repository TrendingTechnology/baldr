/**
 * @file Gather informations about all available master slides
 */

const fs = require('fs');
const path = require('path');

/**
 * Gather informations about all available master slides.
 *
 * @constructor
 */
var Masters = function() {

  /**
   * Folder name of master slides
   * @type {array}
   */
  this.all = this.getModules();
};

/**
 * Get the folder off all master slide modules.
 * @return {array} Folder name of master slides
 */
Masters.prototype.getModules = function() {
  let parentPath = path.join(__dirname, '..', 'masters');
  return fs.readdirSync(parentPath, 'utf8')
    .filter(dir => fs.statSync(path.join(parentPath, dir)).isDirectory());
};

exports.Masters = Masters;
