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
   * Parent path of all master slide modules.
   * @type {string}
   */
   this.path = path.join(__dirname, '..', 'masters');

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
  return fs.readdirSync(this.path, 'utf8')
    .filter(
      dir => fs.statSync(
        path.join(this.path, dir)
      ).isDirectory()
    );
};

exports.Masters = Masters;
